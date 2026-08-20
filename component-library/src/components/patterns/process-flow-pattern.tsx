"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProcessFlowStep = { id: string; label: string; description?: string; disabled?: boolean };

export interface ProcessFlowPatternProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  steps: ProcessFlowStep[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  ariaLabel?: string;
}

export function ProcessFlowPattern({ steps, value, defaultValue, onValueChange, ariaLabel = "공정 흐름", className, ...props }: ProcessFlowPatternProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? steps[0]?.id ?? "");
  const selectedValue = value ?? internalValue;
  const select = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className={cn("min-w-0", className)} aria-label={ariaLabel} {...props}>
      <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <Button type="button" size="xsmall" variant={selectedValue === step.id ? "fillBlack" : "lineBlacktxt"} disabled={step.disabled} onClick={() => select(step.id)}>
              {step.label}
            </Button>
            {index < steps.length - 1 && <span aria-hidden className="text-[13px] text-mes-gray-50">→</span>}
          </React.Fragment>
        ))}
      </div>
      {steps.find((step) => step.id === selectedValue)?.description && (
        <p className="mt-2 text-[12px] leading-5 text-mes-gray-70">{steps.find((step) => step.id === selectedValue)?.description}</p>
      )}
    </div>
  );
}
