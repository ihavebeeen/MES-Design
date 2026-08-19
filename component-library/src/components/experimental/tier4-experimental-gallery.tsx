"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import {
  ExperimentalAvatar,
  ExperimentalOverflowList,
  ExperimentalProgressCircle,
  ExperimentalSegmentedControl,
} from "./tier4-general-prototypes";
import {
  ExperimentalProcessFlowDiagram,
  ExperimentalProductionGantt,
} from "./tier4-mes-prototypes";

function GroupTitle({ title, count, description }: { title: string; count: number; description: string }) {
  return <div className="mb-3 mt-8 flex flex-wrap items-end justify-between gap-2 border-b border-mes-gray-40 pb-2 first:mt-0"><div><h2 className="text-[18px] font-bold text-mes-gray-130">{title}</h2><p className="mt-1 text-[12px] text-mes-gray-60">{description}</p></div><span className="text-[12px] font-semibold text-mes-gray-80">{count}개</span></div>;
}

export function Tier4ExperimentalGallery() {
  return <div className="space-y-4">
    <div><h1 className="text-[24px] font-extrabold tracking-tight text-mes-gray-130">Tier 4 유지 후보</h1><p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">2026-08-19 사용자 판정으로 22개 중 6개만 실험 후보에 유지했습니다. 세그먼트는 ButtonGroup·ToggleButton과 다른 단일 선택 그룹 계약 후보지만 방향키 상호작용이 아직 없어 표준 조합 문법에는 포함되지 않습니다.</p></div>
    <ExperimentalNotice />
    <section><GroupTitle title="범용 표현" count={4} description="사용자 판정에 따라 유지하는 단일 선택·사람·진행·넘침 표현 후보" /><PrototypeGrid>
      <ExperimentalSegmentedControl /><ExperimentalAvatar />
      <ExperimentalProgressCircle /><ExperimentalOverflowList />
    </PrototypeGrid></section>
    <section><GroupTitle title="MES 업무 시각화" count={2} description="실제 업무 근거가 추가되면 조합 문법을 검토할 후보" /><PrototypeGrid>
      <ExperimentalProcessFlowDiagram /><ExperimentalProductionGantt />
    </PrototypeGrid></section>
  </div>;
}
