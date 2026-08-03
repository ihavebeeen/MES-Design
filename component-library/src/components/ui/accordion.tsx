"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MES Accordion — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Accordion", 상태 "없음").
 * Tooltip과 같은 이유로 `@radix-ui/react-accordion` 의존성을 새로 추가하지 않고 순수
 * React state로 경량 구현. 확장 화살표는 이 페이지의 Table 합본 데모(`table-full`
 * 섹션)가 이미 쓰고 있는 `ChevronRight` + `rotate-90` 회전 규칙을 그대로 재사용.
 * `type="single"`이면 한 번에 하나만, `"multiple"`(기본값)이면 여러 개 동시에 펼침.
 */
export interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemData[];
  type?: "single" | "multiple";
  defaultOpenIds?: string[];
  className?: string;
}

function Accordion({ items, type = "multiple", defaultOpenIds = [], className }: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set(defaultOpenIds));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = type === "single" ? new Set<string>() : new Set(prev);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={cn("flex flex-col rounded-mes-control border border-mes-border-default", className)}
    >
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className={cn(index !== 0 && "border-t border-mes-border-default")}>
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[14px] font-medium text-mes-text-default disabled:pointer-events-none disabled:text-mes-gray-60"
            >
              {item.title}
              <ChevronRight
                size={16}
                className={cn(
                  "shrink-0 text-mes-gray-70 transition-transform",
                  isOpen && "rotate-90"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-3 text-[13px] leading-[1.5] text-mes-gray-80">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { Accordion };
