import { existsSync, mkdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { auditScreenImplementation, auditScreenFile } from "./audit-screen-implementation.mjs";
import { createScreenPreviewPlan, writeScreenPreview } from "./generate-screen-preview.mjs";
import { generateScreenTsx, generatedSourceFingerprint } from "./generate-screen-tsx.mjs";
import { readRegistryBundle, resolveScreenRequest } from "./resolve-screen-request.mjs";
import { recordScreenReview, verifyScreenHandoff } from "./screen-handoff.mjs";
import { getScreenReferences } from "./screen-reference-context.mjs";
import { reviewScreenAssetSelection, SEMANTIC_ASSET_CATEGORIES } from "./screen-asset-selection.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const requestSchema = z.record(z.string(), z.unknown()).describe("screen-request.schema.json을 따르는 ScreenRequest 객체");
const sourcePathSchema = z.string().min(1).describe("component-library 기준 src/ 아래의 상대 TSX/JSX 경로");
const previewSourcePathSchema = sourcePathSchema.optional().describe("생략하면 src/generated-previews/<request-id>.tsx를 사용합니다.");
const semanticAssetElementSchema = z.object({
  id: z.string().regex(/^[a-z][A-Za-z0-9.-]*$/),
  label: z.string().min(1),
  category: z.enum(SEMANTIC_ASSET_CATEGORIES),
  capability: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  parentRefs: z.array(z.string().min(1)),
  basis: z.enum(["confirmed", "supported", "assumed", "unresolved"]),
  impact: z.enum(["presentation", "business-behavior"]),
  decision: z.enum(["selected", "deferred", "not-applicable", "propose-new"]),
  selectedComponentRef: z.string().min(1).optional(),
  candidateComponentRefs: z.array(z.string().min(1)).optional(),
  reason: z.string().min(1).optional(),
}).strict();
const semanticAssetDraftSchema = z.object({
  schemaVersion: z.literal(1),
  targetKind: z.enum(["page", "center-modal", "side-slide-panel", "confirm-dialog"]),
  notApplicableCategories: z.array(z.enum(SEMANTIC_ASSET_CATEGORIES)).optional(),
  elements: z.array(semanticAssetElementSchema),
}).strict();

function toolResult(summary, data) {
  return {
    content: [{ type: "text", text: `${summary}\n${JSON.stringify(data, null, 2)}` }],
    structuredContent: data,
  };
}

function toolError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    isError: true,
    content: [{ type: "text", text: message }],
  };
}

function safeTool(handler) {
  return async (input) => {
    try {
      return await handler(input);
    } catch (error) {
      return toolError(error);
    }
  };
}

function resolveRepositorySourcePath(input) {
  if (isAbsolute(input)) throw new Error("절대경로는 허용하지 않습니다. component-library 기준 src/ 상대경로를 사용하세요.");
  const absolutePath = resolve(projectRoot, input);
  const relativePath = relative(projectRoot, absolutePath);
  if (relativePath.startsWith(`..${sep}`) || relativePath === ".." || isAbsolute(relativePath)) {
    throw new Error("component-library 밖의 경로에는 접근할 수 없습니다.");
  }
  const normalized = relativePath.split(sep).join("/");
  if (!normalized.startsWith("src/")) throw new Error("화면 소스는 component-library/src/ 아래에만 둘 수 있습니다.");
  if (!/\.(?:tsx|jsx)$/.test(normalized)) throw new Error("화면 소스 경로는 .tsx 또는 .jsx로 끝나야 합니다.");
  const realProjectRoot = realpathSync(projectRoot);
  let existingAncestor = existsSync(absolutePath) ? absolutePath : dirname(absolutePath);
  while (!existsSync(existingAncestor) && existingAncestor !== projectRoot) existingAncestor = dirname(existingAncestor);
  const realAncestor = realpathSync(existingAncestor);
  const realRelative = relative(realProjectRoot, realAncestor);
  if (realRelative.startsWith(`..${sep}`) || realRelative === ".." || isAbsolute(realRelative)) {
    throw new Error("심볼릭 링크를 통한 component-library 외부 경로 접근은 허용하지 않습니다.");
  }
  return { absolutePath, relativePath: normalized };
}

function compactEntry(entry) {
  return {
    id: entry.id,
    name: entry.name,
    ...(entry.kind ? { kind: entry.kind } : {}),
    ...(entry.category ? { category: entry.category } : {}),
    ...(entry.status ? { status: entry.status } : {}),
    ...(entry.placement ? { placement: entry.placement } : {}),
    ...(entry.source ? { source: entry.source } : {}),
  };
}

function filterEntries(entries, query, limit) {
  if (!query) return entries.slice(0, limit).map(compactEntry);
  const normalizedQuery = query.toLocaleLowerCase("ko-KR");
  return entries
    .filter((entry) => `${entry.id} ${entry.name ?? ""} ${entry.kind ?? ""} ${entry.category ?? ""}`.toLocaleLowerCase("ko-KR").includes(normalizedQuery))
    .slice(0, limit)
    .map(compactEntry);
}

function filterDetailedEntries(entries, query, limit) {
  if (!query) return entries.slice(0, limit);
  const normalizedQuery = query.toLocaleLowerCase("ko-KR");
  return entries
    .filter((entry) => JSON.stringify(entry).toLocaleLowerCase("ko-KR").includes(normalizedQuery))
    .slice(0, limit);
}

function mobileEntries(registry) {
  const assets = registry.mobileAssets;
  return [
    ...assets.foundations.map((entry) => ({ ...entry, kind: "mobile-foundation", status: assets.status })),
    ...assets.components.map((entry) => ({ ...entry, kind: "mobile-component", status: assets.status })),
    ...assets.patterns.map((entry) => ({ ...entry, kind: "mobile-pattern", status: assets.status })),
    ...assets.screenTypes.main.types.map((entry, index) => ({ id: `mobile.screen.main.${index + 1}`, name: entry.name, kind: "mobile-screen-type", status: assets.status })),
    ...assets.screenTypes.slidePopup.types.map((name, index) => ({ id: `mobile.screen.popup.${index + 1}`, name, kind: "mobile-popup-type", status: assets.status })),
  ];
}

function componentContractEntries(registry) {
  return registry.componentUsageContracts.map((entry) => ({
    ...entry,
    id: entry.componentId,
    name: entry.componentId,
    kind: "component-usage-contract",
  }));
}

function patternContractEntries(registry) {
  return registry.patternContracts.map((entry) => ({
    ...entry,
    id: entry.patternId,
    name: entry.patternId,
    kind: "pattern-usage-contract",
  }));
}

function screenSpecEntries(registry) {
  return registry.screenSpecs.map((entry) => ({
    ...entry,
    id: entry.screenId,
    name: entry.screenId,
    kind: "ordered-screen-spec",
  }));
}

export function createMesUiMcpServer() {
  const server = new McpServer({ name: "mes-ui-generator", version: "0.1.0" }, { capabilities: { tools: {} } });

  server.registerTool(
    "mes_list_design_system",
    {
      title: "MES 디자인 시스템 조회",
      description: "화면 설계 전에 등록된 MES 컴포넌트, 패턴, 사용 계약, 순서형 화면 명세, 결정형 생성 템플릿을 조회합니다.",
      inputSchema: z.object({
        query: z.string().trim().optional().describe("ID·이름·종류 검색어"),
        limit: z.number().int().min(1).max(100).default(30),
      }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    safeTool(async ({ query, limit }) => {
      const registry = readRegistryBundle();
      const mobile = mobileEntries(registry);
      const componentContracts = componentContractEntries(registry);
      const patternContracts = patternContractEntries(registry);
      const screenSpecs = screenSpecEntries(registry);
      const result = {
        counts: {
          components: registry.components.length,
          patterns: registry.patterns.length,
          screens: registry.screens.length,
          componentUsageContracts: componentContracts.length,
          patternContracts: patternContracts.length,
          screenSpecs: screenSpecs.length,
          generationTemplates: registry.generationTemplates.length,
          mobileAssets: mobile.length,
          webGenerationPageArchetypes: registry.webGenerationContext.pageArchetypes.length,
          webGenerationOverlayGrammars: registry.webGenerationContext.overlayGrammars.length,
          webGenerationSectionRecipes: registry.webGenerationContext.sectionRecipes.length,
        },
        components: filterEntries(registry.components, query, limit),
        patterns: filterEntries(registry.patterns, query, limit),
        screens: filterEntries(registry.screens, query, limit),
        componentUsageContracts: filterDetailedEntries(componentContracts, query, limit),
        patternContracts: filterDetailedEntries(patternContracts, query, limit),
        screenSpecs: filterDetailedEntries(screenSpecs, query, limit),
        generationTemplates: filterEntries(registry.generationTemplates, query, limit),
        mobile: filterEntries(mobile, query, limit),
      };
      return toolResult("MES 디자인 시스템 조회 완료", result);
    }),
  );

  server.registerTool(
    "mes_get_web_generation_context",
    {
      title: "MES 신규 UI 생성 맥락 조회",
      description: "신규 UI의 업무 정보·정보 관계와 페이지·팝업·섹션 사용 사례를 참고용으로 조회합니다. 배치·필수값을 강제하지 않으며 Figma 대조와 미검증 수치는 반환하지 않습니다.",
      inputSchema: z.object({
        category: z.enum(["all", "pages", "overlays", "sections", "behaviors", "references"]).default("all"),
        query: z.string().trim().optional().describe("신규 화면의 업무명·화면 성격·가까운 메뉴명"),
        targetKind: z.enum(["page", "center-modal", "side-slide-panel", "confirm-dialog"]).optional().describe("참고 사례 탐색 범위. 화면 유형을 확정하는 명령이 아닙니다."),
        taskIds: z.array(z.string().min(1)).max(12).optional().describe("알고 있는 업무 참고 ID. 미등록 업무도 생성할 수 있습니다."),
        usageIds: z.array(z.string().min(1)).max(12).optional().describe("알고 있는 사용 맥락 참고 ID. 다른 형식의 사례도 참고할 수 있습니다."),
        limit: z.number().int().min(1).max(100).default(50),
      }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    safeTool(async ({ category, query, limit, targetKind, taskIds, usageIds }) => {
      const registry = readRegistryBundle();
      const inventory = registry.webUiUsageInventory;
      const context = registry.webGenerationContext;
      const normalized = query?.toLocaleLowerCase("ko-KR");
      const matches = (entry) => !normalized || JSON.stringify(entry).toLocaleLowerCase("ko-KR").includes(normalized);
      const pages = inventory.pages.filter(matches);
      const pageIds = new Set(pages.map((page) => page.id));
      const flows = inventory.entryFlows.filter((flow) => pageIds.has(flow.pageId) || matches(flow));
      const flowIds = new Set(flows.map((flow) => flow.id));
      const archetypeRefs = new Set(pages.map((page) => page.archetypeRef));
      const select = (entries, evidence = () => false) => entries.filter((entry) => matches(entry) || evidence(entry)).slice(0, limit);
      return toolResult("MES 신규 UI 생성 맥락 조회 완료", {
        status: context.status,
        purpose: context.purpose,
        policy: context.policy,
        decisionOrder: context.decisionOrder,
        referenceContext: getScreenReferences({ query, targetKind, taskIds, usageIds, limit: Math.min(limit, 6) }),
        pageArchetypes: category === "all" || category === "pages" ? select(context.pageArchetypes, (entry) => archetypeRefs.has(entry.observedArchetypeRef)) : [],
        overlayGrammars: category === "all" || category === "overlays" ? select(context.overlayGrammars, (entry) => entry.evidenceFlowIds.some((id) => flowIds.has(id))) : [],
        sectionRecipes: category === "all" || category === "sections" ? select(context.sectionRecipes, (entry) => entry.evidenceFlowIds.some((id) => flowIds.has(id))) : [],
        behaviorRules: category === "all" || category === "behaviors" ? select(context.behaviorRules) : [],
        nearestObservedExamples: { pages: pages.slice(0, limit), entryFlows: flows.slice(0, limit) },
        coverage: context.coverage,
      });
    }),
  );

  server.registerTool(
    "mes_get_reproduction_audit_context",
    {
      title: "MES 기존 화면 재현·감사 컨텍스트",
      description: "특정 기존 화면을 재현하거나 오류를 감사할 때만 실제 웹 관찰값, Figma 원본 후보, 불일치와 검증 상태를 조회합니다. 신규 UI 생성에는 사용하지 않습니다.",
      inputSchema: z.object({
        category: z.enum(["all", "pages", "flows", "connections", "discrepancies", "figma-reconciliation"]).default("all"),
        query: z.string().trim().optional().describe("기존 메뉴명·화면 ID·팝업 제목"),
        limit: z.number().int().min(1).max(100).default(50),
      }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    safeTool(async ({ category, query, limit }) => {
      const registry = readRegistryBundle();
      const inventory = registry.webUiUsageInventory;
      const reconciliation = registry.webFigmaReconciliation;
      const select = (entries) => filterDetailedEntries(entries, query, limit);
      return toolResult("MES 기존 화면 재현·감사 컨텍스트 조회 완료", {
        mode: "reproduction-audit-only",
        status: inventory.status,
        auditedAt: inventory.auditedAt,
        authority: inventory.usagePolicy.authority,
        usageRules: inventory.usagePolicy.rules,
        coverage: inventory.coverage,
        archetypes: category === "all" ? select(inventory.archetypes) : [],
        pages: category === "all" || category === "pages" ? select(inventory.pages) : [],
        entryFlows: category === "all" || category === "flows" ? select(inventory.entryFlows) : [],
        connectedObservations: category === "all" || category === "connections" ? select(inventory.connectedObservations) : [],
        discrepancies: category === "all" || category === "discrepancies" ? select(inventory.discrepancies) : [],
        figmaReconciliation: category === "all" || category === "figma-reconciliation" ? {
          status: reconciliation.status,
          auditedAt: reconciliation.auditedAt,
          authorityRules: reconciliation.authorities.rules,
          classifications: reconciliation.classifications,
          coverage: reconciliation.coverage,
          pages: select(reconciliation.pages),
          structuralFindings: reconciliation.structuralFindings,
          remaining: reconciliation.remaining,
        } : null,
      });
    }),
  );

  server.registerTool(
    "mes_get_mobile_context",
    {
      title: "MES 모바일 생성 컨텍스트",
      description: "모바일 화면 생성 전에 전용 파운데이션, 컴포넌트, 조합 패턴, 화면 유형, 원본 예외를 조회합니다. 웹 자산의 단순 축소를 방지합니다.",
      inputSchema: z.object({
        category: z.enum(["all", "foundations", "components", "patterns", "screens"]).default("all"),
        query: z.string().trim().optional(),
      }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    safeTool(async ({ category, query }) => {
      const assets = readRegistryBundle().mobileAssets;
      const normalized = query?.toLocaleLowerCase("ko-KR");
      const matches = (entry) => !normalized || JSON.stringify(entry).toLocaleLowerCase("ko-KR").includes(normalized);
      const selected = {
        ...(category === "all" || category === "foundations" ? { foundations: assets.foundations.filter(matches) } : {}),
        ...(category === "all" || category === "components" ? { components: assets.components.filter(matches) } : {}),
        ...(category === "all" || category === "patterns" ? { patterns: assets.patterns.filter(matches) } : {}),
        ...(category === "all" || category === "screens" ? { screenTypes: assets.screenTypes } : {}),
      };
      return toolResult("MES 모바일 생성 컨텍스트 조회 완료", {
        status: assets.status,
        evidence: assets.evidence,
        ...selected,
        sourceFindings: assets.sourceFindings,
      });
    }),
  );

  server.registerTool(
    "mes_match_screen_assets",
    {
      title: "MES 화면 의미 자산 매칭",
      description: "ScreenRequest 확정 전에 화면의 의미 요소를 MES component capability와 parent 맥락에 대조합니다. 후보와 불확실성을 반환하며 자동 선택하거나 미검토 범주만으로 생성을 차단하지 않습니다.",
      inputSchema: semanticAssetDraftSchema,
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    safeTool(async (draft) => {
      const result = reviewScreenAssetSelection(draft, readRegistryBundle());
      return {
        ...toolResult(`의미 자산 매칭 ${result.status} · 자동 선택 없음`, result),
        isError: result.blockerCount > 0,
      };
    }),
  );

  server.registerTool(
    "mes_resolve_screen",
    {
      title: "MES 화면 계약 해석",
      description: "자연어를 바로 JSX로 만들지 않고 ScreenRequest를 등록 자산과 대조해 결정형 화면 계약으로 해석합니다.",
      inputSchema: z.object({ request: requestSchema }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    safeTool(async ({ request }) => {
      const contract = resolveScreenRequest(request);
      return toolResult(
        `화면 계약 ${contract.quality.status} · blockers ${contract.quality.blockerCount} · warnings ${contract.quality.warningCount}`,
        contract,
      );
    }),
  );

  server.registerTool(
    "mes_generate_screen",
    {
      title: "MES 화면 코드 생성",
      description: "등록 자산 TSX의 최종 파일을 검사하고 내부 QA용 미리보기를 만듭니다. 사용자 전달 승인 아님: 실제 렌더링·동작 확인 후 screen:handoff가 필요하며, 원본 재현은 원본도 대조합니다. 기존 파일은 덮어쓰지 않습니다.",
      inputSchema: z.object({
        request: requestSchema,
        outputPath: previewSourcePathSchema,
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    safeTool(async ({ request, outputPath }) => {
      const contract = resolveScreenRequest(request);
      if (contract.quality.blockerCount > 0) {
        throw new Error(`blocker가 있는 요청은 생성할 수 없습니다.\n${JSON.stringify(contract.quality.issues, null, 2)}`);
      }
      const target = resolveRepositorySourcePath(outputPath ?? `src/generated-previews/${contract.request.requestId}.tsx`);
      if (!target.relativePath.startsWith("src/generated-previews/")) {
        throw new Error("임시 생성 화면은 src/generated-previews/ 아래에만 만들 수 있습니다.");
      }
      if (existsSync(target.absolutePath)) throw new Error(`기존 파일을 덮어쓰지 않습니다: ${target.relativePath}`);
      const source = generateScreenTsx(contract);
      const audit = auditScreenImplementation(contract, source);
      if (audit.blockerCount > 0) throw new Error(`생성 결과 감사에서 blocker가 발견됐습니다.\n${JSON.stringify(audit, null, 2)}`);

      const preview = createScreenPreviewPlan(contract, target.relativePath, { projectRoot });
      mkdirSync(dirname(target.absolutePath), { recursive: true });
      writeFileSync(target.absolutePath, source, { encoding: "utf8", flag: "wx" });
      let previewResult;
      try {
        previewResult = writeScreenPreview(preview);
      } catch (error) {
        rmSync(target.absolutePath);
        throw error;
      }
      const result = {
        outputPath: target.relativePath,
        previewPath: preview.relativePath,
        previewRoute: preview.route,
        qaPreviewUrl: preview.url,
        verification: preview.verification,
        handoffReady: false,
        nextStep: "verification.scope에 해당하는 렌더링·동작 확인 후 mes_handoff_screen의 review로 기록. surface는 팝업 자체, connected-flow는 부모 연동까지 확인. 원본 재현은 sourceCompared도 필요. 단독 확인을 연동 완료로 표현하지 마세요.",
        visualReviewPath: previewResult.paths.visual,
        previewCreated: previewResult.created,
        contractStatus: contract.quality.status,
        contractFingerprint: contract.fingerprint,
        sourceFingerprint: generatedSourceFingerprint(source),
        lineCount: source.split("\n").length - 1,
        audit: previewResult.audit,
      };
      return toolResult("MES 코드 정적 검사 통과 · 내부 QA만 가능 · 사용자 전달 미승인", result);
    }),
  );

  server.registerTool(
    "mes_audit_screen",
    {
      title: "MES 화면 구현 감사",
      description: "기존 TSX/JSX가 ScreenRequest 계약, 등록 컴포넌트, 셸, 상호작용 금지 규칙을 지키는지 감사합니다.",
      inputSchema: z.object({
        request: requestSchema,
        sourcePath: sourcePathSchema,
      }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    safeTool(async ({ request, sourcePath }) => {
      const target = resolveRepositorySourcePath(sourcePath);
      if (!existsSync(target.absolutePath)) throw new Error(`화면 소스를 찾을 수 없습니다: ${target.relativePath}`);
      const contract = resolveScreenRequest(request);
      const audit = auditScreenFile(contract, target.absolutePath);
      return { ...toolResult(`MES 정적 감사 ${audit.status} · 사용자 전달 승인은 별도`, {
        sourcePath: target.relativePath,
        contractFingerprint: contract.fingerprint,
        ...audit,
      }), isError: audit.blockerCount > 0 };
    }),
  );

  server.registerTool(
    "mes_handoff_screen",
    {
      title: "MES 미리보기 전달 검사",
      description: "요청 verificationScope의 실제 구현·렌더링·동작 확인 후 URL과 확인 범위를 반환합니다. surface는 팝업 자체(배경 미연결 허용), connected-flow는 부모 연동 포함(hostPage 필요). review는 해당 범위를 관찰한 뒤에만 전달. 원본 재현은 sourceCompared 필요. 생략하면 동일 코드/범위 기록 재사용.",
      inputSchema: z.object({ request: requestSchema, sourcePath: sourcePathSchema, review: z.object({
        reviewer: z.string().min(1), rendered: z.boolean(), interactions: z.boolean(), sourceCompared: z.boolean().optional(),
        viewport: z.object({ width: z.number().positive(), height: z.number().positive() }).optional(), note: z.string().optional(),
        warningResolutions: z.array(z.object({ code: z.string(), reason: z.string().min(1) })).optional(), unchecked: z.array(z.string()).optional(),
      }).strict().optional() }),
      annotations: { readOnlyHint: false, idempotentHint: false, openWorldHint: false },
    },
    safeTool(async ({ request, sourcePath, review }) => {
      const target = resolveRepositorySourcePath(sourcePath);
      const contract = resolveScreenRequest(request);
      const plan = createScreenPreviewPlan(contract, target.absolutePath, { projectRoot });
      if (review) recordScreenReview(plan, review);
      const result = verifyScreenHandoff(plan);
      return toolResult("현재 구현과 제출된 시각 대조 기록의 전달 검사 통과", {
        status: result.status, verification: result.verification, previewUrl: plan.url, fingerprint: result.fingerprint,
        visualEvidenceFingerprint: result.visualEvidenceFingerprint, limitation: result.limitation,
      });
    }),
  );

  return server;
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const server = createMesUiMcpServer();
  const transport = new StdioServerTransport();
  transport.onerror = (error) => console.error(`[mes-ui-mcp] ${error.message}`);
  await server.connect(transport);
}
