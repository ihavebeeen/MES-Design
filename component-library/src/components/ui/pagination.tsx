"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MES Pagination — Figma 검색에서 "NEW Pagination"/"NEW numbering" 이름은 찾았으나
 * (컴포넌트 라이브러리 파일) componentKey를 실제 node-id로 바꿀 방법이 없어 실측 불가
 * (담당자 확인: 재시도 안 함) — 판단값으로 구현. 현재 페이지 배색은 Button의 fillMain
 * 재사용, 버튼 정사각 24px은 IconButton small 사이즈 규격 재사용.
 */
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function getPageList(
  page: number,
  totalPages: number,
  siblingCount: number
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const start = Math.max(2, page - siblingCount);
  const end = Math.min(totalPages - 1, page + siblingCount);

  pages.push(1);
  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const pages = getPageList(page, totalPages, siblingCount);

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="이전 페이지"
        className="flex size-6 items-center justify-center rounded-mes-control-xs text-mes-gray-70 hover:bg-mes-bg-subtler disabled:pointer-events-none disabled:text-mes-gray-40"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, index) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-6 items-center justify-center text-[13px] text-mes-gray-50"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              "flex size-6 items-center justify-center rounded-mes-control-xs text-[13px]",
              p === page
                ? "bg-mes-bg-brand text-mes-text-inverse"
                : "text-mes-text-default hover:bg-mes-bg-subtler"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="다음 페이지"
        className="flex size-6 items-center justify-center rounded-mes-control-xs text-mes-gray-70 hover:bg-mes-bg-subtler disabled:pointer-events-none disabled:text-mes-gray-40"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export { Pagination };
