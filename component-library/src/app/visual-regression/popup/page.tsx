"use client";

import { PopupRenderer } from "@/components/patterns/completed-popup-patterns";

export default function PopupVisualRegressionPage() {
  return (
    <main data-visual-test="popup" className="min-h-screen bg-mes-gray-20">
      <PopupRenderer kind="material-input-setup" open onOpenChange={() => undefined} />
    </main>
  );
}
