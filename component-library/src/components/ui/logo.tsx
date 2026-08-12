import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 클라우드 MES Figma 9873:83341에서 160×20으로 export한 실제 워드마크.
const MONCAT_FACTORY_LOGO = "data:image/png;base64,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";

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
    return <Image src={MONCAT_FACTORY_LOGO} alt="moncat factory" width={160} height={20} unoptimized className={cn("block h-5 w-40 shrink-0", className)} />;
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
