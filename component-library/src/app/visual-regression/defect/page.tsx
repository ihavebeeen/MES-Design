"use client";

import { PopupRenderer } from "@/components/patterns/completed-popup-patterns";

export default function DefectVisualRegressionPage() {
  return (
    <main data-visual-test="defect-popup" className="min-h-screen bg-mes-gray-20">
      <PopupRenderer kind="defect" open onOpenChange={() => undefined} />
    </main>
  );
}
