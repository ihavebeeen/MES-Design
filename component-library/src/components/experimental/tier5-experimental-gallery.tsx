"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import {
  ExperimentalProductTour,
} from "./tier5-prototypes";

function GroupTitle({ title, count, description }: { title: string; count: number; description: string }) { return <div className="mb-3 mt-8 flex flex-wrap items-end justify-between gap-2 border-b border-mes-gray-40 pb-2 first:mt-0"><div><h2 className="text-[18px] font-bold text-mes-gray-130">{title}</h2><p className="mt-1 text-[12px] text-mes-gray-60">{description}</p></div><span className="text-[12px] font-semibold text-mes-gray-80">{count}개</span></div>; }

export function Tier5ExperimentalGallery() {
  return <div className="space-y-4"><div><h1 className="text-[24px] font-extrabold tracking-tight text-mes-gray-130">Tier 5 유지 후보</h1><p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">2026-08-19 사용자 판정으로 12개 중 온보딩 툴팁·제품 투어 1개만 실험 후보에 유지했습니다. 제품 도입 또는 표준 승인을 의미하지 않습니다.</p></div><ExperimentalNotice />
    <section><GroupTitle title="온보딩" count={1} description="기능 안내의 단계·위치·완료 계약을 검토할 후보" /><PrototypeGrid>
      <ExperimentalProductTour />
    </PrototypeGrid></section>
  </div>;
}
