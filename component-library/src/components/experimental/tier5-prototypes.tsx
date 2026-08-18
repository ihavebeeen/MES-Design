"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PrototypeCard } from "./prototype-shell";

const line = "lineBlacktxt" as const;


export function ExperimentalRating() { const [value, setValue] = useState(3); return <PrototypeCard title="별점 평가" code="ExperimentalRating" kind="컴포넌트"><div className="flex gap-1">{[1,2,3,4,5].map((item) => <Button key={item} size="xsmall" variant={item <= value ? "fillBlack" : line} aria-label={`${item}점`} onClick={() => setValue(item)}>★</Button>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">{value}점</p></PrototypeCard>; }

export function ExperimentalColorPicker() { const [color, setColor] = useState("파랑"); const colors = [["파랑","bg-mes-primary-60"],["빨강","bg-mes-danger-60"],["회색","bg-mes-gray-90"]]; return <PrototypeCard title="색상 선택기" code="ExperimentalColorPicker" kind="컴포넌트"><div className="flex gap-2">{colors.map(([name, className]) => <Button key={name} size="xsmall" variant={line} aria-label={`${name} 선택`} className="size-8 p-1" onClick={() => setColor(name)}><span className={`size-4 rounded-full ${className}`} /></Button>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">선택: {color}</p></PrototypeCard>; }



export function ExperimentalCarousel() { const [index, setIndex] = useState(0); const slides = ["설비 현황", "생산 KPI", "품질 알림"]; return <PrototypeCard title="캐러셀" code="ExperimentalCarousel" kind="패턴"><div className="grid h-28 place-items-center rounded-mes-control bg-mes-gray-20 text-[15px] font-semibold">{slides[index]}</div><div className="mt-2 flex items-center justify-between"><Button size="xsmall" variant={line} onClick={() => setIndex((value) => (value + slides.length - 1) % slides.length)}>이전</Button><span className="text-[11px]">{index + 1}/{slides.length}</span><Button size="xsmall" variant={line} onClick={() => setIndex((value) => (value + 1) % slides.length)}>다음</Button></div></PrototypeCard>; }

export function ExperimentalVideoPlayer() { const [playing, setPlaying] = useState(false); const [progress, setProgress] = useState(24); return <PrototypeCard title="영상 플레이어" code="ExperimentalVideoPlayer" kind="패턴"><div className="grid h-32 place-items-center rounded-mes-control bg-mes-gray-120 text-white"><Button size="small" variant="fillGray" onClick={() => { setPlaying((value) => !value); setProgress((value) => Math.min(100, value + 12)); }}>{playing ? "일시정지" : "재생"}</Button></div><Progress value={progress} className="mt-2 px-0" /><p className="mt-1 text-[11px] text-mes-gray-60">설비 안전교육 · {progress}%</p></PrototypeCard>; }


export function ExperimentalCodeBlock() { const [copied, setCopied] = useState(false); return <PrototypeCard title="코드 블록" code="ExperimentalCodeBlock" kind="컴포넌트"><div className="rounded-mes-control bg-mes-gray-130 p-3 font-mono text-[11px] text-white"><code>{`LOT = FG-20260818-01\nQTY = 3000`}</code></div><Button size="xsmall" variant={line} className="mt-2" onClick={() => setCopied(true)}>{copied ? "복사됨" : "복사"}</Button></PrototypeCard>; }

export function ExperimentalMarkdownRenderer() { const [preview, setPreview] = useState(true); return <PrototypeCard title="마크다운 렌더러" code="ExperimentalMarkdownRenderer" kind="패턴"><Button size="xsmall" variant={line} onClick={() => setPreview((value) => !value)}>{preview ? "원문 보기" : "미리보기"}</Button>{preview ? <div className="mt-2 rounded-mes-control bg-mes-gray-10 p-3"><p className="text-[14px] font-bold">설비 점검</p><p className="mt-1 text-[12px]">• 전원 차단<br />• 안전 잠금 확인</p></div> : <pre className="mt-2 whitespace-pre-wrap text-[11px]"># 설비 점검{"\n"}- 전원 차단{"\n"}- 안전 잠금 확인</pre>}</PrototypeCard>; }



export function ExperimentalProductTour() { const [step, setStep] = useState(0); const steps = ["빠른 조회", "필터 추가", "행 선택"]; return <PrototypeCard title="온보딩 툴팁·제품 투어" code="ExperimentalProductTour" kind="패턴"><div className="rounded-mes-control border border-mes-primary-40 bg-mes-gray-10 p-3"><Badge variant="blue">{step + 1}/{steps.length}</Badge><p className="mt-2 text-[13px] font-semibold">{steps[step]}</p><p className="mt-1 text-[11px] text-mes-gray-70">이 기능을 사용해 목록 작업을 빠르게 진행합니다.</p></div><div className="mt-2 flex gap-1"><Button size="xsmall" variant={line} disabled={step === 0} onClick={() => setStep((value) => value - 1)}>이전</Button><Button size="xsmall" variant="fillBlack" disabled={step === steps.length - 1} onClick={() => setStep((value) => value + 1)}>다음</Button></div></PrototypeCard>; }









export function ExperimentalMentions() { const [text, setText] = useState("@김성형 설비 점검 확인 부탁드립니다."); return <PrototypeCard title="사용자 멘션" code="ExperimentalMentions" kind="패턴"><Input aria-label="멘션 입력" value={text} onChange={(event) => setText(event.target.value)} /><div className="mt-2 flex gap-1"><Badge variant="blueLight">@김성형</Badge><Badge variant="gray">@이해빈</Badge></div></PrototypeCard>; }

export function ExperimentalWatermark() { const [visible, setVisible] = useState(true); return <PrototypeCard title="워터마크" code="ExperimentalWatermark" kind="컴포넌트"><div className="relative grid h-28 place-items-center overflow-hidden rounded-mes-control border border-mes-gray-30"><span className="text-[12px]">작업표준서 v3</span>{visible && <span className="absolute rotate-[-24deg] text-[28px] font-bold text-mes-gray-30">사내 전용</span>}</div><Button size="xsmall" variant={line} className="mt-2" onClick={() => setVisible((value) => !value)}>워터마크 {visible ? "숨기기" : "표시"}</Button></PrototypeCard>; }

export function ExperimentalMasonryGrid() { const [dense, setDense] = useState(false); const heights = dense ? [12,20,16,24,14,18] : [20,14,24,12,18,16]; return <PrototypeCard title="메이슨리 그리드" code="ExperimentalMasonryGrid" kind="패턴"><div className="columns-3 gap-2">{heights.map((height, index) => <div key={index} className="mb-2 break-inside-avoid rounded-mes-control bg-mes-gray-20 p-2 text-[11px]" style={{ height: `${height * 4}px` }}>카드 {index + 1}</div>)}</div><Button size="xsmall" variant={line} onClick={() => setDense((value) => !value)}>배치 변경</Button></PrototypeCard>; }


export function ExperimentalMarquee() { const [paused, setPaused] = useState(false); return <PrototypeCard title="흐르는 공지" code="ExperimentalMarquee" kind="컴포넌트"><div className="overflow-hidden rounded-mes-control bg-mes-gray-130 px-3 py-2 text-[12px] text-white"><p className={paused ? "" : "animate-pulse"}>압출 1호기 정기점검 예정 · 16:00~17:00</p></div><Button size="xsmall" variant={line} className="mt-2" onClick={() => setPaused((value) => !value)}>{paused ? "재생" : "일시정지"}</Button></PrototypeCard>; }

export function ExperimentalWarehouseLocationMap() { const [selected, setSelected] = useState("A-02"); const cells = ["A-01","A-02","A-03","B-01","B-02","B-03"]; return <PrototypeCard title="창고 위치 지도" code="ExperimentalWarehouseLocationMap" kind="템플릿"><div className="grid grid-cols-3 gap-2 rounded-mes-control bg-mes-gray-10 p-3">{cells.map((cell) => <Button key={cell} size="xsmall" variant={selected === cell ? "fillBlack" : line} className="h-12" onClick={() => setSelected(cell)}>{cell}</Button>)}</div><p className="mt-2 text-[12px] text-mes-gray-70">선택 위치: {selected}</p></PrototypeCard>; }
