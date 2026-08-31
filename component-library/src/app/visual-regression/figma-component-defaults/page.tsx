"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionFrame } from "@/components/ui/section-frame";
import { DialogFooter } from "@/components/ui/dialog-footer";
import { CenterModal } from "@/components/ui/center-modal";
import { SideSlidePanel } from "@/components/ui/side-slide-panel";
import { RadioChoiceDialog } from "@/components/ui/radio-choice-dialog";

// 사용자 수정 Figma의 공용 컴포넌트 기본값을 검증하는 테스트 전용 페이지.
export default function FigmaComponentDefaultsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [event, setEvent] = useState("대기");
  const close = (value: boolean) => { if (!value) setOpen(null); };
  const confirm = () => setEvent("확인");
  const cancel = () => setEvent("취소");

  return (
    <main className="mx-auto flex max-w-[1000px] flex-col gap-5 bg-mes-gray-10 p-5">
      <h1>Figma 수정본 회귀 검사</h1>
      <div data-testid="header-only"><SectionHeader>작업 정보</SectionHeader></div>
      <div data-testid="header-action">
        <SectionHeader action={<Button size="small" variant="fillMain">추가</Button>}>작업 정보</SectionHeader>
      </div>
      <div data-testid="header-link">
        <SectionHeader action={<Button asChild size="small"><Link href="#footer-cases" className="no-underline">상세</Link></Button>}>작업 정보</SectionHeader>
      </div>
      <SectionFrame data-testid="section-frame" title="작업 정보" action={<Button size="small" variant="fillBlack">항목 추가</Button>}>
        본문 영역
      </SectionFrame>
      <div><Button size="small">일반 32px 버튼</Button></div>
      <div id="footer-cases">
        {[0, 1, 2, 3, 4].map((count) => (
          <div key={count} data-testid={`footer-${count}`}>
            <DialogFooter actions={Array.from({ length: count }, (_, index) => ({ id: String(index), label: `액션 ${index + 1}` }))} />
          </div>
        ))}
        <div data-testid="footer-overrides">
          <DialogFooter actions={[
            { id: "gray", label: "사용자 지정", variant: "fillGray", className: "w-[200px]", onClick: () => setEvent("사용자 지정") },
            { id: "disabled", label: "비활성", variant: "fillMain", disabled: true, onClick: () => setEvent("비활성 클릭 오류") },
            { id: "black", label: "검정 유지", variant: "fillBlack" },
          ]} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {["center", "side", "radio", "custom-actions", "custom-footer", "no-footer"].map((kind) => (
          <Button key={kind} onClick={() => { setEvent("대기"); setOpen(kind); }}>{kind} 열기</Button>
        ))}
      </div>
      <output data-testid="event">{event}</output>
      <CenterModal open={open === "center"} onOpenChange={close} title="중앙 모달" onConfirm={confirm} onCancel={cancel}>본문 영역</CenterModal>
      <SideSlidePanel open={open === "side"} onOpenChange={close} title="우측 패널" onConfirm={confirm} onCancel={cancel}>본문 영역</SideSlidePanel>
      <RadioChoiceDialog open={open === "radio"} onOpenChange={close} title="선택 모달" question="방식을 선택하세요." options={[{ title: "기존 품목", description: "등록된 품목을 선택합니다." }, { title: "직접 추가", description: "새 품목 정보를 입력합니다." }]} onConfirm={confirm} onCancel={cancel} />
      <CenterModal open={open === "custom-actions"} onOpenChange={close} title="명시적 액션" onCancel={cancel} actions={[
        { id: "cancel", label: "폐기", variant: "fillGray", onClick: () => setEvent("잘못된 취소") },
        { id: "confirm", label: "검정 확인", variant: "fillBlack", onClick: confirm },
      ]}>본문 영역</CenterModal>
      <CenterModal open={open === "custom-footer"} onOpenChange={close} title="지정 푸터" actions={[{ id: "unused", label: "사용하지 않는 액션" }]} footer={<Button onClick={confirm}>지정 푸터 버튼</Button>}>본문 영역</CenterModal>
      <CenterModal open={open === "no-footer"} onOpenChange={close} title="푸터 없음" actions={[]}>본문 영역</CenterModal>
    </main>
  );
}
