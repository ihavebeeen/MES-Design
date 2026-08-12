"use client";

import * as React from "react";
import { IconPlus, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormFieldRow, FormGrid } from "@/components/ui/form-grid";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SectionFrame } from "@/components/ui/section-frame";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SideSlidePanel } from "@/components/ui/side-slide-panel";
import { useCommittedDraft, useRowMutationPolicy } from "@/design-system/behavior-patterns";
import { EditableRowListSection } from "./section-patterns";
import { createDialogActionSet } from "@/design-system/action-sets";

const CUSTOMER_OPTIONS = ["동진산업", "선호유통", "D업체"];
const WAREHOUSE_OPTIONS = ["본창고", "동진창고", "임가공창고"];
const ITEM_OPTIONS = [
  { value: "비비빅", unit: "kg" },
  { value: "죠스바", unit: "kg" },
  { value: "빵빠레 꿀고구마", unit: "kg" },
  { value: "누가바 피스타치오", unit: "EA" },
];

export interface EasyModeReceivingRow {
  id: number;
  customer: string;
  warehouse: string;
  item: string;
  quantity: string;
  lot: string;
}

export interface EasyModeReceivingData {
  receivingDate: Date;
  rows: EasyModeReceivingRow[];
  receivingType: string;
  memo: string;
}

export interface EasyModeReceivingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: EasyModeReceivingData) => void;
}

function createEmptyRow(id: number, customer = ""): EasyModeReceivingRow {
  return { id, customer, warehouse: "본창고", item: "", quantity: "0", lot: "" };
}

function cloneRows(rows: EasyModeReceivingRow[]) {
  return rows.map((row) => ({ ...row }));
}

interface EasyModeReceivingDraft {
  receivingDate: Date | null;
  rows: EasyModeReceivingRow[];
  receivingType: string;
  memo: string;
}

const INITIAL_EASY_MODE_DRAFT: EasyModeReceivingDraft = {
  receivingDate: null,
  rows: [createEmptyRow(1)],
  receivingType: "일반입고",
  memo: "",
};

function cloneDraft(draft: EasyModeReceivingDraft): EasyModeReceivingDraft {
  return {
    receivingDate: draft.receivingDate ? new Date(draft.receivingDate) : null,
    rows: cloneRows(draft.rows),
    receivingType: draft.receivingType,
    memo: draft.memo,
  };
}

function isComplete(row: EasyModeReceivingRow) {
  return Boolean(row.customer && row.warehouse && row.item && Number(row.quantity) > 0);
}

function ReceivingSelect({ value, placeholder, options, onValueChange, ariaLabel }: { value: string; placeholder: string; options: string[]; onValueChange: (value: string) => void; ariaLabel: string }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={ariaLabel}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
    </Select>
  );
}

export function EasyModeReceivingDialog({ open, onOpenChange, onSave }: EasyModeReceivingDialogProps) {
  const { draft, setDraft, commit, restore } = useCommittedDraft({ initialValue: INITIAL_EASY_MODE_DRAFT, clone: cloneDraft });
  const nextRowId = React.useRef(2);

  const rowMutation = useRowMutationPolicy<EasyModeReceivingRow, number>({
    initialRows: INITIAL_EASY_MODE_DRAFT.rows,
    rows: draft.rows,
    onRowsChange: (action) => setDraft((current) => ({
      ...current,
      rows: typeof action === "function" ? action(current.rows) : action,
    })),
    getId: (row) => row.id,
    createRow: (previousRow) => createEmptyRow(nextRowId.current++, previousRow?.customer),
    canAdd: (current) => Boolean(current[current.length - 1] && isComplete(current[current.length - 1])),
    minRows: 1,
    insertPosition: "end",
  });

  const updateRow = (id: number, patch: Partial<EasyModeReceivingRow>) => {
    rowMutation.setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
  };

  const canSave = Boolean(draft.receivingDate && draft.rows.length > 0 && draft.rows.every(isComplete));
  const save = () => {
    if (!draft.receivingDate || !canSave) return;
    const saved = commit();
    onSave?.({ receivingDate: new Date(saved.receivingDate!), rows: saved.rows, receivingType: saved.receivingType, memo: saved.memo });
    onOpenChange(false);
  };

  return (
    <SideSlidePanel
      open={open}
      onOpenChange={onOpenChange}
      onCancel={restore}
      title="입고등록"
      size="standard-900"
      bodyPadding="none"
      bodyAlign="stretch"
      actions={createDialogActionSet("action-set.cancel-save", { onPrimary: save, primaryDisabled: !canSave })}
    >
      <div className="flex h-full w-full flex-col" data-easy-receiving-content>
        <SectionFrame title="기본정보" divider="bottom">
          <FormGrid columns={2} density="compact">
            <FormFieldRow label="입고일" required>
              <DatePicker value={draft.receivingDate} onValueChange={(receivingDate) => setDraft((current) => ({ ...current, receivingDate }))} separator="-" />
            </FormFieldRow>
          </FormGrid>
        </SectionFrame>

        <SectionFrame title="품목/수량 직접 입력" divider="bottom">
          <EditableRowListSection
            header={
              <div className="grid h-8 grid-cols-[24px_minmax(110px,1.2fr)_minmax(90px,1fr)_minmax(150px,1.6fr)_86px_54px_minmax(100px,1.1fr)_24px] items-center gap-1.5 border-b border-mes-gray-30 bg-mes-gray-10 px-2.5">
                <span />
                {['거래처', '창고', '품목', '수량'].map((label) => <span key={label} className="text-[13px] font-semibold text-mes-gray-130">{label}<span className="ml-[3px] text-mes-danger-60">*</span></span>)}
                <span className="text-[13px] font-semibold text-mes-gray-130">단위</span>
                <span className="text-[13px] font-semibold text-mes-gray-130">입고 LOT</span>
                <span />
              </div>
            }
            listClassName="divide-y divide-mes-gray-30"
            addAction={
              <div className="mt-3 flex justify-center">
                <Button size="small" variant="lineMain" className="w-[160px]" startIcon={<IconPlus size={15} />} disabled={!rowMutation.addAllowed} onClick={rowMutation.add}>행 추가</Button>
              </div>
            }
          >
                {rowMutation.rows.map((row, index) => {
                  const unit = ITEM_OPTIONS.find((item) => item.value === row.item)?.unit ?? "-";
                  return (
                    <div key={row.id} className="grid min-h-12 grid-cols-[24px_minmax(110px,1.2fr)_minmax(90px,1fr)_minmax(150px,1.6fr)_86px_54px_minmax(100px,1.1fr)_24px] items-center gap-1.5 px-2.5 py-2">
                      <span className="text-center text-[13px] font-normal text-mes-gray-60">{index + 1}</span>
                      <ReceivingSelect value={row.customer} placeholder="선택" options={CUSTOMER_OPTIONS} onValueChange={(customer) => updateRow(row.id, { customer })} ariaLabel={`${index + 1}행 거래처`} />
                      <ReceivingSelect value={row.warehouse} placeholder="창고" options={WAREHOUSE_OPTIONS} onValueChange={(warehouse) => updateRow(row.id, { warehouse })} ariaLabel={`${index + 1}행 창고`} />
                      <ReceivingSelect value={row.item} placeholder="품목 선택" options={ITEM_OPTIONS.map((item) => item.value)} onValueChange={(item) => updateRow(row.id, { item })} ariaLabel={`${index + 1}행 품목`} />
                      <Input value={row.quantity} onChange={(event) => updateRow(row.id, { quantity: event.target.value.replace(/[^0-9]/g, "") })} inputMode="numeric" aria-label={`${index + 1}행 수량`} className="text-right" />
                      <Input value={unit} readOnly aria-label={`${index + 1}행 단위`} className="px-1 text-center text-mes-gray-70" />
                      <Input value={row.lot} onChange={(event) => updateRow(row.id, { lot: event.target.value })} aria-label={`${index + 1}행 입고 LOT`} />
                      {rowMutation.canDelete ? <IconButton aria-label={`${index + 1}행 삭제`} size="xsmall" icon={<IconTrash size={14} />} onClick={() => rowMutation.remove(row.id)} /> : <span />}
                    </div>
                  );
                })}
          </EditableRowListSection>
        </SectionFrame>

        <SectionFrame title="선택 항목">
          <FormGrid columns={2} density="compact">
            <FormFieldRow label="입고구분">
              <ReceivingSelect value={draft.receivingType} placeholder="입고구분" options={["일반입고", "반품입고", "기타"]} onValueChange={(receivingType) => setDraft((current) => ({ ...current, receivingType }))} ariaLabel="입고구분" />
            </FormFieldRow>
            <FormFieldRow label="비고">
              <Input value={draft.memo} onChange={(event) => setDraft((current) => ({ ...current, memo: event.target.value }))} placeholder="내용 입력" aria-label="비고" />
            </FormFieldRow>
          </FormGrid>
        </SectionFrame>
      </div>
    </SideSlidePanel>
  );
}
