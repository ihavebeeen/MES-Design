import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Logo/Brandmark — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Logo / Brandmark",
 * 상태 "없음", 재탐색 안 함 — 판단값 우선). 실제 로고 이미지/워드마크 애셋이 없어 텍스트
 * 워드마크로만 최소 구현 — 정식 로고 애셋이 생기면 교체 필요.
 */
export interface LogoProps {
  size?: "small" | "default";
  className?: string;
}

function Logo({ size = "default", className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-bold leading-none text-mes-gray-130",
        size === "small" ? "text-[14px]" : "text-[18px]",
        className
      )}
    >
      <span className="rounded-mes-control-xs bg-mes-bg-brand px-1.5 py-1 text-mes-text-inverse">
        M
      </span>
      MES
    </span>
  );
}

export { Logo };
