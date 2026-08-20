import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  label?: React.ReactNode;
}

export function ProgressCircle({ value, size = 80, label, className, ...props }: ProgressCircleProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const innerSize = Math.max(20, size - 24);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("grid shrink-0 place-items-center rounded-full", className)}
      style={{ width: size, height: size, background: `conic-gradient(var(--mes-primary-60) ${clamped}%, var(--mes-gray-30) 0)` }}
      {...props}
    >
      <div className="grid place-items-center rounded-full bg-white text-[14px] font-bold text-mes-gray-130" style={{ width: innerSize, height: innerSize }}>
        {label ?? `${clamped}%`}
      </div>
    </div>
  );
}
