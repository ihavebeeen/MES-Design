"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Radio } from "@/components/ui/radio";
import {
  IconArrow,
  IconArrowDownRight,
  IconCopy,
  IconDownload,
  IconReload,
  IconSetting,
  IconTrendingDown,
  IconTrendingUp,
} from "@/components/icons";
import { FigmaScreenPreview } from "./figma-screen-preview";
import { AnalyticsDashboardPattern } from "./analytics-dashboard-pattern";
import { EntityListPattern } from "./entity-list-pattern";
import { MasterDetailPattern } from "./master-detail-pattern";
import {
  FixtureDateRange,
  FixtureFilter,
  FixtureGroupQuery,
  FixtureInput,
  FixtureSearch,
  FixtureSelect,
  FixtureTable,
  FixtureTextRange,
  MesFixtureSidebar,
  MesPageTabs,
  RadioOption,
} from "./mes-screen-fixtures";

const shipmentRows = [
  ["롯데", "팥빙수", "완제품", "아사노", "kg", "1,000", "720", 61, "승인 대기"],
  ["롯데", "누가바", "반제품", "아사노", "kg", "1,000", "820", 72, "완료"],
  ["해태", "죠스", "완제품", "아사노", "kg", "1,000", "500", 50, "출하중"],
  ["빙그레", "비비빅", "반제품", "A", "kg", "500", "100", 33, "취소 요청"],
  ["해태", "바밤바", "완제품", "A", "kg", "2,000", "2,000", 100, "승인 대기"],
  ["빙그레", "티코", "반제품", "아사노", "kg", "3,000", "3,000", 100, "승인 대기"],
  ["빙그레", "참붕어싸만코", "완제품", "A", "kg", "1,000", "1,000", 100, "완료"],
  ["해태", "와", "반제품", "아사노", "kg", "3,000", "3,000", 100, "완료"],
  ["빙그레", "수박바", "완제품", "아사노", "kg", "3,000", "3,000", 100, "완료"],
  ["롯데", "돼지바 콘", "반제품", "아사노", "kg", "3,000", "3,000", 100, "완료"],
  ["빙그레", "고드름", "완제품", "아사노", "kg", "1,000", "1,000", 100, "완료"],
  ["롯데", "투게더", "완제품", "아사노", "kg", "300", "300", 100, "완료"],
];

function StatusTag({ status }: { status: string }) {
  const variant = status === "완료" ? "blue" : status === "출하중" ? "blueLight" : status === "취소 요청" ? "red" : "grayFill";
  return <Badge variant={variant}>{status}</Badge>;
}

function ProgressCell({ value }: { value: number }) {
  return <Progress value={value} />;
}

function CompletedEntityListExample() {
  const rows = shipmentRows.map((row, index) => [
    "2025.10.30",
    "2025.10.30",
    row[0], row[1], row[2], row[3], row[4],
    <span key={`qty-${index}`} className="block text-right">{row[5]}</span>,
    <Button key={`register-${index}`} size="xsmall" variant="fillGray" endIcon={<IconArrow size={12} className="rotate-180" />}>등록</Button>,
    row[6],
    <ProgressCell key={`progress-${index}`} value={row[7] as number} />,
    <StatusTag key={`status-${index}`} status={row[8] as string} />,
    <Button key={`edit-${index}`} size="xsmall" variant="fillGray" endIcon={<IconArrow size={12} className="rotate-180" />}>편집</Button>,
  ]);

  return (
    <FigmaScreenPreview>
      <EntityListPattern
        navigation={<MesFixtureSidebar />}
        tabs={<MesPageTabs active="판매계획" extraTabs={[]} />}
        header={
          <>
            <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
              <h3 className="text-[18px] font-bold">출하지시 리스트</h3>
              <div className="flex items-center gap-2.5">
                <FixtureDateRange />
                <Button size="small" className="w-[50px]">조회</Button>
                <Button size="small" variant="lineBlacktxt" className="w-[67px]" startIcon={<IconSetting size={16} />}>설정</Button>
              </div>
            </div>
            <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
              <div className="flex items-center gap-2.5"><FixtureGroupQuery /><FixtureFilter /></div>
            </div>
          </>
        }
        table={
          <FixtureTable
            headers={["출하지시일", "판매예정일", "거래처", "품목", "품목 구분", "규격", "단위", "출하지시수량", "출하실적등록", "출하실적수량", "출하율", "상태", "비고"]}
            widths={[128, 128, 128, 128, 128, 128, 128, 128, 100, 128, 128, 128, 72]}
            aligns={["left", "left", "left", "left", "left", "left", "left", "right", "center", "right", "left", "center", "center"]}
            rows={rows}
            checkedRows={shipmentRows.map((_, index) => index)}
            activeRow={null}
            selectionColor="gray"
          />
        }
        footer={
          <>
            <Button size="small" variant="lineMain" startIcon={<IconReload size={16} />}>판매목표관리(일) 연동</Button>
            <div className="flex gap-2.5"><Button size="small" variant="fillGray" className="w-40">삭제</Button><Button size="small" variant="fillBlack" className="w-40">출하지시 등록</Button></div>
          </>
        }
      />
    </FigmaScreenPreview>
  );
}

const lotMasterRows = Array.from({ length: 12 }, (_, index) => [
  "250801-1234-A-0081", "팥빙수", "완제품", "EA", "1000", index < 2 ? "A1" : "", "윤대원", index > 1 ? "오리온" : "", "25.08.01", index < 2 ? "N" : "Y", index < 2 ? "롯데" : "", index < 2 ? "25.08.01" : "",
]);

const lotDetailRows = [
  ["250801-1234-A-0081", "PB123", "원재료", "KG", "1000", "500", "500", "", "", "신선미", "농심", "25.08.01", "Y", "25.08.01"],
  ["250801-1234-A-0081", "팥빙수 뚜껑", "반제품", "EA", "500", "500", "500", "", "", "신선미", "농심", "25.08.01", "Y", "25.08.01"],
  ["250801-1234-A-0081", "팥빙수 용기", "반제품", "EA", "500", "500", "500", "", "", "윤대원", "농심", "25.08.01", "Y", "25.08.01"],
  ["250801-1234-A-0081", "숟가락", "부자재", "EA", "2500", "1000", "1500", "성형", "성형1호기", "신선미", "", "25.08.01", "N", "25.08.01"],
  ["250801-1234-A-0081", "BLACK123", "원재료", "KG", "5000", "2000", "1000", "성형", "성형2호기", "홍길동", "", "25.08.01", "N", "25.08.01"],
];

function CompletedMasterDetailExample() {
  return (
    <FigmaScreenPreview>
      <MasterDetailPattern
        navigation={<MesFixtureSidebar />}
        tabs={<MesPageTabs active="공정검사" />}
        header={
          <>
            <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
              <h3 className="text-[18px] font-bold">LOT 추적</h3>
              <div className="flex items-center gap-2.5">
                <FixtureTextRange label="LOT No" start="P240601001-0001" end="P240601001-9999" />
                <FixtureDateRange />
                <Button size="small" className="w-[50px]">조회</Button>
                <Button size="small" variant="lineBlacktxt" className="w-[67px]" startIcon={<IconSetting size={16} />}>설정</Button>
              </div>
            </div>
            <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
              <div className="flex h-8 items-center gap-4 text-[14px]">
                <RadioOption name="lot-direction" checked label="투입품목 추적(역전개)" />
                <RadioOption name="lot-direction" checked={false} label="생산품목 추적(정전개)" />
              </div>
              <FixtureSearch />
            </div>
          </>
        }
        master={
          <FixtureTable
            headers={["LOT No", "품목", "품목 구분", "단위", "수량", "설비", "담당자", "입고처", "입고(생산)일", "검사여부", "출하처", "출하일"]}
            widths={[192, 192, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]}
            aligns={["left", "left", "left", "center", "right", "left", "left", "left", "left", "center", "left", "left"]}
            rows={lotMasterRows}
            selectedRow={1}
            checkedRows={lotMasterRows.map((_, index) => index)}
            activeRow={1}
            selectionColor="gray"
            disabledRows={[0]}
            selectionHeaderLabel="선택"
          />
        }
        detailTitle={<span className="flex items-center gap-2"><IconArrowDownRight size={20} className="text-mes-gray-60" />투입품목 상세</span>}
        detail={
          <FixtureTable
            headers={["LOT No", "품목", "품목 구분", "단위", "수량", "투입수량", "잔량", "ROUTE명", "설비", "담당자", "입고처", "입고(생산)일", "검사여부", "투입일"]}
            widths={[210, 210, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}
            aligns={["left", "left", "left", "center", "right", "right", "right", "left", "left", "left", "left", "left", "center", "left"]}
            rows={lotDetailRows}
            selectable={false}
          />
        }
        footer={
          <div className="flex gap-2.5">
            <Button size="small" variant="lineBlacktxt" startIcon={<IconCopy size={16} />}>복사</Button>
            <Button size="small" variant="lineBlacktxt" startIcon={<IconDownload size={16} />}>다운로드</Button>
          </div>
        }
      />
    </FigmaScreenPreview>
  );
}

const metricCards = [
  { title: "판매 계획 달성률", value: "83%", accent: "bg-mes-primary-60", left: ["당월 판매 계획", "5,000백만원"], right: ["당월 출하 실적", "4,500백만원"] },
  { title: "생산계획 진척률", value: "83%", accent: "bg-mes-primary-60", left: ["당월 생산 계획", "5,000백만원"], right: ["당월 생산 실적", "4,500백만원"] },
  { title: "당월 생산계획 증감률", value: "10.5%", accent: "text-mes-primary-60", left: ["당월 계획", "5,000백만원"], right: ["전월 계획", "4,500백만원"] },
  { title: "종합 물량 증감률", value: "37.7%", accent: "text-mes-danger-60", left: ["당월 불량률", "3.25%"], right: ["전월 불량률", "5.24%"] },
];

function MetricCard({ item, index }: { item: (typeof metricCards)[number]; index: number }) {
  return (
    <Card className="flex h-[197px] flex-col rounded-xl border-0 bg-mes-gray-20 p-5">
      <div className="flex h-[27px] items-center justify-between">
        <b className="text-[15px]">{item.title}</b>
        <strong className="flex items-center gap-1 text-[24px]">
          {index === 2 && <IconTrendingDown size={20} className="text-mes-primary-60" />}
          {index === 3 && <IconTrendingUp size={20} className="text-mes-danger-60" />}
          {item.value}
        </strong>
      </div>
      <div className="mt-3 flex min-h-0 flex-1 flex-col">
        {index < 2 && <div className="h-2 overflow-hidden rounded-full bg-mes-gray-40"><div className={`h-full w-[83%] ${item.accent}`} /></div>}
        <div className="mt-auto grid h-[78px] grid-cols-2 divide-x divide-mes-gray-30 rounded-lg bg-white text-center text-[12px]">
          {[item.left, item.right].map((value, itemIndex) => <div key={itemIndex} className="flex flex-col items-center justify-center"><span className="block text-mes-gray-80">{value[0]}</span><b className="mt-1 text-[14px]">{value[1]}</b></div>)}
        </div>
      </div>
    </Card>
  );
}

function HorizontalBars({ labels, values, widths, ticks }: { labels: string[]; values: number[]; widths: number[]; ticks: string[] }) {
  return (
    <div className="grid h-full grid-cols-[55px_1fr] grid-rows-[1fr_18px] gap-x-2 pt-3 text-[12px]">
      <div className="flex flex-col justify-around pb-1 text-right">{labels.map((label) => <span key={label}>{label}</span>)}</div>
      <div className="flex flex-col justify-around border-l border-mes-gray-30 pb-1" style={{ backgroundImage: "repeating-linear-gradient(to right, transparent 0, transparent calc(20% - 1px), #d7dce5 calc(20% - 1px), #d7dce5 20%)" }}>
        {labels.map((label, index) => (
          <div key={label} className="flex h-5 items-center">
            <span className="flex h-4 items-center rounded-r bg-mes-primary-60 px-1 text-[10px] font-semibold text-white" style={{ width: `${widths[index]}%` }}>
              {values[index].toLocaleString("ko-KR")}
            </span>
          </div>
        ))}
      </div>
      <span />
      <div className="flex justify-between text-[10px] text-mes-gray-60">{ticks.map((tick) => <span key={tick}>{tick}</span>)}</div>
    </div>
  );
}

function ProductionChart() {
  const bars = [125, 58, 99, 79, 158, 58, 104, 79, 115, 58, 149, 83];
  return (
    <div className="relative flex h-full items-end gap-4 border-b border-mes-gray-30 px-10 pb-5 pt-5">
      {bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center justify-end gap-1 text-[10px] text-mes-gray-60"><span className="w-8 rounded-t bg-mes-primary-30" style={{ height: value }} /><span>A{index + 1}</span></div>)}
      <svg className="pointer-events-none absolute inset-x-10 top-8 h-[150px] w-[calc(100%-80px)]" viewBox="0 0 600 150" preserveAspectRatio="none" aria-label="불량률 추이">
        <polyline points="0,58 55,88 110,66 165,104 220,105 275,44 330,85 385,103 440,71 495,81 550,59 600,83" fill="none" stroke="#f04452" strokeWidth="2" />
        {[0,55,110,165,220,275,330,385,440,495,550,600].map((x, i) => <circle key={i} cx={x} cy={[58,88,66,104,105,44,85,103,71,81,59,83][i]} r="3" fill="#f04452" />)}
      </svg>
    </div>
  );
}

function LegacyCompletedAnalyticsExample() {
  return (
    <FigmaScreenPreview>
      <AnalyticsDashboardPattern
        navigation={<MesFixtureSidebar dashboard />}
        tabs={<MesPageTabs active="생산분석 현황" />}
        metrics={metricCards.map((item, index) => ({ id: String(index), content: <MetricCard item={item} index={index} /> }))}
        panels={[
          {
            id: "summary",
            title: "",
            className: "p-5",
            content: <div className="h-full"><div className="flex h-8 items-center justify-between"><div className="flex gap-2"><FixtureSelect value="2025년 09월" className="w-[140px]" /><FixtureSelect value="성형" className="w-[140px]" /></div><Button size="small" variant="fillBlack" className="w-[69px]">전체보기</Button></div><ButtonGroup className="mt-3 w-full"><Button size="small" variant="lineBlacktxt" className="flex-1">설비별</Button><Button size="small" variant="fillGray" className="flex-1 text-mes-gray-60">작업자별</Button></ButtonGroup><div className="mt-3"><FixtureTable selectable={false} headers={["설비", "양품(백만원)", "불량(백만원)", "불량률(%)"]} aligns={["center", "right", "right", "right"]} rows={Array.from({ length: 5 }, () => ["A1", "5,000", "30", "0.6"])} /></div></div>,
          },
          {
            id: "production",
            title: "생산실적 현황",
            legend: <div className="flex gap-4 text-[10px] text-mes-gray-70"><span className="flex items-center gap-1"><i className="h-0.5 w-4 bg-mes-primary-60" />생산실적(백만원)</span><span className="flex items-center gap-1"><i className="h-0.5 w-4 bg-mes-danger-60" />불량률(%)</span></div>,
            contentClassName: "pt-2",
            content: <ProductionChart />,
          },
          {
            id: "defect",
            title: "TOP5 불량유형",
            legend: <span className="flex items-center gap-1 text-[10px] text-mes-gray-70"><i className="h-0.5 w-4 bg-mes-primary-60" />불량금액(백만원)</span>,
            content: <HorizontalBars labels={["기타", "오무힘", "중량불량", "흑점", "스크래치"]} values={[57, 73, 42, 54, 54]} widths={[78, 47, 11, 41, 7]} ticks={["0", "20", "40", "60", "80", "100", "120", "140"]} />,
          },
          {
            id: "top",
            title: "TOP5 생산품",
            legend: <span className="flex items-center gap-1 text-[10px] text-mes-gray-70"><i className="h-0.5 w-4 bg-mes-primary-60" />생산금액(백만원)</span>,
            content: <HorizontalBars labels={["햇반", "누가바", "죠스바", "비비빅", "팥빙수"]} values={[5000, 3500, 4398, 3010, 3989]} widths={[82, 47, 75, 40, 72]} ticks={["0", "20", "40", "60", "80", "100", "120", "140"]} />,
          },
        ]}
      />
    </FigmaScreenPreview>
  );
}

void LegacyCompletedAnalyticsExample;

function LatestMetricSettings({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = React.useState("system");
  return (
    <div className="absolute inset-x-5 top-12 z-10 rounded-lg border border-mes-gray-30 bg-white p-3 shadow-mes-panel">
      <div className="flex items-center justify-between"><b className="text-[13px]">계획값 설정</b><Button size="xsmall" variant="lineBlacktxt" onClick={onClose}>닫기</Button></div>
      <div className="mt-2 flex gap-4 text-[12px]"><label className="flex items-center gap-1"><Radio name="latest-metric-mode" size="small" checked={mode === "system"} onChange={() => setMode("system")} />시스템 계산값</label><label className="flex items-center gap-1"><Radio name="latest-metric-mode" size="small" checked={mode === "user"} onChange={() => setMode("user")} />사용자 입력값</label></div>
      <div className="mt-2 flex gap-2"><FixtureInput value="5,000" muted={mode === "system"} /><Button size="small" onClick={onClose}>적용</Button></div>
    </div>
  );
}

function LatestPlanMetric({ title, editing, onEdit }: { title: string; editing: boolean; onEdit: () => void }) {
  return <Card className="relative flex h-[197px] flex-col rounded-xl border-0 bg-mes-gray-20 p-5"><div className="flex items-center justify-between"><b className="text-[15px]">{title}</b><Button size="xsmall" variant="lineBlacktxt" aria-label={`${title} 설정`} onClick={onEdit}><IconSetting size={16} /></Button></div><div className="mt-4 flex items-center gap-5"><div className="h-2 flex-1 overflow-hidden rounded-full bg-mes-gray-40"><div className="h-full w-[83%] bg-mes-primary-60" /></div><strong className="text-[24px]">83%</strong></div><div className="mt-auto grid h-[69px] grid-cols-2 divide-x divide-mes-gray-30 rounded-lg bg-white text-center text-[12px]"><div className="flex flex-col items-center justify-center"><span>{title.startsWith("판매") ? "당월 판매 계획" : "당월 생산 계획"}</span><b className="mt-1 text-[14px]">5,000백만원</b></div><div className="flex flex-col items-center justify-center"><span>{title.startsWith("판매") ? "당월 출하 실적" : "당월 생산 실적"}</span><b className="mt-1 text-[14px]">4,500백만원</b></div></div>{editing && <LatestMetricSettings onClose={onEdit} />}</Card>;
}

function LatestInventoryMetric() {
  return <Card className="flex h-[197px] flex-col rounded-xl border-0 bg-mes-gray-20 p-5"><div className="flex items-center justify-between"><b className="text-[15px]">당월 재고 현황</b><span className="text-[10px] text-mes-gray-70">■ 전월　<span className="text-mes-primary-60">■ 당월</span></span></div><div className="mt-2 grid flex-1 grid-cols-2 items-end gap-8 px-8"><div className="flex items-end justify-center gap-2"><span className="h-8 w-10 bg-green-200" /><span className="h-12 w-10 bg-mes-primary-60" /></div><div className="flex items-end justify-center gap-2"><span className="h-12 w-10 bg-green-200" /><span className="h-9 w-10 bg-mes-primary-60" /></div></div><div className="grid h-9 grid-cols-2 rounded bg-white text-center text-[13px] leading-9"><span>당월 재고　<b>5,000백만원</b></span><span>전월 재고　<b>4,500백만원</b></span></div></Card>;
}

function LatestProductionMetric() {
  return <Card className="flex h-[197px] flex-col rounded-xl border-0 bg-mes-gray-20 p-5"><div className="flex items-center justify-between"><b className="text-[15px]">당월 생산 현황</b><span className="text-[10px] text-mes-gray-70">2025.11 기준</span></div><div className="mt-3 grid flex-1 grid-cols-[70px_1fr_1fr] grid-rows-3 overflow-hidden rounded border border-mes-gray-30 text-[11px]"><span className="row-span-3 flex items-center justify-center border-r border-mes-gray-30">생산</span><span className="border-b border-mes-gray-30 px-2">성형(천원)</span><span className="border-b border-mes-gray-30 px-2 text-right">5,000,000</span><span className="border-b border-mes-gray-30 px-2">압출(천원)</span><span className="border-b border-mes-gray-30 px-2 text-right">800,000</span><span className="bg-mes-primary-10 px-2 font-bold">합계(천원)</span><span className="bg-mes-primary-10 px-2 text-right font-bold">5,800,000</span></div></Card>;
}

function CompletedAnalyticsExample() {
  const [period, setPeriod] = React.useState("당월");
  const [basis, setBasis] = React.useState("금액");
  const [editing, setEditing] = React.useState<number | null>(null);
  return <FigmaScreenPreview><AnalyticsDashboardPattern navigation={<MesFixtureSidebar dashboard />} tabs={<MesPageTabs active="생산분석 현황" />} toolbar={<><strong className="text-[15px]">생산분석 현황</strong><div className="ml-auto flex items-center gap-4"><ButtonGroup>{["당월","당일"].map((item) => <Button key={item} size="small" variant={period === item ? "lineBlacktxt" : "fillGray"} className="w-[75px]" onClick={() => setPeriod(item)}>{item}</Button>)}</ButtonGroup><span className="h-5 w-px bg-mes-gray-30" /><ButtonGroup>{["금액","수량"].map((item) => <Button key={item} size="small" variant={basis === item ? "lineBlacktxt" : "fillGray"} className="w-[75px]" onClick={() => setBasis(item)}>{item}</Button>)}</ButtonGroup></div></>} metrics={[{id:"sales",content:<LatestPlanMetric title="판매 계획 달성률" editing={editing===0} onEdit={() => setEditing(editing===0?null:0)} />},{id:"production-plan",content:<LatestPlanMetric title="생산계획 진척률" editing={editing===1} onEdit={() => setEditing(editing===1?null:1)} />},{id:"inventory",content:<LatestInventoryMetric />},{id:"production",content:<LatestProductionMetric />}]} panels={[{id:"summary",title:"월별 생산실적",className:"p-5",content:<div className="h-full"><div className="flex h-8 items-center justify-end gap-2"><FixtureSelect value="2025년 9월" className="w-[140px]" /><FixtureSelect value="성형" className="w-[140px]" /><Button size="small" variant="fillBlack">전체보기</Button></div><ButtonGroup className="mt-3 w-full"><Button size="small" variant="lineBlacktxt" className="flex-1">설비별</Button><Button size="small" variant="fillGray" className="flex-1 text-mes-gray-60">작업자별</Button></ButtonGroup><div className="mt-3"><FixtureTable selectable={false} headers={["설비",`양품(${basis === "금액" ? "백만원" : "수량"})`,`불량(${basis === "금액" ? "백만원" : "수량"})`,"불량률(%)"]} aligns={["center","right","right","right"]} rows={Array.from({length:5},() => ["A1","5,000","30","0.6"])} /></div></div>},{id:"production",title:"설비별 생산실적 현황",legend:<div className="flex gap-4 text-[10px] text-mes-gray-70"><span>━ 생산실적({basis === "금액" ? "백만원" : "수량"})</span><span className="text-mes-danger-60">━ 불량률(%)</span></div>,content:<ProductionChart />},{id:"defect",title:"TOP5 불량유형",legend:<span className="text-[10px] text-mes-gray-70">━ 불량금액({basis === "금액" ? "백만원" : "수량"})</span>,content:<HorizontalBars labels={["기타","오투입","중량불량","흑점","스크래치"]} values={[57,73,42,54,54]} widths={[78,47,11,41,7]} ticks={["0","20","40","60","80","100","120","140"]} />},{id:"top",title:"TOP5 생산품",legend:<span className="text-[10px] text-mes-gray-70">━ 생산금액({basis === "금액" ? "백만원" : "수량"})</span>,content:<HorizontalBars labels={["햇반","누가바","죠스바","비비빅","팥빙수"]} values={[5000,3500,4398,3010,3989]} widths={[82,47,75,40,72]} ticks={["0","20","40","60","80","100","120","140"]} />}]} /></FigmaScreenPreview>;
}

export { CompletedAnalyticsExample, CompletedEntityListExample, CompletedMasterDetailExample };
