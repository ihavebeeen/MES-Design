"use client";

import { useState } from "react";
import { Check, CircleAlert, Smartphone, Tablet } from "lucide-react";
import mobileRegistry from "@/design-system/registry/mobile-assets.json";
import { MobilePopupSourceScreenGallery, MobileSourceScreenGallery } from "./mobile-source-screens";
import {
  MobileButton,
  MobileCta,
  MobileHeader,
  MobileInput,
  MobileQaGroup,
  MobileRadioGroup,
  MobileSelect,
  MobileStep,
  MobileTabBar,
  MobileToggle,
  type QaValue,
} from "./mobile-ui";

function EvidenceNotice() {
  return <div className="flex w-full max-w-[960px] items-start gap-3 rounded-lg border border-[#cfe5ff] bg-[#f4f9ff] p-4 text-[13px] leading-[1.6] text-[#31415f]"><CircleAlert className="mt-0.5 size-4 shrink-0 text-[#1573fb]" /><p>모바일 전용 컴포넌트 원형, 화면 유형 보드, 실제 업무 화면을 교차 대조한 결과입니다. 현재 상태는 <strong>구현됨·검증 진행 중</strong>이며, 개별 업무 화면은 해당 Figma node와 브라우저 실측을 통과한 뒤에만 검증됨으로 승격합니다.</p></div>;
}

function DataCard({ title, node, children }: { title: string; node: string; children: React.ReactNode }) {
  return <article className="flex flex-col gap-3 rounded-lg border border-[#e4e7ee] bg-white p-4"><div><h3 className="text-[15px] font-bold text-[#011327]">{title}</h3><p className="text-[11px] text-[#8491a7]">Figma {node}</p></div>{children}</article>;
}

function FrameStatus({ status }: { status: string }) {
  if (status === "verified") return <span className="rounded-full bg-[#eaf6ec] px-2 py-1 text-[11px] text-[#267337]">검증됨</span>;
  if (status === "queued") return <span className="rounded-full bg-[#eff2f8] px-2 py-1 text-[11px] text-[#67738e]">대기</span>;
  return <span className="rounded-full bg-[#e8f5ff] px-2 py-1 text-[11px] text-[#1573fb]">구현·검토 중</span>;
}

function MobileFrameQueue({ kind }: { kind: "main" | "popup" }) {
  const frames = mobileRegistry.sourceFrames[kind];
  return (
    <section className="mt-6 w-full rounded-lg border border-[#e4e7ee] bg-white p-4">
      <div className="mb-3 flex items-end justify-between"><div><h3 className="text-[15px] font-bold text-[#011327]">{kind === "main" ? "원본 화면 이관 큐" : "원본 팝업 이관 큐"}</h3><p className="text-[12px] text-[#8491a7]">Figma node 단위 · 유형 요약이 아닌 실제 375×812 프레임 목록</p></div><strong className="text-[13px] text-[#1573fb]">{frames.length} frames</strong></div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {frames.map((frame) => <div key={frame.node} className="flex min-h-14 items-center justify-between gap-3 rounded-[6px] border border-[#e4e7ee] px-3 py-2"><span className="min-w-0"><strong className="block truncate text-[13px] text-[#011327]">{frame.name}</strong><span className="text-[11px] text-[#8491a7]">{frame.node}</span></span><FrameStatus status={frame.status} /></div>)}
      </div>
    </section>
  );
}

export function MobileFoundationsCatalog() {
  return <div className="flex w-full flex-col items-center gap-8"><EvidenceNotice /><div className="grid w-full max-w-[960px] grid-cols-2 gap-4">{mobileRegistry.foundations.map((item) => <DataCard key={item.id} title={item.name} node={item.sourceNode}><ul className="flex flex-col gap-1.5 text-[13px] text-[#31415f]">{item.values.map((value) => <li key={value} className="flex gap-2"><Check className="mt-0.5 size-3.5 text-[#1573fb]" />{value}</li>)}</ul></DataCard>)}</div><div className="grid w-full max-w-[960px] grid-cols-3 gap-4"><div className="flex h-56 flex-col items-center justify-center rounded-lg border border-[#e4e7ee] bg-white"><Smartphone className="mb-3 size-10 text-[#1573fb]" /><strong>375 × 812</strong><span className="text-[12px] text-[#67738e]">Mobile</span></div><div className="flex h-56 flex-col items-center justify-center rounded-lg border border-[#e4e7ee] bg-white"><Tablet className="mb-3 size-10 text-[#1573fb]" /><strong>768 × 1024</strong><span className="text-[12px] text-[#67738e]">Tablet Portrait</span></div><div className="flex h-56 flex-col items-center justify-center rounded-lg border border-[#e4e7ee] bg-white"><Tablet className="mb-3 size-10 rotate-90 text-[#1573fb]" /><strong>1024 × 768</strong><span className="text-[12px] text-[#67738e]">Tablet Landscape</span></div></div></div>;
}

export function MobileComponentsCatalog() {
  const [toggle, setToggle] = useState(true);
  const [select, setSelect] = useState("옵션1");
  const [qa, setQa] = useState<QaValue>("o");
  const [tab, setTab] = useState("home");
  return <div className="flex w-full flex-col items-center gap-8"><EvidenceNotice /><div className="grid w-full max-w-[960px] grid-cols-2 gap-4"><DataCard title="Button" node="185:38753"><div className="flex flex-wrap gap-2"><MobileButton>저장</MobileButton><MobileButton tone="gray">취소</MobileButton><MobileButton tone="black" size="small">확인</MobileButton><MobileButton tone="danger" size="small">삭제</MobileButton><MobileButton tone="line-primary" size="xsmall">조회</MobileButton><MobileButton disabled size="xsmall">비활성</MobileButton></div></DataCard><DataCard title="Toggle / 검사 판정" node="185:40775 · 185:45655"><div className="flex items-center gap-8"><MobileToggle checked={toggle} onCheckedChange={setToggle} /><MobileQaGroup value={qa} onChange={setQa} /></div></DataCard><DataCard title="Input Textbox" node="185:40788"><div className="flex flex-col gap-2"><MobileInput placeholder="내용 입력" /><MobileInput icon placeholder="검색어 입력" /><MobileInput state="error" defaultValue="필수값 오류" /></div></DataCard><DataCard title="Selectbox" node="185:40791"><MobileSelect value={select} options={["옵션1", "옵션2", "옵션3", "옵션4"]} onChange={setSelect} /></DataCard><DataCard title="Radio Group" node="10378:91993"><MobileRadioGroup label="근무조" value="day" onChange={() => undefined} options={[{ value: "day", label: "주간" }, { value: "night", label: "야간" }, { value: "disabled", label: "사용안함", disabled: true }]} /></DataCard><DataCard title="Header" node="185:40622"><div className="overflow-hidden rounded-lg border border-[#e4e7ee]"><MobileHeader title="입고등록" /><MobileHeader variant="logo" /><MobileHeader variant="modal" title="사용자 설정" /></div></DataCard><DataCard title="Bottom Tab Bar" node="185:40295"><MobileTabBar active={tab} onChange={setTab} /></DataCard><DataCard title="Step" node="185:47004"><MobileStep labels={["기본정보", "외관검사", "중량검사", "특이사항"]} activeIndex={1} /></DataCard><DataCard title="Call To Action" node="192:30753"><div className="overflow-hidden rounded-lg border border-[#e4e7ee]"><MobileCta mode="cancel-save" /></div></DataCard></div></div>;
}

export function MobilePatternsCatalog() {
  return <div className="flex w-full flex-col items-center gap-8"><EvidenceNotice /><div className="grid w-full max-w-[960px] grid-cols-2 gap-4">{mobileRegistry.patterns.map((pattern) => <DataCard key={pattern.id} title={pattern.name} node="operational evidence"><ul className="flex flex-col gap-1.5 text-[13px] text-[#31415f]">{pattern.rules.map((rule) => <li key={rule}>• {rule}</li>)}</ul></DataCard>)}</div></div>;
}

export function MobileScreensCatalog() {
  return <div className="w-full"><EvidenceNotice /><div className="mt-6"><MobileSourceScreenGallery /></div><MobileFrameQueue kind="main" /><article className="mt-6 w-full rounded-lg border border-[#f2c7cb] bg-[#fff8f8] p-4"><h3 className="mb-2 text-[15px] font-bold text-[#7a1f26]">원본에서 발견한 분류 주의사항</h3><ul className="flex flex-col gap-2 text-[13px] leading-[1.6] text-[#57383b]">{mobileRegistry.sourceFindings.map((finding) => <li key={finding.detail}><strong>{finding.kind}</strong> — {finding.detail}</li>)}</ul></article></div>;
}

export function MobilePopupAssetsCatalog() {
  return <div className="w-full"><EvidenceNotice /><div className="mt-6"><MobilePopupSourceScreenGallery /></div><MobileFrameQueue kind="popup" /></div>;
}

export function MobileCatalog({ activeId }: { activeId?: string }) {
  if (activeId === "mobile-components") return <MobileComponentsCatalog />;
  if (activeId === "mobile-patterns") return <MobilePatternsCatalog />;
  if (activeId === "mobile-screens") return <MobileScreensCatalog />;
  if (activeId === "mobile-popup-assets") return <MobilePopupAssetsCatalog />;
  return <MobileFoundationsCatalog />;
}
