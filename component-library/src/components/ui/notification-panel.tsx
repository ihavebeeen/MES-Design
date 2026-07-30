"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconFilter, IconX } from "@/components/icons";
import { AlarmListItem, type AlarmListItemProps } from "./alarm-list-item";

/**
 * MES NotificationPanel (알림 드롭다운 패널) — Figma 실측 기반, 2026-07-30 신규
 *
 * 출처: 컴포넌트 라이브러리 파일(qEAQNTqXf76bYydyupti2V) node 157:15771("알림모달 2",
 * 데이터 있음) / 157:15833("알림 내역 존재 X", 빈 상태) — "컴포넌트부터 모으자" 지시로
 * 두 파일 metadata를 직접 훑다가 AlarmListItem(node 163:3039)을 재사용하는 상위
 * organism으로 발견. 알람벨 아이콘 클릭 시 뜨는 드롭다운으로 추정(진입 트리거는 미실측).
 *
 * ── 1. 레이아웃(실측, 2026-07-30 담당자가 실제 서비스 화면 기준으로 재수정) ──────
 * 전체 너비 400px(처음엔 400px 리스트 아이템 + 좌우 패딩 20px씩을 더해 440px로 잘못
 * 계산했었음 — 담당자 확인 결과 패널 자체가 400px). 흰 배경, radius 12px, 그림자
 * `0 4px 16px rgba(0,0,0,.2)`(ConfirmDialog와 동일한 "modal-shadow" 이펙트). 헤더:
 * 하단 테두리 1px Gray-30, 좌우 padding 20px, "전체 알림" 탭(하단 2px Gray-80 밑줄,
 * 라벨 Gray-80 + 카운트 Gray-130, 둘 다 16px/SemiBold — AlarmListItem 내부 텍스트보다
 * 한 단계 큼) + 우측 닫기 아이콘. 본문: padding 20px, gap 24px — 리스트(있으면 높이
 * 350px 고정 + 세로 스크롤, AlarmListItem을 그대로 나열) 또는 빈 상태 문구, 그 아래
 * 필터 아이콘 액션 줄(padding-x 8px).
 *
 * ── 2. 빈 상태(실측) ───────────────────────────────────────────
 * "전체 알림 0" + "알림 내역이 없습니다."(15px/SemiBold/Gray-90) 중앙 정렬 문구로 대체.
 * 리스트 스크롤 영역 없이 문구 한 줄만 표시.
 *
 * ── 3. 확인 필요 ────────────────────────────────────────────────
 * - 헤더에 "미확인"/"확인" 탭이 있을 것으로 추정되는 빈 자리(node 157:15778/15781,
 *   157:15840/15843)가 있었으나, 두 상태(데이터 있음/빈 상태) 모두에서 실제 라벨
 *   텍스트가 렌더링되지 않았고(get_design_context가 두 경우 다 빈 프레임만 반환),
 *   너비도 상태마다 다름(10px/39px vs 39px/26px) — 실제 탭인지 미완성 자리인지
 *   불확실해 "전체 알림" 탭 하나만 구현. 실제로 필터 탭이 있다면 추가 실측 필요.
 * - metadata 스캔 중 같은 페이지에서 "모두 확인으로 표시"(157:15799), "알림 설정"
 *   (157:15800/157:15804) 텍스트 노드도 발견됐으나, get_design_context로 이 패널의
 *   실제 트리를 확장해 보면 두 노드 모두 자식으로 포함되어 있지 않음(다른 프레임/변형에
 *   속한 것으로 추정) — "알림 설정"은 요청대로 이번 범위에서 제외하고, "모두 확인으로
 *   표시"도 위치·스타일이 실측되지 않아 이번엔 구현하지 않음. 필요 시 별도 실측 후 액션
 *   줄에 텍스트 버튼으로 추가.
 * - 필터 아이콘 클릭 시 어떤 UI가 뜨는지 미실측(단순 버튼 슬롯만 제공).
 */

export interface NotificationPanelItem extends Omit<AlarmListItemProps, "className"> {
  /** React key 및 클릭 핸들러 구분용 id */
  id: string;
}

export interface NotificationPanelProps {
  /** 헤더 "전체 알림" 옆 카운트 — 생략 시 items.length 사용 */
  totalCount?: number;
  items: NotificationPanelItem[];
  onClose?: () => void;
  /** 실제 동작 미실측 — 슬롯만 제공 */
  onFilterClick?: () => void;
  className?: string;
}

function NotificationPanel({
  items,
  totalCount,
  onClose,
  onFilterClick,
  className,
}: NotificationPanelProps) {
  const count = totalCount ?? items.length;
  const isEmpty = items.length === 0;

  return (
    <div
      className={cn(
        "flex w-[400px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-mes-gray-30 px-5">
        <div className="flex items-center gap-2 border-b-2 border-mes-gray-80 py-5 text-[16px] leading-[1.5] tracking-[-0.1875px]">
          <span className="font-semibold text-mes-gray-80">전체 알림</span>
          <span className="font-semibold text-mes-gray-130">{count}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="알림 패널 닫기"
          className="flex size-6 shrink-0 items-center justify-center text-mes-gray-130"
        >
          <IconX size={19} />
        </button>
      </div>

      <div className="flex flex-col gap-6 p-5">
        {isEmpty ? (
          <p className="w-full py-6 text-center text-[15px] font-semibold leading-[1.5] tracking-[-0.1875px] text-mes-gray-90">
            알림 내역이 없습니다.
          </p>
        ) : (
          <div className="flex h-[350px] w-full flex-col overflow-x-hidden overflow-y-auto">
            {items.map(({ id, ...item }) => (
              <AlarmListItem key={id} {...item} />
            ))}
          </div>
        )}

        <div className="flex w-full items-center gap-2 px-2">
          <button
            type="button"
            onClick={onFilterClick}
            aria-label="알림 필터"
            className="flex size-4 shrink-0 items-center justify-center text-mes-gray-130"
          >
            <IconFilter size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export { NotificationPanel };
