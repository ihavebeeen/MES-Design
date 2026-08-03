import * as React from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loading-spinner";

/**
 * MES LoadingOverlay — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Loading Overlay",
 * 상태 "없음", 재탐색 안 함 — 판단값 우선). "모달 등의 배경 딤 처리"용 Backdrop과는
 * 다른 항목(특정 영역을 덮는 로딩 표시)이라, 이전에 담당자가 제거 지시한 Backdrop을
 * 되살리는 게 아니라 별도 목적으로 새로 구현. `absolute inset-0` + 반투명 흰 배경 +
 * 중앙 LoadingSpinner(`loading-spinner.tsx`) 재사용.
 */
export interface LoadingOverlayProps {
  label?: string;
  className?: string;
}

function LoadingOverlay({ label, className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/70",
        className
      )}
    >
      <LoadingSpinner size={28} />
      {label && <span className="text-[13px] text-mes-gray-70">{label}</span>}
    </div>
  );
}

export { LoadingOverlay };
