import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Logo/Brandmark — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Logo / Brandmark",
 * 상태 "없음", 재탐색 안 함 — 판단값 우선). 실제 로고 이미지/워드마크 애셋이 없어 텍스트
 * 워드마크로만 최소 구현 — 정식 로고 애셋이 생기면 교체 필요.
 */
export interface LogoProps {
  size?: "small" | "default";
  brand?: "mes" | "moncat-factory";
  className?: string;
}

function Logo({ size = "default", brand = "mes", className }: LogoProps) {
  if (brand === "moncat-factory") {
    return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap text-[18px] font-semibold leading-none text-white", className)}><span className="relative block h-4 w-4"><span className="absolute bottom-0 left-0 h-2 w-[5px] -skew-x-12 rounded-[1px] bg-[#126df5]" /><span className="absolute bottom-0 left-[5px] h-4 w-[5px] -skew-x-12 rounded-[1px] bg-[#00c2a8]" /><span className="absolute bottom-0 right-0 h-3 w-[5px] -skew-x-12 rounded-[1px] bg-white" /></span><span>moncat factory</span></span>;
  }
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
