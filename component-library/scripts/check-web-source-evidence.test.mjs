import test from "node:test";
import assert from "node:assert/strict";
import { loadWebSourceEvidence, validateWebSourceEvidence } from "./check-web-source-evidence.mjs";

function clone(value) {
  return structuredClone(value);
}

test("현재 42개 화면 원본과 상호작용 원장은 통과한다", () => {
  assert.deepEqual(validateWebSourceEvidence(loadWebSourceEvidence()), []);
});

test("실제 웹 화면의 상호작용 기록이 빠지면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.interactions.pages = evidence.interactions.pages.filter((page) => page.pageId !== "web.item");
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /web\.item/);
});

test("기본 창고 설정이 완료된 Figma 개선안을 벗어나면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  const warehouse = evidence.authority.pages.find((page) => page.pageId === "web.warehouse");
  warehouse.resolvedSurfaces.find((surface) => surface.surface === "default-warehouse-modal").nodeId = "9184:23987";
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /16553:37111/);
});

test("웹 전용 필드를 디자인 오류로 뭉개지 않도록 내용 확장 근거를 요구한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  const warehouse = evidence.authority.pages.find((page) => page.pageId === "web.warehouse");
  warehouse.runtimeOnlyContentExtensions = [];
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /웹 전용 필드 확장/);
});

test("미진행·후순위·POC 수정안은 기본 원본을 덮어쓸 수 없다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.authority.revisionStatuses.find((revision) => revision.status === "poc").mayOverrideBase = true;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /완료 원본을 덮어쓸 수 없습니다/);
});

test("데이터가 없는 행에 더블클릭 성공을 기록하면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  const page = evidence.interactions.pages.find((item) => item.pageId === "web.item");
  page.row.status = "no-data";
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /데이터가 없는데/);
});

test("행 조사 집계가 실제 기록과 다르면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.interactions.coverage.pagesWithSelectedDataRow = 0;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /선택한 데이터 행 수/);
});

test("상태 변화 기록에 전후 상태가 빠지면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  const receiving = evidence.interactions.pages.find((item) => item.pageId === "web.receiving");
  delete receiving.stateTransitions[0].after;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /before·action·after/);
});

test("상태 변화 화면 집계가 실제 기록과 다르면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.interactions.coverage.pagesWithStateTransitionsObserved = 0;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /상태 변화 확인 화면 수/);
});

test("한 화면의 상태 변화를 공통 맥락으로 승격하면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.interactions.reusableStateContexts[0].evidence = [
    evidence.interactions.reusableStateContexts[0].evidence[0]
  ];
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /서로 다른 화면 2개 이상/);
});

test("공통 상태 맥락이 실제 화면의 상태 변화와 연결되지 않으면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.interactions.reusableStateContexts[0].evidence[0].transitionIndex = 99;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /상태 변화 근거가 없습니다/);
});

test("경향 관리와 생산 분석의 인라인 설정 변화가 빠지면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  delete evidence.interactions.pages.find((page) => page.pageId === "web.inspection-trend").stateTransitions;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /web\.inspection-trend/);
});

test("대표 웹 대조 viewport가 1920×1080이 아니면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.reconciliation.comparisonProtocol.runtimeViewport.requestedWidth = 1280;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /1920×1080/);
});

test("대표 구조 대조에서 내부 실제 UI frame 근거가 빠지면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  delete evidence.reconciliation.representativeComparisons.find((item) => item.id === "main-list.production-target").figmaActualUiFrame;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /내부 실제 UI frame/);
});

test("공통 UI 디자인 차이에는 Figma 기준이 필요하다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.reconciliation.representativeComparisons.find((item) => item.id === "center-modal.default-warehouse").authority = "runtime";
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /Figma 기준/);
});

test("대표 대조 집계가 실제 기록과 다르면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.reconciliation.coverage.representativeStructureCompared = 0;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /대표 구조 대조 집계/);
});

test("실제 UI frame이 있는 화면이 상세 대조에서 빠지면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  const family = evidence.reconciliation.detailedComparisonPass.familyCoverage.find((item) => item.family === "master-data-list");
  family.pageIds = family.pageIds.filter((pageId) => pageId !== "web.item");
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /web\.item.*상세 대조에서 빠졌습니다/);
});

test("원본 frame 미확정 화면이 분리 목록에서 빠지면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.reconciliation.detailedComparisonPass.unpairedRuntimePages =
    evidence.reconciliation.detailedComparisonPass.unpairedRuntimePages.filter((pageId) => pageId !== "web.kpi");
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /web\.kpi.*분리 목록에서 빠졌습니다/);
});

test("상세 대조 집계가 실제 화면군과 다르면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.reconciliation.coverage.detailedRuntimePagesInspected = 0;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /상세 대조 집계/);
});

test("팝업 상세 대조 대표 항목이 빠지면 집계 불일치로 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.reconciliation.conditionalStateComparisonPass.representatives =
    evidence.reconciliation.conditionalStateComparisonPass.representatives.filter((item) => item.id !== "center.production-work-selection");
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /팝업·상태 상세 대조 집계/);
});

test("팝업의 내부 구성요소 대조가 빠지면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  delete evidence.reconciliation.conditionalStateComparisonPass.representatives[0].compositionCheck;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /내부 구성요소 대조 결과/);
});

test("실제 웹 팝업 진입 흐름의 Figma 연결이 빠지면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.reconciliation.conditionalStateComparisonPass.runtimeEntryFlowCoverage.mappings.pop();
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /팝업 진입.*Figma 구성 대조|팝업 진입 흐름 집계/);
});

test("Figma 팝업 크기군 합계가 조사 surface 수와 다르면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.reconciliation.conditionalStateComparisonPass.figmaPopupInventory.surfacesInspected = 999;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /Figma 팝업 전수 조사 집계/);
});

test("웹 전용 작업 선택 모달에 임의의 Figma 원본을 연결하면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  const comparison = evidence.reconciliation.conditionalStateComparisonPass.representatives
    .find((item) => item.id === "center.production-work-selection");
  comparison.classification = "runtime-only-new-structure";
  comparison.figma = {
      nodeId: "19079:63364",
      authority: "guessed"
    };
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /Figma 근거를 임의 연결/);
});

test("설비 모니터링 후보를 찾고도 미확정 근거에서 빼면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.authority.pages.find((page) => page.pageId === "web.equipment-monitoring").candidateFrameIds = [];
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /고해상도 후보/);
});

test("KPI 메뉴 검색 결과를 본문 원본처럼 취급하지 않도록 검색 근거를 유지한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.authority.pages.find((page) => page.pageId === "web.kpi").searchMatchNodeIds = [];
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /메뉴 검색 결과/);
});
