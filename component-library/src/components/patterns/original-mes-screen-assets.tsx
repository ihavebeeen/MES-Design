"use client";

import * as React from "react";
import { IconCalendar, IconReload, IconSetting } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { Link } from "@/components/ui/link";
import { Radio } from "@/components/ui/radio";
import { cn } from "@/lib/utils";
import {
  FixtureDateRange,
  FixtureFilter,
  FixtureGroupQuery,
  FixtureInput,
  FixtureSearch,
  FixtureSelect,
  FixtureTable,
  MesFixtureSidebar,
  MesPageTabs,
  RadioOption,
  SectionBand,
} from "./mes-screen-fixtures";
import { FigmaScreenPreview } from "./figma-screen-preview";

type AssetId = "forms" | "responsive" | "cavity" | "inventory-add" | "inventory-edit" | "purchase";

function CalendarDays({ className }: { className?: string }) { return <IconCalendar size={16} className={className} />; }
function Settings2({ className }: { className?: string }) { return <IconSetting size={16} className={className} />; }
function RotateCcw({ className }: { className?: string }) { return <IconReload size={16} className={className} />; }
function ArrowLeftRight({ className }: { className?: string }) { return <span className={className}>↔</span>; }
function ArrowUpDown({ className }: { className?: string }) { return <span className={className}>↕</span>; }

const ASSETS: Array<{ id: AssetId; label: string; node: string; summary: string }> = [
  { id: "forms", label: "양식관리", node: "17377:50192", summary: "목록 · 양식 편집 · 기준 설정 · 검사 상태" },
  { id: "responsive", label: "생산실적 반응형", node: "18849:62314", summary: "1280 · 786 · 375 breakpoint" },
  { id: "cavity", label: "금형 캐비티", node: "18795:62149", summary: "자동/사용자 배열 · 반전 · 교환" },
  { id: "inventory-add", label: "재고 추가", node: "18813:64179", summary: "행 선택 · 상단 고정 · 일괄 변경" },
  { id: "inventory-edit", label: "재고편집", node: "17491:82304", summary: "선택 툴바 · 이동 · 삭제 설정" },
  { id: "purchase", label: "발주 정보", node: "17503:85601", summary: "발주 목록 · 품목 상세" },
];

function AssetHeader({ active, onChange }: { active: AssetId; onChange: (id: AssetId) => void }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 lg:grid-cols-3">
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

function FormListScreen({ onOpenForm, onOpenCriteria, onOpenInspection }: { onOpenForm: () => void; onOpenCriteria: () => void; onOpenInspection: () => void }) {
  const [checked, setChecked] = React.useState<number[]>([0]);
  const rows = [
    ["냉각기 점검표", "SLOT 1", "설비점검표", "설비기준", "5", "4", <Button key="c1" size="xsmall" onClick={onOpenCriteria}>검사기준</Button>, "이혜빈", "Y", <Button key="e1" size="xsmall" variant="lineBlacktxt" onClick={onOpenForm}>편집</Button>],
    ["냉각기 점검표", "SLOT 1", "설비점검표", "설비기준", "5", "4", <Button key="c2" size="xsmall" onClick={onOpenCriteria}>검사기준</Button>, "이혜빈", "Y", <Button key="e2" size="xsmall" variant="lineBlacktxt" onClick={onOpenForm}>편집</Button>],
  ];
  return (
    <FigmaScreenPreview>
      <div className="flex h-[960px] w-[1920px] bg-white">
        <MesFixtureSidebar collapsed />
        <div className="flex min-w-0 flex-1 flex-col">
          <MesPageTabs active="검사 양식 등록" extraTabs={["거래처 등록", "품목 등록"]} />
          <div className="flex h-[42px] items-center justify-between border-b border-mes-gray-30 px-5">
            <h3 className="text-[18px] font-bold">검사 양식 리스트</h3>
            <div className="flex items-center gap-2"><FixtureDateRange label="조회기준일자" /><Button size="small">조회</Button><Button size="small" variant="lineBlacktxt" startIcon={<IconSetting size={16} />}>설정</Button></div>
          </div>
          <div className="flex h-12 items-center gap-2 border-b border-mes-gray-30 px-5">
            <FixtureGroupQuery /><FixtureFilter /><div className="ml-auto"><FixtureSearch className="w-[220px]" /></div>
          </div>
          <FixtureTable
            headers={["양식명", "양식 슬롯", "양식유형", "기준대상", "커스텀 항목", "기본 항목", "검사기준 설정", "등록자", "사용여부", "편집"]}
            rows={rows}
            checkedRows={checked}
            onCheckedRowsChange={setChecked}
            selectionColor="black"
            unselectedCheckboxAppearance="grayCheck"
            centerSelection
            aligns={["left", "center", "center", "center", "right", "right", "center", "center", "center", "center"]}
          />
          <div className="mt-auto flex h-[46px] items-center justify-between border-t border-mes-gray-30 px-5">
            <div className="flex gap-2"><Button size="small" variant="lineBlacktxt">복사</Button><Button size="small" variant="lineBlacktxt">다운로드</Button></div>
            <div className="flex gap-2"><Button size="small" variant="fillBlack">삭제</Button><Button size="small" onClick={onOpenInspection}>검사 화면</Button><Button size="small" onClick={onOpenForm}>양식 등록</Button></div>
          </div>
        </div>
      </div>
    </FigmaScreenPreview>
  );
}

function FormEditorContent() {
  const [target, setTarget] = React.useState("설비기준");
  return (
    <div className="flex min-h-[680px] w-full flex-col">
      <div className="grid grid-cols-2 gap-x-10 gap-y-4 rounded-mes-control bg-mes-gray-20 p-5">
        <LabelControl label="양식유형" required><FixtureSelect value="점검표" options={["입고검사", "출고검사", "공정검사", "자주검사", "설비점검표"]} /></LabelControl>
        <LabelControl label="SLOT" required><FixtureSelect value="SLOT 1" options={["SLOT 2", "SLOT 3"]} /></LabelControl>
        <LabelControl label="양식명" required><FixtureInput value="냉각기점검표" /></LabelControl>
        <div className="grid grid-cols-[90px_1fr] items-center gap-2"><span className="text-[14px]">관리대상 <Required /></span><div className="flex items-center gap-4"><RadioOption name="form-target" checked={target === "설비기준"} label="설비기준" onChange={() => setTarget("설비기준")} /><RadioOption name="form-target" checked={target === "품목기준"} label="품목기준" onChange={() => setTarget("품목기준")} /><Button size="small">대상 10건 +</Button></div></div>
      </div>
      <div className="grid flex-1 grid-cols-2 divide-x divide-mes-gray-30">
        <div className="p-5"><div className="flex items-center justify-between"><SectionBand className="flex-1">기본 정보</SectionBand><Button size="small" variant="fillBlack" className="ml-2">+ 항목 추가</Button></div>{["점검일", "점검자", "설비명", "설비구분"].map((label, index) => <LabelControl key={label} label={label} required={index < 2} className="mt-4"><FixtureInput value="" muted /></LabelControl>)}<div className="mt-5 border-t border-mes-gray-30 pt-4"><div className="flex items-center gap-4"><span className="w-[90px] text-[14px]">사용 여부 <Required /></span><RadioOption name="form-use" checked label="사용" /><RadioOption name="form-use" checked={false} label="미사용" /></div></div></div>
        <div className="flex flex-col p-5"><div className="flex items-center justify-between"><SectionBand className="flex-1">커스텀 항목</SectionBand><Button size="small" variant="fillBlack" className="ml-2">+ 항목 추가</Button></div><div className="mt-3 grid grid-cols-[1fr_104px_104px_64px] gap-2 border-b border-mes-gray-30 pb-2 text-center text-[13px] font-bold"><span>검사항목</span><span>입력유형</span><span>단위</span><span>기준</span></div>{[["셋팅 온도", "숫자입력", "℃", "Y"],["실 온도", "숫자입력", "℃", "Y"],["전자접촉기 상태", "O/△/×/-", "-", "Y"],["EOCR 작동여부", "O/△/×/-", "-", "Y"],["비고", "텍스트 입력", "-", "N"]].map((row) => <div key={row[0]} className="grid h-12 grid-cols-[1fr_104px_104px_64px] items-center gap-2 text-[14px]"><span>{row[0]}</span><FixtureInput value={row[1]} muted /><FixtureInput value={row[2]} muted /><span className="text-center">{row[3]}</span></div>)}<div className="mt-auto flex items-center justify-end bg-mes-gray-20 px-3 py-2 text-[13px]">검사 기준값이 설정되지 않은 항목이 <span className="mx-1 font-bold text-mes-danger-60">4건</span> 있습니다 <Button size="xsmall" className="ml-2">기준값 설정</Button></div></div>
      </div>
    </div>
  );
}

function CriteriaContent() {
  const [type, setType] = React.useState("단순조건");
  const [value, setValue] = React.useState("50");
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-[64px_1fr] items-center gap-2"><span className="text-[14px] font-bold">조건유형</span><div className="grid grid-cols-3">{["단순조건", "범위조건", "복합조건"].map((item) => <Button key={item} size="small" variant={type === item ? "opacityMain" : "lineBlacktxt"} className="rounded-none first:rounded-l last:rounded-r" onClick={() => setType(item)}>{item}</Button>)}</div></div>
      <div className="rounded-mes-control bg-mes-gray-20 px-3 py-2 text-center text-[13px] text-mes-gray-80">측정값이 하나의 기준값과 비교됩니다.</div>
      <div className="rounded-lg border border-mes-gray-30 p-4"><strong className="text-[14px]">판정 기준 입력</strong><div className="mt-4 grid grid-cols-[70px_1fr_1fr] items-center gap-2 text-[14px]"><span>측정값이</span><FixtureInput value={value} onValueChange={setValue} inputMode="numeric" /><FixtureSelect value="이상" options={["이하", "초과", "미만"]} /></div></div>
      <div className="rounded-mes-control border border-mes-primary-30 bg-mes-primary-10 p-3 text-center"><div className="text-[13px] font-bold text-mes-primary-60">최종 합격 기준</div><div className="mt-1 text-[20px] font-bold">X ≥ {value}</div></div>
    </div>
  );
}

function InspectionContent() {
  const [result, setResult] = React.useState("합격");
  return (
    <div className="grid min-h-[720px] w-full grid-cols-2 divide-x divide-mes-gray-30">
      <div className="pr-5"><SectionBand>대상정보</SectionBand>{[["상태","검사대기"],["입고일자","2025-04-01"],["거래처명","유호스트"],["품목","더블비안코"],["입고량","3,000"],["Lot-No","A0401-123-123"],["공급사 Lot",""]].map(([label,value]) => <LabelControl key={label} label={label} className="mt-4"><FixtureInput value={value} muted={Boolean(value)} placeholder="내용 입력" /></LabelControl>)}<LabelControl label="검사일" className="mt-4"><FixtureInput value="2025-04-01" /></LabelControl><LabelControl label="검사자" className="mt-4"><FixtureSelect value="김아무개" /></LabelControl><div className="mt-4 grid grid-cols-[100px_1fr] items-center"><span className="text-[14px]">검사결과 <Required /></span><div className="flex gap-3">{["합격","일부","불합","보류"].map((item) => <label key={item} className="flex items-center gap-1 text-[13px]"><Radio name="inspection-result" checked={result === item} onChange={() => setResult(item)} size="small" />{item}</label>)}</div></div></div>
      <div className="pl-5"><SectionBand>검사항목</SectionBand><div className="mt-3 flex gap-2"><FixtureSearch className="flex-1" /><Button size="small">가나다순</Button><Button size="small" variant="lineBlacktxt">등록순</Button></div><div className="mt-3 flex justify-end gap-2"><Button size="small" variant="lineBlacktxt">○ 일괄 선택</Button><Button size="small" variant="lineBlacktxt">× 일괄 선택</Button></div><div className="mt-3 flex items-center gap-2"><span className="mr-auto text-[14px]">Pallet 상태 <Required /></span>{["○","△","×","보류","-"] .map((item, index) => <Button key={item} size="small" variant={index === 0 ? "fillMain" : "lineBlacktxt"}>{item}</Button>)}</div></div>
    </div>
  );
}

function FormsAsset() {
  const [modal, setModal] = React.useState<"form" | "criteria" | "inspection" | null>(null);
  return <><FormListScreen onOpenForm={() => setModal("form")} onOpenCriteria={() => setModal("criteria")} onOpenInspection={() => setModal("inspection")} /><CenterModal open={modal === "form"} onOpenChange={(open) => !open && setModal(null)} title="양식관리" size="standard-960" confirmLabel="저장" contentClassName="p-0 items-stretch"><FormEditorContent /></CenterModal><CenterModal open={modal === "criteria"} onOpenChange={(open) => !open && setModal(null)} title="셋팅 온도" size="compact-480" confirmLabel="저장"><CriteriaContent /></CenterModal><CenterModal open={modal === "inspection"} onOpenChange={(open) => !open && setModal(null)} title="입고검사" size="standard-960" confirmLabel="저장" contentClassName="items-stretch"><InspectionContent /></CenterModal></>;
}

function ProductionResultResponsiveAsset() {
  const [viewport, setViewport] = React.useState<1280 | 786 | 375>(1280);
  const [checked, setChecked] = React.useState<number[]>([3]);
  const compact = viewport < 1000;
  const mobile = viewport === 375;
  const headers = ["지시일", "근무조", "설비", "담당기사", "품목명", "품목구분", "포장인원", "시작시간", "종료시간", "단위", "생산수량", "불량수량", "투입"];
  const rows = [
    ["2025-10-30","주간","성형기 1호","김수현",<Link key="a">더블비안코뚜껑</Link>,"완제품","5","15:00","18:00","kg","2,000","10",<Link key="l1">투입정보</Link>],
    ["2025-10-29","주간","성형기 1호","김수현",<Link key="b">더블비안코뚜껑</Link>,"완제품","5","15:00","18:00","kg","2,000","10",<Link key="l2">투입정보</Link>],
    ["2025-10-29","야간","성형기 1호","김수현",<Link key="c">더블비안코뚜껑</Link>,"완제품","5","15:00","18:00","kg","2,000","10",<Link key="l3">투입정보</Link>],
    ["2025-10-30","주간","성형기 2호","김수현",<Link key="d">비비빅</Link>,"반제품","3","13:00","17:00","kg","2,000","0",<Link key="l4">투입정보</Link>],
    ["2025-10-28","주간","성형기 2호","김수현",<Link key="e">비비빅</Link>,"반제품","3","13:00","17:00","kg","2,000","0",<Link key="l5">투입정보</Link>],
  ];
  return (
    <div>
      <div className="mb-3 flex gap-2">{([1280,786,375] as const).map((size) => <Button key={size} size="small" variant={viewport === size ? "fillBlack" : "lineBlacktxt"} onClick={() => setViewport(size)}>{size}px</Button>)}</div>
      <div className="overflow-auto rounded-lg border border-mes-gray-30 bg-mes-gray-20 p-3"><div className="mx-auto flex h-[720px] flex-col overflow-hidden bg-white shadow-mes-panel" style={{ width: viewport }}><div className="flex h-[38px] shrink-0 items-center justify-between bg-black px-4 text-white"><span className="font-bold">★ 생산실적</span><span>●　♟</span></div><div className="flex h-14 shrink-0 items-center gap-3 border-b border-mes-gray-30 px-5"><strong className="mr-auto text-[18px]">☰　생산실적 리스트</strong>{mobile ? <><Button size="small" variant="lineBlacktxt" aria-label="날짜"><CalendarDays className="size-4" /></Button><Button size="small" variant="lineBlacktxt" aria-label="설정"><Settings2 className="size-4" /></Button></> : <><FixtureDateRange /><Button size="small">조회</Button><Button size="small" variant="lineBlacktxt" startIcon={<Settings2 className="size-4" />}>설정</Button></>}</div><div className="flex h-12 shrink-0 items-center gap-2 px-5">{compact ? <><Button size="small" variant="lineBlacktxt">그룹화⌄</Button><Button size="small" variant="lineBlacktxt">필터⌄</Button></> : <><FixtureGroupQuery /><FixtureFilter /></>}<div className="ml-auto"><FixtureSearch className={mobile ? "w-[100px]" : "w-[180px]"} placeholder={mobile ? "검색" : "검색어 입력.."} /></div></div><div className="min-w-[1280px]"><FixtureTable headers={headers} rows={rows} checkedRows={checked} onCheckedRowsChange={setChecked} selectionColor="black" unselectedCheckboxAppearance="grayCheck" selectionColumnWidth={44} horizontalScroll /></div><div className="mt-auto"><div className="h-7 border-y border-mes-gray-30 bg-mes-gray-10 px-4 text-[13px] font-bold leading-7">총계</div><div className={cn("flex min-h-[48px] items-center gap-2 px-5", mobile && "flex-wrap py-2")}><Button size="small" variant="lineBlacktxt">복사</Button><Button size="small" variant="lineBlacktxt">다운로드</Button><div className="ml-auto flex gap-2"><Button size="small" variant="fillBlack">삭제</Button><Button size="small" variant="fillBlack">출하지시 등록</Button><Button size="small" variant="fillBlack">엑셀 일괄등록</Button><Button size="small">판매계획 등록</Button></div></div></div></div></div>
    </div>
  );
}

function CavityContent() {
  const [automatic, setAutomatic] = React.useState(true);
  const [selected, setSelected] = React.useState(9);
  const [exchange, setExchange] = React.useState("19");
  const cells = Array.from({ length: 80 }, (_, index) => index < 25 ? index + 1 : null);
  const swap = () => { const value = Number(exchange); if (value >= 1 && value <= 25) setSelected(value); };
  return <div className="grid min-h-[565px] w-full grid-cols-[280px_1fr] divide-x divide-mes-gray-30"><div className="pr-5"><SectionBand>금형 정보</SectionBand>{[["설비명","빠삐코 금형"],["배열(가로)","5"],["배열(세로)","5"],["CAVITY","5*5"]].map(([l,v]) => <LabelControl key={l} label={l} className="mt-3"><FixtureInput value={v} muted={l === "설비명" || l === "CAVITY"} /></LabelControl>)}<SectionBand className="mt-5">배열 생성</SectionBand><div className="mt-3 grid grid-cols-[70px_1fr] items-center gap-2 text-[14px]"><span>배열 설정</span><div className="flex gap-3"><RadioOption name="cavity-mode" checked={automatic} label="자동배열" onChange={() => setAutomatic(true)} /><RadioOption name="cavity-mode" checked={!automatic} label="사용자 설정" onChange={() => setAutomatic(false)} /></div></div><div className="mt-3 text-[14px]">번호 생성 방향</div><div className="mt-2 grid grid-cols-2 gap-2"><Button size="small" variant="lineBlacktxt">→ 가로</Button><Button size="small" onClick={() => setAutomatic(false)}>↓ 세로</Button></div><div className="mt-3 text-[14px]">줄 전환 방향</div><div className="mt-2 grid grid-cols-2 gap-2"><Button size="small" variant="lineBlacktxt">≡ 순차</Button><Button size="small" onClick={() => setAutomatic(false)}>⇄ 교차</Button></div></div><div className="pl-5"><SectionBand>캐비티 배열</SectionBand><div className="mt-3 flex justify-between"><div className="flex gap-2"><Button size="small" variant="lineBlacktxt" startIcon={<ArrowLeftRight className="size-4" />} onClick={() => setAutomatic(false)}>좌우 반전</Button><Button size="small" variant="lineBlacktxt" startIcon={<ArrowUpDown className="size-4" />} onClick={() => setAutomatic(false)}>상하 반전</Button></div><Button size="small" variant="lineMain" startIcon={<RotateCcw className="size-4" />} onClick={() => { setSelected(9); setExchange("19"); setAutomatic(true); }}>초기화</Button></div><div className="mt-3 rounded-lg border border-mes-gray-30 p-5"><div className="mb-2 text-[12px] text-mes-gray-60">↙ 진행방향</div><div className="grid grid-cols-10 gap-1">{cells.map((cell,index) => <Button key={index} size="small" disabled={!cell} variant={cell === selected ? "fillMain" : cell ? "opacityMain" : "lineBlacktxt"} className="h-10 px-0" onClick={() => cell && setSelected(cell)}>{cell ?? ""}</Button>)}</div></div><div className="mt-5 grid grid-cols-[90px_148px_110px_148px_60px] items-center gap-3 text-[14px]"><span>선택한 셀</span><FixtureInput value={String(selected)} muted /><span>교환할 번호 입력</span><FixtureInput value={exchange} onValueChange={setExchange} inputMode="numeric" muted={automatic} /><Button size="small" disabled={automatic} onClick={swap}>교환</Button></div></div></div>;
}

function CavityAsset() { const [open,setOpen]=React.useState(false); return <Launcher title="캐비티 배열 설정" description="같은 팝업 안에서 자동배열과 사용자 설정 상태가 바뀝니다." onOpen={() => setOpen(true)}><CenterModal open={open} onOpenChange={setOpen} title="캐비티 배열 설정" size="standard-960" confirmLabel="저장" contentClassName="items-stretch"><CavityContent /></CenterModal></Launcher>; }

const INVENTORY_ITEMS = [
  ["P0011","비닐봉투","원자재","ea","0"], ["P0012","비닐 125*125","원자재","ea","0"], ["P0013","비닐 75*75","원자재","ea","0"], ["P0014","비닐 (청) 125*125","원자재","ea","0"], ["P0015","비닐봉투 150*150","원자재","ea","0"], ["P0001","1500얼러먹는트레이","완제품","kg","1,000"], ["P0002","1500얼러먹는트레이-SHEET","완제품","kg","1,000"], ["P0003","1500얼러먹는트레이","완제품","kg","1,000"],
];

function InventoryAddContent() {
  const [selectedCodes,setSelectedCodes]=React.useState(["P0011","P0012","P0013","P0014","P0015"]);
  const ordered=React.useMemo(() => [...INVENTORY_ITEMS].sort((a,b) => Number(selectedCodes.includes(b[0]))-Number(selectedCodes.includes(a[0]))),[selectedCodes]);
  const rows=ordered.map((item,index) => { const selected=selectedCodes.includes(item[0]); return [item[0],item[1],item[2],item[3],item[4], selected ? <FixtureInput key={`d${item[0]}`} value="2026-06-01" size="small" /> : "", selected ? <FixtureInput key={`q${item[0]}`} value={`${index+1},000,000`} size="small" inputMode="numeric" /> : "", selected ? <FixtureSelect key={`w${item[0]}`} value="입고기본창고" size="small" /> : "", selected ? <FixtureInput key={`n${item[0]}`} value={index < 2 ? "재고 추가함" : ""} placeholder="내용 입력" size="small" /> : ""]; });
  return <div className="w-full"><div className="flex h-10 items-center rounded-mes-control bg-mes-gray-20 px-4"><strong className="text-[13px]">↪ 일괄 변경</strong><div className="ml-auto flex gap-2"><FixtureInput value="추가 입고일　2025-10-30" className="w-[170px]" /><FixtureSelect value="추가 창고　선택" className="w-[150px]" /><Button size="small">적용</Button></div></div><div className="my-2 flex h-10 items-center rounded-mes-control bg-mes-gray-20 px-3"><FixtureFilter /><div className="ml-auto"><FixtureSearch className="w-[200px]" /></div></div><FixtureTable headers={["품목코드","품목","품목구분","단위","현재 수량","추가 입고일","추가 수량","창고","비고"]} widths={[110,140,120,60,110,120,130,150,110]} rows={rows} checkedRows={ordered.flatMap((item,index) => selectedCodes.includes(item[0]) ? [index] : [])} onCheckedRowsChange={(indices) => setSelectedCodes(indices.map((index) => ordered[index][0]))} selectionColor="black" unselectedCheckboxAppearance="grayCheck" selectionColumnWidth={36} centerSelection aligns={["left","left","left","center","right","center","right","center","left"]} /></div>;
}

function InventoryAddAsset() { const [open,setOpen]=React.useState(false); return <Launcher title="재고 추가" description="행을 체크하면 선택 행이 위로 고정되고 입력 컨트롤이 활성화됩니다." onOpen={() => setOpen(true)}><CenterModal open={open} onOpenChange={setOpen} title="재고 추가" size="wide-1400" className="max-w-[1294px]" confirmLabel="저장" contentClassName="items-stretch"><InventoryAddContent /></CenterModal></Launcher>; }

function InventoryEditContent({ onDelete, onMove }: { onDelete: () => void; onMove: () => void }) {
  const [checked,setChecked]=React.useState([0,1,2,3,4]);
  const rows=Array.from({length:14},() => ["빠삐코","완제품","1,000 kg","100","10 BOX","A0401-123-123","B창고","생산","성형기1"]);
  return <div className="relative min-h-[430px] w-full"><strong className="text-[14px]">재고 리스트</strong><div className="my-3 flex h-10 items-center rounded-mes-control bg-mes-gray-20 px-3"><FixtureFilter /><div className="ml-auto"><FixtureSearch className="w-[200px]" /></div></div><FixtureTable headers={["품목","품목구분","수량","입상수","포장수량","LOT NO","창고명","생산/입고","설비/거래처"]} rows={rows} checkedRows={checked} onCheckedRowsChange={setChecked} selectionColor="black" unselectedCheckboxAppearance="grayCheck" selectionColumnWidth={36} centerSelection aligns={["left","left","right","right","right","left","left","left","left"]} />{checked.length > 0 && <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white px-4 py-2 shadow-mes-panel"><span className="whitespace-nowrap text-[13px] font-bold">{checked.length}개 선택됨</span><span className="h-5 w-px bg-mes-gray-30" /><Button size="small" variant="lineMain" className="text-mes-danger-60" onClick={onDelete}>삭제</Button><Button size="small" variant="opacityMain" onClick={onMove}>이동</Button><span className="h-5 w-px bg-mes-gray-30" /><Button size="small" variant="lineBlacktxt" onClick={() => setChecked([])}>선택초기화</Button></div>}</div>;
}

function InventoryActionContent({ type }: { type: "delete" | "move" }) {
  const isDelete=type === "delete";
  return <div className="w-full"><div className="flex h-12 items-center rounded-mes-control bg-mes-gray-20 px-5"><strong className="text-[13px]">↪ 일괄 변경</strong><div className="ml-auto flex gap-2"><FixtureInput value="대상 수량　0" className="w-[170px]" inputMode="numeric" />{isDelete ? <><FixtureSelect value="유형　선택" className="w-[170px]" /><FixtureSelect value="불량 사유　선택" className="w-[180px]" /></> : <FixtureSelect value="이동 창고　선택" className="w-[240px]" />}<Button size="small">적용</Button></div></div><div className="mt-5"><FixtureTable selectable={false} headers={isDelete ? ["품목","품목구분","LOT NO","창고명","수량","단위","삭제 수량","유형","불량 사유"] : ["품목","품목구분","LOT NO","창고명","수량","단위","이동 수량","이동 창고"]} rows={Array.from({length:7},(_,index) => isDelete ? ["1500얼러먹는트레이","완제품","A0401-123-123","B창고","1,000","kg",<FixtureInput key={`dq${index}`} value="1,000" size="small" inputMode="numeric" />,<FixtureSelect key={`dt${index}`} value={index > 3 ? "불량" : ["매각","불용","반품","재고조정"][index]} size="small" />,<FixtureSelect key={`dr${index}`} value={index > 3 ? `불량 사유 ${index-3}` : "-"} size="small" />] : ["1500얼러먹는트레이","완제품","A0401-123-123","B창고","1,000","kg",<FixtureInput key={`mq${index}`} value="1,000" size="small" inputMode="numeric" />,<FixtureSelect key={`mw${index}`} value="불량창고" size="small" />])} /></div></div>;
}

function InventoryEditAsset() {
  const [open,setOpen]=React.useState(false); const [action,setAction]=React.useState<"delete"|"move"|null>(null);
  return <Launcher title="재고편집" description="선택 행 수는 하단 플로팅 툴바와 이동/삭제 설정에 그대로 전달됩니다." onOpen={() => setOpen(true)}><CenterModal open={open} onOpenChange={setOpen} title="재고편집" size="wide-1024" actions={[{id:"close",label:"닫기",variant:"fillBlack",onClick:() => setOpen(false)}]} contentClassName="items-stretch"><InventoryEditContent onDelete={() => setAction("delete")} onMove={() => setAction("move")} /></CenterModal><CenterModal open={action !== null} onOpenChange={(next) => !next && setAction(null)} title={action === "delete" ? "삭제 설정" : "이동 설정"} size="wide-1024" confirmLabel="저장" contentClassName="items-stretch">{action && <InventoryActionContent type={action} />}</CenterModal></Launcher>;
}

const purchaseRows = [
  ["2024-08-30","A업체","9","100%","완료"], ["2024-08-30","B업체","8","60.4%","진행중"], ["2024-08-30","A업체","9","100%","완료"], ["2024-08-30","A업체","9","0%","대기"], ["2024-08-30","B업체","8","60.4%","진행중"],
];

function PurchaseAsset() {
  const [open,setOpen]=React.useState(false); const [detail,setDetail]=React.useState(false); const [checked,setChecked]=React.useState([0]);
  const rows=purchaseRows.map((row,index) => { const warning=row[4] !== "완료"; return [<span key={`d${index}`} className={warning ? "text-mes-danger-60" : ""}>{row[0]}</span>,<span key={`v${index}`} className={warning ? "text-mes-danger-60" : ""}>{row[1]}</span>,<Link key={`l${index}`} href="#" onClick={(event) => {event.preventDefault();setDetail(true);}}>{row[2]}</Link>,<div key={`p${index}`} className="flex items-center gap-2"><span className="h-1.5 w-16 overflow-hidden rounded bg-mes-gray-30"><span className="block h-full bg-mes-gray-100" style={{width:row[3]}} /></span><span className={warning ? "text-mes-danger-60" : ""}>{row[3]}</span></div>,<span key={`s${index}`} className={cn("inline-flex min-w-14 justify-center rounded px-2 py-1 text-[12px]",row[4] === "진행중" ? "bg-mes-primary-60 text-white" : row[4] === "대기" ? "bg-amber-500 text-white" : "text-mes-gray-80")}>{row[4]}</span>]; });
  const detailRows=Array.from({length:7},(_,index) => { const warning=index > 4; return [<span key={`i${index}`} className={warning ? "text-mes-danger-60" : ""}>1500얼러먹는트레이</span>,<span key={`t${index}`} className={warning ? "text-mes-danger-60" : ""}>완제품</span>,<div key={`r${index}`} className="flex items-center gap-2"><span className="h-1.5 w-16 rounded bg-mes-gray-30"><span className="block h-full bg-mes-gray-100" style={{width:index === 6 ? "0%" : index === 5 ? "50%" : "100%"}} /></span>{index===6?"0%":index===5?"50%":"100%"}</div>,index === 6 ? "대기" : index === 5 ? "진행중" : "완료"]; });
  return <Launcher title="발주 정보" description="품목 건수는 뱃지가 아니라 링크이며, 클릭하면 품목 리스트가 열립니다." onOpen={() => setOpen(true)}><CenterModal open={open} onOpenChange={setOpen} title="발주 정보" size="standard-960" confirmLabel="선택" contentClassName="items-stretch"><div className="min-h-[500px] w-full"><div className="flex items-center"><strong>발주리스트</strong><div className="ml-auto flex gap-2"><FixtureDateRange label="일자" /><Button size="small">조회</Button></div></div><div className="my-3 flex h-12 items-center rounded-mes-control bg-mes-gray-20 px-3"><FixtureFilter /><div className="ml-auto"><FixtureSearch className="w-[200px]" /></div></div><FixtureTable headers={["입고예정일","발주처","품목 [건]","입고율","상태"]} rows={rows} checkedRows={checked} onCheckedRowsChange={setChecked} selectionColor="black" unselectedCheckboxAppearance="grayCheck" centerSelection /></div></CenterModal><CenterModal open={detail} onOpenChange={setDetail} title="품목 리스트" size="medium-600" actions={[{id:"close",label:"닫기",variant:"fillBlack",onClick:() => setDetail(false)}]} contentClassName="items-stretch"><FixtureTable selectable={false} headers={["품목","품목구분","입고율","상태"]} rows={detailRows} /></CenterModal></Launcher>;
}

function LabelControl({ label, required = false, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) { return <div className={cn("grid grid-cols-[100px_1fr] items-center gap-2 text-[14px]",className)}><span>{label}{required && <Required />}</span>{children}</div>; }
function Required() { return <span className="ml-1 font-bold text-mes-danger-60">*</span>; }
function Launcher({ title, description, onOpen, children }: { title: string; description: string; onOpen: () => void; children: React.ReactNode }) { return <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-mes-gray-30 bg-mes-gray-10"><div className="max-w-md text-center"><h3 className="text-[20px] font-bold">{title}</h3><p className="mt-2 text-[14px] text-mes-gray-70">{description}</p><Button className="mt-5" onClick={onOpen}>원본 상태 열기</Button></div>{children}</div>; }

function OriginalMesScreenAssets() {
  const [active,setActive]=React.useState<AssetId>("forms");
  return <div><AssetHeader active={active} onChange={setActive} />{active === "forms" && <FormsAsset />}{active === "responsive" && <ProductionResultResponsiveAsset />}{active === "cavity" && <CavityAsset />}{active === "inventory-add" && <InventoryAddAsset />}{active === "inventory-edit" && <InventoryEditAsset />}{active === "purchase" && <PurchaseAsset />}</div>;
}

export { OriginalMesScreenAssets, ProductionResultResponsiveAsset };
