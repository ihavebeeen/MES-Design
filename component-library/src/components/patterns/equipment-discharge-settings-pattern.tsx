"use client";

import * as React from "react";
import { IconReload } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ContentRegionHeading } from "@/components/ui/content-region-heading";
import { Filter } from "@/components/ui/filter";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

interface ItemRow {
  code: string;
  item: string;
  type: string;
  unit: string;
  process: string;
}

interface EquipmentRow {
  code: string;
  name: string;
  type: string;
  process: string;
  output: string;
}

const items: TableRowData<ItemRow>[] = [
  { id: "P0001", data: { code: "P0001", item: "1500엘러먼트레이-SHEET", type: "완제품", unit: "EA", process: "성형" } },
  { id: "P0002", data: { code: "P0002", item: "1500엘러먼트레이", type: "완제품", unit: "EA", process: "성형" } },
  { id: "P0003", data: { code: "P0003", item: "더블비안코", type: "완제품", unit: "EA", process: "성형" } },
  { id: "P0004", data: { code: "P0004", item: "메가톤", type: "완제품", unit: "EA", process: "성형" } },
  { id: "P0005", data: { code: "P0005", item: "찰옥수수", type: "완제품", unit: "EA", process: "포장" } },
  { id: "P0006", data: { code: "P0006", item: "수박바", type: "완제품", unit: "EA", process: "포장" } },
  { id: "P0007", data: { code: "P0007", item: "비비빅", type: "완제품", unit: "EA", process: "포장" } },
  { id: "P0008", data: { code: "P0008", item: "스크류 캡", type: "반제품", unit: "EA", process: "압축" } },
  { id: "P0009", data: { code: "P0009", item: "케이스", type: "반제품", unit: "EA", process: "압축" } },
  { id: "P0010", data: { code: "P0010", item: "원료 A", type: "원재료", unit: "kg", process: "혼합" } },
  { id: "P0011", data: { code: "P0011", item: "원료 B", type: "원재료", unit: "kg", process: "혼합" } },
  { id: "P0012", data: { code: "P0012", item: "포장 박스", type: "부자재", unit: "EA", process: "포장" } },
  { id: "P0013", data: { code: "P0013", item: "라벨", type: "부자재", unit: "EA", process: "포장" } },
  { id: "P0014", data: { code: "P0014", item: "팔레트", type: "부자재", unit: "EA", process: "출하" } },
];

const equipment: TableRowData<EquipmentRow>[] = Array.from({ length: 9 }, (_, index) => ({
  id: `EQ00${index + 1}`,
  data: {
    code: `EQ00${index + 1}`,
    name: `A${index + 1}`,
    type: "사출성형기",
    process: "성형",
    output: index === 0 ? "37500" : index === 1 || index > 6 ? "" : "36000",
  },
}));

const itemColumns: TableColumn<ItemRow>[] = [
  { key: "code", label: "품목코드", width: 100, align: "center", render: (row) => row.code },
  { key: "item", label: "품목", width: 200, render: (row) => row.item },
  { key: "type", label: "품목구분", width: 82, align: "center", render: (row) => row.type },
  { key: "unit", label: "단위", width: 83, align: "center", render: (row) => row.unit },
  { key: "process", label: "공정", width: 70, align: "center", render: (row) => row.process },
];

const initialOutputs = Object.fromEntries(equipment.map((row) => [row.id, row.data.output]));
const itemTypeOptions = ["완제품", "반제품", "원재료", "부자재", "상품"].map((label) => ({ id: label, label }));
const processOptions = Array.from({ length: 23 }, (_, index) => ({ id: `공정-${index + 1}`, label: index === 0 ? "성형" : `공정 ${index + 1}` }));

function sanitizeDecimal(value: string) {
  const normalized = value.replace(/[^\d.]/g, "");
  const [integer = "", ...decimalParts] = normalized.split(".");
  const decimal = decimalParts.join("").slice(0, 2);
  return normalized.includes(".") ? `${integer}.${decimal}` : integer;
}

interface EquipmentDischargeSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialItemId?: string | null;
}

function EquipmentDischargeSettingsModal({ open, onOpenChange, initialItemId = null }: EquipmentDischargeSettingsModalProps) {
  const initialEquipmentSelection = initialItemId ? ["EQ001", "EQ002"] : [];
  const [committedItemId, setCommittedItemId] = React.useState<string | null>(initialItemId);
  const [draftItemId, setDraftItemId] = React.useState<string | null>(initialItemId);
  const [committedEquipmentIds, setCommittedEquipmentIds] = React.useState(initialEquipmentSelection);
  const [draftEquipmentIds, setDraftEquipmentIds] = React.useState(initialEquipmentSelection);
  const [committedOutputs, setCommittedOutputs] = React.useState<Record<string, string>>(initialOutputs);
  const [draftOutputs, setDraftOutputs] = React.useState<Record<string, string>>(initialOutputs);
  const [batchOutput, setBatchOutput] = React.useState(initialItemId ? "36000" : "");
  const [itemSearch, setItemSearch] = React.useState("");
  const [equipmentSearch, setEquipmentSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string[]>>({
    itemType: itemTypeOptions.map((option) => option.id),
    process: processOptions.map((option) => option.id),
  });
  const [savedOpen, setSavedOpen] = React.useState(false);

  const dismiss = React.useCallback(() => {
    setDraftItemId(committedItemId);
    setDraftEquipmentIds(committedEquipmentIds);
    setDraftOutputs(committedOutputs);
    setBatchOutput(committedItemId ? "36000" : "");
    setItemSearch("");
    setEquipmentSearch("");
  }, [committedEquipmentIds, committedItemId, committedOutputs]);

  const visibleItems = React.useMemo(() => {
    const query = itemSearch.trim().toLowerCase();
    return items.filter((row) => !query || Object.values(row.data).some((value) => value.toLowerCase().includes(query)));
  }, [itemSearch]);

  const activeItem = items.find((row) => row.id === draftItemId)?.data ?? null;
  const visibleEquipment = React.useMemo(() => {
    if (!activeItem) return [];
    const query = equipmentSearch.trim().toLowerCase();
    return equipment.filter((row) => row.data.process === activeItem.process && (!query || Object.values(row.data).some((value) => value.toLowerCase().includes(query))));
  }, [activeItem, equipmentSearch]);

  const selectItem = (ids: string[]) => {
    const nextId = ids.find((id) => id !== draftItemId) ?? null;
    setDraftItemId(nextId);
    setDraftEquipmentIds(nextId ? ["EQ001", "EQ002"] : []);
    setBatchOutput(nextId ? "36000" : "");
  };

  const applyBatch = () => {
    if (!activeItem || !batchOutput) return;
    setDraftOutputs((current) => ({
      ...current,
      ...Object.fromEntries(visibleEquipment.map((row) => [row.id, batchOutput])),
    }));
  };

  const equipmentColumns = React.useMemo<TableColumn<EquipmentRow>[]>(() => [
    { key: "code", label: "설비코드", width: 100, align: "center", render: (row) => row.code },
    { key: "name", label: "설비명", width: 140, render: (row) => row.name },
    { key: "type", label: "설비구분", width: 100, align: "center", render: (row) => row.type },
    { key: "process", label: "공정", width: 70, align: "center", render: (row) => row.process },
    {
      key: "output",
      label: "시간당 생산량",
      width: 140,
      align: "right",
      render: (row) => (
        <Input
          aria-label={`${row.code} 시간당 생산량`}
          size="small"
          inputMode="decimal"
          disabled={!draftEquipmentIds.includes(row.code)}
          value={draftOutputs[row.code] ?? ""}
          onChange={(event) => setDraftOutputs((current) => ({ ...current, [row.code]: sanitizeDecimal(event.target.value) }))}
          className="ml-auto w-[120px] text-right"
        />
      ),
    },
  ], [draftEquipmentIds, draftOutputs]);

  const save = () => {
    setCommittedItemId(draftItemId);
    setCommittedEquipmentIds(draftEquipmentIds);
    setCommittedOutputs(draftOutputs);
    setSavedOpen(true);
  };

  return (
      <CenterModal
        open={open}
        onOpenChange={onOpenChange}
        onCancel={dismiss}
        onConfirm={save}
        title="품목 생산량 설정"
        exactWidth={1257}
        exactHeight={680}
        maxHeight={680}
        bodyPadding="none"
        bodyAlign="stretch"
        scrollMode="content"
      >
        <div data-testid="equipment-discharge-modal-body" className="grid h-full min-h-0 grid-cols-[611px_626px] gap-5 overflow-hidden">
          <section data-testid="item-list-panel" className="flex min-h-0 flex-col pl-5">
            <div className="flex h-[52px] shrink-0 items-center">
              <h2 className="text-[16px] font-bold leading-6 text-mes-gray-130">품목 리스트</h2>
            </div>
            <div data-testid="item-toolbar" className="flex h-12 shrink-0 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3">
              <Filter
                categories={[
                  { id: "itemType", label: "품목구분", options: itemTypeOptions },
                  { id: "process", label: "공정", options: processOptions },
                ]}
                value={filters}
                onChange={(id, values) => setFilters((current) => ({ ...current, [id]: values }))}
              />
              <SearchInput value={itemSearch} onChange={setItemSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" />
            </div>
            <div className="h-[440px] min-h-0 overflow-y-auto">
              <Table
                columns={itemColumns}
                rows={visibleItems}
                selectedIds={draftItemId ? [draftItemId] : []}
                activeId={draftItemId}
                onSelectedIdsChange={selectItem}
                onActiveIdChange={(id) => selectItem(id ? [id] : [])}
                selectionColor="black"
                unselectedCheckboxAppearance="grayCheck"
                selectionHeaderIndeterminate={false}
                edgePadding={0}
                selectionColumnWidth={56}
                centerSelection
                headerBackground="white"
                columnDividerMode="none"
                horizontalScroll={false}
                className="rounded-none border-x-0 border-t-0"
              />
            </div>
          </section>

          <section data-testid="equipment-list-panel" className="flex min-h-0 flex-col pr-5">
            <div className="flex h-[52px] shrink-0 items-center justify-between">
              <ContentRegionHeading>설비 리스트</ContentRegionHeading>
              <SearchInput value={equipmentSearch} onChange={setEquipmentSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" />
            </div>
            <div data-testid="equipment-batch-toolbar" className="flex h-12 shrink-0 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3">
              <span className="flex items-center gap-1.5 text-[14px] font-semibold text-mes-gray-130"><IconReload size={16} />전체 일괄 변경</span>
              <div className="flex items-center gap-2">
                <Input aria-label="전체 시간당 생산량" value={batchOutput} onChange={(event) => setBatchOutput(sanitizeDecimal(event.target.value))} inputMode="decimal" disabled={!activeItem} className="w-[180px] text-right" />
                <Button size="small" className="w-[60px]" disabled={!activeItem || !batchOutput} onClick={applyBatch}>적용</Button>
              </div>
            </div>
            <div className="relative mt-4 h-[440px] min-h-0 overflow-y-auto">
              <Table
                columns={equipmentColumns}
                rows={visibleEquipment}
                selectedIds={draftEquipmentIds}
                onSelectedIdsChange={setDraftEquipmentIds}
                selectionColor="black"
                unselectedCheckboxAppearance="grayCheck"
                selectionHeaderIndeterminate={false}
                edgePadding={0}
                selectionColumnWidth={56}
                centerSelection
                headerBackground="white"
                columnDividerMode="none"
                horizontalScroll={false}
                className="rounded-none border-x-0 border-t-0"
              />
              {!activeItem && <p className="pointer-events-none absolute inset-x-0 top-[190px] text-center text-[14px] text-mes-gray-70">좌측 품목 리스트에서 품목을 선택해주세요.</p>}
            </div>
          </section>
        </div>
        <ConfirmDialog
          open={savedOpen}
          onOpenChange={setSavedOpen}
          title="알림"
          heading="저장 완료"
          description="시간당 생산량이 저장되었습니다."
          tone="info"
          className="w-[400px]"
          actions={[{ label: "확인", variant: "fillBlack", onClick: () => setSavedOpen(false) }]}
        />
      </CenterModal>
  );
}

function EquipmentDischargeSettingsVisualFixture() {
  const [open, setOpen] = React.useState(true);
  const [fixtureKey, setFixtureKey] = React.useState(0);

  const reopen = () => {
    setFixtureKey((current) => current + 1);
    setOpen(true);
  };

  return (
    <main className="relative h-[900px] w-[1440px] bg-white">
      <Button aria-label="품목 생산량 설정 다시 열기" size="small" variant="fillBlack" className="absolute left-5 top-5 opacity-0" onClick={reopen}>설정 열기</Button>
      <EquipmentDischargeSettingsModal key={fixtureKey} open={open} onOpenChange={setOpen} initialItemId="P0001" />
    </main>
  );
}

export { EquipmentDischargeSettingsModal, EquipmentDischargeSettingsVisualFixture };
