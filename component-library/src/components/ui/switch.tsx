"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Switch / Toggle — Figma 디자인 없음(체크리스트 티어2 "Switch / Toggle", 상태 "없음").
 * 네이티브 `<input type="checkbox">` + `peer` 오버레이 패턴은 `checkbox.tsx`와 동일하게
 * 재사용(이 프로젝트의 폼 컨트롤 공용 구현 방식) — 트랙/썸 색상은 기존 시맨틱 토큰
 * 재사용한 판단값: on=`bg-mes-bg-brand`(Checkbox main과 동일 파랑), off=`bg-mes-gray-40`,
 * 썸은 항상 흰색 원. 사이즈는 Checkbox(24px)보다 가로로 긴 형태가 자연스러워 임의로
 * 최초에는 44x24px 판단값이었으나, 완성 화면 node 20274:73333의 컬럼 설정에서
 * Toggle 12개가 전부 40x20px로 반복 확인되어 이 실측값으로 교체했다.
 * 2026-07-31 담당자 피드백 — disabled를 `bg-mes-bg-disabled`(Gray-30/#e4e7ee)로
 * 구현했더니 기본 off 색(Gray-40/#d7dce5)이랑 육안으로 거의 구분이 안 됐음(두 헥스가
 * 너무 가까움). 색상 스왑 대신 on/off 색은 그대로 두고 `opacity-40`로 전체를 흐리게
 * 처리하는 방식으로 변경 — on 상태에서 disabled 걸려도 "흐린 파랑"으로 원래 상태가
 * 남아있으면서 비활성인 게 명확히 구분됨.
 */
export type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  /** 표준단가 카드의 단가 동기화처럼 조밀한 영역에서 쓰는 Figma 실측 26×18 규격. */
  size?: "default" | "compact";
};

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, disabled, size = "default", ...props }, ref) => {
    const compact = size === "compact";
    return (
      <span className={cn("relative inline-flex shrink-0 items-center", compact ? "h-[18px] w-[26px]" : "h-5 w-10", className)}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className="peer absolute inset-0 size-full cursor-pointer appearance-none disabled:cursor-not-allowed"
          {...props}
        />
        {/* 트랙 */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full bg-mes-gray-40 transition-colors",
            "peer-checked:bg-mes-bg-brand",
            "peer-disabled:opacity-40"
          )}
        />
        {/* 썸 */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute translate-x-0 rounded-full bg-white shadow-mes-panel transition-transform",
            compact ? "left-[1.5px] size-[15px] peer-checked:translate-x-[8px]" : "left-0.5 size-4 peer-checked:translate-x-5",
            "peer-disabled:opacity-40"
          )}
        />
      </span>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
