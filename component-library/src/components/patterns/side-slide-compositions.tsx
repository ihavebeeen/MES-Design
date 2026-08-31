"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentRegionHeading } from "@/components/ui/content-region-heading";
import { FormFieldRow, FormGrid } from "@/components/ui/form-grid";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { InspectionJudgement } from "@/components/ui/inspection-judgement";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/search-input";
import { SectionFrame } from "@/components/ui/section-frame";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, type TableColumn, type TableGroup } from "@/components/ui/table";
import { IconPlus, IconTrash } from "@/components/icons";
import type { useCommittedDraft } from "@/design-system/behavior-patterns";
import { permissionLeaves, slideCanSave, slideFieldsValid, slideAddRecord, slideEditRecord,
  type SlideBodyKind, type SlideCompositionConfig, type SlideCompositionDraft, type SlideCompositionSection,
  type SlideCustomSection, type SlideInspectionSection, type SlideMembersSection, type SlidePermissionsSection,
  type SlideValues } from "@/design-system/slide-composition";
import type { ScreenTemplateField } from "@/design-system/registry/registry.types";
import { InspectionItemsSection } from "./section-patterns";

export function useSlideCompositionDraft(config: SlideCompositionConfig, model: ReturnType<typeof useCommittedDraft<SlideCompositionDraft>>) {
  const sequence = React.useRef(0);
  const addRecord = (method: "blank-row" | "entry-form") => {
    model.setDraft(current => {
      let id: string;
      do { id = `addedRecord${++sequence.current}`; } while (current.records.some(row => row.id === id));
      return slideAddRecord(config, current, method, id);
    });
  };
  const editRecord = (id: string, key: string, value: string) => model.setDraft(current => slideEditRecord(config, current, id, key, value));
  return { ...model, addRecord, editRecord, canSave: slideCanSave(config, model.draft) };
}
type Model = ReturnType<typeof useSlideCompositionDraft>;

/** Body placement only: the existing SideSlidePanel owns header/footer/overlay. */
export function SlideBodyLayout({ kind, children }: { kind: SlideBodyKind; children: React.ReactNode }) {
  return <div data-slide-body={kind} className={kind === "custom-fields" || kind === "inspection"
    ? "grid min-h-full w-full grid-cols-[360px_minmax(0,1fr)]"
    : "flex min-h-full w-full flex-col"}>{children}</div>;
}

function FieldControl({ field, value, onChange, label = field.label, compact = false }: {
  field: ScreenTemplateField; value: string; onChange: (value: string) => void; label?: string; compact?: boolean;
}) {
  return field.control === "select" ? <Select value={value} onValueChange={onChange}>
    <SelectTrigger size={compact ? "small" : "default"} aria-label={label}><SelectValue placeholder={field.placeholder ?? "선택"} /></SelectTrigger>
    <SelectContent>{field.options?.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
  </Select> : <Input size={compact ? "small" : "default"} aria-label={label} aria-required={field.required} value={value ?? ""} readOnly={field.readOnly}
    placeholder={field.placeholder ?? "내용 입력"} inputMode={field.inputMode} onChange={event => onChange(event.target.value)} />;
}
function Fields({ fields, values, onChange, columns = 1, density = "comfortable" }: {
  fields: ScreenTemplateField[]; values: SlideValues; onChange: (key: string, value: string) => void;
  columns?: 1 | 2; density?: "compact" | "comfortable";
}) {
  return <FormGrid columns={columns} density={density}>{fields.map(field => <FormFieldRow key={field.key} label={field.label} required={field.required}>
    <FieldControl field={field} value={values[field.key]} onChange={value => onChange(field.key, value)} />
  </FormFieldRow>)}</FormGrid>;
}

/** The available definitions are supplied by the caller, never invented from a screen name. */
function AddDefinition({ options, onAdd }: { options: Array<{ id: string; label: string }>; onAdd: (id: string) => void }) {
  const [open, setOpen] = React.useState(false);
  if (!options.length) return null;
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><Button size="small" variant="fillBlack" startIcon={<IconPlus size={16} />} className="h-7">항목 추가</Button></PopoverTrigger>
    <PopoverContent align="end" className="flex flex-col gap-2">
      {options.map(option => <Button key={option.id} size="small" variant="lineBlacktxt" onClick={() => { onAdd(option.id); setOpen(false); }}>{option.label}</Button>)}
    </PopoverContent>
  </Popover>;
}

function CustomFields({ section, model, ...props }: { section: SlideCustomSection; model: Model } & React.HTMLAttributes<HTMLElement>) {
  const definitions = [...section.fields, ...section.availableFields];
  const active = definitions.filter(field => Object.hasOwn(model.draft.custom, field.key));
  const available = definitions.filter(field => !Object.hasOwn(model.draft.custom, field.key));
  return <SectionFrame {...props} title={section.title} className="min-w-0" action={<AddDefinition options={available.map(f => ({ id: f.key, label: f.label }))}
    onAdd={key => model.setDraft(current => ({ ...current, custom: { ...current.custom, [key]: definitions.find(f => f.key === key)!.defaultValue } }))} />}>
    <Fields fields={active} values={model.draft.custom} onChange={(key, value) => model.setDraft(current => ({ ...current, custom: { ...current.custom, [key]: value } }))} />
  </SectionFrame>;
}

function InspectionFields({ section, model, ...props }: { section: SlideInspectionSection; model: Model } & React.HTMLAttributes<HTMLElement>) {
  const definitions = [...section.items, ...section.availableItems];
  const active = definitions.filter(item => Object.hasOwn(model.draft.judgements, item.id));
  const available = definitions.filter(item => !Object.hasOwn(model.draft.judgements, item.id));
  return <SectionFrame {...props} title={section.title} className="min-w-0" action={<AddDefinition options={available}
    onAdd={id => model.setDraft(current => ({ ...current, judgements: { ...current.judgements, [id]: definitions.find(item => item.id === id)!.value } }))} />}>
    <InspectionItemsSection><div className="space-y-4">{active.map(item => <FormFieldRow key={item.id} label={item.label}>
      <InspectionJudgement className="flex w-full gap-2" value={model.draft.judgements[item.id]}
        onValueChange={value => model.setDraft(current => ({ ...current, judgements: { ...current.judgements, [item.id]: value } }))} />
    </FormFieldRow>)}</div></InspectionItemsSection>
  </SectionFrame>;
}

function MemberSelection({ section, model, ...props }: { section: SlideMembersSection; model: Model } & React.HTMLAttributes<HTMLElement>) {
  const [query, setQuery] = React.useState("");
  const visible = section.members.filter(member => [member.name, member.email, member.department, member.group].some(value => value.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
  const columns: TableColumn<(typeof section.members)[number]>[] = [
    { key: "name", label: "이름", width: { min: 0, grow: 1 }, align: "center" },
    { key: "email", label: "이메일", width: { min: 0, grow: 2 }, align: "center" },
    { key: "department", label: "부서", width: { min: 0, grow: 1 }, align: "center" },
    { key: "group", label: "소속 그룹", width: { min: 0, grow: 1 }, align: "center" },
  ];
  const editableVisible = new Set(visible.filter(member => !member.disabled).map(member => member.id));
  return <SectionFrame {...props} title={section.title} divider="bottom" action={<SearchInput value={query} onChange={setQuery} size="compact" />}>
    <div className="max-h-64 overflow-y-auto"><Table columns={columns} rows={visible.map(member => ({ id: member.id, data: member, disabled: member.disabled }))}
      selectedIds={model.draft.memberIds} selectedRowAppearance="subtle" selectionColor="black" unselectedCheckboxAppearance="grayCheck"
      onSelectedIdsChange={ids => model.setDraft(current => ({ ...current, memberIds: [...current.memberIds.filter(id => !editableVisible.has(id)), ...ids.filter(id => editableVisible.has(id))] }))}
      edgePadding={0} centerSelection headerBackground="white" columnDividers={false} horizontalScroll={false} /></div>
  </SectionFrame>;
}

function PermissionMatrix({ section, model, ...props }: { section: SlidePermissionsSection; model: Model } & React.HTMLAttributes<HTMLElement>) {
  const control = (rowId: string, columnKey?: string) => {
    const leaves = permissionLeaves(section, rowId);
    const keys = columnKey ? [columnKey] : section.columns.map(c => c.key);
    const values = leaves.flatMap(row => keys.map(key => model.draft.permissions[row.id]?.[key] ?? false));
    const all = values.length > 0 && values.every(Boolean);
    return <span className="flex w-full items-center justify-center"><Checkbox color="main" size="small" checked={all} indeterminate={!all && values.some(Boolean)}
      aria-label={`${section.rows.find(row => row.id === rowId)!.label} ${columnKey ? section.columns.find(c => c.key === columnKey)!.label : "전체 권한"}`}
      onChange={() => model.setDraft(current => {
        const permissions = structuredClone(current.permissions);
        for (const leaf of leaves) for (const key of keys) permissions[leaf.id][key] = !all;
        return { ...current, permissions };
      })} /></span>;
  };
  const columns: TableColumn<{ id: string; name: string }>[] = [
    { key: "name", label: "", width: { min: 0, grow: 2 }, align: "left" },
    { key: "all", label: "전체 권한", width: { min: 0, grow: 1 }, align: "center", render: row => control(row.id) },
    ...section.columns.map(column => ({ key: column.key, label: column.label, width: { min: 0, grow: 1 }, align: "center" as const, render: (row: { id: string }) => control(row.id, column.key) })),
  ];
  const groups: TableGroup<{ id: string; name: string }>[] = section.rows.filter(row => !row.parentId).map(parent => ({
    id: parent.id, label: parent.label, defaultExpanded: true,
    summary: Object.fromEntries([{ key: "all" }, ...section.columns].map(column => [column.key, control(parent.id, column.key === "all" ? undefined : column.key)])),
    rows: section.rows.filter(row => row.parentId === parent.id).map(row => ({ id: row.id, data: { id: row.id, name: row.label } })),
  }));
  return <SectionFrame {...props} title={section.title} className="min-h-0 flex-1">
    <Table columns={columns} groups={groups} selectable={false} edgePadding={0} headerBackground="white" columnDividerMode="solid-header"
      showMasterGroupToggles={false} groupLevelColors={["var(--color-mes-primary-20)"]} horizontalScroll={false} />
  </SectionFrame>;
}

export function SlideCompositionSectionView({ section, model, layout, ...props }: {
  section: SlideCompositionSection; model: Model; layout: SlideBodyKind;
} & React.HTMLAttributes<HTMLElement>) {
  const [query, setQuery] = React.useState("");
  if (section.kind === "form-grid") return <SectionFrame {...props} title={section.title}
    divider={layout === "custom-fields" || layout === "inspection" ? "inline-end" : "bottom"} className="min-w-0">
    <Fields fields={section.fields} values={model.draft.values} columns={section.columns} density={section.density}
      onChange={(key, value) => model.setDraft(current => ({ ...current, values: { ...current.values, [key]: value } }))} />
  </SectionFrame>;
  if (section.kind === "custom-fields") return <CustomFields {...props} section={section} model={model} />;
  if (section.kind === "inspection-items") return <InspectionFields {...props} section={section} model={model} />;
  if (section.kind === "member-selection") return <MemberSelection {...props} section={section} model={model} />;
  if (section.kind === "permission-matrix") return <PermissionMatrix {...props} section={section} model={model} />;
  if (section.kind === "entry-form") return <section {...props} aria-label={section.title} className="shrink-0 px-5 pt-5">
    <div className="rounded-mes-panel bg-mes-gray-20 p-4">
      <ContentRegionHeading className="mb-3">{section.title}</ContentRegionHeading>
      <Fields fields={section.fields} values={model.draft.entry} columns={2} density="compact"
        onChange={(key, value) => model.setDraft(current => ({ ...current, entry: { ...current.entry, [key]: value } }))} />
    </div>
    <div className="-mt-4 flex justify-center"><Button variant="fillMain" size="small" className="w-40" disabled={!slideFieldsValid(section.fields, model.draft.entry)} onClick={() => model.addRecord("entry-form")}>↓ 추가</Button></div>
  </section>;
  const columns: TableColumn<{ id: string; values: SlideValues }>[] = [
    ...section.columns.map(column => ({ key: column.key, label: column.label, width: { min: 0, grow: 1 }, align: column.align ?? "center", render: (row: { id: string; values: SlideValues }) => section.editableFields.includes(column.key)
      ? <FieldControl compact field={column} value={row.values[column.key]} label={`행 ${row.id} ${column.label}`} onChange={value => model.editRecord(row.id, column.key, value)} />
      : row.values[column.key] })),
    { key: "delete", label: "삭제", width: 40, align: "center", render: row => <IconButton size="xsmall" aria-label={`행 ${row.id} 삭제`} icon={<IconTrash size={16} />}
      onClick={() => model.setDraft(current => ({ ...current, records: current.records.filter(record => record.id !== row.id) }))} /> },
  ];
  const records = model.draft.records.filter(row => Object.values(row.values).some(value => value.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
  return <section {...props} aria-label={section.title} className="flex min-h-0 flex-1 flex-col gap-3 p-5">
    <div className="flex items-center justify-between gap-3"><ContentRegionHeading>{section.title}</ContentRegionHeading><div className="flex items-center gap-2">
      {section.addMethods.includes("blank-row") && <Button size="small" variant="lineMain" onClick={() => model.addRecord("blank-row")}>행 추가</Button>}
      <SearchInput value={query} onChange={setQuery} size="compact" />
    </div></div>
    <div className="min-h-40 flex-1 rounded-mes-control border border-mes-gray-30"><Table columns={columns} rows={records.map(row => ({ id: row.id, data: row }))}
      selectable={false} edgePadding={0} headerBackground="white" columnDividers={false} horizontalScroll={false} /></div>
  </section>;
}
