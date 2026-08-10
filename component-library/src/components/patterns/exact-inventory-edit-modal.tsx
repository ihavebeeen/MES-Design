"use client";

import * as React from "react";
import { Filter } from "@/components/ui/filter";
import { SearchInput } from "@/components/ui/search-input";
import { SelectionActionBar } from "@/components/ui/selection-action-bar";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

interface InventoryEditRow {
  id: string;
  item: string;
  itemType: string;
  quantity: number;
  unit: string;
  packEntry: number;
  packQuantity: number;
  packUnit: string;
  lotNo: string;
  warehouse: string;
  source: string;
  equipment: string;
}

const ROWS: InventoryEditRow[] = Array.from({ length: 15 }, (_, index) => ({
  id: `inventory-${index + 1}`,
  item: "빠삐코",
  itemType: "완제품",
  quantity: 1000,
  unit: "kg",
  packEntry: 100,
  packQuantity: 10,
  packUnit: "BOX",
  lotNo: "A0401-123-123",
  warehouse: "B창고",
  source: "생산",
  equipment: "성형기1",
}));

const COLUMNS: TableColumn<InventoryEditRow>[] = [
  { key: "item", label: "품목", width: 109, align: "center", render: (row) => row.item },
  { key: "itemType", label: "품목구분", width: 109, align: "center", render: (row) => row.itemType },
  { key: "quantity", label: "수량", width: 109, align: "right", render: (row) => row.quantity.toLocaleString("ko-KR") },
  { key: "unit", label: "단위", width: 109, render: (row) => row.unit },
  { key: "packEntry", label: "입상수", width: 109, align: "right", render: (row) => row.packEntry },
  { key: "packQuantity", label: "포장수량", width: 109, align: "right", render: (row) => row.packQuantity },
  { key: "packUnit", label: "포장단위", width: 109, render: (row) => row.packUnit },
  { key: "lotNo", label: "LOT NO", width: 108, align: "center", render: (row) => row.lotNo },
  { key: "warehouse", label: "창고명", width: 109, align: "center", render: (row) => row.warehouse },
  { key: "source", label: "생산/입고", width: 109, align: "center", render: (row) => row.source },
  { key: "equipment", label: "설비/거래처", width: 109, align: "center", render: (row) => row.equipment },
];

const FILTER_CATEGORIES = [{ id: "warehouse", label: "창고명", options: [{ id: "b", label: "B창고" }] }];

function ExactInventoryEditContent({ onDelete, onMove }: { onDelete: () => void; onMove: () => void }) {
  const [selectedIds, setSelectedIds] = React.useState(ROWS.slice(0, 5).map((row) => row.id));
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const visibleRows: TableRowData<InventoryEditRow>[] = ROWS
    .filter((row) => !search.trim() || `${row.item} ${row.lotNo}`.toLowerCase().includes(search.trim().toLowerCase()))
    .map((row) => ({ id: row.id, data: row }));

  return (
    <div className="relative h-[622px] w-full">
      <div className="flex h-10 items-center px-5 pt-4 text-[16px] font-bold">재고 리스트</div>
      <div className="absolute left-5 right-5 top-14 flex h-12 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3">
        <Filter categories={FILTER_CATEGORIES} value={filters} onChange={(categoryId, optionIds) => setFilters((current) => ({ ...current, [categoryId]: optionIds }))} showActiveTags={false} />
        <SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" />
      </div>
      <div className="absolute left-5 right-5 top-36 h-[480px]">
        <Table
          columns={COLUMNS}
          rows={visibleRows}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          selectionColor="black"
          unselectedCheckboxAppearance="grayCheck"
          selectionHeaderIndeterminate={false}
          edgePadding={0}
          selectionColumnWidth={56}
          centerSelection
          columnDividers={false}
          horizontalScroll={false}
          className="h-[480px]"
        />
      </div>
      <SelectionActionBar
        selectedCount={selectedIds.length}
        onDelete={onDelete}
        onMove={onMove}
        onClear={() => setSelectedIds([])}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      />
    </div>
  );
}

export { ExactInventoryEditContent };
