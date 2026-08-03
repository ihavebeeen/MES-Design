import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES StickyHeader/StickyFooter — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Sticky
 * Header/Footer", 상태 "없음", 재탐색 안 함 — 판단값 우선). `position: sticky` + 테두리/
 * 배경만 주는 최소 wrapper — 실제 고정 대상(툴바/액션 버튼 등)은 children으로 받음.
 */
type StickyHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const StickyHeader = React.forwardRef<HTMLDivElement, StickyHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("sticky top-0 z-10 border-b border-mes-border-default bg-white", className)}
      {...props}
    />
  )
);
StickyHeader.displayName = "StickyHeader";

const StickyFooter = React.forwardRef<HTMLDivElement, StickyHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("sticky bottom-0 z-10 border-t border-mes-border-default bg-white", className)}
      {...props}
    />
  )
);
StickyFooter.displayName = "StickyFooter";

export { StickyHeader, StickyFooter };
export type { StickyHeaderProps };
