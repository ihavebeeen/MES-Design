"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import {
  ExperimentalAnchorScrollSpy,
  ExperimentalAvatar,
  ExperimentalBreakpointScale,
  ExperimentalChatMessage,
  ExperimentalContextMenu,
  ExperimentalKanbanBoard,
  ExperimentalOtpPinInput,
  ExperimentalOverflowList,
  ExperimentalProgressCircle,
  ExperimentalRichTextEditor,
  ExperimentalSegmentedControl,
  ExperimentalSortableList,
  ExperimentalSplitButton,
} from "./tier4-general-prototypes";
import {
  ExperimentalDefectParetoChart,
  ExperimentalESignaturePad,
  ExperimentalFactoryLayoutView,
  ExperimentalLabelPrintPreview,
  ExperimentalProcessFlowDiagram,
  ExperimentalProductionGantt,
  ExperimentalShiftScheduleCalendar,
  ExperimentalSkipLink,
  ExperimentalVisuallyHidden,
} from "./tier4-mes-prototypes";

function GroupTitle({ title, count, description }: { title: string; count: number; description: string }) {
  return <div className="mb-3 mt-8 flex flex-wrap items-end justify-between gap-2 border-b border-mes-gray-40 pb-2 first:mt-0"><div><h2 className="text-[18px] font-bold text-mes-gray-130">{title}</h2><p className="mt-1 text-[12px] text-mes-gray-60">{description}</p></div><span className="text-[12px] font-semibold text-mes-gray-80">{count}개</span></div>;
}

export function Tier4ExperimentalGallery() {
  return <div className="space-y-4">
    <div><h1 className="text-[24px] font-extrabold tracking-tight text-mes-gray-130">Tier 4 실험 후보</h1><p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">기존 자산 조합으로 환원되지 않는 후보 22개를 조작 가능한 임시 자산으로 구성했습니다. 실제 MES 원본과 반복 사용 근거가 확인되기 전에는 표준 조합 문법에 포함되지 않습니다.</p></div>
    <ExperimentalNotice />
    <section><GroupTitle title="범용 입력·콘텐츠·내비게이션" count={13} description="기존 컴포넌트에 없는 구조나 상호작용을 가진 후보" /><PrototypeGrid>
      <ExperimentalBreakpointScale /><ExperimentalSplitButton /><ExperimentalSegmentedControl />
      <ExperimentalOtpPinInput /><ExperimentalRichTextEditor /><ExperimentalContextMenu />
      <ExperimentalAvatar /><ExperimentalProgressCircle /><ExperimentalChatMessage />
      <ExperimentalSortableList /><ExperimentalKanbanBoard />
      <ExperimentalAnchorScrollSpy /><ExperimentalOverflowList />
    </PrototypeGrid></section>
    <section><GroupTitle title="MES 업무·시각화·접근성" count={9} description="기존 차트·테이블·목록 조합으로 환원되지 않는 고차 후보" /><PrototypeGrid>
      <ExperimentalProcessFlowDiagram /><ExperimentalFactoryLayoutView />
      <ExperimentalProductionGantt /><ExperimentalShiftScheduleCalendar />
      <ExperimentalDefectParetoChart /><ExperimentalLabelPrintPreview />
      <ExperimentalESignaturePad /><ExperimentalSkipLink /><ExperimentalVisuallyHidden />
    </PrototypeGrid></section>
  </div>;
}
