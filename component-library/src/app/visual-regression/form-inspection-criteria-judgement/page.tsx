"use client";

import * as React from "react";
import { InspectionCriteriaDialog } from "@/components/patterns/inspection-criteria-pattern";
import { Button } from "@/components/ui/button";

export default function FormInspectionCriteriaJudgementVisualRegressionPage() {
  const [open, setOpen] = React.useState(true);
  return (
    <main className="p-5">
      <Button onClick={() => setOpen(true)}>팝업 다시 열기</Button>
      <InspectionCriteriaDialog open={open} onOpenChange={setOpen} title="전자접촉기 상태" mode="judgement" />
    </main>
  );
}
