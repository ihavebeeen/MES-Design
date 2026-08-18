"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PrototypeCard } from "./prototype-shell";

const gridRows = [
  ["LOT-AA-11", "투명 시트", "압출", "3,000", "원재료 창고"],
  ["LOT-AA-12", "불투명 시트", "성형", "2,400", "반제품 창고"],
  ["LOT-AA-13", "재생 원료", "분쇄", "980", "재생재 창고"],
];

export function ExperimentalFrozenColumnGrid() {
  return (
    <PrototypeCard title="고정 컬럼 그리드" code="ExperimentalFrozenColumnGrid" kind="패턴">
      <div className="overflow-x-auto rounded-mes-control border border-mes-gray-30">
        <div className="min-w-[720px] text-[12px]">
          {["LOT-NO", "품목", "공정", "수량", "창고"].map((header, index) => <span key={header} className={`inline-flex h-8 w-36 items-center border-b border-r border-mes-gray-30 bg-mes-gray-10 px-3 font-semibold ${index === 0 ? "sticky left-0 z-10 bg-mes-gray-20" : ""}`}>{header}</span>)}
          {gridRows.flatMap((row, rowIndex) => row.map((cell, index) => <span key={`${rowIndex}-${cell}`} className={`inline-flex h-8 w-36 items-center border-b border-r border-mes-gray-30 px-3 ${index === 0 ? "sticky left-0 z-10 bg-white font-medium" : "bg-white"}`}>{cell}</span>))}
        </div>
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalGroupedHeaderGrid() {
  return (
    <PrototypeCard title="그룹 헤더 그리드" code="ExperimentalGroupedHeaderGrid" kind="패턴">
      <div className="overflow-hidden rounded-mes-control border border-mes-gray-30 text-[12px]">
        <div className="grid grid-cols-4 bg-mes-gray-10 text-center font-semibold">
          <span className="row-span-2 flex items-center justify-center border-r border-mes-gray-30">설비</span><span className="col-span-2 border-b border-r border-mes-gray-30 py-1.5">생산실적</span><span className="row-span-2 flex items-center justify-center">가동률</span>
          <span className="border-r border-mes-gray-30 py-1.5">양품</span><span className="border-r border-mes-gray-30 py-1.5">불량</span>
        </div>
        {[["성형 1호기", "12,400", "84", "92%"], ["성형 2호기", "10,800", "126", "87%"]].map((row) => <div key={row[0]} className="grid grid-cols-4 border-t border-mes-gray-30 bg-white text-center">{row.map((cell) => <span key={cell} className="border-r border-mes-gray-30 px-2 py-2 last:border-r-0">{cell}</span>)}</div>)}
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalColumnControls() {
  const [itemWidth, setItemWidth] = useState(160);
  const [showProcess, setShowProcess] = useState(true);
  const [reversed, setReversed] = useState(false);
  const columns = reversed ? ["수량", "품목"] : ["품목", "수량"];
  return (
    <PrototypeCard title="컬럼 크기·순서·표시" code="ExperimentalColumnControls" kind="패턴">
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-mes-control bg-mes-gray-10 p-2">
        <label className="flex items-center gap-2 text-[12px]">품목 너비<Input type="range" min={110} max={220} value={itemWidth} onChange={(event) => setItemWidth(Number(event.target.value))} className="h-2 w-28 appearance-none border-0 bg-mes-gray-30 p-0 accent-mes-primary-60" /></label>
        <label className="flex cursor-pointer items-center gap-2 text-[12px]"><Checkbox size="small" checked={showProcess} onChange={(event) => setShowProcess(event.target.checked)} />공정 표시</label>
        <Button size="xsmall" variant="lineBlacktxt" onClick={() => setReversed((current) => !current)}>품목·수량 순서 변경</Button>
      </div>
      <div className="flex overflow-hidden rounded-mes-control border border-mes-gray-30 text-[12px]">
        {columns.map((column) => <div key={column} style={{ width: column === "품목" ? itemWidth : 100 }} className="shrink-0 border-r border-mes-gray-30"><p className="bg-mes-gray-10 px-3 py-2 font-semibold">{column}</p><p className="border-t border-mes-gray-30 px-3 py-2">{column === "품목" ? "투명 시트" : "3,000"}</p></div>)}
        {showProcess && <div className="w-28 shrink-0"><p className="bg-mes-gray-10 px-3 py-2 font-semibold">공정</p><p className="border-t border-mes-gray-30 px-3 py-2">압출</p></div>}
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalVirtualScrollGrid() {
  const rowHeight = 28;
  const total = 1000;
  const viewport = 168;
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const count = Math.ceil(viewport / rowHeight) + 4;
  const visible = Array.from({ length: Math.min(count, total - start) }, (_, index) => start + index);
  return (
    <PrototypeCard title="가상 스크롤 그리드" code="ExperimentalVirtualScrollGrid" kind="패턴">
      <div className="rounded-mes-control border border-mes-gray-30">
        <div className="grid h-8 grid-cols-[80px_1fr_100px] items-center bg-mes-gray-10 px-3 text-[12px] font-semibold"><span>번호</span><span>품목</span><span>수량</span></div>
        <div className="relative overflow-y-auto" style={{ height: viewport }} onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}>
          <div style={{ height: total * rowHeight }} />
          <div className="absolute left-0 right-0 top-0" style={{ transform: `translateY(${start * rowHeight}px)` }}>
            {visible.map((index) => <div key={index} className="grid grid-cols-[80px_1fr_100px] items-center border-b border-mes-gray-30 px-3 text-[12px]" style={{ height: rowHeight }}><span>{index + 1}</span><span>품목 {String(index + 1).padStart(4, "0")}</span><span>{((index + 1) * 10).toLocaleString()}</span></div>)}
          </div>
        </div>
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalRealtimeGridIndicator() {
  const [version, setVersion] = useState(1);
  return (
    <PrototypeCard title="실시간 갱신 표시" code="ExperimentalRealtimeGridIndicator" kind="패턴">
      <div className="mb-2 flex items-center justify-between"><Badge variant="blueLight">● 연결됨 · 갱신 {version}회</Badge><Button size="xsmall" variant="lineBlacktxt" onClick={() => setVersion((current) => current + 1)}>새 데이터 반영</Button></div>
      <div className="grid grid-cols-[1fr_100px_100px] rounded-mes-control border border-mes-gray-30 text-[12px]"><span className="bg-mes-gray-10 px-3 py-2 font-semibold">설비</span><span className="bg-mes-gray-10 px-3 py-2 font-semibold">현재 생산량</span><span className="bg-mes-gray-10 px-3 py-2 font-semibold">갱신</span><span className="border-t border-mes-gray-30 px-3 py-2">성형 1호기</span><span className="border-t border-mes-gray-30 px-3 py-2">{(12400 + version * 8).toLocaleString()}</span><span className="border-t border-mes-gray-30 px-3 py-2 text-mes-primary-60">방금 전</span></div>
    </PrototypeCard>
  );
}
