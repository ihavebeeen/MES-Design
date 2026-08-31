import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatedTextMatches } from "./generated-text.mjs";
import { readRegistryBundle } from "./resolve-screen-request.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const registryDirectory = path.join(projectRoot, "src", "design-system", "registry");
const jsonOutputPath = path.join(registryDirectory, "web-verification-audit.json");
const markdownOutputPath = path.join(repositoryRoot, "docs", "웹_UI_전수검증_현황.md");
const require = createRequire(import.meta.url);

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(registryDirectory, fileName), "utf8"));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function existsFromProject(relativePath) {
  return typeof relativePath === "string" && fs.existsSync(path.join(projectRoot, relativePath));
}

function fingerprint(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function fileFingerprint(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  });
}

function collectTestInventory() {
  const cliPath = require.resolve("@playwright/test/cli");
  const result = spawnSync(process.execPath, [cliPath, "test", "--list"], {
    cwd: projectRoot,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  if (result.status !== 0) throw new Error(`Playwright 테스트 목록 조회 실패:\n${result.stderr || result.stdout}`);
  const output = `${result.stdout}\n${result.stderr}`;
  const count = Number(output.match(/Total:\s*(\d+)\s+tests?/)?.[1]);
  if (!Number.isFinite(count)) throw new Error("Playwright 테스트 개수를 읽지 못했습니다.");
  const testFiles = walkFiles(path.join(projectRoot, "tests", "visual")).filter((filePath) => /\.spec\.[cm]?ts$/.test(filePath));
  return {
    count,
    files: Object.fromEntries(testFiles.sort().map((filePath) => [path.relative(projectRoot, filePath).replaceAll("\\", "/"), fileFingerprint(filePath)])),
    fingerprint: fingerprint({ count, files: testFiles.sort().map((filePath) => [path.relative(projectRoot, filePath), fileFingerprint(filePath)]) }),
  };
}

function escapeCell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function buildAudit() {
  const registry = readRegistryBundle();
  const visualCases = readJson("visual-regression.json").cases;
  const interactionScreens = readJson("interaction-audit.json").screens;
  const interactionByScreen = new Map(interactionScreens.map((entry) => [entry.screenId, entry]));
  const componentContracts = new Set(registry.componentUsageContracts.map((entry) => entry.componentId));
  const patternContracts = new Set(registry.patternContracts.map((entry) => entry.patternId));
  const screenSpecs = new Set(registry.screenSpecs.map((entry) => entry.screenId));
  const visualByScreen = new Map();
  const directVisualByPattern = new Map();
  const screensByPattern = new Map();
  const componentsByPattern = new Map();
  const templatesByPattern = new Map();

  for (const screen of registry.screens) {
    for (const patternId of screen.patternRefs) {
      screensByPattern.set(patternId, [...(screensByPattern.get(patternId) ?? []), screen.id]);
    }
  }
  for (const pattern of registry.patterns) {
    for (const componentId of pattern.requiredComponents) {
      componentsByPattern.set(componentId, [...(componentsByPattern.get(componentId) ?? []), pattern.id]);
    }
  }
  for (const template of registry.generationTemplates) {
    for (const patternId of template.requiredPatternRefs) {
      templatesByPattern.set(patternId, [...(templatesByPattern.get(patternId) ?? []), template.id]);
    }
  }
  for (const visualCase of visualCases) {
    if (visualCase.screenId) visualByScreen.set(visualCase.screenId, [...(visualByScreen.get(visualCase.screenId) ?? []), visualCase.id]);
    if (visualCase.patternId) directVisualByPattern.set(visualCase.patternId, [...(directVisualByPattern.get(visualCase.patternId) ?? []), visualCase.id]);
  }

  const visuallyCoveredScreenIds = new Set(visualByScreen.keys());
  const indirectlyVisualPatterns = new Set(
    registry.screens
      .filter((screen) => visuallyCoveredScreenIds.has(screen.id))
      .flatMap((screen) => screen.patternRefs),
  );

  const components = registry.components.map((component) => {
    const usedByPatternIds = unique(componentsByPattern.get(component.id) ?? []).sort();
    const hasUsageContract = componentContracts.has(component.id);
    const outstanding = [];
    if (!existsFromProject(component.source)) outstanding.push("source-missing");
    if (component.status === "provisional") outstanding.push("needs-approval-evidence");
    if (!component.documentationRoute) outstanding.push("documentation-route-missing");
    if (!hasUsageContract) outstanding.push("detailed-usage-rule-missing");
    if (usedByPatternIds.length === 0) outstanding.push("no-registered-pattern-usage");
    return {
      id: component.id,
      name: component.name,
      category: component.category,
      status: component.status,
      source: component.source,
      sourceExists: existsFromProject(component.source),
      documentationRoute: component.documentationRoute ?? null,
      hasFreeformRules: Boolean(component.rules?.length),
      hasDetailedUsageRule: hasUsageContract,
      usedByPatternIds,
      reviewState: component.status === "stable" && hasUsageContract ? "approved-with-detailed-rule" : component.status === "stable" ? "approved-basic" : "needs-review",
      outstanding,
    };
  });

  const patterns = registry.patterns.map((pattern) => {
    const usedByScreenIds = unique(screensByPattern.get(pattern.id) ?? []).sort();
    const generationTemplateIds = unique(templatesByPattern.get(pattern.id) ?? []).sort();
    const directVisualCaseIds = unique(directVisualByPattern.get(pattern.id) ?? []).sort();
    const hasDetailedRule = patternContracts.has(pattern.id);
    const hasVisualEvidence = directVisualCaseIds.length > 0 || indirectlyVisualPatterns.has(pattern.id);
    const outstanding = [];
    if (!existsFromProject(pattern.source)) outstanding.push("source-missing");
    if (!hasDetailedRule) outstanding.push("detailed-composition-rule-missing");
    if (usedByScreenIds.length === 0 && generationTemplateIds.length === 0) outstanding.push("no-screen-or-generator-usage");
    if (!hasVisualEvidence && generationTemplateIds.length === 0) outstanding.push("visual-evidence-missing");
    return {
      id: pattern.id,
      name: pattern.name,
      kind: pattern.kind,
      source: pattern.source,
      sourceExists: existsFromProject(pattern.source),
      hasDetailedCompositionRule: hasDetailedRule,
      usedByScreenIds,
      generationTemplateIds,
      directVisualCaseIds,
      hasIndirectScreenVisualEvidence: indirectlyVisualPatterns.has(pattern.id),
      reviewState: hasDetailedRule && hasVisualEvidence ? "detailed-and-screen-covered" : hasVisualEvidence || generationTemplateIds.length > 0 ? "covered-basic" : "needs-evidence",
      outstanding,
    };
  });

  const screens = registry.screens.map((screen) => {
    const interaction = interactionByScreen.get(screen.id);
    const visualCaseIds = unique(visualByScreen.get(screen.id) ?? []).sort();
    const hasOrderedDefinition = screenSpecs.has(screen.id);
    const outstanding = [];
    if (!existsFromProject(screen.source)) outstanding.push("source-missing");
    if (!interaction || interaction.status !== "verified") outstanding.push("interaction-verification-missing");
    if (visualCaseIds.length === 0) outstanding.push("direct-visual-case-missing");
    if (!hasOrderedDefinition) outstanding.push("ordered-screen-definition-missing");
    return {
      id: screen.id,
      name: screen.name,
      source: screen.source,
      sourceExists: existsFromProject(screen.source),
      figmaNode: screen.figmaNode ?? null,
      interactionStatus: interaction?.status ?? "missing",
      interactionTests: interaction?.tests ?? [],
      visualCaseIds,
      hasOrderedDefinition,
      reviewState: interaction?.status === "verified" && visualCaseIds.length > 0 ? "interaction-and-visual-covered" : interaction?.status === "verified" ? "interaction-covered-visual-link-missing" : "needs-review",
      outstanding,
    };
  });

  const registeredSourcePaths = unique([
    ...registry.components.map((entry) => entry.source),
    ...registry.patterns.map((entry) => entry.source),
    ...registry.screens.map((entry) => entry.source),
  ]).sort();
  const registeredSourceFingerprints = Object.fromEntries(
    registeredSourcePaths.map((relativePath) => {
      const absolutePath = path.join(projectRoot, relativePath);
      return [relativePath, fs.existsSync(absolutePath) ? fileFingerprint(absolutePath) : "missing"];
    }),
  );
  const visualTestDirectory = path.join(projectRoot, "tests", "visual");
  const visualTestFiles = walkFiles(visualTestDirectory).filter((filePath) => /\.spec\.[cm]?ts$/.test(filePath));
  const snapshotFiles = walkFiles(visualTestDirectory).filter((filePath) => filePath.includes("-snapshots") && filePath.endsWith(".png"));
  const visualEvidenceFingerprints = {
    testSources: Object.fromEntries(visualTestFiles.sort().map((filePath) => [path.relative(projectRoot, filePath).replaceAll("\\", "/"), fileFingerprint(filePath)])),
    snapshots: Object.fromEntries(snapshotFiles.sort().map((filePath) => [path.relative(projectRoot, filePath).replaceAll("\\", "/"), fileFingerprint(filePath)])),
  };

  const sourceFingerprint = fingerprint({
    components: registry.components,
    patterns: registry.patterns,
    screens: registry.screens,
    componentUsageContracts: registry.componentUsageContracts,
    patternContracts: registry.patternContracts,
    screenSpecs: registry.screenSpecs,
    visualCases,
    interactionScreens,
    generationTemplates: registry.generationTemplates,
    registeredSourceFingerprints,
    visualEvidenceFingerprints,
  });

  const testInventory = collectTestInventory();
  const existingAudit = fs.existsSync(jsonOutputPath) ? JSON.parse(fs.readFileSync(jsonOutputPath, "utf8")) : null;
  const recordPassed = process.argv.includes("--record-passed");
  const durationArgument = process.argv.find((argument) => argument.startsWith("--duration-ms="));
  const previousRunIsCurrent = existingAudit?.sourceFingerprint === sourceFingerprint
    && existingAudit?.browserRun?.testInventoryFingerprint === testInventory.fingerprint
    && existingAudit?.browserRun?.result === "passed";
  const browserRun = recordPassed
    ? {
        command: "npm run test:visual",
        result: "passed",
        testCount: testInventory.count,
        passed: testInventory.count,
        failed: 0,
        durationMs: Number(durationArgument?.split("=")[1] ?? 0),
        recordedAt: new Date().toISOString(),
        testInventoryFingerprint: testInventory.fingerprint,
        includesDeferredMobile: true,
      }
    : previousRunIsCurrent
      ? { ...existingAudit.browserRun, testCount: testInventory.count }
      : {
          command: "npm run test:visual",
          result: "not-verified-for-current-source",
          testCount: testInventory.count,
          passed: null,
          failed: null,
          durationMs: null,
          recordedAt: null,
          testInventoryFingerprint: testInventory.fingerprint,
          includesDeferredMobile: true,
        };

  return {
    schemaVersion: 1,
    auditedAt: browserRun.recordedAt,
    sourceFingerprint,
    browserRun,
    testInventory,
    summary: {
      components: {
        total: components.length,
        stable: components.filter((entry) => entry.status === "stable").length,
        provisional: components.filter((entry) => entry.status === "provisional").length,
        documented: components.filter((entry) => entry.documentationRoute).length,
        detailedUsageRules: components.filter((entry) => entry.hasDetailedUsageRule).length,
        sourceMissing: components.filter((entry) => !entry.sourceExists).length,
      },
      patterns: {
        total: patterns.length,
        usedByScreens: patterns.filter((entry) => entry.usedByScreenIds.length > 0).length,
        unusedByScreens: patterns.filter((entry) => entry.usedByScreenIds.length === 0).length,
        detailedCompositionRules: patterns.filter((entry) => entry.hasDetailedCompositionRule).length,
        withVisualEvidence: patterns.filter((entry) => entry.directVisualCaseIds.length > 0 || entry.hasIndirectScreenVisualEvidence).length,
        sourceMissing: patterns.filter((entry) => !entry.sourceExists).length,
      },
      screens: {
        total: screens.length,
        interactionVerified: screens.filter((entry) => entry.interactionStatus === "verified").length,
        directlyVisualLinked: screens.filter((entry) => entry.visualCaseIds.length > 0).length,
        orderedDefinitions: screens.filter((entry) => entry.hasOrderedDefinition).length,
        sourceMissing: screens.filter((entry) => !entry.sourceExists).length,
      },
    },
    components,
    patterns,
    screens,
  };
}

function renderMarkdown(audit) {
  const missingVisual = audit.screens.filter((entry) => entry.visualCaseIds.length === 0);
  const provisionalComponents = audit.components.filter((entry) => entry.status === "provisional");
  const stableWithoutRules = audit.components.filter((entry) => entry.status === "stable" && !entry.hasDetailedUsageRule);
  const patternsWithoutRules = audit.patterns.filter((entry) => !entry.hasDetailedCompositionRule);
  const unusedPatterns = audit.patterns.filter((entry) => entry.usedByScreenIds.length === 0 && entry.generationTemplateIds.length === 0);
  const browserVerified = audit.browserRun.result === "passed";
  const recordedDate = audit.browserRun.recordedAt ? audit.browserRun.recordedAt.slice(0, 10) : "현재 소스 미검증";
  const lines = [
    "# 웹 UI 전수검증 현황",
    "",
    `> 기록: ${recordedDate} · 현재 테스트 목록: ${audit.browserRun.testCount}개 · 결과: ${browserVerified ? `${audit.browserRun.passed}개 통과` : "전체 검증 필요"}`,
    "",
    "## 이번에 확인한 범위",
    "",
    "| 구분 | 전체 | 현재 확인 결과 | 남은 확인 |",
    "|---|---:|---:|---:|",
    `| 공용 화면 요소 | ${audit.summary.components.total} | 정식 ${audit.summary.components.stable} | 검토 단계 ${audit.summary.components.provisional} |`,
    `| 화면 구성 방식 | ${audit.summary.patterns.total} | 실제 화면 사용 ${audit.summary.patterns.usedByScreens} | 화면 미사용 ${audit.summary.patterns.unusedByScreens} |`,
    `| 등록 화면 | ${audit.summary.screens.total} | 동작 확인 ${audit.summary.screens.interactionVerified} | 직접 시각 기준 없음 ${audit.summary.screens.total - audit.summary.screens.directlyVisualLinked} |`,
    "",
    browserVerified
      ? `현재 소스 지문에서 코드·등록 정보·화면 동작과 저장된 기준 이미지를 검사했고 ${audit.browserRun.passed}개가 통과했다. 등록 화면 ${audit.summary.screens.total}개의 연결 상태도 함께 계산했다. 이는 Figma와 영구적으로 같다는 뜻이 아니며 원본 대조가 끝난 화면만 별도 검증으로 판단한다.`
      : `현재 테스트 ${audit.browserRun.testCount}개는 목록과 소스 지문만 계산한 상태다. 이 소스에 대한 전체 브라우저 검증 결과는 아직 기록되지 않았으므로 통과로 간주하지 않는다.`,
    "",
    `## 화면 ${audit.summary.screens.total}개 확인 결과`,
    "",
    "| 화면 | 동작 | 기준 이미지 | 화면 순서 상세화 | 현재 판단 |",
    "|---|---|---|---|---|",
    ...audit.screens.map((entry) => `| ${escapeCell(entry.name)} | ${entry.interactionStatus === "verified" ? "통과" : "미확인"} | ${entry.visualCaseIds.length > 0 ? "연결됨" : "없음"} | ${entry.hasOrderedDefinition ? "완료" : "기존 방식"} | ${entry.reviewState === "interaction-and-visual-covered" ? "동작·화면 기준 있음" : "시각 기준 추가 필요"} |`),
    "",
    "## 우선 처리할 항목",
    "",
    "### 1. 화면별 기준 이미지 연결",
    "",
    ...(missingVisual.length > 0
      ? missingVisual.map((entry) => `- 연결 필요: ${entry.name} (${entry.id})`)
      : [`등록 화면 ${audit.summary.screens.total}개 모두 시각 기준에 연결돼 있다.`]),
    "",
    "### 2. 아직 검토 단계인 공용 화면 요소",
    "",
    `총 ${provisionalComponents.length}개다. 새 화면에서 사용하기 전에 원본 근거, 상태와 사용 위치를 확인해야 한다.`,
    "",
    ...Object.entries(Object.groupBy(provisionalComponents, (entry) => entry.category)).sort(([left], [right]) => left.localeCompare(right)).map(([category, entries]) => `- ${category}: ${entries.map((entry) => entry.name).join(", ")}`),
    "",
    "### 3. 정식이지만 상세 사용 기준이 없는 공용 요소",
    "",
    `총 ${stableWithoutRules.length}개다. 현재 사용은 가능하지만 AI가 선택 이유까지 판단하려면 상세 기준을 추가해야 한다.`,
    "",
    `- ${stableWithoutRules.map((entry) => entry.name).join(", ")}`,
    "",
    "### 4. 상세 조합 기준이 없는 화면 구성",
    "",
    `총 ${patternsWithoutRules.length}개다. 현재 화면에서 사용되는 항목부터 순서, 허용 요소, 스크롤과 동작 기준을 추가한다.`,
    "",
    "### 5. 실제 화면이나 생성 방식에서 사용되지 않는 구성",
    "",
    `총 ${unusedPatterns.length}개다. 삭제 대상으로 단정하지 않고 독립 예시인지, 향후 사용 예정인지, 과거 잔여물인지 판정해야 한다.`,
    "",
    ...unusedPatterns.map((entry) => `- ${entry.name} (${entry.id})`),
    "",
    "## 다음 검증 순서",
    "",
    "1. 현재 화면에서 많이 사용하는 정식 요소 중 상세 사용 기준이 없는 항목을 먼저 정리한다.",
    "2. 검토 단계 요소는 실제 사용 화면이 생길 때 원본·상태·사용 위치를 확인하고 정식 여부를 판정한다.",
    "3. 화면 구성을 실제 사용 빈도순으로 상세화한다.",
    "4. 새 자산·테스트·기준 이미지가 바뀌면 이전 통과 기록을 현재 결과로 재사용하지 않는다.",
    "",
    "## 판정 범위",
    "",
    "- `동작·화면 기준 있음`은 등록 정보, 동작 검사와 저장소에 연결된 시각 기준이 있다는 뜻이다.",
    "- 실제 Figma 원본과의 최종 픽셀 확인은 화면별 대조가 끝난 경우에만 별도로 완료 처리한다.",
    "- 모바일은 사용자 결정에 따라 추후 진행 상태이며, 이번 웹 후속 작업의 우선순위에는 포함하지 않는다.",
    "",
    `AI가 읽는 원장: \`component-library/src/design-system/registry/web-verification-audit.json\``,
    "",
  ];
  return lines.join("\n");
}

const mode = process.argv[2];
const audit = buildAudit();
const json = `${JSON.stringify(audit, null, 2)}\n`;
const markdown = renderMarkdown(audit);

if (mode === "--write") {
  fs.writeFileSync(jsonOutputPath, json, "utf8");
  fs.writeFileSync(markdownOutputPath, markdown, "utf8");
  console.log(`[web:audit] 원장 갱신 · components ${audit.summary.components.total} · patterns ${audit.summary.patterns.total} · screens ${audit.summary.screens.total}`);
} else if (mode === "--check") {
  const currentJson = fs.existsSync(jsonOutputPath) ? fs.readFileSync(jsonOutputPath, "utf8") : "";
  const currentMarkdown = fs.existsSync(markdownOutputPath) ? fs.readFileSync(markdownOutputPath, "utf8") : "";
  if (!generatedTextMatches(currentJson, json) || !generatedTextMatches(currentMarkdown, markdown)) {
    console.error("웹 UI 전수검증 원장이 현재 코드와 다릅니다. npm run audit:web-coverage를 실행하세요.");
    process.exitCode = 1;
  } else {
    console.log(`[web:audit] 원장 정상 · components ${audit.summary.components.total} · patterns ${audit.summary.patterns.total} · screens ${audit.summary.screens.total}`);
  }
} else {
  console.error("사용법: node scripts/audit-web-verification-coverage.mjs --write|--check");
  process.exitCode = 1;
}
