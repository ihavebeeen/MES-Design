"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SegmentedControlOption = { value: string; label: React.ReactNode; disabled?: boolean };

export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  ariaLabel: string;
}

export function SegmentedControl({ options, value, defaultValue, onValueChange, ariaLabel, className, ...props }: SegmentedControlProps) {
  const enabledOptions = options.filter((option) => !option.disabled);
  const fallback = defaultValue ?? enabledOptions[0]?.value ?? "";
  const [internalValue, setInternalValue] = React.useState(fallback);
  const selectedValue = value ?? internalValue;
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const select = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const move = (currentIndex: number, direction: 1 | -1) => {
    if (enabledOptions.length === 0) return;
    const currentValue = options[currentIndex]?.value;
    const enabledIndex = Math.max(0, enabledOptions.findIndex((option) => option.value === currentValue));
    const next = enabledOptions[(enabledIndex + direction + enabledOptions.length) % enabledOptions.length];
    const nextIndex = options.findIndex((option) => option.value === next.value);
    select(next.value);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div className={cn("inline-flex rounded-mes-control bg-mes-gray-20 p-1", className)} role="radiogroup" aria-label={ariaLabel} {...props}>
      {options.map((option, index) => {
        const selected = option.value === selectedValue;
        return (
          <Button
            key={option.value}
            ref={(node) => { refs.current[index] = node; }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!selectedValue && index === 0) ? 0 : -1}
            disabled={option.disabled}
            size="xsmall"
            variant={selected ? "fillBlack" : "fillGray"}
            className={!selected ? "bg-transparent hover:bg-mes-gray-30" : undefined}
            onClick={() => select(option.value)}
            onKeyDown={(event) => {
              if (["ArrowRight", "ArrowDown"].includes(event.key)) { event.preventDefault(); move(index, 1); }
              if (["ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); move(index, -1); }
              if (event.key === "Home" && enabledOptions[0]) { event.preventDefault(); select(enabledOptions[0].value); refs.current[options.findIndex((item) => item.value === enabledOptions[0].value)]?.focus(); }
              if (event.key === "End" && enabledOptions.at(-1)) { const last = enabledOptions.at(-1)!; event.preventDefault(); select(last.value); refs.current[options.findIndex((item) => item.value === last.value)]?.focus(); }
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
