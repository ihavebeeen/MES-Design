"use client";

import * as React from "react";
import NextLink from "next/link";
import { Check, ChevronDown, Circle, GripVertical, Search } from "lucide-react";
import componentData from "@/design-system/registry/components.json";
import usageData from "@/design-system/registry/component-usage-contracts.json";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { COMPONENT_CATALOG_GROUPS, getCatalogRegistryId } from "@/lib/component-catalog-data";
import { TIER_BY_ID, TOC_LINKS, idToHref } from "@/lib/sidebar-data";
import { cn } from "@/lib/utils";

type MaturityFilter = "all" | "stable" | "provisional";

const componentById = new Map(componentData.components.map((component) => [component.id, component]));
const usageById = new Map(usageData.contracts.map((contract) => [contract.componentId, contract]));
const tocById = new Map(TOC_LINKS.map((item) => [item.id, item]));

function contextLabel(parent: string) {
  if (parent.startsWith("popup.")) return "팝업";
  if (parent.startsWith("table.")) return "테이블";
  if (parent.startsWith("section.")) return "섹션";
  if (parent.startsWith("action-set.")) return "하단 액션";
  if (parent.startsWith("screen.")) return "화면";
  return parent.split(".")[0];
}

function CatalogThumbnail({ id, groupId }: { id: string; groupId: string }) {
  const key = getCatalogRegistryId(id);
  const base = "absolute rounded-mes-control border border-mes-gray-40 bg-white";

  if (key === "button" || ["button-group", "toggle-button", "link", "icon-button"].includes(key)) {
    return <div className="flex h-full items-center justify-center gap-2"><span className="h-7 w-20 rounded-mes-control bg-mes-primary-60" /><span className="h-7 w-14 rounded-mes-control border border-mes-gray-40 bg-white" /></div>;
  }
  if (["checkbox", "radio", "switch", "segmented-control"].includes(key)) {
    return <div className="flex h-full items-center justify-center gap-5"><span className="flex size-5 items-center justify-center rounded border border-mes-gray-40 bg-mes-gray-130 text-white"><Check className="size-3" /></span><span className="flex size-5 items-center justify-center rounded-full border border-mes-gray-50"><Circle className="size-2 fill-mes-primary-60 text-mes-primary-60" /></span><span className="flex h-5 w-10 items-center rounded-full bg-mes-primary-60 px-0.5"><span className="ml-auto size-4 rounded-full bg-white" /></span></div>;
  }
  if (["input", "number-input", "password-input", "textarea", "select", "combobox", "cascader", "tree-select", "multi-select-input", "date-picker", "date-range-picker", "time-picker", "search-input"].includes(key)) {
    return <div className="flex h-full items-center justify-center"><span className="flex h-8 w-44 items-center justify-between rounded-mes-control border border-mes-gray-40 bg-white px-3 text-mes-gray-60"><span className="h-2 w-20 rounded bg-mes-gray-30" />{key === "search-input" ? <Search className="size-4" /> : <ChevronDown className="size-4" />}</span></div>;
  }
  if (key === "table") {
    return <div className="relative mx-auto h-20 w-48 overflow-hidden rounded-mes-control border border-mes-gray-40 bg-white"><div className="h-5 bg-mes-gray-30" /><div className="grid h-5 grid-cols-3 border-t border-mes-gray-30"><span className="border-r border-mes-gray-30" /><span className="border-r border-mes-gray-30" /></div><div className="grid h-5 grid-cols-3 border-t border-mes-gray-30 bg-mes-primary-10"><span className="border-r border-mes-gray-30" /><span className="border-r border-mes-gray-30" /></div><div className="grid h-5 grid-cols-3 border-t border-mes-gray-30"><span className="border-r border-mes-gray-30" /><span className="border-r border-mes-gray-30" /></div></div>;
  }
  if (["center-modal", "confirm-dialog", "radio-choice-dialog", "side-slide-panel", "notification-panel", "popover", "dropdown-menu"].includes(key)) {
    return <div className="relative h-full w-full bg-mes-gray-60/40"><span className={cn(base, key === "side-slide-panel" ? "bottom-2 right-2 top-2 w-24" : "left-1/2 top-1/2 h-20 w-36 -translate-x-1/2 -translate-y-1/2")}><span className="block h-5 border-b border-mes-gray-30" /><span className="mx-3 mt-3 block h-2 rounded bg-mes-gray-30" /><span className="mx-3 mt-2 block h-2 w-1/2 rounded bg-mes-gray-20" /></span></div>;
  }
  if (["badge", "tag", "overflow-list"].includes(key)) {
    return <div className="flex h-full items-center justify-center gap-2"><span className="rounded-full bg-mes-primary-20 px-4 py-1 text-[11px] text-mes-primary-70">상태</span><span className="rounded-full bg-mes-gray-30 px-3 py-1 text-[11px] text-mes-gray-80">+3</span></div>;
  }
  if (["progress", "progress-circle", "loading-spinner"].includes(key)) {
    return <div className="flex h-full items-center justify-center gap-5"><span className="relative size-12 rounded-full border-4 border-mes-gray-30 border-r-mes-primary-60" /><span className="h-2 w-32 overflow-hidden rounded-full bg-mes-gray-30"><span className="block h-full w-2/3 bg-mes-primary-60" /></span></div>;
  }
  if (["image-thumbnail", "avatar"].includes(key)) {
    return <div className="flex h-full items-center justify-center gap-3"><span className="size-12 rounded-full bg-mes-primary-20" /><span className="size-14 rounded-mes-control border border-mes-gray-30 bg-gradient-to-br from-mes-gray-20 to-mes-primary-20" /><span className="size-14 rounded-mes-control border border-mes-gray-30 bg-mes-gray-20" /></div>;
  }
  if (groupId === "navigation") {
    return <div className="mx-auto flex h-20 w-48 overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white"><span className="w-12 bg-mes-gray-130" /><span className="flex-1 p-3"><span className="block h-2 w-24 rounded bg-mes-primary-30" /><span className="mt-3 block h-2 w-32 rounded bg-mes-gray-30" /><span className="mt-2 block h-2 w-20 rounded bg-mes-gray-20" /></span></div>;
  }
  if (groupId === "layout") {
    return <div className="mx-auto grid h-20 w-48 grid-cols-2 gap-2 rounded-mes-control border border-mes-gray-30 bg-white p-2"><span className="rounded bg-mes-gray-20" /><span className="rounded bg-mes-primary-10" /><span className="col-span-2 rounded bg-mes-gray-30" /></div>;
  }
  if (groupId === "feedback") {
    return <div className="mx-auto flex h-16 w-48 items-start gap-3 rounded-mes-control border border-mes-primary-30 bg-mes-primary-10 p-3"><span className="size-5 rounded-full bg-mes-primary-60" /><span className="flex-1"><span className="block h-2 w-24 rounded bg-mes-primary-30" /><span className="mt-2 block h-2 w-32 rounded bg-white" /></span></div>;
  }
  return <div className="flex h-full items-center justify-center"><GripVertical className="size-5 text-mes-gray-50" /><span className="ml-2 h-10 w-36 rounded-mes-control border border-mes-gray-30 bg-white" /></div>;
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
              const contexts = [...new Set((usage?.allowedParents ?? []).map(contextLabel))].slice(0, 3);
              const description = usage?.useWhen?.[0] ?? component?.rules?.[0] ?? group.description;
              return (
                <NextLink key={id} href={idToHref(id)} className="group overflow-hidden rounded-mes-panel border border-mes-gray-30 bg-white transition hover:border-mes-primary-60 hover:shadow-sm" data-component-card={id}>
                  <div className="h-32 overflow-hidden border-b border-mes-gray-30 bg-mes-gray-10"><CatalogThumbnail id={id} groupId={group.id} /></div>
                  <div className="flex min-h-36 flex-col p-4">
                    <div className="flex items-start justify-between gap-2"><div><h4 className="text-[14px] font-bold text-mes-gray-130 group-hover:text-mes-primary-70">{label?.label ?? component?.name ?? id}</h4><p className="mt-0.5 text-[11px] text-mes-gray-60">{label?.labelEn ?? component?.name}</p></div>{TIER_BY_ID[id] && <span className="shrink-0 rounded-full bg-mes-primary-10 px-2 py-0.5 text-[10px] font-semibold text-mes-primary-70">T{TIER_BY_ID[id]}</span>}</div>
                    <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-mes-gray-80">{description}</p>
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
