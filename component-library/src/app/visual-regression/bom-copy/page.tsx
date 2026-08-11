"use client";

import { PopupRenderer } from "@/components/patterns/completed-popup-patterns";

export default function BomCopyVisualRegressionPage() {
  return (
    <main data-visual-test="bom-copy-popup" className="min-h-screen bg-mes-gray-20">
      <PopupRenderer kind="bom-copy" open onOpenChange={() => undefined} />
    </main>
  );
}
