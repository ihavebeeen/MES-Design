"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES Tag (범용 3색 태그/칩) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:83675("Tag" 프레임)
 * 하위 3개 property(9873:83679=fill-main, 9873:83683=fill-gray, 9873:83687=fill-red).
 *
 * ⚠ 담당자 확인(2026-07-28): "이건 거의 안 쓰고, 이전에 보낸 뱃지를 많이 쓴다" —
 * 실제 서비스에서 사용 빈도가 낮은 컴포넌트. 체크리스트 원문의 "Chip/Tag: 3색 + 제거가능형
 * + MES 상태배지" 항목 중 "3색 + 제거가능형" 부분이 바로 이 컴포넌트를 가리킴 —
 * "MES 상태배지"는 Badge(badge.tsx)를 가리키는 것으로 정리됨. 실사용 낮음을 감안해
 * 최소 구현만 해둠.
 *
 * ── 실측값 ────────────────────────────────────────────────────
 * - 높이 22px, radius 2px, 좌우 padding 8px/상하 3px, 요소 간 gap 4px
 * - 텍스트 Pretendard SemiBold 12px/line-height 150%/letter-spacing -0.15px, 흰색 고정
 * - fill-main: 배경 Primary-60 / fill-gray: 배경 Gray-90(#5C667B) / fill-red: 배경 Danger-60
 *
 * ── 아이콘 슬롯(2026-07-28 담당자 정정) ────────────────────────
 * Figma 원본엔 X(닫기) 아이콘이 텍스트 앞뒤로 2개 있었는데, 이건 실수/중복이 아니라
 * "Button과 마찬가지로 앞에도 아이콘, 뒤에도 아이콘이 들어갈 수 있는 구조"라서였음 —
 * 즉 Tag도 Button처럼 `startIcon`/`endIcon`을 각각 독립적으로 받는 범용 아이콘 슬롯
 * 구조. 실측 인스턴스는 두 슬롯 모두에 X 아이콘을 넣어 쓴 예시였을 뿐, 닫기 전용이
 * 아님 — button.tsx의 startIcon/endIcon 패턴과 동일하게 구현함.
 */

export type TagColor = "main" | "gray" | "red";

const tagColorClasses: Record<TagColor, string> = {
  main: "bg-mes-bg-brand",
  gray: "bg-mes-gray-90",
  red: "bg-mes-bg-danger",
};

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: TagColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ color = "main", startIcon, endIcon, children, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex h-[22px] items-center gap-1 rounded-mes-control-xs px-2 py-[3px] text-[12px] font-semibold leading-[1.5] text-mes-text-inverse",
        tagColorClasses[color],
        className
      )}
      {...props}
    >
      {startIcon}
      <span>{children}</span>
      {endIcon}
    </span>
  )
);
Tag.displayName = "Tag";

export { Tag };
