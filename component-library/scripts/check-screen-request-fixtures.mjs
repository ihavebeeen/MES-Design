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
assert.equal(first.decisionTrace.components.find(({ selectedId }) => selectedId === "input")?.contractCoverage, "selection-guard");
assert.equal(first.decisionTrace.components.find(({ selectedId }) => selectedId === "input")?.evidenceRole, "reference-only");
assert.equal(first.implementation.componentUsagePolicy.unlistedComponentMode, "error");
assert.equal(first.implementation.componentUsagePolicy.contextCoverageMode, "all-components");
assert.ok(first.implementation.componentSelectionContexts.length >= first.implementation.componentUsageContracts.length);
assert.ok(first.implementation.components.some((entry) => entry.id === "side-slide-panel"));
assert.ok(!first.implementation.components.some((entry) => entry.id === "center-modal"));
assert.ok(first.implementation.contextRules.some((entry) => entry.id === "overlay.side-slide-panel"));
assert.ok(!first.implementation.contextRules.some((entry) => entry.id === "overlay.center-modal"));
assert.ok(first.implementation.globalGates.some((rule) => rule.includes("정확히 일치하는 승인 자산 조회")), "Resolver가 3단계 자산 선택 순서를 전달하지 않았습니다.");
assert.ok(first.implementation.globalGates.some((rule) => rule.includes("유사한 외형은 후보 탐색 근거")), "Resolver가 유사 자산의 의미 적합성 gate를 전달하지 않았습니다.");

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
assert.match(sideSlidePreview.source, /<HostPage/);

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
assert.equal(resolveScreenRequest(missingWebContext).quality.blockerCount, 0, "참고 사례를 고르지 않아도 유효한 MES 조합은 생성할 수 있어야 합니다.");

const mismatchedWebContext = structuredClone(generationRequest);
mismatchedWebContext.webContext.overlayGrammarRef = "generation.overlay.bounded-selection";
assert.equal(resolveScreenRequest(mismatchedWebContext).quality.blockerCount, 0);
assert.ok(resolveScreenRequest(mismatchedWebContext).quality.issues.some((entry) => entry.code === "generation.overlay-surface-mismatch" && entry.severity === "info"));

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
assert.equal(generatedSourceFingerprint(pageFirst), "8e96b963fc8041186110e25c04cc7922c765250779dc756cc3c0c89c78ccb1a2");
assert.match(pageFirst, /<EntityListPattern/);
assert.match(pageFirst, /<QueryDateRange/);
assert.match(pageFirst, /<GroupQuery/);
assert.match(pageFirst, /<QuickQuery/);
assert.doesNotMatch(pageFirst, /<SearchTableSection/);
assert.doesNotMatch(pageFirst, /<Pagination/);
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

// Intake is an AI-read policy, not a semantic classifier. These checks cover
// registry integrity and request preservation, not AI question/layout quality.
const intake = JSON.parse(readFileSync(join(projectRoot, "src/design-system/registry/screen-intake-policy.json"), "utf8"));
const intakeExamples = JSON.parse(readFileSync(join(projectRoot, "tests/fixtures/screen-intake-cases.json"), "utf8"));
const requestSchema = JSON.parse(readFileSync(join(projectRoot, "src/design-system/registry/screen-request.schema.json"), "utf8"));
assert.equal(intake.schemaVersion, 1);
assert.equal(intake.authority, "generation-dialogue-policy");
assert.deepEqual(intake.stages.map(({ id }) => id), ["screen", "structure", "task", "state"]);
assert.equal(intake.resolution.batchSize.max, 3);
const stages = new Set(intake.stages.map(({ id }) => id));
const facets = new Set(Object.keys(intake.facets));
const questions = new Map(intake.questions.map((question) => [question.id, question]));
assert.ok(questions.size > 0);
assert.equal(questions.size, intake.questions.length, "Intake 질문 ID 중복");

function hasSchemaPath(schema, parts) {
  if (schema.$ref) return hasSchemaPath(requestSchema.$defs[schema.$ref.split("/").at(-1)], parts);
  if (parts.length === 0) return true;
  if (schema.oneOf) return schema.oneOf.some((option) => hasSchemaPath(option, parts));
  const child = schema.properties?.[parts[0]];
  return Boolean(child && hasSchemaPath(child, parts.slice(1)));
}

for (const question of questions.values()) {
  assert.ok(stages.has(question.stage), `${question.id}: 알 수 없는 단계`);
  assert.ok(question.facets.every((facet) => facets.has(facet)), `${question.id}: 알 수 없는 성격`);
  for (const field of ["id", "prompt", "askWhen"]) assert.ok(question[field]?.trim(), `${question.id}: ${field} 필요`);
  for (const field of ["answerNeeds", "lookIn", "affects", "writeTo"]) {
    assert.ok(Array.isArray(question[field]) && question[field].length > 0 && question[field].every((value) => typeof value === "string" && value.trim()), `${question.id}: ${field} 필요`);
  }
  assert.ok(Object.hasOwn(intake.questionContract.ifUnknown, question.ifUnknown), `${question.id}: 미정 처리 누락`);
  for (const target of question.writeTo) assert.ok(hasSchemaPath(requestSchema, target.split(".")), `${question.id}: 없는 ScreenRequest 경로 ${target}`);
}

for (const followUp of intake.followUps) {
  assert.ok(questions.has(followUp.from) && followUp.when.trim(), "후속 질문의 출발점/조건 누락");
  assert.ok(followUp.questionIds.length > 0 && followUp.questionIds.every((id) => questions.has(id) && id !== followUp.from), "후속 질문 참조 오류");
}

const caseIds = new Set();
let preservedIntakeCases = 0;
for (const example of intakeExamples.cases) {
  assert.ok(!caseIds.has(example.id), `Intake 예시 ID 중복: ${example.id}`);
  caseIds.add(example.id);
  assert.ok(example.facets.every((facet) => facets.has(facet)), `${example.id}: 없는 facet`);
  assert.ok(example.mustNotInfer.length > 0 && example.next, `${example.id}: 오용 방지/후속 처리 누락`);
  for (const answer of example.answers) {
    assert.ok(questions.has(answer.questionId), `${example.id}: 없는 질문 답`);
    assert.ok(intake.resolution.answerStates.includes(answer.state), `${example.id}: 잘못된 답 상태`);
    assert.ok(answer.value && answer.source && answer.scope, `${example.id}: 답 근거/범위 누락`);
  }
  for (const id of example.expectedQuestions) {
    const question = questions.get(id);
    assert.ok(question, `${example.id}: 없는 후속 질문 ${id}`);
    assert.ok(question.facets.length === 0 || question.facets.some((facet) => example.facets.includes(facet)), `${example.id}: 다른 성격의 후속 질문`);
    assert.ok(!example.answers.some((answer) => answer.questionId === id && ["confirmed", "supported"].includes(answer.state)), `${example.id}: 이미 답한 질문 재요청`);
  }
  assert.ok(example.expectedQuestions.length <= intake.resolution.batchSize.max, `${example.id}: 질문 묶음 초과`);
  if (!example.contractFixture) continue;
  const exampleRequest = JSON.parse(readFileSync(join(projectRoot, "tests/fixtures/screen-requests", example.contractFixture), "utf8"));
  const baselineContract = resolveScreenRequest(exampleRequest);
  const baselineSource = generateScreenTsx(baselineContract);
  exampleRequest.requirements.push(...example.answers.filter(({ state }) => state === "confirmed").map(({ value }) => value));
  exampleRequest.evidence ??= {};
  exampleRequest.evidence.notes = [
    ...(exampleRequest.evidence.notes ?? []),
    ...example.answers.map(({ questionId, state, scope, value, source }) => `[intake:${questionId}][${state}][scope:${scope}] ${value} / 근거:${source}`),
  ];
  const withAnswers = resolveScreenRequest(exampleRequest);
  assert.equal(withAnswers.quality.blockerCount, 0, `${example.id}: 답 기록이 계약을 깨뜨림`);
  assert.deepEqual(withAnswers.request.requirements, exampleRequest.requirements);
  assert.deepEqual(withAnswers.request.evidence.notes, exampleRequest.evidence.notes);
  assert.equal(withAnswers.composition.shellRef, example.expectedShellRef, `${example.id}: 답 기록이 Shell을 임의 변경`);
  assert.equal(generateScreenTsx(withAnswers), baselineSource, `${example.id}: 메모만으로 JSX가 변경됨`);
  preservedIntakeCases += 1;
}
console.log(`[screen:intake] 질문 ${questions.size}개 구조·참조 검사, 수동 검토 예시 ${caseIds.size}개 참조 검사, 답 보존 ${preservedIntakeCases}개 통과 (AI 질문 선택 품질 검증은 아님)`);

console.log(`[screen:fixtures] 계약 정상 3개 + 차단 7개 + TSX 결정성 3개 + 미리보기 3개 통과 · ${generatedSourceFingerprint(generatedFirst).slice(0, 12)}/${generatedSourceFingerprint(centerFirst).slice(0, 12)}/${generatedSourceFingerprint(pageFirst).slice(0, 12)}`);
