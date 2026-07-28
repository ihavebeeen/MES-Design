"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MES Checkbox (체크박스) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:82462("mes/icon-checkcyc" 프레임)
 * 하위 4개 property(9873:82463=default, 9873:82466=default-line, 9873:82469=main, 9873:82472=black).
 * 체크박스 박스 자체는 Tailwind 클래스로 직접 추출됐지만(뱃지처럼), 체크마크 아이콘은 이미지 애셋으로
 * 내보내져 있어 정확한 벡터를 그대로 못 가져옴 — 시각적으로 동일한 lucide `Check` 아이콘으로 대체(판단값).
 *
 * ── 1. 크기/레이아웃(정확한 실측치) ──────────────────────────────
 * - 전체 24x24px, 박스는 사방 1px 인셋 → 22x22px, radius 3px
 * - default-line(테두리형)만 border 1px, 나머지는 배경색 채움(border 없음)
 *
 * ── 2. Property별 실측값(get_variable_defs로 조회, 확정 팔레트와 정확히 일치) ──
 * - default-line("Property 1=default-line"): 배경 흰색 + 테두리 1px Gray-40(#D7DCE5) → 이 프로젝트에선
 *   **선택 안 됨(unchecked)** 상태로 판단해서 매핑함(하위 박스가 hollow인 유일한 property라서).
 * - default("Property 1=default"): 배경 Gray-50(#B4C0D3), 테두리 없음 → color="gray"로 매핑
 * - main("Property 1=main"): 배경 Primary-60(#1573FB), 테두리 없음 → color="main"(기본값)으로 매핑
 * - black("Property 1=black"): 배경 Gray-130/text(#011327), 테두리 없음 → color="black"으로 매핑
 * - 체크마크 색: default-line은 별도 이미지 애셋 사용(흰 배경 위에 보이는 색 — 정확한 hex 미확인,
 *   구현에선 border와 같은 계열인 Gray-60으로 판단 처리), 나머지 3개(default/main/black)는 전부
 *   같은 이미지 애셋 재사용 → 흰색 체크마크로 판단.
 *
 * ── 3. Figma에 없어서 판단으로 채운 값 ─────────────────────────────
 * - disabled 상태: Figma에 아예 없음(Radio와 달리 disable property 자체가 없음). 다른 컴포넌트
 *   패밀리의 disabled 패턴(테두리/배경 Gray-30대, opacity 낮춤)에 맞춰 판단 처리함 — 실측 아님,
 *   추후 Figma에 추가되면 교체 필요.
 *
 * ── 4. 확인 필요 ────────────────────────────────────────────────
 * - "default"(회색)/"main"(파랑)/"black"(검정) 3가지 체크됨 색상이 실제로 어떤 상황에서
 *   각각 쓰이는지 확인 필요(Badge의 variant6/7처럼 용도 불명확한 다색 변형 패턴).
 *
 * ── 5. (2026-07-28 추가) 중간선택(indeterminate) 상태 ────────────────
 * Figma/실측 근거 없음 — 담당자가 실제 화면(생산실적 그룹화 조회 테이블) 스크린샷을 보여주며
 * "그룹화 영역 체크박스에 중간체크 상태가 필요하다, 없으면 대충 보고 만들어봐(파랑/까망
 * 버전)"라고 요청해 판단으로 구현. 네이티브 `<input>` DOM의 `indeterminate` 프로퍼티를
 * ref로 세팅하고 브라우저 기본 `:indeterminate` CSS 의사클래스를 그대로 활용(Tailwind
 * `peer-indeterminate:` variant는 별도 설정 없이 동작). 체크마크 대신 `Minus`(대시) 아이콘
 * 표시, 배경색은 `checked` 상태와 동일한 색상 사용. main/black 두 색상 모두 지원(gray는
 * 실사용 확인 안 됐지만 동일 패턴으로 같이 추가).
 */

export type CheckboxColor = "main" | "gray" | "black";

const checkedStyles: Record<CheckboxColor, string> = {
  main: "peer-checked:border-mes-primary-60 peer-checked:bg-mes-primary-60",
  gray: "peer-checked:border-mes-gray-50 peer-checked:bg-mes-gray-50",
  black: "peer-checked:border-mes-gray-130 peer-checked:bg-mes-gray-130",
};

const indeterminateStyles: Record<CheckboxColor, string> = {
  main: "peer-indeterminate:border-mes-primary-60 peer-indeterminate:bg-mes-primary-60",
  gray: "peer-indeterminate:border-mes-gray-50 peer-indeterminate:bg-mes-gray-50",
  black: "peer-indeterminate:border-mes-gray-130 peer-indeterminate:bg-mes-gray-130",
};

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "color"> {
  color?: CheckboxColor;
  /** 일부만 선택된 상태(하위 항목 중 일부만 체크됨) — 판단 구현, 위 주석 5번 참고 */
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, color = "main", disabled, indeterminate = false, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    React.useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <span className={cn("relative inline-flex size-6 shrink-0 items-center justify-center", className)}>
        <input
          ref={inputRef}
          type="checkbox"
          disabled={disabled}
          className="peer absolute inset-0 size-6 cursor-pointer appearance-none disabled:cursor-not-allowed"
          {...props}
        />
        {/* 박스 */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-px rounded-[3px] border border-mes-gray-40 bg-white transition-colors",
            checkedStyles[color],
            indeterminateStyles[color],
            "peer-disabled:border-mes-gray-30 peer-disabled:bg-mes-gray-30"
          )}
        />
        {/* 체크마크(완전 선택됐을 때만 보임) */}
        <Check
          aria-hidden
          strokeWidth={3}
          className={cn(
            "pointer-events-none absolute size-3.5 text-white opacity-0 transition-opacity",
            "peer-checked:opacity-100",
            "peer-disabled:text-mes-gray-60"
          )}
        />
        {/* 중간선택 마크(대시, indeterminate일 때만 보임) */}
        <Minus
          aria-hidden
          strokeWidth={3}
          className={cn(
            "pointer-events-none absolute size-3.5 text-white opacity-0 transition-opacity",
            "peer-indeterminate:opacity-100",
            "peer-disabled:text-mes-gray-60"
          )}
        />
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
