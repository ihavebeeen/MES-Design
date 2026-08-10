"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const FIGMA_SCREEN_WIDTH = 1920;
const FIGMA_SCREEN_HEIGHT = 960;

interface FigmaScreenPreviewProps {
  children: React.ReactNode;
  className?: string;
  /** 원본보다 확대하지 않고, 문서 본문 폭에 맞춰 축소만 한다. */
  maxScale?: number;
}

/**
 * 완성 화면은 1920×960 좌표계를 그대로 유지한다.
 * 문서 사이트 안에서만 바깥 컨테이너 폭에 맞춰 transform으로 축소하므로
 * Sidebar 260, Page tab 38, Bottom action 46 같은 Figma 실측값이 깨지지 않는다.
 */
function FigmaScreenPreview({ children, className, maxScale = 1 }: FigmaScreenPreviewProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.72);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const update = () => {
      const next = Math.min(maxScale, host.clientWidth / FIGMA_SCREEN_WIDTH);
      setScale(Number.isFinite(next) && next > 0 ? next : 0.72);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, [maxScale]);

  return (
    <div
      ref={hostRef}
      className={cn("min-w-0 w-full max-w-full overflow-clip rounded-lg border border-mes-gray-30 bg-mes-gray-20", className)}
      style={{ height: FIGMA_SCREEN_HEIGHT * scale }}
    >
      <div
        style={{
          width: FIGMA_SCREEN_WIDTH,
          height: FIGMA_SCREEN_HEIGHT,
          zoom: scale,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export { FIGMA_SCREEN_HEIGHT, FIGMA_SCREEN_WIDTH, FigmaScreenPreview };
