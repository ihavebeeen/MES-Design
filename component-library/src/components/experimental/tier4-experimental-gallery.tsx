"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import {
  ExperimentalActivityFeed, ExperimentalAiPromptInput, ExperimentalAnchorScrollSpy,
  ExperimentalAspectRatio, ExperimentalAvatar, ExperimentalBackToTop, ExperimentalBreakpointScale,
  ExperimentalChatMessage, ExperimentalChipSelector, ExperimentalContextMenu,
  ExperimentalDisclosurePanel, ExperimentalEmptyIllustration, ExperimentalGlobalTopLoadingBar,
  ExperimentalKanbanBoard, ExperimentalKbd, ExperimentalOtpPinInput, ExperimentalOverflowList,
  ExperimentalProgressCircle, ExperimentalRichTextEditor, ExperimentalSegmentedControl,
  ExperimentalSortableList, ExperimentalSplitButton, ExperimentalSpoiler,
} from "./tier4-general-prototypes";
import {
  ExperimentalDefectParetoChart, ExperimentalDocumentVersionHistory, ExperimentalESignaturePad,
  ExperimentalEscalationTimeline, ExperimentalFactoryLayoutView, ExperimentalFullScreenModal,
  ExperimentalGenealogyTree, ExperimentalLabelPrintPreview, ExperimentalMaintenanceScheduleCalendar,
  ExperimentalPmChecklist, ExperimentalProcessFlowDiagram, ExperimentalProductionGantt,
  ExperimentalSamplingPlanTable, ExperimentalShiftScheduleCalendar, ExperimentalSkipLink,
  ExperimentalUtilizationHeatmap, ExperimentalVisuallyHidden, ExperimentalWorkOrderKanban,
} from "./tier4-mes-prototypes";

function GroupTitle({ title, count, description }: { title: string; count: number; description: string }) {
  return <div className="mb-3 mt-8 flex flex-wrap items-end justify-between gap-2 border-b border-mes-gray-40 pb-2 first:mt-0"><div><h2 className="text-[18px] font-bold text-mes-gray-130">{title}</h2><p className="mt-1 text-[12px] text-mes-gray-60">{description}</p></div><span className="text-[12px] font-semibold text-mes-gray-80">{count}개</span></div>;
}

export function Tier4ExperimentalGallery() {
  return <div className="space-y-4">
    <div><h1 className="text-[24px] font-extrabold tracking-tight text-mes-gray-130">Tier 4 실험 후보</h1><p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">기존 범위 제외 또는 실제 업무 근거 대기로 남아 있던 후보 41개를 조작 가능한 임시 자산으로 구성했습니다. 실제 MES 원본과 반복 사용 근거가 확인되기 전에는 표준 조합 문법에 포함되지 않습니다.</p></div>
    <ExperimentalNotice />
    <section><GroupTitle title="범용 입력·콘텐츠·내비게이션" count={23} description="제품 전반에서 사용할 수 있으나 MES 근거가 아직 확정되지 않은 후보" /><PrototypeGrid>
      <ExperimentalBreakpointScale /><ExperimentalSplitButton /><ExperimentalSegmentedControl /><ExperimentalChipSelector />
      <ExperimentalOtpPinInput /><ExperimentalRichTextEditor /><ExperimentalContextMenu /><ExperimentalBackToTop />
      <ExperimentalAvatar /><ExperimentalProgressCircle /><ExperimentalDisclosurePanel /><ExperimentalEmptyIllustration />
      <ExperimentalChatMessage /><ExperimentalAiPromptInput /><ExperimentalSortableList /><ExperimentalActivityFeed />
      <ExperimentalKanbanBoard /><ExperimentalGlobalTopLoadingBar /><ExperimentalKbd /><ExperimentalAspectRatio />
      <ExperimentalAnchorScrollSpy /><ExperimentalOverflowList /><ExperimentalSpoiler />
    </PrototypeGrid></section>
    <section><GroupTitle title="MES 업무·시각화·접근성" count={18} description="생산·설비·품질 업무와 접근성에 가까운 고차 후보" /><PrototypeGrid>
      <ExperimentalFullScreenModal /><ExperimentalProcessFlowDiagram /><ExperimentalUtilizationHeatmap /><ExperimentalFactoryLayoutView />
      <ExperimentalEscalationTimeline /><ExperimentalWorkOrderKanban /><ExperimentalProductionGantt /><ExperimentalShiftScheduleCalendar />
      <ExperimentalSamplingPlanTable /><ExperimentalDefectParetoChart /><ExperimentalGenealogyTree /><ExperimentalLabelPrintPreview />
      <ExperimentalESignaturePad /><ExperimentalDocumentVersionHistory /><ExperimentalMaintenanceScheduleCalendar /><ExperimentalPmChecklist />
      <ExperimentalSkipLink /><ExperimentalVisuallyHidden />
    </PrototypeGrid></section>
  </div>;
}
