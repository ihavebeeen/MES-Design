"use client";

import * as React from "react";
import NextLink from "next/link";
import componentData from "@/design-system/registry/components.json";
import usageData from "@/design-system/registry/component-usage-contracts.json";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { ComponentCatalogThumbnail } from "@/components/catalog/component-catalog-thumbnail";
import { COMPONENT_CATALOG_GROUPS, getCatalogRegistryId } from "@/lib/component-catalog-data";
import { getAssetScopeLabel, getAssetStatusLabel } from "@/lib/catalog-labels";
import { TIER_BY_ID, TOC_LINKS, idToHref } from "@/lib/sidebar-data";

type MaturityFilter = "all" | "stable" | "provisional";

const componentById = new Map(componentData.components.map((component) => [component.id, component]));
const usageById = new Map([...usageData.baselineContexts, ...usageData.contracts].map((context) => [context.componentId, context]));
const tocById = new Map(TOC_LINKS.map((item) => [item.id, item]));

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
          <div className="flex flex-wrap gap-1.5" aria-label="컴포넌트 기준 상태 필터">
            <Button size="xsmall" variant={maturity === "all" ? "lineMain" : "lineBlacktxt"} onClick={() => setMaturity("all")}>전체 상태</Button>
            <Button size="xsmall" variant={maturity === "stable" ? "lineMain" : "lineBlacktxt"} onClick={() => setMaturity("stable")}>기준 확정</Button>
            <Button size="xsmall" variant={maturity === "provisional" ? "lineMain" : "lineBlacktxt"} onClick={() => setMaturity("provisional")}>검토 필요</Button>
          </div>
        </div>
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
              const label = tocById.get(id);
              return (
                <NextLink key={id} href={idToHref(id)} className="group overflow-hidden rounded-mes-panel border border-mes-gray-30 bg-white transition hover:border-mes-primary-60 hover:shadow-sm" data-component-card={id}>
                  <div className="flex h-32 items-center justify-center overflow-hidden border-b border-mes-gray-30 bg-mes-gray-10 p-3" data-component-thumbnail={id}><ComponentCatalogThumbnail id={id} groupId={group.id} /></div>
                  <div className="flex min-h-24 flex-col p-4">
                    <div className="flex items-start justify-between gap-2"><div><h4 className="text-[14px] font-bold text-mes-gray-130 group-hover:text-mes-primary-70">{label?.label ?? component?.name ?? id}</h4><p className="mt-0.5 text-[11px] text-mes-gray-60">{label?.labelEn ?? component?.name}</p></div>{TIER_BY_ID[id] && <span className="shrink-0 rounded-full bg-mes-primary-10 px-2 py-0.5 text-[10px] font-semibold text-mes-primary-70">{getAssetScopeLabel(TIER_BY_ID[id])}</span>}</div>
                    <p className="mt-auto pt-3 text-[10px] font-medium text-mes-gray-60">{getAssetStatusLabel(component?.status)}</p>
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
