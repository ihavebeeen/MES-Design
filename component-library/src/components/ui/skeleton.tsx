import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Skeleton — Figma 디자인 없음(체크리스트 티어2 "Skeleton", 상태 "없음").
 * 배경은 hover 배경으로 이미 쓰이는 `bg-mes-bg-subtle`(Gray-20) 재사용, Tailwind 기본
 * `animate-pulse`로 깜빡임. variant는 실제 콘텐츠 모양에 맞춰 셋만 구분(텍스트 한 줄/
 * 사각 블록/원형 아바타) — 필요하면 `className`으로 크기 직접 지정.
 */
const skeletonVariants = cva("animate-pulse bg-mes-bg-subtle", {
  variants: {
    variant: {
      text: "h-4 w-full rounded-mes-control-xs",
      rect: "h-24 w-full rounded-mes-control",
      circle: "size-10 rounded-full",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
