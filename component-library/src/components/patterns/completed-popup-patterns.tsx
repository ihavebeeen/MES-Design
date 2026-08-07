"use client";

import * as React from "react";
import { CalendarDays, ChevronDown, Plus, Search, X } from "lucide-react";
import { FigmaScreenPreview } from "./figma-screen-preview";
import { CheckboxGlyph, ControlBox, DenseTable, SectionBand, SmallButton } from "./mes-screen-fixtures";
import { cn } from "@/lib/utils";

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

function ModalShell({ title, width, height, side = false, children, footer = true }: { title: string; width: number; height?: number; side?: boolean; children: React.ReactNode; footer?: boolean }) {
  return (
    <section
      className={cn("absolute flex flex-col overflow-hidden bg-white shadow-mes-modal-lg", side ? "right-0 top-0 h-[960px]" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl")}
      style={{ width, height: side ? 960 : height }}
    >
      <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-mes-gray-30 pl-5 pr-3.5">
        <h3 className="text-[18px] font-bold">{title}</h3><span className="flex size-8 items-center justify-center"><X size={20} /></span>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      {footer && <footer className="flex h-[72px] shrink-0 items-center justify-center gap-2.5 border-t border-mes-gray-30"><SmallButton tone="gray" className="h-10 w-40">취소</SmallButton><SmallButton tone="black" className="h-10 w-40">저장</SmallButton></footer>}
    </section>
  );
}

function RadioLine({ selected, label, muted = false }: { selected: boolean; label: string; muted?: boolean }) {
  return <div className={cn("flex h-8 items-center gap-1.5 text-[16px] font-semibold", muted && "text-mes-gray-80")}><span className={cn("size-6 rounded-full border", selected ? "border-[6px] border-mes-primary-60" : "border-mes-gray-50")} />{label}</div>;
}

function QuantityPopup() {
  return (
    <ModalShell title="생산수량 입력" width={400} height={437} footer={false}>
      <div className="flex h-full flex-col px-5 pt-5">
        <div className="flex flex-col gap-2"><RadioLine selected label="수기 입력" /><div className="pl-[30px]"><ControlBox>4</ControlBox></div></div>
        <div className="mt-5 flex flex-col gap-2"><RadioLine selected={false} label="자동 계산" muted /><div className="flex flex-col gap-1.5 pl-[30px]"><ControlBox muted>&nbsp;</ControlBox><span className="text-[14px] font-medium text-mes-gray-60">입상수 : 정보 없음</span><div className="rounded border border-mes-gray-30 bg-mes-gray-10 px-5 text-[14px] text-mes-gray-60">{["흑", "적"].map((label) => <div key={label} className="flex h-[45px] items-center gap-2.5 border-b border-mes-gray-30"><span className="w-5 font-medium">{label}</span><ControlBox muted className="flex-1 gap-3"><b className="text-mes-gray-60">시작</b>2</ControlBox><ControlBox muted className="flex-1 gap-3"><b className="text-mes-gray-60">종료</b>0</ControlBox></div>)}</div></div></div>
        <div className="mt-auto flex h-[72px] items-center justify-center"><SmallButton tone="black" className="h-10 w-40">저장</SmallButton></div>
      </div>
    </ModalShell>
  );
}

const detailPairs = [["박스규격","100","비닐 사이즈","40m"],["필름","34","테이프 색상","레드"],["간지","유","간지","34"],["간지","유","간지","34"],["박스규격","100","비닐 사이즈","40m"],["필름","34","테이프 색상","레드"],["간지","유","간지","34"],["박스규격","100","비닐 사이즈","40m"],["필름","34","테이프 색상","레드"],["간지","유","간지","34"]];

function DetailsPopup() {
  return (
    <ModalShell title="품목 상세정보" width={480} height={436} footer={false}>
      <div className="px-5 pb-5"><ControlBox muted className="mb-3 justify-between font-medium">포장정보 <ChevronDown size={14} /></ControlBox><div className="overflow-hidden rounded border border-mes-gray-30 text-[14px]">{detailPairs.map((pair, index) => <div key={index} className="grid h-8 grid-cols-2 border-b border-mes-gray-30 last:border-0"><div className="grid grid-cols-[100px_1fr] items-center border-r border-mes-gray-30 px-3"><span className="text-mes-gray-80">{pair[0]}</span><span>{pair[1]}</span></div><div className="grid grid-cols-[100px_1fr] items-center px-3"><span className="text-mes-gray-80">{pair[2]}</span><span>{pair[3]}</span></div></div>)}</div></div>
    </ModalShell>
  );
}

function DefectPopup() {
  const rows = [["1","색상","임가공창고A","2"],["2","모양","임가공창고A","2"],["3","인쇄","선택",""],["4","선택","선택",""],["5","선택","선택",""]];
  return (
    <ModalShell title="불량수량 입력" width={600} height={400} footer={false}>
      <div className="flex h-full flex-col px-5 pt-5"><DenseTable headers={["No.","불량유형","저장창고","불량수량"]} widths={[60,166,166,166]} rows={rows.map((row) => [row[0],<ControlBox key={`${row[0]}a`} className="h-[22px] justify-between px-1.5 text-[13px]">{row[1]}<ChevronDown size={12}/></ControlBox>,<ControlBox key={`${row[0]}b`} className="h-[22px] justify-between px-1.5 text-[13px]">{row[2]}<ChevronDown size={12}/></ControlBox>,<ControlBox key={`${row[0]}c`} className="h-[22px] px-1.5 text-[13px]">{row[3]}</ControlBox>])} /><div className="mt-5 flex h-14 items-center justify-center gap-3 rounded bg-mes-primary-20 text-[16px] font-semibold text-mes-primary-60"><span>불량계</span><ControlBox className="w-[120px] text-mes-gray-130">4</ControlBox></div><div className="mt-auto flex h-[72px] items-center justify-center"><SmallButton tone="black" className="h-10 w-40">저장</SmallButton></div></div>
    </ModalShell>
  );
}

function WeightPopup() {
  const values = [35,35,35,35,24,11,12,23,14,15,21,22,23,24,25,32,10,32,19,10,31,32,33,34,35,24,32,10,24,32];
  return (
    <ModalShell title="중량검사" width={960} height={752}>
      <div className="grid h-full grid-cols-[300px_1fr]">
        <div className="border-r border-mes-gray-30 p-5"><SectionBand>기본정보</SectionBand><div className="mt-3 space-y-4">{[["Cavity","100"],["배열","6 X 6"],["넷중량","100"]].map((item)=><div key={item[0]} className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>{item[0]}</span><ControlBox muted>{item[1]}</ControlBox></div>)}</div><div className="mt-10"><SectionBand>검사결과</SectionBand></div><div className="mt-3 space-y-4">{[["상한값","93.98"],["평균중량","93.98"],["하한값","93.98"]].map((item)=><div key={item[0]} className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>{item[0]}</span><ControlBox muted>{item[1]}</ControlBox></div>)}</div></div>
        <div className="p-5"><SectionBand>중량검사</SectionBand><div className="mt-3 rounded-lg border border-mes-gray-30 px-5 pb-5 pt-3"><div className="mb-3 flex h-8 items-center gap-5 text-[14px]"><span>배열 설정</span><RadioLine selected label="자동배열" /><RadioLine selected={false} label="사용자 설정" muted /></div><div className="grid grid-cols-10 gap-[3px]">{Array.from({length:100},(_,index)=><div key={index} className={cn("flex h-[39px] flex-col items-center justify-center rounded-[2px] border text-center",index<values.length?"border-mes-primary-30 bg-mes-primary-30":"border-mes-gray-30 bg-white")}><span className="text-[10px] text-mes-gray-80">{index<values.length?index+1:""}</span><b className="text-[13px]">{values[index]??""}</b></div>)}</div></div><div className="mt-4 grid grid-cols-2 gap-6 text-[14px]"><div className="grid grid-cols-[100px_1fr] items-center gap-2"><span>배열넘버</span><ControlBox muted>93.98</ControlBox></div><div className="grid grid-cols-[100px_1fr] items-center gap-2"><span>하한값</span><ControlBox muted>93.98</ControlBox></div></div></div>
      </div>
    </ModalShell>
  );
}

const purchaseItems = ["비비빅","찰옥수수","수박바","찰옥수수","빠삐코","더블 비얀코","죠스","메가톤","와일드바디","옥메와까","돼지바","빠삐코"];

function PurchasePopup({ lookup = false }: { lookup?: boolean }) {
  const headers = lookup ? ["","계획일","품목","품목구분","단위","계획수량","포장인원","설비","근무조","지시일","지시수량","담당기사","작업지시여부"] : ["","품목","품목구분","규격","단위","입고예정일","입고구분","입고수량","입고창고"];
  const rows = purchaseItems.slice(0, lookup ? 8 : 12).map((item,index) => lookup ? [<CheckboxGlyph key={index} selected={index===0}/>,"2024-08-30",item,"완제품","EA","2000","2000",`A${index+1}`,index===0?"주간":"주간",index===0?"2025-10-30":"",index===0?"3000":"",index===0?"홍길동":"",index===7?<span key="tag" className="bg-mes-gray-80 px-2 py-1 text-[11px] text-white">지시완료</span>:""] : [<CheckboxGlyph key={index} selected={index<2}/>,item,"완제품","A","kg",index<2?<ControlBox key="date" className="h-[22px] text-[12px]">2025-10-30</ControlBox>:"",index<2?<ControlBox key="type" className="h-[22px] text-[12px]">선택⌄</ControlBox>:"",index<2?"0":"",index<2?<ControlBox key="wh" className="h-[22px] text-[12px]">선택⌄</ControlBox>:""]);
  return (
    <ModalShell title={lookup ? "생산계획(일) 연동 일괄작업지시" : "발주 일괄등록"} width={lookup ? 1400 : 1100} height={680}>
      <div className="flex h-full flex-col px-5 pt-4"><div className="flex items-center justify-between"><b className="text-[16px]">{lookup?"생산계획 리스트":"품목 리스트"}</b>{lookup&&<div className="flex gap-2"><ControlBox>일자&nbsp; 2025.03.30 ~ 2025.03.30</ControlBox><SmallButton tone="main">조회</SmallButton><SmallButton>다운로드</SmallButton></div>}</div><div className="mt-3 flex h-12 items-center justify-between rounded bg-mes-gray-20 px-3"><SmallButton>☷ 필터 추가</SmallButton><div className="flex h-8 w-[200px] items-center gap-2 rounded border border-mes-gray-30 bg-white px-3 text-[13px] text-mes-gray-60"><Search size={15}/>검색어 입력..</div></div>{!lookup&&<div className="mt-3 flex h-12 items-center justify-between rounded-t bg-mes-gray-20 px-3"><b>⟳&nbsp; 전체 일괄 변경</b><div className="flex gap-2"><ControlBox className="w-[220px]">입고 예정일&nbsp; 2025-10-30 <CalendarDays size={14}/></ControlBox><ControlBox className="w-[120px]">입고구분&nbsp; 선택</ControlBox><ControlBox className="w-[120px]">입고수량&nbsp; 0</ControlBox><SmallButton tone="main">적용</SmallButton></div></div>}<div className="min-h-0 flex-1 overflow-hidden rounded-b border-x border-b border-mes-gray-30"><DenseTable headers={headers} rows={rows} /></div></div>
    </ModalShell>
  );
}

function ProductionSidePopup() {
  const rows=Array.from({length:10},(_,index)=>["13:00","19:00","kg","100","100",<span key={index} className="rounded bg-mes-primary-20 px-2 py-1 text-[11px] text-mes-primary-60">투입정보 〉</span>,"10","300","302","동진창고","⌫"]);
  return <ModalShell title="생산실적 등록" width={900} side><div className="flex h-full flex-col"><div className="border-b border-mes-gray-30 p-5"><SectionBand>지시정보</SectionBand><div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">{[["설비","내용"],["지시일","년-월-일"],["근무조","내용"],["품목","선택"],["담당기사","선택"],["누적생산","내용"],["포장인원","선택"],["작업상태","진행중"]].map((item)=><div key={item[0]} className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>{item[0]}</span><ControlBox muted={item[1]==="내용"}>{item[1]}</ControlBox></div>)}</div></div><div className="border-b border-mes-gray-30 p-5"><SectionBand>실적정보</SectionBand><div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">{[["작업시간","12:00 ~ 14:00"],["불량수량","선택"],["생산수량","내용 입력"],["저장창고","선택"],["투입품목","내용 입력"]].map((item)=><div key={item[0]} className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>{item[0]}</span><ControlBox>{item[1]}</ControlBox></div>)}</div><div className="mt-3 flex justify-center"><SmallButton tone="main" className="w-[130px]"><Plus size={15}/>실적 추가</SmallButton></div></div><div className="flex min-h-0 flex-1 flex-col px-5 pt-3"><div className="mb-2 flex items-center justify-between"><b className="text-[15px]">생산실적 상세 리스트</b><div className="flex h-8 w-[180px] items-center gap-2 rounded border border-mes-gray-30 px-3 text-[13px] text-mes-gray-60"><Search size={15}/>검색어 입력..</div></div><DenseTable headers={["시작시간","종료시간","단위","생산수량","불량수량","투입정보","포장수량","총지시(No)","총지시(EA)","창고명","삭제"]} rows={rows}/></div></div></ModalShell>;
}

function JudgementButtons(){return <div className="flex w-[240px] gap-2">{["○","△","×","-"].map((value,index)=><span key={value} className={cn("flex h-8 flex-1 items-center justify-center rounded border border-mes-gray-30 text-[18px]",index===0&&"border-mes-primary-60 bg-mes-primary-60 text-white")}>{value}</span>)}</div>}

function InspectionSidePopup(){return <ModalShell title="자주검사" width={760} side><div className="grid h-full grid-cols-[360px_1fr]"><div className="border-r border-mes-gray-30 p-5"><SectionBand>대상정보</SectionBand><div className="mt-3 space-y-4">{[["생산일","2024-10-30"],["작업자","홍길동"],["설비","A1"],["제품명","더블비얀코"],["ROUTE","압출"],["검사일 *","2025-10-30"],["검사시간 *","14:45"],["검사자 *","김아무개"],["Box-No","150"],["중량검사 *","0"],["특이사항",""]].map(item=><div key={item[0]} className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>{item[0]}</span><ControlBox muted={!item[0].includes("*")}>{item[1]}</ControlBox></div>)}<div className="grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]"><span>결과</span><div className="flex gap-4"><span>◉ 합격</span><span className="text-mes-gray-60">○ 보류</span><span className="text-mes-gray-60">○ 불합</span></div></div></div></div><div className="p-5"><div className="flex items-center justify-between"><SectionBand>검사항목</SectionBand><SmallButton tone="black"><Plus size={15}/>항목 추가</SmallButton></div><div className="mt-4 space-y-4">{["Pallet 상태 *","표기사양 *","포장상태 *","상차밴딩 *"].map(label=><div key={label} className="flex h-8 items-center justify-between text-[14px]"><span>{label}</span><JudgementButtons/></div>)}</div></div></div></ModalShell>}

function PopupRenderer({ kind }: { kind: PopupKind }) {
  if (kind === "quantity") return <QuantityPopup />;
  if (kind === "details") return <DetailsPopup />;
  if (kind === "defect") return <DefectPopup />;
  if (kind === "weight") return <WeightPopup />;
  if (kind === "purchase") return <PurchasePopup />;
  if (kind === "lookup") return <PurchasePopup lookup />;
  if (kind === "production") return <ProductionSidePopup />;
  return <InspectionSidePopup />;
}

function CompletedPopupExamples() {
  const [kind, setKind] = React.useState<PopupKind>("production");
  const current = POPUPS.find((popup) => popup.id === kind)!;
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap gap-2">{POPUPS.map((popup)=><SmallButton key={popup.id} tone={kind===popup.id?"main":"line"} onClick={()=>setKind(popup.id)}>{popup.label}</SmallButton>)}</div>
      <div className="flex items-center justify-between text-[12px] text-mes-gray-70"><span>Figma 원본 1920×960 좌표계 · 내부 레이아웃 비변형 축소</span><code>node {current.node}</code></div>
      <FigmaScreenPreview><div className="relative h-[960px] w-[1920px] bg-white"><div className="absolute inset-0 bg-black/60"/><PopupRenderer kind={kind}/></div></FigmaScreenPreview>
    </div>
  );
}

export { CompletedPopupExamples };
