"use client";

import { PopupRenderer } from "@/components/patterns/completed-popup-patterns";

export default function InspectionVisualRegressionPage() {
  return (
    <main data-visual-test="inspection-popup" className="min-h-screen bg-mes-gray-20">
      <PopupRenderer kind="inspection" open onOpenChange={() => undefined} />
    </main>
  );
}
