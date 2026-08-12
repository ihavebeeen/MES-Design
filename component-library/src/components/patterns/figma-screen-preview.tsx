"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FIGMA_SCREEN_WIDTH = 1920;
const FIGMA_SCREEN_HEIGHT = 960;

interface FigmaScreenPreviewProps {
  children: React.ReactNode;
  className?: string;
  /** 원본보다 확대하지 않고, 문서 본문 폭에 맞춰 축소만 한다. */
  maxScale?: number;
  /** Figma 원본 프레임의 자연 크기. 기본은 기존 1920×960 화면. */
  sourceWidth?: number;
  sourceHeight?: number;
}

/**
 * 완성 화면은 1920×960 좌표계를 그대로 유지한다.
 * 문서 사이트 안에서만 바깥 컨테이너 폭에 맞춰 transform으로 축소하므로
 * Sidebar 260, Page tab 38, Bottom action 46 같은 Figma 실측값이 깨지지 않는다.
 */
function FigmaScreenPreview({ children, className, maxScale = 1, sourceWidth = FIGMA_SCREEN_WIDTH, sourceHeight = FIGMA_SCREEN_HEIGHT }: FigmaScreenPreviewProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const ready = React.useSyncExternalStore(
    React.useCallback(() => () => undefined, []),
    React.useCallback(() => true, []),
    React.useCallback(() => false, [])
  );
  const [scale, setScale] = React.useState(0.72);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [fullscreenMode, setFullscreenMode] = React.useState<"fit" | "actual">("fit");

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const update = () => {
      const availableHeight = fullscreen ? host.clientHeight : Number.POSITIVE_INFINITY;
      const next = fullscreenMode === "actual" && fullscreen
        ? 1
        : Math.min(maxScale, host.clientWidth / sourceWidth, availableHeight / sourceHeight);
      setScale(Number.isFinite(next) && next > 0 ? next : 0.72);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, [fullscreen, fullscreenMode, maxScale, sourceHeight, sourceWidth]);

  React.useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [fullscreen]);

  const openFullscreen = () => {
    setFullscreenMode("fit");
    setFullscreen(true);
  };

  return (
    <div
      className={cn("min-w-0 w-full", fullscreen && "fixed inset-0 z-[100] flex h-dvh w-dvw flex-col bg-mes-gray-130")}
      data-figma-screen-preview
      data-figma-preview-ready={ready ? "true" : "false"}
      data-figma-preview-fullscreen={fullscreen ? "true" : undefined}
      data-figma-preview-mode={fullscreen ? fullscreenMode : "inline"}
      data-figma-preview-scale={scale}
    >
      <div className={cn("mb-2 flex h-8 items-center justify-between", fullscreen && "mb-0 h-[52px] shrink-0 border-b border-white/15 px-5 text-white")}>
        <span className={cn("text-[12px] text-mes-gray-60", fullscreen && "text-white/70")}>원본 화면 {sourceWidth}×{sourceHeight}</span>
        <div className="flex items-center gap-2">
          {fullscreen && (
            <Button
              size="small"
              variant="lineBlacktxt"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
              disabled={!ready}
              onClick={() => setFullscreenMode((current) => current === "fit" ? "actual" : "fit")}
            >
              {fullscreenMode === "fit" ? "원본 1:1" : "화면 맞춤"}
            </Button>
          )}
          <Button size="small" variant={fullscreen ? "fillGray" : "lineBlacktxt"} disabled={!ready} onClick={fullscreen ? () => setFullscreen(false) : openFullscreen}>
            {fullscreen ? "전체화면 닫기" : "전체화면으로 보기"}
          </Button>
        </div>
      </div>
      <div
        ref={hostRef}
        className={cn(
          "min-w-0 w-full max-w-full overflow-clip rounded-lg border border-mes-gray-30 bg-mes-gray-20",
          className,
          fullscreen && "flex min-h-0 flex-1 overflow-auto rounded-none border-0 p-0",
          fullscreen && fullscreenMode === "fit" && "items-center justify-center",
          fullscreen && fullscreenMode === "actual" && "items-start justify-start"
        )}
        data-figma-preview-stage
        style={fullscreen ? undefined : { height: sourceHeight * scale }}
      >
        <div data-figma-preview-canvas className="shrink-0" style={{ width: sourceWidth * scale, height: sourceHeight * scale }}>
          <div
            style={{
              width: sourceWidth,
              height: sourceHeight,
              zoom: scale,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export { FIGMA_SCREEN_HEIGHT, FIGMA_SCREEN_WIDTH, FigmaScreenPreview };
