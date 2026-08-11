"use client";

import { PopupRenderer } from "@/components/patterns/completed-popup-patterns";

export default function ReceivingPilotVisualRegressionPage() {
  return (
    <main data-visual-test="receiving-pattern-pilot" className="min-h-screen bg-mes-gray-20">
      <PopupRenderer kind="receiving" open onOpenChange={() => undefined} />
    </main>
  );
}
