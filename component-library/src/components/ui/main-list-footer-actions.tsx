import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface MainListFooterAction {
  id: string;
  label: string;
  /** 생략 시 우하단 액션의 기존 순서인 fillBlack / fillMain / fillGray. */
  variant?: ButtonProps["variant"];
  startIcon?: ButtonProps["startIcon"];
  endIcon?: ButtonProps["endIcon"];
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface MainListFooterActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: MainListFooterAction[];
}

const defaultActionVariants: ButtonProps["variant"][] = ["fillBlack", "fillMain", "fillGray"];

/**
 * 메인 리스트 하단 바의 우측 액션 묶음.
 * DialogFooter와 달리 32px small 버튼을 사용하며 모달의 가운데 정렬·세로 여백을 소유하지 않는다.
 */
function MainListFooterActions({ actions, className, ...props }: MainListFooterActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className={cn("flex items-center justify-end gap-2.5", className)} {...props}>
      {actions.map((action, index) => (
        <Button
          key={action.id}
          variant={action.variant ?? defaultActionVariants[index] ?? "fillBlack"}
          size="small"
          startIcon={action.startIcon}
          endIcon={action.endIcon}
          disabled={action.disabled}
          className={cn("w-[160px]", action.className)}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

export { MainListFooterActions };
