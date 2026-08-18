"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PrototypeCard } from "./prototype-shell";

function CheckLine({ label, checked, onChange, className = "" }: { label: string; checked: boolean; onChange: () => void; className?: string }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2 text-[13px] text-mes-gray-100 ${className}`}>
      <Checkbox size="small" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

export function ExperimentalSlider() {
  const [value, setValue] = useState(62);
  return (
    <PrototypeCard title="범위 슬라이더" code="ExperimentalSlider" kind="컴포넌트">
      <div className="flex items-center gap-3">
        <Input
          aria-label="가동률 범위"
          type="range"
          min={0}
          max={100}
          value={value}
          onInput={(event) => setValue(Number(event.currentTarget.value))}
          onChange={(event) => setValue(Number(event.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none border-0 bg-mes-gray-30 p-0 accent-mes-primary-60"
        />
        <span className="w-12 text-right text-[14px] font-semibold text-mes-gray-130">{value}%</span>
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalFileUpload() {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <PrototypeCard title="파일 업로드·드롭존" code="ExperimentalFileUpload" kind="컴포넌트">
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-mes-control border border-dashed border-mes-gray-50 bg-mes-gray-10 px-4 text-center">
        <span className="text-[14px] font-semibold text-mes-gray-110">파일을 선택하거나 이 영역에 놓으세요</span>
        <span className="text-[12px] text-mes-gray-60">PDF, XLSX, JPG · 최대 10MB</span>
        <Input
          type="file"
          multiple
          className="!absolute !h-px !w-px !overflow-hidden !border-0 !p-0 opacity-0"
          onChange={(event) => setFiles(Array.from(event.target.files ?? []).map((file) => file.name))}
        />
      </label>
      {files.length > 0 && <p className="mt-2 text-[12px] text-mes-gray-80">선택됨: {files.join(", ")}</p>}
    </PrototypeCard>
  );
}

export function ExperimentalStepper() {
  const labels = ["기본정보", "품목 설정", "검토·저장"];
  const [step, setStep] = useState(0);
  return (
    <PrototypeCard title="단계 진행" code="ExperimentalStepper" kind="패턴">
      <ol className="flex items-center">
        {labels.map((label, index) => (
          <li key={label} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span className={`flex size-6 items-center justify-center rounded-full text-[12px] font-semibold ${index <= step ? "bg-mes-gray-130 text-white" : "bg-mes-gray-30 text-mes-gray-70"}`}>{index + 1}</span>
              <span className={`whitespace-nowrap text-[13px] ${index === step ? "font-semibold text-mes-gray-130" : "text-mes-gray-70"}`}>{label}</span>
            </div>
            {index < labels.length - 1 && <span className="mx-3 h-px flex-1 bg-mes-gray-30" />}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex justify-end gap-2">
        <Button size="small" variant="fillGray" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>이전</Button>
        <Button size="small" variant="fillBlack" disabled={step === labels.length - 1} onClick={() => setStep((current) => current + 1)}>다음</Button>
      </div>
    </PrototypeCard>
  );
}

const cascadeData = {
  원재료: ["수지", "안료", "첨가제"],
  반제품: ["압출 시트", "분쇄재"],
  완제품: ["트레이", "커버"],
} as const;

export function ExperimentalCascader() {
  const [parent, setParent] = useState<keyof typeof cascadeData>("원재료");
  const [child, setChild] = useState("수지");
  return (
    <PrototypeCard title="계층 선택" code="ExperimentalCascader" kind="컴포넌트">
      <div className="grid min-h-36 grid-cols-2 divide-x divide-mes-gray-30 rounded-mes-control border border-mes-gray-30">
        <div className="p-2">
          {Object.keys(cascadeData).map((item) => (
            <Button key={item} size="small" variant={parent === item ? "opacityMain" : "lineBlacktxt"} className="mb-1 w-full justify-start" onClick={() => { setParent(item as keyof typeof cascadeData); setChild(cascadeData[item as keyof typeof cascadeData][0]); }}>{item}</Button>
          ))}
        </div>
        <div className="p-2">
          {cascadeData[parent].map((item) => (
            <Button key={item} size="small" variant={child === item ? "opacityMain" : "lineBlacktxt"} className="mb-1 w-full justify-start" onClick={() => setChild(item)}>{item}</Button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-[12px] text-mes-gray-70">선택: {parent} / {child}</p>
    </PrototypeCard>
  );
}

const transferSeed = ["압출 1호기", "압출 2호기", "성형 1호기", "성형 2호기"];

export function ExperimentalTransfer() {
  const [assigned, setAssigned] = useState<string[]>(["압출 1호기"]);
  const [selected, setSelected] = useState<string[]>([]);
  const available = transferSeed.filter((item) => !assigned.includes(item));
  const toggle = (item: string) => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  const moveRight = () => { setAssigned((current) => [...current, ...selected.filter((item) => !current.includes(item))]); setSelected([]); };
  const moveLeft = () => { setAssigned((current) => current.filter((item) => !selected.includes(item))); setSelected([]); };
  const pane = (title: string, items: string[]) => (
    <div className="min-w-0 flex-1 rounded-mes-control border border-mes-gray-30">
      <div className="border-b border-mes-gray-30 bg-mes-gray-10 px-3 py-2 text-[13px] font-semibold">{title} <span className="text-mes-gray-60">{items.length}</span></div>
      <div className="min-h-28 p-2">
        {items.map((item) => <CheckLine key={item} label={item} checked={selected.includes(item)} onChange={() => toggle(item)} className="mb-2" />)}
      </div>
    </div>
  );
  return (
    <PrototypeCard title="이중 목록 이동" code="ExperimentalTransfer" kind="패턴">
      <div className="flex items-center gap-2">
        {pane("사용 가능", available)}
        <div className="flex flex-col gap-2">
          <Button size="xsmall" variant="lineBlacktxt" onClick={moveRight}>→</Button>
          <Button size="xsmall" variant="lineBlacktxt" onClick={moveLeft}>←</Button>
        </div>
        {pane("배정됨", assigned)}
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalTreeSelect() {
  const [selected, setSelected] = useState<string[]>(["압출 1호기"]);
  const toggle = (item: string) => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  return (
    <PrototypeCard title="트리 선택" code="ExperimentalTreeSelect" kind="컴포넌트">
      <div className="rounded-mes-control border border-mes-gray-30 p-3 text-[13px]">
        <p className="mb-2 font-semibold text-mes-gray-130">▾ 생산동</p>
        <div className="ml-4 border-l border-mes-gray-30 pl-3">
          <p className="mb-2 font-medium">▾ 압출 공정</p>
          {["압출 1호기", "압출 2호기"].map((item) => <CheckLine key={item} label={item} checked={selected.includes(item)} onChange={() => toggle(item)} className="mb-2 ml-4" />)}
        </div>
      </div>
    </PrototypeCard>
  );
}

const qrBits = "111111101010111111110100001011100100000110111010101110101110110101110101110101110110101110101110101110110100001010100100000110111111101010111111110000000000000000000001110101110011010101100101011001101101010011010101101011011010010101110010101001101011111001010011000000001010101001101011111111101100101011010100001001110010100101110101110101011011001110110100001010011101010011111111101101010110101";

export function ExperimentalQrCode() {
  const [value, setValue] = useState("LOT-20260818-001");
  return (
    <PrototypeCard title="QR 코드" code="ExperimentalQrCode" kind="컴포넌트">
      <div className="flex items-center gap-4">
        <div aria-label="QR 코드 시각 프로토타입" className="grid size-28 shrink-0 grid-cols-[repeat(21,minmax(0,1fr))] bg-white p-2 shadow-[inset_0_0_0_1px_var(--mes-gray-30)]">
          {Array.from({ length: 441 }, (_, index) => <span key={index} className={qrBits[index % qrBits.length] === "1" ? "bg-mes-gray-130" : "bg-white"} />)}
        </div>
        <div className="min-w-0 flex-1">
          <Input value={value} onChange={(event) => setValue(event.target.value)} aria-label="QR 데이터" />
          <p className="mt-2 break-all text-[12px] text-mes-gray-70">{value}</p>
        </div>
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalMaskInput() {
  const [value, setValue] = useState("LOT-2026-");
  const format = (raw: string) => {
    const normalized = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    const prefix = normalized.slice(0, 3);
    const year = normalized.slice(3, 7);
    const serial = normalized.slice(7, 11);
    return [prefix, year, serial].filter(Boolean).join("-");
  };
  return (
    <PrototypeCard title="형식 제한 입력" code="ExperimentalMaskInput" kind="컴포넌트">
      <label className="block text-[13px] font-medium text-mes-gray-100">LOT 번호</label>
      <Input className="mt-2" value={value} onChange={(event) => setValue(format(event.target.value))} placeholder="LOT-2026-0001" />
      <p className="mt-1 text-[11px] text-mes-gray-60">형식: 영문 3자-연도 4자-일련번호 4자</p>
    </PrototypeCard>
  );
}

export function ExperimentalApprovalStepper() {
  const [approved, setApproved] = useState(1);
  const steps = ["작성", "생산팀장", "공장장", "완료"];
  return (
    <PrototypeCard title="결재 단계" code="ExperimentalApprovalStepper" kind="패턴">
      <div className="flex items-start justify-between gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-1 flex-col items-center text-center">
            <span className={`flex size-7 items-center justify-center rounded-full border text-[12px] font-semibold ${index <= approved ? "border-mes-gray-130 bg-mes-gray-130 text-white" : "border-mes-gray-40 bg-white text-mes-gray-60"}`}>{index + 1}</span>
            <span className="mt-1.5 text-[12px] text-mes-gray-90">{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end"><Button size="small" variant="fillBlack" disabled={approved >= steps.length - 1} onClick={() => setApproved((current) => current + 1)}>다음 승인 처리</Button></div>
    </PrototypeCard>
  );
}

export function ExperimentalAttachmentList() {
  const [items, setItems] = useState(["작업표준서.pdf", "검사성적서.xlsx"]);
  return (
    <PrototypeCard title="첨부파일 목록" code="ExperimentalAttachmentList" kind="패턴">
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between rounded-mes-control border border-mes-gray-30 px-3 py-2">
            <span className="truncate text-[13px] text-mes-gray-100">{item}</span>
            <Button size="xsmall" variant="lineBlacktxt" onClick={() => setItems((current) => current.filter((value) => value !== item))}>삭제</Button>
          </div>
        ))}
        <label className="inline-flex cursor-pointer">
          <span className="inline-flex h-8 items-center rounded-mes-control border border-mes-gray-30 bg-white px-2.5 text-[14px] font-semibold text-mes-gray-130">파일 추가</span>
          <Input type="file" className="!absolute !h-px !w-px !overflow-hidden !border-0 !p-0 opacity-0" onChange={(event) => { const name = event.target.files?.[0]?.name; if (name) setItems((current) => [...current, name]); }} />
        </label>
      </div>
    </PrototypeCard>
  );
}

export function ExperimentalDowntimeReasonSelector() {
  const [reason, setReason] = useState("maintenance");
  return (
    <PrototypeCard title="비가동 사유 선택" code="ExperimentalDowntimeReasonSelector" kind="컴포넌트">
      <Select value={reason} onValueChange={setReason}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="maintenance">예방 보전</SelectItem>
          <SelectItem value="failure">설비 고장</SelectItem>
          <SelectItem value="material">자재 대기</SelectItem>
          <SelectItem value="other">기타</SelectItem>
        </SelectContent>
      </Select>
      {reason === "other" && <Textarea className="mt-2" placeholder="비가동 사유를 입력하세요" />}
    </PrototypeCard>
  );
}

export function ExperimentalFileRow() {
  const [downloaded, setDownloaded] = useState(false);
  const size = useMemo(() => "2.4 MB", []);
  return (
    <PrototypeCard title="파일 행" code="ExperimentalFileRow" kind="컴포넌트">
      <div className="flex items-center justify-between gap-3 rounded-mes-control border border-mes-gray-30 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-mes-gray-110">생산실적_20260818.xlsx</p>
          <p className="text-[11px] text-mes-gray-60">{size}</p>
        </div>
        <Button size="xsmall" variant={downloaded ? "fillGray" : "lineBlacktxt"} onClick={() => setDownloaded(true)}>{downloaded ? "완료" : "다운로드"}</Button>
      </div>
    </PrototypeCard>
  );
}
