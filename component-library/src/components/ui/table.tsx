"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { IconArrow } from "../icons/icon-arrow";

/**
 * MES Table (표) — Figma 실측 기반, 원본+수정본 2개 노드 대조
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v)
 * - 원본: node 9873:83780("Table") — Header/Body 상태별 매트릭스 정의부
 * - 수정본(실제 화면): node 16938:42501("생산계획(일) 리스트") — 담당자가 "테이블 디자인
 *   수정"으로 지목한 실제 사용 화면. 화면 인스턴스라 오버라이드 가능성이 있어, 표에서
 *   반복되는 패턴(헤더/그룹행/일반행/선택행/신규행/총계행)만 구조로 뽑고, 이 화면 고유의
 *   비즈니스 컬럼(지시일/근무조/설비 등)은 데모 페이지 쪽 데이터로 분리함 — 컴포넌트
 *   자체는 columns prop으로 어떤 표에도 재사용 가능하게 일반화.
 *
 * ── 1. 담당자가 지적한 수정본과 원본의 차이(실측으로 확인) ─────────
 * - 헤더 배경에 색 추가: Gray-10(#F8FAFC) — 원본엔 없던 배경색(재확인 필요하나 수정본
 *   기준 확정 채택)
 * - 세로 구분선 추가: 각 셀 우측에 점선(border-dashed) 1px, 기본 Gray-40(#D7DCE5)
 * - "이번 세션에서 추가된 정보"에 빨간 점(6x6 Ellipse, node 17061:41475) — 벡터라 정확한
 *   hex는 get_variable_defs로도 못 뽑았고(바인딩된 변수 없음), 스크린샷 기준 Danger-60
 *   (#F04452)으로 판단(다른 곳의 "system-red60" 참조와 시각적으로 일치)
 * - 강조행(선택됨/신규) 구분선이 기본 Gray-40보다 한 단계 진한 Gray-30(#E4E7EE)으로
 *   바뀜을 3개 행 실측 대조로 확인: 선택행(bg Primary-20)·신규행(빨간점) 둘 다 Gray-30,
 *   일반행만 Gray-40 — 담당자가 언급 안 한 부분이지만 실측 중 발견해 반영
 *
 * ── 2. 공통 실측값 ──────────────────────────────────────────────
 * - 행 높이 30px(헤더/그룹행/일반행/총계행 전부 동일), 각 행 좌우 padding 20px
 * - 체크박스 칼럼: 체크박스 24px + 우측 padding 12px, 이후 첫 데이터 컬럼 시작
 * - 헤더 텍스트: Pretendard SemiBold 13px, 중앙정렬, Gray-130, border-b Gray-30
 * - 일반 셀 텍스트: Pretendard Regular 14px, Gray-130(숫자류는 우측정렬, 텍스트류는
 *   좌측/중앙 혼재 — 컬럼별로 다름, align prop으로 개별 지정)
 * - 링크형 셀(품목명/투입/라벨정보 등): Primary-60, 링크는 Regular 14px 밑줄, 액션형
 *   링크(투입정보/LOT조회)는 SemiBold 13px 밑줄로 서로 다름 — render prop으로 개별 처리
 * - 그룹행: 배경 `#fde9ea`(연한 핑크, 확정 팔레트 밖 — 팔레트에 편입 안 하고 원본값 유지),
 *   좌측 펼침/접힘 화살표(mes/icon-arrow 회전) + 그룹 라벨(Medium 14px), 그룹별 집계값은
 *   해당 컬럼에 SemiBold 14px 우측정렬로 표시(집계 없는 컬럼은 빈칸)
 * - 총계행: 그룹행과 동일한 값 스타일(SemiBold 우측정렬)이지만 배경은 흰색 유지
 *
 * ── 3. 체크박스 시각 차이(사소한 불일치, 판단으로 흡수) ───────────
 * Figma 원본의 표 전용 체크박스 아이콘("mes/icon-checkcyc")은 미선택 상태가 Gray-50
 * 채움 사각형인데, 기존에 실측 완성해둔 `Checkbox` 컴포넌트(checkbox.tsx)의 미선택
 * 상태는 흰 배경+Gray-40 테두리라 살짝 다름. 체크됨(검정) 상태는 완전히 일치(Gray-130
 * 채움) — 새로 컴포넌트를 안 만들고 기존 Checkbox를 그대로 재사용함(중복 구현 방지
 * 우선), 미선택 상태 불일치는 체크리스트에 등록.
 *
 * ── 4. 아직 미확인 (다음 라운드) ──────────────────────────────────
 * - 원본에 있던 "기본-disable", "분할", "분할-disable" 변형(node 9873:83780 하위, y=203/
 *   282/360 섹션)은 이번 라운드에서 미실측 — disabled prop은 opacity 처리로 임시 구현
 * - 그룹행에 보였던 몇몇 빈 칸(Danger-60 색 빈 텍스트 placeholder)이 실제로 조건부
 *   경고 표시용인지 단순 미사용 잔재인지 불명 — 이번엔 반영 안 함
 */

export interface TableColumn<T> {
  key: string;
  label: string;
  width: number;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
}

export interface TableRowData<T> {
  id: string;
  data: T;
  /** 이번 세션(또는 최근)에 추가/변경된 행 — 좌측에 빨간 점 + 진한 구분선 */
  isNew?: boolean;
  disabled?: boolean;
}

export interface TableGroup<T> {
  id: string;
  label: string;
  /** 컬럼 key별 집계값(합계 등). 없는 컬럼은 빈칸 */
  summary?: Record<string, React.ReactNode>;
  rows: TableRowData<T>[];
  defaultExpanded?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  groups?: TableGroup<T>[];
  rows?: TableRowData<T>[];
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  totals?: Record<string, React.ReactNode>;
  className?: string;
}

function Cell({
  column,
  children,
  className,
}: {
  column: { width: number; align?: "left" | "center" | "right" };
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ width: column.width }}
      className={cn(
        "flex h-full shrink-0 items-center px-[6px]",
        column.align === "center" && "justify-center text-center",
        column.align === "right" && "justify-end text-right",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 아래 3개(DataRow/GroupHeaderRow/TotalsRow)는 원래 Table() 내부에 클로저로 선언했었으나,
 * eslint react-hooks/static-components("Cannot create components during render")에 걸려
 * 모듈 스코프로 끌어올림 — 필요한 값은 전부 명시적 prop으로 전달.
 */
function DataRow<T>({
  row,
  columns,
  isSelected,
  onToggle,
}: {
  row: TableRowData<T>;
  columns: TableColumn<T>[];
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  const dividerColor = isSelected || row.isNew ? "border-mes-gray-30" : "border-mes-gray-40";
  return (
    <div
      className={cn(
        "relative flex h-[30px] shrink-0 items-center border-b border-solid border-mes-gray-30 px-[20px]",
        isSelected ? "bg-mes-primary-20" : "bg-white",
        row.disabled && "pointer-events-none opacity-50"
      )}
    >
      {row.isNew && (
        <span
          aria-hidden
          className="absolute left-[13px] top-1/2 size-[6px] -translate-y-1/2 rounded-full bg-mes-danger-60"
        />
      )}
      <div className="flex h-full shrink-0 items-center pr-[12px]">
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(row.id)}
          color="black"
          disabled={row.disabled}
        />
      </div>
      {columns.map((col, i) => (
        <Cell
          key={col.key}
          column={col}
          className={cn(
            i < columns.length - 1 && `border-r border-dashed ${dividerColor}`
          )}
        >
          <span className="w-full truncate text-[14px] leading-[1.3] text-mes-gray-130">
            {col.render ? col.render(row.data) : (row.data as Record<string, React.ReactNode>)[col.key]}
          </span>
        </Cell>
      ))}
    </div>
  );
}

function GroupHeaderRow<T>({
  group,
  columns,
  isCollapsed,
  onToggleCollapse,
}: {
  group: TableGroup<T>;
  columns: TableColumn<T>[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div className="flex h-[30px] shrink-0 items-center border-b border-solid border-[#fde9ea] bg-[#fde9ea] px-[20px]">
      <div className="flex h-full shrink-0 items-center pr-[12px]" style={{ width: 24 }} />
      <button
        type="button"
        onClick={onToggleCollapse}
        className="flex shrink-0 items-center gap-2.5 px-[12px]"
      >
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[3px] border border-mes-gray-50 bg-white">
          <IconArrow
            size={12}
            className={cn("text-mes-gray-130 transition-transform", isCollapsed ? "rotate-0" : "rotate-90")}
          />
        </span>
        <span className="whitespace-nowrap text-[14px] font-medium leading-[1.3] text-mes-gray-130">
          {group.label}
        </span>
      </button>
      {!isCollapsed &&
        columns.map((col) => (
          <Cell key={col.key} column={col}>
            {group.summary?.[col.key] !== undefined && (
              <span className="w-full truncate text-right text-[14px] font-semibold leading-[1.3] text-mes-gray-130">
                {group.summary[col.key]}
              </span>
            )}
          </Cell>
        ))}
    </div>
  );
}

function TotalsRow<T>({
  columns,
  totals,
}: {
  columns: TableColumn<T>[];
  totals?: Record<string, React.ReactNode>;
}) {
  if (!totals) return null;
  return (
    <div className="flex h-[30px] shrink-0 items-center border-b border-solid border-mes-gray-30 bg-white px-[20px]">
      <div className="flex h-full shrink-0 items-center pr-[12px]" style={{ width: 24 }} />
      <div className="flex h-full shrink-0 items-center px-[12px] text-[14px] font-semibold leading-[1.3] text-mes-gray-130">
        총계
      </div>
      {columns.map((col) => (
        <Cell key={col.key} column={col}>
          {totals[col.key] !== undefined && (
            <span className="w-full truncate text-right text-[14px] font-semibold leading-[1.3] text-mes-gray-130">
              {totals[col.key]}
            </span>
          )}
        </Cell>
      ))}
    </div>
  );
}

function Table<T>({
  columns,
  groups,
  rows,
  selectedIds = [],
  onSelectedIdsChange,
  totals,
  className,
}: TableProps<T>) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const flatRows = groups ? groups.flatMap((g) => g.rows) : rows ?? [];
  const allIds = flatRows.map((r) => r.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  const toggleAll = () => {
    if (!onSelectedIdsChange) return;
    onSelectedIdsChange(allSelected ? [] : allIds);
  };
  const toggleOne = (id: string) => {
    if (!onSelectedIdsChange) return;
    onSelectedIdsChange(
      selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]
    );
  };

  return (
    <div className={cn("w-full overflow-x-auto rounded-[4px] border border-mes-gray-30", className)}>
      <div className="min-w-max">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex h-[30px] shrink-0 items-center border-b border-solid border-mes-gray-30 bg-mes-gray-10 px-[20px]">
          <div className="flex h-full shrink-0 items-center pr-[12px]">
            <Checkbox checked={allSelected} onChange={toggleAll} color="black" />
          </div>
          {columns.map((col, i) => (
            <Cell
              key={col.key}
              column={{ ...col, align: col.align ?? "center" }}
              className={cn(i < columns.length - 1 && "border-r border-dashed border-mes-gray-40")}
            >
              <span className="w-full truncate text-[13px] font-semibold leading-[1.3] text-mes-gray-130">
                {col.label}
              </span>
            </Cell>
          ))}
        </div>

        {/* 본문: 그룹 있으면 그룹별, 없으면 플랫 */}
        {groups
          ? groups.map((group) => {
              const isCollapsed = collapsed[group.id] ?? group.defaultExpanded === false;
              return (
                <React.Fragment key={group.id}>
                  <GroupHeaderRow
                    group={group}
                    columns={columns}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() =>
                      setCollapsed((prev) => ({ ...prev, [group.id]: !isCollapsed }))
                    }
                  />
                  {!isCollapsed &&
                    group.rows.map((row) => (
                      <DataRow
                        key={row.id}
                        row={row}
                        columns={columns}
                        isSelected={selectedIds.includes(row.id)}
                        onToggle={toggleOne}
                      />
                    ))}
                </React.Fragment>
              );
            })
          : (rows ?? []).map((row) => (
              <DataRow
                key={row.id}
                row={row}
                columns={columns}
                isSelected={selectedIds.includes(row.id)}
                onToggle={toggleOne}
              />
            ))}

        <TotalsRow columns={columns} totals={totals} />
      </div>
    </div>
  );
}

export { Table };
