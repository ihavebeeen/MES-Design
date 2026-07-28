"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { selectTriggerVariants } from "./select";

/**
 * MES Combobox (검색 내장 셀렉트) — Selectbox(select.tsx)와 별도 컴포넌트로 분리
 *
 * 분리 배경: 실제 서비스엔 이미 검색창이 내장된 콤보박스(`.searchable-select-dropdown`,
 * 예: 근무조 선택)가 개발돼 있는데, 지금까지 디자인 시스템 문서/코드엔 일반 Selectbox와
 * 구분이 안 돼 있었음(체크리스트 19번 섹션 이슈). 담당자 확인(2026-07-28): "이미 개발되어
 * 있으니 지금 바로 구분해서 만들어야 한다" — 이 파일로 분리해서 구현.
 *
 * 트리거 박스 — Selectbox와 완전히 동일한 규격이라고 판단해 `select.tsx`의
 * `selectTriggerVariants`를 그대로 재사용함(같은 위계, 별도 실측 안 함 — 재발 방지 규칙상
 * "다른 컴포넌트 값을 유추해서 채우지 않는다"는 원칙이 있지만, 이건 트리거 자체가 실측
 * 대상인 Selectbox와 발생적으로 같은 UI 요소이므로 재사용이며, 유추가 아님).
 *
 * 검색창 — 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 20140:101487
 * (하위 20140:101488 배경, 20140:101489 placeholder 텍스트, 20140:101490 검색 아이콘):
 * - 배경 흰색, 테두리 1px gray30(#E4E7EE), radius 4px, 높이 26px
 * - 아이콘 16x16, 박스 왼쪽 기준 8px 인셋, 텍스트는 아이콘 뒤 약 5px 간격
 * - placeholder/입력 텍스트: Pretendard Regular 13px, 세로 중앙 정렬
 * - placeholder 색: gray60(#99A3B8) — 실측 노드에서 확인
 *
 * 검색 아이콘 색: Figma 노드가 이미지(png/svg) 애셋이라 정확한 hex를 코드로 직접 못 뽑음 —
 * placeholder와 같은 gray60으로 맞춤(판단값, 다르면 알려주면 교체).
 *
 * 펼침 목록 패널/항목 스타일 — Selectbox(select.tsx)와 동일 근거(node 20140:101474 계열)로
 * 재사용: 테두리 1px gray30, radius 8px(판단값), 패딩 8px, 그림자
 * `0 2px 8px rgba(0,0,0,.12)`(실제 서비스 devtools 값), 항목 폰트 13px/150%, 선택 항목
 * 배경 `#E8F0FE`(담당자 확인).
 *
 * 미확인 상태로 남은 값(TODO):
 * - 선택된 항목 hover 시 테두리 색 — 담당자가 "primary 팔레트에서 배경보다 1~2단계
 *   진한 색 아니냐"는 가설을 제시했으나, 배경 #E8F0FE 자체가 확정 Primary 팔레트
 *   11단계(10~110) 중 어느 값과도 정확히 일치하지 않음(Primary-20 #E8F5FF와 가장
 *   비슷하지만 다른 값) — 실측 없이 유추로 확정할 수 없어, 우선 Primary-40(#7BBBFF)을
 *   임시값으로 넣어둠. devtools에서 실제 값 확인되면 즉시 교체 필요.
 *
 * 키보드 탐색(방향키 이동 등)은 1차 버전엔 미포함 — 클릭/검색만 지원. 필요하면 추후 추가.
 */

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  size?: "default" | "small";
  disabled?: boolean;
  className?: string;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "선택",
      searchPlaceholder = "검색",
      emptyText = "검색 결과가 없습니다",
      size = "default",
      disabled,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const selected = options.find((o) => o.value === value);
    const filtered = React.useMemo(() => {
      if (!query.trim()) return options;
      const q = query.trim().toLowerCase();
      return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, query]);

    return (
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setQuery("");
            requestAnimationFrame(() => searchInputRef.current?.focus());
          }
        }}
      >
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            data-state={open ? "open" : "closed"}
            className={cn(
              selectTriggerVariants({ size }),
              !selected && "text-mes-gray-60",
              className
            )}
          >
            <span className="line-clamp-1">{selected ? selected.label : placeholder}</span>
            <ChevronDown className="size-3 shrink-0 opacity-80" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className={cn(
              "z-50 w-[--radix-popover-trigger-width] overflow-hidden rounded-[8px] border border-mes-gray-30 bg-white p-2 text-mes-gray-130 shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
              "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1"
            )}
          >
            <div className="flex h-[26px] items-center gap-[5px] rounded-[4px] border border-mes-gray-30 bg-white px-2">
              <Search className="size-4 shrink-0 text-mes-gray-60" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-full w-full bg-transparent text-[13px] leading-[1.5] text-mes-gray-130 outline-none placeholder:text-mes-gray-60"
              />
            </div>

            <div className="mt-2 max-h-[240px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-2 py-3 text-center text-[13px] leading-[1.5] text-mes-gray-60">
                  {emptyText}
                </div>
              ) : (
                filtered.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onValueChange?.(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "relative flex w-full cursor-default select-none items-center rounded-[4px] border border-transparent py-[5px] pr-6 text-left text-[13px] leading-[1.5] outline-none transition-colors",
                        isSelected
                          ? "bg-[#e8f0fe] hover:border-mes-primary-40"
                          : "hover:bg-mes-gray-20"
                      )}
                    >
                      <span className="line-clamp-1">{option.label}</span>
                      {isSelected && (
                        <Check className="absolute right-0 size-3.5" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);
Combobox.displayName = "Combobox";

export { Combobox };
