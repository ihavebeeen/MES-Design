"use client";

import * as React from "react";
import Image from "next/image";
import {
  CalendarDays,
  CornerDownLeft,
  ChevronLeft,
  ChevronRight,
  Delete,
  FilePenLine,
  Maximize2,
  ScanLine,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FigmaScreenPreview } from "@/components/patterns/figma-screen-preview";
import { cn } from "@/lib/utils";

const SOURCE_WIDTH = 375;
const SOURCE_HEIGHT = 812;

function AssetImage({ src, alt = "", className }: { src: string; alt?: string; className?: string }) {
  return <Image src={src} alt={alt} width={32} height={32} className={className} />;
}

function MobileStatusBar({ tone = "blue", transparent = false }: { tone?: "blue" | "white"; transparent?: boolean }) {
  const white = tone === "blue";
  return (
    <div className={cn("relative h-[47px] w-full shrink-0 overflow-hidden", white ? "text-white" : "bg-white text-[#011327]", white && !transparent && "bg-[#1573fb]")} data-mobile-part="status-bar">
      <span className="absolute left-[36px] top-[14px] text-[17px] font-semibold leading-[22px] tracking-[-0.408px]">9:41</span>
      <Image src="/mobile-assets/status-notch.svg" alt="" width={156} height={33} className="absolute left-1/2 top-[-2px] h-[33px] w-[156px] -translate-x-1/2" />
      <Image src="/mobile-assets/status-signal.svg" alt="" width={18} height={12} className={cn("absolute left-[274px] top-5 h-3 w-[18px]", !white && "invert")} />
      <Image src="/mobile-assets/status-wifi.svg" alt="" width={17} height={12} className={cn("absolute left-[300px] top-5 h-3 w-[17px]", !white && "invert")} />
      <span className="absolute left-[325px] top-[19px] h-[13px] w-[27px]">
        <Image src="/mobile-assets/status-battery-outline.svg" alt="" width={25} height={13} className={cn("absolute left-0 top-0 h-[13px] w-[25px]", !white && "invert")} />
        <Image src="/mobile-assets/status-battery-fill.svg" alt="" width={21} height={9} className={cn("absolute left-[2px] top-[2px] h-[9px] w-[21px]", !white && "invert")} />
        <Image src="/mobile-assets/status-battery-end.svg" alt="" width={2} height={5} className={cn("absolute right-0 top-[4px] h-[5px] w-0.5", !white && "invert")} />
      </span>
    </div>
  );
}

function UhostMesLogo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="relative flex h-[21px] w-[116px] items-center justify-end" aria-label="YOUHOST MES">
      <span className="relative h-3 w-[78px]">
        <Image src="/mobile-assets/uhost-symbol-left.svg" alt="" width={30} height={12} className={cn("absolute left-0 top-0 h-3 w-[30px]", dark && "invert")} />
        <Image src="/mobile-assets/uhost-symbol-right.svg" alt="" width={47} height={12} className={cn("absolute right-0 top-0 h-3 w-[47px]", dark && "invert")} />
      </span>
      <strong className={cn("ml-1 text-[16px] font-extrabold leading-none tracking-[-0.2px]", dark ? "text-[#011327]" : "text-white")}>MES</strong>
    </span>
  );
}

function MobileSourceHeader({ title, home = false }: { title?: string; home?: boolean }) {
  if (home) {
    return (
      <header className="flex h-[60px] shrink-0 items-center justify-between px-4 pb-2 pt-0 text-white" data-mobile-part="header">
        <Image src="/mobile-assets/dongjin-white.svg" alt="Dongjin" width={112} height={21} className="h-[21px] w-[112px]" />
        <UhostMesLogo />
      </header>
    );
  }
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between pl-[10px] pr-4 py-2 text-white" data-mobile-part="header">
      <div className="flex min-w-0 items-center gap-1">
        <Button variant="lineBlacktxt" size="small" aria-label="뒤로" className="size-9 border-0 bg-transparent p-0 text-white hover:bg-white/10">
          <ChevronLeft className="size-6" strokeWidth={2} />
        </Button>
        <strong className="truncate text-[20px] font-bold leading-[30px] tracking-[-0.25px]">{title}</strong>
      </div>
      <UhostMesLogo />
    </header>
  );
}

const tabItems = [
  { id: "home", label: "홈", icon: "/mobile-assets/tab-home.svg" },
  { id: "alarm", label: "알람", icon: "/mobile-assets/tab-bell-top.svg" },
  { id: "settings", label: "설정", icon: "/mobile-assets/tab-setting.svg" },
] as const;

function MobileSourceTabBar({ active = "home" }: { active?: string }) {
  const [selected, setSelected] = React.useState(active);
  return (
    <div className="h-[84px] shrink-0 bg-white" data-mobile-part="bottom-tabbar">
      <nav className="flex h-[54px] border-t border-[#e4e7ee] px-[10px]">
        {tabItems.map((item) => (
          <Button key={item.id} variant="lineBlacktxt" size="small" onClick={() => setSelected(item.id)} className="h-[54px] min-w-0 flex-1 flex-col gap-1 rounded-none border-0 bg-transparent px-3.5 py-2 hover:bg-transparent">
            <AssetImage src={item.icon} className={cn("size-6 object-contain", selected !== item.id && "opacity-45")} />
            <span className={cn("text-[10px] leading-none tracking-[-0.125px]", selected === item.id ? "font-semibold text-[#011327]" : "font-medium text-[#99a3b8]")}>{item.label}</span>
          </Button>
        ))}
        <Button variant="lineBlacktxt" size="small" onClick={() => setSelected("menu")} className="h-[54px] min-w-0 flex-1 flex-col gap-1 rounded-none border-0 bg-transparent px-3.5 py-2 hover:bg-transparent">
          <span className={cn("flex size-6 flex-col justify-center gap-[5px] px-0.5", selected !== "menu" && "opacity-45")}>{[0,1,2].map((line) => <span key={line} className="h-0.5 w-5 rounded-full bg-[#99a3b8]" />)}</span>
          <span className={cn("text-[10px] leading-none tracking-[-0.125px]", selected === "menu" ? "font-semibold text-[#011327]" : "font-medium text-[#99a3b8]")}>전체메뉴</span>
        </Button>
      </nav>
      <div className="relative h-[30px]"><span className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" /></div>
    </div>
  );
}

const homeMenus = [
  ["입고등록", "/mobile-assets/home-receiving.svg"],
  ["출하등록", "/mobile-assets/home-shipping.svg"],
  ["생산관리", "/mobile-assets/home-production.svg"],
  ["품질검사", "/mobile-assets/home-quality.svg"],
  ["운전일지", "/mobile-assets/home-operation-log.svg"],
  ["라벨관리", "/mobile-assets/home-label.svg"],
  ["정비이력", "/mobile-assets/home-maintenance.svg"],
  ["설비점검", "/mobile-assets/home-inspection.svg"],
] as const;

export function MobileHomeSourceScreen() {
  const [selected, setSelected] = React.useState<string>();
  return (
    <div className="flex h-[812px] w-[375px] flex-col overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:91938" data-mobile-source-screen="home">
      <section className="flex h-[728px] shrink-0 flex-col bg-[linear-gradient(179.96deg,#4891fc_0%,rgba(170,204,254,0.363)_47.98%,rgba(255,255,255,0)_95.93%)]">
        <MobileStatusBar transparent />
        <MobileSourceHeader home />
        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-4 gap-3 px-4 pb-6">
          {homeMenus.map(([label, icon]) => (
            <Button key={label} variant="lineBlacktxt" size="basic" aria-pressed={selected === label} onClick={() => setSelected(label)} className="h-full min-w-0 flex-col gap-3 rounded-[8px] border-0 bg-white px-5 text-[18px] font-bold tracking-[-0.225px] text-[#011327] shadow-[0_0_5px_rgba(54,135,252,0.2)] hover:bg-white aria-pressed:ring-2 aria-pressed:ring-[#1573fb]">
              <AssetImage src={icon} className="size-8 object-contain" />
              {label}
            </Button>
          ))}
        </div>
      </section>
      <MobileSourceTabBar />
    </div>
  );
}

function DateNavigator() {
  return (
    <div className="flex h-[68px] shrink-0 items-start justify-between px-4 pt-2">
      <Button variant="lineBlacktxt" size="small" aria-label="이전 날짜" className="size-9 border-0 bg-white p-0 hover:bg-[#f8fafc]"><ChevronLeft className="size-6" /></Button>
      <div className="flex h-9 items-center gap-2"><span className="flex h-5 items-center rounded-full bg-white px-2 text-[12px] font-semibold leading-[18px] text-[#1573fb]">오늘</span><strong className="text-[20px] font-bold leading-[30px] tracking-[-0.25px] text-white">2025.07.30</strong></div>
      <Button variant="lineBlacktxt" size="small" aria-label="다음 날짜" className="size-9 border-0 bg-white p-0 hover:bg-[#f8fafc]"><ChevronRight className="size-6" /></Button>
    </div>
  );
}

const receivingRows = ["대기", "대기", "대기", "완료", "완료", "완료"] as const;

export function MobileReceivingListSourceScreen() {
  const [activeRow, setActiveRow] = React.useState<number>();
  return (
    <div className="relative flex h-[812px] w-[375px] flex-col overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:91889" data-mobile-source-screen="receiving-list">
      <div className="h-[180px] shrink-0 bg-[linear-gradient(180deg,#1573fb_0%,#3782f7_100%)]">
        <MobileStatusBar />
        <MobileSourceHeader title="입고등록" />
        <DateNavigator />
      </div>
      <main className="absolute inset-x-0 bottom-[84px] top-[167px] overflow-hidden rounded-t-[24px] bg-white px-4 pt-[25px]">
        <div className="flex flex-col gap-[10px]">
          {receivingRows.map((state, index) => (
            <Button key={`${state}-${index}`} variant="lineBlacktxt" size="basic" onClick={() => setActiveRow(index)} className={cn("h-[79px] w-full justify-start rounded-[12px] border-0 px-5 py-3 text-left hover:bg-[#e8f5ff]", state === "대기" ? "bg-[#e8f5ff]" : "bg-[#eff2f8]", activeRow === index && "ring-2 ring-[#1573fb]") }>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                <span className={cn("rounded-full px-2 py-0.5 text-[12px] font-semibold leading-[18px] text-white", state === "대기" ? "bg-[#1573fb]" : "bg-[#b4c0d3]")}>{state}</span>
                <strong className="text-[16px] font-bold leading-6 tracking-[-0.2px] text-[#011327]">공급사 A (10건)</strong>
              </span>
              <ChevronRight className="size-5 text-[#011327]" strokeWidth={1.7} />
            </Button>
          ))}
        </div>
      </main>
      <div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div>
    </div>
  );
}

function MobileFormRow({ label, value, link = false }: { label: string; value: string; link?: boolean }) {
  return <div className="grid h-10 grid-cols-[74px_1fr] items-center"><span className="text-[15px] leading-[23px] text-[#67738e]">{label}</span><span className={cn("truncate text-[15px] leading-[23px] text-[#011327]", link && "text-[#1573fb] underline underline-offset-2")}>{value}</span></div>;
}

function CompactEditableField({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[74px_80px] items-center"><span className="text-[15px] leading-[23px] text-[#67738e]">{label}</span><Input defaultValue={value} className="h-8 rounded-[4px] px-[10px] text-[15px]" /></div>;
}

export function MobileProductionEntrySourceScreen() {
  const [complete, setComplete] = React.useState(true);
  return (
    <div className="flex h-[812px] w-[375px] flex-col overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:91789" data-mobile-source-screen="production-entry">
      <div className="h-[99px] shrink-0 bg-[#1573fb]"><MobileStatusBar /><MobileSourceHeader title="성형기 1호" /></div>
      <div className="mx-4 flex h-9 shrink-0 items-center justify-between rounded-[4px] border border-[#e4e7ee] bg-white px-3 text-[14px]">
        <span className="flex items-center gap-1.5 font-semibold text-[#011327]"><CalendarDays className="size-4" />지시일 2025-07-01</span>
        <Button variant="lineMain" size="xsmall" className="h-[22px] border-0 px-0 font-semibold">입력 4건 <ChevronRight className="size-4" /></Button>
      </div>
      <main className="flex min-h-0 flex-1 flex-col gap-[10px] overflow-hidden px-4 pt-3">
        <section className="h-[206px] shrink-0 rounded-[8px] border border-[#e4e7ee] p-3">
          <h3 className="mb-[5px] text-[16px] font-bold leading-6 text-[#011327]">기본 정보</h3>
          <div className="grid grid-cols-[74px_1fr] items-center gap-y-2">
            <span className="text-[15px] text-[#67738e]">생산기사</span><Input defaultValue="김아무개" className="h-8 text-[15px]" />
            <span className="text-[15px] text-[#67738e]">작업인원</span><Input defaultValue="신선미 외35" className="h-8 text-[15px]" />
          </div>
          <MobileFormRow label="품목명" value="캐나다투칸두부배캣(신형/칼선)" link />
          <MobileFormRow label="누적/지시" value="999,999 / 24,903" />
        </section>
        <section className="h-[128px] shrink-0 rounded-[8px] border border-[#e4e7ee] p-3">
          <div className="mb-1 flex h-6 items-center justify-between"><h3 className="text-[16px] font-bold text-[#011327]">생산 실적</h3><Button variant="lineMain" size="xsmall" className="h-6 border-0 px-0 text-[14px]"><FilePenLine className="size-4" />메모</Button></div>
          <div className="grid grid-cols-2 gap-x-[10px] gap-y-2"><CompactEditableField label="시작시간" value="09:00" /><CompactEditableField label="종료시간" value="18:00" /><CompactEditableField label="생산수량" value="999,999" /><CompactEditableField label="불량수량" value="20" /></div>
        </section>
        <section className="h-[86px] shrink-0 rounded-[8px] border border-[#e4e7ee] p-3">
          <h3 className="mb-1 text-[16px] font-bold leading-6 text-[#011327]">투입 정보</h3>
          <div className="grid grid-cols-2 gap-[10px]"><CompactEditableField label="자동 BOM" value="A type" /><CompactEditableField label="SCAN 품목" value="" /></div>
        </section>
        <div className="mt-1 grid h-[66px] shrink-0 grid-cols-[99px_1fr_1fr] items-start gap-[10px] pb-0 pt-0.5">
          <label className="flex h-[50px] items-center gap-1.5 text-[14px] font-semibold text-[#011327]"><Checkbox checked={complete} onChange={(event) => setComplete(event.target.checked)} color="black" shape="circle" />완료 처리</label>
          <Button variant="fillGray" size="basic" className="h-[50px] rounded-[6px] text-[16px] font-bold">취소</Button>
          <Button variant="fillMain" size="basic" className="h-[50px] rounded-[6px] text-[16px] font-bold">저장</Button>
        </div>
      </main>
      <div className="relative grid h-[142px] shrink-0 grid-cols-4 border-t border-[#e4e7ee] pt-2">
        {[
          ["라벨생성", "완료", ScanLine],
          ["라벨확정", "-", Maximize2],
          ["자주검사", "2회", Search],
          ["운전일지", "기록됨", FilePenLine],
        ].map(([label, state, Icon], index) => (
          <Button key={String(label)} variant="lineBlacktxt" size="small" className="h-[76px] min-w-0 flex-col gap-1 rounded-none border-0 bg-white px-1 hover:bg-white">
            <Icon className={cn("size-6", index === 0 ? "text-[#011327]" : index === 1 ? "text-[#99a3b8]" : "text-[#011327]")} />
            <span className="text-[13px] font-bold text-[#011327]">{String(label)}</span>
            <span className={cn("text-[12px] font-normal", index === 1 ? "text-[#99a3b8]" : "text-[#1573fb]")}>{String(state)}</span>
          </Button>
        ))}
        <div className="absolute inset-x-0 bottom-0"><MobileHomeIndicator /></div>
      </div>
    </div>
  );
}

export type MobileSourceScreenId = "home" | "receiving-list" | "production-entry";

export const MOBILE_SOURCE_SCREEN_ITEMS: Array<{ id: MobileSourceScreenId; label: string; node: string; description: string }> = [
  { id: "home", label: "홈", node: "10378:91938", description: "메인 퀵메뉴 2×4 · 하단 탭" },
  { id: "receiving-list", label: "입고등록 목록", node: "10378:91889", description: "날짜 이동 · 대기/완료 카드 목록" },
  { id: "production-entry", label: "생산실적 등록", node: "10378:91789", description: "기본 정보 · 생산실적 · 투입정보 · 업무 바로가기" },
];

export function MobileSourceScreen({ id }: { id: MobileSourceScreenId }) {
  if (id === "receiving-list") return <MobileReceivingListSourceScreen />;
  if (id === "production-entry") return <MobileProductionEntrySourceScreen />;
  return <MobileHomeSourceScreen />;
}

export function MobileSourceScreenGallery() {
  const [active, setActive] = React.useState<MobileSourceScreenId>("home");
  const item = MOBILE_SOURCE_SCREEN_ITEMS.find((candidate) => candidate.id === active) ?? MOBILE_SOURCE_SCREEN_ITEMS[0];
  return (
    <div className="w-full">
      <div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-3">
        {MOBILE_SOURCE_SCREEN_ITEMS.map((screen) => (
          <Button key={screen.id} size="small" variant={active === screen.id ? "fillBlack" : "lineBlacktxt"} className="h-auto min-h-12 justify-start px-3 py-2 text-left" onClick={() => setActive(screen.id)}>
            <span className="flex min-w-0 flex-col items-start"><span>{screen.label}</span><span className={cn("text-[11px] font-normal", active === screen.id ? "text-white/70" : "text-[#99a3b8]")}>{screen.description}</span></span>
          </Button>
        ))}
      </div>
      <div className="mb-2 flex items-center justify-between text-[12px] text-[#67738e]"><span>Figma 원본 node {item.node}</span><span>코드 구현 · 원본 375×812</span></div>
      <FigmaScreenPreview sourceWidth={SOURCE_WIDTH} sourceHeight={SOURCE_HEIGHT} maxScale={1} className="bg-[#eff2f8]">
        <MobileSourceScreen id={active} />
      </FigmaScreenPreview>
    </div>
  );
}

function DimmedMobileStatusBar() {
  return (
    <div className="relative h-[47px] w-full shrink-0 bg-[#8e8e8e] text-[#011327]" data-mobile-part="dimmed-status-bar">
      <span className="absolute left-[36px] top-[14px] text-[17px] font-semibold leading-[22px] tracking-[-0.408px]">9:41</span>
      <Image src="/mobile-assets/status-signal.svg" alt="" width={18} height={12} className="absolute left-[274px] top-5 h-3 w-[18px] invert" />
      <Image src="/mobile-assets/status-wifi.svg" alt="" width={17} height={12} className="absolute left-[300px] top-5 h-3 w-[17px] invert" />
      <span className="absolute left-[325px] top-[19px] h-[13px] w-[27px]">
        <Image src="/mobile-assets/status-battery-outline.svg" alt="" width={25} height={13} className="absolute left-0 top-0 h-[13px] w-[25px] invert" />
        <Image src="/mobile-assets/status-battery-fill.svg" alt="" width={21} height={9} className="absolute left-[2px] top-[2px] h-[9px] w-[21px] invert" />
        <Image src="/mobile-assets/status-battery-end.svg" alt="" width={2} height={5} className="absolute right-0 top-[4px] h-[5px] w-0.5 invert" />
      </span>
    </div>
  );
}

function MobileHomeIndicator() {
  return <div className="relative h-[30px] shrink-0 bg-white"><span className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" /></div>;
}

function MobileBottomSheetHeader({ title }: { title: string }) {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#e4e7ee] px-6">
      <h3 className="text-[20px] font-bold leading-[30px] tracking-[-0.25px] text-[#011327]">{title}</h3>
      <Button variant="lineBlacktxt" size="small" aria-label="닫기" className="size-9 border-0 bg-transparent p-0 hover:bg-[#f8fafc]"><X className="size-6" strokeWidth={1.8} /></Button>
    </header>
  );
}

export function MobileMemoPopupSourceScreen() {
  const [memo, setMemo] = React.useState("");
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-[#8e8e8e] font-[Pretendard]" data-figma-node-id="10378:93868" data-mobile-popup-screen="memo">
      <DimmedMobileStatusBar />
      <section className="absolute inset-x-0 bottom-0 h-[380px] overflow-hidden rounded-t-[12px] bg-white">
        <MobileBottomSheetHeader title="메모" />
        <div className="h-[220px] px-6 pt-5">
          <Textarea value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="내용을 입력하세요" className="h-[180px] resize-none rounded-[6px] border-[#d8deea] p-4 text-[14px] leading-5 placeholder:text-[#99a3b8]" />
        </div>
        <div className="h-[70px] px-6"><Button variant="fillMain" size="basic" className="h-[50px] w-full rounded-[6px] text-[16px] font-bold">저장</Button></div>
        <MobileHomeIndicator />
      </section>
    </div>
  );
}

const keypadValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "C"] as const;

function RangeInput({ hint, value, label }: { hint: string; value: string; label: string }) {
  return (
    <label className="relative block h-[42px]">
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[15px] text-[#99a3b8]">{hint}</span>
      <Input defaultValue={value} aria-label={label} className="h-[42px] rounded-[6px] border-[#011327] bg-white px-4 text-right text-[16px]" />
    </label>
  );
}

export function MobileNumericPopupSourceScreen() {
  const [value, setValue] = React.useState("5,500");
  const append = (key: string) => {
    if (key === "C") return setValue("");
    setValue((current) => `${current.replaceAll(",", "")}${key}`.replace(/^0+/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  };
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-[#8e8e8e] font-[Pretendard]" data-figma-node-id="10378:91004" data-mobile-popup-screen="numeric">
      <DimmedMobileStatusBar />
      <section className="absolute inset-x-0 bottom-0 h-[438px] overflow-hidden rounded-t-[12px] bg-white">
        <MobileBottomSheetHeader title="생산수량 입력" />
        <div className="h-[196px] px-6 pt-5">
          <div className="mb-[10px] grid grid-cols-[102px_1fr] items-start">
            <label className="flex h-[34px] items-center gap-1.5 text-[14px] text-[#67738e]"><Checkbox defaultChecked color="main" shape="circle" />자동계산</label>
            <div><Input value={value} readOnly className="h-[34px] border-0 bg-[#e4e7ee] px-4 text-[18px] font-medium text-[#8491a7]" /><p className="text-right text-[12px] leading-[18px] text-[#67738e]">입상수: 10</p></div>
          </div>
          <div className="grid grid-cols-[52px_128px_128px] items-center gap-x-[10px] gap-y-3">
            <span className="pl-[10px] text-[15px] text-[#99a3b8]">흑</span><RangeInput hint="시작" value="1" label="흑 시작" /><RangeInput hint="종료" value="50" label="흑 종료" />
            <span className="pl-[10px] text-[15px] text-[#99a3b8]">적</span><RangeInput hint="시작" value="25" label="적 시작" /><RangeInput hint="종료" value="35" label="적 종료" />
          </div>
        </div>
        <div className="h-[212px] border-t border-[#e4e7ee] bg-white px-[10px] pt-[9px]">
          <div className="grid grid-cols-6 gap-2">
            {keypadValues.slice(0, 6).map((key) => <Button key={key} variant="fillGray" size="small" onClick={() => append(key)} className="h-10 min-w-0 rounded-[4px] p-0 text-[20px] font-normal">{key}</Button>)}
          </div>
          <div className="mt-2 grid grid-cols-[repeat(5,52px)] justify-center gap-2">
            {keypadValues.slice(6).map((key) => <Button key={key} variant="fillGray" size="small" onClick={() => append(key)} className="h-10 min-w-0 rounded-[4px] p-0 text-[20px] font-normal">{key}</Button>)}
          </div>
          <div className="mt-2 grid grid-cols-[1fr_112px_1fr] items-center gap-2">
            <Button variant="lineBlacktxt" size="small" className="h-10 border-0 bg-transparent text-[16px] text-[#8491a7] hover:bg-transparent">닫기</Button>
            <Button variant="fillGray" size="small" onClick={() => setValue((current) => current.replace(/,?\d$/, ""))} aria-label="한 글자 지우기" className="relative h-10 rounded-[4px]"><Delete className="size-5 text-[#99a3b8]" fill="currentColor" /><X className="absolute size-2.5 text-white" strokeWidth={2.5} /></Button>
            <Button variant="lineMain" size="small" className="h-10 border-0 bg-transparent text-[#1573fb] hover:bg-transparent"><CornerDownLeft className="size-6" strokeWidth={2.4} /></Button>
          </div>
          <MobileHomeIndicator />
        </div>
      </section>
    </div>
  );
}

const personnel = ["김수현", "김아무개", "노미선", "신선미", "도현", "박현서", "서인국", "이대한", "이민국", "이도현", "이지현", "김아무개", "노미선", "이대오", "홍길동"];

export function MobilePersonnelPopupSourceScreen() {
  const [selected, setSelected] = React.useState(() => new Set(["김아무개", "신선미", "이대한", "이민국"]));
  const toggle = (name: string) => setSelected((current) => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-[#8e8e8e] font-[Pretendard]" data-figma-node-id="10378:91697" data-mobile-popup-screen="personnel">
      <DimmedMobileStatusBar />
      <section className="absolute inset-x-0 bottom-0 h-[404px] overflow-hidden rounded-t-[12px] bg-white">
        <div className="flex h-[52px] items-center justify-between px-4">
          <h3 className="text-[18px] font-bold leading-[27px] tracking-[-0.225px] text-[#011327]">작업인원 선택</h3>
          <Button variant="lineBlacktxt" size="small" aria-label="닫기" className="size-9 border-0 bg-transparent p-0 hover:bg-[#f8fafc]"><X className="size-6" strokeWidth={1.8} /></Button>
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 px-4 pb-4 pt-2">
          {personnel.map((name, index) => {
            const active = selected.has(name) && (name !== "김아무개" || index === 1);
            return <Button key={`${name}-${index}`} variant={active ? "fillBlack" : "lineBlacktxt"} size="small" onClick={() => toggle(name)} className="h-10 min-w-0 rounded-[6px] px-2 text-[14px] font-medium">{name}</Button>;
          })}
        </div>
        <div className="h-[66px] px-4"><Button variant="fillMain" size="basic" className="h-[50px] w-full rounded-[6px] text-[16px] font-bold">저장</Button></div>
        <MobileHomeIndicator />
      </section>
    </div>
  );
}

export type MobilePopupScreenId = "memo" | "numeric" | "personnel";

export const MOBILE_POPUP_SCREEN_ITEMS: Array<{ id: MobilePopupScreenId; label: string; node: string; description: string }> = [
  { id: "memo", label: "메모", node: "10378:93868", description: "텍스트 입력 · 저장" },
  { id: "numeric", label: "생산수량 입력", node: "10378:91004", description: "자동계산 · 범위 입력 · 숫자 키패드" },
  { id: "personnel", label: "작업인원 선택", node: "10378:91697", description: "복수 선택 · 저장" },
];

export function MobilePopupSourceScreen({ id }: { id: MobilePopupScreenId }) {
  if (id === "numeric") return <MobileNumericPopupSourceScreen />;
  if (id === "personnel") return <MobilePersonnelPopupSourceScreen />;
  return <MobileMemoPopupSourceScreen />;
}

export function MobilePopupSourceScreenGallery() {
  const [active, setActive] = React.useState<MobilePopupScreenId>("memo");
  const item = MOBILE_POPUP_SCREEN_ITEMS.find((candidate) => candidate.id === active) ?? MOBILE_POPUP_SCREEN_ITEMS[0];
  return (
    <div className="w-full">
      <div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-3">
        {MOBILE_POPUP_SCREEN_ITEMS.map((screen) => (
          <Button key={screen.id} size="small" variant={active === screen.id ? "fillBlack" : "lineBlacktxt"} className="h-auto min-h-12 justify-start px-3 py-2 text-left" onClick={() => setActive(screen.id)}>
            <span className="flex min-w-0 flex-col items-start"><span>{screen.label}</span><span className={cn("text-[11px] font-normal", active === screen.id ? "text-white/70" : "text-[#99a3b8]")}>{screen.description}</span></span>
          </Button>
        ))}
      </div>
      <div className="mb-2 flex items-center justify-between text-[12px] text-[#67738e]"><span>Figma 원본 node {item.node}</span><span>코드 구현 · 원본 375×812</span></div>
      <FigmaScreenPreview sourceWidth={SOURCE_WIDTH} sourceHeight={SOURCE_HEIGHT} maxScale={1} className="bg-[#eff2f8]">
        <MobilePopupSourceScreen id={active} />
      </FigmaScreenPreview>
    </div>
  );
}
