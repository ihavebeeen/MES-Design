import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Descriptions (상세 정보 키-값 리스트) — Figma에 전용 컴포넌트 없음(체크리스트
 * 티어2 "Descriptions (Key-Value List)", 상태 "없음", 재탐색 안 함 — 판단값 우선).
 * 좌측 라벨(gray70) + 우측 값(text-default) 행을 나열, 구분선은 Table과 동일한 gray30.
 */
export interface DescriptionItem {
  label: string;
  value: React.ReactNode;
}

export interface DescriptionsProps {
  items: DescriptionItem[];
  columns?: 1 | 2;
  className?: string;
}

function Descriptions({ items, columns = 1, className }: DescriptionsProps) {
  return (
    <dl
      className={cn(
        "grid gap-0 rounded-mes-control border border-mes-border-default",
        columns === 2 ? "grid-cols-2" : "grid-cols-1",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-center gap-4 border-b border-mes-border-default px-4 py-2.5 last:border-b-0"
        >
          <dt className="w-[100px] shrink-0 text-[13px] text-mes-gray-70">{item.label}</dt>
          <dd className="text-[13px] font-medium text-mes-text-default">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export { Descriptions };
