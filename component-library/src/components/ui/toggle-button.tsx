import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES ToggleButton — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Toggle Button", 상태 "없음").
 * 새 배색을 만들지 않고 Button의 기존 variant 배색을 그대로 재사용: 눌리지 않은
 * 상태 = lineBlacktxt(흰 배경/gray30 테두리), 눌린 상태 = opacityMain(연한 파랑 배경/
 * primary 텍스트). 사이즈 규격(height/padding/font)도 Button과 동일값(`button.tsx` 참고).
 */
export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: "basic" | "small" | "xsmall";
}

const SIZE_CLASS: Record<NonNullable<ToggleButtonProps["size"]>, string> = {
  basic: "h-10 px-4 text-[15px] rounded-mes-control",
  small: "h-8 px-2.5 text-[14px] rounded-mes-control",
  xsmall: "h-[22px] px-2 text-[12px] rounded-mes-control-xs",
};

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ pressed, onPressedChange, size = "basic", className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      onClick={(e) => {
        onClick?.(e);
        onPressedChange?.(!pressed);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap border font-semibold leading-[150%] transition-colors",
        SIZE_CLASS[size],
        pressed
          ? "border-transparent bg-mes-bg-brand-subtle-strong text-mes-text-brand"
          : "border-mes-border-default bg-white text-mes-text-default hover:bg-mes-bg-subtler",
        "disabled:pointer-events-none disabled:border-mes-gray-40 disabled:bg-mes-gray-40 disabled:text-mes-gray-60",
        className
      )}
      {...props}
    />
  )
);
ToggleButton.displayName = "ToggleButton";

export { ToggleButton };
