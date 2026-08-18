"use client";

import { ExperimentalNotice, PrototypeGrid } from "./prototype-shell";
import {
  ExperimentalAvatarGroup, ExperimentalBlockquote, ExperimentalCarousel, ExperimentalCitationBadge,
  ExperimentalCodeBlock, ExperimentalColorPicker, ExperimentalCommandPalette, ExperimentalCookieConsent,
  ExperimentalDarkModeToggle, ExperimentalFab, ExperimentalFeedbackWidget, ExperimentalHero,
  ExperimentalLiveChatWidget, ExperimentalLocaleSelector, ExperimentalMarkdownRenderer,
  ExperimentalMarquee, ExperimentalMasonryGrid, ExperimentalMentions, ExperimentalOnboardingChecklist,
  ExperimentalPaywallPrompt, ExperimentalPricingTable, ExperimentalProductTour, ExperimentalRating,
  ExperimentalStreamingTextIndicator, ExperimentalSuggestionChip, ExperimentalVideoPlayer,
  ExperimentalWarehouseLocationMap, ExperimentalWatermark,
} from "./tier5-prototypes";

function GroupTitle({ title, count, description }: { title: string; count: number; description: string }) { return <div className="mb-3 mt-8 flex flex-wrap items-end justify-between gap-2 border-b border-mes-gray-40 pb-2 first:mt-0"><div><h2 className="text-[18px] font-bold text-mes-gray-130">{title}</h2><p className="mt-1 text-[12px] text-mes-gray-60">{description}</p></div><span className="text-[12px] font-semibold text-mes-gray-80">{count}개</span></div>; }

export function Tier5ExperimentalGallery() {
  return <div className="space-y-4"><div><h1 className="text-[24px] font-extrabold tracking-tight text-mes-gray-130">Tier 5 실험 후보</h1><p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">현재 MES 핵심 범위 밖으로 분류됐던 후보 28개를 비교·판단 가능한 임시 프로토타입으로만 구성했습니다. 이 화면의 존재는 제품 도입 또는 표준 승인을 의미하지 않습니다.</p></div><ExperimentalNotice />
    <section><GroupTitle title="범용 제품·AI·콘텐츠" count={20} description="AI 보조, 온보딩, 계정·제품 운영 성격의 후보" /><PrototypeGrid>
      <ExperimentalFab /><ExperimentalRating /><ExperimentalColorPicker /><ExperimentalCommandPalette />
      <ExperimentalAvatarGroup /><ExperimentalCarousel /><ExperimentalVideoPlayer /><ExperimentalStreamingTextIndicator />
      <ExperimentalCodeBlock /><ExperimentalMarkdownRenderer /><ExperimentalSuggestionChip /><ExperimentalCitationBadge />
      <ExperimentalProductTour /><ExperimentalOnboardingChecklist /><ExperimentalCookieConsent /><ExperimentalFeedbackWidget />
      <ExperimentalLiveChatWidget /><ExperimentalDarkModeToggle /><ExperimentalLocaleSelector /><ExperimentalPricingTable />
    </PrototypeGrid></section>
    <section><GroupTitle title="특수 레이아웃·표현" count={8} description="권한 제한, 문서 표현, 창고 지도와 마케팅형 레이아웃 후보" /><PrototypeGrid>
      <ExperimentalPaywallPrompt /><ExperimentalMentions /><ExperimentalWatermark /><ExperimentalMasonryGrid />
      <ExperimentalBlockquote /><ExperimentalMarquee /><ExperimentalWarehouseLocationMap /><ExperimentalHero />
    </PrototypeGrid></section>
  </div>;
}
