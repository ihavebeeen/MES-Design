"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface StepperPatternProps { steps: string[]; currentStep: number; onStepChange?: (step: number) => void; className?: string }
export function StepperPattern({ steps, currentStep, onStepChange, className }: StepperPatternProps) {
  return (
    <ol className={cn("flex items-center", className)}>
      {steps.map((label, index) => (
        <li key={`${index}-${label}`} className="flex min-w-0 flex-1 items-center last:flex-none">
          <Button size="xsmall" variant="lineBlacktxt" className="h-auto border-0 p-0" onClick={() => onStepChange?.(index)} disabled={!onStepChange}>
            <span className={cn("flex size-6 items-center justify-center rounded-full text-[12px] font-semibold", index <= currentStep ? "bg-mes-gray-130 text-white" : "bg-mes-gray-30 text-mes-gray-70")}>{index + 1}</span>
            <span className={cn("whitespace-nowrap text-[13px]", index === currentStep ? "font-semibold text-mes-gray-130" : "text-mes-gray-70")}>{label}</span>
          </Button>
          {index < steps.length - 1 && <span className="mx-3 h-px flex-1 bg-mes-gray-30" />}
        </li>
      ))}
    </ol>
  );
}

export interface TransferListItem { id: string; label: string; disabled?: boolean }
export interface TransferListPatternProps { items: TransferListItem[]; value: string[]; onValueChange: (ids: string[]) => void; availableLabel?: string; selectedLabel?: string; className?: string }
export function TransferListPattern({ items, value, onValueChange, availableLabel = "사용 가능", selectedLabel = "선택됨", className }: TransferListPatternProps) {
  const [marked, setMarked] = React.useState<string[]>([]);
  const available = items.filter((item) => !value.includes(item.id));
  const selected = items.filter((item) => value.includes(item.id));
  const toggle = (id: string) => setMarked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const pane = (title: string, paneItems: TransferListItem[]) => (
    <div className="min-w-0 flex-1 rounded-mes-control border border-mes-gray-30">
      <div className="border-b border-mes-gray-30 bg-mes-gray-10 px-3 py-2 text-[13px] font-semibold">{title} <span className="text-mes-gray-60">{paneItems.length}</span></div>
      <div className="min-h-28 p-2">{paneItems.map((item) => <label key={item.id} className="mb-2 flex cursor-pointer items-center gap-2 text-[13px] text-mes-gray-100"><Checkbox size="small" color="black" checked={marked.includes(item.id)} disabled={item.disabled} onChange={() => toggle(item.id)} /><span>{item.label}</span></label>)}</div>
    </div>
  );
  const moveRight = () => { onValueChange(Array.from(new Set([...value, ...marked.filter((id) => available.some((item) => item.id === id))]))); setMarked([]); };
  const moveLeft = () => { onValueChange(value.filter((id) => !marked.includes(id))); setMarked([]); };
  return <div className={cn("flex items-center gap-2", className)}>{pane(availableLabel, available)}<div className="flex flex-col gap-2"><Button size="xsmall" variant="lineBlacktxt" onClick={moveRight}>→</Button><Button size="xsmall" variant="lineBlacktxt" onClick={moveLeft}>←</Button></div>{pane(selectedLabel, selected)}</div>;
}

export interface ExpandableRowPatternProps { header: React.ReactNode; detail: React.ReactNode; defaultOpen?: boolean; className?: string }
export function ExpandableRowPattern({ header, detail, defaultOpen = false, className }: ExpandableRowPatternProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return <div className={cn("overflow-hidden rounded-mes-control border border-mes-gray-30", className)}><div className="flex min-h-8 items-center gap-2 px-3 py-1.5"><Button aria-label={open ? "상세 접기" : "상세 펼치기"} size="xsmall" variant="lineBlacktxt" className="size-[22px] p-0" onClick={() => setOpen((current) => !current)}>{open ? "−" : "+"}</Button><div className="min-w-0 flex-1">{header}</div></div>{open && <div className="border-t border-mes-gray-30 bg-mes-gray-10 p-3">{detail}</div>}</div>;
}

export interface GridColumn { key: string; label: React.ReactNode; width?: number; align?: "left" | "center" | "right" }
export interface GridPatternProps { columns: GridColumn[]; rows: Array<Record<string, React.ReactNode>>; frozenColumnCount?: number; className?: string }
export function FrozenColumnGridPattern({ columns, rows, frozenColumnCount = 1, className }: GridPatternProps) {
  const offsets = columns.map((_, index) => columns.slice(0, index).reduce((sum, column) => sum + (column.width ?? 144), 0));
  return <div className={cn("overflow-x-auto rounded-mes-control border border-mes-gray-30", className)}><div className="min-w-max text-[12px]"><div className="flex">{columns.map((column, index) => <span key={column.key} className={cn("inline-flex h-8 shrink-0 items-center border-b border-r border-mes-gray-30 bg-mes-gray-10 px-3 font-semibold", index < frozenColumnCount && "sticky z-10 bg-mes-gray-20")} style={{ width: column.width ?? 144, left: index < frozenColumnCount ? offsets[index] : undefined, justifyContent: column.align === "right" ? "flex-end" : column.align === "center" ? "center" : undefined }}>{column.label}</span>)}</div>{rows.map((row, rowIndex) => <div key={rowIndex} className="flex">{columns.map((column, index) => <span key={column.key} className={cn("inline-flex h-8 shrink-0 items-center border-b border-r border-mes-gray-30 bg-white px-3", index < frozenColumnCount && "sticky z-10 font-medium")} style={{ width: column.width ?? 144, left: index < frozenColumnCount ? offsets[index] : undefined, justifyContent: column.align === "right" ? "flex-end" : column.align === "center" ? "center" : undefined }}>{row[column.key]}</span>)}</div>)}</div></div>;
}

export interface GroupedHeader { label: React.ReactNode; columns: GridColumn[] }
export interface GroupedHeaderGridPatternProps { groups: GroupedHeader[]; rows: Array<Record<string, React.ReactNode>>; className?: string }
export function GroupedHeaderGridPattern({ groups, rows, className }: GroupedHeaderGridPatternProps) {
  const columns = groups.flatMap((group) => group.columns);
  const template = columns.map((column) => `${column.width ?? 120}px`).join(" ");
  return <div className={cn("overflow-x-auto rounded-mes-control border border-mes-gray-30 text-[12px]", className)}><div className="min-w-max"><div className="grid bg-mes-gray-10 text-center font-semibold" style={{ gridTemplateColumns: template }}>{groups.map((group, index) => <span key={index} className="border-b border-r border-mes-gray-30 py-1.5" style={{ gridColumn: `span ${group.columns.length}` }}>{group.label}</span>)}{columns.map((column) => <span key={column.key} className="border-r border-mes-gray-30 py-1.5">{column.label}</span>)}</div>{rows.map((row, rowIndex) => <div key={rowIndex} className="grid border-t border-mes-gray-30 bg-white text-center" style={{ gridTemplateColumns: template }}>{columns.map((column) => <span key={column.key} className="border-r border-mes-gray-30 px-2 py-2 last:border-r-0">{row[column.key]}</span>)}</div>)}</div></div>;
}
