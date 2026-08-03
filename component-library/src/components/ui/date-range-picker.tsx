"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { IconCalendar } from "@/components/icons";
import { inputVariants } from "./input";
import { buildMonthMatrix, formatDate, WEEKDAYS } from "./date-picker";

/**
 * MES DateRangePicker — DatePicker(`date-picker.tsx`)와 같은 이유로 판단값(Figma
 * 재탐색 안 함). 달력 계산 로직(`buildMonthMatrix`/`formatDate`/`WEEKDAYS`)은
 * DatePicker에서 그대로 가져와 재사용 — 같은 달력 그리드를 중복 구현하지 않음.
 * 시작일 클릭 → 종료일 클릭 순서로 선택, 사이 날짜는 옅은 브랜드 배경으로 표시.
 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value: DateRange;
  onValueChange: (range: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function inRange(date: Date, range: DateRange) {
  if (!range.start || !range.end) return false;
  return date > range.start && date < range.end;
}

function DateRangePicker({
  value,
  onValueChange,
  placeholder = "기간 선택",
  disabled,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(value.start ?? new Date());

  const weeks = buildMonthMatrix(viewDate.getFullYear(), viewDate.getMonth());

  const handleClick = (date: Date) => {
    if (!value.start || (value.start && value.end)) {
      onValueChange({ start: date, end: null });
    } else if (date < value.start) {
      onValueChange({ start: date, end: value.start });
    } else {
      onValueChange({ start: value.start, end: date });
    }
  };

  const label =
    value.start && value.end
      ? `${formatDate(value.start)} ~ ${formatDate(value.end)}`
      : value.start
        ? `${formatDate(value.start)} ~`
        : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            inputVariants({ size: "default" }),
            "flex items-center justify-between gap-2 text-left",
            !value.start && "text-mes-text-placeholder",
            className
          )}
        >
          {label}
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
            const isStart = !!date && !!value.start && date.getTime() === value.start.getTime();
            const isEnd = !!date && !!value.end && date.getTime() === value.end.getTime();
            const isBetween = !!date && inRange(date, value);
            return (
              <button
                key={i}
                type="button"
                disabled={!date}
                onClick={() => date && handleClick(date)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-mes-control-xs text-[12px]",
                  !date && "invisible",
                  isStart || isEnd
                    ? "bg-mes-bg-brand text-mes-text-inverse"
                    : isBetween
                      ? "bg-mes-bg-brand-subtle-strong text-mes-text-brand"
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

export { DateRangePicker };
