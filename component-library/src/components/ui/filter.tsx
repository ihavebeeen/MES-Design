"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronRight, SlidersHorizontal, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { FilterTag } from "./filter-tag";

/**
 * MES Filter (필터 추가 트리거 + 카테고리→체크박스 플라이아웃 + 활성 필터 태그) — 통합 구현
 *
 * ── 1. 트리거 아이콘 (2026-07-28 담당자 지적으로 교체) ────────────
 * node 9873:83762 하위 "mes/icon-filter"(9873:83765/83769)는 벡터 이미지라 SVG를 직접
 * 못 받아왔었고, 처음엔 의미상 "필터"니까 lucide `Filter`(깔때기 모양) 아이콘으로 임의
 * 대체했었음 — 담당자가 "내가 분명 노드를 줬는데 왜 네 맘대로 아이콘을 넣냐"고 지적.
 * get_design_context로 받은 도형 좌표를 다시 분석해보니(Ellipse 3개가 각각 위/중간/아래
 * 가로줄에서 서로 다른 좌우 위치에 있고, Vector 선분들이 그 사이를 잇는 구조) 이건 깔때기가
 * 아니라 "가로선 3개 + 각 선 위의 조절점" 형태 — lucide `SlidersHorizontal`과 정확히 같은
 * 구조. 실제 SVG 파일을 직접 못 받는 건 여전하지만(샌드박스에서 Figma 에셋 서버로 네트워크
 * 요청이 막혀 있음), 임의 선택이 아니라 좌표 구조 분석 기반으로 아이콘을 다시 골랐음.
 *
 * ── 2. 트리거+태그 레이아웃 (2026-07-28 담당자 지적: "여전히 개 길어") ────
 * 기존엔 트리거 버튼과 활성 태그들이 테두리 하나를 공유하는 통짜 박스였는데, 담당자가
 * "선택한 필터가 없으면 필터 추가 영역만 노출하고, 필터가 생기면 그 필터를 hug하는
 * 좌우 패딩 5px짜리 흰 배경+회색 테두리 박스가 따로 있는 형태"로 명확히 지정함 — 트리거
 * 박스와 태그 박스를 서로 다른 두 개의 독립된 박스로 분리(사이 간격은 실측 없음, 판단값
 * gap-2). 태그가 없으면 태그 박스 자체가 렌더링되지 않아 트리거만 남음.
 *
 * ── 3. 활성 필터 태그 표시 규칙 (2026-07-28 담당자 정책 결정) ────────
 * 원래 Figma엔 1개 선택 시/2개 이상 선택 시를 구분하는 type1·type2가 있었으나, 실사용
 * 확인 중 "전체보기" 문구가 실제 전체선택 여부와 무관해 혼란을 준다는 게 확인돼 폐지 —
 * 이제 선택 개수와 무관하게 항상 "{카테고리} [선택개수]" 형태로 통일(filter-tag.tsx 참고).
 * 태그의 X를 누르면 해당 카테고리 선택을 전부 해제.
 *
 * ── 4. 플라이아웃 패널 크기(조립형, Figma에 실측 노드 없음) ────────
 * 카테고리 열 140px, 옵션 열 180px, 그림자/테두리/radius는 Select·Combobox 패널 관례
 * 재사용. 긴 라벨은 truncate + title 속성 네이티브 툴팁으로 처리.
 */

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterProps {
  categories: FilterCategory[];
  value: Record<string, string[]>;
  onChange: (categoryId: string, optionIds: string[]) => void;
  className?: string;
}

function SearchBox({
  value,
  onChange,
  placeholder = "검색",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex h-[26px] items-center gap-[5px] rounded-[4px] border border-mes-gray-30 bg-white px-2">
      <Search className="size-4 shrink-0 text-mes-gray-60" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-[13px] leading-[1.5] text-mes-gray-130 outline-none placeholder:text-mes-gray-60"
      />
    </div>
  );
}

function Filter({ categories, value, onChange, className }: FilterProps) {
  const [open, setOpen] = React.useState(false);
  const [categoryQuery, setCategoryQuery] = React.useState("");
  const [optionQuery, setOptionQuery] = React.useState("");
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);

  const filteredCategories = React.useMemo(() => {
    if (!categoryQuery.trim()) return categories;
    const q = categoryQuery.trim().toLowerCase();
    return categories.filter((c) => c.label.toLowerCase().includes(q));
  }, [categories, categoryQuery]);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null;
  const filteredOptions = React.useMemo(() => {
    if (!activeCategory) return [];
    if (!optionQuery.trim()) return activeCategory.options;
    const q = optionQuery.trim().toLowerCase();
    return activeCategory.options.filter((o) => o.label.toLowerCase().includes(q));
  }, [activeCategory, optionQuery]);

  const toggleOption = (categoryId: string, optionId: string) => {
    const current = value[categoryId] ?? [];
    const next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    onChange(categoryId, next);
  };

  const activeTags = categories
    .map((category) => ({ category, selected: value[category.id] ?? [] }))
    .filter((c) => c.selected.length > 0);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setActiveCategoryId(null);
            setCategoryQuery("");
            setOptionQuery("");
          }
        }}
      >
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className="flex h-8 items-center gap-[6px] rounded-[4px] border border-mes-gray-30 bg-white px-3 text-[14px] font-medium text-mes-gray-130"
          >
            <SlidersHorizontal className="size-4" />
            필터 추가
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className="z-50 flex overflow-hidden rounded-[8px] border border-mes-gray-30 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
          >
            {/* 1단: 카테고리 목록 */}
            <div className="flex w-[140px] flex-col gap-1.5 border-r border-mes-gray-30 p-2">
              <SearchBox value={categoryQuery} onChange={setCategoryQuery} placeholder="검색" />
              <div className="flex max-h-[240px] flex-col overflow-y-auto">
                {filteredCategories.map((category) => {
                  const isActive = category.id === activeCategoryId;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      title={category.label}
                      onClick={() => setActiveCategoryId(category.id)}
                      className={cn(
                        "flex items-center justify-between gap-1 rounded-[4px] px-1.5 py-1 text-left text-[13px] leading-[1.5] text-mes-gray-130",
                        isActive ? "bg-mes-gray-20" : "hover:bg-mes-gray-20"
                      )}
                    >
                      <span className="truncate">{category.label}</span>
                      {category.options.length > 0 && (
                        <ChevronRight className="size-3.5 shrink-0 text-mes-gray-60" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2단: 선택된 카테고리의 체크박스 서브목록 */}
            {activeCategory && (
              <div className="flex w-[180px] flex-col gap-1.5 p-2">
                <SearchBox
                  value={optionQuery}
                  onChange={setOptionQuery}
                  placeholder={`${activeCategory.label} 검색`}
                />
                <div className="flex max-h-[240px] flex-col overflow-y-auto">
                  {filteredOptions.map((option) => {
                    const checked = (value[activeCategory.id] ?? []).includes(option.id);
                    return (
                      <label
                        key={option.id}
                        title={option.label}
                        className="flex cursor-pointer items-center gap-1.5 rounded-[4px] px-1.5 py-1 text-[13px] leading-[1.5] text-mes-gray-130 hover:bg-mes-gray-20"
                      >
                        <Checkbox
                          checked={checked}
                          onChange={() => toggleOption(activeCategory.id, option.id)}
                        />
                        <span className="truncate">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {activeTags.length > 0 && (
        <div className="flex h-8 items-center gap-[5px] rounded-[4px] border border-mes-gray-30 bg-white px-[5px]">
          {activeTags.map(({ category, selected }) => (
            <FilterTag
              key={category.id}
              category={category.label}
              count={selected.length}
              onRemove={() => onChange(category.id, [])}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { Filter };
