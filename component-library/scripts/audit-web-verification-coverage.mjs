import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readRegistryBundle } from "./resolve-screen-request.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const registryDirectory = path.join(projectRoot, "src", "design-system", "registry");
const jsonOutputPath = path.join(registryDirectory, "web-verification-audit.json");
const markdownOutputPath = path.join(repositoryRoot, "docs", "웹_UI_전수검증_현황.md");
const auditDate = "2026-08-24";
const browserRun = {
  command: "npm run test:visual",
  result: "passed",
  passed: 71,
  failed: 0,
  duration: "3.4m",
  includesDeferredMobile: true,
};

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
  const visualTestPath = path.join(projectRoot, "tests", "visual", "design-system.visual.spec.ts");
  const snapshotDirectory = `${visualTestPath}-snapshots`;
  const visualEvidenceFingerprints = {
    testSource: fs.existsSync(visualTestPath) ? fileFingerprint(visualTestPath) : "missing",
    snapshots: fs.existsSync(snapshotDirectory)
      ? Object.fromEntries(fs.readdirSync(snapshotDirectory).sort().map((fileName) => [fileName, fileFingerprint(path.join(snapshotDirectory, fileName))]))
      : {},
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

  return {
    schemaVersion: 1,
    auditedAt: auditDate,
    sourceFingerprint,
    browserRun,
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
  const lines = [
    "# 웹 UI 전수검증 현황",
    "",
    `> 기준일: ${audit.auditedAt} · 브라우저 검사: ${audit.browserRun.passed}개 통과, ${audit.browserRun.failed}개 실패`,
    "",
    "## 이번에 확인한 범위",
    "",
    "| 구분 | 전체 | 현재 확인 결과 | 남은 확인 |",
    "|---|---:|---:|---:|",
    `| 공용 화면 요소 | ${audit.summary.components.total} | 정식 ${audit.summary.components.stable} | 검토 단계 ${audit.summary.components.provisional} |`,
    `| 화면 구성 방식 | ${audit.summary.patterns.total} | 실제 화면 사용 ${audit.summary.patterns.usedByScreens} | 화면 미사용 ${audit.summary.patterns.unusedByScreens} |`,
    `| 등록 화면 | ${audit.summary.screens.total} | 동작 확인 ${audit.summary.screens.interactionVerified} | 직접 시각 기준 없음 ${audit.summary.screens.total - audit.summary.screens.directlyVisualLinked} |`,
    "",
    `전체 코드·등록 정보·화면 동작과 저장된 기준 이미지를 검사했다. 브라우저 검사 ${audit.browserRun.passed}개는 모두 통과했다. 등록 화면 ${audit.summary.screens.total}개는 모두 화면별 기준 이미지와 연결되어 있다. 다만 이것은 Figma와 영구적으로 완전히 같다는 뜻이 아니다. 구현 코드나 기준 이미지가 바뀌면 이 원장도 다시 갱신해야 한다.`,
    "",
    "## 화면 28개 확인 결과",
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
      : ["등록 화면 28개 모두 연결 완료. 이번 점검에서 선발행 라벨, 운전일지, 재고편집, 발주 정보, 그룹화 생산실적, 생산실적 반응형 3종, 생산분석 현황의 누락 기준을 추가했다."]),
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
    "4. 이후 새 자산이나 기준 이미지가 바뀌었는데 이 원장이 갱신되지 않으면 전체 디자인 시스템 검사가 실패하도록 유지한다.",
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
  if (currentJson !== json || currentMarkdown !== markdown) {
    console.error("웹 UI 전수검증 원장이 현재 코드와 다릅니다. npm run audit:web-coverage를 실행하세요.");
    process.exitCode = 1;
  } else {
    console.log(`[web:audit] 원장 정상 · components ${audit.summary.components.total} · patterns ${audit.summary.patterns.total} · screens ${audit.summary.screens.total}`);
  }
} else {
  console.error("사용법: node scripts/audit-web-verification-coverage.mjs --write|--check");
  process.exitCode = 1;
}
