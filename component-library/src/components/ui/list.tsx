import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES List — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "List", 상태 "없음", 재탐색
 * 안 함 — 판단값 우선). Table의 행 스타일(hover 배경, 구분선 gray30)을 재사용한 단순
 * 세로 목록 — 표 형식이 필요 없는 단순 나열용.
 */
type ListProps = React.HTMLAttributes<HTMLUListElement>;

const List = React.forwardRef<HTMLUListElement, ListProps>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-col rounded-mes-control border border-mes-border-default", className)}
    {...props}
  />
));
List.displayName = "List";

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  onClick?: () => void;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, onClick, children, ...props }, ref) => (
    <li
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 border-b border-mes-border-default px-3 py-2 text-[13px] leading-[1.5] text-mes-text-default last:border-b-0",
        onClick && "cursor-pointer hover:bg-mes-bg-subtler",
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
);
ListItem.displayName = "ListItem";

export { List, ListItem };
export type { ListProps };
