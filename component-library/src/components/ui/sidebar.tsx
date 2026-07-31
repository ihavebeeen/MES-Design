"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconArrow } from "../icons/icon-arrow";
import { IconArrowLine } from "../icons/icon-arrow-line";
import { IconStar } from "../icons/icon-star";
import { IconGrid } from "../icons/icon-grid";

/**
 * MES Sidebar / SNB (좌측 전역 내비게이션, 오가니즘) — Figma 실측 기반
 *
 * 출처: 컴포넌트 라이브러리 파일(qEAQNTqXf76bYydyupti2V) node 133:1976("SNB-active").
 * `docs/신규_컴포넌트_설계_프로세스.md`에 기록된 값을 2026-07-29 `get_design_context`로
 * 재검증 후 코드화. 실측 시점에 컨테이너 하나(133:1976)를 통째로 조회해 내부 1-depth/2-depth/
 * 토글/열기버튼 구조를 한 번에 확인함 — 문서에 적혀 있던 하위 node id(133:2042 등)는 이번
 * 실측에서 실제로 뜬 id(133:2030, 133:2143 등)와 표기가 달랐는데, 같은 컴포넌트 인스턴스를
 * 가리키는 것으로 판단(문서 작성 시점과 현재 Figma 파일 편집 이력 차이로 추정) — 구조/스펙 자체는
 * 문서 기록과 실측이 서로 일치함을 확인했으므로 실측값을 그대로 채택.
 *
 * ── 1. 레이아웃(실측) ──────────────────────────────────────────
 * 전체 너비 260px, 배경 검정(#000000), 우측 테두리 1px Gray-100(#475067).
 * - 로고 행: 상 24px/하 20px/좌우 20px padding, 로고(자유 커스텀, `logo` prop) + 우측 원형
 *   접기 버튼(30x30, bg Gray-110/#373F57, 아이콘 20px `IconArrowLine` 재사용).
 * - 즐겨찾기/대시보드: 하단 테두리 1px Gray-120(#292E41), 좌우 padding 10px/하단 10px,
 *   각 행 높이 42px, 아이콘 20px + gap 10px + 라벨(Medium 15px 흰색). 즐겨찾기는 `IconStar`,
 *   대시보드는 `IconGrid` 재사용.
 * - 메인 내비게이션: 하단 테두리 1px Gray-120, padding 10px, gap 10px.
 *   - MES/FEMS 토글: 흰 배경 pill(radius 4, padding 2px), 버튼 2개 각 높이 26px, 활성은
 *     검정 배경 + 흰색 SemiBold 13px, 비활성은 Gray-100(#475067) 텍스트.
 *   - 1-depth 항목 리스트(gap 4px, 너비 240px): 각 항목 높이 42px, 좌우 padding 10px,
 *     아이콘 20px + gap 10px + 라벨(Regular 15px Gray-70/#8491A7), 우측에 펼침 화살표
 *     16px(`IconArrow`를 회전시켜 재사용 — 원본은 별도 "icon-24-left" 벡터였으나 동일한
 *     "<" 모양의 화살표라 기존 아이콘 재사용, 접힘 시 -90도(아래 방향)/펼침 시 90도(위 방향)).
 *     펼쳐진 항목은 배경 Gray-120, 라벨/아이콘 흰색 Medium으로 강조.
 *   - 2-depth 항목(펼친 1-depth 하위, 좌측 padding 32px + 상단 padding 10px로 들여쓰기):
 *     각 항목 좌우 padding 12px/상하 6px, radius 8px, 라벨 Regular 14px Gray-60(#99A3B8).
 *     선택된 항목은 배경 Primary-60(#1573FB) + 흰색 Medium.
 * - 하단 유틸리티 바: 메뉴얼/로그아웃 2칸, 각 flex-1, 상하 padding 16px, 가운데 정렬,
 *   Medium 14px 흰색, 첫 칸만 우측 테두리 1px Gray-120.
 *
 * ── 2. 확인 필요 / 판단값 ──────────────────────────────────────
 * - 이번 실측 프레임은 "MES 설정" 1-depth 항목 1개만 펼쳐진 상태였음 — 다른 1-depth
 *   항목(자재관리/생산관리/품질관리/설비관리/통계분석)도 동일한 펼침 화살표를 갖고 있어
 *   구조상 펼쳐질 수 있는 것으로 보이나, 그 하위 2-depth 내용은 이번에 실측되지 않음.
 *   컴포넌트는 임의의 `children`을 받도록 범용으로 만들었고, 데모에서는 "MES 설정"에만
 *   실측된 2-depth 목록(거래처 등록/사용자 설정/품목 등록/창고 등록/생산 정보 설정/
 *   품질 정보 설정/설비 정보 설정)을 예시로 채움.
 * - 2-depth 항목 중 "품목 등록"이 원본 스크린샷에서 옅은 배경(Gray-120)으로 보였는데,
 *   "사용자 설정"(선택됨, Primary-60 파랑)과 달리 하이라이트 사유가 명확하지 않아
 *   hover 상태를 캡처한 것으로 판단 — 코드에서는 하이라이트를 `hover:bg-mes-gray-120`으로
 *   구현(고정 스타일 아님).
 * - "MES 설정" 아이콘은 원본이 톱니바퀴(설정) 모양인데, 33개 아이콘 목록에 설정/톱니바퀴
 *   아이콘이 없어 `lucide-react`의 `Settings`를 임시 placeholder로 사용 — 2026-07-30 재확인:
 *   Figma에 실제 `mes/icon-setting`(Property1=gray/black/fill-white/fill-gray) 벡터가
 *   존재함을 확인했으나 이미지 애셋이라 코드로 못 뽑음 — 담당자가 다른 33종처럼 SVG
 *   export 해주면 교체 예정, 그 전까진 lucide 임시 유지.
 * - 로고는 실제 회사 로고 이미지 애셋이라 코드로 재현하지 않고 `logo` prop으로 자유롭게
 *   주입하도록 함(데모 페이지에서 텍스트로 대체).
 *
 * ── 3. 2026-07-30 추가 실측(metadata 재탐색으로 형제 컴포넌트 세트 발견) ──────
 * 처음엔 1-depth/2-depth hover/active를 가리키는 것처럼 보인 노드(133:2067/2070/2073 등)가
 * 실은 캡션 텍스트였다는 걸 확인했지만, 같은 metadata를 더 넓게 훑어서 실제 컴포넌트
 * 세트를 찾아냄 — 재검증 완료:
 * - **접기 버튼**(snb-open-btn, node 133:2050): 기본 Gray-110(#373F57) → hover
 *   Gray-90(#5C667B) — 반영.
 * - **1-depth 항목**(snb-item, node 133:2042 세트 하위 133:2151/2179/2207 =
 *   main-item/main-item-hover/main-item-active): hover는 배경 Gray-120(#292E41) + 흰색
 *   Medium 텍스트, active(현재 선택된 페이지)는 배경 **Primary-60(#1573FB)** + 흰색
 *   Medium 텍스트 — hover와 active가 서로 다른 색이라는 걸 이번에 처음 확인(이전엔
 *   "펼침"과 "활성"을 구분하지 않고 둘 다 Gray-120으로만 처리했었음). `activeKey` prop을
 *   `expandedKey`와 별개로 추가해 반영.
 * - **2-depth 항목**(snb-2depth-item, node 133:2235): open(기본)=투명 배경/Gray-60 텍스트,
 *   hover=배경 Gray-120, active=배경 Primary-60+흰색 Medium — 기존에 판단값으로 구현해뒀던
 *   값과 정확히 일치함을 확인(우연이 아니라 처음부터 스크린샷 육안 대조가 정확했던 것).
 * - **MES/FEMS 토글**(snb-tab-item, node 133:2248): 기본=투명/Gray-100 텍스트, hover=배경
 *   Gray-20(#EFF2F8), active=배경 검정+흰색 SemiBold — hover 배경 추가 반영.
 * - 접기(collapsed rail) 상태(`SNB-hide` 컴포넌트 세트, node 133:2263 등)는 존재를
 *   확인했지만 이번 라운드에선 범위 밖(아이콘만 남기고 라벨 숨기는 완전히 다른 레이아웃이라
 *   별도 작업 필요) — 체크리스트에 "부분" 사유로 계속 남겨둠.
 */

export interface SidebarSubItem {
  key: string;
  label: string;
}

export interface SidebarNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  children?: SidebarSubItem[];
}

export interface SidebarProps {
  items: SidebarNavItem[];
  /** 펼쳐진 1-depth 항목 key (없으면 전부 접힘) */
  expandedKey?: string;
  onExpandedKeyChange?: (key: string | undefined) => void;
  /**
   * 현재 선택된(활성) 1-depth 항목 key — 2026-07-30 실측 추가(node 133:2207
   * "main-item-active", 배경 Primary-60/#1573FB). `expandedKey`(펼침 여부)와는
   * 별개 개념 — 하위 메뉴 없이 바로 이동하는 1-depth 항목이 "현재 보고 있는 페이지"임을
   * 나타낼 때 씀. 펼쳐진 상태의 시각효과(배경 Gray-120)와는 다른 색(파랑)이라 구분해서 구현.
   */
  activeKey?: string;
  /** 선택된 2-depth 항목 key */
  activeSubKey?: string;
  onSubItemClick?: (itemKey: string, subKey: string) => void;
  onItemClick?: (itemKey: string) => void;
  mode?: "MES" | "FEMS";
  onModeChange?: (mode: "MES" | "FEMS") => void;
  favorited?: boolean;
  onFavoriteClick?: () => void;
  onDashboardClick?: () => void;
  onCollapseClick?: () => void;
  onManualClick?: () => void;
  onLogoutClick?: () => void;
  logo?: React.ReactNode;
  className?: string;
}

function Sidebar({
  items,
  expandedKey,
  onExpandedKeyChange,
  activeKey,
  activeSubKey,
  onSubItemClick,
  onItemClick,
  mode = "MES",
  onModeChange,
  favorited = false,
  onFavoriteClick,
  onDashboardClick,
  onCollapseClick,
  onManualClick,
  onLogoutClick,
  logo,
  className,
}: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-[260px] shrink-0 flex-col items-center border-r border-mes-gray-100 bg-black",
        className
      )}
    >
      <div className="flex w-full flex-1 flex-col overflow-y-auto">
        <div className="flex w-full shrink-0 items-center justify-between px-5 pb-5 pt-6">
          <div className="min-w-0 shrink">{logo}</div>
          <button
            type="button"
            onClick={onCollapseClick}
            aria-label="사이드바 접기"
            className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-mes-gray-110 text-white hover:bg-mes-gray-90"
          >
            <IconArrowLine size={20} />
          </button>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-1 border-b border-mes-gray-120 px-[10px] pb-[10px]">
          <button
            type="button"
            onClick={onFavoriteClick}
            className="flex h-[42px] w-full shrink-0 items-center gap-2.5 rounded px-[10px] text-white"
          >
            <IconStar size={20} variant={favorited ? "filled" : "outline"} />
            <span className="text-[15px] font-medium leading-[1.5]">즐겨찾기</span>
          </button>
          <button
            type="button"
            onClick={onDashboardClick}
            className="flex h-[42px] w-full shrink-0 items-center gap-2.5 rounded px-[10px] text-white"
          >
            <IconGrid size={20} />
            <span className="text-[15px] font-medium leading-[1.5]">대시보드</span>
          </button>
        </div>

        <div className="flex w-full flex-1 flex-col gap-2.5 border-b border-mes-gray-120 p-[10px]">
          <div className="flex w-full shrink-0 items-start rounded bg-white p-0.5">
            {(["MES", "FEMS"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange?.(m)}
                className={cn(
                  "flex h-[26px] flex-1 items-center justify-center rounded-sm px-4 text-[13px] font-semibold leading-[1.5]",
                  mode === m
                    ? "bg-black text-white"
                    : "text-mes-gray-100 hover:bg-mes-gray-20"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex w-full flex-col gap-1">
            {items.map((item) => {
              const isExpanded = expandedKey === item.key;
              const isActive = activeKey === item.key;
              const isEmphasized = isExpanded || isActive;
              const hasChildren = !!item.children?.length;
              return (
                <div
                  key={item.key}
                  className="flex w-full flex-col items-end overflow-hidden rounded"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (hasChildren) {
                        onExpandedKeyChange?.(isExpanded ? undefined : item.key);
                      }
                      onItemClick?.(item.key);
                    }}
                    className={cn(
                      "group flex h-[42px] w-full shrink-0 items-center justify-between rounded px-[10px]",
                      isActive
                        ? "bg-mes-bg-brand"
                        : isExpanded
                          ? "bg-mes-gray-120"
                          : "hover:bg-mes-gray-120"
                    )}
                  >
                    <span className="flex shrink-0 items-center gap-2.5">
                      <span
                        className={cn(
                          "flex shrink-0",
                          isEmphasized
                            ? "text-white"
                            : "text-mes-gray-70 group-hover:text-white"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "whitespace-nowrap text-[15px] leading-[1.5]",
                          isEmphasized
                            ? "font-medium text-white"
                            : "font-normal text-mes-gray-70 group-hover:text-white"
                        )}
                      >
                        {item.label}
                      </span>
                    </span>
                    {hasChildren && (
                      <IconArrow
                        size={16}
                        className={cn(
                          "shrink-0 transition-transform",
                          isEmphasized
                            ? "text-white"
                            : "text-mes-gray-70 group-hover:text-white",
                          isExpanded ? "rotate-90" : "-rotate-90"
                        )}
                      />
                    )}
                  </button>

                  {isExpanded && item.children ? (
                    <div className="flex w-full flex-col gap-1 py-2.5 pl-8">
                      {item.children.map((sub) => {
                        const isActive = activeSubKey === sub.key;
                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => onSubItemClick?.(item.key, sub.key)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-mes-panel px-3 py-1.5 text-left text-[14px] leading-[1.5]",
                              isActive
                                ? "bg-mes-bg-brand font-medium text-white"
                                : "text-mes-gray-60 hover:bg-mes-gray-120"
                            )}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-stretch">
        <button
          type="button"
          onClick={onManualClick}
          className="flex flex-1 items-center justify-center border-r border-mes-gray-120 py-4 text-[14px] font-medium text-white"
        >
          메뉴얼
        </button>
        <button
          type="button"
          onClick={onLogoutClick}
          className="flex flex-1 items-center justify-center py-4 text-[14px] font-medium text-white"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

/** "MES 설정" 항목용 판단 아이콘 — 실제 톱니바퀴 벡터 export 전까지 lucide-react 임시 사용 */
function SidebarSettingsIcon({ size = 20 }: { size?: number }) {
  return <Settings size={size} />;
}

export { Sidebar, SidebarSettingsIcon };
