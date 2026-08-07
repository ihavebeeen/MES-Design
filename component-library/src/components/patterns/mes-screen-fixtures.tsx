"use client";

import * as React from "react";
import { Filter } from "@/components/ui/filter";
import { GroupQuery } from "@/components/ui/group-query";
import { IconButton } from "@/components/ui/icon-button";
import { Input, type InputProps } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { Radio } from "@/components/ui/radio";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sidebar, type SidebarNavItem } from "@/components/ui/sidebar";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";
import { DatePicker } from "@/components/ui/date-picker";
import {
  IconBell,
  IconBox,
  IconChartBar,
  IconCompany,
  IconGrid,
  IconMedalCheck,
  IconUserMono,
  IconWrench,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const MES_NAV_ITEMS: SidebarNavItem[] = [
  { key: "material", label: "자재관리", icon: <IconBox size={20} /> },
  { key: "production", label: "생산관리", icon: <IconCompany size={20} /> },
  { key: "quality", label: "품질관리", icon: <IconMedalCheck size={20} /> },
  { key: "facility", label: "설비관리", icon: <IconWrench size={20} /> },
  { key: "analysis", label: "통계분석", icon: <IconChartBar size={20} /> },
  {
    key: "settings",
    label: "MES 설정",
    icon: <IconGrid size={20} />,
    children: [
      { key: "customer", label: "거래처 등록" },
      { key: "user", label: "사용자 설정" },
      { key: "item", label: "품목 등록" },
      { key: "warehouse", label: "창고 등록" },
      { key: "production-info", label: "생산 정보 설정" },
      { key: "quality-info", label: "품질 정보 설정" },
      { key: "facility-info", label: "설비 정보 설정" },
    ],
  },
];

function MesFixtureSidebar({ dashboard = false, collapsed = false }: { dashboard?: boolean; collapsed?: boolean }) {
  return (
    <Sidebar
      items={MES_NAV_ITEMS}
      logo={<Logo className="text-white" />}
      collapsed={collapsed}
      expandedKey={dashboard ? undefined : "settings"}
      activeSubKey={dashboard ? undefined : "user"}
      dashboardActive={dashboard}
    />
  );
}

function MesPageTabs({ active, extraTabs = ["거래처 등록", "품목 등록"] }: { active: string; extraTabs?: string[] }) {
  return (
    <div className="flex h-[38px] w-full items-center justify-between bg-black pr-3">
      <div className="flex h-full">
        <PageTopTabItem label={active} active />
        {extraTabs.map((label) => <PageTopTabItem key={label} label={label} />)}
      </div>
      <div className="flex h-full items-center gap-1 text-white">
        <span className="relative">
          <IconButton aria-label="알림" icon={<IconBell size={20} />} className="text-white" />
          <span className="absolute right-0 top-0 flex size-[14px] items-center justify-center rounded-full bg-mes-danger-60 text-[9px] font-bold">3</span>
        </span>
        <IconButton aria-label="사용자 메뉴" icon={<IconUserMono size={20} />} className="text-white" />
      </div>
    </div>
  );
}

interface FixtureInputProps extends Omit<InputProps, "value" | "onChange" | "readOnly"> {
  value: React.ReactNode;
  muted?: boolean;
  onValueChange?: (value: string) => void;
}

function FixtureInput({ value, muted = false, onValueChange, className, ...props }: FixtureInputProps) {
  return (
    <Input
      value={typeof value === "string" || typeof value === "number" ? String(value) : ""}
      onChange={(event) => onValueChange?.(event.target.value)}
      readOnly={muted}
      className={className}
      {...props}
    />
  );
}

function FixtureSelect({ value, className, size = "default" }: { value: string; className?: string; size?: "default" | "small" }) {
  return (
    <Select value={value} onValueChange={() => undefined}>
      <SelectTrigger size={size} className={className}><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value={value}>{value}</SelectItem></SelectContent>
    </Select>
  );
}

function FixtureDateRange({ label = "조회기준일자" }: { label?: string }) {
  return (
    <div className="flex h-8 w-[292px] items-center overflow-hidden rounded-mes-control border border-mes-border-default bg-white">
      <span className="flex h-full w-[49px] shrink-0 items-center justify-center border-r border-mes-border-default text-[14px] font-medium">{label}</span>
      <div className="flex h-full w-[243px] items-center">
        <DatePicker value={new Date(2025, 2, 30)} onValueChange={() => undefined} iconPosition="start" iconColor="default" className="w-[117px] border-0 px-1.5" />
        <span className="flex w-[9px] shrink-0 justify-center text-[14px] text-mes-gray-80">~</span>
        <DatePicker value={new Date(2025, 2, 30)} onValueChange={() => undefined} iconPosition="start" iconColor="default" className="w-[117px] border-0 px-1.5" />
      </div>
    </div>
  );
}

function FixtureSearch({ className, placeholder = "검색어 입력..", iconColor = "muted" }: { className?: string; placeholder?: string; iconColor?: "muted" | "default" }) {
  return <SearchInput value="" onChange={() => undefined} placeholder={placeholder} iconColor={iconColor} className={className} />;
}

function FixtureGroupQuery() {
  return <GroupQuery options={[]} levels={[null, null, null]} onLevelChange={() => undefined} />;
}

interface FixtureFilterDefinition {
  id: string;
  label: string;
  options: string[];
}

function FixtureFilter({ tags = [], definitions, searchable = true, className }: { tags?: Array<{ label: string; count: number }>; definitions?: FixtureFilterDefinition[]; searchable?: boolean; className?: string }) {
  const categories = definitions
    ? definitions.map((definition) => ({
        id: definition.id,
        label: definition.label,
        options: definition.options.map((option, index) => ({ id: `${definition.id}-${index}`, label: option })),
      }))
    : tags.map((tag, index) => ({
        id: `fixture-filter-${index}`,
        label: tag.label,
        options: Array.from({ length: Math.max(1, tag.count) }, (_, optionIndex) => ({ id: `option-${optionIndex}`, label: `${tag.label} ${optionIndex + 1}` })),
      }));
  const [value, setValue] = React.useState<Record<string, string[]>>(() => Object.fromEntries(categories.map((category) => [category.id, definitions ? [] : category.options.map((option) => option.id)])));
  return <Filter categories={categories} value={value} onChange={(categoryId, optionIds) => setValue((current) => ({ ...current, [categoryId]: optionIds }))} searchable={searchable} className={className} />;
}

interface FixtureTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  widths?: Array<number | string>;
  aligns?: Array<"left" | "center" | "right">;
  selectedRow?: number;
  selectedRows?: number[];
  checkedRows?: number[];
  onCheckedRowsChange?: (rows: number[]) => void;
  activeRow?: number | null;
  selectionColor?: "main" | "gray" | "black";
  unselectedCheckboxAppearance?: "outline" | "grayCheck";
  selectionHeaderIndeterminate?: boolean;
  disabledRows?: number[];
  hiddenSelectionRows?: number[];
  selectable?: boolean;
  selectionHeaderLabel?: string;
  edgePadding?: number;
  selectionColumnWidth?: number;
  centerSelection?: boolean;
  columnDividers?: boolean;
  horizontalScroll?: boolean;
  disabledTextTone?: "gray60" | "gray80";
  className?: string;
}

type FixtureTableData = { cells: React.ReactNode[] };

function FixtureTable({ headers, rows, widths, aligns, selectedRow, selectedRows, checkedRows, onCheckedRowsChange, activeRow, selectionColor, unselectedCheckboxAppearance, selectionHeaderIndeterminate, disabledRows = [], hiddenSelectionRows = [], selectable = true, selectionHeaderLabel, edgePadding, selectionColumnWidth, centerSelection, columnDividers, horizontalScroll, disabledTextTone, className }: FixtureTableProps) {
  const columns: TableColumn<FixtureTableData>[] = headers.map((header, index) => ({
    key: `column-${index}`,
    label: header,
    width: typeof widths?.[index] === "number" ? widths[index] as number : { min: 80, grow: 1 },
    align: aligns?.[index] ?? "left",
    render: (row) => row.cells[index],
  }));
  const tableRows: TableRowData<FixtureTableData>[] = rows.map((cells, index) => ({
    id: `fixture-row-${index}`,
    data: { cells },
    disabled: disabledRows.includes(index),
    hideSelection: hiddenSelectionRows.includes(index),
  }));

  const resolvedSelectedRows = checkedRows ?? selectedRows ?? (selectedRow === undefined ? [] : [selectedRow]);
  const resolvedActiveId = activeRow === null
    ? null
    : activeRow !== undefined
      ? `fixture-row-${activeRow}`
      : selectedRow !== undefined
        ? `fixture-row-${selectedRow}`
        : undefined;

  return (
    <Table
      columns={columns}
      rows={tableRows}
      selectable={selectable}
      selectionHeaderLabel={selectionHeaderLabel}
      activeId={resolvedActiveId}
      selectionColor={selectionColor}
      unselectedCheckboxAppearance={unselectedCheckboxAppearance}
      selectionHeaderIndeterminate={selectionHeaderIndeterminate}
      edgePadding={edgePadding}
      selectionColumnWidth={selectionColumnWidth}
      centerSelection={centerSelection}
      columnDividers={columnDividers}
      horizontalScroll={horizontalScroll}
      disabledTextTone={disabledTextTone}
      selectedIds={resolvedSelectedRows.map((index) => `fixture-row-${index}`)}
      onSelectedIdsChange={(ids) => {
        if (!onCheckedRowsChange) return;
        onCheckedRowsChange(ids.flatMap((id) => {
          const match = /^fixture-row-(\d+)$/.exec(id);
          return match ? [Number(match[1])] : [];
        }));
      }}
      className={cn("rounded-none border-x-0 border-t-0", className)}
    />
  );
}

function FixtureTextRange({ label, start, end, className }: { label: string; start: string; end: string; className?: string }) {
  return (
    <div className={cn("flex h-8 items-center overflow-hidden rounded-mes-control border border-mes-border-default bg-white", className)}>
      <span className="flex h-full w-[72px] shrink-0 items-center border-r border-mes-border-default px-3 text-[14px] font-medium">
        {label}
      </span>
      <FixtureInput value={start} className="h-full w-[137px] rounded-none border-0" />
      <span className="flex h-full w-[9px] shrink-0 items-center justify-center text-[14px]">~</span>
      <FixtureInput value={end} className="h-full w-[140px] rounded-none border-0" />
    </div>
  );
}

function RadioOption({ checked, label, disabled = false, name }: { checked: boolean; label: string; disabled?: boolean; name: string }) {
  return (
    <label className={cn("flex h-8 items-center gap-1.5 text-[14px] font-medium", disabled && "text-mes-gray-70")}>
      <Radio name={name} checked={checked} readOnly disabled={disabled} />
      {label}
    </label>
  );
}

function SectionBand({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex h-7 items-center rounded-mes-control bg-mes-gray-30 px-2.5 text-[14px] font-bold text-mes-gray-100", className)}>{children}</div>;
}

export {
  FixtureDateRange,
  FixtureFilter,
  FixtureGroupQuery,
  FixtureInput,
  FixtureSearch,
  FixtureSelect,
  FixtureTable,
  FixtureTextRange,
  MesFixtureSidebar,
  MesPageTabs,
  RadioOption,
  SectionBand,
};
