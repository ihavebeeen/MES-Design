"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Select (Selectbox) — Figma 실측 기반, Radix Select로 구현(네이티브 select에서 교체)
 *
 * ── 1. 트리거 박스 ──────────────────────────────────────────────
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:82969 하위
 * (9873:83021/83032/83035/83038/83041). Input(input.tsx)과 배경·테두리·글자색·radius·padding 동일 — 같은 위계.
 * - default: height 32px, 좌우 padding 10px, radius 4px, 폰트 14px
 * - small: height 22px, 좌우 padding 6px, radius 3px, 폰트 13px
 * - Figma에 selectbox의 readonly/disable 상태가 없어 disable만 표준 동작으로 최소 처리, readonly는 미구현
 *
 * 상태별:
 * - default: 배경 흰색, 테두리 gray30
 * - open(펼침): 테두리 gray130 (Input의 focus 테두리 패턴과 동일 색, 트리거에선 open 상태에 적용)
 * - placeholder: 텍스트 gray60
 * - disabled: 테두리 gray30, 배경 gray30, 텍스트 gray70
 *
 * ── 2. 펼침 목록 패널 ──────────────────────────────────────────
 * 출처: node 20140:101510 하위(20140:101474) 실측 + 담당자 제공 실측값(2026-07-28):
 * - 테두리 1px, 색 gray30(#E4E7EE)
 * - 내부 패딩 8px
 * - 너비: 트리거 너비와 동일하게 고정(`var(--radix-select-trigger-width)`) — 내용 길이로 늘어나지 않음
 *   (2026-07-28 담당자 지적: "펼쳤을 때 너비는 원본 너비와 동일해야 함, 텍스트가 아주 길 때만 예외")
 * - 그림자: 담당자가 실제 서비스 devtools에서 확인해 준 값 `.searchable-select-dropdown { box-shadow: 0 2px 8px rgba(0,0,0,.12) }` 사용
 *   (Figma 쪽엔 이 컴포넌트가 없어서 담당자가 대충 잡아둔 값(0 4px 20px rgba(0,0,0,.10))이 있었으나,
 *   실제 서비스에 이미 적용 중인 값이 있어 그쪽을 채택함 — 이견 있으면 알려주면 바로 교체)
 * - radius: 8px(판단값, 미실측)
 *
 * ── 3. 목록 항목 — 상태별 스타일 ───────────────────────────────
 * 출처: node 20140:101474 계열 + 담당자 확인 실측값. 항목 간격(row pitch) 30px, 폰트 Pretendard
 * Regular 13px/line-height 150%, 텍스트 색 gray130. 좌우 padding 8px(담당자 확인, 2026-07-28).
 * - default(선택 안 됨, hover 아님): 배경 없음
 * - hover(선택 안 됨): 배경 gray20(판단값 — 다른 컴포넌트의 "옅은 강조" 패턴과 동일하게 맞춤)
 * - selected(선택됨): 배경 #E8F0FE(담당자 확인, 실제 서비스 화면 스크린샷 기준. 근무조 선택 콤보박스 예시).
 *   우측 체크 아이콘은 넣지 않음(2026-07-28 담당자 지적: "체크 표시 빼라" — 실제 화면에도 없음)
 * - selected + hover: 배경 #E8F0FE 유지 + 테두리 추가(아래 TODO 참고)
 * - disabled: opacity 50%로 흐리게, 클릭 불가
 *
 * ── 4. 미확인 상태로 남은 값(TODO — 확인되는 대로 교체) ─────────
 * - selected + hover 시 테두리 색 — 배경(#E8F0FE)은 확인됐지만 테두리 색은 아직 모름.
 *   담당자가 "primary 팔레트에서 배경보다 1~2단계 진한 색 아니냐"는 가설을 제시했으나,
 *   배경 #E8F0FE 자체가 확정 Primary 팔레트 11단계 중 어느 값과도 정확히 일치하지 않아(Primary-20
 *   #E8F5FF와 가장 비슷하지만 다른 값) 유추만으로 확정할 수 없음 — 우선 Primary-40(#7BBBFF)을
 *   임시값으로 넣어둠(combobox.tsx와 동일 처리). devtools 실측값 확인되면 즉시 교체.
 *
 * ── 5. 판단해서 채운 값(미실측 — 정확한 값 나오면 교체 필요) ────
 * - 패널 radius: 8px
 * - 선택 안 된 항목의 hover 배경: gray20
 *
 * ── 6. Selectbox vs Combobox 구분 (2026-07-28 분리 완료) ────────
 * 실제 서비스엔 검색창이 내장된 콤보박스(`.searchable-select-dropdown`, 예: 근무조 선택)가 별도로
 * 있어 `combobox.tsx`로 분리 구현함. 이 파일(select.tsx)은 검색 없는 일반 Select 전용.
 */

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-2.5 bg-white border border-mes-gray-30 text-mes-gray-130 outline-none transition-colors data-[placeholder]:text-mes-gray-60 data-[state=open]:border-mes-gray-130 disabled:cursor-not-allowed disabled:border-mes-gray-30 disabled:bg-mes-gray-30 disabled:text-mes-gray-70 [&>span]:line-clamp-1",
  {
    variants: {
      size: {
        default: "h-8 px-[10px] rounded-[4px] text-[14px]",
        small: "h-[22px] px-[6px] rounded-[3px] text-[13px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, size, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ size, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-3 shrink-0 opacity-80" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        "relative z-50 max-h-[var(--radix-select-content-available-height)] overflow-hidden rounded-[8px] border border-mes-gray-30 bg-white p-2 text-mes-gray-130 shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
        position === "popper" &&
          "w-[var(--radix-select-trigger-width)] data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          position === "popper" && "h-[var(--radix-select-trigger-height)] w-full"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-[4px] border border-transparent px-2 py-[5px] text-[13px] leading-[1.5] outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=unchecked]:data-[highlighted]:bg-mes-gray-20 data-[state=checked]:bg-[#e8f0fe] data-[state=checked]:data-[highlighted]:border-mes-primary-40",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText asChild>
      <span className="line-clamp-1">{children}</span>
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  selectTriggerVariants,
};
