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
import { DateRangePicker } from "@/components/ui/date-range-picker";
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

function MesPageTabs({ active }: { active: string }) {
  return (
    <div className="flex h-[38px] w-full items-center justify-between bg-black pr-3">
      <div className="flex h-full">
        <PageTopTabItem label={active} active />
        <PageTopTabItem label="거래처 등록" />
        <PageTopTabItem label="품목 등록" />
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
}

function FixtureInput({ value, muted = false, className, ...props }: FixtureInputProps) {
  return (
    <Input
      value={typeof value === "string" || typeof value === "number" ? String(value) : ""}
      onChange={() => undefined}
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
    <div className="flex h-8 items-center overflow-hidden rounded-mes-control border border-mes-border-default bg-white">
      <span className="flex h-full items-center border-r border-mes-border-default px-3 text-[14px] font-medium">{label}</span>
      <DateRangePicker
        value={{ start: new Date(2025, 2, 30), end: new Date(2025, 2, 30) }}
        onValueChange={() => undefined}
        className="w-[250px] border-0"
      />
    </div>
  );
}

function FixtureSearch({ className }: { className?: string }) {
  return <SearchInput value="" onChange={() => undefined} placeholder="검색어 입력.." className={className} />;
}

function FixtureGroupQuery() {
  return <GroupQuery options={[]} levels={[null, null, null]} onLevelChange={() => undefined} />;
}

function FixtureFilter() {
  return <Filter categories={[]} value={{}} onChange={() => undefined} />;
}

interface FixtureTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  widths?: Array<number | string>;
  selectedRow?: number;
  selectable?: boolean;
  className?: string;
}

type FixtureTableData = { cells: React.ReactNode[] };

function FixtureTable({ headers, rows, widths, selectedRow, selectable = true, className }: FixtureTableProps) {
  const columns: TableColumn<FixtureTableData>[] = headers.map((header, index) => ({
    key: `column-${index}`,
    label: header,
    width: typeof widths?.[index] === "number" ? widths[index] as number : { min: 80, grow: 1 },
    align: "center",
    render: (row) => row.cells[index],
  }));
  const tableRows: TableRowData<FixtureTableData>[] = rows.map((cells, index) => ({
    id: `fixture-row-${index}`,
    data: { cells },
  }));

  return (
    <Table
      columns={columns}
      rows={tableRows}
      selectable={selectable}
      selectedIds={selectedRow === undefined ? [] : [`fixture-row-${selectedRow}`]}
      onSelectedIdsChange={() => undefined}
      className={cn("rounded-none border-x-0 border-t-0", className)}
    />
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

function SectionBand({ children }: { children: React.ReactNode }) {
  return <div className="flex h-7 items-center rounded-mes-control bg-mes-gray-30 px-2.5 text-[14px] font-bold text-mes-gray-100">{children}</div>;
}

export {
  FixtureDateRange,
  FixtureFilter,
  FixtureGroupQuery,
  FixtureInput,
  FixtureSearch,
  FixtureSelect,
  FixtureTable,
  MesFixtureSidebar,
  MesPageTabs,
  RadioOption,
  SectionBand,
};
