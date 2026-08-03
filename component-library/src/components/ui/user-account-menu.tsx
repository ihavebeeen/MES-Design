"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DropdownMenu, type DropdownMenuItemData } from "./dropdown-menu";
import { IconUserMono } from "@/components/icons";

/**
 * MES UserAccountMenu — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "User / Account
 * Menu", 상태 "없음", 재탐색 안 함 — 판단값 우선). DropdownMenu(`dropdown-menu.tsx`)를
 * 그대로 감싸 트리거만 아바타(IconUserMono, Figma 실측 아이콘)+이름으로 특화.
 */
export interface UserAccountMenuProps {
  name: string;
  items: DropdownMenuItemData[];
  className?: string;
}

function UserAccountMenu({ name, items, className }: UserAccountMenuProps) {
  return (
    <DropdownMenu
      align="end"
      trigger={
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-mes-control px-2 py-1.5 text-[13px] font-medium text-mes-text-default hover:bg-mes-bg-subtler",
            className
          )}
        >
          <IconUserMono size={20} className="text-mes-gray-70" />
          {name}
        </button>
      }
      items={items}
    />
  );
}

export { UserAccountMenu };
