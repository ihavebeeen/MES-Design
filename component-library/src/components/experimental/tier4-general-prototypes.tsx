"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PrototypeCard } from "./prototype-shell";

const smallAction = "lineBlacktxt" as const;

export function ExperimentalBreakpointScale() {
  const [width, setWidth] = useState("1280");
  return <PrototypeCard title="브레이크포인트 스케일" code="ExperimentalBreakpointScale" kind="컴포넌트"><div className="flex flex-wrap gap-1">{["375", "768", "1280", "1920"].map((item) => <Button key={item} size="xsmall" variant={width === item ? "fillBlack" : smallAction} onClick={() => setWidth(item)}>{item}px</Button>)}</div><div className="mt-3 h-12 rounded-mes-control border border-mes-gray-30 bg-mes-gray-10" style={{ width: `${Math.max(25, Number(width) / 20)}%` }} /><p className="mt-2 text-[12px] text-mes-gray-70">선택 기준: {width}px</p></PrototypeCard>;
}

export function ExperimentalSplitButton() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("저장");
  return <PrototypeCard title="분할 버튼" code="ExperimentalSplitButton" kind="컴포넌트"><div className="relative inline-flex"><Button size="small" variant="fillBlack" onClick={() => setAction("저장")}>{action}</Button><Button size="small" variant="fillBlack" className="ml-px w-8 px-0" aria-label="추가 저장 방식" onClick={() => setOpen((value) => !value)}>⌄</Button>{open && <div className="absolute left-0 top-9 z-10 w-32 rounded-mes-control border border-mes-gray-30 bg-white p-1 shadow-mes-modal"><Button size="xsmall" variant={smallAction} className="w-full justify-start" onClick={() => { setAction("저장 후 닫기"); setOpen(false); }}>저장 후 닫기</Button><Button size="xsmall" variant={smallAction} className="w-full justify-start" onClick={() => { setAction("임시저장"); setOpen(false); }}>임시저장</Button></div>}</div></PrototypeCard>;
}

export function ExperimentalSegmentedControl() {
  const [value, setValue] = useState("전체");
  return <PrototypeCard title="세그먼트 컨트롤" code="ExperimentalSegmentedControl" kind="컴포넌트"><div className="inline-flex rounded-mes-control bg-mes-gray-20 p-1">{["전체", "가동", "비가동"].map((item) => <Button key={item} size="xsmall" variant={value === item ? "fillBlack" : "fillGray"} onClick={() => setValue(item)}>{item}</Button>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">선택: {value}</p></PrototypeCard>;
}

export function ExperimentalChipSelector() {
  const [selected, setSelected] = useState(["압출"]);
  return <PrototypeCard title="칩 선택" code="ExperimentalChipSelector" kind="컴포넌트"><div className="flex flex-wrap gap-1">{["압출", "성형", "분쇄", "포장"].map((item) => <Button key={item} size="xsmall" variant={selected.includes(item) ? "fillBlack" : smallAction} onClick={() => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])}>{item}</Button>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">{selected.length}개 선택</p></PrototypeCard>;
}

export function ExperimentalOtpPinInput() {
  const [digits, setDigits] = useState(["1", "2", "", ""]);
  return <PrototypeCard title="OTP·PIN 입력" code="ExperimentalOtpPinInput" kind="컴포넌트"><div className="flex gap-2">{digits.map((digit, index) => <Input key={index} aria-label={`PIN ${index + 1}번째 자리`} value={digit} maxLength={1} inputMode="numeric" className="w-10 text-center" onChange={(event) => setDigits((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value.replace(/\D/g, "") : value))} />)}</div><p className="mt-2 text-[12px] text-mes-gray-70">입력 {digits.filter(Boolean).length}/4</p></PrototypeCard>;
}

export function ExperimentalRichTextEditor() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [text, setText] = useState("작업 시 주의사항을 입력하세요.");
  return <PrototypeCard title="서식 텍스트 편집기" code="ExperimentalRichTextEditor" kind="패턴"><div className="mb-1 flex gap-1"><Button size="xsmall" variant={bold ? "fillBlack" : smallAction} onClick={() => setBold((value) => !value)}>굵게</Button><Button size="xsmall" variant={italic ? "fillBlack" : smallAction} onClick={() => setItalic((value) => !value)}>기울임</Button></div><Textarea value={text} onChange={(event) => setText(event.target.value)} className={`${bold ? "font-bold" : ""} ${italic ? "italic" : ""}`} /></PrototypeCard>;
}

export function ExperimentalContextMenu() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("선택 없음");
  return <PrototypeCard title="컨텍스트 메뉴" code="ExperimentalContextMenu" kind="패턴"><div className="relative"><Button size="small" variant={smallAction} onClick={() => setOpen((value) => !value)}>LOT-AA-11 작업 메뉴</Button>{open && <div className="mt-1 w-36 rounded-mes-control border border-mes-gray-30 bg-white p-1 shadow-mes-modal">{["상세 보기", "복사", "이력 조회"].map((item) => <Button key={item} size="xsmall" variant={smallAction} className="w-full justify-start" onClick={() => { setResult(item); setOpen(false); }}>{item}</Button>)}</div>}<p className="mt-2 text-[12px] text-mes-gray-70">실행: {result}</p></div></PrototypeCard>;
}

export function ExperimentalBackToTop() {
  const [moved, setMoved] = useState(false);
  return <PrototypeCard title="맨 위로 이동" code="ExperimentalBackToTop" kind="컴포넌트"><div className="flex items-center justify-between rounded-mes-control bg-mes-gray-10 p-3"><span className="text-[12px] text-mes-gray-70">긴 목록 하단 상태</span><Button size="xsmall" variant="fillBlack" onClick={() => setMoved(true)}>↑ 맨 위로</Button></div>{moved && <p className="mt-2 text-[12px] text-mes-primary-60">상단 이동 요청됨</p>}</PrototypeCard>;
}

export function ExperimentalAvatar() {
  const [online, setOnline] = useState(true);
  return <PrototypeCard title="사용자 아바타" code="ExperimentalAvatar" kind="컴포넌트"><div className="flex items-center gap-3"><div className="relative flex size-10 items-center justify-center rounded-full bg-mes-gray-110 text-[13px] font-semibold text-white">이해{online && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-mes-primary-60" />}</div><div><p className="text-[13px] font-semibold">이해빈</p><p className="text-[11px] text-mes-gray-60">생산관리자</p></div><Button size="xsmall" variant={smallAction} onClick={() => setOnline((value) => !value)}>{online ? "오프라인" : "온라인"}</Button></div></PrototypeCard>;
}

export function ExperimentalProgressCircle() {
  const [value, setValue] = useState(68);
  return <PrototypeCard title="원형 진행률" code="ExperimentalProgressCircle" kind="컴포넌트"><div className="flex items-center gap-4"><div className="grid size-20 place-items-center rounded-full" style={{ background: `conic-gradient(var(--mes-primary-60) ${value}%, var(--mes-gray-30) 0)` }}><div className="grid size-14 place-items-center rounded-full bg-white text-[14px] font-bold">{value}%</div></div><div className="flex gap-1"><Button size="xsmall" variant={smallAction} onClick={() => setValue((current) => Math.max(0, current - 10))}>−10</Button><Button size="xsmall" variant={smallAction} onClick={() => setValue((current) => Math.min(100, current + 10))}>+10</Button></div></div></PrototypeCard>;
}

export function ExperimentalDisclosurePanel() {
  const [open, setOpen] = useState(false);
  return <PrototypeCard title="정보 펼침 패널" code="ExperimentalDisclosurePanel" kind="패턴"><Button size="small" variant={smallAction} className="w-full justify-between" onClick={() => setOpen((value) => !value)}>작업 조건 <span>{open ? "−" : "+"}</span></Button>{open && <div className="mt-1 rounded-mes-control bg-mes-gray-10 p-3 text-[12px] text-mes-gray-80">온도 220℃ · 속도 42m/min · 금형 A-03</div>}</PrototypeCard>;
}

export function ExperimentalEmptyIllustration() {
  const [created, setCreated] = useState(false);
  return <PrototypeCard title="빈 상태 일러스트" code="ExperimentalEmptyIllustration" kind="패턴"><div className="rounded-mes-control border border-dashed border-mes-gray-40 p-5 text-center"><div className="mx-auto grid size-12 place-items-center rounded-full bg-mes-gray-20 text-[22px]">□</div><p className="mt-2 text-[13px] font-semibold">등록된 작업이 없습니다</p><Button size="xsmall" variant="fillBlack" className="mt-3" onClick={() => setCreated(true)}>첫 작업 만들기</Button>{created && <p className="mt-2 text-[11px] text-mes-primary-60">생성 흐름을 시작했습니다.</p>}</div></PrototypeCard>;
}

export function ExperimentalChatMessage() {
  const [messages, setMessages] = useState(["설비 점검이 완료되었습니다."]);
  const [draft, setDraft] = useState("");
  return <PrototypeCard title="메시지 버블" code="ExperimentalChatMessage" kind="패턴"><div className="space-y-2">{messages.map((message, index) => <div key={`${message}-${index}`} className="max-w-[85%] rounded-mes-control bg-mes-gray-20 px-3 py-2 text-[12px]">{message}</div>)}</div><div className="mt-3 flex gap-1"><Input value={draft} aria-label="메시지 입력" onChange={(event) => setDraft(event.target.value)} /><Button size="small" variant="fillBlack" onClick={() => { if (draft.trim()) { setMessages((current) => [...current, draft.trim()]); setDraft(""); } }}>전송</Button></div></PrototypeCard>;
}

export function ExperimentalAiPromptInput() {
  const [prompt, setPrompt] = useState("오늘 비가동 설비를 요약해줘");
  const [sent, setSent] = useState(false);
  return <PrototypeCard title="AI 프롬프트 입력" code="ExperimentalAiPromptInput" kind="패턴"><Textarea aria-label="AI 요청" value={prompt} onChange={(event) => { setPrompt(event.target.value); setSent(false); }} /><div className="mt-2 flex justify-end"><Button size="small" variant="fillBlack" onClick={() => setSent(true)}>요청</Button></div>{sent && <p className="mt-2 rounded-mes-control bg-mes-gray-10 p-2 text-[12px]">요청이 임시 분석 큐에 들어갔습니다.</p>}</PrototypeCard>;
}

export function ExperimentalSortableList() {
  const [items, setItems] = useState(["원료 투입", "혼합", "압출"]);
  const move = (index: number, offset: number) => setItems((current) => { const next = [...current]; const target = index + offset; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });
  return <PrototypeCard title="정렬 가능한 목록" code="ExperimentalSortableList" kind="패턴"><div className="space-y-1">{items.map((item, index) => <div key={item} className="flex items-center gap-2 rounded-mes-control border border-mes-gray-30 px-2 py-1.5"><span className="text-mes-gray-50">⋮⋮</span><span className="flex-1 text-[12px]">{item}</span><Button size="xsmall" variant={smallAction} disabled={index === 0} onClick={() => move(index, -1)}>↑</Button><Button size="xsmall" variant={smallAction} disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</Button></div>)}</div></PrototypeCard>;
}

export function ExperimentalActivityFeed() {
  const [items, setItems] = useState(["14:20 이해빈 · 작업지시 수정", "13:45 김성형 · 설비 점검 완료"]);
  return <PrototypeCard title="댓글·활동 피드" code="ExperimentalActivityFeed" kind="패턴"><div className="space-y-2">{items.map((item) => <p key={item} className="border-l-2 border-mes-gray-40 pl-2 text-[12px] text-mes-gray-80">{item}</p>)}</div><Button size="xsmall" variant={smallAction} className="mt-3" onClick={() => setItems((current) => [`방금 전 사용자 · 확인 댓글 등록`, ...current])}>댓글 추가</Button></PrototypeCard>;
}

export function ExperimentalKanbanBoard() {
  const [stage, setStage] = useState(0);
  const columns = ["대기", "진행", "완료"];
  return <PrototypeCard title="칸반 보드" code="ExperimentalKanbanBoard" kind="템플릿"><div className="grid grid-cols-3 gap-2">{columns.map((column, index) => <div key={column} className="min-h-24 rounded-mes-control bg-mes-gray-10 p-2"><p className="text-[12px] font-semibold">{column}</p>{stage === index && <div className="mt-2 rounded-mes-control border border-mes-gray-30 bg-white p-2 text-[11px]">WO-1024<br />트레이 생산</div>}</div>)}</div><Button size="xsmall" variant="fillBlack" className="mt-2" disabled={stage === 2} onClick={() => setStage((current) => current + 1)}>다음 단계</Button></PrototypeCard>;
}

export function ExperimentalGlobalTopLoadingBar() {
  const [value, setValue] = useState(0);
  return <PrototypeCard title="상단 전역 로딩 바" code="ExperimentalGlobalTopLoadingBar" kind="컴포넌트"><div className="overflow-hidden rounded-full bg-mes-gray-20"><div className="h-1 bg-mes-primary-60 transition-all" style={{ width: `${value}%` }} /></div><div className="mt-3 flex gap-1"><Button size="xsmall" variant={smallAction} onClick={() => setValue(65)}>로딩 시작</Button><Button size="xsmall" variant={smallAction} onClick={() => setValue(100)}>완료</Button><span className="ml-auto text-[12px] text-mes-gray-70">{value}%</span></div></PrototypeCard>;
}

export function ExperimentalKbd() {
  const [pressed, setPressed] = useState(false);
  return <PrototypeCard title="키보드 키 표시" code="ExperimentalKbd" kind="컴포넌트"><div className="flex items-center gap-2"><span className="rounded-mes-control border border-mes-gray-40 bg-mes-gray-10 px-2 py-1 text-[12px] shadow-sm">Ctrl</span><span>+</span><span className="rounded-mes-control border border-mes-gray-40 bg-mes-gray-10 px-2 py-1 text-[12px] shadow-sm">K</span><Button size="xsmall" variant={smallAction} onClick={() => setPressed((value) => !value)}>동작 확인</Button></div>{pressed && <p className="mt-2 text-[12px] text-mes-primary-60">전체 검색 단축키</p>}</PrototypeCard>;
}

export function ExperimentalAspectRatio() {
  const [ratio, setRatio] = useState<"16/9" | "4/3">("16/9");
  return <PrototypeCard title="종횡비 컨테이너" code="ExperimentalAspectRatio" kind="컴포넌트"><div className="flex gap-1">{(["16/9", "4/3"] as const).map((item) => <Button key={item} size="xsmall" variant={ratio === item ? "fillBlack" : smallAction} onClick={() => setRatio(item)}>{item.replace("/", ":")}</Button>)}</div><div className="mt-2 grid max-w-64 place-items-center rounded-mes-control bg-mes-gray-20 text-[12px] text-mes-gray-70" style={{ aspectRatio: ratio }}>설비 이미지 영역</div></PrototypeCard>;
}

export function ExperimentalAnchorScrollSpy() {
  const [active, setActive] = useState("기본정보");
  return <PrototypeCard title="앵커·스크롤 추적" code="ExperimentalAnchorScrollSpy" kind="패턴"><div className="flex gap-1 border-b border-mes-gray-30 pb-2">{["기본정보", "작업조건", "이력"].map((item) => <Button key={item} size="xsmall" variant={active === item ? "fillBlack" : smallAction} onClick={() => setActive(item)}>{item}</Button>)}</div><div className="mt-3 rounded-mes-control bg-mes-gray-10 p-4 text-[12px]">현재 섹션: {active}</div></PrototypeCard>;
}

export function ExperimentalOverflowList() {
  const [expanded, setExpanded] = useState(false);
  const items = ["김성형", "이해빈", "박성형", "최관리", "정품질"];
  const visible = expanded ? items : items.slice(0, 3);
  return <PrototypeCard title="넘침 목록" code="ExperimentalOverflowList" kind="컴포넌트"><div className="flex flex-wrap gap-1">{visible.map((item) => <Badge key={item} variant="gray">{item}</Badge>)}{!expanded && <Button size="xsmall" variant={smallAction} onClick={() => setExpanded(true)}>+{items.length - visible.length} 더보기</Button>}</div></PrototypeCard>;
}

export function ExperimentalSpoiler() {
  const [open, setOpen] = useState(false);
  return <PrototypeCard title="더보기·접기 텍스트" code="ExperimentalSpoiler" kind="컴포넌트"><p className="text-[12px] leading-5 text-mes-gray-80">금형 교체 전 설비를 정지하고 안전 잠금을 확인합니다.{open && " 작업자는 보호구를 착용하고 점검표를 기록한 뒤 재가동 승인을 요청해야 합니다."}</p><Button size="xsmall" variant={smallAction} className="mt-2" onClick={() => setOpen((value) => !value)}>{open ? "접기" : "더보기"}</Button></PrototypeCard>;
}
