import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveScreenRequest } from "./resolve-screen-request.mjs";
import { generateScreenTsx, generatedSourceFingerprint } from "./generate-screen-tsx.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = join(projectRoot, "tests", "fixtures", "screen-requests", "receiving-side-panel.json");
const request = JSON.parse(readFileSync(fixturePath, "utf8"));
const first = resolveScreenRequest(request);
const second = resolveScreenRequest(request);

assert.equal(first.fingerprint, second.fingerprint, "동일 요청의 fingerprint가 달라졌습니다.");
assert.equal(first.quality.status, "release-ready");
assert.equal(first.quality.blockerCount, 0);
assert.equal(first.quality.warningCount, 0);
assert.equal(first.baseScreen.id, "receiving");
assert.equal(first.composition.shellRef, "shell.side-slide-panel");
assert.deepEqual(first.composition.sectionRefs, ["frame.standard-section", "section.form-grid", "section.editable-row-list"]);
assert.deepEqual(first.composition.behaviorRefs, ["row.mutation-policy", "dismiss.restore-committed"]);
assert.equal(first.composition.actionSetRef, "action-set.cancel-save");
assert.ok(first.implementation.components.some((entry) => entry.id === "side-slide-panel"));
assert.ok(!first.implementation.components.some((entry) => entry.id === "center-modal"));
assert.ok(first.implementation.contextRules.some((entry) => entry.id === "overlay.side-slide-panel"));
assert.ok(!first.implementation.contextRules.some((entry) => entry.id === "overlay.center-modal"));

const wrongShell = structuredClone(request);
wrongShell.target.kind = "center-modal";
assert.equal(resolveScreenRequest(wrongShell).quality.status, "blocked", "target과 상속 shell 불일치를 차단하지 못했습니다.");

const unknownPattern = structuredClone(request);
unknownPattern.composition.sectionRefs = ["section.not-registered"];
assert.ok(resolveScreenRequest(unknownPattern).quality.issues.some((entry) => entry.code === "registry.unknown-pattern"));

const unknownField = structuredClone(request);
unknownField.composition.visualGuess = "gray-card";
assert.ok(resolveScreenRequest(unknownField).quality.issues.some((entry) => entry.code === "request.unknown-field"));

const generationFixturePath = join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-side-slide.json");
const generationRequest = JSON.parse(readFileSync(generationFixturePath, "utf8"));
const generationContract = resolveScreenRequest(generationRequest);
const generatedFirst = generateScreenTsx(generationContract);
const generatedSecond = generateScreenTsx(generationContract);
assert.equal(generatedFirst, generatedSecond, "동일 계약에서 생성된 TSX가 달라졌습니다.");
assert.equal(generatedSourceFingerprint(generatedFirst), "c255e456a13475fcbd527b435c4b04e0e5072d8434da0ed23af4e65c85fd6745", "승인된 TSX fixture hash가 달라졌습니다.");
assert.match(generatedFirst, /<SideSlidePanel/);
assert.match(generatedFirst, /<EditableRowGrid/);
assert.doesNotMatch(generatedFirst, /<\s*(button|input|select|textarea|table)\b/);
assert.match(generatedFirst, /previousRow\?\.customer/);

const invalidGenerationRequest = structuredClone(generationRequest);
invalidGenerationRequest.generation.panelSize = "mega";
assert.ok(resolveScreenRequest(invalidGenerationRequest).quality.issues.some((entry) => entry.code === "request.generation"));

console.log(`[screen:fixtures] 계약 정상 1개 + 차단 4개 + TSX 결정성 1개 통과 · ${generatedSourceFingerprint(generatedFirst).slice(0, 12)}`);
