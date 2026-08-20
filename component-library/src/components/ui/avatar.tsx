import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  initials?: string;
  size?: "small" | "medium" | "large";
  status?: "online" | "offline";
}

const sizes = { small: "size-6 text-[10px]", medium: "size-8 text-[11px]", large: "size-10 text-[13px]" };

export function Avatar({ name, initials, size = "medium", status, className, ...props }: AvatarProps) {
  const fallback = initials ?? name.replace(/\s/g, "").slice(0, 2);
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center rounded-full bg-mes-gray-110 font-semibold text-white", sizes[size], className)}
      role="img"
      aria-label={`${name}${status ? `, ${status === "online" ? "온라인" : "오프라인"}` : ""}`}
      {...props}
    >
      {fallback}
      {status && <span aria-hidden className={cn("absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white", status === "online" ? "bg-mes-primary-60" : "bg-mes-gray-50")} />}
    </span>
  );
}
