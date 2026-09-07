import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const registryDirectory = path.join(projectRoot, "src", "design-system", "registry");
const resultPath = path.join(registryDirectory, "full-verification-result.json");
const markdownPath = path.join(repositoryRoot, "docs", "전체_검증_결과.md");
const npmEntry = process.env.npm_execpath;

if (!npmEntry) {
  throw new Error("npm 실행 경로를 찾지 못했습니다. npm run verify:full로 실행하세요.");
}

function run(name, args, options = {}) {
  const startedAt = Date.now();
  console.log(`\n[verify] ${name}`);
  const command = options.command ?? process.execPath;
  const commandArgs = options.command ? args : [npmEntry, ...args];
  const result = spawnSync(command, commandArgs, {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  if (result.error) console.error(`[verify] ${name}: ${result.error.message}`);
  return {
    id: name,
    command: options.command ? `node ${args.join(" ")}` : `npm ${args.join(" ")}`,
    status: result.status === 0 ? "passed" : "failed",
    durationMs: Date.now() - startedAt,
    exitCode: result.status ?? 1,
  };
}

function formatDuration(durationMs) {
  if (durationMs < 1000) return `${durationMs}ms`;
  return `${(durationMs / 1000).toFixed(1)}s`;
}

const startedAt = new Date();
const stages = [];

stages.push(run("asset-sync", ["run", "sync:assets"]));
if (stages.at(-1).status === "passed") {
  stages.push(run("verification-inventory", ["scripts/audit-web-verification-coverage.mjs", "--write"], { command: process.execPath }));
}

const pipeline = [
  ["design-system-check", ["run", "check:design-system"]],
  ["design-system-lint", ["run", "lint:design-system"]],
  // Two suites create and remove temporary Next.js app routes while they run.
  // Keep the release gate serial so the dev compiler never reads a route while
  // another worker is deleting its fixture directory.
  ["playwright", ["run", "test:visual", "--", "--workers=1"]],
  ["production-build", ["run", "build"]],
];

for (const [name, args] of pipeline) {
  if (stages.some((stage) => stage.status === "failed")) break;
  stages.push(run(name, args));
}

let outcome = stages.length === pipeline.length + 2 && stages.every((stage) => stage.status === "passed") ? "passed" : "failed";
const playwrightStage = stages.find((stage) => stage.id === "playwright");
if (outcome === "passed") {
  const recordStage = run("verification-record", [
    "scripts/audit-web-verification-coverage.mjs",
    "--write",
    "--record-passed",
    `--duration-ms=${playwrightStage.durationMs}`,
  ], { command: process.execPath });
  stages.push(recordStage);
  if (recordStage.status === "failed") outcome = "failed";
}

const completedAt = new Date();
const assetManifest = fs.existsSync(path.join(registryDirectory, "asset-manifest.json"))
  ? JSON.parse(fs.readFileSync(path.join(registryDirectory, "asset-manifest.json"), "utf8"))
  : null;
const webAudit = fs.existsSync(path.join(registryDirectory, "web-verification-audit.json"))
  ? JSON.parse(fs.readFileSync(path.join(registryDirectory, "web-verification-audit.json"), "utf8"))
  : null;
const result = {
  schemaVersion: 1,
  recordedAt: completedAt.toISOString(),
  outcome,
  durationMs: completedAt.getTime() - startedAt.getTime(),
  assetManifestFingerprint: assetManifest?.fingerprint ?? null,
  verificationSourceFingerprint: webAudit?.sourceFingerprint ?? null,
  testInventory: webAudit?.testInventory ?? null,
  stages,
};
fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

const lines = [
  "# 전체 검증 결과",
  "",
  `> 실행 시각: ${result.recordedAt} · 결과: ${result.outcome === "passed" ? "통과" : "실패"} · 소요: ${formatDuration(result.durationMs)}`,
  "",
  "| 단계 | 결과 | 소요 |",
  "|---|---|---:|",
  ...stages.map((stage) => `| ${stage.id} | ${stage.status === "passed" ? "통과" : `실패(${stage.exitCode})`} | ${formatDuration(stage.durationMs)} |`),
  "",
  `- 현재 테스트 목록: ${result.testInventory?.count ?? "조회 실패"}개`,
  `- 자산 원장 지문: \`${result.assetManifestFingerprint ?? "없음"}\``,
  `- 검증 소스 지문: \`${result.verificationSourceFingerprint ?? "없음"}\``,
  "",
  "이 문서는 `npm run verify:full`이 자동으로 기록한다. 직접 수정하지 않는다.",
  "",
];
fs.writeFileSync(markdownPath, lines.join("\n"), "utf8");

if (outcome !== "passed") process.exitCode = 1;
