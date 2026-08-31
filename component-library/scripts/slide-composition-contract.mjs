import { z } from "zod";

export const slideTemplateKinds = {
  "side-slide-custom-fields.v1": ["form-grid", "custom-fields"],
  "side-slide-inspection.v1": ["form-grid", "inspection-items"],
  "side-slide-entry-list.v1": ["form-grid", "entry-form", "record-list"],
  "side-slide-group-settings.v1": ["form-grid", "member-selection", "permission-matrix"],
};
export const slideSectionPatterns = {
  "form-grid": "section.form-grid", "custom-fields": "section.custom-field-values", "inspection-items": "section.inspection-items",
  "entry-form": "section.staged-record-entry", "record-list": "section.added-record-list", "member-selection": "section.member-selection", "permission-matrix": "section.permission-matrix",
};
const key = z.string().regex(/^[a-z][A-Za-z0-9]*$/).refine(value => !["__proto__", "constructor", "prototype"].includes(value));
const label = z.string().trim().min(1);
const field = z.strictObject({ key, label, control: z.enum(["input", "select"]), defaultValue: z.string(), required: z.boolean().optional(), readOnly: z.boolean().optional(), placeholder: z.string().optional(), inputMode: z.enum(["text", "numeric", "decimal"]).optional(), validation: z.enum(["non-empty", "positive-number"]).optional(), options: z.array(label).min(1).optional() });
const base = { id: key, title: label };
const item = z.strictObject({ id: key, label, value: z.enum(["pass", "hold", "fail", "none"]) });
const column = field.extend({ align: z.enum(["left", "center", "right"]).optional() });
const section = z.discriminatedUnion("kind", [
  z.strictObject({ ...base, kind: z.literal("form-grid"), fields: z.array(field).min(1), columns: z.union([z.literal(1), z.literal(2)]).optional(), density: z.enum(["compact", "comfortable"]).optional(), divider: z.enum(["none", "bottom"]).optional() }),
  z.strictObject({ ...base, kind: z.literal("custom-fields"), fields: z.array(field), availableFields: z.array(field) }),
  z.strictObject({ ...base, kind: z.literal("inspection-items"), items: z.array(item), availableItems: z.array(item) }),
  z.strictObject({ ...base, kind: z.literal("entry-form"), fields: z.array(field).min(1), inheritOnAdd: z.array(key) }),
  z.strictObject({ ...base, kind: z.literal("record-list"), columns: z.array(column).min(1), addMethods: z.array(z.enum(["blank-row", "entry-form"])).min(1), editableFields: z.array(key), rows: z.array(z.strictObject({ id: key, values: z.record(key, z.string()) })), minRecords: z.number().int().min(0) }),
  z.strictObject({ ...base, kind: z.literal("member-selection"), members: z.array(z.strictObject({ id: key, name: label, email: z.string(), department: z.string(), group: z.string(), disabled: z.boolean().optional() })), selectedIds: z.array(key) }),
  z.strictObject({ ...base, kind: z.literal("permission-matrix"), columns: z.array(z.strictObject({ key, label })).min(1), rows: z.array(z.strictObject({ id: key, label, parentId: key.optional(), values: z.record(key, z.boolean()).optional() })).min(1) }),
]);
export const slideCompositionSchema = z.strictObject({ templateId: z.enum(Object.keys(slideTemplateKinds)), panelSize: z.enum(["narrow-760", "medium-849", "standard-900", "wide-960"]), sections: z.array(section).min(2) });
export function validateSlideComposition(generation) {
  const parsed = slideCompositionSchema.safeParse(generation);
  if (!parsed.success) return parsed.error.issues.map(issue => `generation.${issue.path.join(".")}: ${issue.message}`);
  const issues = [];
  const unique = (values, path) => { if (new Set(values).size !== values.length) issues.push(`${path}: 중복 식별자입니다.`); };
  const list = generation.sections.find(s => s.kind === "record-list");
  const expected = slideTemplateKinds[generation.templateId].filter(kind => kind !== "entry-form" || list?.addMethods.includes("entry-form"));
  if (JSON.stringify(generation.sections.map(s => s.kind)) !== JSON.stringify(expected)) issues.push(`generation.sections: ${expected.join(" → ")} 순서와 영역 역할이 필요합니다.`);
  unique(generation.sections.map(s => s.id), "generation.sections");
  for (const s of generation.sections) {
    const fields = [...(s.fields ?? []), ...(s.availableFields ?? []), ...(s.kind === "record-list" ? s.columns : [])];
    unique(fields.map(f => f.key), s.id);
    for (const f of fields) {
      if (f.control === "select" && (!f.options?.length || (f.defaultValue && !f.options.includes(f.defaultValue)) || f.readOnly)) issues.push(`${s.id}.${f.key}: select 옵션/기본값/readOnly 조합이 잘못됐습니다.`);
      if (f.control === "input" && f.options) issues.push(`${s.id}.${f.key}: input에는 options를 사용하지 않습니다.`);
      if (f.options) unique(f.options, `${s.id}.${f.key}.options`);
      if (f.validation === "positive-number" && f.control !== "input") issues.push(`${s.id}.${f.key}: 숫자 검증에는 input이 필요합니다.`);
    }
    if (s.kind === "inspection-items") unique([...s.items, ...s.availableItems].map(i => i.id), s.id);
    if (s.kind === "entry-form") { unique(s.inheritOnAdd, s.id); if (s.inheritOnAdd.some(k => !fields.some(f => f.key === k))) issues.push(`${s.id}: 계승할 필드가 없습니다.`); }
    if (s.kind === "record-list") {
      unique(s.columns.map(c => c.key), `${s.id}.columns`); unique(s.rows.map(r => r.id), `${s.id}.rows`);
      if (s.columns.some(column => column.key === "delete")) issues.push(`${s.id}: delete는 행 삭제 액션의 예약 컬럼입니다.`);
      const entry = generation.sections.find(x => x.kind === "entry-form");
      const keys = s.columns.map(f => f.key);
      unique(s.addMethods, `${s.id}.addMethods`); unique(s.editableFields, `${s.id}.editableFields`);
      if (s.editableFields.some(k => !keys.includes(k) || s.columns.find(f => f.key === k)?.readOnly)) issues.push(`${s.id}: 편집 필드가 없거나 readOnly입니다.`);
      if (s.addMethods.includes("blank-row") && !s.editableFields.length) issues.push(`${s.id}: 빈 행 추가에는 목록 편집 필드가 필요합니다.`);
      if (s.addMethods.includes("entry-form") && (!entry || entry.fields.length !== keys.length || entry.fields.some(f => !keys.includes(f.key)))) issues.push(`${s.id}: 상단 추가에는 목록 컬럼과 연결된 입력 필드가 필요합니다.`);
      if (entry) for (const f of entry.fields) {
        const c = s.columns.find(column => column.key === f.key);
        if (c && (f.control !== c.control || Boolean(f.required) !== Boolean(c.required) || f.validation !== c.validation || JSON.stringify(f.options) !== JSON.stringify(c.options))) issues.push(`${s.id}.${f.key}: 상단과 목록의 값 의미/검증이 달라질 수 없습니다.`);
      }
      for (const row of s.rows) if (Object.keys(row.values).length !== keys.length || keys.some(k => typeof row.values[k] !== "string")) issues.push(`${s.id}.${row.id}: 행 값과 입력 필드가 일치해야 합니다.`);
    }
    if (s.kind === "member-selection") {
      unique(s.members.map(m => m.id), s.id); unique(s.selectedIds, `${s.id}.selectedIds`);
      if (s.selectedIds.some(id => !s.members.some(m => m.id === id))) issues.push(`${s.id}: 존재하지 않는 구성원 선택입니다.`);
    }
    if (s.kind === "permission-matrix") {
      unique(s.rows.map(r => r.id), s.id); unique(s.columns.map(c => c.key), `${s.id}.columns`);
      const rows = new Map(s.rows.map(r => [r.id, r]));
      if (s.columns.some(c => ["all", "name"].includes(c.key))) issues.push(`${s.id}: all/name은 권한 표의 예약 컬럼입니다.`);
      for (const row of s.rows) {
        if ((!row.parentId && !s.rows.some(child => child.parentId === row.id)) || (row.parentId && rows.get(row.parentId)?.parentId)) issues.push(`${s.id}.${row.id}: 현재 생성 템플릿은 메뉴 그룹 → 메뉴의 2단계만 지원합니다.`);
        if (Object.keys(row.values ?? {}).some(k => !s.columns.some(c => c.key === k))) issues.push(`${s.id}.${row.id}: 없는 권한 컬럼입니다.`);
        if (row.values && s.rows.some(child => child.parentId === row.id)) issues.push(`${s.id}.${row.id}: 상위 권한은 하위 값에서 계산하므로 values를 지정하지 않습니다.`);
        const seen = new Set([row.id]); let cursor = row;
        while (cursor.parentId) { if (!rows.has(cursor.parentId) || seen.has(cursor.parentId)) { issues.push(`${s.id}.${row.id}: 없는 부모 또는 순환 권한입니다.`); break; } seen.add(cursor.parentId); cursor = rows.get(cursor.parentId); }
      }
    }
  }
  return issues;
}
