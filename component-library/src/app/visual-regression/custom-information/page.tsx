"use client";

import { PopupRenderer } from "@/components/patterns/completed-popup-patterns";

export default function CustomInformationVisualRegressionPage() {
  return (
    <main data-visual-test="custom-information-popup" className="min-h-screen bg-mes-gray-20">
      <PopupRenderer kind="custom" open onOpenChange={() => undefined} />
    </main>
  );
}
