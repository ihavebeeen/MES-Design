"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconExclamationCircle } from "../icons/icon-exclamation-circle";
import { IconX } from "../icons/icon-x";

/**
 * MES Toast (짧게 떴다 사라지는 알림) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) — TOAST-RED(node 11098:37167 하위
 * 11098:37166), TOAST-BLUE(node 11028:35650 하위 11106:37291). 담당자 확인: 스낵바는
 * 없고 Toast만 있음(체크리스트에도 스낵바 항목 없이 Toast로만 정리).
 *
 * ⚠ 두 색상이 하나의 공유 컴포넌트에서 나온 variant가 아니라 **서로 다른 두 개의 개별
 * 프레임**이었음(Badge의 orange/yellow처럼 이름-값 불일치는 아니지만, 컴포넌트 하나로
 * 묶여 있지 않아서 값 자체가 서로 다름) — 아래처럼 실측값이 서로 다른 부분이 있었는데,
 * 콘텐츠-닫기버튼 간 gap만 담당자 결정으로 8px로 통일하고, 나머지는 실측 그대로 유지함:
 * - 배경색: RED는 `#F04452`로 확정 Danger-60과 정확히 일치. BLUE는 `#156BE9`인데
 *   확정 Primary-60(`#1573FB`)과 미묘하게 다른 값 — 팔레트에 억지로 편입시키지 않고
 *   컴포넌트에 원본 값 그대로 둠(출처와 함께 기록)
 * - 테두리: RED `rgba(255,108,108,.2)`, BLUE `rgba(26,61,112,.6)` — 서로 다른
 *   반투명 색(팔레트 토큰 아님, 각각 원본 그대로)
 * - 콘텐츠와 닫기 버튼 사이 간격: 실측 당시 RED 8px/BLUE 16px로 서로 달랐으나,
 *   2026-07-28 담당자 결정으로 **둘 다 8px로 통일**(RED 값 기준)
 * - 닫기 아이콘 크기: RED는 16px, BLUE는 18px로 다름 — 실측 그대로 유지
 * - radius: RED 30px, BLUE 84px로 코드 값은 다르지만 높이 46px의 절반(23px)보다 둘 다
 *   커서 브라우저에서 렌더링되는 실제 모양은 동일한 완전 캡슐(pill) 형태 — 시각적으로
 *   차이가 없어 `rounded-full`로 통일해서 구현(값 자체를 무시한 게 아니라, 두 값 다
 *   "완전히 둥글게"라는 같은 결과로 수렴하는 경우라 판단)
 *
 * ── 공통 실측값 ────────────────────────────────────────────────
 * 높이 46px, 내부 패딩 16px, 아이콘-텍스트 간 gap 8px, 텍스트 Pretendard SemiBold 15px
 * 흰색, drop-shadow `0 0 12px rgba(0,0,0,.2)`(둘 다 동일)
 *
 * ── 아이콘 (2026-07-28 RED만 실제 SVG로 교체) ───────────────────
 * RED는 "mes/icon-exclamation-circle" — 담당자가 Figma에서 직접 SVG export한 실측
 * 벡터(`IconExclamationCircle`, ../icons/icon-exclamation-circle.tsx)로 교체 완료.
 * BLUE의 "CHECK" 아이콘은 아직 export 안 됨 — 여전히 lucide `CircleCheck`로 대체 중
 * (판단값, 실제 SVG 받으면 교체 필요).
 * 닫기(X) 버튼도 실제 SVG(`IconX`, ../icons/icon-x.tsx)로 교체 완료.
 *
 * 표시/자동 닫힘 타이밍 로직은 Figma 범위 밖이라 이 컴포넌트엔 없음(단순 프레젠테이션
 * 컴포넌트) — 실제 노출 시점·지속시간 제어는 사용하는 쪽에서 구현.
 */

export type ToastVariant = "red" | "blue";

export interface ToastProps {
  variant: ToastVariant;
  message: string;
  onClose?: () => void;
  className?: string;
}

const toastStyles: Record<ToastVariant, { bg: string; border: string }> = {
  red: {
    bg: "bg-mes-danger-60",
    border: "border-[rgba(255,108,108,0.2)]",
  },
  blue: {
    bg: "bg-[#156be9]",
    border: "border-[rgba(26,61,112,0.6)]",
  },
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ variant, message, onClose, className }, ref) => {
    const styles = toastStyles[variant];
    const closeIconSize = variant === "red" ? 16 : 18;

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-[46px] items-center justify-center gap-2 rounded-full border p-4 drop-shadow-[0_0_12px_rgba(0,0,0,0.2)]",
          styles.bg,
          styles.border,
          className
        )}
      >
        <div className="flex shrink-0 items-center gap-2">
          {variant === "red" ? (
            <IconExclamationCircle size={22} className="shrink-0 text-white" />
          ) : (
            <CircleCheck className="size-[22px] shrink-0 text-white" />
          )}
          <p className="shrink-0 whitespace-nowrap text-[15px] font-semibold leading-[1.5] text-white">
            {message}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="닫기" className="shrink-0 text-white">
          <IconX size={closeIconSize} />
        </button>
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
