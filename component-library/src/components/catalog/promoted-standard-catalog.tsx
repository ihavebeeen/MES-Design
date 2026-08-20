"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Cascader } from "@/components/ui/cascader";
import { FileUpload } from "@/components/ui/file-upload";
import { ImageThumbnail } from "@/components/ui/image-thumbnail";
import { OverflowList } from "@/components/ui/overflow-list";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { SearchHighlight } from "@/components/ui/search-highlight";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { Timeline } from "@/components/ui/timeline";
import { TreeSelect } from "@/components/ui/tree-select";
import { TreeView } from "@/components/ui/tree-view";
import {
  ExpandableRowPattern,
  FrozenColumnGridPattern,
  GroupedHeaderGridPattern,
  ProcessFlowPattern,
  ProductTourPattern,
  ProductionGanttPattern,
  StepperPattern,
  TransferListPattern,
} from "@/components/patterns";

const meta: Record<string, { title: string; code: string; tier: number; kind: "컴포넌트" | "패턴" }> = {
  slider: { title: "범위 슬라이더", code: "Slider", tier: 3, kind: "컴포넌트" },
  "file-upload": { title: "파일 업로드", code: "FileUpload", tier: 3, kind: "컴포넌트" },
  cascader: { title: "계층 선택", code: "Cascader", tier: 3, kind: "컴포넌트" },
  "tree-select": { title: "트리 선택", code: "TreeSelect", tier: 3, kind: "컴포넌트" },
  timeline: { title: "이력 타임라인", code: "Timeline", tier: 3, kind: "컴포넌트" },
  "tree-view": { title: "트리 보기", code: "TreeView", tier: 3, kind: "컴포넌트" },
  "image-thumbnail": { title: "이미지 썸네일", code: "ImageThumbnail", tier: 3, kind: "컴포넌트" },
  "search-highlight": { title: "검색어 강조", code: "SearchHighlight", tier: 3, kind: "컴포넌트" },
  avatar: { title: "사용자 아바타", code: "Avatar", tier: 4, kind: "컴포넌트" },
  "progress-circle": { title: "원형 진행률", code: "ProgressCircle", tier: 4, kind: "컴포넌트" },
  "overflow-list": { title: "넘침 목록", code: "OverflowList", tier: 4, kind: "컴포넌트" },
  "segmented-control": { title: "세그먼트 컨트롤", code: "SegmentedControl", tier: 4, kind: "컴포넌트" },
  "workflow-stepper": { title: "단계 진행", code: "StepperPattern", tier: 3, kind: "패턴" },
  "selection-transfer-list": { title: "이중 목록 이동", code: "TransferListPattern", tier: 3, kind: "패턴" },
  "table-row-expand-detail": { title: "행 상세 펼침", code: "ExpandableRowPattern", tier: 3, kind: "패턴" },
  "table-frozen-column-grid": { title: "고정 컬럼 그리드", code: "FrozenColumnGridPattern", tier: 3, kind: "패턴" },
  "table-grouped-header-grid": { title: "그룹 헤더 그리드", code: "GroupedHeaderGridPattern", tier: 3, kind: "패턴" },
  "visualization-process-flow": { title: "공정 흐름도", code: "ProcessFlowPattern", tier: 4, kind: "패턴" },
  "visualization-production-gantt": { title: "생산 간트 차트", code: "ProductionGanttPattern", tier: 4, kind: "패턴" },
  "onboarding-product-tour": { title: "온보딩 제품 투어", code: "ProductTourPattern", tier: 5, kind: "패턴" },
};

const treeNodes = [{ id: "production", label: "생산", children: [{ id: "forming", label: "성형" }, { id: "packing", label: "포장" }] }];

function Demo({ activeId }: { activeId: string }) {
  const [step, setStep] = React.useState(1);
  const [transfer, setTransfer] = React.useState(["b"]);
  switch (activeId) {
    case "slider": return <Slider className="w-[360px]" defaultValue={62} />;
    case "file-upload": return <FileUpload className="w-[420px]" helpText="허용 형식과 최대 용량은 호출 화면에서 지정합니다." />;
    case "cascader": return <Cascader className="w-[420px]" groups={[{ id: "material", label: "원재료", items: [{ id: "sheet", label: "시트" }, { id: "resin", label: "수지" }] }, { id: "product", label: "완제품", items: [{ id: "tray", label: "트레이" }] }]} />;
    case "tree-select": return <TreeSelect className="w-[360px]" nodes={treeNodes} />;
    case "timeline": return <Timeline className="w-[360px]" items={[{ id: "1", time: "09:20", title: "작업 시작", detail: "성형 1호기" }, { id: "2", time: "11:40", title: "실적 등록", detail: "완료 1,200 EA" }]} />;
    case "tree-view": return <TreeView className="w-[320px]" nodes={treeNodes} defaultExpandedIds={["production"]} />;
    case "image-thumbnail": return <ImageThumbnail items={[{ id: "a", label: "정면" }, { id: "b", label: "측면" }, { id: "c", label: "라벨" }]} />;
    case "search-highlight": return <p className="text-[14px] text-mes-gray-100"><SearchHighlight text="LOT-AA-11 생산 품목과 LOT-AA-12 부산물" query="LOT" /></p>;
    case "avatar": return <div className="flex items-center gap-3"><Avatar name="이해빈" status="online" size="large" /><div><p className="text-[13px] font-semibold">이해빈</p><p className="text-[11px] text-mes-gray-60">생산관리자</p></div></div>;
    case "progress-circle": return <ProgressCircle value={78} />;
    case "overflow-list": return <OverflowList items={["압출", "성형", "검사", "포장", "출하"]} maxVisible={3} getKey={(item) => item} renderItem={(item) => item} />;
    case "segmented-control": return <SegmentedControl ariaLabel="설비 상태" options={[{ value: "all", label: "전체" }, { value: "run", label: "가동" }, { value: "stop", label: "비가동" }]} />;
    case "workflow-stepper": return <StepperPattern className="w-[640px]" steps={["기본정보", "품목", "확인"]} currentStep={step} onStepChange={setStep} />;
    case "selection-transfer-list": return <TransferListPattern className="w-[640px]" items={[{ id: "a", label: "압출 1호기" }, { id: "b", label: "성형 1호기" }, { id: "c", label: "포장 1라인" }]} value={transfer} onValueChange={setTransfer} />;
    case "table-row-expand-detail": return <ExpandableRowPattern className="w-[640px]" defaultOpen header={<span className="text-[13px]">LOT-AA-11 · 트레이</span>} detail={<span className="text-[12px] text-mes-gray-70">생산수량 1,200 EA · 창고 A</span>} />;
    case "table-frozen-column-grid": return <FrozenColumnGridPattern className="w-[640px]" columns={[{ key: "lot", label: "LOT-NO", width: 140 }, { key: "item", label: "품목", width: 180 }, { key: "qty", label: "수량", width: 160, align: "right" }, { key: "warehouse", label: "창고", width: 180 }]} rows={[{ lot: "LOT-AA-11", item: "트레이", qty: "1,200", warehouse: "A창고" }]} />;
    case "table-grouped-header-grid": return <GroupedHeaderGridPattern className="w-[640px]" groups={[{ label: "품목정보", columns: [{ key: "lot", label: "LOT-NO", width: 160 }, { key: "item", label: "품목", width: 180 }] }, { label: "실적정보", columns: [{ key: "qty", label: "수량", width: 140 }, { key: "unit", label: "단위", width: 100 }] }]} rows={[{ lot: "LOT-AA-11", item: "트레이", qty: "1,200", unit: "EA" }]} />;
    case "visualization-process-flow": return <ProcessFlowPattern steps={[{ id: "extrusion", label: "압출", description: "원료를 시트로 성형합니다." }, { id: "forming", label: "성형", description: "시트를 완제품 형태로 성형합니다." }, { id: "packing", label: "포장", description: "검사 완료 품목을 포장합니다." }]} />;
    case "visualization-production-gantt": return <ProductionGanttPattern className="w-[640px]" rows={[{ id: "1", label: "압출 1호기", start: 8, end: 64 }, { id: "2", label: "성형 1호기", start: 28, end: 72 }, { id: "3", label: "포장 1라인", start: 58, end: 90, tone: "strong" }]} />;
    case "onboarding-product-tour": return <ProductTourPattern steps={[{ id: "filter", title: "필터 추가", description: "필요한 조회 조건을 추가합니다." }, { id: "table", title: "행 선택", description: "작업할 행을 선택하면 편집 입력이 열립니다." }]} />;
    default: return null;
  }
}

export function PromotedStandardCatalog({ activeId }: { activeId?: string }) {
  const item = activeId ? meta[activeId] : undefined;
  if (!item || !activeId) return null;
  return (
    <section className="flex w-full max-w-[960px] flex-col gap-5 border-b border-mes-gray-30 pb-8" data-standard-asset={activeId}>
      <header className="border-l-4 border-mes-primary-60 pl-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-bold text-mes-gray-130">{item.title}</h2>
          <span className="rounded-full bg-mes-primary-20 px-2 py-0.5 text-[11px] font-medium text-mes-primary-60">Tier {item.tier} · 정식 {item.kind}</span>
        </div>
        <p className="text-[12px] text-mes-gray-60">{item.code} · 표준 레지스트리 provisional</p>
      </header>
      <div className="min-w-0 rounded-mes-control border border-mes-gray-30 bg-white p-6">
        <Demo activeId={activeId} />
      </div>
    </section>
  );
}
