"use client";

import * as React from "react";
import { EntityListPattern } from "@/components/patterns/entity-list-pattern";
import { Sidebar } from "@/components/ui/sidebar";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { ContentRegionHeading } from "@/components/ui/content-region-heading";

// Preview infrastructure, not a business page or a reusable business-layout reference.
// Keep unknown menus, columns and records absent rather than inventing them.
export function SurfacePreviewFrame({ overlayActions }: { overlayActions: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <EntityListPattern
      className="h-screen w-full"
      navigation={<Sidebar items={[]} collapsed={collapsed} onCollapseClick={() => setCollapsed(value => !value)} />}
      tabs={<PageTopTabItem label="팝업 미리보기" active closable={false} />}
      header={<div className="flex h-full items-center justify-between gap-3 border-b border-mes-gray-30 px-5">
        <div className="flex flex-col gap-2">
          <ContentRegionHeading>팝업 단독 확인</ContentRegionHeading>
          <p className="text-sm text-mes-gray-80">배경 업무 목록·선택값 전달·저장 연동은 검증 범위에 포함하지 않습니다.</p>
        </div>
        {overlayActions}
      </div>}
      table={null}
    />
  );
}
