import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Backdrop / Dim Overlay — Figma 디자인 없음(체크리스트 티어2 "Backdrop / Dim
 * Overlay", 상태 "없음"). `confirm-dialog.tsx`/`radio-choice-dialog.tsx`가 각자
 * Radix `DialogPrimitive.Overlay`에 똑같이 `fixed inset-0 z-50 bg-black/40`을
 * 반복해서 넣고 있던 걸 발견해 독립 아톰으로 뽑음 — 두 다이얼로그는 Radix에 종속돼
 * 있어 그대로 이 컴포넌트로 교체하진 않았고(각자 Overlay 슬롯이 필요), 새로 Radix
 * 없이 만드는 커스텀 오버레이(Drawer/Popover 등 향후 컴포넌트)에서 재사용하도록 값만
 * 공용 아톰으로 분리.
 */
export interface BackdropProps extends React.HTMLAttributes<HTMLDivElement> {}

const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden
        className={cn("fixed inset-0 z-50 bg-black/40", className)}
        {...props}
      />
    );
  }
);
Backdrop.displayName = "Backdrop";

export { Backdrop };
