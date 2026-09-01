import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { readRegistryBundle, resolveScreenRequest } from "./resolve-screen-request.mjs";
import { reviewScreenAssetSelection } from "./screen-asset-selection.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = readRegistryBundle();

function draft(elements, notApplicableCategories = []) {
  return { schemaVersion: 1, targetKind: "page", notApplicableCategories, elements };
}

const riskStatus = {
  id: "riskStatus",
  label: "위험상태",
  category: "status-feedback",
  capability: "status-display",
  parentRefs: ["section.search-table-composition"],
  basis: "confirmed",
  impact: "presentation",
  decision: "deferred",
};

test("의미와 parent가 일치하는 기존 자산을 후보로 제안하되 자동 선택하지 않는다", () => {
  const result = reviewScreenAssetSelection(draft([riskStatus]), registry);
  const review = result.elements[0];
  assert.equal(result.blockerCount, 0);
  assert.equal(result.policy.automaticSelection, false);
  assert.equal(review.recommendation.outcome, "reuse-exact");
  assert.equal(review.recommendation.componentRef, "badge");
  assert.equal(review.recommendation.automatic, false);
  assert.ok(result.findings.some((entry) => entry.code === "asset-selection.exact-candidate" && entry.severity === "info"));
});

test("외형상 가능한 일반 Button을 상태 표시로 고르면 경고하되 전체 생성을 차단하지 않는다", () => {
  const result = reviewScreenAssetSelection(draft([{ ...riskStatus, decision: "selected", selectedComponentRef: "button" }]), registry);
  assert.equal(result.blockerCount, 0);
  assert.ok(result.findings.some((entry) => entry.code === "asset-selection.semantic-mismatch" && entry.severity === "warning"));
});

test("메인 리스트 하단 액션은 parent 맥락까지 맞는 복합 자산을 찾는다", () => {
  const result = reviewScreenAssetSelection(draft([{
    id: "footerActions",
    label: "메인 리스트 하단 액션",
    category: "actions",
    capability: "main-list-actions",
    parentRefs: ["screen.entity-list"],
    basis: "supported",
    impact: "business-behavior",
    decision: "selected",
    selectedComponentRef: "main-list-footer-actions",
  }]), registry);
  assert.equal(result.elements[0].selectedMatch, "exact");
  assert.equal(result.warningCount, 0);
});

test("미확정 업무 동작의 자산 선택은 질문 대상으로 남기고 blocker로 만들지 않는다", () => {
  const result = reviewScreenAssetSelection(draft([{
    id: "footerActions",
    label: "메인 리스트 하단 액션",
    category: "actions",
    capability: "main-list-actions",
    parentRefs: ["screen.entity-list"],
    basis: "assumed",
    impact: "business-behavior",
    decision: "selected",
    selectedComponentRef: "main-list-footer-actions",
  }]), registry);
  assert.equal(result.blockerCount, 0);
  assert.ok(result.findings.some((entry) => entry.code === "asset-selection.unconfirmed-business-decision"));
});

test("기존 후보가 없는 의미는 신규 자산을 강제하지 않고 추가 검색 대상으로 남긴다", () => {
  const result = reviewScreenAssetSelection(draft([{
    id: "unknownVisualization",
    label: "새로운 공정 관계 표시",
    category: "data-display",
    capability: "unregistered-process-relationship",
    parentRefs: ["screen.entity-list"],
    basis: "supported",
    impact: "presentation",
    decision: "deferred",
  }]), registry);
  assert.equal(result.blockerCount, 0);
  assert.equal(result.elements[0].recommendation.outcome, "search-or-propose-new");
  assert.ok(result.findings.some((entry) => entry.code === "asset-selection.no-candidate" && entry.severity === "info"));
});

test("ScreenRequest에 채택한 자산은 실제 composition 연결 여부까지 다시 확인한다", () => {
  const request = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-entity-list.json"), "utf8"));
  request.assetDecisions = {
    schemaVersion: 1,
    elements: [{
      id: "footerActions",
      label: "메인 리스트 하단 액션",
      category: "actions",
      capability: "main-list-actions",
      parentRefs: ["screen.entity-list"],
      basis: "supported",
      impact: "business-behavior",
      decision: "selected",
      selectedComponentRef: "main-list-footer-actions",
    }],
  };

  const unlinked = resolveScreenRequest(request, registry);
  assert.equal(unlinked.quality.blockerCount, 0);
  assert.ok(unlinked.quality.issues.some((entry) => entry.code === "asset-selection.selected-not-linked"));
  assert.equal(unlinked.decisionTrace.assetSelection.elements[0].selectedMatch, "exact");

  request.composition.sections[0].componentRefs.push("main-list-footer-actions");
  const linked = resolveScreenRequest(request, registry);
  assert.equal(linked.quality.blockerCount, 0);
  assert.ok(!linked.quality.issues.some((entry) => entry.code === "asset-selection.selected-not-linked"));
});

test("검토하지 않은 범주는 누락 가능성만 알리고 차단하지 않는다", () => {
  const result = reviewScreenAssetSelection(draft([riskStatus], ["overlay-behavior"]), registry);
  assert.equal(result.blockerCount, 0);
  assert.ok(result.unreviewedCategories.includes("actions"));
  assert.ok(result.findings.some((entry) => entry.code === "asset-selection.category-unreviewed" && entry.severity === "info"));
});

test("모든 등록 컴포넌트는 최소 선택 맥락을 가지며 상세 계약이 없어도 의미 후보가 된다", () => {
  assert.equal(registry.componentSelectionContexts.length, registry.components.length);
  const result = reviewScreenAssetSelection(draft([{
    id: "workerIdentity",
    label: "작업자 식별",
    category: "data-display",
    capability: "person-identity-summary",
    parentRefs: ["section.form-grid"],
    basis: "supported",
    impact: "presentation",
    decision: "selected",
    selectedComponentRef: "avatar",
  }]), registry);
  assert.equal(result.elements[0].selectedMatch, "context-match");
  assert.equal(result.elements[0].compatibleCandidates.find((entry) => entry.componentRef === "avatar")?.contractCoverage, "context-only");
  assert.ok(!result.findings.some((entry) => entry.code === "asset-selection.missing-context"));
});

test("컴포넌트 후보를 찾은 뒤 관련 패턴과 각 패턴의 맥락 규칙을 반환한다", () => {
  const result = reviewScreenAssetSelection(draft([riskStatus]), registry);
  assert.ok(result.patternCandidates.length > 0);
  assert.ok(result.patternCandidates.every((entry) => entry.contextRules.length > 0));
  assert.ok(result.patternCandidates.some((entry) => entry.patternRef === "section.search-table-composition"));
});
