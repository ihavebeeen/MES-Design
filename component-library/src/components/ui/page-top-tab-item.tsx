import * as React from "react";
import { cn } from "@/lib/utils";
import { IconStar } from "../icons/icon-star";
import { IconX } from "../icons/icon-x";

/**
 * MES Page Top Tab Item (열린 화면을 브라우저 탭처럼 보여주는 상단 탭 1개) — Figma 실측 기반
 *
 * 출처: 컴포넌트 라이브러리 파일(qEAQNTqXf76bYydyupti2V) node 157:18052
 * ("Property 1=Default"). `docs/신규_컴포넌트_설계_프로세스.md`에 기록된 값을
 * 2026-07-29 `get_design_context`로 재검증 후 코드화.
 *
 * ── 1. 레이아웃(실측) ──────────────────────────────────────────
 * 높이 38px, 배경 검정(#000000), 우측 테두리 1px Gray-110(#373F57), 좌우 padding 12px.
 * 내부: [북마크 버튼(28x28, 별 아이콘 16px) + gap 4px + 탭 제목(Regular 13px, 흰색)]
 * 묶음과, 그 오른쪽으로 [닫기 버튼(28x28, X 아이콘 16px)] — 둘 사이 gap 10px.
 * 별 아이콘은 기존 `IconStar`(outline/filled 지원)를 재사용, X 아이콘은 `IconX` 재사용.
 *
 * ── 2. 확인 필요 / 판단값 ──────────────────────────────────────
 * - `get_metadata`로 이 노드가 "Property 1=Default"라는 variant set의 하나임을
 *   확인했지만, 형제 variant(예: active/hover/선택된 탭)의 노드 ID를 못 찾아서 이번엔
 *   가져오지 못함 — **이 컴포넌트는 "Default"(비활성 탭처럼 보이는 기본 상태) 1종만
 *   실측됨**. `active` prop은 판단값(배경을 Gray-120으로 살짝 밝게)으로 임시 구현 —
 *   실제 활성 탭 디자인이 확인되면 교체 필요. 체크리스트엔 "부분"으로 등록.
 * - 별 아이콘/닫기 아이콘의 정확한 색은 원본이 이미지 애셋이라 코드로 확인 불가 —
 *   `get_variable_defs`에 이 노드용으로 뜬 Gray-60(#99A3B8)을 두 아이콘 공통색으로 판단
 *   처리(제목 텍스트만 흰색으로 명확히 확인됨).
 * - 별 아이콘이 "북마크 토글" 버튼이라는 것과 닫기 버튼이 "탭 닫기"라는 것은 UI 관례상
 *   추정 — Figma에 클릭 동작 자체가 정의돼 있진 않음.
 */

export interface PageTopTabItemProps {
  label: string;
  /** 판단값 — 원본에 다른 variant(활성/hover)가 실측 안 됨, 확인 필요 */
  active?: boolean;
  bookmarked?: boolean;
  onBookmarkClick?: () => void;
  onClose?: () => void;
  className?: string;
}

function PageTopTabItem({
  label,
  active = false,
  bookmarked = false,
  onBookmarkClick,
  onClose,
  className,
}: PageTopTabItemProps) {
  return (
    <div
      className={cn(
        "flex h-[38px] shrink-0 items-center gap-2.5 border-r border-mes-gray-110 bg-black px-3",
        active && "bg-mes-gray-120",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onBookmarkClick}
          aria-label="북마크"
          className="flex size-7 shrink-0 items-center justify-center rounded text-mes-gray-60"
        >
          <IconStar size={16} variant={bookmarked ? "filled" : "outline"} />
        </button>
        <span className="whitespace-nowrap text-[13px] font-normal leading-[1.5] text-white">
          {label}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="탭 닫기"
        className="flex size-7 shrink-0 items-center justify-center rounded-[3px] text-mes-gray-60"
      >
        <IconX size={16} />
      </button>
    </div>
  );
}

export { PageTopTabItem };
