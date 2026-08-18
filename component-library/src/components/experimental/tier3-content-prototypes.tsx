"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Descriptions } from "@/components/ui/descriptions";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { PrototypeCard } from "./prototype-shell";

export function ExperimentalTimeline() {
  const events = [
    { time: "08:30", title: "작업 시작", detail: "압출 1호기 · 이해빈" },
    { time: "10:12", title: "원료 LOT 변경", detail: "RM-260818-04" },
    { time: "11:05", title: "일시 정지", detail: "금형 점검" },
  ];
  return (
    <PrototypeCard title="이력 타임라인" code="ExperimentalTimeline" kind="컴포넌트">
      <ol>
        {events.map((event, index) => (
          <li key={`${event.time}-${event.title}`} className="grid grid-cols-[48px_14px_1fr] gap-2">
            <time className="pt-0.5 text-[11px] text-mes-gray-60">{event.time}</time>
            <span className="relative flex justify-center"><span className="mt-1.5 size-2 rounded-full bg-mes-gray-130" />{index < events.length - 1 && <span className="absolute bottom-0 top-3 w-px bg-mes-gray-30" />}</span>
            <div className="pb-4"><p className="text-[13px] font-semibold text-mes-gray-110">{event.title}</p><p className="mt-0.5 text-[12px] text-mes-gray-70">{event.detail}</p></div>
          </li>
        ))}
      </ol>
    </PrototypeCard>
  );
}

export function ExperimentalTreeView() {
  const [expanded, setExpanded] = useState(["factory", "forming"]);
  const toggle = (id: string) => setExpanded((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return (
    <PrototypeCard title="트리 보기" code="ExperimentalTreeView" kind="컴포넌트">
      <div className="text-[13px] text-mes-gray-100">
        <Button size="xsmall" variant="lineBlacktxt" onClick={() => toggle("factory")}>{expanded.includes("factory") ? "−" : "+"} 제1공장</Button>
        {expanded.includes("factory") && <div className="ml-4 mt-2 border-l border-mes-gray-30 pl-3">
          <Button size="xsmall" variant="lineBlacktxt" onClick={() => toggle("forming")}>{expanded.includes("forming") ? "−" : "+"} 성형 공정</Button>
          {expanded.includes("forming") && <div className="ml-4 mt-2 space-y-2"><p>성형 1호기</p><p>성형 2호기</p></div>}
          <p className="mt-2">포장 공정</p>
        </div>}
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalImageThumbnail() {
  const [selected, setSelected] = useState(0);
  const labels = ["품목 정면", "라벨", "포장 상태"];
  return (
    <PrototypeCard title="이미지 썸네일" code="ExperimentalImageThumbnail" kind="컴포넌트">
      <div className="grid grid-cols-3 gap-3">
        {labels.map((label, index) => (
          <Button key={label} variant="lineBlacktxt" className={`h-auto min-w-0 flex-col px-2 py-2 ${selected === index ? "border-mes-gray-130" : ""}`} onClick={() => setSelected(index)}>
            <span className="mb-2 flex aspect-square w-full items-center justify-center rounded-mes-control bg-mes-gray-20 text-[24px] text-mes-gray-50">▧</span>
            <span className="max-w-full truncate text-[12px]">{label}</span>
          </Button>
        ))}
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalRowExpandDetail() {
  const [open, setOpen] = useState(false);
  return (
    <PrototypeCard title="행 상세 펼침" code="ExperimentalRowExpandDetail" kind="패턴">
      <div className="overflow-hidden rounded-mes-control border border-mes-gray-30">
        <div className="grid grid-cols-[32px_1fr_1fr_100px] items-center bg-mes-gray-10 px-3 py-2 text-[12px] font-semibold"><span /><span>LOT-NO</span><span>품목</span><span>수량</span></div>
        <div className="grid grid-cols-[32px_1fr_1fr_100px] items-center border-t border-mes-gray-30 px-3 py-2 text-[13px]">
          <Button aria-label="상세 펼치기" size="xsmall" variant="lineBlacktxt" className="size-[22px] p-0" onClick={() => setOpen((current) => !current)}>{open ? "−" : "+"}</Button><span>LOT-AA-11</span><span>투명 시트</span><span>3,000 kg</span>
        </div>
        {open && <div className="border-t border-mes-gray-30 bg-mes-gray-10 p-3"><Descriptions columns={2} items={[{ label: "창고", value: "원재료 창고" }, { label: "입고일", value: "2026-08-18" }, { label: "공급처", value: "대한소재" }, { label: "검사상태", value: "합격" }]} /></div>}
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalGlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = ["생산실적 등록", "LOT 추적", "설비 상태", "품목 등록"].filter((item) => item.includes(query));
  return (
    <PrototypeCard title="전체 검색" code="ExperimentalGlobalSearch" kind="패턴">
      <Button variant="lineBlacktxt" className="w-full justify-between" onClick={() => setOpen(true)}><span>메뉴·LOT·품목 전체 검색</span><span className="text-[11px] text-mes-gray-60">Ctrl K</span></Button>
      {open && <div className="mt-3 rounded-mes-control border border-mes-gray-40 bg-white p-3 shadow-mes-panel">
        <SearchInput width="fill" value={query} onChange={setQuery} placeholder="검색어 입력" />
        <div className="mt-2 space-y-1">{results.map((result) => <Button key={result} size="small" variant="lineBlacktxt" className="w-full justify-start" onClick={() => setOpen(false)}>{result}</Button>)}</div>
        <div className="mt-2 flex justify-end"><Button size="xsmall" variant="fillGray" onClick={() => setOpen(false)}>닫기</Button></div>
      </div>}
    </PrototypeCard>
  );
}



function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return <>{text}</>;
  return <>{text.slice(0, index)}<mark className="bg-mes-primary-20 text-mes-gray-130">{text.slice(index, index + query.length)}</mark>{text.slice(index + query.length)}</>;
}

export function ExperimentalSearchHighlight() {
  const [query, setQuery] = useState("투명");
  const rows = ["투명 시트 0.8T", "불투명 시트 1.0T", "재생 투명 원료"];
  return (
    <PrototypeCard title="검색어 강조" code="ExperimentalSearchHighlight" kind="컴포넌트">
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="강조할 검색어" />
      <ul className="mt-3 divide-y divide-mes-gray-30 rounded-mes-control border border-mes-gray-30 px-3">{rows.map((row) => <li key={row} className="py-2 text-[13px]"><Highlight text={row} query={query} /></li>)}</ul>
    </PrototypeCard>
  );
}


export function ExperimentalResizablePanel() {
  return (
    <PrototypeCard title="크기 조절 패널" code="ExperimentalResizablePanel" kind="컴포넌트">
      <div className="max-w-full resize-x overflow-auto rounded-mes-control border border-mes-gray-40 bg-mes-gray-10 p-3" style={{ width: 320, minWidth: 220, maxWidth: "100%" }}>
        <p className="text-[13px] font-semibold text-mes-gray-110">상세 정보</p><p className="mt-2 text-[12px] leading-5 text-mes-gray-70">우측 아래 브라우저 크기 조절 핸들로 패널 너비를 변경할 수 있습니다.</p>
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalResizablePopup() {
  const [position, setPosition] = useState({ x: 30, y: 18 });
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!dragging) return;
    const move = (event: PointerEvent) => setPosition({ x: Math.max(0, Math.min(180, event.clientX % 240)), y: Math.max(0, Math.min(70, event.clientY % 100)) });
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [dragging]);
  return (
    <PrototypeCard title="이동·크기 조절 팝업" code="ExperimentalResizablePopup" kind="패턴">
      <div className="relative h-48 overflow-hidden rounded-mes-control bg-mes-gray-20">
        <div className="absolute min-h-28 min-w-56 resize overflow-auto rounded-mes-control border border-mes-gray-40 bg-white shadow-mes-modal" style={{ left: position.x, top: position.y, width: 300 }}>
          <div className="cursor-move border-b border-mes-gray-30 px-3 py-2 text-[13px] font-semibold" onPointerDown={() => setDragging(true)}>검사 결과 상세</div>
          <p className="p-3 text-[12px] text-mes-gray-70">헤더를 드래그하거나 우측 아래에서 크기를 조절합니다.</p>
        </div>
      </div>
    </PrototypeCard>
  );
}
