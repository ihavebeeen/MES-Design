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
