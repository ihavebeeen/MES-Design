"use client";

import * as React from "react";
import { IconExclamationCircle } from "@/components/icons";
import { BeforeAfterComparison } from "@/components/ui/before-after-comparison";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export interface ProductionQuantityReregistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReregister?: () => void;
}

const metrics = [
  { key: "good", label: "양품수량" },
  { key: "defect", label: "불량수량" },
  { key: "total", label: "총 생산수량" },
];

const snapshots = [
  { id: "before", label: "기존", values: { good: "20,000", defect: "1,000", total: "21,000" } },
  { id: "after", label: "변경", values: { good: "30,000", defect: "1,000", total: "31,000" }, emphasized: true },
];

export function ProductionQuantityReregistrationDialog({ open, onOpenChange, onReregister }: ProductionQuantityReregistrationDialogProps) {
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);
  const reregister = React.useCallback(() => {
    onReregister?.();
    onOpenChange(false);
  }, [onOpenChange, onReregister]);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="알림"
      heading="총 생산수량이 변경되었습니다."
      className="!w-[490px]"
      footer={
        <div className="flex h-20 w-full shrink-0 items-center justify-center gap-[10px] p-5">
          <Button size="basic" variant="fillGray" className="w-40" onClick={close}>닫기</Button>
          <Button size="basic" variant="fillBlack" className="w-40" onClick={reregister}>투입품목 재등록</Button>
        </div>
      }
    >
      <div className="flex h-[210px] w-full shrink-0 flex-col gap-6 px-8 pb-[10px] pt-5" data-production-quantity-comparison>
        <div className="flex h-[66px] shrink-0 items-center gap-5">
          <IconExclamationCircle size={44} className="shrink-0 text-mes-yellow-40" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[16px] font-semibold leading-[1.5] text-mes-gray-130">총 생산수량이 변경되었습니다.</p>
            <p className="text-[16px] font-medium leading-normal text-[#696f83] opacity-80">
              변경 수량 기준으로 투입품목을 다시 반영할까요?<br />
              취소하면 기존 정보가 유지됩니다.
            </p>
          </div>
        </div>
        <BeforeAfterComparison metrics={metrics} snapshots={snapshots} className="h-[90px] shrink-0" />
      </div>
    </ConfirmDialog>
  );
}
