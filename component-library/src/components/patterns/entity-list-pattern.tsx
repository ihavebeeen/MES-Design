import * as React from "react";
import { cn } from "@/lib/utils";

export interface EntityListPatternProps {
  navigation: React.ReactNode;
  tabs: React.ReactNode;
  header: React.ReactNode;
  table: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * 완성 화면의 판매계획/공정검사/출하지시 리스트가 공유하는 화면 셸.
 * Navigation → 38px page tabs → 조회 툴바 → 가변 테이블 → 46px 하단 액션 순서를 고정한다.
 */
function EntityListPattern({
  navigation,
  tabs,
  header,
  table,
  footer,
  className,
}: EntityListPatternProps) {
  return (
    <div
      className={cn(
        "flex h-[960px] w-[1920px] overflow-hidden bg-white",
        className
      )}
    >
      {navigation}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[38px] shrink-0 items-center bg-black">{tabs}</div>
        <header className="h-[96px] shrink-0">{header}</header>
        <div className="min-h-0 flex-1 overflow-auto">{table}</div>
        {footer && (
          <footer className="flex h-[46px] shrink-0 items-center justify-between border-t border-mes-gray-30 px-5">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export { EntityListPattern };
