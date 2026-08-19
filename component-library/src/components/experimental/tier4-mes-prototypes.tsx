"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PrototypeCard } from "./prototype-shell";

const line = "lineBlacktxt" as const;

export function ExperimentalProcessFlowDiagram() {
  const [active, setActive] = useState(1);
  const steps = ["원료", "압출", "성형", "포장"];
  return <PrototypeCard title="공정 흐름도" code="ExperimentalProcessFlowDiagram" kind="패턴"><div className="flex items-center gap-1 overflow-x-auto">{steps.map((step, index) => <div key={step} className="flex items-center gap-1"><Button size="xsmall" variant={active === index ? "fillBlack" : line} onClick={() => setActive(index)}>{step}</Button>{index < steps.length - 1 && <span className="text-mes-gray-50">→</span>}</div>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">현재 공정: {steps[active]}</p></PrototypeCard>;
}

export function ExperimentalProductionGantt() {
  const [scale, setScale] = useState("시간");
  return <PrototypeCard title="생산 간트 차트" code="ExperimentalProductionGantt" kind="패턴"><div className="mb-2 flex gap-1"><Button size="xsmall" variant={scale === "시간" ? "fillBlack" : line} onClick={() => setScale("시간")}>시간</Button><Button size="xsmall" variant={scale === "일" ? "fillBlack" : line} onClick={() => setScale("일")}>일</Button></div><div className="space-y-2">{[["압출 1호기", "ml-[8%] w-[58%]"], ["성형 1호기", "ml-[28%] w-[42%]"], ["포장 1라인", "ml-[58%] w-[30%]"]].map(([name, classes]) => <div key={name} className="grid grid-cols-[80px_1fr] items-center gap-2"><span className="text-[11px]">{name}</span><div className="h-5 rounded bg-mes-gray-20"><div className={`h-full rounded bg-mes-primary-60 ${classes}`} /></div></div>)}</div><p className="mt-2 text-[11px] text-mes-gray-60">표시 단위: {scale}</p></PrototypeCard>;
}
