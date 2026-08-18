"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrototypeCard } from "./prototype-shell";

const line = "lineBlacktxt" as const;


export function ExperimentalProcessFlowDiagram() {
  const [active, setActive] = useState(1);
  const steps = ["원료", "압출", "성형", "포장"];
  return <PrototypeCard title="공정 흐름도" code="ExperimentalProcessFlowDiagram" kind="패턴"><div className="flex items-center gap-1 overflow-x-auto">{steps.map((step, index) => <div key={step} className="flex items-center gap-1"><Button size="xsmall" variant={active === index ? "fillBlack" : line} onClick={() => setActive(index)}>{step}</Button>{index < steps.length - 1 && <span className="text-mes-gray-50">→</span>}</div>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">현재 공정: {steps[active]}</p></PrototypeCard>;
}


export function ExperimentalFactoryLayoutView() {
  const [selected, setSelected] = useState("성형 1호기");
  const machines = ["압출 1호기", "성형 1호기", "성형 2호기", "분쇄 1호기"];
  return <PrototypeCard title="공장 배치도" code="ExperimentalFactoryLayoutView" kind="템플릿"><div className="grid grid-cols-3 gap-2 rounded-mes-control border border-mes-gray-30 bg-mes-gray-10 p-3">{machines.map((machine, index) => <Button key={machine} size="xsmall" variant={selected === machine ? "fillBlack" : line} className={index === 0 ? "col-span-2" : ""} onClick={() => setSelected(machine)}>{machine}</Button>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">선택 설비: {selected}</p></PrototypeCard>;
}



export function ExperimentalProductionGantt() {
  const [scale, setScale] = useState("시간");
  return <PrototypeCard title="생산 간트 차트" code="ExperimentalProductionGantt" kind="패턴"><div className="mb-2 flex gap-1"><Button size="xsmall" variant={scale === "시간" ? "fillBlack" : line} onClick={() => setScale("시간")}>시간</Button><Button size="xsmall" variant={scale === "일" ? "fillBlack" : line} onClick={() => setScale("일")}>일</Button></div><div className="space-y-2">{[["압출 1호기", "ml-[8%] w-[58%]"], ["성형 1호기", "ml-[28%] w-[42%]"], ["포장 1라인", "ml-[58%] w-[30%]"]].map(([name, classes]) => <div key={name} className="grid grid-cols-[80px_1fr] items-center gap-2"><span className="text-[11px]">{name}</span><div className="h-5 rounded bg-mes-gray-20"><div className={`h-full rounded bg-mes-primary-60 ${classes}`} /></div></div>)}</div><p className="mt-2 text-[11px] text-mes-gray-60">표시 단위: {scale}</p></PrototypeCard>;
}

export function ExperimentalShiftScheduleCalendar() {
  const [selected, setSelected] = useState(18);
  return <PrototypeCard title="교대 일정 달력" code="ExperimentalShiftScheduleCalendar" kind="패턴"><div className="grid grid-cols-7 gap-1">{Array.from({ length: 14 }, (_, index) => index + 12).map((day) => <Button key={day} size="xsmall" variant={selected === day ? "fillBlack" : line} className="h-9 px-0" onClick={() => setSelected(day)}>{day}</Button>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">8월 {selected}일 · A조 주간 / B조 야간</p></PrototypeCard>;
}


export function ExperimentalDefectParetoChart() {
  const [active, setActive] = useState(0);
  const defects = [["스크래치", 92], ["변형", 68], ["오염", 43], ["미성형", 25]] as const;
  return <PrototypeCard title="불량 파레토 차트" code="ExperimentalDefectParetoChart" kind="패턴"><div className="space-y-2">{defects.map(([name, value], index) => <Button key={name} size="xsmall" variant={active === index ? "fillBlack" : "fillGray"} className="flex w-full justify-start px-2" onClick={() => setActive(index)}><span className="w-16 text-left">{name}</span><span className="h-2 rounded bg-mes-primary-40" style={{ width: `${value}%` }} /></Button>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">선택: {defects[active][0]} {defects[active][1]}건</p></PrototypeCard>;
}


export function ExperimentalLabelPrintPreview() {
  const [quantity, setQuantity] = useState("12");
  return <PrototypeCard title="라벨 인쇄 미리보기" code="ExperimentalLabelPrintPreview" kind="패턴"><div className="grid grid-cols-[1fr_100px] gap-3"><div className="rounded-mes-control border-2 border-mes-gray-100 p-3 text-[11px]"><strong className="text-[15px]">트레이 A</strong><p className="mt-2">LOT FG-20260818-01</p><p>수량 {quantity} EA</p><div className="mt-2 flex h-5 items-stretch gap-px">{Array.from({ length: 28 }, (_, index) => <span key={index} className={index % 3 === 0 ? "w-0.5 bg-mes-gray-130" : "w-px bg-mes-gray-90"} />)}</div></div><div><Input aria-label="라벨 수량" value={quantity} onChange={(event) => setQuantity(event.target.value.replace(/\D/g, ""))} /><Button size="xsmall" variant="fillBlack" className="mt-2 w-full">인쇄</Button></div></div></PrototypeCard>;
}

export function ExperimentalESignaturePad() {
  const [signed, setSigned] = useState(false);
  return <PrototypeCard title="전자서명 패드" code="ExperimentalESignaturePad" kind="패턴"><div className="grid h-28 place-items-center rounded-mes-control border border-dashed border-mes-gray-50 bg-mes-gray-10">{signed ? <span className="rotate-[-8deg] text-[24px] italic text-mes-gray-120">Lee H.B.</span> : <span className="text-[12px] text-mes-gray-60">서명 영역</span>}</div><div className="mt-2 flex gap-1"><Button size="xsmall" variant="fillBlack" onClick={() => setSigned(true)}>서명 입력</Button><Button size="xsmall" variant={line} onClick={() => setSigned(false)}>지우기</Button></div></PrototypeCard>;
}




export function ExperimentalSkipLink() {
  const [focused, setFocused] = useState(false);
  return <PrototypeCard title="본문 바로가기" code="ExperimentalSkipLink" kind="컴포넌트"><Button size="xsmall" variant="fillBlack" onClick={() => setFocused(true)}>본문으로 건너뛰기</Button><div className={`mt-3 rounded-mes-control border p-3 text-[12px] ${focused ? "border-mes-primary-60 bg-mes-gray-10" : "border-mes-gray-30"}`}>주요 콘텐츠 시작점</div></PrototypeCard>;
}

export function ExperimentalVisuallyHidden() {
  const [announced, setAnnounced] = useState(false);
  return <PrototypeCard title="시각적으로 숨김" code="ExperimentalVisuallyHidden" kind="유틸리티"><Button size="xsmall" variant={line} onClick={() => setAnnounced((value) => !value)}>스크린리더 문구 상태 변경</Button><span className="sr-only" aria-live="polite">{announced ? "생산실적 저장이 완료되었습니다" : "대기 중"}</span><p className="mt-2 text-[12px] text-mes-gray-70">화면에는 보이지 않고 보조기기에만 {announced ? "완료 문구" : "대기 문구"}를 전달합니다.</p></PrototypeCard>;
}
