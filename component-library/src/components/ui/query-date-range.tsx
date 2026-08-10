"use client";

import * as React from "react";
import { DatePicker } from "./date-picker";
import { cn } from "@/lib/utils";

export interface QueryDateRangeProps {
  label?: string;
  start: Date | null;
  end: Date | null;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
  className?: string;
}

/** 조회 헤더의 라벨 + 시작일 + 구분자 + 종료일 결합형 기간 입력. */
function QueryDateRange({ label = "조회기준일자", start, end, onStartChange, onEndChange, className }: QueryDateRangeProps) {
  return (
    <div className={cn("flex h-8 shrink-0 items-center overflow-hidden rounded-mes-control border border-mes-border-default bg-white", className)}>
      <span className="flex h-full items-center border-r border-mes-border-default px-3 text-[14px] font-medium whitespace-nowrap">{label}</span>
      <DatePicker value={start} onValueChange={onStartChange} iconPosition="start" iconColor="default" className="h-[30px] w-[114px] rounded-none border-0 bg-white px-2 text-[14px] shadow-none" />
      <span className="text-[14px] text-mes-gray-80">~</span>
      <DatePicker value={end} onValueChange={onEndChange} iconPosition="start" iconColor="default" className="h-[30px] w-[114px] rounded-none border-0 bg-white px-2 text-[14px] shadow-none" />
    </div>
  );
}

export { QueryDateRange };
