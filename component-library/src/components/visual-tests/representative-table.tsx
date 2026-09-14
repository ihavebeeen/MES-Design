"use client";

import * as React from "react";
import { Table, type TableColumn, type TableGroup } from "@/components/ui/table";

interface VisualTableRow {
  instructionDate: string;
  equipment: string;
  item: string;
  unit: string;
  quantity: number;
}

const columns: TableColumn<VisualTableRow>[] = [
  { key: "instructionDate", label: "지시일", width: 140, align: "center" },
  { key: "equipment", label: "설비", width: 110, align: "center" },
  { key: "item", label: "품목", width: { min: 260, grow: 1 }, render: (row) => row.item },
  { key: "unit", label: "단위", width: 90, align: "center" },
  { key: "quantity", label: "지시수량", width: 140, align: "right", render: (row) => row.quantity.toLocaleString("ko-KR") },
];

const groups: TableGroup<VisualTableRow>[] = [
  {
    id: "date-2025-10-30",
    label: "2025-10-30",
    summary: { quantity: "5,000" },
    groups: [
      {
        id: "equipment-a1",
        label: "A1",
        summary: { quantity: "3,000" },
        rows: [
          { id: "row-1", data: { instructionDate: "2025-10-30", equipment: "A1", item: "비비빅", unit: "EA", quantity: 2000 } },
          { id: "row-2", isNew: true, data: { instructionDate: "2025-10-30", equipment: "A1", item: "찰옥수수", unit: "EA", quantity: 1000 } },
        ],
      },
      {
        id: "equipment-a2",
        label: "A2",
        summary: { quantity: "2,000" },
        rows: [
          { id: "row-3", data: { instructionDate: "2025-10-30", equipment: "A2", item: "수박바", unit: "EA", quantity: 2000 } },
        ],
      },
    ],
  },
];

export function RepresentativeTable() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>(["row-1"]);

  return (
    <section data-visual-test="table" className="w-[1160px] bg-white p-8">
      <div className="mb-4">
        <h1 className="text-[18px] font-bold text-mes-gray-130">생산계획 그룹 테이블</h1>
        <p className="mt-1 text-[13px] text-mes-gray-80">전체·부분선택, 그룹 2단, 신규 행, 총계 상태 기준</p>
      </div>
      <Table
        columns={columns}
        groups={groups}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        selectionColor="black"
        unselectedCheckboxAppearance="grayCheck"
        totals={{ quantity: "5,000" }}
        horizontalScroll={false}
      />
    </section>
  );
}

interface StateRow {
  state: string;
  item: string;
  quantity: number;
}

const stateColumns: TableColumn<StateRow>[] = [
  { key: "state", label: "상태", width: 120 },
  { key: "item", label: "품목", width: { min: 220, grow: 1 } },
  { key: "quantity", label: "수량", width: 100, align: "right", render: (row) => row.quantity.toLocaleString("ko-KR") },
];

const noop = () => {};

export function RepresentativeTableStates() {
  return (
    <section data-visual-test="table-states" className="w-[1160px] bg-white p-8">
      <div className="mb-4">
        <h1 className="text-[18px] font-bold text-mes-gray-130">Table 상태 비교</h1>
        <p className="mt-1 text-[13px] text-mes-gray-80">Figma Table 상태표의 hover·active·부분 비활성·전체 비활성 기준</p>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-mes-gray-80">기본 · hover</span>
          <Table
            columns={stateColumns}
            rows={[{ id: "hover-row", data: { state: "기본", item: "비비빅", quantity: 1200 } }]}
            selectedIds={[]}
            onSelectedIdsChange={noop}
            onActiveIdChange={noop}
            horizontalScroll={false}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-mes-gray-80">active · type 1</span>
          <Table
            columns={stateColumns}
            rows={[{ id: "active-subtle", data: { state: "활성", item: "찰옥수수", quantity: 980 } }]}
            selectedIds={["active-subtle"]}
            activeId="active-subtle"
            onSelectedIdsChange={noop}
            onActiveIdChange={noop}
            horizontalScroll={false}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-mes-gray-80">active · type 2</span>
          <Table
            columns={stateColumns}
            rows={[{ id: "active-solid", data: { state: "활성", item: "수박바", quantity: 2000 } }]}
            selectedIds={["active-solid"]}
            activeId="active-solid"
            activeRowAppearance="solid"
            onSelectedIdsChange={noop}
            onActiveIdChange={noop}
            horizontalScroll={false}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-mes-gray-80">일부 셀 · 행 전체 비활성</span>
          <Table
            columns={stateColumns}
            rows={[
              { id: "partial-disabled", data: { state: "부분 비활성", item: "더블비안코", quantity: 1500 }, disabledColumnKeys: ["state", "item"] },
              { id: "row-disabled", data: { state: "행 비활성", item: "누가바", quantity: 800 }, disabled: true },
            ]}
            selectedIds={[]}
            onSelectedIdsChange={noop}
            onActiveIdChange={noop}
            horizontalScroll={false}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-mes-gray-80">표 전체 비활성</span>
          <Table
            columns={stateColumns}
            rows={[{ id: "table-disabled-row", data: { state: "전체 비활성", item: "메로나", quantity: 1100 } }]}
            selectedIds={["table-disabled-row"]}
            onSelectedIdsChange={noop}
            onActiveIdChange={noop}
            disabled
            horizontalScroll={false}
          />
        </div>
      </div>
    </section>
  );
}
