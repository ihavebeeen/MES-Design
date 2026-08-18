import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(projectRoot, "src/design-system/registry/experimental-candidates.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
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

const expectedCounts = { 3: 37, 4: 41, 5: 28 };
for (const [tier, expected] of Object.entries(expectedCounts)) {
  if (countsByTier[tier] !== expected) errors.push(`Tier ${tier} 후보는 ${expected}개여야 합니다 (현재 ${countsByTier[tier]}).`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Experimental registry check passed: ${ids.size} quarantined prototypes (T3 ${countsByTier[3]}, T4 ${countsByTier[4]}, T5 ${countsByTier[5]}).`);
