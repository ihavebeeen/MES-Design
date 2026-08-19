"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "defaultValue" | "onChange"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  formatValue?: (value: number) => React.ReactNode;
}

/**
 * 연속 수치 범위를 조절하는 입력이다. 정확한 숫자 입력이 우선인 업무에는 NumberInput을 사용한다.
 * 사용자 승격 자산이며 실제 MES 원본 대조 전까지 provisional 상태로 관리한다.
 */
const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue = 0, onValueChange, showValue = true, formatValue = (current) => current, min = 0, max = 100, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = value ?? internalValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number(event.target.value);
      if (value === undefined) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <div className={cn("flex min-w-0 items-center gap-3", className)}>
        <Input
          {...props}
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={currentValue}
          onChange={handleChange}
          className="h-2 min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-mes-gray-30 p-0 accent-mes-primary-60"
        />
        {showValue && <output className="min-w-10 text-right text-[14px] font-semibold text-mes-gray-130">{formatValue(currentValue)}</output>}
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
