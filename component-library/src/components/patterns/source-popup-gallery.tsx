"use client";

import * as React from "react";
import { IconX } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CenterModal, type CenterModalSize, type DialogAction, type DialogBodyPadding, type DialogBodyScrollMode } from "@/components/ui/center-modal";
import { dialogBodyPaddingClasses, dialogBodyScrollClasses } from "@/components/ui/dialog-body";
import { DialogFooter } from "@/components/ui/dialog-footer";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import { ExactInventoryActionContent } from "./exact-inventory-action-modal";
import { ExactInventoryAddContent } from "./exact-inventory-add-modal";
import { ExactInventoryEditContent } from "./exact-inventory-edit-modal";
import { ExactPurchaseContent, ExactPurchaseItemsContent } from "./exact-purchase-modals";
import { EquipmentInspectionRecordsContent } from "./equipment-inspection-records-modal";
import { FigmaScreenPreview } from "./figma-screen-preview";
import { CavityContent } from "./original-mes-screen-assets";
import { createDialogActionSet } from "@/design-system/action-sets";

type SourcePopupId = "cavity" | "inventory-add" | "inventory-edit" | "inventory-delete" | "inventory-move" | "purchase" | "purchase-items" | "equipment-inspection-records";
type SourcePopupGroupId = "settings" | "table-edit" | "linked-detail";

interface SourcePopupDefinition {
  id: SourcePopupId;
  label: string;
  group: SourcePopupGroupId;
  node: string;
  title: string;
  summary: string;
  width: number;
  height: number;
  size: CenterModalSize;
  bodyPadding?: DialogBodyPadding;
  scrollMode?: DialogBodyScrollMode;
  confirmLabel?: string;
  closeOnly?: boolean;
  /** 원본 본문이 좌측 보조 동작까지 포함한 전용 72px 푸터를 소유하는 경우. */
  contentOwnsFooter?: boolean;
}

const GROUPS: Array<{ id: SourcePopupGroupId; label: string; description: string }> = [
  { id: "settings", label: "설정·배열", description: "값과 구조를 설정하는 중앙 팝업" },
  { id: "table-edit", label: "테이블 선택·편집", description: "행 선택 후 입력·이동·삭제하는 중앙 팝업" },
  { id: "linked-detail", label: "조회·연결 상세", description: "목록에서 상세 목록으로 이어지는 중앙 팝업" },
];

const SOURCE_POPUPS: SourcePopupDefinition[] = [
  { id: "cavity", label: "캐비티 배열 설정", group: "settings", node: "18795:62149", title: "캐비티 배열 설정", summary: "배열 방향·번호 교환 설정", width: 960, height: 760, size: "standard-960", bodyPadding: "none" },
  { id: "inventory-add", label: "재고 추가", group: "table-edit", node: "18813:64179", title: "재고 추가", summary: "선택 행 상단 고정과 셀 입력", width: 1280, height: 655, size: "wide-1400", scrollMode: "content" },
  { id: "inventory-edit", label: "재고 편집", group: "table-edit", node: "17491:82304", title: "재고편집", summary: "행 선택과 플로팅 작업 도구", width: 1294, height: 745, size: "wide-1400", bodyPadding: "none", scrollMode: "content", closeOnly: true },
  { id: "inventory-delete", label: "재고 삭제 설정", group: "table-edit", node: "17702:49052", title: "삭제 설정", summary: "선택 재고의 삭제 유형·사유 입력", width: 1013, height: 456, size: "wide-1024", scrollMode: "content" },
  { id: "inventory-move", label: "재고 이동 설정", group: "table-edit", node: "17702:49474", title: "이동 설정", summary: "선택 재고의 이동 창고 입력", width: 1013, height: 456, size: "wide-1024", scrollMode: "content" },
  { id: "purchase", label: "발주 정보", group: "linked-detail", node: "17503:85192", title: "발주 정보", summary: "발주 목록 선택과 진행 상태", width: 800, height: 680, size: "standard-960", bodyPadding: "none", scrollMode: "content", confirmLabel: "선택" },
  { id: "purchase-items", label: "발주 품목 리스트", group: "linked-detail", node: "17503:85374", title: "품목 리스트", summary: "발주 목록에서 연결되는 보조 상세", width: 507, height: 384, size: "medium-600", scrollMode: "content", closeOnly: true },
  { id: "equipment-inspection-records", label: "냉각기 점검표", group: "linked-detail", node: "9873:112416", title: "냉각기 점검표", summary: "조회 조건과 사용자 정의 점검항목 2단 헤더 목록", width: 1400, height: 680, size: "wide-1400", bodyPadding: "none", scrollMode: "content", contentOwnsFooter: true },
];

function SourcePopupContent({ id, onNavigate }: { id: SourcePopupId; onNavigate: (id: SourcePopupId) => void }) {
  if (id === "cavity") return <CavityContent />;
  if (id === "inventory-add") return <ExactInventoryAddContent />;
  if (id === "inventory-edit") return <ExactInventoryEditContent onDelete={() => onNavigate("inventory-delete")} onMove={() => onNavigate("inventory-move")} />;
  if (id === "inventory-delete") return <ExactInventoryActionContent type="delete" />;
  if (id === "inventory-move") return <ExactInventoryActionContent type="move" />;
  if (id === "purchase") return <ExactPurchaseContent onOpenItems={() => onNavigate("purchase-items")} />;
  if (id === "purchase-items") return <ExactPurchaseItemsContent />;
  return <EquipmentInspectionRecordsContent />;
}

function StaticPopupShell({ popup, children, onReset }: { popup: SourcePopupDefinition; children: React.ReactNode; onReset: () => void }) {
  const actions: DialogAction[] = popup.closeOnly
    ? createDialogActionSet("action-set.close-only", { onDismiss: onReset })
    : createDialogActionSet(popup.confirmLabel === "선택" ? "action-set.cancel-select" : "action-set.cancel-save", { onDismiss: onReset });
  return (
    <div className="flex flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_0_24px_rgba(0,0,0,0.2)]" style={{ width: popup.width, height: popup.height }}>
      <div className="flex h-[52px] shrink-0 items-center border-b border-mes-gray-30 py-[10px] pl-5 pr-[14px]">
        <strong className="flex-1 text-[18px] leading-[1.5]">{popup.title}</strong>
        <Button size="small" variant="lineBlacktxt" className="size-8 border-0 p-0" onClick={onReset} aria-label="미리보기 입력 초기화"><IconX size={20} /></Button>
      </div>
      <div className={cn("flex min-h-0 flex-1 flex-col items-stretch", dialogBodyPaddingClasses[popup.bodyPadding ?? "standard"], dialogBodyScrollClasses[popup.scrollMode ?? "shell"])}>{children}</div>
      {!popup.contentOwnsFooter && <DialogFooter actions={actions} />}
    </div>
  );
}

function SourcePopupGallery() {
  const [selectedId, setSelectedId] = React.useState<SourcePopupId>("inventory-add");
  const [previewVersion, setPreviewVersion] = React.useState(0);
  const [dialogVersion, setDialogVersion] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const selected = SOURCE_POPUPS.find((popup) => popup.id === selectedId)!;

  const selectPopup = (id: SourcePopupId) => {
    setSelectedId(id);
    setPreviewVersion((version) => version + 1);
  };
  const dismissActualPopup = () => {
    setDialogVersion((version) => version + 1);
    setOpen(false);
  };
  const actualActions: DialogAction[] | undefined = selected.closeOnly
    ? createDialogActionSet("action-set.close-only")
    : undefined;

  return (
    <section aria-labelledby="source-popup-gallery-title" className="space-y-4">
      <Card className="border-l-4 border-l-mes-primary-60 bg-mes-gray-20 p-5">
        <div className="flex flex-wrap items-center gap-2"><Tag color="opacityMain" size="compact">원본 코드화</Tag><h3 id="source-popup-gallery-title" className="text-[18px] font-bold">Figma 원본 팝업</h3></div>
        <p className="mt-1.5 text-[13px] leading-5 text-mes-gray-80">업무 메뉴가 아니라 팝업의 위치와 본문 구조로 분류합니다. 선택한 팝업은 아래에 즉시 렌더링되며, 별도 실행 없이 전체 디자인과 상태를 확인할 수 있습니다.</p>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
          {GROUPS.map((group) => (
            <Card key={group.id} className="p-4">
              <h4 className="text-[14px] font-bold">{group.label}</h4>
              <p className="mt-1 text-[11px] leading-4 text-mes-gray-60">{group.description}</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {SOURCE_POPUPS.filter((popup) => popup.group === group.id).map((popup) => (
                  <Button key={popup.id} size="small" variant={selectedId === popup.id ? "fillBlack" : "lineBlacktxt"} className="h-auto min-h-8 justify-start px-2.5 py-1.5 text-left" onClick={() => selectPopup(popup.id)}>
                    {popup.label}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
      </div>

        <div className="min-w-0 pt-1">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div><div className="flex items-center gap-2"><Tag color="gray" size="compact">중앙 팝업</Tag><strong className="text-[16px]">{selected.label}</strong></div><p className="mt-1 text-[12px] text-mes-gray-60">{selected.summary} · {selected.width}×{selected.height} · node {selected.node}</p></div>
            <Button size="small" variant="fillBlack" onClick={() => setOpen(true)}>실제 팝업으로 열기</Button>
          </div>
          <FigmaScreenPreview sourceWidth={selected.width} sourceHeight={selected.height} maxScale={1} className="bg-mes-gray-60 p-0">
            <StaticPopupShell popup={selected} onReset={() => setPreviewVersion((version) => version + 1)}>
              <SourcePopupContent key={`${selected.id}-${previewVersion}`} id={selected.id} onNavigate={selectPopup} />
            </StaticPopupShell>
          </FigmaScreenPreview>
        </div>

      <CenterModal
        open={open}
        onOpenChange={setOpen}
        onCancel={dismissActualPopup}
        onConfirm={dismissActualPopup}
        title={selected.title}
        size={selected.size}
        exactWidth={selected.width}
        exactHeight={selected.height}
        maxHeight="calc(100vh - 40px)"
        bodyPadding={selected.bodyPadding}
        scrollMode={selected.scrollMode}
        bodyAlign="stretch"
        cancelLabel="취소"
        confirmLabel={selected.confirmLabel ?? "저장"}
        actions={actualActions}
        footer={selected.contentOwnsFooter ? <></> : undefined}
      >
        <SourcePopupContent key={`${selected.id}-dialog-${dialogVersion}`} id={selected.id} onNavigate={selectPopup} />
      </CenterModal>
    </section>
  );
}

export { SourcePopupGallery };
