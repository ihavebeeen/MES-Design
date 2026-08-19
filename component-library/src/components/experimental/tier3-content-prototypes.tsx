"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrototypeCard } from "./prototype-shell";

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
    <PrototypeCard title="검색어 강조 · 수정 필요" code="ExperimentalSearchHighlight" kind="컴포넌트">
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="강조할 검색어" />
      <ul className="mt-3 divide-y divide-mes-gray-30 rounded-mes-control border border-mes-gray-30 px-3">{rows.map((row) => <li key={row} className="py-2 text-[13px]"><Highlight text={row} query={query} /></li>)}</ul>
    </PrototypeCard>
  );
}
