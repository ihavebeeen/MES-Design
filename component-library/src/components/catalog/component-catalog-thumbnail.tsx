import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Copy,
  Download,
  Filter,
  LoaderCircle,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { getCatalogRegistryId } from "@/lib/component-catalog-data";

const box = "rounded-mes-control border border-mes-gray-40 bg-white";

function ButtonPreview({ id }: { id: string }) {
  if (id === "button-size") {
    return <div className="flex items-end gap-2"><span className="rounded-mes-control bg-mes-primary-60 px-4 py-2 text-[10px] font-semibold text-white">Basic</span><span className="rounded-mes-control bg-mes-primary-60 px-3 py-1.5 text-[9px] font-semibold text-white">Small</span><span className="rounded-sm bg-mes-primary-60 px-2 py-1 text-[8px] font-semibold text-white">XS</span></div>;
  }
  if (id === "button-icon") {
    return <div className="flex gap-2"><span className="flex items-center gap-1 rounded-mes-control bg-mes-primary-60 px-3 py-2 text-[10px] font-semibold text-white"><Plus className="size-3" />추가</span><span className={`flex items-center gap-1 px-3 py-2 text-[10px] font-semibold text-mes-gray-100 ${box}`}><Download className="size-3" />다운로드</span></div>;
  }
  return <div className="flex gap-2"><span className="rounded-mes-control bg-mes-primary-60 px-4 py-2 text-[10px] font-semibold text-white">조회</span><span className="rounded-mes-control bg-mes-gray-130 px-4 py-2 text-[10px] font-semibold text-white">저장</span><span className="rounded-mes-control bg-mes-danger-60 px-4 py-2 text-[10px] font-semibold text-white">삭제</span></div>;
}

function FieldPreview({ id }: { id: string }) {
  const key = getCatalogRegistryId(id);
  if (key === "input") return <div className={`flex h-8 w-44 items-center px-3 text-[10px] text-mes-gray-60 ${box}`}>값을 입력하세요</div>;
  if (key === "labeled-input") return <div className="grid w-52 grid-cols-[52px_1fr] items-center gap-2 text-[9px]"><span className="font-medium">품목명 <i className="not-italic text-mes-danger-60">*</i></span><span className={`flex h-7 items-center px-2 text-mes-gray-60 ${box}`}>품목명을 입력하세요</span></div>;
  if (key === "textarea") return <div className={`h-16 w-48 p-2 text-[9px] text-mes-gray-60 ${box}`}>비고를 입력해 주세요.</div>;
  if (key === "label") return <div className="flex items-center gap-1 text-[12px] font-semibold text-mes-gray-110">생산수량 <span className="text-mes-danger-60">*</span></div>;
  if (key === "number-input") return <div className={`flex h-8 w-36 items-center justify-between px-3 text-[10px] ${box}`}><span>1,200</span><span className="text-mes-gray-60">− &nbsp; +</span></div>;
  if (key === "password-input") return <div className={`flex h-8 w-44 items-center justify-between px-3 text-[12px] ${box}`}><span>••••••••</span><span className="text-[9px] text-mes-gray-60">보기</span></div>;
  if (key === "slider") return <div className="w-48"><div className="relative h-2 rounded-full bg-mes-gray-30"><span className="block h-full w-3/5 rounded-full bg-mes-primary-60" /><span className="absolute left-3/5 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-mes-primary-60 bg-white" /></div><div className="mt-2 flex justify-between text-[8px] text-mes-gray-60"><span>0</span><span>60</span><span>100</span></div></div>;
  if (key === "file-upload") return <div className={`flex h-14 w-48 items-center justify-center gap-2 border-dashed text-[10px] text-mes-gray-70 ${box}`}><Upload className="size-4" />파일 선택</div>;
  if (key === "fieldset") return <fieldset className="grid w-52 grid-cols-2 gap-2 rounded-mes-control border border-mes-gray-40 p-3"><legend className="px-1 text-[9px] font-semibold">기본 정보</legend><span className="h-6 rounded bg-mes-gray-20" /><span className="h-6 rounded bg-mes-gray-20" /></fieldset>;
  if (key === "inspection-judgement") return <div className="flex gap-2"><span className="flex size-9 items-center justify-center rounded-mes-control bg-mes-primary-60 text-[12px] font-bold text-white">O</span><span className={`flex size-9 items-center justify-center text-[12px] ${box}`}>△</span><span className={`flex size-9 items-center justify-center text-[12px] ${box}`}>X</span></div>;
  if (["date-picker", "date-range-picker", "time-picker"].includes(key)) return <div className={`flex h-8 w-48 items-center justify-between px-3 text-[10px] text-mes-gray-90 ${box}`}><span>{key === "time-picker" ? "09:00" : key === "date-range-picker" ? "2026.09.01 ~ 09.07" : "2026.09.07"}</span><CalendarDays className="size-3.5 text-mes-gray-60" /></div>;
  if (key === "select") return <div className={`flex h-8 w-44 items-center justify-between px-3 text-[10px] text-mes-gray-80 ${box}`}><span>품목 선택</span><ChevronDown className="size-3.5" /></div>;
  if (key === "labeled-select") return <div className="grid w-52 grid-cols-[44px_1fr] items-center gap-2 text-[9px]"><span className="font-medium">창고</span><span className={`flex h-7 items-center justify-between px-2 ${box}`}>창고 선택<ChevronDown className="size-3" /></span></div>;
  if (key === "combobox") return <div className={`flex h-8 w-48 items-center justify-between px-3 text-[10px] text-mes-gray-80 ${box}`}><span>검색하여 선택</span><Search className="size-3.5" /></div>;
  if (key === "multi-select-input") return <div className={`flex h-9 w-52 items-center gap-1 px-2 text-[8px] ${box}`}><span className="rounded bg-mes-primary-10 px-2 py-1 text-mes-primary-70">원재료</span><span className="rounded bg-mes-primary-10 px-2 py-1 text-mes-primary-70">부자재</span><span className="ml-auto">+2</span></div>;
  if (key === "cascader") return <div className={`flex h-8 w-52 items-center justify-between px-3 text-[9px] ${box}`}><span>1공장 / 성형 / 설비 01</span><ChevronRight className="size-3" /></div>;
  if (key === "tree-select") return <div className={`w-48 p-2 text-[9px] leading-5 ${box}`}><p>▾ 1공장</p><p className="pl-3">▾ 성형 공정</p><p className="bg-mes-primary-10 pl-6">설비 01</p></div>;
  return <div data-thumbnail-missing={id} className="text-[9px] text-mes-danger-70">썸네일 미등록: {id}</div>;
}

function QueryPreview({ id }: { id: string }) {
  if (id === "filter") return <span className={`flex h-8 items-center gap-1.5 px-3 text-[10px] font-semibold text-mes-gray-100 ${box}`}><Filter className="size-3.5" />필터 추가</span>;
  if (id === "group-query") return <div className="flex gap-1"><span className="rounded-mes-control bg-mes-gray-30 px-3 py-1.5 text-[9px] font-semibold">Level 1 · 설비</span><span className="rounded-mes-control bg-mes-gray-20 px-3 py-1.5 text-[9px]">Level 2 · 품목</span></div>;
  if (id === "quick-query") return <div className="flex gap-1"><span className="rounded-full bg-mes-primary-20 px-3 py-1 text-[9px] text-mes-primary-70">오늘 입고</span><span className="rounded-full bg-mes-gray-20 px-3 py-1 text-[9px] text-mes-gray-80">미완료</span></div>;
  if (id === "query-date-range") return <div className={`flex h-8 w-48 items-center justify-between px-3 text-[10px] ${box}`}><span>2026.09.01 ~ 09.07</span><CalendarDays className="size-3.5 text-mes-gray-60" /></div>;
  if (id === "search-highlight") return <p className="text-[11px] text-mes-gray-100">LOT-AA-11 <mark className="bg-mes-warning-20 px-0.5">트레이</mark> 입고</p>;
  if (id === "search-input") return <div className={`flex h-8 w-48 items-center justify-between px-3 text-[10px] text-mes-gray-60 ${box}`}><span>검색어 입력...</span><Search className="size-3.5" /></div>;
  return <div data-thumbnail-missing={id} className="text-[9px] text-mes-danger-70">썸네일 미등록: {id}</div>;
}

function TablePreview() {
  return <div className={`h-[82px] w-[210px] overflow-hidden ${box}`}><div className="grid h-6 grid-cols-[28px_1fr_1fr] bg-mes-gray-30 text-center text-[8px] font-semibold"><span className="flex items-center justify-center"><span className="size-3 rounded-sm bg-mes-gray-40" /></span><span className="border-l border-mes-gray-40 py-1.5">품목</span><span className="border-l border-mes-gray-40 py-1.5">수량</span></div>{[0, 1].map((row) => <div key={row} className={`grid h-7 grid-cols-[28px_1fr_1fr] border-t border-mes-gray-30 text-center text-[8px] ${row === 1 ? "bg-mes-primary-10" : ""}`}><span className="flex items-center justify-center"><span className={`flex size-3 items-center justify-center rounded-sm ${row === 1 ? "bg-mes-gray-130 text-white" : "border border-mes-gray-40"}`}>{row === 1 && <Check className="size-2" />}</span></span><span className="border-l border-mes-gray-30 py-2">트레이</span><span className="border-l border-mes-gray-30 py-2">1,200</span></div>)}</div>;
}

function DataDisplayPreview({ id }: { id: string }) {
  const key = getCatalogRegistryId(id);
  if (id === "table-parts") return <div className="grid w-52 grid-cols-[32px_1fr_1fr] overflow-hidden rounded-mes-control border border-mes-gray-40 text-[8px]"><span className="flex h-7 items-center justify-center bg-mes-gray-30"><i className="size-3 rounded-sm border border-mes-gray-50" /></span><strong className="flex items-center justify-center border-l border-mes-gray-40 bg-mes-gray-30">품목</strong><strong className="flex items-center justify-center border-l border-mes-gray-40 bg-mes-gray-30">수량</strong><span className="flex h-7 items-center justify-center"><i className="size-3 rounded-sm bg-mes-gray-130" /></span><span className="flex items-center justify-center border-l border-mes-gray-30">트레이</span><span className="flex items-center justify-center border-l border-mes-gray-30">1,200</span></div>;
  if (id === "table-full") return <TablePreview />;
  if (key === "badge") return <div className="flex gap-2"><span className="rounded-full bg-mes-danger-20 px-3 py-1 text-[9px] font-semibold text-mes-danger-70">위험</span><span className="rounded-full bg-mes-success-10 px-3 py-1 text-[9px] font-semibold text-mes-success-70">완료</span></div>;
  if (key === "tag") return <div className="flex gap-1"><span className="rounded-mes-control border border-mes-primary-30 bg-mes-primary-10 px-2 py-1 text-[9px] text-mes-primary-70">원재료</span><span className="rounded-mes-control border border-mes-gray-30 px-2 py-1 text-[9px]">성형</span></div>;
  if (key === "overflow-list") return <div className="flex gap-1"><span className="rounded-mes-control bg-mes-gray-20 px-2 py-1 text-[9px]">압출</span><span className="rounded-mes-control bg-mes-gray-20 px-2 py-1 text-[9px]">성형</span><span className="rounded-full bg-mes-gray-40 px-2 py-1 text-[9px]">+3</span></div>;
  if (key === "progress" || key === "progress-circle") return key === "progress-circle" ? <div className="flex size-14 items-center justify-center rounded-full border-[6px] border-mes-primary-60 border-l-mes-gray-30 text-[10px] font-bold">78%</div> : <div className="w-48"><div className="mb-2 flex justify-between text-[9px]"><span>진행률</span><span>68%</span></div><div className="h-2 overflow-hidden rounded-full bg-mes-gray-30"><span className="block h-full w-2/3 bg-mes-primary-60" /></div></div>;
  if (key === "image-thumbnail") return <div className="flex gap-2"><span className="size-14 rounded-mes-control border border-mes-gray-30 bg-gradient-to-br from-mes-gray-20 to-mes-primary-20" /><span className="size-14 rounded-mes-control border border-mes-gray-30 bg-gradient-to-br from-mes-primary-10 to-mes-gray-30" /></div>;
  if (key === "avatar") return <div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-full bg-mes-primary-20"><UserRound className="size-6 text-mes-primary-70" /></span><span className="text-[10px] font-semibold">이해빈</span></div>;
  if (key === "timeline") return <div className="relative w-48 pl-5 text-[8px]"><span className="absolute bottom-1 left-2 top-1 w-px bg-mes-gray-40" /><div className="relative mb-3"><i className="absolute -left-[15px] top-0.5 size-2 rounded-full bg-mes-primary-60" /><strong>입고 완료</strong><p className="text-mes-gray-60">09:42 · 김담당</p></div><div className="relative"><i className="absolute -left-[15px] top-0.5 size-2 rounded-full bg-mes-gray-50" /><strong>검수 대기</strong><p className="text-mes-gray-60">09:10 · 자동 기록</p></div></div>;
  if (key === "alarm-list-item") return <div className={`flex w-52 items-start gap-2 p-3 ${box}`}><span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-mes-danger-10"><Bell className="size-3 text-mes-danger-60" /></span><span className="flex-1 text-[9px]"><strong className="block">설비 점검 알림</strong><span className="text-mes-gray-60">압출기 02 · 5분 전</span></span><i className="mt-1 size-1.5 rounded-full bg-mes-primary-60" /></div>;
  if (key === "list") return <div className={`w-48 overflow-hidden ${box}`}>{["원재료 입고", "품질 검사", "창고 이동"].map((item, index) => <div key={item} className={`flex h-7 items-center gap-2 px-3 text-[9px] ${index ? "border-t border-mes-gray-30" : ""}`}><i className="size-1.5 rounded-full bg-mes-gray-60" />{item}</div>)}</div>;
  if (key === "descriptions") return <div className={`grid w-52 grid-cols-[68px_1fr] overflow-hidden text-[8px] ${box}`}><span className="bg-mes-gray-20 p-2 font-semibold">품목</span><span className="p-2">PP 트레이</span><span className="border-t border-mes-gray-30 bg-mes-gray-20 p-2 font-semibold">거래처</span><span className="border-t border-mes-gray-30 p-2">동진산업</span></div>;
  if (key === "before-after-comparison") return <div className="grid w-52 grid-cols-[1fr_auto_1fr] items-center gap-2 text-[8px]"><span className={`p-2 ${box}`}><strong className="block text-mes-gray-60">변경 전</strong><b className="text-[13px]">1,200</b></span><ChevronRight className="size-4 text-mes-gray-50" /><span className={`border-mes-primary-40 bg-mes-primary-10 p-2 ${box}`}><strong className="block text-mes-primary-70">변경 후</strong><b className="text-[13px]">1,450</b></span></div>;
  if (key === "analytics-charts") return <div className={`relative h-20 w-52 p-3 ${box}`}><span className="absolute inset-x-3 bottom-3 flex items-end gap-2"><i className="h-5 flex-1 bg-mes-primary-20" /><i className="h-9 flex-1 bg-mes-primary-40" /><i className="h-12 flex-1 bg-mes-primary-60" /><i className="h-7 flex-1 bg-mes-primary-30" /></span><svg className="absolute inset-x-3 top-3 h-10 w-[184px]" viewBox="0 0 184 40"><polyline points="0,32 45,20 92,27 138,8 184,15" fill="none" stroke="currentColor" strokeWidth="2" className="text-mes-gray-110" /></svg></div>;
  if (key === "cavity-cell") return <div className="grid grid-cols-4 gap-1 text-[9px] font-semibold">{[1, 2, 3, 4, 5, 6, 7, 8].map((value) => <span key={value} className={`flex size-8 items-center justify-center rounded-mes-control border ${value === 3 ? "border-mes-danger-50 bg-mes-danger-10 text-mes-danger-70" : "border-mes-gray-40 bg-white"}`}>{value}</span>)}</div>;
  if (key === "table") return <TablePreview />;
  return <div data-thumbnail-missing={id} className="text-[9px] text-mes-danger-70">썸네일 미등록: {id}</div>;
}

function OverlayPreview({ id }: { id: string }) {
  const key = getCatalogRegistryId(id);
  if (key === "side-slide-panel") return <div className="relative h-24 w-52 overflow-hidden rounded-mes-control bg-mes-gray-80/50"><span className="absolute inset-y-0 right-0 w-28 bg-white"><span className="flex h-6 items-center justify-between border-b border-mes-gray-30 px-2 text-[8px] font-semibold">품목 등록<X className="size-2.5" /></span><span className="m-2 block h-4 bg-mes-gray-30" /><span className="mx-2 block h-9 border border-mes-gray-30" /></span></div>;
  if (key === "confirm-dialog" || key === "radio-choice-dialog") return <div className="relative h-24 w-52 rounded-mes-control bg-mes-gray-80/50"><span className={`absolute left-1/2 top-1/2 w-36 -translate-x-1/2 -translate-y-1/2 p-2 ${box}`}><span className="block text-[9px] font-semibold">{key === "confirm-dialog" ? "저장하시겠습니까?" : "처리 방법 선택"}</span><span className="mt-3 flex justify-end gap-1"><i className="h-4 w-9 rounded-sm bg-mes-gray-30" /><i className="h-4 w-9 rounded-sm bg-mes-gray-130" /></span></span></div>;
  if (key === "dialog-footer") return <div className="flex h-14 w-52 items-end justify-end gap-2 border-t border-mes-gray-30 bg-white p-2"><span className="h-6 w-14 rounded-mes-control bg-mes-gray-30" /><span className="h-6 w-14 rounded-mes-control bg-mes-gray-130" /></div>;
  if (key === "notification-panel") return <div className={`w-48 p-2 ${box}`}><div className="mb-2 flex items-center gap-1 text-[9px] font-semibold"><Bell className="size-3" />알림</div><div className="h-5 border-t border-mes-gray-30 pt-1 text-[8px]">설비 점검이 필요합니다.</div><div className="h-5 border-t border-mes-gray-30 pt-1 text-[8px]">입고 처리가 완료되었습니다.</div></div>;
  if (key === "popover") return <div className="relative h-20 w-44"><span className={`absolute left-8 top-0 flex h-7 items-center px-3 text-[9px] ${box}`}>상세 정보</span><span className={`absolute left-2 top-9 w-36 p-2 text-[9px] ${box}`}>LOT와 재고 정보를 확인합니다.</span></div>;
  if (key === "dropdown-menu") return <div className="relative h-20 w-44"><span className={`absolute right-2 top-0 flex size-7 items-center justify-center ${box}`}><MoreHorizontal className="size-4" /></span><span className={`absolute right-0 top-8 w-28 p-2 text-[9px] leading-5 ${box}`}>상세 보기<br />복사<br />다운로드</span></div>;
  if (key === "center-modal") return <div className="relative h-24 w-52 rounded-mes-control bg-mes-gray-80/50"><span className={`absolute left-1/2 top-1/2 h-20 w-40 -translate-x-1/2 -translate-y-1/2 ${box}`}><span className="flex h-6 items-center justify-between border-b border-mes-gray-30 px-2 text-[8px] font-semibold">목록 선택<X className="size-2.5" /></span><span className="m-2 block h-9 bg-mes-gray-20" /></span></div>;
  return <div data-thumbnail-missing={id} className="text-[9px] text-mes-danger-70">썸네일 미등록: {id}</div>;
}

function NavigationPreview({ id }: { id: string }) {
  const key = getCatalogRegistryId(id);
  if (key === "page-top-tab-item") return <div className="flex items-end gap-1 border-b border-mes-gray-30"><span className="border-b-2 border-mes-primary-60 px-3 py-2 text-[9px] font-semibold text-mes-primary-70">입고 등록</span><span className="px-3 py-2 text-[9px] text-mes-gray-60">입고 현황</span></div>;
  if (key === "sidebar") return <div className="flex h-24 w-44 overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white"><span className="w-16 bg-mes-gray-130 p-2 text-[8px] text-white">MES<div className="mt-4 rounded bg-mes-primary-60 p-1">입고관리</div></span><span className="flex-1 p-3"><span className="block h-2 w-16 rounded bg-mes-gray-30" /><span className="mt-3 block h-2 w-20 rounded bg-mes-gray-20" /></span></div>;
  if (key === "breadcrumb") return <div className="flex items-center gap-1 text-[9px] text-mes-gray-60"><span>생산관리</span><ChevronRight className="size-3" /><span className="font-semibold text-mes-gray-110">생산실적</span></div>;
  if (key === "pagination") return <div className="flex gap-1 text-[9px]"><span className={`px-2 py-1 ${box}`}>‹</span><span className="rounded-mes-control bg-mes-gray-130 px-2 py-1 text-white">1</span><span className={`px-2 py-1 ${box}`}>2</span><span className={`px-2 py-1 ${box}`}>›</span></div>;
  if (key === "tree-view") return <div className={`w-48 p-2 text-[9px] leading-5 ${box}`}><p>▾ 생산관리</p><p className="pl-3">▾ 생산실적</p><p className="bg-mes-primary-10 pl-6 text-mes-primary-70">실적 등록</p><p className="pl-6">실적 현황</p></div>;
  if (key === "user-account-menu") return <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-mes-primary-20"><UserRound className="size-4 text-mes-primary-70" /></span><span className="text-[10px] font-semibold text-mes-gray-110">이해빈</span><ChevronDown className="size-3 text-mes-gray-60" /></div>;
  if (key === "segmented-control") return <div className="flex rounded-mes-control bg-mes-gray-20 p-1 text-[9px]"><span className="rounded-sm bg-white px-3 py-1 font-semibold shadow-sm">전체</span><span className="px-3 py-1">가동</span><span className="px-3 py-1">비가동</span></div>;
  return <div data-thumbnail-missing={id} className="text-[9px] text-mes-danger-70">썸네일 미등록: {id}</div>;
}

function FeedbackPreview({ id }: { id: string }) {
  const key = getCatalogRegistryId(id);
  if (key === "tooltip") return <div className="relative pt-9"><span className="rounded-mes-control bg-mes-gray-130 px-3 py-2 text-[9px] text-white">설비 상태를 확인합니다.</span><i className="absolute left-1/2 top-[30px] size-2 -translate-x-1/2 rotate-45 bg-mes-gray-130" /><span className={`mx-auto mt-3 flex h-7 w-16 items-center justify-center text-[9px] ${box}`}>도움말</span></div>;
  if (key === "loading-spinner") return <div className="flex flex-col items-center gap-2 text-[9px] text-mes-gray-60"><LoaderCircle className="size-8 animate-spin text-mes-primary-60" />불러오는 중</div>;
  if (key === "skeleton") return <div className={`w-48 space-y-2 p-3 ${box}`}><span className="block h-3 w-20 animate-pulse rounded bg-mes-gray-30" /><span className="block h-2 w-full animate-pulse rounded bg-mes-gray-20" /><span className="block h-2 w-4/5 animate-pulse rounded bg-mes-gray-20" /></div>;
  if (key === "toast") return <div className={`flex w-52 items-center gap-2 p-3 shadow-md ${box}`}><CheckCircle2 className="size-5 text-mes-success-60" /><span className="flex-1 text-[9px] font-semibold">저장되었습니다.</span><X className="size-3 text-mes-gray-60" /></div>;
  if (key === "notice-banner") return <div className="flex w-52 items-center gap-2 rounded-mes-control border border-mes-primary-30 bg-mes-primary-10 p-3 text-[9px] text-mes-primary-80"><Bell className="size-4" /><span>미완료 입고 건이 3건 있습니다.</span></div>;
  if (key === "empty-state") return <div className="flex flex-col items-center gap-2 text-[9px] text-mes-gray-60"><Package className="size-8 text-mes-gray-40" /><strong className="text-mes-gray-90">등록된 항목이 없습니다.</strong></div>;
  if (key === "error-state") return <div className="flex flex-col items-center gap-2 text-[9px] text-mes-gray-60"><AlertTriangle className="size-8 text-mes-danger-60" /><strong className="text-mes-danger-70">정보를 불러오지 못했습니다.</strong></div>;
  if (key === "loading-overlay") return <div className="relative h-20 w-48 overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white"><span className="absolute inset-0 bg-mes-gray-110/45" /><LoaderCircle className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" /></div>;
  if (key === "selection-action-bar") return <div className="flex h-12 w-56 items-center justify-between rounded-mes-control bg-mes-gray-130 px-3 text-[9px] text-white"><span><b>3개</b> 선택됨</span><span className="flex gap-1"><i className="rounded bg-white/15 px-2 py-1 not-italic">이동</i><i className="rounded bg-mes-danger-60 px-2 py-1 not-italic">삭제</i></span></div>;
  return <div data-thumbnail-missing={id} className="text-[9px] text-mes-danger-70">썸네일 미등록: {id}</div>;
}

function LayoutPreview({ id }: { id: string }) {
  const key = getCatalogRegistryId(id);
  if (key === "content-region-heading") return <div className={`h-20 w-52 p-4 ${box}`}><span className="text-[13px] font-bold text-mes-gray-130">품목 재고 리스트</span></div>;
  if (key === "section-header") return <div className={`h-20 w-52 p-3 ${box}`}><span className="flex h-7 w-full items-center bg-mes-gray-30 px-2.5 text-[11px] font-semibold text-mes-gray-130">기본 정보</span></div>;
  if (key === "divider") return <div className="w-52"><span className="block text-[9px] text-mes-gray-70">기본 정보</span><span className="my-2 block h-px bg-mes-gray-40" /><span className="block text-[9px] text-mes-gray-70">상세 정보</span></div>;
  if (key === "card") return <div className={`w-48 p-3 shadow-sm ${box}`}><strong className="block text-[10px]">입고 현황</strong><span className="mt-1 block text-[8px] text-mes-gray-60">오늘 등록된 입고</span><b className="mt-3 block text-[18px] text-mes-primary-70">24건</b></div>;
  if (key === "accordion") return <div className={`w-48 overflow-hidden text-[9px] ${box}`}><span className="flex h-7 items-center justify-between px-3 font-semibold">기본 정보<ChevronDown className="size-3" /></span><span className="block border-t border-mes-gray-30 bg-mes-gray-10 p-3">품목과 거래처 정보</span><span className="flex h-7 items-center justify-between border-t border-mes-gray-30 px-3">상세 정보<ChevronRight className="size-3" /></span></div>;
  if (key === "collapsible") return <div className="w-48 text-[9px]"><span className="flex h-7 items-center justify-between border-b border-mes-gray-40 font-semibold">선택 조건<ChevronDown className="size-3" /></span><span className="mt-2 grid grid-cols-2 gap-2"><i className="h-6 rounded bg-mes-gray-20" /><i className="h-6 rounded bg-mes-gray-20" /></span></div>;
  if (key === "panel") return <div className={`h-20 w-48 overflow-hidden ${box}`}><span className="flex h-7 items-center border-b border-mes-gray-30 bg-mes-gray-20 px-3 text-[9px] font-semibold">상세 정보</span><span className="m-3 block h-2 w-28 rounded bg-mes-gray-30" /></div>;
  if (key === "form-grid") return <div className="grid w-52 grid-cols-[56px_1fr] gap-x-2 gap-y-2 text-[9px]"><span>품목</span><span className={`h-6 ${box}`} /><span>수량</span><span className={`h-6 ${box}`} /></div>;
  if (key === "section-frame") return <div className={`h-20 w-52 overflow-hidden ${box}`}><span className="flex h-7 items-center bg-mes-gray-30 px-3 text-[9px] font-semibold">기본 정보</span><span className="m-3 grid grid-cols-2 gap-2"><i className="h-5 rounded bg-mes-gray-20" /><i className="h-5 rounded bg-mes-gray-20" /></span></div>;
  if (key === "scroll-area") return <div className={`relative h-24 w-48 overflow-hidden p-2 ${box}`}><span className="block h-5 border-b border-mes-gray-30" /><span className="block h-5 border-b border-mes-gray-30" /><span className="block h-5 border-b border-mes-gray-30" /><span className="absolute bottom-2 right-1 top-2 w-1 rounded-full bg-mes-gray-30"><i className="block h-8 rounded-full bg-mes-gray-60" /></span></div>;
  if (key === "sticky-header-footer") return <div className={`h-24 w-48 overflow-hidden ${box}`}><span className="block h-5 border-b border-mes-gray-30 bg-mes-gray-30" /><span className="m-2 block h-10 bg-gradient-to-b from-white to-mes-gray-20" /><span className="flex h-6 items-center justify-end border-t border-mes-gray-30 bg-white px-2"><i className="h-4 w-10 rounded bg-mes-gray-130" /></span></div>;
  return <div data-thumbnail-missing={id} className="text-[9px] text-mes-danger-70">썸네일 미등록: {id}</div>;
}

export function ComponentCatalogThumbnail({ id, groupId }: { id: string; groupId: string }) {
  const key = getCatalogRegistryId(id);
  if (["button-size", "button-icon", "button-color"].includes(id)) return <ButtonPreview id={id} />;
  if (key === "icon-button") return <div className="flex gap-2"><span className={`flex size-8 items-center justify-center ${box}`}><X className="size-4" /></span><span className={`flex size-8 items-center justify-center ${box}`}><Copy className="size-4" /></span></div>;
  if (key === "link") return <div className="flex items-center gap-1 text-[11px] font-semibold text-mes-primary-70 underline">품목 3건<ChevronRight className="size-3" /></div>;
  if (key === "button-group") return <div className="flex overflow-hidden rounded-mes-control border border-mes-gray-40 text-[9px]"><span className="bg-mes-gray-130 px-3 py-2 text-white">표준</span><span className="border-l border-mes-gray-40 px-3 py-2">사용자</span><span className="border-l border-mes-gray-40 px-3 py-2">전체</span></div>;
  if (key === "toggle-button") return <div className="flex gap-2 text-[9px]"><span className="rounded-mes-control bg-mes-primary-60 px-3 py-2 text-white">활성</span><span className={`px-3 py-2 ${box}`}>비활성</span></div>;
  if (key === "main-list-footer-actions") return <div className="flex h-14 w-56 items-end justify-between border-t border-mes-gray-30 bg-white p-2"><span className="flex gap-1"><i className={`flex h-6 items-center gap-1 px-2 text-[8px] not-italic ${box}`}><Copy className="size-2.5" />복사</i><i className={`flex h-6 items-center gap-1 px-2 text-[8px] not-italic ${box}`}><Download className="size-2.5" />다운로드</i></span><span className="h-6 w-12 rounded-mes-control bg-mes-gray-130" /></div>;
  if (key === "checkbox") return <div className="flex items-center gap-4 text-[10px]"><span className="flex size-5 items-center justify-center rounded border border-mes-gray-40 bg-white" /><span className="flex size-5 items-center justify-center rounded bg-mes-gray-130 text-white"><Check className="size-3" /></span><span>복수 선택</span></div>;
  if (key === "radio") return <div className="flex items-center gap-4 text-[10px]"><span className="flex size-5 items-center justify-center rounded-full border border-mes-primary-60"><Circle className="size-2 fill-mes-primary-60 text-mes-primary-60" /></span><span className="size-5 rounded-full border border-mes-gray-50" /><span>단일 선택</span></div>;
  if (key === "switch") return <div className="flex items-center gap-4 text-[10px]"><span className="flex h-6 w-11 items-center rounded-full bg-mes-primary-60 px-1"><i className="ml-auto size-4 rounded-full bg-white" /></span><span>즉시 적용</span></div>;
  if (groupId === "form") return <FieldPreview id={id} />;
  if (groupId === "query") return <QueryPreview id={id} />;
  if (groupId === "data-display") return <DataDisplayPreview id={id} />;
  if (groupId === "overlay") return <OverlayPreview id={id} />;
  if (groupId === "navigation") return <NavigationPreview id={id} />;
  if (groupId === "layout") return <LayoutPreview id={id} />;
  if (groupId === "feedback") return <FeedbackPreview id={id} />;
  return <div data-thumbnail-missing={id} className="text-[9px] text-mes-danger-70">썸네일 미등록: {id}</div>;
}
