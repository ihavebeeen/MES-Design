import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Button — Figma 실측 기반
 * 출처: 컴포넌트 라이브러리 파일 fill-main(163:8435/163:8345) + 클라우드MES 파일 실제 매트릭스(9873:83097 하위)
 *
 * 현재 구현된 값:
 * - size=basic: radius 4px, height 40px(hug), 좌우 padding 16px, 폰트 Pretendard SemiBold 15px/line-height 150%
 * - size=small: radius 4px, height 32px(hug), 좌우 padding 10px, 폰트 Pretendard SemiBold 14px/line-height 150%
 * - size=xsmall: radius 2px(담당자 확인 완료 — basic/small의 4px과 다름), height 22px(hug), 좌우 padding 8px, 폰트 Pretendard SemiBold 12px/line-height 150%
 * - color=primary(fill-main): bg #1573FB(mes-primary-60), text #FFFFFF, hover bg #0958D9(mes-primary-70)
 * - disabled: bg #D7DCE5(mes-gray-40), text #99A3B8(mes-gray-60) — 오파시티 처리 아님, 실제 배경·글자색이 바뀜
 *   (2026-07-28, 클라우드MES 파일 node 9873:83198에서 실측 확인)
 * - 버튼 너비는 hug(내용에 맞춰 자동, 고정값 없음) — inline-flex + 너비 미지정으로 이미 충족
 * - 아이콘: Figma에서도 별도 variant/property가 아니라 인스턴스별로 아이콘 레이어를 지우거나 남기는 방식이라고 확인함
 *   (담당자 확인, 2026-07-28) → 코드에서도 고정 아이콘을 넣지 않고 startIcon/endIcon prop으로 필요할 때만 넘기는 방식으로 구현
 *
 * TODO(미실측): fill-gray/fill-black/fill-red/line-main/line-blacktxt/opacity-main 등 나머지 7개 color type,
 * hover 외 press 상태, 각 사이즈별 아이콘 실제 크기. 클라우드MES 파일 9873:83097 하위에 전체 매트릭스 노드가 있음 —
 * 재발 방지 규칙에 따라 필요해질 때 개별 노드ID로 실측 후 추가한다.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded whitespace-nowrap font-semibold leading-[150%] transition-colors disabled:pointer-events-none disabled:bg-mes-gray-40 disabled:text-mes-gray-60",
  {
    variants: {
      variant: {
        primary: "bg-mes-primary-60 text-white hover:bg-mes-primary-70",
      },
      size: {
        basic: "h-10 px-4 text-[15px] rounded-[4px]",
        small: "h-8 px-2.5 text-[14px] rounded-[4px]",
        xsmall: "h-[22px] px-2 text-[12px] rounded-[2px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "basic",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** 버튼 텍스트 앞에 표시할 아이콘. Figma에서도 고정 variant가 아니라 인스턴스별로 넣거나 빼는 값이라 옵션 prop으로 구현 */
  startIcon?: React.ReactNode;
  /** 버튼 텍스트 뒤에 표시할 아이콘 */
  endIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, startIcon, endIcon, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {startIcon}
            {children}
            {endIcon}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
