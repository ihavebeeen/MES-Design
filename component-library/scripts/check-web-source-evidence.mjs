import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const registryDirectory = join(here, "..", "src", "design-system", "registry");

function readJson(name) {
  return JSON.parse(readFileSync(join(registryDirectory, name), "utf8"));
}

function uniqueMap(label, items, key, errors) {
  const map = new Map();
  for (const item of items ?? []) {
    const id = item?.[key];
    if (!id) {
      errors.push(`${label}: ${key}가 없는 항목이 있습니다.`);
      continue;
    }
    if (map.has(id)) errors.push(`${label}: 중복 ${key} '${id}'`);
    map.set(id, item);
  }
  return map;
}

export function validateWebSourceEvidence({ usage, reconciliation, authority, interactions }) {
  const errors = [];
  const usagePages = uniqueMap("web-ui-usage-inventory", usage.pages, "id", errors);
  const reconciliationPages = uniqueMap("web-figma-reconciliation", reconciliation.pages, "pageId", errors);
  const authorityPages = uniqueMap("web-figma-design-authority", authority.pages, "pageId", errors);
  const interactionPages = uniqueMap("web-ui-interaction-audit", interactions.pages, "pageId", errors);
  const reusableStateContexts = uniqueMap("web-ui-interaction-audit reusableStateContexts", interactions.reusableStateContexts, "id", errors);
  const screenLocalStateContexts = uniqueMap("web-ui-interaction-audit screenLocalStateContexts", interactions.screenLocalStateContexts, "id", errors);

  if (authority.figmaSearch?.status !== "page-sections-inspected") {
    errors.push("web-figma-design-authority: 최신 Figma 페이지 전체 섹션 조사 상태가 필요합니다.");
  }
  if (!Number.isInteger(authority.figmaSearch?.sectionCountInspected) || authority.figmaSearch.sectionCountInspected < 1) {
    errors.push("web-figma-design-authority: 조사한 Figma 섹션 수가 필요합니다.");
  }
  if (!Array.isArray(authority.authorityRules) || authority.authorityRules.length < 5) {
    errors.push("web-figma-design-authority: 디자인 기준 판정 규칙이 부족합니다.");
  }

  for (const pageId of usagePages.keys()) {
    if (!reconciliationPages.has(pageId)) errors.push(`web-figma-reconciliation: '${pageId}'가 없습니다.`);
    if (!authorityPages.has(pageId)) errors.push(`web-figma-design-authority: '${pageId}'가 없습니다.`);
    if (!interactionPages.has(pageId)) errors.push(`web-ui-interaction-audit: '${pageId}'가 없습니다.`);
  }
  for (const pageId of authorityPages.keys()) {
    if (!usagePages.has(pageId)) errors.push(`web-figma-design-authority: 실제 웹 목록에 없는 '${pageId}'를 참조합니다.`);
  }
  for (const pageId of interactionPages.keys()) {
    if (!usagePages.has(pageId)) errors.push(`web-ui-interaction-audit: 실제 웹 목록에 없는 '${pageId}'를 참조합니다.`);
  }

  const allowedResolutions = new Set([
    "base-current",
    "base-with-revisions",
    "completed-revision-visible",
    "revision-only",
    "unresolved"
  ]);
  for (const page of authorityPages.values()) {
    if (!allowedResolutions.has(page.resolution)) {
      errors.push(`web-figma-design-authority '${page.pageId}': 알 수 없는 resolution '${page.resolution}'`);
    }
    if (page.resolution === "unresolved" && (!Array.isArray(page.notes) || page.notes.length === 0)) {
      errors.push(`web-figma-design-authority '${page.pageId}': unresolved 사유가 필요합니다.`);
    }
    if (page.resolution === "revision-only" && (!Array.isArray(page.revisionSectionIds) || page.revisionSectionIds.length === 0)) {
      errors.push(`web-figma-design-authority '${page.pageId}': revision-only에는 revisionSectionIds가 필요합니다.`);
    }
    if (page.revisionSectionIds?.length > 1 && !page.baseSpecNodeId && !page.paintOrderResolution) {
      errors.push(`web-figma-design-authority '${page.pageId}': 겹친 revision 후보의 표시 순서 판정이 필요합니다.`);
    }
  }

  const allowedRowStatuses = new Set(["selected", "no-data", "not-applicable"]);
  const allowedEntryStatuses = new Set(["opened", "no-overlay", "not-invoked"]);
  const allowedDoubleClickStatuses = new Set(["opened", "no-overlay"]);
  for (const page of interactionPages.values()) {
    if (!allowedRowStatuses.has(page.row?.status)) {
      errors.push(`web-ui-interaction-audit '${page.pageId}': 알 수 없는 row.status '${page.row?.status}'`);
    }
    if (page.row?.status === "selected" && !page.row.doubleClick) {
      errors.push(`web-ui-interaction-audit '${page.pageId}': 선택한 행의 더블클릭 결과가 필요합니다.`);
    }
    if (page.row?.status === "no-data" && page.row.doubleClick) {
      errors.push(`web-ui-interaction-audit '${page.pageId}': 데이터가 없는데 더블클릭 통과를 기록할 수 없습니다.`);
    }
    if (page.row?.doubleClick && !allowedDoubleClickStatuses.has(page.row.doubleClick.status)) {
      errors.push(`web-ui-interaction-audit '${page.pageId}': 알 수 없는 더블클릭 결과 '${page.row.doubleClick.status}'`);
    }
    if (page.row?.doubleClick?.status === "opened" && (!page.row.doubleClick.surface || !page.row.doubleClick.title || !page.row.doubleClick.width)) {
      errors.push(`web-ui-interaction-audit '${page.pageId}': 더블클릭으로 열린 화면의 surface·title·width가 필요합니다.`);
    }
    if (!Array.isArray(page.entries)) {
      errors.push(`web-ui-interaction-audit '${page.pageId}': entries 배열이 필요합니다.`);
      continue;
    }
    for (const entry of page.entries) {
      if (!entry.trigger || !allowedEntryStatuses.has(entry.status)) {
        errors.push(`web-ui-interaction-audit '${page.pageId}': entry 형식이 잘못되었습니다.`);
      }
      if (entry.status === "opened" && (!entry.surface || !entry.title || !entry.width)) {
        errors.push(`web-ui-interaction-audit '${page.pageId}' '${entry.trigger}': 열린 화면의 surface·title·width가 필요합니다.`);
      }
    }
    for (const transition of page.stateTransitions ?? []) {
      if (!transition.before || !transition.action || !transition.after) {
        errors.push(`web-ui-interaction-audit '${page.pageId}': 상태 변화에는 before·action·after가 모두 필요합니다.`);
      }
    }
  }

  const minimumDistinctScreens = interactions.contextPromotionPolicy?.minimumDistinctScreens;
  if (!Number.isInteger(minimumDistinctScreens) || minimumDistinctScreens < 2) {
    errors.push("web-ui-interaction-audit: 공통 상태 맥락의 최소 화면 근거는 2개 이상이어야 합니다.");
  }
  if (!Array.isArray(interactions.contextPromotionPolicy?.requiredMatch) || interactions.contextPromotionPolicy.requiredMatch.length < 3) {
    errors.push("web-ui-interaction-audit: 공통 상태 맥락으로 묶을 행동·목적·결과 기준이 필요합니다.");
  }
  for (const context of reusableStateContexts.values()) {
    if (!context.name || !context.useWhen || !context.result || !Array.isArray(context.evidence)) {
      errors.push(`web-ui-interaction-audit reusableStateContext '${context.id}': name·useWhen·result·evidence가 필요합니다.`);
      continue;
    }
    const evidencePageIds = new Set(context.evidence.map((entry) => entry.pageId));
    if (evidencePageIds.size < minimumDistinctScreens) {
      errors.push(`web-ui-interaction-audit reusableStateContext '${context.id}': 서로 다른 화면 ${minimumDistinctScreens}개 이상의 근거가 필요합니다.`);
    }
    for (const evidence of context.evidence) {
      const page = interactionPages.get(evidence.pageId);
      if (!page) {
        errors.push(`web-ui-interaction-audit reusableStateContext '${context.id}': 없는 화면 '${evidence.pageId}'를 참조합니다.`);
        continue;
      }
      if (!Number.isInteger(evidence.transitionIndex) || !page.stateTransitions?.[evidence.transitionIndex]) {
        errors.push(`web-ui-interaction-audit reusableStateContext '${context.id}': '${evidence.pageId}'의 상태 변화 근거가 없습니다.`);
      }
    }
  }
  for (const context of screenLocalStateContexts.values()) {
    const page = interactionPages.get(context.pageId);
    if (!page || !context.reason || !Array.isArray(context.evidence) || context.evidence.length === 0) {
      errors.push(`web-ui-interaction-audit screenLocalStateContext '${context.id}': 화면·사유·근거가 필요합니다.`);
      continue;
    }
    for (const evidence of context.evidence) {
      if (!Number.isInteger(evidence.transitionIndex) || !page.stateTransitions?.[evidence.transitionIndex]) {
        errors.push(`web-ui-interaction-audit screenLocalStateContext '${context.id}': 상태 변화 근거가 없습니다.`);
      }
    }
  }

  if (interactions.source?.mode !== "read-only-ui-inspection" || interactions.coverage?.writeActionsExecuted !== 0) {
    errors.push("web-ui-interaction-audit: 읽기 전용 조사에서 저장·삭제·승인 확정 이력이 없어야 합니다.");
  }
  if (interactions.coverage?.pagesObserved !== usagePages.size || interactions.coverage?.mainMenuPages !== usagePages.size) {
    errors.push("web-ui-interaction-audit: 42개 메뉴 화면 범위와 pages 개수가 일치해야 합니다.");
  }
  const rowStatusCounts = [...interactionPages.values()].reduce((counts, page) => {
    counts[page.row.status] = (counts[page.row.status] ?? 0) + 1;
    return counts;
  }, {});
  if (interactions.coverage?.pagesWithSelectedDataRow !== (rowStatusCounts.selected ?? 0)) {
    errors.push("web-ui-interaction-audit: 선택한 데이터 행 수가 실제 기록과 다릅니다.");
  }
  if (interactions.coverage?.pagesBlockedByCurrentNoData !== (rowStatusCounts["no-data"] ?? 0)) {
    errors.push("web-ui-interaction-audit: 데이터 부족 화면 수가 실제 기록과 다릅니다.");
  }
  if (interactions.coverage?.pagesWithoutRowDetail !== (rowStatusCounts["not-applicable"] ?? 0)) {
    errors.push("web-ui-interaction-audit: 행 상세 비적용 화면 수가 실제 기록과 다릅니다.");
  }
  const stateTransitionPageCount = [...interactionPages.values()].filter((page) => page.stateTransitions?.length > 0).length;
  if (interactions.coverage?.pagesWithStateTransitionsObserved !== stateTransitionPageCount) {
    errors.push("web-ui-interaction-audit: 상태 변화 확인 화면 수가 실제 기록과 다릅니다.");
  }
  for (const pageId of ["web.receiving", "web.production-result", "web.shipment-result", "web.material-input-analysis", "web.lot-trace", "web.inspection-trend", "web.production-analysis", "web.kpi"]) {
    if (!interactionPages.get(pageId)?.stateTransitions?.length) {
      errors.push(`web-ui-interaction-audit '${pageId}': 선택·전달·편집 상태 변화 기록이 필요합니다.`);
    }
  }

  const warehouse = authorityPages.get("web.warehouse");
  const warehouseModal = warehouse?.resolvedSurfaces?.find((item) => item.surface === "default-warehouse-modal");
  if (warehouse?.resolution !== "completed-revision-visible" || warehouseModal?.nodeId !== "16553:37111") {
    errors.push("web.warehouse: 기본 창고 설정은 완료된 Figma 개선안 16553:37111을 기준으로 사용해야 합니다.");
  }
  if (!warehouse?.runtimeOnlyContentExtensions?.includes("창고코드") || !warehouse?.runtimeOnlyContentExtensions?.includes("사내코드")) {
    errors.push("web.warehouse: 웹 전용 필드 확장을 디자인 차이와 분리해 기록해야 합니다.");
  }

  for (const revision of authority.revisionStatuses ?? []) {
    if (revision.status !== "completed" && revision.mayOverrideBase !== false) {
      errors.push(`Figma revision '${revision.nodeId}': ${revision.status} 상태는 완료 원본을 덮어쓸 수 없습니다.`);
    }
  }

  return errors;
}

export function loadWebSourceEvidence() {
  return {
    usage: readJson("web-ui-usage-inventory.json"),
    reconciliation: readJson("web-figma-reconciliation.json"),
    authority: readJson("web-figma-design-authority.json"),
    interactions: readJson("web-ui-interaction-audit.json")
  };
}

if (process.argv.includes("--check")) {
  const evidence = loadWebSourceEvidence();
  const errors = validateWebSourceEvidence(evidence);
  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Web/Figma source evidence check passed: ${evidence.authority.pages.length} pages, ${evidence.interactions.pages.length} interaction records.`);
  }
}
