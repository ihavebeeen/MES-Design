"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { Filter } from "@/components/ui/filter";
import { Link } from "@/components/ui/link";
import { QueryDateRange } from "@/components/ui/query-date-range";
import { Radio } from "@/components/ui/radio";
import { SearchInput } from "@/components/ui/search-input";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

type ApprovalStatus = "pending" | "approved" | "recalled";

interface ShipmentApprovalRow {
  shipmentDate: string;
  customer: string;
  itemCount: string;
  orderedQuantity: string;
  shippedQuantity: string;
  market: string;
  currency: string;
  foreignAmount: string;
  localAmount: string;
}

interface ShipmentItemRow {
  shipmentDate: string;
  customer: string;
  item: string;
  itemType: string;
  unit: string;
  orderedQuantity: string;
  shippedQuantity: string;
}

const shipmentApprovalRows: TableRowData<ShipmentApprovalRow>[] = [
  { id: "approval-1", data: { shipmentDate: "2025-10-10", customer: "대한항공", itemCount: "3건", orderedQuantity: "1,000", shippedQuantity: "999", market: "내수", currency: "KRW", foreignAmount: "-", localAmount: "1,000" } },
  { id: "approval-2", data: { shipmentDate: "2025-10-10", customer: "롯데", itemCount: "3건", orderedQuantity: "2,000", shippedQuantity: "1,992", market: "수출", currency: "USD", foreignAmount: "50,000", localAmount: "-" } },
  { id: "approval-3", data: { shipmentDate: "2025-10-10", customer: "롯데", itemCount: "3건", orderedQuantity: "2,000", shippedQuantity: "1,992", market: "수출", currency: "USD", foreignAmount: "50,000", localAmount: "-" } },
];

const shipmentItemRows: TableRowData<ShipmentItemRow>[] = [
  { id: "shipment-item-1", data: { shipmentDate: "2025-10-10", customer: "대한항공", item: "5318 PLATE", itemType: "반제품", unit: "kg", orderedQuantity: "1,000", shippedQuantity: "1,000" } },
  { id: "shipment-item-2", data: { shipmentDate: "2025-10-10", customer: "대한항공", item: "5320 BOWL", itemType: "반제품", unit: "kg", orderedQuantity: "1,000", shippedQuantity: "1,000" } },
  { id: "shipment-item-3", data: { shipmentDate: "2025-10-10", customer: "대한항공", item: "빌박스", itemType: "반제품", unit: "kg", orderedQuantity: "1,000", shippedQuantity: "1,000" } },
];

const flexibleColumn = { min: 0, grow: 1 } as const;

const shipmentItemColumns: TableColumn<ShipmentItemRow>[] = [
  { key: "shipmentDate", label: "출하일", width: flexibleColumn, align: "center", render: (row) => row.shipmentDate },
  { key: "customer", label: "거래처명", width: flexibleColumn, align: "center", render: (row) => row.customer },
  { key: "item", label: "품목", width: flexibleColumn, align: "center", render: (row) => row.item },
  { key: "itemType", label: "품목구분", width: flexibleColumn, align: "center", render: (row) => row.itemType },
  { key: "unit", label: "단위", width: flexibleColumn, align: "center", render: (row) => row.unit },
  { key: "orderedQuantity", label: "출하지시수량", width: flexibleColumn, align: "right", render: (row) => row.orderedQuantity },
  { key: "shippedQuantity", label: "출하실적수량", width: flexibleColumn, align: "right", render: (row) => row.shippedQuantity },
];

function ApprovalStatusBar({ value, onChange }: { value: ApprovalStatus; onChange: (value: ApprovalStatus) => void }) {
  const options: { value: ApprovalStatus; label: string }[] = [
    { value: "pending", label: "승인대기" },
    { value: "approved", label: "승인" },
    { value: "recalled", label: "회수" },
  ];

  return (
    <fieldset data-testid="shipment-approval-status" className="flex h-14 w-full shrink-0 items-center justify-center rounded-mes-control bg-mes-gray-20">
      <legend className="sr-only">출하승인 상태</legend>
      <div className="flex w-[294px] items-center justify-between">
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-1.5 text-[14px] leading-[1.5] text-mes-gray-130">
            <Radio name="shipment-approval-status" checked={value === option.value} onChange={() => onChange(option.value)} />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface ShipmentItemDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ShipmentItemDetailModal({ open, onOpenChange }: ShipmentItemDetailModalProps) {
  return (
    <CenterModal
      open={open}
      onOpenChange={onOpenChange}
      title="출하승인"
      exactWidth={670}
      exactHeight={568}
      maxHeight={568}
      bodyPadding="standard"
      bodyAlign="stretch"
      scrollMode="content"
      actions={[{ id: "close", label: "닫기", variant: "fillBlack", onClick: () => onOpenChange(false) }]}
    >
      <section className="flex min-h-0 flex-1 flex-col gap-3" data-testid="shipment-item-detail-body">
        <h2 className="h-6 shrink-0 text-[16px] font-bold leading-6 text-mes-gray-130">출하실적 품목 리스트</h2>
        <Table
          columns={shipmentItemColumns}
          rows={shipmentItemRows}
          selectable={false}
          edgePadding={0}
          headerBackground="white"
          columnDividerMode="none"
          horizontalScroll={false}
          className="min-h-0 flex-1"
        />
      </section>
    </CenterModal>
  );
}

interface BulkShipmentApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function BulkShipmentApprovalModal({ open, onOpenChange }: BulkShipmentApprovalModalProps) {
  const initialSelectedIds = React.useMemo(() => ["approval-1", "approval-2"], []);
  const [committedSelectedIds, setCommittedSelectedIds] = React.useState(initialSelectedIds);
  const [draftSelectedIds, setDraftSelectedIds] = React.useState(initialSelectedIds);
  const [committedStatus, setCommittedStatus] = React.useState<ApprovalStatus>("pending");
  const [draftStatus, setDraftStatus] = React.useState<ApprovalStatus>("pending");
  const [start, setStart] = React.useState<Date | null>(new Date(2025, 9, 24));
  const [end, setEnd] = React.useState<Date | null>(new Date(2025, 9, 30));
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string[]>>({ market: [] });
  const [detailOpen, setDetailOpen] = React.useState(false);

  const dismiss = React.useCallback(() => {
    setDraftSelectedIds(committedSelectedIds);
    setDraftStatus(committedStatus);
    setSearch("");
    setFilters({ market: [] });
  }, [committedSelectedIds, committedStatus]);

  const confirm = () => {
    setCommittedSelectedIds(draftSelectedIds);
    setCommittedStatus(draftStatus);
    onOpenChange(false);
  };

  const visibleRows = shipmentApprovalRows.filter((row) => {
    const queryMatch = Object.values(row.data).some((value) => value.toLowerCase().includes(search.trim().toLowerCase()));
    const marketFilter = filters.market ?? [];
    return queryMatch && (marketFilter.length === 0 || marketFilter.includes(row.data.market));
  });

  const columns = React.useMemo<TableColumn<ShipmentApprovalRow>[]>(() => [
    { key: "shipmentDate", label: "출하일", width: flexibleColumn, align: "center", render: (row) => row.shipmentDate },
    { key: "customer", label: "거래처", width: flexibleColumn, align: "center", render: (row) => row.customer },
    {
      key: "itemCount",
      label: "품목",
      width: flexibleColumn,
      align: "center",
      render: (row) => (
        <Link
          href="#shipment-item-detail"
          className="text-[14px] font-normal no-underline"
          onClick={(event) => { event.preventDefault(); setDetailOpen(true); }}
        >
          {row.itemCount}
        </Link>
      ),
    },
    { key: "orderedQuantity", label: "출하지시수량", width: flexibleColumn, align: "right", render: (row) => row.orderedQuantity },
    { key: "shippedQuantity", label: "출하실적수량", width: flexibleColumn, align: "right", render: (row) => row.shippedQuantity },
    { key: "market", label: "내수/수출", width: flexibleColumn, align: "center", render: (row) => row.market },
    { key: "currency", label: "통화", width: flexibleColumn, align: "center", render: (row) => row.currency },
    { key: "foreignAmount", label: "외화판매금액", width: flexibleColumn, align: "right", render: (row) => row.foreignAmount },
    { key: "localAmount", label: "원화판매금액", width: flexibleColumn, align: "right", render: (row) => row.localAmount },
  ], []);

  return (
    <>
      <CenterModal
        open={open}
        onOpenChange={onOpenChange}
        onCancel={dismiss}
        onConfirm={confirm}
        title="일괄 출하승인"
        confirmLabel="저장"
        exactWidth={960}
        exactHeight={680}
        maxHeight={680}
        bodyPadding="standard"
        bodyAlign="stretch"
        scrollMode="content"
      >
        <section className="flex min-h-0 flex-1 flex-col" data-testid="bulk-shipment-approval-body">
          <div className="flex h-8 shrink-0 items-center justify-between">
            <h2 className="text-[16px] font-bold leading-6 text-mes-gray-130">승인 대기 리스트</h2>
            <div className="flex items-center gap-2.5">
              <QueryDateRange label="일자" start={start} end={end} onStartChange={setStart} onEndChange={setEnd} />
              <Button size="small" className="w-[50px]">조회</Button>
            </div>
          </div>

          <div data-testid="shipment-approval-toolbar" className="mt-3 flex h-12 shrink-0 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3">
            <Filter
              categories={[{ id: "market", label: "내수/수출", options: [{ id: "내수", label: "내수" }, { id: "수출", label: "수출" }] }]}
              value={filters}
              onChange={(id, values) => setFilters((current) => ({ ...current, [id]: values }))}
              showActiveTags={false}
            />
            <SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" />
          </div>

          <Table
            columns={columns}
            rows={visibleRows}
            selectedIds={draftSelectedIds}
            onSelectedIdsChange={setDraftSelectedIds}
            selectionColor="black"
            unselectedCheckboxAppearance="grayCheck"
            selectionHeaderIndeterminate={false}
            edgePadding={0}
            selectionColumnWidth={40}
            centerSelection
            headerBackground="white"
            columnDividerMode="none"
            horizontalScroll={false}
            className="mt-3 h-[356px] shrink-0"
          />

          <div className="mt-auto">
            <ApprovalStatusBar value={draftStatus} onChange={setDraftStatus} />
          </div>
        </section>
      </CenterModal>
      <ShipmentItemDetailModal open={detailOpen} onOpenChange={setDetailOpen} />
    </>
  );
}

function ShipmentApprovalVisualFixture() {
  const [bulkOpen, setBulkOpen] = React.useState(true);
  const [detailOpen, setDetailOpen] = React.useState(false);

  return (
    <main data-shipment-approval-fixture className="relative h-[900px] w-[1440px] bg-white">
      <Button className="absolute left-5 top-5 opacity-0" size="small" variant="fillBlack" onClick={() => setBulkOpen(true)}>일괄 출하승인 열기</Button>
      <Button className="absolute left-40 top-5 opacity-0" size="small" variant="lineBlacktxt" onClick={() => setDetailOpen(true)}>품목 상세 열기</Button>
      <BulkShipmentApprovalModal open={bulkOpen} onOpenChange={setBulkOpen} />
      <ShipmentItemDetailModal open={detailOpen} onOpenChange={setDetailOpen} />
    </main>
  );
}

export { BulkShipmentApprovalModal, ShipmentApprovalVisualFixture, ShipmentItemDetailModal };
