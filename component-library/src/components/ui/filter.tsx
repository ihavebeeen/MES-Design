"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronRight, Filter as FilterIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { FilterTag } from "./filter-tag";

/**
 * MES Filter (필터 추가 트리거 + 카테고리→체크박스 플라이아웃 + 활성 필터 태그) — 통합 구현
 *
 * 2026-07-28 담당자 피드백으로 트리거/플라이아웃/태그를 하나의 컴포넌트로 통합함(이전엔
 * filter.tsx=트리거+정적 태그, filter-flyout.tsx=플라이아웃 패널이 따로 분리돼 있어서
 * 데모에서 서로 안 이어지고 시각적으로 엮여 보이는 문제가 있었음).
 *
 * ── 1. 트리거+태그 컨테이너(실측) ─────────────────────────────
 * 출처: node 9873:83762("fillter-group"). 배경 흰색, 테두리 1px Gray-30, radius 4px,
 * 높이 32px. "필터 추가" 버튼 구역은 활성 태그가 있을 때만 우측에 1px Gray-30 구분선.
 *
 * ── 2. 플라이아웃 패널(조립형 — Figma에 실측 가능한 노드 없음, 담당자 승인) ────
 * 1단(카테고리 목록): 검색창 + 카테고리 행. 담당자 확인(2026-07-28, 실제 화면 스크린샷
 * 기준): **선택된 카테고리를 표시하는 좌측 점 같은 인디케이터는 없음** — 이전 구현에서
 * 넣었던 파란 점을 제거함. 카테고리 행은 라벨 + (하위 옵션 있으면) ChevronRight만 표시.
 * 2단(서브 옵션): 카테고리 클릭 시 1단 오른쪽에 나란히 열림, 자체 검색창 + 체크박스 목록.
 *
 * ── 3. 활성 필터 태그 자동 생성 규칙(2026-07-28 담당자 확인) ────────
 * 카테고리별로 선택된 옵션이 1개면 FilterTag를 type2(카운트 뱃지, 값="1")로, 2개 이상이면
 * type1("전체보기")으로 자동 표시. 태그의 X를 누르면 해당 카테고리 선택을 전부 해제.
 * (실제 화면 예시: "설비명" 하위에서 1개 체크 → "설비명 1" 태그가 트리거 옆에 표시됨)
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
    <div
      className={cn(
        "inline-flex h-8 items-center rounded-[4px] border border-mes-gray-30 bg-white",
        className
      )}
    >
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
            className={cn(
              "flex h-full shrink-0 items-center gap-[6px] px-3 text-[14px] font-medium text-mes-gray-130",
              activeTags.length > 0 && "border-r border-mes-gray-30"
            )}
          >
            <FilterIcon className="size-4" />
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
            <div className="flex w-[200px] flex-col gap-2 border-r border-mes-gray-30 p-2">
              <SearchBox value={categoryQuery} onChange={setCategoryQuery} placeholder="검색" />
              <div className="flex max-h-[280px] flex-col overflow-y-auto">
                {filteredCategories.map((category) => {
                  const isActive = category.id === activeCategoryId;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategoryId(category.id)}
                      className={cn(
                        "flex items-center justify-between rounded-[4px] px-2 py-[6px] text-left text-[13px] leading-[1.5] text-mes-gray-130",
                        isActive ? "bg-mes-gray-20" : "hover:bg-mes-gray-20"
                      )}
                    >
                      <span>{category.label}</span>
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
              <div className="flex w-[220px] flex-col gap-2 p-2">
                <SearchBox
                  value={optionQuery}
                  onChange={setOptionQuery}
                  placeholder={`${activeCategory.label} 검색`}
                />
                <div className="flex max-h-[280px] flex-col overflow-y-auto">
                  {filteredOptions.map((option) => {
                    const checked = (value[activeCategory.id] ?? []).includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-center gap-2 rounded-[4px] px-2 py-[6px] text-[13px] leading-[1.5] text-mes-gray-130 hover:bg-mes-gray-20"
                      >
                        <Checkbox
                          checked={checked}
                          onChange={() => toggleOption(activeCategory.id, option.id)}
                        />
                        {option.label}
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
        <div className="flex h-full shrink-0 items-center gap-[5px] px-[5px]">
          {activeTags.map(({ category, selected }) => (
            <FilterTag
              key={category.id}
              category={category.label}
              value={selected.length === 1 ? String(selected.length) : undefined}
              onRemove={() => onChange(category.id, [])}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { Filter };
