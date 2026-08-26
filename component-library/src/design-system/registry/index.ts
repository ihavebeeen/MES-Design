import componentData from "./components.json";
import componentCatalogData from "./component-catalog.json";
import patternData from "./patterns.json";
import screenData from "./screens.json";
import visualRegressionData from "./visual-regression.json";
import sourceAssetData from "./source-assets.json";
import sourceEvidenceData from "./source-evidence.json";
import generatedScreenEvaluationData from "./generated-screen-evaluations.json";
import generatedScreenLifecycleData from "./generated-screen-lifecycle.json";
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
import componentUsageContractData from "./component-usage-contracts.json";
import patternContractData from "./pattern-contracts.json";
import screenSpecData from "./screen-specs.json";
import webUiUsageInventoryData from "./web-ui-usage-inventory.json";
import webFigmaReconciliationData from "./web-figma-reconciliation.json";
import webGenerationContextData from "./web-generation-context.json";
import type {
  ComponentRegistry,
  ComponentCatalogRegistry,
  PatternRegistry,
  ScreenRegistry,
  VisualRegressionRegistry,
  SourceEvidenceRegistry,
  GeneratedScreenEvaluationRegistry,
  GeneratedScreenLifecycleRegistry,
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
  ComponentUsageContractRegistry,
  PatternUsageContractRegistry,
  ScreenSpecRegistry,
  WebUiUsageInventoryRegistry,
  WebFigmaReconciliationRegistry,
  WebGenerationContextRegistry,
} from "./registry.types";

export type * from "./registry.types";

export const componentRegistry = componentData as ComponentRegistry;
export const componentCatalogRegistry = componentCatalogData as ComponentCatalogRegistry;
export const patternRegistry = { schemaVersion: 1, patterns: [...patternData.patterns, ...sourceAssetData.patterns] } as PatternRegistry;
export const screenRegistry = { schemaVersion: 1, screens: [...screenData.screens, ...sourceAssetData.screens] } as ScreenRegistry;
export const visualRegressionRegistry = visualRegressionData as VisualRegressionRegistry;
export const sourceEvidenceRegistry = sourceEvidenceData as SourceEvidenceRegistry;
export const generatedScreenEvaluationRegistry = generatedScreenEvaluationData as GeneratedScreenEvaluationRegistry;
export const generatedScreenLifecycleRegistry = generatedScreenLifecycleData as GeneratedScreenLifecycleRegistry;
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
export const componentUsageContractRegistry = componentUsageContractData as ComponentUsageContractRegistry;
export const patternUsageContractRegistry = patternContractData as PatternUsageContractRegistry;
export const screenSpecRegistry = screenSpecData as ScreenSpecRegistry;
export const webUiUsageInventoryRegistry = webUiUsageInventoryData as WebUiUsageInventoryRegistry;
export const webFigmaReconciliationRegistry = webFigmaReconciliationData as WebFigmaReconciliationRegistry;
export const webGenerationContextRegistry = webGenerationContextData as WebGenerationContextRegistry;

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

export function getComponentUsageContract(componentId: string) {
  return componentUsageContractRegistry.contracts.find((contract) => contract.componentId === componentId);
}

export function getPatternUsageContract(patternId: string) {
  return patternUsageContractRegistry.contracts.find((contract) => contract.patternId === patternId);
}

export function getScreenSpec(screenId: string) {
  return screenSpecRegistry.specs.find((spec) => spec.screenId === screenId);
}

/** 원본 없는 신규 UI 생성에 사용할 실제 MES의 반복 조합 문법을 조회한다. */
export function getWebGenerationContext(reference = "") {
  const normalized = reference.trim().toLocaleLowerCase("ko-KR");
  const matches = (value: unknown) => JSON.stringify(value).toLocaleLowerCase("ko-KR").includes(normalized);
  const pages = webUiUsageInventoryRegistry.pages.filter((page) =>
    page.id === reference || page.registeredScreenId === reference || (normalized !== "" && matches(page)),
  );
  const pageIds = new Set(pages.map((page) => page.id));
  const flows = webUiUsageInventoryRegistry.entryFlows.filter((flow) =>
    flow.id === reference
      || flow.registeredScreenId === reference
      || pageIds.has(flow.pageId)
      || (normalized !== "" && matches(flow)),
  );
  const flowIds = new Set(flows.map((flow) => flow.id));
  const observedArchetypeRefs = new Set(pages.map((page) => page.archetypeRef));
  return {
    status: webGenerationContextRegistry.status,
    purpose: webGenerationContextRegistry.purpose,
    policy: webGenerationContextRegistry.policy,
    decisionOrder: webGenerationContextRegistry.decisionOrder,
    pageArchetypes: webGenerationContextRegistry.pageArchetypes.filter((entry) =>
      normalized === "" || observedArchetypeRefs.has(entry.observedArchetypeRef) || matches(entry),
    ),
    overlayGrammars: webGenerationContextRegistry.overlayGrammars.filter((entry) =>
      normalized === "" || entry.evidenceFlowIds.some((id) => flowIds.has(id)) || matches(entry),
    ),
    sectionRecipes: webGenerationContextRegistry.sectionRecipes.filter((entry) =>
      normalized === "" || entry.evidenceFlowIds.some((id) => flowIds.has(id)) || matches(entry),
    ),
    behaviorRules: webGenerationContextRegistry.behaviorRules.filter((entry) => normalized === "" || matches(entry)),
    nearestObservedExamples: { pages, entryFlows: flows },
    coverage: webGenerationContextRegistry.coverage,
  };
}

/** 기존 화면 재현·감사 요청에서만 실제 웹 관찰과 Figma 대조 상태를 조회한다. */
export function getReproductionAuditContext(reference: string) {
  const normalized = reference.trim().toLocaleLowerCase("ko-KR");
  const matches = (value: unknown) => JSON.stringify(value).toLocaleLowerCase("ko-KR").includes(normalized);
  const pages = webUiUsageInventoryRegistry.pages.filter((page) =>
    page.id === reference || page.registeredScreenId === reference || (normalized !== "" && matches(page)),
  );
  const pageIds = new Set(pages.map((page) => page.id));
  const flows = webUiUsageInventoryRegistry.entryFlows.filter((flow) =>
    flow.id === reference
      || flow.registeredScreenId === reference
      || pageIds.has(flow.pageId)
      || (normalized !== "" && matches(flow)),
  );
  const flowIds = new Set(flows.map((flow) => flow.id));
  const reconciliationPages = webFigmaReconciliationRegistry.pages.filter((page) =>
    pageIds.has(page.pageId)
      || page.pageId === reference
      || (normalized !== "" && matches(page)),
  );
  return {
    authority: webUiUsageInventoryRegistry.usagePolicy.authority,
    usageRules: webUiUsageInventoryRegistry.usagePolicy.rules,
    pages,
    entryFlows: flows,
    connectedObservations: webUiUsageInventoryRegistry.connectedObservations.filter((item) =>
      flowIds.has(item.fromFlowId) || (normalized !== "" && matches(item)),
    ),
    discrepancies: webUiUsageInventoryRegistry.discrepancies.filter((item) => normalized !== "" && matches(item)),
    figmaReconciliation: {
      status: webFigmaReconciliationRegistry.status,
      authorityRules: webFigmaReconciliationRegistry.authorities.rules,
      pages: reconciliationPages,
      structuralFindings: webFigmaReconciliationRegistry.structuralFindings,
      coverage: webFigmaReconciliationRegistry.coverage,
    },
  };
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
    structuredScreenSpecs: screenSpecRegistry.specs.map(({ screenId, targetKind, shellRef, sections, actionSetRef }) => ({
      screenId,
      targetKind,
      shellRef,
      sections,
      actionSetRef,
    })),
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
    webGenerationContext: webGenerationContextRegistry,
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
  const screenSpec = getScreenSpec(screenId) ?? null;
  return {
    screen,
    screenSpec,
    patterns,
    patternContracts: patterns.map(({ id }) => getPatternUsageContract(id)).filter(Boolean),
    components: componentIds.map(getComponent).filter(Boolean),
    componentUsageContracts: componentIds.map(getComponentUsageContract).filter(Boolean),
    contextRules,
    contextDecisions: contextRuleRegistry.decisions.filter((decision) =>
      decision.optionRuleIds.some((ruleId) => contextRuleIds.has(ruleId)),
    ),
    contextGlobalGates: contextRuleRegistry.globalGates,
    webGenerationContext: getWebGenerationContext(screenId),
  };
}
