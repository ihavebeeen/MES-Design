import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

export type SectionFrameDivider = "none" | "bottom" | "inline-start" | "inline-end";
export type SectionFramePadding = "standard" | "none";
export type SectionFrameBackground = "surface" | "subtle";

export interface SectionFrameProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  action?: React.ReactNode;
  divider?: SectionFrameDivider;
  padding?: SectionFramePadding;
  background?: SectionFrameBackground;
  contentClassName?: string;
}

const dividerClasses: Record<SectionFrameDivider, string> = {
  none: "",
  bottom: "border-b border-mes-gray-30",
  "inline-start": "border-l border-mes-gray-30",
  "inline-end": "border-r border-mes-gray-30",
};

/**
 * MES Section Frame.
 *
 * 섹션의 padding, divider, background만 소유한다. 업무 제목과 본문 조합은
 * 인스턴스가 주입하며 Shell의 overlay/header/footer나 고정 높이는 변경하지 않는다.
 */
function SectionFrame({
  title,
  action,
  divider = "none",
  padding = "standard",
  background = "surface",
  contentClassName,
  className,
  children,
  ...props
}: SectionFrameProps) {
  const accessibleLabel = typeof title === "string" ? title : undefined;

  return (
    <section
      aria-label={props["aria-label"] ?? accessibleLabel}
      className={cn(
        "shrink-0",
        padding === "standard" && "p-5",
        dividerClasses[divider],
        background === "surface" ? "bg-white" : "bg-mes-gray-20",
        className
      )}
      {...props}
    >
      {title !== undefined && <SectionHeader action={action} className={action ? undefined : "h-7"}>{title}</SectionHeader>}
      <div className={cn(title !== undefined && "mt-3", contentClassName)}>{children}</div>
    </section>
  );
}

export { SectionFrame };
