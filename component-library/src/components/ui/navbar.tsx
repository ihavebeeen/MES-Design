import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Navbar (상단 내비게이션 바) — Figma에 전용 컴포넌트 없음(체크리스트 티어2
 * "Navbar / Top Nav", 상태 "없음", 재탐색 안 함 — 판단값 우선). 높이 56px(h-14)은 이
 * 데모 페이지 자체의 상단 바가 이미 쓰고 있는 값(`sticky top-14`)을 그대로 재사용 —
 * 임의값 아님. left/center/right 3-슬롯 구조.
 */
export interface NavbarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

function Navbar({ left, center, right, className }: NavbarProps) {
  return (
    <div
      className={cn(
        "flex h-14 w-full items-center justify-between border-b border-mes-border-default bg-white px-4",
        className
      )}
    >
      <div className="flex items-center gap-3">{left}</div>
      <div className="flex items-center gap-3">{center}</div>
      <div className="flex items-center gap-3">{right}</div>
    </div>
  );
}

export { Navbar };
