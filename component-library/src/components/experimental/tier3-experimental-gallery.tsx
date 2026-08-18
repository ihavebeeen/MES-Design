"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import {
  ExperimentalCascader,
  ExperimentalFileUpload,
  ExperimentalMaskInput,
  ExperimentalQrCode,
  ExperimentalSlider,
  ExperimentalStepper,
  ExperimentalTransfer,
  ExperimentalTreeSelect,
} from "./tier3-input-prototypes";
import {
  ExperimentalGlobalSearch,
  ExperimentalImageThumbnail,
  ExperimentalResizablePanel,
  ExperimentalResizablePopup,
  ExperimentalRowExpandDetail,
  ExperimentalSearchHighlight,
  ExperimentalTimeline,
  ExperimentalTreeView,
} from "./tier3-content-prototypes";
import {
  ExperimentalColumnControls,
  ExperimentalFrozenColumnGrid,
  ExperimentalGroupedHeaderGrid,
  ExperimentalVirtualScrollGrid,
} from "./tier3-grid-prototypes";
import {
  ExperimentalAndonBoard,
  ExperimentalGauge,
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
        <p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">기존 자산으로 대체되지 않는 구조·상호작용 후보 23개를 격리한 기능 프로토타입입니다. 업무 이름만 다른 기존 컴포넌트 조합은 후보에서 제외했으며, 실제 업무 근거가 들어오기 전까지 표준 AI 생성 문법에는 영향을 주지 않습니다.</p>
      </div>
      <ExperimentalNotice />

      <section>
        <GroupTitle title="입력·선택·파일" count={8} description="기존 입력 컴포넌트로는 표현되지 않는 구조와 동작 후보" />
        <PrototypeGrid>
          <ExperimentalSlider /><ExperimentalFileUpload /><ExperimentalStepper /><ExperimentalCascader />
          <ExperimentalTransfer /><ExperimentalTreeSelect /><ExperimentalQrCode /><ExperimentalMaskInput />
        </PrototypeGrid>
      </section>

      <section>
        <GroupTitle title="콘텐츠·내비게이션·레이아웃" count={8} description="별도 해부 구조나 상호작용 계약이 필요한 후보" />
        <PrototypeGrid>
          <ExperimentalTimeline /><ExperimentalTreeView /><ExperimentalImageThumbnail /><ExperimentalRowExpandDetail />
          <ExperimentalGlobalSearch /><ExperimentalSearchHighlight />
          <ExperimentalResizablePanel /><ExperimentalResizablePopup />
        </PrototypeGrid>
      </section>

      <section>
        <GroupTitle title="고급 테이블" count={4} description="고정·그룹 헤더·컬럼 제어·가상 스크롤 후보" />
        <PrototypeGrid>
          <ExperimentalFrozenColumnGrid /><ExperimentalGroupedHeaderGrid /><ExperimentalColumnControls />
          <ExperimentalVirtualScrollGrid />
        </PrototypeGrid>
      </section>

      <section>
        <GroupTitle title="MES 모니터링·설비·품질" count={3} description="기존 카드·진행률 조합으로 환원되지 않는 전문 후보" />
        <PrototypeGrid>
          <ExperimentalAndonBoard /><ExperimentalGauge /><ExperimentalSpcChart />
        </PrototypeGrid>
      </section>
    </div>
  );
}
