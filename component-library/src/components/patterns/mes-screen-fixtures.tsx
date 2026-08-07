import * as React from "react";
import { Bell, ChevronDown, Search, Settings, UserRound } from "lucide-react";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { Sidebar, type SidebarNavItem } from "@/components/ui/sidebar";
import {
  IconBox,
  IconChartBar,
  IconCompany,
  IconMedalCheck,
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
    icon: <Settings size={20} />,
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

function MoncatWordmark() {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap text-[18px] font-semibold text-white">
      <span className="relative h-4 w-3">
        <span className="absolute bottom-0 left-0 h-3 w-1.5 skew-x-[-18deg] rounded-sm bg-mes-primary-60" />
        <span className="absolute bottom-0 right-0 h-4 w-1.5 skew-x-[18deg] rounded-sm bg-[#24d0bd]" />
      </span>
      moncat factory
    </div>
  );
}

interface MesFixtureSidebarProps {
  dashboard?: boolean;
  collapsed?: boolean;
}

function MesFixtureSidebar({ dashboard = false, collapsed = false }: MesFixtureSidebarProps) {
  return (
    <Sidebar
      items={MES_NAV_ITEMS}
      logo={<MoncatWordmark />}
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
        <span className="relative flex size-[38px] items-center justify-center">
          <Bell size={20} fill="white" />
          <span className="absolute right-[5px] top-[3px] flex size-[14px] items-center justify-center rounded-full bg-mes-danger-60 text-[9px] font-bold">3</span>
        </span>
        <span className="flex size-[38px] items-center justify-center"><UserRound size={20} fill="white" /></span>
      </div>
    </div>
  );
}

interface SmallButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "line" | "main" | "black" | "gray";
}

function SmallButton({ children, tone = "line", className, type = "button", ...props }: SmallButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={cn(
        "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-[4px] border px-3 text-[14px] font-semibold",
        tone === "line" && "border-mes-gray-30 bg-white text-mes-gray-130",
        tone === "main" && "border-mes-primary-60 bg-mes-primary-60 text-white",
        tone === "black" && "border-mes-gray-130 bg-mes-gray-130 text-white",
        tone === "gray" && "border-mes-gray-40 bg-mes-gray-40 text-mes-gray-130",
        className
      )}
    >
      {children}
    </button>
  );
}

function ControlBox({ children, className, muted = false }: { children: React.ReactNode; className?: string; muted?: boolean }) {
  return (
    <div className={cn("flex h-8 items-center rounded-[4px] border border-mes-gray-30 px-3 text-[14px]", muted ? "bg-mes-gray-20" : "bg-white", className)}>
      {children}
    </div>
  );
}

function DateRangeControl({ label = "조회기준일자" }: { label?: string }) {
  return (
    <div className="flex h-8 items-center overflow-hidden rounded-[4px] border border-mes-gray-30 bg-white text-[14px]">
      <span className="flex h-full items-center border-r border-mes-gray-30 px-3 font-medium">{label}</span>
      <span className="flex h-full items-center gap-2 px-3">▣ <span>2025.03.30</span></span>
      <span>~</span>
      <span className="flex h-full items-center gap-2 px-3">▣ <span>2025.03.30</span></span>
    </div>
  );
}

function SearchControl() {
  return (
    <div className="flex h-8 w-[200px] items-center gap-3 rounded-[4px] border border-mes-gray-30 bg-mes-gray-20 px-3 text-[14px] text-mes-gray-60">
      <Search size={16} className="text-mes-gray-130" /> 검색어 입력..
    </div>
  );
}

function GroupControl() {
  return (
    <div className="flex h-8 items-center overflow-hidden rounded-[4px] border border-mes-gray-30 bg-white text-[14px]">
      <span className="flex h-full items-center gap-2 border-r border-mes-gray-30 px-3 font-medium">⌘ 그룹화 조회</span>
      {[1, 2, 3].map((level) => (
        <React.Fragment key={level}>
          <span className="flex h-full items-center bg-mes-gray-20 px-3 text-[13px] text-mes-gray-80">Level {level}</span>
          <span className="flex h-full w-[100px] items-center justify-between px-3">전체 <ChevronDown size={13} /></span>
        </React.Fragment>
      ))}
    </div>
  );
}

function CheckboxGlyph({ selected = false }: { selected?: boolean }) {
  return (
    <span className={cn("flex size-[22px] items-center justify-center rounded-[3px] text-[14px] font-bold text-white", selected ? "bg-mes-gray-130" : "bg-mes-gray-50")}>✓</span>
  );
}

interface DenseTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  widths?: Array<number | string>;
  selectedRow?: number;
  className?: string;
}

function DenseTable({ headers, rows, widths, selectedRow, className }: DenseTableProps) {
  return (
    <table className={cn("w-full table-fixed border-collapse bg-white text-[14px] text-mes-gray-130", className)}>
      {widths && <colgroup>{widths.map((width, index) => <col key={index} style={{ width }} />)}</colgroup>}
      <thead>
        <tr className="h-[30px] border-b border-mes-gray-30 text-[13px] font-semibold">
          {headers.map((header, index) => <th key={`${header}-${index}`} className="px-1.5 text-center font-semibold">{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={cn("h-[30px] border-b border-mes-gray-30", selectedRow === rowIndex && "bg-mes-primary-60 text-white")}>
            {row.map((cell, cellIndex) => <td key={cellIndex} className="truncate px-1.5 text-center">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SectionBand({ children }: { children: React.ReactNode }) {
  return <div className="flex h-7 items-center rounded-[4px] bg-mes-gray-30 px-2.5 text-[14px] font-bold text-mes-gray-100">{children}</div>;
}

export {
  CheckboxGlyph,
  ControlBox,
  DateRangeControl,
  DenseTable,
  GroupControl,
  MesFixtureSidebar,
  MesPageTabs,
  SearchControl,
  SectionBand,
  SmallButton,
};
