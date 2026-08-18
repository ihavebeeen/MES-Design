"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import {
  ExperimentalCarousel,
  ExperimentalCodeBlock,
  ExperimentalColorPicker,
  ExperimentalMarkdownRenderer,
  ExperimentalMarquee,
  ExperimentalMasonryGrid,
  ExperimentalMentions,
  ExperimentalProductTour,
  ExperimentalRating,
  ExperimentalVideoPlayer,
  ExperimentalWarehouseLocationMap,
  ExperimentalWatermark,
} from "./tier5-prototypes";

function GroupTitle({ title, count, description }: { title: string; count: number; description: string }) { return <div className="mb-3 mt-8 flex flex-wrap items-end justify-between gap-2 border-b border-mes-gray-40 pb-2 first:mt-0"><div><h2 className="text-[18px] font-bold text-mes-gray-130">{title}</h2><p className="mt-1 text-[12px] text-mes-gray-60">{description}</p></div><span className="text-[12px] font-semibold text-mes-gray-80">{count}개</span></div>; }

export function Tier5ExperimentalGallery() {
  return <div className="space-y-4"><div><h1 className="text-[24px] font-extrabold tracking-tight text-mes-gray-130">Tier 5 실험 후보</h1><p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">기존 자산 조합과 제품 범위 제외 항목을 걷어낸 독립 후보 12개입니다. 이 화면의 존재는 제품 도입 또는 표준 승인을 의미하지 않습니다.</p></div><ExperimentalNotice />
    <section><GroupTitle title="범용 제품·AI·콘텐츠" count={7} description="별도 구조나 상호작용 계약을 가진 후보" /><PrototypeGrid>
      <ExperimentalRating /><ExperimentalColorPicker /><ExperimentalCarousel />
      <ExperimentalVideoPlayer /><ExperimentalCodeBlock /><ExperimentalMarkdownRenderer />
      <ExperimentalProductTour />
    </PrototypeGrid></section>
    <section><GroupTitle title="특수 레이아웃·표현" count={5} description="문서 표현, 특수 배치와 창고 지도 후보" /><PrototypeGrid>
      <ExperimentalMentions /><ExperimentalWatermark /><ExperimentalMasonryGrid />
      <ExperimentalMarquee /><ExperimentalWarehouseLocationMap />
    </PrototypeGrid></section>
  </div>;
}
