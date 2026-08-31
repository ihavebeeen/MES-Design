import type { ScreenTemplateField, ScreenTemplateFormSection } from "./registry/registry.types";

export type SlideBodyKind = "custom-fields" | "inspection" | "entry-list" | "group-settings";
export type SlideCompositionTemplateId = `side-slide-${SlideBodyKind}.v1`;
export type SlideValues = Record<string, string>;
export type SlideJudgement = "pass" | "hold" | "fail" | "none";
export interface SlideCustomSection { id: string; title: string; kind: "custom-fields"; fields: ScreenTemplateField[]; availableFields: ScreenTemplateField[] }
export interface SlideInspectionItem { id: string; label: string; value: SlideJudgement }
export interface SlideInspectionSection { id: string; title: string; kind: "inspection-items"; items: SlideInspectionItem[]; availableItems: SlideInspectionItem[] }
export interface SlideEntrySection { id: string; title: string; kind: "entry-form"; fields: ScreenTemplateField[]; inheritOnAdd: string[] }
/** Placement and editing capabilities are independent, including simultaneous addition methods. */
export interface SlideRecordsSection {
  id: string; title: string; kind: "record-list";
  columns: Array<ScreenTemplateField & { align?: "left" | "center" | "right" }>;
  addMethods: Array<"blank-row" | "entry-form">;
  editableFields: string[];
  rows: Array<{ id: string; values: SlideValues }>;
  minRecords: number;
}
export interface SlideMember { id: string; name: string; email: string; department: string; group: string; disabled?: boolean }
export interface SlideMembersSection { id: string; title: string; kind: "member-selection"; members: SlideMember[]; selectedIds: string[] }
export interface SlidePermission { id: string; label: string; parentId?: string; values?: Record<string, boolean> }
export interface SlidePermissionsSection { id: string; title: string; kind: "permission-matrix"; columns: Array<{ key: string; label: string }>; rows: SlidePermission[] }
export type SlideCompositionSection = ScreenTemplateFormSection | SlideCustomSection | SlideInspectionSection | SlideEntrySection | SlideRecordsSection | SlideMembersSection | SlidePermissionsSection;
export interface SlideCompositionConfig {
  templateId: SlideCompositionTemplateId;
  panelSize: "narrow-760" | "medium-849" | "standard-900" | "wide-960";
  sections: SlideCompositionSection[];
}
export interface SlideCompositionDraft {
  values: SlideValues;
  custom: SlideValues;
  judgements: Record<string, SlideJudgement>;
  entry: SlideValues;
  entryBaseline: SlideValues;
  records: Array<{ id: string; values: SlideValues }>;
  memberIds: string[];
  permissions: Record<string, Record<string, boolean>>;
}
export const fieldDefaults = (fields: ScreenTemplateField[]): SlideValues => Object.fromEntries(fields.map(field => [field.key, field.defaultValue]));
export function slideInitialDraft(config: SlideCompositionConfig): SlideCompositionDraft {
  const result: SlideCompositionDraft = { values: {}, custom: {}, judgements: {}, entry: {}, entryBaseline: {}, records: [], memberIds: [], permissions: {} };
  for (const section of config.sections) {
    if (section.kind === "form-grid") Object.assign(result.values, fieldDefaults(section.fields));
    if (section.kind === "custom-fields") result.custom = fieldDefaults(section.fields);
    if (section.kind === "inspection-items") result.judgements = Object.fromEntries(section.items.map(item => [item.id, item.value]));
    if (section.kind === "entry-form") {
      result.entry = fieldDefaults(section.fields);
      result.entryBaseline = { ...result.entry };
    }
    if (section.kind === "record-list") result.records = structuredClone(section.rows);
    if (section.kind === "member-selection") result.memberIds = [...section.selectedIds];
    if (section.kind === "permission-matrix") result.permissions = Object.fromEntries(section.rows.filter(row => !section.rows.some(child => child.parentId === row.id)).map(row => [row.id, Object.fromEntries(section.columns.map(column => [column.key, row.values?.[column.key] ?? false]))]));
  }
  return result;
}
export function slideFieldsValid(fields: ScreenTemplateField[], values: SlideValues) {
  return fields.every(field => {
    const value = values[field.key] ?? "";
    if ((field.required || field.validation === "non-empty") && !value.trim()) return false;
    if (field.control === "select" && value && !field.options?.includes(value)) return false;
    return field.validation !== "positive-number" || (value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0);
  });
}
export function slideCanSave(config: SlideCompositionConfig, draft: SlideCompositionDraft) {
  return config.sections.every(section => {
    if (section.kind === "form-grid") return slideFieldsValid(section.fields, draft.values);
    if (section.kind === "custom-fields") return slideFieldsValid([...section.fields, ...section.availableFields].filter(field => Object.hasOwn(draft.custom, field.key)), draft.custom);
    if (section.kind === "record-list") return draft.records.length >= section.minRecords && draft.records.every(row => slideFieldsValid(section.columns, row.values));
    // Baseline is reset after Add. Editing even an inherited field is a pending change.
    if (section.kind === "entry-form") return section.fields.every(field => draft.entry[field.key] === draft.entryBaseline[field.key]);
    return true;
  });
}
export function slideAddRecord(config: SlideCompositionConfig, draft: SlideCompositionDraft, method: "blank-row" | "entry-form", id: string): SlideCompositionDraft {
  const list = config.sections.find(s => s.kind === "record-list");
  if (!list || list.kind !== "record-list" || !list.addMethods.includes(method) || draft.records.some(row => row.id === id)) return draft;
  if (method === "blank-row") return { ...draft, records: [...draft.records, { id, values: fieldDefaults(list.columns) }] };
  const entry = config.sections.find(s => s.kind === "entry-form");
  if (!entry || entry.kind !== "entry-form" || !slideFieldsValid(entry.fields, draft.entry)) return draft;
  const next = fieldDefaults(entry.fields);
  for (const key of entry.inheritOnAdd) next[key] = draft.entry[key];
  return { ...draft, records: [...draft.records, { id, values: { ...draft.entry } }], entry: next, entryBaseline: { ...next } };
}
export function slideEditRecord(config: SlideCompositionConfig, draft: SlideCompositionDraft, id: string, key: string, value: string): SlideCompositionDraft {
  const list = config.sections.find(s => s.kind === "record-list");
  if (!list || list.kind !== "record-list" || !list.editableFields.includes(key) || list.columns.find(f => f.key === key)?.readOnly) return draft;
  return { ...draft, records: draft.records.map(row => row.id === id ? { ...row, values: { ...row.values, [key]: value } } : row) };
}
export function permissionLeaves(section: SlidePermissionsSection, id: string): SlidePermission[] {
  const children = section.rows.filter(row => row.parentId === id);
  return children.length ? children.flatMap(child => permissionLeaves(section, child.id)) : section.rows.filter(row => row.id === id);
}
