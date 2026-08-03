"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputVariants } from "./input";

/**
 * MES NumberInput — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Number Input", 상태
 * "없음", Figma 재탐색 안 함 — 판단값 우선). 텍스트 박스는 Input(`input.tsx`)의 실측
 * 스타일(`inputVariants`)을 그대로 재사용하고, 증감 버튼만 판단값으로 붙임(Plus/Minus,
 * lucide — 다른 컴포넌트의 chevron류와 동일하게 lucide 사용 원칙).
 */
export interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "default" | "small";
  disabled?: boolean;
  className?: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { value, defaultValue = 0, onValueChange, min, max, step = 1, size = "default", disabled, className },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const clamp = (n: number) => {
      let next = n;
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      return next;
    };

    const setValue = (next: number) => {
      const clamped = clamp(next);
      if (!isControlled) setInternalValue(clamped);
      onValueChange?.(clamped);
    };

    return (
      <div className={cn("inline-flex items-stretch", className)}>
        <input
          ref={ref}
          type="number"
          value={currentValue}
          disabled={disabled}
          onChange={(e) => setValue(Number(e.target.value))}
          className={cn(
            inputVariants({ size }),
            "rounded-r-none border-r-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          )}
        />
        <div className="flex flex-col overflow-hidden rounded-r-mes-control border border-l-0 border-mes-border-default">
          <button
            type="button"
            disabled={disabled || (max !== undefined && currentValue >= max)}
            onClick={() => setValue(currentValue + step)}
            aria-label="증가"
            className="flex h-1/2 w-6 items-center justify-center border-b border-mes-border-default bg-white text-mes-gray-70 hover:bg-mes-bg-subtler disabled:pointer-events-none disabled:text-mes-gray-40"
          >
            <Plus size={10} />
          </button>
          <button
            type="button"
            disabled={disabled || (min !== undefined && currentValue <= min)}
            onClick={() => setValue(currentValue - step)}
            aria-label="감소"
            className="flex h-1/2 w-6 items-center justify-center bg-white text-mes-gray-70 hover:bg-mes-bg-subtler disabled:pointer-events-none disabled:text-mes-gray-40"
          >
            <Minus size={10} />
          </button>
        </div>
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
