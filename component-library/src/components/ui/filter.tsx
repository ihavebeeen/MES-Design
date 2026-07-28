"use client";

import * as React from "react";
import { Filter as FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterTag, type FilterTagProps } from "./filter-tag";

/**
 * MES Filter (필터 추가 트리거 + 활성 필터 태그 목록) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:83762("fillter-group")
 * 하위 2개 property(9873:83763="btn-only", 9873:83767="add-tag"), Figma 주석:
 * - "필터 미 선택 시 사용 (버튼만 노출)" = btn-only
 * - "필터 선택 시 사용" = add-tag(버튼 + 활성 필터 태그들이 같은 박스 안에 이어붙음)
 *
 * ── 1. 실측값 ─────────────────────────────────────────────────
 * - 전체 컨테이너: 배경 흰색, 테두리 1px Gray-30, radius 4px, 높이 32px, overflow-clip
 * - "필터 추가" 버튼 구역: 우측에 1px Gray-30 구분선, 좌우 padding 12px, 아이콘-텍스트 gap 6px,
 *   아이콘 16px("mes/icon-filter" — 여러 벡터로 구성된 복합 아이콘이라 정확한 path를 못 가져와서
 *   lucide `Filter` 아이콘으로 대체함, 판단값), 텍스트 Pretendard Medium 14px Gray-130(text)
 * - 활성 필터 태그 구역(add-tag일 때만): 좌우 padding 5px, 태그 간 gap 5px, 태그는
 *   FilterTag 컴포넌트(filter-tag.tsx) 그대로 재사용(실측 예시에 type2 2개 + type1 1개가
 *   나란히 있었음 — 실제로는 필터 카테고리 개수만큼 동적으로 늘어나는 구조로 판단)
 *
 * ── 2. 확인 필요(아직 안 만든 부분) ───────────────────────────────
 * 담당자가 스크린샷으로 보여준 "필터 추가" 클릭 시 펼쳐지는 2단계 체크박스 플라이아웃
 * 패널(좌측 카테고리 목록 그룹명/그룹설명/구성원/권한설정/최종변경일 + 우측 서브 체크박스
 * 목록, 각 단에 검색창 포함)은 이번 실측 대상(9873:83762)에 포함되어 있지 않았음 — 이 파일엔
 * 트리거 버튼과 "이미 선택된 후"의 태그 표시만 있고, 선택하는 과정(플라이아웃 UI) 자체의
 * 정확한 노드는 아직 확인 못 함. 정확한 노드 링크 주면 이어서 실측/구현 예정.
 */

export interface FilterProps {
  tags?: FilterTagProps[];
  onAddClick?: () => void;
  className?: string;
}

const Filter = React.forwardRef<HTMLDivElement, FilterProps>(
  ({ tags = [], onAddClick, className }, ref) => {
    const hasTags = tags.length > 0;
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-8 items-center overflow-hidden rounded-[4px] border border-mes-gray-30 bg-white",
          className
        )}
      >
        <button
          type="button"
          onClick={onAddClick}
          className={cn(
            "flex h-full shrink-0 items-center gap-[6px] px-3 text-[14px] font-medium text-mes-gray-130",
            hasTags && "border-r border-mes-gray-30"
          )}
        >
          <FilterIcon className="size-4" />
          필터 추가
        </button>
        {hasTags && (
          <div className="flex h-full shrink-0 items-center gap-[5px] px-[5px]">
            {tags.map((tag, i) => (
              <FilterTag key={i} {...tag} />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Filter.displayName = "Filter";

export { Filter };
