import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const root = process.cwd();
const registryDirectory = join(root, "src", "design-system", "registry");
const readJson = (name) => JSON.parse(readFileSync(join(registryDirectory, name), "utf8"));

const componentRegistry = readJson("components.json");
const patternRegistry = readJson("patterns.json");
const screenRegistry = readJson("screens.json");
const visualRegistry = readJson("visual-regression.json");
const sourceAssetRegistry = readJson("source-assets.json");
const sourceEvidenceRegistry = readJson("source-evidence.json");
const generatedScreenRegistry = readJson("generated-screen-evaluations.json");
patternRegistry.patterns.push(...sourceAssetRegistry.patterns);
screenRegistry.screens.push(...sourceAssetRegistry.screens);
const errors = [];

function checkVersion(name, registry) {
  if (registry.schemaVersion !== 1) errors.push(`${name}: schemaVersion은 1이어야 합니다.`);
}

function mapByUniqueId(name, entries) {
  const map = new Map();
  for (const entry of entries) {
    if (!entry.id) {
      errors.push(`${name}: id가 없는 항목이 있습니다.`);
      continue;
    }
    if (map.has(entry.id)) errors.push(`${name}: 중복 id '${entry.id}'`);
    map.set(entry.id, entry);
  }
  return map;
}

function checkSource(name, entry) {
  if (!entry.source || !existsSync(join(root, entry.source))) {
    errors.push(`${name} '${entry.id}': source '${entry.source ?? ""}'가 존재하지 않습니다.`);
  }
}

checkVersion("components", componentRegistry);
checkVersion("patterns", patternRegistry);
checkVersion("screens", screenRegistry);
checkVersion("visual-regression", visualRegistry);
checkVersion("source-assets", sourceAssetRegistry);
checkVersion("source-evidence", sourceEvidenceRegistry);
checkVersion("generated-screen-evaluations", generatedScreenRegistry);

const components = mapByUniqueId("components", componentRegistry.components ?? []);
const patterns = mapByUniqueId("patterns", patternRegistry.patterns ?? []);
const screens = mapByUniqueId("screens", screenRegistry.screens ?? []);
const visualCases = mapByUniqueId("visual-regression", visualRegistry.cases ?? []);
const sourceEvidence = mapByUniqueId("source-evidence", sourceEvidenceRegistry.sources ?? []);
const generatedCandidates = mapByUniqueId("generated-screen-evaluations", generatedScreenRegistry.candidates ?? []);

const allowedEvidenceStatuses = new Set(["queued", "in-progress", "verified"]);
const allowedCandidateStatuses = new Set(["partial-success", "review", "approved", "rejected", "archived"]);
const requiredQualityGates = ["designContext", "metadataLedger", "componentMapping", "browserMeasurement", "interactionTest", "visualBaseline"];
const figmaNodes = new Set();
for (const source of sourceEvidence.values()) {
  if (!/^\d+:\d+$/.test(source.figmaNode ?? "")) errors.push(`source-evidence '${source.id}': figmaNode 형식이 잘못되었습니다.`);
  if (figmaNodes.has(source.figmaNode)) errors.push(`source-evidence: 중복 figmaNode '${source.figmaNode}'`);
  figmaNodes.add(source.figmaNode);
  if (!allowedEvidenceStatuses.has(source.status)) errors.push(`source-evidence '${source.id}': 알 수 없는 status '${source.status}'`);
  if (!source.normalizedTarget) errors.push(`source-evidence '${source.id}': normalizedTarget이 필요합니다.`);
  if (!Array.isArray(source.notes) || source.notes.length === 0) errors.push(`source-evidence '${source.id}': notes가 필요합니다.`);
  for (const gate of requiredQualityGates) {
    if (typeof source.qualityGates?.[gate] !== "boolean") errors.push(`source-evidence '${source.id}': qualityGates.${gate}는 boolean이어야 합니다.`);
  }
  if (source.status === "verified") {
    const incomplete = requiredQualityGates.filter((gate) => source.qualityGates?.[gate] !== true);
    if (incomplete.length > 0) errors.push(`source-evidence '${source.id}': verified 상태인데 미통과 게이트가 있습니다 (${incomplete.join(", ")}).`);
    if (!source.visualCaseId) errors.push(`source-evidence '${source.id}': verified 상태에는 visualCaseId가 필요합니다.`);
    else if (!visualCases.has(source.visualCaseId)) errors.push(`source-evidence '${source.id}': 미등록 visualCaseId '${source.visualCaseId}'를 참조합니다.`);
  }
}

for (const candidate of generatedCandidates.values()) {
  checkSource("generated candidate", candidate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.createdAt ?? "")) errors.push(`generated candidate '${candidate.id}': createdAt은 YYYY-MM-DD 형식이어야 합니다.`);
  if (!/^\d+:\d+$/.test(candidate.figmaNode ?? "")) errors.push(`generated candidate '${candidate.id}': figmaNode 형식이 잘못되었습니다.`);
  if (!candidate.route?.startsWith("/")) errors.push(`generated candidate '${candidate.id}': route는 '/'로 시작해야 합니다.`);
  if (!allowedCandidateStatuses.has(candidate.status)) errors.push(`generated candidate '${candidate.id}': 알 수 없는 status '${candidate.status}'`);
  if (!Number.isInteger(candidate.score) || candidate.score < 0 || candidate.score > 100) errors.push(`generated candidate '${candidate.id}': score는 0~100 정수여야 합니다.`);
  if (!Array.isArray(candidate.strengths) || candidate.strengths.length === 0) errors.push(`generated candidate '${candidate.id}': strengths가 필요합니다.`);
  if (!Array.isArray(candidate.issues) || candidate.issues.length === 0) errors.push(`generated candidate '${candidate.id}': issues가 필요합니다.`);
  if (!Array.isArray(candidate.promotionCriteria) || candidate.promotionCriteria.length === 0) errors.push(`generated candidate '${candidate.id}': promotionCriteria가 필요합니다.`);
  if (candidate.status !== "approved") {
    if (candidate.influence !== "quarantined") errors.push(`generated candidate '${candidate.id}': 미승인 후보는 influence가 quarantined여야 합니다.`);
    const registeredPattern = [...patterns.values()].find((pattern) => pattern.source === candidate.source);
    const registeredScreen = [...screens.values()].find((screen) => screen.source === candidate.source);
    if (registeredPattern) errors.push(`generated candidate '${candidate.id}': 미승인 후보 source가 표준 pattern '${registeredPattern.id}'에 등록되어 있습니다.`);
    if (registeredScreen) errors.push(`generated candidate '${candidate.id}': 미승인 후보 source가 표준 screen '${registeredScreen.id}'에 등록되어 있습니다.`);
  }
}

for (const component of components.values()) checkSource("component", component);
for (const pattern of patterns.values()) {
  checkSource("pattern", pattern);
  for (const componentId of pattern.requiredComponents ?? []) {
    if (!components.has(componentId)) {
      errors.push(`pattern '${pattern.id}': 미등록 component '${componentId}'를 참조합니다.`);
    }
  }
}
for (const screen of screens.values()) {
  checkSource("screen", screen);
  if (!patterns.has(screen.patternId)) {
    errors.push(`screen '${screen.id}': 미등록 pattern '${screen.patternId}'를 참조합니다.`);
  }
}
for (const visualCase of visualRegistry.cases ?? []) {
  if (!visualCase.route?.startsWith("/")) {
    errors.push(`visual case '${visualCase.id}': route는 '/'로 시작해야 합니다.`);
  }
  if (!visualCase.snapshot?.endsWith(".png")) {
    errors.push(`visual case '${visualCase.id}': snapshot은 png 파일이어야 합니다.`);
  }
  if (!visualCase.screenId && !visualCase.patternId && !visualCase.candidateId) {
    errors.push(`visual case '${visualCase.id}': screenId, patternId 또는 candidateId가 필요합니다.`);
  }
  if (visualCase.screenId && !screens.has(visualCase.screenId)) {
    errors.push(`visual case '${visualCase.id}': 미등록 screen '${visualCase.screenId}'를 참조합니다.`);
  }
  if (visualCase.patternId && !patterns.has(visualCase.patternId)) {
    errors.push(`visual case '${visualCase.id}': 미등록 pattern '${visualCase.patternId}'를 참조합니다.`);
  }
  if (visualCase.candidateId && !generatedCandidates.has(visualCase.candidateId)) {
    errors.push(`visual case '${visualCase.id}': 미등록 candidate '${visualCase.candidateId}'를 참조합니다.`);
  }
}

const uiDirectory = join(root, "src", "components", "ui");
const activeUiSources = readdirSync(uiDirectory)
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => relative(root, join(uiDirectory, name)).replaceAll("\\", "/"));
const registeredSources = new Set([...components.values()].map((entry) => entry.source));

for (const source of activeUiSources) {
  if (!registeredSources.has(source)) {
    errors.push(`component registry: 활성 UI 파일 '${source}'가 등록되지 않았습니다.`);
  }
}
for (const component of components.values()) {
  if (component.source.startsWith("src/components/ui/") && !activeUiSources.includes(component.source)) {
    errors.push(`component '${component.id}': 비활성 또는 잘못된 UI source '${component.source}'`);
  }
  if (basename(component.source, ".tsx") !== component.id && !["grid-container", "icon-button", "list", "sticky-header-footer"].includes(component.id)) {
    errors.push(`component '${component.id}': 파일명과 id가 다릅니다 (${component.source}).`);
  }
}

const visualKinds = new Set(
  (visualRegistry.cases ?? []).map((item) => {
    if (item.screenId) return patterns.get(screens.get(item.screenId)?.patternId)?.kind;
    return patterns.get(item.patternId)?.kind;
  })
);
if (!visualKinds.has("popup")) errors.push("visual-regression: 대표 popup case가 필요합니다.");
if (!visualKinds.has("table")) errors.push("visual-regression: 대표 table case가 필요합니다.");

if (errors.length > 0) {
  console.error(["Design system registry check failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
  process.exit(1);
}

console.log(
  `Design system registry check passed: ${components.size} components, ${patterns.size} patterns, ${screens.size} screens, ${visualRegistry.cases.length} visual cases, ${sourceEvidence.size} source references, ${generatedCandidates.size} generated candidates.`
);
