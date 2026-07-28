"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Radio } from "./radio";
import { IconExclamationCircle } from "../icons/icon-exclamation-circle";
import { IconX } from "../icons/icon-x";

/**
 * MES RadioChoiceDialog (라디오 선택형 확인 모달) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 18840:61182("modal", 실측 인스턴스명
 * "투입품목 추가"). 담당자가 "삭제모달 - 드롭다운/라디오버튼" 2종 중 라디오버튼 쪽으로
 * 지목해 전달한 노드 — 다만 실측 인스턴스 자체의 문구/용도는 "삭제"가 아니라 "투입품목
 * 추가 방식 선택"이라 문구 그대로는 삭제 모달이 아님. 구조(라디오 2택 + 되돌릴 수 없음
 * 경고 배너 + 취소/다음 버튼)만 재사용 가능한 패턴으로 보고 이 구조를 그대로 컴포넌트화함.
 * → 실제 "삭제" 용도로 쓸 땐 title/question/options/actions 텍스트를 호출부에서 그대로
 * 갈아끼우면 됨. 드롭다운 쪽 변형은 담당자가 아직 못 찾은 상태(별도 전달 예정).
 *
 * ── 1. 레이아웃(실측, 전부 이 노드 기준) ──────────────────────────
 * 전체: 흰 배경, 너비 고정 480px(hug 아님 — Figma 프레임 자체가 480px 고정),
 * radius 16px, 그림자 `0px 0px 24px 0px rgba(0,0,0,0.2)`.
 * ⚠️ ConfirmDialog(node 11106:37629, "modal-error")는 radius 12px + 그림자
 * `0 4px 16px rgba(0,0,0,.2)`로 이 노드와 다름 — 같은 "모달" 계열이라고 임의로
 * 값을 맞추지 않고 각 노드에서 실측된 값을 그대로 씀(재발 방지 규칙 2번: 유추 금지).
 * 두 모달의 radius/shadow가 실제로 통일돼야 하는지는 담당자 확인 필요(체크리스트 등록).
 *
 * - 헤더(52px): ConfirmDialog와 동일 실측 패턴 재사용 확인됨(하단 테두리 Gray-30,
 *   padding 좌20/우14/상하10, 제목 18px Bold Gray-130, 닫기 X 32x32 히트영역/20px 아이콘).
 * - 본문: 상/좌우 padding 20px, 하단 padding 0(배너가 프레임 하단에 딱 맞닿음 — 실측
 *   좌표로 확인: 본문 프레임 높이 259px = 상단패딩20 + 질문블록166 + gap20 + 배너53).
 *   내부 gap 20px, 폭 440px(=480-20-20) 전체 사용.
 *   - 질문 텍스트: Pretendard Medium 16px Gray-130.
 *   - 옵션 2개, 세로 gap 20px. 옵션 1개당: 라디오 아이콘(24px) + gap 6px + 텍스트블록.
 *     텍스트블록 내부 gap 6px: 제목 Pretendard SemiBold 16px Gray-130 / 설명 Pretendard
 *     Regular 14px Gray-90.
 *   - 경고 배너: bg Gray-20, radius 4px, padding 좌우30px/상하16px, gap 8px, 내부
 *     아이콘(mes/icon-exclamation-circle, 16px) + 텍스트(Pretendard Regular 14px
 *     Gray-130), 가로 전체 중앙정렬.
 * - 푸터(72px): 흰 배경, 상하 padding 16px, 버튼 2개 가로 정렬 gap 10px, 각 버튼
 *   고정 너비 160px/높이 40px — Button 컴포넌트 size="basic"과 폰트/radius 동일,
 *   variant는 "취소"=fillGray(Gray-40 배경/Gray-130 텍스트), "다음"=fillBlack
 *   (Gray-130 배경/흰 텍스트) 그대로 매칭돼 기존 Button 컴포넌트 재사용.
 *
 * ── 2. 라디오 아이콘 ───────────────────────────────────────────
 * mes/icon-radio 사용 — 기존 `radio.tsx`(node 9873:82508 실측)와 sel/unsel 색상이
 * 정확히 일치함(get_variable_defs 재대조: main60=#1573fb, gray50/gray60 계열) →
 * 새로 만들지 않고 기존 `Radio` 컴포넌트를 그대로 재사용함(중복 구현 방지).
 *
 * ── 3. 아이콘 (2026-07-28 실제 SVG로 교체) ───────────────────
 * 경고 배너 아이콘은 담당자가 Figma에서 직접 SVG export한 실측 벡터(`IconExclamationCircle`,
 * Toast/ConfirmDialog와 동일 아이콘 컴포넌트 재사용)로 교체. 색은 스크린샷 기준 Gray-130
 * 판단 유지(배너 전체가 저채도 회색 톤이라 danger 색이 아님 — 텍스트와 동일 색으로 처리).
 * 헤더 닫기 아이콘도 실제 SVG(`IconX`)로 교체.
 *
 * ── 4. 확인 필요 ────────────────────────────────────────────────
 * - 이 노드가 정말 "삭제모달 - 라디오버튼" 변형이 맞는지(문구가 삭제가 아님) 담당자 재확인.
 * - "드롭다운" 쪽 변형 모달은 아직 미전달.
 * - ConfirmDialog와 radius/shadow 값이 다른 게 의도된 것인지 확인 필요.
 */

export interface RadioChoiceOption {
  title: string;
  description: string;
}

export interface RadioChoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  question: string;
  options: RadioChoiceOption[];
  /** 제어형 선택 인덱스. 넘기지 않으면 내부 state로 비제어 동작(Combobox와 동일 패턴). */
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  warning?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

function RadioChoiceDialog({
  open,
  onOpenChange,
  title,
  question,
  options,
  selectedIndex,
  defaultSelectedIndex = 0,
  onSelectedIndexChange,
  warning,
  cancelLabel = "취소",
  confirmLabel = "다음",
  onCancel,
  onConfirm,
}: RadioChoiceDialogProps) {
  const [internalIndex, setInternalIndex] = React.useState(defaultSelectedIndex);
  const isControlled = selectedIndex !== undefined;
  const currentIndex = isControlled ? selectedIndex : internalIndex;

  const handleSelect = (index: number) => {
    if (!isControlled) setInternalIndex(index);
    onSelectedIndexChange?.(index);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[480px] -translate-x-1/2 -translate-y-1/2",
            "flex flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_24px_0px_rgba(0,0,0,0.2)]"
          )}
        >
          <div className="flex h-[52px] w-full shrink-0 items-center justify-between border-b border-mes-gray-30 py-[10px] pl-5 pr-[14px]">
            <DialogPrimitive.Title className="flex-1 text-[18px] font-bold leading-[1.5] text-mes-gray-130">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="닫기"
                className="flex size-8 shrink-0 items-center justify-center text-mes-gray-130"
              >
                <IconX size={20} />
              </button>
            </DialogPrimitive.Close>
          </div>

          <div className="flex w-full shrink-0 flex-col items-center gap-5 px-5 pt-5">
            <div className="flex w-full flex-col gap-5">
              <p className="text-[16px] font-medium leading-[1.5] text-mes-gray-130">
                {question}
              </p>
              <div className="flex w-full flex-col gap-5">
                {options.map((option, index) => (
                  <label
                    key={index}
                    className="flex w-full cursor-pointer items-start gap-1.5"
                  >
                    <Radio
                      name="radio-choice-dialog-option"
                      checked={currentIndex === index}
                      onChange={() => handleSelect(index)}
                    />
                    <span className="flex flex-col gap-1.5">
                      <span className="text-[16px] font-semibold leading-[1.5] text-mes-gray-130">
                        {option.title}
                      </span>
                      <span className="text-[14px] font-normal leading-[1.5] text-mes-gray-90">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {warning && (
              <div className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-mes-gray-20 px-[30px] py-4">
                <IconExclamationCircle size={16} className="shrink-0 text-mes-gray-130" />
                <p className="text-center text-[14px] font-normal leading-[1.5] text-mes-gray-130">
                  {warning}
                </p>
              </div>
            )}
          </div>

          <div className="flex w-full shrink-0 items-center justify-center gap-2.5 py-4">
            <Button
              variant="fillGray"
              size="basic"
              className="w-40"
              onClick={() => {
                onCancel?.();
                onOpenChange(false);
              }}
            >
              {cancelLabel}
            </Button>
            <Button variant="fillBlack" size="basic" className="w-40" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { RadioChoiceDialog };
