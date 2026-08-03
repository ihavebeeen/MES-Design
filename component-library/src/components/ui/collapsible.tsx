"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MES Collapsible — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Collapsible", 상태 "없음").
 * Accordion(여러 항목 묶음)과 달리 단일 트리거+콘텐츠 쌍만 다루는 범용 접기/펼치기
 * wrapper. Accordion과 동일하게 `ChevronRight` + `rotate-90` 재사용. 비제어(uncontrolled,
 * `defaultOpen`)·제어(controlled, `open`+`onOpenChange`) 둘 다 지원 — Combobox의 비제어
 * 지원 패턴과 동일.
 */
export interface CollapsibleProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function Collapsible({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1.5 text-left text-[14px] font-medium text-mes-text-default"
      >
        <ChevronRight
          size={16}
          className={cn("shrink-0 text-mes-gray-70 transition-transform", isOpen && "rotate-90")}
        />
        {trigger}
      </button>
      {isOpen && <div className="mt-2 pl-[22px]">{children}</div>}
    </div>
  );
}

export { Collapsible };
