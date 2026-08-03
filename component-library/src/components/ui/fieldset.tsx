import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Fieldset — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Fieldset", 상태 "없음",
 * 재탐색 안 함 — 판단값 우선). 관련 폼 필드를 묶는 순수 레이아웃 wrapper. legend 톤은
 * Label(`label.tsx`)과 동일(13px medium, `text-mes-text-default`).
 */
export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: React.ReactNode;
}

const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ legend, className, children, ...props }, ref) => (
    <fieldset
      ref={ref}
      className={cn(
        "flex flex-col gap-3 rounded-mes-control border border-mes-border-default p-4",
        className
      )}
      {...props}
    >
      {legend && (
        <legend className="px-1 text-[13px] font-medium text-mes-text-default">{legend}</legend>
      )}
      {children}
    </fieldset>
  )
);
Fieldset.displayName = "Fieldset";

export { Fieldset };
