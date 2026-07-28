"use client";

import * as React from "react";
import { X } from "lucide-react";
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
 * - 닫기(X) 아이콘 12px, 흰색("Property 1=white" 컴포넌트, 설명: "close, 닫기")
 *
 * ── 특이사항(그대로 반영, 임의로 안 고침) ─────────────────────────
 * Figma 원본에 X 아이콘이 텍스트 앞뒤로 2개 있음(좌측 1개 + 우측 1개) — 일반적인 태그
 * UX 관례상 닫기 버튼은 보통 1개(우측)인 경우가 많아 편집 중 남은 중복으로 추정되지만,
 * 실측 그대로 앞뒤 2개 구조로 구현해둠. 좌측 X가 실수라면 알려주면 제거.
 */

export type TagColor = "main" | "gray" | "red";

const tagColorClasses: Record<TagColor, string> = {
  main: "bg-mes-primary-60",
  gray: "bg-mes-gray-90",
  red: "bg-mes-danger-60",
};

export interface TagProps {
  color?: TagColor;
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ color = "main", children, onRemove, className }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex h-[22px] items-center gap-1 rounded-[2px] px-2 py-[3px] text-[12px] font-semibold leading-[1.5] tracking-[-0.15px] text-white",
        tagColorClasses[color],
        className
      )}
    >
      <button type="button" onClick={onRemove} aria-label="태그 삭제" className="shrink-0">
        <X className="size-3" />
      </button>
      <span>{children}</span>
      <button type="button" onClick={onRemove} aria-label="태그 삭제" className="shrink-0">
        <X className="size-3" />
      </button>
    </span>
  )
);
Tag.displayName = "Tag";

export { Tag };
