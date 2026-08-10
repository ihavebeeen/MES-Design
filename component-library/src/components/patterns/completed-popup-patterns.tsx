"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CenterModal, type CenterModalSize, type DialogAction } from "@/components/ui/center-modal";
import { DatePicker } from "@/components/ui/date-picker";
import { IconButton } from "@/components/ui/icon-button";
import { InspectionJudgement, type InspectionJudgementValue } from "@/components/ui/inspection-judgement";
import { Link } from "@/components/ui/link";
import { SideSlidePanel, type SideSlidePanelSize } from "@/components/ui/side-slide-panel";
import { Tag } from "@/components/ui/tag";
import { TimePicker } from "@/components/ui/time-picker";
import {
  IconArrow,
  IconDownload,
  IconFileNote,
  IconPlus,
  IconReload,
  IconShare,
  IconTrash,
  IconX,
} from "@/components/icons";
import {
  FixtureDateRange,
  FixtureFilter,
  FixtureInput,
  FixtureSearch,
  FixtureSelect,
  FixtureTable,
  RadioOption,
  SectionBand,
} from "./mes-screen-fixtures";
import {
  BomCopyContent,
  MaterialInputSetupContent,
  PreissuedLabelContent,
  TimeSelectionContent,
  UpdatedOperationLogContent,
} from "./completed-popup-expanded-content";
import { SourcePopupGallery } from "./source-popup-gallery";

type CenterPopupKind =
  | "quantity"
  | "details"
  | "defect"
  | "weight"
  | "purchase"
  | "lookup"
  | "material-input-setup"
  | "bom-copy"
  | "preissued-label"
  | "operating-time-picker"
  | "downtime-picker";
type SidePopupKind = "production" | "receiving" | "custom" | "inspection" | "operation-log";
export type PopupKind = CenterPopupKind | SidePopupKind;
type PopupPatternId =
  | "side-custom-columns"
  | "side-add-list"
  | "side-inspection-items"
  | "side-time-records"
  | "center-form"
  | "center-table"
  | "center-dual-pane"
  | "center-navigation-detail"
  | "center-time-selector";

interface PopupDefinition {
  id: PopupKind;
  label: string;
  node: string;
  pattern: PopupPatternId;
}

interface PopupPatternGroup {
  id: PopupPatternId;
  title: string;
  description: string;
}

const POPUPS: PopupDefinition[] = [
  { id: "quantity", label: "400 · 생산수량 입력", node: "11210:52992", pattern: "center-form" },
  { id: "details", label: "480 · 품목 상세정보", node: "11210:52744", pattern: "center-form" },
  { id: "defect", label: "600 · 불량수량 입력", node: "11210:52919", pattern: "center-table" },
  { id: "weight", label: "960 · 중량검사", node: "11210:51787", pattern: "center-form" },
  { id: "purchase", label: "1100 · 발주 일괄등록", node: "11210:52026", pattern: "center-table" },
  { id: "lookup", label: "1400 · 일괄작업지시", node: "11210:50866", pattern: "center-table" },
  { id: "material-input-setup", label: "1400 · 투입품목 설정/조회", node: "18826:60554", pattern: "center-navigation-detail" },
  { id: "bom-copy", label: "1024 · BOM 복사", node: "18962:67817", pattern: "center-dual-pane" },
  { id: "preissued-label", label: "1024 · 선발행 라벨 수량 확정", node: "18756:60803", pattern: "center-table" },
  { id: "operation-log", label: "900 · 운전일지 등록", node: "17303:45841", pattern: "side-time-records" },
  { id: "operating-time-picker", label: "600 · 가동시간 선택", node: "17309:156861", pattern: "center-time-selector" },
  { id: "downtime-picker", label: "600 · 비가동시간 선택", node: "17768:51611", pattern: "center-time-selector" },
  { id: "production", label: "900 · 생산실적 등록", node: "11210:48851", pattern: "side-add-list" },
  { id: "receiving", label: "900 · 입고등록", node: "11210:49261", pattern: "side-add-list" },
  { id: "custom", label: "760 · 커스텀 정보 등록", node: "11210:51570", pattern: "side-custom-columns" },
  { id: "inspection", label: "760 · 자주검사", node: "11210:51420", pattern: "side-inspection-items" },
];

const SIDE_POPUP_GROUPS: PopupPatternGroup[] = [
  {
    id: "side-custom-columns",
    title: "좌우 분할 · 커스텀 정보",
    description: "좌측 기본 폼과 우측 커스텀 정보 컬럼을 함께 편집하는 유형",
  },
  {
    id: "side-add-list",
    title: "상하 분할 · 추가 + 하단 리스트",
    description: "상단 입력값을 ‘추가’하여 하단 상세 리스트에 쌓는 유형",
  },
  {
    id: "side-inspection-items",
    title: "좌우 분할 · 검사항목",
    description: "좌측 검사 정보와 우측 항목별 판정을 함께 입력하는 유형",
  },
  {
    id: "side-time-records",
    title: "좌우 분할 · 시간 기록",
    description: "좌측 시간대별 일지와 우측 가동·비가동 기록 및 합계를 함께 편집하는 유형",
  },
];

const CENTER_POPUP_GROUPS: PopupPatternGroup[] = [
  {
    id: "center-form",
    title: "폼·정보 중심",
    description: "단일 입력, 상세정보, 검사 폼처럼 폼과 정보 자체가 중심인 유형",
  },
  {
    id: "center-table",
    title: "단일 테이블 · 선택/편집",
    description: "하나의 주 테이블에서 여러 행을 선택·배분·일괄 편집하는 유형",
  },
  {
    id: "center-dual-pane",
    title: "원본/대상 비교",
    description: "좌측 원본 정보와 우측 적용 대상을 나란히 비교하며 설정하는 유형",
  },
  {
    id: "center-navigation-detail",
    title: "탐색 레일 + 상세",
    description: "좌측 탐색·모드 레일과 우측 다단 상세 테이블을 함께 제공하는 유형",
  },
  {
    id: "center-time-selector",
    title: "시간 휠 + 계산",
    description: "시작·종료 시각을 휠로 선택하고 계산된 분 단위 결과를 확인하는 유형",
  },
];

const SAVE_ACTION: DialogAction = { id: "save", label: "저장", variant: "fillBlack" };
const createDefaultActions = (onCancel: () => void): DialogAction[] => [
  { id: "cancel", label: "취소", variant: "fillGray", onClick: onCancel },
  SAVE_ACTION,
];

function FieldRow({ label, value, muted = false, select = false }: { label: string; value: string; muted?: boolean; select?: boolean }) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]">
      <span>{label}</span>
      {select ? <FixtureSelect value={value} /> : <FixtureInput value={value} muted={muted} />}
    </div>
  );
}

function LabeledControl({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) {
  return <div className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>{label}{required && <span className="ml-[3px] font-semibold text-mes-danger-60">*</span>}</span>{children}</div>;
}

function InlineLabeledControl({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`flex h-8 min-w-0 items-center overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white ${className ?? ""}`}><span className="shrink-0 px-3 text-[13px] text-mes-gray-60">{label}</span><div className="min-w-0 flex-1">{children}</div></div>;
}

function QuantityContent() {
  const [mode, setMode] = React.useState<"manual" | "automatic">("manual");
  const [manualQuantity, setManualQuantity] = React.useState("4");
  const [automaticQuantity, setAutomaticQuantity] = React.useState("4");
  const [ranges, setRanges] = React.useState({ blackStart: "2", blackEnd: "0", redStart: "2", redEnd: "0" });
  const automatic = mode === "automatic";
  const updateRange = (key: keyof typeof ranges, value: string) => setRanges((current) => ({ ...current, [key]: value }));
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col gap-2">
        <RadioOption name="quantity-mode" checked={!automatic} label="수기 입력" onChange={() => setMode("manual")} />
        <div className="pl-[30px]"><FixtureInput value={manualQuantity} onValueChange={setManualQuantity} muted={automatic} inputMode="numeric" /></div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <RadioOption name="quantity-mode" checked={automatic} label="자동 계산" onChange={() => setMode("automatic")} />
        <div className="flex flex-col gap-1.5 pl-[30px]">
          <FixtureInput value={automaticQuantity} onValueChange={setAutomaticQuantity} muted={!automatic} inputMode="numeric" />
          <span className={`text-[14px] font-medium ${automatic ? "text-mes-gray-130" : "text-mes-gray-60"}`}>입상수 : 정보 없음</span>
          <Card className={`${automatic ? "bg-white text-mes-gray-130" : "bg-mes-gray-10 text-mes-gray-60"} px-5 text-[14px]`}>
            {[{ label: "흑", start: "blackStart", end: "blackEnd" }, { label: "적", start: "redStart", end: "redEnd" }].map(({ label, start, end }) => (
              <div key={label} className="flex h-[45px] items-center gap-2.5 border-b border-mes-gray-30 last:border-0">
                <span className="w-5 font-medium">{label}</span>
                <FixtureInput value={ranges[start as keyof typeof ranges]} onValueChange={(value) => updateRange(start as keyof typeof ranges, value)} muted={!automatic} size="small" inputMode="numeric" aria-label={`${label} 시작`} />
                <FixtureInput value={ranges[end as keyof typeof ranges]} onValueChange={(value) => updateRange(end as keyof typeof ranges, value)} muted={!automatic} size="small" inputMode="numeric" aria-label={`${label} 종료`} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

const DETAIL_PAIRS = [
  ["박스규격", "100", "비닐 사이즈", "40m"], ["필름", "34", "테이프 색상", "레드"],
  ["간지", "유", "간지", "34"], ["간지", "유", "간지", "34"],
  ["박스규격", "100", "비닐 사이즈", "40m"], ["필름", "34", "테이프 색상", "레드"],
  ["간지", "유", "간지", "34"], ["박스규격", "100", "비닐 사이즈", "40m"],
  ["필름", "34", "테이프 색상", "레드"], ["간지", "유", "간지", "34"],
];

function DetailsContent() {
  return (
    <div className="w-full">
      <FixtureSelect value="포장정보" className="mb-3" />
      <Card className="overflow-hidden text-[14px]">
        {DETAIL_PAIRS.map((pair, index) => (
          <div key={index} className="grid h-8 grid-cols-2 border-b border-mes-gray-30 last:border-0">
            <div className="grid grid-cols-[100px_1fr] items-center border-r border-mes-gray-30 px-3"><span className="text-mes-gray-80">{pair[0]}</span><span>{pair[1]}</span></div>
            <div className="grid grid-cols-[100px_1fr] items-center px-3"><span className="text-mes-gray-80">{pair[2]}</span><span>{pair[3]}</span></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function DefectContent() {
  const [drafts, setDrafts] = React.useState([
    { type: "색상", warehouse: "임가공창고A", quantity: "2" },
    { type: "모양", warehouse: "동진창고", quantity: "2" },
    { type: "선택", warehouse: "선택", quantity: "" },
    { type: "선택", warehouse: "선택", quantity: "" },
    { type: "선택", warehouse: "선택", quantity: "" },
  ]);
  const updateDraft = (index: number, key: "type" | "warehouse" | "quantity", value: string) => setDrafts((current) => current.map((draft, draftIndex) => draftIndex === index ? { ...draft, [key]: value } : draft));
  const total = drafts.reduce((sum, draft) => sum + (Number(draft.quantity) || 0), 0);
  const rows = drafts.map((draft, index) => [String(index + 1), <FixtureSelect key="type" value={draft.type} options={["선택", "색상", "모양", "인쇄"]} onValueChange={(value) => updateDraft(index, "type", value)} size="small" />, <FixtureSelect key="warehouse" value={draft.warehouse} options={["선택", "임가공창고A", "동진창고"]} onValueChange={(value) => updateDraft(index, "warehouse", value)} size="small" />, <FixtureInput key="qty" value={draft.quantity} onValueChange={(value) => updateDraft(index, "quantity", value)} inputMode="numeric" size="small" />]);
  return (
    <div className="flex h-full w-full flex-col">
      <FixtureTable
        selectable={false}
        headers={["No.", "불량유형", "저장창고", "불량수량"]}
        widths={[60, 166, 166, 166]}
        rows={rows}
        horizontalScroll={false}
        className="shrink-0"
      />
      <Card className="mt-5 flex h-14 items-center justify-center gap-3 bg-mes-primary-20 text-[16px] font-semibold text-mes-primary-60">
        <span>불량계</span><div className="flex h-8 w-[120px] items-center rounded-mes-control border border-mes-gray-30 bg-white px-3 text-[14px] text-mes-gray-130">{total}</div>
      </Card>
    </div>
  );
}

function WeightContent() {
  const [layout, setLayout] = React.useState<"automatic" | "custom">("automatic");
  const filledValues = [
    [35, 35, 35, 35, 24],
    [10, 19, 24, 10, 35],
    [32, 10, 32, 19, 10],
    [24, 32, 10, 24, 32],
    [19, 24, 19, 32, 19],
  ];
  return (
    <div className="grid h-full w-full grid-cols-[300px_1fr]">
      <div className="border-r border-mes-gray-30 p-5">
        <SectionBand>기본정보</SectionBand>
        <div className="mt-3 space-y-4">{[["Cavity", "100"], ["배열", "6 X 6"], ["넷중량", "100"]].map((item) => <FieldRow key={item[0]} label={item[0]} value={item[1]} muted />)}</div>
        <div className="mt-10"><SectionBand>검사결과</SectionBand></div>
        <div className="mt-3 space-y-4">{[["상한값", "93.98"], ["평균중량", "93.98"], ["하한값", "93.98"]].map((item) => <FieldRow key={item[0]} label={item[0]} value={item[1]} muted />)}</div>
      </div>
      <div className="p-5">
        <SectionBand>중량검사</SectionBand>
        <Card className="mt-3 px-5 pb-5 pt-3">
          <div className="mb-3 flex h-8 items-center gap-5 text-[14px]"><span>배열 설정</span><RadioOption name="weight-layout" checked={layout === "automatic"} label="자동배열" onChange={() => setLayout("automatic")} /><RadioOption name="weight-layout" checked={layout === "custom"} label="사용자 설정" onChange={() => setLayout("custom")} /></div>
          <div className="grid grid-cols-10 gap-[3px]">{Array.from({ length: 100 }, (_, index) => {
            const row = Math.floor(index / 10);
            const column = index % 10;
            const value = row < 5 && column < 5 ? filledValues[row][column] : undefined;
            const cellTone = value !== undefined
              ? "border-mes-primary-30 bg-mes-primary-30"
              : column < 5
                ? "border-mes-primary-30 bg-white"
                : "border-mes-gray-30 bg-white";
            return <div key={index} className={`flex h-[39px] flex-col items-center justify-center rounded-mes-control-xs border text-center ${cellTone}`}><span className="text-[10px] text-mes-gray-80">{value !== undefined ? index + 1 : ""}</span><b className="text-[13px]">{value ?? ""}</b></div>;
          })}</div>
        </Card>
        <div className="mt-4 grid grid-cols-2 gap-6"><FieldRow label="배열넘버" value="93.98" muted /><FieldRow label="하한값" value="93.98" muted /></div>
      </div>
    </div>
  );
}

const PURCHASE_ITEMS = ["비비빅", "찰옥수수", "수박바", "찰옥수수", "빵빠레", "더블 비얀코", "죠스", "메가톤", "와일드바디", "옥메와까", "돼지바", "빠삐코"];
const LOOKUP_ITEMS = ["빠삐코", "빵빠레", "더블비앙코", "비비빅", "메로나", "생귤탱귤", "하겐다즈", "누가바"];

function PurchaseContent() {
  const [checkedRows, setCheckedRows] = React.useState([0, 1]);
  const [search, setSearch] = React.useState("");
  const [bulkDate, setBulkDate] = React.useState(new Date(2025, 9, 30));
  const [bulkType, setBulkType] = React.useState("선택");
  const [bulkQuantity, setBulkQuantity] = React.useState("0");
  const [bulkWarehouse, setBulkWarehouse] = React.useState("선택");
  const [drafts, setDrafts] = React.useState(() => PURCHASE_ITEMS.map(() => ({ date: new Date(2025, 9, 30), type: "선택", quantity: "0", warehouse: "선택" })));
  const headers = ["품목", "품목구분", "규격", "단위", "입고예정일", "입고구분", "입고수량", "입고창고"];
  const updateDraft = <Key extends keyof (typeof drafts)[number]>(index: number, key: Key, value: (typeof drafts)[number][Key]) => setDrafts((current) => current.map((draft, draftIndex) => draftIndex === index ? { ...draft, [key]: value } : draft));
  const applyBulk = () => setDrafts((current) => current.map((draft, index) => checkedRows.includes(index) ? { date: bulkDate, type: bulkType, quantity: bulkQuantity, warehouse: bulkWarehouse } : draft));
  const visibleEntries = PURCHASE_ITEMS.map((item, sourceIndex) => ({ item, sourceIndex })).filter(({ item }) => item.toLowerCase().includes(search.trim().toLowerCase()));
  const visibleCheckedRows = visibleEntries.flatMap(({ sourceIndex }, visibleIndex) => checkedRows.includes(sourceIndex) ? [visibleIndex] : []);
  const updateVisibleCheckedRows = (visibleIndexes: number[]) => {
    const visibleSourceIndexes = visibleEntries.map(({ sourceIndex }) => sourceIndex);
    const selectedVisibleSourceIndexes = visibleIndexes.map((visibleIndex) => visibleEntries[visibleIndex]?.sourceIndex).filter((sourceIndex): sourceIndex is number => sourceIndex !== undefined);
    setCheckedRows((current) => [...current.filter((sourceIndex) => !visibleSourceIndexes.includes(sourceIndex)), ...selectedVisibleSourceIndexes]);
  };
  const rows = visibleEntries.map(({ item, sourceIndex }) => {
    const selected = checkedRows.includes(sourceIndex);
    const draft = drafts[sourceIndex];
    return [item, "완제품", "A", "kg", selected ? <DatePicker key="date" value={draft.date} onValueChange={(value) => updateDraft(sourceIndex, "date", value)} separator="-" className="h-[22px] px-1.5 text-[12px]" /> : "", selected ? <FixtureSelect key="type" value={draft.type} options={["선택", "일반입고", "긴급입고"]} onValueChange={(value) => updateDraft(sourceIndex, "type", value)} size="small" /> : "", selected ? <FixtureInput key="qty" value={draft.quantity} onValueChange={(value) => updateDraft(sourceIndex, "quantity", value)} inputMode="numeric" size="small" /> : "", selected ? <FixtureSelect key="warehouse" value={draft.warehouse} options={["선택", "동진창고", "임가공창고A"]} onValueChange={(value) => updateDraft(sourceIndex, "warehouse", value)} size="small" /> : ""];
  });
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between"><b className="text-[16px]">품목 리스트</b></div>
      <div className="mt-3 flex h-12 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3"><FixtureFilter tags={[{ label: "품목", count: 5 }, { label: "품목", count: 23 }, { label: "품목: 전체보기", count: 1 }]} /><FixtureSearch value={search} onValueChange={setSearch} /></div>
      <div className="mt-3 flex h-12 items-center gap-2.5 rounded-t-mes-control bg-mes-gray-20 px-3"><b className="flex w-[160px] shrink-0 items-center gap-1"><IconReload size={16} />전체 일괄 변경</b><InlineLabeledControl label="입고 예정일" className="w-[220px] shrink-0"><DatePicker value={bulkDate} onValueChange={setBulkDate} separator="-" className="h-full rounded-none border-0" /></InlineLabeledControl><InlineLabeledControl label="입고 구분" className="flex-1"><FixtureSelect value={bulkType} options={["선택", "일반입고", "긴급입고"]} onValueChange={setBulkType} className="h-full rounded-none border-0" /></InlineLabeledControl><InlineLabeledControl label="입고 수량" className="flex-1"><FixtureInput value={bulkQuantity} onValueChange={setBulkQuantity} inputMode="numeric" className="h-full rounded-none border-0" /></InlineLabeledControl><InlineLabeledControl label="입고 창고" className="flex-1"><FixtureSelect value={bulkWarehouse} options={["선택", "동진창고", "임가공창고A"]} onValueChange={setBulkWarehouse} className="h-full rounded-none border-0" /></InlineLabeledControl><Button size="small" className="w-[60px] shrink-0" onClick={applyBulk}>적용</Button></div>
      <div className="min-h-0 flex-1 overflow-hidden"><FixtureTable headers={headers} rows={rows} checkedRows={visibleCheckedRows} onCheckedRowsChange={updateVisibleCheckedRows} selectionColor="black" unselectedCheckboxAppearance="grayCheck" selectionHeaderIndeterminate={false} unselectedTextTone="gray80" edgePadding={0} selectionColumnWidth={56} centerSelection columnDividers={false} horizontalScroll={false} aligns={["left", "center", "center", "center", "center", "center", "right", "center"]} /></div>
    </div>
  );
}

const LOOKUP_COLUMN_WIDTHS = [125.75, 125.75, 125.75, 58, 80, 80, 125.75, 80, 125.75, 125.75, 125.75, 125.75];
const LOOKUP_COLUMN_ALIGNS: Array<"left" | "center" | "right"> = ["center", "left", "center", "center", "right", "right", "center", "center", "center", "right", "center", "center"];
const LOOKUP_EQUIPMENT_OPTIONS = ["A1", "A2", "A3", "A4", "A5"];
const LOOKUP_SHIFT_OPTIONS = ["주간", "야간"];
const LOOKUP_MANAGER_OPTIONS = ["선택", "홍길동", "김아무개"];

interface LookupWorkOrderDraft {
  equipment: string;
  shift: string;
  instructionDate: Date;
  instructionQuantity: string;
  manager: string;
}

function LookupWorkOrderContent() {
  const [checkedRows, setCheckedRows] = React.useState([0]);
  const headers = ["계획일", "품목", "품목구분", "단위", "계획수량", "포장인원", "설비", "근무조", "지시일", "지시수량", "담당기사", "작업지시여부"];
  const units = ["EA", "EA", "EA", "kg", "kg", "EA", "EA", "kg"];
  const equipment = ["A1", "A2", "A3", "A5", "A2", "A4", "A1", "A2"];
  const shifts = ["주간", "주간", "주간", "주간", "주간", "야간", "야간", "야간"];
  const [rowDrafts, setRowDrafts] = React.useState<LookupWorkOrderDraft[]>(() =>
    LOOKUP_ITEMS.map((_, index) => ({
      equipment: equipment[index],
      shift: shifts[index],
      instructionDate: new Date(2025, 9, 30),
      instructionQuantity: index === 0 ? "3000" : "",
      manager: index === 0 ? "홍길동" : "선택",
    }))
  );

  const updateRowDraft = <Key extends keyof LookupWorkOrderDraft>(index: number, key: Key, value: LookupWorkOrderDraft[Key]) => {
    setRowDrafts((current) => current.map((draft, draftIndex) => draftIndex === index ? { ...draft, [key]: value } : draft));
  };

  const rows = LOOKUP_ITEMS.map((item, index) => {
    const selected = checkedRows.includes(index);
    const draft = rowDrafts[index];

    return [
      "2024-08-30",
      item,
      "완제품",
      units[index],
      "2000",
      "2000",
      selected ? <FixtureSelect key="equipment" value={draft.equipment} options={LOOKUP_EQUIPMENT_OPTIONS} onValueChange={(value) => updateRowDraft(index, "equipment", value)} size="small" /> : draft.equipment,
      selected ? <FixtureSelect key="shift" value={draft.shift} options={LOOKUP_SHIFT_OPTIONS} onValueChange={(value) => updateRowDraft(index, "shift", value)} size="small" /> : draft.shift,
      selected ? <DatePicker key="date" value={draft.instructionDate} onValueChange={(value) => updateRowDraft(index, "instructionDate", value)} separator="-" iconColor="default" className="h-[22px] gap-1 rounded-mes-control-sm px-[6px] text-[13px]" /> : index === 7 ? "2025-10-30" : "",
      selected ? <FixtureInput key="qty" value={draft.instructionQuantity} onValueChange={(value) => updateRowDraft(index, "instructionQuantity", value)} inputMode="numeric" size="small" /> : index === 7 ? "2000" : "",
      selected ? <FixtureSelect key="manager" value={draft.manager} options={LOOKUP_MANAGER_OPTIONS} onValueChange={(value) => updateRowDraft(index, "manager", value)} size="small" /> : index === 7 ? "김아무개" : "",
      index === 7 ? <Tag key="done" color="gray">지시완료</Tag> : "",
    ];
  });

  return (
    <div className="flex h-[556px] w-full flex-col">
      <section data-figma-section="query" className="flex h-[108px] shrink-0 flex-col gap-3 px-5 pt-4">
        <div className="flex h-8 shrink-0 items-center justify-between">
          <b className="text-[16px] leading-[1.5]">생산계획 리스트</b>
          <div className="flex h-8 items-center gap-2.5">
            <FixtureDateRange label="일자" />
            <Button size="small" className="w-[50px] shrink-0">조회</Button>
            <Button size="small" variant="lineBlacktxt" startIcon={<IconDownload size={16} />} className="w-[91px] shrink-0">다운로드</Button>
          </div>
        </div>
        <div className="flex h-12 shrink-0 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3">
          <FixtureFilter
            className="self-center"
            searchable={false}
            definitions={[
              { id: "item", label: "품목", options: LOOKUP_ITEMS },
              { id: "item-type", label: "품목구분", options: ["완제품"] },
              { id: "unit", label: "단위", options: ["EA", "kg"] },
              { id: "equipment", label: "설비", options: ["A1", "A2", "A3", "A4", "A5"] },
              { id: "shift", label: "근무조", options: ["주간", "야간"] },
              { id: "manager", label: "담당기사", options: ["홍길동", "김아무개"] },
              { id: "status", label: "작업지시여부", options: ["미지시", "지시완료"] },
            ]}
          />
          <FixtureSearch placeholder="검색어 입력.." iconColor="default" className="w-[200px] self-center" />
        </div>
      </section>
      <section data-figma-section="table" className="h-[448px] shrink-0 px-5 pt-4">
        <FixtureTable
          headers={headers}
          rows={rows}
          widths={LOOKUP_COLUMN_WIDTHS}
          aligns={LOOKUP_COLUMN_ALIGNS}
          checkedRows={checkedRows}
          onCheckedRowsChange={setCheckedRows}
          selectionColor="black"
          unselectedCheckboxAppearance="grayCheck"
          selectionHeaderIndeterminate={false}
          disabledRows={[7]}
          hiddenSelectionRows={[7]}
          edgePadding={0}
          selectionColumnWidth={56}
          centerSelection
          columnDividers={false}
          horizontalScroll={false}
          disabledTextTone="gray60"
          className="h-[432px] rounded-mes-control border-0 ring-1 ring-inset ring-mes-border-default"
        />
      </section>
    </div>
  );
}

interface ProductionRow {
  id: number;
  start: string;
  end: string;
  unit: string;
  quantity: string;
  defectQuantity: string;
  packagingQuantity: string;
  blackStart: string;
  blackEnd: string;
  warehouse: string;
}

function ProductionContent() {
  const [instructionDate, setInstructionDate] = React.useState<Date>();
  const [item, setItem] = React.useState("선택");
  const [manager, setManager] = React.useState("선택");
  const [packagingStaff, setPackagingStaff] = React.useState("선택");
  const [completed, setCompleted] = React.useState(false);
  const [workTime, setWorkTime] = React.useState("12:00 ~ 14:00");
  const [defectQuantity, setDefectQuantity] = React.useState("선택");
  const [productionQuantity, setProductionQuantity] = React.useState("내용 입력");
  const [warehouse, setWarehouse] = React.useState("선택");
  const [inputItem, setInputItem] = React.useState("내용 입력");
  const [search, setSearch] = React.useState("");
  const [resultRows, setResultRows] = React.useState<ProductionRow[]>(() => Array.from({ length: 10 }, (_, index) => ({ id: index + 1, start: "13:00", end: "19:00", unit: "kg", quantity: "100", defectQuantity: "100", packagingQuantity: "10", blackStart: "300", blackEnd: "302", warehouse: "동진창고" })));
  const addResult = () => setResultRows((current) => [{ id: Date.now(), start: workTime.split("~")[0]?.trim() || "12:00", end: workTime.split("~")[1]?.trim() || "14:00", unit: "kg", quantity: productionQuantity, defectQuantity, packagingQuantity: packagingStaff === "선택" ? "0" : packagingStaff, blackStart: "300", blackEnd: "302", warehouse: warehouse === "선택" ? "동진창고" : warehouse }, ...current]);
  const visibleRows = resultRows.filter((row) => !search || Object.values(row).some((value) => String(value).toLowerCase().includes(search.toLowerCase())));
  const rows = visibleRows.map((row) => [row.start, row.end, row.unit, row.quantity, row.defectQuantity, <Button key={`material-${row.id}`} size="xsmall" variant="opacityMain" endIcon={<IconArrow size={12} className="rotate-180" />}>투입정보</Button>, row.packagingQuantity, row.blackStart, row.blackEnd, row.warehouse, <IconButton key={`delete-${row.id}`} aria-label="행 삭제" size="xsmall" onClick={() => setResultRows((current) => current.filter((itemRow) => itemRow.id !== row.id))} icon={<IconTrash size={14} />} />]);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-[238px] shrink-0 border-b border-mes-gray-30 p-5">
        <SectionBand>지시정보</SectionBand>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
          <LabeledControl label="설비"><FixtureInput value="내용" muted /></LabeledControl>
          <LabeledControl label="지시일"><DatePicker value={instructionDate} onValueChange={setInstructionDate} placeholder="년-월-일" /></LabeledControl>
          <LabeledControl label="근무조"><FixtureInput value="내용" muted /></LabeledControl>
          <LabeledControl label="품목"><div className="flex gap-2"><FixtureSelect value={item} options={["선택", ...LOOKUP_ITEMS]} onValueChange={setItem} className="flex-1" /><IconButton aria-label="품목 상세정보" size="small" className="bg-mes-primary-20 text-mes-primary-60" icon={<IconFileNote size={16} />} /></div></LabeledControl>
          <LabeledControl label="담당기사"><FixtureSelect value={manager} options={LOOKUP_MANAGER_OPTIONS} onValueChange={setManager} /></LabeledControl>
          <LabeledControl label="누적생산"><FixtureInput value="내용" muted /></LabeledControl>
          <LabeledControl label="포장인원"><FixtureSelect value={packagingStaff} options={["선택", "5", "10", "15"]} onValueChange={setPackagingStaff} /></LabeledControl>
          <LabeledControl label="작업상태"><div className="flex items-center gap-4"><FixtureInput value={completed ? "완료" : "진행중"} muted className="flex-1" /><label className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap"><Checkbox checked={completed} onChange={(event) => setCompleted(event.target.checked)} color="black" uncheckedAppearance="grayCheck" size="small" />완료</label></div></LabeledControl>
        </div>
      </div>
      <div className="h-[238px] shrink-0 border-b border-mes-gray-30 bg-mes-gray-10 p-5">
        <div className="h-[195px] rounded-xl bg-mes-gray-20 p-3">
          <b className="text-[16px]">실적정보</b>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
            <LabeledControl label="작업시간"><FixtureInput value={workTime} onValueChange={setWorkTime} /></LabeledControl>
            <LabeledControl label="불량수량"><FixtureSelect value={defectQuantity} options={["선택", "0", "10", "100"]} onValueChange={setDefectQuantity} /></LabeledControl>
            <LabeledControl label="생산수량"><FixtureInput value={productionQuantity} onValueChange={setProductionQuantity} inputMode="numeric" /></LabeledControl>
            <LabeledControl label="저장창고"><FixtureSelect value={warehouse} options={["선택", "동진창고", "임가공창고A"]} onValueChange={setWarehouse} /></LabeledControl>
            <LabeledControl label="투입품목"><FixtureInput value={inputItem} onValueChange={setInputItem} /></LabeledControl>
          </div>
        </div>
        <div className="-mt-4 flex justify-center"><Button size="small" className="w-[160px]" startIcon={<IconArrow size={15} className="-rotate-90" />} onClick={addResult}>실적 추가</Button></div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-3"><div className="mb-2 flex items-center justify-between"><b className="text-[15px]">생산실적 상세 리스트</b><FixtureSearch value={search} onValueChange={setSearch} className="w-[200px]" /></div><FixtureTable selectable={false} horizontalScroll={false} headers={["시작시간", "종료시간", "단위", "생산수량", "불량수량", "투입정보", "포장수량", "흑시작(No)", "흑종료(No)", "창고명", "삭제"]} widths={[70, 70, 60, 80, 80, 90, 75, 85, 85, 95, 40]} aligns={["center", "center", "center", "right", "right", "center", "right", "right", "right", "left", "center"]} rows={rows} /></div>
    </div>
  );
}

interface ReceivingRow {
  id: number;
  item: string;
  itemType: string;
  specification: string;
  unit: string;
  orderQuantity: string;
  receivingType: string;
  lastReceivingDate: string;
  receivingQuantity: string;
  registrationCount: string;
}

const INITIAL_RECEIVING_ROWS: ReceivingRow[] = [
  { id: 1, item: "비비빅", itemType: "완제품", specification: "A", unit: "kg", orderQuantity: "4,000", receivingType: "임가공", lastReceivingDate: "2024.10.30", receivingQuantity: "3,980", registrationCount: "3" },
  { id: 2, item: "죠스바", itemType: "완제품", specification: "A", unit: "kg", orderQuantity: "4,000", receivingType: "임가공", lastReceivingDate: "", receivingQuantity: "", registrationCount: "" },
  { id: 3, item: "빵빠레 꿀고구마", itemType: "완제품", specification: "A", unit: "kg", orderQuantity: "1,500", receivingType: "임가공", lastReceivingDate: "2024.10.30", receivingQuantity: "1,280", registrationCount: "1" },
  { id: 4, item: "누가바 피스타치오", itemType: "완제품", specification: "A", unit: "Ea", orderQuantity: "380", receivingType: "임가공", lastReceivingDate: "2024.10.30", receivingQuantity: "280", registrationCount: "1" },
  { id: 5, item: "빵빠레 초코크림", itemType: "완제품", specification: "A", unit: "kg", orderQuantity: "1,500", receivingType: "임가공", lastReceivingDate: "", receivingQuantity: "", registrationCount: "" },
  { id: 6, item: "누가바 크런치", itemType: "완제품", specification: "A", unit: "Ea", orderQuantity: "800", receivingType: "임가공", lastReceivingDate: "", receivingQuantity: "", registrationCount: "" },
];

function ReceivingContent() {
  const [customer, setCustomer] = React.useState("D업체");
  const [expectedDate, setExpectedDate] = React.useState(new Date(2025, 9, 30));
  const [item, setItem] = React.useState("비비빅");
  const [quantity, setQuantity] = React.useState("13");
  const [receivingDate, setReceivingDate] = React.useState(new Date(2025, 9, 30));
  const [warehouse, setWarehouse] = React.useState("선택");
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState<ReceivingRow[]>(INITIAL_RECEIVING_ROWS);

  const addReceivingRow = () => {
    setRows((current) => [
      {
        id: Date.now(),
        item,
        itemType: "완제품",
        specification: "A",
        unit: "kg",
        orderQuantity: "4,000",
        receivingType: "임가공",
        lastReceivingDate: `${receivingDate.getFullYear()}.${String(receivingDate.getMonth() + 1).padStart(2, "0")}.${String(receivingDate.getDate()).padStart(2, "0")}`,
        receivingQuantity: quantity,
        registrationCount: "1",
      },
      ...current,
    ]);
  };

  const visibleRows = rows.filter((row) => !search || Object.values(row).some((value) => String(value).toLowerCase().includes(search.toLowerCase())));
  const tableRows = visibleRows.map((row) => [
    row.item,
    row.itemType,
    row.specification,
    row.unit,
    row.orderQuantity,
    row.receivingType,
    row.lastReceivingDate,
    row.receivingQuantity,
    row.registrationCount ? <Link key={`count-${row.id}`} href={`#receiving-registration-${row.id}`} onClick={(event) => event.preventDefault()}>{row.registrationCount}</Link> : "",
    <IconButton key={`delete-${row.id}`} aria-label={`${row.item} 삭제`} size="xsmall" icon={<IconTrash size={14} />} onClick={() => setRows((current) => current.filter((itemRow) => itemRow.id !== row.id))} />,
  ]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="shrink-0 border-b border-mes-gray-30 p-5">
        <SectionBand>기본정보</SectionBand>
        <div className="mt-3 grid grid-cols-2 gap-6">
          <LabeledControl label="거래처" required><FixtureSelect value={customer} options={["D업체", "A업체", "B업체"]} onValueChange={setCustomer} /></LabeledControl>
          <LabeledControl label="입고예정일"><DatePicker value={expectedDate} onValueChange={setExpectedDate} separator="-" /></LabeledControl>
        </div>
      </div>

      <div className="shrink-0 px-5 pt-5">
        <div className="rounded-lg bg-mes-gray-20 px-4 pb-8 pt-3">
          <div className="flex items-center justify-between">
            <b className="text-[16px]">LOT단위 품목 추가</b>
            <Button size="small" variant="fillBlack" endIcon={<IconArrow size={14} className="rotate-180" />}>리스트 조회/선택</Button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
            <LabeledControl label="품목" required><FixtureSelect value={item} options={PURCHASE_ITEMS} onValueChange={setItem} /></LabeledControl>
            <LabeledControl label="품목구분"><FixtureInput value="완제품" muted /></LabeledControl>
            <LabeledControl label="입고수량" required><FixtureInput value={quantity} onValueChange={setQuantity} inputMode="numeric" /></LabeledControl>
            <LabeledControl label="단위"><FixtureInput value="kg" muted /></LabeledControl>
            <LabeledControl label="입고창고" required><FixtureSelect value={warehouse} options={["선택", "동진창고", "임가공창고A"]} onValueChange={setWarehouse} /></LabeledControl>
            <LabeledControl label="규격"><FixtureInput value="A" muted /></LabeledControl>
            <LabeledControl label="입고일" required><DatePicker value={receivingDate} onValueChange={setReceivingDate} separator="-" /></LabeledControl>
            <LabeledControl label="입고구분"><FixtureInput value="임가공" muted /></LabeledControl>
          </div>
          <div className="-mb-4 mt-3 flex justify-center"><Button size="small" className="w-[160px]" startIcon={<IconArrow size={15} className="-rotate-90" />} onClick={addReceivingRow}>추가</Button></div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pt-3">
        <div className="mb-2 flex items-center justify-between"><b className="text-[15px]">생산실적 상세 리스트</b><FixtureSearch value={search} onValueChange={setSearch} className="w-[200px]" /></div>
        <FixtureTable
          selectable={false}
          horizontalScroll={false}
          headers={["품목", "품목구분", "규격", "단위", "발주수량", "입고구분", "최종입고일", "입고실적", "등록내역", "삭제"]}
          widths={[150, 90, 55, 55, 75, 80, 90, 70, 65, 45]}
          aligns={["left", "center", "center", "center", "right", "center", "center", "right", "center", "center"]}
          rows={tableRows}
          className="min-h-0 flex-1"
        />
      </div>
    </div>
  );
}

interface CustomInformationRow {
  id: number;
  code: string;
  name: string;
  inputType: string;
  informationType: string;
}

const INITIAL_CUSTOM_INFORMATION_ROWS: CustomInformationRow[] = [
  { id: 1, code: "항목1", name: "재질", inputType: "텍스트입력", informationType: "규격정보" },
  { id: 2, code: "항목2", name: "색상", inputType: "텍스트입력", informationType: "규격정보" },
  { id: 3, code: "항목3", name: "두께", inputType: "텍스트입력", informationType: "규격정보" },
  { id: 4, code: "항목4", name: "폭", inputType: "텍스트입력", informationType: "규격정보" },
];

function CustomInformationContent() {
  const [receivingInspection, setReceivingInspection] = React.useState(true);
  const [processInspection, setProcessInspection] = React.useState(true);
  const [shippingInspection, setShippingInspection] = React.useState(true);
  const [selfInspection, setSelfInspection] = React.useState(true);
  const [lotCreation, setLotCreation] = React.useState(true);
  const [creationBasis, setCreationBasis] = React.useState<"production" | "packaging">("production");
  const [rows, setRows] = React.useState<CustomInformationRow[]>(INITIAL_CUSTOM_INFORMATION_ROWS);
  const [editorOpen, setEditorOpen] = React.useState(true);
  const [draft, setDraft] = React.useState({ code: "항목1", name: "항목명 사용자 지정", inputType: "텍스트 입력", informationType: "규격정보" });

  const addInformation = () => {
    setRows((current) => [
      ...current,
      {
        id: Date.now(),
        code: draft.code,
        name: draft.name,
        inputType: draft.inputType.replace(" ", ""),
        informationType: draft.informationType,
      },
    ]);
    setEditorOpen(false);
  };

  const inspectionRadio = (name: string, value: boolean, onChange: (value: boolean) => void) => (
    <div className="flex gap-4">
      <RadioOption name={name} checked={value} label="Y" onChange={() => onChange(true)} />
      <RadioOption name={name} checked={!value} label="N" onChange={() => onChange(false)} />
    </div>
  );

  const tableRows = rows.map((row) => [
    <IconButton
      key={`remove-${row.id}`}
      aria-label={`${row.name} 삭제`}
      size="xsmall"
      icon={<IconX size={12} />}
      onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
    />,
    row.code,
    row.name,
    row.inputType,
    row.informationType,
  ]);

  return (
    <div className="grid min-h-full w-full grid-cols-[360px_minmax(0,1fr)]">
      <div className="border-r border-mes-gray-30 p-5">
        <SectionBand>기본 정보</SectionBand>
        <div className="mt-3 space-y-4">
          <LabeledControl label="품목" required><FixtureInput value="빠삐코" /></LabeledControl>
          <LabeledControl label="품목 구분" required><FixtureInput value="완제품" /></LabeledControl>
          <LabeledControl label="표준 단가"><FixtureInput value="500" inputMode="numeric" /></LabeledControl>
          <LabeledControl label="단위" required><FixtureSelect value="EA" options={["EA", "kg", "BOX"]} /></LabeledControl>
          <LabeledControl label="ROUTE"><FixtureSelect value="압출" options={["압출", "성형", "포장"]} /></LabeledControl>
          <LabeledControl label="입고검사" required>{inspectionRadio("custom-receiving", receivingInspection, setReceivingInspection)}</LabeledControl>
          <LabeledControl label="공정검사" required>{inspectionRadio("custom-process", processInspection, setProcessInspection)}</LabeledControl>
          <LabeledControl label="출하검사" required>{inspectionRadio("custom-shipping", shippingInspection, setShippingInspection)}</LabeledControl>
          <LabeledControl label="자주검사" required>{inspectionRadio("custom-self", selfInspection, setSelfInspection)}</LabeledControl>
          <LabeledControl label="입상수(포장단위)"><FixtureInput value="500" inputMode="numeric" /></LabeledControl>
          <LabeledControl label="LOT 생성" required>{inspectionRadio("custom-lot", lotCreation, setLotCreation)}</LabeledControl>
          <LabeledControl label="생성기준">
            <div className="flex gap-3">
              <RadioOption name="custom-basis" checked={creationBasis === "production"} label="제조수량" onChange={() => setCreationBasis("production")} />
              <RadioOption name="custom-basis" checked={creationBasis === "packaging"} label="박스포장수량" onChange={() => setCreationBasis("packaging")} />
            </div>
          </LabeledControl>
          <LabeledControl label="기준수량"><div className="flex items-center gap-2"><FixtureInput value="500" inputMode="numeric" /><span className="text-[13px] text-mes-gray-80">박스</span></div></LabeledControl>
        </div>
      </div>

      <div className="flex min-h-full min-w-0 flex-col bg-mes-gray-20 px-3 py-4">
        <div className="flex h-8 items-center gap-1.5 text-[15px] font-bold">
          <IconArrow size={14} />
          <span>커스텀 정보 등록</span>
        </div>
        <FixtureTable
          selectable={false}
          horizontalScroll={false}
          headers={["", "항목코드", "항목명", "입력유형", "정보Type"]}
          widths={[32, 64, 64, 86, 94]}
          aligns={["center", "center", "center", "center", "center"]}
          rows={tableRows}
          className="mt-2 shrink-0 bg-white"
        />
        <Button
          variant="lineMain"
          size="small"
          className="mt-2 w-full"
          startIcon={<IconPlus size={15} />}
          onClick={() => {
            setDraft({ code: "항목1", name: "항목명 사용자 지정", inputType: "텍스트 입력", informationType: "규격정보" });
            setEditorOpen(true);
          }}
        >
          정보 추가
        </Button>

        {editorOpen && <Card className="mt-3 shrink-0 p-4">
          <b className="text-[15px]">정보 추가</b>
          <div className="mt-3 space-y-2.5">
            <LabeledControl label="항목코드"><FixtureSelect value={draft.code} options={["항목1", "항목2", "항목3", "항목4"]} onValueChange={(code) => setDraft((current) => ({ ...current, code }))} /></LabeledControl>
            <LabeledControl label="항목명"><FixtureInput value={draft.name} onValueChange={(name) => setDraft((current) => ({ ...current, name }))} /></LabeledControl>
            <LabeledControl label="입력유형"><FixtureSelect value={draft.inputType} options={["텍스트 입력", "숫자 입력", "선택"]} onValueChange={(inputType) => setDraft((current) => ({ ...current, inputType }))} /></LabeledControl>
            <LabeledControl label="정보 Type"><FixtureSelect value={draft.informationType} options={["규격정보", "검사정보", "생산정보"]} onValueChange={(informationType) => setDraft((current) => ({ ...current, informationType }))} /></LabeledControl>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Button size="small" variant="fillGray" onClick={() => setEditorOpen(false)}>취소</Button>
            <Button size="small" variant="fillBlack" onClick={addInformation}>저장</Button>
          </div>
        </Card>}
        <Button className="mt-auto w-full" onClick={() => setEditorOpen(false)}>완료</Button>
      </div>
    </div>
  );
}

function InspectionContent() {
  const [inspectionDate, setInspectionDate] = React.useState(new Date(2025, 9, 30));
  const [inspectionTime, setInspectionTime] = React.useState("14:45");
  const [inspector, setInspector] = React.useState("김아무개");
  const [boxNumber, setBoxNumber] = React.useState("150");
  const [weight, setWeight] = React.useState("0");
  const [notes, setNotes] = React.useState("");
  const [result, setResult] = React.useState<"pass" | "partial" | "fail">("pass");
  const [items, setItems] = React.useState<Array<{ id: number; label: string; value: InspectionJudgementValue }>>([
    { id: 1, label: "Pallet 상태", value: "pass" },
    { id: 2, label: "표기사항", value: "pass" },
    { id: 3, label: "포장상태", value: "pass" },
    { id: 4, label: "상차밴딩", value: "pass" },
  ]);
  const updateJudgement = (id: number, value: InspectionJudgementValue) => setItems((current) => current.map((item) => item.id === id ? { ...item, value } : item));
  const addInspectionItem = () => setItems((current) => [...current, { id: Date.now(), label: `검사항목 ${current.length + 1}`, value: "none" }]);
  return (
    <div className="grid h-full w-full grid-cols-[360px_1fr]">
      <div className="border-r border-mes-gray-30 p-5">
        <SectionBand>대상정보</SectionBand>
        <div className="mt-3 space-y-4">
          {[["생산일", "2024-10-30"], ["작업자", "홍길동"], ["설비", "A1"], ["제품명", "더블비얀코"], ["ROUTE", "압출"]].map((item) => <FieldRow key={item[0]} label={item[0]} value={item[1]} muted />)}
          <LabeledControl label="검사일" required><DatePicker value={inspectionDate} onValueChange={setInspectionDate} separator="-" /></LabeledControl>
          <LabeledControl label="검사시간" required><TimePicker value={inspectionTime} onValueChange={setInspectionTime} indicator="chevron" /></LabeledControl>
          <LabeledControl label="검사자" required><FixtureSelect value={inspector} options={["김아무개", "홍길동"]} onValueChange={setInspector} /></LabeledControl>
          <LabeledControl label="Box-No"><FixtureInput value={boxNumber} onValueChange={setBoxNumber} inputMode="numeric" /></LabeledControl>
          <LabeledControl label="중량검사" required><div className="flex gap-2"><FixtureInput value={weight} onValueChange={setWeight} inputMode="numeric" muted className="flex-1" /><IconButton aria-label="중량검사 상세" size="small" className="bg-mes-primary-20 text-mes-primary-60" icon={<IconShare size={16} />} /></div></LabeledControl>
          <LabeledControl label="특이사항"><div className="flex gap-2"><FixtureInput value={notes} onValueChange={setNotes} className="flex-1" /><IconButton aria-label="특이사항 상세" size="small" className="bg-mes-primary-20 text-mes-primary-60" icon={<IconShare size={16} />} /></div></LabeledControl>
          <LabeledControl label="결과"><div className="flex gap-4"><RadioOption name="inspection-result" checked={result === "pass"} label="합격" onChange={() => setResult("pass")} /><RadioOption name="inspection-result" checked={result === "partial"} label="일부" onChange={() => setResult("partial")} /><RadioOption name="inspection-result" checked={result === "fail"} label="불합" onChange={() => setResult("fail")} /></div></LabeledControl>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2"><SectionBand>검사항목</SectionBand><Button size="small" variant="fillBlack" startIcon={<IconPlus size={15} />} onClick={addInspectionItem}>항목 추가</Button></div>
        <div className="mt-4 space-y-4">{items.map((item) => <div key={item.id} className="flex h-8 items-center justify-between text-[14px]"><span>{item.label}<span className="ml-[3px] font-semibold text-mes-danger-60">*</span></span><InspectionJudgement value={item.value} onValueChange={(value) => updateJudgement(item.id, value)} /></div>)}</div>
      </div>
    </div>
  );
}

function CenterPopup({ kind, open, onOpenChange }: { kind: CenterPopupKind; open: boolean; onOpenChange: (open: boolean) => void }) {
  const defaultActions = createDefaultActions(() => onOpenChange(false));
  const confirmActions = (label: string): DialogAction[] => [
    { id: "cancel", label: "취소", variant: "fillGray", onClick: () => onOpenChange(false) },
    { id: "confirm", label, variant: "fillBlack", onClick: () => onOpenChange(false) },
  ];
  const config: Record<typeof kind, { title: string; size: CenterModalSize; height: string; actions: DialogAction[]; content: React.ReactNode; contentClassName?: string; maxHeight?: string }> = {
    quantity: { title: "생산수량 입력", size: "compact-400", height: "h-[437px]", actions: [SAVE_ACTION], content: <QuantityContent /> },
    details: { title: "품목 상세정보", size: "compact-480", height: "h-[436px]", actions: [], content: <DetailsContent /> },
    defect: { title: "불량수량 입력", size: "medium-600", height: "h-[400px]", actions: [SAVE_ACTION], content: <DefectContent /> },
    weight: { title: "중량검사", size: "standard-960", height: "h-[752px]", actions: defaultActions, content: <WeightContent />, contentClassName: "p-0" },
    purchase: { title: "발주 일괄등록", size: "large-1100", height: "h-[680px]", actions: defaultActions, content: <PurchaseContent /> },
    lookup: { title: "생산계획(일) 연동 일괄작업지시", size: "wide-1400", height: "h-[680px]", actions: defaultActions, content: <LookupWorkOrderContent />, contentClassName: "items-stretch overflow-hidden p-0", maxHeight: "max-h-none" },
    "material-input-setup": { title: "투입품목 설정/조회", size: "wide-1400", height: "h-[800px]", actions: defaultActions, content: <MaterialInputSetupContent />, contentClassName: "items-stretch overflow-hidden p-0", maxHeight: "max-h-none" },
    "bom-copy": { title: "BOM 복사", size: "wide-1024", height: "h-[678px]", actions: confirmActions("확인"), content: <BomCopyContent />, contentClassName: "items-stretch overflow-hidden p-0", maxHeight: "max-h-[calc(100vh-32px)]" },
    "preissued-label": { title: "선발행 라벨 수량 확정", size: "wide-1024", height: "h-[576px]", actions: confirmActions("확인"), content: <PreissuedLabelContent />, contentClassName: "items-stretch overflow-hidden p-0", maxHeight: "max-h-[calc(100vh-32px)]" },
    "operating-time-picker": { title: "가동시간 선택", size: "medium-600", height: "h-[666px]", actions: confirmActions("입력"), content: <TimeSelectionContent mode="operating" />, contentClassName: "items-stretch overflow-hidden px-5 pt-5", maxHeight: "max-h-[calc(100vh-32px)]" },
    "downtime-picker": { title: "비가동시간 선택", size: "medium-600", height: "h-[666px]", actions: confirmActions("입력"), content: <TimeSelectionContent mode="downtime" />, contentClassName: "items-stretch overflow-hidden px-5 pt-5", maxHeight: "max-h-[calc(100vh-32px)]" },
  };
  const current = config[kind];
  return <CenterModal open={open} onOpenChange={onOpenChange} title={current.title} size={current.size} actions={current.actions} headerDivider={kind !== "details"} className={`${current.height} ${current.maxHeight ?? ""}`} contentClassName={current.contentClassName ?? (kind === "details" ? "pt-0" : undefined)}>{current.content}</CenterModal>;
}

export function PopupRenderer({ kind, open, onOpenChange }: { kind: PopupKind; open: boolean; onOpenChange: (open: boolean) => void }) {
  const defaultActions = createDefaultActions(() => onOpenChange(false));
  if (kind === "production") return <SideSlidePanel open={open} onOpenChange={onOpenChange} title="생산실적 등록" size={"standard-900" as SideSlidePanelSize} actions={defaultActions} contentClassName="items-stretch p-0"><ProductionContent /></SideSlidePanel>;
  if (kind === "receiving") return <SideSlidePanel open={open} onOpenChange={onOpenChange} title="입고등록" size={"standard-900" as SideSlidePanelSize} actions={defaultActions} contentClassName="items-stretch overflow-x-hidden p-0"><ReceivingContent /></SideSlidePanel>;
  if (kind === "custom") return <SideSlidePanel open={open} onOpenChange={onOpenChange} title="커스텀 정보 등록" size="narrow-760" actions={defaultActions} contentClassName="items-stretch overflow-x-hidden p-0"><CustomInformationContent /></SideSlidePanel>;
  if (kind === "inspection") return <SideSlidePanel open={open} onOpenChange={onOpenChange} title="자주검사" size="narrow-760" actions={defaultActions} contentClassName="items-stretch p-0"><InspectionContent /></SideSlidePanel>;
  if (kind === "operation-log") return <SideSlidePanel open={open} onOpenChange={onOpenChange} title="운전일지 등록" size="standard-900" actions={defaultActions} contentClassName="items-stretch overflow-x-hidden p-0"><UpdatedOperationLogContent /></SideSlidePanel>;
  return <CenterPopup kind={kind} open={open} onOpenChange={onOpenChange} />;
}

function PopupPatternCard({
  group,
  selectedKind,
  onOpen,
}: {
  group: PopupPatternGroup;
  selectedKind: PopupKind;
  onOpen: (kind: PopupKind) => void;
}) {
  const examples = POPUPS.filter((popup) => popup.pattern === group.id);
  return (
    <Card className="flex h-full min-h-[188px] flex-col p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Tag color="opacityMain" size="compact">패턴</Tag>
        <span className="text-[12px] text-mes-gray-60">대표 예제 {examples.length}개</span>
      </div>
      <h4 className="text-[16px] font-bold text-mes-gray-130">{group.title}</h4>
      <p className="mt-1.5 text-[13px] leading-5 text-mes-gray-80">{group.description}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {examples.map((popup) => (
            <Button
              key={popup.id}
              size="small"
              variant={selectedKind === popup.id ? "fillMain" : "lineBlacktxt"}
              onClick={() => onOpen(popup.id)}
              title={`Figma node ${popup.node}`}
            >
              {popup.label}
            </Button>
        ))}
      </div>
    </Card>
  );
}

function CompletedPopupExamples() {
  const [kind, setKind] = React.useState<PopupKind>("production");
  const [open, setOpen] = React.useState(false);
  const current = POPUPS.find((popup) => popup.id === kind)!;
  const openPopup = (popupKind: PopupKind) => {
    setKind(popupKind);
    setOpen(true);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <SourcePopupGallery />
      <Card className="bg-mes-gray-20 p-5">
        <h3 className="text-[18px] font-bold text-mes-gray-130">추가 구현 팝업 패턴</h3>
        <p className="mt-1.5 text-[13px] leading-5 text-mes-gray-80">원본 코드화 팝업 아래에는 재사용 구조를 확인하기 위한 추가 구현 예제를 위치 기준으로 정리합니다.</p>
      </Card>
      <section aria-labelledby="side-popup-patterns-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h3 id="side-popup-patterns-title" className="text-[18px] font-bold text-mes-gray-130">우측 슬라이드 팝업</h3>
            <p className="mt-1 text-[13px] text-mes-gray-80">등록과 검사를 별도 메뉴로 떼지 않고, 우측에서 열리는 모든 팝업을 본문 구조에 따라 나눕니다.</p>
          </div>
          <Tag color="gray" size="compact">4개 구조 · 5개 화면</Tag>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {SIDE_POPUP_GROUPS.map((group) => <PopupPatternCard key={group.id} group={group} selectedKind={kind} onOpen={openPopup} />)}
        </div>
      </section>

      <section aria-labelledby="center-popup-patterns-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h3 id="center-popup-patterns-title" className="text-[18px] font-bold text-mes-gray-130">중앙 팝업</h3>
            <p className="mt-1 text-[13px] text-mes-gray-80">화면 중앙에서 열리는 팝업만 모은 뒤 폼, 테이블, 비교, 탐색, 시간 선택 구조로 세분화합니다.</p>
          </div>
          <Tag color="gray" size="compact">5개 구조 · 11개 화면</Tag>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {CENTER_POPUP_GROUPS.map((group) => <PopupPatternCard key={group.id} group={group} selectedKind={kind} onOpen={openPopup} />)}
        </div>
      </section>

      <Card className="flex min-h-[72px] items-center justify-between gap-4 bg-mes-gray-20 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><Tag color="opacityMain" size="compact">선택됨</Tag><b className="text-[14px]">{current.label}</b></div>
          <p className="mt-1 text-[12px] text-mes-gray-60">Figma node {current.node}</p>
        </div>
        <Button variant="fillBlack" onClick={() => setOpen(true)}>선택한 팝업 다시 열기</Button>
      </Card>
      <PopupRenderer kind={kind} open={open} onOpenChange={setOpen} />
    </div>
  );
}

export { CompletedPopupExamples };
