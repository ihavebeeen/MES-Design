"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OverflowListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[];
  maxVisible?: number;
  getKey: (item: T) => React.Key;
  renderItem: (item: T) => React.ReactNode;
}

export function OverflowList<T>({ items, maxVisible = 3, getKey, renderItem, className, ...props }: OverflowListProps<T>) {
  const [expanded, setExpanded] = React.useState(false);
  const visible = expanded ? items : items.slice(0, Math.max(0, maxVisible));
  const hiddenCount = items.length - visible.length;
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)} {...props}>
      {visible.map((item) => <Badge key={getKey(item)} variant="grayFill">{renderItem(item)}</Badge>)}
      {hiddenCount > 0 && <Button type="button" size="xsmall" variant="lineBlacktxt" onClick={() => setExpanded(true)}>+{hiddenCount} 더보기</Button>}
      {expanded && items.length > maxVisible && <Button type="button" size="xsmall" variant="lineBlacktxt" onClick={() => setExpanded(false)}>접기</Button>}
    </div>
  );
}
