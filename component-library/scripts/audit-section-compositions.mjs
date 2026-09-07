import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generatedTextMatches } from "./generated-text.mjs";

const root = process.cwd();
const registryDirectory = join(root, "src", "design-system", "registry");
const outputPath = join(registryDirectory, "section-composition-audit.json");
const mode = process.argv.includes("--write") ? "write" : process.argv.includes("--check") ? "check" : "print";

const readJson = (name) => JSON.parse(readFileSync(join(registryDirectory, name), "utf8"));
const normalizePath = (value) => value.replaceAll("\\", "/");
const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "ko"));

function buildAudit() {
  const patternRegistry = readJson("patterns.json");
  const screenRegistry = readJson("screens.json");
  const sourceAssets = readJson("source-assets.json");
  const patternContracts = readJson("pattern-contracts.json");
  const screenSpecs = readJson("screen-specs.json");
  const sourceEvidence = readJson("source-evidence.json");
  const webUsage = readJson("web-ui-usage-inventory.json");
  const compositionInventory = readJson("composition-inventory.json");

  const patterns = [...patternRegistry.patterns, ...sourceAssets.patterns];
  const screens = [...screenRegistry.screens, ...sourceAssets.screens];
  const sectionPatterns = patterns.filter((entry) => entry.kind === "section-pattern");
  const contractByPattern = new Map(patternContracts.contracts.map((entry) => [entry.patternId, entry]));
  const specByScreen = new Map(screenSpecs.specs.map((entry) => [entry.screenId, entry]));
  const sourceEvidenceByNode = new Map(sourceEvidence.sources.map((entry) => [entry.figmaNode, entry]));
  const inventoryBySource = new Map(compositionInventory.files.map((entry) => [normalizePath(entry.source), entry]));

  const screenEntries = screens.map((screen) => {
    const sectionPatternRefs = screen.patternRefs.filter((patternRef) => sectionPatterns.some((pattern) => pattern.id === patternRef));
    const spec = specByScreen.get(screen.id);
    const evidence = screen.figmaNode ? sourceEvidenceByNode.get(screen.figmaNode) : undefined;
    const webPages = webUsage.pages.filter((page) => page.registeredScreenId === screen.id).map((page) => page.id);
    const webFlows = webUsage.entryFlows.filter((flow) => flow.registeredScreenId === screen.id).map((flow) => flow.id);
    const localRule = screen.stateRules.find((rule) => /로컬 조합|공용 패턴이 아니다/.test(rule));
    const source = normalizePath(screen.source);
    const codeInventory = inventoryBySource.get(source);
    const structureLevel = spec
      ? "detailed-screen-spec"
      : sectionPatternRefs.length > 0
        ? "section-pattern-mapped"
        : localRule
          ? "screen-local-explicit"
          : "unresolved";

    return {
      screenId: screen.id,
      name: screen.name,
      source,
      figma: screen.figmaNode
        ? {
            node: screen.figmaNode,
            evidenceLevel: evidence ? "source-evidence-recorded" : "registered-reference-only",
            sourceEvidenceId: evidence?.id ?? null,
            sourceEvidenceStatus: evidence?.status ?? null,
          }
        : null,
      webEvidence: {
        role: "reference-only",
        pageIds: webPages,
        flowIds: webFlows,
      },
      codeEvidence: {
        inventoryTracked: Boolean(codeInventory),
        detectedSectionSignals: codeInventory?.sectionCandidateSignals ?? [],
        detectedSectionTitles: codeInventory?.sectionTitles ?? [],
      },
      structureLevel,
      sectionPatternRefs,
      detailedSections: spec?.sections.map((section) => ({
        id: section.id,
        title: section.title ?? null,
        patternRef: section.patternRef,
        supportingPatternRefs: section.supportingPatternRefs ?? [],
        componentRefs: section.componentRefs,
        behaviorRefs: section.behaviorRefs,
        scrollOwner: section.scrollOwner,
      })) ?? [],
      localComposition: localRule ? { scope: "screen-local", reason: localRule } : null,
    };
  });

  const sectionEntries = sectionPatterns.map((pattern) => {
    const contract = contractByPattern.get(pattern.id);
    const usedByScreens = screenEntries.filter((screen) => screen.sectionPatternRefs.includes(pattern.id)).map((screen) => screen.screenId);
    const directCodeSources = compositionInventory.files
      .filter((file) => file.sectionCandidateSignals.includes(pattern.id))
      .map((file) => file.source);
    return {
      patternId: pattern.id,
      name: pattern.name,
      source: normalizePath(pattern.source),
      placement: pattern.placement ?? "section",
      requiredComponents: pattern.requiredComponents,
      selectionContext: contract
        ? {
            useWhen: contract.useWhen,
            doNotUseWhen: contract.doNotUseWhen,
            constraints: contract.constraints,
            evidence: contract.evidence,
          }
        : null,
      compositionContract: contract
        ? {
            slots: contract.slots,
            stateModel: contract.stateModel,
            behaviorTargets: contract.behaviorTargets,
            scrollOwner: contract.scrollOwner,
            implementationMarkers: contract.implementationMarkers,
          }
        : null,
      usedByScreens,
      detectedCodeSources: unique(directCodeSources),
    };
  });

  const unresolvedScreens = screenEntries.filter((entry) => entry.structureLevel === "unresolved").map((entry) => entry.screenId);
  const missingContracts = sectionEntries.filter((entry) => entry.selectionContext === null).map((entry) => entry.patternId);
  const untrackedCodeSources = screenEntries.filter((entry) => !entry.codeEvidence.inventoryTracked).map((entry) => entry.source);
  const audit = {
    schemaVersion: 1,
    policyId: "mes.section-composition-census",
    status: "structured-reference",
    purpose: "컴포넌트와 화면 사이의 반복 섹션 조합, 화면 전용 조합, 선택 맥락과 근거를 한 번에 조회한다.",
    authority: {
      currentCode: "implementation",
      figma: "design-source-or-registered-reference",
      web: "reference-only",
      rules: [
        "반복되는 의미·배치·행동이 확인된 조합만 공통 section-pattern으로 유지한다.",
        "한 화면에서만 확인된 조합은 화면 전용 조합으로 기록하고 공통 규칙으로 승격하지 않는다.",
        "Figma node가 등록되어 있어도 source-evidence가 없으면 검증 완료로 해석하지 않는다.",
        "실제 MES 웹 관찰은 사용 맥락 참고 자료이며 Figma와 현재 디자인 시스템을 덮어쓰지 않는다.",
      ],
    },
    summary: {
      registeredSectionPatterns: sectionEntries.length,
      sectionPatternsWithSelectionContext: sectionEntries.filter((entry) => entry.selectionContext !== null).length,
      registeredScreens: screenEntries.length,
      screensWithDetailedSpec: screenEntries.filter((entry) => entry.structureLevel === "detailed-screen-spec").length,
      screensMappedBySectionPattern: screenEntries.filter((entry) => entry.structureLevel === "section-pattern-mapped").length,
      screensWithExplicitLocalComposition: screenEntries.filter((entry) => entry.structureLevel === "screen-local-explicit").length,
      unresolvedScreens: unresolvedScreens.length,
      figmaSourceEvidenceRecorded: screenEntries.filter((entry) => entry.figma?.evidenceLevel === "source-evidence-recorded").length,
      figmaReferencesOnly: screenEntries.filter((entry) => entry.figma?.evidenceLevel === "registered-reference-only").length,
      webReferencedScreens: screenEntries.filter((entry) => entry.webEvidence.pageIds.length > 0 || entry.webEvidence.flowIds.length > 0).length,
      codeInventoryTrackedScreens: screenEntries.filter((entry) => entry.codeEvidence.inventoryTracked).length,
    },
    gaps: {
      missingSectionContracts: missingContracts,
      unresolvedScreens,
      codeSourcesOutsideCompositionInventory: unique(untrackedCodeSources),
      note: "상세 ScreenSpec가 없는 화면은 section-pattern 연결까지만 구조화된 상태이며 픽셀 검증 완료를 뜻하지 않는다.",
    },
    sectionPatterns: sectionEntries,
    screens: screenEntries,
  };
  const fingerprint = createHash("sha256").update(JSON.stringify(audit)).digest("hex").slice(0, 16);
  return { ...audit, fingerprint };
}

const audit = buildAudit();
const output = `${JSON.stringify(audit, null, 2)}\n`;

if (mode === "write") {
  writeFileSync(outputPath, output, "utf8");
  console.log(`Section composition audit updated: ${audit.summary.registeredSectionPatterns} patterns, ${audit.summary.registeredScreens} screens, ${audit.fingerprint}`);
} else if (mode === "check") {
  const errors = [];
  if (!existsSync(outputPath) || !generatedTextMatches(readFileSync(outputPath, "utf8"), output)) {
    errors.push("section-composition-audit.json이 현재 원장 및 코드와 다릅니다. npm run audit:section-compositions를 실행하세요.");
  }
  if (audit.gaps.missingSectionContracts.length > 0) errors.push(`선택 맥락 계약이 없는 section-pattern: ${audit.gaps.missingSectionContracts.join(", ")}`);
  if (audit.gaps.unresolvedScreens.length > 0) errors.push(`공통 또는 화면 전용 섹션 조합이 없는 화면: ${audit.gaps.unresolvedScreens.join(", ")}`);
  if (audit.gaps.codeSourcesOutsideCompositionInventory.length > 0) errors.push(`조합 코드 전수조사 범위 밖 화면 소스: ${audit.gaps.codeSourcesOutsideCompositionInventory.join(", ")}`);
  if (errors.length > 0) {
    console.error(["Section composition audit failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
    process.exit(1);
  }
  console.log(`Section composition audit passed: ${audit.summary.registeredSectionPatterns} patterns, ${audit.summary.registeredScreens} screens, ${audit.fingerprint}`);
} else {
  console.log(JSON.stringify({ summary: audit.summary, gaps: audit.gaps }, null, 2));
}
