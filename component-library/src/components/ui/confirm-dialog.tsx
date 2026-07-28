"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import { IconExclamationCircle } from "../icons/icon-exclamation-circle";
import { IconX } from "../icons/icon-x";

/**
 * MES ConfirmDialog (확인/안내용 작은 팝업) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 11106:37629("modal-error").
 * Center Modal(화면 중앙을 크게 채우는 큰 팝업, 별도 오가니즘 레벨 컴포넌트)과는 다른,
 * 훨씬 작고 단순한 "안내/확인" 전용 팝업. 실측 인스턴스는 삭제 불가 안내(에러 톤, 버튼
 * 1개) 케이스라 이 컴포넌트도 우선 그 형태로 구현함 — 확인/취소 2버튼 형태나 에러가 아닌
 * 다른 톤(성공/정보)은 이번 실측 범위 밖(체크리스트에 별도 확인 필요 항목으로 등록).
 *
 * ── 1. 레이아웃(실측) ──────────────────────────────────────────
 * 전체: 흰 배경, radius 12px, 그림자 `0 4px 16px rgba(0,0,0,.2)`("modal-shadow" 이펙트로
 * Figma에 이름 붙어있음), 너비는 콘텐츠에 따라 최소 400px~최대 700px 사이에서 결정됨.
 * - 헤더(52px): 흰 배경, 하단 테두리 1px Gray-30, 좌측 padding 20px/우측 14px, 상하 10px.
 *   제목 Pretendard Bold 18px Gray-130(text). 우측 닫기(X) 버튼 32x32 히트영역, 아이콘 20px.
 * - 본문: padding 32px, 아이콘(44px)+텍스트 블록 gap 20px. 텍스트 블록 내부 gap 4px:
 *   heading(Pretendard SemiBold 16px, Gray-130) + description(Pretendard Medium, 색
 *   `#696F83`(Figma 토큰명 "mc/100") opacity 80% — 확정 Gray 팔레트 어느 단계와도
 *   일치하지 않는 별도 색상이라 팔레트에 편입시키지 않고 원본값 그대로 둠)
 * - 푸터: padding 20px, 버튼 높이 40px(Button 컴포넌트의 size="basic"와 동일 규격),
 *   버튼이 1개일 땐 너비 100%(flex-1)
 *
 * ── 2. 아이콘/색상(2026-07-28 실제 SVG로 교체) ───────────────────
 * 본문 아이콘은 "mes/icon-exclamation-circle"(Toast RED와 동일 계열) — 담당자가 Figma에서
 * 직접 SVG export한 실측 벡터(`IconExclamationCircle`)로 교체, 색은 Danger-60 그대로 유지.
 * 헤더 닫기 아이콘도 실제 SVG(`IconX`)로 교체, Figma "Property 1=black" 명명대로 Gray-130 처리.
 * 푸터 버튼 배경(#011327)은 확정 Gray-130과 정확히 일치 — Button 컴포넌트의
 * variant="fillBlack"과 동일해서 그대로 재사용함.
 *
 * ── 3. 확인 필요 ────────────────────────────────────────────────
 * - 확인/취소 2버튼 형태의 Confirm Dialog가 별도로 있는지(체크리스트 원래 설명엔 "삭제
 *   모달 - 드롭다운/라디오버튼" 2종이 언급돼 있었는데 이번 실측 대상과 다른 것으로 보임)
 * - 에러가 아닌 성공/정보 톤의 안내 모달이 별도로 있는지
 */

export interface ConfirmDialogAction {
  label: string;
  onClick?: () => void;
  variant?: ButtonProps["variant"];
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  heading: string;
  description?: string;
  actions?: ConfirmDialogAction[];
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  heading,
  description,
  actions = [{ label: "확인", variant: "fillBlack" }],
}: ConfirmDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 min-w-[400px] max-w-[700px] -translate-x-1/2 -translate-y-1/2",
            "flex flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
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

          <div className="flex shrink-0 items-center gap-5 p-8">
            <IconExclamationCircle size={44} className="shrink-0 text-mes-danger-60" />
            <div className="flex flex-col gap-1">
              <p className="text-[16px] font-semibold leading-[1.5] text-mes-gray-130">
                {heading}
              </p>
              {description && (
                <p className="text-[14px] font-medium leading-normal text-[#696f83] opacity-80">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full shrink-0 items-center gap-2 p-5">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant ?? "fillBlack"}
                size="basic"
                onClick={action.onClick}
                className="flex-1"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { ConfirmDialog };
