"use client";

import * as React from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";

export type ProductionGanttRow = { id: string; label: string; start: number; end: number; tone?: "brand" | "strong" };

export interface ProductionGanttPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: ProductionGanttRow[];
  defaultScale?: "hour" | "day";
}

export function ProductionGanttPattern({ rows, defaultScale = "hour", className, ...props }: ProductionGanttPatternProps) {
  const [scale, setScale] = React.useState(defaultScale);
  return (
    <div className={cn("min-w-0 rounded-mes-control border border-mes-gray-30 bg-white p-4", className)} {...props}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold text-mes-gray-130">생산 일정</p>
        <SegmentedControl
          ariaLabel="간트 표시 단위"
          options={[{ value: "hour", label: "시간" }, { value: "day", label: "일" }]}
          value={scale}
          onValueChange={(next) => setScale(next as "hour" | "day")}
        />
      </div>
      <div className="space-y-2">
        {rows.map((row) => {
          const start = Math.min(100, Math.max(0, row.start));
          const end = Math.min(100, Math.max(start, row.end));
          return (
            <div key={row.id} className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-2">
              <span className="truncate text-[11px] text-mes-gray-90">{row.label}</span>
              <div className="relative h-5 overflow-hidden rounded-mes-control-xs bg-mes-gray-20">
                <div className={cn("absolute inset-y-0 rounded-mes-control-xs", row.tone === "strong" ? "bg-mes-gray-100" : "bg-mes-primary-60")} style={{ left: `${start}%`, width: `${end - start}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
