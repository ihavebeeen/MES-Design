"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { IconGroupDown } from "../icons/icon-group-down";
import { IconArrow } from "../icons/icon-arrow";
import { IconX } from "../icons/icon-x";

/**
 * MES GroupQuery (그룹화 조회) — 담당자가 첨부한 실제 화면 스크린샷("생산지시") 기반 구현
 *
 * 출처: 체크리스트에 없던 컴포넌트. 담당자가 "필터 왼쪽에 있는 그룹화 조회, 이거는
 * 컴포넌트가 없더라고. 이거 사진 기반으로 만들어줘"라고 스크린샷으로만 전달 — 이번 건은
 * Figma 링크 없이 스크린샷 육안 대조 기반 판단값으로 구현(프로젝트 관례상 "없음" 컴포넌트 처리).
 *
 * ⚠ 다만 우연히, 같은 시점에 담당자가 "빠른 조회" 참고용으로 준 Figma 링크
 * (node 17360:46222, fileKey F4n5Zr04PAbiRjfIFQAo6v)를 `get_design_context`로 조회하는
 * 과정에서, 그 섹션 안에 "그룹화 조회" 트리거 UI 자체도 실측 노드로 포함되어 있는 걸
 * 확인함(node 17360:46223 하위 17360:46226~46247, "Frame 2085674216"). 스크린샷과 레이아웃/
 * 텍스트/칩 스타일이 정확히 일치해 이 실측값을 그대로 채택함 — 단, 담당자가 이 컴포넌트
 * 전용으로 링크를 지정해준 건 아니라서(빠른 조회 조사 중 부수적으로 발견) 문서상으로는
 * "스크린샷 기반 판단값" 딱지를 유지하되, 색상/치수는 실측값을 씀.
 *
 * ── 1. 레이아웃(실측: node 17360:46226) ───────────────────────────
 * 전체 박스: 테두리 1px Gray-30, radius 4px, 높이 32px(고정), overflow-clip.
 * - 맨 앞 셀: 아이콘(`mes/icon-group-down`, 16px) + gap 6px + "그룹화 조회" 라벨(14px Medium
 *   Gray-130) — 클릭 트리거 아님, 고정 라벨. 우측 테두리(구분선) 1px Gray-30.
 * - Level 1~3 셀(반복): 라벨("Level N", 14px Medium Gray-70) + gap(값 영역) 8px, 좌우
 *   padding 12px. 값이 선택된 경우 filter-tag-item과 동일한 칩(bg Primary-20/border
 *   Primary-30/radius 3px/높이 22px, 텍스트 13px Medium Primary-60) + X(제거, 12px) 노출.
 *   값이 없으면("전체") 칩 없이 평문 텍스트(14px Regular Gray-130)만 노출. 칩 유무와 무관하게
 *   맨 끝에 화살표(`mes/icon-arrow`, 12px, 드롭다운 토글) 배치. Level 1·2엔 우측 구분선 있음,
 *   마지막 Level엔 없음(원본 그대로).
 *
 * ── 2. 스크린샷에만 있고 이 노드엔 없던 부분(판단값) ────────────────
 * - 드롭다운 목록(전체/지시일/근무조/설비/공정/담당기사/품목코드/품목명/품목구분) 자체는
 *   이 실측 프레임에 포함돼 있지 않아 목록 스타일은 Select 패널 관례(rounded-mes-panel,
 *   shadow-mes-panel, 항목 hover bg-mes-bg-subtle) 그대로 재사용해 판단 구현.
 * - "전체" 선택 시 칩이 사라지고 평문 텍스트만 남는 것으로 처리(Level 3 예시가 실제로 이
 *   상태였음 — 실측 근거 있음). X 버튼은 값이 있을 때만 노출(전체 상태엔 지울 게 없으므로).
 * - 화살표 회전(펼침/접힘) 애니메이션은 정적 스크린샷엔 없는 인터랙션이라, Sidebar의 기존
 *   회전 컨벤션(`isExpanded ? "rotate-90" : "-rotate-90"`)을 그대로 재사용해 통일함.
 *
 * ── 3. 우측 "필터 추가" 박스는 별도 컴포넌트 ─────────────────────────
 * 스크린샷/실측 모두에서 그룹화 조회 박스 바로 옆(gap 10px)에 붙어있는 "+필터 추가" 박스는
 * 기존에 이미 구현된 `Filter`(filter.tsx, Figma data-name "fillter-group"와 일치)와
 * 완전히 동일한 컴포넌트라 새로 만들지 않음 — 데모에서 `<GroupQuery>` 옆에 `<Filter>`를
 * 나란히 배치해 재현함.
 *
 * ── 4. 2026-08-03 너비 버그 수정(QuickQuery에서 먼저 발견, 방어적으로 여기도 적용) ──
 * `flex-col` 부모(데모 페이지의 각 섹션)의 직계 자식으로 배치되면, flexbox
 * `align-items: stretch` 기본값 때문에 이 컴포넌트의 루트 div(테두리 있음)가 실제 내용
 * 폭과 무관하게 부모 폭(섹션 최대 960px)까지 늘어나 보이는 문제가 있었음 — `inline-flex`는
 * "내부 자식 배치"만 영향을 주지 "이 요소 자체가 flex item으로서 부모에게 늘어나 보이는지"는
 * 별개 문제라 `inline-flex`만으로는 안 막힘. `self-start`(+`shrink-0`)를 루트에 추가해
 * 항상 내용 폭만큼만 차지하도록 고정.
 */

export interface GroupQueryOption {
  id: string;
  label: string;
}

export interface GroupQueryProps {
  /** 그룹화 가능한 필드 목록(전체 포함) — 전체 Level 공통 옵션 풀 */
  options: GroupQueryOption[];
  /** Level 1~N 각각의 현재 선택값(옵션 id). null이면 "전체"(미지정) */
  levels: (string | null)[];
  onLevelChange: (levelIndex: number, value: string | null) => void;
  className?: string;
}

function GroupQueryLevelCell({
  index,
  value,
  options,
  onChange,
  showDivider,
}: {
  index: number;
  value: string | null;
  options: GroupQueryOption[];
  onChange: (value: string | null) => void;
  showDivider: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.id === value) ?? null;

  return (
    <div
      className={cn(
        "flex h-full items-center",
        showDivider && "border-r border-mes-border-default"
      )}
    >
      <div className="flex h-full items-center justify-center px-3">
        <span className="whitespace-nowrap text-[14px] font-medium text-mes-gray-70">
          {`Level ${index + 1}`}
        </span>
      </div>
      <div className="flex h-full items-center gap-2 pr-3">
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger asChild>
            <button type="button" className="flex items-center gap-2">
              {selected ? (
                <span className="inline-flex h-[22px] items-center gap-[3px] rounded-mes-control-sm border border-mes-primary-30 bg-mes-bg-brand-subtle-strong py-px pl-2 pr-[3px] text-[13px] font-medium text-mes-text-brand">
                  {selected.label}
                  <span
                    role="button"
                    aria-label="선택 해제"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(null);
                    }}
                    className="inline-flex shrink-0 items-center justify-center p-[5px] text-mes-text-brand"
                  >
                    <IconX size={12} />
                  </span>
                </span>
              ) : (
                <span className="whitespace-nowrap text-[14px] font-normal text-mes-text-default">
                  전체
                </span>
              )}
              <IconArrow
                size={12}
                className={cn(
                  "shrink-0 text-mes-gray-70 transition-transform",
                  open ? "rotate-90" : "-rotate-90"
                )}
              />
            </button>
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              sideOffset={4}
              className="z-50 flex max-h-[280px] w-[160px] flex-col gap-0.5 overflow-y-auto rounded-mes-panel border border-mes-border-default bg-white p-2 shadow-mes-panel"
            >
              {options.map((option) => {
                const isSelected = option.id === value || (option.id === "all" && value === null);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id === "all" ? null : option.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-mes-control px-2 py-[5px] text-left text-[13px] leading-[1.5] text-mes-text-default",
                      isSelected ? "bg-[#e8f0fe]" : "hover:bg-mes-bg-subtle"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </div>
    </div>
  );
}

function GroupQuery({ options, levels, onLevelChange, className }: GroupQueryProps) {
  return (
    <div
      className={cn(
        "inline-flex h-8 shrink-0 items-center self-start overflow-clip rounded-mes-control border border-mes-border-default",
        className
      )}
    >
      <div className="flex h-full items-center gap-[6px] border-r border-mes-border-default px-3">
        <IconGroupDown size={16} className="shrink-0 text-mes-text-default" />
        <span className="whitespace-nowrap text-[14px] font-medium text-mes-text-default">
          그룹화 조회
        </span>
      </div>
      {levels.map((value, index) => (
        <GroupQueryLevelCell
          key={index}
          index={index}
          value={value}
          options={options}
          onChange={(v) => onLevelChange(index, v)}
          showDivider={index < levels.length - 1}
        />
      ))}
    </div>
  );
}

export { GroupQuery };
