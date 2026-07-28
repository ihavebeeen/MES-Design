"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronRight, Filter as FilterIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";

/**
 * MES FilterFlyout (필터 추가 → 카테고리 목록 → 체크박스 서브목록 2단 패널) — 조립형 구현
 *
 * ⚠ 이 컴포넌트는 Figma에 별도로 실측 가능한 노드가 없음. 담당자 확인(2026-07-28):
 * "필터를 눌렀을때 나오는거는, 그냥 봤을때 딱 보이잖아 드롭다운에 체크박스 달린거.
 * 하위로 뭐 있으면 클릭했을때 우측에 새로 뜨고" — 즉 스크린샷에 보이는 대로 조립해서
 * 만들어도 된다고 확인받음(정밀실측이 아니라 조립/판단 기반 구현이라는 점을 명확히 함).
 *
 * ── 구조(스크린샷 기준) ───────────────────────────────────────
 * 1단(카테고리 목록): 검색창 + 카테고리 행 목록(그룹명/그룹설명/구성원/권한설정/최종변경일
 *    등). 선택된 값이 있는 카테고리는 좌측에 체크 아이콘 표시, 하위 옵션이 있으면 우측에
 *    ChevronRight(>) 표시.
 * 2단(서브 옵션): 카테고리를 클릭하면 1단 패널 오른쪽에 나란히 새 패널이 열림 — 자체
 *    검색창 + 체크박스 옵션 목록(예: NORMAL_USER, SUPER_ADMIN, 경리팀 등).
 *
 * ── 시각 스타일(판단값 — Select/Combobox 패널 관례 재사용) ─────────
 * 패널 테두리 1px Gray-30, radius 8px, 그림자 0 2px 8px rgba(0,0,0,.12), 내부 패딩 8px —
 * combobox.tsx/select.tsx 패널과 동일한 값을 그대로 재사용함(별도 실측 아님, 일관성 목적).
 * 검색창도 combobox.tsx와 동일 레시피(높이 26px, 테두리 gray30, radius 4px).
 *
 * ── 확인 필요 ────────────────────────────────────────────────
 * - 카테고리에 선택값 있음을 나타내는 체크 아이콘의 정확한 색/스타일 미확인(판단값: Primary-60)
 * - 카테고리 목록 자체에 checkbox가 있는지 단순 체크마크 인디케이터인지 불명확 — 현재는
 *   "체크마크 인디케이터"로 구현(체크박스로 다시 선택하는 게 아니라 하위 패널에서 고른
 *   결과를 보여주기만 하는 용도로 판단)
 */

export interface FilterFlyoutOption {
  id: string;
  label: string;
}

export interface FilterFlyoutCategory {
  id: string;
  label: string;
  options: FilterFlyoutOption[];
}

export interface FilterFlyoutProps {
  categories: FilterFlyoutCategory[];
  value: Record<string, string[]>;
  onChange: (categoryId: string, optionIds: string[]) => void;
  trigger?: React.ReactNode;
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

function FilterFlyout({ categories, value, onChange, trigger }: FilterFlyoutProps) {
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

    return (
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
          {trigger ?? (
            <button
              type="button"
              className="flex h-8 items-center gap-[6px] rounded-[4px] border border-mes-gray-30 bg-white px-3 text-[14px] font-medium text-mes-gray-130"
            >
              <FilterIcon className="size-4" />
              필터 추가
            </button>
          )}
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
                  const hasSelection = (value[category.id] ?? []).length > 0;
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
                      <span className="flex items-center gap-1.5">
                        {hasSelection && (
                          <span className="size-1.5 shrink-0 rounded-full bg-mes-primary-60" aria-hidden />
                        )}
                        {category.label}
                      </span>
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
  );
}

export { FilterFlyout };
