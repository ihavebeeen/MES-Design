import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Container/Grid — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Grid / Container",
 * 상태 "없음", 재탐색 안 함 — 판단값 우선). Container는 이 데모 페이지의 섹션들이 이미
 * 쓰는 `max-w-[960px]`를 재사용, Grid는 컬럼 수/간격만 받는 얇은 레이아웃 wrapper.
 */
type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mx-auto w-full max-w-[960px]", className)} {...props} />
  )
);
Container.displayName = "Container";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 6 | 12;
  gap?: 2 | 4 | 6 | 8;
}

const GRID_COLS: Record<NonNullable<GridProps["columns"]>, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const GRID_GAP: Record<NonNullable<GridProps["gap"]>, string> = {
  2: "gap-2",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 4, gap = 4, className, ...props }, ref) => (
    <div ref={ref} className={cn("grid", GRID_COLS[columns], GRID_GAP[gap], className)} {...props} />
  )
);
Grid.displayName = "Grid";

export { Container, Grid };
export type { ContainerProps };
