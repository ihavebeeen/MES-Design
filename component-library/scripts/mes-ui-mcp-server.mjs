import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { auditScreenImplementation } from "./audit-screen-implementation.mjs";
import { createScreenPreviewPlan, writeScreenPreview } from "./generate-screen-preview.mjs";
import { generateScreenTsx, generatedSourceFingerprint } from "./generate-screen-tsx.mjs";
import { readRegistryBundle, resolveScreenRequest } from "./resolve-screen-request.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const requestSchema = z.record(z.string(), z.unknown()).describe("screen-request.schema.json을 따르는 ScreenRequest 객체");
const sourcePathSchema = z.string().min(1).describe("component-library 기준 src/ 아래의 상대 TSX/JSX 경로");
const previewSourcePathSchema = sourcePathSchema.optional().describe("생략하면 src/generated-previews/<request-id>.tsx를 사용합니다.");

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
          observedWebPages: registry.webUiUsageInventory.pages.length,
          observedWebEntryFlows: registry.webUiUsageInventory.entryFlows.length,
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
    "mes_get_web_usage_context",
    {
      title: "MES 실제 웹 사용 맥락 조회",
      description: "실제 개발 MES에서 관찰한 메뉴 화면, 주요 팝업 진입 흐름, 연결 결과와 불일치를 조회합니다. 이 자료는 사용 위치 근거이며 Figma·승인 규칙보다 우선하는 표준값이 아닙니다.",
      inputSchema: z.object({
        category: z.enum(["all", "pages", "flows", "connections", "discrepancies"]).default("all"),
        query: z.string().trim().optional().describe("메뉴명·화면 ID·버튼명·팝업 제목 검색어"),
        limit: z.number().int().min(1).max(100).default(50),
      }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    safeTool(async ({ category, query, limit }) => {
      const inventory = readRegistryBundle().webUiUsageInventory;
      const select = (entries) => filterDetailedEntries(entries, query, limit);
      return toolResult("MES 실제 웹 사용 맥락 조회 완료", {
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
      description: "ScreenRequest를 해석하고 등록 컴포넌트 기반 TSX와 localhost 미리보기 페이지를 생성한 뒤 즉시 감사합니다. 기존 파일은 덮어쓰지 않습니다.",
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
        previewUrl: preview.url,
        previewCreated: previewResult.created,
        contractStatus: contract.quality.status,
        contractFingerprint: contract.fingerprint,
        sourceFingerprint: generatedSourceFingerprint(source),
        lineCount: source.split("\n").length - 1,
        audit,
      };
      return toolResult("MES 화면 생성 및 감사 완료", result);
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
      const source = readFileSync(target.absolutePath, "utf8");
      const audit = auditScreenImplementation(contract, source);
      return toolResult(`MES 화면 감사 ${audit.status} · blockers ${audit.blockerCount} · warnings ${audit.warningCount}`, {
        sourcePath: target.relativePath,
        contractFingerprint: contract.fingerprint,
        ...audit,
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
