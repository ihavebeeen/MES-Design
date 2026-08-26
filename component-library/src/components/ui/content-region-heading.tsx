import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContentRegionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3";
}

/** 단일 테이블·리스트·작업영역의 이름을 배경이나 테두리 없이 표시한다. */
function ContentRegionHeading({ as: Component = "h2", className, ...props }: ContentRegionHeadingProps) {
  return (
    <Component
      className={cn("text-[16px] font-bold leading-6 text-mes-gray-130", className)}
      {...props}
    />
  );
}

export { ContentRegionHeading };
