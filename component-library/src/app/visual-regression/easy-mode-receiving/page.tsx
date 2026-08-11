"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { EasyModeReceivingDialog } from "@/components/patterns/easy-mode-receiving-pattern";

export default function EasyModeReceivingVisualRegressionPage() {
  const [open, setOpen] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  return (
    <main data-visual-test="easy-mode-receiving-popup" className="flex min-h-screen items-start p-5 bg-mes-gray-20">
      <div className="flex items-center gap-3">
        <Button variant="fillBlack" onClick={() => setOpen(true)}>팝업 다시 열기</Button>
        {saved && <span className="text-[14px] text-mes-gray-100">입고실적 저장 완료</span>}
      </div>
      <EasyModeReceivingDialog open={open} onOpenChange={setOpen} onSave={() => setSaved(true)} />
    </main>
  );
}
