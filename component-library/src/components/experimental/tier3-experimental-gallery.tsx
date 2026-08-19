"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import { ExperimentalImageThumbnail, ExperimentalSearchHighlight } from "./tier3-content-prototypes";

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
        <p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">2026-08-19 사용자 판정 후 Tier 3에서 계속 격리하는 후보 2개입니다. 이미지 썸네일은 현 상태로 유지하고, 검색어 강조는 후속 수정이 필요합니다. 승격 11개는 표준 레지스트리의 provisional 자산으로 이동했고 제외 10개는 생성 후보에서 제거했습니다.</p>
      </div>
      <ExperimentalNotice />

      <section>
        <GroupTitle title="Tier 3 유지 후보" count={2} description="사용자 판정에 따라 표준 AI 생성에서 계속 격리하는 자산" />
        <PrototypeGrid>
          <ExperimentalImageThumbnail /><ExperimentalSearchHighlight />
        </PrototypeGrid>
      </section>
    </div>
  );
}
