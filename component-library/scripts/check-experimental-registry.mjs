import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(projectRoot, "src/design-system/registry/experimental-candidates.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const componentRegistry = JSON.parse(fs.readFileSync(path.join(projectRoot, "src/design-system/registry/components.json"), "utf8"));
const patternRegistry = JSON.parse(fs.readFileSync(path.join(projectRoot, "src/design-system/registry/patterns.json"), "utf8"));
const componentIds = new Set(componentRegistry.components?.map((entry) => entry.id));
const patternIds = new Set(patternRegistry.patterns?.map((entry) => entry.id));
const allowedKinds = new Set(["component", "pattern", "template", "foundation", "utility"]);
const ids = new Set();
const checklistItems = new Set();
const errors = [];
const countsByTier = { 3: 0, 4: 0, 5: 0 };

if (registry.policyId !== "mes.experimental-candidates") errors.push("policyId가 잘못되었습니다.");
if (registry.defaultInfluence !== "quarantined") errors.push("defaultInfluence는 quarantined여야 합니다.");
if (!registry.promotionRule) errors.push("promotionRule이 필요합니다.");

for (const candidate of registry.candidates ?? []) {
  if (ids.has(candidate.id)) errors.push(`중복 id: ${candidate.id}`);
  ids.add(candidate.id);
  if (checklistItems.has(candidate.checklistItem)) errors.push(`중복 checklistItem: ${candidate.checklistItem}`);
  checklistItems.add(candidate.checklistItem);
  if (![3, 4, 5].includes(candidate.tier)) errors.push(`${candidate.id}: 실험 레지스트리는 Tier 3~5만 허용합니다.`);
  else countsByTier[candidate.tier] += 1;
  if (candidate.status !== "prototype") errors.push(`${candidate.id}: status는 prototype이어야 합니다.`);
  if (candidate.influence !== "quarantined") errors.push(`${candidate.id}: influence는 quarantined여야 합니다.`);
  if (!allowedKinds.has(candidate.kind)) errors.push(`${candidate.id}: 알 수 없는 kind ${candidate.kind}`);
  if (!candidate.exportName) errors.push(`${candidate.id}: exportName이 필요합니다.`);
  if (!Array.isArray(candidate.standardRefs) || candidate.standardRefs.length === 0) errors.push(`${candidate.id}: standardRefs가 필요합니다.`);
  if (!Array.isArray(candidate.limitations) || candidate.limitations.length === 0) errors.push(`${candidate.id}: limitations가 필요합니다.`);
  const sourcePath = path.join(projectRoot, candidate.source ?? "");
  if (!candidate.source || !fs.existsSync(sourcePath)) errors.push(`${candidate.id}: source 파일이 없습니다 (${candidate.source ?? ""}).`);
  else {
    const source = fs.readFileSync(sourcePath, "utf8");
    if (!source.includes(`export function ${candidate.exportName}`) && !source.includes(`export const ${candidate.exportName}`)) {
      errors.push(`${candidate.id}: source에 ${candidate.exportName} export가 없습니다.`);
    }
  }
}

for (const batch of registry.decisionBatches ?? []) {
  if (!batch.id || !/^\d{4}-\d{2}-\d{2}$/.test(batch.decidedAt ?? "")) errors.push("decision batch에는 id와 YYYY-MM-DD decidedAt이 필요합니다.");
  if (![3, 4, 5].includes(batch.tier)) errors.push(`${batch.id}: tier는 3~5여야 합니다.`);
  if (!batch.decisionAuthority) errors.push(`${batch.id}: decisionAuthority가 필요합니다.`);
  const promotionCandidateIds = (batch.promotions ?? []).map((entry) => entry.candidateId);
  const retainedIds = batch.retainedCandidateIds ?? [];
  const rejectedIds = batch.rejectedCandidateIds ?? [];
  const decidedIds = [...promotionCandidateIds, ...retainedIds, ...rejectedIds];
  if (new Set(decidedIds).size !== decidedIds.length) errors.push(`${batch.id}: 후보가 여러 판정에 중복 포함되어 있습니다.`);
  if (batch.tier === 3 && decidedIds.length !== 23) errors.push(`${batch.id}: Tier 3 최초 후보 23개의 판정이 모두 필요합니다 (현재 ${decidedIds.length}).`);
  for (const promotion of batch.promotions ?? []) {
    if (ids.has(promotion.candidateId)) errors.push(`${batch.id}: 승격 후보 '${promotion.candidateId}'가 실험 레지스트리에 남아 있습니다.`);
    const targetIds = promotion.registry === "component" ? componentIds : promotion.registry === "pattern" ? patternIds : undefined;
    if (!targetIds) errors.push(`${batch.id}: '${promotion.candidateId}'의 registry는 component 또는 pattern이어야 합니다.`);
    else if (!targetIds.has(promotion.registryId)) errors.push(`${batch.id}: 승격 대상 '${promotion.registryId}'가 ${promotion.registry} 레지스트리에 없습니다.`);
  }
  for (const retainedId of retainedIds) {
    if (!ids.has(retainedId)) errors.push(`${batch.id}: 유지 후보 '${retainedId}'가 실험 레지스트리에 없습니다.`);
  }
  for (const rejectedId of rejectedIds) {
    if (ids.has(rejectedId)) errors.push(`${batch.id}: 제외 후보 '${rejectedId}'가 실험 레지스트리에 남아 있습니다.`);
  }
}

const expectedCounts = { 3: 2, 4: 22, 5: 12 };
for (const [tier, expected] of Object.entries(expectedCounts)) {
  if (countsByTier[tier] !== expected) errors.push(`Tier ${tier} 후보는 ${expected}개여야 합니다 (현재 ${countsByTier[tier]}).`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Experimental registry check passed: ${ids.size} quarantined prototypes (T3 ${countsByTier[3]}, T4 ${countsByTier[4]}, T5 ${countsByTier[5]}).`);
