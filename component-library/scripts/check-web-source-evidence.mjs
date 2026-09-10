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

export function validateWebSourceEvidence({ usage, reconciliation, authority, interactions, usageContexts, patterns }) {
  const errors = [];
  const usagePages = uniqueMap("web-ui-usage-inventory", usage.pages, "id", errors);
  const reconciliationPages = uniqueMap("web-figma-reconciliation", reconciliation.pages, "pageId", errors);
  const authorityPages = uniqueMap("web-figma-design-authority", authority.pages, "pageId", errors);
  const interactionPages = uniqueMap("web-ui-interaction-audit", interactions.pages, "pageId", errors);
  const representativeComparisons = uniqueMap("web-figma-reconciliation representativeComparisons", reconciliation.representativeComparisons, "id", errors);
  const reusableStateContexts = uniqueMap("web-ui-interaction-audit reusableStateContexts", interactions.reusableStateContexts, "id", errors);
  const screenLocalStateContexts = uniqueMap("web-ui-interaction-audit screenLocalStateContexts", interactions.screenLocalStateContexts, "id", errors);
  const usageContextIds = new Set((usageContexts?.contexts ?? []).map((item) => item.id));
  const patternIds = new Set((patterns?.patterns ?? []).map((item) => item.id));

  if (authority.figmaSearch?.status !== "page-sections-inspected") {
    errors.push("web-figma-design-authority: 최신 Figma 페이지 전체 섹션 조사 상태가 필요합니다.");
  }
  if (!Number.isInteger(authority.figmaSearch?.sectionCountInspected) || authority.figmaSearch.sectionCountInspected < 1) {
    errors.push("web-figma-design-authority: 조사한 Figma 섹션 수가 필요합니다.");
  }
  if (!Array.isArray(authority.authorityRules) || authority.authorityRules.length < 5) {
    errors.push("web-figma-design-authority: 디자인 기준 판정 규칙이 부족합니다.");
  }

  const comparisonProtocol = reconciliation.comparisonProtocol;
  if (comparisonProtocol?.runtimeViewport?.requestedWidth !== 1920 || comparisonProtocol?.runtimeViewport?.requestedHeight !== 1080) {
    errors.push("web-figma-reconciliation: 실제 웹 대표 대조 viewport는 1920×1080이어야 합니다.");
  }
  if (!Array.isArray(comparisonProtocol?.comparisonFields) || comparisonProtocol.comparisonFields.length < 6) {
    errors.push("web-figma-reconciliation: 셸·조회·테이블·액션·오버레이·상태 변화 대조 항목이 필요합니다.");
  }
  const detailedComparison = reconciliation.detailedComparisonPass;
  const detailedPageIds = new Set();
  const detailedFamilies = uniqueMap(
    "web-figma-reconciliation detailedComparisonPass.familyCoverage",
    detailedComparison?.familyCoverage,
    "family",
    errors
  );
  for (const family of detailedFamilies.values()) {
    if (!Array.isArray(family.pageIds) || family.pageIds.length === 0 || !family.figmaShellState || !family.runtimeShellState || !family.result) {
      errors.push(`web-figma-reconciliation detailed family '${family.family}': 화면·셸 상태·결과가 필요합니다.`);
      continue;
    }
    for (const pageId of family.pageIds) {
      if (detailedPageIds.has(pageId)) errors.push(`web-figma-reconciliation detailed comparison: '${pageId}'가 여러 화면군에 중복됩니다.`);
      detailedPageIds.add(pageId);
      if (!usagePages.has(pageId)) errors.push(`web-figma-reconciliation detailed comparison: 실제 웹에 없는 '${pageId}'를 참조합니다.`);
    }
  }
  const resolvedFramePageIds = new Set(
    [...authorityPages.values()].filter((page) => /^\d+:\d+$/.test(page.actualUiFrameId ?? "")).map((page) => page.pageId)
  );
  for (const pageId of resolvedFramePageIds) {
    if (!detailedPageIds.has(pageId)) errors.push(`web-figma-reconciliation detailed comparison: 실제 UI frame이 있는 '${pageId}'가 상세 대조에서 빠졌습니다.`);
  }
  for (const pageId of detailedPageIds) {
    if (!resolvedFramePageIds.has(pageId)) errors.push(`web-figma-reconciliation detailed comparison: '${pageId}'에는 확정된 실제 UI frame이 없습니다.`);
  }
  const unpairedRuntimePages = new Set(detailedComparison?.unpairedRuntimePages ?? []);
  const expectedUnpairedRuntimePages = new Set([...usagePages.keys()].filter((pageId) => !resolvedFramePageIds.has(pageId)));
  for (const pageId of expectedUnpairedRuntimePages) {
    if (!unpairedRuntimePages.has(pageId)) errors.push(`web-figma-reconciliation detailed comparison: 원본 frame 미확정 화면 '${pageId}'가 분리 목록에서 빠졌습니다.`);
  }
  for (const pageId of unpairedRuntimePages) {
    if (!expectedUnpairedRuntimePages.has(pageId)) errors.push(`web-figma-reconciliation detailed comparison: '${pageId}'는 원본 frame 미확정 화면이 아닙니다.`);
  }
  if (!Array.isArray(detailedComparison?.method) || detailedComparison.method.length < 3) {
    errors.push("web-figma-reconciliation detailed comparison: 대조 방법이 필요합니다.");
  }
  if (!Array.isArray(detailedComparison?.sharedFindings) || detailedComparison.sharedFindings.length === 0 ||
      !Array.isArray(detailedComparison?.screenExceptions) || detailedComparison.screenExceptions.length === 0 ||
      !Array.isArray(detailedComparison?.remaining) || detailedComparison.remaining.length === 0) {
    errors.push("web-figma-reconciliation detailed comparison: 공통 차이·화면 예외·남은 대조가 필요합니다.");
  }
  if (reconciliation.coverage?.detailedFigmaFramesInspected !== resolvedFramePageIds.size ||
      reconciliation.coverage?.detailedRuntimePagesInspected !== detailedPageIds.size ||
      reconciliation.coverage?.detailedFamiliesInspected !== detailedFamilies.size) {
    errors.push("web-figma-reconciliation: 상세 대조 집계가 실제 기록과 다릅니다.");
  }
  const conditionalComparison = reconciliation.conditionalStateComparisonPass;
  const conditionalRepresentatives = uniqueMap(
    "web-figma-reconciliation conditionalStateComparisonPass.representatives",
    conditionalComparison?.representatives,
    "id",
    errors
  );
  if (conditionalComparison?.status !== "representative-overlays-and-states-compared") {
    errors.push("web-figma-reconciliation: 팝업·상태 상세 대조 상태가 필요합니다.");
  }
  if (!Array.isArray(conditionalComparison?.comparisonPolicy?.primary) || conditionalComparison.comparisonPolicy.primary.length < 5 ||
      !Array.isArray(conditionalComparison?.comparisonPolicy?.secondary) || !conditionalComparison.comparisonPolicy.pixelDifferenceRule) {
    errors.push("web-figma-reconciliation: 팝업 대조는 내부 구성 우선순위와 픽셀 차이 판정 규칙이 필요합니다.");
  }
  if (conditionalComparison?.runtimeViewport?.requested?.width !== 1920 ||
      conditionalComparison?.runtimeViewport?.requested?.height !== 1080) {
    errors.push("web-figma-reconciliation: 팝업·상태 대조 viewport는 1920×1080이어야 합니다.");
  }
  const popupInventory = conditionalComparison?.figmaPopupInventory;
  const popupFamilySurfaceCount = (popupInventory?.sizeFamilies ?? []).reduce((sum, family) => sum + (family.count ?? 0), 0);
  if (!Number.isInteger(popupInventory?.specFramesInspected) || !Number.isInteger(popupInventory?.surfacesInspected) ||
      popupInventory.specFramesInspected < 1 || popupInventory.surfacesInspected < 1 ||
      popupFamilySurfaceCount !== popupInventory.surfacesInspected) {
    errors.push("web-figma-reconciliation: Figma 팝업 전수 조사 집계가 실제 크기군 기록과 다릅니다.");
  }
  const openedEntryFlows = [...interactionPages.values()].flatMap((page) =>
    (page.entries ?? []).filter((entry) => entry.status === "opened").map((entry) => ({ pageId: page.pageId, trigger: entry.trigger }))
  );
  const entryPageIds = new Set(openedEntryFlows.map((flow) => flow.pageId));
  const rowOnlyFlows = [...interactionPages.values()]
    .filter((page) => page.row?.doubleClick?.status === "opened" && !entryPageIds.has(page.pageId))
    .map((page) => ({ pageId: page.pageId, trigger: "행 더블클릭" }));
  const expectedPopupFlows = [...openedEntryFlows, ...rowOnlyFlows];
  const flowContextProfiles = uniqueMap(
    "web-figma-reconciliation runtimeEntryFlowCoverage.contextProfiles",
    conditionalComparison?.runtimeEntryFlowCoverage?.contextProfiles,
    "id",
    errors
  );
  const referencedFlowContextProfiles = new Set();
  for (const profile of flowContextProfiles.values()) {
    if (!profile.name || !profile.purpose || !profile.informationRelationship ||
        !Array.isArray(profile.usageContextRefs) || profile.usageContextRefs.length === 0 ||
        !Array.isArray(profile.patternRefs) || profile.patternRefs.length === 0 ||
        !Array.isArray(profile.stateContextRefs)) {
      errors.push(`web-figma-reconciliation flow context '${profile.id}': 목적·정보 관계·자산 연결이 필요합니다.`);
      continue;
    }
    for (const ref of profile.usageContextRefs) {
      if (!usageContextIds.has(ref)) errors.push(`web-figma-reconciliation flow context '${profile.id}': 알 수 없는 usage context '${ref}'`);
    }
    for (const ref of profile.patternRefs) {
      if (!patternIds.has(ref)) errors.push(`web-figma-reconciliation flow context '${profile.id}': 알 수 없는 pattern '${ref}'`);
    }
    for (const ref of profile.stateContextRefs) {
      if (!reusableStateContexts.has(ref) && !screenLocalStateContexts.has(ref)) {
        errors.push(`web-figma-reconciliation flow context '${profile.id}': 알 수 없는 state context '${ref}'`);
      }
    }
    if (profile.authority === "runtime-reference-only" && !profile.sourceDecision) {
      errors.push(`web-figma-reconciliation flow context '${profile.id}': 웹 참고 전용 분류에는 원본 검색 판정이 필요합니다.`);
    }
  }
  const flowMappings = uniqueMap(
    "web-figma-reconciliation runtimeEntryFlowCoverage.mappings",
    (conditionalComparison?.runtimeEntryFlowCoverage?.mappings ?? []).map((item) => ({ ...item, key: `${item.pageId}|${item.trigger}` })),
    "key",
    errors
  );
  for (const flow of expectedPopupFlows) {
    const key = `${flow.pageId}|${flow.trigger}`;
    if (!flowMappings.has(key)) errors.push(`web-figma-reconciliation: 실제 웹 팝업 진입 '${key}'의 Figma 구성 대조가 빠졌습니다.`);
  }
  const mappedPageIds = new Set([...flowMappings.values()].map((item) => item.pageId));
  for (const page of interactionPages.values()) {
    if (page.row?.doubleClick?.status === "opened" && !mappedPageIds.has(page.pageId)) {
      errors.push(`web-figma-reconciliation: '${page.pageId}'의 행 더블클릭 상세 구성 대조가 빠졌습니다.`);
    }
  }
  for (const mapping of flowMappings.values()) {
    if (!mapping.runtimeTitle || !mapping.status || !mapping.compositionBasis || !mapping.contextProfileRef ||
        (mapping.figmaNodeId !== null && !/^\d+:\d+$/.test(mapping.figmaNodeId))) {
      errors.push(`web-figma-reconciliation runtime flow '${mapping.key}': 원본 연결과 내부 구성 판정이 필요합니다.`);
    }
    if (!flowContextProfiles.has(mapping.contextProfileRef)) {
      errors.push(`web-figma-reconciliation runtime flow '${mapping.key}': 알 수 없는 구성 맥락 '${mapping.contextProfileRef}'`);
    } else {
      referencedFlowContextProfiles.add(mapping.contextProfileRef);
    }
    if (mapping.status === "runtime-only-reference") {
      const profile = flowContextProfiles.get(mapping.contextProfileRef);
      if (mapping.figmaNodeId !== null || profile?.authority !== "runtime-reference-only") {
        errors.push(`web-figma-reconciliation runtime flow '${mapping.key}': 웹 참고 전용 항목은 Figma 원본과 공통 권한을 가질 수 없습니다.`);
      }
    }
    for (const nodeId of mapping.supportingFigmaNodeIds ?? []) {
      if (!/^\d+:\d+$/.test(nodeId)) {
        errors.push(`web-figma-reconciliation runtime flow '${mapping.key}': 보조 Figma node ID가 잘못되었습니다.`);
      }
    }
    for (const candidate of mapping.rejectedFigmaCandidates ?? []) {
      if (!/^\d+:\d+$/.test(candidate?.nodeId ?? "") || !candidate?.reason) {
        errors.push(`web-figma-reconciliation runtime flow '${mapping.key}': 제외한 Figma 후보에는 node와 업무 의미 차이가 필요합니다.`);
      }
    }
    if (mapping.status === "matched-with-source-naming-error" && !mapping.sourceNamingIssue) {
      errors.push(`web-figma-reconciliation runtime flow '${mapping.key}': 원본 명칭 오류의 구체적인 내용이 필요합니다.`);
    }
    if (mapping.status === "candidate-needs-semantic-review" && mapping.figmaNodeId === null) {
      errors.push(`web-figma-reconciliation runtime flow '${mapping.key}': 의미 검토 후보에는 후보 Figma node가 필요합니다.`);
    }
  }
  for (const profileId of flowContextProfiles.keys()) {
    if (!referencedFlowContextProfiles.has(profileId)) errors.push(`web-figma-reconciliation flow context '${profileId}': 연결된 실제 웹 진입 흐름이 없습니다.`);
  }
  if (conditionalComparison?.runtimeEntryFlowCoverage?.observedFlowCount !== expectedPopupFlows.length || flowMappings.size !== expectedPopupFlows.length) {
    errors.push("web-figma-reconciliation: 실제 웹 팝업 진입 흐름 집계가 현재 상호작용 원장과 다릅니다.");
  }
  for (const comparison of conditionalRepresentatives.values()) {
    if (!usagePages.has(comparison.pageId)) {
      errors.push(`web-figma-reconciliation conditional comparison '${comparison.id}': 실제 웹에 없는 '${comparison.pageId}'를 참조합니다.`);
    }
    if (!comparison.interaction || !comparison.classification || !comparison.decision) {
      errors.push(`web-figma-reconciliation conditional comparison '${comparison.id}': 상호작용·분류·판정이 필요합니다.`);
    }
    if (!Array.isArray(comparison.compositionCheck?.items) || comparison.compositionCheck.items.length < 3 ||
        !new Set(["aligned", "difference", "source-unresolved"]).has(comparison.compositionCheck?.result) ||
        !comparison.compositionCheck?.notes) {
      errors.push(`web-figma-reconciliation conditional comparison '${comparison.id}': 내부 구성요소 대조 결과가 필요합니다.`);
    }
    if (comparison.figma && !/^\d+:\d+$/.test(comparison.figma.nodeId ?? "")) {
      errors.push(`web-figma-reconciliation conditional comparison '${comparison.id}': Figma node ID가 잘못되었습니다.`);
    }
    if (comparison.classification === "runtime-only-new-structure" && comparison.figma !== null) {
      errors.push(`web-figma-reconciliation conditional comparison '${comparison.id}': 웹 전용 신규 구조는 Figma 근거를 임의 연결할 수 없습니다.`);
    }
  }
  const conditionalItems = [...conditionalRepresentatives.values()];
  const measuredOverlayCount = conditionalItems.filter((item) => Number.isFinite(item.runtime?.width) && Number.isFinite(item.runtime?.height)).length;
  const stateComparisonCount = conditionalItems.filter((item) => item.id.startsWith("state.")).length;
  const withFigmaEvidenceCount = conditionalItems.filter((item) => item.figma !== null && item.figma !== undefined).length;
  if (reconciliation.coverage?.figmaPopupSpecFramesInspected !== popupInventory?.specFramesInspected ||
      reconciliation.coverage?.figmaPopupSurfacesInspected !== popupInventory?.surfacesInspected ||
      reconciliation.coverage?.conditionalRepresentativesCompared !== conditionalItems.length ||
      reconciliation.coverage?.runtimeOverlaySurfacesMeasured !== measuredOverlayCount ||
      reconciliation.coverage?.stateComparisonsRecorded !== stateComparisonCount ||
      reconciliation.coverage?.conditionalRepresentativesWithFigmaEvidence !== withFigmaEvidenceCount) {
    errors.push("web-figma-reconciliation: 팝업·상태 상세 대조 집계가 실제 기록과 다릅니다.");
  }
  if (!Array.isArray(conditionalComparison?.remaining) || conditionalComparison.remaining.length === 0) {
    errors.push("web-figma-reconciliation: 팝업·상태 상세 대조의 남은 항목이 필요합니다.");
  }
  const allowedComparisonLevels = new Set(["source-located", "structure-compared", "visual-difference-confirmed", "interaction-observed"]);
  const allowedComparisonClasses = new Set(["aligned-structure", "shared-ui-design-difference", "runtime-state-observed"]);
  for (const comparison of representativeComparisons.values()) {
    if (!usagePages.has(comparison.pageId)) {
      errors.push(`web-figma-reconciliation representativeComparison '${comparison.id}': 실제 웹에 없는 '${comparison.pageId}'를 참조합니다.`);
    }
    if (!allowedComparisonLevels.has(comparison.level) || !allowedComparisonClasses.has(comparison.classification)) {
      errors.push(`web-figma-reconciliation representativeComparison '${comparison.id}': 대조 단계 또는 분류가 잘못되었습니다.`);
    }
    if (!Array.isArray(comparison.observed) || !Array.isArray(comparison.remaining)) {
      errors.push(`web-figma-reconciliation representativeComparison '${comparison.id}': observed와 remaining 배열이 필요합니다.`);
    }
    if (comparison.level !== "interaction-observed") {
      const frame = comparison.figmaActualUiFrame;
      if (!/^\d+:\d+$/.test(frame?.nodeId ?? "") || !Number.isFinite(frame?.width) || !Number.isFinite(frame?.height)) {
        errors.push(`web-figma-reconciliation representativeComparison '${comparison.id}': 내부 실제 UI frame의 node ID와 크기가 필요합니다.`);
      }
    }
    if (comparison.level === "visual-difference-confirmed" && comparison.classification === "shared-ui-design-difference" && comparison.authority !== "figma") {
      errors.push(`web-figma-reconciliation representativeComparison '${comparison.id}': 공통 UI 디자인 차이는 Figma 기준을 명시해야 합니다.`);
    }
    if (comparison.level === "interaction-observed" && (!comparison.runtimeState?.action || !comparison.runtimeState?.relatedAction)) {
      errors.push(`web-figma-reconciliation representativeComparison '${comparison.id}': 실제 웹 상태 변화와 연결 액션이 필요합니다.`);
    }
  }
  const comparisonLevelCounts = [...representativeComparisons.values()].reduce((counts, item) => {
    counts[item.level] = (counts[item.level] ?? 0) + 1;
    return counts;
  }, {});
  if (reconciliation.coverage?.representativeStructureCompared !== (comparisonLevelCounts["structure-compared"] ?? 0)) {
    errors.push("web-figma-reconciliation: 대표 구조 대조 집계가 실제 기록과 다릅니다.");
  }
  if (reconciliation.coverage?.representativeVisualDifferencesConfirmed !== (comparisonLevelCounts["visual-difference-confirmed"] ?? 0)) {
    errors.push("web-figma-reconciliation: 대표 시각 차이 집계가 실제 기록과 다릅니다.");
  }
  if (reconciliation.coverage?.runtimeStatesObservedInRepresentativePass !== (comparisonLevelCounts["interaction-observed"] ?? 0)) {
    errors.push("web-figma-reconciliation: 대표 상태 변화 집계가 실제 기록과 다릅니다.");
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
    "scoped-revisions-current",
    "multi-state-current",
    "runtime-only-reference",
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
  const unresolvedAuthorityPages = [...authorityPages.values()]
    .filter((page) => page.resolution === "unresolved")
    .map((page) => page.pageId);
  const runtimeOnlyAuthorityPages = [...authorityPages.values()]
    .filter((page) => page.resolution === "runtime-only-reference")
    .map((page) => page.pageId);
  const resolvedAuthorityPageCount = authorityPages.size - unresolvedAuthorityPages.length - runtimeOnlyAuthorityPages.length;
  if (authority.coverage?.runtimePages !== usagePages.size ||
      authority.coverage?.pagesWithResolvedBaseOrRevision !== resolvedAuthorityPageCount ||
      JSON.stringify(authority.coverage?.unresolvedPages ?? []) !== JSON.stringify(unresolvedAuthorityPages) ||
      JSON.stringify(authority.coverage?.runtimeOnlyReferencePages ?? []) !== JSON.stringify(runtimeOnlyAuthorityPages)) {
    errors.push("web-figma-design-authority: 확정·미확정·웹 참고 전용 화면 집계가 실제 판정과 다릅니다.");
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
  const stateInterpretationPolicy = interactions.stateInterpretationPolicy;
  if (!stateInterpretationPolicy?.purpose || !Array.isArray(stateInterpretationPolicy.independentRoles) ||
      stateInterpretationPolicy.independentRoles.length < 5 || !Array.isArray(stateInterpretationPolicy.rules) ||
      stateInterpretationPolicy.rules.length < 5) {
    errors.push("web-ui-interaction-audit: 선택·편집·추가·비활성·불러오기 상태를 구분하는 해석 규칙이 필요합니다.");
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

  const monitoring = authorityPages.get("web.equipment-monitoring");
  const monitoringSurfaces = new Map((monitoring?.resolvedSurfaces ?? []).map((item) => [item.surface, item]));
  const requiredMonitoringSurfaces = [
    "molding-machine-information",
    "molding-alarm-history",
    "extrusion-speed-and-pressure",
    "extrusion-temperature-information",
    "extrusion-block-and-t-die",
    "extrusion-alarm-history"
  ];
  if (monitoring?.resolution !== "multi-state-current" ||
      requiredMonitoringSurfaces.some((surface) => !/^\d+:\d+$/.test(monitoringSurfaces.get(surface)?.nodeId ?? ""))) {
    errors.push("web.equipment-monitoring: 성형기·압출기 종류와 탭별 Figma 화면 6개를 하나의 상태 세트로 연결해야 합니다.");
  }
  const kpi = authorityPages.get("web.kpi");
  if (kpi?.resolution !== "runtime-only-reference" || kpi.actualUiFrameId !== null ||
      !Array.isArray(kpi.searchMatchNodeIds) || kpi.searchMatchNodeIds.length < 1) {
    errors.push("web.kpi: Figma 본문 부재와 실제 웹 참고 전용 판정을 함께 기록해야 합니다.");
  }

  const salesApproval = authorityPages.get("web.sales-management")?.resolvedSurfaces?.find((item) => item.surface === "single-shipment-approval");
  if (salesApproval?.nodeId !== "17370:46832") {
    errors.push("web.sales-management: 단건 출하승인은 출하승인 로직 변경 프레임 17370:46832를 사용해야 합니다.");
  }
  const inventory = authorityPages.get("web.inventory");
  const inventoryDefault = inventory?.resolvedSurfaces?.find((item) => item.surface === "inventory-edit-default");
  const inventorySelection = inventory?.resolvedSurfaces?.find((item) => item.surface === "inventory-edit-selection-and-batch-actions");
  if (inventoryDefault?.nodeId !== "18813:61921" || inventorySelection?.nodeId !== "17491:82304") {
    errors.push("web.inventory: 재고편집 기본 상태와 선택 후 일괄 작업 상태의 Figma 근거를 분리해야 합니다.");
  }

  const receiptFlow = flowMappings.get("web.receipt-management|미수금 행 더블클릭");
  if (receiptFlow?.status !== "runtime-only-reference" ||
      !receiptFlow.rejectedFigmaCandidates?.some((item) => item.nodeId === "10582:56360")) {
    errors.push("web.receipt-management: 청구등록을 수금등록 원본에서 제외한 업무 의미 판정이 필요합니다.");
  }
  const equipmentInspectionFlow = flowMappings.get("web.equipment-inspection|설비점검 등록");
  if (equipmentInspectionFlow?.status !== "matched-with-source-naming-error" ||
      equipmentInspectionFlow.figmaNodeId !== "10619:46366") {
    errors.push("web.equipment-inspection: 내부 점검 필드가 일치하는 10619:46366과 원본 명칭 오류를 함께 기록해야 합니다.");
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
    interactions: readJson("web-ui-interaction-audit.json"),
    usageContexts: readJson("usage-contexts.json"),
    patterns: readJson("patterns.json")
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
