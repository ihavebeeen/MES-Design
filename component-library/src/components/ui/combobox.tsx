"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDown, Search } from "lucide-react";
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
 * ── 1. 트리거 박스 ──────────────────────────────────────────────
 * Selectbox와 완전히 동일한 규격이라고 판단해 `select.tsx`의 `selectTriggerVariants`를
 * 그대로 재사용함(같은 위계, 별도 실측 안 함 — 트리거 자체가 실측 대상인 Selectbox와
 * 발생적으로 같은 UI 요소이므로 재사용이며, 다른 컴포넌트를 유추한 것이 아님).
 * - default: 배경 흰색, 테두리 gray30 / open: 테두리 gray130 / disabled: 배경·텍스트 흐림
 *
 * ── 2. 검색창 ──────────────────────────────────────────────────
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 20140:101487
 * (하위 20140:101488 배경, 20140:101489 placeholder 텍스트, 20140:101490 검색 아이콘):
 * - 배경 흰색, 테두리 1px gray30(#E4E7EE), radius 4px, 높이 26px
 * - 아이콘 16x16, 박스 왼쪽 기준 8px 인셋, 텍스트는 아이콘 뒤 약 5px 간격
 * - placeholder/입력 텍스트: Pretendard Regular 13px, 세로 중앙 정렬, 색 gray60
 * - 검색 아이콘 색: Figma 노드가 이미지 애셋이라 정확한 hex를 직접 못 뽑아 placeholder와
 *   같은 gray60으로 맞춤(판단값, 다르면 알려주면 교체)
 *
 * ── 3. 펼침 목록 패널 ──────────────────────────────────────────
 * Selectbox 패널과 동일 근거(node 20140:101474 계열) 공유:
 * - 테두리 1px gray30, radius 8px(판단값), 패딩 8px
 * - 그림자 `0 2px 8px rgba(0,0,0,.12)`(실제 서비스 devtools 값)
 * - 너비: 트리거 너비와 동일하게 고정(`var(--radix-popover-trigger-width)`) — 내용 길이로
 *   늘어나지 않음(2026-07-28 담당자 지적: "펼쳤을 때 너비는 원본 너비와 동일해야 함,
 *   텍스트가 아주 길 때만 예외")
 *
 * ── 4. 목록 항목 — 상태별 스타일 ───────────────────────────────
 * 폰트 13px/150%, 좌우 padding 8px(담당자 확인, 2026-07-28 — 이전엔 오른쪽만 체크 아이콘
 * 자리로 24px 비워뒀었는데, 체크 아이콘 자체를 없애면서 좌우 동일 8px로 정리):
 * - default: 배경 없음
 * - hover(선택 안 됨): 배경 gray20(판단값)
 * - selected: 배경 #E8F0FE(담당자 확인). 우측 체크 아이콘은 넣지 않음(2026-07-28 담당자
 *   지적: "체크 표시 빼라" — 실제 화면에도 없음)
 * - hover: 선택 여부와 무관하게 모든 항목에 무조건 테두리가 생김(2026-07-28 담당자 정정,
 *   select.tsx와 공통 규칙 — "아웃라인은 두 번 강조하는 게 아니다. 호버 시엔 무조건
 *   생기는 거다". select.tsx 주석 참고). 배경은 기존 규칙 유지(선택 안 된 항목 hover는
 *   gray20, 선택된 항목은 hover 여부와 무관하게 항상 #E8F0FE)
 * - disabled: 옵션 리스트 자체엔 현재 disabled 옵션 개념 없음(전체 Combobox disabled만 지원)
 *
 * ── 5. selected + hover 시 테두리 색 — 2026-07-29 담당자 확정: 현재값 유지 ─────
 * 배경(#E8F0FE)이 확정 Primary 팔레트 11단계 중 어느 값과도 정확히 일치하지 않아 실측만으로는
 * 확정할 수 없었던 값. 담당자가 "그대로 유지"로 확정해서 Primary-40(#7BBBFF, select.tsx와
 * 동일 처리)을 임시값이 아닌 최종값으로 확정함 — devtools 재확인 불필요.
 *
 * 키보드 탐색(방향키 이동 등)은 1차 버전엔 미포함 — 클릭/검색만 지원. 필요하면 추후 추가.
 *
 * ── 트리거 아이콘 커스터마이징 (2026-07-28 추가) ────────────────
 * select.tsx와 동일하게 `icon` prop 추가 — 기본 꺾쇠(ChevronDown) 대신 다른 아이콘으로 교체 가능.
 */

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  size?: "default" | "small";
  disabled?: boolean;
  className?: string;
  /** 트리거 우측 아이콘 — 기본값은 ChevronDown, 다른 아이콘으로 교체 가능(2026-07-28 추가) */
  icon?: React.ReactNode;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "선택",
      searchPlaceholder = "검색",
      emptyText = "검색 결과가 없습니다",
      size = "default",
      disabled,
      className,
      icon,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // 비제어(uncontrolled) 사용 지원 — value/onValueChange를 안 넘겨도 defaultValue 기준으로
    // 내부에서 선택 상태를 갖는다. 2026-07-28 담당자 지적: "작은 사이즈 콤보박스는 왜 선택이
    // 안 돼" — 원인은 컴포넌트가 완전 제어형(controlled-only)이라 부모가 value/onValueChange를
    // 안 넘기면 클릭해도 아무 반응이 없었던 것. 이후로는 안 넘겨도 기본 동작하도록 함.
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const handleSelect = (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    };

    const selected = options.find((o) => o.value === currentValue);
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
              !selected && "text-mes-text-placeholder",
              className
            )}
          >
            <span className="line-clamp-1">{selected ? selected.label : placeholder}</span>
            {icon ?? <ChevronDown className="size-3 shrink-0 opacity-80" />}
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className={cn(
              "z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-mes-panel border border-mes-border-default bg-white p-2 text-mes-text-default shadow-mes-panel",
              "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1"
            )}
          >
            <div className="flex h-[26px] items-center gap-[5px] rounded-mes-control border border-mes-border-default bg-white px-2">
              <Search className="size-4 shrink-0 text-mes-gray-60" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-full w-full bg-transparent text-[13px] leading-[1.5] text-mes-text-default outline-none placeholder:text-mes-text-placeholder"
              />
            </div>

            <div className="mt-2 max-h-[240px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-2 py-3 text-center text-[13px] leading-[1.5] text-mes-text-placeholder">
                  {emptyText}
                </div>
              ) : (
                filtered.map((option) => {
                  const isSelected = option.value === currentValue;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleSelect(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "relative flex w-full cursor-default select-none items-center rounded-mes-control border border-transparent px-2 py-[5px] text-left text-[13px] leading-[1.5] outline-none transition-colors hover:border-mes-primary-40",
                        isSelected ? "bg-[#e8f0fe]" : "hover:bg-mes-bg-subtle"
                      )}
                    >
                      <span className="line-clamp-1">{option.label}</span>
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
