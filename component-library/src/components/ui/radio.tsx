"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Radio (라디오버튼) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:82508("mes/icon-radio" 프레임)
 * 하위 3개 상태(9873:82509=sel, 9873:82512=unsel, 9873:82514=disable).
 * 이 아이콘은 Figma에서 벡터 이미지(svg 애셋)로 내보내져 있어 코드 추출로 색상 hex를 바로
 * 못 얻었음 — `get_variable_defs`로 각 상태 노드에 바인딩된 컬러 변수를 개별 조회해서 확정함
 * (이미지 자체를 다시 그리지 않고, 조회된 변수값으로 CSS 도형을 새로 구성하는 방식으로 구현).
 *
 * ── 1. 크기/레이아웃(정확한 실측치) ──────────────────────────────
 * - 전체 24x24px, 바깥 원(테두리)은 사방 4.17% 인셋(24*0.0417≈1px) → 지름 22px
 * - 선택됨 상태의 내부 점은 사방 20.83% 인셋(24*0.2083=5px) → 지름 14px
 * - 완성 화면 node 20274:73333에서 20px 인스턴스도 반복 확인되어 small(20)/default(24)
 *   size를 지원한다.
 *
 * ── 2. 상태별 색상(get_variable_defs로 조회, 확정 팔레트와 정확히 일치) ──
 * - sel(선택됨): 바깥 원 + 안쪽 점 모두 Primary-60(#1573FB) 단색
 * - unsel(선택 안 됨): 바깥 원 Gray-50(#B4C0D3), 안쪽 점 없음
 * - disable(비활성): 바깥 원 Gray-30(#E4E7EE) + 내부 채움 Gray-20(#EFF2F8) — unsel과 달리
 *   테두리+채움 2가지 색이 같이 쓰임(옅은 회색 원반 형태)
 *
 * ── 3. 판단값(미실측 — Figma가 벡터 이미지라 정확한 stroke 두께를 코드로 못 뽑음) ──
 * - 테두리 두께 1.5px로 임의 지정(시각적 비율로 추정한 값, 정확한 값 아님 — 실측 필요시
 *   디자이너에게 실제 SVG 파일 stroke-width 확인 요청)
 *
 * ── 4. 확인 필요 ────────────────────────────────────────────────
 * - Figma에 "disabled + 선택됨" 조합 상태가 없음(sel/unsel/disable 3개뿐, disable은 사실상
 *   선택 안 된 상태 기준으로만 존재). 이 컴포넌트에서 비활성+선택된 라디오를 렌더링할 때
 *   내부 점 색은 Gray-50으로 임의 처리해둠(판단값, Figma 근거 없음) — 실제 디자인 필요시 확인.
 */

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  size?: "small" | "default";
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, disabled, size = "default", ...props }, ref) => (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        size === "small" ? "size-5" : "size-6",
        className
      )}
    >
      <input
        ref={ref}
        type="radio"
        disabled={disabled}
        className="peer absolute inset-0 size-full cursor-pointer appearance-none disabled:cursor-not-allowed"
        {...props}
      />
      {/* 바깥 원 */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-px rounded-full border-[1.5px] bg-white transition-colors",
          "border-mes-gray-50 peer-checked:border-mes-primary-60",
          "peer-disabled:border-mes-gray-30 peer-disabled:bg-mes-gray-20"
        )}
      />
      {/* 안쪽 점(선택됨일 때만 보임) */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute scale-0 rounded-full bg-mes-bg-brand transition-transform",
          size === "small" ? "inset-1" : "inset-[5px]",
          "peer-checked:scale-100",
          "peer-disabled:peer-checked:bg-mes-gray-50"
        )}
      />
    </span>
  )
);
Radio.displayName = "Radio";

export { Radio };
