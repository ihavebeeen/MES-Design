import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { generatedTextMatches } from "./generated-text.mjs";

const root = process.cwd();
const registryDirectory = join(root, "src", "design-system", "registry");
const decisionPath = join(registryDirectory, "design-decisions.json");
const auditPath = join(registryDirectory, "design-value-audit.json");
const reportPath = join(root, "..", "docs", "디자인_값_자동감사_보고서.md");
const mode = process.argv.includes("--write") ? "write" : process.argv.includes("--check") ? "check" : "print";

const normalizePath = (path) => path.replaceAll("\\", "/");
const round = (value) => Number(Number(value).toFixed(4));

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function classifyLayer(source) {
  if (source.includes("/components/ui/")) return "canonical";
  const name = source.split("/").at(-1) ?? "";
  if (name.startsWith("exact-") || name === "original-mes-screen-assets.tsx" || name === "source-popup-gallery.tsx") return "evidence";
  return "pattern";
}

function categoryOf(utility) {
  if (/^(?:-)?(?:p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])-/.test(utility)) return "spacing";
  if (/^rounded(?:-[trbl]{1,2})?-/.test(utility)) return "radius";
  if (/^text-\[#[0-9a-fA-F]+\]$/.test(utility)) return "color";
  if (/^(?:text|leading|tracking)-\[/.test(utility)) return "typography";
  if (/^(?:w|h|min-w|max-w|min-h|max-h|size)-/.test(utility)) return "size";
  if (/^(?:shadow|drop-shadow)-/.test(utility)) return "shadow";
  return "other";
}

function stripCommentsPreserveLines(content) {
  const withoutBlocks = content.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\r\n]/g, " "));
  return withoutBlocks.replace(/(^|\s)\/\/.*$/gm, (comment) => comment.replace(/[^\r\n]/g, " "));
}

function normalizedValue(utility, category) {
  const arbitrary = utility.match(/-\[([^\]]+)\]$/)?.[1]?.replaceAll("_", " ");
  if (arbitrary) return arbitrary;
  const suffix = utility.match(/-(-?\d+(?:\.\d+)?)$/)?.[1];
  if (suffix && ["spacing", "size"].includes(category)) return `${round(Number(suffix) * 4)}px`;
  return utility;
}

function extractOccurrences(file) {
  const source = normalizePath(relative(root, file));
  const layer = classifyLayer(source);
  const content = stripCommentsPreserveLines(readFileSync(file, "utf8"));
  const lines = content.split(/\r?\n/);
  const occurrences = [];
  const utilityPattern = /(?<![\w-])((?:-)?(?:p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy]|w|h|min-w|max-w|min-h|max-h|size|text|leading|tracking|rounded(?:-[trbl]{1,2})?|shadow|drop-shadow)-(?:\[[^\]\s"'`]+\]|-?\d+(?:\.\d+)?|mes-[\w-]+))/g;
  const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;

  lines.forEach((line, index) => {
    for (const match of line.matchAll(utilityPattern)) {
      const utility = match[1];
      const category = categoryOf(utility);
      occurrences.push({
        kind: "utility",
        category,
        utility,
        value: normalizedValue(utility, category),
        arbitrary: utility.includes("-["),
        source,
        line: index + 1,
        layer,
      });
    }
    for (const match of line.matchAll(hexPattern)) {
      occurrences.push({
        kind: "hardcoded-color",
        category: "color",
        utility: match[0].toLowerCase(),
        value: match[0].toLowerCase(),
        arbitrary: true,
        source,
        line: index + 1,
        layer,
      });
    }
  });
  return occurrences;
}

function validateDecisions(registry) {
  const errors = [];
  if (registry.schemaVersion !== 1) errors.push("design-decisions: schemaVersion은 1이어야 합니다.");
  const ids = new Set();
  for (const decision of registry.decisions ?? []) {
    if (!decision.id || ids.has(decision.id)) errors.push(`design-decisions: 잘못되거나 중복된 id '${decision.id ?? ""}'`);
    ids.add(decision.id);
    for (const field of ["category", "property", "observedValue", "decision", "status", "evidence"]) {
      if (!decision[field]) errors.push(`design-decisions '${decision.id}': ${field}가 필요합니다.`);
    }
    if (decision.decision !== "needs-review" && !decision.canonicalValue) errors.push(`design-decisions '${decision.id}': 확정 판단에는 canonicalValue가 필요합니다.`);
    if (!(registry.decisionValues ?? []).includes(decision.decision)) errors.push(`design-decisions '${decision.id}': 허용되지 않은 decision '${decision.decision}'`);
    if (!(registry.statusValues ?? []).includes(decision.status)) errors.push(`design-decisions '${decision.id}': 허용되지 않은 status '${decision.status}'`);
    if (!Array.isArray(decision.scope) || decision.scope.length === 0) errors.push(`design-decisions '${decision.id}': scope가 필요합니다.`);
  }
  return errors;
}

function buildAudit() {
  const decisions = JSON.parse(readFileSync(decisionPath, "utf8"));
  const decisionErrors = validateDecisions(decisions);
  if (decisionErrors.length) throw new Error(decisionErrors.join("\n"));

  const scanDirectories = [join(root, "src", "components", "ui"), join(root, "src", "components", "patterns")];
  const files = scanDirectories.flatMap(walk).filter((path) => /\.(?:ts|tsx)$/.test(path));
  const occurrences = files.flatMap(extractOccurrences);
  const layers = ["canonical", "pattern", "evidence"];
  const layerSummary = Object.fromEntries(layers.map((layer) => {
    const values = occurrences.filter((item) => item.layer === layer);
    return [layer, {
      files: new Set(values.map((item) => item.source)).size,
      occurrences: values.length,
      arbitraryUtilities: values.filter((item) => item.kind === "utility" && item.arbitrary).length,
      hardcodedColors: values.filter((item) => item.kind === "hardcoded-color").length,
    }];
  }));

  const frequencies = {};
  for (const category of ["spacing", "radius", "typography", "size", "color", "shadow"]) {
    const map = new Map();
    for (const item of occurrences.filter((entry) => entry.category === category && (category !== "color" || entry.kind === "hardcoded-color"))) {
      const key = item.value;
      const current = map.get(key) ?? { value: key, count: 0, arbitraryCount: 0, layers: {}, examples: [] };
      current.count += 1;
      if (item.arbitrary) current.arbitraryCount += 1;
      current.layers[item.layer] = (current.layers[item.layer] ?? 0) + 1;
      if (current.examples.length < 8) current.examples.push(`${item.source}:${item.line}`);
      map.set(key, current);
    }
    frequencies[category] = [...map.values()].sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "en"));
  }

  const confirmedValues = new Map();
  for (const decision of decisions.decisions.filter((item) => item.status === "confirmed")) {
    const set = confirmedValues.get(decision.category) ?? new Set();
    set.add(decision.canonicalValue);
    confirmedValues.set(decision.category, set);
  }

  const reviewCandidates = [];
  for (const category of ["spacing", "radius"]) {
    const confirmed = confirmedValues.get(category) ?? new Set();
    for (const frequency of frequencies[category]) {
      const related = occurrences.filter((item) => item.category === category && item.value === frequency.value && item.layer !== "evidence" && item.arbitrary);
      const systemCount = related.length;
      if (systemCount === 0 || systemCount > 2 || confirmed.has(frequency.value) || !/^-?\d+(?:\.\d+)?px$/.test(frequency.value)) continue;
      const knownNumeric = [...confirmed].filter((value) => /^\d+(?:\.\d+)?px$/.test(value));
      const numeric = Number.parseFloat(frequency.value);
      const nearestCanonical = knownNumeric.sort((a, b) => Math.abs(Number.parseFloat(a) - numeric) - Math.abs(Number.parseFloat(b) - numeric))[0] ?? null;
      const registeredDecision = decisions.decisions.find((item) => item.category === category && item.observedValue === frequency.value);
      reviewCandidates.push({
        id: `${category}.${frequency.value.replace(/[^\w]+/g, "-")}`,
        category,
        observedValue: frequency.value,
        systemCount,
        nearestCanonical,
        decision: "needs-review",
        registryId: registeredDecision?.id ?? null,
        registryStatus: registeredDecision?.status ?? "unregistered",
        reason: "표준 토큰에 없고 canonical/pattern 계층에서 2회 이하로만 사용된 단발성 값",
        occurrences: related.map((item) => `${item.source}:${item.line} (${item.utility})`),
      });
    }
  }

  const audit = {
    schemaVersion: 1,
    description: "컴포넌트와 패턴 코드에서 자동 수집한 디자인 값 분포. 판단의 원본은 design-decisions.json이다.",
    scope: {
      canonical: "src/components/ui",
      pattern: "src/components/patterns의 재사용 패턴",
      evidence: "exact-* 및 원본 재현 화면",
    },
    summary: {
      scannedFiles: files.length,
      totalOccurrences: occurrences.length,
      arbitraryUtilities: occurrences.filter((item) => item.kind === "utility" && item.arbitrary).length,
      hardcodedColors: occurrences.filter((item) => item.kind === "hardcoded-color").length,
      reviewCandidates: reviewCandidates.length,
      unregisteredCandidates: reviewCandidates.filter((item) => !item.registryId).length,
    },
    layers: layerSummary,
    frequencies,
    reviewCandidates,
  };
  const fingerprint = createHash("sha256").update(JSON.stringify(audit)).digest("hex").slice(0, 16);
  return { ...audit, fingerprint };
}

function markdownTable(rows, emptyMessage) {
  if (!rows.length) return emptyMessage;
  return rows.join("\n");
}

function buildReport(audit) {
  const top = (category, count = 15) => audit.frequencies[category].slice(0, count);
  const valueRows = (category) => top(category).map((item) => `| \`${item.value}\` | ${item.count} | ${item.arbitraryCount} | ${Object.entries(item.layers).map(([layer, count]) => `${layer} ${count}`).join(", ")} |`);
  const candidateRows = audit.reviewCandidates.map((item) => `| \`${item.observedValue}\` | ${item.category} | ${item.systemCount} | \`${item.nearestCanonical ?? "-"}\` | ${item.registryId ? `\`${item.registryId}\` · ${item.registryStatus}` : "미등록"} | ${item.occurrences.join("<br>")} |`);
  return `# 디자인 값 자동감사 보고서

이 문서는 \`npm run audit:design-values\`로 생성됩니다. 수치 자체를 자동으로 표준화하지 않으며, 검토 결과는 \`design-decisions.json\`에 사람이 확정합니다.

## 요약

| 항목 | 수 |
|---|---:|
| 검사 파일 | ${audit.summary.scannedFiles} |
| 디자인 값 사용 | ${audit.summary.totalOccurrences} |
| arbitrary utility | ${audit.summary.arbitraryUtilities} |
| 하드코딩 색상 | ${audit.summary.hardcodedColors} |
| 검토 후보 | ${audit.summary.reviewCandidates} |
| 레지스트리 미등록 후보 | ${audit.summary.unregisteredCandidates} |
| fingerprint | \`${audit.fingerprint}\` |

## 계층별 현황

| 계층 | 파일 | 사용값 | arbitrary utility | 하드코딩 색상 |
|---|---:|---:|---:|---:|
${Object.entries(audit.layers).map(([layer, item]) => `| ${layer} | ${item.files} | ${item.occurrences} | ${item.arbitraryUtilities} | ${item.hardcodedColors} |`).join("\n")}

- **canonical**: 공용 UI 컴포넌트. 표준 규칙을 가장 엄격하게 적용합니다.
- **pattern**: 표준 컴포넌트를 조합하는 재사용 패턴입니다.
- **evidence**: Figma 원본을 보존하는 증거층입니다. arbitrary 값이 있다는 이유만으로 자동 수정하지 않습니다.

## 간격 사용 빈도

| 값 | 사용 횟수 | arbitrary | 계층 분포 |
|---|---:|---:|---|
${markdownTable(valueRows("spacing"), "| - | 0 | 0 | - |")}

## Radius 사용 빈도

| 값 | 사용 횟수 | arbitrary | 계층 분포 |
|---|---:|---:|---|
${markdownTable(valueRows("radius"), "| - | 0 | 0 | - |")}

## Typography 사용 빈도

| 값 | 사용 횟수 | arbitrary | 계층 분포 |
|---|---:|---:|---|
${markdownTable(valueRows("typography"), "| - | 0 | 0 | - |")}

## 검토가 필요한 단발성 값

아래 값은 자동 오류가 아니라 검토 대기열입니다. 사용 맥락과 Figma 근거를 확인한 뒤 \`keep\`, \`normalize\`, \`needs-review\` 판단을 레지스트리에 기록합니다.

| 관찰값 | 분류 | 시스템 사용 | 가장 가까운 표준값 | 판단 레지스트리 | 위치 |
|---|---|---:|---|---|---|
${markdownTable(candidateRows, "| - | - | 0 | - | - | 검토 후보 없음 |")}

## 운영 규칙

1. 코드 변경 후 \`npm run audit:design-values\`로 감사 결과를 갱신합니다.
2. 새 단발성 값은 즉시 variant로 승격하지 않고 반복 근거와 의도를 확인합니다.
3. 확정 판단은 \`src/design-system/registry/design-decisions.json\`에 기록합니다.
4. \`npm run check:design-values\`는 코드와 이 보고서의 drift를 검사합니다.
`;
}

const audit = buildAudit();
const auditText = `${JSON.stringify(audit, null, 2)}\n`;
const reportText = buildReport(audit);

if (mode === "write") {
  mkdirSync(dirname(auditPath), { recursive: true });
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(auditPath, auditText, "utf8");
  writeFileSync(reportPath, reportText, "utf8");
  console.log(`Design value audit updated: ${audit.summary.scannedFiles} files, ${audit.summary.reviewCandidates} review candidates, ${audit.fingerprint}`);
} else if (mode === "check") {
  const errors = [];
  if (audit.summary.unregisteredCandidates > 0) errors.push(`판단 레지스트리에 등록되지 않은 검토 후보가 ${audit.summary.unregisteredCandidates}개 있습니다.`);
  if (!existsSync(auditPath) || !generatedTextMatches(readFileSync(auditPath, "utf8"), auditText)) errors.push("design-value-audit.json이 현재 코드와 다릅니다. npm run audit:design-values를 실행하세요.");
  if (!existsSync(reportPath) || !generatedTextMatches(readFileSync(reportPath, "utf8"), reportText)) errors.push("디자인 값 자동감사 보고서가 현재 코드와 다릅니다. npm run audit:design-values를 실행하세요.");
  if (errors.length) {
    console.error(["Design value audit check failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
    process.exit(1);
  }
  console.log(`Design value audit check passed: ${audit.summary.scannedFiles} files, ${audit.summary.reviewCandidates} review candidates, ${audit.fingerprint}`);
} else {
  console.log(buildReport(audit));
}
