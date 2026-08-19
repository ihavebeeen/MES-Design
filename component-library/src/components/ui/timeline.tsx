import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineItem { id: string; time?: React.ReactNode; title: React.ReactNode; detail?: React.ReactNode }
export interface TimelineProps { items: TimelineItem[]; className?: string }

/** 시간 순서가 의미를 갖는 변경·작업 이력을 표시한다. 단순 목록에는 List를 사용한다. */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={className}>
      {items.map((item, index) => (
        <li key={item.id} className={cn("grid grid-cols-[48px_14px_1fr] gap-2", index === items.length - 1 && "last:pb-0")}>
          <time className="pt-0.5 text-[11px] text-mes-gray-60">{item.time}</time>
          <span className="relative flex justify-center"><span className="mt-1.5 size-2 rounded-full bg-mes-gray-130" />{index < items.length - 1 && <span className="absolute bottom-0 top-3 w-px bg-mes-gray-30" />}</span>
          <div className="pb-4"><p className="text-[13px] font-semibold text-mes-gray-110">{item.title}</p>{item.detail && <p className="mt-0.5 text-[12px] text-mes-gray-70">{item.detail}</p>}</div>
        </li>
      ))}
    </ol>
  );
}
