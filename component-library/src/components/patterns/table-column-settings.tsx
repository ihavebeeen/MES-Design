"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { Tag } from "@/components/ui/tag";
import { IconCalculator, IconDragHandle, IconEyeMono, IconReload } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface TableColumnSettingItem {
  id: string;
  label: string;
  visible: boolean;
  summarized: boolean;
  grouped?: boolean;
}

export interface TableColumnSettingsProps {
  columns: TableColumnSettingItem[];
  onColumnsChange: (columns: TableColumnSettingItem[]) => void;
  onReset?: () => void;
  onCancel?: () => void;
  onApply?: () => void;
  onClose?: () => void;
  className?: string;
}

/**
 * 완성 화면 node 11210:55894의 460×412 테이블 컬럼 설정 오버레이.
 * 원본의 42px 헤더, 6개 행, 64px 푸터와 표시/합계 토글 배치를 그대로 유지한다.
 */
function TableColumnSettings({
  columns,
  onColumnsChange,
  onReset,
  onCancel,
  onApply,
  onClose,
  className,
}: TableColumnSettingsProps) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const visibleCount = columns.filter((column) => column.visible).length;
  const summarizedCount = columns.filter((column) => column.summarized).length;

  const updateColumn = (id: string, patch: Partial<TableColumnSettingItem>) => {
    onColumnsChange(columns.map((column) => (column.id === id ? { ...column, ...patch } : column)));
  };

  const moveColumn = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const next = [...columns];
    const from = next.findIndex((column) => column.id === draggedId);
    const to = next.findIndex((column) => column.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onColumnsChange(next);
  };

  return (
    <section
      aria-label="테이블 컬럼 설정"
      className={cn(
        "flex h-[412px] w-[460px] flex-col overflow-hidden rounded-lg border border-mes-gray-30 bg-white shadow-mes-panel",
        className
      )}
    >
      <header className="flex h-[42px] shrink-0 items-center border-b border-mes-gray-30 pl-4 pr-2.5">
        <h3 className="shrink-0 text-[15px] font-bold text-mes-gray-130">테이블 컬럼 설정</h3>
        <div className="ml-3 flex h-[24px] items-center gap-2 rounded-[4px] bg-mes-gray-20 px-2 text-[12px] font-semibold text-mes-gray-80">
          <span className="flex items-center gap-1"><IconEyeMono size={14} />표시 {visibleCount}</span>
          <span className="h-3 w-px bg-mes-gray-40" />
          <span className="flex items-center gap-1"><IconCalculator size={14} />합계 {summarizedCount}</span>
        </div>
        <CloseButton onClick={onClose} className="ml-auto text-mes-gray-100" />
      </header>

      <div className="flex h-[306px] shrink-0 flex-col gap-2 px-4 py-4">
        {columns.slice(0, 6).map((column) => (
          <div
            key={column.id}
            draggable
            onDragStart={() => setDraggedId(column.id)}
            onDragEnd={() => setDraggedId(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => moveColumn(column.id)}
            className={cn(
              "flex h-[39px] shrink-0 cursor-grab items-center rounded-mes-control bg-mes-gray-20 pr-2.5 active:cursor-grabbing",
              draggedId === column.id && "border-mes-primary-60 bg-mes-primary-10 opacity-70"
            )}
          >
            <span className="flex w-11 shrink-0 items-center justify-center"><IconDragHandle size={20} /></span>
            <span className="min-w-0 truncate text-[13px] font-medium text-mes-gray-130">{column.label}</span>
            {column.grouped && <Tag color="opacityMain" size="compact" className="ml-2">사용자 추가</Tag>}
            <div className="ml-auto flex items-center gap-3">
              <label className="flex w-[71px] items-center justify-end gap-2 text-[12px] text-mes-gray-80">
                표시
                <Switch
                  checked={column.visible}
                  aria-label={`${column.label} 표시`}
                  onChange={(event) => updateColumn(column.id, { visible: event.target.checked })}
                />
              </label>
              <span className="h-[14px] w-px bg-mes-gray-30" />
              <label className="flex w-[71px] items-center justify-end gap-2 text-[12px] text-mes-gray-80">
                합계
                <Switch
                  checked={column.summarized}
                  aria-label={`${column.label} 합계`}
                  onChange={(event) => updateColumn(column.id, { summarized: event.target.checked })}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <footer className="flex h-16 shrink-0 items-center border-t border-mes-gray-30 px-4">
        <Button variant="lineBlacktxt" size="small" className="w-[79px]" startIcon={<IconReload size={16} />} onClick={onReset}>초기화</Button>
        <div className="ml-auto flex gap-2.5">
          <Button variant="fillGray" size="small" className="w-[125px]" onClick={onCancel}>취소</Button>
          <Button variant="fillBlack" size="small" className="w-[125px]" onClick={onApply}>적용</Button>
        </div>
      </footer>
    </section>
  );
}

export { TableColumnSettings };
