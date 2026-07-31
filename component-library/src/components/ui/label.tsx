import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Label — Figma 디자인 없음(체크리스트 티어2 "Label", 상태 "없음").
 * 지금까지 데모 페이지의 Sample들은 라벨을 폼 필드 자체가 아니라 별도 캡션(font-mono
 * 12px)으로만 보여줬을 뿐, 실제 화면에서 쓸 독립 폼 라벨 아톰은 없었음 — Input/Select와
 * 같은 텍스트 색 체계(`text-mes-text-default`)로 판단 구현. 필수 표시(`*`)는
 * `text-mes-text-danger` 재사용(다른 컴포넌트 없어 새 값 아님, 기존 danger 토큰).
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 필수 입력 표시(* 를 라벨 뒤에 danger 색으로 붙임) */
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-[13px] font-medium leading-[1.5] text-mes-text-default",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-0.5 text-mes-text-danger">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };
