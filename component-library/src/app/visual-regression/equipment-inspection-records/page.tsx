"use client";

import { EquipmentInspectionRecordsContent } from "@/components/patterns/equipment-inspection-records-modal";
import { CenterModal } from "@/components/ui/center-modal";

export default function EquipmentInspectionRecordsVisualRegressionPage() {
  return (
    <main data-visual-test="equipment-inspection-records" className="min-h-screen bg-mes-gray-20">
      <CenterModal
        open
        onOpenChange={() => undefined}
        title="냉각기 점검표"
        size="wide-1400"
        exactWidth={1400}
        exactHeight={680}
        maxHeight="calc(100vh - 40px)"
        bodyPadding="none"
        scrollMode="content"
        bodyAlign="stretch"
        footer={<></>}
      >
        <EquipmentInspectionRecordsContent />
      </CenterModal>
    </main>
  );
}
