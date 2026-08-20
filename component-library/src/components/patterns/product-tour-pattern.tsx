"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProductTourStep = { id: string; title: string; description: string };

export interface ProductTourPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ProductTourStep[];
  defaultStep?: number;
  onComplete?: () => void;
}

export function ProductTourPattern({ steps, defaultStep = 0, onComplete, className, ...props }: ProductTourPatternProps) {
  const [index, setIndex] = React.useState(Math.min(Math.max(defaultStep, 0), Math.max(steps.length - 1, 0)));
  const step = steps[index];
  if (!step) return null;
  const last = index === steps.length - 1;

  return (
    <div className={cn("w-[280px] rounded-mes-control border border-mes-primary-40 bg-white p-3 shadow-mes-modal", className)} role="dialog" aria-labelledby={`product-tour-${step.id}`} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="blueLight">{index + 1}/{steps.length}</Badge>
          <p id={`product-tour-${step.id}`} className="mt-2 text-[13px] font-semibold text-mes-gray-130">{step.title}</p>
        </div>
      </div>
      <p className="mt-1 text-[12px] leading-5 text-mes-gray-70">{step.description}</p>
      <div className="mt-3 flex justify-end gap-1">
        <Button type="button" size="xsmall" variant="lineBlacktxt" disabled={index === 0} onClick={() => setIndex((current) => Math.max(0, current - 1))}>이전</Button>
        <Button type="button" size="xsmall" variant="fillBlack" onClick={() => last ? onComplete?.() : setIndex((current) => Math.min(steps.length - 1, current + 1))}>{last ? "완료" : "다음"}</Button>
      </div>
    </div>
  );
}
