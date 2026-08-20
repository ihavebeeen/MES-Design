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
const outputRelativePath = "src/components/__mcp_smoke_generated.tsx";
const outputPath = join(projectRoot, ...outputRelativePath.split("/"));
const expectedTools = [
  "mes_audit_screen",
  "mes_generate_screen",
  "mes_get_mobile_context",
  "mes_list_design_system",
  "mes_resolve_screen",
];
const expectedSourceFingerprint = "c255e456a13475fcbd527b435c4b04e0e5072d8434da0ed23af4e65c85fd6745";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function structured(result) {
  assert(result && typeof result.structuredContent === "object", "MCP 도구가 structuredContent를 반환하지 않았습니다.");
  return result.structuredContent;
}

if (existsSync(outputPath)) throw new Error(`검증용 출력 파일이 이미 존재합니다: ${outputRelativePath}`);

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
  assert(catalog.counts.generationTemplates === 1, "생성 템플릿 개수가 예상과 다릅니다.");
  assert(catalog.counts.mobileAssets > 0, "모바일 자산이 MCP 목록에 포함되지 않았습니다.");
  const mobile = structured(await client.callTool({ name: "mes_get_mobile_context", arguments: { category: "screens" } }));
  assert(mobile.screenTypes.main.count === 12, "모바일 메인 화면 유형 수가 예상과 다릅니다.");
  assert(mobile.screenTypes.slidePopup.count === 13, "모바일 슬라이드 팝업 유형 수가 예상과 다릅니다.");

  const contract = structured(await client.callTool({ name: "mes_resolve_screen", arguments: { request } }));
  assert(contract.quality.status === "release-ready", `계약 상태가 release-ready가 아닙니다: ${contract.quality.status}`);

  const generatedResult = await client.callTool({
    name: "mes_generate_screen",
    arguments: { request, outputPath: outputRelativePath },
  });
  assert(!generatedResult.isError, "정상 MCP 생성 호출이 실패했습니다.");
  const generated = structured(generatedResult);
  assert(generated.sourceFingerprint === expectedSourceFingerprint, `생성 소스 fingerprint가 다릅니다: ${generated.sourceFingerprint}`);
  assert(generated.audit.blockerCount === 0, "생성 직후 감사에서 blocker가 발견됐습니다.");
  assert(existsSync(outputPath), "MCP가 출력 파일을 만들지 않았습니다.");

  const audited = structured(await client.callTool({
    name: "mes_audit_screen",
    arguments: { request, sourcePath: outputRelativePath },
  }));
  assert(audited.status === "audit-ready", `MCP 감사 상태가 audit-ready가 아닙니다: ${audited.status}`);

  const overwriteResult = await client.callTool({
    name: "mes_generate_screen",
    arguments: { request, outputPath: outputRelativePath },
  });
  assert(overwriteResult.isError, "MCP가 기존 파일 덮어쓰기를 차단하지 않았습니다.");

  const escapeResult = await client.callTool({
    name: "mes_generate_screen",
    arguments: { request, outputPath: "../escaped.tsx" },
  });
  assert(escapeResult.isError, "MCP가 component-library 외부 경로 쓰기를 차단하지 않았습니다.");

  console.log(`[mcp:check] 도구 ${toolNames.length}개 · 생성 ${generated.sourceFingerprint.slice(0, 12)} · 감사 ${audited.status} · 안전 차단 2개 통과`);
} finally {
  await client.close();
  if (existsSync(outputPath)) rmSync(outputPath);
}
