"use client";

import * as React from "react";
import { Plus, Search, Settings2 } from "lucide-react";
import { FigmaScreenPreview } from "./figma-screen-preview";
import { MesFixtureSidebar, MesPageTabs, SmallButton } from "./mes-screen-fixtures";
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

  return (
    <FigmaScreenPreview>
      <div className="relative flex h-[960px] w-[1920px] overflow-hidden bg-white text-mes-gray-130">
        <MesFixtureSidebar />
        <main className="relative min-w-0 flex-1">
          <MesPageTabs active="출하지시 리스트" />
          <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
            <h2 className="text-[18px] font-bold">출하지시 리스트</h2>
            <div className="flex items-center gap-2">
              <SmallButton><Search size={15} />조회</SmallButton>
              <SmallButton tone="main"><Plus size={15} />출하지시 등록</SmallButton>
              <button type="button" aria-label="테이블 컬럼 설정" className="flex size-8 items-center justify-center rounded-[4px] border border-mes-gray-30 bg-white">
                <Settings2 size={16} />
              </button>
            </div>
          </div>
          <div className="h-12 border-b border-mes-gray-30 bg-mes-gray-10 px-5 py-2">
            <div className="flex h-8 w-[560px] items-center rounded-[4px] border border-mes-gray-30 bg-white px-3 text-[14px] text-mes-gray-70">조회기간&nbsp;&nbsp;&nbsp; 2025.03.01&nbsp;&nbsp;~&nbsp;&nbsp;2025.03.31</div>
          </div>
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead><tr className="h-[30px] border-b border-mes-gray-30"><th className="w-12">No.</th><th>출하지시일</th><th>출하지시번호</th><th>거래처</th><th>품목</th><th>수량</th><th>상태</th></tr></thead>
            <tbody>{ROWS.map((row, index) => <tr key={row.number} className="h-[30px] border-b border-mes-gray-30 text-center"><td>{index + 1}</td><td>{row.date}</td><td>{row.number}</td><td>{row.customer}</td><td>{row.item}</td><td>{row.quantity.toLocaleString()}</td><td><span className="rounded-sm bg-mes-primary-20 px-2 py-0.5 text-mes-primary-70">출하대기</span></td></tr>)}</tbody>
          </table>
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
