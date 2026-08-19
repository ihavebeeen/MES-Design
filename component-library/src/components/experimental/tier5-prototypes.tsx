"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrototypeCard } from "./prototype-shell";

export function ExperimentalProductTour() {
  const [step, setStep] = useState(0);
  const steps = ["빠른 조회", "필터 추가", "행 선택"];
  return <PrototypeCard title="온보딩 툴팁·제품 투어" code="ExperimentalProductTour" kind="패턴"><div className="rounded-mes-control border border-mes-primary-40 bg-mes-gray-10 p-3"><Badge variant="blue">{step + 1}/{steps.length}</Badge><p className="mt-2 text-[13px] font-semibold">{steps[step]}</p><p className="mt-1 text-[11px] text-mes-gray-70">이 기능을 사용해 목록 작업을 빠르게 진행합니다.</p></div><div className="mt-2 flex gap-1"><Button size="xsmall" variant="lineBlacktxt" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>이전</Button><Button size="xsmall" variant="fillBlack" disabled={step === steps.length - 1} onClick={() => setStep((current) => current + 1)}>다음</Button></div></PrototypeCard>;
}
