"use client";

import * as React from "react";
import { CalendarDays, ChevronRight, CircleHelp, PenLine, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FigmaScreenPreview } from "@/components/patterns/figma-screen-preview";
import { cn } from "@/lib/utils";
import {
  MobileCompactField,
  MobileFormSection,
  MobileInput,
  MobileInspectionQuestionList,
  MobileRadioGroup,
  MobileStep,
  MobileToggle,
  type QaValue,
} from "./mobile-ui";
import { MobileSourceHeader, MobileSourceTabBar, MobileStatusBar } from "./mobile-source-screens";

const SOURCE_WIDTH = 375;
const SOURCE_HEIGHT = 812;

export type MobileRemainingMainScreenId =
  | "receiving-result"
  | "maintenance-form"
  | "weight-inspection"
  | "special-notes"
  | "user-settings"
  | "login-placeholder"
  | "report-basic-info"
  | "hourly-notes"
  | "incoming-inspection-list"
  | "shipping-inspection-list"
  | "incoming-inspection-basic"
  | "incoming-inspection-appearance"
  | "equipment-inspection-list";

export const MOBILE_REMAINING_MAIN_ITEMS: Array<{ id: MobileRemainingMainScreenId; label: string; node: string; description: string }> = [
  { id: "receiving-result", label: "입고실적 등록", node: "10378:91516", description: "품목별 수량 입력 · 완료 처리" },
  { id: "maintenance-form", label: "정비 등록", node: "10378:93359", description: "기본정보 · 정비시간 · 원인/내용" },
  { id: "weight-inspection", label: "성적서 중량검사", node: "10378:92711", description: "Cavity 배열 · 결과값" },
  { id: "special-notes", label: "성적서 특이사항", node: "10378:92896", description: "특이사항 입력 · 합격/불합격" },
  { id: "user-settings", label: "사용자 설정", node: "10378:92192", description: "알람별 토글 설정" },
  { id: "login-placeholder", label: "로그인 미정 원본", node: "10378:92237", description: "원본 source-error 보존" },
  { id: "report-basic-info", label: "성적서 기본정보", node: "10378:92470", description: "검사 기본정보 · 4단계 흐름" },
  { id: "hourly-notes", label: "시간대별 특이사항", node: "10378:93313", description: "07:00~18:00 시간 입력" },
  { id: "incoming-inspection-list", label: "입고검사 목록", node: "10378:92956", description: "날짜 · 공급사별 진행상태" },
  { id: "shipping-inspection-list", label: "출하검사 세부사항", node: "10378:93003", description: "품목별 작성/수정 · 판정" },
  { id: "incoming-inspection-basic", label: "입고검사 기본정보", node: "10378:93078", description: "2단계 검사 기본정보" },
  { id: "incoming-inspection-appearance", label: "입고검사 외관검사", node: "10378:93119", description: "2단계 외관 판정" },
  { id: "equipment-inspection-list", label: "설비점검 목록", node: "10378:93248", description: "설비별 담당자 · 작성/수정" },
];

function BluePageHeader({ title }: { title: string }) {
  return (
    <div className="absolute inset-x-0 top-0 z-20 bg-[linear-gradient(180deg,#1573fb_0%,#4b8fff_102.25%)]">
      <MobileStatusBar />
      <MobileSourceHeader title={title} />
    </div>
  );
}

function WhitePageHeader({ title }: { title?: string }) {
  return <div className="absolute inset-x-0 top-0 z-20 bg-white"><MobileStatusBar tone="white" /><MobileSourceHeader title={title} tone="white" /></div>;
}

export function MobileDateStrip({ label, value, action }: { label: string; value: string; action?: string }) {
  return (
    <div className="flex h-[37px] w-full items-center gap-1.5 rounded-[6px] border border-[#e4e7ee] bg-white px-3 text-[14px] tracking-[-0.175px] text-[#011327]">
      <CalendarDays className="size-4 shrink-0" strokeWidth={1.33} /><strong className="font-semibold">{label}</strong><strong className="min-w-0 flex-1 font-semibold">{value}</strong>
      {action && <span className="font-bold text-[#1573fb]">{action} ›</span>}
    </div>
  );
}

export function MobileFixedActions({ primary = "저장", secondary, onPrimary, onSecondary }: { primary?: string; secondary?: string; onPrimary?: () => void; onSecondary?: () => void }) {
  return (
    <div className="flex h-[82px] w-full gap-[10px] bg-white p-4">
      {secondary && <Button variant="fillGray" size="basic" onClick={onSecondary} className="h-[50px] min-w-0 flex-1 rounded-[6px] text-[16px] font-bold">{secondary}</Button>}
      <Button variant="fillMain" size="basic" onClick={onPrimary} className="h-[50px] min-w-0 flex-1 rounded-[6px] text-[16px] font-bold">{primary}</Button>
    </div>
  );
}

const DateStrip = MobileDateStrip;
const FixedActions = MobileFixedActions;

const receivingNames = ["풀무원 순두부 용기", "두부용기A", "Bop 2F", "Bop 1F", "Bop 1F", "Bop 1F", "Bop 1F", "Bop 1F", "Bop 1F", "Bop 1F", "Bop 1F"];

export function MobileReceivingResultSourceScreen() {
  const [values, setValues] = React.useState<Record<number, string>>({});
  const [complete, setComplete] = React.useState(true);
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:91516" data-mobile-remaining-screen="receiving-result">
      <BluePageHeader title="공급사A" />
      <div className="absolute left-4 top-[99px] z-30 w-[343px]"><MobileDateStrip label="예정일" value="2025-07-30" action="입력 4건" /></div>
      <main className="absolute inset-x-0 bottom-[166px] top-[146px] overflow-hidden">
        <div className="grid h-[38px] grid-cols-[96px_76px_68px_80px_55px] items-center border-b border-[#e4e7ee] px-2 text-center text-[13px] font-semibold text-[#8491a7]"><span>품목명</span><span>발주수량</span><span>누적입고</span><span>입력값</span><span>단위</span></div>
        {receivingNames.map((name, index) => (
          <div key={`${name}-${index}`} className="grid h-[44px] grid-cols-[96px_76px_68px_80px_55px] items-center border-b border-[#e4e7ee] px-2 text-center text-[14px] text-[#011327]">
            <span className="line-clamp-2 leading-[19px]">{name}</span><span>999,999</span><span>{index ? "999,999" : "1,000"}</span>
            <Input aria-label={`${name} 입력값`} value={values[index] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [index]: event.target.value }))} className="h-[34px] rounded-[4px] px-2 text-right text-[14px]" /><span>Kg</span>
          </div>
        ))}
      </main>
      <div className="absolute inset-x-0 bottom-[84px] z-30 flex h-[82px] items-start border-t border-[#e4e7ee] bg-white px-4 pt-[16px]">
        <label className="flex h-[50px] items-center gap-1.5 whitespace-nowrap text-[15px] font-semibold"><Checkbox checked={complete} onChange={(event) => setComplete(event.target.checked)} color="black" shape="circle" />완료 처리<CircleHelp className="size-4 text-[#8491a7]" /></label>
        <div className="ml-auto flex w-[226px] gap-[10px]"><Button variant="fillGray" size="basic" className="h-[50px] min-w-0 flex-1 rounded-[6px]">취소</Button><Button variant="fillMain" size="basic" className="h-[50px] min-w-0 flex-1 rounded-[6px]">저장</Button></div>
      </div><div className="absolute inset-x-0 bottom-0 z-30"><MobileSourceTabBar /></div>
    </div>
  );
}

function CompactSelect({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return <div className="grid h-8 grid-cols-[74px_1fr] items-center"><span className="text-[15px] text-[#5c667b]">{label}</span><Button variant="lineBlacktxt" size="xsmall" onClick={onClick} className="h-8 w-full min-w-0 justify-between rounded-[4px] px-[10px] text-[15px] font-normal">{value}<span>⌄</span></Button></div>;
}

export function MobileMaintenanceFormSourceScreen() {
  const [unit, setUnit] = React.useState("선택");
  const [kind, setKind] = React.useState("선택");
  const [memo, setMemo] = React.useState<string>();
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:93359" data-mobile-remaining-screen="maintenance-form">
      <BluePageHeader title="압출기 1호" />
      <div className="absolute left-4 top-[99px] z-30 w-[343px]"><MobileDateStrip label="정비일" value="2025-07-30" action="입력 2건" /></div>
      <main className="absolute left-4 top-[146px] flex w-[343px] flex-col gap-[10px]">
        <MobileFormSection title="기본 정보" className="h-[168px]"><MobileCompactField label="담당자" value="김아무개" onChange={() => undefined} /><CompactSelect label="UNIT" value={unit} onClick={() => setUnit(unit === "선택" ? "UNIT A" : "선택")} /><CompactSelect label="정비형태" value={kind} onClick={() => setKind(kind === "선택" ? "예방정비" : "선택")} /></MobileFormSection>
        <MobileFormSection title="정비 시간" className="h-[126px]"><div className="grid grid-cols-2 gap-[10px]"><MobileCompactField label="시작시간" value="" onChange={() => undefined} /><MobileCompactField label="종료시간" value="" onChange={() => undefined} /></div><div className="grid h-8 grid-cols-[74px_1fr_34px] items-center"><span className="text-[15px] text-[#5c667b]">총 정비시간</span><span className="flex h-8 items-center rounded-[4px] bg-[#e4e7ee] px-[10px] text-[#8491a7]">60</span><span className="text-right text-[12px] text-[#67738e]">Min</span></div></MobileFormSection>
        {["원인분석", "정비내용"].map((title) => <Button key={title} variant="lineBlacktxt" size="small" onClick={() => setMemo(title)} className="h-[48px] w-full justify-between rounded-[8px] border border-[#e4e7ee] px-3 text-[15px] font-bold"><span>{title}</span><span className="flex items-center gap-1 text-[#1573fb]"><PenLine className="size-4" />메모</span></Button>)}
        {memo && <div role="status" className="rounded-[6px] bg-[#eff2f8] p-3 text-[13px]">{memo} 메모 입력 상태</div>}
      </main>
      <div className="absolute inset-x-0 bottom-[84px] z-30"><MobileFixedActions secondary="취소" /></div><div className="absolute inset-x-0 bottom-0 z-30"><MobileSourceTabBar /></div>
    </div>
  );
}

export function MobileWeightInspectionSourceScreen() {
  const [selected, setSelected] = React.useState(21);
  const [mode, setMode] = React.useState("auto");
  const cells = Array.from({ length: 100 }, (_, index) => index);
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:92711" data-mobile-remaining-screen="weight-inspection">
      <WhitePageHeader />
      <h2 className="absolute left-4 top-[103px] w-[343px] truncate text-center text-[18px] font-bold">캐나다 투칸두부배캣(신형/칼선)</h2>
      <div className="absolute left-[52px] top-[136px] h-[34px] w-[272px]"><MobileStep labels={["기본정보", "외관검사", "중량검사", "특이사항"]} activeIndex={2} /></div>
      <div className="absolute left-4 top-[190px] grid h-[39px] w-[343px] grid-cols-3 rounded-[6px] bg-[#eff2f8] text-[14px]"><span className="flex items-center justify-center gap-2"><em className="not-italic text-[#1573fb]">하한값</em><strong>93.4</strong></span><span className="flex items-center justify-center gap-2 border-x border-[#d7dce5]"><em className="not-italic text-[#1573fb]">평균값</em><strong>99.3</strong></span><span className="flex items-center justify-center gap-2"><em className="not-italic text-[#1573fb]">상한값</em><strong>102.3</strong></span></div>
      <div className="absolute left-4 top-[244px] flex h-8 w-[343px] items-center"><strong className="text-[15px]">TEST</strong><div className="ml-auto"><MobileRadioGroup label="배열 방식" value={mode} onChange={setMode} options={[{ value: "auto", label: "자동배열" }, { value: "manual", label: "사용자 설정" }]} /></div></div>
      <section className="absolute left-4 top-[280px] h-[359px] w-[343px] rounded-[8px] border border-[#e4e7ee] p-[11px]">
        <div className="mb-2 flex h-6 items-center text-[13px]"><span className="w-[102px] text-center text-[#67738e]">Cavity 배열</span><strong>5 X 5</strong><span className="ml-auto text-[#67738e]">진입방향</span><span className="ml-2 text-[22px]">→</span></div>
        <div className="grid grid-cols-10 gap-[3px]">{cells.map((cell) => <Button key={cell} variant="lineBlacktxt" size="xsmall" aria-label={`배열 ${cell + 1}`} aria-pressed={selected === cell} onClick={() => setSelected(cell)} className={cn("h-[23px] min-w-0 rounded-[2px] border border-[#d7dce5] p-0 text-[12px]", selected === cell ? "bg-[#1573fb] text-white" : cell < 24 && cell % 10 < 5 ? "bg-[#d7dce5]" : "bg-white")}>{cell === 0 ? "1" : selected === cell ? "12" : ""}</Button>)}</div>
        <div className="mt-[10px] grid grid-cols-2 gap-[10px]"><MobileCompactField label="배열넘버" value="12" onChange={() => undefined} /><MobileCompactField label="결과값" value="0" onChange={() => undefined} /></div>
      </section>
      <div className="absolute inset-x-0 bottom-[84px] z-30"><MobileFixedActions primary="다음" secondary="←  이전 페이지" /></div><div className="absolute inset-x-0 bottom-0 z-30"><MobileSourceTabBar /></div>
    </div>
  );
}

const noteLabels = ["PO NO/존슨 날짜 코드", "이무라야 모찌 전용 비닐", "밥라인 실리콘 상태확인", "이지필 원단 롯드 확인", "박스 이음매, 면방, 지분, 골눌림 상태", "기타"];

export function MobileSpecialNotesSourceScreen() {
  const [notes, setNotes] = React.useState<Record<number, string>>({});
  const [result, setResult] = React.useState("pass");
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:92896" data-mobile-remaining-screen="special-notes">
      <WhitePageHeader /><h2 className="absolute left-4 top-[104px] w-[343px] truncate text-center text-[18px] font-bold">캐나다 투칸두부배캣(신형/칼선)</h2><div className="absolute left-[52px] top-[140px] h-[34px] w-[272px]"><MobileStep labels={["기본정보", "외관검사", "중량검사", "특이사항"]} activeIndex={3} /></div>
      <main className="absolute left-4 top-[205px] flex w-[343px] flex-col gap-3">{noteLabels.map((label,index)=><label key={label} className="flex flex-col gap-1.5"><strong className="text-[15px]">{label}</strong><MobileInput mobileSize="compact" placeholder="특이사항 입력" value={notes[index] ?? ""} onChange={(event)=>setNotes((current)=>({...current,[index]:event.target.value}))} /></label>)}<div className="rounded-[6px] bg-[#e8f5ff] p-2"><MobileRadioGroup label="검사 결과" value={result} onChange={setResult} options={[{value:"pass",label:"합격"},{value:"fail",label:"불합격"}]} /></div></main>
      <div className="absolute inset-x-0 bottom-[84px] z-30"><MobileFixedActions secondary="←  이전 페이지" /></div><div className="absolute inset-x-0 bottom-0 z-30"><MobileSourceTabBar /></div>
    </div>
  );
}

export function MobileUserSettingsSourceScreen() {
  const labels = ["입고완료", "입고검사요청", "입고검사완료", "생산지시생성", "생산지시변경"];
  const [settings, setSettings] = React.useState([true,true,true,false,false]);
  return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:92192" data-mobile-remaining-screen="user-settings"><MobileStatusBar tone="white" /><header className="flex h-[52px] items-center justify-between px-4"><h2 className="text-[20px] font-bold">사용자 설정</h2><Button variant="lineBlacktxt" size="small" aria-label="닫기" className="size-9 border-0 p-0"><X className="size-5" /></Button></header><main className="border-b-[6px] border-[#eff2f8] px-4 pb-4"><h3 className="mb-2 text-[13px] font-semibold text-[#8491a7]">알람 설정</h3>{labels.map((label,index)=><div key={label} className="flex h-14 items-center justify-between px-3 text-[16px] font-medium"><span>{label}</span><MobileToggle checked={settings[index]} onCheckedChange={(next)=>setSettings((current)=>current.map((value,i)=>i===index?next:value))} /></div>)}</main></div>;
}

export function MobileLoginPlaceholderSourceScreen() {
  return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:92237" data-mobile-remaining-screen="login-placeholder"><MobileStatusBar tone="white" /><strong className="absolute left-0 top-[103px] text-[40px] font-medium leading-none text-black">미정</strong><div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div></div>;
}

const reportRows = [["검사일시","2025-10-30",true],["검사자","김수현",true],["업체명","하이팩시스템",false],["품목명","캐나다투칸두부배캣(신형/칼선)",false],["생산수량","120,000",false],["포장방법","63*4*3",false],["포장수량","756",false],["실리콘사용","0.67*725",false],["재질/색상","PP-백",false],["BOX 규격","규격",false]] as const;

function QualityBasicScreen({ incoming = false }: { incoming?: boolean }) {
  const rows = incoming ? [["검사일시","2025-10-30",true],["검사자","김수현",true],["업체명","하이팩시스템",false],["품목명","풀무원 순두부 용기",false],["입고수량","120,000",false],["제조년월일","11-1201",true]] as const : reportRows;
  return <><WhitePageHeader /><h2 className="absolute left-4 top-[104px] w-[343px] truncate text-center text-[18px] font-bold">{incoming?"풀무원 순두부 용기":"캐나다 투칸두부배캣(신형/칼선)"}</h2><div className={cn("absolute top-[140px] h-[34px]",incoming?"left-[120px] w-[136px]":"left-[52px] w-[272px]")}><MobileStep labels={incoming?["기본정보","외관검사"]:["기본정보","외관검사","중량검사","특이사항"]} activeIndex={0} /></div><MobileFormSection title="기본 정보" className={cn("absolute left-4 top-[200px] w-[343px]",incoming?"h-[301px]":"h-[460px]")}>{rows.map(([label,value,select])=><div key={label} className="grid min-h-8 grid-cols-[74px_1fr] items-center text-[15px]"><span className="text-[#67738e]">{label}</span>{select?<Button variant="lineBlacktxt" size="xsmall" className="h-8 w-full justify-between rounded-[4px] px-[14px] text-[15px] font-normal">{value}<span>⌄</span></Button>:<strong className="font-medium">{value}</strong>}</div>)}</MobileFormSection><div className="absolute inset-x-0 bottom-[84px]"><FixedActions primary="다음" /></div><div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div></>;
}

export function MobileReportBasicInfoSourceScreen() { return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:92470" data-mobile-remaining-screen="report-basic-info"><QualityBasicScreen /></div>; }
export function MobileIncomingInspectionBasicSourceScreen() { return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:93078" data-mobile-remaining-screen="incoming-inspection-basic"><QualityBasicScreen incoming /></div>; }

export function MobileHourlyNotesSourceScreen() {
  const hours = Array.from({length:12},(_,i)=>`${String(i+7).padStart(2,"0")}:00`); const [values,setValues]=React.useState<Record<string,string>>({"07:00":"시트지 투입"});
  return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:93313" data-mobile-remaining-screen="hourly-notes"><WhitePageHeader title="특이사항" /><main className="absolute left-4 top-[107px] flex w-[343px] flex-col gap-[10px]">{hours.map(hour=><label key={hour} className="grid h-[32px] grid-cols-[64px_1fr] items-center"><span className="text-[15px] font-semibold text-[#96a4bd]">{hour}</span><MobileInput mobileSize="compact" value={values[hour]??""} onChange={event=>setValues(current=>({...current,[hour]:event.target.value}))} /></label>)}</main><div className="absolute inset-x-0 bottom-[84px]"><FixedActions /></div><div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div></div>;
}

const inspectionCards = [{count:"0 / 6",name:"유호스트",tone:"blue"},{count:"8 / 8",name:"공급사 A",tone:"gray"},{count:"8 / 8",name:"공급사 A",tone:"gray"},{count:"4 / 5",name:"공급사 A",tone:"red"}] as const;

export function MobileIncomingInspectionListSourceScreen() {
  const [active,setActive]=React.useState(0);
  void active;
  return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:92956" data-mobile-remaining-screen="incoming-inspection-list"><BluePageHeader title="입고검사" /><div className="absolute inset-x-0 top-[99px] flex h-[68px] items-start justify-between bg-[#277efb] px-4 pt-2"><Button variant="lineBlacktxt" size="small" className="size-9 bg-white p-0 text-[28px]">‹</Button><div className="flex h-9 items-center gap-2"><span className="rounded-full bg-white px-2 py-1 text-[12px] font-semibold text-[#1573fb]">오늘</span><strong className="text-[20px] text-white">2025.07.30</strong></div><Button variant="lineBlacktxt" size="small" className="size-9 bg-white p-0 text-[28px]">›</Button></div><main className="absolute inset-x-0 bottom-[84px] top-[167px] rounded-t-[24px] bg-white px-4 pt-6 shadow-[0_-8px_24px_rgba(1,19,39,0.12)]"><div className="flex flex-col gap-[10px]">{inspectionCards.map((item,index)=><Button key={index} variant="lineBlacktxt" size="basic" onClick={()=>setActive(index)} className={cn("h-[79px] w-full justify-start rounded-[12px] border-0 px-5 text-left",item.tone==="red"?"bg-[#fff0f1]":item.tone==="gray"?"bg-[#eff2f8]":"bg-[#e8f5ff]")}><span className="flex flex-1 flex-col items-start gap-2"><span className={cn("rounded-full px-[10px] py-1 text-[13px] font-semibold text-white",item.tone==="red"?"bg-[#f04452]":item.tone==="gray"?"bg-[#99a3b8]":"bg-[#1573fb]")}>{item.count}</span><strong className="text-[16px]">{item.name}</strong></span><ChevronRight className="size-5" /></Button>)}</div></main><div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div></div>;
}

const shippingItems = ["Bop 1F","캐나다캐나다투칸투칸(신형/칼선)","시아스밥용기","CK두부 380","풀무원 순두부 용기"];
function SimpleInspectionTable({ equipment = false }: { equipment?: boolean }) {
  const rows=equipment?["냉각기 1호","냉각기 2호","냉각기 3호","냉각기 4호","냉각기 5호","냉각기 6호"]:shippingItems;
  return <div className="w-full"><div className={cn("grid h-10 items-center border-b border-[#e4e7ee] text-center text-[13px] font-semibold text-[#8491a7]",equipment?"grid-cols-[1fr_90px_86px]":"grid-cols-[1fr_80px_78px_50px]")}>{equipment?<><span>대상설비</span><span>담당자</span><span>점검</span></>:<><span>품목명</span><span>출하수량</span><span>검사</span><span>판정</span></>}</div>{rows.map((name)=><div key={name} className={cn("grid min-h-[44px] items-center border-b border-[#e4e7ee] text-center text-[14px]",equipment?"grid-cols-[1fr_90px_86px]":"grid-cols-[1fr_80px_78px_50px]")}><span className="px-2">{name}</span><span>{equipment?"김수현":"999,999"}</span><Button variant="lineMain" size="xsmall" className="mx-auto h-[34px] min-w-0 rounded-[4px] border-0 bg-[#e8f5ff] px-[10px] text-[14px] font-bold">작성/수정</Button>{!equipment&&<span>대기</span>}</div>)}</div>;
}

export function MobileShippingInspectionListSourceScreen() { return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:93003" data-mobile-remaining-screen="shipping-inspection-list"><BluePageHeader title="유호스트" /><div className="absolute left-4 top-[99px] z-30 w-[343px]"><DateStrip label="출하일" value="2025-07-01" /></div><main className="absolute inset-x-0 top-[146px]"><SimpleInspectionTable /></main><div className="absolute inset-x-0 bottom-[84px] flex h-[82px] items-center gap-[10px] bg-white px-4"><label className="flex flex-1 items-center gap-1.5 text-[15px] font-semibold"><Checkbox color="gray" shape="circle" />일괄합결</label><Button variant="fillGray" size="basic" className="h-[50px] w-[108px]">취소</Button><Button variant="fillMain" size="basic" className="h-[50px] w-[108px]">저장</Button></div><div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div></div>; }

const incomingQuestions=["결로/플러그자국/밀착","밀착","질문사항 텍스트","결로/플러그자국/밀착","플러그자국","결로"];
export function MobileIncomingInspectionAppearanceSourceScreen() { const [values,setValues]=React.useState<Record<string,QaValue|undefined>>({}); const [result,setResult]=React.useState("pass"); const selectAll=()=>setValues(Object.fromEntries(incomingQuestions.map((_,index)=>[`q${index}`,"pass" as QaValue]))); return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:93119" data-mobile-remaining-screen="incoming-inspection-appearance"><WhitePageHeader /><h2 className="absolute left-4 top-[104px] w-[343px] text-center text-[18px] font-bold">풀무원 순두부 용기</h2><div className="absolute left-[120px] top-[140px] h-[34px] w-[136px]"><MobileStep labels={["기본정보","외관검사"]} activeIndex={1} /></div><div className="absolute left-4 top-[200px] grid h-[41px] w-[343px] grid-cols-2 gap-[10px]"><Button variant="lineBlacktxt" size="small" onClick={selectAll} className="h-[41px] w-full gap-2 rounded-[6px]"><span className="size-3 rounded-full border-2 border-[#1573fb]"/>일괄 선택</Button><Button variant="lineBlacktxt" size="small" onClick={()=>setValues({})} className="h-[41px] w-full gap-2 rounded-[6px]"><RotateCcw className="size-4"/>초기화</Button></div><main className="absolute left-4 top-[252px] h-[342px] w-[343px] rounded-[8px] border border-[#e4e7ee] p-[10px]"><MobileInspectionQuestionList questions={incomingQuestions.map((label,index)=>({id:`q${index}`,label}))} values={values} onChange={(id,value)=>setValues(current=>({...current,[id]:value}))} /></main><div className="absolute left-4 top-[607px] h-[43px] w-[343px] rounded-[6px] bg-[#e8f5ff] px-[100px] py-1"><MobileRadioGroup label="검사 결과" value={result} onChange={setResult} options={[{value:"pass",label:"합격"},{value:"fail",label:"불합격"}]} /></div><div className="absolute inset-x-0 bottom-[84px]"><MobileFixedActions primary="저장" secondary="←  이전 페이지" /></div><div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div></div>; }

export function MobileEquipmentInspectionListSourceScreen() { return <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:93248" data-mobile-remaining-screen="equipment-inspection-list"><BluePageHeader title="냉각기 점검표 A" /><div className="absolute left-4 top-[99px] z-30 w-[343px]"><MobileDateStrip label="점검일" value="2025-07-30" /></div><main className="absolute inset-x-0 top-[146px]"><SimpleInspectionTable equipment /></main><Button variant="fillMain" size="basic" className="absolute bottom-[116px] left-4 h-[50px] w-[343px] rounded-[6px]">등록</Button><div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div></div>; }

export function MobileRemainingMainScreen({ id }: { id: MobileRemainingMainScreenId }) {
  if(id==="receiving-result") return <MobileReceivingResultSourceScreen />; if(id==="maintenance-form") return <MobileMaintenanceFormSourceScreen />; if(id==="weight-inspection") return <MobileWeightInspectionSourceScreen />; if(id==="special-notes") return <MobileSpecialNotesSourceScreen />; if(id==="user-settings") return <MobileUserSettingsSourceScreen />; if(id==="login-placeholder") return <MobileLoginPlaceholderSourceScreen />; if(id==="report-basic-info") return <MobileReportBasicInfoSourceScreen />; if(id==="hourly-notes") return <MobileHourlyNotesSourceScreen />; if(id==="incoming-inspection-list") return <MobileIncomingInspectionListSourceScreen />; if(id==="shipping-inspection-list") return <MobileShippingInspectionListSourceScreen />; if(id==="incoming-inspection-basic") return <MobileIncomingInspectionBasicSourceScreen />; if(id==="incoming-inspection-appearance") return <MobileIncomingInspectionAppearanceSourceScreen />; return <MobileEquipmentInspectionListSourceScreen />;
}

export function MobileRemainingMainGallery() { const [active,setActive]=React.useState<MobileRemainingMainScreenId>("receiving-result"); const item=MOBILE_REMAINING_MAIN_ITEMS.find(candidate=>candidate.id===active)??MOBILE_REMAINING_MAIN_ITEMS[0]; return <section className="mt-8 w-full"><div className="mb-4"><h3 className="text-[16px] font-bold">후속 원본 화면</h3><p className="text-[12px] text-[#8491a7]">유형별 공용 컴포넌트로 조합한 나머지 13개 메인 프레임</p></div><div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-3">{MOBILE_REMAINING_MAIN_ITEMS.map(screen=><Button key={screen.id} size="small" variant={active===screen.id?"fillBlack":"lineBlacktxt"} className="h-auto min-h-12 justify-start px-3 py-2 text-left" onClick={()=>setActive(screen.id)}><span className="flex min-w-0 flex-col items-start"><span>{screen.label}</span><span className={cn("text-[11px] font-normal",active===screen.id?"text-white/70":"text-[#99a3b8]")}>{screen.description}</span></span></Button>)}</div><div className="mb-2 flex items-center justify-between text-[12px] text-[#67738e]"><span>Figma 원본 node {item.node}</span><span>코드 구현 · 원본 375×812</span></div><FigmaScreenPreview sourceWidth={SOURCE_WIDTH} sourceHeight={SOURCE_HEIGHT} maxScale={1} className="bg-[#eff2f8]"><MobileRemainingMainScreen id={active} /></FigmaScreenPreview></section>; }
