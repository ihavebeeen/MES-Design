"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import {
  ExperimentalApprovalStepper,
  ExperimentalAttachmentList,
  ExperimentalCascader,
  ExperimentalDowntimeReasonSelector,
  ExperimentalFileRow,
  ExperimentalFileUpload,
  ExperimentalMaskInput,
  ExperimentalQrCode,
  ExperimentalSlider,
  ExperimentalStepper,
  ExperimentalTransfer,
  ExperimentalTreeSelect,
} from "./tier3-input-prototypes";
import {
  ExperimentalFooter,
  ExperimentalGlobalSearch,
  ExperimentalImageThumbnail,
  ExperimentalResizablePanel,
  ExperimentalResizablePopup,
  ExperimentalResultPage,
  ExperimentalRowExpandDetail,
  ExperimentalSearchHighlight,
  ExperimentalSettingsList,
  ExperimentalTimeline,
  ExperimentalTreeView,
} from "./tier3-content-prototypes";
import {
  ExperimentalColumnControls,
  ExperimentalFrozenColumnGrid,
  ExperimentalGroupedHeaderGrid,
  ExperimentalRealtimeGridIndicator,
  ExperimentalVirtualScrollGrid,
} from "./tier3-grid-prototypes";
import {
  ExperimentalAndonBoard,
  ExperimentalBlinkingAlarm,
  ExperimentalBomTree,
  ExperimentalEquipmentDetailCard,
  ExperimentalEquipmentStatusCard,
  ExperimentalGauge,
  ExperimentalInventoryLevel,
  ExperimentalOeeWidget,
  ExperimentalRealtimeTrend,
  ExperimentalSpcChart,
} from "./tier3-mes-prototypes";

function GroupTitle({ title, count, description }: { title: string; count: number; description: string }) {
  return (
    <div className="mb-3 mt-8 flex flex-wrap items-end justify-between gap-2 border-b border-mes-gray-40 pb-2 first:mt-0">
      <div><h2 className="text-[18px] font-bold text-mes-gray-130">{title}</h2><p className="mt-1 text-[12px] text-mes-gray-60">{description}</p></div>
      <span className="text-[12px] font-semibold text-mes-gray-80">{count}개</span>
    </div>
  );
}

export function Tier3ExperimentalGallery() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-mes-gray-130">Tier 3 실험 후보</h1>
        <p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">미구현으로 남아 있던 MES 특화 후보 38개를 기존 토큰과 표준 컴포넌트로 조립한 기능 프로토타입입니다. 모양을 확정하거나 Figma 원본과 동일하다고 주장하지 않으며, 실제 업무 근거가 들어오기 전까지 표준 AI 생성 문법에는 영향을 주지 않습니다.</p>
      </div>
      <ExperimentalNotice />

      <section>
        <GroupTitle title="입력·선택·파일" count={12} description="값 입력, 계층 선택, 파일과 결재 흐름 후보" />
        <PrototypeGrid>
          <ExperimentalSlider /><ExperimentalFileUpload /><ExperimentalStepper /><ExperimentalCascader />
          <ExperimentalTransfer /><ExperimentalTreeSelect /><ExperimentalQrCode /><ExperimentalMaskInput />
          <ExperimentalApprovalStepper /><ExperimentalAttachmentList /><ExperimentalDowntimeReasonSelector /><ExperimentalFileRow />
        </PrototypeGrid>
      </section>

      <section>
        <GroupTitle title="콘텐츠·내비게이션·레이아웃" count={11} description="이력, 상세, 검색, 설정과 레이아웃 후보" />
        <PrototypeGrid>
          <ExperimentalTimeline /><ExperimentalTreeView /><ExperimentalImageThumbnail /><ExperimentalRowExpandDetail />
          <ExperimentalGlobalSearch /><ExperimentalSettingsList /><ExperimentalResultPage /><ExperimentalSearchHighlight />
          <ExperimentalFooter /><ExperimentalResizablePanel /><ExperimentalResizablePopup />
        </PrototypeGrid>
      </section>

      <section>
        <GroupTitle title="고급 테이블" count={5} description="고정·그룹 헤더·컬럼 제어·가상 스크롤·실시간 상태 후보" />
        <PrototypeGrid>
          <ExperimentalFrozenColumnGrid /><ExperimentalGroupedHeaderGrid /><ExperimentalColumnControls />
          <ExperimentalVirtualScrollGrid /><ExperimentalRealtimeGridIndicator />
        </PrototypeGrid>
      </section>

      <section>
        <GroupTitle title="MES 모니터링·설비·품질" count={10} description="현장 모니터링과 생산·품질 도메인 후보" />
        <PrototypeGrid>
          <ExperimentalAndonBoard /><ExperimentalEquipmentStatusCard /><ExperimentalGauge /><ExperimentalOeeWidget />
          <ExperimentalRealtimeTrend /><ExperimentalBlinkingAlarm /><ExperimentalBomTree /><ExperimentalSpcChart />
          <ExperimentalInventoryLevel /><ExperimentalEquipmentDetailCard />
        </PrototypeGrid>
      </section>
    </div>
  );
}
