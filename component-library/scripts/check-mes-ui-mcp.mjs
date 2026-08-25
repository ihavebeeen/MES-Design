import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

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
  "mes_list_design_system",
  "mes_resolve_screen",
];
const expectedSourceFingerprint = "cbf73874ac6cf26241cda1a23f0300796e79342552f5b4843162548e33180fb3";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function structured(result) {
  assert(result && typeof result.structuredContent === "object", "MCP 도구가 structuredContent를 반환하지 않았습니다.");
  return result.structuredContent;
}

if (existsSync(outputPath)) throw new Error(`검증용 출력 파일이 이미 존재합니다: ${outputRelativePath}`);
if (existsSync(previewPath)) throw new Error(`검증용 미리보기 파일이 이미 존재합니다: ${previewRelativePath}`);

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

try {
  await client.connect(transport);
  const listed = await client.listTools();
  const toolNames = listed.tools.map((tool) => tool.name).sort();
  assert(JSON.stringify(toolNames) === JSON.stringify(expectedTools), `MCP 도구 목록이 다릅니다: ${toolNames.join(", ")}`);

  const request = JSON.parse(readFileSync(fixturePath, "utf8"));
  const catalog = structured(await client.callTool({ name: "mes_list_design_system", arguments: { query: "side-slide", limit: 10 } }));
  assert(catalog.counts.generationTemplates === 3, "생성 템플릿 개수가 예상과 다릅니다.");
  assert(catalog.counts.componentUsageContracts === 20, "컴포넌트 사용 계약 개수가 예상과 다릅니다.");
  assert(catalog.counts.patternContracts === 10, "패턴 계약 개수가 예상과 다릅니다.");
  assert(catalog.counts.screenSpecs === 3, "순서형 ScreenSpec 개수가 예상과 다릅니다.");
  assert(catalog.counts.webGenerationPageArchetypes === 4, "신규 생성용 페이지 문법 수가 예상과 다릅니다.");
  assert(catalog.counts.webGenerationOverlayGrammars === 4, "신규 생성용 팝업 문법 수가 예상과 다릅니다.");
  assert(catalog.counts.webGenerationSectionRecipes === 4, "신규 생성용 섹션 문법 수가 예상과 다릅니다.");
  assert(catalog.componentUsageContracts.some((entry) => entry.componentId === "side-slide-panel" && entry.useWhen.length > 0), "MCP 목록이 컴포넌트 사용 계약 상세를 반환하지 않았습니다.");
  assert(catalog.patternContracts.some((entry) => entry.patternId === "shell.side-slide-panel" && entry.slots.length > 0), "MCP 목록이 패턴 슬롯 계약 상세를 반환하지 않았습니다.");
  assert(catalog.counts.mobileAssets > 0, "모바일 자산이 MCP 목록에 포함되지 않았습니다.");
  const mobile = structured(await client.callTool({ name: "mes_get_mobile_context", arguments: { category: "screens" } }));
  assert(mobile.screenTypes.main.count === 12, "모바일 메인 화면 유형 수가 예상과 다릅니다.");
  assert(mobile.screenTypes.slidePopup.count === 13, "모바일 슬라이드 팝업 유형 수가 예상과 다릅니다.");
  const webGeneration = structured(await client.callTool({ name: "mes_get_web_generation_context", arguments: { query: "생산실적" } }));
  assert(webGeneration.policy.authority === "observed-generation-guidance", "신규 UI 생성 문법의 권한이 잘못 노출됐습니다.");
  assert(webGeneration.nearestObservedExamples.pages.some((entry) => entry.id === "web.production-result"), "생산실적과 가까운 실제 웹 예시를 찾지 못했습니다.");
  assert(webGeneration.overlayGrammars.some((entry) => entry.id === "generation.overlay.select-then-register"), "선택 후 등록 팝업 문법을 찾지 못했습니다.");
  assert(!("figmaReconciliation" in webGeneration), "신규 UI 생성 컨텍스트에 Figma 감사 정보가 섞였습니다.");
  const reproductionAudit = structured(await client.callTool({ name: "mes_get_reproduction_audit_context", arguments: { query: "생산실적" } }));
  assert(reproductionAudit.mode === "reproduction-audit-only", "재현·감사 전용 모드 표시가 없습니다.");
  assert(reproductionAudit.pages.some((entry) => entry.id === "web.production-result"), "재현·감사에서 생산실적 실제 웹 근거를 찾지 못했습니다.");
  assert(reproductionAudit.figmaReconciliation.pages.some((entry) => entry.pageId === "web.production-result"), "재현·감사에서 생산실적 Figma 근거를 찾지 못했습니다.");

  const contract = structured(await client.callTool({ name: "mes_resolve_screen", arguments: { request } }));
  assert(contract.quality.status === "release-ready", `계약 상태가 release-ready가 아닙니다: ${contract.quality.status}`);
  assert(contract.decisionTrace?.shell?.selectedId === "shell.side-slide-panel", "Resolver decision trace에 선택 셸이 없습니다.");
  assert(contract.decisionTrace?.sections?.length === 3, "Resolver decision trace의 순서형 섹션이 예상과 다릅니다.");
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
  assert(generated.previewUrl === "http://localhost:3000/preview/deterministic-receiving-fixture", `MCP 미리보기 URL이 다릅니다: ${generated.previewUrl}`);
  assert(existsSync(previewPath), "MCP가 미리보기 페이지를 만들지 않았습니다.");

  const audited = structured(await client.callTool({
    name: "mes_audit_screen",
    arguments: { request, sourcePath: outputRelativePath },
  }));
  assert(audited.status === "audit-ready", `MCP 감사 상태가 audit-ready가 아닙니다: ${audited.status}`);

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

  console.log(`[mcp:check] 도구 ${toolNames.length}개 · 생성 ${generated.sourceFingerprint.slice(0, 12)} · 미리보기 ${generated.previewRoute} · 감사 ${audited.status} · 안전 차단 3개 통과`);
} finally {
  await client.close();
  if (existsSync(outputPath)) rmSync(outputPath);
  if (existsSync(previewDirectory)) rmSync(previewDirectory, { recursive: true });
}
