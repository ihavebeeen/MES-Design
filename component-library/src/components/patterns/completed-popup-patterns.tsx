"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CenterModal, type CenterModalSize, type DialogAction } from "@/components/ui/center-modal";
import { DatePicker } from "@/components/ui/date-picker";
import { IconButton } from "@/components/ui/icon-button";
import { InspectionJudgement } from "@/components/ui/inspection-judgement";
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

type PopupKind = "quantity" | "details" | "defect" | "weight" | "purchase" | "lookup" | "production" | "inspection";

const POPUPS: Array<{ id: PopupKind; label: string; node: string }> = [
  { id: "quantity", label: "400 · 생산수량 입력", node: "11210:52992" },
  { id: "details", label: "480 · 품목 상세정보", node: "11210:52744" },
  { id: "defect", label: "600 · 불량수량 입력", node: "11210:52919" },
  { id: "weight", label: "960 · 중량검사", node: "11210:51787" },
  { id: "purchase", label: "1100 · 발주 일괄등록", node: "11210:52026" },
  { id: "lookup", label: "1400 · 일괄작업지시", node: "11210:50866" },
  { id: "production", label: "900 · 생산실적 등록", node: "11210:48851" },
  { id: "inspection", label: "760 · 자주검사", node: "11210:51420" },
];

const SAVE_ACTION: DialogAction = { id: "save", label: "저장", variant: "fillBlack" };
const DEFAULT_ACTIONS: DialogAction[] = [
  { id: "cancel", label: "취소", variant: "fillGray" },
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

function LabeledControl({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>{label}</span>{children}</div>;
}

function InlineLabeledControl({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`flex h-8 min-w-0 items-center overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white ${className ?? ""}`}><span className="shrink-0 px-3 text-[13px] text-mes-gray-60">{label}</span><div className="min-w-0 flex-1">{children}</div></div>;
}

function QuantityContent() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col gap-2">
        <RadioOption name="quantity-mode" checked label="수기 입력" />
        <div className="pl-[30px]"><FixtureInput value="4" /></div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <RadioOption name="quantity-mode" checked={false} label="자동 계산" disabled />
        <div className="flex flex-col gap-1.5 pl-[30px]">
          <FixtureInput value="" muted />
          <span className="text-[14px] font-medium text-mes-gray-60">입상수 : 정보 없음</span>
          <Card className="bg-mes-gray-10 px-5 text-[14px] text-mes-gray-60">
            {["흑", "적"].map((label) => (
              <div key={label} className="flex h-[45px] items-center gap-2.5 border-b border-mes-gray-30 last:border-0">
                <span className="w-5 font-medium">{label}</span>
                <FixtureInput value="2" muted size="small" aria-label={`${label} 시작`} />
                <FixtureInput value="0" muted size="small" aria-label={`${label} 종료`} />
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
  const rows = [["1", "색상", "임가공창고A", "2"], ["2", "모양", "임가공창고A", "2"], ["3", "인쇄", "선택", ""], ["4", "선택", "선택", ""], ["5", "선택", "선택", ""]];
  return (
    <div className="flex h-full w-full flex-col">
      <FixtureTable
        selectable={false}
        headers={["No.", "불량유형", "저장창고", "불량수량"]}
        widths={[60, 166, 166, 166]}
        rows={rows.map((row) => [row[0], <FixtureSelect key={`${row[0]}-type`} value={row[1]} size="small" />, <FixtureSelect key={`${row[0]}-warehouse`} value={row[2]} size="small" />, <FixtureInput key={`${row[0]}-qty`} value={row[3]} size="small" />])}
      />
      <Card className="mt-5 flex h-14 items-center justify-center gap-3 bg-mes-primary-20 text-[16px] font-semibold text-mes-primary-60">
        <span>불량계</span><FixtureInput value="4" className="w-[120px] text-mes-gray-130" />
      </Card>
    </div>
  );
}

function WeightContent() {
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
          <div className="mb-3 flex h-8 items-center gap-5 text-[14px]"><span>배열 설정</span><RadioOption name="weight-layout" checked label="자동배열" /><RadioOption name="weight-layout" checked={false} label="사용자 설정" /></div>
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
  const headers = ["품목", "품목구분", "규격", "단위", "입고예정일", "입고구분", "입고수량", "입고창고"];
  const rows = PURCHASE_ITEMS.map((item, index) => [item, "완제품", "A", "kg", index < 2 ? <DatePicker key="date" value={new Date(2025, 9, 30)} separator="-" className="h-[22px] px-1.5 text-[12px]" /> : "", index < 2 ? <FixtureSelect key="type" value="선택" size="small" /> : "", index < 2 ? <FixtureInput key="qty" value="0" size="small" /> : "", index < 2 ? <FixtureSelect key="warehouse" value="선택" size="small" /> : ""]);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between"><b className="text-[16px]">품목 리스트</b></div>
      <div className="mt-3 flex h-12 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3"><FixtureFilter tags={[{ label: "품목", count: 5 }, { label: "품목", count: 23 }, { label: "품목: 전체보기", count: 1 }]} /><FixtureSearch /></div>
      <div className="mt-3 flex h-12 items-center gap-2.5 rounded-t-mes-control bg-mes-gray-20 px-3"><b className="flex w-[160px] shrink-0 items-center gap-1"><IconReload size={16} />전체 일괄 변경</b><InlineLabeledControl label="입고 예정일" className="w-[220px] shrink-0"><DatePicker value={new Date(2025, 9, 30)} separator="-" className="h-full rounded-none border-0" /></InlineLabeledControl><InlineLabeledControl label="입고 구분" className="flex-1"><FixtureSelect value="선택" className="h-full rounded-none border-0" /></InlineLabeledControl><InlineLabeledControl label="입고 수량" className="flex-1"><FixtureInput value="0" className="h-full rounded-none border-0" /></InlineLabeledControl><InlineLabeledControl label="입고 창고" className="flex-1"><FixtureSelect value="선택" className="h-full rounded-none border-0" /></InlineLabeledControl><Button size="small" className="w-[60px] shrink-0">적용</Button></div>
      <div className="min-h-0 flex-1 overflow-hidden"><FixtureTable headers={headers} rows={rows} selectedRows={[0, 1]} checkedRows={rows.map((_, index) => index)} selectionColor="gray" disabledRows={Array.from({ length: 10 }, (_, index) => index + 2)} aligns={["left", "center", "center", "center", "center", "center", "right", "center"]} /></div>
    </div>
  );
}

const LOOKUP_COLUMN_WIDTHS = [125.75, 125.75, 125.75, 58, 80, 80, 125.75, 80, 125.75, 125.75, 125.75, 125.75];
const LOOKUP_COLUMN_ALIGNS: Array<"left" | "center" | "right"> = ["center", "left", "center", "center", "right", "right", "center", "center", "center", "right", "center", "center"];

function LookupWorkOrderContent() {
  const [checkedRows, setCheckedRows] = React.useState([0]);
  const [instructionQuantity, setInstructionQuantity] = React.useState("3000");
  const headers = ["계획일", "품목", "품목구분", "단위", "계획수량", "포장인원", "설비", "근무조", "지시일", "지시수량", "담당기사", "작업지시여부"];
  const units = ["EA", "EA", "EA", "kg", "kg", "EA", "EA", "kg"];
  const equipment = ["A1", "A2", "A3", "A5", "A2", "A4", "A1", "A2"];
  const shifts = ["주간", "주간", "주간", "주간", "주간", "야간", "야간", "야간"];
  const rows = LOOKUP_ITEMS.map((item, index) => [
    "2024-08-30",
    item,
    "완제품",
    units[index],
    "2000",
    "2000",
    index === 0 ? <FixtureSelect key="equipment" value={equipment[index]} size="small" /> : equipment[index],
    index === 0 ? <FixtureSelect key="shift" value={shifts[index]} size="small" /> : shifts[index],
    index === 0 ? <DatePicker key="date" value={new Date(2025, 9, 30)} separator="-" iconColor="default" className="h-[22px] gap-1 rounded-mes-control-sm px-[6px] text-[13px]" /> : index === 7 ? "2025-10-30" : "",
    index === 0 ? <FixtureInput key="qty" value={instructionQuantity} onValueChange={setInstructionQuantity} inputMode="numeric" size="small" /> : index === 7 ? "2000" : "",
    index === 0 ? <FixtureSelect key="manager" value="홍길동" size="small" /> : index === 7 ? "김아무개" : "",
    index === 7 ? <Tag key="done" color="gray">지시완료</Tag> : "",
  ]);

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

function ProductionContent() {
  const rows = Array.from({ length: 10 }, (_, index) => ["13:00", "19:00", "kg", "100", "100", <Button key={`material-${index}`} size="xsmall" variant="opacityMain" endIcon={<IconArrow size={12} className="rotate-180" />}>투입정보</Button>, "10", "300", "302", "동진창고", <IconButton key={`delete-${index}`} aria-label="행 삭제" size="xsmall" icon={<IconTrash size={14} />} />]);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-[238px] shrink-0 border-b border-mes-gray-30 p-5">
        <SectionBand>지시정보</SectionBand>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
          <LabeledControl label="설비"><FixtureInput value="내용" muted /></LabeledControl>
          <LabeledControl label="지시일"><DatePicker placeholder="년-월-일" /></LabeledControl>
          <LabeledControl label="근무조"><FixtureInput value="내용" muted /></LabeledControl>
          <LabeledControl label="품목"><div className="flex gap-2"><FixtureSelect value="선택" className="flex-1" /><IconButton aria-label="품목 상세정보" size="small" className="bg-mes-primary-20 text-mes-primary-60" icon={<IconFileNote size={16} />} /></div></LabeledControl>
          <LabeledControl label="담당기사"><FixtureSelect value="선택" /></LabeledControl>
          <LabeledControl label="누적생산"><FixtureInput value="내용" muted /></LabeledControl>
          <LabeledControl label="포장인원"><FixtureSelect value="선택" /></LabeledControl>
          <LabeledControl label="작업상태"><div className="flex items-center gap-4"><FixtureInput value="진행중" muted className="flex-1" /><label className="flex items-center gap-1.5 whitespace-nowrap"><Checkbox checked readOnly color="gray" size="small" />완료</label></div></LabeledControl>
        </div>
      </div>
      <div className="h-[238px] shrink-0 border-b border-mes-gray-30 bg-mes-gray-10 p-5">
        <div className="h-[195px] rounded-xl bg-mes-gray-20 p-3">
          <b className="text-[16px]">실적정보</b>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
            <LabeledControl label="작업시간"><FixtureInput value="12:00 ~ 14:00" /></LabeledControl>
            <LabeledControl label="불량수량"><FixtureSelect value="선택" /></LabeledControl>
            <LabeledControl label="생산수량"><FixtureInput value="내용 입력" /></LabeledControl>
            <LabeledControl label="저장창고"><FixtureSelect value="선택" /></LabeledControl>
            <LabeledControl label="투입품목"><FixtureInput value="내용 입력" /></LabeledControl>
          </div>
        </div>
        <div className="-mt-4 flex justify-center"><Button size="small" className="w-[160px]" startIcon={<IconArrow size={15} className="-rotate-90" />}>실적 추가</Button></div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-3"><div className="mb-2 flex items-center justify-between"><b className="text-[15px]">생산실적 상세 리스트</b><FixtureSearch className="w-[200px]" /></div><FixtureTable selectable={false} headers={["시작시작", "종료시간", "단위", "생산수량", "불량수량", "투입정보", "포장수량", "흑시작(No)", "흑시작(No)", "창고명", "삭제"]} widths={[70, 70, 60, 80, 80, 90, 75, 85, 85, 95, 40]} aligns={["center", "center", "center", "right", "right", "center", "right", "right", "right", "left", "center"]} rows={rows} /></div>
    </div>
  );
}

function InspectionContent() {
  return (
    <div className="grid h-full w-full grid-cols-[360px_1fr]">
      <div className="border-r border-mes-gray-30 p-5">
        <SectionBand className="w-16">대상정보</SectionBand>
        <div className="mt-3 space-y-4">
          {[["생산일", "2024-10-30"], ["작업자", "홍길동"], ["설비", "A1"], ["제품명", "더블비얀코"], ["ROUTE", "압출"]].map((item) => <FieldRow key={item[0]} label={item[0]} value={item[1]} muted />)}
          <LabeledControl label="검사일 *"><DatePicker value={new Date(2025, 9, 30)} separator="-" /></LabeledControl>
          <LabeledControl label="검사시간 *"><TimePicker value="14:45" indicator="chevron" /></LabeledControl>
          <FieldRow label="검사자 *" value="김아무개" select />
          <FieldRow label="Box-No" value="150" />
          <LabeledControl label="중량검사 *"><div className="flex gap-2"><FixtureInput value="0" muted className="flex-1" /><IconButton aria-label="중량검사 상세" size="small" className="bg-mes-primary-20 text-mes-primary-60" icon={<IconShare size={16} />} /></div></LabeledControl>
          <LabeledControl label="특이사항"><div className="flex gap-2"><FixtureInput value="" muted className="flex-1" /><IconButton aria-label="특이사항 상세" size="small" className="bg-mes-primary-20 text-mes-primary-60" icon={<IconShare size={16} />} /></div></LabeledControl>
          <LabeledControl label="결과"><div className="flex gap-4"><RadioOption name="inspection-result" checked label="합격" /><RadioOption name="inspection-result" checked={false} label="일부" /><RadioOption name="inspection-result" checked={false} label="불합" /></div></LabeledControl>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2"><SectionBand>검사항목</SectionBand><Button size="small" variant="fillBlack" startIcon={<IconPlus size={15} />}>항목 추가</Button></div>
        <div className="mt-4 space-y-4">{["Pallet 상태 *", "표기사항 *", "포장상태 *", "상차밴딩 *"].map((label) => <div key={label} className="flex h-8 items-center justify-between text-[14px]"><span>{label}</span><InspectionJudgement value="pass" onValueChange={() => undefined} /></div>)}</div>
      </div>
    </div>
  );
}

function CenterPopup({ kind, open, onOpenChange }: { kind: Exclude<PopupKind, "production" | "inspection">; open: boolean; onOpenChange: (open: boolean) => void }) {
  const config: Record<typeof kind, { title: string; size: CenterModalSize; height: string; actions: DialogAction[]; content: React.ReactNode }> = {
    quantity: { title: "생산수량 입력", size: "compact-400", height: "h-[437px]", actions: [SAVE_ACTION], content: <QuantityContent /> },
    details: { title: "품목 상세정보", size: "compact-480", height: "h-[436px]", actions: [], content: <DetailsContent /> },
    defect: { title: "불량수량 입력", size: "medium-600", height: "h-[400px]", actions: [SAVE_ACTION], content: <DefectContent /> },
    weight: { title: "중량검사", size: "standard-960", height: "h-[752px]", actions: DEFAULT_ACTIONS, content: <WeightContent /> },
    purchase: { title: "발주 일괄등록", size: "large-1100", height: "h-[680px]", actions: DEFAULT_ACTIONS, content: <PurchaseContent /> },
    lookup: { title: "생산계획(일) 연동 일괄작업지시", size: "wide-1400", height: "h-[680px]", actions: DEFAULT_ACTIONS, content: <LookupWorkOrderContent /> },
  };
  const current = config[kind];
  return <CenterModal open={open} onOpenChange={onOpenChange} title={current.title} size={current.size} actions={current.actions} className={`${current.height} ${kind === "lookup" ? "max-h-none" : ""}`} contentClassName={kind === "lookup" ? "items-stretch overflow-hidden p-0" : kind === "weight" ? "p-0" : kind === "details" ? "pt-0" : undefined}>{current.content}</CenterModal>;
}

function PopupRenderer({ kind, open, onOpenChange }: { kind: PopupKind; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (kind === "production") return <SideSlidePanel open={open} onOpenChange={onOpenChange} title="생산실적 등록" size={"standard-900" as SideSlidePanelSize} actions={DEFAULT_ACTIONS} contentClassName="items-stretch p-0"><ProductionContent /></SideSlidePanel>;
  if (kind === "inspection") return <SideSlidePanel open={open} onOpenChange={onOpenChange} title="자주검사" size="narrow-760" actions={DEFAULT_ACTIONS} contentClassName="items-stretch p-0"><InspectionContent /></SideSlidePanel>;
  return <CenterPopup kind={kind} open={open} onOpenChange={onOpenChange} />;
}

function CompletedPopupExamples() {
  const [kind, setKind] = React.useState<PopupKind>("production");
  const [open, setOpen] = React.useState(false);
  const current = POPUPS.find((popup) => popup.id === kind)!;
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap gap-2">{POPUPS.map((popup) => <Button key={popup.id} size="small" variant={kind === popup.id ? "fillMain" : "lineBlacktxt"} onClick={() => { setKind(popup.id); setOpen(true); }}>{popup.label}</Button>)}</div>
      <Card className="flex min-h-[180px] flex-col items-center justify-center gap-3 bg-mes-gray-20 p-6 text-center"><Tag color="opacityMain" size="compact">Figma node {current.node}</Tag><p className="text-[14px] text-mes-gray-80">버튼을 누르면 실제 CenterModal 또는 SideSlidePanel 컴포넌트로 열립니다.</p><Button variant="fillBlack" onClick={() => setOpen(true)}>선택한 팝업 열기</Button></Card>
      <PopupRenderer kind={kind} open={open} onOpenChange={setOpen} />
    </div>
  );
}

export { CompletedPopupExamples };
