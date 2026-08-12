"use client";

import * as React from "react";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";
import { FixtureSelect, MesFixtureSidebar, MesPageTabs } from "./mes-screen-fixtures";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const CURRENT_YEAR = [2, 4, 1, 7, 6, 3, 4, 3, 3];
const PREVIOUS_YEAR = [7, 5, 4, 12, 14, 7, 13, 5, 12, 5, 7, 4];

interface MeasurementRow {
  id: string;
  item: string;
  net: number;
  lower: number;
  upper: number;
  average: number;
  offset: number;
}

const MEASUREMENTS: MeasurementRow[] = [
  "팥빙수", "비비빅", "누가바", "햇반", "죠스바", "두부반컵", "팥빙수", "옥수수콘",
  "바밤바", "메로나", "빠삐코", "더블비안코", "햇반", "누가바",
].map((item, index) => ({
  id: `measurement-${index}`,
  item,
  net: 35,
  lower: 32.4,
  upper: 27.5,
  average: 35.5,
  offset: index * 0.1,
}));

const MEASUREMENT_COLUMNS: TableColumn<MeasurementRow>[] = [
  { key: "item", label: "품목", width: { min: 104, grow: 1 }, align: "center", render: (row) => row.item },
  { key: "net", label: "NET 중량", width: { min: 104, grow: 1 }, align: "center", render: (row) => row.net },
  { key: "lower", label: "하한값", width: { min: 104, grow: 1 }, align: "center", render: (row) => row.lower },
  { key: "upper", label: "상한값", width: { min: 104, grow: 1 }, align: "center", render: (row) => row.upper },
  { key: "average", label: "평균값", width: { min: 104, grow: 1 }, align: "center", render: (row) => row.average },
];

const TABLE_ROWS: TableRowData<MeasurementRow>[] = MEASUREMENTS.map((row) => ({ id: row.id, data: row }));

function InspectionTrendAnalysisScreen() {
  const [activeId, setActiveId] = React.useState("measurement-1");
  const [date, setDate] = React.useState("2025년 9월 1일");
  const [itemFilter, setItemFilter] = React.useState("전체");
  const activeRow = MEASUREMENTS.find((row) => row.id === activeId) ?? MEASUREMENTS[1];

  return (
    <div className="flex h-[960px] w-[1920px] overflow-hidden bg-white" data-inspection-trend-screen>
      <MesFixtureSidebar dashboard />
      <main className="flex min-w-0 flex-1 flex-col">
        <MesPageTabs active="공정검사 경향관리" />
        <div className="flex h-[42px] shrink-0 items-center border-b border-mes-gray-30 px-5">
          <strong className="text-[18px] leading-[1.5] text-mes-gray-130">경향관리</strong>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden p-5">
          <div className="grid h-[305px] grid-cols-2 gap-5">
            <MonthlyComparisonPanel title="반품 건 수" />
            <MonthlyComparisonPanel title="보류 건 수" />
          </div>

          <section className="ml-[6px] mt-5 grid h-[512px] w-[1620px] grid-cols-[652px_498px_390px] gap-5 rounded-xl border border-mes-gray-30 bg-white p-5" data-measurement-analysis-section>
            <div className="flex min-w-0 flex-col">
              <div className="flex h-8 shrink-0 items-start justify-between">
                <h2 className="text-[18px] font-bold leading-[1.5] text-mes-gray-130">공정검사 측정 데이터</h2>
                <div className="flex gap-[10px]">
                  <FixtureSelect ariaLabel="측정일" value={date} options={["2025년 9월 1일", "2025년 9월 2일"]} onValueChange={setDate} className="w-[140px]" />
                  <FixtureSelect ariaLabel="품목" value={itemFilter} options={["전체", "팥빙수", "비비빅"]} onValueChange={setItemFilter} className="w-[140px]" />
                </div>
              </div>
              <Table
                columns={MEASUREMENT_COLUMNS}
                rows={TABLE_ROWS}
                selectable={false}
                activeId={activeId}
                activeRowAppearance="solid"
                onActiveIdChange={setActiveId}
                edgePadding={0}
                columnDividers={false}
                headerBackground="white"
                horizontalScroll={false}
                className="mt-[10px] h-[430px] !rounded-none !border-0"
              />
            </div>

            <CavityHeatmap item={activeRow.item} offset={activeRow.offset} />
            <InspectionAchievementStack />
          </section>
        </div>
      </main>
    </div>
  );
}

function MonthlyComparisonPanel({ title }: { title: string }) {
  return (
    <section className="h-[305px] rounded-xl border border-mes-gray-30 bg-mes-gray-10 p-5" data-monthly-comparison-panel>
      <header className="flex h-[27px] items-center">
        <h2 className="text-[18px] font-bold leading-[1.5] text-mes-gray-80">{title}</h2>
        <div className="ml-auto flex gap-5 text-[12px] text-mes-gray-70">
          <Legend tone="primary">2025 (건)</Legend>
          <Legend tone="danger">2024 (건)</Legend>
        </div>
      </header>
      <MonthlyComparisonLineChart />
      <MonthlyComparisonTable />
    </section>
  );
}

function Legend({ tone, children }: { tone: "primary" | "danger"; children: React.ReactNode }) {
  return <span className="flex items-center gap-1"><span className={`size-2 rounded-full ${tone === "primary" ? "bg-mes-primary-60" : "bg-mes-danger-60"}`} />{children}</span>;
}

function MonthlyComparisonLineChart() {
  const x = (index: number) => 68 + index * 61.5;
  const y = (value: number) => 132 - value * 8.6;
  const currentPoints = CURRENT_YEAR.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const previousPoints = PREVIOUS_YEAR.map((value, index) => `${x(index)},${y(value)}`).join(" ");

  return (
    <svg viewBox="0 0 760 168" className="mt-[5px] h-[168px] w-full" role="img" aria-label="2025년과 2024년 월별 건수 비교 선 차트">
      {[15, 10, 5, 0].map((tick) => (
        <g key={tick}>
          <text x="14" y={y(tick) + 4} className="fill-mes-gray-70 text-[12px]">{tick}</text>
          <line x1="40" y1={y(tick)} x2="760" y2={y(tick)} className="stroke-mes-gray-30" />
        </g>
      ))}
      <polyline points={previousPoints} fill="none" className="stroke-mes-danger-60" strokeWidth="2" strokeDasharray="6 6" />
      <polyline points={currentPoints} fill="none" className="stroke-mes-primary-60" strokeWidth="2" />
      {PREVIOUS_YEAR.map((value, index) => <circle key={`previous-${index}`} cx={x(index)} cy={y(value)} r="4" className="fill-mes-danger-60" />)}
      {CURRENT_YEAR.map((value, index) => <circle key={`current-${index}`} cx={x(index)} cy={y(value)} r="4" className="fill-mes-primary-60" />)}
      {MONTHS.map((month, index) => <text key={month} x={x(index)} y="158" textAnchor="middle" className="fill-mes-gray-70 text-[12px]">{month}</text>)}
    </svg>
  );
}

function MonthlyComparisonTable() {
  return (
    <div className="grid h-[66px] grid-cols-[43px_repeat(12,minmax(0,1fr))] grid-rows-3 border-b border-r border-mes-gray-30 text-center text-[13px] leading-[22px]" data-monthly-comparison-table>
      <span className="border-l border-t border-mes-gray-30 bg-mes-gray-10" />
      {MONTHS.map((month) => <span key={`month-${month}`} className="border-l border-t border-mes-gray-30 bg-mes-primary-20 font-semibold">{month}월</span>)}
      <strong className="border-l border-t border-mes-gray-30 bg-mes-gray-10">2025</strong>
      {MONTHS.map((month, index) => <span key={`current-${month}`} className="border-l border-t border-mes-gray-30">{CURRENT_YEAR[index] ?? ""}</span>)}
      <strong className="border-l border-t border-mes-gray-30 bg-mes-gray-10">2024</strong>
      {MONTHS.map((month, index) => <span key={`previous-${month}`} className="border-l border-t border-mes-gray-30">{PREVIOUS_YEAR[index]}</span>)}
    </div>
  );
}

function CavityHeatmap({ item, offset }: { item: string; offset: number }) {
  const activeValues = [
    [35, 35, 35, 35, 35],
    [35, 35, 35, 35, 35],
    [35, 35, 35, 32.5, 35],
    [35, 35, 35, 35, 35],
    [37.5, 35, 35, 35, 35],
  ];
  const toneAt = (row: number, column: number) => {
    if (row === 4) return ["bg-mes-danger-70", "bg-mes-danger-80", "bg-mes-danger-80", "bg-mes-danger-70", "bg-mes-danger-80"][column];
    if (row === 3) return column > 0 && column < 4 ? "bg-mes-danger-60" : "bg-mes-yellow-40";
    if (row === 2 && column === 3) return "bg-mes-danger-60";
    if (column === 2 || column === 4) return "bg-mes-yellow-40";
    return "bg-mes-yellow-20";
  };

  return (
    <div className="flex min-w-0 flex-col" data-cavity-heatmap data-active-item={item}>
      <h2 className="h-8 text-[18px] font-bold leading-[1.5] text-mes-gray-130">CAVITY별 측정값</h2>
      <div className="mt-[10px] flex h-[430px] flex-col rounded-xl border border-mes-gray-30 bg-mes-gray-10 px-[28px] py-3">
        <div className="grid h-3 grid-cols-5 overflow-hidden">
          <span className="bg-mes-yellow-20" /><span className="bg-mes-yellow-40" /><span className="bg-mes-danger-40" /><span className="bg-mes-danger-60" /><span className="bg-mes-danger-70" />
        </div>
        <div className="mt-1 grid grid-cols-5 text-[11px] text-mes-gray-70">
          {[4.6, 4.8, 5.0, 5.2, 5.4].map((value) => <span key={value}>{value.toFixed(1)}</span>)}
          <span className="absolute opacity-0">5.6</span>
        </div>
        <div className="mt-3 grid min-h-0 flex-1 grid-cols-[18px_repeat(10,minmax(0,1fr))] grid-rows-[18px_repeat(10,minmax(0,1fr))] gap-1 text-center text-[12px]">
          <span />
          {MONTHS.slice(0, 10).map((column) => <span key={`column-${column}`} className="text-mes-gray-70">{column}</span>)}
          {Array.from({ length: 10 }, (_, row) => (
            <React.Fragment key={`row-${row}`}>
              <span className="flex items-center text-mes-gray-70">{row + 1}</span>
              {Array.from({ length: 10 }, (_, column) => {
                const value = activeValues[row]?.[column];
                return <span key={`${row}-${column}`} className={`flex min-h-0 items-center justify-center rounded-[2px] border border-mes-gray-30 font-semibold ${value === undefined ? "bg-white" : `${toneAt(row, column)} ${row >= 3 ? "text-white" : "text-mes-gray-130"}`}`}>{value === undefined ? "" : Number((value + offset).toFixed(1))}</span>;
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function InspectionAchievementStack() {
  return (
    <aside className="flex h-full flex-col justify-between rounded-xl bg-mes-gray-20 px-5 py-4" data-inspection-achievement-stack>
      {["입고검사 달성률", "출하검사 달성률", "공정검사 달성률"].map((title) => <AchievementMetric key={title} title={title} />)}
    </aside>
  );
}

function AchievementMetric({ title }: { title: string }) {
  return (
    <section className="flex h-[132px] flex-col justify-between">
      <h3 className="text-[18px] font-bold leading-[1.5] text-mes-gray-130">{title}</h3>
      <div className="flex items-center gap-5">
        <div className="h-[10px] min-w-0 flex-1 overflow-hidden rounded-full bg-mes-gray-40"><div className="h-full w-[72%] bg-mes-primary-60" /></div>
        <strong className="text-[26px] leading-[1.5] text-mes-gray-140">83%</strong>
      </div>
      <div className="grid h-[69px] grid-cols-2 items-center divide-x divide-mes-gray-30 rounded-lg bg-white text-center">
        <div><span className="text-[15px]">당일 검사 예정</span><strong className="mt-[2px] block text-[16px]">96건</strong></div>
        <div><span className="text-[15px]">당일 검사 완료</span><strong className="mt-[2px] block text-[16px]">90건</strong></div>
      </div>
    </section>
  );
}

export {
  CavityHeatmap,
  InspectionAchievementStack,
  InspectionTrendAnalysisScreen,
  MonthlyComparisonPanel,
};
