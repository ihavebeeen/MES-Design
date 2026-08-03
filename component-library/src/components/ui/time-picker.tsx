"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { inputVariants } from "./input";

/**
 * MES TimePicker — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Time Picker", 상태
 * "없음", 재탐색 안 함 — 판단값 우선). 트리거는 Input 스타일 재사용, 패널은 Popover
 * 재사용 + 지정 간격 시간 목록(스크롤) — Combobox 옵션 리스트의 hover/선택 규칙 재사용.
 */
export interface TimePickerProps {
  value?: string;
  onValueChange?: (time: string) => void;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function buildTimeOptions(step: number): string[] {
  const options: string[] = [];
  for (let m = 0; m < 24 * 60; m += step) {
    const h = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    options.push(`${h}:${mm}`);
  }
  return options;
}

function TimePicker({
  value,
  onValueChange,
  step = 30,
  placeholder = "시간 선택",
  disabled,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const options = React.useMemo(() => buildTimeOptions(step), [step]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            inputVariants({ size: "default" }),
            "flex items-center justify-between gap-2 text-left",
            !value && "text-mes-text-placeholder",
            className
          )}
        >
          <span className="truncate whitespace-nowrap">{value ?? placeholder}</span>
          <Clock size={16} className="shrink-0 text-mes-gray-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-[220px] w-[120px] overflow-y-auto p-1.5">
        {options.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => {
              onValueChange?.(time);
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center justify-center rounded-mes-control px-2 py-[5px] text-[13px]",
              time === value
                ? "bg-[#e8f0fe] text-mes-text-brand"
                : "text-mes-text-default hover:bg-mes-bg-subtle"
            )}
          >
            {time}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export { TimePicker };
