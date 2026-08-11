"use client";

import * as React from "react";
import { ProductionQuantityReregistrationDialog } from "@/components/patterns/production-quantity-reregistration-pattern";
import { Button } from "@/components/ui/button";

export default function ProductionQuantityReregistrationVisualRegressionPage() {
  const [open, setOpen] = React.useState(true);
  const [requested, setRequested] = React.useState(false);
  return (
    <main className="p-5">
      <Button onClick={() => { setRequested(false); setOpen(true); }}>팝업 다시 열기</Button>
      {requested && <p role="status">투입품목 설정/조회 열기 요청됨</p>}
      <ProductionQuantityReregistrationDialog open={open} onOpenChange={setOpen} onReregister={() => setRequested(true)} />
    </main>
  );
}
