import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface DialogAction {
  id: string;
  label: string;
  /** 생략 시 모달 기본 순서인 fillGray / fillBlack. 3번째부터는 fillBlack. */
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface DialogFooterProps {
  actions: DialogAction[];
  className?: string;
}

// 모달 기본 푸터: 닫기(회색) / 저장(gray130). 명시적인 variant는 항상 우선한다.
const defaultActionVariants: ButtonProps["variant"][] = ["fillGray", "fillBlack"];

/**
 * 중앙 모달과 우측 패널이 공유하는 액션 푸터.
 * 기본 조합은 닫기/저장 2개이며, 버튼 개수와 문구는 필요한 모달에서 action 데이터로
 * 명시적으로 바꿀 수 있다. 메인 리스트 우하단 액션은 MainListFooterActions를 사용한다.
 */
function DialogFooter({ actions, className }: DialogFooterProps) {
  if (actions.length === 0) return null;

  return (
    <div className={cn("flex w-full shrink-0 items-center justify-center py-4", className)}>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {actions.map((action, index) => (
          <Button
            key={action.id}
            variant={action.variant ?? defaultActionVariants[index] ?? "fillBlack"}
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
