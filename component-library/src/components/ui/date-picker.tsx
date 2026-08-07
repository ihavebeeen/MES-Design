"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { IconCalendar } from "@/components/icons";
import { inputVariants } from "./input";

/**
 * MES DatePicker — Figma 검색에서 "달력"(클라우드MES 파일) 이름은 찾았으나 node-id
 * 해석 불가(담당자 확인: 재시도 안 함) — 판단값으로 구현. 트리거는 Input 스타일
 * (`inputVariants`) + IconCalendar(Figma 실측 아이콘) 재사용, 패널은 Popover 재사용.
 * 날짜 계산은 외부 라이브러리 없이 순수 Date로 처리(새 의존성 추가 안 함).
 */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function buildMonthMatrix(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(d: Date, separator: "." | "-" = ".") {
  return `${d.getFullYear()}${separator}${String(d.getMonth() + 1).padStart(2, "0")}${separator}${String(d.getDate()).padStart(2, "0")}`;
}

export interface DatePickerProps {
  value?: Date | null;
  onValueChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  separator?: "." | "-";
}

function DatePicker({
  value,
  onValueChange,
  placeholder = "날짜 선택",
  disabled,
  className,
  separator = ".",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(value ?? new Date());

  const weeks = buildMonthMatrix(viewDate.getFullYear(), viewDate.getMonth());

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
          <span className="truncate whitespace-nowrap">{value ? formatDate(value, separator) : placeholder}</span>
          <IconCalendar size={16} className="shrink-0 text-mes-gray-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
            }
            className="flex size-6 items-center justify-center rounded-mes-control-xs text-mes-gray-70 hover:bg-mes-bg-subtler"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13px] font-semibold text-mes-text-default">
            {viewDate.getFullYear()}.{String(viewDate.getMonth() + 1).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() =>
              setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
            }
            className="flex size-6 items-center justify-center rounded-mes-control-xs text-mes-gray-70 hover:bg-mes-bg-subtler"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-[11px] text-mes-gray-60">
              {w}
            </span>
          ))}
          {weeks.flat().map((date, i) => {
            const selected = isSameDay(date, value ?? null);
            return (
              <button
                key={i}
                type="button"
                disabled={!date}
                onClick={() => date && onValueChange?.(date)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-mes-control-xs text-[12px]",
                  !date && "invisible",
                  selected
                    ? "bg-mes-bg-brand text-mes-text-inverse"
                    : "text-mes-text-default hover:bg-mes-bg-subtler"
                )}
              >
                {date?.getDate()}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker, buildMonthMatrix, isSameDay, formatDate, WEEKDAYS };
