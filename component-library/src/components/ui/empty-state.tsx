import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES EmptyState — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Empty State", 상태 "없음").
 * 아이콘(선택) + 제목 + 설명(선택) + 액션(선택)을 세로 중앙 정렬. 아이콘을 고정하지 않고
 * `icon` prop으로 호출부가 지정 — Button의 startIcon과 같은 원칙(문맥마다 다른 아이콘이
 * 자연스러움).
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      {icon && <div className="text-mes-gray-50">{icon}</div>}
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold leading-[1.5] text-mes-text-default">
          {title}
        </span>
        {description && (
          <span className="text-[13px] leading-[1.5] text-mes-gray-70">{description}</span>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export { EmptyState };
