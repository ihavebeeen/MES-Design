import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Button — Figma 실측 기반 (fill-main, node 163:8435 / 163:8345)
 * 출처: docs/신규_컴포넌트_설계_프로세스.md Step C-1
 *
 * 현재 구현된 값:
 * - size=basic: radius 4px, height 40px(hug), 좌우 padding 16px, 폰트 Pretendard SemiBold 15px/line-height 150%
 * - size=small: radius 4px, height 32px(hug), 좌우 padding 10px, 폰트 Pretendard SemiBold 14px/line-height 150%
 * - size=xsmall: radius 4px(basic/small과 동일하다고 가정 — 별도 확인 필요), height 22px(hug), 좌우 padding 8px, 폰트 Pretendard SemiBold 12px/line-height 150%
 *   (2026-07-28, 담당자가 직접 구술로 정정 — Figma get_design_context 노드ID 대조는 아직 못함, 추후 실제 노드 확인 시 이 주석 업데이트)
 * - color=primary: bg #1573FB(mes-primary-60), text #FFFFFF
 * - 버튼 너비는 hug(내용에 맞춰 자동, 고정값 없음) — inline-flex + 너비 미지정으로 이미 충족
 *
 * TODO(미실측): xsmall의 실제 Figma node ID/radius 확인, secondary/outline/ghost 컬러 변형, hover/press/disable 상태값.
 * 재발 방지 규칙에 따라 실제 Figma 노드를 실측하기 전까지는 임의로 값을 유추해 추가하지 않는다.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded whitespace-nowrap font-semibold leading-[150%] transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-mes-primary-60 text-white hover:bg-mes-primary-70",
      },
      size: {
        basic: "h-10 px-4 text-[15px] rounded-[4px]",
        small: "h-8 px-2.5 text-[14px] rounded-[4px]",
        xsmall: "h-[22px] px-2 text-[12px] rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "basic",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
