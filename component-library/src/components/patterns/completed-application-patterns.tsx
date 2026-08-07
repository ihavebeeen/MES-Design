"use client";

import * as React from "react";
import { Copy, Download, Filter, Link2, Settings } from "lucide-react";
import { FigmaScreenPreview } from "./figma-screen-preview";
import { AnalyticsDashboardPattern } from "./analytics-dashboard-pattern";
import { EntityListPattern } from "./entity-list-pattern";
import { MasterDetailPattern } from "./master-detail-pattern";
import {
  CheckboxGlyph,
  ControlBox,
  DateRangeControl,
  DenseTable,
  GroupControl,
  MesFixtureSidebar,
  MesPageTabs,
  SearchControl,
  SmallButton,
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
  const tone = status === "완료" ? "bg-mes-primary-60" : status === "출하중" ? "bg-mes-primary-20 text-mes-primary-60" : status === "취소 요청" ? "bg-mes-danger-60" : "bg-mes-gray-80";
  return <span className={`inline-flex h-[22px] items-center rounded-[2px] px-2 text-[12px] font-semibold text-white ${tone}`}>{status}</span>;
}

function ProgressCell({ value }: { value: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-1.5 w-[70px] overflow-hidden rounded-full bg-mes-gray-40"><span className="block h-full bg-mes-gray-100" style={{ width: `${value}%` }} /></span>
      <span className="w-10 text-left">{value}%</span>
    </div>
  );
}

function CompletedEntityListExample() {
  const rows = shipmentRows.map((row, index) => [
    <CheckboxGlyph key={`check-${index}`} />,
    "2025.10.30",
    "2025.10.30",
    row[0], row[1], row[2], row[3], row[4],
    <span key={`qty-${index}`} className="block text-right">{row[5]}</span>,
    <span key={`register-${index}`} className="rounded-[2px] bg-mes-gray-20 px-2 py-1 text-[12px] font-semibold">등록 〉</span>,
    row[6],
    <ProgressCell key={`progress-${index}`} value={row[7] as number} />,
    <StatusTag key={`status-${index}`} status={row[8] as string} />,
    <span key={`edit-${index}`} className="rounded-[2px] bg-mes-gray-20 px-2 py-1 text-[12px] font-semibold">편집 〉</span>,
  ]);

  return (
    <FigmaScreenPreview>
      <EntityListPattern
        navigation={<MesFixtureSidebar />}
        tabs={<MesPageTabs active="출하지시 리스트" />}
        header={
          <>
            <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
              <h3 className="text-[18px] font-bold">출하지시 리스트</h3>
              <div className="flex items-center gap-2.5">
                <DateRangeControl />
                <SmallButton tone="main" className="w-[50px]">조회</SmallButton>
                <SmallButton className="w-[67px]"><Settings size={16} /> 설정</SmallButton>
              </div>
            </div>
            <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
              <div className="flex items-center gap-2.5"><GroupControl /><SmallButton><Filter size={16} /> 필터 추가</SmallButton></div>
              <SearchControl />
            </div>
          </>
        }
        table={
          <DenseTable
            headers={["", "출하지시일", "판매예정일", "거래처", "품목", "품목 구분", "규격", "단위", "출하지시수량", "출하실적등록", "출하실적수량", "출하율", "상태", "비고"]}
            widths={[56, 128, 128, 128, 128, 128, 128, 128, 128, 100, 128, 128, 128, 72]}
            rows={rows}
          />
        }
        footer={
          <>
            <div className="flex gap-2.5">
              <SmallButton><Copy size={16} /> 복사</SmallButton>
              <SmallButton><Download size={16} /> 다운로드</SmallButton>
              <SmallButton className="text-mes-primary-60"><Link2 size={16} /> 판매목표관리(일) 연동</SmallButton>
            </div>
            <div className="flex gap-2.5"><SmallButton tone="gray" className="w-40">삭제</SmallButton><SmallButton tone="black" className="w-40">출하지시 등록</SmallButton></div>
          </>
        }
      />
    </FigmaScreenPreview>
  );
}

const lotMasterRows = Array.from({ length: 12 }, (_, index) => [
  <CheckboxGlyph key={`lot-check-${index}`} selected={index === 1} />,
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
                <ControlBox><b className="mr-3">LOT No</b><span className="text-mes-gray-60">P240601001-0001&nbsp; ~ &nbsp;P240601001-9999</span></ControlBox>
                <DateRangeControl />
                <SmallButton tone="main" className="w-[50px]">조회</SmallButton>
                <SmallButton className="w-[67px]"><Settings size={16} /> 설정</SmallButton>
              </div>
            </div>
            <div className="flex h-12 items-center justify-between border-b border-mes-gray-30 px-5">
              <div className="flex h-8 overflow-hidden rounded-[4px] border border-mes-gray-30 text-[14px]">
                <span className="flex items-center gap-2 bg-white px-3 font-semibold"><span className="size-5 rounded-full border-[5px] border-mes-primary-60" />투입품목 추적(역전개)</span>
                <span className="flex items-center gap-2 bg-mes-gray-20 px-3 text-mes-gray-80"><span className="size-5 rounded-full border border-mes-gray-50" />생산품목 추적(정전개)</span>
              </div>
              <SearchControl />
            </div>
          </>
        }
        master={
          <DenseTable
            headers={["선택", "LOT No", "품목", "품목 구분", "단위", "수량", "설비", "담당자", "입고처", "입고(생산)일", "검사여부", "출하처", "출하일"]}
            widths={[56, 192, 192, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]}
            rows={lotMasterRows}
            selectedRow={1}
          />
        }
        detailTitle="↳  투입품목 상세"
        detail={
          <DenseTable
            headers={["LOT No", "품목", "품목 구분", "단위", "수량", "투입수량", "잔량", "ROUTE명", "설비", "담당자", "입고처", "입고(생산)일", "검사여부", "투입일"]}
            widths={[210, 210, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}
            rows={lotDetailRows}
          />
        }
        footer={<div className="flex gap-2.5"><SmallButton><Copy size={16} /> 복사</SmallButton><SmallButton><Download size={16} /> 다운로드</SmallButton></div>}
      />
    </FigmaScreenPreview>
  );
}

const metricCards = [
  { title: "판매 계획 달성률", value: "83%", accent: "bg-mes-primary-60", left: ["당월 판매 계획", "5,000백만원"], right: ["당월 출하 실적", "4,500백만원"] },
  { title: "생산계획 진척률", value: "83%", accent: "bg-mes-primary-60", left: ["당월 생산 계획", "5,000백만원"], right: ["당월 생산 실적", "4,500백만원"] },
  { title: "당월 생산계획 증감률", value: "10.5%", accent: "text-mes-primary-60", left: ["당월 계획", "5,000백만원"], right: ["전월 계획", "4,500백만원"] },
  { title: "종합 불량 증감률", value: "37.7%", accent: "text-mes-danger-60", left: ["당월 불량률", "3.25%"], right: ["전월 불량률", "5.24%"] },
];

function MetricCard({ item, index }: { item: (typeof metricCards)[number]; index: number }) {
  return (
    <div className="flex h-[106px] flex-col rounded-xl bg-mes-gray-20 p-4">
      <div className="flex items-center justify-between"><b className="text-[15px]">{item.title}</b><strong className="text-[24px]">{index > 1 && <span className={item.accent}>↗ </span>}{item.value}</strong></div>
      {index < 2 && <div className="mt-3 h-2 overflow-hidden rounded-full bg-mes-gray-40"><div className={`h-full w-[83%] ${item.accent}`} /></div>}
      <div className="mt-auto grid grid-cols-2 divide-x divide-mes-gray-30 rounded-lg bg-white py-2 text-center text-[12px]">
        {[item.left, item.right].map((value, itemIndex) => <div key={itemIndex}><span className="block text-mes-gray-80">{value[0]}</span><b>{value[1]}</b></div>)}
      </div>
    </div>
  );
}

function HorizontalBars({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <div className="flex flex-1 flex-col justify-around py-3">
      {labels.map((label, index) => <div key={label} className="grid grid-cols-[55px_1fr] items-center gap-2 text-[12px]"><span className="text-right">{label}</span><span className="relative h-5 border-l border-mes-gray-30"><span className="block h-4 rounded-r bg-mes-primary-60" style={{ width: `${values[index]}%` }} /><b className="absolute left-1 top-0 text-[10px] text-white">{index === 0 ? values[index] : values[index] * 10}</b></span></div>)}
    </div>
  );
}

function ProductionChart() {
  const bars = [63, 31, 50, 24, 84, 31, 51, 25, 61, 31, 79, 43];
  return (
    <div className="relative flex flex-1 items-end gap-4 border-b border-mes-gray-30 px-10 pb-5 pt-5">
      {bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center justify-end gap-1 text-[10px] text-mes-gray-60"><span className="w-8 rounded-t bg-mes-primary-30" style={{ height: value * 1.7 }} /><span>A{index + 1}</span></div>)}
      <svg className="pointer-events-none absolute inset-x-10 top-8 h-[120px] w-[calc(100%-80px)]" viewBox="0 0 600 120" preserveAspectRatio="none" aria-label="불량률 추이">
        <polyline points="0,30 55,68 110,42 165,75 220,74 275,18 330,62 385,78 440,51 495,62 550,41 600,60" fill="none" stroke="#f04452" strokeWidth="2" />
        {[0,55,110,165,220,275,330,385,440,495,550,600].map((x, i) => <circle key={i} cx={x} cy={[30,68,42,75,74,18,62,78,51,62,41,60][i]} r="3" fill="#f04452" />)}
      </svg>
    </div>
  );
}

function CompletedAnalyticsExample() {
  return (
    <FigmaScreenPreview>
      <AnalyticsDashboardPattern
        navigation={<MesFixtureSidebar dashboard />}
        tabs={<MesPageTabs active="생산분석 현황" />}
        metrics={metricCards.map((item, index) => ({ id: String(index), content: <MetricCard item={item} index={index} /> }))}
        panels={[
          { id: "summary", title: "", content: <div className="h-full"><div className="mb-2 flex gap-2"><ControlBox className="w-[140px] justify-between">2025년 09월⌄</ControlBox><ControlBox className="w-[130px] justify-between">성형⌄</ControlBox></div><DenseTable headers={["설비", "양품(백만원)", "불량(백만원)", "불량률(%)"]} rows={Array.from({ length: 5 }, () => ["A1", "5,000", "30", "0.6"])} /></div> },
          { id: "production", title: "생산실적 현황", content: <ProductionChart /> },
          { id: "defect", title: "TOP5 불량유형", content: <HorizontalBars labels={["기타", "오무힘", "중량불량", "찍힘", "스크래치"]} values={[57, 35, 8, 30, 5]} /> },
          { id: "top", title: "TOP5 생산품", content: <HorizontalBars labels={["빙빙", "누가바", "돼지바", "비비빅", "팥빙수"]} values={[95, 55, 85, 48, 80]} /> },
        ]}
      />
    </FigmaScreenPreview>
  );
}

export { CompletedAnalyticsExample, CompletedEntityListExample, CompletedMasterDetailExample };
