import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Progress Bar (진행률 막대) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 20144:101580(78% 실측 인스턴스).
 *
 * ── 1. 실측값 ─────────────────────────────────────────────────
 * - 트랙(전체 바): 높이 6px, radius 완전 라운드(rounded-full), 배경 Gray-40(#D7DCE5)
 * - 채움(진행된 부분): 배경 Gray-100(#475067, 담당자 확인: "gray 100 컬러") — 트랙과 같은
 *   라운드 처리(overflow-clip으로 트랙 모서리에 맞춰 잘림)
 * - 라벨: 퍼센트 텍스트, Pretendard Regular 14px/line-height 130%, 색 Gray-130(text)(#011327),
 *   텍스트 우측 정렬, 바와 라벨 사이 gap 2px
 *
 * ── 2. 판단값(실측 인스턴스가 78% 하나뿐이라 일반화한 부분) ───────
 * - 채움 너비는 78%처럼 특정 값이 아니라 `value` prop(0~100)에 따라 percentage로 계산 —
 *   0%/100% 같은 경계값은 별도 실측 인스턴스가 없어서 수식으로 자연 처리(0%=채움 없음,
 *   100%=트랙 전체가 채움색) — 별도 디자인이 있다면 확인 필요
 * - 라벨 너비는 실측 인스턴스에서 44px 고정이었으나, 두 자리/세 자리 퍼센트 모두 깨지지
 *   않게 auto-width로 처리(판단값)
 */

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, showLabel = true, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));
    return (
      <div
        ref={ref}
        className={cn("flex w-full items-center gap-[2px]", className)}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div className="h-[6px] w-full flex-1 overflow-hidden rounded-full bg-mes-gray-40">
          <div
            className="h-full rounded-full bg-mes-gray-100 transition-[width]"
            style={{ width: `${clamped}%` }}
          />
        </div>
        {showLabel && (
          <span className="shrink-0 text-right text-[14px] leading-[1.3] text-mes-gray-130">
            {clamped}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
