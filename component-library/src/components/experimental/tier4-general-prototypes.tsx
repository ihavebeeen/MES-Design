"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrototypeCard } from "./prototype-shell";

const line = "lineBlacktxt" as const;

export function ExperimentalSegmentedControl() {
  const [value, setValue] = useState("전체");
  return <PrototypeCard title="세그먼트 컨트롤 · 계약 보완 필요" code="ExperimentalSegmentedControl" kind="컴포넌트"><div className="inline-flex rounded-mes-control bg-mes-gray-20 p-1" role="radiogroup" aria-label="설비 상태"><Button role="radio" aria-checked={value === "전체"} size="xsmall" variant={value === "전체" ? "fillBlack" : "fillGray"} onClick={() => setValue("전체")}>전체</Button><Button role="radio" aria-checked={value === "가동"} size="xsmall" variant={value === "가동" ? "fillBlack" : "fillGray"} onClick={() => setValue("가동")}>가동</Button><Button role="radio" aria-checked={value === "비가동"} size="xsmall" variant={value === "비가동" ? "fillBlack" : "fillGray"} onClick={() => setValue("비가동")}>비가동</Button></div><p className="mt-2 text-[12px] text-mes-gray-70">선택: {value} · 방향키 이동 계약은 미구현</p></PrototypeCard>;
}

export function ExperimentalAvatar() {
  const [online, setOnline] = useState(true);
  return <PrototypeCard title="사용자 아바타" code="ExperimentalAvatar" kind="컴포넌트"><div className="flex items-center gap-3"><div className="relative flex size-10 items-center justify-center rounded-full bg-mes-gray-110 text-[13px] font-semibold text-white">이해{online && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-mes-primary-60" />}</div><div><p className="text-[13px] font-semibold">이해빈</p><p className="text-[11px] text-mes-gray-60">생산관리자</p></div><Button size="xsmall" variant={line} onClick={() => setOnline((current) => !current)}>{online ? "오프라인" : "온라인"}</Button></div></PrototypeCard>;
}

export function ExperimentalProgressCircle() {
  const [value, setValue] = useState(68);
  return <PrototypeCard title="원형 진행률" code="ExperimentalProgressCircle" kind="컴포넌트"><div className="flex items-center gap-4"><div className="grid size-20 place-items-center rounded-full" style={{ background: `conic-gradient(var(--mes-primary-60) ${value}%, var(--mes-gray-30) 0)` }}><div className="grid size-14 place-items-center rounded-full bg-white text-[14px] font-bold">{value}%</div></div><div className="flex gap-1"><Button size="xsmall" variant={line} onClick={() => setValue((current) => Math.max(0, current - 10))}>−10</Button><Button size="xsmall" variant={line} onClick={() => setValue((current) => Math.min(100, current + 10))}>+10</Button></div></div></PrototypeCard>;
}

export function ExperimentalOverflowList() {
  const [expanded, setExpanded] = useState(false);
  const items = ["김성형", "이해빈", "박성형", "최관리", "정품질"];
  const visible = expanded ? items : items.slice(0, 3);
  return <PrototypeCard title="넘침 목록" code="ExperimentalOverflowList" kind="컴포넌트"><div className="flex flex-wrap gap-1">{visible.map((item) => <Badge key={item} variant="gray">{item}</Badge>)}{!expanded && <Button size="xsmall" variant={line} onClick={() => setExpanded(true)}>+{items.length - visible.length} 더보기</Button>}</div></PrototypeCard>;
}
