import usageData from "@/design-system/registry/component-usage-contracts.json";
import patternData from "@/design-system/registry/patterns.json";
import screenData from "@/design-system/registry/screens.json";
import sourceAssetData from "@/design-system/registry/source-assets.json";
import visualRegressionData from "@/design-system/registry/visual-regression.json";

export interface ComponentScreenReference {
  id: string;
  name: string;
  route: string;
  surface: string;
  figmaNode?: string;
  directEvidence: boolean;
}

const detailedUsageById = new Map(
  usageData.contracts.map((context) => [context.componentId, context]),
);
const allPatterns = [...patternData.patterns, ...sourceAssetData.patterns];
const allScreens = [...screenData.screens, ...sourceAssetData.screens];
const visualCaseByScreenId = new Map<string, (typeof visualRegressionData.cases)[number]>();

for (const visualCase of visualRegressionData.cases) {
  if ("screenId" in visualCase && visualCase.screenId && !visualCaseByScreenId.has(visualCase.screenId)) {
    visualCaseByScreenId.set(visualCase.screenId, visualCase);
  }
}

function getSurfaceLabel(patternRefs: string[]) {
  const hasSidePanel = patternRefs.includes("shell.side-slide-panel");
  const hasCenterModal = patternRefs.includes("shell.center-modal") || patternRefs.includes("shell.confirm-dialog");
  if (hasSidePanel && hasCenterModal) return "연결된 팝업 흐름";
  if (hasSidePanel) return "우측 슬라이드";
  if (hasCenterModal) return "중앙 팝업";
  return "전체 화면";
}

/** 등록된 컴포넌트 근거와 패턴 조합을 실제로 열 수 있는 화면 경로에 연결한다. */
export function getComponentScreenReferences(componentId: string): ComponentScreenReference[] {
  const usage = detailedUsageById.get(componentId);
  const directEvidenceIds = new Set(usage?.evidence ?? []);
  const relatedPatternIds = new Set(
    allPatterns
      .filter((pattern) => pattern.requiredComponents.includes(componentId))
      .map((pattern) => pattern.id),
  );

  const references: ComponentScreenReference[] = [];
  for (const screen of allScreens) {
    const isDirectEvidence = directEvidenceIds.has(screen.id);
    const isPatternReference = screen.patternRefs.some((patternId) => relatedPatternIds.has(patternId));
    if (!isDirectEvidence && !isPatternReference) continue;
    const visualCase = visualCaseByScreenId.get(screen.id);
    if (!visualCase) continue;
    references.push({
      id: screen.id,
      name: screen.name,
      route: visualCase.route,
      surface: getSurfaceLabel(screen.patternRefs),
      figmaNode: screen.figmaNode,
      directEvidence: isDirectEvidence,
    });
  }
  return references.sort((a, b) => Number(b.directEvidence) - Number(a.directEvidence));
}
