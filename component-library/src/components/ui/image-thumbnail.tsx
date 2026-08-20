"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ImageThumbnailItem = {
  id: string;
  label: string;
  preview?: React.ReactNode;
};

export interface ImageThumbnailProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: ImageThumbnailItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "small" | "medium";
}

export function ImageThumbnail({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "medium",
  className,
  ...props
}: ImageThumbnailProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? items[0]?.id ?? "");
  const selectedValue = value ?? internalValue;

  const select = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="listbox" aria-label="이미지 선택" {...props}>
      {items.map((item) => {
        const selected = item.id === selectedValue;
        return (
          <Button
            key={item.id}
            type="button"
            role="option"
            aria-selected={selected}
            variant="lineBlacktxt"
            size="xsmall"
            onClick={() => select(item.id)}
            className={cn(
              "h-auto flex-col gap-1 rounded-mes-control p-1 font-normal",
              selected && "border-mes-primary-60 bg-mes-primary-10",
            )}
          >
            <span
              className={cn(
                "grid place-items-center rounded-mes-control-xs bg-mes-gray-20 text-[11px] text-mes-gray-70",
                size === "small" ? "size-12" : "size-16",
              )}
            >
              {item.preview ?? item.label.slice(0, 1)}
            </span>
            <span className="max-w-20 truncate px-1 text-[11px] text-mes-gray-90">{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
