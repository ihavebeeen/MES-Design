import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Link (텍스트 링크) — Figma 디자인 없음(체크리스트 티어2 "Link", 상태 "없음" —
 * 비고에 "테이블 셀 링크는 있었으나 일반 텍스트 링크 자체가 누락돼 있었음"이라고 적힌
 * 그 항목). 새 스타일 만들지 않고 `notice-banner.tsx`에서 이미 쓰고 있던 링크 스타일
 * (`text-mes-text-brand underline-offset-2 hover:underline`)을 그대로 역추출해
 * 독립 아톰으로 뽑음 — 두 군데서 같은 값이 반복되는 걸 발견하면 공용화한다는 이
 * 프로젝트의 기존 원칙(IconButton 때와 동일).
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "text-[14px] font-medium text-mes-text-brand underline-offset-2 hover:underline",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);
Link.displayName = "Link";

export { Link };
