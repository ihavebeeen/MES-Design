"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import { NoticeBanner, type NoticeBannerProps } from "./notice-banner";
import { IconExclamationCircle } from "../icons/icon-exclamation-circle";
import { IconX } from "../icons/icon-x";

/**
 * MES ConfirmDialog (확인/안내용 작은 팝업) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 11106:37629("modal-error").
 * Center Modal(화면 중앙을 크게 채우는 큰 팝업, 별도 오가니즘 레벨 컴포넌트)과는 다른,
 * 훨씬 작고 단순한 "안내/확인" 전용 팝업. 최초 실측 인스턴스는 삭제 불가 안내(에러 톤,
 * 버튼 1개) 케이스였고, 2026-07-29에 같은 모달 갤러리(node 18887:62605)를 추가로 확인해
 * 톤 3종(에러/경고/알림)과 확인/취소 2버튼, 안내 배너 통합까지 지원하도록 확장함(아래
 * 3번 섹션 참고). 모바일(배경 딤 처리) 변형은 아직 범위 밖.
 *
 * ── 1. 레이아웃(실측) ──────────────────────────────────────────
 * 전체: 흰 배경, radius 12px, 그림자 `0 4px 16px rgba(0,0,0,.2)`("modal-shadow" 이펙트로
 * Figma에 이름 붙어있음), 너비는 콘텐츠에 따라 최소 400px~최대 700px 사이에서 결정됨.
 * - 헤더(52px): 흰 배경, 하단 테두리 1px Gray-30, 좌측 padding 20px/우측 14px, 상하 10px.
 *   제목 Pretendard Bold 18px Gray-130(text). 우측 닫기(X) 버튼 32x32 히트영역, 아이콘 20px.
 * - 본문: 좌/우/상 padding 32px(원래 실측값은 상하좌우 전부 32px였으나 2026-07-29
 *   담당자가 "본문-버튼 간격이 너무 넓어 보인다"고 지적해 하단만 0으로 바꾸고 푸터의
 *   자체 padding에 간격을 위임 — 아래 3번 섹션 참고), 아이콘(44px)+텍스트 블록 gap 20px.
 *   텍스트 블록 내부 gap 4px: heading(Pretendard SemiBold 16px, Gray-130) +
 *   description(Pretendard Medium, 색 `#696F83`(Figma 토큰명 "mc/100") opacity 80% —
 *   확정 Gray 팔레트 어느 단계와도 일치하지 않는 별도 색상이라 팔레트에 편입시키지 않고
 *   원본값 그대로 둠)
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
 * ── 3. 2026-07-29 확장: 톤 3종 + 안내 배너 ────────────────────────
 * 담당자가 준 Figma 링크(node 18887:62605, "모달" 갤러리)를 확인한 결과, 이 컴포넌트는
 * 이미 대부분의 변형을 지원하고 있었음이 드러남:
 * - **확인/취소 2버튼**: 원래부터 `actions`가 배열이라 2개 넣으면 그대로 됨 — 새 코드
 *   불필요. 데모에 `[{label:"취소", variant:"fillGray"}, {label:"확인", variant:"fillBlack"}]`
 *   예시만 추가.
 * - **톤(아이콘 색)**: 실제로는 에러(빨강)/경고(주황)/알림(파랑) 3종이 전부 같은
 *   `IconExclamationCircle`을 색만 바꿔 재사용하고 있었음(아이콘 벡터 자체는 currentColor
 *   단일 컬러라 배경원+느낌표가 한 path — 교체 필요 없음). `tone` prop을 추가해
 *   error(기존, Danger-60)/warning(신규, Yellow-50)/info(신규, Primary-60) 지원.
 *   Yellow-50(#F2A406)은 이번에 처음 확인된 색이라 `globals.css`에 Yellow 팔레트(10/20/50만,
 *   전 단계 아님) 신설.
 * - **안내 배너**: "라벨 생성 불가" 모달 하단에 노란 배너(안내문 + "OO 바로가기 →" 링크)가
 *   붙는 패턴이 있고, 같은 배너가 모달과 별개로 독립 컴포넌트로도 존재 확인 — 별도
 *   `notice-banner.tsx`(`NoticeBanner`)로 분리 구현하고, `banner` prop으로 ConfirmDialog
 *   본문과 푸터 사이에 선택적으로 끼워 넣을 수 있게 함. 담당자 호칭으로는 "도움말"/
 *   "툴팁"이라고 부름(컴포넌트명 `NoticeBanner`는 그대로 유지, 명칭만 참고).
 * - `get_metadata`/`get_design_context`가 이 노드에서 응답 크기 문제로 계속 실패해서
 *   (SSE 파싱 에러) 배너 자체의 정확한 padding/radius px, 배너 아이콘 벡터는 못 가져와서
 *   스크린샷 육안 대조 기반 판단값으로 구현(자세한 내용은 `notice-banner.tsx` 참고).
 *   다만 "배너가 있을 때 배너-버튼 간격"은 담당자가 정확한 값(20px)을 직접 줘서 확정
 *   반영함(위 렌더 코드의 `px-8` 부분 — 별도 하단 padding 없이 푸터 자체의 20px만으로
 *   맞춤). 모바일(배경 딤 처리) 변형은 이번 라운드 범위 밖(담당자 확인, 다음에 진행).
 * - (곧바로 이어서) 담당자가 배너 없는 일반 형태도 "본문-버튼 간격이 40px쯤 되어 보인다,
 *   20px로 하자"고 지적 — 애초 32px(본문 하단)+20px(푸터 상단)=52px는 원본
 *   node 11106:37629를 그대로 실측한 값이었지만(임의 판단 아니었음), 담당자가 명시적으로
 *   더 좁은 값(20px)으로 바꾸자고 확정 지시해서 그대로 반영. 배너 케이스와 동일하게
 *   본문 하단 padding을 0으로 없애고 푸터 자체의 20px(pt)만으로 간격을 맞춤 — 즉 이제는
 *   Figma 원본 실측치(52px)보다 담당자 지정값(20px)이 우선.
 */

export interface ConfirmDialogAction {
  label: string;
  onClick?: () => void;
  variant?: ButtonProps["variant"];
}

export type ConfirmDialogTone = "error" | "warning" | "info";

const TONE_ICON_COLOR: Record<ConfirmDialogTone, string> = {
  error: "text-mes-text-danger",
  warning: "text-mes-icon-warning",
  info: "text-mes-text-brand",
};

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  heading: string;
  description?: string;
  actions?: ConfirmDialogAction[];
  /** 본문 아이콘 색 — error(기본, 빨강)/warning(주황)/info(파랑). 2026-07-29 추가 */
  tone?: ConfirmDialogTone;
  /** 본문과 버튼 사이에 끼워 넣는 안내 배너(선택). 2026-07-29 추가 */
  banner?: Pick<NoticeBannerProps, "message" | "linkLabel" | "onLinkClick" | "href">;
  /** 기본 아이콘·문구 본문 대신 렌더링할 합성 콘텐츠. ConfirmDialog 외곽 규격은 유지한다. */
  children?: React.ReactNode;
  /** actions 대신 사용할 완전한 커스텀 푸터. */
  footer?: React.ReactNode;
  /** X·Esc·배경 클릭에 공통 적용되는 변경 폐기 콜백. */
  onCancel?: () => void;
  className?: string;
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  heading,
  description,
  actions = [{ label: "확인", variant: "fillBlack" }],
  tone = "error",
  banner,
  children,
  footer,
  onCancel,
  className,
}: ConfirmDialogProps) {
  const dismiss = React.useCallback(() => {
    onCancel?.();
    onOpenChange(false);
  }, [onCancel, onOpenChange]);
  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (nextOpen) onOpenChange(true);
    else dismiss();
  }, [dismiss, onOpenChange]);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 min-w-[400px] max-w-[700px] -translate-x-1/2 -translate-y-1/2",
            "flex flex-col overflow-hidden rounded-mes-modal-sm bg-white shadow-mes-modal-sm",
            className
          )}
        >
          <div className="flex h-[52px] w-full shrink-0 items-center justify-between border-b border-mes-border-default py-[10px] pl-mes-dialog-x pr-mes-dialog-header-end">
            <DialogPrimitive.Title className="flex-1 text-[18px] font-bold leading-[1.5] text-mes-text-default">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="닫기"
                className="flex size-8 shrink-0 items-center justify-center text-mes-text-default"
              >
                <IconX size={20} />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* 2026-07-29 담당자 확인: 배너가 없을 때도 본문-버튼 간격은 20px여야 함(기존
              32+20=52px는 너무 넓어 보인다는 지적) — 배너 케이스와 동일한 방식으로,
              본문 쪽엔 하단 padding을 주지 않고 푸터 자체의 pt(p-mes-dialog-x=20px)만으로 맞춤.
              배너가 있을 땐 본문→배너 간격 20px(pb-mes-dialog-x)은 그대로 유지. */}
          {children ?? (
            <>
              <div
                className={cn(
                  "flex shrink-0 items-center gap-mes-dialog-x px-8 pt-8",
                  banner ? "pb-mes-dialog-x" : "pb-0"
                )}
              >
                <IconExclamationCircle size={44} className={cn("shrink-0", TONE_ICON_COLOR[tone])} />
                <div className="flex flex-col gap-1">
                  <p className="text-[16px] font-semibold leading-[1.5] text-mes-text-default">
                    {heading}
                  </p>
                  {description && (
                    <p className="text-[14px] font-medium leading-[1.5] text-[#696f83] opacity-80">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* 담당자 확인(2026-07-29): 이 영역(담당자 호칭 "도움말"/"툴팁")이 있을 땐 그
                  아래 버튼 영역까지 간격이 20px여야 함 — 아래쪽엔 별도 padding을 주지 않고
                  푸터 자체의 pt(p-5 = 20px)만으로 정확히 20px를 맞춤. */}
              {banner && (
                <div className="px-8">
                  <NoticeBanner {...banner} />
                </div>
              )}
            </>
          )}

          {footer ?? (
            <div className="flex w-full shrink-0 items-center gap-2 p-mes-dialog-x">
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
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { ConfirmDialog };
