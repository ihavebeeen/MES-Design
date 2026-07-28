"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Select (Selectbox) — Figma 실측 기반, Radix Select로 구현(네이티브 select에서 교체)
 *
 * 트리거 박스 — 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:82969 하위
 * (9873:83021/83032/83035/83038/83041). Input(input.tsx)과 배경·테두리·글자색·radius·padding 동일 — 같은 위계.
 * - default: height 32px, 좌우 padding 10px, radius 4px, 폰트 14px
 * - small: height 22px, 좌우 padding 6px, radius 3px, 폰트 13px
 * - focus 상태 테두리는 Input과 같은 패턴(#011327/gray130)이 아니라 열림 상태(data-[state=open])에도 동일하게 적용
 * - Figma에 selectbox의 readonly/disable 상태가 없어 disable만 표준 동작으로 최소 처리, readonly는 미구현
 *
 * 펼침 목록 패널 — 출처: node 20140:101510 하위(20140:101474) 실측 + 담당자 제공 실측값(2026-07-28):
 * - 테두리 1px, 색 #E4E7EE(gray30)
 * - 내부 패딩 8px
 * - 그림자: 담당자가 실제 서비스 devtools에서 확인해 준 값 `.searchable-select-dropdown { box-shadow: 0 2px 8px rgba(0,0,0,.12) }` 사용
 *   (Figma 쪽엔 이 컴포넌트가 없어서 담당자가 대충 잡아둔 값(0 4px 20px rgba(0,0,0,.10))이 있었으나,
 *   실제 서비스에 이미 적용 중인 값이 있어 그쪽을 채택함 — 이견 있으면 알려주면 바로 교체)
 * - 항목 간격(row pitch) 30px(패널 실측), 폰트 Pretendard Regular 13px/line-height 150%, 텍스트 색 gray130
 * - 선택된 항목 강조 배경: `#E8F0FE`(담당자 확인, 실제 서비스 화면 스크린샷 기준. 근무조 선택 콤보박스 예시)
 *
 * 미확인 상태로 남은 값(TODO — 확인되는 대로 교체):
 * - 선택된 항목에 마우스 올렸을 때(hover) 나타나는 테두리 색 — 배경(#E8F0FE)은 확인됐지만 테두리 색은
 *   아직 모름. 담당자가 "primary 팔레트에서 배경보다 1~2단계 진한 색 아니냐"는 가설을 제시했으나,
 *   배경 #E8F0FE 자체가 확정 Primary 팔레트 11단계 중 어느 값과도 정확히 일치하지 않아(Primary-20
 *   #E8F5FF와 가장 비슷하지만 다른 값) 유추만으로 확정할 수 없음 — 우선 Primary-40(#7BBBFF)을
 *   임시값으로 넣어둠(combobox.tsx와 동일 처리). devtools 실측값 확인되면 즉시 교체.
 *
 * 판단해서 채운 값(미실측, 담당자가 "이외엔 판단해서 채워달라"고 확인함 — 정확한 값 나오면 교체 필요):
 * - 패널 radius: 8px
 * - 선택 안 된 항목의 hover 배경: gray20(다른 컴포넌트의 "옅은 강조" 패턴과 동일하게 맞춤)
 * - 항목 좌우 padding: 패널 패딩(8px)만 적용, 항목 자체엔 추가 padding 없음(실측 좌측 오프셋 9px와 거의 일치)
 * - 선택 항목 체크 아이콘: Radix 표준 패턴으로 추가(스크린샷엔 없었지만 접근성/사용성상 넣음)
 *
 * 별도 확인 필요(디자인 시스템 이슈, 체크리스트 19번 섹션에 등록함): 실제 서비스엔 검색창이 내장된
 * 콤보박스(`.searchable-select-dropdown`, 예: 근무조 선택)가 있는데, 지금 디자인 시스템엔 일반 Select와
 * 구분이 안 돼 있음. 이 컴포넌트는 우선 검색 없는 일반 Select만 구현 — 검색 내장형은 별도 컴포넌트로 추후 설계.
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
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-hidden rounded-[8px] border border-mes-gray-30 bg-white p-2 text-mes-gray-130 shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
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
      "relative flex w-full cursor-default select-none items-center rounded-[4px] border border-transparent py-[5px] pr-6 text-[13px] leading-[1.5] outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=unchecked]:data-[highlighted]:bg-mes-gray-20 data-[state=checked]:bg-[#e8f0fe] data-[state=checked]:data-[highlighted]:border-mes-primary-40",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-0 flex items-center">
      <Check className="size-3.5" />
    </SelectPrimitive.ItemIndicator>
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
