"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "@/components/ui/filter";
import { Link } from "@/components/ui/link";
import { Progress } from "@/components/ui/progress";
import { QueryDateRange } from "@/components/ui/query-date-range";
import { SearchInput } from "@/components/ui/search-input";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

type PurchaseStatus = "완료" | "진행중" | "대기";
interface PurchaseRow { id: string; date: string; vendor: string; items: number; rate: number; status: PurchaseStatus; }
interface PurchaseItemRow { id: string; item: string; itemType: string; rate: number; status: PurchaseStatus; }

const PURCHASE_ROWS: PurchaseRow[] = [
  { id: "purchase-1", date: "2024-08-30", vendor: "A업체", items: 9, rate: 100, status: "완료" },
  { id: "purchase-2", date: "2024-08-30", vendor: "B업체", items: 8, rate: 60.4, status: "진행중" },
  { id: "purchase-3", date: "2024-08-30", vendor: "A업체", items: 9, rate: 100, status: "완료" },
  { id: "purchase-4", date: "2024-08-30", vendor: "A업체", items: 9, rate: 0, status: "대기" },
  { id: "purchase-5", date: "2024-08-30", vendor: "B업체", items: 8, rate: 60.4, status: "진행중" },
];
const ITEM_ROWS: PurchaseItemRow[] = Array.from({ length: 7 }, (_, index) => ({
  id: `purchase-item-${index + 1}`,
  item: "1500얼려먹는트레이",
  itemType: "완제품",
  rate: index < 5 ? 100 : index === 5 ? 50 : 0,
  status: index < 5 ? "완료" : index === 5 ? "진행중" : "대기",
}));

const FILTER_CATEGORIES = [{ id: "status", label: "상태", options: [{ id: "done", label: "완료" }, { id: "progress", label: "진행중" }, { id: "wait", label: "대기" }] }];

function StatusBadge({ status }: { status: PurchaseStatus }) {
  return <Badge variant={status === "진행중" ? "blue" : status === "대기" ? "amber" : "gray"} className="w-[58px]">{status}</Badge>;
}

function ExactPurchaseContent({ onOpenItems }: { onOpenItems: () => void }) {
  const [start, setStart] = React.useState(new Date(2026, 2, 30));
  const [end, setEnd] = React.useState(new Date(2026, 2, 30));
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const [selectedIds, setSelectedIds] = React.useState(["purchase-1"]);
  const columns: TableColumn<PurchaseRow>[] = [
    { key: "date", label: "입고예정일", width: 160, align: "center", render: (row) => <span className={row.status === "완료" ? "" : "text-mes-danger-60"}>{row.date}</span> },
    { key: "vendor", label: "발주처", width: 135, align: "center", render: (row) => <span className={row.status === "완료" ? "" : "text-mes-danger-60"}>{row.vendor}</span> },
    { key: "items", label: "품목 [건]", width: 130, align: "center", render: (row) => <Link href="#" onClick={(event) => { event.preventDefault(); onOpenItems(); }}>{row.items}</Link> },
    { key: "rate", label: "입고율", width: 190, render: (row) => <Progress value={row.rate} labelTone={row.status === "완료" ? "default" : "danger"} className="w-[142px]" /> },
    { key: "status", label: "상태", width: 95, align: "center", render: (row) => <StatusBadge status={row.status} /> },
  ];
  const allowed = filters.status ?? [];
  const rows: TableRowData<PurchaseRow>[] = PURCHASE_ROWS
    .filter((row) => !search.trim() || `${row.date} ${row.vendor}`.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((row) => allowed.length === 0 || allowed.includes(row.status === "완료" ? "done" : row.status === "진행중" ? "progress" : "wait"))
    .map((row) => ({ id: row.id, data: row }));

  return <div className="h-[556px] w-full px-5 pt-4">
    <div className="flex h-8 items-center"><strong className="text-[16px]">발주리스트</strong><div className="ml-auto flex gap-[10px]"><QueryDateRange label="일자" start={start} end={end} onStartChange={setStart} onEndChange={setEnd} /><Button size="small" className="w-[50px] px-0">조회</Button></div></div>
    <div className="mt-3 flex h-12 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3"><Filter categories={FILTER_CATEGORIES} value={filters} onChange={(categoryId, optionIds) => setFilters((current) => ({ ...current, [categoryId]: optionIds }))} showActiveTags={false} /><SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" /></div>
    <Table columns={columns} rows={rows} selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} selectionColor="black" unselectedCheckboxAppearance="grayCheck" selectionHeaderIndeterminate={false} edgePadding={0} selectionColumnWidth={50} centerSelection columnDividers={false} horizontalScroll={false} className="mt-4 h-[432px]" />
  </div>;
}

function ExactPurchaseItemsContent() {
  const columns: TableColumn<PurchaseItemRow>[] = [
    { key: "item", label: "품목", width: 145, render: (row) => <span className={row.status === "완료" ? "" : "text-mes-danger-60"}>{row.item}</span> },
    { key: "itemType", label: "품목구분", width: 85, align: "center", render: (row) => <span className={row.status === "완료" ? "" : "text-mes-danger-60"}>{row.itemType}</span> },
    { key: "rate", label: "입고율", width: 150, render: (row) => <Progress value={row.rate} labelTone={row.status === "완료" ? "default" : "danger"} className="w-[120px]" /> },
    { key: "status", label: "상태", width: 87, align: "center", render: (row) => <StatusBadge status={row.status} /> },
  ];
  const rows: TableRowData<PurchaseItemRow>[] = ITEM_ROWS.map((row) => ({ id: row.id, data: row }));
  return <Table columns={columns} rows={rows} selectable={false} edgePadding={0} columnDividers={false} horizontalScroll={false} className="h-[240px]" />;
}

export { ExactPurchaseContent, ExactPurchaseItemsContent };
