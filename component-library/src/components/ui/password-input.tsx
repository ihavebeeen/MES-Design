"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputVariants } from "./input";

/**
 * MES PasswordInput — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Password Input",
 * 상태 "없음", Figma 재탐색 안 함 — 판단값 우선). Input(`input.tsx`) 실측 스타일 재사용 +
 * 보기/숨기기 토글 아이콘만 판단값(Eye/EyeOff, lucide).
 */
export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  size?: "default" | "small" | "login";
  /** 로그인·비밀번호 재설정 원본처럼 보기/숨기기 아이콘이 없는 입력에서 false로 사용한다. */
  visibilityToggle?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ size = "default", visibilityToggle = true, className, disabled, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const inputClassName = size === "login"
      ? "h-12 w-full rounded-mes-control border border-mes-border-default bg-white px-[10px] text-[16px] text-mes-text-default outline-none placeholder:text-mes-text-placeholder focus:border-mes-border-strong disabled:cursor-not-allowed disabled:bg-mes-bg-disabled"
      : inputVariants({ size });
    return (
      <div className={cn("relative inline-flex w-full items-center", className)}>
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          className={cn(inputClassName, visibilityToggle && "pr-8")}
          {...props}
        />
        {visibilityToggle && <button
          type="button"
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
          className="absolute right-2 flex items-center justify-center text-mes-gray-60 hover:text-mes-gray-90 disabled:pointer-events-none disabled:text-mes-gray-40"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
