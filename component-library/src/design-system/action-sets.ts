import type { DialogAction } from "@/components/ui/dialog-footer";

export type DialogActionSetId =
  | "action-set.none"
  | "action-set.confirm-only"
  | "action-set.save-only"
  | "action-set.cancel-save"
  | "action-set.cancel-confirm"
  | "action-set.cancel-input"
  | "action-set.close-only"
  | "action-set.cancel-select"
  | "action-set.close-reregister";

export interface DialogActionSetHandlers {
  onDismiss?: () => void;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  pending?: boolean;
}

const actionSetLabels: Record<DialogActionSetId, string[]> = {
  "action-set.none": [],
  "action-set.confirm-only": ["확인"],
  "action-set.save-only": ["저장"],
  "action-set.cancel-save": ["취소", "저장"],
  "action-set.cancel-confirm": ["취소", "확인"],
  "action-set.cancel-input": ["취소", "입력"],
  "action-set.close-only": ["닫기"],
  "action-set.cancel-select": ["취소", "선택"],
  "action-set.close-reregister": ["닫기", "투입품목 재등록"],
};

/** 의미 기반 ActionSet을 DialogFooter가 소비하는 action 배열로 변환한다. */
export function createDialogActionSet(id: DialogActionSetId, handlers: DialogActionSetHandlers = {}): DialogAction[] {
  const labels = actionSetLabels[id];
  if (id === "action-set.none") return [];
  if (labels.length === 1) {
    const closes = id === "action-set.close-only";
    return [{
      id: closes ? "cancel" : "primary",
      label: labels[0],
      variant: "fillBlack",
      disabled: handlers.primaryDisabled || handlers.pending,
      onClick: closes ? handlers.onDismiss : handlers.onPrimary,
    }];
  }
  return [
    { id: "cancel", label: labels[0], variant: "fillGray", onClick: handlers.onDismiss },
    { id: "primary", label: labels[1], variant: "fillBlack", disabled: handlers.primaryDisabled || handlers.pending, onClick: handlers.onPrimary },
  ];
}
