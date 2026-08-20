import * as React from "react";
import { cn } from "@/lib/utils";

export interface SearchHighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  query: string;
  caseSensitive?: boolean;
  markClassName?: string;
}

export function SearchHighlight({
  text,
  query,
  caseSensitive = false,
  markClassName,
  className,
  ...props
}: SearchHighlightProps) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return <span className={className} {...props}>{text}</span>;

  const escaped = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`(${escaped})`, caseSensitive ? "g" : "gi");
  const exactMatcher = new RegExp(`^${escaped}$`, caseSensitive ? "" : "i");

  return (
    <span className={className} {...props}>
      {text.split(matcher).map((part, index) =>
        exactMatcher.test(part) ? (
          <mark key={`${part}-${index}`} className={cn("rounded-mes-control-xs bg-mes-primary-20 px-0.5 text-inherit", markClassName)}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </span>
  );
}
