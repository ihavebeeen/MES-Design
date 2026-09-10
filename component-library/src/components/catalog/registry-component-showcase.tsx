"use client";

import * as React from "react";
import componentData from "@/design-system/registry/components.json";
import { HorizontalBarChart, InventoryComparisonChart } from "@/components/ui/analytics-charts";
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
import { QueryDateRange } from "@/components/ui/query-date-range";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeader } from "@/components/ui/section-header";
import { SelectionActionBar } from "@/components/ui/selection-action-bar";
import { getAssetScopeLabel, getAssetStatusLabel } from "@/lib/catalog-labels";
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
  "query-date-range",
  "section-frame",
  "section-header",
  "selection-action-bar",
] as const;

type RegistryShowcaseId = (typeof REGISTRY_SHOWCASE_IDS)[number];

const componentById = new Map(componentData.components.map((component) => [component.id, component]));

function VariantCard({ label, description, children, wide = false }: { label: string; description?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <article className={`flex min-h-32 min-w-0 flex-col rounded-mes-control border border-mes-gray-30 bg-white p-4 ${wide ? "md:col-span-2" : ""}`}>
      <div className="mb-4">
        <h4 className="text-[13px] font-semibold text-mes-gray-120">{label}</h4>
        {description && <p className="mt-1 text-[11px] leading-4 text-mes-gray-60">{description}</p>}
      </div>
      <div className="flex min-h-16 min-w-0 flex-1 items-center justify-center overflow-hidden">{children}</div>
    </article>
  );
}

function ShowcaseDemo({ id }: { id: RegistryShowcaseId }) {
  const [judgement, setJudgement] = React.useState<InspectionJudgementValue>("pass");
  const [warehouse, setWarehouse] = React.useState("A 창고");
  const [startDate, setStartDate] = React.useState<Date | null>(new Date(2026, 7, 1));
  const [endDate, setEndDate] = React.useState<Date | null>(new Date(2026, 7, 31));

  switch (id) {
    case "analytics-charts":
      return <div className="grid gap-3 md:grid-cols-2"><VariantCard label="가로 막대" description="항목별 값을 같은 기준으로 비교합니다." wide><HorizontalBarChart labels={["압출", "성형", "검사", "포장", "출하"]} values={[120, 96, 88, 75, 68]} barValues={[120, 96, 88, 75, 68]} /></VariantCard><VariantCard label="재고 비교" description="두 공정의 현재 값과 증감을 함께 봅니다." wide><InventoryComparisonChart /></VariantCard></div>;
    case "before-after-comparison":
      return <div className="grid gap-3"><VariantCard label="변경 전·후" description="강조 행으로 변경 결과를 구별합니다." wide><BeforeAfterComparison className="w-full max-w-[560px]" metrics={[{ key: "quantity", label: "생산수량" }, { key: "defect", label: "불량수량" }]} snapshots={[{ id: "before", label: "변경 전", values: { quantity: "1,200", defect: "12" } }, { id: "after", label: "변경 후", values: { quantity: "1,180", defect: "8" }, emphasized: true }]} /></VariantCard></div>;
    case "cavity-cell":
      return <div className="grid gap-3 md:grid-cols-3"><VariantCard label="기본"><CavityCell value={1} className="w-16" /></VariantCard><VariantCard label="선택"><CavityCell value={2} selected className="w-16" /></VariantCard><VariantCard label="값 없음"><CavityCell className="w-16" /></VariantCard></div>;
    case "content-region-heading":
      return <div className="grid gap-3 md:grid-cols-2"><VariantCard label="H2"><ContentRegionHeading>품목 재고 리스트</ContentRegionHeading></VariantCard><VariantCard label="H3"><ContentRegionHeading as="h3">생산실적 리스트</ContentRegionHeading></VariantCard></div>;
    case "dialog-footer":
      return <div className="grid gap-3"><VariantCard label="기본 2개 액션" description="취소와 저장을 같은 위치에서 제공합니다." wide><DialogFooter className="w-full" actions={[{ id: "cancel", label: "취소" }, { id: "save", label: "저장" }]} /></VariantCard><VariantCard label="단일 액션" wide><DialogFooter className="w-full" actions={[{ id: "confirm", label: "확인", variant: "fillBlack" }]} /></VariantCard></div>;
    case "form-grid":
      return <div className="grid gap-3"><VariantCard label="2열 · Comfortable" wide><FormGrid className="w-full max-w-[720px]" columns={2}><FormFieldRow label="품목" required><Input defaultValue="트레이" /></FormFieldRow><FormFieldRow label="수량" required><Input type="number" defaultValue="1200" /></FormFieldRow></FormGrid></VariantCard><VariantCard label="1열 · Compact" wide><FormGrid className="w-full max-w-[420px]" density="compact"><FormFieldRow label="LOT-NO"><Input defaultValue="LOT-AA-11" /></FormFieldRow><FormFieldRow label="창고"><Input defaultValue="A 창고" /></FormFieldRow></FormGrid></VariantCard></div>;
    case "inspection-judgement":
      return <div className="grid gap-3 md:grid-cols-2"><VariantCard label="선택 가능" description="버튼을 눌러 판정 상태를 변경할 수 있습니다."><InspectionJudgement value={judgement} onValueChange={setJudgement} /></VariantCard><VariantCard label="미분류"><InspectionJudgement value="none" onValueChange={() => undefined} /></VariantCard></div>;
    case "labeled-input":
      return <div className="grid gap-3 md:grid-cols-2"><VariantCard label="기본"><LabeledInput className="w-full max-w-[360px]" label="LOT-NO" defaultValue="LOT-AA-11" /></VariantCard><VariantCard label="읽기 전용"><LabeledInput className="w-full max-w-[360px]" label="품목" value="트레이" readOnly /></VariantCard></div>;
    case "labeled-select":
      return <div className="grid gap-3 md:grid-cols-2"><VariantCard label="기본"><LabeledSelect className="w-full max-w-[360px]" label="창고" value={warehouse} options={["A 창고", "B 창고"]} onValueChange={setWarehouse} /></VariantCard><VariantCard label="비활성"><LabeledSelect className="w-full max-w-[360px]" label="창고" value="A 창고" options={["A 창고"]} disabled /></VariantCard></div>;
    case "main-list-footer-actions":
      return <div className="grid gap-3"><VariantCard label="복수 액션" description="메인 목록 우하단 정렬을 유지합니다." wide><div className="w-full border-t border-mes-gray-30 pt-4"><MainListFooterActions actions={[{ id: "edit", label: "선택 수정" }, { id: "create", label: "신규 등록" }]} /></div></VariantCard><VariantCard label="단일 액션" wide><div className="w-full border-t border-mes-gray-30 pt-4"><MainListFooterActions actions={[{ id: "create", label: "신규 등록", variant: "fillBlack" }]} /></div></VariantCard></div>;
    case "query-date-range":
      return <div className="grid gap-3"><VariantCard label="기본 조회 기간" wide><QueryDateRange start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} /></VariantCard><VariantCard label="업무 라벨 변경" wide><QueryDateRange label="입고일자" start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} /></VariantCard></div>;
    case "section-frame":
      return <div className="grid gap-3 md:grid-cols-2"><VariantCard label="기본 표면"><SectionFrame className="w-full border border-mes-gray-30" title="기본 정보" action={<Button size="small" variant="lineBlacktxt">수정</Button>}><p className="text-[14px] text-mes-gray-80">기본 내용을 표시합니다.</p></SectionFrame></VariantCard><VariantCard label="보조 배경"><SectionFrame className="w-full border border-mes-gray-30" title="추가 정보" background="subtle"><p className="text-[14px] text-mes-gray-80">보조 내용을 구분합니다.</p></SectionFrame></VariantCard></div>;
    case "section-header":
      return <div className="grid gap-3 md:grid-cols-2"><VariantCard label="제목"><SectionHeader>기본 정보</SectionHeader></VariantCard><VariantCard label="제목 + 액션"><SectionHeader action={<Button size="small" variant="fillBlack">항목 추가</Button>}>검사항목</SectionHeader></VariantCard></div>;
    case "selection-action-bar":
      return <div className="grid gap-3"><VariantCard label="1개 선택" wide><SelectionActionBar selectedCount={1} onDelete={() => undefined} onMove={() => undefined} onClear={() => undefined} /></VariantCard><VariantCard label="여러 개 선택" wide><SelectionActionBar selectedCount={3} onDelete={() => undefined} onMove={() => undefined} onClear={() => undefined} /></VariantCard></div>;
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
          <span className="rounded-full bg-mes-primary-10 px-2 py-0.5 text-[11px] font-semibold text-mes-primary-70">{getAssetScopeLabel(component.tier)} 자산</span>
          <span className="rounded-full bg-mes-success-10 px-2 py-0.5 text-[11px] font-semibold text-mes-success-70">{getAssetStatusLabel(component.status)}</span>
        </div>
        <p className="mt-1 text-[12px] text-mes-gray-60">{component.id} · {component.category}</p>
      </header>
      <article className="min-w-0 rounded-mes-panel border border-mes-gray-30 bg-mes-gray-10 p-5">
        <div className="mb-4">
          <h3 className="text-[16px] font-bold text-mes-gray-130">실제 컴포넌트와 variants</h3>
          <p className="mt-1 text-[12px] text-mes-gray-60">등록된 구현을 상태와 구성별로 직접 확인합니다.</p>
        </div>
        <ShowcaseDemo id={registryId as RegistryShowcaseId} />
      </article>
    </section>
  );
}
