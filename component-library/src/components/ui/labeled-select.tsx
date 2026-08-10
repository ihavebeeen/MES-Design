"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export interface LabeledSelectProps {
  label: string;
  value: string;
  options: string[];
  onValueChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * 한 컨트롤 안에 보조 라벨과 선택값을 함께 표시하는 MES 조회/일괄변경용 Select.
 * Figma node 18813:64170의 `추가 입고일 · 2025-10-30` 구조를 공용화했다.
 */
function LabeledSelect({
  label,
  value,
  options,
  onValueChange,
  className,
  disabled,
}: LabeledSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn("gap-3 pl-3 pr-[10px]", className)}>
        <span className="shrink-0 text-[14px] font-medium leading-none text-mes-gray-70">{label}</span>
        <SelectValue className="min-w-0 flex-1 text-left" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>{option}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { LabeledSelect };
