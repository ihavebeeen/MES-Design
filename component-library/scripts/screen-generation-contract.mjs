export const supportedScreenTemplate = "side-slide-form-editable-list.v1";

const panelSizes = new Set(["narrow-760", "medium-849", "standard-900", "wide-960"]);
const fieldKeys = new Set(["key", "label", "control", "defaultValue", "required", "readOnly", "placeholder", "inputMode", "validation", "options"]);
const rowFieldKeys = new Set([...fieldKeys, "width", "align"]);

function checkKnownKeys(value, allowed, path, issues) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  for (const key of Object.keys(value)) if (!allowed.has(key)) issues.push(`${path}.${key}: 지원하지 않는 필드입니다.`);
}

function validateField(field, path, issues, row = false) {
  checkKnownKeys(field, row ? rowFieldKeys : fieldKeys, path, issues);
  if (!/^[a-z][A-Za-z0-9]*$/.test(field?.key ?? "")) issues.push(`${path}.key: camelCase 식별자여야 합니다.`);
  if (typeof field?.label !== "string" || field.label === "") issues.push(`${path}.label: 비어 있지 않은 문자열이어야 합니다.`);
  if (!["input", "select"].includes(field?.control)) issues.push(`${path}.control: input 또는 select여야 합니다.`);
  if (typeof field?.defaultValue !== "string") issues.push(`${path}.defaultValue: 문자열이어야 합니다.`);
  if (field?.inputMode !== undefined && !["text", "numeric", "decimal"].includes(field.inputMode)) issues.push(`${path}.inputMode 값이 잘못되었습니다.`);
  if (field?.validation !== undefined && !["non-empty", "positive-number"].includes(field.validation)) issues.push(`${path}.validation 값이 잘못되었습니다.`);
  if (row && field?.width !== undefined && !["unit", "compact", "standard", "wide", "flex"].includes(field.width)) issues.push(`${path}.width 값이 잘못되었습니다.`);
  if (row && field?.align !== undefined && !["left", "center", "right"].includes(field.align)) issues.push(`${path}.align 값이 잘못되었습니다.`);
  if (field?.control === "select") {
    if (!Array.isArray(field.options) || field.options.length === 0 || field.options.some((value) => typeof value !== "string" || value === "") || new Set(field.options).size !== field.options.length) issues.push(`${path}.options: select에는 중복 없는 옵션이 필요합니다.`);
    else if (field.defaultValue && !field.options.includes(field.defaultValue)) issues.push(`${path}.defaultValue: select options에 포함되어야 합니다.`);
    if (field.readOnly) issues.push(`${path}: readOnly select는 현재 템플릿에서 지원하지 않습니다.`);
  }
  if (field?.control === "input" && field.options !== undefined) issues.push(`${path}.options: input에는 사용할 수 없습니다.`);
  if (field?.validation === "positive-number" && field.control !== "input") issues.push(`${path}.validation: positive-number는 input에서만 사용할 수 있습니다.`);
}

export function validateGenerationSpec(generation, { required = false } = {}) {
  const issues = [];
  if (generation === undefined) return required ? ["generation 객체가 필요합니다."] : issues;
  if (!generation || typeof generation !== "object" || Array.isArray(generation)) return ["generation은 객체여야 합니다."];
  checkKnownKeys(generation, new Set(["templateId", "panelSize", "sections"]), "generation", issues);
  if (generation.templateId !== supportedScreenTemplate) issues.push(`generation.templateId: 현재 지원값은 '${supportedScreenTemplate}'입니다.`);
  if (!panelSizes.has(generation.panelSize)) issues.push("generation.panelSize 값이 잘못되었습니다.");
  if (!Array.isArray(generation.sections) || generation.sections.length === 0) return [...issues, "generation.sections가 필요합니다."];

  const sectionIds = new Set();
  const formKeys = new Set();
  let rowSectionCount = 0;
  for (const [sectionIndex, section] of generation.sections.entries()) {
    const path = `generation.sections[${sectionIndex}]`;
    if (!/^[a-z][A-Za-z0-9]*$/.test(section?.id ?? "")) issues.push(`${path}.id: camelCase 식별자여야 합니다.`);
    if (sectionIds.has(section?.id)) issues.push(`${path}.id: 중복 section id입니다.`);
    sectionIds.add(section?.id);
    if (typeof section?.title !== "string" || section.title === "") issues.push(`${path}.title이 필요합니다.`);
    if (section?.divider !== undefined && !["none", "bottom"].includes(section.divider)) issues.push(`${path}.divider 값이 잘못되었습니다.`);

    if (section?.kind === "form-grid") {
      checkKnownKeys(section, new Set(["id", "title", "kind", "divider", "columns", "density", "fields"]), path, issues);
      if (section.columns !== undefined && ![1, 2].includes(section.columns)) issues.push(`${path}.columns는 1 또는 2여야 합니다.`);
      if (section.density !== undefined && !["compact", "comfortable"].includes(section.density)) issues.push(`${path}.density 값이 잘못되었습니다.`);
      if (!Array.isArray(section.fields) || section.fields.length === 0) issues.push(`${path}.fields가 필요합니다.`);
      for (const [fieldIndex, field] of (section.fields ?? []).entries()) {
        validateField(field, `${path}.fields[${fieldIndex}]`, issues);
        if (formKeys.has(field.key) || field.key === "rows") issues.push(`${path}.fields[${fieldIndex}].key: 중복 또는 예약된 key입니다.`);
        formKeys.add(field.key);
      }
    } else if (section?.kind === "editable-row-list") {
      rowSectionCount += 1;
      checkKnownKeys(section, new Set(["id", "title", "kind", "divider", "addLabel", "minRows", "insertPosition", "inheritOnAdd", "columns"]), path, issues);
      if (section.minRows !== undefined && (!Number.isInteger(section.minRows) || section.minRows < 1 || section.minRows > 20)) issues.push(`${path}.minRows는 1~20 정수여야 합니다.`);
      if (section.insertPosition !== undefined && !["start", "end"].includes(section.insertPosition)) issues.push(`${path}.insertPosition 값이 잘못되었습니다.`);
      if (!Array.isArray(section.columns) || section.columns.length === 0) issues.push(`${path}.columns가 필요합니다.`);
      const columnKeys = new Set();
      for (const [columnIndex, column] of (section.columns ?? []).entries()) {
        validateField(column, `${path}.columns[${columnIndex}]`, issues, true);
        if (columnKeys.has(column.key) || column.key === "id") issues.push(`${path}.columns[${columnIndex}].key: 중복 또는 예약된 key입니다.`);
        columnKeys.add(column.key);
      }
      if (section.inheritOnAdd !== undefined && (!Array.isArray(section.inheritOnAdd) || new Set(section.inheritOnAdd).size !== section.inheritOnAdd.length)) issues.push(`${path}.inheritOnAdd는 중복 없는 배열이어야 합니다.`);
      else for (const key of section.inheritOnAdd ?? []) if (!columnKeys.has(key)) issues.push(`${path}.inheritOnAdd: 존재하지 않는 column '${key}'입니다.`);
    } else {
      issues.push(`${path}.kind: 지원하지 않는 section kind입니다.`);
    }
  }
  if (rowSectionCount !== 1) issues.push("이 템플릿은 editable-row-list section을 정확히 하나 요구합니다.");
  return issues;
}
