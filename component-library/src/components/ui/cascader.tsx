"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface CascaderItem { id: string; label: string }
export interface CascaderGroup { id: string; label: string; items: CascaderItem[] }
export interface CascaderValue { groupId: string; itemId: string }
export interface CascaderProps {
  groups: CascaderGroup[];
  value?: CascaderValue;
  defaultValue?: CascaderValue;
  onValueChange?: (value: CascaderValue) => void;
  className?: string;
}

/** 두 단계의 서로 종속된 선택에만 사용한다. 더 깊은 구조는 TreeSelect를 사용한다. */
export function Cascader({ groups, value, defaultValue, onValueChange, className }: CascaderProps) {
  const fallback = defaultValue ?? (groups[0]?.items[0] ? { groupId: groups[0].id, itemId: groups[0].items[0].id } : { groupId: "", itemId: "" });
  const [internalValue, setInternalValue] = React.useState<CascaderValue>(fallback);
  const current = value ?? internalValue;
  const activeGroup = groups.find((group) => group.id === current.groupId) ?? groups[0];

  const select = (next: CascaderValue) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn("grid min-h-36 grid-cols-2 divide-x divide-mes-gray-30 rounded-mes-control border border-mes-gray-30", className)}>
      <div className="p-2">
        {groups.map((group) => (
          <Button key={group.id} size="small" variant={activeGroup?.id === group.id ? "opacityMain" : "lineBlacktxt"} className="mb-1 w-full justify-start" onClick={() => group.items[0] && select({ groupId: group.id, itemId: group.items[0].id })}>{group.label}</Button>
        ))}
      </div>
      <div className="p-2">
        {activeGroup?.items.map((item) => (
          <Button key={item.id} size="small" variant={current.itemId === item.id ? "opacityMain" : "lineBlacktxt"} className="mb-1 w-full justify-start" onClick={() => select({ groupId: activeGroup.id, itemId: item.id })}>{item.label}</Button>
        ))}
      </div>
    </div>
  );
}
