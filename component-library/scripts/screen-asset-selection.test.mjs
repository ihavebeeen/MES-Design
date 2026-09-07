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
    evidenceRef: "footerActionEvidence",
    decisionSubject: "host-list.footer-actions",
  }]), registry);
  assert.equal(result.elements[0].selectedMatch, "exact");
  assert.equal(result.warningCount, 0);
});

test("미확정 업무 동작의 자산 선택은 질문 대상으로 남기고 blocker로 처리한다", () => {
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
    evidenceRef: "footerActionEvidence",
    decisionSubject: "host-list.footer-actions",
  }]), registry);
  assert.ok(result.blockerCount > 0);
  assert.ok(result.findings.some((entry) => entry.code === "asset-selection.unconfirmed-business-decision" && entry.severity === "blocker"));
});

test("선택한 업무 동작에 판단 근거 연결이 없으면 차단한다", () => {
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
    decisionSubject: "host-list.footer-actions",
  }]), registry);
  assert.ok(result.findings.some((entry) => entry.code === "asset-selection.business-evidence" && entry.severity === "blocker"));
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
      evidenceRef: "footerActionEvidence",
      decisionSubject: "host-list.footer-actions",
    }],
  };
  request.evidence = {
    ...(request.evidence ?? {}),
    decisions: [{
      id: "footerActionEvidence",
      questionId: "screen.workflow",
      state: "supported",
      sourceType: "registered-contract",
      sourceRef: "context-rules.json#main-list-footer-actions",
      statement: "선택한 목록 대상에 실제 업무 액션을 적용한다.",
      decisionSubject: "host-list.footer-actions",
      factor: "batch-action",
      selectedOption: "main-list-footer-actions",
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

test("다른 업무 결정을 위한 한 근거를 컴포넌트 선택에 재사용하면 차단한다", () => {
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
      evidenceRef: "individualEditEvidence",
      decisionSubject: "host-list.footer-actions",
    }],
  };
  request.evidence = {
    decisions: [{
      id: "individualEditEvidence",
      questionId: "task.detail",
      state: "supported",
      sourceType: "registered-contract",
      sourceRef: "usage-contexts.json#usage.form-work",
      statement: "개별 건의 상세를 확인하고 조치를 편집한다.",
      decisionSubject: "record.edit-target",
      factor: "task-purpose",
      selectedOption: "single-record",
    }],
  };
  const result = resolveScreenRequest(request, registry);
  assert.ok(result.quality.issues.some((entry) => entry.code === "request.asset-decision-subject"));
});

test("검토하지 않은 범주는 누락 가능성만 알리고 차단하지 않는다", () => {
  const result = reviewScreenAssetSelection(draft([riskStatus], ["overlay-behavior"]), registry);
  assert.equal(result.blockerCount, 0);
  assert.ok(result.unreviewedCategories.includes("actions"));
  assert.ok(result.findings.some((entry) => entry.code === "asset-selection.category-unreviewed" && entry.severity === "info"));
});

test("팝업 방향을 사용자 확정으로 기록하려면 실제 사용자 원문이 필요하다", () => {
  const request = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-side-slide.json"), "utf8"));
  request.assetDecisions = { schemaVersion: 1, elements: [] };
  request.evidence = {
    ...(request.evidence ?? {}),
    decisions: [{
      id: "screenDirectionEvidence",
      questionId: "screen.direction",
      state: "confirmed",
      sourceType: "registered-contract",
      sourceRef: "context-rules.json#overlay",
      statement: "우측 슬라이드 팝업을 사용한다.",
    }],
  };
  const result = resolveScreenRequest(request, registry);
  assert.ok(result.quality.issues.some((entry) => entry.code === "request.false-confirmed-evidence"));
});

test("지원 근거로 팝업 방향을 선택할 때 가까운 대안 비교가 필요하다", () => {
  const request = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-side-slide.json"), "utf8"));
  request.assetDecisions = { schemaVersion: 1, elements: [] };
  request.evidence = {
    ...(request.evidence ?? {}),
    decisions: [{
      id: "screenDirectionEvidence",
      questionId: "screen.direction",
      state: "supported",
      sourceType: "registered-contract",
      sourceRef: "context-rules.json#overlay",
      statement: "목록 맥락을 유지하는 연속 작업을 위해 우측 패널을 검토한다.",
      decisionSubject: "screen.shell",
      factor: "workflow",
      selectedOption: "side-slide-panel",
    }],
  };
  const result = resolveScreenRequest(request, registry);
  assert.ok(result.quality.issues.some((entry) => entry.code === "request.screen-direction-comparison"));
});

test("screen.direction 이름만 같고 실제 선택 대상이 다른 근거는 팝업 유형을 확정하지 못한다", () => {
  const request = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-side-slide.json"), "utf8"));
  request.assetDecisions = { schemaVersion: 1, elements: [] };
  request.evidence = {
    ...(request.evidence ?? {}),
    decisions: [{
      id: "weightEvidence",
      questionId: "screen.direction",
      state: "confirmed",
      sourceType: "user-request",
      sourceRef: "사용자 원문: \"MES 디자인 시스템만 사용해.\"",
      statement: "디자인 시스템 가중치 1을 적용한다.",
    }],
  };
  const result = resolveScreenRequest(request, registry);
  assert.ok(result.quality.issues.some((entry) => entry.code === "request.screen-direction-evidence"));
});

test("사용자가 팝업 유형을 직접 지정하지 않았다면 하나의 업무 근거만으로 Shell을 선택하지 못한다", () => {
  const request = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-side-slide.json"), "utf8"));
  request.assetDecisions = { schemaVersion: 1, elements: [] };
  request.evidence = {
    ...(request.evidence ?? {}),
    decisions: [{
      id: "individualEditEvidence",
      questionId: "task.detail",
      state: "supported",
      sourceType: "registered-contract",
      sourceRef: "usage-contexts.json#usage.form-work",
      statement: "개별 건의 상세를 확인하고 조치를 입력한다.",
      decisionSubject: "screen.shell",
      factor: "task-purpose",
      selectedOption: "side-slide-panel",
      alternatives: [{ option: "center-modal", reason: "집중 편집 경계도 가능한 대안이다." }],
    }],
  };
  const result = resolveScreenRequest(request, registry);
  assert.ok(result.quality.issues.some((entry) => entry.code === "request.screen-direction-basis-set"));
});

test("사용자 직접 지정이 없는 Shell은 서로 다른 판단 축과 대안 비교가 모여야 통과한다", () => {
  const request = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-side-slide.json"), "utf8"));
  request.assetDecisions = { schemaVersion: 1, elements: [] };
  request.evidence = {
    ...(request.evidence ?? {}),
    decisions: [
      {
        id: "shellPurpose",
        questionId: "screen.workflow",
        state: "supported",
        sourceType: "registered-contract",
        sourceRef: "usage-contexts.json#usage.form-work",
        statement: "목록의 대상을 바꿔가며 상세 조치를 이어간다.",
        decisionSubject: "screen.shell",
        factor: "workflow",
        selectedOption: "side-slide-panel",
      },
      {
        id: "shellInformation",
        questionId: "structure.relationships",
        state: "supported",
        sourceType: "registered-contract",
        sourceRef: "usage-contexts.json#usage.form-work",
        statement: "대상 식별 정보와 조치 입력은 같은 건에 속한다.",
        decisionSubject: "screen.shell",
        factor: "information-relationship",
        selectedOption: "side-slide-panel",
      },
      {
        id: "shellPattern",
        questionId: "screen.direction",
        state: "supported",
        sourceType: "registered-contract",
        sourceRef: "pattern-contracts.json#shell.side-slide-panel",
        statement: "배경 목록을 유지하며 대상 전환을 이어가는 패턴과 맞는다.",
        decisionSubject: "screen.shell",
        factor: "pattern-context",
        selectedOption: "side-slide-panel",
        alternatives: [{ option: "center-modal", reason: "한 건에 집중하는 작업 경계보다 목록 연속성이 더 중요하다." }],
      },
    ],
  };
  const result = resolveScreenRequest(request, registry);
  assert.ok(!result.quality.issues.some((entry) => entry.code.startsWith("request.screen-direction")));
});

test("사용자가 팝업 유형을 직접 지정하면 해당 선택과 연결된 단일 명시 근거로 통과한다", () => {
  const request = JSON.parse(readFileSync(join(projectRoot, "tests", "fixtures", "screen-requests", "deterministic-side-slide.json"), "utf8"));
  request.assetDecisions = { schemaVersion: 1, elements: [] };
  request.evidence = {
    ...(request.evidence ?? {}),
    decisions: [{
      id: "explicitShell",
      questionId: "screen.direction",
      state: "confirmed",
      sourceType: "user-request",
      sourceRef: "사용자 원문: \"우측 슬라이드 팝업으로 만들어줘.\"",
      statement: "우측 슬라이드 팝업을 사용한다.",
      decisionSubject: "screen.shell",
      factor: "explicit-direction",
      selectedOption: "side-slide-panel",
    }],
  };
  const result = resolveScreenRequest(request, registry);
  assert.ok(!result.quality.issues.some((entry) => entry.code.startsWith("request.screen-direction")));
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
  const searchTablePattern = result.patternCandidates.find((entry) => entry.patternRef === "section.search-table-composition");
  assert.ok(searchTablePattern);
  assert.equal(searchTablePattern.selectionContext.coverage, "detailed-contract");
  assert.ok(searchTablePattern.selectionContext.useWhen.length > 0);
  assert.ok(searchTablePattern.selectionContext.doNotUseWhen.length > 0);
  assert.equal(searchTablePattern.contextReview, "explicit-parent-reference-needs-component-review");
  assert.equal(searchTablePattern.componentCoverage, 0);
  assert.ok(searchTablePattern.missingComponents.length > 0);
});
