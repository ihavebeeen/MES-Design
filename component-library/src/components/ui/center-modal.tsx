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

export type CenterModalSize =
  | "compact-400"
  | "compact-480"
  | "medium-600"
  | "standard-960"
  | "wide-1024"
  | "wide-1142"
  | "large-1100"
  | "wide-1400";

const centerModalSizeClasses: Record<CenterModalSize, string> = {
  "compact-400": "max-w-[400px]",
  "compact-480": "max-w-[480px]",
  "medium-600": "max-w-[600px]",
  "standard-960": "max-w-[960px]",
  "wide-1024": "max-w-[1024px]",
  "wide-1142": "max-w-[1142px]",
  "large-1100": "max-w-[1100px]",
  "wide-1400": "max-w-[1400px]",
};

/**
 * MES Center Modal (화면 중앙 기본 팝업, 오가니즘) — Figma 실측 기반
 *
 * ── 0. 경위 ─────────────────────────────────────────────────────
 * 컴포넌트 라이브러리 node 168:37994의 초기안은 한때 보류됐으나, 이후 클라우드MES
 * node 9873:82872의 Type01/Type02 스펙으로 복원·확정했다. 과거 백업은 현재 근거로 사용하지 않는다.
 *
 * ── 1. 레이아웃(실측, node 9873:82872 Type01) ──────────────────────
 * 전체: 흰 배경, radius **16px**(ConfirmDialog의 12px과 다름 — 과거에 이 둘을 같은
 * 값으로 착각했던 사고가 있어 재차 강조), 그림자 `0px 0px 24px rgba(0,0,0,.2)`.
 * - 기본 너비: **960px**. 완성 화면 node 20274:73333 감사 후 실제 콘텐츠 유형에 맞춘
 *   400/480/600/960/1100/1400px size preset을 추가했다. 기존 호출은 960px을 유지한다.
 * - 최대 높이: **80vh**(스펙 페이지 빨간 주석 "모달창 최대 높이값은 화면의 80%(80vh)").
 *   헤더/푸터는 고정, 본문만 스크롤 — Type02(Side Slide Panel)와 동일한 규칙을 공유.
 * - 헤더(52px): 하단 테두리 1px Gray-30(#E4E7EE), 좌측 padding 20px/우측 14px, 상하 10px.
 *   제목 Pretendard Bold 18px Gray-130. 우측 닫기(X) 버튼 32x32 히트영역, 아이콘 20px —
 *   ConfirmDialog와 완전히 동일한 헤더 구조라 그대로 재사용.
 * - 본문: 상/좌우 padding 20px, 하단 padding 없음(간격은 푸터 쪽 padding에 위임 —
 *   ConfirmDialog의 "간격은 한쪽만 책임진다" 패턴과 동일). `flex-1 overflow-y-auto`로
 *   내용이 넘치면 이 영역만 스크롤(헤더/푸터는 항상 고정).
 * - 푸터: 상하 padding 16px, 가운데 정렬(justify-center), 버튼 2개 gap 10px, 버튼 각각
 *   고정 너비 **160px**. 취소 버튼은 `variant="fillGray"`, 저장 버튼은 `variant="fillBlack"`.
 *
 * ── 2. 판단값(원본에 명시 안 됨) ──────────────────────────────────
 * - 오버레이 딤 색상: 스펙 페이지와 완성 화면 회귀 기준에서 확인한 `rgba(0,0,0,0.6)`을
 *   사용한다. 작은 안내용 ConfirmDialog는 별도 위계라 `bg-black/40`을 유지한다.
 * - 버튼 라벨은 "취소"/"저장"이 원본 그대로지만, 실제 화면마다 삭제/등록 등 다른 동사가
 *   쓰일 걸 감안해 `cancelLabel`/`confirmLabel`로 커스터마이즈 가능하게 함.
 *
 * ── 3. 확인 필요 ────────────────────────────────────────────────
 * - 버튼 hover/press/disabled 상태는 이 노드에 없어 Button 컴포넌트 자체의 공용 상태를
 *   그대로 상속(별도 실측 안 함).
 * - Center Modal 내부 구성(테이블만 있는 것/상단바+테이블/폼 등)이 여러 종류라는 담당자
 *   코멘트가 있었음 — 이번 스펙은 "컨테이너 자체의 크기/스크롤 규칙"만 다루므로, 내부
 *   콘텐츠 세분화는 `children`으로 위임(별도 변형 컴포넌트화는 추가 자료 필요 시 진행).
 */

export interface CenterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  cancelLabel?: string;
  /** 취소·X·Esc·배경 클릭에 공통 적용되는 변경 폐기/원상복구 콜백. 실행 후 모달이 닫힌다. */
  onCancel?: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
  /** 완성 화면의 실제 팝업 폭 체계. 기본값은 기존 동작과 같은 960px. */
  size?: CenterModalSize;
  /** 지정하면 기존 취소/저장 2버튼 대신 이 배열을 렌더링한다. 빈 배열은 푸터 없음. */
  actions?: DialogAction[];
  /** 완전한 커스텀 푸터가 필요할 때 사용. actions보다 우선한다. */
  footer?: React.ReactNode;
  /** 제목 아래 구분선 표시 여부. */
  headerDivider?: boolean;
  /** Body padding 책임. 임의 class 조합 대신 의미 기반 계약을 우선 사용한다. */
  bodyPadding?: DialogBodyPadding;
  /** shell은 Body가 스크롤, content는 children이 스크롤을 소유한다. */
  scrollMode?: DialogBodyScrollMode;
  bodyAlign?: DialogBodyAlign;
  /** Figma 원본에 독립적으로 반복되지 않는 실측 폭·높이. size preset보다 우선한다. */
  exactWidth?: number;
  exactHeight?: number;
  maxHeight?: React.CSSProperties["maxHeight"];
  /** @deprecated bodyPadding, scrollMode, bodyAlign로 표현할 수 없는 호환 호출에만 사용한다. */
  contentClassName?: string;
  className?: string;
}

function CenterModal({
  open,
  onOpenChange,
  title,
  children,
  cancelLabel = "취소",
  onCancel,
  confirmLabel = "저장",
  onConfirm,
  size = "standard-960",
  actions,
  footer,
  headerDivider = true,
  bodyPadding = "standard",
  scrollMode = "shell",
  bodyAlign = "center",
  exactWidth,
  exactHeight,
  maxHeight = "80vh",
  contentClassName,
  className,
}: CenterModalProps) {
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
            "fixed left-1/2 top-1/2 z-50 flex w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2",
            "flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_24px_rgba(0,0,0,0.2)]",
            centerModalSizeClasses[size],
            className
          )}
          style={{ maxWidth: exactWidth, height: exactHeight, maxHeight }}
        >
          <div className={cn("flex h-[52px] w-full shrink-0 items-center justify-between py-[10px] pl-5 pr-[14px]", headerDivider && "border-b border-mes-gray-30")}>
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

export { CenterModal, centerModalSizeClasses };
export type { DialogAction } from "./dialog-footer";
export type { DialogBodyAlign, DialogBodyPadding, DialogBodyScrollMode } from "./dialog-body";
