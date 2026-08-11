"use client";

import { PopupRenderer } from "@/components/patterns/completed-popup-patterns";

export default function ProductionResultVisualRegressionPage() {
  return (
    <main data-visual-test="production-result-popup" className="min-h-screen bg-mes-gray-20">
      <PopupRenderer kind="production" open onOpenChange={() => undefined} />
    </main>
  );
}
