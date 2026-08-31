export type RegistryStatus = "stable" | "provisional";

export interface ComponentRegistryEntry {
  id: string;
  name: string;
  category:
    | "action"
    | "data-display"
    | "feedback"
    | "form"
    | "icon"
    | "layout"
    | "navigation"
    | "overlay"
    | "system";
  source: string;
  status: RegistryStatus;
  visibility: "public" | "internal";
  tier: 1 | 2 | 3 | 4 | 5;
  documentationMode: "interactive" | "registry" | "foundation" | "internal";
  documentationRoute?: string;
  rules?: string[];
}

export interface ComponentRegistry {
  schemaVersion: 1;
  components: ComponentRegistryEntry[];
}

export interface AssetManifestRegistry {
  schemaVersion: 1;
  purpose: string;
  generatedFrom: string[];
  fingerprint: string;
  guidancePolicy: {
    componentSelection: ComponentUsageContractRegistry["policy"];
    selectionFeedback: { total: number; observed: number; resolved: number; dismissed: number };
  };
  summary: {
    components: {
      total: number;
      public: number;
      internal: number;
      stable: number;
      provisional: number;
      selectionGuardContracts: number;
    };
    patterns: number;
    screens: number;
  };
  assets: Array<Record<string, unknown> & { kind: "component" | "pattern" | "screen"; id: string; name: string; source: string }>;
}

export interface ComponentCatalogGroup {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  itemIds: string[];
}

export interface ComponentCatalogRegistry {
  schemaVersion: 1;
  groups: ComponentCatalogGroup[];
  registryAliases: Record<string, string>;
}

export interface ComponentUsageContractEntry {
  componentId: string;
  capabilities: string[];
  variants: string[];
  requiredStates: string[];
  useWhen: string[];
  doNotUseWhen: string[];
  allowedParents: string[];
  constraints: string[];
  accessibility: string[];
  evidence: string[];
  alternatives: Array<{ componentId: string; chooseInsteadWhen: string }>;
}

export interface ComponentUsageContractRegistry {
  schemaVersion: 1;
  policy: {
    coverageMode: "selection-critical-only";
    unlistedComponentMode: "source-api-only";
    webEvidenceRole: "reference-only";
    singleScreenRule: "do-not-promote";
    allowedParentMismatchSeverity: "warning" | "blocker";
    promotionRequirements: string[];
    feedbackLedger: string;
  };
  contracts: ComponentUsageContractEntry[];
}

export interface MobileAssetRegistry {
  schemaVersion: 1;
  status: "in-progress" | "verified" | "deferred";
  deferredReason?: string;
  resumeCondition?: string;
  evidence: Record<string, { fileKey: string; node: string; role: string }>;
  foundations: Array<{ id: string; name: string; sourceNode: string; values: string[] }>;
  components: Array<{ id: string; name: string; sourceNode: string; states: string[]; sizes?: string[] }>;
  patterns: Array<{ id: string; name: string; rules: string[] }>;
  screenTypes: {
    main: { count: number; pages: number; types: Array<{ name: string; usedBy: string[] }> };
    slidePopup: { count: number; pages: number; types: string[] };
  };
  sourceFindings: Array<{ kind: NormalizationClassification; detail: string }>;
}

export interface PatternRegistryEntry {
  id: string;
  name: string;
  kind: "popup" | "screen" | "table" | "shell" | "recipe" | "action-set" | "section-frame" | "section-pattern" | "behavior";
  placement?: "center" | "right-slide" | "page" | "section" | "cross-shell";
  source: string;
  requiredComponents: string[];
  rules: string[];
}

export interface PatternRegistry {
  schemaVersion: 1;
  patterns: PatternRegistryEntry[];
}

export interface PatternContractSlot {
  id: string;
  required: boolean;
  accepts: string[];
}

export interface PatternUsageContractEntry {
  patternId: string;
  slots: PatternContractSlot[];
  stateModel: string[];
  behaviorTargets: string[];
  scrollOwner: "shell-body" | "section" | "table" | "none";
  allowedActionSets: string[];
  useWhen: string[];
  doNotUseWhen: string[];
  constraints: string[];
  evidence: string[];
  goldenScreenIds: string[];
  implementationMarkers: string[];
}

export interface PatternUsageContractRegistry {
  schemaVersion: 1;
  contracts: PatternUsageContractEntry[];
}

export interface ActionSetRegistryEntry {
  id: string;
  labels: string[];
  layout: "none" | "single" | "paired";
  primaryAction: string | null;
  dismissAction: string | null;
  states: string[];
}

export interface ActionSetRegistry {
  schemaVersion: 1;
  actionSets: ActionSetRegistryEntry[];
}

export interface ScreenRegistryEntry {
  id: string;
  name: string;
  patternRefs: string[];
  source: string;
  figmaNode?: string;
  stateRules: string[];
}

export interface ScreenRegistry {
  schemaVersion: 1;
  screens: ScreenRegistryEntry[];
}

export type ScreenSectionScrollOwner = "shell-body" | "section" | "table" | "none";

export interface ScreenSectionInstance {
  id: string;
  title?: string;
  slot: "body";
  frameRef?: string;
  patternRef: string;
  supportingPatternRefs?: string[];
  componentRefs: string[];
  behaviorRefs: string[];
  scrollOwner: ScreenSectionScrollOwner;
}

export interface ScreenSpecEntry {
  screenId: string;
  targetKind: ScreenTargetKind;
  shellRef: string | null;
  sections: ScreenSectionInstance[];
  behaviorRefs: string[];
  actionSetRef: string | null;
  constraints: string[];
  evidence: string[];
}

export interface ScreenSpecRegistry {
  schemaVersion: 1;
  specs: ScreenSpecEntry[];
}

export type WebObservedSurface = "page" | "center-modal" | "side-slide-panel" | "confirm-dialog";

export interface WebUiUsageWidth {
  basis: "content" | "viewport" | "fixed";
  value: number;
  unit: "percent" | "px";
}

export interface WebUiObservedStep {
  surface: WebObservedSurface;
  title: string;
  width: WebUiUsageWidth;
  sectionTitles: string[];
  componentRefs: string[];
}

export interface WebUiUsageInventoryRegistry {
  schemaVersion: 1;
  status: "observed-in-progress";
  auditedAt: string;
  source: {
    environment: string;
    path: string;
    viewport: { width: number; height: number };
    mode: "read-only-ui-inspection";
    scope: string;
  };
  usagePolicy: {
    authority: "observed-not-canonical";
    rules: string[];
  };
  archetypes: Array<{
    id: string;
    name: string;
    status: "observed-not-canonical";
    componentRefs: string[];
    regions: string[];
  }>;
  pages: Array<{
    id: string;
    navigation: string[];
    archetypeRef: string;
    tableHeaderCount: number;
    entryActions: string[];
    registeredScreenId?: string;
  }>;
  entryFlows: Array<{
    id: string;
    pageId: string;
    trigger: string;
    registeredScreenId: string | null;
    steps: WebUiObservedStep[];
  }>;
  connectedObservations: Array<{
    id: string;
    fromFlowId: string;
    trigger: string;
    observedResult: Pick<WebUiObservedStep, "surface" | "title" | "width">;
    status: "needs-reconciliation" | "observed";
    reason: string;
  }>;
  discrepancies: Array<{
    id: string;
    subject: string;
    observedRuntime: string;
    designSystemExpectation: string;
    classification: "implementation-error-candidate" | "normalization-candidate" | "needs-reconciliation";
  }>;
  coverage: {
    mainMenuPagesObserved: number;
    primaryEntryFlowsObserved: number;
    connectedResultsObserved: number;
    remaining: string[];
  };
}

export type WebFigmaSourceClassification =
  | "source-located-latest"
  | "source-located-revision"
  | "source-not-located";

export interface WebFigmaReconciliationRegistry {
  schemaVersion: 1;
  status: "reference-in-progress";
  auditedAt: string;
  scope: string;
  authorities: {
    canonicalFigmaPage: { fileKey: string; pageId: string; name: string };
    historicalFigmaPage: { fileKey: string; pageId: string; name: string };
    runtimeInventory: string;
    rules: string[];
  };
  classifications: Record<WebFigmaSourceClassification, string>;
  pages: Array<{
    pageId: string;
    classification: WebFigmaSourceClassification;
    figmaEvidence: Array<{ nodeId: string; name: string; role: string }>;
    notes: string[];
  }>;
  structuralFindings: Array<{
    id: string;
    classification: "needs-reconciliation" | "comparison-constraint" | "runtime-supplement" | "authority-constraint";
    detail: string;
  }>;
  coverage: {
    runtimePages: number;
    sourceLocatedLatest: number;
    sourceLocatedRevision: number;
    sourceNotLocated: number;
    pixelVerified: number;
    interactionVerifiedAgainstFigma: number;
  };
  remaining: string[];
}

export type WebGenerationConfidence = "repeated" | "single-case" | "system-rule";

export interface WebGenerationPageArchetype {
  id: string;
  name: string;
  confidence: Exclude<WebGenerationConfidence, "system-rule">;
  evidenceCount: number;
  observedArchetypeRef: string;
  useWhen: string[];
  doNotUseWhen: string[];
  regionOrder: string[];
  patternRefs: string[];
  componentRefs: string[];
}

export interface WebGenerationOverlayGrammar {
  id: string;
  name: string;
  confidence: Exclude<WebGenerationConfidence, "system-rule">;
  evidenceCount: number;
  surfaceSequence: WebObservedSurface[];
  useWhen: string[];
  doNotUseWhen: string[];
  shellRef: string | null;
  recipeRefs: string[];
  requiredBehaviors: string[];
  evidenceFlowIds: string[];
}

export interface WebGenerationSectionRecipe {
  id: string;
  name: string;
  confidence: Exclude<WebGenerationConfidence, "system-rule">;
  evidenceCount: number;
  sectionOrder: string[];
  patternRefs: string[];
  useWhen: string[];
  evidenceFlowIds: string[];
}

export interface WebGenerationContextRegistry {
  schemaVersion: 1;
  status: "generation-guidance";
  derivedAt: string;
  sourceInventory: "web-ui-usage-inventory.json";
  purpose: string;
  policy: {
    authority: "observed-generation-guidance";
    appliesTo: Array<"new">;
    priority: string[];
    rules: string[];
    excludedFromGeneration: string[];
  };
  decisionOrder: string[];
  pageArchetypes: WebGenerationPageArchetype[];
  overlayGrammars: WebGenerationOverlayGrammar[];
  sectionRecipes: WebGenerationSectionRecipe[];
  behaviorRules: Array<{
    id: string;
    confidence: WebGenerationConfidence;
    useWhen: string[];
    behaviorRefs: string[];
    rule: string;
    evidenceConnectionIds?: string[];
  }>;
  coverage: {
    observedPages: number;
    observedPrimaryFlows: number;
    repeatedPageArchetypes: number;
    singleCasePageArchetypes: number;
    repeatedOverlayGrammars: number;
    singleCaseOverlayGrammars: number;
    remainingObservation: string[];
  };
}

export type ScreenRequestIntent = "reproduce" | "new" | "normalize" | "audit";
export type ScreenTargetKind = "page" | "center-modal" | "side-slide-panel" | "confirm-dialog";
export type NormalizationClassification = "source-error" | "implementation-error" | "intentional-exception" | "normalization-candidate";
export type ScreenTemplateControl = "input" | "select";
export type ScreenGenerationTemplateId = "side-slide-form-editable-list.v1" | "center-modal-search-table.v1" | "page-entity-list.v1";

export interface ScreenTemplateField {
  key: string;
  label: string;
  control: ScreenTemplateControl;
  defaultValue: string;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
  validation?: "non-empty" | "positive-number";
  options?: string[];
}

export interface ScreenTemplateFormSection {
  id: string;
  title: string;
  kind: "form-grid";
  divider?: "none" | "bottom";
  columns?: 1 | 2;
  density?: "compact" | "comfortable";
  fields: ScreenTemplateField[];
}

export interface ScreenTemplateEditableRowSection {
  id: string;
  title: string;
  kind: "editable-row-list";
  divider?: "none" | "bottom";
  addLabel?: string;
  minRows?: number;
  insertPosition?: "start" | "end";
  inheritOnAdd?: string[];
  columns: Array<ScreenTemplateField & {
    width?: "unit" | "compact" | "standard" | "wide" | "flex";
    align?: "left" | "center" | "right";
  }>;
}

export interface ScreenTemplateTableColumn {
  key: string;
  label: string;
  width: number;
  align?: "left" | "center" | "right";
}

export interface ScreenTemplateSearchTableSection {
  id: string;
  title: string;
  kind: "search-table";
  searchPlaceholder?: string;
  selectable?: boolean;
  filters: Array<{ id: string; label: string; options: Array<{ id: string; label: string }> }>;
  columns: ScreenTemplateTableColumn[];
  rows: Array<{ id: string; values: Record<string, string> }>;
}

export interface ScreenRequest {
  schemaVersion: 1;
  requestId: string;
  name: string;
  intent: ScreenRequestIntent;
  lifecycle: "draft" | "release";
  verificationScope?: "surface" | "connected-flow";
  hostPage?: {
    sourcePath: string;
    componentName: string;
    triggerLabel: string;
    saveBehavior: "notify-parent" | "none";
  };
  target: {
    kind: ScreenTargetKind;
    title: string;
    nearestScreenId?: string;
    viewport?: { width: number; height: number };
  };
  evidence?: {
    figmaNode?: string;
    sourceRoute?: string;
    notes?: string[];
  };
  webContext?: {
    pageArchetypeRef?: string;
    overlayGrammarRef?: string;
    sectionRecipeRefs?: string[];
  };
  composition: {
    recipeRefs?: string[];
    shellRef?: string;
    sectionRefs?: string[];
    behaviorRefs?: string[];
    actionSetRef?: string;
    sections?: ScreenSectionInstance[];
  };
  requirements: string[];
  normalizationDecisions?: Array<{
    subject: string;
    classification: NormalizationClassification;
    reason: string;
  }>;
  generation?:
    | {
        templateId: "side-slide-form-editable-list.v1";
        panelSize: "narrow-760" | "medium-849" | "standard-900" | "wide-960";
        sections: Array<ScreenTemplateFormSection | ScreenTemplateEditableRowSection>;
      }
    | {
        templateId: "center-modal-search-table.v1";
        modalSize: "medium-600" | "standard-960" | "wide-1024" | "large-1100" | "wide-1142" | "wide-1400";
        sections: [ScreenTemplateSearchTableSection];
      }
    | {
        templateId: "page-entity-list.v1";
        pageTitle: string;
        navigationLabel: string;
        navigationItemLabel: string;
        tabLabel: string;
        pageSize: number;
        sections: [ScreenTemplateSearchTableSection];
      };
  output: {
    route: string;
    componentName: string;
  };
}

export interface GenerationTemplateRegistryEntry {
  id: string;
  status: "stable" | "provisional";
  targetKind: ScreenTargetKind;
  recipeRef: string;
  source: string;
  requiredPatternRefs: string[];
  supportedSectionKinds: Array<"form-grid" | "editable-row-list" | "search-table">;
  output: "tsx";
  overwrite: "forbid";
}

export interface GenerationTemplateRegistry {
  schemaVersion: 1;
  templates: GenerationTemplateRegistryEntry[];
}

export interface InteractionAuditEntry {
  screenId: string;
  status: "verified" | "needs-review";
  route: string;
  contracts: string[];
  tests: string[];
}

export interface InteractionAuditRegistry {
  schemaVersion: 1;
  auditedAt: string;
  screens: InteractionAuditEntry[];
}

export interface VisualRegressionCase {
  id: string;
  name: string;
  route: string;
  snapshot: string;
  viewport: { width: number; height: number };
  screenId?: string;
  patternId?: string;
  candidateId?: string;
  mobileAssetId?: string;
}

export interface VisualRegressionRegistry {
  schemaVersion: 1;
  cases: VisualRegressionCase[];
}

export type SourceEvidenceStatus = "queued" | "in-progress" | "verified" | "deferred" | "closed-unverified";

export interface SourceEvidenceQualityGates {
  designContext: boolean;
  metadataLedger: boolean;
  componentMapping: boolean;
  browserMeasurement: boolean;
  interactionTest: boolean;
  visualBaseline: boolean;
}

export interface SourceEvidenceEntry {
  id: string;
  name: string;
  figmaNode: string;
  kind: "screen-bundle" | "popup-bundle" | "state-bundle";
  normalizedTarget: string;
  status: SourceEvidenceStatus;
  notes: string[];
  qualityGates: SourceEvidenceQualityGates;
  visualCaseId?: string;
}

export interface SourceEvidenceRegistry {
  schemaVersion: 1;
  sources: SourceEvidenceEntry[];
}

export type GeneratedScreenStatus = "partial-success" | "review" | "approved" | "rejected" | "archived";
export type GeneratedScreenPersistence = "local" | "git";
export type GeneratedScreenReviewStatus = "draft" | "review" | "approved" | "rejected" | "archived";
export type GeneratedScreenInfluence = "blocked" | "reference" | "standard";

export interface GeneratedScreenEvaluationEntry {
  id: string;
  name: string;
  createdAt: string;
  figmaNode?: string;
  route: string;
  source: string;
  status: GeneratedScreenStatus;
  persistence: GeneratedScreenPersistence;
  reviewStatus: GeneratedScreenReviewStatus;
  generationInfluence: GeneratedScreenInfluence;
  score: number;
  disposition: "prototype" | "standard";
  influence: "quarantined" | "approved";
  strengths: string[];
  issues: string[];
  promotionCriteria: string[];
}

export interface GeneratedScreenEvaluationRegistry {
  schemaVersion: 1;
  candidates: GeneratedScreenEvaluationEntry[];
}

export interface GeneratedScreenLifecycleStage {
  id: GeneratedScreenReviewStatus;
  label: string;
  persistence: GeneratedScreenPersistence;
  generationInfluence: GeneratedScreenInfluence;
  sourceRoot: string;
  description: string;
}

export interface GeneratedScreenLifecycleRegistry {
  schemaVersion: 1;
  policyId: "mes.generated-screen-lifecycle";
  stages: GeneratedScreenLifecycleStage[];
  promotionRules: string[];
}

export interface CompositionPolicyLayer {
  id: string;
  role: string;
}

export interface CompositionPolicyMigrationHold {
  id: string;
  target: string;
  status: "resolved" | "closed-no-action";
  decision: string;
}

export interface AssetSelectionStep {
  id: "exact-match" | "compatible-existing" | "new-asset";
  question: string;
  comparisonAxes?: string[];
  passOutcome: Array<"reuse" | "compose" | "extend" | "propose-new">;
  failAction: string;
  approval?: string;
}

export interface CompositionPolicyRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  policyVersion: string;
  status: "active";
  authority: "common-policy";
  layers: CompositionPolicyLayer[];
  grammar: {
    contextDecision: string[];
    screenSpec: string[];
    sectionInstance: string[];
    shellSlots: string[];
    sectionFrameVariants: string[];
  };
  assetSelectionLadder: {
    scope: string[];
    steps: AssetSelectionStep[];
    similarityRule: string;
    example: string;
  };
  decisionOutcomes: Array<"reuse" | "compose" | "extend" | "propose-new" | "normalize">;
  approval: {
    automatic: string[];
    requiresHuman: string[];
    quarantineBeforeApproval: boolean;
  };
  registrationQuestions: string[];
  forbiddenWithoutDecision: string[];
  migrationHolds: CompositionPolicyMigrationHold[];
}

export type ContextRuleCategory =
  | "heading"
  | "overlay-shell"
  | "action"
  | "input-control"
  | "content-boundary"
  | "data-table"
  | "scroll-ownership";
export type ContextRuleStatus = "active" | "hold";

export interface ContextImplementationReference {
  kind: "component" | "pattern" | "action-set";
  id: string;
}

export interface ContextRuleEntry {
  id: string;
  category: ContextRuleCategory;
  status: ContextRuleStatus;
  semanticRole: string;
  scope: string;
  requirement: string;
  allowedParents: string[];
  implementationRefs: ContextImplementationReference[];
  useWhen: string[];
  doNotUseWhen: string[];
  relationships: string[];
}

export interface ContextDecisionEntry {
  id: string;
  category: ContextRuleCategory;
  questionOrder: string[];
  optionRuleIds: string[];
  fallback: string;
}

export interface ContextRuleRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-context-rules";
  policyVersion: string;
  status: "active";
  authority: "common-policy";
  applicationFrame: {
    requiredComponents: string[];
    scope: string;
    overlayOwnership: string;
    exceptions: string;
  };
  decisionAxes: string[];
  globalGates: string[];
  rules: ContextRuleEntry[];
  decisions: ContextDecisionEntry[];
  holds: Array<{
    id: string;
    ruleId: string;
    status: "needs-evidence";
    reason: string;
    temporaryRule: string;
  }>;
}

export interface CompositionInventorySignal {
  id: string;
  fileCount: number;
  sources: string[];
}

export interface CompositionInventoryFile {
  source: string;
  name: string;
  observedRole: string;
  lines: number;
  exportedSymbols: string[];
  shells: Array<{ id: string; count: number }>;
  sectionFrames: Record<string, number>;
  sectionTitles: string[];
  uiComponents: Array<{ name: string; jsxCount: number }>;
  stateHookCount: number;
  behaviorSignals: string[];
  sectionCandidateSignals: string[];
  reviewFlags: string[];
}

export interface CompositionInventoryRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  status: "observed-not-canonical";
  scope: string;
  summary: {
    scannedFiles: number;
    totalLines: number;
    shellInstances: Record<string, number>;
    filesWithMixedSectionFrames: number;
    filesWithNativeSectionOnly: number;
    filesWithRoundedSectionCandidates: number;
  };
  sectionCandidateSignals: CompositionInventorySignal[];
  behaviorSignals: CompositionInventorySignal[];
  reviewQueue: Array<{ source: string; flags: string[] }>;
  files: CompositionInventoryFile[];
  fingerprint: string;
}

export interface CompositionShellLedgerRecipe {
  id: string;
  source: string;
  shell: "center-modal" | "side-slide-panel" | "confirm-dialog";
  title: string;
  size: string;
  height: string;
  content: string;
  bodyClass: string;
  scrollMode: "shell-body" | "shell-body-explicit" | "content-owned" | "none";
  actionSet: string;
  actionLabels: string[];
  footerMode: "actions" | "custom";
  headerDivider: boolean;
  figmaNode: string;
  evidenceStatus: "observed-code" | "generated-candidate";
}

export interface CompositionShellLedgerRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  status: "observed-not-canonical";
  scope: string;
  summary: {
    jsxCallSites: number;
    resolvedRecipes: number;
    byShell: Record<string, number>;
  };
  shellContracts: Array<{ id: string; owns: string[]; slots: string[]; defaultBody: string; defaultActionSet: string }>;
  recipes: CompositionShellLedgerRecipe[];
  findings: Array<{ id: string; status: "confirmed" | "resolved-normalize" | "resolved-keep" | "resolved-local"; detail: string }>;
}

export interface CompositionSectionFrameLedgerEntry {
  id: string;
  source: string;
  recipe: string;
  title: string;
  frameRole: string;
  boundaryMechanism: string;
  headingMechanism: "section-band" | "section-header" | "text" | "interactive" | "none";
  outerClass: string;
  divider: string;
  padding: string;
  background: string;
  scrollOwnership: string;
  candidateDisposition: "reuse-signal" | "review" | "generated-quarantine";
  evidenceStatus: "observed-code" | "generated-candidate";
}

export interface CompositionSectionFrameLedgerRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  status: "observed-not-canonical";
  scope: string;
  summary: {
    scannedFiles: number;
    logicalFrames: number;
    byHeadingMechanism: Record<string, number>;
    unframedBodies: number;
    generatedCandidateFrames: number;
  };
  frames: CompositionSectionFrameLedgerEntry[];
  unframedBodies: Array<{ recipe: string; content: string; reason: string }>;
  findings: Array<{ id: string; status: "confirmed" | "candidate" | "migration-hold" | "needs-review" | "closed-no-promotion"; detail: string }>;
}

export interface CompositionSectionPatternCandidate {
  id: string;
  status: "compose-candidate" | "decomposed";
  detectedFileCount: number;
  confirmedInstanceCount: number;
  confirmedSources: string[];
  falsePositiveSources: string[];
  specialPurposeSources?: string[];
  uiOnlySources?: string[];
  sharedContract: string[];
  variants: string[];
  differences: string[];
  decision: string;
}

export interface CompositionSectionPatternLedgerRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  status: "observed-not-canonical";
  scope: string;
  summary: {
    candidateFamilies: number;
    confirmedFamilies: number;
    decomposedFamilies: number;
    falsePositiveFindings: number;
  };
  candidates: CompositionSectionPatternCandidate[];
  summarySubtypes: Array<{ id: string; status: "candidate" | "existing-domain-pattern" | "migration-hold"; sources: string[]; owns: string[] }>;
  findings: Array<{ id: string; status: "confirmed"; detail: string }>;
}

export interface CompositionBehaviorCandidate {
  id: string;
  status: "decomposed" | "verified-with-boundary" | "migration-hold" | "closed-local";
  detectedFileCount: number;
  sources: string[];
  subtypes: string[];
  stateContract: string[];
  differences: string[];
  decision: string;
}

export interface CompositionBehaviorLedgerRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  status: "observed-not-canonical";
  scope: string;
  summary: {
    candidateFamilies: number;
    decomposedFamilies: number;
    verifiedShellDismissSources: number;
    migrationHolds: number;
  };
  candidates: CompositionBehaviorCandidate[];
  selectionSubtypes: Array<{ id: string; status: "candidate" | "not-behavior-evidence"; sources: string[]; effect: string }>;
  dismissAudits: Array<{ id: string; source: string; shell: string; cancel: string; closeButton: string; escape: string; backdrop: string; save: string; result: string }>;
  rowMutationAudits: Array<{ id: string; source: string; insertPosition: string; addGuard: string; deletePolicy: string; initialValues: string; postDelete: string }>;
  findings: Array<{ id: string; status: "confirmed"; detail: string }>;
}

export interface CompositionProposalEvidence {
  recipe: string;
  source: string;
  figmaNode: string;
}

export interface SectionPatternProposal {
  id: string;
  kind: "section-frame" | "section-pattern";
  decisionOutcome: "compose" | "propose-new";
  evidence: CompositionProposalEvidence[];
  owns: string[];
  slots: string[];
  states: string[];
  variants: string[];
  forbidden: string[];
  compatibilityImpact: string;
  approvalRequired: true;
  resolution?: string;
}

export interface SectionPatternProposalRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  status: "proposed-not-approved" | "partially-approved" | "resolved";
  sourceLedger: string;
  approval?: { approvedAt: string; approvedProposalIds: string[]; pilotRecipe: string };
  proposals: SectionPatternProposal[];
  holds: Array<{ id: string; reason: string; resolution?: string }>;
}

export interface BehaviorPatternProposal {
  id: string;
  decisionOutcome: "reuse" | "compose" | "propose-new";
  evidenceSources: string[];
  owns: string[];
  events: string[];
  states: string[];
  constraints: string[];
  forbidden: string[];
  approvalRequired: true;
  resolution?: string;
}

export interface BehaviorPatternProposalRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  status: "proposed-not-approved" | "partially-approved" | "resolved";
  sourceLedger: string;
  approval?: { approvedAt: string; approvedProposalIds: string[]; pilotRecipe: string };
  proposals: BehaviorPatternProposal[];
  holds: Array<{ id: string; reason: string; resolution?: string }>;
}

export interface CompletionPolicyRegistry {
  schemaVersion: 1;
  policyId: "mes.completion-claims";
  projectState: "in-progress" | "complete";
  terms: Record<"implemented" | "verified" | "batch-complete" | "project-complete", string>;
  reportingRequirements: string[];
  projectCompletionBlockers: string[];
}

export interface FooterActionAuditRegistry {
  schemaVersion: 1;
  auditState: "in-progress" | "verified";
  entries: Array<{
    sourceEvidenceId: string;
    status: "queued" | "implemented-unverified" | "verified" | "not-applicable" | "closed-unverified";
    actionSet: string;
    note: string;
  }>;
}
