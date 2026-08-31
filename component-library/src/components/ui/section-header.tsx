import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  children: React.ReactNode;
  /** 제목 옆 버튼은 28px. 입력 등 별도 액션의 고유 크기는 유지한다. */
  action?: React.ReactNode;
  className?: string;
}

/** Figma 265:10: 제목·버튼 28px, 외곽 높이는 내용에 맞춘다. */
function SectionHeader({ children, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex w-full items-start gap-[10px] [&>button]:h-7 [&>a]:h-7", className)}>
      <div className="flex h-7 min-w-0 flex-1 items-center rounded-mes-control bg-mes-gray-30 px-[10px] text-[14px] font-semibold text-mes-text-default">
        {children}
      </div>
      {action}
    </div>
  );
}

export { SectionHeader };
