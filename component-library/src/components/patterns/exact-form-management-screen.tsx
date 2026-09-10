"use client";

import * as React from "react";
import {
  IconBell,
  IconBox,
  IconChartBar,
  IconCompany,
  IconCopy,
  IconDownload,
  IconFileNote,
  IconMedalCheck,
  IconPlus,
  IconSetting,
  IconUserMono,
  IconWrench,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Filter, type FilterCategory } from "@/components/ui/filter";
import { GroupQuery, type GroupQueryOption } from "@/components/ui/group-query";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { SearchInput } from "@/components/ui/search-input";
import { QueryDateRange } from "@/components/ui/query-date-range";
import { Sidebar, type SidebarNavItem } from "@/components/ui/sidebar";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

interface FormRow {
  name: string;
  slot: string;
  formType: string;
  target: string;
  customCount: number;
  baseCount: number;
  registrant: string;
  enabled: "Y" | "N";
}

const NAV_ITEMS: SidebarNavItem[] = [
  { key: "stock", label: "재고", icon: <IconBox size={22} /> },
  { key: "factory", label: "생산", icon: <IconCompany size={22} /> },
  { key: "quality", label: "품질", icon: <IconMedalCheck size={22} /> },
  { key: "settings", label: "MES 설정", icon: <IconWrench size={22} /> },
  { key: "analytics", label: "통계분석", icon: <IconChartBar size={22} /> },
  { key: "admin", label: "관리", icon: <IconFileNote size={22} /> },
];

const GROUP_OPTIONS: GroupQueryOption[] = [
  { id: "name", label: "양식명" },
  { id: "slot", label: "양식 슬롯" },
  { id: "type", label: "양식유형" },
  { id: "target", label: "기준대상" },
];

const FILTER_CATEGORIES: FilterCategory[] = [
  { id: "formType", label: "양식유형", options: [{ id: "equipment", label: "설비점검표" }] },
  { id: "target", label: "기준대상", options: [{ id: "equipment", label: "설비기준" }] },
  { id: "enabled", label: "사용여부", options: [{ id: "yes", label: "Y" }, { id: "no", label: "N" }] },
];

const FORM_ROWS: TableRowData<FormRow>[] = [
  {
    id: "form-1",
    data: { name: "냉각기 점검표", slot: "SLOT 1", formType: "설비점검표", target: "설비기준", customCount: 5, baseCount: 4, registrant: "이해빈", enabled: "Y" },
  },
  {
    id: "form-2",
    data: { name: "냉각기 점검표", slot: "SLOT 1", formType: "설비점검표", target: "설비기준", customCount: 5, baseCount: 4, registrant: "이해빈", enabled: "Y" },
  },
];

export interface ExactFormManagementScreenProps {
  onOpenEditor?: () => void;
  onOpenCriteria?: () => void;
}

function ExactFormManagementScreen({ onOpenEditor, onOpenCriteria }: ExactFormManagementScreenProps) {
  const [levels, setLevels] = React.useState<(string | null)[]>([null, null, null]);
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date(2025, 2, 30));
  const [endDate, setEndDate] = React.useState<Date | null>(new Date(2025, 2, 30));

  const filteredRows = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return FORM_ROWS;
    return FORM_ROWS.filter(({ data }) => Object.values(data).some((value) => String(value).toLowerCase().includes(normalized)));
  }, [query]);

  const columns: TableColumn<FormRow>[] = [
    { key: "name", label: "양식명", width: 198, align: "center", render: (row) => <span className="whitespace-nowrap">{row.name}</span> },
    { key: "slot", label: "양식 슬롯", width: 189, align: "center", render: (row) => row.slot },
    { key: "formType", label: "양식유형", width: 201, align: "center", render: (row) => row.formType },
    { key: "target", label: "기준대상", width: 190, align: "center", render: (row) => row.target },
    { key: "customCount", label: "커스텀 항목", width: 176, align: "center", render: (row) => row.customCount },
    { key: "baseCount", label: "기준 항목", width: 193, align: "center", render: (row) => row.baseCount },
    {
      key: "criteria",
      label: "검사기준 설정",
      width: 190,
      align: "center",
      render: () => <Button size="xsmall" startIcon={<IconWrench size={13} />} onClick={onOpenCriteria}>검사기준</Button>,
    },
    { key: "registrant", label: "등록자", width: 171, align: "center", render: (row) => row.registrant },
    { key: "enabled", label: "사용여부", width: 164, align: "center", render: (row) => row.enabled },
    {
      key: "edit",
      label: "편집",
      width: 106,
      align: "center",
      render: () => <Button size="xsmall" variant="fillGray" className="px-2" onClick={onOpenEditor}>편집 ›</Button>,
    },
  ];

  return (
    <div className="flex h-[960px] w-[1920px] overflow-hidden bg-white text-mes-text-default">
      <Sidebar
        collapsed
        activeKey="settings"
        items={NAV_ITEMS}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[38px] shrink-0 items-center justify-between bg-black pr-3">
          <div className="flex h-full items-center">
            <PageTopTabItem label="검사 양식 등록" active bookmarked />
            <PageTopTabItem label="거래처 등록" />
            <PageTopTabItem label="품목 등록" bookmarked />
          </div>
          <div className="flex items-center gap-3 text-white">
            <IconButton icon={<IconBell size={20} />} aria-label="알림" className="size-7 text-white hover:bg-white/10 hover:text-white" />
            <IconButton icon={<IconUserMono size={20} />} aria-label="사용자 메뉴" className="size-7 text-white hover:bg-white/10 hover:text-white" />
          </div>
        </div>

        <div className="flex h-[47px] shrink-0 items-center border-b border-mes-border-default px-5">
          <h2 className="text-[20px] font-bold whitespace-nowrap">검사 양식 리스트</h2>
          <div className="ml-auto flex items-center gap-2">
            <QueryDateRange start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} className="[&>button]:w-[128px]" />
            <Button size="small">조회</Button>
            <Button size="small" variant="lineBlacktxt" startIcon={<IconSetting size={16} />}>설정</Button>
          </div>
        </div>

        <div className="flex h-[47px] shrink-0 items-center gap-[10px] border-b border-mes-border-default px-5">
          <GroupQuery options={GROUP_OPTIONS} levels={levels} onLevelChange={(index, value) => setLevels((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))} />
          <Filter categories={FILTER_CATEGORIES} value={filters} onChange={(categoryId, optionIds) => setFilters((current) => ({ ...current, [categoryId]: optionIds }))} />
          <SearchInput value={query} onChange={setQuery} placeholder="검색어 입력.." size="compact" className="ml-auto" />
        </div>

        <Table<FormRow>
          columns={columns}
          rows={filteredRows}
          selectedIds={selectedIds}
          activeId={null}
          onSelectedIdsChange={setSelectedIds}
          selectionColor="black"
          unselectedCheckboxAppearance="grayCheck"
          selectionHeaderIndeterminate={false}
          edgePadding={20}
          selectionColumnWidth={40}
          centerSelection
          columnDividers={false}
          horizontalScroll={false}
          className="rounded-none border-x-0 border-t-0"
        />

        <div className="mt-auto flex h-[47px] shrink-0 items-center border-t border-mes-border-default px-5">
          <div className="flex gap-[10px]">
            <Button size="small" variant="lineBlacktxt" startIcon={<IconCopy size={16} />}>복사</Button>
            <Button size="small" variant="lineBlacktxt" startIcon={<IconDownload size={16} />}>다운로드</Button>
          </div>
          <div className="ml-auto flex gap-[10px]">
            <Button size="small" variant="fillBlack" className="w-[160px]">삭제</Button>
            <Button size="small" className="w-[160px]" startIcon={<IconPlus size={16} />} onClick={onOpenEditor}>양식 등록</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export { ExactFormManagementScreen };
