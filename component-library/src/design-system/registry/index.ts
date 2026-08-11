import componentData from "./components.json";
import patternData from "./patterns.json";
import screenData from "./screens.json";
import visualRegressionData from "./visual-regression.json";
import sourceAssetData from "./source-assets.json";
import sourceEvidenceData from "./source-evidence.json";
import generatedScreenEvaluationData from "./generated-screen-evaluations.json";
import compositionPolicyData from "./composition-policy.json";
import compositionInventoryData from "./composition-inventory.json";
import compositionShellLedgerData from "./composition-shell-ledger.json";
import compositionSectionFrameLedgerData from "./composition-section-frame-ledger.json";
import compositionSectionPatternLedgerData from "./composition-section-pattern-ledger.json";
import compositionBehaviorLedgerData from "./composition-behavior-ledger.json";
import sectionPatternProposalData from "./section-pattern-proposals.json";
import behaviorPatternProposalData from "./behavior-pattern-proposals.json";
import type {
  ComponentRegistry,
  PatternRegistry,
  ScreenRegistry,
  VisualRegressionRegistry,
  SourceEvidenceRegistry,
  GeneratedScreenEvaluationRegistry,
  CompositionPolicyRegistry,
  CompositionInventoryRegistry,
  CompositionShellLedgerRegistry,
  CompositionSectionFrameLedgerRegistry,
  CompositionSectionPatternLedgerRegistry,
  CompositionBehaviorLedgerRegistry,
  SectionPatternProposalRegistry,
  BehaviorPatternProposalRegistry,
} from "./registry.types";

export type * from "./registry.types";

export const componentRegistry = componentData as ComponentRegistry;
export const patternRegistry = { schemaVersion: 1, patterns: [...patternData.patterns, ...sourceAssetData.patterns] } as PatternRegistry;
export const screenRegistry = { schemaVersion: 1, screens: [...screenData.screens, ...sourceAssetData.screens] } as ScreenRegistry;
export const visualRegressionRegistry = visualRegressionData as VisualRegressionRegistry;
export const sourceEvidenceRegistry = sourceEvidenceData as SourceEvidenceRegistry;
export const generatedScreenEvaluationRegistry = generatedScreenEvaluationData as GeneratedScreenEvaluationRegistry;
export const compositionPolicyRegistry = compositionPolicyData as CompositionPolicyRegistry;
export const compositionInventoryRegistry = compositionInventoryData as CompositionInventoryRegistry;
export const compositionShellLedgerRegistry = compositionShellLedgerData as CompositionShellLedgerRegistry;
export const compositionSectionFrameLedgerRegistry = compositionSectionFrameLedgerData as CompositionSectionFrameLedgerRegistry;
export const compositionSectionPatternLedgerRegistry = compositionSectionPatternLedgerData as CompositionSectionPatternLedgerRegistry;
export const compositionBehaviorLedgerRegistry = compositionBehaviorLedgerData as CompositionBehaviorLedgerRegistry;
export const sectionPatternProposalRegistry = sectionPatternProposalData as SectionPatternProposalRegistry;
export const behaviorPatternProposalRegistry = behaviorPatternProposalData as BehaviorPatternProposalRegistry;

export function getComponent(id: string) {
  return componentRegistry.components.find((component) => component.id === id);
}

export function getPattern(id: string) {
  return patternRegistry.patterns.find((pattern) => pattern.id === id);
}

export function getScreen(id: string) {
  return screenRegistry.screens.find((screen) => screen.id === id);
}

export function getSourceEvidence(id: string) {
  return sourceEvidenceRegistry.sources.find((source) => source.id === id);
}

export function getGeneratedScreenCandidate(id: string) {
  return generatedScreenEvaluationRegistry.candidates.find((candidate) => candidate.id === id);
}

/** AI나 생성 스크립트가 화면 하나를 구현하기 전에 읽어야 할 최소 컨텍스트를 반환한다. */
export function getImplementationContext(screenId: string) {
  const screen = getScreen(screenId);
  if (!screen) return undefined;
  const pattern = getPattern(screen.patternId);
  if (!pattern) return undefined;
  return {
    screen,
    pattern,
    components: pattern.requiredComponents.map(getComponent).filter(Boolean),
  };
}
