import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Textarea — Figma 디자인 없음(체크리스트 티어2 "Textarea", 상태 "없음").
 * `input.tsx` 주석에 "Selectbox와 완전히 같은 위계·시각 스타일을 공유"라고 담당자가
 * 확인해준 것과 같은 원칙으로, Textarea도 Input의 default 사이즈 톤(테두리/배경/포커스
 * 색상, radius)을 그대로 재사용 — 새로 만든 색이나 값 없음, 여러 줄 입력에 맞게
 * `min-h`/`py`만 조정한 판단값.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-20 rounded-mes-control border border-mes-border-default bg-white px-[10px] py-2 text-[14px] text-mes-text-default outline-none transition-colors placeholder:text-mes-text-placeholder focus:border-mes-border-strong read-only:bg-mes-bg-subtle disabled:cursor-not-allowed disabled:border-mes-border-default disabled:bg-mes-bg-disabled disabled:text-mes-text-disabled",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
