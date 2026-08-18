"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
