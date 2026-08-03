import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES ScrollArea — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Scroll Area", 상태
 * "없음", 재탐색 안 함 — 판단값 우선). 새 스크롤바 라이브러리를 추가하지 않고 브라우저
 * 기본 스크롤 + 얇은 스크롤바(`scrollbarWidth: "thin"`, 표준 CSS 속성)만 적용한 최소
 * wrapper.
 */
type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>;

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("overflow-y-auto", className)}
      style={{ scrollbarWidth: "thin", ...style }}
      {...props}
    />
  )
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
export type { ScrollAreaProps };
