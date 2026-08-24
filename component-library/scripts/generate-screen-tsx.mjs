import { createHash } from "node:crypto";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createScreenPreviewPlan, writeScreenPreview } from "./generate-screen-preview.mjs";
import { contractFingerprint } from "./resolve-screen-request.mjs";
import { validateGenerationSpec } from "./screen-generation-contract.mjs";

function quote(value) {
  return JSON.stringify(value);
}

function indent(source, spaces) {
  const prefix = " ".repeat(spaces);
  return source.split("\n").map((line) => line ? `${prefix}${line}` : line).join("\n");
}

function hash(source) {
  return createHash("sha256").update(source).digest("hex");
}

function validationExpression(access, field) {
  return field.validation === "positive-number" ? `Number(${access}) > 0` : `Boolean(${access}.trim())`;
}

function inputSanitizer(field) {
  if (field.inputMode === "numeric") return ".replace(/[^0-9]/g, \"\")";
  if (field.inputMode === "decimal") return ".replace(/[^0-9.]/g, \"\")";
  return "";
}

function classNameForAlign(align) {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return undefined;
}

export function validateGenerationContract(contract) {
  const issues = validateGenerationSpec(contract?.request?.generation, { required: true });
  if (contract?.fingerprint !== contractFingerprint(contract)) issues.push("계약 fingerprint가 현재 내용과 일치하지 않습니다.");
  if (contract?.quality?.blockerCount > 0) issues.push("blocker가 있는 계약은 생성할 수 없습니다.");
  const template = contract?.implementation?.generationTemplate;
  if (!template || template.id !== contract?.request?.generation?.templateId) issues.push("resolved contract에 요청과 일치하는 generation template이 없습니다.");
  if (template && template.targetKind !== contract?.request?.target?.kind) issues.push(`template '${template.id}'는 target '${template.targetKind}'만 지원합니다.`);
  const selectedRefs = new Set(contract?.composition?.selectedPatternRefs ?? []);
  for (const id of template?.requiredPatternRefs ?? []) if (!selectedRefs.has(id)) issues.push(`필수 pattern ref '${id}'가 없습니다.`);

  return issues;
}

function renderSelect({ componentName, value, change, field, ariaLabel, ariaLabelExpression, key }) {
  const props = [
    key ? `key=${quote(key)}` : undefined,
    `value={${value}}`,
    `placeholder=${quote(field.placeholder ?? "선택")}`,
    `options={${JSON.stringify(field.options)}}`,
    `onValueChange={${change}}`,
    ariaLabelExpression ? `ariaLabel={${ariaLabelExpression}}` : `ariaLabel=${quote(ariaLabel)}`,
  ].filter(Boolean);
  return `<${componentName}Select\n${props.map((prop) => `  ${prop}`).join("\n")}\n/>`;
}

function renderInput({ value, change, field, ariaLabel, ariaLabelExpression, key }) {
  const props = [
    key ? `key=${quote(key)}` : undefined,
    `value={${value}}`,
    field.readOnly ? "readOnly" : `onChange={${change}}`,
    field.placeholder !== undefined ? `placeholder=${quote(field.placeholder)}` : undefined,
    field.inputMode ? `inputMode=${quote(field.inputMode)}` : undefined,
    classNameForAlign(field.align) ? `className=${quote(classNameForAlign(field.align))}` : undefined,
    ariaLabelExpression ? `aria-label={${ariaLabelExpression}}` : `aria-label=${quote(ariaLabel)}`,
  ].filter(Boolean);
  return `<Input\n${props.map((prop) => `  ${prop}`).join("\n")}\n/>`;
}

function renderFormField(componentName, field) {
  const access = `draft.${field.key}`;
  const change = field.control === "select"
    ? `(${field.key}) => setDraft((current) => ({ ...current, ${field.key} }))`
    : `(event) => setDraft((current) => ({ ...current, ${field.key}: event.target.value${inputSanitizer(field)} }))`;
  const control = field.control === "select"
    ? renderSelect({ componentName, value: access, change, field, ariaLabel: field.label })
    : renderInput({ value: access, change, field, ariaLabel: field.label });
  return `<FormFieldRow label=${quote(field.label)}${field.required ? " required" : ""}>\n${indent(control, 2)}\n</FormFieldRow>`;
}

function renderRowControl(componentName, field) {
  const access = `row.${field.key}`;
  const change = field.control === "select"
    ? `(${field.key}) => updateRow(row.id, { ${field.key} })`
    : `(event) => updateRow(row.id, { ${field.key}: event.target.value${inputSanitizer(field)} })`;
  const ariaLabelExpression = `\`\${index + 1}행 ${field.label}\``;
  return field.control === "select"
    ? renderSelect({ componentName, value: access, change, field, ariaLabelExpression, key: field.key })
    : renderInput({ value: access, change, field, ariaLabelExpression, key: field.key });
}

function renderSection(componentName, section) {
  const divider = section.divider ?? "none";
  if (section.kind === "form-grid") {
    const fields = section.fields.map((field) => indent(renderFormField(componentName, field), 4)).join("\n");
    return `<SectionFrame data-section-id=${quote(section.id)} title=${quote(section.title)} divider=${quote(divider)}>\n  <FormGrid columns={${section.columns ?? 1}} density=${quote(section.density ?? "comfortable")}>\n${fields}\n  </FormGrid>\n</SectionFrame>`;
  }

  const gridRows = `rowMutation.rows.map((row, index) => ({\n  id: row.id,\n  cells: [\n    <span key=\"rowNumber\" className=\"text-mes-gray-60\">{index + 1}</span>,\n${section.columns.map((field) => `${indent(renderRowControl(componentName, field), 4)},`).join("\n")}\n    rowMutation.canDelete ? (\n      <Button key=\"delete\" size=\"xsmall\" variant=\"lineBlacktxt\" onClick={() => rowMutation.remove(row.id)}>삭제</Button>\n    ) : <span key=\"delete\" />,\n  ],\n}))`;
  return `<SectionFrame data-section-id=${quote(section.id)} title=${quote(section.title)} divider=${quote(divider)}>\n  <EditableRowListSection\n    addAction={\n      <div className=\"mt-3 flex justify-center\">\n        <Button size=\"small\" variant=\"lineMain\" disabled={!rowMutation.addAllowed} onClick={rowMutation.add}>${section.addLabel ?? "행 추가"}</Button>\n      </div>\n    }\n  >\n    <EditableRowGrid columns={ROW_COLUMNS} rows={${gridRows}} />\n  </EditableRowListSection>\n</SectionFrame>`;
}

function generateSideSlideScreenTsx(contract) {
  const issues = validateGenerationContract(contract);
  if (issues.length > 0) throw new Error(`화면 생성 계약 오류:\n- ${issues.join("\n- ")}`);

  const request = contract.request;
  const generation = request.generation;
  const componentName = request.output.componentName;
  const formSections = generation.sections.filter((section) => section.kind === "form-grid");
  const rowSection = generation.sections.find((section) => section.kind === "editable-row-list");
  const formFields = formSections.flatMap((section) => section.fields);
  const rowFields = rowSection.columns;
  const usesSelect = [...formFields, ...rowFields].some((field) => field.control === "select");
  const usesInput = [...formFields, ...rowFields].some((field) => field.control === "input");
  const rowType = `${componentName}Row`;
  const dataType = `${componentName}Data`;
  const propsType = `${componentName}Props`;
  const initialRowCount = rowSection.minRows ?? 1;

  const imports = [
    `import * as React from "react";`,
    `import { Button } from "@/components/ui/button";`,
    usesInput ? `import { Input } from "@/components/ui/input";` : undefined,
    usesSelect ? `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";` : undefined,
    `import { FormFieldRow, FormGrid } from "@/components/ui/form-grid";`,
    `import { SectionFrame } from "@/components/ui/section-frame";`,
    `import { SideSlidePanel } from "@/components/ui/side-slide-panel";`,
    `import { EditableRowGrid, EditableRowListSection, type EditableRowGridColumn } from "@/components/patterns/section-patterns";`,
    `import { createDialogActionSet } from "@/design-system/action-sets";`,
    `import { useCommittedDraft, useRowMutationPolicy } from "@/design-system/behavior-patterns";`,
  ].filter(Boolean).join("\n");

  const rowInterface = `export interface ${rowType} {\n  id: number;\n${rowFields.map((field) => `  ${field.key}: string;`).join("\n")}\n}`;
  const dataInterface = `export interface ${dataType} {\n${formFields.map((field) => `  ${field.key}: string;`).join("\n")}\n  rows: ${rowType}[];\n}`;
  const propsInterface = `export interface ${propsType} {\n  open: boolean;\n  onOpenChange: (open: boolean) => void;\n  onSave?: (data: ${dataType}) => void;\n}`;

  const initialRows = Array.from({ length: initialRowCount }, (_, index) => `    { id: ${index + 1}, ${rowFields.map((field) => `${field.key}: ${quote(field.defaultValue)}`).join(", ")} },`).join("\n");
  const initialDraft = `const INITIAL_DRAFT: ${dataType} = {\n${formFields.map((field) => `  ${field.key}: ${quote(field.defaultValue)},`).join("\n")}\n  rows: [\n${initialRows}\n  ],\n};`;
  const cloneDraft = `function cloneDraft(draft: ${dataType}): ${dataType} {\n  return { ...draft, rows: draft.rows.map((row) => ({ ...row })) };\n}`;

  const selectHelper = usesSelect ? `function ${componentName}Select({ value, placeholder, options, onValueChange, ariaLabel }: { value: string; placeholder: string; options: string[]; onValueChange: (value: string) => void; ariaLabel: string }) {\n  return (\n    <Select value={value} onValueChange={onValueChange}>\n      <SelectTrigger aria-label={ariaLabel}><SelectValue placeholder={placeholder} /></SelectTrigger>\n      <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>\n    </Select>\n  );\n}` : "";

  const rowColumns = `const ROW_COLUMNS: EditableRowGridColumn[] = [\n  { id: "rowNumber", width: "index", align: "center" },\n${rowFields.map((field) => `  { id: ${quote(field.key)}, label: ${quote(field.label)}, required: ${Boolean(field.required)}, width: ${quote(field.width ?? "standard")}, align: ${quote(field.align ?? "left")} },`).join("\n")}\n  { id: "actions", width: "action", align: "center" },\n];`;
  const rowComplete = rowFields.filter((field) => field.required).map((field) => validationExpression(`row.${field.key}`, field)).join(" && ") || "true";
  const formComplete = formFields.filter((field) => field.required).map((field) => validationExpression(`draft.${field.key}`, field)).join(" && ") || "true";
  const inheritedKeys = new Set(rowSection.inheritOnAdd ?? []);
  const createRowFields = rowFields.map((field) => `${field.key}: ${inheritedKeys.has(field.key) ? `previousRow?.${field.key} ?? ${quote(field.defaultValue)}` : quote(field.defaultValue)}`).join(", ");
  const sections = generation.sections.map((section) => indent(renderSection(componentName, section), 8)).join("\n\n");

  const component = `export function ${componentName}({ open, onOpenChange, onSave }: ${propsType}) {\n  const { draft, setDraft, commit, restore } = useCommittedDraft({ initialValue: INITIAL_DRAFT, clone: cloneDraft });\n  const nextRowId = React.useRef(${initialRowCount + 1});\n\n  const rowMutation = useRowMutationPolicy<${rowType}, number>({\n    initialRows: INITIAL_DRAFT.rows,\n    rows: draft.rows,\n    onRowsChange: (action) => setDraft((current) => ({\n      ...current,\n      rows: typeof action === "function" ? action(current.rows) : action,\n    })),\n    getId: (row) => row.id,\n    createRow: (previousRow) => ({ id: nextRowId.current++, ${createRowFields} }),\n    canAdd: (rows) => Boolean(rows[rows.length - 1] && isRowComplete(rows[rows.length - 1])),\n    minRows: ${initialRowCount},\n    insertPosition: ${quote(rowSection.insertPosition ?? "end")},\n  });\n\n  const updateRow = (id: number, patch: Partial<${rowType}>) => {\n    rowMutation.setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));\n  };\n  const canSave = Boolean(${formComplete} && draft.rows.length > 0 && draft.rows.every(isRowComplete));\n  const save = () => {\n    if (!canSave) return;\n    const saved = commit();\n    onSave?.(saved);\n    onOpenChange(false);\n  };\n\n  return (\n    <SideSlidePanel\n      open={open}\n      onOpenChange={onOpenChange}\n      onCancel={restore}\n      title=${quote(request.target.title)}\n      size=${quote(generation.panelSize)}\n      bodyPadding="none"\n      bodyAlign="stretch"\n      actions={createDialogActionSet("action-set.cancel-save", { onPrimary: save, primaryDisabled: !canSave })}\n    >\n      <div className="flex h-full w-full flex-col">\n${sections}\n      </div>\n    </SideSlidePanel>\n  );\n}`;
  const rowValidator = `function isRowComplete(row: ${rowType}) {\n  return ${rowComplete};\n}`;

  return `"use client";\n\n${imports}\n\n${rowInterface}\n\n${dataInterface}\n\n${propsInterface}\n\n${initialDraft}\n\n${rowColumns}\n\n${cloneDraft}\n\n${rowValidator}${selectHelper ? `\n\n${selectHelper}` : ""}\n\n${component}\n`;
}

function createSearchTableModel(componentName, section) {
  const rowType = `${componentName}Row`;
  const rowInterface = `interface ${rowType} {\n${section.columns.map((column) => `  ${column.key}: string;`).join("\n")}\n}`;
  const columns = `const COLUMNS: TableColumn<${rowType}>[] = [\n${section.columns.map((column) => `  { key: ${quote(column.key)}, label: ${quote(column.label)}, width: ${column.width}, align: ${quote(column.align ?? "left")} },`).join("\n")}\n];`;
  const rows = `const INITIAL_ROWS: TableRowData<${rowType}>[] = [\n${section.rows.map((row) => `  { id: ${quote(row.id)}, data: ${JSON.stringify(row.values)} },`).join("\n")}\n];`;
  const filters = `const FILTER_CATEGORIES = ${JSON.stringify(section.filters, null, 2)};`;
  const helpers = `function matchesSearch(row: ${rowType}, query: string) {\n  const normalized = query.trim().toLocaleLowerCase(\"ko-KR\");\n  return !normalized || Object.values(row).some((value) => value.toLocaleLowerCase(\"ko-KR\").includes(normalized));\n}\n\nfunction matchesFilters(row: ${rowType}, filters: Record<string, string[]>) {\n  return Object.entries(filters).every(([key, values]) => values.length === 0 || values.includes(row[key as keyof ${rowType}]));\n}`;
  return { rowType, source: `${rowInterface}\n\n${columns}\n\n${rows}\n\n${filters}\n\n${helpers}` };
}

function generateCenterModalSearchTable(contract) {
  const request = contract.request;
  const generation = request.generation;
  const section = generation.sections[0];
  const componentName = request.output.componentName;
  const propsType = `${componentName}Props`;
  const model = createSearchTableModel(componentName, section);
  const initialDraft = `interface ${componentName}Draft {\n  query: string;\n  filters: Record<string, string[]>;\n  selectedIds: string[];\n}\n\nconst INITIAL_DRAFT: ${componentName}Draft = { query: \"\", filters: {}, selectedIds: [] };\n\nfunction cloneDraft(draft: ${componentName}Draft): ${componentName}Draft {\n  return { ...draft, filters: Object.fromEntries(Object.entries(draft.filters).map(([key, values]) => [key, [...values]])), selectedIds: [...draft.selectedIds] };\n}`;
  const props = `export interface ${propsType} {\n  open: boolean;\n  onOpenChange: (open: boolean) => void;\n  onSave?: (selectedIds: string[]) => void;\n}`;
  const component = `export function ${componentName}({ open, onOpenChange, onSave }: ${propsType}) {\n  const { draft, setDraft, commit, restore } = useCommittedDraft({ initialValue: INITIAL_DRAFT, clone: cloneDraft });\n  const visibleRows = React.useMemo(() => INITIAL_ROWS.filter(({ data }) => matchesSearch(data, draft.query) && matchesFilters(data, draft.filters)), [draft.query, draft.filters]);\n  const save = () => {\n    const saved = commit();\n    onSave?.(saved.selectedIds);\n    onOpenChange(false);\n  };\n\n  return (\n    <CenterModal\n      open={open}\n      onOpenChange={onOpenChange}\n      onCancel={restore}\n      title=${quote(request.target.title)}\n      size=${quote(generation.modalSize)}\n      bodyPadding=\"standard\"\n      bodyAlign=\"stretch\"\n      actions={createDialogActionSet(\"action-set.cancel-save\", { onDismiss: restore, onPrimary: save })}\n    >\n      <SearchTableSection\n        data-section-id=${quote(section.id)}\n        title=${quote(section.title)}\n        variant=\"modal\"\n        toolbar={\n          <div className=\"flex h-11 shrink-0 items-center justify-between gap-3 bg-mes-gray-20 px-3\">\n            <Filter\n              categories={FILTER_CATEGORIES}\n              value={draft.filters}\n              onChange={(categoryId, optionIds) => setDraft((current) => ({ ...current, filters: { ...current.filters, [categoryId]: optionIds } }))}\n            />\n            <SearchInput value={draft.query} onChange={(query) => setDraft((current) => ({ ...current, query }))} placeholder=${quote(section.searchPlaceholder ?? "검색어를 입력하세요")} size=\"compact\" />\n          </div>\n        }\n        table={\n          <Table\n            columns={COLUMNS}\n            rows={visibleRows}\n            selectable={${section.selectable !== false}}\n            selectedIds={draft.selectedIds}\n            activeId={draft.selectedIds[0] ?? null}\n            selectedRowAppearance=\"subtle\"\n            selectionColor=\"black\"\n            unselectedCheckboxAppearance=\"grayCheck\"\n            onSelectedIdsChange={(selectedIds) => setDraft((current) => ({ ...current, selectedIds }))}\n            horizontalScroll={false}\n          />\n        }\n      />\n    </CenterModal>\n  );\n}`;
  const imports = `import * as React from \"react\";\nimport { CenterModal } from \"@/components/ui/center-modal\";\nimport { Filter } from \"@/components/ui/filter\";\nimport { SearchInput } from \"@/components/ui/search-input\";\nimport { Table, type TableColumn, type TableRowData } from \"@/components/ui/table\";\nimport { SearchTableSection } from \"@/components/patterns/section-patterns\";\nimport { createDialogActionSet } from \"@/design-system/action-sets\";\nimport { useCommittedDraft } from \"@/design-system/behavior-patterns\";`;
  return `"use client";\n\n${imports}\n\n${model.source}\n\n${initialDraft}\n\n${props}\n\n${component}\n`;
}

function generatePageEntityList(contract) {
  const request = contract.request;
  const generation = request.generation;
  const section = generation.sections[0];
  const componentName = request.output.componentName;
  const model = createSearchTableModel(componentName, section);
  const component = `export function ${componentName}() {\n  const [query, setQuery] = React.useState(\"\");\n  const [filters, setFilters] = React.useState<Record<string, string[]>>({});\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n  const [page, setPage] = React.useState(1);\n  const filteredRows = React.useMemo(() => INITIAL_ROWS.filter(({ data }) => matchesSearch(data, query) && matchesFilters(data, filters)), [query, filters]);\n  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ${generation.pageSize}));\n  const pageRows = filteredRows.slice((page - 1) * ${generation.pageSize}, page * ${generation.pageSize});\n  React.useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);\n\n  return (\n    <EntityListPattern\n      navigation={\n        <Sidebar\n          items={[{ key: \"current\", label: ${quote(generation.navigationLabel)}, icon: <span aria-hidden=\"true\">•</span>, children: [{ key: \"list\", label: ${quote(generation.navigationItemLabel)} }] }]}\n          expandedKey=\"current\"\n          activeSubKey=\"list\"\n        />\n      }\n      tabs={<PageTopTabItem label=${quote(generation.tabLabel)} active closable={false} />}\n      header={<div className=\"flex h-full items-center border-b border-mes-gray-30 px-5 text-[20px] font-bold text-mes-gray-130\">${generation.pageTitle}</div>}\n      table={\n        <SearchTableSection\n          data-section-id=${quote(section.id)}\n          title=${quote(section.title)}\n          variant=\"page\"\n          className=\"px-5 pt-3\"\n          toolbar={\n            <div className=\"flex h-11 shrink-0 items-center justify-between gap-3 bg-mes-gray-20 px-3\">\n              <Filter categories={FILTER_CATEGORIES} value={filters} onChange={(categoryId, optionIds) => { setFilters((current) => ({ ...current, [categoryId]: optionIds })); setPage(1); }} />\n              <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder=${quote(section.searchPlaceholder ?? "검색어를 입력하세요")} size=\"compact\" />\n            </div>\n          }\n          table={<Table columns={COLUMNS} rows={pageRows} selectable={${section.selectable !== false}} selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} selectionColor=\"black\" unselectedCheckboxAppearance=\"grayCheck\" horizontalScroll={false} />}\n        />\n      }\n      footer={<><span className=\"text-[13px] text-mes-gray-70\">총 {filteredRows.length}건</span><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></>}\n    />\n  );\n}`;
  const imports = `import * as React from \"react\";\nimport { Filter } from \"@/components/ui/filter\";\nimport { PageTopTabItem } from \"@/components/ui/page-top-tab-item\";\nimport { Pagination } from \"@/components/ui/pagination\";\nimport { SearchInput } from \"@/components/ui/search-input\";\nimport { Sidebar } from \"@/components/ui/sidebar\";\nimport { Table, type TableColumn, type TableRowData } from \"@/components/ui/table\";\nimport { EntityListPattern } from \"@/components/patterns/entity-list-pattern\";\nimport { SearchTableSection } from \"@/components/patterns/section-patterns\";`;
  return `"use client";\n\n${imports}\n\n${model.source}\n\n${component}\n`;
}

export function generateScreenTsx(contract) {
  const issues = validateGenerationContract(contract);
  if (issues.length > 0) throw new Error(`화면 생성 계약 오류:\n- ${issues.join("\n- ")}`);
  const templateId = contract.request.generation.templateId;
  if (templateId === "center-modal-search-table.v1") return generateCenterModalSearchTable(contract);
  if (templateId === "page-entity-list.v1") return generatePageEntityList(contract);
  return generateSideSlideScreenTsx(contract);
}

export function generatedSourceFingerprint(source) {
  return hash(source);
}

function parseArguments(argv) {
  const args = [...argv];
  const input = args.shift();
  let output;
  let preview = false;
  while (args.length > 0) {
    const flag = args.shift();
    if (flag === "--out") output = args.shift();
    else if (flag === "--preview") preview = true;
    else throw new Error(`알 수 없는 옵션 '${flag}'입니다.`);
  }
  return { input, output, preview };
}

function runCli() {
  const { input, output, preview } = parseArguments(process.argv.slice(2));
  if (!input) throw new Error("사용법: npm run screen:generate -- <contract.json> [--out <screen.tsx>] [--preview]");
  if (preview && !output) throw new Error("--preview는 --out <screen.tsx>와 함께 사용해야 합니다.");
  const inputPath = resolve(process.cwd(), input);
  if (!existsSync(inputPath)) throw new Error(`계약 파일을 찾을 수 없습니다: ${inputPath}`);
  const contract = JSON.parse(readFileSync(inputPath, "utf8"));
  const source = generateScreenTsx(contract);
  let previewPlan;
  if (output) {
    const outputPath = resolve(process.cwd(), output);
    if (existsSync(outputPath)) throw new Error(`기존 파일을 덮어쓰지 않습니다: ${outputPath}`);
    if (preview) previewPlan = createScreenPreviewPlan(contract, outputPath);
    writeFileSync(outputPath, source, { encoding: "utf8", flag: "wx" });
    try {
      if (previewPlan) writeScreenPreview(previewPlan);
    } catch (error) {
      rmSync(outputPath);
      throw error;
    }
  } else process.stdout.write(source);
  console.error(`[screen:generate] ${generatedSourceFingerprint(source).slice(0, 12)} · ${source.split("\n").length - 1} lines`);
  if (previewPlan) console.error(`[screen:preview] ${previewPlan.relativePath} · ${previewPlan.url}`);
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    runCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
