import * as React from "react";
import { cn } from "@/lib/utils";
import { IconStar } from "../icons/icon-star";
import { IconX } from "../icons/icon-x";

/**
 * MES Page Top Tab Item (열린 화면을 브라우저 탭처럼 보여주는 상단 탭 1개) — Figma 실측 기반
 *
 * 출처: 컴포넌트 라이브러리 파일(qEAQNTqXf76bYydyupti2V) node 157:18051(컴포넌트 세트) 하위
 * 157:18052(Default)/157:18058(hover)/157:18064(active) 3종. 2026-07-29 최초엔 Default만
 * 찾아서 "부분"으로 남겼었는데, 2026-07-30 metadata 재탐색으로 형제 variant(hover/active)
 * 노드를 찾아 `get_design_context`로 재검증 후 3종 전부 반영 — "부분"에서 "있음"으로 승격.
 *
 * ── 1. 레이아웃(실측) ──────────────────────────────────────────
 * 높이 38px, 우측 테두리 1px Gray-110(#373F57), 좌우 padding 12px.
 * 내부: [북마크 버튼(28x28, 별 아이콘 16px) + gap 4px + 탭 제목(13px)] 묶음과, 그 오른쪽으로
 * [닫기 버튼(28x28, X 아이콘 16px)] — 둘 사이 gap 10px. 별 아이콘은 `IconStar`, X 아이콘은
 * `IconX` 재사용.
 *
 * ── 2. 상태별 실측값(2026-07-30 재검증) ────────────────────────
 * - Default: 배경 검정(#000000), 제목 Regular 13px 흰색
 * - hover: 배경 Gray-120(#292E41), 제목 Regular 13px 흰색(Default와 폰트굵기 동일)
 * - active(현재 열려있는 탭): 배경 Gray-110(#373F57), 제목 **SemiBold** 13px 흰색
 *   (Default/hover는 Regular인데 active만 SemiBold로 강조 — 처음 판단값으로 넣었던
 *   "배경만 살짝 밝게"는 틀렸었음: 실제로는 active가 hover보다 더 연한 배경(Gray-110은
 *   Gray-120보다 밝은 색이 아니라 인접 단계— 육안상 유사하지만 SemiBold 폰트가 active의
 *   핵심 구분 신호)
 * - 북마크 별 아이콘: hover/active 상태에서 이미지 애셋 자체가 바뀜(더 밝은 버전으로 추정)
 *   — 정확한 색 차이는 벡터라 hex로 못 뽑음, 코드에선 `bookmarked` prop(outline/filled)으로
 *   기존 방식 유지(별도 상태 연동 안 함, 확인 필요로 남김)
 *
 * ── 3. 확인 필요 ────────────────────────────────────────────────
 * - 별 아이콘/닫기 아이콘의 정확한 색은 원본이 이미지 애셋이라 코드로 확인 불가 —
 *   Gray-60(#99A3B8)을 판단값으로 유지(제목 텍스트만 흰색으로 명확히 확인됨).
 * - 별 아이콘이 "북마크 토글" 버튼, 닫기 버튼이 "탭 닫기"라는 건 UI 관례상 추정 — Figma에
 *   클릭 동작 자체가 정의돼 있진 않음.
 */

export interface PageTopTabItemProps {
  label: string;
  /** 실측 3종(default/hover/active) 중 현재 열려있는 탭 표시 — 2026-07-30 정확한 값으로 교체 */
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
        "group flex h-[38px] shrink-0 items-center gap-2.5 border-r border-mes-gray-110 px-3",
        active ? "bg-mes-gray-110" : "bg-black hover:bg-mes-gray-120",
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
        <span
          className={cn(
            "whitespace-nowrap text-[13px] leading-[1.5] text-white",
            active ? "font-semibold" : "font-normal"
          )}
        >
          {label}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="탭 닫기"
        className="flex size-7 shrink-0 items-center justify-center rounded-mes-control-sm text-mes-gray-60"
      >
        <IconX size={16} />
      </button>
    </div>
  );
}

export { PageTopTabItem };
