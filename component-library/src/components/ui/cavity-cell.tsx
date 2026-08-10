"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CavityCellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: number;
  selected?: boolean;
}

/** 캐비티 배열의 10×10 셀. 값 없음/값 있음/선택 상태를 소유한다. */
function CavityCell({ value, selected = false, className, ...props }: CavityCellProps) {
  return <button type="button" disabled={!value} className={cn("flex h-[38px] min-w-0 items-center justify-center border text-[14px] font-medium", value ? selected ? "border-mes-primary-40 bg-mes-primary-30 text-mes-primary-70" : "border-mes-primary-20 bg-mes-primary-10 text-mes-gray-80" : "border-mes-gray-30 bg-white", className)} {...props}>{value}</button>;
}

export { CavityCell };
