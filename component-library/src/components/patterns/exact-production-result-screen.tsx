"use client";

import * as React from "react";
import { IconBell, IconCalendar, IconCopy, IconDownload, IconMenu, IconSetting, IconUserMono } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Filter, type FilterCategory } from "@/components/ui/filter";
import { GroupQuery, type GroupQueryOption } from "@/components/ui/group-query";
import { Link } from "@/components/ui/link";
import { IconButton } from "@/components/ui/icon-button";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { QueryDateRange } from "@/components/ui/query-date-range";
import { QuickQuery, QuickQueryPresetDialog, type QuickQuerySlot } from "@/components/ui/quick-query";
import { SearchInput } from "@/components/ui/search-input";
import { Table, type TableColumn, type TableGroup, type TableRowData } from "@/components/ui/table";

interface ProductionRow {
  orderDate: string;
  shift: string;
  equipment: string;
  engineer: string;
  itemName: string;
  itemType: string;
  people: number;
  start: string;
  end: string;
  unit: string;
  production: number;
  defect: number;
}

const GROUP_OPTIONS: GroupQueryOption[] = [
  { id: "orderDate", label: "지시일" },
  { id: "equipment", label: "설비" },
  { id: "engineer", label: "담당기사" },
  { id: "item", label: "품목" },
];

const FILTER_CATEGORIES: FilterCategory[] = [
  { id: "itemType", label: "품목", options: Array.from({ length: 6 }, (_, index) => ({ id: `type-${index}`, label: `품목구분 ${index + 1}` })) },
  { id: "item", label: "품목", options: Array.from({ length: 23 }, (_, index) => ({ id: `item-${index}`, label: `품목 ${index + 1}` })) },
];

const BASE_ROWS: TableRowData<ProductionRow>[] = [
  { id: "p1", data: { orderDate: "2025-10-30", shift: "주간", equipment: "성형기 1호", engineer: "김수현", itemName: "더블비안코뚜껑", itemType: "완제품", people: 5, start: "15:00", end: "18:00", unit: "kg", production: 2000, defect: 10 } },
  { id: "p2", data: { orderDate: "2025-10-29", shift: "주간", equipment: "성형기 1호", engineer: "김수현", itemName: "더블비안코뚜껑", itemType: "완제품", people: 5, start: "15:00", end: "18:00", unit: "kg", production: 2000, defect: 10 } },
  { id: "p3", data: { orderDate: "2025-10-29", shift: "야간", equipment: "성형기 1호", engineer: "김수현", itemName: "더블비안코뚜껑", itemType: "완제품", people: 5, start: "15:00", end: "18:00", unit: "kg", production: 2000, defect: 10 } },
  { id: "p4", data: { orderDate: "2025-10-30", shift: "주간", equipment: "성형기 2호", engineer: "김수현", itemName: "비비빅", itemType: "반제품", people: 3, start: "13:00", end: "17:00", unit: "kg", production: 2000, defect: 0 } },
  { id: "p5", data: { orderDate: "2025-10-28", shift: "주간", equipment: "성형기 2호", engineer: "김수현", itemName: "비비빅", itemType: "반제품", people: 3, start: "13:00", end: "17:00", unit: "kg", production: 2000, defect: 0 } },
  { id: "p6", data: { orderDate: "2025-10-28", shift: "주간", equipment: "성형기 2호", engineer: "김수현", itemName: "비비빅", itemType: "반제품", people: 3, start: "13:00", end: "17:00", unit: "kg", production: 2000, defect: 0 } },
  { id: "p7", data: { orderDate: "2025-10-27", shift: "주간", equipment: "성형기 2호", engineer: "김수현", itemName: "비비빅", itemType: "반제품", people: 3, start: "13:00", end: "17:00", unit: "kg", production: 2000, defect: 0 } },
  { id: "p8", isNew: true, data: { orderDate: "2025-10-27", shift: "주간", equipment: "성형기 2호", engineer: "김수현", itemName: "비비빅", itemType: "반제품", people: 3, start: "13:00", end: "17:00", unit: "kg", production: 2000, defect: 0 } },
  { id: "p9", data: { orderDate: "2025-10-26", shift: "야간", equipment: "성형기 2호", engineer: "김수현", itemName: "비비빅", itemType: "반제품", people: 3, start: "13:00", end: "17:00", unit: "kg", production: 2000, defect: 0 } },
];

export interface ExactProductionResultScreenProps {
  viewport?: 1280 | 768 | 375;
}

function ExactProductionResultScreen({ viewport = 1280 }: ExactProductionResultScreenProps) {
  const mobile = viewport === 375;
  const tablet = viewport === 768;
  const compact = mobile || tablet;
  const [levels, setLevels] = React.useState<(string | null)[]>(["orderDate", "equipment", null]);
  const [filters, setFilters] = React.useState<Record<string, string[]>>({ itemType: Array.from({ length: 6 }, (_, index) => `type-${index}`), item: Array.from({ length: 23 }, (_, index) => `item-${index}`) });
  const [quickId, setQuickId] = React.useState<string | null>("setting-1");
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState(["p4"]);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date(2025, 9, 30));
  const [endDate, setEndDate] = React.useState<Date | null>(new Date(2025, 9, 30));
  const [quickSettingsOpen, setQuickSettingsOpen] = React.useState(false);
  const [quickSlots, setQuickSlots] = React.useState<QuickQuerySlot[]>([
    { id: "setting-1", name: "설정 1", detail: { grouping: "지시일 > 설비" } },
    { id: "setting-2", name: "설정 2" },
    { id: "setting-3", name: "설정 3" },
  ]);

  const filteredRows = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? BASE_ROWS.filter(({ data }) => Object.values(data).some((value) => String(value).toLowerCase().includes(normalized))) : BASE_ROWS;
  }, [query]);

  const groups: TableGroup<ProductionRow>[] = [
    { id: "equipment-1", label: "설비 : 성형기 1호", summary: { people: "15", production: "6,000", defect: "30" }, rows: filteredRows.slice(0, 3) },
    { id: "equipment-2", label: "설비 : 성형기 2호", summary: { people: "15", production: "12,000", defect: "0" }, rows: filteredRows.slice(3) },
  ];

  const columns: TableColumn<ProductionRow>[] = [
    { key: "orderDate", label: "지시일", width: 123, align: "center", render: (row) => row.orderDate },
    { key: "shift", label: "근무조", width: 55, align: "center", render: (row) => row.shift },
    { key: "equipment", label: "설비", width: 126, render: (row) => row.equipment },
    { key: "engineer", label: "담당기사", width: 64, align: "center", render: (row) => row.engineer },
    { key: "itemName", label: "품목명", width: 149, render: (row) => <Link href="#">{row.itemName}</Link> },
    { key: "itemType", label: "품목구분", width: 78, render: (row) => row.itemType },
    { key: "people", label: "포장인원", width: 70, align: "right", render: (row) => row.people },
    { key: "start", label: "시작시간", width: 123, align: "center", render: (row) => row.start },
    { key: "end", label: "종료시간", width: 124, align: "center", render: (row) => row.end },
    { key: "unit", label: "단위", width: 52, align: "center", render: (row) => row.unit },
    { key: "production", label: "생산수량", width: 104, align: "right", render: (row) => row.production.toLocaleString() },
    { key: "defect", label: "불량수량", width: 104, align: "right", render: (row) => row.defect.toLocaleString() },
    { key: "input", label: "투입", width: 68, align: "center", render: () => <Link href="#">투입정보</Link> },
  ];

  return (
    <>
    <div className="flex flex-col overflow-hidden bg-white text-mes-text-default" style={{ width: viewport, height: mobile ? 812 : 960 }}>
      <div className="flex h-[38px] shrink-0 items-center justify-between bg-black pr-3"><div className="flex h-full"><PageTopTabItem label="생산실적" active bookmarked closable={!mobile} />{!mobile && <><PageTopTabItem label="거래처 등록" /><PageTopTabItem label="품목 등록" bookmarked /></>}</div><div className="flex gap-4 text-white"><IconBell size={20} /><IconUserMono size={20} /></div></div>
      <div className="flex h-12 shrink-0 items-center border-b border-mes-border-default px-5"><IconButton icon={<IconMenu size={17} />} aria-label="메뉴" /><h2 className="ml-[10px] text-[20px] font-bold whitespace-nowrap">생산실적 리스트</h2><div className="ml-auto flex items-center gap-[10px]">{mobile ? <><IconButton icon={<IconCalendar size={16} />} aria-label="조회기준일자" variant="lineBlacktxt" /><IconButton icon={<IconSetting size={16} />} aria-label="설정" variant="lineBlacktxt" onClick={() => setQuickSettingsOpen(true)} /></> : <><QueryDateRange start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} /><Button size="small">조회</Button><Button size="small" variant="lineBlacktxt" startIcon={<IconSetting size={16} />} onClick={() => setQuickSettingsOpen(true)}>설정</Button></>}</div></div>
      <div className="flex h-12 shrink-0 items-center gap-[10px] border-b border-mes-border-default px-5"><GroupQuery options={GROUP_OPTIONS} levels={levels} onLevelChange={(index, value) => setLevels((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))} compact={compact} compactLabel={mobile ? false : "그룹화"} /><Filter categories={FILTER_CATEGORIES} value={filters} onChange={(categoryId, optionIds) => setFilters((current) => ({ ...current, [categoryId]: optionIds }))} triggerLabel={compact ? (mobile ? false : "필터") : false} showTriggerArrow={compact} showActiveTags={!compact} />{mobile ? <QuickQuery presets={[]} activeId={quickId} onApply={setQuickId} onClearActive={() => setQuickId(null)} onSettingsClick={() => setQuickSettingsOpen(true)} compact /> : <QuickQuery presets={quickSlots.filter((slot) => slot.name).map((slot) => ({ id: slot.id, label: slot.name! }))} activeId={quickId} onApply={setQuickId} onClearActive={() => setQuickId(null)} onSettingsClick={() => setQuickSettingsOpen(true)} triggerLabel={false} className="ml-auto" />}<SearchInput value={query} onChange={setQuery} placeholder={compact ? "검색" : ""} size="compact" background="white" className={mobile ? "ml-auto !w-[100px]" : tablet ? "!w-[160px]" : "!w-[120px]"} /></div>
      <div className="flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-w-[1280px] flex-col">
          <Table<ProductionRow> columns={columns} groups={groups} selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} selectionColor="black" unselectedCheckboxAppearance="grayCheck" selectionHeaderIndeterminate={false} edgePadding={0} selectionColumnWidth={40} centerSelection columnDividers horizontalScroll={false} showMasterGroupToggles={false} groupLevelColors={["#fde9ea"]} className="rounded-none border-x-0 border-t-0" />
          <div className="mt-auto flex h-[30px] shrink-0 items-center border-y border-mes-border-default bg-mes-gray-10 text-[14px] font-semibold"><span className="px-5">총계</span><span className="ml-[600px] w-[70px] text-right">46</span><span className="w-[403px]" /><span className="w-[104px] text-right">18,000</span><span className="w-[104px] text-right">30</span><span className="w-[68px]" /></div>
        </div>
      </div>
      {mobile ? <div className="flex h-[121px] shrink-0 flex-col border-t border-mes-border-default px-5 py-2"><div className="flex gap-[10px]"><IconButton icon={<IconCopy size={16} />} aria-label="복사" variant="lineBlacktxt" /><IconButton icon={<IconDownload size={16} />} aria-label="다운로드" variant="lineBlacktxt" /></div><div className="mt-[10px] grid grid-cols-[77px_77px_77px_77px] gap-[9px]"><Button size="small" variant="fillBlack" className="px-0">삭제</Button><Button size="small" variant="fillBlack" className="px-0">출하지시 등록</Button><Button size="small" variant="fillBlack" className="px-0 text-[12px]">엑셀 일괄등록</Button><Button size="small" className="px-0">판매계획 등록</Button></div></div> : tablet ? <div className="flex h-[46px] shrink-0 items-center px-5"><div className="flex gap-[10px]"><IconButton icon={<IconCopy size={16} />} aria-label="복사" variant="lineBlacktxt" /><IconButton icon={<IconDownload size={16} />} aria-label="다운로드" variant="lineBlacktxt" /></div><div className="ml-auto grid grid-cols-4 gap-[10px]"><Button size="small" variant="fillBlack" className="w-[130px]">버튼1</Button><Button size="small" variant="fillBlack" className="w-[130px]">버튼2</Button><Button size="small" variant="fillBlack" className="w-[130px]">버튼3</Button><Button size="small" variant="fillBlack" className="w-[130px]">버튼4</Button></div></div> : <div className="flex h-[46px] shrink-0 items-center px-5"><div className="flex gap-[10px]"><Button size="small" variant="lineBlacktxt" startIcon={<IconCopy size={16} />}>복사</Button><Button size="small" variant="lineBlacktxt" startIcon={<IconDownload size={16} />}>다운로드</Button></div><div className="ml-auto flex gap-[10px]"><Button size="small" variant="fillBlack" className="w-[160px]">원료투입분석</Button><Button size="small" variant="fillBlack" className="w-[160px]">삭제</Button><Button size="small" variant="fillBlack" className="w-[160px]">생산실적등록</Button></div></div>}
    </div>
    <QuickQueryPresetDialog
      open={quickSettingsOpen}
      onOpenChange={setQuickSettingsOpen}
      slots={quickSlots}
      onDelete={(id) => { setQuickSlots((current) => current.map((slot) => slot.id === id ? { ...slot, name: null } : slot)); if (quickId === id) setQuickId(null); }}
      onSaveSlot={(id, name) => setQuickSlots((current) => current.map((slot) => slot.id === id ? { ...slot, name } : slot))}
      currentPreview={{ grouping: levels.filter(Boolean).map((level) => GROUP_OPTIONS.find((option) => option.id === level)?.label).filter(Boolean).join(" > ") }}
    />
    </>
  );
}

export { ExactProductionResultScreen };
