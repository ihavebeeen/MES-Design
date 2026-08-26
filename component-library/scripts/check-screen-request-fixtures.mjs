import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveScreenRequest } from "./resolve-screen-request.mjs";
import { generateScreenTsx, generatedSourceFingerprint } from "./generate-screen-tsx.mjs";
import { createScreenPreviewPlan, generateScreenPreviewSource } from "./generate-screen-preview.mjs";
import { auditScreenImplementation } from "./audit-screen-implementation.mjs";

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
assert.deepEqual(first.composition.sections.map(({ id }) => id), ["basicInformation", "receivingItems", "optionalInformation"]);
assert.equal(first.decisionTrace.shell.source, "screen-spec");
assert.equal(first.decisionTrace.components.find(({ selectedId }) => selectedId === "input")?.contractCoverage, "structured");
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
assert.equal(generationContract.decisionTrace.webContext.overlayGrammar.selectedId, "generation.overlay.context-preserving-form");
assert.equal(generationContract.decisionTrace.webContext.sectionRecipes[0].selectedId, "generation.section.basic-detail-list");
assert.equal(generationContract.implementation.reproductionAuditContext, null, "신규 UI 계약에 재현·감사 정보가 섞였습니다.");
const generatedFirst = generateScreenTsx(generationContract);
const generatedSecond = generateScreenTsx(generationContract);
assert.equal(generatedFirst, generatedSecond, "동일 계약에서 생성된 TSX가 달라졌습니다.");
assert.equal(generatedSourceFingerprint(generatedFirst), "cbf73874ac6cf26241cda1a23f0300796e79342552f5b4843162548e33180fb3", "승인된 TSX fixture hash가 달라졌습니다.");
assert.match(generatedFirst, /<SideSlidePanel/);
assert.match(generatedFirst, /<EditableRowGrid/);
assert.doesNotMatch(generatedFirst, /<\s*(button|input|select|textarea|table)\b/);
assert.match(generatedFirst, /previousRow\?\.customer/);
assert.equal(auditScreenImplementation(generationContract, generatedFirst).status, "audit-ready");
const sideSlidePreview = createScreenPreviewPlan(generationContract, "src/generated-previews/deterministic-receiving-dialog.tsx", { projectRoot });
assert.equal(sideSlidePreview.relativePath, "src/app/preview/deterministic-receiving-fixture/page.tsx");
assert.equal(sideSlidePreview.url, "http://localhost:3000/preview/deterministic-receiving-fixture");
assert.equal(sideSlidePreview.manifestEntry.persistence, "local");
assert.equal(sideSlidePreview.manifestEntry.reviewStatus, "draft");
assert.equal(sideSlidePreview.manifestEntry.generationInfluence, "blocked");
assert.match(sideSlidePreview.source, /<DeterministicReceivingDialog open=\{open\} onOpenChange=\{setOpen\}/);
assert.match(sideSlidePreview.source, /다시 열기/);

const wrongSectionOrder = generatedFirst
  .replace('data-section-id="basicInformation"', 'data-section-id="__swap__"')
  .replace('data-section-id="receivingItems"', 'data-section-id="basicInformation"')
  .replace('data-section-id="__swap__"', 'data-section-id="receivingItems"');
assert.ok(auditScreenImplementation(generationContract, wrongSectionOrder).findings.some((entry) => entry.code === "composition.section-order"));

const invalidGenerationRequest = structuredClone(generationRequest);
invalidGenerationRequest.generation.panelSize = "mega";
assert.ok(resolveScreenRequest(invalidGenerationRequest).quality.issues.some((entry) => entry.code === "request.generation"));

const missingWebContext = structuredClone(generationRequest);
delete missingWebContext.webContext;
assert.ok(resolveScreenRequest(missingWebContext).quality.issues.some((entry) => entry.code === "generation.web-context-required"));

const mismatchedWebContext = structuredClone(generationRequest);
mismatchedWebContext.webContext.overlayGrammarRef = "generation.overlay.bounded-selection";
assert.ok(resolveScreenRequest(mismatchedWebContext).quality.issues.some((entry) => entry.code === "generation.overlay-surface-mismatch"));

const centerRequest = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-center-modal.json"), "utf8"));
const centerContract = resolveScreenRequest(centerRequest);
const centerFirst = generateScreenTsx(centerContract);
const centerSecond = generateScreenTsx(resolveScreenRequest(centerRequest));
assert.equal(centerContract.quality.status, "release-ready");
assert.equal(centerContract.decisionTrace.webContext.overlayGrammar.selectedId, "generation.overlay.bounded-selection");
assert.equal(centerFirst, centerSecond, "중앙 팝업 템플릿이 결정적으로 생성되지 않았습니다.");
assert.equal(generatedSourceFingerprint(centerFirst), "af94ccc69f5e1e0f6f7712c3410bbb2abf85648bacee1501f80716c3f28f34fb");
assert.match(centerFirst, /<CenterModal/);
assert.match(centerFirst, /<SearchTableSection/);
assert.equal(auditScreenImplementation(centerContract, centerFirst).status, "audit-ready");

const pageRequest = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-entity-list.json"), "utf8"));
const pageContract = resolveScreenRequest(pageRequest);
const pageFirst = generateScreenTsx(pageContract);
const pageSecond = generateScreenTsx(resolveScreenRequest(pageRequest));
assert.equal(pageContract.quality.status, "review-ready");
assert.equal(pageContract.decisionTrace.webContext.pageArchetype.selectedId, "generation.page.entity-list");
assert.ok(pageContract.quality.issues.some((entry) => entry.code === "generation.template-provisional"));
assert.equal(pageFirst, pageSecond, "전체 페이지 템플릿이 결정적으로 생성되지 않았습니다.");
assert.equal(generatedSourceFingerprint(pageFirst), "6b4e78b9c46ebeaa4015bc2df87f62ade89cf5d29f9ca07a55d7b261cb0d287d");
assert.match(pageFirst, /<EntityListPattern/);
assert.match(pageFirst, /<SearchTableSection/);
assert.equal(auditScreenImplementation(pageContract, pageFirst).blockerCount, 0);
const pagePreview = generateScreenPreviewSource(pageContract, "@/generated/deterministic-receiving-list-page");
assert.doesNotMatch(pagePreview, /"use client"/);
assert.match(pagePreview, /return <DeterministicReceivingListPage \/>/);

const invalidPreviewRoute = structuredClone(generationContract);
invalidPreviewRoute.request.output.route = "/generated-screens/not-a-local-preview";
assert.throws(
  () => createScreenPreviewPlan(invalidPreviewRoute, "src/generated-previews/invalid.tsx", { projectRoot }),
  /\/preview/,
);

const invalidTableRequest = structuredClone(centerRequest);
invalidTableRequest.generation.sections[0].rows[0].values.notAColumn = "오류";
assert.ok(resolveScreenRequest(invalidTableRequest).quality.issues.some((entry) => entry.code === "request.generation"));

console.log(`[screen:fixtures] 계약 정상 3개 + 차단 7개 + TSX 결정성 3개 + 미리보기 3개 통과 · ${generatedSourceFingerprint(generatedFirst).slice(0, 12)}/${generatedSourceFingerprint(centerFirst).slice(0, 12)}/${generatedSourceFingerprint(pageFirst).slice(0, 12)}`);
