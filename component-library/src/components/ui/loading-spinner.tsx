import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MES LoadingSpinner — Figma 디자인 없음(체크리스트 티어2 "Loading Spinner", 상태 "없음").
 * lucide `LoaderCircle` + Tailwind 기본 `animate-spin`. 색은 기본적으로 브랜드 색
 * (`text-mes-text-brand`)을 쓰되, 채워진(fill) 배경 위에 올라갈 땐 `className`으로
 * `text-mes-text-inverse` 등을 덮어써서 쓰면 됨(Button 등과 동일하게 currentColor 기반).
 */
export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
}

const LoadingSpinner = React.forwardRef<HTMLSpanElement, LoadingSpinnerProps>(
  ({ className, size = 20, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="로딩 중"
      className={cn("inline-flex shrink-0 text-mes-text-brand", className)}
      {...props}
    >
      <LoaderCircle size={size} className="animate-spin" />
    </span>
  )
);
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
