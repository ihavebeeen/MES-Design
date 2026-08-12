"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { Filter } from "@/components/ui/filter";
import { GroupQuery, type GroupQueryOption } from "@/components/ui/group-query";
import { IconButton } from "@/components/ui/icon-button";
import { QueryDateRange } from "@/components/ui/query-date-range";
import { QuickQuery, QuickQueryPresetDialog, type QuickQuerySlot } from "@/components/ui/quick-query";
import { SearchInput } from "@/components/ui/search-input";
import { Table, type TableColumn, type TableGroup, type TableRowData } from "@/components/ui/table";
import { IconArrow, IconCopy, IconDownload, IconPlus, IconSetting } from "@/components/icons";
import { EntityListPattern } from "./entity-list-pattern";
import { MesFixtureSidebar, MesPageTabs } from "./mes-screen-fixtures";
import { BulkShipmentApprovalModal } from "./shipment-approval-pattern";

interface SalesRow {
  shipmentDate: string;
  customer: string;
  item: string;
  orderQuantity: string;
  shippedQuantity: string;
  currency: string;
  foreignAmount: string;
  localAmount: string;
  shipmentApproval: string;
  billing: string;
  billingDate: string;
  supplyAmount: string;
  tax: string;
  total: string;
  note: string;
}

interface StatementRow {
  date: string;
  customer: string;
  amount: string;
}

const statementRows: TableRowData<StatementRow>[] = [
  ["2025-03-13", "해태제과식품(주)아산", "250,000"],
  ["2025-03-13", "해태제과식품(주)아산", "360,000"],
  ["2025-03-13", "해태제과식품(주)아산", "180,000"],
  ["2025-03-13", "해태제과식품(주)아산", "410,000"],
  ["2025-03-13", "해태제과식품(주)아산", "315,000"],
  ["2025-03-13", "해태제과식품(주)아산", "485,000"],
  ["2025-03-12", "동진기업(주)", "210,000"],
].map(([date, customer, amount], index) => ({
  id: `statement-${index + 1}`,
  data: { date, customer, amount },
}));

const statementColumns: TableColumn<StatementRow>[] = [
  { key: "date", label: "출하지시일", width: { min: 0, grow: 1 }, align: "center", render: (row) => row.date },
  { key: "customer", label: "거래처", width: { min: 0, grow: 1 }, align: "center", render: (row) => row.customer },
  { key: "amount", label: "원화판매금액", width: { min: 0, grow: 1 }, align: "right", render: (row) => row.amount },
];

const mainColumns: TableColumn<SalesRow>[] = [
  { key: "shipmentDate", label: "출하지시일", width: { min: 118, grow: 1 }, align: "center", render: (row) => row.shipmentDate },
  { key: "customer", label: "거래처", width: { min: 118, grow: 1 }, render: (row) => row.customer },
  { key: "item", label: "품목", width: 100, render: (row) => row.item },
  { key: "orderQuantity", label: "출하지시수량", width: 120, align: "right", render: (row) => row.orderQuantity },
  { key: "shippedQuantity", label: "출하실적수량", width: 120, align: "right", render: (row) => row.shippedQuantity },
  { key: "currency", label: "통화", width: 80, align: "center", render: (row) => row.currency },
  { key: "foreignAmount", label: "외화판매금액", width: { min: 118, grow: 1 }, align: "right", render: (row) => row.foreignAmount },
  { key: "localAmount", label: "원화판매금액", width: { min: 118, grow: 1 }, align: "right", render: (row) => row.localAmount },
  { key: "shipmentApproval", label: "출하승인", width: 105, align: "center", render: (row) => row.shipmentApproval },
  { key: "billing", label: "청구", width: 105, align: "center", render: (row) => row.billing },
  { key: "billingDate", label: "청구일", width: 128, align: "center", render: (row) => row.billingDate },
  { key: "supplyAmount", label: "공급가액", width: 142, align: "right", render: (row) => row.supplyAmount },
  { key: "tax", label: "부가세", width: 142, align: "right", render: (row) => row.tax },
  { key: "total", label: "합계", width: 142, align: "right", render: (row) => row.total },
  { key: "note", label: "비고", width: 72, render: (row) => row.note },
];

const customerGroups: TableGroup<SalesRow>[] = [
  createSalesGroup("대한항공", ["뽀로로", "빠삐코", "더블비안코"], 1),
  createSalesGroup("롯데웰푸드(주)", ["빵빠레", "월드콘", "설레임"], 4),
  createSalesGroup("해태제과식품(주)아산", ["1500흠칩볼(소)", "4.4k 흠칩볼(대)", "탱크보이"], 7),
];

function createSalesGroup(customer: string, items: string[], seed: number): TableGroup<SalesRow> {
  const rows = items.map((item, index): TableRowData<SalesRow> => {
    const quantity = (index + 1) * 1000;
    const localAmount = quantity * 2000;
    return {
      id: `sales-${seed + index}`,
      data: {
        shipmentDate: "2025-03-13",
        customer,
        item,
        orderQuantity: quantity.toLocaleString(),
        shippedQuantity: quantity.toLocaleString(),
        currency: "KRW",
        foreignAmount: "-",
        localAmount: localAmount.toLocaleString(),
        shipmentApproval: "승인",
        billing: index % 2 === 0 ? "미청구" : "청구완료",
        billingDate: index % 2 === 0 ? "-" : "2025-03-14",
        supplyAmount: (localAmount / 1.1).toFixed(0),
        tax: (localAmount / 11).toFixed(0),
        total: localAmount.toLocaleString(),
        note: "",
      },
    };
  });

  return {
    id: `group-${seed}`,
    label: `거래처 : ${customer}`,
    defaultExpanded: true,
    rows,
    summary: {
      orderQuantity: rows.reduce((sum, row) => sum + Number(row.data.orderQuantity.replaceAll(",", "")), 0).toLocaleString(),
      shippedQuantity: rows.reduce((sum, row) => sum + Number(row.data.shippedQuantity.replaceAll(",", "")), 0).toLocaleString(),
      localAmount: rows.reduce((sum, row) => sum + Number(row.data.localAmount.replaceAll(",", "")), 0).toLocaleString(),
      supplyAmount: "-",
      tax: "-",
      total: "-",
    },
  };
}

function SalesQueryToolbar() {
  const [levels, setLevels] = React.useState<(string | null)[]>(["customer", null, null]);
  const [search, setSearch] = React.useState("");
  const options: GroupQueryOption[] = [
    { id: "customer", label: "거래처" },
    { id: "shipment-date", label: "출하지시일" },
    { id: "item", label: "품목" },
    { id: "billing", label: "청구" },
  ];
  const filterCategories = [{ id: "billing", label: "청구", options: [{ id: "unbilled", label: "미청구" }, { id: "billed", label: "청구완료" }] }];
  const [filterValue, setFilterValue] = React.useState<Record<string, string[]>>({ billing: [] });
  const [quickQueryId, setQuickQueryId] = React.useState<string | null>(null);
  const [quickQueryOpen, setQuickQueryOpen] = React.useState(false);
  const [quickQuerySlots, setQuickQuerySlots] = React.useState<QuickQuerySlot[]>([
    { id: "sales-query-1", name: null },
    { id: "sales-query-2", name: null },
    { id: "sales-query-3", name: null },
  ]);

  return (
    <>
      <div data-testid="sales-query-toolbar" className="flex h-12 items-center justify-between bg-white px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <GroupQuery options={options} levels={levels} onLevelChange={(index, value) => setLevels((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))} />
          <Filter categories={filterCategories} value={filterValue} onChange={(id, values) => setFilterValue((current) => ({ ...current, [id]: values }))} />
          <QuickQuery
            presets={quickQuerySlots.flatMap((slot) => slot.name ? [{ id: slot.id, label: slot.name }] : [])}
            activeId={quickQueryId}
            onApply={setQuickQueryId}
            onClearActive={() => setQuickQueryId(null)}
            onSettingsClick={() => setQuickQueryOpen(true)}
          />
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="subtle" />
      </div>
      <QuickQueryPresetDialog
        open={quickQueryOpen}
        onOpenChange={setQuickQueryOpen}
        slots={quickQuerySlots}
        currentPreview={{ grouping: levels.map((level) => options.find((option) => option.id === level)?.label ?? "전체").join(" / ") }}
        onDelete={(id) => { setQuickQuerySlots((current) => current.map((slot) => slot.id === id ? { ...slot, name: null } : slot)); if (quickQueryId === id) setQuickQueryId(null); }}
        onSaveSlot={(id, name) => setQuickQuerySlots((current) => current.map((slot) => slot.id === id ? { ...slot, name } : slot))}
      />
    </>
  );
}

function StatementDateRange() {
  const [start, setStart] = React.useState(new Date(2025, 2, 13));
  const [end, setEnd] = React.useState(new Date(2025, 2, 13));
  return <QueryDateRange label="조회일자" start={start} end={end} onStartChange={setStart} onEndChange={setEnd} />;
}

interface TransactionStatementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TransactionStatementModal({ open, onOpenChange }: TransactionStatementModalProps) {
  const initialIds = React.useMemo(() => statementRows.slice(0, 6).map((row) => row.id), []);
  const [committedIds, setCommittedIds] = React.useState(initialIds);
  const [draftIds, setDraftIds] = React.useState(initialIds);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [message, setMessage] = React.useState("");
  const visibleRows = statementRows.filter((row) => row.data.customer.includes(search) || row.data.date.includes(search));

  const dismiss = React.useCallback(() => {
    setDraftIds(committedIds);
    setSearch("");
    setPage(1);
  }, [committedIds]);

  const output = () => {
    setCommittedIds(draftIds);
    setMessage(`${draftIds.length}건의 거래명세서 출력 요청이 완료되었습니다.`);
    onOpenChange(false);
  };

  return (
    <>
      <CenterModal
        open={open}
        onOpenChange={onOpenChange}
        onCancel={dismiss}
        title="거래명세서 출력"
        exactWidth={1300}
        exactHeight={646}
        maxHeight={646}
        bodyPadding="none"
        bodyAlign="stretch"
        scrollMode="content"
        footer={
          <div className="relative flex h-[72px] shrink-0 items-center border-t border-mes-gray-30 px-4">
            <Button asChild size="small" variant="lineBlacktxt">
              <Link href="/images/sales-transaction-statement-preview.png" download><IconDownload size={16} />다운로드</Link>
            </Button>
            <div className="absolute left-1/2 flex -translate-x-1/2 gap-2.5">
              <Button size="basic" variant="fillGray" className="w-40" onClick={() => { dismiss(); onOpenChange(false); }}>취소</Button>
              <Button size="basic" variant="fillBlack" className="w-40" onClick={output}>출력</Button>
            </div>
          </div>
        }
      >
        <div data-testid="statement-modal-body" className="grid h-full min-h-0 grid-cols-2 overflow-hidden">
          <section data-testid="statement-list-pane" className="flex min-w-0 flex-col bg-white">
            <div className="flex h-[60px] shrink-0 items-start justify-between px-5 pt-4">
              <h2 className="text-[16px] font-bold leading-6 text-mes-gray-130">판매관리 리스트</h2>
              <div className="flex items-center gap-2">
                <StatementDateRange />
                <Button size="small">조회</Button>
              </div>
            </div>
            <div className="flex h-12 shrink-0 items-center bg-mes-gray-20 px-5">
              <SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." width="fill" size="compact" background="white" />
            </div>
            <div className="min-h-0 flex-1 px-5 pt-4">
              <div data-testid="statement-selection-table" className="h-60 w-full">
                <Table
                  columns={statementColumns}
                  rows={visibleRows}
                  selectedIds={draftIds}
                  onSelectedIdsChange={setDraftIds}
                  selectionColor="black"
                  unselectedCheckboxAppearance="grayCheck"
                  edgePadding={0}
                  selectionColumnWidth={56}
                  centerSelection
                  headerBackground="white"
                  columnDividerMode="solid-header"
                  horizontalScroll={false}
                  className="h-60 rounded-none border-x border-t border-mes-gray-30"
                />
              </div>
            </div>
          </section>
          <section data-testid="statement-preview-pane" className="flex min-w-0 flex-col bg-mes-gray-20 px-5 pt-4">
            <h2 className="h-8 shrink-0 text-[16px] font-bold leading-6 text-mes-gray-130">거래명세서</h2>
            <div className="flex h-[438px] shrink-0 flex-col items-center border border-mes-gray-30 bg-white pt-8">
              <div className="flex h-[374px] w-[272px] items-center justify-center overflow-hidden border border-mes-gray-30 bg-white shadow-sm">
                <Image src="/images/sales-transaction-statement-preview.png" alt="공급가액·부가세가 포함된 거래명세서 미리보기" width={240} height={343} unoptimized className="h-[343px] w-60 object-contain" />
              </div>
              <div className="mt-3 flex h-8 items-center gap-3 text-[14px] text-mes-gray-130">
                <IconButton aria-label="이전 거래명세서" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} icon={<IconArrow size={14} />} />
                <span aria-label="거래명세서 페이지">{page} / 15</span>
                <IconButton aria-label="다음 거래명세서" disabled={page === 15} onClick={() => setPage((current) => Math.min(15, current + 1))} icon={<IconArrow size={14} className="rotate-180" />} />
              </div>
            </div>
          </section>
        </div>
      </CenterModal>
      <p aria-live="polite" className="sr-only">{message}</p>
    </>
  );
}

function SalesTransactionStatementScreen() {
  const [modalOpen, setModalOpen] = React.useState(true);
  const [bulkApprovalOpen, setBulkApprovalOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState(["sales-4", "sales-5", "sales-7", "sales-8"]);
  const [start, setStart] = React.useState(new Date(2025, 2, 13));
  const [end, setEnd] = React.useState(new Date(2025, 2, 13));

  return (
    <div data-sales-transaction-statement-screen className="relative h-[960px] w-[1920px] overflow-hidden">
      <EntityListPattern
        navigation={<MesFixtureSidebar collapsed />}
        tabs={<MesPageTabs active="판매관리" extraTabs={["거래처 등록", "품목 등록"]} sourceChrome />}
        header={
          <div className="flex h-full flex-col">
            <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
              <h1 className="text-[18px] font-bold leading-[1.5] text-mes-gray-130">판매관리 리스트</h1>
              <div className="flex items-center gap-2.5">
                <QueryDateRange start={start} end={end} onStartChange={setStart} onEndChange={setEnd} />
                <Button size="small">조회</Button>
                <Button size="small" variant="lineBlacktxt" startIcon={<IconSetting size={16} />}>설정</Button>
              </div>
            </div>
            <SalesQueryToolbar />
          </div>
        }
        table={
          <Table
            columns={mainColumns}
            groups={customerGroups}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            selectionColor="black"
            unselectedCheckboxAppearance="grayCheck"
            edgePadding={20}
            selectionColumnWidth={36}
            centerSelection
            headerBackground="white"
            columnDividerMode="none"
            horizontalScroll={false}
            showMasterGroupToggles={false}
            className="h-[330px] rounded-none border-0"
          />
        }
        footer={
          <>
            <div className="flex gap-2">
              <Button size="small" variant="lineBlacktxt" startIcon={<IconCopy size={16} />}>복사</Button>
              <Button size="small" variant="lineBlacktxt" startIcon={<IconDownload size={16} />}>다운로드</Button>
            </div>
            <div data-testid="sales-footer-actions" className="flex gap-2">
              <Button size="small" variant="fillBlack" className="w-40" onClick={() => setModalOpen(true)}>거래명세서 출력</Button>
              <Button size="small" variant="fillBlack" className="w-40" onClick={() => setBulkApprovalOpen(true)}>일괄 출하승인</Button>
              <Button size="small" variant="fillMain" className="w-40 bg-mes-primary-70 hover:bg-mes-primary-70" startIcon={<IconPlus size={16} />}>청구 등록</Button>
            </div>
          </>
        }
      />
      <TransactionStatementModal open={modalOpen} onOpenChange={setModalOpen} />
      <BulkShipmentApprovalModal open={bulkApprovalOpen} onOpenChange={setBulkApprovalOpen} />
    </div>
  );
}

export { SalesTransactionStatementScreen, TransactionStatementModal };
