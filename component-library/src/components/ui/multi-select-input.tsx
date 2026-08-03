"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Tag } from "./tag";
import { IconX } from "@/components/icons";

/**
 * MES MultiSelectInput (다중 선택·태그 입력) — Figma에 전용 컴포넌트 없음(체크리스트
 * 티어2 "Multi-select / Tag Input", 상태 "없음", Figma 재탐색 안 함 — 판단값 우선).
 * 선택된 값은 기존 Tag(`tag.tsx`, color "gray")로 렌더링하고 제거 아이콘은 Tag의
 * endIcon 슬롯에 IconX를 꽂아 재사용 — 새 칩 스타일을 만들지 않음. 바깥 박스는 Input과
 * 동일 테두리/radius, 높이만 태그 개수에 따라 늘어나는 hug(min-h).
 */
export interface MultiSelectInputProps {
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function MultiSelectInput({
  values,
  onValuesChange,
  placeholder = "입력 후 Enter",
  disabled,
  className,
}: MultiSelectInputProps) {
  const [draft, setDraft] = React.useState("");

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onValuesChange([...values, trimmed]);
    }
    setDraft("");
  };

  return (
    <div
      className={cn(
        "flex min-h-8 w-full flex-wrap items-center gap-1.5 rounded-mes-control border border-mes-border-default bg-white px-2 py-1.5",
        "focus-within:border-mes-border-strong",
        disabled && "pointer-events-none bg-mes-bg-disabled",
        className
      )}
    >
      {values.map((value) => (
        <Tag
          key={value}
          color="gray"
          endIcon={
            <button
              type="button"
              onClick={() => onValuesChange(values.filter((v) => v !== value))}
              aria-label={`${value} 제거`}
              className="flex items-center"
            >
              <IconX size={10} />
            </button>
          }
        >
          {value}
        </Tag>
      ))}
      <input
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && values.length > 0) {
            onValuesChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={values.length === 0 ? placeholder : ""}
        className="min-w-[80px] flex-1 bg-transparent text-[14px] text-mes-text-default outline-none placeholder:text-mes-text-placeholder"
      />
    </div>
  );
}

export { MultiSelectInput };
