"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

/**
 * MES DropdownMenu — Figma 검색에서 "필터창"/"Links container" 등 애매한 후보만 나오고
 * 명확한 전용 노드를 못 찾음(체크리스트 티어2 "Dropdown Menu", 상태 "없음", 재탐색 안
 * 함) — 판단값으로 구현. 트리거+패널은 Popover(`popover.tsx`)를 그대로 감싸고, 항목
 * 스타일은 Combobox 옵션 리스트(`combobox.tsx`)의 hover 규칙 재사용.
 */
export interface DropdownMenuItemData {
  id: string;
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactElement;
  items: DropdownMenuItemData[];
  align?: "start" | "center" | "end";
  className?: string;
}

function DropdownMenu({ trigger, items, align = "start", className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align={align} className={cn("w-[180px] p-1.5", className)}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => {
              item.onSelect?.();
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center rounded-mes-control px-2 py-[5px] text-left text-[13px] leading-[1.5] outline-none transition-colors hover:bg-mes-bg-subtle disabled:pointer-events-none disabled:text-mes-gray-40",
              item.danger ? "text-mes-text-danger" : "text-mes-text-default"
            )}
          >
            {item.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export { DropdownMenu };
