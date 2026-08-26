import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const root = process.cwd();
const registryDirectory = join(root, "src", "design-system", "registry");
const readJson = (name) => JSON.parse(readFileSync(join(registryDirectory, name), "utf8"));

const componentRegistry = readJson("components.json");
const componentCatalogRegistry = readJson("component-catalog.json");
const patternRegistry = readJson("patterns.json");
const screenRegistry = readJson("screens.json");
const visualRegistry = readJson("visual-regression.json");
const sourceAssetRegistry = readJson("source-assets.json");
const sourceEvidenceRegistry = readJson("source-evidence.json");
const generatedScreenRegistry = readJson("generated-screen-evaluations.json");
const generatedScreenLifecycleRegistry = readJson("generated-screen-lifecycle.json");
const compositionPolicyRegistry = readJson("composition-policy.json");
const compositionShellLedgerRegistry = readJson("composition-shell-ledger.json");
const compositionSectionFrameLedgerRegistry = readJson("composition-section-frame-ledger.json");
const compositionSectionPatternLedgerRegistry = readJson("composition-section-pattern-ledger.json");
const compositionBehaviorLedgerRegistry = readJson("composition-behavior-ledger.json");
const sectionPatternProposalRegistry = readJson("section-pattern-proposals.json");
const behaviorPatternProposalRegistry = readJson("behavior-pattern-proposals.json");
const actionSetRegistry = readJson("action-sets.json");
const interactionAuditRegistry = readJson("interaction-audit.json");
const completionPolicyRegistry = readJson("completion-policy.json");
const footerActionAuditRegistry = readJson("footer-action-audit.json");
const contextRuleRegistry = readJson("context-rules.json");
const generationTemplateRegistry = readJson("generation-templates.json");
const mobileAssetRegistry = readJson("mobile-assets.json");
const mobileVerificationRegistry = readJson("mobile-verification-contracts.json");
const componentUsageContractRegistry = readJson("component-usage-contracts.json");
const patternContractRegistry = readJson("pattern-contracts.json");
const screenSpecRegistry = readJson("screen-specs.json");
const webUiUsageInventoryRegistry = readJson("web-ui-usage-inventory.json");
const webFigmaReconciliationRegistry = readJson("web-figma-reconciliation.json");
const webGenerationContextRegistry = readJson("web-generation-context.json");
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
checkVersion("component-catalog", componentCatalogRegistry);
checkVersion("patterns", patternRegistry);
checkVersion("screens", screenRegistry);
checkVersion("visual-regression", visualRegistry);
checkVersion("source-assets", sourceAssetRegistry);
checkVersion("source-evidence", sourceEvidenceRegistry);
checkVersion("generated-screen-evaluations", generatedScreenRegistry);
checkVersion("generated-screen-lifecycle", generatedScreenLifecycleRegistry);
checkVersion("composition-policy", compositionPolicyRegistry);
checkVersion("composition-shell-ledger", compositionShellLedgerRegistry);
checkVersion("composition-section-frame-ledger", compositionSectionFrameLedgerRegistry);
checkVersion("composition-section-pattern-ledger", compositionSectionPatternLedgerRegistry);
checkVersion("composition-behavior-ledger", compositionBehaviorLedgerRegistry);
checkVersion("section-pattern-proposals", sectionPatternProposalRegistry);
checkVersion("behavior-pattern-proposals", behaviorPatternProposalRegistry);
checkVersion("action-sets", actionSetRegistry);
checkVersion("interaction-audit", interactionAuditRegistry);
checkVersion("completion-policy", completionPolicyRegistry);
checkVersion("footer-action-audit", footerActionAuditRegistry);
checkVersion("context-rules", contextRuleRegistry);
checkVersion("generation-templates", generationTemplateRegistry);
checkVersion("mobile-assets", mobileAssetRegistry);
checkVersion("mobile-verification-contracts", mobileVerificationRegistry);
checkVersion("component-usage-contracts", componentUsageContractRegistry);
checkVersion("pattern-contracts", patternContractRegistry);
checkVersion("screen-specs", screenSpecRegistry);
checkVersion("web-ui-usage-inventory", webUiUsageInventoryRegistry);
checkVersion("web-figma-reconciliation", webFigmaReconciliationRegistry);
checkVersion("web-generation-context", webGenerationContextRegistry);

const mobileAssets = new Set([
  ...(mobileAssetRegistry.foundations ?? []).map((entry) => entry.id),
  ...(mobileAssetRegistry.components ?? []).map((entry) => entry.id),
  ...(mobileAssetRegistry.patterns ?? []).map((entry) => entry.id),
  ...((mobileAssetRegistry.screenTypes?.main?.types ?? []).map((entry) => `mobile.screen.main.${entry.name}`)),
  ...((mobileAssetRegistry.screenTypes?.slidePopup?.types ?? []).map((name) => `mobile.screen.slide-popup.${name}`)),
]);

const mobileVerificationFrames = mapByUniqueId("mobile-verification-contracts", mobileVerificationRegistry.frames ?? []);
const mobileSnapshotDirectory = join(root, "tests", "visual", "mobile-design-system.spec.ts-snapshots");
const mobileSnapshots = existsSync(mobileSnapshotDirectory) ? readdirSync(mobileSnapshotDirectory) : [];
const allowedLayerStatuses = new Set(["verified", "reviewing"]);
const approvalMaxDiffPixelRatio = mobileVerificationRegistry.policy?.raster?.approvalMaxDiffPixelRatio;

if (mobileVerificationRegistry.policy?.raster?.figmaExportScale !== 2 || mobileVerificationRegistry.policy?.raster?.browserDeviceScaleFactor !== 2) {
  errors.push("mobile-verification-contracts: Figma와 Chromium 비교 배율은 모두 2여야 합니다.");
}
if (typeof approvalMaxDiffPixelRatio !== "number" || approvalMaxDiffPixelRatio <= 0) {
  errors.push("mobile-verification-contracts: raster 승인 상한이 필요합니다.");
}
for (const frame of mobileVerificationFrames.values()) {
  if (!frame.node || !frame.path || !frame.frameSelector) errors.push(`mobile-verification '${frame.id}': node, path, frameSelector가 필요합니다.`);
  if (!Array.isArray(frame.structure) || frame.structure.length === 0) errors.push(`mobile-verification '${frame.id}': 구조 계약이 필요합니다.`);
  if (!Array.isArray(frame.interactions) || frame.interactions.length === 0) errors.push(`mobile-verification '${frame.id}': 동작 계약이 필요합니다.`);

  const snapshotPrefix = frame.raster?.snapshot?.replace(/\.png$/, "");
  if (!snapshotPrefix || !mobileSnapshots.some((file) => file.startsWith(snapshotPrefix) && file.endsWith(".png"))) {
    errors.push(`mobile-verification '${frame.id}': 2x Figma snapshot '${frame.raster?.snapshot ?? ""}'이 없습니다.`);
  }

  for (const layer of ["structural", "raster", "interaction"]) {
    if (!allowedLayerStatuses.has(frame.verification?.[layer])) errors.push(`mobile-verification '${frame.id}': ${layer} 상태가 잘못되었습니다.`);
  }
  if (frame.verification?.raster === "verified") {
    if (typeof frame.raster?.measurementMaxDiffPixelRatio !== "number" || frame.raster.measurementMaxDiffPixelRatio > approvalMaxDiffPixelRatio || frame.verification?.overall !== "verified") {
      errors.push(`mobile-verification '${frame.id}': raster 승인 프레임은 1% 상한과 overall verified를 만족해야 합니다.`);
    }
  } else if (typeof frame.raster?.diffPixelRatio !== "number" || frame.raster.diffPixelRatio <= approvalMaxDiffPixelRatio || frame.verification?.overall !== "implemented-reviewing") {
    errors.push(`mobile-verification '${frame.id}': raster 검토 프레임은 측정값과 reviewing overall을 유지해야 합니다.`);
  }
}

const mobileMainFrames = new Map((mobileAssetRegistry.sourceFrames?.main ?? []).map((frame) => [frame.verificationContract, frame]));
for (const frame of mobileVerificationFrames.values()) {
  const asset = mobileMainFrames.get(frame.id);
  if (!asset) errors.push(`mobile-assets: verificationContract '${frame.id}' 연결이 없습니다.`);
  else if (asset.status !== frame.verification.overall) errors.push(`mobile-assets '${frame.id}': 상태가 검증 계약과 다릅니다.`);
}

const actionSets = mapByUniqueId("action-sets", actionSetRegistry.actionSets ?? []);
for (const actionSet of actionSets.values()) {
  if (!Array.isArray(actionSet.labels) || !Array.isArray(actionSet.states) || actionSet.states.length === 0) errors.push(`action-set '${actionSet.id}': labels와 states가 필요합니다.`);
  if (actionSet.layout === "none" && actionSet.labels.length !== 0) errors.push(`action-set '${actionSet.id}': none layout은 labels가 없어야 합니다.`);
  if (actionSet.layout === "single" && actionSet.labels.length !== 1) errors.push(`action-set '${actionSet.id}': single layout은 label 1개여야 합니다.`);
  if (actionSet.layout === "paired" && actionSet.labels.length !== 2) errors.push(`action-set '${actionSet.id}': paired layout은 label 2개여야 합니다.`);
}

if (compositionPolicyRegistry.policyId !== "mes.ai-composition-grammar") errors.push("composition-policy: policyId가 잘못되었습니다.");
if (compositionPolicyRegistry.status !== "active") errors.push("composition-policy: status는 active여야 합니다.");
const requiredCompositionLayers = ["component", "context-rule", "shell", "section-frame", "section-pattern", "behavior-pattern", "recipe-archetype", "screen-spec"];
const compositionLayers = new Set((compositionPolicyRegistry.layers ?? []).map((layer) => layer.id));
for (const layer of requiredCompositionLayers) {
  if (!compositionLayers.has(layer)) errors.push(`composition-policy: 필수 layer '${layer}'가 없습니다.`);
}
for (const hold of compositionPolicyRegistry.migrationHolds ?? []) {
  if (!["resolved", "closed-no-action"].includes(hold.status) || !hold.decision) errors.push(`composition-policy: migration '${hold.id}'는 종결 상태와 decision이 필요합니다.`);
}

if (compositionShellLedgerRegistry.status !== "observed-not-canonical") errors.push("composition-shell-ledger: status는 observed-not-canonical이어야 합니다.");
const shellRecipes = mapByUniqueId("composition-shell-ledger", compositionShellLedgerRegistry.recipes ?? []);
if (compositionShellLedgerRegistry.summary?.resolvedRecipes !== shellRecipes.size) errors.push("composition-shell-ledger: summary.resolvedRecipes와 실제 recipe 수가 다릅니다.");
const allowedShellIds = new Set(["center-modal", "side-slide-panel", "confirm-dialog"]);
for (const recipe of shellRecipes.values()) {
  checkSource("composition shell recipe", recipe);
  if (!allowedShellIds.has(recipe.shell)) errors.push(`composition-shell-ledger '${recipe.id}': 알 수 없는 shell '${recipe.shell}'`);
  if (!recipe.title || !recipe.size || !recipe.content || !recipe.actionSet) errors.push(`composition-shell-ledger '${recipe.id}': title, size, content, actionSet이 필요합니다.`);
}

if (compositionSectionFrameLedgerRegistry.status !== "observed-not-canonical") errors.push("composition-section-frame-ledger: status는 observed-not-canonical이어야 합니다.");
const sectionFrames = mapByUniqueId("composition-section-frame-ledger", compositionSectionFrameLedgerRegistry.frames ?? []);
if (compositionSectionFrameLedgerRegistry.summary?.logicalFrames !== sectionFrames.size) errors.push("composition-section-frame-ledger: summary.logicalFrames와 실제 frame 수가 다릅니다.");
const allowedHeadingMechanisms = new Set(["section-band", "section-header", "text", "interactive", "none"]);
const headingMechanismCounts = {};
let generatedCandidateFrameCount = 0;
for (const frame of sectionFrames.values()) {
  checkSource("composition section frame", frame);
  if (!frame.recipe || !frame.frameRole || !frame.boundaryMechanism || !frame.candidateDisposition) errors.push(`composition-section-frame-ledger '${frame.id}': recipe, frameRole, boundaryMechanism, candidateDisposition이 필요합니다.`);
  if (!allowedHeadingMechanisms.has(frame.headingMechanism)) errors.push(`composition-section-frame-ledger '${frame.id}': 알 수 없는 headingMechanism '${frame.headingMechanism}'`);
  headingMechanismCounts[frame.headingMechanism] = (headingMechanismCounts[frame.headingMechanism] ?? 0) + 1;
  if (frame.evidenceStatus === "generated-candidate") generatedCandidateFrameCount += 1;
}
for (const [mechanism, count] of Object.entries(compositionSectionFrameLedgerRegistry.summary?.byHeadingMechanism ?? {})) {
  if (headingMechanismCounts[mechanism] !== count) errors.push(`composition-section-frame-ledger: heading '${mechanism}' 요약 ${count}건과 실제 ${headingMechanismCounts[mechanism] ?? 0}건이 다릅니다.`);
}
if (compositionSectionFrameLedgerRegistry.summary?.unframedBodies !== (compositionSectionFrameLedgerRegistry.unframedBodies ?? []).length) errors.push("composition-section-frame-ledger: summary.unframedBodies와 실제 수가 다릅니다.");
if (compositionSectionFrameLedgerRegistry.summary?.generatedCandidateFrames !== generatedCandidateFrameCount) errors.push("composition-section-frame-ledger: summary.generatedCandidateFrames와 실제 수가 다릅니다.");

if (compositionSectionPatternLedgerRegistry.status !== "observed-not-canonical") errors.push("composition-section-pattern-ledger: status는 observed-not-canonical이어야 합니다.");
const sectionPatternCandidates = mapByUniqueId("composition-section-pattern-ledger", compositionSectionPatternLedgerRegistry.candidates ?? []);
if (compositionSectionPatternLedgerRegistry.summary?.candidateFamilies !== sectionPatternCandidates.size) errors.push("composition-section-pattern-ledger: summary.candidateFamilies와 실제 후보 수가 다릅니다.");
const allowedSectionPatternStatuses = new Set(["compose-candidate", "decomposed"]);
let confirmedSectionPatternFamilies = 0;
let decomposedSectionPatternFamilies = 0;
const falsePositiveSources = new Set();
for (const candidate of sectionPatternCandidates.values()) {
  if (!allowedSectionPatternStatuses.has(candidate.status)) errors.push(`composition-section-pattern-ledger '${candidate.id}': 알 수 없는 status '${candidate.status}'`);
  if (!candidate.decision || !Array.isArray(candidate.variants) || candidate.variants.length === 0) errors.push(`composition-section-pattern-ledger '${candidate.id}': decision과 variants가 필요합니다.`);
  for (const source of candidate.confirmedSources ?? []) checkSource("composition section pattern", { id: candidate.id, source });
  for (const source of candidate.falsePositiveSources ?? []) {
    checkSource("composition section pattern false positive", { id: candidate.id, source });
    falsePositiveSources.add(source);
  }
  for (const source of candidate.specialPurposeSources ?? []) checkSource("composition section pattern special purpose", { id: candidate.id, source });
  for (const source of candidate.uiOnlySources ?? []) checkSource("composition section pattern ui-only", { id: candidate.id, source });
  if (candidate.status === "compose-candidate") confirmedSectionPatternFamilies += 1;
  if (candidate.status === "decomposed") decomposedSectionPatternFamilies += 1;
}
if (compositionSectionPatternLedgerRegistry.summary?.confirmedFamilies !== confirmedSectionPatternFamilies) errors.push("composition-section-pattern-ledger: summary.confirmedFamilies가 실제 수와 다릅니다.");
if (compositionSectionPatternLedgerRegistry.summary?.decomposedFamilies !== decomposedSectionPatternFamilies) errors.push("composition-section-pattern-ledger: summary.decomposedFamilies가 실제 수와 다릅니다.");
if (compositionSectionPatternLedgerRegistry.summary?.falsePositiveFindings !== falsePositiveSources.size) errors.push("composition-section-pattern-ledger: summary.falsePositiveFindings가 고유 오탐 source 수와 다릅니다.");
const summarySubtypeIds = mapByUniqueId("composition-section-pattern-ledger summary subtype", compositionSectionPatternLedgerRegistry.summarySubtypes ?? []);
for (const subtype of summarySubtypeIds.values()) {
  for (const source of subtype.sources ?? []) checkSource("composition summary subtype", { id: subtype.id, source });
}

if (compositionBehaviorLedgerRegistry.status !== "observed-not-canonical") errors.push("composition-behavior-ledger: status는 observed-not-canonical이어야 합니다.");
const behaviorCandidates = mapByUniqueId("composition-behavior-ledger", compositionBehaviorLedgerRegistry.candidates ?? []);
if (compositionBehaviorLedgerRegistry.summary?.candidateFamilies !== behaviorCandidates.size) errors.push("composition-behavior-ledger: summary.candidateFamilies와 실제 후보 수가 다릅니다.");
const allowedBehaviorStatuses = new Set(["decomposed", "verified-with-boundary", "migration-hold", "closed-local"]);
let decomposedBehaviorFamilies = 0;
let migrationHoldBehaviors = 0;
for (const candidate of behaviorCandidates.values()) {
  if (!allowedBehaviorStatuses.has(candidate.status)) errors.push(`composition-behavior-ledger '${candidate.id}': 알 수 없는 status '${candidate.status}'`);
  if (!candidate.decision || !Array.isArray(candidate.stateContract) || candidate.stateContract.length === 0) errors.push(`composition-behavior-ledger '${candidate.id}': decision과 stateContract가 필요합니다.`);
  for (const source of candidate.sources ?? []) checkSource("composition behavior", { id: candidate.id, source });
  if (candidate.status === "decomposed") decomposedBehaviorFamilies += 1;
  if (candidate.status === "migration-hold") migrationHoldBehaviors += 1;
}
if (compositionBehaviorLedgerRegistry.summary?.decomposedFamilies !== decomposedBehaviorFamilies) errors.push("composition-behavior-ledger: summary.decomposedFamilies가 실제 수와 다릅니다.");
if (compositionBehaviorLedgerRegistry.summary?.migrationHolds !== migrationHoldBehaviors) errors.push("composition-behavior-ledger: summary.migrationHolds가 실제 수와 다릅니다.");
const selectionSubtypeIds = mapByUniqueId("composition-behavior-ledger selection subtype", compositionBehaviorLedgerRegistry.selectionSubtypes ?? []);
for (const subtype of selectionSubtypeIds.values()) {
  for (const source of subtype.sources ?? []) checkSource("composition selection subtype", { id: subtype.id, source });
}
const dismissAudits = mapByUniqueId("composition-behavior-ledger dismiss audit", compositionBehaviorLedgerRegistry.dismissAudits ?? []);
let verifiedShellDismissSources = 0;
for (const audit of dismissAudits.values()) {
  checkSource("composition dismiss audit", audit);
  if (audit.result.startsWith("verified")) verifiedShellDismissSources += 1;
}
if (compositionBehaviorLedgerRegistry.summary?.verifiedShellDismissSources !== verifiedShellDismissSources) errors.push("composition-behavior-ledger: summary.verifiedShellDismissSources가 실제 수와 다릅니다.");
const rowMutationAudits = mapByUniqueId("composition-behavior-ledger row mutation audit", compositionBehaviorLedgerRegistry.rowMutationAudits ?? []);
for (const audit of rowMutationAudits.values()) checkSource("composition row mutation audit", audit);

const proposalRegistries = [
  ["section-pattern-proposals", sectionPatternProposalRegistry],
  ["behavior-pattern-proposals", behaviorPatternProposalRegistry],
];
for (const [name, registry] of proposalRegistries) {
  if (!["proposed-not-approved", "partially-approved", "resolved"].includes(registry.status)) errors.push(`${name}: 알 수 없는 status '${registry.status}'입니다.`);
  if (!existsSync(join(registryDirectory, registry.sourceLedger ?? ""))) errors.push(`${name}: sourceLedger '${registry.sourceLedger ?? ""}'가 존재하지 않습니다.`);
  const proposals = mapByUniqueId(name, registry.proposals ?? []);
  const holds = mapByUniqueId(`${name} holds`, registry.holds ?? []);
  for (const proposal of proposals.values()) {
    if (proposal.approvalRequired !== true) errors.push(`${name} '${proposal.id}': approvalRequired는 true여야 합니다.`);
    if (!Array.isArray(proposal.owns) || proposal.owns.length === 0 || !Array.isArray(proposal.forbidden) || proposal.forbidden.length === 0) errors.push(`${name} '${proposal.id}': owns와 forbidden이 필요합니다.`);
    for (const evidence of proposal.evidence ?? []) {
      checkSource(`${name} evidence`, { id: proposal.id, source: evidence.source });
      if (!/^\d+:\d+$/.test(evidence.figmaNode ?? "")) errors.push(`${name} '${proposal.id}': figmaNode '${evidence.figmaNode ?? ""}' 형식이 잘못되었습니다.`);
    }
    for (const source of proposal.evidenceSources ?? []) checkSource(`${name} evidence`, { id: proposal.id, source });
  }
  for (const hold of holds.values()) {
    if (!hold.reason) errors.push(`${name} hold '${hold.id}': reason이 필요합니다.`);
    if (registry.status === "resolved" && !hold.resolution) errors.push(`${name} hold '${hold.id}': resolved 상태에서는 resolution이 필요합니다.`);
    if (proposals.has(hold.id)) errors.push(`${name}: '${hold.id}'가 proposal과 hold에 동시에 있습니다.`);
  }
  const approvedIds = registry.approval?.approvedProposalIds ?? [];
  if (registry.status === "partially-approved" && approvedIds.length === 0) errors.push(`${name}: partially-approved 상태에는 approvedProposalIds가 필요합니다.`);
  for (const id of approvedIds) {
    if (!proposals.has(id)) errors.push(`${name}: 승인 ID '${id}'가 proposal에 없습니다.`);
    if (holds.has(id)) errors.push(`${name}: 승인 ID '${id}'가 hold에도 있습니다.`);
  }
  if (registry.status === "resolved") {
    const unresolved = [...proposals.values()].filter((proposal) => !approvedIds.includes(proposal.id) && !proposal.resolution).map((proposal) => proposal.id);
    if (unresolved.length > 0) errors.push(`${name}: 미해결 proposal ${unresolved.join(", ")}`);
  }
}

const components = mapByUniqueId("components", componentRegistry.components ?? []);
const componentCatalogGroups = mapByUniqueId("component-catalog groups", componentCatalogRegistry.groups ?? []);
const componentCatalogIds = new Set();
const documentedComponentIds = new Set();
for (const group of componentCatalogGroups.values()) {
  if (!group.label || !group.labelEn || !group.description) errors.push(`component-catalog group '${group.id}': label, labelEn, description이 필요합니다.`);
  if (!Array.isArray(group.itemIds) || group.itemIds.length === 0) errors.push(`component-catalog group '${group.id}': itemIds가 필요합니다.`);
  for (const itemId of group.itemIds ?? []) {
    if (componentCatalogIds.has(itemId)) errors.push(`component-catalog: 중복 item '${itemId}'`);
    componentCatalogIds.add(itemId);
    const registryId = componentCatalogRegistry.registryAliases?.[itemId] ?? itemId;
    if (!components.has(registryId)) errors.push(`component-catalog '${itemId}': 미등록 component '${registryId}'를 참조합니다.`);
    else documentedComponentIds.add(registryId);
  }
}
for (const [componentId, component] of components) {
  if (component.documentationRoute?.startsWith("/components/") && !documentedComponentIds.has(componentId)) {
    errors.push(`component-catalog: 문서 경로가 있는 component '${componentId}'가 카탈로그에 없습니다.`);
  }
}
const patterns = mapByUniqueId("patterns", patternRegistry.patterns ?? []);
const screens = mapByUniqueId("screens", screenRegistry.screens ?? []);
const generationTemplates = mapByUniqueId("generation-templates", generationTemplateRegistry.templates ?? []);
const visualCases = mapByUniqueId("visual-regression", visualRegistry.cases ?? []);
const sourceEvidence = mapByUniqueId("source-evidence", sourceEvidenceRegistry.sources ?? []);
const footerActionAudits = mapByUniqueId("footer-action-audit", (footerActionAuditRegistry.entries ?? []).map((entry) => ({ ...entry, id: entry.sourceEvidenceId })));
const generatedCandidates = mapByUniqueId("generated-screen-evaluations", generatedScreenRegistry.candidates ?? []);
const interactionAudits = mapByUniqueId("interaction-audit", (interactionAuditRegistry.screens ?? []).map((entry) => ({ ...entry, id: entry.screenId })));
const componentUsageContracts = mapByUniqueId("component-usage-contracts", (componentUsageContractRegistry.contracts ?? []).map((entry) => ({ ...entry, id: entry.componentId })));
const patternContracts = mapByUniqueId("pattern-contracts", (patternContractRegistry.contracts ?? []).map((entry) => ({ ...entry, id: entry.patternId })));
const screenSpecs = mapByUniqueId("screen-specs", (screenSpecRegistry.specs ?? []).map((entry) => ({ ...entry, id: entry.screenId })));
const webUsageArchetypes = mapByUniqueId("web-ui-usage-inventory archetypes", webUiUsageInventoryRegistry.archetypes ?? []);
const webUsagePages = mapByUniqueId("web-ui-usage-inventory pages", webUiUsageInventoryRegistry.pages ?? []);
const webUsageFlows = mapByUniqueId("web-ui-usage-inventory entry flows", webUiUsageInventoryRegistry.entryFlows ?? []);
const webUsageConnections = mapByUniqueId("web-ui-usage-inventory connections", webUiUsageInventoryRegistry.connectedObservations ?? []);
const webUsageDiscrepancies = mapByUniqueId("web-ui-usage-inventory discrepancies", webUiUsageInventoryRegistry.discrepancies ?? []);

if (webUiUsageInventoryRegistry.status !== "observed-in-progress") errors.push("web-ui-usage-inventory: status는 observed-in-progress여야 합니다.");
if (webUiUsageInventoryRegistry.usagePolicy?.authority !== "observed-not-canonical") errors.push("web-ui-usage-inventory: 실제 웹 관찰값은 observed-not-canonical이어야 합니다.");
if (webUiUsageInventoryRegistry.source?.mode !== "read-only-ui-inspection") errors.push("web-ui-usage-inventory: source.mode는 read-only-ui-inspection이어야 합니다.");
if (!/^\d{4}-\d{2}-\d{2}$/.test(webUiUsageInventoryRegistry.auditedAt ?? "")) errors.push("web-ui-usage-inventory: auditedAt은 YYYY-MM-DD 형식이어야 합니다.");
if (!Array.isArray(webUiUsageInventoryRegistry.usagePolicy?.rules) || webUiUsageInventoryRegistry.usagePolicy.rules.length === 0) errors.push("web-ui-usage-inventory: 관찰값의 사용 제한 규칙이 필요합니다.");
if (webUiUsageInventoryRegistry.coverage?.mainMenuPagesObserved !== webUsagePages.size) errors.push("web-ui-usage-inventory: coverage.mainMenuPagesObserved가 pages 개수와 다릅니다.");
if (webUiUsageInventoryRegistry.coverage?.primaryEntryFlowsObserved !== webUsageFlows.size) errors.push("web-ui-usage-inventory: coverage.primaryEntryFlowsObserved가 entryFlows 개수와 다릅니다.");
if (webUiUsageInventoryRegistry.coverage?.connectedResultsObserved !== webUsageConnections.size) errors.push("web-ui-usage-inventory: coverage.connectedResultsObserved가 connectedObservations 개수와 다릅니다.");
if (!Array.isArray(webUiUsageInventoryRegistry.coverage?.remaining) || webUiUsageInventoryRegistry.coverage.remaining.length === 0) errors.push("web-ui-usage-inventory: in-progress 상태에는 remaining이 필요합니다.");

const allowedFigmaSourceClassifications = new Set(["source-located-latest", "source-located-revision", "source-not-located"]);
const webFigmaPages = new Map();
for (const page of webFigmaReconciliationRegistry.pages ?? []) {
  if (!page.pageId) errors.push("web-figma-reconciliation: pageId가 없는 항목이 있습니다.");
  else if (webFigmaPages.has(page.pageId)) errors.push(`web-figma-reconciliation: 중복 pageId '${page.pageId}'`);
  else webFigmaPages.set(page.pageId, page);
  if (!allowedFigmaSourceClassifications.has(page.classification)) errors.push(`web-figma-reconciliation '${page.pageId}': 알 수 없는 classification '${page.classification}'`);
  if (!Array.isArray(page.figmaEvidence) || !Array.isArray(page.notes)) errors.push(`web-figma-reconciliation '${page.pageId}': figmaEvidence와 notes 배열이 필요합니다.`);
  if (page.classification === "source-not-located" && page.figmaEvidence?.length !== 0) errors.push(`web-figma-reconciliation '${page.pageId}': source-not-located에는 Figma evidence가 없어야 합니다.`);
  if (page.classification !== "source-not-located" && page.figmaEvidence?.length === 0) errors.push(`web-figma-reconciliation '${page.pageId}': 원본 위치 확인 상태에는 Figma evidence가 필요합니다.`);
  for (const evidence of page.figmaEvidence ?? []) {
    if (!/^\d+:\d+$/.test(evidence.nodeId ?? "") || !evidence.name || !evidence.role) errors.push(`web-figma-reconciliation '${page.pageId}': Figma evidence 형식이 잘못되었습니다.`);
  }
}
if (webFigmaReconciliationRegistry.status !== "reference-in-progress") errors.push("web-figma-reconciliation: status는 reference-in-progress여야 합니다.");
if (!/^\d{4}-\d{2}-\d{2}$/.test(webFigmaReconciliationRegistry.auditedAt ?? "")) errors.push("web-figma-reconciliation: auditedAt은 YYYY-MM-DD 형식이어야 합니다.");
if (!/^\d+:\d+$/.test(webFigmaReconciliationRegistry.authorities?.canonicalFigmaPage?.pageId ?? "")) errors.push("web-figma-reconciliation: canonical Figma page ID가 필요합니다.");
if (!/^\d+:\d+$/.test(webFigmaReconciliationRegistry.authorities?.historicalFigmaPage?.pageId ?? "")) errors.push("web-figma-reconciliation: historical Figma page ID가 필요합니다.");
if (!Array.isArray(webFigmaReconciliationRegistry.authorities?.rules) || webFigmaReconciliationRegistry.authorities.rules.length === 0) errors.push("web-figma-reconciliation: 권한 판단 규칙이 필요합니다.");
if (!Array.isArray(webFigmaReconciliationRegistry.structuralFindings) || webFigmaReconciliationRegistry.structuralFindings.length === 0) errors.push("web-figma-reconciliation: 구조적 발견 사항이 필요합니다.");
if (!Array.isArray(webFigmaReconciliationRegistry.remaining) || webFigmaReconciliationRegistry.remaining.length === 0) errors.push("web-figma-reconciliation: reference-in-progress 상태에는 remaining이 필요합니다.");
for (const pageId of webUsagePages.keys()) if (!webFigmaPages.has(pageId)) errors.push(`web-figma-reconciliation: 실제 웹 page '${pageId}'의 대조 항목이 없습니다.`);
for (const pageId of webFigmaPages.keys()) if (!webUsagePages.has(pageId)) errors.push(`web-figma-reconciliation: 미등록 실제 웹 page '${pageId}'를 참조합니다.`);
const figmaClassificationCounts = Object.fromEntries([...allowedFigmaSourceClassifications].map((classification) => [classification, [...webFigmaPages.values()].filter((page) => page.classification === classification).length]));
if (webFigmaReconciliationRegistry.coverage?.runtimePages !== webUsagePages.size) errors.push("web-figma-reconciliation: coverage.runtimePages가 실제 웹 pages 개수와 다릅니다.");
if (webFigmaReconciliationRegistry.coverage?.sourceLocatedLatest !== figmaClassificationCounts["source-located-latest"]) errors.push("web-figma-reconciliation: coverage.sourceLocatedLatest가 분류 개수와 다릅니다.");
if (webFigmaReconciliationRegistry.coverage?.sourceLocatedRevision !== figmaClassificationCounts["source-located-revision"]) errors.push("web-figma-reconciliation: coverage.sourceLocatedRevision이 분류 개수와 다릅니다.");
if (webFigmaReconciliationRegistry.coverage?.sourceNotLocated !== figmaClassificationCounts["source-not-located"]) errors.push("web-figma-reconciliation: coverage.sourceNotLocated가 분류 개수와 다릅니다.");
if (webFigmaReconciliationRegistry.coverage?.pixelVerified !== 0 || webFigmaReconciliationRegistry.coverage?.interactionVerifiedAgainstFigma !== 0) errors.push("web-figma-reconciliation: 이번 참고 대조에서는 픽셀·상호작용 검증을 0으로 유지해야 합니다.");

const webGenerationPageArchetypes = mapByUniqueId("web-generation-context page archetypes", webGenerationContextRegistry.pageArchetypes ?? []);
const webGenerationOverlayGrammars = mapByUniqueId("web-generation-context overlay grammars", webGenerationContextRegistry.overlayGrammars ?? []);
const webGenerationSectionRecipes = mapByUniqueId("web-generation-context section recipes", webGenerationContextRegistry.sectionRecipes ?? []);
const webGenerationBehaviorRules = mapByUniqueId("web-generation-context behavior rules", webGenerationContextRegistry.behaviorRules ?? []);
const allowedGenerationSurfaces = new Set(["page", "center-modal", "side-slide-panel", "confirm-dialog"]);
if (webGenerationContextRegistry.status !== "generation-guidance") errors.push("web-generation-context: status는 generation-guidance여야 합니다.");
if (webGenerationContextRegistry.sourceInventory !== "web-ui-usage-inventory.json") errors.push("web-generation-context: sourceInventory가 실제 웹 관찰 원장을 가리켜야 합니다.");
if (webGenerationContextRegistry.policy?.authority !== "observed-generation-guidance") errors.push("web-generation-context: authority는 observed-generation-guidance여야 합니다.");
if (JSON.stringify(webGenerationContextRegistry.policy?.appliesTo) !== JSON.stringify(["new"])) errors.push("web-generation-context: 신규 UI 생성에만 적용되어야 합니다.");
for (const field of ["priority", "rules", "excludedFromGeneration"]) {
  if (!Array.isArray(webGenerationContextRegistry.policy?.[field]) || webGenerationContextRegistry.policy[field].length === 0) errors.push(`web-generation-context: policy.${field}가 필요합니다.`);
}
if (!Array.isArray(webGenerationContextRegistry.decisionOrder) || webGenerationContextRegistry.decisionOrder.length < 4) errors.push("web-generation-context: 생성 판단 순서가 필요합니다.");
if ("figmaReconciliation" in webGenerationContextRegistry || "pixelVerified" in webGenerationContextRegistry) errors.push("web-generation-context: 재현·감사 전용 필드가 섞였습니다.");

const checkGenerationConfidence = (entry, evidenceCount) => {
  if (!['repeated', 'single-case'].includes(entry.confidence)) errors.push(`web-generation-context '${entry.id}': confidence가 잘못되었습니다.`);
  if (entry.confidence === "repeated" && evidenceCount < 2) errors.push(`web-generation-context '${entry.id}': repeated에는 2건 이상의 근거가 필요합니다.`);
  if (entry.confidence === "single-case" && evidenceCount !== 1) errors.push(`web-generation-context '${entry.id}': single-case는 근거가 정확히 1건이어야 합니다.`);
  if (entry.evidenceCount !== evidenceCount) errors.push(`web-generation-context '${entry.id}': evidenceCount가 실제 근거 수와 다릅니다.`);
};
const checkGenerationPatternRefs = (entry, refs) => {
  for (const patternId of refs ?? []) if (!patterns.has(patternId)) errors.push(`web-generation-context '${entry.id}': 미등록 pattern '${patternId}'를 참조합니다.`);
};

for (const entry of webGenerationPageArchetypes.values()) {
  const evidenceCount = [...webUsagePages.values()].filter((page) => page.archetypeRef === entry.observedArchetypeRef).length;
  checkGenerationConfidence(entry, evidenceCount);
  if (!webUsageArchetypes.has(entry.observedArchetypeRef)) errors.push(`web-generation-context '${entry.id}': 미등록 observed archetype '${entry.observedArchetypeRef}'를 참조합니다.`);
  for (const field of ["useWhen", "doNotUseWhen", "regionOrder"]) if (!Array.isArray(entry[field]) || entry[field].length === 0) errors.push(`web-generation-context '${entry.id}': ${field}가 필요합니다.`);
  checkGenerationPatternRefs(entry, entry.patternRefs);
  for (const componentId of entry.componentRefs ?? []) if (!components.has(componentId)) errors.push(`web-generation-context '${entry.id}': 미등록 component '${componentId}'를 참조합니다.`);
}
for (const entry of webGenerationOverlayGrammars.values()) {
  checkGenerationConfidence(entry, entry.evidenceFlowIds?.length ?? 0);
  if (!Array.isArray(entry.surfaceSequence) || entry.surfaceSequence.length === 0 || entry.surfaceSequence.some((surface) => !allowedGenerationSurfaces.has(surface))) errors.push(`web-generation-context '${entry.id}': surfaceSequence가 잘못되었습니다.`);
  for (const field of ["useWhen", "doNotUseWhen"]) if (!Array.isArray(entry[field]) || entry[field].length === 0) errors.push(`web-generation-context '${entry.id}': ${field}가 필요합니다.`);
  if (entry.shellRef && patterns.get(entry.shellRef)?.kind !== "shell") errors.push(`web-generation-context '${entry.id}': shellRef '${entry.shellRef}'가 shell이 아닙니다.`);
  checkGenerationPatternRefs(entry, [...(entry.recipeRefs ?? []), ...(entry.requiredBehaviors ?? [])]);
  for (const flowId of entry.evidenceFlowIds ?? []) if (!webUsageFlows.has(flowId)) errors.push(`web-generation-context '${entry.id}': 미등록 flow '${flowId}'를 참조합니다.`);
}
for (const entry of webGenerationSectionRecipes.values()) {
  checkGenerationConfidence(entry, entry.evidenceFlowIds?.length ?? 0);
  if (!Array.isArray(entry.sectionOrder) || entry.sectionOrder.length === 0 || !Array.isArray(entry.useWhen) || entry.useWhen.length === 0) errors.push(`web-generation-context '${entry.id}': sectionOrder와 useWhen이 필요합니다.`);
  checkGenerationPatternRefs(entry, entry.patternRefs);
  for (const flowId of entry.evidenceFlowIds ?? []) if (!webUsageFlows.has(flowId)) errors.push(`web-generation-context '${entry.id}': 미등록 flow '${flowId}'를 참조합니다.`);
}
for (const entry of webGenerationBehaviorRules.values()) {
  if (!['system-rule', 'single-case'].includes(entry.confidence)) errors.push(`web-generation-context '${entry.id}': behavior confidence가 잘못되었습니다.`);
  if (!Array.isArray(entry.useWhen) || entry.useWhen.length === 0 || !entry.rule) errors.push(`web-generation-context '${entry.id}': useWhen과 rule이 필요합니다.`);
  checkGenerationPatternRefs(entry, entry.behaviorRefs);
  for (const connectionId of entry.evidenceConnectionIds ?? []) if (!webUsageConnections.has(connectionId)) errors.push(`web-generation-context '${entry.id}': 미등록 connection '${connectionId}'를 참조합니다.`);
}
const generationCoverage = webGenerationContextRegistry.coverage ?? {};
if (generationCoverage.observedPages !== webUsagePages.size || generationCoverage.observedPrimaryFlows !== webUsageFlows.size) errors.push("web-generation-context: 관찰 범위 수치가 원본 인벤토리와 다릅니다.");
if (generationCoverage.repeatedPageArchetypes !== [...webGenerationPageArchetypes.values()].filter((entry) => entry.confidence === "repeated").length) errors.push("web-generation-context: repeated page archetype 수가 다릅니다.");
if (generationCoverage.singleCasePageArchetypes !== [...webGenerationPageArchetypes.values()].filter((entry) => entry.confidence === "single-case").length) errors.push("web-generation-context: single-case page archetype 수가 다릅니다.");
if (generationCoverage.repeatedOverlayGrammars !== [...webGenerationOverlayGrammars.values()].filter((entry) => entry.confidence === "repeated").length) errors.push("web-generation-context: repeated overlay grammar 수가 다릅니다.");
if (generationCoverage.singleCaseOverlayGrammars !== [...webGenerationOverlayGrammars.values()].filter((entry) => entry.confidence === "single-case").length) errors.push("web-generation-context: single-case overlay grammar 수가 다릅니다.");
if (!Array.isArray(generationCoverage.remainingObservation) || generationCoverage.remainingObservation.length === 0) errors.push("web-generation-context: 남은 웹 관찰 범위가 필요합니다.");

for (const archetype of webUsageArchetypes.values()) {
  if (archetype.status !== "observed-not-canonical") errors.push(`web usage archetype '${archetype.id}': status가 잘못되었습니다.`);
  if (!archetype.name || !Array.isArray(archetype.regions) || archetype.regions.length === 0) errors.push(`web usage archetype '${archetype.id}': name과 regions가 필요합니다.`);
  for (const componentId of archetype.componentRefs ?? []) if (!components.has(componentId)) errors.push(`web usage archetype '${archetype.id}': 미등록 component '${componentId}'를 참조합니다.`);
}

for (const page of webUsagePages.values()) {
  if (!webUsageArchetypes.has(page.archetypeRef)) errors.push(`web usage page '${page.id}': 미등록 archetype '${page.archetypeRef}'를 참조합니다.`);
  if (!Array.isArray(page.navigation) || page.navigation.length < 2) errors.push(`web usage page '${page.id}': 2단계 이상의 navigation이 필요합니다.`);
  if (!Number.isInteger(page.tableHeaderCount) || page.tableHeaderCount < 0) errors.push(`web usage page '${page.id}': tableHeaderCount가 잘못되었습니다.`);
  if (!Array.isArray(page.entryActions)) errors.push(`web usage page '${page.id}': entryActions 배열이 필요합니다.`);
  if (page.registeredScreenId && !screens.has(page.registeredScreenId)) errors.push(`web usage page '${page.id}': 미등록 screen '${page.registeredScreenId}'를 참조합니다.`);
}

const allowedObservedSurfaces = new Set(["page", "center-modal", "side-slide-panel", "confirm-dialog"]);
const allowedWidthBases = new Set(["content", "viewport", "fixed"]);
const allowedWidthUnits = new Set(["percent", "px"]);
for (const flow of webUsageFlows.values()) {
  const page = webUsagePages.get(flow.pageId);
  if (!page) errors.push(`web usage flow '${flow.id}': 미등록 page '${flow.pageId}'를 참조합니다.`);
  if (!flow.trigger || !Array.isArray(flow.steps) || flow.steps.length === 0) errors.push(`web usage flow '${flow.id}': trigger와 한 개 이상의 step이 필요합니다.`);
  if (flow.registeredScreenId && !screens.has(flow.registeredScreenId)) errors.push(`web usage flow '${flow.id}': 미등록 screen '${flow.registeredScreenId}'를 참조합니다.`);
  if (page?.registeredScreenId && flow.registeredScreenId && page.registeredScreenId !== flow.registeredScreenId) errors.push(`web usage flow '${flow.id}': page와 registeredScreenId가 다릅니다.`);
  for (const [index, step] of (flow.steps ?? []).entries()) {
    if (!allowedObservedSurfaces.has(step.surface) || !step.title) errors.push(`web usage flow '${flow.id}' step ${index + 1}: surface 또는 title이 잘못되었습니다.`);
    if (!allowedWidthBases.has(step.width?.basis) || !allowedWidthUnits.has(step.width?.unit) || !(step.width?.value > 0)) errors.push(`web usage flow '${flow.id}' step ${index + 1}: width가 잘못되었습니다.`);
    if (!Array.isArray(step.sectionTitles) || !Array.isArray(step.componentRefs)) errors.push(`web usage flow '${flow.id}' step ${index + 1}: sectionTitles와 componentRefs 배열이 필요합니다.`);
    for (const componentId of step.componentRefs ?? []) if (!components.has(componentId)) errors.push(`web usage flow '${flow.id}' step ${index + 1}: 미등록 component '${componentId}'를 참조합니다.`);
  }
}

for (const connection of webUsageConnections.values()) {
  if (!webUsageFlows.has(connection.fromFlowId)) errors.push(`web usage connection '${connection.id}': 미등록 flow '${connection.fromFlowId}'를 참조합니다.`);
  if (!connection.trigger || !connection.reason || !allowedObservedSurfaces.has(connection.observedResult?.surface)) errors.push(`web usage connection '${connection.id}': trigger, reason, observedResult가 필요합니다.`);
}
for (const discrepancy of webUsageDiscrepancies.values()) {
  if (!discrepancy.subject || !discrepancy.observedRuntime || !discrepancy.designSystemExpectation || !discrepancy.classification) errors.push(`web usage discrepancy '${discrepancy.id}': 비교 근거가 부족합니다.`);
}

for (const contract of componentUsageContracts.values()) {
  if (!components.has(contract.componentId)) errors.push(`component-usage-contract '${contract.componentId}': 미등록 component를 참조합니다.`);
  for (const field of ["capabilities", "variants", "requiredStates", "useWhen", "doNotUseWhen", "allowedParents", "constraints", "accessibility", "evidence"]) {
    if (!Array.isArray(contract[field]) || contract[field].length === 0) errors.push(`component-usage-contract '${contract.componentId}': ${field}가 필요합니다.`);
  }
  for (const parentId of contract.allowedParents ?? []) {
    if (!patterns.has(parentId)) errors.push(`component-usage-contract '${contract.componentId}': 미등록 parent pattern '${parentId}'를 참조합니다.`);
  }
  for (const screenId of contract.evidence ?? []) {
    if (!screens.has(screenId)) errors.push(`component-usage-contract '${contract.componentId}': 미등록 evidence screen '${screenId}'를 참조합니다.`);
  }
  if (!Array.isArray(contract.alternatives)) errors.push(`component-usage-contract '${contract.componentId}': alternatives 배열이 필요합니다.`);
  for (const alternative of contract.alternatives ?? []) {
    if (!components.has(alternative.componentId) || !alternative.chooseInsteadWhen) errors.push(`component-usage-contract '${contract.componentId}': alternative '${alternative.componentId ?? ""}'가 잘못되었습니다.`);
  }
}

const allowedContractScrollOwners = new Set(["shell-body", "section", "table", "none"]);
for (const contract of patternContracts.values()) {
  if (!patterns.has(contract.patternId)) errors.push(`pattern-contract '${contract.patternId}': 미등록 pattern을 참조합니다.`);
  for (const field of ["slots", "stateModel", "behaviorTargets", "allowedActionSets", "useWhen", "doNotUseWhen", "constraints", "evidence", "goldenScreenIds", "implementationMarkers"]) {
    if (!Array.isArray(contract[field])) errors.push(`pattern-contract '${contract.patternId}': ${field} 배열이 필요합니다.`);
  }
  if (!Array.isArray(contract.stateModel) || contract.stateModel.length === 0 || !Array.isArray(contract.useWhen) || contract.useWhen.length === 0 || !Array.isArray(contract.doNotUseWhen) || contract.doNotUseWhen.length === 0 || !Array.isArray(contract.constraints) || contract.constraints.length === 0 || !Array.isArray(contract.implementationMarkers) || contract.implementationMarkers.length === 0) {
    errors.push(`pattern-contract '${contract.patternId}': 상태·사용/금지·제약·구현 marker가 필요합니다.`);
  }
  if (!allowedContractScrollOwners.has(contract.scrollOwner)) errors.push(`pattern-contract '${contract.patternId}': scrollOwner '${contract.scrollOwner}'가 잘못되었습니다.`);
  const slotIds = new Set();
  for (const slot of contract.slots ?? []) {
    if (!slot.id || slotIds.has(slot.id) || typeof slot.required !== "boolean" || !Array.isArray(slot.accepts) || slot.accepts.length === 0) errors.push(`pattern-contract '${contract.patternId}': slot '${slot.id ?? ""}'가 잘못되었습니다.`);
    slotIds.add(slot.id);
  }
  for (const actionSetId of contract.allowedActionSets ?? []) if (!actionSets.has(actionSetId)) errors.push(`pattern-contract '${contract.patternId}': 미등록 action-set '${actionSetId}'를 참조합니다.`);
  for (const screenId of [...(contract.evidence ?? []), ...(contract.goldenScreenIds ?? [])]) if (!screens.has(screenId)) errors.push(`pattern-contract '${contract.patternId}': 미등록 screen '${screenId}'를 참조합니다.`);
}

const targetShells = { page: null, "center-modal": "shell.center-modal", "side-slide-panel": "shell.side-slide-panel", "confirm-dialog": "shell.confirm-dialog" };
for (const spec of screenSpecs.values()) {
  const screen = screens.get(spec.screenId);
  if (!screen) {
    errors.push(`screen-spec '${spec.screenId}': 미등록 screen을 참조합니다.`);
    continue;
  }
  if (!Object.hasOwn(targetShells, spec.targetKind)) errors.push(`screen-spec '${spec.screenId}': targetKind '${spec.targetKind}'가 잘못되었습니다.`);
  if (targetShells[spec.targetKind] !== spec.shellRef) errors.push(`screen-spec '${spec.screenId}': targetKind와 shellRef가 일치하지 않습니다.`);
  if (spec.shellRef && !screen.patternRefs.includes(spec.shellRef)) errors.push(`screen-spec '${spec.screenId}': shellRef가 screen.patternRefs에 없습니다.`);
  if (!Array.isArray(spec.sections) || spec.sections.length === 0) errors.push(`screen-spec '${spec.screenId}': ordered sections가 필요합니다.`);
  const sectionIds = new Set();
  for (const section of spec.sections ?? []) {
    if (!section.id || sectionIds.has(section.id)) errors.push(`screen-spec '${spec.screenId}': section id '${section.id ?? ""}'가 없거나 중복입니다.`);
    sectionIds.add(section.id);
    if (section.slot !== "body") errors.push(`screen-spec '${spec.screenId}/${section.id}': slot은 body여야 합니다.`);
    if (!patterns.has(section.patternRef) || !screen.patternRefs.includes(section.patternRef)) errors.push(`screen-spec '${spec.screenId}/${section.id}': patternRef '${section.patternRef}'가 등록 화면에 없습니다.`);
    if (section.frameRef && (!patterns.has(section.frameRef) || !screen.patternRefs.includes(section.frameRef))) errors.push(`screen-spec '${spec.screenId}/${section.id}': frameRef '${section.frameRef}'가 등록 화면에 없습니다.`);
    for (const supportingRef of section.supportingPatternRefs ?? []) if (!patterns.has(supportingRef) || !screen.patternRefs.includes(supportingRef)) errors.push(`screen-spec '${spec.screenId}/${section.id}': supporting pattern '${supportingRef}'가 등록 화면에 없습니다.`);
    for (const componentId of section.componentRefs ?? []) if (!components.has(componentId)) errors.push(`screen-spec '${spec.screenId}/${section.id}': 미등록 component '${componentId}'를 참조합니다.`);
    for (const behaviorRef of section.behaviorRefs ?? []) if (!patterns.has(behaviorRef) || !screen.patternRefs.includes(behaviorRef)) errors.push(`screen-spec '${spec.screenId}/${section.id}': behavior '${behaviorRef}'가 등록 화면에 없습니다.`);
    if (!allowedContractScrollOwners.has(section.scrollOwner)) errors.push(`screen-spec '${spec.screenId}/${section.id}': scrollOwner '${section.scrollOwner}'가 잘못되었습니다.`);
  }
  for (const behaviorRef of spec.behaviorRefs ?? []) if (!patterns.has(behaviorRef) || !screen.patternRefs.includes(behaviorRef)) errors.push(`screen-spec '${spec.screenId}': behavior '${behaviorRef}'가 등록 화면에 없습니다.`);
  if (spec.actionSetRef && (!actionSets.has(spec.actionSetRef) || !screen.patternRefs.includes(spec.actionSetRef))) errors.push(`screen-spec '${spec.screenId}': actionSetRef '${spec.actionSetRef}'가 등록 화면에 없습니다.`);
  if (!Array.isArray(spec.constraints) || spec.constraints.length === 0 || !Array.isArray(spec.evidence) || spec.evidence.length === 0) errors.push(`screen-spec '${spec.screenId}': constraints와 evidence가 필요합니다.`);
}

for (const template of generationTemplates.values()) {
  checkSource("generation template", template);
  if (!patterns.has(template.recipeRef)) errors.push(`generation template '${template.id}': 미등록 recipe '${template.recipeRef}'를 참조합니다.`);
  else if (patterns.get(template.recipeRef).kind !== "recipe") errors.push(`generation template '${template.id}': '${template.recipeRef}'는 recipe가 아닙니다.`);
  if (!Array.isArray(template.requiredPatternRefs) || template.requiredPatternRefs.length === 0) errors.push(`generation template '${template.id}': requiredPatternRefs가 필요합니다.`);
  for (const patternRef of template.requiredPatternRefs ?? []) if (!patterns.has(patternRef)) errors.push(`generation template '${template.id}': 미등록 pattern '${patternRef}'를 참조합니다.`);
  if (!template.requiredPatternRefs?.includes(template.recipeRef)) errors.push(`generation template '${template.id}': recipeRef가 requiredPatternRefs에 포함되어야 합니다.`);
  if (!Array.isArray(template.supportedSectionKinds) || template.supportedSectionKinds.length === 0) errors.push(`generation template '${template.id}': supportedSectionKinds가 필요합니다.`);
  if (template.output !== "tsx" || template.overwrite !== "forbid") errors.push(`generation template '${template.id}': output=tsx, overwrite=forbid 계약이 필요합니다.`);
}

if (contextRuleRegistry.policyId !== "mes.ai-context-rules") errors.push("context-rules: policyId가 잘못되었습니다.");
if (contextRuleRegistry.status !== "active") errors.push("context-rules: status는 active여야 합니다.");
if (!Array.isArray(contextRuleRegistry.decisionAxes) || contextRuleRegistry.decisionAxes.length === 0) errors.push("context-rules: decisionAxes가 필요합니다.");
if (!Array.isArray(contextRuleRegistry.globalGates) || contextRuleRegistry.globalGates.length === 0) errors.push("context-rules: globalGates가 필요합니다.");
const contextRules = mapByUniqueId("context-rules", contextRuleRegistry.rules ?? []);
const contextDecisions = mapByUniqueId("context-rules decisions", contextRuleRegistry.decisions ?? []);
const allowedContextCategories = new Set(["heading", "overlay-shell", "action", "input-control", "content-boundary", "data-table", "scroll-ownership"]);
const allowedContextStatuses = new Set(["active", "hold"]);
for (const rule of contextRules.values()) {
  if (!allowedContextCategories.has(rule.category)) errors.push(`context-rule '${rule.id}': 알 수 없는 category '${rule.category}'`);
  if (!allowedContextStatuses.has(rule.status)) errors.push(`context-rule '${rule.id}': 알 수 없는 status '${rule.status}'`);
  if (!rule.semanticRole || !rule.scope || !rule.requirement) errors.push(`context-rule '${rule.id}': semanticRole, scope, requirement가 필요합니다.`);
  for (const field of ["allowedParents", "useWhen", "doNotUseWhen", "relationships"]) {
    if (!Array.isArray(rule[field]) || rule[field].length === 0) errors.push(`context-rule '${rule.id}': ${field}가 필요합니다.`);
  }
  if (rule.status === "active" && (!Array.isArray(rule.implementationRefs) || rule.implementationRefs.length === 0)) {
    errors.push(`context-rule '${rule.id}': active 규칙에는 implementationRefs가 필요합니다.`);
  }
  for (const parentId of rule.allowedParents ?? []) {
    if (!patterns.has(parentId)) errors.push(`context-rule '${rule.id}': 미등록 parent pattern '${parentId}'를 참조합니다.`);
  }
  for (const reference of rule.implementationRefs ?? []) {
    if (reference.kind === "component" && !components.has(reference.id)) errors.push(`context-rule '${rule.id}': 미등록 component '${reference.id}'를 참조합니다.`);
    else if (reference.kind === "pattern" && !patterns.has(reference.id)) errors.push(`context-rule '${rule.id}': 미등록 pattern '${reference.id}'를 참조합니다.`);
    else if (reference.kind === "action-set" && !actionSets.has(reference.id)) errors.push(`context-rule '${rule.id}': 미등록 action-set '${reference.id}'를 참조합니다.`);
    else if (!["component", "pattern", "action-set"].includes(reference.kind)) errors.push(`context-rule '${rule.id}': 알 수 없는 implementation kind '${reference.kind}'`);
  }
}
for (const decision of contextDecisions.values()) {
  if (!allowedContextCategories.has(decision.category)) errors.push(`context decision '${decision.id}': 알 수 없는 category '${decision.category}'`);
  if (!Array.isArray(decision.questionOrder) || decision.questionOrder.length === 0 || !decision.fallback) errors.push(`context decision '${decision.id}': questionOrder와 fallback이 필요합니다.`);
  if (!Array.isArray(decision.optionRuleIds) || decision.optionRuleIds.length === 0) errors.push(`context decision '${decision.id}': optionRuleIds가 필요합니다.`);
  for (const ruleId of decision.optionRuleIds ?? []) {
    const rule = contextRules.get(ruleId);
    if (!rule) errors.push(`context decision '${decision.id}': 미등록 rule '${ruleId}'를 참조합니다.`);
    else if (rule.category !== decision.category) errors.push(`context decision '${decision.id}': rule '${ruleId}'의 category가 다릅니다.`);
  }
}
const requiredContextDecisions = [
  "select.heading-context",
  "select.overlay-shell",
  "select.action-role",
  "select.input-control",
  "select.content-boundary",
  "select.table-model",
  "select.scroll-owner",
];
for (const decisionId of requiredContextDecisions) {
  if (!contextDecisions.has(decisionId)) errors.push(`context-rules: 필수 decision '${decisionId}'가 없습니다.`);
}
for (const rule of contextRules.values()) {
  const owningDecisions = [...contextDecisions.values()].filter((decision) => decision.optionRuleIds?.includes(rule.id));
  if (owningDecisions.length !== 1) errors.push(`context-rule '${rule.id}': 정확히 하나의 decision에 연결되어야 합니다 (현재 ${owningDecisions.length}개).`);
}
const contextHolds = mapByUniqueId("context-rules holds", contextRuleRegistry.holds ?? []);
for (const hold of contextHolds.values()) {
  if (hold.status !== "needs-evidence" || !hold.reason || !hold.temporaryRule) errors.push(`context hold '${hold.id}': needs-evidence 상태와 reason, temporaryRule이 필요합니다.`);
  const rule = contextRules.get(hold.ruleId);
  if (!rule) errors.push(`context hold '${hold.id}': 미등록 rule '${hold.ruleId ?? ""}'를 참조합니다.`);
  else if (rule.status !== "hold") errors.push(`context hold '${hold.id}': rule '${hold.ruleId}'는 hold 상태여야 합니다.`);
}
for (const rule of contextRules.values()) {
  if (rule.status === "hold" && ![...contextHolds.values()].some((hold) => hold.ruleId === rule.id)) {
    errors.push(`context-rule '${rule.id}': hold 상태에는 연결된 hold 항목이 필요합니다.`);
  }
}

if (completionPolicyRegistry.policyId !== "mes.completion-claims") errors.push("completion-policy: policyId가 잘못되었습니다.");
if (!["in-progress", "complete"].includes(completionPolicyRegistry.projectState)) errors.push("completion-policy: projectState는 in-progress 또는 complete여야 합니다.");
const requiredCompletionTerms = ["implemented", "verified", "batch-complete", "project-complete"];
for (const term of requiredCompletionTerms) {
  if (!completionPolicyRegistry.terms?.[term]) errors.push(`completion-policy: terms.${term}이 필요합니다.`);
}
if (!Array.isArray(completionPolicyRegistry.reportingRequirements) || completionPolicyRegistry.reportingRequirements.length === 0) errors.push("completion-policy: reportingRequirements가 필요합니다.");
if (!Array.isArray(completionPolicyRegistry.projectCompletionBlockers) || completionPolicyRegistry.projectCompletionBlockers.length === 0) errors.push("completion-policy: projectCompletionBlockers가 필요합니다.");
if (!["in-progress", "verified"].includes(footerActionAuditRegistry.auditState)) errors.push("footer-action-audit: auditState는 in-progress 또는 verified여야 합니다.");
const allowedFooterAuditStatuses = new Set(["queued", "implemented-unverified", "verified", "not-applicable", "closed-unverified"]);
for (const source of sourceEvidence.values()) {
  if (!footerActionAudits.has(source.id)) errors.push(`footer-action-audit: source-evidence '${source.id}'의 하단 액션 판정이 없습니다.`);
}
for (const audit of footerActionAudits.values()) {
  const source = sourceEvidence.get(audit.sourceEvidenceId);
  if (!source) errors.push(`footer-action-audit: 미등록 source-evidence '${audit.sourceEvidenceId}'를 참조합니다.`);
  if (!allowedFooterAuditStatuses.has(audit.status)) errors.push(`footer-action-audit '${audit.sourceEvidenceId}': 알 수 없는 status '${audit.status}'`);
  if (!audit.actionSet || !audit.note) errors.push(`footer-action-audit '${audit.sourceEvidenceId}': actionSet과 note가 필요합니다.`);
  if (audit.status === "verified" && source?.status !== "verified") errors.push(`footer-action-audit '${audit.sourceEvidenceId}': source evidence가 verified가 아닌데 하단 액션을 verified로 표시했습니다.`);
}
const openFooterActionAudits = [...footerActionAudits.values()].filter((audit) => ["queued", "implemented-unverified"].includes(audit.status));
if (footerActionAuditRegistry.auditState === "verified" && openFooterActionAudits.length > 0) errors.push(`footer-action-audit: 전체 verified로 선언했지만 미검수 하단 액션이 ${openFooterActionAudits.length}건 남아 있습니다.`);

if (!/^\d{4}-\d{2}-\d{2}$/.test(interactionAuditRegistry.auditedAt ?? "")) errors.push("interaction-audit: auditedAt은 YYYY-MM-DD 형식이어야 합니다.");
for (const screen of screens.values()) {
  if (!interactionAudits.has(screen.id)) errors.push(`interaction-audit: screen '${screen.id}'의 감사 항목이 없습니다.`);
}
for (const audit of interactionAudits.values()) {
  if (!screens.has(audit.screenId)) errors.push(`interaction-audit: 미등록 screen '${audit.screenId}'를 참조합니다.`);
  if (!audit.route?.startsWith("/")) errors.push(`interaction-audit '${audit.screenId}': route는 '/'로 시작해야 합니다.`);
  if (!Array.isArray(audit.contracts) || audit.contracts.length === 0) errors.push(`interaction-audit '${audit.screenId}': contracts가 필요합니다.`);
  if (!Array.isArray(audit.tests) || audit.tests.length === 0) errors.push(`interaction-audit '${audit.screenId}': tests가 필요합니다.`);
}

for (const [name, registry] of proposalRegistries) {
  for (const id of registry.approval?.approvedProposalIds ?? []) {
    if (!patterns.has(id)) errors.push(`${name}: 승인 ID '${id}'가 정식 patterns 레지스트리에 없습니다.`);
  }
}

const allowedEvidenceStatuses = new Set(["queued", "in-progress", "verified", "deferred", "closed-unverified"]);
const allowedCandidateStatuses = new Set(["partial-success", "review", "approved", "rejected", "archived"]);
const allowedReviewStatuses = new Set(["draft", "review", "approved", "rejected", "archived"]);
const allowedPersistenceValues = new Set(["local", "git"]);
const allowedGenerationInfluences = new Set(["blocked", "reference", "standard"]);
const lifecycleStages = mapByUniqueId("generated-screen-lifecycle", generatedScreenLifecycleRegistry.stages ?? []);
for (const requiredStage of allowedReviewStatuses) {
  if (!lifecycleStages.has(requiredStage)) errors.push(`generated-screen-lifecycle: '${requiredStage}' 단계가 필요합니다.`);
}
for (const stage of lifecycleStages.values()) {
  if (!allowedPersistenceValues.has(stage.persistence)) errors.push(`generated-screen-lifecycle '${stage.id}': 알 수 없는 persistence '${stage.persistence}'`);
  if (!allowedGenerationInfluences.has(stage.generationInfluence)) errors.push(`generated-screen-lifecycle '${stage.id}': 알 수 없는 generationInfluence '${stage.generationInfluence}'`);
}
if (lifecycleStages.get("draft")?.persistence !== "local") errors.push("generated-screen-lifecycle: draft는 local이어야 합니다.");
if (lifecycleStages.get("approved")?.generationInfluence !== "standard") errors.push("generated-screen-lifecycle: approved만 standard 생성 근거가 될 수 있습니다.");
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

const openSourceEvidence = [...sourceEvidence.values()].filter((source) => ["queued", "in-progress"].includes(source.status));
const openGeneratedCandidates = [...generatedCandidates.values()].filter((candidate) => ["partial-success", "review"].includes(candidate.status));
const unresolvedProposalRegistries = proposalRegistries.filter(([, registry]) => registry.status !== "resolved");
const openCompositionFindings = [
  ...(compositionSectionFrameLedgerRegistry.findings ?? []),
  ...(compositionBehaviorLedgerRegistry.findings ?? []),
  ...Object.values(compositionBehaviorLedgerRegistry.candidates ?? {}),
].filter((finding) => ["migration-hold", "needs-review"].includes(finding.status));
const projectCompletionBlockerCount = openSourceEvidence.length + openGeneratedCandidates.length + unresolvedProposalRegistries.length + openCompositionFindings.length + openFooterActionAudits.length + contextHolds.size;
if (completionPolicyRegistry.projectState === "complete" && projectCompletionBlockerCount > 0) {
  errors.push(`completion-policy: 전체 완료로 선언했지만 미해결 근거가 ${projectCompletionBlockerCount}건 남아 있습니다.`);
}

for (const candidate of generatedCandidates.values()) {
  checkSource("generated candidate", candidate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.createdAt ?? "")) errors.push(`generated candidate '${candidate.id}': createdAt은 YYYY-MM-DD 형식이어야 합니다.`);
  if (candidate.figmaNode && !/^\d+:\d+$/.test(candidate.figmaNode)) errors.push(`generated candidate '${candidate.id}': figmaNode 형식이 잘못되었습니다.`);
  if (!candidate.route?.startsWith("/")) errors.push(`generated candidate '${candidate.id}': route는 '/'로 시작해야 합니다.`);
  if (!allowedCandidateStatuses.has(candidate.status)) errors.push(`generated candidate '${candidate.id}': 알 수 없는 status '${candidate.status}'`);
  if (!allowedPersistenceValues.has(candidate.persistence)) errors.push(`generated candidate '${candidate.id}': 알 수 없는 persistence '${candidate.persistence}'`);
  if (!allowedReviewStatuses.has(candidate.reviewStatus)) errors.push(`generated candidate '${candidate.id}': 알 수 없는 reviewStatus '${candidate.reviewStatus}'`);
  if (!allowedGenerationInfluences.has(candidate.generationInfluence)) errors.push(`generated candidate '${candidate.id}': 알 수 없는 generationInfluence '${candidate.generationInfluence}'`);
  if (candidate.persistence !== "git") errors.push(`generated candidate '${candidate.id}': tracked 검토 원장의 persistence는 git이어야 합니다.`);
  const expectedReviewStatus = candidate.status === "partial-success" ? "review" : candidate.status;
  if (candidate.reviewStatus !== expectedReviewStatus) errors.push(`generated candidate '${candidate.id}': status와 reviewStatus가 일치하지 않습니다.`);
  const expectedGenerationInfluence = candidate.status === "approved" ? "standard" : "blocked";
  if (candidate.generationInfluence !== expectedGenerationInfluence) errors.push(`generated candidate '${candidate.id}': reviewStatus에 맞지 않는 generationInfluence입니다.`);
  if ((candidate.influence === "approved") !== (candidate.generationInfluence === "standard")) errors.push(`generated candidate '${candidate.id}': legacy influence와 generationInfluence가 일치하지 않습니다.`);
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
  if (!Array.isArray(screen.patternRefs) || screen.patternRefs.length === 0) {
    errors.push(`screen '${screen.id}': patternRefs가 필요합니다.`);
    continue;
  }
  if (new Set(screen.patternRefs).size !== screen.patternRefs.length) errors.push(`screen '${screen.id}': patternRefs에 중복이 있습니다.`);
  for (const patternRef of screen.patternRefs) {
    if (!patterns.has(patternRef)) errors.push(`screen '${screen.id}': 미등록 pattern '${patternRef}'를 참조합니다.`);
  }
}
for (const visualCase of visualRegistry.cases ?? []) {
  if (!visualCase.route?.startsWith("/")) {
    errors.push(`visual case '${visualCase.id}': route는 '/'로 시작해야 합니다.`);
  }
  if (!visualCase.snapshot?.endsWith(".png")) {
    errors.push(`visual case '${visualCase.id}': snapshot은 png 파일이어야 합니다.`);
  }
  if (!visualCase.screenId && !visualCase.patternId && !visualCase.candidateId && !visualCase.mobileAssetId) {
    errors.push(`visual case '${visualCase.id}': screenId, patternId, candidateId 또는 mobileAssetId가 필요합니다.`);
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
  if (visualCase.mobileAssetId && !mobileAssets.has(visualCase.mobileAssetId)) {
    errors.push(`visual case '${visualCase.id}': 미등록 mobile asset '${visualCase.mobileAssetId}'를 참조합니다.`);
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
    if (item.screenId) return screens.get(item.screenId)?.patternRefs.map((id) => patterns.get(id)?.kind);
    return patterns.get(item.patternId)?.kind;
  }).flat()
);
if (!visualKinds.has("popup")) errors.push("visual-regression: 대표 popup case가 필요합니다.");
if (!visualKinds.has("table")) errors.push("visual-regression: 대표 table case가 필요합니다.");

if (errors.length > 0) {
  console.error(["Design system registry check failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
  process.exit(1);
}

console.log(
  `Design system registry check passed: ${components.size} components, ${patterns.size} patterns, ${screens.size} screens, ${generationTemplates.size} generation templates, ${visualRegistry.cases.length} visual cases, ${sourceEvidence.size} source references, ${generatedCandidates.size} generated candidates, ${webUsagePages.size} observed web pages, ${webUsageFlows.size} observed web entry flows. Project state: ${completionPolicyRegistry.projectState}, open completion blockers: ${projectCompletionBlockerCount}.`
);
