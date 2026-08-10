"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MesProductSwitcherProps {
  value: "MES" | "FEMS";
  onValueChange?: (value: "MES" | "FEMS") => void;
  collapsed?: boolean;
  className?: string;
}

/** MES/FEMS 제품 전환기. 접힌 SNB에서는 원본처럼 M/F 두 글자만 노출한다. */
function MesProductSwitcher({
  value,
  onValueChange,
  collapsed = false,
  className,
}: MesProductSwitcherProps) {
  return (
    <div
      className={cn(
        "grid h-[30px] overflow-hidden rounded-mes-control border border-mes-gray-50 bg-white",
        collapsed ? "w-[46px] grid-cols-2" : "w-full grid-cols-2",
        className
      )}
      aria-label="제품 전환"
    >
      {(["MES", "FEMS"] as const).map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={value === item}
          onClick={() => onValueChange?.(item)}
          className={cn(
            "flex items-center justify-center text-[12px] font-semibold",
            value === item ? "bg-black text-white" : "bg-white text-mes-gray-100"
          )}
        >
          {collapsed ? item[0] : item}
        </button>
      ))}
    </div>
  );
}

export { MesProductSwitcher };
