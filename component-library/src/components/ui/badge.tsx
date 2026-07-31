import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Badge (상태 뱃지) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 13687:33504("상태 뱃지 NEW" 프레임)
 * 하위 7개 variant(13687:33503/33501/33502/33500/33499, 17354:45779/45789).
 *
 * ── 1. 공통 규격 ──────────────────────────────────────────────
 * - 높이 22px, radius 2px, 폰트 Pretendard SemiBold 12px/line-height 18px/letter-spacing -0.15px
 * - 너비: 실측 인스턴스엔 58px 고정값이 찍혀 있었지만, 이는 특정 텍스트("출하중" 등) 기준으로
 *   오토레이아웃이 계산된 결과값으로 판단(판단값) — 뱃지 특성상 텍스트 길이에 따라 너비가
 *   달라지는 게 맞다고 보고 고정폭 대신 auto-width(hug)로 구현. 고정 58px가 맞다면 알려주면 교체.
 *
 * ── 2. Variant 이름 — 2026-07-29, Figma 원본 이름 대신 실제 렌더링 색상 기준으로 개명 ──
 * 기존엔 Figma 컴포넌트 이름을 그대로 썼는데(orange/yellow/variant6/variant7), 이름과 실제
 * 색이 다르거나(orange가 실제로는 회색 등) 애초에 이름이 없는(variant6/7) 경우가 있어서
 * 담당자가 "원본 이름은 상관없이 색 대로 이름을 다시 매겨"라고 확정 지시. 값 자체는 전부
 * 그대로(전부 확정 팔레트와 정확히 일치, 값 변경 없음) 두고 키 이름만 아래처럼 변경:
 * - blue(구 이름도 blue, 변경 없음): 배경 Primary-60(#1573FB), 텍스트 흰색
 * - red(구 이름도 red, 변경 없음): 배경 Danger-60(#F04452), 텍스트 흰색
 * - grayFill(구 이름 orange): 배경 Gray-40(#D7DCE5), 텍스트 Gray-110(#373F57) — 실제 회색이라 개명
 * - blue2(구 이름 yellow): 배경 Primary-60, 텍스트 흰색 — "blue"와 값이 완전히 동일(Figma 원본
 *   자체의 배경색 지정 누락으로 추정). 값이 같다고 임의로 병합하진 않고(요청 범위 밖 변경 방지),
 *   실제 색 기준으로 "blue" 계열임을 드러내되 구분을 위해 2를 붙임.
 * - gray(구 이름도 gray, 변경 없음): 배경 없음(투명), 텍스트만 Gray-90(#5C667B).
 * - blueLight(구 이름 variant6, 원래 이름 자체가 없었음): 배경 Primary-20(#E8F5FF)의 옅은 파랑
 *   채움, 텍스트 Primary-60.
 * - blueOutline(구 이름 variant7, 원래 이름 자체가 없었음): 배경 흰색 + 테두리 1px Primary-60,
 *   텍스트 Primary-60(아웃라인 스타일). padding이 다른 variant와 다름(가로 9px/세로 1px, 테두리
 *   두께만큼 보정된 값).
 * - blueFill 4종(blue/blue2/blueLight/blueOutline)이 "완료/승인중/출하중" 등 서로 다른 상태에
 *   왜 이렇게 나뉘어 쓰이는지는 여전히 불명확 — 실사용 화면 확인 필요(체크리스트 등록 유지).
 */

const badgeVariants = cva(
  "inline-flex h-[22px] w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-mes-control-xs font-semibold text-[12px] leading-[1.5]",
  {
    variants: {
      variant: {
        blue: "bg-mes-bg-brand px-2 py-[3px] text-mes-text-inverse",
        red: "bg-mes-bg-danger px-2 py-[3px] text-mes-text-inverse",
        grayFill: "bg-mes-gray-40 px-2 py-[3px] text-mes-gray-110",
        blue2: "bg-mes-bg-brand px-2 py-[3px] text-mes-text-inverse",
        gray: "bg-transparent px-2 py-[3px] text-mes-text-secondary",
        blueLight: "bg-mes-bg-brand-subtle-strong px-2 py-[3px] text-mes-text-brand",
        blueOutline: "border border-mes-primary-60 bg-white px-[9px] py-px text-mes-text-brand",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
