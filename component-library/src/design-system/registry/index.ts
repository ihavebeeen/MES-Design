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
import actionSetData from "./action-sets.json";
import interactionAuditData from "./interaction-audit.json";
import completionPolicyData from "./completion-policy.json";
import footerActionAuditData from "./footer-action-audit.json";
import contextRuleData from "./context-rules.json";
import generationTemplateData from "./generation-templates.json";
import mobileAssetData from "./mobile-assets.json";
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
  ActionSetRegistry,
  InteractionAuditRegistry,
  CompletionPolicyRegistry,
  FooterActionAuditRegistry,
  ContextRuleRegistry,
  ContextRuleCategory,
  GenerationTemplateRegistry,
  MobileAssetRegistry,
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
export const actionSetRegistry = actionSetData as ActionSetRegistry;
export const interactionAuditRegistry = interactionAuditData as InteractionAuditRegistry;
export const completionPolicyRegistry = completionPolicyData as CompletionPolicyRegistry;
export const footerActionAuditRegistry = footerActionAuditData as FooterActionAuditRegistry;
export const contextRuleRegistry = contextRuleData as ContextRuleRegistry;
export const generationTemplateRegistry = generationTemplateData as GenerationTemplateRegistry;
export const mobileAssetRegistry = mobileAssetData as MobileAssetRegistry;

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

export function getContextRule(id: string) {
  return contextRuleRegistry.rules.find((rule) => rule.id === id);
}

export function getContextDecision(id: string) {
  return contextRuleRegistry.decisions.find((decision) => decision.id === id);
}

export function getContextRules(category?: ContextRuleCategory) {
  return category
    ? contextRuleRegistry.rules.filter((rule) => rule.category === category)
    : contextRuleRegistry.rules;
}

/** ScreenRequest를 작성할 때 임의 ID를 만들지 않도록 현재 선택지를 반환한다. */
export function getScreenRequestOptions() {
  return {
    screens: screenRegistry.screens.map(({ id, name, patternRefs }) => ({ id, name, patternRefs })),
    recipes: patternRegistry.patterns.filter(({ kind }) => ["popup", "screen", "recipe"].includes(kind)),
    shells: patternRegistry.patterns.filter(({ kind }) => kind === "shell"),
    sections: patternRegistry.patterns.filter(({ kind }) => ["section-frame", "section-pattern", "table"].includes(kind)),
    behaviors: patternRegistry.patterns.filter(({ kind }) => kind === "behavior"),
    actionSets: actionSetRegistry.actionSets,
    templates: generationTemplateRegistry.templates,
  };
}

/** 화면 ID가 아직 없는 신규 생성이 JSX 작성 전에 읽어야 할 전체 선택 계약이다. */
export function getGenerationContext() {
  return {
    compositionPolicy: compositionPolicyRegistry,
    globalGates: contextRuleRegistry.globalGates,
    decisions: contextRuleRegistry.decisions,
    rules: contextRuleRegistry.rules,
    holds: contextRuleRegistry.holds,
  };
}

/** 모바일 생성은 웹 registry를 축소하지 않고 전용 근거와 화면 유형을 먼저 조회한다. */
export function getMobileGenerationContext() {
  return mobileAssetRegistry;
}

/** AI나 생성 스크립트가 화면 하나를 구현하기 전에 읽어야 할 최소 컨텍스트를 반환한다. */
export function getImplementationContext(screenId: string) {
  const screen = getScreen(screenId);
  if (!screen) return undefined;
  const patterns = screen.patternRefs.map(getPattern).filter((pattern): pattern is NonNullable<typeof pattern> => Boolean(pattern));
  if (patterns.length !== screen.patternRefs.length) return undefined;
  const componentIds = [...new Set(patterns.flatMap((pattern) => pattern.requiredComponents))];
  const contextRules = contextRuleRegistry.rules.filter((rule) =>
    rule.allowedParents.some((parentId) => screen.patternRefs.includes(parentId))
      || rule.implementationRefs.some((reference) =>
        reference.kind === "component"
          ? componentIds.includes(reference.id)
          : reference.kind === "pattern"
          ? screen.patternRefs.includes(reference.id)
          : screen.patternRefs.includes(reference.id),
      ),
  );
  const contextRuleIds = new Set(contextRules.map((rule) => rule.id));
  return {
    screen,
    patterns,
    components: componentIds.map(getComponent).filter(Boolean),
    contextRules,
    contextDecisions: contextRuleRegistry.decisions.filter((decision) =>
      decision.optionRuleIds.some((ruleId) => contextRuleIds.has(ruleId)),
    ),
    contextGlobalGates: contextRuleRegistry.globalGates,
  };
}
