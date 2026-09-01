"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { DialogFooter, type DialogAction } from "./dialog-footer";
import { CloseButton } from "./icon-button";
import {
  dialogBodyAlignClasses,
  dialogBodyPaddingClasses,
  dialogBodyScrollClasses,
  type DialogBodyAlign,
  type DialogBodyPadding,
  type DialogBodyScrollMode,
} from "./dialog-body";

export type SideSlidePanelSize = "narrow-760" | "medium-849" | "standard-900" | "wide-960";

const sideSlidePanelSizeClasses: Record<SideSlidePanelSize, string> = {
  "narrow-760": "max-w-[760px]",
  "medium-849": "max-w-[849px]",
  "standard-900": "max-w-[900px]",
  "wide-960": "max-w-[960px]",
};

/**
 * MES Side Slide Panel (우측 전체 슬라이드 패널, 오가니즘) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일 node 9873:82872("Modal" 스펙 페이지) Type02. Center Modal과
 * 같은 스펙 페이지에 나란히 정의돼 있어(담당자가 "위계가 비슷해서 같이 자료 주겠다"고
 * 했던 바로 그 자료) `center-modal.tsx`와 헤더/푸터 구조를 그대로 공유 — 차이는 컨테이너
 * 위치(화면 중앙 vs 우측 고정)와 크기 규칙(가로 고정폭 vs 세로 풀높이)뿐.
 *
 * ── 1. 레이아웃(실측) ────────────────────────────────────────────
 * 화면 우측에 붙어 세로 전체(100vh)를 채우는 패널. 흰 배경, 그림자
 * `drop-shadow(0px 0px 12px rgba(0,0,0,.2))`(Center Modal의 스프레드 섀도와 달리 우측
 * 패널이라 좌측으로 퍼지는 형태) — radius 없음(화면 끝에 딱 붙는 패턴이라 CenterModal의
 * 16px radius와 다름, 원본에도 rounded 처리 없음).
 * - 너비: 원본 텍스트 설명은 "가로사이즈는 960px을 기본으로 사용한다(콘텐츠 타입에 따라
 *   변형 가능)"인데, 실제 스펙 페이지의 예시 프레임 자체는 900px로 그려져 있음(설명 텍스트와
 *   예시 프레임이 어긋난 경우 — Table 작업 때도 있었던 패턴) — 텍스트가 명시적으로 "기본"
 *   값을 못 박고 있고, 페이지 전체 콘텐츠 max-width(`max-w-[960px]`)와도 일치해서 960px을
 *   기본값으로 채택했다. 이후 완성 화면 node 20274:73333에서 760px 3종, 900px 2종이
 *   반복 확인되어 760/900/960px size preset으로 확장했다. 기존 호출은 960px을 유지한다.
 * - 헤더(52px)/본문/푸터 구조, 패딩, 버튼 크기는 Center Modal과 완전히 동일한 값 —
 *   `center-modal.tsx` 문서 주석의 "1. 레이아웃" 항목 참고(중복 서술 안 함).
 * - 헤더/푸터는 항상 고정, 본문(`콘텐츠 스크롤 영역`)만 "모달창 높이에 따라 가변" —
 *   Side Panel은 전체가 100vh라 Center Modal의 80vh 제한과 달리 상한 없이 꽉 채움.
 *
 * ── 2. 판단값 ───────────────────────────────────────────────────
 * - 오버레이 딤: Center Modal과 동일하게 `bg-black/40`으로 통일(근거는 center-modal.tsx
 *   문서 참고).
 * - 진입/퇴장 애니메이션(슬라이드인/아웃): 이름상 슬라이드 동작이 있는 게 자연스럽지만,
 *   프로젝트에 애니메이션 유틸(tailwindcss-animate 등)이 설정돼 있지 않고 다른 Dialog 계열
 *   컴포넌트(ConfirmDialog 등)도 전부 애니메이션 없이 즉시 열림/닫힘이라 — 새 의존성을
 *   추가하지 않고 기존 관례에 맞춰 애니메이션 없이 구현(판단값).
 */

export interface SideSlidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  cancelLabel?: string;
  /** 취소·X·Esc·배경 클릭에 공통 적용되는 변경 폐기/원상복구 콜백. 실행 후 패널이 닫힌다. */
  onCancel?: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
  /** 완성 화면의 실제 우측 패널 폭. 기본값은 기존 동작과 같은 960px. */
  size?: SideSlidePanelSize;
  /** 지정하면 기존 취소/저장 2버튼 대신 이 배열을 렌더링한다. 빈 배열은 푸터 없음. */
  actions?: DialogAction[];
  footer?: React.ReactNode;
  bodyPadding?: DialogBodyPadding;
  scrollMode?: DialogBodyScrollMode;
  bodyAlign?: DialogBodyAlign;
  /** @deprecated bodyPadding, scrollMode, bodyAlign로 표현할 수 없는 호환 호출에만 사용한다. */
  contentClassName?: string;
  className?: string;
}

function SideSlidePanel({
  open,
  onOpenChange,
  title,
  children,
  cancelLabel = "닫기",
  onCancel,
  confirmLabel = "저장",
  onConfirm,
  size = "wide-960",
  actions,
  footer,
  bodyPadding = "standard",
  scrollMode = "shell",
  bodyAlign = "center",
  contentClassName,
  className,
}: SideSlidePanelProps) {
  const dismiss = React.useCallback(() => {
    onCancel?.();
    onOpenChange(false);
  }, [onCancel, onOpenChange]);

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (nextOpen) onOpenChange(true);
    else dismiss();
  }, [dismiss, onOpenChange]);

  const baseActions: DialogAction[] = actions ?? [
    { id: "cancel", label: cancelLabel, variant: "fillGray", onClick: dismiss },
    { id: "confirm", label: confirmLabel, variant: "fillBlack", onClick: onConfirm },
  ];
  const resolvedActions = baseActions.map((action) => action.id === "cancel"
    ? { ...action, onClick: dismiss }
    : action);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <DialogPrimitive.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col overflow-hidden bg-white",
            "shadow-[0px_0px_12px_rgba(0,0,0,0.2)]",
            sideSlidePanelSizeClasses[size],
            className
          )}
        >
          <div className="flex h-[52px] w-full shrink-0 items-center justify-between border-b border-mes-gray-30 py-[10px] pl-5 pr-[14px]">
            <DialogPrimitive.Title className="flex-1 text-[18px] font-bold leading-[1.5] text-mes-gray-130">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <CloseButton className="text-mes-gray-130" />
            </DialogPrimitive.Close>
          </div>

          <div className={cn(
            "flex min-h-0 w-full flex-1 flex-col",
            dialogBodyPaddingClasses[bodyPadding],
            dialogBodyScrollClasses[scrollMode],
            dialogBodyAlignClasses[bodyAlign],
            contentClassName
          )}>
            {children}
          </div>

          {footer !== undefined ? footer : <DialogFooter actions={resolvedActions} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { SideSlidePanel, sideSlidePanelSizeClasses };
export type { DialogBodyAlign, DialogBodyPadding, DialogBodyScrollMode } from "./dialog-body";
