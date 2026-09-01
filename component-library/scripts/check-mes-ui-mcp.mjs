import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { reviewPaths } from "./screen-handoff.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const repositoryRoot = resolve(projectRoot, "..");
const serverPath = join(scriptDirectory, "mes-ui-mcp-server.mjs");
const fixturePath = join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-side-slide.json");
const outputRelativePath = "src/generated-previews/deterministic-receiving-fixture.tsx";
const outputPath = join(projectRoot, ...outputRelativePath.split("/"));
const previewRelativePath = "src/app/preview/deterministic-receiving-fixture/page.tsx";
const previewPath = join(projectRoot, ...previewRelativePath.split("/"));
const previewDirectory = dirname(previewPath);
const expectedTools = [
  "mes_audit_screen",
  "mes_generate_screen",
  "mes_get_mobile_context",
  "mes_get_reproduction_audit_context",
  "mes_get_web_generation_context",
  "mes_handoff_screen",
  "mes_list_design_system",
  "mes_match_screen_assets",
  "mes_resolve_screen",
];
const expectedSourceFingerprint = "cbf73874ac6cf26241cda1a23f0300796e79342552f5b4843162548e33180fb3";
const reviewDirectory = reviewPaths({ request: { requestId: "deterministic-receiving-fixture" } }).directory;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function structured(result) {
  assert(result && typeof result.structuredContent === "object", "MCP 도구가 structuredContent를 반환하지 않았습니다.");
  return result.structuredContent;
}

if (existsSync(outputPath)) throw new Error(`검증용 출력 파일이 이미 존재합니다: ${outputRelativePath}`);
if (existsSync(previewPath)) throw new Error(`검증용 미리보기 파일이 이미 존재합니다: ${previewRelativePath}`);
if (existsSync(reviewDirectory)) throw new Error(`검증용 review 폴더가 이미 존재합니다: ${reviewDirectory}`);

const claudeConfig = JSON.parse(readFileSync(join(repositoryRoot, ".mcp.json"), "utf8"));
assert(claudeConfig.mcpServers?.["mes-ui"]?.command === "node", "Claude Code의 mes-ui MCP 설정을 찾을 수 없습니다.");
assert(claudeConfig.mcpServers["mes-ui"].args.some((value) => value.includes("mes-ui-mcp-server.mjs")), "Claude Code MCP 실행 경로가 잘못되었습니다.");
const codexConfig = readFileSync(join(repositoryRoot, ".codex", "config.toml"), "utf8");
assert(/\[mcp_servers\.mes-ui\]/.test(codexConfig), "Codex의 mes-ui MCP 설정을 찾을 수 없습니다.");
assert(/component-library\/scripts\/mes-ui-mcp-server\.mjs/.test(codexConfig), "Codex MCP 실행 경로가 잘못되었습니다.");

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverPath],
  cwd: projectRoot,
  stderr: "pipe",
});
const client = new Client({ name: "mes-ui-mcp-smoke-test", version: "0.1.0" });
let surfaceArtifacts = [];

try {
  await client.connect(transport);
  const listed = await client.listTools();
  const toolNames = listed.tools.map((tool) => tool.name).sort();
  assert(JSON.stringify(toolNames) === JSON.stringify(expectedTools), `MCP 도구 목록이 다릅니다: ${toolNames.join(", ")}`);

  const request = JSON.parse(readFileSync(fixturePath, "utf8"));
  const catalog = structured(await client.callTool({ name: "mes_list_design_system", arguments: { query: "side-slide", limit: 10 } }));
  const expectedTemplates = JSON.parse(readFileSync(join(projectRoot, "src/design-system/registry/generation-templates.json"), "utf8")).templates;
  const expectedComponentContracts = JSON.parse(readFileSync(join(projectRoot, "src/design-system/registry/component-usage-contracts.json"), "utf8")).contracts;
  assert(catalog.counts.generationTemplates === expectedTemplates.length, "MCP 생성 템플릿 개수가 등록 원장과 다릅니다.");
  const expectedSlideIds = expectedTemplates.filter(entry => entry.id.includes("side-slide")).map(entry => entry.id).sort();
  assert(JSON.stringify(catalog.generationTemplates.map(entry => entry.id).sort()) === JSON.stringify(expectedSlideIds), "MCP 조회에서 슬라이드 조합 생성기가 누락됐습니다.");
  const slideRequests = JSON.parse(readFileSync(join(projectRoot, "src/design-system/registry/slide-composition-examples.json"), "utf8")).requests;
  for (const slideRequest of slideRequests) {
    const resolved = structured(await client.callTool({ name: "mes_resolve_screen", arguments: { request: slideRequest } }));
    assert(resolved.quality.blockerCount === 0, "MCP가 새 본문 조합을 해석하지 못했습니다: " + slideRequest.requestId);
    assert(resolved.implementation.generationTemplate.id === slideRequest.generation.templateId, "MCP에서 다른 생성기가 선택됐습니다.");
  }
  assert(catalog.counts.componentUsageContracts === expectedComponentContracts.length, "컴포넌트 사용 계약 개수가 등록 원장과 다릅니다.");
  assert(catalog.counts.patternContracts === 11, "패턴 계약 개수가 예상과 다릅니다.");
  assert(catalog.counts.screenSpecs === 3, "순서형 ScreenSpec 개수가 예상과 다릅니다.");
  assert(catalog.counts.webGenerationPageArchetypes === 4, "신규 생성용 페이지 문법 수가 예상과 다릅니다.");
  assert(catalog.counts.webGenerationOverlayGrammars === 4, "신규 생성용 팝업 문법 수가 예상과 다릅니다.");
  assert(catalog.counts.webGenerationSectionRecipes === 4, "신규 생성용 섹션 문법 수가 예상과 다릅니다.");
  assert(catalog.componentUsageContracts.some((entry) => entry.componentId === "side-slide-panel" && entry.useWhen.length > 0), "MCP 목록이 컴포넌트 사용 계약 상세를 반환하지 않았습니다.");
  const listFooterCatalog = structured(await client.callTool({ name: "mes_list_design_system", arguments: { query: "main-list-footer-actions", limit: 10 } }));
  assert(listFooterCatalog.componentUsageContracts.some((entry) => entry.componentId === "main-list-footer-actions" && entry.useWhen.length > 0), "MCP 목록이 메인 리스트 하단 액션 계약을 반환하지 않았습니다.");
  const assetMatch = structured(await client.callTool({ name: "mes_match_screen_assets", arguments: {
    schemaVersion: 1,
    targetKind: "page",
    notApplicableCategories: ["overlay-behavior"],
    elements: [
      { id: "riskStatus", label: "위험상태", category: "status-feedback", capability: "status-display", parentRefs: ["section.search-table-composition"], basis: "confirmed", impact: "presentation", decision: "deferred" },
      { id: "footerActions", label: "메인 리스트 하단 액션", category: "actions", capability: "main-list-actions", parentRefs: ["screen.entity-list"], basis: "supported", impact: "business-behavior", decision: "selected", selectedComponentRef: "main-list-footer-actions" },
    ],
  } }));
  assert(assetMatch.policy.automaticSelection === false, "MCP 의미 자산 매칭이 후보를 자동 선택하면 안 됩니다.");
  assert(assetMatch.elements.find((entry) => entry.id === "riskStatus")?.recommendation?.componentRef === "badge", "상태 표시의 Badge 후보를 찾지 못했습니다.");
  assert(assetMatch.elements.find((entry) => entry.id === "footerActions")?.selectedMatch === "exact", "메인 리스트 하단 액션의 parent 맥락 매칭이 잘못되었습니다.");
  assert(catalog.patternContracts.some((entry) => entry.patternId === "shell.side-slide-panel" && entry.slots.length > 0), "MCP 목록이 패턴 슬롯 계약 상세를 반환하지 않았습니다.");
  const pageQueryCatalog = structured(await client.callTool({ name: "mes_list_design_system", arguments: { query: "section.page-query-table", limit: 10 } }));
  const pageQueryContract = pageQueryCatalog.patternContracts.find((entry) => entry.patternId === "section.page-query-table");
  assert(pageQueryContract?.forbiddenImplementationMarkers?.includes("Pagination"), "MCP 목록이 선택 패턴의 금지 대체 계약을 반환하지 않았습니다.");
  assert(pageQueryContract?.entryBehaviorContracts?.["row-double-click"]?.requiredComponentProps?.includes("Table.onRowDoubleClick"), "MCP 목록이 선택 패턴의 진입 동작 계약을 반환하지 않았습니다.");
  assert(catalog.counts.mobileAssets > 0, "모바일 자산이 MCP 목록에 포함되지 않았습니다.");
  const mobile = structured(await client.callTool({ name: "mes_get_mobile_context", arguments: { category: "screens" } }));
  assert(mobile.screenTypes.main.count === 12, "모바일 메인 화면 유형 수가 예상과 다릅니다.");
  assert(mobile.screenTypes.slidePopup.count === 13, "모바일 슬라이드 팝업 유형 수가 예상과 다릅니다.");
  const webGeneration = structured(await client.callTool({ name: "mes_get_web_generation_context", arguments: { query: "생산실적" } }));
  assert(webGeneration.policy.authority === "observed-generation-guidance", "신규 UI 생성 문법의 권한이 잘못 노출됐습니다.");
  assert(webGeneration.nearestObservedExamples.pages.some((entry) => entry.id === "web.production-result"), "생산실적과 가까운 실제 웹 예시를 찾지 못했습니다.");
  assert(webGeneration.overlayGrammars.some((entry) => entry.id === "generation.overlay.select-then-register"), "선택 후 등록 팝업 문법을 찾지 못했습니다.");
  assert(!("figmaReconciliation" in webGeneration), "신규 UI 생성 컨텍스트에 Figma 감사 정보가 섞였습니다.");
  const references = structured(await client.callTool({ name: "mes_get_web_generation_context", arguments: { category: "references", taskIds: ["receiving.register"], usageIds: ["usage.entry-list"], targetKind: "page" } }));
  assert(references.referenceContext.enforcement === "none", "업무/사용 맥락은 참고 전용이어야 합니다.");
  assert(references.referenceContext.business[0]?.task.id === "receiving.register", "업무 참고 연결이 누락됐습니다.");
  assert(references.referenceContext.usage[0]?.id === "usage.entry-list", "페이지에서도 입력/목록 맥락을 참고할 수 있어야 합니다.");
  const unknownReferences = await client.callTool({ name: "mes_get_web_generation_context", arguments: { category: "references", taskIds: ["new-unregistered-task"] } });
  assert(!unknownReferences.isError && structured(unknownReferences).referenceContext.business.length === 0, "미등록 업무를 차단하거나 임의 대체하면 안 됩니다.");
  const reproductionAudit = structured(await client.callTool({ name: "mes_get_reproduction_audit_context", arguments: { query: "생산실적" } }));
  assert(reproductionAudit.mode === "reproduction-audit-only", "재현·감사 전용 모드 표시가 없습니다.");
  assert(reproductionAudit.pages.some((entry) => entry.id === "web.production-result"), "재현·감사에서 생산실적 실제 웹 근거를 찾지 못했습니다.");
  assert(reproductionAudit.figmaReconciliation.pages.some((entry) => entry.pageId === "web.production-result"), "재현·감사에서 생산실적 Figma 근거를 찾지 못했습니다.");

  const contract = structured(await client.callTool({ name: "mes_resolve_screen", arguments: { request } }));
  assert(contract.quality.status === "release-ready", `계약 상태가 release-ready가 아닙니다: ${contract.quality.status}`);
  assert(contract.decisionTrace?.shell?.selectedId === "shell.side-slide-panel", "Resolver decision trace에 선택 셸이 없습니다.");
  assert(contract.decisionTrace?.sections?.length === 3, "Resolver decision trace의 순서형 섹션이 예상과 다릅니다.");
  assert(contract.referenceContext?.enforcement === "none", "Resolver 참고 주석이 누락됐습니다.");
  const withoutReferences = structuredClone(request);
  delete withoutReferences.webContext;
  const noReferenceContract = structured(await client.callTool({ name: "mes_resolve_screen", arguments: { request: withoutReferences } }));
  assert(noReferenceContract.quality.blockerCount === 0, "참고 사례 미선택을 MCP Resolver가 차단했습니다.");
  assert(contract.implementation?.webGenerationContext?.policy?.authority === "observed-generation-guidance", "Resolver가 신규 UI 생성 문법을 전달하지 않았습니다.");
  assert(contract.implementation?.webGenerationContext?.overlayGrammars?.some((entry) => entry.id === "generation.overlay.select-then-register"), "Resolver가 가까운 실제 웹 팝업 문법을 전달하지 않았습니다.");
  assert(contract.implementation?.reproductionAuditContext === null, "신규 UI 계약에 재현·감사 정보가 섞였습니다.");
  const reproduceContract = structured(await client.callTool({ name: "mes_resolve_screen", arguments: { request: { ...request, intent: "reproduce" } } }));
  assert(reproduceContract.implementation?.reproductionAuditContext?.figmaReconciliation?.pages?.length > 0, "재현 요청에 Figma 감사 근거가 전달되지 않았습니다.");

  const generatedResult = await client.callTool({
    name: "mes_generate_screen",
    arguments: { request },
  });
  assert(!generatedResult.isError, "정상 MCP 생성 호출이 실패했습니다.");
  const generated = structured(generatedResult);
  assert(generated.sourceFingerprint === expectedSourceFingerprint, `생성 소스 fingerprint가 다릅니다: ${generated.sourceFingerprint}`);
  assert(generated.audit.blockerCount === 0, "생성 직후 감사에서 blocker가 발견됐습니다.");
  assert(existsSync(outputPath), "MCP가 출력 파일을 만들지 않았습니다.");
  assert(generated.previewPath === previewRelativePath, `MCP 미리보기 경로가 다릅니다: ${generated.previewPath}`);
  assert(generated.outputPath === outputRelativePath, `MCP 기본 임시 출력 경로가 다릅니다: ${generated.outputPath}`);
  assert(generated.qaPreviewUrl === "http://localhost:3000/preview/deterministic-receiving-fixture", `MCP QA URL이 다릅니다: ${generated.qaPreviewUrl}`);
  assert(generated.handoffReady === false && !("previewUrl" in generated), "MCP가 시각 검증 전 사용자 전달 URL을 반환했습니다.");
  assert(existsSync(previewPath), "MCP가 미리보기 페이지를 만들지 않았습니다.");
  const unreviewed = await client.callTool({ name: "mes_handoff_screen", arguments: { request, sourcePath: outputRelativePath } });
  assert(unreviewed.isError, "MCP 전달 경로가 미작성 시각 기록을 통과시켰습니다.");
  // Protocol/schema fixture only, not an assertion that a browser was inspected.
  const review = { reviewer: "synthetic-mcp-regression-only", rendered: true, interactions: true };
  const reviewed = await client.callTool({ name: "mes_handoff_screen", arguments: { request, sourcePath: outputRelativePath, review } });
  assert(!reviewed.isError && structured(reviewed).status === "handoff-ready", "짧은 확인 기록 MCP 전달 실패");
  const reused = await client.callTool({ name: "mes_handoff_screen", arguments: { request, sourcePath: outputRelativePath } });
  assert(!reused.isError && structured(reused).visualEvidenceFingerprint === structured(reviewed).visualEvidenceFingerprint, "동일 코드 기록 재사용 실패");
  const failedReview = await client.callTool({ name: "mes_handoff_screen", arguments: { request, sourcePath: outputRelativePath, review: { ...review, interactions: false } } });
  assert(failedReview.isError, "실패한 동작 확인을 MCP가 통과시켰습니다.");
  const staleSuccess = await client.callTool({ name: "mes_handoff_screen", arguments: { request, sourcePath: outputRelativePath } });
  assert(staleSuccess.isError, "실패 이후 과거 성공 재사용 차단 실패");

  const audited = structured(await client.callTool({
    name: "mes_audit_screen",
    arguments: { request, sourcePath: outputRelativePath },
  }));
  assert(audited.status === "audit-ready", `MCP 감사 상태가 audit-ready가 아닙니다: ${audited.status}`);
  const validSource = readFileSync(outputPath, "utf8");
  writeFileSync(outputPath, 'export const Bad = () => <input type="date" />;');
  const blockedAudit = await client.callTool({ name: "mes_audit_screen", arguments: { request, sourcePath: outputRelativePath } });
  assert(blockedAudit.isError && structured(blockedAudit).status === "blocked", "MCP가 원시 HTML 위반을 성공 결과로 반환했습니다.");
  writeFileSync(outputPath, validSource);

  const overwriteResult = await client.callTool({
    name: "mes_generate_screen",
    arguments: { request },
  });
  assert(overwriteResult.isError, "MCP가 기존 파일 덮어쓰기를 차단하지 않았습니다.");

  const escapeResult = await client.callTool({
    name: "mes_generate_screen",
    arguments: { request, outputPath: "../escaped.tsx" },
  });
  assert(escapeResult.isError, "MCP가 component-library 외부 경로 쓰기를 차단하지 않았습니다.");

  const trackedSourceResult = await client.callTool({
    name: "mes_generate_screen",
    arguments: { request, outputPath: "src/components/should-not-be-generated.tsx" },
  });
  assert(trackedSourceResult.isError, "MCP가 임시 생성 화면을 Git 추적 소스 경로에 쓰는 것을 차단하지 않았습니다.");

  const surfaceRequest = structuredClone(request);
  delete surfaceRequest.hostPage;
  surfaceRequest.verificationScope = "surface";
  surfaceRequest.requestId += "-surface";
  surfaceRequest.output.route = `/preview/${surfaceRequest.requestId}`;
  const surfaceOutput = `src/generated-previews/${surfaceRequest.requestId}.tsx`;
  const owned = [join(projectRoot, surfaceOutput), join(projectRoot, "src/app", surfaceRequest.output.route), join(projectRoot, ".mes-ui-preview", surfaceRequest.requestId)];
  assert(owned.every(path => !existsSync(path)), "MCP 단독 확인 테스트의 기존 파일 보존");
  surfaceArtifacts = owned;
  const missingConnection = await client.callTool({ name: "mes_generate_screen", arguments: { request: { ...surfaceRequest, verificationScope: "connected-flow" } } });
  assert(missingConnection.isError, "MCP가 배경 없는 연동 요청을 통과시켰습니다.");
  assert(!existsSync(owned[0]), "연동 차단 후 출력 파일이 생겼습니다.");
  const surfaceGeneration = await client.callTool({ name: "mes_generate_screen", arguments: { request: surfaceRequest } });
  assert(!surfaceGeneration.isError, JSON.stringify(surfaceGeneration));
  assert(structured(surfaceGeneration).verification.parentIntegration === "out-of-scope", "MCP 생성 결과에 연동 제외 표시 누락");
  const surfaceHandoff = await client.callTool({ name: "mes_handoff_screen", arguments: { request: surfaceRequest, sourcePath: surfaceOutput, review } });
  assert(!surfaceHandoff.isError, JSON.stringify(surfaceHandoff));
  assert(structured(surfaceHandoff).verification.scope === "surface", "MCP 전달 결과의 단독 확인 범위 누락");
  assert(/저장 연동은 확인하지 않았습니다/.test(structured(surfaceHandoff).limitation), "MCP 전달 한계 표시 누락");
  writeFileSync(owned[0], '<input type="date" />');
  assert((await client.callTool({ name: "mes_handoff_screen", arguments: { request: surfaceRequest, sourcePath: surfaceOutput } })).isError, "단독 모드에서 원시 UI 대체/이전 통과 재사용 차단 실패");

  console.log(`[mcp:check] 도구 ${toolNames.length}개 · 생성 ${generated.sourceFingerprint.slice(0, 12)} · 내부 QA ${generated.previewRoute} · 감사 ${audited.status} · 안전 차단 7개 + 짧은 기록/재사용 + 단독/연동 범위 통과`);
} finally {
  await client.close();
  for (const path of surfaceArtifacts) if (existsSync(path)) rmSync(path, { recursive: true });
  if (existsSync(outputPath)) rmSync(outputPath);
  if (existsSync(previewDirectory)) rmSync(previewDirectory, { recursive: true });
  if (existsSync(reviewDirectory)) rmSync(reviewDirectory, { recursive: true });
}
