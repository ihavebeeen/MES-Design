import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Button — Figma 실측 기반
 * 출처: 컴포넌트 라이브러리 파일 fill-main(163:8435/163:8345) + 클라우드MES 파일 전체 컬러 매트릭스(9873:83097 하위, fileKey F4n5Zr04PAbiRjfIFQAo6v)
 * variant 이름은 Figma의 type= 값을 그대로 camelCase로 옮김 — 대응 관계 추적 쉽게 하려는 목적, 임의로 이름 바꾸지 않음.
 *
 * 사이즈(size):
 * - basic: radius 4px, height 40px(hug), 좌우 padding 16px, 폰트 Pretendard SemiBold 15px/line-height 150%
 * - small: radius 4px, height 32px(hug), 좌우 padding 10px, 폰트 Pretendard SemiBold 14px/line-height 150%
 * - xsmall: radius 2px(담당자 확인 완료 — basic/small의 4px과 다름), height 22px(hug), 좌우 padding 8px, 폰트 Pretendard SemiBold 12px/line-height 150%
 * 버튼 너비는 hug(내용에 맞춰 자동, 고정값 없음) — inline-flex + 너비 미지정으로 이미 충족.
 *
 * 컬러(variant) — 전부 클라우드MES 파일 size=basic 기준 노드로 실측, Default/hover 값만 있고 Figma 자체에 press 상태는 없음:
 * - fillMain(9873:83097 계열/기본): bg #1573FB(primary-60)→hover #0958D9(primary-70), text white
 * - fillGray(9873:83213/83218): bg #D7DCE5(gray-40)→hover #B4C0D3(gray-50), text #011327(gray-130)
 * - fillBlack(9873:83223/83228): bg #011327(gray-130)→hover #373F57(gray-110), text white
 * - fillRed(9873:83233/83238): bg #F04452(danger-60)→hover #AB2B36(danger-70), text white
 * - lineMain(9873:83243/83248): bg white→hover #EFF8FF(primary-10), border 1px #1573FB(primary-60), text #1573FB
 * - lineBlacktxt(9873:83203/83208): bg white→hover #F8FAFC(gray-10), border 1px #E4E7EE(gray-30), text #011327(gray-130)
 * - opacityMain(9873:83253/83258): bg #E8F5FF(primary-20)→hover #D4EAFF(팔레트 스텝에 없는 값, arbitrary 처리), text #1573FB
 *
 * disabled(9873:83198): bg #D7DCE5(gray-40), text #99A3B8(gray-60) — 오파시티 처리 아니고 variant와 무관하게 항상 동일한 외형으로 통일(Figma도 그렇게 되어있음)
 *
 * 아이콘: Figma에서도 별도 variant/property가 아니라 인스턴스별로 아이콘 레이어를 지우거나 남기는 방식이라 확인함(담당자 확인, 2026-07-28)
 * → 코드에서도 고정 아이콘을 넣지 않고 startIcon/endIcon prop으로 필요할 때만 넘기는 방식으로 구현.
 *
 * TODO(미실측): press 상태는 Figma 자체에 없어서 구현 안 함. 사이즈별(small/xsmall) 아이콘 실제 크기도 아직 미확인.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded whitespace-nowrap font-semibold leading-[150%] transition-colors disabled:pointer-events-none disabled:border-mes-gray-40 disabled:bg-mes-gray-40 disabled:text-mes-gray-60",
  {
    variants: {
      variant: {
        fillMain: "bg-mes-bg-brand text-mes-text-inverse hover:bg-mes-bg-brand-hover",
        fillGray: "bg-mes-gray-40 text-mes-gray-130 hover:bg-mes-gray-50",
        fillBlack: "bg-mes-bg-strong text-mes-text-inverse hover:bg-mes-gray-110",
        fillRed: "bg-mes-bg-danger text-mes-text-inverse hover:bg-mes-danger-70",
        lineMain:
          "bg-white text-mes-text-brand border border-mes-primary-60 hover:bg-mes-bg-brand-subtle",
        lineBlacktxt:
          "bg-white text-mes-text-default border border-mes-border-default hover:bg-mes-bg-subtler",
        opacityMain: "bg-mes-bg-brand-subtle-strong text-mes-text-brand hover:bg-[#d4eaff]",
        softMain: "border border-mes-primary-30 bg-mes-primary-10 text-mes-primary-60 hover:bg-mes-primary-20",
        softDanger: "border border-mes-danger-20 bg-mes-danger-10 text-mes-danger-60 hover:bg-mes-danger-20",
        loginPrimary: "bg-mes-gray-130 text-white hover:bg-mes-gray-110 disabled:bg-mes-gray-60 disabled:text-white",
      },
      size: {
        basic: "h-10 px-4 text-[15px] rounded-mes-control",
        small: "h-8 px-2.5 text-[14px] rounded-mes-control",
        xsmall: "h-[22px] px-2 text-[12px] rounded-mes-control-xs",
        toolbar: "h-[30px] px-2.5 text-[14px] rounded-mes-control",
        login: "h-12 px-4 text-[16px] font-bold rounded-mes-control",
      },
    },
    defaultVariants: {
      variant: "fillMain",
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
