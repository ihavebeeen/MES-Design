"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MES FilterTag (필터에서 쓰는 태그/칩) — Figma 실측 기반 + 담당자 정책 결정 반영
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:83747("fillter-tag-item")
 * 하위 2개 property(9873:83748="type 2", 9873:83755="type 1"), Figma 주석 텍스트 그대로 인용:
 * - "태그 타입 2 : 1개 선택 시 사용" — 필터 카테고리에서 값을 1개만 선택했을 때
 * - "태그 타입 1 : 2개 이상 선택 시 사용" — 2개 이상 선택했을 때(개별 값 나열 대신 "전체보기" 요약)
 *
 * ⚠ 2026-07-28 담당자 정책 변경(type1/"전체보기" 폐지): 실사용 중 "그룹명 3개 중 2개만
 * 선택했는데 전체보기로 뜨고, 그룹설명은 1개짜리 옵션 전부(=사실상 전체) 선택했는데 그냥
 * '1'로 뜨는" 불일치가 확인됨 — "전체보기"라는 문구가 실제 전체 선택 여부와 무관하게 그냥
 * "2개 이상"에서만 뜨는 것이라 오해 소지가 있어, 담당자가 아예 이 구분을 없애고 **선택
 * 개수를 항상 숫자로만 표시**하기로 결정함. 원래 Figma엔 type1/type2 구분이 있었지만
 * 이 결정으로 코드에서는 단일 형태로 통합함(Figma 원본과 의도적으로 다른 부분).
 *
 * ── 공통 규격(실측) ────────────────────────────────────────────
 * 배경 Primary-20(#E8F5FF), 테두리 1px Primary-30(#C7E4FF), 높이 22px, radius 3px,
 * 좌측 padding 8px/우측 padding 3px, 요소 간 gap 3px, 라벨 텍스트 Pretendard Medium 13px
 * Primary-60, 닫기(X) 아이콘 12px(클릭 히트영역 5px 패딩 포함 실질 22x22). 개수 뱃지는
 * 흰 텍스트 12px Medium, Primary-60 배경의 완전 라운드(높이 14px, 최소너비 14px, 좌우 padding 4px)
 *
 * ── 판단값(미실측) ────────────────────────────────────────────
 * - 닫기 아이콘 색: Figma 컴포넌트 이름이 "Property 1=black"(설명: "close, 닫기")이라 검정 계열로
 *   추정되지만 벡터 이미지라 정확한 hex를 코드로 못 뽑음 — Primary-60(라벨과 동일 색)으로 처리해둠
 */

export interface FilterTagProps {
  category: string;
  count: number;
  onRemove?: () => void;
  className?: string;
}

const FilterTag = React.forwardRef<HTMLDivElement, FilterTagProps>(
  ({ category, count, onRemove, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-[22px] items-center gap-[3px] rounded-[3px] border border-mes-primary-30 bg-mes-primary-20 py-px pl-2 pr-[3px] text-[13px] font-medium text-mes-primary-60",
        className
      )}
    >
      <span className="inline-flex items-center gap-[3px] whitespace-nowrap">
        <span>{category}</span>
        <span className="inline-flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-mes-primary-60 px-1 text-[12px] font-medium text-white">
          {count}
        </span>
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
  )
);
FilterTag.displayName = "FilterTag";

export { FilterTag };
