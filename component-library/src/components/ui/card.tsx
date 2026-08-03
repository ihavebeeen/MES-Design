import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Card — Figma 검색(search_design_system)에 정확히 일치하는 전용 노드를 못 찾음
 * (체크리스트 티어2 "Card", 상태 "없음"). 흰 배경 + 테두리 1px Gray-30 + radius 4px
 * (`globals.css` `--mes-radius-control` 주석에 "카드형 배경"이라고 이미 지정돼 있는 값
 * 재사용, 새 radius 안 만듦). 그림자는 없음 — 그림자는 패널/모달류(`shadow-mes-panel`
 * 등)만 쓰는 규칙이라 평면 UI인 Card엔 안 씀. 헤더/바디/푸터는 하위 서브컴포넌트로 분리.
 */
type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-mes-control border border-mes-border-default bg-white", className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1 border-b border-mes-border-default p-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-[15px] font-semibold leading-[1.5] text-mes-text-default", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-[13px] leading-[1.5] text-mes-gray-70", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 border-t border-mes-border-default p-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps };
