import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES ButtonGroup — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Button Group", 상태 "없음").
 * 기존 Button을 그대로 감싸는 순수 레이아웃 wrapper — 새 버튼 스타일을 만들지 않음.
 * 자식으로 온 `<Button>`들의 라운드를 양끝만 남기고 가운데는 제거해 하나로 이어붙인
 * 것처럼 보이게 함(`:not(:first-child)`에 `-ml-px`를 줘서 테두리가 겹치도록 처리).
 * 2026-08-03: 루트에 `shrink-0` 추가(배경은 `filter.tsx` 5번 항목 참고).
 */
type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement>;

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn(
        "inline-flex shrink-0 items-center",
        "[&>button]:rounded-none [&>button:first-child]:rounded-l-mes-control [&>button:last-child]:rounded-r-mes-control [&>button:not(:first-child)]:-ml-px",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
export type { ButtonGroupProps };
