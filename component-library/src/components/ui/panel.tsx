import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Panel — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Panel", 상태 "없음", 재탐색
 * 안 함 — 판단값 우선). Card와 달리 그림자를 갖는 "떠 있는" 영역용 — NotificationPanel/
 * Combobox 펼침 패널과 동일한 `rounded-mes-panel`/`shadow-mes-panel`/border 조합 재사용.
 */
type PanelProps = React.HTMLAttributes<HTMLDivElement>;

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-mes-panel border border-mes-border-default bg-white shadow-mes-panel",
      className
    )}
    {...props}
  />
));
Panel.displayName = "Panel";

export { Panel };
export type { PanelProps };
