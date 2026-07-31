"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Tooltip — Figma 디자인 없음(체크리스트 티어2 "Tooltip", 상태 "없음").
 *
 * 이 프로젝트가 이미 쓰고 있는 Radix 계열(react-dialog/react-popover/react-select)에
 * `@radix-ui/react-tooltip`을 추가하는 대신, 의존성을 늘리지 않고 CSS
 * `group-hover`/`group-focus-within`만으로 구현한 경량 버전 — 호버·포커스 시에만
 * 나타나는 단순 텍스트 설명용이라 이 정도로 충분하다고 판단.
 * ⚠️ 한계(실측/정식 컴포넌트 아님, 알고 쓸 것): 키보드 tab 포커스는 지원하지만
 * 터치 디바이스의 롱프레스, 표시 지연(delay), 포털 렌더링(다른 요소에 가려질 수 있음)은
 * 지원하지 않음 — 필요해지면 Radix Tooltip으로 교체 검토.
 */
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-mes-control-xs bg-mes-bg-strong px-2 py-1 text-[12px] font-medium text-mes-text-inverse opacity-0 transition-opacity duration-150",
          "group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          side === "top" && "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
          side === "bottom" && "top-full left-1/2 mt-1.5 -translate-x-1/2",
          side === "left" && "right-full top-1/2 mr-1.5 -translate-y-1/2",
          side === "right" && "left-full top-1/2 ml-1.5 -translate-y-1/2",
          className
        )}
      >
        {content}
      </span>
    </span>
  );
}

export { Tooltip };
