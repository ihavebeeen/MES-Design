import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Divider — Figma 디자인 없음(체크리스트 티어2 "Divider / Separator", 상태 "없음").
 * 색은 기존 컴포넌트 전반에서 구분선으로 이미 쓰이고 있는 `border-mes-border-default`
 * (Gray-30) 그대로 재사용 — 새 색을 만들지 않음. 두께는 다른 컴포넌트의 테두리와 동일하게
 * 1px 고정(문서 `디자인_토큰_사용_규칙.md` 2절: "1px | 테두리 두께(거의 전부)").
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-mes-border-default",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
);
Divider.displayName = "Divider";

export { Divider };
