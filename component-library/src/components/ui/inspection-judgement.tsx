"use client";

import * as React from "react";
import { Button } from "./button";
import { IconQaO, IconQaTriangle, IconQaX } from "../icons";
import { cn } from "@/lib/utils";

export type InspectionJudgementValue = "pass" | "hold" | "fail" | "none";

export interface InspectionJudgementProps {
  value: InspectionJudgementValue;
  onValueChange: (value: InspectionJudgementValue) => void;
  className?: string;
}

const OPTIONS: Array<{ value: InspectionJudgementValue; label: string; icon?: React.ReactNode }> = [
  { value: "pass", label: "합격", icon: <IconQaO size={16} /> },
  { value: "hold", label: "보류", icon: <IconQaTriangle size={16} /> },
  { value: "fail", label: "불합격", icon: <IconQaX size={16} /> },
  { value: "none", label: "미분류" },
];

/** Figma 자주검사 화면의 판정 4분할 입력. 기존 Button과 QA 아이콘만 조합한다. */
function InspectionJudgement({ value, onValueChange, className }: InspectionJudgementProps) {
  return (
    <div className={className ?? "flex w-[240px] gap-2"} role="radiogroup" aria-label="검사 판정">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          aria-label={option.label}
          size="small"
          variant={value === option.value ? "fillMain" : "lineBlacktxt"}
          className={cn(
            "min-w-0 flex-1 px-0",
            option.value === "none" && value !== option.value && "font-medium text-mes-gray-60"
          )}
          onClick={() => onValueChange(option.value)}
        >
          {option.icon ?? <span className="text-[20px] leading-none">-</span>}
        </Button>
      ))}
    </div>
  );
}

export { InspectionJudgement };
