"use client";

import * as React from "react";
import { IconArrow, IconPlus, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SideSlidePanel } from "@/components/ui/side-slide-panel";
import { SectionBand } from "./mes-screen-fixtures";

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

function isComplete(row: EasyModeReceivingRow) {
  return Boolean(row.customer && row.warehouse && row.item && Number(row.quantity) > 0);
}

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="text-[14px] font-normal leading-[1.5] text-mes-gray-130">
      {children}
      {required && <span className="ml-[3px] font-semibold text-mes-danger-60">*</span>}
    </span>
  );
}

function LabeledControl({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-2">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="min-w-0">{children}</div>
    </div>
  );
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
  const [receivingDate, setReceivingDate] = React.useState<Date | null>(null);
  const [rows, setRows] = React.useState<EasyModeReceivingRow[]>([createEmptyRow(1)]);
  const [optionalOpen, setOptionalOpen] = React.useState(false);
  const [receivingType, setReceivingType] = React.useState("일반입고");
  const [memo, setMemo] = React.useState("");
  const committed = React.useRef({ receivingDate: null as Date | null, rows: [createEmptyRow(1)], optionalOpen: false, receivingType: "일반입고", memo: "" });

  const restoreCommitted = React.useCallback(() => {
    setReceivingDate(committed.current.receivingDate ? new Date(committed.current.receivingDate) : null);
    setRows(cloneRows(committed.current.rows));
    setOptionalOpen(committed.current.optionalOpen);
    setReceivingType(committed.current.receivingType);
    setMemo(committed.current.memo);
  }, []);

  const updateRow = (id: number, patch: Partial<EasyModeReceivingRow>) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
  };

  const addRow = () => {
    setRows((current) => {
      const previousRow = current[current.length - 1];
      if (!previousRow || !isComplete(previousRow)) return current;

      const nextId = Math.max(...current.map((row) => row.id)) + 1;
      return [...current, createEmptyRow(nextId, previousRow.customer)];
    });
  };

  const canSave = Boolean(receivingDate && rows.length > 0 && rows.every(isComplete));
  const save = () => {
    if (!receivingDate || !canSave) return;
    const savedRows = cloneRows(rows);
    committed.current = { receivingDate: new Date(receivingDate), rows: savedRows, optionalOpen, receivingType, memo };
    onSave?.({ receivingDate: new Date(receivingDate), rows: savedRows, receivingType, memo });
    onOpenChange(false);
  };

  return (
    <SideSlidePanel
      open={open}
      onOpenChange={onOpenChange}
      onCancel={restoreCommitted}
      title="입고등록"
      size="standard-900"
      contentClassName="items-stretch overflow-x-hidden p-0"
      actions={[
        { id: "cancel", label: "취소", variant: "fillGray" },
        { id: "save", label: "저장", variant: "fillBlack", disabled: !canSave, onClick: save },
      ]}
    >
      <div className="flex h-full w-full flex-col" data-easy-receiving-content>
        <section className="shrink-0 border-b border-mes-gray-30 p-5">
          <SectionBand>기본정보</SectionBand>
          <div className="mt-3 grid grid-cols-2 gap-x-6">
            <LabeledControl label="입고일" required>
              <DatePicker value={receivingDate} onValueChange={setReceivingDate} separator="-" />
            </LabeledControl>
          </div>
        </section>

        <section className="shrink-0 px-5 pt-5">
          <div className="rounded-lg bg-mes-gray-20 px-4 pb-4 pt-3">
            <div className="flex items-center justify-between">
              <b className="text-[16px] font-bold leading-[1.5] text-mes-gray-130">품목/수량 직접 입력</b>
              <span className="text-[13px] font-normal text-mes-gray-70">지시 없이 입고실적을 등록합니다.</span>
            </div>

            <div className="mt-3 overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white">
              <div className="grid h-8 grid-cols-[24px_minmax(110px,1.2fr)_minmax(90px,1fr)_minmax(150px,1.6fr)_86px_54px_minmax(100px,1.1fr)_24px] items-center gap-1.5 border-b border-mes-gray-30 bg-mes-gray-10 px-2.5">
                <span />
                {['거래처', '창고', '품목', '수량'].map((label) => <span key={label} className="text-[13px] font-semibold text-mes-gray-130">{label}<span className="ml-[3px] text-mes-danger-60">*</span></span>)}
                <span className="text-[13px] font-semibold text-mes-gray-130">단위</span>
                <span className="text-[13px] font-semibold text-mes-gray-130">입고 LOT</span>
                <span />
              </div>

              <div className="divide-y divide-mes-gray-30">
                {rows.map((row, index) => {
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
                      {rows.length > 1 ? <IconButton aria-label={`${index + 1}행 삭제`} size="xsmall" icon={<IconTrash size={14} />} onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} /> : <span />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex justify-center">
              <Button size="small" variant="lineMain" className="w-[160px]" startIcon={<IconPlus size={15} />} disabled={!isComplete(rows[rows.length - 1])} onClick={addRow}>행 추가</Button>
            </div>
          </div>
        </section>

        <section className="shrink-0 p-5">
          <Button
            type="button"
            variant="lineBlacktxt"
            size="small"
            className="h-7 w-full justify-start border-0 bg-mes-gray-30 px-2.5 text-left text-[14px] font-bold text-mes-gray-100 hover:bg-mes-gray-30"
            onClick={() => setOptionalOpen((current) => !current)}
            aria-expanded={optionalOpen}
          >
            <span>선택 항목</span>
            <span className="ml-2 text-[13px] font-normal text-mes-gray-70">입력하지 않아도 됩니다.</span>
            <span className="ml-auto flex items-center gap-1.5 text-[13px] font-normal text-mes-gray-80">{optionalOpen ? "접기" : "펼치기"}<IconArrow size={12} className={optionalOpen ? "-rotate-90" : "rotate-90"} /></span>
          </Button>

          {optionalOpen && (
            <div className="mt-3 grid grid-cols-2 gap-x-6">
              <LabeledControl label="입고구분">
                <ReceivingSelect value={receivingType} placeholder="입고구분" options={["일반입고", "반품입고", "기타"]} onValueChange={setReceivingType} ariaLabel="입고구분" />
              </LabeledControl>
              <LabeledControl label="비고">
                <Input value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="내용 입력" aria-label="비고" />
              </LabeledControl>
            </div>
          )}
        </section>
      </div>
    </SideSlidePanel>
  );
}
