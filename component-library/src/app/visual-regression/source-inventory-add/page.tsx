"use client";

import { ExactInventoryAddContent } from "@/components/patterns/exact-inventory-add-modal";
import { CenterModal } from "@/components/ui/center-modal";

export default function SourceInventoryAddVisualRegressionPage() {
  return (
    <main data-visual-test="source-inventory-add" className="min-h-screen bg-mes-gray-20">
      <CenterModal
        open
        onOpenChange={() => undefined}
        title="재고 추가"
        size="wide-1400"
        className="!h-[655px] !max-w-[1280px]"
        confirmLabel="저장"
        contentClassName="items-stretch !overflow-y-hidden p-0"
      >
        <ExactInventoryAddContent />
      </CenterModal>
    </main>
  );
}
