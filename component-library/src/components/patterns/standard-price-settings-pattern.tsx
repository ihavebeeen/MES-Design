"use client";

import * as React from "react";
import { IconCalendar, IconTrash } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Switch } from "@/components/ui/switch";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PriceItem {
  code: string;
  item: string;
  type: string;
  unit: string;
  productionPrice: string;
  salesPrice: string;
}

interface PriceDraft {
  sync: boolean;
  productionStart: Date | null;
  productionEnd: Date | null;
  productionPrice: string;
  salesStart: Date | null;
  salesEnd: Date | null;
  salesPrice: string;
}

interface PriceHistory {
  priceType: "생산" | "판매";
  start: string;
  end: string;
  price: string;
  status: "예정" | "적용중" | "만료";
  registrant: string;
  registeredAt: string;
}

const itemNames = [
  "1500 얼초트레이(PS)",
  "초코칩쿠키 1500 TRAY",
  "초코칩쿠키 900 TRAY",
  ...Array.from({ length: 9 }, () => "롯데 소프트 CUP (반)"),
];

const itemRows: TableRowData<PriceItem>[] = itemNames.map((item, index) => ({
  id: `P${String(index + 1).padStart(3, "0")}`,
  data: {
    code: `P${String(index + 1).padStart(3, "0")}`,
    item,
    type: "완제품",
    unit: "ea",
    productionPrice: index < 2 ? "-" : index === 2 ? "2,000" : "200",
    salesPrice: index < 3 ? "-" : "100",
  },
}));

const initialSelectedIds = ["P002", "P003", "P004"];
const initialSelectionOrder = ["P003", "P004", "P002"];
const defaultDate = new Date(2026, 5, 1);

function createDrafts(): Record<string, PriceDraft> {
  return Object.fromEntries(itemRows.map((row) => [row.id, {
    sync: row.id === "P003",
    productionStart: defaultDate,
    productionEnd: null,
    productionPrice: row.id === "P003" ? "1000" : "",
    salesStart: defaultDate,
    salesEnd: null,
    salesPrice: row.id === "P003" ? "1000" : "",
  }]));
}

const historyByItem: Record<string, TableRowData<PriceHistory>[]> = {
  P003: [
    { id: "history-1", data: { priceType: "판매", start: "2026-06-01", end: "2026-06-30", price: "1,100", status: "예정", registrant: "김담당", registeredAt: "2025-12-31" } },
    { id: "history-2", data: { priceType: "생산", start: "2026-05-02", end: "2026-05-30", price: "1,000", status: "적용중", registrant: "김담당", registeredAt: "2025-12-31" } },
    { id: "history-3", disabled: true, data: { priceType: "판매", start: "2026-02-02", end: "2026-05-01", price: "900", status: "만료", registrant: "김담당", registeredAt: "2025-12-31" } },
    { id: "history-4", disabled: true, data: { priceType: "생산", start: "2026-01-01", end: "2026-02-01", price: "800", status: "만료", registrant: "김담당", registeredAt: "2025-12-31" } },
  ],
};

function numeric(value: string) {
  return value.replace(/[^\d]/g, "");
}

function PriceTypeBadge({ type }: { type: "생산" | "판매" }) {
  return <Badge variant={type === "생산" ? "blueLight" : "amber"} className={cn("h-[22px] px-2", type === "판매" && "bg-mes-yellow-10 text-mes-yellow-60")}>{type}단가</Badge>;
}

function PriceCard({ item, value, onChange, active }: { item: PriceItem; value: PriceDraft; onChange: (next: PriceDraft) => void; active: boolean }) {
  const updateProduction = (patch: Partial<PriceDraft>) => {
    const next = { ...value, ...patch };
    if (next.sync) {
      next.salesStart = next.productionStart;
      next.salesEnd = next.productionEnd;
      next.salesPrice = next.productionPrice;
    }
    onChange(next);
  };

  const setSync = (sync: boolean) => {
    onChange(sync ? {
      ...value,
      sync,
      salesStart: value.productionStart,
      salesEnd: value.productionEnd,
      salesPrice: value.productionPrice,
    } : { ...value, sync });
  };

  return (
    <section className={cn("h-[102px] shrink-0 overflow-hidden rounded-[8px] border bg-white", active ? "border-mes-primary-60" : "border-mes-gray-30")}>
      <div className="flex h-[41px] items-center justify-between px-5">
        <h3 className="truncate text-[14px] font-semibold text-mes-gray-130">{item.item}</h3>
        <label className="flex items-center gap-[5px] text-[13px] text-mes-gray-70">단가 동기화<Switch aria-label={`${item.item} 단가 동기화`} size="compact" checked={value.sync} onChange={(event) => setSync(event.target.checked)} /></label>
      </div>
      <div className="grid h-[60px] grid-rows-2 border-t border-mes-gray-30">
        <div className="flex h-[30px] items-center gap-2 px-3">
          <PriceTypeBadge type="생산" />
          <DatePicker aria-label={undefined} value={value.productionStart} onValueChange={(date) => updateProduction({ productionStart: date })} separator="-" className="h-[26px] w-[130px] text-[12px]" />
          <span className="text-[12px] text-mes-gray-70">~</span>
          <DatePicker value={value.productionEnd} onValueChange={(date) => updateProduction({ productionEnd: date })} separator="-" placeholder="종료일" className="h-[26px] w-[130px] text-[12px]" />
          <Input aria-label={`${item.item} 생산단가`} value={value.productionPrice} onChange={(event) => updateProduction({ productionPrice: numeric(event.target.value) })} placeholder="단가" className="h-[26px] min-w-0 flex-1 text-right text-[12px]" />
        </div>
        <div className="flex h-[30px] items-center gap-2 px-3">
          <PriceTypeBadge type="판매" />
          <DatePicker value={value.salesStart} onValueChange={(date) => onChange({ ...value, salesStart: date })} separator="-" disabled={value.sync} className="h-[26px] w-[130px] text-[12px]" />
          <span className="text-[12px] text-mes-gray-70">~</span>
          <DatePicker value={value.salesEnd} onValueChange={(date) => onChange({ ...value, salesEnd: date })} separator="-" placeholder="종료일" disabled={value.sync} className="h-[26px] w-[130px] text-[12px]" />
          <Input title={value.sync ? "생산단가 동기화 해제 후 입력 가능" : undefined} aria-label={`${item.item} 판매단가`} value={value.salesPrice} onChange={(event) => onChange({ ...value, salesPrice: numeric(event.target.value) })} placeholder="단가" disabled={value.sync} className="h-[26px] min-w-0 flex-1 text-right text-[12px]" />
        </div>
      </div>
    </section>
  );
}

interface StandardPriceSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StandardPriceSettingsModal({ open, onOpenChange }: StandardPriceSettingsModalProps) {
  const [committedSelectedIds, setCommittedSelectedIds] = React.useState(initialSelectedIds);
  const [selectedIds, setSelectedIds] = React.useState(initialSelectedIds);
  const [selectionOrder, setSelectionOrder] = React.useState(initialSelectionOrder);
  const [committedDrafts, setCommittedDrafts] = React.useState(createDrafts);
  const [drafts, setDrafts] = React.useState(createDrafts);
  const [activeItemId, setActiveItemId] = React.useState("P003");
  const [search, setSearch] = React.useState("");
  const [bulkStart, setBulkStart] = React.useState<Date | null>(null);
  const [bulkEnd, setBulkEnd] = React.useState<Date | null>(null);
  const [historyTab, setHistoryTab] = React.useState<"전체" | "생산단가" | "판매단가">("전체");
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const dismiss = React.useCallback(() => {
    setSelectedIds(committedSelectedIds);
    setSelectionOrder(initialSelectionOrder.filter((id) => committedSelectedIds.includes(id)));
    setDrafts(committedDrafts);
    setActiveItemId("P003");
    setSearch("");
  }, [committedDrafts, committedSelectedIds]);

  const changeSelection = (nextIds: string[]) => {
    setSelectionOrder((current) => [...current.filter((id) => nextIds.includes(id)), ...nextIds.filter((id) => !current.includes(id))]);
    setSelectedIds(nextIds);
  };

  const visibleRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const searched = itemRows.filter((row) => !query || row.data.code.toLowerCase().includes(query) || row.data.item.toLowerCase().includes(query));
    return [...searched.filter((row) => selectedIds.includes(row.id)), ...searched.filter((row) => !selectedIds.includes(row.id))];
  }, [search, selectedIds]);

  const selectedItems = selectionOrder.map((id) => itemRows.find((row) => row.id === id)).filter((row): row is TableRowData<PriceItem> => Boolean(row));
  const completedCount = selectedItems.filter((row) => drafts[row.id].productionPrice || drafts[row.id].salesPrice).length;

  const columns: TableColumn<PriceItem>[] = [
    { key: "code", label: "품목코드", width: 80, align: "center", render: (row) => row.code },
    { key: "item", label: "품목명", width: { min: 154, grow: 1 }, render: (row) => row.item },
    { key: "type", label: "구분", width: 80, align: "center", render: (row) => row.type },
    { key: "unit", label: "단위", width: 60, align: "center", render: (row) => row.unit },
    { key: "productionPrice", label: "생산단가", width: 100, align: "right", render: (row) => row.productionPrice },
    { key: "salesPrice", label: "판매단가", width: 100, align: "right", render: (row) => row.salesPrice },
  ];

  const applyBulk = () => {
    setDrafts((current) => Object.fromEntries(Object.entries(current).map(([id, draft]) => selectedIds.includes(id) ? [id, {
      ...draft,
      productionStart: bulkStart ?? draft.productionStart,
      productionEnd: bulkEnd,
      salesStart: bulkStart ?? draft.salesStart,
      salesEnd: bulkEnd,
    }] : [id, draft])));
  };

  const activeHistory = (historyByItem[activeItemId] ?? []).filter((row) => historyTab === "전체" || (historyTab === "생산단가" ? row.data.priceType === "생산" : row.data.priceType === "판매"));
  const historyColumns: TableColumn<PriceHistory>[] = [
    { key: "priceType", label: "단가구분", width: 120, align: "center", render: (row) => <Badge variant={row.priceType === "생산" ? "blueLight" : "amber"} className={cn(row.priceType === "판매" && "bg-mes-yellow-10 text-mes-yellow-60")}>{row.priceType}</Badge> },
    { key: "start", label: "시작일", width: { min: 150, grow: 1 }, align: "center", render: (row) => row.start },
    { key: "end", label: "종료일", width: { min: 150, grow: 1 }, align: "center", render: (row) => row.end },
    { key: "price", label: "단가", width: { min: 130, grow: 1 }, align: "right", render: (row) => row.price },
    { key: "status", label: "상태", width: { min: 120, grow: 1 }, align: "center", render: (row) => <span className={row.status === "적용중" ? "text-mes-primary-60" : undefined}>{row.status}</span> },
    { key: "registrant", label: "등록자", width: { min: 140, grow: 1 }, align: "center", render: (row) => row.registrant },
    { key: "registeredAt", label: "등록일", width: { min: 150, grow: 1 }, align: "center", render: (row) => row.registeredAt },
    { key: "delete", label: "삭제", width: 48, align: "center", render: () => <IconButton aria-label="단가 이력 삭제" size="xsmall" icon={<IconTrash size={14} />} onClick={() => setDeleteTarget("history")} /> },
  ];

  const confirm = () => {
    setCommittedSelectedIds(selectedIds);
    setCommittedDrafts(drafts);
    onOpenChange(false);
  };

  return (
    <CenterModal open={open} onOpenChange={onOpenChange} onCancel={dismiss} onConfirm={confirm} title="표준단가 설정" confirmLabel="확인" exactWidth={1320} exactHeight={800} maxHeight={800} bodyPadding="none" bodyAlign="stretch" scrollMode="content">
      <div data-testid="standard-price-body" className="relative flex h-full min-h-0 flex-col overflow-hidden">
        <span aria-hidden className="absolute left-[660px] top-0 z-10 h-[462px] border-l border-mes-gray-30" />
        <div className="grid h-12 shrink-0 grid-cols-[630px_630px] gap-5 px-5 pt-4">
          <div className="flex items-center justify-between"><h2 className="text-[16px] font-bold text-mes-gray-130">품목 선택</h2><SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" /></div>
          <div className="flex items-center gap-2"><h2 className="text-[16px] font-bold text-mes-gray-130">단가 입력</h2>{selectedIds.length > 0 && <Badge variant="grayFill" className="h-5">입력 완료 {completedCount}/{selectedIds.length}</Badge>}</div>
        </div>

        <div className="grid h-[402px] shrink-0 grid-cols-[630px_630px] gap-5 px-5 pt-4">
          <div className="h-[386px] overflow-y-auto" data-testid="standard-price-item-table">
            <Table columns={columns} rows={visibleRows} selectedIds={selectedIds} activeId={activeItemId} activeRowAppearance="strong-subtle" selectedRowAppearance="subtle" onSelectedIdsChange={changeSelection} onActiveIdChange={setActiveItemId} selectionColor="black" unselectedCheckboxAppearance="grayCheck" selectionHeaderIndeterminate={false} edgePadding={0} selectionColumnWidth={56} headerBackground="white" columnDividerMode="none" horizontalScroll={false} className="h-full" />
          </div>

          <section className="flex h-[386px] min-h-0 flex-col gap-3 pl-[10px]" data-testid="standard-price-editor">
            <div className="flex h-[31px] shrink-0 items-center justify-between rounded-mes-control border border-mes-gray-20 bg-mes-gray-10 px-[10px]">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-mes-primary-100"><IconCalendar size={14} />적용 기간 일괄 설정</span>
              <div className="flex items-center gap-2.5"><DatePicker value={bulkStart} onValueChange={setBulkStart} separator="-" placeholder="시작일" className="h-[26px] w-[120px] text-[12px]" /><span className="text-[12px] text-mes-gray-70">~</span><DatePicker value={bulkEnd} onValueChange={setBulkEnd} separator="-" placeholder="종료일" className="h-[26px] w-[120px] text-[12px]" /><Button size="xsmall" onClick={applyBulk}>적용</Button></div>
            </div>
            {selectedItems.length === 0 ? <p className="flex flex-1 items-center justify-center text-[14px] text-mes-gray-60">리스트에서 단가를 등록할 품목을 선택해 주세요.</p> : <div className="flex min-h-0 flex-1 flex-col gap-[10px] overflow-y-auto">{selectedItems.map((row) => <PriceCard key={row.id} item={row.data} value={drafts[row.id]} active={row.id === activeItemId} onChange={(next) => setDrafts((current) => ({ ...current, [row.id]: next }))} />)}</div>}
          </section>
        </div>

        <section data-testid="standard-price-history" className="mx-5 mt-[10px] flex h-[216px] shrink-0 flex-col gap-[10px] rounded-mes-control bg-mes-gray-20 px-5 py-[10px]">
          <div className="flex h-6 shrink-0 items-center gap-2.5"><h2 className="text-[16px] font-medium text-mes-gray-100">단가 이력</h2>{activeItemId && <><span className="text-mes-gray-70">·</span><strong className="text-[16px] text-mes-gray-130">{itemRows.find((row) => row.id === activeItemId)?.data.item}</strong></>}<div className="ml-auto flex items-center gap-1 rounded-mes-control bg-mes-gray-30 p-0.5">{(["전체", "생산단가", "판매단가"] as const).map((tab) => <Button key={tab} size="xsmall" variant={historyTab === tab ? "lineBlacktxt" : "fillGray"} className="h-[22px] min-w-[82px] border-0 px-5" onClick={() => setHistoryTab(tab)}>{tab}</Button>)}</div></div>
          <div className="relative min-h-0 flex-1 overflow-y-auto rounded-mes-control bg-white">
            <Table columns={historyColumns} rows={activeHistory} selectable={false} edgePadding={0} headerBackground="white" columnDividerMode="none" horizontalScroll={false} className="h-full border-0" />
            {activeHistory.length === 0 && <p className="absolute inset-x-0 top-[70px] text-center text-[14px] text-mes-gray-60">리스트에서 이력을 확인할 품목을 클릭해 주세요.</p>}
          </div>
        </section>
      </div>

      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(next) => !next && setDeleteTarget(null)} title="알림" heading="단가 삭제" description="해당 표준단가 이력을 삭제하시겠습니까? 삭제 후 해당 기간의 단가는 ‘없음’으로 처리됩니다." tone="warning" className="w-[444px]" actions={[{ label: "취소", variant: "fillGray", onClick: () => setDeleteTarget(null) }, { label: "확인", variant: "fillBlack", onClick: () => setDeleteTarget(null) }]} />
    </CenterModal>
  );
}

function StandardPriceSettingsVisualFixture() {
  const [open, setOpen] = React.useState(true);
  const [key, setKey] = React.useState(0);
  return <main className="relative h-[960px] w-[1440px] bg-white"><Button aria-label="표준단가 설정 다시 열기" size="small" className="absolute left-5 top-5 opacity-0" onClick={() => { setKey((value) => value + 1); setOpen(true); }}>설정 열기</Button><StandardPriceSettingsModal key={key} open={open} onOpenChange={setOpen} /></main>;
}

export { StandardPriceSettingsModal, StandardPriceSettingsVisualFixture };
