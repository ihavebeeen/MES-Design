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
}

const MEASUREMENTS: MeasurementRow[] = [
  "팥빙수", "비비빅", "누가바", "햇반", "죠스바", "두부반컵", "팥빙수", "옥수수콘",
  "바밤바", "메로나", "빠삐코", "더블비안코", "햇반", "육개장 소",
].map((item, index) => ({
  id: `measurement-${index}`,
  item,
  net: 35,
  lower: 32.4,
  upper: 27.5,
  average: 35.5,
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
      <MesFixtureSidebar dashboard sourceNavigation />
      <main className="flex min-w-0 flex-1 flex-col">
        <MesPageTabs active="공정검사 경향관리" sourceChrome />
        <div className="flex h-[42px] shrink-0 items-center border-b border-mes-gray-30 px-[17.869px]">
          <strong className="text-[16.082px] leading-[1.5] text-mes-gray-130">경향관리</strong>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden px-5 pb-5 pt-[21px]">
          <div className="grid h-[305px] grid-cols-2 gap-5">
            <MonthlyComparisonPanel title="반품 건 수" />
            <MonthlyComparisonPanel title="보류 건 수" />
          </div>

          <section className="ml-[6px] mt-5 grid h-[512px] w-[1620px] grid-cols-[652px_498px_390px] gap-5 rounded-xl border border-mes-gray-30 bg-white p-[19px]" data-measurement-analysis-section>
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

            <CavityHeatmap item={activeRow.item} />
            <InspectionAchievementStack />
          </section>
        </div>
      </main>
    </div>
  );
}

function MonthlyComparisonPanel({ title }: { title: string }) {
  return (
    <section className="flex h-[305px] flex-col gap-3 rounded-xl border border-mes-gray-30 bg-mes-gray-10 px-[19px] py-[15px]" data-monthly-comparison-panel>
      <header className="flex h-[23px] shrink-0 items-center">
        <h2 className="text-[15px] font-semibold leading-[1.5] text-mes-gray-90">{title}</h2>
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

const CHART_X = [63, 127, 186, 247, 307, 367, 426, 486, 547, 607, 666, 731];
const CURRENT_Y = [120, 103, 127, 77, 86, 112, 103, 112, 112];
const PREVIOUS_Y = [66, 95, 102, 32, 16, 66, 23, 95, 32, 95, 66, 95];

function MonthlyComparisonLineChart() {
  const currentPoints = CURRENT_Y.map((value, index) => `${CHART_X[index]},${value}`).join(" ");
  const previousPoints = PREVIOUS_Y.map((value, index) => `${CHART_X[index]},${value}`).join(" ");
  const areaPoints = `${currentPoints} ${CHART_X[CURRENT_Y.length - 1]},139 ${CHART_X[0]},139`;

  return (
    <svg viewBox="0 0 760 160" className="h-[160px] w-full shrink-0" role="img" aria-label="2025년과 2024년 월별 건수 비교 선 차트">
      <rect x="39" y="8" width="721" height="131" fill="#eff8ff" />
      {[{ label: 15, y: 8 }, { label: 10, y: 52 }, { label: 5, y: 96 }, { label: 0, y: 139 }].map(({ label, y }) => (
        <g key={label}>
          <text x="23" y={y + 4} textAnchor="end" className="fill-mes-gray-70 text-[12px]">{label}</text>
          <line x1="39" y1={y} x2="760" y2={y} className="stroke-mes-gray-30" />
        </g>
      ))}
      <polygon points={areaPoints} fill="#e8f5ff" opacity="0.7" />
      <polyline points={previousPoints} fill="none" className="stroke-mes-danger-60" strokeWidth="2" strokeDasharray="6 6" />
      <polyline points={currentPoints} fill="none" className="stroke-mes-primary-60" strokeWidth="2" />
      {PREVIOUS_Y.map((value, index) => <circle key={`previous-${index}`} cx={CHART_X[index]} cy={value} r="4" className="fill-mes-danger-60" />)}
      {CURRENT_Y.map((value, index) => <circle key={`current-${index}`} cx={CHART_X[index]} cy={value} r="4" className="fill-mes-primary-60" />)}
      {MONTHS.map((month, index) => <text key={month} x={CHART_X[index]} y="158" textAnchor="middle" className="fill-mes-gray-70 text-[12px]">{month}</text>)}
    </svg>
  );
}

function MonthlyComparisonTable() {
  return (
    <div className="grid h-[66px] shrink-0 grid-cols-[43px_repeat(12,minmax(0,1fr))] grid-rows-[22px_20px_20px] border-b border-r border-mes-gray-30 text-center text-[13px] leading-[20px]" data-monthly-comparison-table>
      <span className="border-l border-t border-mes-gray-30 bg-mes-gray-10" />
      {MONTHS.map((month) => <span key={`month-${month}`} className="border-l border-t border-mes-gray-30 bg-mes-primary-20 font-semibold leading-[22px]">{month}월</span>)}
      <strong className="border-l border-t border-mes-gray-30 bg-mes-gray-10">2025</strong>
      {MONTHS.map((month, index) => <span key={`current-${month}`} className="border-l border-t border-mes-gray-30">{CURRENT_YEAR[index] ?? ""}</span>)}
      <strong className="border-l border-t border-mes-gray-30 bg-mes-gray-10">2024</strong>
      {MONTHS.map((month, index) => <span key={`previous-${month}`} className="border-l border-t border-mes-gray-30">{PREVIOUS_YEAR[index]}</span>)}
    </div>
  );
}

const CAVITY_VALUES: Array<Array<number | undefined>> = [
  [35, 35, 35, 35, 35],
  [35, 35, 35, 35, 35],
  [35, 35, 35, 32.5, 35],
  [35, 35, 35, 35, 35],
  [37.5, 35, 35, 35, 35],
];

// Figma 11751:102938의 히트맵은 시스템 팔레트가 아니라 연속형 데이터 시각화 전용 색을 사용한다.
const CAVITY_TONES = [
  ["#ffec9d", "#fee085", "#fea747", "#ffec9d", "#fea747"],
  ["#fed16e", "#ffffcc", "#fd8439", "#ffffcc", "#fee085"],
  ["#fea747", "#fed16e", "#fc5b2e", "#ed2e21", "#fed16e"],
  ["#fee085", "#ed2e21", "#ed2e21", "#ed2e21", "#fea747"],
  ["#d21c14", "#800026", "#800026", "#be0126", "#800026"],
];

function CavityHeatmap({ item }: { item: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-2" data-cavity-heatmap data-active-item={item}>
      <h2 className="h-[27px] px-2 text-[18px] font-bold leading-[1.5] text-mes-gray-130">CAVITY별 측정값</h2>
      <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-xl border border-mes-gray-30 bg-mes-gray-10 px-[19px] py-[15px]">
        <div className="flex shrink-0 flex-col gap-2 px-[10px]">
          <div className="grid h-3 grid-cols-5 overflow-hidden">
            {["#fce861", "#feae67", "#fa7a5f", "#f1534c", "#d21c14"].map((color) => <span key={color} style={{ backgroundColor: color }} />)}
          </div>
          <div className="flex justify-between text-[11px] font-semibold leading-[1.5] text-mes-gray-60">
            {[4.6, 4.8, 5.0, 5.2, 5.4, 5.6].map((value) => <span key={value}>{value.toFixed(1)}</span>)}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="grid h-[18px] shrink-0 grid-cols-10 gap-1 pl-[26px] text-center text-[12px] leading-[18px] text-mes-gray-60">
            {Array.from({ length: 10 }, (_, index) => <span key={index}>{index + 1}</span>)}
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[22px_repeat(10,minmax(0,1fr))] grid-rows-10 gap-1 text-center text-[12px]">
            {Array.from({ length: 10 }, (_, row) => (
              <React.Fragment key={`row-${row}`}>
                <span className="flex items-center text-mes-gray-60">{row + 1}</span>
                {Array.from({ length: 10 }, (_, column) => {
                  const value = CAVITY_VALUES[row]?.[column];
                  const backgroundColor = CAVITY_TONES[row]?.[column];
                  const useWhiteText = row >= 3 && column > 0 || row === 4 || row === 2 && column === 3;
                  return <span key={`${row}-${column}`} className={`flex min-h-0 items-center justify-center rounded-[2px] border text-[13px] font-semibold ${value === undefined ? "border-mes-gray-30 bg-white" : useWhiteText ? "border-transparent text-white" : "border-transparent text-mes-gray-130"}`} style={backgroundColor ? { backgroundColor } : undefined}>{value}</span>;
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InspectionAchievementStack() {
  return (
    <aside className="flex h-full flex-col gap-[10px] rounded-xl bg-mes-gray-20 px-5 py-4" data-inspection-achievement-stack>
      {["입고검사 달성률", "출하검사 달성률", "공정검사 달성률"].map((title) => <AchievementMetric key={title} title={title} />)}
    </aside>
  );
}

function AchievementMetric({ title }: { title: string }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col justify-between">
      <h3 className="-mb-[3px] text-[18px] font-bold leading-[1.5] text-mes-gray-130">{title}</h3>
      <div className="flex h-[116px] shrink-0 flex-col justify-between">
        <div className="flex items-center gap-5">
          <div className="h-[10px] min-w-0 flex-1 overflow-hidden rounded-full bg-mes-gray-40"><div className="h-full w-[71.64%] bg-mes-primary-60" /></div>
          <strong className="text-[26px] leading-[1.5] text-[#171717]">83%</strong>
        </div>
        <div className="grid h-[69px] grid-cols-2 items-center divide-x divide-mes-gray-30 rounded-lg bg-white py-[10px] text-center">
          <div><span className="text-[15px] leading-[1.5]">당일 검사 예정</span><strong className="mt-[2px] block text-[16px] leading-[1.5]">96건</strong></div>
          <div><span className="text-[15px] leading-[1.5]">당일 검사 완료</span><strong className="mt-[2px] block text-[16px] leading-[1.5]">90건</strong></div>
        </div>
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
