"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface TreeViewNode { id: string; label: React.ReactNode; children?: TreeViewNode[] }
export interface TreeViewProps { nodes: TreeViewNode[]; defaultExpandedIds?: string[]; onNodeClick?: (id: string) => void; className?: string }

/** 읽기·탐색 목적의 계층이다. 선택값 제출이 필요하면 TreeSelect를 사용한다. */
export function TreeView({ nodes, defaultExpandedIds = [], onNodeClick, className }: TreeViewProps) {
  const [expanded, setExpanded] = React.useState(defaultExpandedIds);
  const renderNodes = (items: TreeViewNode[], depth = 0): React.ReactNode => items.map((node) => {
    const isExpanded = expanded.includes(node.id);
    return (
      <div key={node.id} style={{ marginLeft: depth * 16 }}>
        {node.children?.length ? (
          <Button size="xsmall" variant="lineBlacktxt" className="mb-1 justify-start" onClick={() => { setExpanded((current) => isExpanded ? current.filter((id) => id !== node.id) : [...current, node.id]); onNodeClick?.(node.id); }}>{isExpanded ? "−" : "+"} {node.label}</Button>
        ) : (
          <Button type="button" size="xsmall" variant="lineBlacktxt" className="mb-1 min-h-6 border-0 px-2 text-left text-[13px] text-mes-gray-100" onClick={() => onNodeClick?.(node.id)}>{node.label}</Button>
        )}
        {node.children?.length && isExpanded ? <div className="border-l border-mes-gray-30 pl-1">{renderNodes(node.children, depth + 1)}</div> : null}
      </div>
    );
  });
  return <div className={cn("text-[13px] text-mes-gray-100", className)}>{renderNodes(nodes)}</div>;
}
