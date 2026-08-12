"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CenterModal } from "@/components/ui/center-modal";
import { DatePicker } from "@/components/ui/date-picker";
import { IconButton } from "@/components/ui/icon-button";
import { Link } from "@/components/ui/link";
import { Tag } from "@/components/ui/tag";
import {
  IconExclamationCircle,
  IconPlus,
  IconScan,
  IconTrash,
  IconX,
} from "@/components/icons";
import {
  FixtureFilter,
  FixtureInput,
  FixtureSearch,
  FixtureSelect,
  FixtureTable,
  SectionBand,
} from "./mes-screen-fixtures";
import { ResultTotalCard, TableTotalRow } from "./section-patterns";
import { createDialogActionSet } from "@/design-system/action-sets";


const materialRows = [
  ["LOT-AA-11", "박스", "반제품", "A", "0", "kg", "동진창고"],
  ["LOT-AA-12", "박스", "반제품", "A", "0", "kg", "동진창고"],
  ["LOT-AA-13", "박스", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-13", "원재료4", "반제품", "아사노", "86,432", "kg", "동진창고"],
  ["LOT-AA-13", "원재료9", "반제품", "아사노", "346,865", "kg", "동진창고"],
  ["LOT-AA-14", "비닐125*125", "반제품", "아사노", "124,000", "kg", "동진창고"],
  ["LOT-AA-15", "더블비앙코", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-16", "더블비앙코 뚜껑-BX", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-17", "유기농 두부-BX", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-18", "BIO 치킨용-BX", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-19", "지팩 리드 중-BX", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-11", "더블비앙코", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-11", "더블비앙코", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-11", "더블비앙코", "반제품", "아사노", "1000", "kg", "동진창고"],
  ["LOT-AA-11", "더블비앙코", "반제품", "아사노", "1000", "kg", "동진창고"],
];

const requirementRows = [
  ["롯데 일품팥빙수 TRAY-SHEET", "1,400", "2,000", "-", "2,000"],
  ["비닐125*125", "124,000", "4,000", "-", "4,000"],
  ["박스", "456,789", "12,000", "6,500", "5,500"],
  ["원재료4", "86,432", "500", "500", "-"],
  ["원재료9", "346,865", "400", "400", "-"],
];

export function MaterialInputSetupContent() {
  const [selectedType, setSelectedType] = React.useState("표준");
  const [selectedRows, setSelectedRows] = React.useState([0, 1, 2, 3, 4]);
  const [search, setSearch] = React.useState("");
  const [scanReady, setScanReady] = React.useState(false);
  const [quantities, setQuantities] = React.useState<Record<number, string>>({ 0: "3000", 1: "3000", 2: "500", 3: "400", 4: "400" });

  const visibleMaterialRows = materialRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => !search || row.some((cell) => cell.toLowerCase().includes(search.toLowerCase())));

  const visibleSelectedRows = visibleMaterialRows.flatMap(({ index }, visibleIndex) => selectedRows.includes(index) ? [visibleIndex] : []);
  const updateVisibleSelectedRows = (visibleIndexes: number[]) => {
    const visibleSourceIndexes = visibleMaterialRows.map(({ index }) => index);
    setSelectedRows((current) => [
      ...current.filter((index) => !visibleSourceIndexes.includes(index)),
      ...visibleIndexes.map((visibleIndex) => visibleMaterialRows[visibleIndex].index),
    ]);
  };

  const rows = visibleMaterialRows.map(({ row, index }) => [
    ...row,
    selectedRows.includes(index) ? <div key={`quantity-${index}`} className="flex items-center gap-2 px-3">
      <FixtureInput
        value={quantities[index] ?? ""}
        onValueChange={(value) => setQuantities((current) => ({ ...current, [index]: value }))}
        inputMode="numeric"
        size="small"
        className="h-[22px] w-[119px] min-w-0 px-1.5 text-right"
        aria-label={`${row[1]} 투입수량`}
      />
      <label className="flex items-center gap-1.5 text-[12px]">
        <Checkbox
          size="small"
          color="main"
          checked={selectedRows.includes(index)}
          onChange={() => setSelectedRows((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}
        />
        ALL
      </label>
    </div> : "",
  ]);

  return (
    <div className="material-input-content grid h-full min-h-[676px] w-full grid-cols-[240px_1fr]">
      <aside className="flex h-[619px] min-h-0 flex-col gap-5 border-r border-mes-gray-30 p-5">
        <Button className="w-full" size="basic" startIcon={<IconScan size={16} />} onClick={() => setScanReady((current) => !current)}>
          {scanReady ? "Scan 준비" : "Scan"}
        </Button>
        <div className="border-t border-mes-gray-30 pt-4">
          <b className="text-[16px] text-mes-gray-80">Auto Bom</b>
          <div className="mt-2.5 space-y-2">
            {["CUSTOM", "표준"].map((type) => (
              <Button key={type} size="small" variant={selectedType === type ? "lineMain" : "lineBlacktxt"} className="w-full" onClick={() => setSelectedType(type)}>{type}</Button>
            ))}
            {Array.from({ length: 9 }, (_, index) => <Button key={index} size="small" className="w-full" disabled>Type {String(index + 2).padStart(2, "0")}</Button>)}
          </div>
        </div>
        <Link href="#bom-register" onClick={(event) => event.preventDefault()} className="mt-auto self-end text-[14px]">BOM 등록 바로가기</Link>
      </aside>

      <div className="flex min-h-0 flex-col">
        <div className="h-[100px] shrink-0">
          <b className="flex h-[52px] items-center px-5 text-[16px]">품목 재고 리스트</b>
          <div className="material-query-toolbar mx-5 flex h-12 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3">
            <FixtureFilter tags={[]} searchable={false} />
            <FixtureSearch value={search} onValueChange={setSearch} className="w-[200px]" />
          </div>
        </div>
        <div className="h-[576px] shrink-0 px-5 pt-4">
          <FixtureTable
            headers={["LOT-NO", "품목", "품목구분", "규격", "수량", "단위", "창고", "투입수량"]}
            rows={rows}
            widths={[
              { min: 80, grow: 1 },
              { min: 80, grow: 1 },
              { min: 80, grow: 1 },
              { min: 80, grow: 1 },
              { min: 80, grow: 1 },
              { min: 80, grow: 1 },
              { min: 80, grow: 1 },
              200,
            ]}
            aligns={["left", "left", "left", "left", "right", "left", "left", "left"]}
            checkedRows={visibleSelectedRows}
            onCheckedRowsChange={updateVisibleSelectedRows}
            selectionColor="black"
            unselectedCheckboxAppearance="grayCheck"
            selectionHeaderIndeterminate={false}
            selectionColumnWidth={56}
            centerSelection
            edgePadding={0}
            columnDividers={false}
            headerBackground="white"
            horizontalScroll={false}
            className="material-inventory-table h-[318px] shrink-0 rounded-mes-control border-x border-t"
          />
          <div className="mt-2.5 h-[212px]">
            <div className="flex h-[22px] items-center gap-2.5 px-2.5"><b className="text-[14px]">품목별 투입 결과</b><Tag color="gray" size="compact">표준</Tag></div>
            <FixtureTable
              selectable={false}
              headers={["품목", "현재고", "필요수량", "선택수량", "미투입수량"]}
              rows={requirementRows.map((row) => row.map((cell, index) => index === 4 && cell !== "-" ? <span key={cell} className="font-semibold text-mes-danger-60">{cell}</span> : cell))}
              aligns={["left", "right", "right", "right", "right"]}
              widths={Array.from({ length: 5 }, () => ({ min: 80, grow: 1 }))}
              columnDividers={false}
              headerBackground="white"
              horizontalScroll={false}
              className="material-requirement-table mt-2.5 h-[180px] rounded-mes-control border-x border-t"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const bomSourceRows = [
  ["원재료1", "원재료", "kg", "0.5"],
  ["원재료1", "원재료", "kg", "0.23"],
  ["원재료1", "원재료", "kg", "0.26"],
];

const bomTargetNames = [
  "비닐봉투",
  "비닐 125*125",
  "비닐 75*75",
  "비닐 (청) 125*125",
  "비닐 (청) 15*15",
  "비닐봉투 150*150",
  "1500얼려먹는트레이",
  "1500얼려먹는트레이-SHEET",
  ...Array.from({ length: 9 }, () => "1500얼려먹는트레이"),
];

export function BomCopyContent() {
  const [search, setSearch] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState([0, 1, 2, 3, 4, 5]);
  const [versions, setVersions] = React.useState<Record<number, string>>({ 0: "VER 3", 1: "VER 2", 2: "VER 3", 3: "VER 10", 4: "VER 10", 5: "BOM 선택" });
  const [names, setNames] = React.useState<Record<number, string>>({ 0: "표준 복사", 1: "표준 복사" });
  const visibleTargets = bomTargetNames.map((name, index) => ({ name, index })).filter(({ name }) => !search || name.includes(search));

  const targetRows = visibleTargets.map(({ name, index }) => [
    name,
    index < 6 ? "원자재" : "완제품",
    selectedRows.includes(index) ? <FixtureSelect key={`version-${index}`} size="small" value={versions[index] ?? "BOM 선택"} options={["BOM 선택", "VER 2", "VER 3", "VER 10"]} onValueChange={(value) => setVersions((current) => ({ ...current, [index]: value }))} /> : "",
    selectedRows.includes(index) ? <FixtureInput key={`name-${index}`} size="small" value={names[index] ?? ""} placeholder="내용 입력" onValueChange={(value) => setNames((current) => ({ ...current, [index]: value }))} /> : "",
  ]);

  return (
    <div className="flex h-full min-h-[609px] flex-col">
      <div className="h-11 shrink-0 px-5 pt-4">
        <div className="grid grid-cols-[370px_1fr] gap-5"><SectionBand>원본 BOM 선택</SectionBand><SectionBand>복사 대상 BOM</SectionBand></div>
      </div>
      <div className="grid h-[565px] min-h-0 shrink-0 grid-cols-[370px_1fr] gap-5 px-5 pt-4">
        <div className="flex min-h-0 flex-col gap-4">
          <div className="space-y-2.5">
            <div className="grid h-8 grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>품목 <b className="font-semibold text-mes-danger-60">*</b></span><FixtureInput value="1500 얼초트레이 PS" muted /></div>
            <div className="grid h-8 grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>BOM 슬롯 <b className="font-semibold text-mes-danger-60">*</b></span><FixtureInput value="VER 1" muted /></div>
          </div>
          <span className="h-[21px] text-[14px] leading-[1.5]">BOM 구성</span>
          <div data-bom-table className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-mes-control border border-mes-border-default">
            <FixtureTable selectable={false} headers={["품목", "품목구분", "단위", "수량"]} rows={bomSourceRows} widths={Array.from({ length: 4 }, () => ({ min: 60, grow: 1 }))} aligns={["center", "center", "center", "right"]} edgePadding={0} horizontalScroll={false} className="min-h-0 flex-1 rounded-none border-0" />
            <TableTotalRow className="h-[30px] min-h-0" gridTemplateColumns="repeat(4, minmax(0, 1fr))" cells={["", "", "0.99"]} />
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-[11px]">
          <div className="flex h-12 shrink-0 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3">
            <FixtureSelect value="품목구분" options={["품목구분", "원자재", "완제품"]} className="w-[140px]" />
            <FixtureSearch value={search} onValueChange={setSearch} className="w-[200px]" />
          </div>
          <div data-bom-table className="h-[490px] min-h-0 shrink-0 overflow-hidden">
            <FixtureTable
              headers={["품목", "품목구분", "BOM 슬롯", "BOM 명칭"]}
              rows={targetRows}
              widths={[164, 164, 164, 164]}
              aligns={["left", "center", "left", "left"]}
              checkedRows={selectedRows}
              onCheckedRowsChange={setSelectedRows}
              selectionColor="black"
              unselectedCheckboxAppearance="grayCheck"
              selectionHeaderIndeterminate={false}
              selectionColumnWidth={56}
              centerSelection
              edgePadding={0}
              horizontalScroll={false}
              className="h-full min-h-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface LabelRow {
  id: number;
  date: string;
  lot: string;
  labelQuantity: number;
  registered: number;
  allocation: string;
  temporary: boolean;
}

const initialLabelRows: LabelRow[] = [
  { id: 1, date: "05/08", lot: "260508-EQ261-P0286-001", labelQuantity: 42000, registered: 41999, allocation: "", temporary: true },
  { id: 2, date: "05/10", lot: "260510-EQ261-P0286-002", labelQuantity: 42000, registered: 41900, allocation: "", temporary: true },
  { id: 3, date: "TODAY", lot: "260511-EQ261-P0286-003", labelQuantity: 42000, registered: 2000, allocation: "40000", temporary: false },
  { id: 4, date: "TODAY", lot: "260511-EQ261-P0286-004", labelQuantity: 42000, registered: 0, allocation: "41000", temporary: true },
  { id: 5, date: "TODAY", lot: "260511-EQ261-P0286-005", labelQuantity: 42000, registered: 0, allocation: "", temporary: true },
  { id: 6, date: "TODAY", lot: "260511-EQ261-P0286-006", labelQuantity: 42000, registered: 0, allocation: "", temporary: true },
  { id: 7, date: "TODAY", lot: "260511-EQ261-P0286-007", labelQuantity: 42000, registered: 0, allocation: "", temporary: true },
  { id: 8, date: "TODAY", lot: "260511-EQ261-P0286-008", labelQuantity: 42000, registered: 0, allocation: "", temporary: true },
  { id: 9, date: "05/12", lot: "260512-EQ261-P0286-001", labelQuantity: 42000, registered: 0, allocation: "", temporary: true },
];

export function PreissuedLabelContent() {
  const [rows, setRows] = React.useState(initialLabelRows);
  const [selectedRowIds, setSelectedRowIds] = React.useState([3, 4]);
  const [search, setSearch] = React.useState("");
  const visibleRows = rows.filter((row) => !search || row.lot.includes(search));
  const allocated = rows.reduce((sum, row) => sum + (Number(row.allocation) || 0), 0);
  const performanceTotal = 82000;
  const remainder = Math.max(0, performanceTotal - allocated);
  const visibleSelectedRows = visibleRows.flatMap((row, visibleIndex) => selectedRowIds.includes(row.id) ? [visibleIndex] : []);
  const updateVisibleSelectedRows = (visibleIndexes: number[]) => {
    const visibleIds = visibleRows.map((row) => row.id);
    setSelectedRowIds((current) => [
      ...current.filter((id) => !visibleIds.includes(id)),
      ...visibleIndexes.map((visibleIndex) => visibleRows[visibleIndex].id),
    ]);
  };

  const tableRows = visibleRows.map((row) => {
    const result = row.registered + (Number(row.allocation) || 0);
    return [
      "1500 얼초트레이(PS)-SHEET",
      <Tag key={`date-${row.id}`} color={row.date === "TODAY" ? "opacityMain" : "gray"} size="compact">{row.date}</Tag>,
      row.lot,
      row.labelQuantity.toLocaleString(),
      row.registered.toLocaleString(),
      <FixtureInput key={`allocation-${row.id}`} value={row.allocation} onValueChange={(value) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, allocation: value } : item))} size="small" inputMode="numeric" className="h-[22px] text-right" aria-label={`${row.lot} 생산실적 배분`} />,
      result.toLocaleString(),
      "kg",
      <Tag key={`state-${row.id}`} color={row.temporary ? "main" : "gray"} size="compact">{row.temporary ? "임시" : "확정"}</Tag>,
      <IconButton key={`delete-${row.id}`} aria-label={`${row.lot} 삭제`} size="xsmall" icon={<IconTrash size={14} />} onClick={() => { setRows((current) => current.filter((item) => item.id !== row.id)); setSelectedRowIds((current) => current.filter((id) => id !== row.id)); }} />,
    ];
  });

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3.5">
      <div className="flex items-center justify-between"><b className="text-[16px]">LOT 선택</b><div className="flex gap-4"><FixtureSearch value={search} onValueChange={setSearch} className="w-[180px]" /><Button size="small" startIcon={<IconScan size={15} />}>직접 스캔</Button></div></div>
      <div className="flex h-10 items-center gap-2 rounded-mes-control bg-mes-gray-20 px-6 text-[13px]"><IconExclamationCircle size={15} className="text-mes-gray-60" /><span>사전 발행된 라벨의 수량은 임시 수량입니다. 해당 생산실적에 사용할 라벨을 선택하여 수량을 확정해 주세요.</span></div>
      <FixtureTable
        headers={["품목", "생성일", "임시 LOT", "표기 라벨 수량", "기 등록수량", "생산실적 배분", "결과수량", "단위", "결과", "편집"]}
        rows={tableRows}
        widths={[150, 58, 188, 88, 88, 100, 88, 42, 58, 36]}
        aligns={["left", "center", "left", "right", "right", "right", "right", "center", "center", "center"]}
        checkedRows={visibleSelectedRows}
        onCheckedRowsChange={updateVisibleSelectedRows}
        selectionColor="black"
        unselectedCheckboxAppearance="grayCheck"
        selectionColumnWidth={36}
        className="min-h-0 flex-1"
      />
      <div className="rounded-md bg-mes-primary-20 p-2.5">
        <b className="text-[14px] text-mes-primary-60">수량 현황</b>
        <div className="mt-2 grid h-[54px] grid-cols-[1fr_1fr_1fr_220px] items-center rounded-mes-control bg-white">
          {[['실적 수량 계', performanceTotal, 'text-mes-gray-130'], ['입력(분배) 수량 계', allocated, 'text-mes-gray-130'], ['잔여 수량 계', remainder, 'text-mes-danger-60']].map(([label, value, tone]) => <div key={String(label)} className="flex h-9 flex-col items-center justify-center border-r border-mes-gray-30 text-[13px]"><span className={String(tone)}>{label}</span><b className={`text-[16px] ${tone}`}>{Number(value).toLocaleString()}</b></div>)}
          <div className="mx-2 rounded-mes-control border border-[#ffe0a3] bg-[#fff3db] p-2 text-[11px]">선택할 임시 라벨이 없는 경우, 잔여 수량만큼 신규 라벨(LOT)이 생성됩니다.</div>
        </div>
      </div>
    </div>
  );
}

function WheelColumn({ values, activeIndex, onChange }: { values: string[]; activeIndex: number; onChange: (index: number) => void }) {
  return (
    <div className="flex w-[82px] flex-col items-stretch text-center">
      {values.map((value, index) => (
        <Button
          key={`${value}-${index}`}
          size="small"
          variant="lineBlacktxt"
          onClick={() => onChange(index)}
          className={index === activeIndex ? "h-[42px] rounded-none border-x-0 border-y-2 bg-white text-[20px] font-semibold" : "h-7 rounded-none border-0 bg-white text-[16px] font-medium text-mes-gray-60 hover:bg-white"}
        >
          {value}
        </Button>
      ))}
    </div>
  );
}

interface TimeWheelProps {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  onYearChange: (value: number) => void;
  onMonthChange: (value: number) => void;
  onDayChange: (value: number) => void;
  onHourChange: (value: number) => void;
  onMinuteChange: (value: number) => void;
}

function TimeWheel({ year, month, day, hour, minute, onYearChange, onMonthChange, onDayChange, onHourChange, onMinuteChange }: TimeWheelProps) {
  return (
    <div className="flex items-center justify-center gap-14">
      <div className="flex gap-4">
        <WheelColumn values={Array.from({ length: 5 }, (_, index) => String(year + index - 2))} activeIndex={2} onChange={(index) => onYearChange(year + index - 2)} />
        <WheelColumn values={Array.from({ length: 5 }, (_, index) => `${Math.max(1, Math.min(12, month + index - 2))}월`)} activeIndex={2} onChange={(index) => onMonthChange(Math.max(1, Math.min(12, month + index - 2)))} />
        <WheelColumn values={Array.from({ length: 5 }, (_, index) => `${Math.max(1, Math.min(31, day + index - 2))}일`)} activeIndex={2} onChange={(index) => onDayChange(Math.max(1, Math.min(31, day + index - 2)))} />
      </div>
      <div className="flex gap-4">
        <WheelColumn values={[`${hour - 2}시`, `${hour - 1}시`, `${hour}시`, `${hour + 1}시`, `${hour + 2}시`]} activeIndex={2} onChange={(index) => onHourChange(hour + index - 2)} />
        <WheelColumn values={[`${Math.max(0, minute - 2)}분`, `${Math.max(0, minute - 1)}분`, `${minute}분`, `${Math.min(59, minute + 1)}분`, `${Math.min(59, minute + 2)}분`]} activeIndex={2} onChange={(index) => onMinuteChange(Math.max(0, Math.min(59, minute + index - 2)))} />
      </div>
    </div>
  );
}

interface TimeRangeValue { start: string; end: string; }

function parseClock(value: string, fallbackHour: number) {
  const [hour, minute] = value.split(":").map(Number);
  return {
    hour: Number.isFinite(hour) ? hour : fallbackHour,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

export function TimeSelectionContent({
  mode = "operating",
  initialStart = "12:59",
  initialEnd,
  onRangeChange,
}: {
  mode?: "operating" | "downtime";
  initialStart?: string;
  initialEnd?: string;
  onRangeChange?: (range: TimeRangeValue) => void;
}) {
  const initialStartClock = parseClock(initialStart, 12);
  const initialEndClock = parseClock(initialEnd ?? (mode === "operating" ? "17:59" : "15:06"), mode === "operating" ? 17 : 15);
  const [startYear, setStartYear] = React.useState(2026);
  const [startMonth, setStartMonth] = React.useState(2);
  const [startDay, setStartDay] = React.useState(23);
  const [startHour, setStartHour] = React.useState(initialStartClock.hour);
  const [startMinute, setStartMinute] = React.useState(initialStartClock.minute);
  const [endYear, setEndYear] = React.useState(2026);
  const [endMonth, setEndMonth] = React.useState(2);
  const [endDay, setEndDay] = React.useState(23);
  const [endHour, setEndHour] = React.useState(initialEndClock.hour);
  const [endMinute, setEndMinute] = React.useState(initialEndClock.minute);
  const setCurrent = (target: "start" | "end") => {
    const current = new Date();
    if (target === "start") { setStartHour(current.getHours()); setStartMinute(current.getMinutes()); }
    else { setEndHour(current.getHours()); setEndMinute(current.getMinutes()); }
  };
  const totalMinutes = Math.max(0, (endHour * 60 + endMinute) - (startHour * 60 + startMinute));
  const formatClock = (hour: number, minute: number) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  React.useEffect(() => {
    onRangeChange?.({ start: formatClock(startHour, startMinute), end: formatClock(endHour, endMinute) });
  }, [endHour, endMinute, onRangeChange, startHour, startMinute]);

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="flex items-center gap-2.5"><SectionBand className="flex-1">시작 시간</SectionBand><Button size="small" onClick={() => setCurrent("start")}>현재 시각</Button></div>
      <TimeWheel year={startYear} month={startMonth} day={startDay} hour={startHour} minute={startMinute} onYearChange={setStartYear} onMonthChange={setStartMonth} onDayChange={setStartDay} onHourChange={setStartHour} onMinuteChange={setStartMinute} />
      <div className="flex items-center gap-2.5"><SectionBand className="flex-1">종료 시간</SectionBand><Button size="small" onClick={() => setCurrent("end")}>현재 시각</Button></div>
      <TimeWheel year={endYear} month={endMonth} day={endDay} hour={endHour} minute={endMinute} onYearChange={setEndYear} onMonthChange={setEndMonth} onDayChange={setEndDay} onHourChange={setEndHour} onMinuteChange={setEndMinute} />
      <ResultTotalCard className="mt-auto h-[54px] border border-mes-primary-30" tone="information" label={mode === "operating" ? "가동 시간" : "비가동 시간"} value={<span className="text-[20px]">{totalMinutes}분</span>} />
    </div>
  );
}

interface OperationRecord { id: number; start: string; end: string; product: string; }
interface DowntimeRecord extends OperationRecord { type: string; }
interface TimePickerTarget { kind: "operating" | "downtime"; id: number; }

export function UpdatedOperationLogContent() {
  const [date, setDate] = React.useState(new Date(2025, 9, 30));
  const [equipment, setEquipment] = React.useState("T4");
  const [logType, setLogType] = React.useState("야간 (19:00 ~ 06:00)");
  const [manager, setManager] = React.useState("타오");
  const [timeTable, setTimeTable] = React.useState<Record<string, string>>({});
  const [operationRecords, setOperationRecords] = React.useState<OperationRecord[]>([
    { id: 1, start: "07:00", end: "12:00", product: "품목A" },
    { id: 2, start: "12:00", end: "19:00", product: "품목A" },
  ]);
  const [downtimeRecords, setDowntimeRecords] = React.useState<DowntimeRecord[]>([{ id: 1, start: "13:30", end: "14:25", product: "품목A", type: "선택" }]);
  const [picker, setPicker] = React.useState<TimePickerTarget | null>(null);
  const [draftRange, setDraftRange] = React.useState<TimeRangeValue>({ start: "07:00", end: "08:00" });
  const hours = Array.from({ length: 13 }, (_, index) => `${String(index + 7).padStart(2, "0")}:00`);
  const duration = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    return Math.max(0, endHour * 60 + endMinute - (startHour * 60 + startMinute));
  };
  const totalOperating = operationRecords.reduce((sum, record) => sum + duration(record.start, record.end), 0);
  const totalDowntime = downtimeRecords.reduce((sum, record) => sum + duration(record.start, record.end), 0);
  const openPicker = (kind: TimePickerTarget["kind"], record: OperationRecord) => {
    setDraftRange({ start: record.start, end: record.end });
    setPicker({ kind, id: record.id });
  };
  const applyDraftRange = () => {
    if (!picker) return;
    if (picker.kind === "operating") {
      setOperationRecords((current) => current.map((record) => record.id === picker.id ? { ...record, ...draftRange } : record));
    } else {
      setDowntimeRecords((current) => current.map((record) => record.id === picker.id ? { ...record, ...draftRange } : record));
    }
    setPicker(null);
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <div className="grid shrink-0 grid-cols-2 gap-x-14 gap-y-3 bg-mes-gray-20 p-5">
          <div className="grid grid-cols-[74px_1fr] items-center text-[14px]"><span>가동일 <b className="text-mes-danger-60">*</b></span><DatePicker value={date} onValueChange={setDate} separator="-" /></div>
          <div className="grid grid-cols-[74px_1fr] items-center text-[14px]"><span>설비명 <b className="text-mes-danger-60">*</b></span><FixtureSelect value={equipment} options={["T4", "T5"]} onValueChange={setEquipment} /></div>
          <div className="grid grid-cols-[74px_1fr] items-center text-[14px]"><span>일지구분 <b className="text-mes-danger-60">*</b></span><FixtureSelect value={logType} options={["주간 (07:00 ~ 19:00)", "야간 (19:00 ~ 06:00)"]} onValueChange={setLogType} /></div>
          <div className="grid grid-cols-[74px_1fr] items-center text-[14px]"><span>담당자 <b className="text-mes-danger-60">*</b></span><FixtureSelect value={manager} options={["타오", "김수현"]} onValueChange={setManager} /></div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[360px_1fr]">
          <div className="border-r border-mes-gray-30 p-5">
            <SectionBand>타임테이블 (주간)</SectionBand>
            <div className="mt-3 space-y-2">
              {hours.map((hour) => <div key={hour} className="grid grid-cols-[72px_1fr] items-center text-[14px]"><span>{hour}</span><FixtureInput value={timeTable[hour] ?? ""} placeholder="내용 입력" onValueChange={(value) => setTimeTable((current) => ({ ...current, [hour]: value }))} aria-label={`${hour} 운전일지`} /></div>)}
            </div>
          </div>
          <div className="flex min-h-0 flex-col">
            <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
              <SectionBand>품목별 가동기록</SectionBand>
              <RecordHeader downtime={false} />
              {operationRecords.map((record) => <OperationRecordRow key={record.id} record={record} duration={duration(record.start, record.end)} onOpen={() => openPicker("operating", record)} onProductChange={(product) => setOperationRecords((current) => current.map((item) => item.id === record.id ? { ...item, product } : item))} onDelete={() => setOperationRecords((current) => current.filter((item) => item.id !== record.id))} />)}
              <Button size="small" variant="lineMain" startIcon={<IconPlus size={15} />} onClick={() => setOperationRecords((current) => [...current, { id: Date.now(), start: "07:00", end: "08:00", product: "품목A" }])}>가동기록 추가</Button>
              <SectionBand className="mt-2">비가동시간</SectionBand>
              <RecordHeader downtime />
              {downtimeRecords.map((record) => <DowntimeRecordRow key={record.id} record={record} duration={duration(record.start, record.end)} onOpen={() => openPicker("downtime", record)} onTypeChange={(type) => setDowntimeRecords((current) => current.map((item) => item.id === record.id ? { ...item, type } : item))} onProductChange={(product) => setDowntimeRecords((current) => current.map((item) => item.id === record.id ? { ...item, product } : item))} onDelete={() => setDowntimeRecords((current) => current.filter((item) => item.id !== record.id))} />)}
              <Button size="small" variant="lineMain" startIcon={<IconPlus size={15} />} onClick={() => setDowntimeRecords((current) => [...current, { id: Date.now(), start: "13:30", end: "14:00", product: "품목A", type: "선택" }])}>비가동 추가</Button>
            </div>
            <div className="grid shrink-0 grid-cols-3 gap-2 bg-mes-gray-20 p-4">
              {[['총 가동시간', totalOperating, 'text-mes-gray-130'], ['실가동시간', totalOperating - totalDowntime, 'text-mes-primary-60'], ['비가동시간', totalDowntime, 'text-mes-danger-60']].map(([label, value, tone]) => <div key={String(label)} className="flex h-14 flex-col items-center justify-center rounded-mes-control border border-mes-gray-30 bg-white"><span className="text-[14px] font-semibold">{label}</span><b className={`text-[18px] ${tone}`}>{value}분</b></div>)}
            </div>
          </div>
        </div>
      </div>
      <CenterModal open={picker !== null} onOpenChange={(open) => { if (!open) setPicker(null); }} title={picker?.kind === "downtime" ? "비가동시간 선택" : "가동시간 선택"} size="medium-600" actions={createDialogActionSet("action-set.cancel-input", { onPrimary: applyDraftRange, onDismiss: () => setPicker(null) })} exactHeight={666} maxHeight="calc(100vh - 32px)" bodyAlign="stretch" scrollMode="content">
        {picker && <TimeSelectionContent key={`${picker.kind}-${picker.id}`} mode={picker.kind} initialStart={draftRange.start} initialEnd={draftRange.end} onRangeChange={setDraftRange} />}
      </CenterModal>
    </>
  );
}

function RecordHeader({ downtime }: { downtime: boolean }) {
  return <div className={`grid ${downtime ? "grid-cols-[136px_105px_68px_1fr_22px]" : "grid-cols-[136px_121px_68px_1fr_22px]"} gap-4 border-b border-mes-gray-30 pb-2 text-center text-[13px] font-semibold`}><span>시작시간　 종료시간</span>{downtime && <span>비가동유형</span>}<span>{downtime ? "비가동시간" : "가동시간"}</span><span>생산품목</span><span /></div>;
}

function OperationRecordRow({ record, duration, onOpen, onProductChange, onDelete }: { record: OperationRecord; duration: number; onOpen: () => void; onProductChange: (value: string) => void; onDelete: () => void }) {
  return <div className="grid grid-cols-[136px_121px_68px_1fr_22px] items-center gap-4"><Button size="small" variant="lineBlacktxt" aria-label={`가동기록 ${record.id} 시간 편집`} onClick={onOpen}>{record.start}　~　{record.end}</Button><span /><FixtureInput value={`${duration}분`} muted /><FixtureSelect value={record.product} options={["품목A", "품목B"]} onValueChange={onProductChange} ariaLabel={`가동기록 ${record.id} 생산품목`} /><IconButton aria-label="가동기록 삭제" size="xsmall" icon={<IconX size={12} />} onClick={onDelete} /></div>;
}

function DowntimeRecordRow({ record, duration, onOpen, onTypeChange, onProductChange, onDelete }: { record: DowntimeRecord; duration: number; onOpen: () => void; onTypeChange: (value: string) => void; onProductChange: (value: string) => void; onDelete: () => void }) {
  return <div className="grid grid-cols-[136px_105px_68px_1fr_22px] items-center gap-4"><Button size="small" variant="lineBlacktxt" aria-label={`비가동기록 ${record.id} 시간 편집`} onClick={onOpen}>{record.start}　~　{record.end}</Button><FixtureSelect value={record.type} options={["선택", "금형교체", "셋팅", "기계수리"]} onValueChange={onTypeChange} ariaLabel={`비가동기록 ${record.id} 비가동유형`} /><FixtureInput value={`${duration}분`} muted /><FixtureSelect value={record.product} options={["품목A", "품목B"]} onValueChange={onProductChange} ariaLabel={`비가동기록 ${record.id} 생산품목`} /><IconButton aria-label="비가동기록 삭제" size="xsmall" icon={<IconX size={12} />} onClick={onDelete} /></div>;
}
