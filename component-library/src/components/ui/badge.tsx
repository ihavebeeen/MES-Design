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
 * ── 2. Variant별 실측값 — 전부 확정 팔레트와 정확히 일치(예외 없음) ──
 * - blue(Figma "BLUE", 텍스트 예시 "출하중"): 배경 Primary-60(#1573FB), 텍스트 흰색
 * - red(Figma "RED", "취소요청"): 배경 Danger-60(#F04452), 텍스트 흰색 — 확정 팔레트와 정확히 일치
 * - orange(Figma "ORANGE", "대기"): ⚠ 이름은 ORANGE지만 실제 값은 회색 — 배경 Gray-40(#D7DCE5),
 *   텍스트 Gray-110(#373F57). Figma 컴포넌트 이름과 실제 색상이 다른 케이스라 그대로 기록.
 * - yellow(Figma "YELLOW", "승인중"): ⚠ 이름은 YELLOW지만 실제 값은 BLUE와 완전히 동일 —
 *   배경 Primary-60, 텍스트 흰색. Figma 원본 자체의 배경색 지정 누락으로 추정(디자이너 확인 필요,
 *   임의로 노란색을 지어내지 않고 원본 그대로 구현함).
 * - gray(Figma "GRAY", "완료"): 배경 없음(투명), 텍스트만 Gray-90(#5C667B). 다른 variant와 달리
 *   칩 형태의 배경이 아예 없는 게 실측 그대로의 모습.
 * - variant6(Figma 자동생성 이름 "Variant6", "완료"): 배경 Primary-20(#E8F5FF), 텍스트 Primary-60.
 *   이름이 지어지지 않은 채 남아있는 변형 — 정확한 용도/의미는 확인 필요(체크리스트에 등록).
 * - variant7(Figma 자동생성 이름 "Variant7", "완료"): 배경 흰색 + 테두리 1px Primary-60,
 *   텍스트 Primary-60. padding이 다른 variant와 다름(가로 9px/세로 1px, 테두리 두께만큼 보정된 값).
 *   variant6과 마찬가지로 이름 미지정 — 용도 확인 필요.
 *
 * ── 3. 확인 필요(체크리스트 등록 대상) ──────────────────────────
 * - "yellow"가 실제로 노란색이어야 하는지(Figma 원본 수정 필요) 담당자 확인 필요
 * - variant6/variant7("완료"가 3가지 다른 스타일로 존재하는 이유) 확인 필요 — 상태 구분용인지
 *   단순 디자인 시안 정리 중 남은 잔여물인지 불명확
 */

const badgeVariants = cva(
  "inline-flex h-[22px] w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-[2px] font-semibold text-[12px] leading-[18px] tracking-[-0.15px]",
  {
    variants: {
      variant: {
        blue: "bg-mes-primary-60 px-2 py-[3px] text-white",
        red: "bg-mes-danger-60 px-2 py-[3px] text-white",
        orange: "bg-mes-gray-40 px-2 py-[3px] text-mes-gray-110",
        yellow: "bg-mes-primary-60 px-2 py-[3px] text-white",
        gray: "bg-transparent px-2 py-[3px] text-mes-gray-90",
        variant6: "bg-mes-primary-20 px-2 py-[3px] text-mes-primary-60",
        variant7: "border border-mes-primary-60 bg-white px-[9px] py-px text-mes-primary-60",
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
