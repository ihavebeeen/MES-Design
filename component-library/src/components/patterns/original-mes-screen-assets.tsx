"use client";

import * as React from "react";
import { IconExclamationCircle, IconPlus, IconQaO, IconQaX, IconReload } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { Radio } from "@/components/ui/radio";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { SearchInput } from "@/components/ui/search-input";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SectionHeader } from "@/components/ui/section-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CavityCell } from "@/components/ui/cavity-cell";
import { cn } from "@/lib/utils";
import { FigmaScreenPreview } from "./figma-screen-preview";
import { ExactFormManagementScreen } from "./exact-form-management-screen";
import { ExactProductionResultScreen } from "./exact-production-result-screen";
import { InspectionCriteriaDialog } from "./inspection-criteria-pattern";

type AssetId = "forms" | "responsive";

function RotateCcw({ className }: { className?: string }) { return <IconReload size={16} className={className} />; }
function ArrowLeftRight({ className }: { className?: string }) { return <span className={className}>↔</span>; }
function ArrowUpDown({ className }: { className?: string }) { return <span className={className}>↕</span>; }

const ASSETS: Array<{ id: AssetId; label: string; node: string; summary: string }> = [
  { id: "forms", label: "양식관리", node: "17377:50192", summary: "목록 · 양식 편집 · 기준 설정 · 검사 상태" },
  { id: "responsive", label: "생산실적 반응형", node: "18849:62314", summary: "1280 원본 완료 · 786/375 대조 중" },
];

function AssetHeader({ active, onChange }: { active: AssetId; onChange: (id: AssetId) => void }) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-2">
      {ASSETS.map((asset) => (
        <Button
          key={asset.id}
          size="small"
          variant={active === asset.id ? "fillBlack" : "lineBlacktxt"}
          className="h-auto min-h-12 justify-start px-3 py-2 text-left"
          onClick={() => onChange(asset.id)}
        >
          <span className="flex min-w-0 flex-col items-start">
            <span>{asset.label}</span>
            <span className={cn("text-[11px] font-normal", active === asset.id ? "text-white/70" : "text-mes-gray-60")}>{asset.summary}</span>
          </span>
        </Button>
      ))}
    </div>
  );
}

function FormEditorContent() {
  const [target, setTarget] = React.useState("설비기준");
  const [enabled, setEnabled] = React.useState("사용");
  const [formType, setFormType] = React.useState("점검표");
  const [slot, setSlot] = React.useState("SLOT 1");
  const customRows = [
    ["셋팅 온도", "숫자입력", "℃", "Y"],
    ["실 온도", "숫자입력", "℃", "Y"],
    ["전자접촉기 상태", "O/△/×/-", "-", "Y"],
    ["EOCR 작동여부", "O/△/×/-", "-", "Y"],
    ["비고", "텍스트 입력", "-", "N"],
  ];
  return (
    <div className="flex min-h-[836px] w-full flex-col">
      <div className="h-[120px] shrink-0 bg-mes-gray-20 p-5">
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <EditorField label="양식유형" required>
            <Select value={formType} onValueChange={setFormType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["점검표", "입고검사", "출고검사", "공정검사", "자주검사", "설비점검표"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
          </EditorField>
          <EditorField label="SLOT" required labelWidth={100}>
            <Select value={slot} onValueChange={setSlot}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["SLOT 1", "SLOT 2", "SLOT 3"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
          </EditorField>
          <EditorField label="양식명" required><Input value="냉각기점검표" readOnly /></EditorField>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-[14px]">관리대상 <Required /></span>
            <div className="flex items-center gap-4 whitespace-nowrap">
              {(["설비기준", "품목기준"] as const).map((item) => <label key={item} className="flex items-center gap-[6px] text-[14px]"><Radio name="form-target" checked={target === item} onChange={() => setTarget(item)} />{item}</label>)}
              <Button size="small" className="ml-auto">대상 10건 <IconPlus size={14} /></Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-mes-gray-30">
        <section className="p-5">
          <SectionHeader action={<Button size="small" variant="fillBlack" startIcon={<IconPlus size={16} />}>항목 추가</Button>}>기본 정보</SectionHeader>
          <div className="mt-2 space-y-4">
            {["점검일", "점검자", "설비명", "설비구분"].map((label, index) => <EditorField key={label} label={label} required={index < 2}><Input value="" readOnly /></EditorField>)}
          </div>
          <div className="mt-4 border-t border-mes-gray-30 pt-4">
            <div className="grid grid-cols-[108px_1fr] items-center"><span className="text-[14px]">사용 여부 <Required /></span><div className="flex gap-4">{(["사용", "미사용"] as const).map((item) => <label key={item} className="flex items-center gap-[6px] text-[14px]"><Radio name="form-use" checked={enabled === item} onChange={() => setEnabled(item)} />{item}</label>)}</div></div>
          </div>
        </section>
        <section className="flex min-h-0 flex-col p-5 pb-0">
          <SectionHeader action={<Button size="small" variant="fillBlack" startIcon={<IconPlus size={16} />}>항목 추가</Button>}>커스텀 항목</SectionHeader>
          <div className="mt-2 grid h-[30px] grid-cols-[120px_104px_104px_56px] items-center border-b border-mes-gray-30 text-center text-[13px] font-semibold"><span>검사항목</span><span>입력유형</span><span>단위</span><span>기준</span></div>
          {customRows.map((row) => <div key={row[0]} className="grid h-12 grid-cols-[120px_104px_104px_56px] items-center text-[14px]"><span>{row[0]}</span><Input value={row[1]} readOnly className="w-[104px]" /><Input value={row[2]} readOnly className="w-[104px]" /><span className="text-center">{row[3]}</span></div>)}
          <div className="mt-auto -mx-5 flex h-[56px] shrink-0 items-center justify-end bg-mes-gray-20 px-5 text-[13px] whitespace-nowrap"><span className="mr-2 text-mes-gray-70">●</span>검사 기준값이 설정되지 않은 항목이 <span className="mx-1 font-bold text-mes-danger-60">4건</span> 있습니다<Button size="xsmall" className="ml-2">기준값 설정 ↗</Button></div>
        </section>
      </div>
    </div>
  );
}

function EditorField({ label, required = false, labelWidth = 108, children }: { label: string; required?: boolean; labelWidth?: number; children: React.ReactNode }) {
  return <div className="grid h-8 items-center" style={{ gridTemplateColumns: `${labelWidth}px minmax(0,1fr)` }}><span className="text-[14px] whitespace-nowrap">{label}{required && <Required />}</span>{children}</div>;
}

function InspectionContent({ state = "ready" }: { state?: "empty" | "ready" }) {
  const [search, setSearch] = React.useState("");
  const [pallet, setPallet] = React.useState("O");
  const [inspector, setInspector] = React.useState("김아무개");
  return (
    <div className="grid min-h-[836px] w-full grid-cols-[440px_minmax(0,1fr)] divide-x divide-mes-gray-30 overflow-x-hidden">
      <section className="p-5">
        <SectionHeader>대상정보</SectionHeader>
        <div className="mt-3 space-y-4">
          {[["상태","검사대기"],["입고일자","2025-04-01"],["거래처명","유호스트"],["품목","더블비안코"],["입고량","3,000"],["Lot-No","A0401-123-123"]].map(([label,value]) => <EditorField key={label} label={label}><Input value={value} readOnly /></EditorField>)}
          <EditorField label="공급사 Lot"><Input placeholder="내용 입력" /></EditorField>
          <EditorField label="검사일"><DatePicker value={new Date(2025,3,1)} className="w-full" /></EditorField>
          <EditorField label="검사자"><Select value={inspector} onValueChange={setInspector}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="김아무개">김아무개</SelectItem><SelectItem value="이혜빈">이혜빈</SelectItem></SelectContent></Select></EditorField>
          <div className="grid h-8 grid-cols-[108px_1fr] items-center"><span className="text-[14px]">검사결과 <Required /></span><div className="flex gap-3">{["합격","일부","불합","보류"].map((item) => <label key={item} className="flex items-center gap-1 text-[13px] text-mes-gray-70"><Radio name="inspection-result" disabled size="small" />{item}</label>)}<IconExclamationCircle size={16} className="text-mes-gray-60" /></div></div>
        </div>
      </section>
      <section className="p-5">
        <SectionHeader>검사항목</SectionHeader>
        {state === "empty" ? (
          <NoticeBanner className="mt-3 min-h-[100px] justify-center" message={<>검사 항목이 등록되어 있지 않아 검사 결과를 저장할 수 없습니다. 양식관리에서 항목을 추가해 주세요.</>} linkLabel="양식관리 바로가기" />
        ) : (
          <>
            <div className="mt-3 flex gap-2"><div className="min-w-0 flex-1"><SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" width="fill" /></div><Button size="small" className="w-[60px] px-0">가나다순</Button><Button size="small" variant="lineBlacktxt" className="w-[60px] px-0">등록순</Button></div>
            <div className="mt-3 flex justify-end gap-2"><Button size="small" variant="lineBlacktxt" className="w-[129px]" startIcon={<IconQaO size={16} />}>일괄 선택</Button><Button size="small" variant="lineBlacktxt" className="w-[129px]" startIcon={<IconQaX size={16} />}>일괄 선택</Button></div>
            <div className="mt-3 flex h-8 items-center"><span className="mr-auto text-[14px]">Pallet 상태 <Required /></span><div className="flex gap-2">{[["O",<IconQaO key="o" size={16} />],["△",<span key="t">△</span>],["X",<IconQaX key="x" size={16} />],["보류",<span key="h">보류</span>],["-",<span key="m">-</span>]].map(([value,icon]) => <Button key={String(value)} size="small" variant={pallet === value ? "fillMain" : "lineBlacktxt"} className="w-[47px] px-0" onClick={() => setPallet(String(value))}>{icon}</Button>)}</div></div>
          </>
        )}
      </section>
    </div>
  );
}

function FormsAsset() {
  const [modal, setModal] = React.useState<"form" | "criteria" | "criteria-judgement" | "inspection" | "inspection-empty" | null>(null);
  return (
    <>
      <div className="mb-3 flex gap-2">
        <Button size="small" variant="lineBlacktxt" onClick={() => setModal("form")}>양식 편집 원본</Button>
        <Button size="small" variant="lineBlacktxt" onClick={() => setModal("criteria")}>검사기준 · 숫자형</Button>
        <Button size="small" variant="lineBlacktxt" onClick={() => setModal("criteria-judgement")}>검사기준 · 판정형</Button>
        <Button size="small" variant="lineBlacktxt" onClick={() => setModal("inspection")}>입고검사 · 항목 있음</Button>
        <Button size="small" variant="lineBlacktxt" onClick={() => setModal("inspection-empty")}>입고검사 · 항목 없음</Button>
      </div>
      <FigmaScreenPreview><ExactFormManagementScreen onOpenEditor={() => setModal("form")} onOpenCriteria={() => setModal("criteria")} /></FigmaScreenPreview>
      <CenterModal open={modal === "form"} onOpenChange={(open) => !open && setModal(null)} title="양식관리" size="standard-960" className="!max-h-[calc(100vh-40px)] !max-w-[900px] !rounded-none" actions={[{ id: "cancel", label: "취소", variant: "fillGray", onClick: () => setModal(null) }, { id: "save", label: "저장", variant: "fillGray", disabled: true }]} contentClassName="p-0 items-stretch"><FormEditorContent /></CenterModal>
      <InspectionCriteriaDialog open={modal === "criteria"} onOpenChange={(open) => !open && setModal(null)} />
      <InspectionCriteriaDialog open={modal === "criteria-judgement"} onOpenChange={(open) => !open && setModal(null)} title="전자접촉기 상태" mode="judgement" />
      <CenterModal open={modal === "inspection" || modal === "inspection-empty"} onOpenChange={(open) => !open && setModal(null)} title="입고검사" size="standard-960" className="!max-h-[calc(100vh-40px)] !max-w-[849px] !rounded-none" actions={[{ id: "cancel", label: "취소", variant: "fillGray", onClick: () => setModal(null) }, { id: "save", label: "저장", variant: "fillBlack", onClick: () => setModal(null) }]} contentClassName="p-0 items-stretch"><InspectionContent state={modal === "inspection-empty" ? "empty" : "ready"} /></CenterModal>
    </>
  );
}

function ProductionResultResponsiveAsset() {
  const [viewport, setViewport] = React.useState<1280 | 768 | 375>(1280);
  const height = viewport === 375 ? 812 : 960;
  return <div><div className="mb-3 flex gap-2">{([1280,768,375] as const).map((size) => <Button key={size} size="small" variant={viewport === size ? "fillBlack" : "lineBlacktxt"} onClick={() => setViewport(size)}>{size}px</Button>)}</div><FigmaScreenPreview sourceWidth={viewport} sourceHeight={height}><ExactProductionResultScreen viewport={viewport} /></FigmaScreenPreview></div>;
}

function CavityContent() {
  const [automatic, setAutomatic] = React.useState(true);
  const [selected, setSelected] = React.useState(9);
  const [exchange, setExchange] = React.useState("19");
  const [horizontal, setHorizontal] = React.useState(false);
  const [sequential, setSequential] = React.useState(false);
  const cells = Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10);
    const column = index % 10;
    return row < 5 && column < 5 ? row * 5 + column + 1 : undefined;
  });
  const swap = () => { const value = Number(exchange); if (value >= 1 && value <= 25) setSelected(value); };
  return <div className="grid min-h-[636px] w-full grid-cols-[300px_minmax(0,1fr)] divide-x divide-mes-gray-30"><section className="p-5"><SectionHeader>금형 정보</SectionHeader><div className="mt-3 space-y-3">{[["설비명","빠삐코 금형",true],["배열(가로)","5",false],["배열(세로)","5",false],["CAVITY","5*5",true]].map(([label,value,readonly]) => <EditorField key={String(label)} label={String(label)}><Input value={String(value)} readOnly={Boolean(readonly)} /></EditorField>)}</div><SectionHeader className="mt-5">배열 생성</SectionHeader><div className="mt-3 grid h-8 grid-cols-[70px_1fr] items-center text-[14px]"><span>배열 설정</span><div className="flex gap-4"><label className="flex items-center gap-[6px]"><Radio name="cavity-mode" checked={automatic} onChange={() => setAutomatic(true)} />자동배열</label><label className="flex items-center gap-[6px]"><Radio name="cavity-mode" checked={!automatic} onChange={() => setAutomatic(false)} />사용자 설정</label></div></div><p className="mt-3 text-[14px]">번호 생성 방향</p><div className="mt-1 grid grid-cols-2 gap-2"><Button size="small" variant={horizontal ? "fillMain" : "lineBlacktxt"} onClick={() => setHorizontal(true)}>→　가로</Button><Button size="small" variant={!horizontal ? "fillMain" : "lineBlacktxt"} onClick={() => setHorizontal(false)}>↓　세로</Button></div><p className="mt-3 text-[14px]">줄 전환 방향</p><div className="mt-1 grid grid-cols-2 gap-2"><Button size="small" variant={sequential ? "fillMain" : "lineBlacktxt"} onClick={() => setSequential(true)}>☰　순차</Button><Button size="small" variant={!sequential ? "fillMain" : "lineBlacktxt"} onClick={() => setSequential(false)}>⇄　교차</Button></div></section><section className="p-5"><SectionHeader>캐비티 배열</SectionHeader><div className="mt-3 h-[504px] rounded-lg border border-mes-gray-30 p-5"><div className="flex h-8 items-center"><div className="flex gap-2"><Button size="small" variant="lineBlacktxt" startIcon={<ArrowLeftRight className="size-4" />}>좌우 반전</Button><Button size="small" variant="lineBlacktxt" startIcon={<ArrowUpDown className="size-4" />}>상하 반전</Button></div><Button size="small" variant="lineMain" className="ml-auto" startIcon={<RotateCcw className="size-4" />} onClick={() => { setSelected(9); setExchange("19"); setAutomatic(true); setHorizontal(false); setSequential(false); }}>초기화</Button></div><div className="mt-2 text-[12px] text-mes-gray-60">↙ 진행방향</div><div className="mt-1 grid grid-cols-10 gap-1">{cells.map((cell,index) => <CavityCell key={index} value={cell} selected={cell === selected} onClick={() => cell && setSelected(cell)} />)}</div></div><div className="mt-5 grid grid-cols-[96px_148px_120px_148px_60px] items-center gap-3 text-[14px]"><span>선택한 셀</span><Input value={String(selected)} readOnly /><span>교환할 번호 입력</span><Input value={exchange} onChange={(event) => setExchange(event.target.value)} inputMode="numeric" readOnly={automatic} /><Button size="small" disabled={automatic} onClick={swap}>교환</Button></div></section></div>;
}

function Required() { return <span className="ml-1 font-bold text-mes-danger-60">*</span>; }

function OriginalMesScreenAssets() {
  const [active,setActive]=React.useState<AssetId>("forms");
  return <div><AssetHeader active={active} onChange={setActive} />{active === "forms" && <FormsAsset />}{active === "responsive" && <ProductionResultResponsiveAsset />}</div>;
}

export { CavityContent, OriginalMesScreenAssets, ProductionResultResponsiveAsset };
