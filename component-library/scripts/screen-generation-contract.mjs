import { slideTemplateKinds, validateSlideComposition } from "./slide-composition-contract.mjs";
export const supportedScreenTemplate = "side-slide-form-editable-list.v1";
export const supportedScreenTemplates = new Set([
  supportedScreenTemplate,
  ...Object.keys(slideTemplateKinds),
  "center-modal-search-table.v1",
  "page-entity-list.v1",
]);

const panelSizes = new Set(["narrow-760", "medium-849", "standard-900", "wide-960"]);
const modalSizes = new Set(["medium-600", "standard-960", "wide-1024", "large-1100", "wide-1142", "wide-1400"]);
const fieldKeys = new Set(["key", "label", "control", "defaultValue", "required", "readOnly", "placeholder", "inputMode", "validation", "options"]);
const rowFieldKeys = new Set([...fieldKeys, "width", "align"]);
const searchTableKeys = new Set(["id", "title", "kind", "searchPlaceholder", "selectable", "filters", "columns", "rows"]);

function checkKnownKeys(value, allowed, path, issues) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  for (const key of Object.keys(value)) if (!allowed.has(key)) issues.push(`${path}.${key}: 지원하지 않는 필드입니다.`);
}

function validKey(value) {
  return /^[a-z][A-Za-z0-9]*$/.test(value ?? "");
}

function validateField(field, path, issues, row = false) {
  checkKnownKeys(field, row ? rowFieldKeys : fieldKeys, path, issues);
  if (!validKey(field?.key)) issues.push(`${path}.key: camelCase 식별자여야 합니다.`);
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

function validateSideSlide(generation, issues) {
  checkKnownKeys(generation, new Set(["templateId", "panelSize", "sections"]), "generation", issues);
  if (!panelSizes.has(generation.panelSize)) issues.push("generation.panelSize 값이 잘못되었습니다.");
  if (!Array.isArray(generation.sections) || generation.sections.length === 0) return issues.push("generation.sections가 필요합니다.");

  const sectionIds = new Set();
  const formKeys = new Set();
  let rowSectionCount = 0;
  for (const [sectionIndex, section] of generation.sections.entries()) {
    const path = `generation.sections[${sectionIndex}]`;
    if (!validKey(section?.id)) issues.push(`${path}.id: camelCase 식별자여야 합니다.`);
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
}

function validateSearchTableSection(section, path, issues) {
  checkKnownKeys(section, searchTableKeys, path, issues);
  if (!validKey(section?.id)) issues.push(`${path}.id: camelCase 식별자여야 합니다.`);
  if (typeof section?.title !== "string" || section.title === "") issues.push(`${path}.title이 필요합니다.`);
  if (section?.kind !== "search-table") issues.push(`${path}.kind는 search-table이어야 합니다.`);
  if (section?.searchPlaceholder !== undefined && typeof section.searchPlaceholder !== "string") issues.push(`${path}.searchPlaceholder는 문자열이어야 합니다.`);
  if (section?.selectable !== undefined && typeof section.selectable !== "boolean") issues.push(`${path}.selectable은 boolean이어야 합니다.`);
  if (!Array.isArray(section?.columns) || section.columns.length === 0) issues.push(`${path}.columns가 필요합니다.`);
  if (!Array.isArray(section?.rows) || section.rows.length === 0) issues.push(`${path}.rows가 필요합니다.`);
  if (!Array.isArray(section?.filters) || section.filters.length === 0) issues.push(`${path}.filters가 필요합니다.`);

  const columnKeys = new Set();
  for (const [index, column] of (section?.columns ?? []).entries()) {
    const columnPath = `${path}.columns[${index}]`;
    checkKnownKeys(column, new Set(["key", "label", "width", "align"]), columnPath, issues);
    if (!validKey(column?.key) || columnKeys.has(column?.key)) issues.push(`${columnPath}.key는 중복 없는 camelCase여야 합니다.`);
    columnKeys.add(column?.key);
    if (typeof column?.label !== "string" || column.label === "") issues.push(`${columnPath}.label이 필요합니다.`);
    if (!Number.isInteger(column?.width) || column.width < 40 || column.width > 800) issues.push(`${columnPath}.width는 40~800 정수여야 합니다.`);
    if (column?.align !== undefined && !["left", "center", "right"].includes(column.align)) issues.push(`${columnPath}.align 값이 잘못되었습니다.`);
  }

  const rowIds = new Set();
  for (const [index, row] of (section?.rows ?? []).entries()) {
    const rowPath = `${path}.rows[${index}]`;
    checkKnownKeys(row, new Set(["id", "values"]), rowPath, issues);
    if (typeof row?.id !== "string" || row.id === "" || rowIds.has(row.id)) issues.push(`${rowPath}.id는 중복 없는 문자열이어야 합니다.`);
    rowIds.add(row?.id);
    if (!row?.values || typeof row.values !== "object" || Array.isArray(row.values)) issues.push(`${rowPath}.values 객체가 필요합니다.`);
    else {
      for (const key of Object.keys(row.values)) if (!columnKeys.has(key)) issues.push(`${rowPath}.values.${key}: 등록되지 않은 column입니다.`);
      for (const key of columnKeys) if (typeof row.values[key] !== "string") issues.push(`${rowPath}.values.${key}: 문자열 값이 필요합니다.`);
    }
  }

  const filterIds = new Set();
  for (const [index, filter] of (section?.filters ?? []).entries()) {
    const filterPath = `${path}.filters[${index}]`;
    checkKnownKeys(filter, new Set(["id", "label", "options"]), filterPath, issues);
    if (!validKey(filter?.id) || filterIds.has(filter.id) || !columnKeys.has(filter.id)) issues.push(`${filterPath}.id는 column key와 일치하는 중복 없는 camelCase여야 합니다.`);
    filterIds.add(filter?.id);
    if (typeof filter?.label !== "string" || filter.label === "") issues.push(`${filterPath}.label이 필요합니다.`);
    if (!Array.isArray(filter?.options) || filter.options.length === 0) issues.push(`${filterPath}.options가 필요합니다.`);
    const optionIds = new Set();
    for (const [optionIndex, option] of (filter?.options ?? []).entries()) {
      const optionPath = `${filterPath}.options[${optionIndex}]`;
      checkKnownKeys(option, new Set(["id", "label"]), optionPath, issues);
      if (typeof option?.id !== "string" || option.id === "" || optionIds.has(option.id)) issues.push(`${optionPath}.id는 중복 없는 문자열이어야 합니다.`);
      optionIds.add(option?.id);
      if (typeof option?.label !== "string" || option.label === "") issues.push(`${optionPath}.label이 필요합니다.`);
    }
  }
}

function validateSearchTableTemplate(generation, issues, page) {
  const allowedKeys = page
    ? new Set(["templateId", "pageTitle", "navigationLabel", "navigationItemLabel", "tabLabel", "pageSize", "sections"])
    : new Set(["templateId", "modalSize", "sections"]);
  checkKnownKeys(generation, allowedKeys, "generation", issues);
  if (page) {
    for (const key of ["pageTitle", "navigationLabel", "navigationItemLabel", "tabLabel"]) if (typeof generation[key] !== "string" || generation[key] === "") issues.push(`generation.${key}가 필요합니다.`);
    if (!Number.isInteger(generation.pageSize) || generation.pageSize < 1 || generation.pageSize > 100) issues.push("generation.pageSize는 1~100 정수여야 합니다.");
  } else if (!modalSizes.has(generation.modalSize)) issues.push("generation.modalSize 값이 잘못되었습니다.");
  if (!Array.isArray(generation.sections) || generation.sections.length !== 1) issues.push("이 템플릿은 search-table section을 정확히 하나 요구합니다.");
  else validateSearchTableSection(generation.sections[0], "generation.sections[0]", issues);
}

export function validateGenerationSpec(generation, { required = false } = {}) {
  const issues = [];
  if (generation === undefined) return required ? ["generation 객체가 필요합니다."] : issues;
  if (!generation || typeof generation !== "object" || Array.isArray(generation)) return ["generation은 객체여야 합니다."];
  if (!supportedScreenTemplates.has(generation.templateId)) return [`generation.templateId: 지원값은 ${[...supportedScreenTemplates].join(", ")}입니다.`];
  if (Object.hasOwn(slideTemplateKinds, generation.templateId)) issues.push(...validateSlideComposition(generation));
  else if (generation.templateId === supportedScreenTemplate) validateSideSlide(generation, issues);
  else validateSearchTableTemplate(generation, issues, generation.templateId === "page-entity-list.v1");
  return issues;
}
