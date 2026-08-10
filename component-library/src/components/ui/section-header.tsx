import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** 모달 내부 섹션의 회색 제목 밴드와 우측 액션을 한 행으로 묶는다. */
function SectionHeader({ children, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex h-8 w-full items-start gap-[10px]", className)}>
      <div className="flex h-7 min-w-0 flex-1 items-center rounded-mes-control bg-mes-gray-30 px-[10px] text-[14px] font-semibold text-mes-text-default">
        {children}
      </div>
      {action}
    </div>
  );
}

export { SectionHeader };
