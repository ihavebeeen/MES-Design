"use client";

import * as React from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { cn } from "@/lib/utils";

export interface TreeSelectNode { id: string; label: string; children?: TreeSelectNode[]; disabled?: boolean }
export interface TreeSelectProps {
  nodes: TreeSelectNode[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (ids: string[]) => void;
  className?: string;
}

/** 계층을 보면서 복수 선택한다. 부모·자식 자동 전파는 하지 않으며 필요한 업무에서 호출부가 명시한다. */
export function TreeSelect({ nodes, value, defaultValue = [], onValueChange, className }: TreeSelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selected = value ?? internalValue;
  const [expanded, setExpanded] = React.useState<string[]>(() => nodes.map((node) => node.id));

  const toggleSelected = (id: string) => {
    const next = selected.includes(id) ? selected.filter((current) => current !== id) : [...selected, id];
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  const renderNodes = (items: TreeSelectNode[], depth = 0): React.ReactNode => items.map((node) => {
    const isExpanded = expanded.includes(node.id);
    return (
      <div key={node.id}>
        <div className="flex min-h-7 items-center gap-1.5" style={{ paddingLeft: depth * 16 }}>
          {node.children?.length ? (
            <Button type="button" size="xsmall" variant="lineBlacktxt" className="size-5 border-0 p-0 text-[13px] text-mes-gray-80" aria-label={`${node.label} ${isExpanded ? "접기" : "펼치기"}`} onClick={() => setExpanded((current) => isExpanded ? current.filter((id) => id !== node.id) : [...current, node.id])}>{isExpanded ? "−" : "+"}</Button>
          ) : <span className="size-5" />}
          <Checkbox size="small" color="black" checked={selected.includes(node.id)} disabled={node.disabled} onChange={() => toggleSelected(node.id)} />
          <span className="text-[13px] text-mes-gray-100">{node.label}</span>
        </div>
        {node.children?.length && isExpanded ? renderNodes(node.children, depth + 1) : null}
      </div>
    );
  });

  return <div className={cn("rounded-mes-control border border-mes-gray-30 p-3", className)}>{renderNodes(nodes)}</div>;
}
