"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Circle,
  CornerDownLeft,
  Delete,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FigmaScreenPreview } from "@/components/patterns/figma-screen-preview";
import { MobileButton, MobileCompactField, MobileFormSection, MobileInspectionQuestionList, MobileRadioGroup, MobileStep, MobileTwoDepthMenu, type MobileMenuCategory, type QaValue } from "./mobile-ui";
import { cn } from "@/lib/utils";

const SOURCE_WIDTH = 375;
const SOURCE_HEIGHT = 812;

function AssetImage({ src, alt = "", className }: { src: string; alt?: string; className?: string }) {
  return <Image src={src} alt={alt} width={32} height={32} className={className} />;
}

export function MobileStatusBar({ tone = "blue", transparent = false }: { tone?: "blue" | "white"; transparent?: boolean }) {
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

export function MobileSourceHeader({ title, home = false, tone = "blue" }: { title?: string; home?: boolean; tone?: "blue" | "white" }) {
  if (home) {
    return (
      <header className="flex h-[60px] shrink-0 items-center justify-between px-4 pb-2 pt-0 text-white" data-mobile-part="header">
        <Image src="/mobile-assets/dongjin-white.svg" alt="Dongjin" width={112} height={21} className="h-[21px] w-[112px]" />
        <UhostMesLogo />
      </header>
    );
  }
  return (
    <header className={cn("flex h-[52px] shrink-0 items-center justify-between pl-[10px] pr-4 py-2", tone === "white" ? "text-[#011327]" : "text-white")} data-mobile-part="header">
      <div className="flex min-w-0 items-center gap-1">
        <Button variant="lineBlacktxt" size="small" aria-label="뒤로" className={cn("size-9 border-0 bg-transparent p-0", tone === "white" ? "text-[#011327] hover:bg-[#eff2f8]" : "text-white hover:bg-white/10")}>
          {tone === "white" ? <ArrowLeft className="size-5" /> : <Image src="/mobile-assets/arrow-back-white.svg" alt="" width={16} height={14} className="h-[14px] w-4" />}
        </Button>
        <strong className="truncate text-[20px] font-bold leading-[30px] tracking-[-0.25px]">{title}</strong>
      </div>
      <UhostMesLogo dark={tone === "white"} />
    </header>
  );
}

const tabItems = [
  { id: "home", label: "홈" },
  { id: "alarm", label: "알람" },
  { id: "settings", label: "설정" },
] as const;

function MobileSourceTabIcon({ id, muted }: { id: (typeof tabItems)[number]["id"]; muted: boolean }) {
  return (
    <span className={cn("relative block size-6 shrink-0", muted && "opacity-45")} aria-hidden="true">
      {id === "home" && <Image src="/mobile-assets/tab-home.svg" alt="" width={20.17} height={20.14} className="absolute left-[1.92px] top-[1.93px] h-[20.14px] w-[20.17px]" />}
      {id === "alarm" && (
        <>
          <Image src="/mobile-assets/tab-bell-top.svg" alt="" width={19.48} height={17} className="absolute left-[2.26px] top-0.5 h-[17px] w-[19.48px]" />
          <Image src="/mobile-assets/tab-bell-bottom.svg" alt="" width={7.29} height={3} className="absolute left-[8.35px] top-[21px] h-[3px] w-[7.29px]" />
        </>
      )}
      {id === "settings" && <Image src="/mobile-assets/tab-setting.svg" alt="" width={21.49} height={20.36} className="absolute left-[1.25px] top-[1.82px] h-[20.36px] w-[21.49px]" />}
    </span>
  );
}

export function MobileSourceTabBar({ active = "home" }: { active?: string }) {
  const [selected, setSelected] = React.useState(active);
  return (
    <div className="h-[84px] shrink-0 bg-white" data-mobile-part="bottom-tabbar">
      <nav className="flex h-[54px] border-t border-[#e4e7ee] px-[10px]">
        {tabItems.map((item) => (
          <Button key={item.id} variant="lineBlacktxt" size="small" onClick={() => setSelected(item.id)} className="h-[54px] min-w-0 flex-1 flex-col gap-1 rounded-none border-0 bg-transparent px-3.5 py-2 hover:bg-transparent">
            <MobileSourceTabIcon id={item.id} muted={selected !== item.id} />
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
      <MobileButton tone="line-black" size="small" aria-label="이전 날짜" className="size-9 min-w-0 border-0 bg-white p-0"><Image src="/mobile-assets/arrow-date.svg" alt="" width={8.21} height={15.42} className="h-[15.42px] w-[8.21px] rotate-180" /></MobileButton>
      <div className="flex h-9 items-center gap-[10px]"><span className="flex items-center rounded-full bg-white px-[6px] py-[3px] text-[13px] font-semibold leading-none tracking-[-0.1625px] text-[#0958d9]">오늘</span><strong className="text-[20px] font-bold leading-none tracking-[-0.25px] text-white">2025.07.30</strong></div>
      <MobileButton tone="line-black" size="small" aria-label="다음 날짜" className="size-9 min-w-0 border-0 bg-white p-0"><Image src="/mobile-assets/arrow-date.svg" alt="" width={8.21} height={15.42} className="h-[15.42px] w-[8.21px]" /></MobileButton>
    </div>
  );
}

const receivingRows = ["대기", "대기", "대기", "완료", "완료", "완료"] as const;

export function MobileReceivingListSourceScreen() {
  const [activeRow, setActiveRow] = React.useState<number>();
  return (
    <div className="relative flex h-[812px] w-[375px] flex-col overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:91889" data-mobile-source-screen="receiving-list">
      <div className="relative h-[180px] shrink-0">
        <div className="absolute inset-x-0 top-[47px] h-[180px] bg-[linear-gradient(180deg,#1573fb_0%,#4b8fff_102.25%)]" aria-hidden="true" />
        <div className="relative z-10">
          <MobileStatusBar />
          <MobileSourceHeader title="입고등록" />
          <DateNavigator />
        </div>
      </div>
      <main className="absolute inset-x-0 bottom-[84px] top-[167px] overflow-hidden rounded-t-[24px] bg-white px-4 pt-6 shadow-[0_4px_30px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-[10px]">
          {receivingRows.map((state, index) => (
            <MobileButton key={`${state}-${index}`} tone={state === "대기" ? "subtle" : "gray"} size="default" onClick={() => setActiveRow(index)} className={cn("h-[79px] w-full justify-start rounded-[12px] border-0 py-4 pl-5 pr-4 text-left", state === "대기" ? "bg-[#e8f5ff]" : "bg-[#eff2f8]", activeRow === index && "ring-2 ring-[#1573fb]") }>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-[10px]">
                <span className={cn("rounded-full px-[10px] py-1 text-[13px] font-semibold leading-none tracking-[-0.1625px] text-white", state === "대기" ? "bg-[#1573fb]" : "bg-[#99a3b8]")}>{state}</span>
                <strong className="text-[16px] font-semibold leading-none tracking-[-0.2px] text-[#011327]">공급사 A (10건)</strong>
              </span>
              <Image src="/mobile-assets/arrow-row.svg" alt="" width={6.57} height={12.33} className="h-[12.33px] w-[6.57px]" />
            </MobileButton>
          ))}
        </div>
      </main>
      <div className="absolute inset-x-0 bottom-0"><MobileSourceTabBar /></div>
    </div>
  );
}

function MobileFormRow({ label, value, link = false }: { label: string; value: string; link?: boolean }) {
  return <div className="grid h-8 grid-cols-[74px_1fr] items-center"><span className="text-[15px] leading-[22.5px] tracking-[-0.1875px] text-[#5c667b]">{label}</span><span className={cn("truncate text-[15px] font-medium leading-[22.5px] tracking-[-0.1875px] text-[#011327]", link && "text-[#1573fb] underline decoration-from-font underline-offset-2")}>{value}</span></div>;
}

function CompactEditableField({ label, value }: { label: string; value: string }) {
  return <div className="grid h-8 min-w-0 grid-cols-[74px_1fr] items-center"><span className="whitespace-nowrap text-[15px] leading-[22.5px] tracking-[-0.1875px] text-[#5c667b]">{label}</span><Input defaultValue={value} className="h-8 min-w-0 rounded-[4px] px-[10px] text-[15px] leading-[22.5px] tracking-[-0.1875px]" /></div>;
}

const productionShortcuts = [
  { id: "label-create", label: "라벨생성", state: "완료", tone: "black", icon: "barcode-black" },
  { id: "label-confirm", label: "라벨확정", state: "-", tone: "gray", icon: "barcode-gray" },
  { id: "inspection", label: "자주검사", state: "2회", tone: "black", icon: "search" },
  { id: "operation-log", label: "운전일지", state: "기록됨", tone: "black", icon: "calendar-pen" },
] as const;

function ProductionShortcutIcon({ icon }: { icon: (typeof productionShortcuts)[number]["icon"] }) {
  return (
    <span className="relative block size-6 shrink-0" aria-hidden="true">
      {icon === "barcode-black" && <Image src="/mobile-assets/production-barcode-black.svg" alt="" width={20} height={20} className="absolute left-0.5 top-0.5 size-5" />}
      {icon === "barcode-gray" && <Image src="/mobile-assets/production-barcode-gray.svg" alt="" width={20} height={20} className="absolute left-0.5 top-0.5 size-5" />}
      {icon === "search" && <Image src="/mobile-assets/production-search-group.svg" alt="" width={19.49} height={19.48} className="absolute left-[2.25px] top-[2.25px] h-[19.48px] w-[19.49px]" />}
      {icon === "calendar-pen" && <Image src="/mobile-assets/production-calendar-pen.svg" alt="" width={20.95} height={20.95} className="absolute left-[1.52px] top-[1.52px] h-[20.95px] w-[20.95px]" />}
    </span>
  );
}

export function MobileProductionEntrySourceScreen() {
  const [complete, setComplete] = React.useState(true);
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:91789" data-mobile-source-screen="production-entry">
      <div className="absolute inset-x-0 top-[47px] h-[69px] bg-[linear-gradient(180deg,#1573fb_0%,#4b8fff_102.25%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 z-20"><MobileStatusBar /><MobileSourceHeader title="성형기 1호" /></div>
      <div className="absolute left-4 top-[99px] flex h-[37px] w-[343px] items-center gap-1.5 overflow-hidden rounded-[6px] border border-[#e4e7ee] bg-white px-3 py-2 text-[14px] tracking-[-0.175px]">
        <CalendarDays className="size-4 shrink-0" strokeWidth={1.33} />
        <strong className="font-semibold">지시일</strong>
        <strong className="min-w-0 flex-1 font-semibold">2025-07-01</strong>
        <Button variant="lineMain" size="xsmall" className="h-[21px] shrink-0 gap-[3px] border-0 px-0 text-[14px] font-semibold tracking-[-0.175px]">입력 4건 <Image src="/mobile-assets/production-date-arrow.svg" alt="" width={6.57} height={12.33} className="h-[12.33px] w-[6.57px]" /></Button>
      </div>
      <main className="absolute left-4 top-[146px] flex w-[343px] flex-col gap-[10px]">
        <section className="flex h-[207px] shrink-0 flex-col gap-2 rounded-[8px] border border-[#e4e7ee] p-3">
          <h3 className="text-[15px] font-bold leading-[22.5px] tracking-[-0.1875px] text-[#011327]">기본 정보</h3>
          <div className="flex flex-col gap-2">
            <div className="grid h-8 grid-cols-[74px_1fr] items-center"><span className="text-[15px] leading-[22.5px] tracking-[-0.1875px] text-[#5c667b]">생산기사</span><Input defaultValue="김아무개" className="h-8 rounded-[4px] px-[10px] text-[15px]" /></div>
            <div className="grid h-8 grid-cols-[74px_1fr] items-center"><span className="text-[15px] leading-[22.5px] tracking-[-0.1875px] text-[#5c667b]">작업인원</span><Input defaultValue="신선미 외35" className="h-8 rounded-[4px] px-[10px] text-[15px]" /></div>
            <MobileFormRow label="품목명" value="캐나다투칸두부배캣(신형/칼선)" link />
            <MobileFormRow label="누적/지시" value="999,999 / 24,903" />
          </div>
        </section>
        <section className="flex h-[127px] shrink-0 flex-col gap-2 rounded-[8px] border border-[#e4e7ee] p-3">
          <div className="flex h-[22.5px] items-center justify-between"><h3 className="text-[15px] font-bold leading-[22.5px] tracking-[-0.1875px] text-[#011327]">생산 실적</h3><Button variant="lineMain" size="xsmall" className="h-[21px] gap-[5px] border-0 px-0 text-[14px] font-bold tracking-[-0.175px]"><Image src="/mobile-assets/production-memo.svg" alt="" width={13.72} height={13.72} className="h-[13.72px] w-[13.72px] -scale-y-100" />메모</Button></div>
          <div className="grid grid-cols-2 gap-x-[10px] gap-y-2"><CompactEditableField label="시작시간" value="09:00" /><CompactEditableField label="종료시간" value="18:00" /><CompactEditableField label="생산수량" value="999,999" /><CompactEditableField label="불량수량" value="20" /></div>
        </section>
        <section className="flex h-[87px] shrink-0 flex-col gap-2 rounded-[8px] border border-[#e4e7ee] p-3">
          <h3 className="text-[15px] font-bold leading-[22.5px] tracking-[-0.1875px] text-[#011327]">투입 정보</h3>
          <div className="grid grid-cols-2 gap-[10px]"><CompactEditableField label="자동 BOM" value="A type" /><CompactEditableField label="SCAN 품목" value="" /></div>
        </section>
      </main>
      <div className="absolute left-4 top-[603px] flex h-[50px] w-[343px] items-center gap-6">
        <label className="flex shrink-0 items-center gap-1.5 text-[15px] font-semibold leading-[22.5px] tracking-[-0.1875px] text-black"><Checkbox checked={complete} onChange={(event) => setComplete(event.target.checked)} color="black" shape="circle" />완료 처리</label>
        <div className="flex min-w-0 flex-1 gap-[10px]"><MobileButton tone="gray" className="min-w-0 flex-1">취소</MobileButton><MobileButton className="min-w-0 flex-1">저장</MobileButton></div>
      </div>
      <div className="absolute inset-x-0 top-[677px] flex items-center rounded-[8px]">
        {productionShortcuts.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <span className="h-10 w-0 border-l border-[#e4e7ee]" aria-hidden="true" />}
            <Button variant="lineBlacktxt" size="small" className="h-[71px] min-w-0 flex-1 flex-col gap-1.5 rounded-none border-0 bg-white px-1 hover:bg-white">
              <ProductionShortcutIcon icon={item.icon} />
              <span className={cn("flex flex-col items-center text-[14px] font-bold leading-[21px] tracking-[-0.175px]", item.tone === "gray" ? "text-[#8491a7]" : "text-[#011327]")}>{item.label}<span className={cn("text-[13px] font-normal leading-[19.5px] tracking-[-0.1625px]", item.tone === "gray" ? "text-[#8491a7]" : "text-[#1573fb]")}>{item.state}</span></span>
            </Button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const mobileAllMenuCategories: MobileMenuCategory[] = [
  { id: "receiving", label: "입고관리", items: [{ id: "receiving-entry", label: "입고등록" }, { id: "receiving-inspection", label: "입고검사" }] },
  { id: "shipping", label: "출하관리", items: [{ id: "shipping-entry", label: "출하등록" }, { id: "shipping-inspection", label: "출하검사" }] },
  { id: "production", label: "생산관리", items: [{ id: "extrusion", label: "압출실적" }, { id: "forming", label: "성형실적" }, { id: "assembly", label: "조립실적" }, { id: "printing", label: "인쇄실적" }, { id: "inline", label: "인라인실적" }, { id: "self-inspection", label: "자주검사" }] },
  { id: "quality", label: "품질검사", items: [{ id: "incoming-quality", label: "입고검사" }, { id: "shipping-quality", label: "출하검사" }, { id: "process-quality", label: "공정검사" }, { id: "self-quality", label: "자주검사" }] },
  { id: "operation-log", label: "운전일지", items: [{ id: "operation-log-entry", label: "운전일지 작성" }, { id: "operation-time", label: "가동시간" }] },
  { id: "label", label: "라벨생성", items: [{ id: "label-create", label: "라벨 생성" }] },
  { id: "maintenance", label: "정비이력", items: [{ id: "maintenance-scan", label: "정비 스캔" }, { id: "maintenance-list", label: "정비이력 조회" }] },
  { id: "equipment", label: "설비점검", items: [{ id: "equipment-list", label: "설비점검 목록" }] },
];

export function MobileAllMenuSourceScreen() {
  return (
    <div className="flex h-[812px] w-[375px] flex-col overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:92070" data-mobile-source-screen="all-menu">
      <MobileStatusBar tone="white" />
      <main className="h-[681px] shrink-0 overflow-hidden">
        <MobileTwoDepthMenu categories={mobileAllMenuCategories} initialCategoryId="production" initialItemId="extrusion" />
      </main>
      <MobileSourceTabBar />
    </div>
  );
}

const appearanceQuestions = [
  { id: "q1", label: "결로/플러그자국/밀착" },
  { id: "q2", label: "밀착" },
  { id: "q3", label: "질문사항 텍스트" },
  { id: "q4", label: "결로/플러그자국/밀착" },
  { id: "q5", label: "플러그자국" },
  { id: "q6", label: "질문사항 텍스트" },
  { id: "q7", label: "결로" },
  { id: "q8", label: "결로/플러그자국/밀착" },
  { id: "q9", label: "블라블라블라" },
  { id: "q10", label: "블라블라블라" },
] as const;

export function MobileAppearanceInspectionSourceScreen() {
  const [values, setValues] = React.useState<Record<string, QaValue | undefined>>({ q1: "o", q2: "triangle", q3: "x" });

  function selectAll() {
    setValues(Object.fromEntries(appearanceQuestions.map((question) => [question.id, "o"])));
  }

  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:92529" data-mobile-source-screen="appearance-inspection">
      <div className="absolute inset-x-0 top-0 z-20 bg-white"><MobileStatusBar tone="white" /><MobileSourceHeader tone="white" /></div>
      <h2 className="absolute left-[76px] top-[99px] h-[27px] w-[224px] truncate text-center text-[18px] font-bold leading-[27px] tracking-[-0.225px] text-[#011327]">캐나다 투칸두부배캣(신형/칼선)</h2>
      <div className="absolute left-[52px] top-[142px] h-[34px] w-[272px]"><MobileStep labels={["기본정보", "외관검사", "중량검사", "특이사항"]} activeIndex={1} /></div>
      <div className="absolute left-4 top-[200px] flex h-10 w-[343px] gap-[10px]">
        <MobileButton tone="line-black" size="small" onClick={selectAll} className="min-w-0 flex-1 px-5"><Circle className="size-4 text-[#1573fb]" strokeWidth={2.5} />일괄 선택</MobileButton>
        <MobileButton tone="line-black" size="small" onClick={() => setValues({})} className="min-w-0 flex-1 px-5"><RotateCcw className="size-4" strokeWidth={2} />초기화</MobileButton>
      </div>
      <main className="absolute left-4 top-[256px] h-[480px] w-[343px] overflow-hidden">
        <MobileInspectionQuestionList questions={[...appearanceQuestions]} values={values} onChange={(questionId, value) => setValues((current) => ({ ...current, [questionId]: value }))} />
      </main>
      <footer className="absolute inset-x-0 top-[646px] z-30 h-[166px] bg-white shadow-[0_-12px_18px_rgba(255,255,255,0.96)]">
        <div className="flex h-[82px] gap-[10px] p-4">
          <MobileButton tone="gray" className="min-w-0 flex-1"><Image src="/mobile-assets/arrow-back-white.svg" alt="" width={16} height={14} className="h-[14px] w-4 invert" />이전 페이지</MobileButton>
          <MobileButton className="min-w-0 flex-1">다음</MobileButton>
        </div>
        <MobileSourceTabBar />
      </footer>
    </div>
  );
}

const initialDayLogValues = {
  author: "김아무개",
  writtenAt: "25.07.29",
  moldChange: "100",
  setting: "",
  adjustment: "",
  cleanup: "",
  repair: "",
  etc: "40",
  meal: "60",
};

export function MobileDayLogSourceScreen() {
  const [shift, setShift] = React.useState("day");
  const [values, setValues] = React.useState(initialDayLogValues);
  const [saved, setSaved] = React.useState(false);
  const update = (key: keyof typeof initialDayLogValues) => (value: string) => {
    setSaved(false);
    setValues((current) => ({ ...current, [key]: value }));
  };

  function reset() {
    setShift("day");
    setValues(initialDayLogValues);
    setSaved(false);
  }

  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-white font-[Pretendard]" data-figma-node-id="10378:91977" data-mobile-source-screen="day-log">
      <div className="absolute inset-x-0 top-[47px] h-[69px] bg-[linear-gradient(180deg,#1573fb_0%,#4b8fff_102.25%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 z-20"><MobileStatusBar /><MobileSourceHeader title="성형기 1호" /></div>
      <div className="absolute left-4 top-[99px] z-20 flex h-[37px] w-[343px] items-center gap-1.5 overflow-hidden rounded-[6px] border border-[#e4e7ee] bg-white px-3 py-2 text-[14px] tracking-[-0.175px] text-[#011327]">
        <CalendarDays className="size-4 shrink-0" strokeWidth={1.33} /><strong className="font-semibold">가동일</strong><strong className="font-semibold">2025-07-29</strong>
      </div>
      <main className="absolute left-4 top-[146px] flex w-[343px] flex-col gap-[10px]">
        <MobileFormSection title="기본 정보" className="h-[129px]">
          <div className="grid grid-cols-2 gap-[10px]"><MobileCompactField label="작성자" value={values.author} onChange={update("author")} /><MobileCompactField label="작성일자" value={values.writtenAt} onChange={update("writtenAt")} /></div>
          <div className="flex h-[34px] items-center"><span className="w-[74px] shrink-0 text-[15px] leading-[22.5px] tracking-[-0.1875px] text-[#5c667b]">일지구분</span><MobileRadioGroup label="일지구분" value={shift} onChange={setShift} options={[{ value: "day", label: "주간" }, { value: "night", label: "야간" }, { value: "disabled", label: "사용안함", disabled: true }]} /></div>
        </MobileFormSection>
        <MobileFormSection title="가동정보" suffix="(min)" className="h-[87px]">
          <div className="grid grid-cols-2 gap-[10px]"><div className="flex h-8 items-center text-[15px]"><span className="w-[74px] text-[#5c667b]">가동시간</span><strong className="font-medium text-[#011327]">520</strong></div><div className="flex h-8 items-center text-[15px]"><span className="w-[74px] text-[#5c667b]">비가동시간</span><strong className="font-medium text-[#011327]">200</strong></div></div>
        </MobileFormSection>
        <MobileFormSection title="비가동 시간 입력" className="h-[251px]">
          <div className="grid grid-cols-2 gap-x-[10px] gap-y-2">
            <MobileCompactField label="금형교체" value={values.moldChange} onChange={update("moldChange")} />
            <MobileCompactField label="셋팅" value={values.setting} onChange={update("setting")} />
            <MobileCompactField label="짠짱이" value={values.adjustment} onChange={update("adjustment")} />
            <MobileCompactField label="정리" value={values.cleanup} onChange={update("cleanup")} />
            <MobileCompactField label="기계수리" value={values.repair} onChange={update("repair")} />
            <MobileCompactField label="기타" value={values.etc} onChange={update("etc")} />
            <MobileCompactField label="식사부동" value={values.meal} onChange={update("meal")} />
          </div>
          <Button variant="lineMain" size="small" className="mt-1 h-8 w-full rounded-[4px] border-0 bg-[#e8f5ff] px-[10px] text-[14px] font-bold hover:bg-[#e8f5ff]">메모기록 <span aria-hidden="true">›</span></Button>
        </MobileFormSection>
      </main>
      <div className="absolute left-4 top-[662px] z-30 flex h-[50px] w-[343px] gap-[10px] bg-white">
        <MobileButton tone="gray" onClick={reset} className="min-w-0 flex-1">취소</MobileButton>
        <MobileButton onClick={() => setSaved(true)} className="min-w-0 flex-1">저장</MobileButton>
      </div>
      {saved && <div role="status" className="absolute bottom-[92px] left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#011327] px-4 py-2 text-[13px] text-white">저장되었습니다.</div>}
      <div className="absolute inset-x-0 bottom-0 z-30"><MobileSourceTabBar /></div>
    </div>
  );
}

export type MobileSourceScreenId = "home" | "receiving-list" | "production-entry" | "all-menu" | "appearance-inspection" | "day-log";

export const MOBILE_SOURCE_SCREEN_ITEMS: Array<{ id: MobileSourceScreenId; label: string; node: string; description: string }> = [
  { id: "home", label: "홈", node: "10378:91938", description: "메인 퀵메뉴 2×4 · 하단 탭" },
  { id: "receiving-list", label: "입고등록 목록", node: "10378:91889", description: "날짜 이동 · 대기/완료 카드 목록" },
  { id: "production-entry", label: "생산실적 등록", node: "10378:91789", description: "기본 정보 · 생산실적 · 투입정보 · 업무 바로가기" },
  { id: "all-menu", label: "전체메뉴", node: "10378:92070", description: "1depth 업무 분류 · 2depth 세부 업무 탐색" },
  { id: "appearance-inspection", label: "성적서 외관검사", node: "10378:92529", description: "검사 단계 · 일괄 판정 · 질문별 O/△/X" },
  { id: "day-log", label: "일지작성", node: "10378:91977", description: "기본정보 · 가동정보 · 비가동 시간 입력" },
];

export function MobileSourceScreen({ id }: { id: MobileSourceScreenId }) {
  if (id === "receiving-list") return <MobileReceivingListSourceScreen />;
  if (id === "production-entry") return <MobileProductionEntrySourceScreen />;
  if (id === "all-menu") return <MobileAllMenuSourceScreen />;
  if (id === "appearance-inspection") return <MobileAppearanceInspectionSourceScreen />;
  if (id === "day-log") return <MobileDayLogSourceScreen />;
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

export function MobileHomeIndicator() {
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
