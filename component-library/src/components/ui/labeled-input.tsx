"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabeledInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
}

/** 한 개의 32px 입력 컨트롤 안에 보조 라벨과 값을 배치한다. */
const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(({ label, className, ...props }, ref) => (
  <label className={cn("flex h-8 items-center gap-3 rounded-mes-control border border-mes-gray-30 bg-white px-3", className)}>
    <span className="shrink-0 text-[14px] font-medium leading-none text-mes-gray-70">{label}</span>
    <input ref={ref} className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-mes-gray-130 outline-none" {...props} />
  </label>
));
LabeledInput.displayName = "LabeledInput";

export { LabeledInput };
