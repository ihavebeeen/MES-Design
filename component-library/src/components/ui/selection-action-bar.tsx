"use client";

import { Button } from "./button";

export interface SelectionActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onMove: () => void;
  onClear: () => void;
  className?: string;
}

/** Figma node 17702:49441의 표 선택 후 플로팅 액션 바. */
function SelectionActionBar({ selectedCount, onDelete, onMove, onClear, className }: SelectionActionBarProps) {
  if (selectedCount < 1) return null;
  return (
    <div className={`flex h-[46px] items-center gap-6 rounded-full border border-mes-gray-30 bg-white px-6 shadow-[0_0_12px_rgba(0,0,0,0.2)] ${className ?? ""}`}>
      <span className="whitespace-nowrap text-[14px] font-medium">{selectedCount}개 선택됨</span>
      <span className="h-4 w-px bg-mes-gray-30" />
      <div className="flex gap-4">
        <Button size="toolbar" variant="softDanger" className="w-20" onClick={onDelete}>삭제</Button>
        <Button size="toolbar" variant="softMain" className="w-20" onClick={onMove}>이동</Button>
      </div>
      <span className="h-4 w-px bg-mes-gray-30" />
      <button type="button" onClick={onClear} className="whitespace-nowrap text-[12px] text-mes-gray-60 underline">선택 초기화</button>
    </div>
  );
}

export { SelectionActionBar };
