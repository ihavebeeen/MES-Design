import * as React from "react";
import { cn } from "@/lib/utils";

export interface MasterDetailPatternProps {
  navigation: React.ReactNode;
  tabs: React.ReactNode;
  header: React.ReactNode;
  master: React.ReactNode;
  detailTitle: React.ReactNode;
  detail: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/** LOT 추적과 BOM 조회에서 반복되는 상단 master + 하단 detail/tree 화면 패턴. */
function MasterDetailPattern({
  navigation,
  tabs,
  header,
  master,
  detailTitle,
  detail,
  footer,
  className,
}: MasterDetailPatternProps) {
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
        <section className="h-[390px] shrink-0 overflow-hidden border-b border-mes-gray-30">{master}</section>
        <section className="flex h-[390px] shrink-0 flex-col bg-mes-gray-20 px-5 pb-5 pt-4">
          <h4 className="mb-3 shrink-0 text-[16px] font-bold text-mes-gray-130">{detailTitle}</h4>
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg bg-white">{detail}</div>
        </section>
        {footer && (
          <footer className="flex h-[46px] shrink-0 items-center justify-between border-t border-mes-gray-30 px-5">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export { MasterDetailPattern };
