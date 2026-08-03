import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES ErrorState — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Error State", 상태 "없음").
 * EmptyState와 레이아웃은 동일하되 아이콘 색만 `text-mes-text-danger`(semantic 토큰,
 * `globals.css`에 "아직 실사용 사례 없음"으로 선제 정의만 돼 있던 것 — 이 컴포넌트가 첫
 * 실사용처)로 고정. 재시도 등 액션 버튼이 항상 따라붙는 의미상 별도 케이스라 EmptyState를
 * 복제하지 않고 체크리스트 항목명 그대로 분리된 컴포넌트로 유지.
 */
export interface ErrorStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function ErrorState({
  icon,
  title = "문제가 발생했습니다",
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      {icon && <div className="text-mes-text-danger">{icon}</div>}
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

export { ErrorState };
