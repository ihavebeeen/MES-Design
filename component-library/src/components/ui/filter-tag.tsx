"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MES FilterTag (필터에서 쓰는 태그/칩) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:83747("fillter-tag-item")
 * 하위 2개 property(9873:83748="type 2", 9873:83755="type 1"), Figma 주석 텍스트 그대로 인용:
 * - "태그 타입 2 : 1개 선택 시 사용" — 필터 카테고리에서 값을 1개만 선택했을 때
 * - "태그 타입 1 : 2개 이상 선택 시 사용" — 2개 이상 선택했을 때(개별 값 나열 대신 요약 표시)
 *
 * ── 1. 공통 규격(실측) ────────────────────────────────────────
 * 배경 Primary-20(#E8F5FF), 테두리 1px Primary-30(#C7E4FF), 높이 22px, radius 3px,
 * 좌측 padding 8px/우측 padding 3px, 요소 간 gap 3px, 라벨 텍스트 Pretendard Medium 13px
 * Primary-60, 닫기(X) 아이콘 12px(클릭 히트영역 5px 패딩 포함 실질 22x22)
 *
 * ── 2. 타입별 차이 ────────────────────────────────────────────
 * - type2(단일 선택): "{카테고리명} [값]" — 값은 흰 텍스트 12px Medium을 담은 Primary-60
 *   배경의 완전 라운드 뱃지(높이 14px, 최소너비 14px, 좌우 padding 4px)로 표시
 *   (실측 예시: "품목 5", "품목 23")
 * - type1(2개 이상 선택): "{카테고리명} : 전체보기" — 값 목록 대신 고정 문구로 요약
 *   (실측 예시: "품목 : 전체보기")
 *
 * ── 3. 판단값(미실측) ────────────────────────────────────────
 * - 닫기 아이콘 색: Figma 컴포넌트 이름이 "Property 1=black"(설명: "close, 닫기")이라 검정 계열로
 *   추정되지만 벡터 이미지라 정확한 hex를 코드로 못 뽑음 — Primary-60(라벨과 동일 색)으로 처리해둠,
 *   실제로 검정이어야 한다면 교체 필요
 */

export interface FilterTagProps {
  category: string;
  /** type2(단일 선택)일 때 보여줄 값 — 있으면 자동으로 type2로 렌더링됨 */
  value?: string;
  /** type1(2개 이상 선택) 요약 문구 — 기본값 "전체보기" */
  summaryLabel?: string;
  onRemove?: () => void;
  className?: string;
}

const FilterTag = React.forwardRef<HTMLDivElement, FilterTagProps>(
  ({ category, value, summaryLabel = "전체보기", onRemove, className }, ref) => {
    const isSingleValue = value !== undefined;
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-[22px] items-center gap-[3px] rounded-[3px] border border-mes-primary-30 bg-mes-primary-20 py-px pl-2 pr-[3px] text-[13px] font-medium text-mes-primary-60",
          className
        )}
      >
        <span className="inline-flex items-center gap-[3px] whitespace-nowrap">
          <span>{category}</span>
          {isSingleValue ? (
            <span className="inline-flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-mes-primary-60 px-1 text-[12px] font-medium text-white">
              {value}
            </span>
          ) : (
            <span>: {summaryLabel}</span>
          )}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="필터 제거"
          className="inline-flex shrink-0 items-center justify-center p-[5px] text-mes-primary-60"
        >
          <X className="size-3" />
        </button>
      </div>
    );
  }
);
FilterTag.displayName = "FilterTag";

export { FilterTag };
