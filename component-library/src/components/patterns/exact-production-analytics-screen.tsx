"use client";

import * as React from "react";
import { IconBell, IconBox, IconChartBar, IconCompany, IconGrid, IconMedalCheck, IconSetting, IconUserMono, IconWrench } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import { EquipmentProductionChart, HorizontalBarChart, InventoryComparisonChart } from "@/components/ui/analytics-charts";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/ui/logo";
import { MesProductSwitcher } from "@/components/ui/mes-product-switcher";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, type SidebarNavItem } from "@/components/ui/sidebar";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

const NAV_ITEMS: SidebarNavItem[] = [
  { key: "material", label: "자재관리", icon: <IconBox size={20} /> },
  { key: "production", label: "생산관리", icon: <IconCompany size={20} /> },
  { key: "quality", label: "품질관리", icon: <IconMedalCheck size={20} /> },
  { key: "facility", label: "설비관리", icon: <IconWrench size={20} /> },
  { key: "analysis", label: "통계분석", icon: <IconChartBar size={20} /> },
  { key: "settings", label: "MES 설정", icon: <IconGrid size={20} /> },
];

interface MonthlyRow { id: string; equipment: string; good: number; defect: number; defectRate: number; }
const MONTHLY_ROWS: MonthlyRow[] = Array.from({ length: 5 }, (_, index) => ({ id: `monthly-${index}`, equipment: "A1", good: 5000, defect: 30, defectRate: 0.6 }));

function ExactProductionAnalyticsScreen() {
  const [period, setPeriod] = React.useState("당월");
  const [basis, setBasis] = React.useState("금액");
  const [month, setMonth] = React.useState("2025년 9월");
  const [process, setProcess] = React.useState("성형");
  const [summaryTab, setSummaryTab] = React.useState("설비별");
  const [editingMetric, setEditingMetric] = React.useState<string | null>(null);
  const periodLabel = period === "당월" ? "당월" : "당일";
  const columns: TableColumn<MonthlyRow>[] = [
    { key: "equipment", label: "설비", width: 195, align: "center", render: (row) => row.equipment },
    { key: "good", label: `양품(${basis === "금액" ? "백만원" : "수량"})`, width: 195, align: "center", render: (row) => row.good.toLocaleString("ko-KR") },
    { key: "defect", label: `불량(${basis === "금액" ? "백만원" : "수량"})`, width: 195, align: "center", render: (row) => row.defect },
    { key: "defectRate", label: "불량률(%)", width: 195, align: "center", render: (row) => row.defectRate },
  ];
  const rows: TableRowData<MonthlyRow>[] = MONTHLY_ROWS.map((row) => ({ id: row.id, data: row }));

  return <div className="flex h-[960px] w-[1920px] overflow-hidden bg-white">
    <Sidebar items={NAV_ITEMS} logo={<Logo brand="moncat-factory" />} dashboardActive productSwitcher={<MesProductSwitcher value="MES" />} />
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="flex h-[38px] shrink-0 items-center justify-between bg-black pr-3"><div className="flex h-full"><PageTopTabItem label="생산분석 현황" active /><PageTopTabItem label="거래처 등록" /><PageTopTabItem label="품목 등록" /></div><div className="flex items-center gap-1"><IconButton aria-label="알림" icon={<IconBell size={20} />} className="text-white" /><IconButton aria-label="사용자 메뉴" icon={<IconUserMono size={20} />} className="text-white" /></div></div>
      <div className="flex h-[42px] shrink-0 items-center border-b border-mes-gray-30 px-5"><strong className="text-[18px]">생산분석 현황</strong><div className="ml-auto flex items-center gap-4"><ButtonGroup>{["당월","당일"].map((item) => <Button key={item} size="toolbar" variant={period === item ? "lineBlacktxt" : "fillGray"} className="w-[76px]" onClick={() => setPeriod(item)}>{item}</Button>)}</ButtonGroup><span className="h-[14px] w-px bg-mes-gray-30" /><ButtonGroup>{["금액","수량"].map((item) => <Button key={item} size="toolbar" variant={basis === item ? "lineBlacktxt" : "fillGray"} className="w-[76px]" onClick={() => setBasis(item)}>{item}</Button>)}</ButtonGroup></div></div>
      <div className="min-h-0 flex-1 p-5">
        <div className="grid h-[197px] grid-cols-4 gap-5">
          <PlanMetric title="판매 계획 달성률" leftLabel={`${periodLabel} 판매 계획`} rightLabel={`${periodLabel} 출하 실적`} editing={editingMetric === "sales"} onToggle={() => setEditingMetric(editingMetric === "sales" ? null : "sales")} />
          <PlanMetric title="생산계획 진척률" leftLabel={`${periodLabel} 생산 계획`} rightLabel={`${periodLabel} 생산 실적`} editing={editingMetric === "production"} onToggle={() => setEditingMetric(editingMetric === "production" ? null : "production")} />
          <InventoryMetric periodLabel={periodLabel} />
          <ProductionMetric periodLabel={periodLabel} />
        </div>

        <section className="mt-5 flex h-[308px] gap-5 rounded-xl border border-mes-gray-30 bg-white p-5">
          <div className="flex w-[780px] flex-col gap-[10px]"><div className="flex h-8 items-center"><h3 className="text-[18px] font-bold">{periodLabel} 생산실적</h3><div className="ml-auto flex gap-[10px]"><SimpleSelect value={month} onChange={setMonth} options={["2025년 9월","2025년 10월"]} className="w-[140px]" /><SimpleSelect value={process} onChange={setProcess} options={["성형","압출"]} className="w-[140px]" /><Button size="small" variant="fillBlack" className="w-[69px] px-0">전체보기</Button></div></div><div className="flex h-9 rounded-mes-control bg-mes-gray-30 p-[3px]">{["설비별","작업자별"].map((item) => <Button key={item} type="button" size="small" variant="fillGray" onClick={() => setSummaryTab(item)} className={`h-[30px] flex-1 rounded-[2px] border-0 ${summaryTab === item ? "bg-white text-mes-gray-130 hover:bg-white" : "bg-transparent text-mes-gray-90 opacity-60 hover:bg-transparent"}`}>{item}</Button>)}</div><Table columns={columns} rows={rows} selectable={false} edgePadding={0} columnDividers={false} horizontalScroll={false} className="h-[180px] !rounded-none !border-0" /></div>
          <div className="h-[268px] w-[780px] rounded-xl border border-mes-gray-30 px-5 py-4"><div className="flex h-[23px] items-center"><h3 className="text-[14px] font-bold">설비별 생산실적 현황</h3><div className="ml-auto flex gap-4 text-[12px] text-mes-gray-90"><Legend color="#8dc8ff">생산실적({basis === "금액" ? "백만원" : "수량"})</Legend><Legend color="#f04452">불량률(%)</Legend></div></div><div className="mt-3"><EquipmentProductionChart /></div></div>
        </section>

        <div className="mt-5 grid h-[295px] grid-cols-2 gap-5"><ChartCard title="TOP5 불량유형" legend={`불량${basis === "금액" ? "금액(백만원)" : "수량"}`}><HorizontalBarChart labels={["기타","오투입","중량불량","흑점","스크래치"]} values={[57,73,42,54,54]} barValues={[108,66,15,57,10]} /></ChartCard><ChartCard title="TOP5 생산품" legend={`생산${basis === "금액" ? "금액(백만원)" : "수량"}`}><HorizontalBarChart labels={["햇반","누가바","죠스바","비비빅","팥빙수"]} values={["5,000","3,500","4,398","3,010","3,989"]} barValues={[116,66,106,57,102]} /></ChartCard></div>
      </div>
    </main>
  </div>;
}

function PlanMetric({ title, leftLabel, rightLabel, editing, onToggle }: { title: string; leftLabel: string; rightLabel: string; editing: boolean; onToggle: () => void }) {
  return <Card className="relative flex h-[197px] flex-col gap-3 rounded-xl border-0 bg-mes-gray-20 p-5"><div className="flex h-[27px] items-center justify-between"><strong className="text-[18px]">{title}</strong><IconButton aria-label={`${title} 설정`} icon={<IconSetting size={24} />} className="text-mes-gray-70" onClick={onToggle} /></div><div className="flex h-[39px] items-center gap-5"><div className="flex h-[10px] w-[242px] overflow-hidden rounded-[2px]"><span className="w-[197px] bg-mes-primary-60" /><span className="flex-1 bg-mes-gray-40" /></div><strong className="w-[88px] text-[26px]">83%</strong></div><div className="grid h-[69px] grid-cols-2 divide-x divide-mes-gray-30 rounded-lg bg-white py-[10px] text-center"><div><span className="text-[15px]">{leftLabel}</span><strong className="mt-[2px] block text-[16px]">5,000백만원</strong></div><div><span className="text-[15px]">{rightLabel}</span><strong className="mt-[2px] block text-[16px]">4,500백만원</strong></div></div>{editing && <div className="absolute right-5 top-12 z-10 rounded-mes-control border border-mes-gray-30 bg-white p-2 text-[12px] shadow-mes-panel">계획값 설정</div>}</Card>;
}

function InventoryMetric({ periodLabel }: { periodLabel: string }) { return <Card className="h-[197px] rounded-xl border-0 bg-mes-gray-20 p-5"><div className="flex h-[27px] items-center"><strong className="text-[18px]">{periodLabel} 재고 현황</strong><div className="ml-auto flex gap-2 text-[10px] text-mes-gray-70"><span>■ 이전 기간 (백만원)</span><span className="text-mes-primary-60">■ {periodLabel} (백만원)</span></div></div><InventoryComparisonChart /><div className="grid h-10 grid-cols-2 divide-x divide-mes-gray-30 rounded bg-white text-center text-[14px] leading-10"><span>{periodLabel} 재고&nbsp; <b>5,000백만원</b></span><span>이전 재고&nbsp; <b>4,500백만원</b></span></div></Card>; }

function ProductionMetric({ periodLabel }: { periodLabel: string }) { return <Card className="h-[197px] rounded-xl border-0 bg-mes-gray-20 p-5"><div className="flex h-[27px] items-center"><strong className="text-[18px]">{periodLabel} 생산 현황</strong><span className="ml-auto text-[10px] text-mes-gray-70">2025.11 기준</span></div><div className="mt-3 grid h-[118px] grid-cols-[100px_125px_125px] grid-rows-6 overflow-hidden rounded border border-mes-gray-30 text-[11px]"><span className="row-span-3 flex items-center justify-center border-b border-r border-mes-gray-30">생산</span>{["성형(천원)","5,000,000","압출(천원)","800,000","합계(천원)","5,800,000"].map((item,index) => <span key={`p${index}`} className={`flex items-center px-2 ${index<4?"border-b border-mes-gray-30":"bg-mes-primary-10 font-bold"} ${index%2?"justify-end":""}`}>{item}</span>)}<span className="row-span-3 flex items-center justify-center border-r border-mes-gray-30">출하</span>{["성형(천원)","5,000,000","압출(천원)","800,000","합계(천원)","5,800,000"].map((item,index) => <span key={`s${index}`} className={`flex items-center px-2 ${index<4?"border-b border-mes-gray-30":"bg-mes-primary-10 font-bold"} ${index%2?"justify-end":""}`}>{item}</span>)}</div></Card>; }

function SimpleSelect({ value, onChange, options, className }: { value: string; onChange: (value: string) => void; options: string[]; className: string }) { return <Select value={value} onValueChange={onChange}><SelectTrigger className={className}><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>; }
function Legend({ color, children }: { color: string; children: React.ReactNode }) { return <span className="flex items-center gap-[6px]"><span className="h-1 w-[18px] rounded-[1px]" style={{ backgroundColor: color }} />{children}</span>; }
function ChartCard({ title, legend, children }: { title: string; legend: string; children: React.ReactNode }) { return <section className="h-[295px] rounded-xl border border-mes-gray-30 bg-white px-5 py-4"><div className="flex h-[27px] items-center"><h3 className="text-[18px] font-bold">{title}</h3><div className="ml-auto text-[12px] text-mes-gray-90"><Legend color="#1573fb">{legend}</Legend></div></div><div className="mt-4 h-[224px]">{children}</div></section>; }

export { ExactProductionAnalyticsScreen };
