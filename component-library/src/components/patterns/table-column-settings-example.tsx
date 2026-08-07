"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { IconGrid, IconPlus, IconSearch } from "@/components/icons";
import { FigmaScreenPreview } from "./figma-screen-preview";
import { FixtureDateRange, FixtureTable, MesFixtureSidebar, MesPageTabs } from "./mes-screen-fixtures";
import { TableColumnSettings, type TableColumnSettingItem } from "./table-column-settings";

const INITIAL_COLUMNS: TableColumnSettingItem[] = [
  { id: "quantity", label: "수량", visible: true, summarized: true },
  { id: "material", label: "재질", visible: true, summarized: false },
  { id: "standard", label: "표준사용", visible: true, summarized: true },
  { id: "actual", label: "실 사용금액", visible: false, summarized: false },
  { id: "item", label: "품목", visible: true, summarized: false, grouped: true },
  { id: "date", label: "생산일자", visible: false, summarized: false, grouped: true },
];

const ROWS = Array.from({ length: 14 }, (_, index) => ({
  date: `2025.03.${String(30 - Math.floor(index / 5)).padStart(2, "0")}`,
  number: `SO-250330-${String(index + 1).padStart(3, "0")}`,
  customer: ["부산정공", "동아산업", "한빛테크", "제일메탈"][index % 4],
  item: ["Aluminum Plate", "Steel Bracket", "Housing Cover", "Shaft Unit"][index % 4],
  quantity: [1250, 800, 300, 1450][index % 4],
}));

function CompletedColumnSettingsExample() {
  const [columns, setColumns] = React.useState(INITIAL_COLUMNS);
  const tableRows = ROWS.map((row, index) => [
    index + 1,
    row.date,
    row.number,
    row.customer,
    row.item,
    row.quantity.toLocaleString(),
    <Badge key={row.number} variant="blueLight">출하대기</Badge>,
  ]);

  return (
    <FigmaScreenPreview>
      <div className="relative flex h-[960px] w-[1920px] overflow-hidden bg-white text-mes-gray-130">
        <MesFixtureSidebar />
        <main className="relative min-w-0 flex-1">
          <MesPageTabs active="출하지시 리스트" />
          <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
            <h2 className="text-[18px] font-bold">출하지시 리스트</h2>
            <div className="flex items-center gap-2">
              <Button size="small" variant="lineBlacktxt" startIcon={<IconSearch size={15} />}>조회</Button>
              <Button size="small" startIcon={<IconPlus size={15} />}>출하지시 등록</Button>
              <IconButton aria-label="테이블 컬럼 설정" variant="lineBlacktxt" icon={<IconGrid size={16} />} />
            </div>
          </div>
          <div className="h-12 border-b border-mes-gray-30 bg-mes-gray-10 px-5 py-2">
            <FixtureDateRange label="조회기간" />
          </div>
          <FixtureTable selectable={false} headers={["No.", "출하지시일", "출하지시번호", "거래처", "품목", "수량", "상태"]} rows={tableRows} />
        </main>
        <div className="absolute inset-0 bg-black/10" />
        <TableColumnSettings
          columns={columns}
          onColumnsChange={setColumns}
          onReset={() => setColumns(INITIAL_COLUMNS)}
          className="absolute left-[1440px] top-[84px]"
        />
      </div>
    </FigmaScreenPreview>
  );
}

export { CompletedColumnSettingsExample };
