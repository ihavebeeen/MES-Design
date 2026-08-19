import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const registryPath = path.join(projectRoot, "src/design-system/registry/experimental-candidates.json");
const outputPath = path.join(repositoryRoot, "docs/UI_실험_후보_판정_원장.md");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

const mode = process.argv.includes("--write") ? "write" : process.argv.includes("--check") ? "check" : undefined;
if (!mode) {
  console.error("--write 또는 --check 옵션이 필요합니다.");
  process.exit(1);
}

const escapeTable = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");

function decisionFor(entry, batch) {
  const promotion = (batch.promotions ?? []).find((item) => item.candidateId === entry.id);
  if (promotion) return { status: "표준 승격", detail: `${promotion.registry}.${promotion.registryId} (provisional)` };
  if ((batch.retainedCandidateIds ?? []).includes(entry.id)) return { status: "실험 유지", detail: "Experimental 격리 · 자동 생성 미사용" };
  return { status: "현재 제외", detail: "코드·자동 생성 후보에서 제외" };
}

const allDecisions = registry.decisionBatches.flatMap((batch) =>
  registry.catalog
    .filter((entry) => entry.tier === batch.tier)
    .map((entry) => ({ ...entry, ...decisionFor(entry, batch) })),
);

const statusCounts = Object.fromEntries(
  ["표준 승격", "실험 유지", "현재 제외"].map((status) => [status, allDecisions.filter((entry) => entry.status === status).length]),
);

const lines = [
  "# UI 실험 후보 판정 원장",
  "",
  "> 이 파일은 `component-library/src/design-system/registry/experimental-candidates.json`에서 자동 생성됩니다. 직접 편집하지 않습니다.",
  "",
  "## 현재 요약",
  "",
  `- 최초 검토 후보: ${allDecisions.length}개`,
  `- 표준 승격: ${statusCounts["표준 승격"]}개 — 사용자 분류 완료, 실제 화면 검증 전까지 provisional`,
  `- 실험 유지: ${statusCounts["실험 유지"]}개 — Experimental에 격리, 표준 AI 생성에는 자동 사용하지 않음`,
  `- 현재 제외: ${statusCounts["현재 제외"]}개 — 현재 코드 및 자동 생성 후보에서 제외`,
  "",
  "## 판정 원칙",
  "",
  registry.promotionRule,
  "",
];

for (const batch of registry.decisionBatches) {
  const entries = allDecisions.filter((entry) => entry.tier === batch.tier);
  const counts = Object.fromEntries(
    ["표준 승격", "실험 유지", "현재 제외"].map((status) => [status, entries.filter((entry) => entry.status === status).length]),
  );
  lines.push(
    `## Tier ${batch.tier}`,
    "",
    `판정일 ${batch.decidedAt} · 최초 ${entries.length}개 · 승격 ${counts["표준 승격"]} · 유지 ${counts["실험 유지"]} · 제외 ${counts["현재 제외"]}`,
    "",
    "| 후보 | 체크리스트 항목 | 판정 | 현재 위치 |",
    "|---|---|---|---|",
    ...entries.map((entry) => `| ${escapeTable(entry.name)} | ${escapeTable(entry.checklistItem)} | ${entry.status} | ${escapeTable(entry.detail)} |`),
    "",
    "판정 메모:",
    "",
    ...batch.notes.map((note) => `- ${note}`),
    "",
  );
}

const rendered = `${lines.join("\n")}\n`;

if (mode === "write") {
  fs.writeFileSync(outputPath, rendered, "utf8");
  console.log(`Experimental decision ledger updated: ${path.relative(repositoryRoot, outputPath)}`);
} else {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== rendered) {
    console.error("실험 후보 판정 원장이 JSON 원장과 다릅니다. npm run audit:experimental-decisions를 실행하세요.");
    process.exit(1);
  }
  console.log(`Experimental decision ledger check passed: ${allDecisions.length} candidates.`);
}
