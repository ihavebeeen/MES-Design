"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CloseButton } from "./icon-button";
import { Divider } from "./divider";

/**
 * MES BulkActionToolbar — Figma 디자인 없음(체크리스트 티어2 "Bulk Action Toolbar",
 * 상태 "없음" — 동시에 티어1 "Bulk Selection + Action Toolbar Grid"도 이 컴포넌트로
 * 완성됨. 후자는 "모달 내 테이블에서 체크박스 다중선택 확인됨"이라고만 적혀있고 실제
 * 액션 바 자체는 실측 안 됨).
 *
 * `table.tsx`의 `selectedIds`/`onSelectedIdsChange`로 다중 선택 자체는 이미 되고
 * 있었지만, 선택했을 때 뜨는 "N개 선택됨 + 일괄 액션" 바가 없었음 — 새 색을 만들지
 * 않고 기존 토큰만으로 판단 구현: 배경은 Button의 `fillBlack`/PageTopTab 등에서
 * 이미 쓰는 `bg-mes-gray-130`(검정에 가까운 진한 회색), 액션 버튼 사이 구분선은
 * 방금 만든 `Divider`(vertical)를 그대로 재사용, 선택 해제 버튼은 `CloseButton`
 * 재사용 — 전부 기존 컴포넌트 조합이라 새로 그린 값은 배경색 하나뿐.
 */
export interface BulkActionToolbarAction {
  label: string;
  onClick: () => void;
}

export interface BulkActionToolbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  count: number;
  /** count 뒤에 붙는 단위 텍스트 */
  unit?: string;
  onClear?: () => void;
  actions: BulkActionToolbarAction[];
}

const BulkActionToolbar = React.forwardRef<HTMLDivElement, BulkActionToolbarProps>(
  ({ className, count, unit = "선택됨", onClear, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="toolbar"
        className={cn(
          "flex w-full items-center justify-between rounded-mes-panel bg-mes-gray-130 px-4 py-2.5 text-white shadow-mes-panel",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-medium leading-[1.5]">
            {count}개 {unit}
          </span>
          {onClear && (
            <CloseButton
              variant="ghost"
              size="xsmall"
              aria-label="선택 해제"
              onClick={onClear}
              className="text-mes-gray-60 hover:bg-white/10 hover:text-white"
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          {actions.map((action, i) => (
            <React.Fragment key={action.label}>
              {i > 0 && <Divider orientation="vertical" className="h-4 bg-mes-gray-100" />}
              <button
                type="button"
                onClick={action.onClick}
                className="text-[14px] font-medium leading-[1.5] text-white hover:text-mes-gray-30"
              >
                {action.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);
BulkActionToolbar.displayName = "BulkActionToolbar";

export { BulkActionToolbar };
