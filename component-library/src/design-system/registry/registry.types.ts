export type RegistryStatus = "stable" | "provisional";

export interface ComponentRegistryEntry {
  id: string;
  name: string;
  category:
    | "action"
    | "data-display"
    | "feedback"
    | "form"
    | "layout"
    | "navigation"
    | "overlay"
    | "system";
  source: string;
  status: RegistryStatus;
  documentationRoute?: string;
  rules?: string[];
}

export interface ComponentRegistry {
  schemaVersion: 1;
  components: ComponentRegistryEntry[];
}

export interface PatternRegistryEntry {
  id: string;
  name: string;
  kind: "popup" | "screen" | "table";
  placement?: "center" | "right-slide" | "page";
  source: string;
  requiredComponents: string[];
  rules: string[];
}

export interface PatternRegistry {
  schemaVersion: 1;
  patterns: PatternRegistryEntry[];
}

export interface ScreenRegistryEntry {
  id: string;
  name: string;
  patternId: string;
  source: string;
  figmaNode?: string;
  stateRules: string[];
}

export interface ScreenRegistry {
  schemaVersion: 1;
  screens: ScreenRegistryEntry[];
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
}

export interface VisualRegressionRegistry {
  schemaVersion: 1;
  cases: VisualRegressionCase[];
}

export type SourceEvidenceStatus = "queued" | "in-progress" | "verified";

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

export interface GeneratedScreenEvaluationEntry {
  id: string;
  name: string;
  createdAt: string;
  figmaNode: string;
  route: string;
  source: string;
  status: GeneratedScreenStatus;
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

export interface CompositionPolicyLayer {
  id: string;
  role: string;
}

export interface CompositionPolicyMigrationHold {
  id: string;
  target: string;
  status: "migration-hold";
}

export interface CompositionPolicyRegistry {
  schemaVersion: 1;
  policyId: "mes.ai-composition-grammar";
  policyVersion: string;
  status: "active";
  authority: "common-policy";
  layers: CompositionPolicyLayer[];
  grammar: {
    screenSpec: string[];
    sectionInstance: string[];
    shellSlots: string[];
    sectionFrameVariants: string[];
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
