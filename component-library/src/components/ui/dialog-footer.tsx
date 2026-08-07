import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface DialogAction {
  id: string;
  label: string;
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface DialogFooterProps {
  actions: DialogAction[];
  className?: string;
}

/**
 * 중앙 모달과 우측 패널이 공유하는 액션 푸터.
 * 완성 화면 node 20274:73333에서 0·1·2·3개 액션과 79/125/160/200/360px 폭이
 * 함께 확인되어, 버튼 개수와 폭을 모달 컨테이너에 고정하지 않고 action 데이터로 받는다.
 */
function DialogFooter({ actions, className }: DialogFooterProps) {
  if (actions.length === 0) return null;

  return (
    <div className={cn("flex w-full shrink-0 items-center justify-center py-4", className)}>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant ?? "fillBlack"}
            size="basic"
            disabled={action.disabled}
            className={cn("w-[160px]", action.className)}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export { DialogFooter };
