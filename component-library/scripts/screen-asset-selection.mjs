export const SEMANTIC_ASSET_CATEGORIES = [
  "application-frame",
  "navigation-query",
  "content-structure",
  "data-display",
  "status-feedback",
  "input-selection",
  "actions",
  "overlay-behavior",
];

const targetKinds = new Set(["page", "center-modal", "side-slide-panel", "confirm-dialog"]);
const bases = new Set(["confirmed", "supported", "assumed", "unresolved"]);
const impacts = new Set(["presentation", "business-behavior"]);
const decisions = new Set(["selected", "deferred", "not-applicable", "propose-new"]);

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function finding(severity, code, message, reference) {
  return { severity, code, message, ...(reference ? { reference } : {}) };
}

function isUniqueStringList(value) {
  return Array.isArray(value)
    && value.every((entry) => typeof entry === "string" && entry.trim() !== "")
    && unique(value).length === value.length;
}

export function validateSemanticAssetDraft(draft) {
  const findings = [];
  const allowedTopLevel = new Set(["schemaVersion", "targetKind", "notApplicableCategories", "elements"]);
  const allowedElementKeys = new Set([
    "id",
    "label",
    "category",
    "capability",
    "parentRefs",
    "basis",
    "impact",
    "decision",
    "selectedComponentRef",
    "candidateComponentRefs",
    "reason",
  ]);

  if (!draft || typeof draft !== "object" || Array.isArray(draft)) {
    return [finding("blocker", "asset-selection.invalid-draft", "의미 자산 검토 입력은 객체여야 합니다.")];
  }
  for (const key of Object.keys(draft)) {
    if (!allowedTopLevel.has(key)) findings.push(finding("blocker", "asset-selection.unknown-field", `알 수 없는 의미 자산 검토 필드 '${key}'입니다.`));
  }
  if (draft.schemaVersion !== 1) findings.push(finding("blocker", "asset-selection.schema-version", "의미 자산 검토 schemaVersion은 1이어야 합니다."));
  if (!targetKinds.has(draft.targetKind)) findings.push(finding("blocker", "asset-selection.target-kind", "의미 자산 검토 targetKind가 잘못되었습니다."));
  if (!isUniqueStringList(draft.notApplicableCategories ?? [])) findings.push(finding("blocker", "asset-selection.not-applicable-categories", "notApplicableCategories는 중복 없는 문자열 배열이어야 합니다."));
  for (const category of draft.notApplicableCategories ?? []) {
    if (!SEMANTIC_ASSET_CATEGORIES.includes(category)) findings.push(finding("blocker", "asset-selection.unknown-category", `알 수 없는 의미 범주 '${category}'입니다.`, category));
  }
  if (!Array.isArray(draft.elements)) {
    findings.push(finding("blocker", "asset-selection.elements", "elements 배열이 필요합니다."));
    return findings;
  }

  const ids = new Set();
  for (const [index, element] of draft.elements.entries()) {
    const path = `elements[${index}]`;
    if (!element || typeof element !== "object" || Array.isArray(element)) {
      findings.push(finding("blocker", "asset-selection.element", `${path}는 객체여야 합니다.`));
      continue;
    }
    for (const key of Object.keys(element)) {
      if (!allowedElementKeys.has(key)) findings.push(finding("blocker", "asset-selection.unknown-field", `알 수 없는 필드 '${path}.${key}'입니다.`));
    }
    if (!/^[a-z][A-Za-z0-9.-]*$/.test(element.id ?? "") || ids.has(element.id)) findings.push(finding("blocker", "asset-selection.element-id", `${path}.id는 중복 없는 식별자여야 합니다.`));
    ids.add(element.id);
    if (typeof element.label !== "string" || element.label.trim() === "") findings.push(finding("blocker", "asset-selection.element-label", `${path}.label이 필요합니다.`));
    if (!SEMANTIC_ASSET_CATEGORIES.includes(element.category)) findings.push(finding("blocker", "asset-selection.element-category", `${path}.category가 잘못되었습니다.`));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(element.capability ?? "")) findings.push(finding("blocker", "asset-selection.capability", `${path}.capability는 kebab-case여야 합니다.`));
    if (!isUniqueStringList(element.parentRefs ?? [])) findings.push(finding("blocker", "asset-selection.parent-refs", `${path}.parentRefs는 중복 없는 문자열 배열이어야 합니다.`));
    if (!isUniqueStringList(element.candidateComponentRefs ?? [])) findings.push(finding("blocker", "asset-selection.candidate-refs", `${path}.candidateComponentRefs는 중복 없는 문자열 배열이어야 합니다.`));
    if (!bases.has(element.basis)) findings.push(finding("blocker", "asset-selection.basis", `${path}.basis가 잘못되었습니다.`));
    if (!impacts.has(element.impact)) findings.push(finding("blocker", "asset-selection.impact", `${path}.impact가 잘못되었습니다.`));
    if (!decisions.has(element.decision)) findings.push(finding("blocker", "asset-selection.decision", `${path}.decision이 잘못되었습니다.`));
    if (element.decision === "selected" && (typeof element.selectedComponentRef !== "string" || element.selectedComponentRef === "")) findings.push(finding("blocker", "asset-selection.selected-ref", `${path}의 selected 결정에는 selectedComponentRef가 필요합니다.`));
    if (element.decision !== "selected" && element.selectedComponentRef !== undefined) findings.push(finding("blocker", "asset-selection.selected-ref", `${path}의 selectedComponentRef는 decision이 selected일 때만 사용합니다.`));
    if (element.reason !== undefined && (typeof element.reason !== "string" || element.reason.trim() === "")) findings.push(finding("blocker", "asset-selection.reason", `${path}.reason은 비어 있지 않은 문자열이어야 합니다.`));
  }
  return findings;
}

function compactCandidate(component, contract, match) {
  return {
    componentRef: component.id,
    name: component.name,
    status: component.status,
    match,
    contractCoverage: contract ? "selection-guard" : "source-api-only",
    capabilities: contract?.capabilities ?? [],
    allowedParents: contract?.allowedParents ?? [],
    useWhen: contract?.useWhen ?? [],
    doNotUseWhen: contract?.doNotUseWhen ?? [],
  };
}

function reviewElement(element, componentMap, usageMap) {
  const parents = new Set(element.parentRefs ?? []);
  const exact = [];
  const compatible = [];
  const declared = [];

  for (const contract of usageMap.values()) {
    if (!contract.capabilities.includes(element.capability)) continue;
    const component = componentMap.get(contract.componentId);
    if (!component) continue;
    const parentMatch = parents.size > 0 && contract.allowedParents.some((parent) => parents.has(parent));
    (parentMatch ? exact : compatible).push(compactCandidate(component, contract, parentMatch ? "capability-and-parent" : "capability-only"));
  }

  for (const componentRef of element.candidateComponentRefs ?? []) {
    if (exact.some((entry) => entry.componentRef === componentRef) || compatible.some((entry) => entry.componentRef === componentRef)) continue;
    const component = componentMap.get(componentRef);
    if (component) declared.push(compactCandidate(component, usageMap.get(componentRef), "declared-for-review"));
  }

  const byStability = (a, b) => Number(b.status === "stable") - Number(a.status === "stable") || a.componentRef.localeCompare(b.componentRef);
  exact.sort(byStability);
  compatible.sort(byStability);
  declared.sort(byStability);

  const selectedRef = element.selectedComponentRef;
  const selected = selectedRef ? componentMap.get(selectedRef) : null;
  const selectedContract = selectedRef ? usageMap.get(selectedRef) : null;
  const selectedCapabilityMatch = Boolean(selectedContract?.capabilities.includes(element.capability));
  const selectedParentMatch = Boolean(selectedContract && parents.size > 0 && selectedContract.allowedParents.some((parent) => parents.has(parent)));
  let selectedMatch = "none";
  if (selected) {
    if (selectedCapabilityMatch && selectedParentMatch) selectedMatch = "exact";
    else if (selectedCapabilityMatch) selectedMatch = "compatible-needs-parent-review";
    else if (!selectedContract) selectedMatch = "manual-source-api-review";
    else selectedMatch = "semantic-mismatch";
  } else if (selectedRef) selectedMatch = "unknown";

  let recommendation;
  if (exact.length === 1) recommendation = { outcome: "reuse-exact", componentRef: exact[0].componentRef, automatic: false };
  else if (exact.length > 1) recommendation = { outcome: "choose-between-exact", componentRefs: exact.map((entry) => entry.componentRef), automatic: false };
  else if (compatible.length > 0) recommendation = { outcome: "review-compatible", componentRefs: compatible.map((entry) => entry.componentRef), automatic: false };
  else if (declared.length > 0) recommendation = { outcome: "review-declared", componentRefs: declared.map((entry) => entry.componentRef), automatic: false };
  else recommendation = { outcome: "search-or-propose-new", automatic: false };

  return {
    id: element.id,
    label: element.label,
    category: element.category,
    capability: element.capability,
    basis: element.basis,
    impact: element.impact,
    decision: element.decision,
    selectedComponentRef: selectedRef ?? null,
    selectedMatch,
    exactCandidates: exact,
    compatibleCandidates: compatible,
    declaredCandidates: declared,
    recommendation,
  };
}

export function reviewScreenAssetSelection(draft, registry) {
  const findings = validateSemanticAssetDraft(draft);
  if (findings.some((entry) => entry.severity === "blocker")) {
    return {
      status: "blocked",
      reviewedCategories: [],
      unreviewedCategories: SEMANTIC_ASSET_CATEGORIES,
      elements: [],
      blockerCount: findings.filter((entry) => entry.severity === "blocker").length,
      warningCount: 0,
      infoCount: 0,
      findings,
    };
  }

  const componentMap = new Map(registry.components.map((entry) => [entry.id, entry]));
  const usageMap = new Map(registry.componentUsageContracts.map((entry) => [entry.componentId, entry]));
  const elementReviews = draft.elements.map((element) => reviewElement(element, componentMap, usageMap));
  const representedCategories = new Set(draft.elements.map((element) => element.category));
  const notApplicable = new Set(draft.notApplicableCategories ?? []);
  const unreviewedCategories = SEMANTIC_ASSET_CATEGORIES.filter((category) => !representedCategories.has(category) && !notApplicable.has(category));

  for (const category of unreviewedCategories) {
    findings.push(finding("info", "asset-selection.category-unreviewed", `의미 범주 '${category}'는 아직 검토되지 않았습니다. 화면에 없다면 notApplicableCategories로 표시할 수 있습니다.`, category));
  }

  for (const review of elementReviews) {
    if (review.selectedMatch === "unknown") findings.push(finding("warning", "asset-selection.unknown-selected", `'${review.label}'에 선택한 component '${review.selectedComponentRef}'가 등록되어 있지 않습니다.`, review.id));
    else if (review.selectedMatch === "semantic-mismatch") findings.push(finding("warning", "asset-selection.semantic-mismatch", `'${review.label}'의 capability '${review.capability}'와 선택한 component '${review.selectedComponentRef}'의 사용 계약이 맞지 않습니다.`, review.id));
    else if (review.selectedMatch === "compatible-needs-parent-review") findings.push(finding("warning", "asset-selection.parent-review", `'${review.label}'의 component '${review.selectedComponentRef}'는 의미는 가깝지만 현재 parent 맥락은 사용 계약에 없습니다.`, review.id));
    else if (review.selectedMatch === "manual-source-api-review") findings.push(finding("info", "asset-selection.source-api-review", `'${review.label}'의 component '${review.selectedComponentRef}'는 상세 선택 계약이 없는 단순 자산이므로 실제 API와 기본 문서를 확인하세요.`, review.id));

    if (review.decision === "propose-new" && (review.exactCandidates.length > 0 || review.compatibleCandidates.length > 0)) {
      findings.push(finding("warning", "asset-selection.premature-new-asset", `'${review.label}'에는 기존 후보가 있습니다. 의미·동작 차이를 확인한 뒤 신규 자산 여부를 결정하세요.`, review.id));
    } else if (review.decision !== "selected") {
      if (review.exactCandidates.length > 0) findings.push(finding("info", "asset-selection.exact-candidate", `'${review.label}'에 parent 맥락까지 맞는 기존 후보가 있습니다: ${review.exactCandidates.map((entry) => entry.componentRef).join(", ")}.`, review.id));
      else if (review.compatibleCandidates.length > 0) findings.push(finding("info", "asset-selection.compatible-candidate", `'${review.label}'에 의미가 가까운 후보가 있지만 parent·상태·동작 검토가 필요합니다: ${review.compatibleCandidates.map((entry) => entry.componentRef).join(", ")}.`, review.id));
      else if (review.declaredCandidates.length === 0) findings.push(finding("info", "asset-selection.no-candidate", `'${review.label}'에 계약으로 확인되는 기존 후보가 없습니다. 추가 검색 후 필요하면 신규 자산 proposal로 이동하세요.`, review.id));
    }

    if (review.impact === "business-behavior" && ["assumed", "unresolved"].includes(review.basis) && review.decision === "selected") {
      findings.push(finding("warning", "asset-selection.unconfirmed-business-decision", `'${review.label}'은 미확정 업무 동작인데 component가 선택됐습니다. UI 선택 전에 업무 의도를 확인하거나 가정임을 유지하세요.`, review.id));
    }
  }

  const blockerCount = findings.filter((entry) => entry.severity === "blocker").length;
  const warningCount = findings.filter((entry) => entry.severity === "warning").length;
  return {
    status: blockerCount > 0 ? "blocked" : warningCount > 0 || unreviewedCategories.length > 0 || elementReviews.some((entry) => entry.decision !== "selected" && entry.decision !== "not-applicable") ? "review-needed" : "ready",
    policy: {
      authority: "advisory-pre-request-selection",
      automaticSelection: false,
      blockingBoundary: "invalid-input-only",
      note: "후보는 ScreenRequest를 대신 결정하지 않는다. 확정 근거와 전체 화면 맥락을 검토해 채택한 자산만 요청에 연결한다.",
    },
    reviewedCategories: [...representedCategories],
    notApplicableCategories: [...notApplicable],
    unreviewedCategories,
    elements: elementReviews,
    blockerCount,
    warningCount,
    infoCount: findings.filter((entry) => entry.severity === "info").length,
    findings,
  };
}
