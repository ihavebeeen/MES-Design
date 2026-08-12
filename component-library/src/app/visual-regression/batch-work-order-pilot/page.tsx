"use client";

import { PopupRenderer } from "@/components/patterns/completed-popup-patterns";

export default function BatchWorkOrderPilotVisualRegressionPage() {
  return (
    <main data-visual-test="batch-work-order-pilot" className="min-h-screen bg-mes-gray-20">
      <PopupRenderer kind="lookup" open onOpenChange={() => undefined} />
    </main>
  );
}
