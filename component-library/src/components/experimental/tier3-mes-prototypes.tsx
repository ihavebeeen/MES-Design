"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Descriptions } from "@/components/ui/descriptions";
import { Progress } from "@/components/ui/progress";
import { PrototypeCard } from "./prototype-shell";

const equipment = [
  { name: "성형 1호기", status: "가동", tone: "blue" as const, value: "12,480" },
  { name: "성형 2호기", status: "대기", tone: "grayFill" as const, value: "8,240" },
  { name: "압출 1호기", status: "점검", tone: "red" as const, value: "0" },
  { name: "분쇄 1호기", status: "가동", tone: "blue" as const, value: "3,860" },
];

export function ExperimentalAndonBoard() {
  const [compact, setCompact] = useState(false);
  return (
    <PrototypeCard title="설비 상태판" code="ExperimentalAndonBoard" kind="템플릿" className="xl:col-span-2">
      <div className="mb-3 flex items-center justify-between"><p className="text-[13px] text-mes-gray-70">제1공장 · 2026.08.18 14:30</p><Button size="xsmall" variant="lineBlacktxt" onClick={() => setCompact((current) => !current)}>{compact ? "상세 보기" : "간단히 보기"}</Button></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{equipment.map((item) => <div key={item.name} className="rounded-mes-control border border-mes-gray-30 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[14px] font-semibold">{item.name}</p><Badge variant={item.tone}>{item.status}</Badge></div>{!compact && <><p className="mt-4 text-[11px] text-mes-gray-60">금일 생산량</p><p className="mt-1 text-[22px] font-bold text-mes-gray-130">{item.value}<span className="ml-1 text-[12px] font-normal text-mes-gray-60">EA</span></p></>}</div>)}</div>
    </PrototypeCard>
  );
}

export function ExperimentalEquipmentStatusCard() {
  const [running, setRunning] = useState(true);
  return (
    <PrototypeCard title="설비 상태 카드" code="ExperimentalEquipmentStatusCard" kind="컴포넌트">
      <div className="flex items-center justify-between"><div><p className="text-[15px] font-semibold">압출 1호기</p><p className="text-[11px] text-mes-gray-60">EX-01 · 압출 공정</p></div><Badge variant={running ? "blue" : "grayFill"}>{running ? "가동" : "정지"}</Badge></div>
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-mes-control bg-mes-gray-10 p-3 text-[12px]"><div><span className="text-mes-gray-60">현재 속도</span><strong className="ml-2">42 m/min</strong></div><div><span className="text-mes-gray-60">가동률</span><strong className="ml-2">91%</strong></div></div>
      <Progress value={running ? 91 : 0} className="mt-2 px-0" />
      <div className="mt-2 flex justify-end"><Button size="xsmall" variant="lineBlacktxt" onClick={() => setRunning((current) => !current)}>{running ? "정지 상태 보기" : "가동 상태 보기"}</Button></div>
    </PrototypeCard>
  );
}

export function ExperimentalGauge() {
  const [value, setValue] = useState(68);
  const angle = -90 + value * 1.8;
  return (
    <PrototypeCard title="실시간 게이지" code="ExperimentalGauge" kind="컴포넌트">
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 180 105" className="w-44" role="img" aria-label={`현재 압력 ${value}퍼센트`}>
          <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="currentColor" strokeWidth="12" className="text-mes-gray-30" strokeLinecap="round" />
          <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="currentColor" strokeWidth="12" pathLength="100" strokeDasharray={`${value} 100`} className="text-mes-gray-100" strokeLinecap="round" />
          <line x1="90" y1="90" x2="90" y2="34" stroke="currentColor" strokeWidth="3" className="text-mes-danger-60" transform={`rotate(${angle} 90 90)`} />
          <circle cx="90" cy="90" r="5" className="fill-mes-gray-130" />
        </svg>
        <div><p className="text-[11px] text-mes-gray-60">압력</p><p className="text-[24px] font-bold">{value}<span className="ml-1 text-[12px] font-normal">bar</span></p><div className="mt-2 flex gap-1"><Button size="xsmall" variant="lineBlacktxt" onClick={() => setValue((current) => Math.max(0, current - 5))}>−</Button><Button size="xsmall" variant="lineBlacktxt" onClick={() => setValue((current) => Math.min(100, current + 5))}>+</Button></div></div>
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalOeeWidget() {
  const metrics = [{ label: "가용성", value: 92 }, { label: "성능", value: 87 }, { label: "품질", value: 98 }];
  const oee = Math.round(metrics.reduce((result, metric) => result * (metric.value / 100), 1) * 100);
  return (
    <PrototypeCard title="OEE 위젯" code="ExperimentalOeeWidget" kind="패턴">
      <div className="flex items-end justify-between"><div><p className="text-[11px] text-mes-gray-60">종합설비효율</p><p className="text-[28px] font-bold text-mes-gray-130">{oee}%</p></div><Badge variant="blueLight">목표 80%</Badge></div>
      <div className="mt-3 space-y-2">{metrics.map((metric) => <div key={metric.label} className="grid grid-cols-[52px_1fr] items-center"><span className="text-[12px] text-mes-gray-70">{metric.label}</span><Progress value={metric.value} showLabel className="h-6 px-0" /></div>)}</div>
    </PrototypeCard>
  );
}

const trendPoints = "0,72 35,66 70,74 105,49 140,54 175,30 210,36 245,18 280,24";

export function ExperimentalRealtimeTrend() {
  const [offset, setOffset] = useState(0);
  return (
    <PrototypeCard title="실시간 추이 차트" code="ExperimentalRealtimeTrend" kind="컴포넌트">
      <div className="flex items-center justify-between"><p className="text-[12px] text-mes-gray-70">금형 온도 · 최근 30분</p><Button size="xsmall" variant="lineBlacktxt" onClick={() => setOffset((current) => (current + 5) % 20)}>샘플 갱신</Button></div>
      <svg viewBox="0 0 300 100" className="mt-3 h-28 w-full" role="img" aria-label="금형 온도 추이">
        {[20, 50, 80].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="currentColor" className="text-mes-gray-30" strokeWidth="1" />)}
        <polyline points={trendPoints} fill="none" stroke="currentColor" className="text-mes-primary-60" strokeWidth="2" transform={`translate(0 ${offset / 4})`} />
      </svg>
    </PrototypeCard>
  );
}

export function ExperimentalBlinkingAlarm() {
  const [acknowledged, setAcknowledged] = useState(false);
  return (
    <PrototypeCard title="점멸 알람" code="ExperimentalBlinkingAlarm" kind="컴포넌트">
      <div className={`flex items-center justify-between gap-3 rounded-mes-control border border-mes-danger-30 bg-mes-danger-10 p-3 ${acknowledged ? "" : "animate-pulse"}`}>
        <div><p className="text-[13px] font-semibold text-mes-danger-70">압출 1호기 온도 상한 초과</p><p className="mt-0.5 text-[11px] text-mes-gray-70">14:28:32 · 228℃ / 기준 220℃</p></div><Button size="xsmall" variant={acknowledged ? "fillGray" : "fillRed"} onClick={() => setAcknowledged(true)} disabled={acknowledged}>{acknowledged ? "확인됨" : "알람 확인"}</Button>
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalBomTree() {
  const [expanded, setExpanded] = useState(["product", "sheet"]);
  const toggle = (id: string) => setExpanded((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return (
    <PrototypeCard title="공정·BOM 트리" code="ExperimentalBomTree" kind="패턴">
      <div className="text-[12px]">
        <Button size="xsmall" variant="lineBlacktxt" onClick={() => toggle("product")}>{expanded.includes("product") ? "−" : "+"} 완제품 트레이 A</Button>
        {expanded.includes("product") && <div className="ml-5 mt-2 border-l border-mes-gray-30 pl-3"><div className="flex items-center gap-2"><Button size="xsmall" variant="lineBlacktxt" onClick={() => toggle("sheet")}>{expanded.includes("sheet") ? "−" : "+"} 반제품 시트</Button><Badge variant="grayFill">1.2 kg</Badge></div>{expanded.includes("sheet") && <div className="ml-5 mt-2 space-y-2"><p>원재료 수지 <Badge variant="gray">0.9 kg</Badge></p><p>분쇄재 <Badge variant="gray">0.3 kg</Badge></p></div>}<p className="mt-2">포장재 <Badge variant="gray">1 EA</Badge></p></div>}
      </div>
    </PrototypeCard>
  );
}

const spc = [62, 55, 60, 42, 48, 37, 44, 39, 31, 36];

export function ExperimentalSpcChart() {
  return (
    <PrototypeCard title="SPC 관리도" code="ExperimentalSpcChart" kind="패턴">
      <div className="mb-2 flex gap-3 text-[11px]"><span>UCL 12.6</span><span>CL 12.0</span><span>LCL 11.4</span></div>
      <svg viewBox="0 0 320 100" className="h-28 w-full" role="img" aria-label="SPC X-bar 관리도">
        <line x1="10" x2="310" y1="20" y2="20" stroke="currentColor" className="text-mes-danger-50" strokeDasharray="4 3" /><line x1="10" x2="310" y1="50" y2="50" stroke="currentColor" className="text-mes-gray-60" /><line x1="10" x2="310" y1="80" y2="80" stroke="currentColor" className="text-mes-danger-50" strokeDasharray="4 3" />
        <polyline points={spc.map((y, index) => `${15 + index * 32},${y}`).join(" ")} fill="none" stroke="currentColor" className="text-mes-primary-60" strokeWidth="2" />
        {spc.map((y, index) => <circle key={`${index}-${y}`} cx={15 + index * 32} cy={y} r="3" className="fill-mes-primary-60" />)}
      </svg>
    </PrototypeCard>
  );
}

export function ExperimentalInventoryLevel() {
  const [quantity, setQuantity] = useState(34);
  return (
    <PrototypeCard title="재고 수준 표시" code="ExperimentalInventoryLevel" kind="컴포넌트">
      <div className="flex items-center justify-between"><div><p className="text-[13px] font-semibold">투명 수지</p><p className="text-[11px] text-mes-gray-60">안전재고 25%</p></div><Badge variant={quantity < 25 ? "red" : "blueLight"}>{quantity < 25 ? "부족" : "정상"}</Badge></div>
      <Progress value={quantity} labelTone={quantity < 25 ? "danger" : "default"} className="mt-2 px-0" />
      <div className="mt-2 flex gap-1"><Button size="xsmall" variant="lineBlacktxt" onClick={() => setQuantity((current) => Math.max(0, current - 10))}>사용</Button><Button size="xsmall" variant="lineBlacktxt" onClick={() => setQuantity((current) => Math.min(100, current + 10))}>입고</Button></div>
    </PrototypeCard>
  );
}

export function ExperimentalEquipmentDetailCard() {
  const [tab, setTab] = useState<"info" | "maintenance">("info");
  return (
    <PrototypeCard title="설비 상세 카드" code="ExperimentalEquipmentDetailCard" kind="패턴">
      <div className="mb-3 flex items-center justify-between"><div><p className="text-[15px] font-semibold">성형 1호기</p><p className="text-[11px] text-mes-gray-60">FORM-01</p></div><Badge variant="blue">가동</Badge></div>
      <div className="mb-3 flex gap-1 rounded-mes-control bg-mes-gray-20 p-1"><Button size="xsmall" variant={tab === "info" ? "fillBlack" : "fillGray"} className="flex-1" onClick={() => setTab("info")}>기본정보</Button><Button size="xsmall" variant={tab === "maintenance" ? "fillBlack" : "fillGray"} className="flex-1" onClick={() => setTab("maintenance")}>보전정보</Button></div>
      <Descriptions items={tab === "info" ? [{ label: "공정", value: "성형" }, { label: "현재 품목", value: "트레이 A" }, { label: "담당자", value: "이해빈" }] : [{ label: "최근 점검", value: "2026-08-12" }, { label: "다음 점검", value: "2026-09-12" }, { label: "누적 가동", value: "2,481 h" }]} />
    </PrototypeCard>
  );
}
