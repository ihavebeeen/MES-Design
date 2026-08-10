"use client";

import * as React from "react";
import { IconReload } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LabeledInput } from "@/components/ui/labeled-input";
import { LabeledSelect } from "@/components/ui/labeled-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

type ActionType = "delete" | "move";

interface ActionRow {
  id: string;
  item: string;
  itemType: string;
  lotNo: string;
  warehouse: string;
  quantity: number;
  unit: string;
}

const ROWS: ActionRow[] = Array.from({ length: 7 }, (_, index) => ({
  id: `action-${index + 1}`,
  item: "1500얼려먹는트레이",
  itemType: "완제품",
  lotNo: "A0401-123-123",
  warehouse: "B창고",
  quantity: 1000,
  unit: "kg",
}));

function ExactInventoryActionContent({ type }: { type: ActionType }) {
  const deleting = type === "delete";
  const [targetQuantity, setTargetQuantity] = React.useState("0");
  const [bulkType, setBulkType] = React.useState("선택");
  const [bulkReason, setBulkReason] = React.useState("선택");
  const [bulkWarehouse, setBulkWarehouse] = React.useState("선택");
  const [quantities, setQuantities] = React.useState<Record<string, string>>(() => Object.fromEntries(ROWS.map((row) => [row.id, "1000"])));
  const [types, setTypes] = React.useState<Record<string, string>>(() => Object.fromEntries(ROWS.map((row, index) => [row.id, index < 4 ? ["매각", "불용", "반품", "재고조정"][index] : "불량"])));
  const [reasons, setReasons] = React.useState<Record<string, string>>(() => Object.fromEntries(ROWS.map((row, index) => [row.id, index < 4 ? "-" : `불량 사유 ${index - 3}`])));
  const [moveWarehouses, setMoveWarehouses] = React.useState<Record<string, string>>(() => Object.fromEntries(ROWS.map((row) => [row.id, "불량창고"])));

  const applyBulk = () => {
    const numeric = targetQuantity.replace(/[^0-9]/g, "");
    if (numeric) setQuantities(Object.fromEntries(ROWS.map((row) => [row.id, numeric])));
    if (deleting) {
      if (bulkType !== "선택") setTypes(Object.fromEntries(ROWS.map((row) => [row.id, bulkType])));
      if (bulkReason !== "선택") setReasons(Object.fromEntries(ROWS.map((row) => [row.id, bulkReason])));
    } else if (bulkWarehouse !== "선택") {
      setMoveWarehouses(Object.fromEntries(ROWS.map((row) => [row.id, bulkWarehouse])));
    }
  };

  const baseColumns: TableColumn<ActionRow>[] = [
    { key: "item", label: "품목", width: deleting ? 140 : 160, render: (row) => row.item },
    { key: "itemType", label: "품목구분", width: deleting ? 100 : 110, align: "center", render: (row) => row.itemType },
    { key: "lotNo", label: "LOT NO", width: deleting ? 140 : 150, align: "center", render: (row) => row.lotNo },
    { key: "warehouse", label: "창고명", width: deleting ? 100 : 110, align: "center", render: (row) => row.warehouse },
    { key: "quantity", label: "수량", width: deleting ? 90 : 100, align: "right", render: (row) => row.quantity.toLocaleString("ko-KR") },
    { key: "unit", label: "단위", width: 60, render: (row) => row.unit },
  ];
  const columns: TableColumn<ActionRow>[] = deleting ? [
    ...baseColumns,
    { key: "deleteQuantity", label: "삭제 수량", width: 110, render: (row) => <ActionQuantity row={row} values={quantities} setValues={setQuantities} label="삭제 수량" /> },
    { key: "type", label: "유형", width: 110, render: (row) => <ActionSelect label={`${row.id} 유형`} value={types[row.id]} options={["매각", "불용", "반품", "재고조정", "불량"]} onChange={(value) => setTypes((current) => ({ ...current, [row.id]: value }))} /> },
    { key: "reason", label: "불량 사유", width: 123, render: (row) => <ActionSelect label={`${row.id} 불량 사유`} value={reasons[row.id]} options={["-", "불량 사유 1", "불량 사유 2", "불량 사유 3"]} onChange={(value) => setReasons((current) => ({ ...current, [row.id]: value }))} /> },
  ] : [
    ...baseColumns,
    { key: "moveQuantity", label: "이동 수량", width: 120, render: (row) => <ActionQuantity row={row} values={quantities} setValues={setQuantities} label="이동 수량" /> },
    { key: "moveWarehouse", label: "이동 창고", width: 163, render: (row) => <ActionSelect label={`${row.id} 이동 창고`} value={moveWarehouses[row.id]} options={["불량창고", "입고기본창고", "B창고"]} onChange={(value) => setMoveWarehouses((current) => ({ ...current, [row.id]: value }))} /> },
  ];
  const tableRows: TableRowData<ActionRow>[] = ROWS.map((row) => ({ id: row.id, data: row }));

  return (
    <div className="flex h-[312px] w-full flex-col gap-5">
      <div className="flex h-[52px] shrink-0 items-center bg-mes-gray-20 pl-10 pr-[10px]">
        <div className="flex items-center gap-2 text-[15px] font-semibold"><IconReload size={18} />일괄 변경</div>
        <div className="ml-auto flex gap-[10px]">
          <LabeledInput label="대상 수량" value={targetQuantity} onChange={(event) => setTargetQuantity(event.target.value.replace(/[^0-9]/g, ""))} className="w-[180px]" inputMode="numeric" />
          {deleting ? <>
            <LabeledSelect label="유형" value={bulkType} options={["선택", "매각", "불용", "반품", "재고조정", "불량"]} onValueChange={setBulkType} className="w-[180px]" />
            <LabeledSelect label="불량 사유" value={bulkReason} options={["선택", "불량 사유 1", "불량 사유 2", "불량 사유 3"]} onValueChange={setBulkReason} className="w-[180px]" />
          </> : <LabeledSelect label="이동 창고" value={bulkWarehouse} options={["선택", "불량창고", "입고기본창고", "B창고"]} onValueChange={setBulkWarehouse} className="w-[180px]" />}
          <Button size="small" className="w-[60px] px-0" onClick={applyBulk}>적용</Button>
        </div>
      </div>
      <Table columns={columns} rows={tableRows} selectable={false} edgePadding={0} columnDividers={false} horizontalScroll={false} className="h-[240px] shrink-0" />
    </div>
  );
}

function ActionQuantity({ row, values, setValues, label }: { row: ActionRow; values: Record<string, string>; setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>; label: string }) {
  return <Input size="small" inputMode="numeric" aria-label={`${row.id} ${label}`} value={Number(values[row.id] || 0).toLocaleString("ko-KR")} onChange={(event) => setValues((current) => ({ ...current, [row.id]: event.target.value.replace(/[^0-9]/g, "") }))} className="text-right" />;
}

function ActionSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger size="small" aria-label={label}><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>;
}

export { ExactInventoryActionContent };
