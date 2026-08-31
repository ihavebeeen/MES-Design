"use client";

import * as React from "react";
import { EntityListPattern } from "@/components/patterns/entity-list-pattern";
import { Sidebar } from "@/components/ui/sidebar";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { SearchInput } from "@/components/ui/search-input";
import { ContentRegionHeading } from "@/components/ui/content-region-heading";
import { Table } from "@/components/ui/table";
import { IconGrid } from "@/components/icons";

// Test fixture only. Not a business-screen reference or generated-asset promotion.
// Real host adapters use the same props in their existing action/data locations.
export function ApplicationHostFixture({ overlayActions, saveVersion, savedData }: {
  overlayActions: React.ReactNode;
  saveVersion: number;
  savedData: unknown;
}) {
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [collapsed, setCollapsed] = React.useState(false);
  const result = Array.isArray(savedData) ? savedData.join(", ") : saveVersion ? "입력값 반영" : "미변경";
  return (
    <EntityListPattern
      className="h-screen w-full"
      navigation={<Sidebar collapsed={collapsed} onCollapseClick={() => setCollapsed(value => !value)} items={[{ key: "fixtures", label: "검증용 메뉴", icon: <IconGrid size={20} />, children: [{ key: "list", label: "검증용 목록" }] }]} expandedKey="fixtures" activeSubKey="list" />}
      tabs={<PageTopTabItem label="검증용 목록" active closable={false} />}
      header={<div className="flex h-full items-center justify-between border-b border-mes-gray-30 px-5"><ContentRegionHeading>생성 흐름 검증용 페이지</ContentRegionHeading>{overlayActions}</div>}
      table={<div className="flex flex-col gap-3 p-5">
        <SearchInput value={query} onChange={setQuery} placeholder="배경 목록 검색" />
        <Table columns={[{ key: "name", label: "품목", width: 260 }, { key: "result", label: "저장 반영 결과", width: 360 }]}
          rows={Array.from({ length: 40 }, (_, index) => ({ id: `fixture-${index}`, data: { name: `검증용 품목 ${index + 1}`, result: index === 0 ? result : "미변경" } })).filter(row => row.data.name.includes(query))}
          selectable selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} horizontalScroll={false} />
      </div>}
      footer={<span data-testid="host-save-version">저장 반영 {saveVersion}</span>}
    />
  );
}
