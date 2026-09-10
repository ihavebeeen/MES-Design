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
  const page = evidence.interactions.pages.find((item) => item.pageId === "web.receiving");
  page.row.doubleClick = { status: "opened", surface: "side-slide-panel" };
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /데이터가 없는데/);
});

test("행 조사 집계가 실제 기록과 다르면 실패한다", () => {
  const evidence = clone(loadWebSourceEvidence());
  evidence.interactions.coverage.pagesWithSelectedDataRow = 0;
  assert.match(validateWebSourceEvidence(evidence).join("\n"), /선택한 데이터 행 수/);
});
