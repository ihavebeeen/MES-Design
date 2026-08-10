"use client";

import * as React from "react";
import { IconReload } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Filter } from "@/components/ui/filter";
import { Input } from "@/components/ui/input";
import { LabeledSelect } from "@/components/ui/labeled-select";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

interface InventoryItem {
  code: string;
  name: string;
  type: string;
  unit: string;
  currentQuantity: number;
}

const INVENTORY_ITEMS: InventoryItem[] = [
  { code: "P0011", name: "비닐봉투", type: "원자재", unit: "ea", currentQuantity: 0 },
  { code: "P0012", name: "비닐 125*125", type: "원자재", unit: "ea", currentQuantity: 0 },
  { code: "P0013", name: "비닐 75*75", type: "원자재", unit: "ea", currentQuantity: 0 },
  { code: "P0014", name: "비닐 (청) 125*125", type: "원자재", unit: "ea", currentQuantity: 0 },
  { code: "P0015", name: "비닐봉투 150*150", type: "원자재", unit: "ea", currentQuantity: 0 },
  { code: "P0001", name: "1500얼려먹는트레이", type: "완제품", unit: "kg", currentQuantity: 1000 },
  { code: "P0002", name: "1500얼려먹는트레이-SHEET", type: "완제품", unit: "kg", currentQuantity: 1000 },
  { code: "P0003", name: "1500얼려먹는트레이", type: "완제품", unit: "kg", currentQuantity: 1000 },
  { code: "P0004", name: "1500얼려먹는트레이", type: "완제품", unit: "kg", currentQuantity: 1000 },
  { code: "P0005", name: "1500얼려먹는트레이", type: "완제품", unit: "kg", currentQuantity: 1000 },
  { code: "P0006", name: "1500얼려먹는트레이", type: "완제품", unit: "kg", currentQuantity: 1000 },
  { code: "P0007", name: "1500얼려먹는트레이", type: "완제품", unit: "kg", currentQuantity: 1000 },
];

const FILTER_CATEGORIES = [
  { id: "itemType", label: "품목구분", options: [
    { id: "material", label: "원자재" },
    { id: "finished", label: "완제품" },
  ] },
];

function ExactInventoryAddContent() {
  const [selectedIds, setSelectedIds] = React.useState(["P0011", "P0012", "P0013", "P0014", "P0015"]);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const [bulkDate, setBulkDate] = React.useState("2025-10-30");
  const [bulkWarehouse, setBulkWarehouse] = React.useState("선택");
  const [dates, setDates] = React.useState<Record<string, Date>>(() => Object.fromEntries(INVENTORY_ITEMS.map((item) => [item.code, new Date(2026, 5, 1)])));
  const [quantities, setQuantities] = React.useState<Record<string, string>>(() => Object.fromEntries(INVENTORY_ITEMS.map((item, index) => [item.code, `${(index + 1) * 1000000}`])));
  const [warehouses, setWarehouses] = React.useState<Record<string, string>>(() => Object.fromEntries(INVENTORY_ITEMS.map((item) => [item.code, "입고기본창고"])));
  const [notes, setNotes] = React.useState<Record<string, string>>({ P0011: "재고 추가함", P0012: "재고 추가함" });

  const visibleItems = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const allowedTypes = filters.itemType ?? [];
    return INVENTORY_ITEMS
      .filter((item) => !query || `${item.code} ${item.name}`.toLowerCase().includes(query))
      .filter((item) => allowedTypes.length === 0 || allowedTypes.includes(item.type === "원자재" ? "material" : "finished"))
      .sort((a, b) => Number(selectedIds.includes(b.code)) - Number(selectedIds.includes(a.code)));
  }, [filters, search, selectedIds]);

  const columns: TableColumn<InventoryItem>[] = [
    { key: "code", label: "품목코드", width: 100, render: (item) => item.code },
    { key: "name", label: "품목", width: 190, render: (item) => item.name },
    { key: "type", label: "품목구분", width: 120, render: (item) => item.type },
    { key: "unit", label: "단위", width: 60, align: "center", render: (item) => item.unit },
    { key: "currentQuantity", label: "현재 수량", width: 140, align: "right", render: (item) => item.currentQuantity.toLocaleString("ko-KR") },
    { key: "date", label: "추가 입고일", width: 145, render: (item) => selectedIds.includes(item.code) ? (
      <DatePicker
        value={dates[item.code]}
        onValueChange={(date) => setDates((current) => ({ ...current, [item.code]: date }))}
        separator="-"
        size="small"
        iconColor="default"
        className="w-full"
      />
    ) : null },
    { key: "quantity", label: "추가 수량", width: 145, align: "right", render: (item) => selectedIds.includes(item.code) ? (
      <Input
        size="small"
        inputMode="numeric"
        value={Number(quantities[item.code] || 0).toLocaleString("ko-KR")}
        onChange={(event) => setQuantities((current) => ({ ...current, [item.code]: event.target.value.replace(/[^0-9]/g, "") }))}
        className="text-right"
        aria-label={`${item.code} 추가 수량`}
      />
    ) : null },
    { key: "warehouse", label: "창고", width: 145, render: (item) => selectedIds.includes(item.code) ? (
      <Select value={warehouses[item.code]} onValueChange={(value) => setWarehouses((current) => ({ ...current, [item.code]: value }))}>
        <SelectTrigger size="small" aria-label={`${item.code} 창고`}><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="입고기본창고">입고기본창고</SelectItem><SelectItem value="B창고">B창고</SelectItem></SelectContent>
      </Select>
    ) : null },
    { key: "note", label: "비고", width: 145, render: (item) => selectedIds.includes(item.code) ? (
      <Input
        size="small"
        value={notes[item.code] ?? ""}
        placeholder="내용 입력"
        onChange={(event) => setNotes((current) => ({ ...current, [item.code]: event.target.value }))}
        aria-label={`${item.code} 비고`}
      />
    ) : null },
  ];

  const rows: TableRowData<InventoryItem>[] = visibleItems.map((item) => ({ id: item.code, data: item }));

  const applyBulkValues = () => {
    if (bulkDate === "2025-10-30") {
      setDates((current) => Object.fromEntries(Object.entries(current).map(([key, value]) => [key, selectedIds.includes(key) ? new Date(2025, 9, 30) : value])));
    }
    if (bulkWarehouse !== "선택") {
      setWarehouses((current) => ({ ...current, ...Object.fromEntries(selectedIds.map((id) => [id, bulkWarehouse])) }));
    }
  };

  return (
    <div className="flex h-[510px] w-full flex-col gap-[10px]">
      <div className="flex h-12 shrink-0 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3">
        <Filter
          categories={FILTER_CATEGORIES}
          value={filters}
          onChange={(categoryId, optionIds) => setFilters((current) => ({ ...current, [categoryId]: optionIds }))}
          showActiveTags={false}
        />
        <SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" />
      </div>

      <div className="flex h-[52px] shrink-0 items-center bg-mes-gray-20 pl-10 pr-[10px]">
        <div className="flex items-center gap-2 text-[15px] font-semibold"><IconReload size={18} />일괄 변경</div>
        <div className="ml-auto flex items-center gap-[10px]">
          <LabeledSelect label="추가 입고일" value={bulkDate} options={["2025-10-30", "2025-10-31"]} onValueChange={setBulkDate} className="w-[220px]" />
          <LabeledSelect label="추가 창고" value={bulkWarehouse} options={["선택", "입고기본창고", "B창고"]} onValueChange={setBulkWarehouse} className="w-[180px]" />
          <Button size="small" className="w-[60px] px-0" onClick={applyBulkValues}>적용</Button>
        </div>
      </div>

      <Table
        columns={columns}
        rows={rows}
        selectedIds={selectedIds.filter((id) => rows.some((row) => row.id === id))}
        onSelectedIdsChange={(ids) => setSelectedIds((current) => [...current.filter((id) => !rows.some((row) => row.id === id)), ...ids])}
        selectionColor="black"
        unselectedCheckboxAppearance="grayCheck"
        selectionHeaderIndeterminate={false}
        edgePadding={0}
        selectionColumnWidth={50}
        centerSelection
        columnDividers={false}
        horizontalScroll={false}
        className="h-[390px] shrink-0"
      />
    </div>
  );
}

export { ExactInventoryAddContent };
