"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CenterModal, type CenterModalSize, type DialogAction } from "@/components/ui/center-modal";
import { DatePicker } from "@/components/ui/date-picker";
import { IconButton } from "@/components/ui/icon-button";
import { InspectionJudgement } from "@/components/ui/inspection-judgement";
import { SideSlidePanel, type SideSlidePanelSize } from "@/components/ui/side-slide-panel";
import { Tag } from "@/components/ui/tag";
import { TimePicker } from "@/components/ui/time-picker";
import {
  IconDownload,
  IconFilter,
  IconPlus,
  IconReload,
  IconTrash,
} from "@/components/icons";
import {
  FixtureDateRange,
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
  const values = [35, 35, 35, 35, 24, 11, 12, 23, 14, 15, 21, 22, 23, 24, 25, 32, 10, 32, 19, 10, 31, 32, 33, 34, 35, 24, 32, 10, 24, 32];
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
          <div className="grid grid-cols-10 gap-[3px]">{Array.from({ length: 100 }, (_, index) => <div key={index} className={`flex h-[39px] flex-col items-center justify-center rounded-mes-control-xs border text-center ${index < values.length ? "border-mes-primary-30 bg-mes-primary-30" : "border-mes-gray-30 bg-white"}`}><span className="text-[10px] text-mes-gray-80">{index < values.length ? index + 1 : ""}</span><b className="text-[13px]">{values[index] ?? ""}</b></div>)}</div>
        </Card>
        <div className="mt-4 grid grid-cols-2 gap-6"><FieldRow label="배열넘버" value="93.98" muted /><FieldRow label="하한값" value="93.98" muted /></div>
      </div>
    </div>
  );
}

const PURCHASE_ITEMS = ["비비빅", "찰옥수수", "수박바", "찰옥수수", "빠삐코", "더블 비얀코", "죠스", "메가톤", "와일드바디", "옥메와까", "돼지바", "빠삐코"];

function PurchaseContent({ lookup = false }: { lookup?: boolean }) {
  const headers = lookup ? ["계획일", "품목", "품목구분", "단위", "계획수량", "포장인원", "설비", "근무조", "지시일", "지시수량", "담당기사", "작업지시여부"] : ["품목", "품목구분", "규격", "단위", "입고예정일", "입고구분", "입고수량", "입고창고"];
  const rows = PURCHASE_ITEMS.slice(0, lookup ? 8 : 12).map((item, index) => lookup
    ? ["2024-08-30", item, "완제품", "EA", "2000", "2000", `A${index + 1}`, "주간", index === 0 ? "2025-10-30" : "", index === 0 ? "3000" : "", index === 0 ? "홍길동" : "", index === 7 ? <Badge key="done" variant="grayFill">지시완료</Badge> : ""]
    : [item, "완제품", "A", "kg", index < 2 ? <DatePicker key="date" value={new Date(2025, 9, 30)} className="h-[22px]" /> : "", index < 2 ? <FixtureSelect key="type" value="선택" size="small" /> : "", index < 2 ? <FixtureInput key="qty" value="0" size="small" /> : "", index < 2 ? <FixtureSelect key="warehouse" value="선택" size="small" /> : ""]);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between"><b className="text-[16px]">{lookup ? "생산계획 리스트" : "품목 리스트"}</b>{lookup && <div className="flex gap-2"><FixtureDateRange label="일자" /><Button size="small">조회</Button><Button size="small" variant="lineBlacktxt" startIcon={<IconDownload size={16} />}>다운로드</Button></div>}</div>
      <div className="mt-3 flex h-12 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3"><Button size="small" variant="lineBlacktxt" startIcon={<IconFilter size={16} />}>필터 추가</Button><FixtureSearch /></div>
      {!lookup && <div className="mt-3 flex h-12 items-center justify-between rounded-t-mes-control bg-mes-gray-20 px-3"><b className="flex items-center gap-1"><IconReload size={16} />전체 일괄 변경</b><div className="flex gap-2"><DatePicker value={new Date(2025, 9, 30)} className="w-[220px]" /><FixtureSelect value="입고구분 선택" className="w-[120px]" /><FixtureInput value="0" className="w-[120px]" /><Button size="small">적용</Button></div></div>}
      <div className="min-h-0 flex-1 overflow-hidden"><FixtureTable headers={headers} rows={rows} /></div>
    </div>
  );
}

function ProductionContent() {
  const rows = Array.from({ length: 10 }, (_, index) => ["13:00", "19:00", "kg", "100", "100", <Button key={`material-${index}`} size="xsmall" variant="opacityMain">투입정보</Button>, "10", "300", "302", "동진창고", <IconButton key={`delete-${index}`} aria-label="행 삭제" size="xsmall" icon={<IconTrash size={14} />} />]);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b border-mes-gray-30 p-5"><SectionBand>지시정보</SectionBand><div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">{[["설비", "내용", false], ["지시일", "년-월-일", false], ["근무조", "내용", false], ["품목", "선택", true], ["담당기사", "선택", true], ["누적생산", "내용", false], ["포장인원", "선택", true], ["작업상태", "진행중", true]].map((item) => <FieldRow key={String(item[0])} label={String(item[0])} value={String(item[1])} muted={item[1] === "내용"} select={Boolean(item[2])} />)}</div></div>
      <div className="border-b border-mes-gray-30 p-5"><SectionBand>실적정보</SectionBand><div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5"><div className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>작업시간</span><TimePicker value="12:00" /></div>{[["불량수량", "선택", true], ["생산수량", "내용 입력", false], ["저장창고", "선택", true], ["투입품목", "내용 입력", false]].map((item) => <FieldRow key={String(item[0])} label={String(item[0])} value={String(item[1])} select={Boolean(item[2])} />)}</div><div className="mt-3 flex justify-center"><Button size="small" className="w-[130px]" startIcon={<IconPlus size={15} />}>실적 추가</Button></div></div>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-3"><div className="mb-2 flex items-center justify-between"><b className="text-[15px]">생산실적 상세 리스트</b><FixtureSearch className="w-[180px]" /></div><FixtureTable selectable={false} headers={["시작시간", "종료시간", "단위", "생산수량", "불량수량", "투입정보", "포장수량", "총지시(No)", "총지시(EA)", "창고명", "삭제"]} rows={rows} /></div>
    </div>
  );
}

function InspectionContent() {
  return (
    <div className="grid h-full w-full grid-cols-[360px_1fr]">
      <div className="border-r border-mes-gray-30 p-5"><SectionBand>대상정보</SectionBand><div className="mt-3 space-y-4">{[["생산일", "2024-10-30"], ["작업자", "홍길동"], ["설비", "A1"], ["제품명", "더블비얀코"], ["ROUTE", "압출"]].map((item) => <FieldRow key={item[0]} label={item[0]} value={item[1]} muted />)}<div className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>검사일 *</span><DatePicker value={new Date(2025, 9, 30)} /></div><div className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>검사시간 *</span><TimePicker value="14:45" /></div><FieldRow label="검사자 *" value="김아무개" select /><FieldRow label="Box-No" value="150" /><FieldRow label="중량검사 *" value="0" /><FieldRow label="특이사항" value="" /><div className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>결과</span><div className="flex gap-4"><RadioOption name="inspection-result" checked label="합격" /><RadioOption name="inspection-result" checked={false} label="보류" /><RadioOption name="inspection-result" checked={false} label="불합" /></div></div></div></div>
      <div className="p-5"><div className="flex items-center justify-between"><SectionBand>검사항목</SectionBand><Button size="small" variant="fillBlack" startIcon={<IconPlus size={15} />}>항목 추가</Button></div><div className="mt-4 space-y-4">{["Pallet 상태 *", "표기사양 *", "포장상태 *", "상차밴딩 *"].map((label) => <div key={label} className="flex h-8 items-center justify-between text-[14px]"><span>{label}</span><InspectionJudgement value="pass" onValueChange={() => undefined} /></div>)}</div></div>
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
    lookup: { title: "생산계획(일) 연동 일괄작업지시", size: "wide-1400", height: "h-[680px]", actions: DEFAULT_ACTIONS, content: <PurchaseContent lookup /> },
  };
  const current = config[kind];
  return <CenterModal open={open} onOpenChange={onOpenChange} title={current.title} size={current.size} actions={current.actions} className={current.height} contentClassName={kind === "weight" ? "p-0" : undefined}>{current.content}</CenterModal>;
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
