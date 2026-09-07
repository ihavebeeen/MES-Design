import * as React from "react";
import { cn } from "@/lib/utils";

export type SearchTableSectionVariant = "page" | "modal" | "bulk-edit" | "grouped";

export type QueryToolbarVariant = "page" | "modal" | "compact";

export interface QueryToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  start?: React.ReactNode;
  end?: React.ReactNode;
  variant?: QueryToolbarVariant;
}

const queryToolbarVariantClasses: Record<QueryToolbarVariant, string> = {
  page: "min-h-10 bg-transparent",
  modal: "min-h-12 rounded-mes-control bg-mes-gray-20 px-3 py-2",
  compact: "min-h-10 rounded-mes-control bg-mes-gray-20 px-2.5 py-1",
};

/** 필터·빠른 조회·검색을 한 조회 맥락으로 묶고 양쪽 슬롯의 수직 정렬을 소유한다. */
export function QueryToolbar({ start, end, variant = "modal", className, ...props }: QueryToolbarProps) {
  return (
    <div
      data-pattern="section.query-toolbar"
      data-variant={variant}
      className={cn("flex w-full shrink-0 items-center justify-between gap-3", queryToolbarVariantClasses[variant], className)}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2.5">{start}</div>
      <div className="ml-auto flex min-w-0 items-center gap-2.5">{end}</div>
    </div>
  );
}

export type BulkEditTargetScope = "all-visible" | "selected" | "explicit-set";
export type BulkEditBarVariant = "table-header" | "compact";

export interface BulkEditBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  controls: React.ReactNode;
  action: React.ReactNode;
  targetScope: BulkEditTargetScope;
  variant?: BulkEditBarVariant;
  titleClassName?: string;
  controlsClassName?: string;
  actionClassName?: string;
}

const bulkEditBarVariantClasses: Record<BulkEditBarVariant, string> = {
  "table-header": "min-h-[52px] border-b border-mes-gray-30 bg-mes-gray-20 px-2.5 py-2.5",
  compact: "min-h-11 rounded-mes-control bg-mes-gray-20 px-3 py-1.5",
};

/** 여러 행에 공통값을 적용하는 영역. 실제 적용 범위는 targetScope로 반드시 노출한다. */
export function BulkEditBar({
  title,
  icon,
  controls,
  action,
  targetScope,
  variant = "table-header",
  titleClassName,
  controlsClassName,
  actionClassName,
  className,
  ...props
}: BulkEditBarProps) {
  return (
    <div
      data-pattern="section.bulk-edit-bar"
      data-target-scope={targetScope}
      data-variant={variant}
      className={cn("flex w-full shrink-0 items-center gap-4", bulkEditBarVariantClasses[variant], className)}
      {...props}
    >
      <div className={cn("flex min-w-0 flex-1 items-center justify-center gap-2 text-[15px] font-semibold text-mes-gray-130", titleClassName)}>
        {icon}
        <span>{title}</span>
      </div>
      <div className={cn("ml-auto flex min-w-0 items-center justify-end gap-2.5", controlsClassName)}>{controls}</div>
      <div className={cn("shrink-0", actionClassName)}>{action}</div>
    </div>
  );
}

export interface MasterDetailSectionProps extends React.HTMLAttributes<HTMLElement> {
  master: React.ReactNode;
  detail: React.ReactNode;
  detailTitle?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  masterClassName?: string;
  detailClassName?: string;
}

/** 마스터 선택이 상세 내용을 바꾸는 관계만 소유하고, 각 영역의 실제 콘텐츠는 슬롯으로 받는다. */
export function MasterDetailSection({
  master,
  detail,
  detailTitle,
  orientation = "horizontal",
  masterClassName,
  detailClassName,
  className,
  ...props
}: MasterDetailSectionProps) {
  return (
    <section
      data-pattern="section.master-detail-composition"
      data-orientation={orientation}
      className={cn(
        "flex min-h-0 w-full",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
      {...props}
    >
      <div data-slot="master" className={cn("min-h-0 min-w-0", masterClassName)}>{master}</div>
      <div data-slot="detail" className={cn("flex min-h-0 min-w-0 flex-1 flex-col", detailClassName)}>
        {detailTitle !== undefined && <div className="shrink-0">{detailTitle}</div>}
        <div className="min-h-0 flex-1">{detail}</div>
      </div>
    </section>
  );
}

export interface SearchTableSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  query?: React.ReactNode;
  toolbar?: React.ReactNode;
  bulkAction?: React.ReactNode;
  table: React.ReactNode;
  selectionAction?: React.ReactNode;
  footerAction?: React.ReactNode;
  variant?: SearchTableSectionVariant;
  tableClassName?: string;
}

/** 검색·필터·표의 순서와 scroll 경계를 소유하고, 존재하지 않는 slot은 만들지 않는다. */
export function SearchTableSection({
  title,
  query,
  toolbar,
  bulkAction,
  table,
  selectionAction,
  footerAction,
  variant = "modal",
  tableClassName,
  className,
  ...props
}: SearchTableSectionProps) {
  return (
    <section
      data-pattern="section.search-table-composition"
      data-variant={variant}
      className={cn("relative flex min-h-0 w-full flex-col", className)}
      {...props}
    >
      {(title !== undefined || query !== undefined) && (
        <div className="flex h-8 shrink-0 items-center justify-between gap-4">
          {title !== undefined && <div className="min-w-0 text-[16px] font-bold leading-[1.5] text-mes-gray-130">{title}</div>}
          {query}
        </div>
      )}
      {toolbar}
      {bulkAction}
      <div className={cn("min-h-0 flex-1", tableClassName)}>{table}</div>
      {selectionAction}
      {footerAction}
    </section>
  );
}

export interface EditableRowListSectionProps extends React.HTMLAttributes<HTMLElement> {
  entryEditor?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  addAction?: React.ReactNode;
  empty?: boolean;
  emptyState?: React.ReactNode;
  listClassName?: string;
}

export type EditableRowGridColumnWidth = "index" | "unit" | "action" | "compact" | "standard" | "wide" | "flex";

export interface EditableRowGridColumn {
  id: string;
  label?: React.ReactNode;
  required?: boolean;
  width?: EditableRowGridColumnWidth;
  align?: "left" | "center" | "right";
}

export interface EditableRowGridEntry {
  id: React.Key;
  cells: React.ReactNode[];
}

export interface EditableRowGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: EditableRowGridColumn[];
  rows: EditableRowGridEntry[];
}

const editableRowColumnWidths: Record<EditableRowGridColumnWidth, string> = {
  index: "24px",
  unit: "54px",
  action: "54px",
  compact: "86px",
  standard: "minmax(90px, 1fr)",
  wide: "minmax(150px, 1.6fr)",
  flex: "minmax(110px, 1.2fr)",
};

const editableRowAlignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/** 헤더와 모든 데이터 행이 하나의 columns 계약을 공유하도록 강제한다. */
export function EditableRowGrid({ columns, rows, className, ...props }: EditableRowGridProps) {
  const gridTemplateColumns = columns.map((column) => editableRowColumnWidths[column.width ?? "standard"]).join(" ");

  if (rows.some((row) => row.cells.length !== columns.length)) {
    throw new Error("EditableRowGrid의 모든 행은 columns와 같은 수의 cell을 가져야 합니다.");
  }

  return (
    <div role="table" className={cn("min-w-0", className)} {...props}>
      <div
        role="row"
        className="grid h-8 items-center gap-1.5 border-b border-mes-gray-30 bg-mes-gray-10 px-2.5"
        style={{ gridTemplateColumns }}
      >
        {columns.map((column) => (
          <span
            key={column.id}
            role="columnheader"
            className={cn("min-w-0 text-[13px] font-semibold text-mes-gray-130", editableRowAlignClasses[column.align ?? "left"])}
          >
            {column.label}
            {column.required && <span aria-hidden="true" className="ml-[3px] text-mes-danger-60">*</span>}
          </span>
        ))}
      </div>
      <div role="rowgroup" className="divide-y divide-mes-gray-30">
        {rows.map((row) => (
          <div
            key={row.id}
            role="row"
            className="grid min-h-12 items-center gap-1.5 px-2.5 py-2 text-[13px] font-normal text-mes-gray-130"
            style={{ gridTemplateColumns }}
          >
            {row.cells.map((cell, index) => (
              <div
                key={columns[index].id}
                role="cell"
                className={cn("min-w-0", editableRowAlignClasses[columns[index].align ?? "left"])}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 행의 표시 구조만 소유한다. 추가·삭제 가능 조건과 ID 정책은 row.mutation-policy가 주입한다. */
export function EditableRowListSection({
  entryEditor,
  header,
  children,
  addAction,
  empty = false,
  emptyState,
  listClassName,
  className,
  ...props
}: EditableRowListSectionProps) {
  return (
    <section data-pattern="section.editable-row-list" className={cn("flex min-h-0 w-full flex-col", className)} {...props}>
      {entryEditor}
      {header}
      <div className={cn("min-h-0", listClassName)}>{empty ? emptyState : children}</div>
      {addAction}
    </section>
  );
}

export interface InspectionItemsSectionProps extends React.HTMLAttributes<HTMLElement> {
  searchSort?: React.ReactNode;
  bulkJudgement?: React.ReactNode;
  children?: React.ReactNode;
  addAction?: React.ReactNode;
  empty?: boolean;
  emptyState?: React.ReactNode;
  readOnly?: boolean;
}

/** 검사항목의 도구·일괄판정·항목·빈 상태 순서를 고정하고 판정 값 집합은 하위 컴포넌트에 위임한다. */
export function InspectionItemsSection({
  searchSort,
  bulkJudgement,
  children,
  addAction,
  empty = false,
  emptyState,
  readOnly = false,
  className,
  ...props
}: InspectionItemsSectionProps) {
  return (
    <section
      data-pattern="section.inspection-items"
      data-read-only={readOnly || undefined}
      className={cn("flex min-h-0 w-full flex-col", className)}
      {...props}
    >
      {searchSort}
      {bulkJudgement}
      <div className="min-h-0 flex-1">{empty ? emptyState : children}</div>
      {addAction}
    </section>
  );
}

export interface TableTotalRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  cells: React.ReactNode[];
  gridTemplateColumns: string;
  tone?: "neutral" | "subtle";
}

/** Table과 동일한 gridTemplateColumns를 받아 고정 margin 없이 합계 셀을 정렬한다. */
export function TableTotalRow({ label = "합계", cells, gridTemplateColumns, tone = "subtle", className, ...props }: TableTotalRowProps) {
  return (
    <div
      role="row"
      data-pattern="summary.table-total-row"
      className={cn(
        "grid min-h-8 items-center border-t border-mes-gray-30 text-[13px] font-semibold text-mes-gray-130",
        tone === "subtle" ? "bg-mes-gray-10" : "bg-white",
        className
      )}
      style={{ gridTemplateColumns }}
      {...props}
    >
      <div role="cell" className="px-3">{label}</div>
      {cells.map((cell, index) => <div key={index} role="cell" className="px-3 text-right">{cell}</div>)}
    </div>
  );
}

export interface ResultTotalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  tone?: "neutral" | "information" | "danger";
}

const resultToneClasses = {
  neutral: "bg-mes-gray-20 text-mes-gray-130",
  information: "bg-mes-primary-20 text-mes-primary-60",
  danger: "bg-mes-danger-10 text-mes-danger-60",
};

/** 하나의 계산 결과만 강조하는 요약 카드. 서로 무관한 복수 KPI에는 사용하지 않는다. */
export function ResultTotalCard({ label, value, unit, icon, trailing, tone = "neutral", className, ...props }: ResultTotalCardProps) {
  return (
    <div
      data-pattern="summary.result-total-card"
      className={cn("flex min-h-14 items-center justify-center gap-3 rounded-mes-control px-5 text-[16px] font-semibold", resultToneClasses[tone], className)}
      {...props}
    >
      {icon}
      <span>{label}</span>
      <strong className="text-[16px]">{value}</strong>
      {unit}
      {trailing}
    </div>
  );
}
