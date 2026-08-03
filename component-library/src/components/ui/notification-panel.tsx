"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconArrow, IconFilter, IconX } from "@/components/icons";
import { AlarmListItem, type AlarmListItemProps } from "./alarm-list-item";
import { Switch } from "./switch";

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
 * 필터 아이콘 액션 줄(padding-x 8px). 자간은 실측상 -0.1875px였으나 담당자가 "자간은
 * 0, 행간은 150%로 통일"이라고 확정해 2026-07-30에 제거함(시스템 전역 표준 — Foundation
 * 섹션/토큰 문서 참고).
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
 *   속한 것으로 추정) — 처음엔 "알림 설정"을 범위에서 제외했었음. "모두 확인으로
 *   표시"도 위치·스타일이 아직 실측되지 않아 이번에도 구현하지 않음. 필요 시 별도 실측 후
 *   액션 줄에 텍스트 버튼으로 추가.
 * - 필터 아이콘 클릭 시 어떤 UI가 뜨는지 미실측(단순 버튼 슬롯만 제공).
 *
 * ── 4. 2026-08-03 담당자 추가 지시 — 클릭 시 제거 + 알림 설정 화면 ──────────
 * 담당자가 실제 서비스 스크린샷 2건을 근거로 두 가지를 지시함(Figma 링크 없음 —
 * 스크린샷 기반 판단값):
 * 1) "알람은 목록에서 클릭하면 사라짐" — 항목을 클릭하면 목록에서 제거됨. 이 컴포넌트
 *    자체는 `items`를 그대로 받아 렌더링만 하는 순수 컨트롤형이라(다른 컴포넌트들과
 *    동일한 설계 원칙 — 상태는 항상 호출부 책임), 제거 로직 자체는 호출부(`page.tsx`
 *    데모)에 두고, 이 컴포넌트는 각 항목 클릭 시 그 항목의 `id`를 알려주는
 *    `onItemClick(id)` 콜백만 새로 추가함(항목 자체의 `onClick`이 있으면 그것도
 *    같이 호출 — 상세 이동 등 다른 용도로 개별 `onClick`을 쓰던 기존 호출부를 깨지
 *    않기 위함).
 * 2) "알람에서 환경설정 누르면 팝업이 이렇게 바뀜" — 스크린샷은 뒤로가기 화살표 +
 *    "알림 설정" 제목 + 알림 유형별 라벨+Switch 토글 목록으로 된 화면. 이전에 위 3번에서
 *    "알림 설정"이 이 패널의 실제 자식 노드가 아니라 실측을 못 했다고 적어뒀던 부분을
 *    이번 스크린샷으로 보완 — 다만 목록으로 돌아가는 "환경설정" 트리거 아이콘 자체의
 *    정확한 모양/위치는 스크린샷에 없어서(목적지 화면만 있음), 기존 필터 아이콘 옆에
 *    톱니(`lucide-react` `Settings`, Sidebar/QuickQuery와 동일한 임시 placeholder
 *    컨벤션) 버튼을 판단으로 추가함. 내부적으로 `view` state("list"/"settings")를 둬서
 *    패널 콘텐츠 전체를 스와핑하는 방식으로 구현(다른 컴포넌트처럼 완전 제어형으로 만들면
 *    호출부가 항상 view까지 관리해야 해서 번거로움 — 이 정도 내부 네비게이션은 Combobox의
 *    열림 상태처럼 비제어로 두는 게 이 프로젝트 관례와 맞다고 판단). 뒤로가기 아이콘은
 *    `IconArrow`를 회전 없이 그대로 씀(기본이 이미 왼쪽 화살표 모양). 각 행의 Switch는
 *    기존 `Switch` 컴포넌트 재사용, 값/변경은 `settingsItems`/`onSettingsItemChange`로
 *    완전 제어형.
 */

export interface NotificationPanelItem extends Omit<AlarmListItemProps, "className"> {
  /** React key 및 클릭 핸들러 구분용 id */
  id: string;
}

export interface NotificationSettingItem {
  id: string;
  label: string;
  enabled: boolean;
}

export interface NotificationPanelProps {
  /** 헤더 "전체 알림" 옆 카운트 — 생략 시 items.length 사용 */
  totalCount?: number;
  items: NotificationPanelItem[];
  onClose?: () => void;
  /** 실제 동작 미실측 — 슬롯만 제공 */
  onFilterClick?: () => void;
  /** 항목 클릭 시 그 항목의 id를 전달(항목 자체 onClick이 있으면 그것도 같이 호출됨) —
   *  보통 "클릭하면 목록에서 제거" 같은 처리에 씀(2026-08-03 추가) */
  onItemClick?: (id: string) => void;
  /** 전달하면 액션 줄에 설정(톱니) 버튼이 노출되고, 클릭 시 패널 내용이 이 목록으로
   *  전환됨(뒤로가기로 목록 화면 복귀). 2026-08-03 추가 */
  settingsItems?: NotificationSettingItem[];
  onSettingsItemChange?: (id: string, enabled: boolean) => void;
  className?: string;
}

function NotificationPanel({
  items,
  totalCount,
  onClose,
  onFilterClick,
  onItemClick,
  settingsItems,
  onSettingsItemChange,
  className,
}: NotificationPanelProps) {
  const count = totalCount ?? items.length;
  const isEmpty = items.length === 0;
  const [view, setView] = React.useState<"list" | "settings">("list");

  return (
    <div
      className={cn(
        "flex w-[400px] flex-col overflow-hidden rounded-mes-modal-sm bg-white shadow-mes-modal-sm",
        className
      )}
    >
      {view === "settings" ? (
        <>
          <div className="flex shrink-0 items-center gap-2 border-b border-mes-border-default px-mes-dialog-x py-5">
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="알림 목록으로 돌아가기"
              className="flex size-5 shrink-0 items-center justify-center text-mes-text-default"
            >
              <IconArrow size={16} />
            </button>
            <span className="text-[16px] font-semibold leading-[1.5] text-mes-text-default">
              알림 설정
            </span>
          </div>
          <div className="flex h-[350px] w-full flex-col overflow-x-hidden overflow-y-auto">
            {(settingsItems ?? []).map((item) => (
              <div
                key={item.id}
                className="flex w-full shrink-0 items-center justify-between border-b border-mes-border-default px-mes-dialog-x py-4"
              >
                <span className="text-[14px] font-medium leading-[1.5] text-mes-text-default">
                  {item.label}
                </span>
                <Switch
                  checked={item.enabled}
                  onChange={() => onSettingsItemChange?.(item.id, !item.enabled)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 items-center justify-between border-b border-mes-border-default px-mes-dialog-x">
            <div className="flex items-center gap-2 border-b-2 border-mes-gray-80 py-5 text-[16px] leading-[1.5]">
              <span className="font-semibold text-mes-gray-80">전체 알림</span>
              <span className="font-semibold text-mes-text-default">{count}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="알림 패널 닫기"
              className="flex size-6 shrink-0 items-center justify-center text-mes-text-default"
            >
              <IconX size={19} />
            </button>
          </div>

          <div className="flex flex-col gap-6 p-mes-dialog-x">
            {isEmpty ? (
              <p className="w-full py-6 text-center text-[15px] font-semibold leading-[1.5] text-mes-gray-90">
                알림 내역이 없습니다.
              </p>
            ) : (
              <div className="flex h-[350px] w-full flex-col overflow-x-hidden overflow-y-auto">
                {items.map(({ id, onClick, ...item }) => (
                  <AlarmListItem
                    key={id}
                    {...item}
                    onClick={() => {
                      onClick?.();
                      onItemClick?.(id);
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex w-full items-center gap-3 px-2">
              <button
                type="button"
                onClick={onFilterClick}
                aria-label="알림 필터"
                className="flex size-4 shrink-0 items-center justify-center text-mes-text-default"
              >
                <IconFilter size={16} />
              </button>
              {settingsItems && (
                <button
                  type="button"
                  onClick={() => setView("settings")}
                  aria-label="알림 설정"
                  className="flex size-4 shrink-0 items-center justify-center text-mes-text-default"
                >
                  <Settings size={16} />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { NotificationPanel };
