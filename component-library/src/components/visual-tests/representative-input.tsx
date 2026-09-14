"use client";

import { Input } from "@/components/ui/input";

function StateSample({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold leading-[1.5] text-mes-gray-80">{label}</span>
      {children}
    </div>
  );
}

export function RepresentativeInputStates() {
  return (
    <section data-visual-test="input-states" className="w-[720px] bg-white p-8">
      <div className="mb-6">
        <h1 className="text-[18px] font-bold leading-[1.5] text-mes-gray-130">Input 상태 비교</h1>
        <p className="mt-1 text-[13px] leading-[1.5] text-mes-gray-80">
          원본 MES Figma의 기본 크기와 small 크기에서 확인된 상태
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <StateSample label="기본 · 비어 있음">
          <Input data-input-state="default-empty" placeholder="내용 입력" className="w-[220px]" />
        </StateSample>
        <StateSample label="기본 · 입력 완료">
          <Input data-input-state="default-filled" defaultValue="내용" className="w-[220px]" />
        </StateSample>
        <StateSample label="포커스 · 입력 중">
          <Input data-input-state="focus" defaultValue="입력 중" className="w-[220px]" />
        </StateSample>
        <StateSample label="읽기 전용">
          <Input data-input-state="readonly" readOnly defaultValue="내용" className="w-[220px]" />
        </StateSample>
        <StateSample label="비활성">
          <Input data-input-state="disabled" disabled defaultValue="내용" className="w-[220px]" />
        </StateSample>
      </div>

      <div className="my-7 h-px bg-mes-gray-30" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <StateSample label="Small · 비어 있음">
          <Input data-input-state="small-empty" size="small" placeholder="내용 입력" className="w-[220px]" />
        </StateSample>
        <StateSample label="Small · 입력 완료">
          <Input data-input-state="small-filled" size="small" defaultValue="내용" className="w-[220px]" />
        </StateSample>
        <StateSample label="Small · 읽기 전용">
          <Input data-input-state="small-readonly" size="small" readOnly defaultValue="내용" className="w-[220px]" />
        </StateSample>
        <StateSample label="Small · 비활성">
          <Input data-input-state="small-disabled" size="small" disabled defaultValue="내용" className="w-[220px]" />
        </StateSample>
      </div>
    </section>
  );
}
