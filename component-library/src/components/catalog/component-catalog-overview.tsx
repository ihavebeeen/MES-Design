"use client";

import * as React from "react";
import NextLink from "next/link";
import componentData from "@/design-system/registry/components.json";
import usageData from "@/design-system/registry/component-usage-contracts.json";
import verificationData from "@/design-system/registry/web-verification-audit.json";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { ComponentCatalogThumbnail } from "@/components/catalog/component-catalog-thumbnail";
import { COMPONENT_CATALOG_GROUPS, getCatalogRegistryId } from "@/lib/component-catalog-data";
import { TIER_BY_ID, TOC_LINKS, idToHref } from "@/lib/sidebar-data";
import { cn } from "@/lib/utils";

type MaturityFilter = "all" | "stable" | "provisional";

const componentById = new Map(componentData.components.map((component) => [component.id, component]));
const usageById = new Map([...usageData.baselineContexts, ...usageData.contracts].map((context) => [context.componentId, context]));
const tocById = new Map(TOC_LINKS.map((item) => [item.id, item]));

function contextLabel(parent: string) {
  if (parent.startsWith("popup.")) return "팝업";
  if (parent.startsWith("table.")) return "테이블";
  if (parent.startsWith("section.")) return "섹션";
  if (parent.startsWith("action-set.")) return "하단 액션";
  if (parent.startsWith("screen.")) return "화면";
  return parent.split(".")[0];
}

export function ComponentCatalogOverview() {
  const [query, setQuery] = React.useState("");
  const [activeGroup, setActiveGroup] = React.useState("all");
  const [maturity, setMaturity] = React.useState<MaturityFilter>("all");
  const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

  const visibleGroups = COMPONENT_CATALOG_GROUPS.map((group) => ({
    ...group,
    itemIds: group.itemIds.filter((id) => {
      const registryId = getCatalogRegistryId(id);
      const component = componentById.get(registryId);
      const label = tocById.get(id);
      const usage = usageById.get(registryId);
      const matchesGroup = activeGroup === "all" || activeGroup === group.id;
      const matchesMaturity = maturity === "all" || component?.status === maturity;
      const haystack = [label?.label, label?.labelEn, component?.name, ...(component?.rules ?? []), ...(usage?.useWhen ?? [])].join(" ").toLocaleLowerCase("ko-KR");
      return matchesGroup && matchesMaturity && (!normalizedQuery || haystack.includes(normalizedQuery));
    }),
  })).filter((group) => group.itemIds.length > 0);
  const visibleCount = visibleGroups.reduce((sum, group) => sum + group.itemIds.length, 0);
  const totalCount = COMPONENT_CATALOG_GROUPS.reduce((sum, group) => sum + group.itemIds.length, 0);

  return (
    <section className="flex w-full max-w-[960px] flex-col gap-6" data-component-catalog>
      <div className="rounded-mes-panel border border-mes-gray-30 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-mes-gray-130">컴포넌트 찾아보기</h2>
            <p className="mt-1 max-w-[640px] text-[13px] leading-5 text-mes-gray-70">이름순 목록이 아니라 사용 목적과 화면 맥락으로 분류했습니다. 카드를 선택하면 실제 variants와 상태를 확인할 수 있습니다.</p>
          </div>
          <span className="rounded-full bg-mes-gray-20 px-3 py-1 text-[12px] font-semibold text-mes-gray-70">{visibleCount} / {totalCount}</span>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <SearchInput value={query} onChange={setQuery} placeholder="이름 또는 사용 목적 검색" width="fill" size="compact" background="white" />
          <div className="flex flex-wrap gap-1.5" aria-label="컴포넌트 역할 필터">
            <Button size="xsmall" variant={activeGroup === "all" ? "fillBlack" : "lineBlacktxt"} onClick={() => setActiveGroup("all")}>전체</Button>
            {COMPONENT_CATALOG_GROUPS.map((group) => <Button key={group.id} size="xsmall" variant={activeGroup === group.id ? "fillBlack" : "lineBlacktxt"} onClick={() => setActiveGroup(group.id)}>{group.label}</Button>)}
          </div>
          <div className="flex flex-wrap gap-1.5" aria-label="컴포넌트 성숙도 필터">
            <Button size="xsmall" variant={maturity === "all" ? "lineMain" : "lineBlacktxt"} onClick={() => setMaturity("all")}>성숙도 전체</Button>
            <Button size="xsmall" variant={maturity === "stable" ? "lineMain" : "lineBlacktxt"} onClick={() => setMaturity("stable")}>Stable</Button>
            <Button size="xsmall" variant={maturity === "provisional" ? "lineMain" : "lineBlacktxt"} onClick={() => setMaturity("provisional")}>근거 보강 중</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3" data-context-coverage-summary>
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4"><p className="text-[11px] font-semibold text-mes-gray-60">컴포넌트 맥락</p><p className="mt-1 text-[18px] font-bold text-mes-gray-130">{verificationData.summary.components.selectionContexts} / {verificationData.summary.components.total}</p><p className="mt-1 text-[11px] leading-4 text-mes-gray-70">모든 컴포넌트에 사용·비사용 조건이 있습니다. 선택에 민감한 {verificationData.summary.components.detailedUsageRules}개는 상세 계약까지 관리합니다.</p></article>
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4"><p className="text-[11px] font-semibold text-mes-gray-60">패턴 맥락</p><p className="mt-1 text-[18px] font-bold text-mes-gray-130">{verificationData.summary.patterns.selectionContexts} / {verificationData.summary.patterns.total}</p><p className="mt-1 text-[11px] leading-4 text-mes-gray-70">기본 조합 맥락은 전체에 있고, {verificationData.summary.patterns.detailedCompositionRules}개는 슬롯·상태·금지 조건까지 정의했습니다.</p></article>
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4"><p className="text-[11px] font-semibold text-mes-gray-60">화면 근거</p><p className="mt-1 text-[18px] font-bold text-mes-gray-130">{verificationData.summary.screens.directlyVisualLinked} / {verificationData.summary.screens.total}</p><p className="mt-1 text-[11px] leading-4 text-mes-gray-70">화면은 복제 템플릿이 아니라 사용 근거입니다. {verificationData.summary.screens.orderedDefinitions}개만 상세 순서 정의가 있습니다.</p></article>
      </div>

      {visibleGroups.length === 0 && <div className="rounded-mes-panel border border-dashed border-mes-gray-40 bg-white p-8 text-center text-[13px] text-mes-gray-70">조건에 맞는 컴포넌트가 없습니다.</div>}

      {visibleGroups.map((group) => (
        <section key={group.id} data-component-category={group.id} className="flex flex-col gap-3">
          <header className="flex items-end justify-between gap-4 border-b border-mes-gray-30 pb-3">
            <div><h3 className="text-[17px] font-bold text-mes-gray-130">{group.label} <span className="ml-1 text-[12px] font-medium text-mes-gray-60">{group.labelEn}</span></h3><p className="mt-1 text-[12px] text-mes-gray-70">{group.description}</p></div>
            <span className="text-[12px] font-semibold text-mes-gray-60">{group.itemIds.length}</span>
          </header>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.itemIds.map((id) => {
              const registryId = getCatalogRegistryId(id);
              const component = componentById.get(registryId);
              const usage = usageById.get(registryId);
              const label = tocById.get(id);
              const allowedParents = usage && "allowedParents" in usage && Array.isArray(usage.allowedParents) ? usage.allowedParents as string[] : [];
              const contexts = [...new Set(allowedParents.map(contextLabel))].slice(0, 3);
              const useWhen = usage?.useWhen?.[0] ?? component?.rules?.[0] ?? group.description;
              const doNotUseWhen = usage?.doNotUseWhen?.[0] ?? "역할이 다른 자산으로 표현해야 할 때";
              return (
                <NextLink key={id} href={idToHref(id)} className="group overflow-hidden rounded-mes-panel border border-mes-gray-30 bg-white transition hover:border-mes-primary-60 hover:shadow-sm" data-component-card={id}>
                  <div className="flex h-32 items-center justify-center overflow-hidden border-b border-mes-gray-30 bg-mes-gray-10 p-3" data-component-thumbnail={id}><ComponentCatalogThumbnail id={id} groupId={group.id} /></div>
                  <div className="flex min-h-48 flex-col p-4">
                    <div className="flex items-start justify-between gap-2"><div><h4 className="text-[14px] font-bold text-mes-gray-130 group-hover:text-mes-primary-70">{label?.label ?? component?.name ?? id}</h4><p className="mt-0.5 text-[11px] text-mes-gray-60">{label?.labelEn ?? component?.name}</p></div>{TIER_BY_ID[id] && <span className="shrink-0 rounded-full bg-mes-primary-10 px-2 py-0.5 text-[10px] font-semibold text-mes-primary-70">T{TIER_BY_ID[id]}</span>}</div>
                    <div className="mt-3 space-y-2 text-[11px] leading-4.5"><p className="line-clamp-2 text-mes-gray-80"><strong className="mr-1 font-semibold text-mes-gray-110">주로 사용</strong>{useWhen}</p><p className="line-clamp-2 text-mes-gray-70"><strong className="mr-1 font-semibold text-mes-gray-100">피할 때</strong>{doNotUseWhen}</p></div>
                    <div className="mt-auto flex flex-wrap gap-1 pt-3"><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", component?.status === "stable" ? "bg-mes-success-10 text-mes-success-70" : "bg-mes-gray-20 text-mes-gray-70")}>{component?.status === "stable" ? "Stable" : "근거 보강 중"}</span>{contexts.map((context) => <span key={context} className="rounded-full bg-mes-gray-20 px-2 py-0.5 text-[10px] text-mes-gray-70">{context}</span>)}</div>
                  </div>
                </NextLink>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}
