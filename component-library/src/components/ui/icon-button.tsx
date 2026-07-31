import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconX } from "../icons/icon-x";

/**
 * MES IconButton — Figma 디자인 없음(체크리스트 티어2 "Icon Button", 상태 "없음").
 *
 * 실측 근거가 없어서, 이미 여러 컴포넌트가 각자 인라인으로 만들어 쓰고 있던 "아이콘만
 * 있는 버튼" 패턴(ConfirmDialog/RadioChoiceDialog 헤더 닫기, NotificationPanel 닫기·필터,
 * Sidebar 접기 버튼, PageTopTabItem 북마크·닫기)을 역으로 관찰해서 공용 컴포넌트로
 * 뽑아냈다 — 새 디자인을 임의로 만든 게 아니라 이미 반복되던 값(높이 22/32/40px,
 * radius는 Button과 동일한 mes-control-xs/control 스케일)을 그대로 재사용.
 * 색상 variant도 Button의 fillMain/fillGray/fillBlack 네이밍을 그대로 따르고, 기존
 * 인라인 구현들이 전부 "투명 배경 + 아이콘 색만" 형태였던 것에 `ghost`라는 이름을 새로
 * 붙였다(Button엔 없던 variant — 아이콘 버튼에서 압도적으로 많이 쓰이는 형태라 기본값으로 지정).
 *
 * 기존 컴포넌트(ConfirmDialog 등)의 인라인 닫기 버튼은 이번에 리팩터링하지 않았다 —
 * 이미 동작하는 코드를 요청 범위 밖에서 건드리지 않는다는 원칙(재발 방지 규칙 7번)에
 * 따라, 새 화면을 만들 때부터 이 컴포넌트를 쓰도록 하는 것으로 범위를 한정.
 */
const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition-colors disabled:pointer-events-none disabled:bg-mes-gray-40 disabled:text-mes-gray-60",
  {
    variants: {
      variant: {
        ghost: "bg-transparent text-mes-gray-70 hover:bg-mes-bg-subtle hover:text-mes-gray-130",
        fillMain: "bg-mes-bg-brand text-mes-text-inverse hover:bg-mes-bg-brand-hover",
        fillGray: "bg-mes-gray-40 text-mes-gray-130 hover:bg-mes-gray-50",
        fillBlack: "bg-mes-bg-strong text-mes-text-inverse hover:bg-mes-gray-110",
        lineBlacktxt:
          "bg-white text-mes-text-default border border-mes-border-default hover:bg-mes-bg-subtler",
      },
      size: {
        basic: "size-10 rounded-mes-control [&_svg]:size-5",
        small: "size-8 rounded-mes-control [&_svg]:size-4",
        xsmall: "size-[22px] rounded-mes-control-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "small",
    },
  }
);

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
  icon: React.ReactNode;
  /** 아이콘만 있는 버튼이라 스크린리더용 라벨이 항상 필요함 — 필수 prop으로 강제 */
  "aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, icon, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        type={asChild ? undefined : "button"}
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon}
      </Comp>
    );
  }
);
IconButton.displayName = "IconButton";

export interface CloseButtonProps
  extends Omit<IconButtonProps, "icon" | "aria-label"> {
  "aria-label"?: string;
}

/**
 * CloseButton — 체크리스트 티어2 "Close Button (X)" 항목. IconButton + IconX 고정 프리셋.
 * 다이얼로그/배너 등에서 반복되는 "닫기" 버튼을 새로 그리지 않고 여기서 가져다 쓰면 됨.
 */
const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ "aria-label": ariaLabel = "닫기", size = "small", ...props }, ref) => (
    <IconButton ref={ref} icon={<IconX />} aria-label={ariaLabel} size={size} {...props} />
  )
);
CloseButton.displayName = "CloseButton";

export { IconButton, CloseButton, iconButtonVariants };
