"use client";

import * as React from "react";
import componentData from "@/design-system/registry/components.json";
import { HorizontalBarChart } from "@/components/ui/analytics-charts";
import { BeforeAfterComparison } from "@/components/ui/before-after-comparison";
import { Button } from "@/components/ui/button";
import { CavityCell } from "@/components/ui/cavity-cell";
import { ContentRegionHeading } from "@/components/ui/content-region-heading";
import { DialogFooter } from "@/components/ui/dialog-footer";
import { FormFieldRow, FormGrid } from "@/components/ui/form-grid";
import { Input } from "@/components/ui/input";
import { InspectionJudgement, type InspectionJudgementValue } from "@/components/ui/inspection-judgement";
import { LabeledInput } from "@/components/ui/labeled-input";
import { LabeledSelect } from "@/components/ui/labeled-select";
import { MainListFooterActions } from "@/components/ui/main-list-footer-actions";
import { MesProductSwitcher } from "@/components/ui/mes-product-switcher";
import { QueryDateRange } from "@/components/ui/query-date-range";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeader } from "@/components/ui/section-header";
import { SelectionActionBar } from "@/components/ui/selection-action-bar";
import { getCatalogRegistryId } from "@/lib/component-catalog-data";

/** client-page에 전용 데모가 없는 레지스트리 컴포넌트만 이곳에서 실제 구현으로 렌더링한다. */
export const REGISTRY_SHOWCASE_IDS = [
  "analytics-charts",
  "before-after-comparison",
  "cavity-cell",
  "content-region-heading",
  "dialog-footer",
  "form-grid",
  "inspection-judgement",
  "labeled-input",
  "labeled-select",
  "main-list-footer-actions",
  "mes-product-switcher",
  "query-date-range",
  "section-frame",
  "section-header",
  "selection-action-bar",
] as const;

type RegistryShowcaseId = (typeof REGISTRY_SHOWCASE_IDS)[number];

const componentById = new Map(componentData.components.map((component) => [component.id, component]));

function ShowcaseDemo({ id }: { id: RegistryShowcaseId }) {
  const [product, setProduct] = React.useState<"MES" | "FEMS">("MES");
  const [judgement, setJudgement] = React.useState<InspectionJudgementValue>("pass");
  const [warehouse, setWarehouse] = React.useState("A 창고");
  const [startDate, setStartDate] = React.useState<Date | null>(new Date(2026, 7, 1));
  const [endDate, setEndDate] = React.useState<Date | null>(new Date(2026, 7, 31));

  switch (id) {
    case "analytics-charts":
      return <HorizontalBarChart labels={["압출", "성형", "검사", "포장", "출하"]} values={[120, 96, 88, 75, 68]} barValues={[120, 96, 88, 75, 68]} />;
    case "before-after-comparison":
      return <BeforeAfterComparison className="max-w-[560px]" metrics={[{ key: "quantity", label: "생산수량" }, { key: "defect", label: "불량수량" }]} snapshots={[{ id: "before", label: "변경 전", values: { quantity: "1,200", defect: "12" } }, { id: "after", label: "변경 후", values: { quantity: "1,180", defect: "8" }, emphasized: true }]} />;
    case "cavity-cell":
      return <div className="grid w-[240px] grid-cols-5 gap-1"><CavityCell value={1} /><CavityCell value={2} selected /><CavityCell value={3} /><CavityCell /><CavityCell value={5} /></div>;
    case "content-region-heading":
      return <ContentRegionHeading>품목 재고 리스트</ContentRegionHeading>;
    case "dialog-footer":
      return <DialogFooter className="rounded-mes-control border border-mes-gray-30" actions={[{ id: "cancel", label: "취소" }, { id: "save", label: "저장" }]} />;
    case "form-grid":
      return <FormGrid className="max-w-[620px]" columns={2}><FormFieldRow label="품목" required><Input defaultValue="트레이" /></FormFieldRow><FormFieldRow label="수량" required><Input type="number" defaultValue="1200" /></FormFieldRow></FormGrid>;
    case "inspection-judgement":
      return <InspectionJudgement value={judgement} onValueChange={setJudgement} />;
    case "labeled-input":
      return <LabeledInput className="w-[360px]" label="LOT-NO" defaultValue="LOT-AA-11" />;
    case "labeled-select":
      return <LabeledSelect className="w-[360px]" label="창고" value={warehouse} options={["A 창고", "B 창고"]} onValueChange={setWarehouse} />;
    case "main-list-footer-actions":
      return <div className="rounded-mes-control border border-mes-gray-30 bg-white p-4"><MainListFooterActions actions={[{ id: "edit", label: "선택 수정" }, { id: "create", label: "신규 등록" }]} /></div>;
    case "mes-product-switcher":
      return <div className="w-[220px]"><MesProductSwitcher value={product} onValueChange={setProduct} /></div>;
    case "query-date-range":
      return <QueryDateRange start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />;
    case "section-frame":
      return <SectionFrame className="max-w-[620px] border border-mes-gray-30" title="기본 정보" action={<Button size="small" variant="lineBlacktxt">수정</Button>}><p className="text-[14px] text-mes-gray-80">섹션의 제목·여백·구분선을 한 단위로 관리합니다.</p></SectionFrame>;
    case "section-header":
      return <SectionHeader>기본 정보</SectionHeader>;
    case "selection-action-bar":
      return <SelectionActionBar selectedCount={3} onDelete={() => undefined} onMove={() => undefined} onClear={() => undefined} />;
  }
}

export function RegistryComponentShowcase({ activeId }: { activeId?: string }) {
  const registryId = activeId ? getCatalogRegistryId(activeId) : undefined;
  if (!registryId || !REGISTRY_SHOWCASE_IDS.includes(registryId as RegistryShowcaseId)) return null;
  const component = componentById.get(registryId);
  if (!component) return null;

  return (
    <section className="flex w-full max-w-[960px] flex-col gap-5 border-b border-mes-gray-30 pb-8" data-component-showcase={registryId}>
      <header className="border-l-4 border-mes-primary-60 pl-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[17px] font-bold text-mes-gray-130">{component.name}</h2>
          <span className="rounded-full bg-mes-primary-10 px-2 py-0.5 text-[11px] font-semibold text-mes-primary-70">Tier {component.tier}</span>
          <span className="rounded-full bg-mes-success-10 px-2 py-0.5 text-[11px] font-semibold text-mes-success-70">검증 완료</span>
        </div>
        <p className="mt-1 text-[12px] text-mes-gray-60">{component.id} · {component.category}</p>
      </header>
      <article className="min-w-0 rounded-mes-panel border border-mes-gray-30 bg-white p-6">
        <h3 className="mb-4 text-[14px] font-semibold text-mes-gray-130">실제 컴포넌트</h3>
        <ShowcaseDemo id={registryId as RegistryShowcaseId} />
      </article>
    </section>
  );
}
