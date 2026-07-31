import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Input (Textbox) — Figma 실측 기반
 * 출처: 클라우드MES 파일(fileKey F4n5Zr04PAbiRjfIFQAo6v) node 9873:82969 하위, size=Default/small × status=Default/focus/입력완료/readonly/disable
 * Selectbox(select.tsx)와 완전히 같은 위계·같은 시각 스타일(색/radius/padding/획 두께)을 공유함 — 담당자 확인.
 *
 * 사이즈:
 * - default: height 32px, 좌우 padding 10px, radius 4px, 폰트 Pretendard Regular 14px (node 9873:82973 등)
 * - small: height 22px, 좌우 padding 6px, radius 3px, 폰트 Pretendard Regular 13px (node 9873:83005 등)
 *
 * 상태(색상, 전부 border 1px 고정 — 두께 차이 없음 확인):
 * - 기본(9873:82973): bg white, border #E4E7EE(gray30), placeholder #99A3B8(gray60)
 * - focus(9873:82981): border만 #011327(gray130)로 진해짐 — 파란 포커스 링 아님, 실제 입력값 색은 #011327(gray130)
 * - readonly(9873:82993): bg #EFF2F8(gray20), border gray30 유지, text gray130
 * - disable(9873:82995): bg #E4E7EE(gray30, border와 동일해 경계선 안 보임), text #8491A7(gray70)
 *
 * small 사이즈에는 Figma 자체에 focus 상태가 없음(디자인 누락으로 보임 — 임의로 만들지 않고 그대로 둠).
 */
const inputVariants = cva(
  "w-full bg-white border border-mes-border-default text-mes-text-default placeholder:text-mes-text-placeholder outline-none transition-colors focus:border-mes-border-strong read-only:bg-mes-bg-subtle disabled:cursor-not-allowed disabled:border-mes-border-default disabled:bg-mes-bg-disabled disabled:text-mes-text-disabled",
  {
    variants: {
      size: {
        default: "h-8 px-[10px] rounded-mes-control text-[14px]",
        small: "h-[22px] px-[6px] rounded-mes-control-sm text-[13px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <input className={cn(inputVariants({ size, className }))} ref={ref} {...props} />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
