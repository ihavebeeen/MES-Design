"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { IconX } from "../icons/icon-x";

/**
 * MES Center Modal (화면 중앙 기본 팝업, 오가니즘) — Figma 실측 기반
 *
 * 출처: 컴포넌트 라이브러리 파일(qEAQNTqXf76bYydyupti2V) node 168:37994("modal").
 * `docs/신규_컴포넌트_설계_프로세스.md`에 2026-07-27경 이미 기록돼 있던 실측값을
 * 2026-07-29 `get_design_context`로 재조회해 재검증 후 코드화(같은 문서에 "Center Modal과
 * Confirm Dialog 값을 착각해 뒤섞었던" 과거 오류가 기록돼 있어, 재검증 없이 표만 보고
 * 바로 코드화하지 않음).
 *
 * ConfirmDialog(작은 확인/안내 팝업)와는 다른 별도 컴포넌트 — 화면 중앙에 큰 콘텐츠
 * 영역을 채우는 범용 모달(등록/수정 폼, 상세 정보 등)로 쓰임.
 *
 * ── 1. 레이아웃(실측) ──────────────────────────────────────────
 * 전체: 흰 배경, radius **16px**(ConfirmDialog의 12px과 다름 — 과거에 이 둘을 같은
 * 값으로 착각했던 사고가 있어 재차 강조), 그림자 `0px 0px 24px rgba(0,0,0,.2)`(중앙에서
 * 사방으로 퍼지는 형태 — ConfirmDialog의 `0 4px 16px`처럼 아래로 치우치지 않음, offset
 * 없이 spread만 있는 이펙트).
 * - 헤더(52px): 하단 테두리 1px Gray-30(#E4E7EE), 좌측 padding 20px/우측 14px, 상하 10px.
 *   제목 Pretendard Bold 18px Gray-130. 우측 닫기(X) 버튼 32x32 히트영역, 아이콘 20px —
 *   ConfirmDialog와 완전히 동일한 헤더 구조라 그대로 재사용.
 * - 본문: 상/좌우 padding 20px, 하단 padding 없음(콘텐츠 영역과 푸터 사이 간격은 푸터
 *   자체의 위쪽 padding에 위임 — ConfirmDialog에서 담당자가 확정한 "간격은 한쪽만
 *   책임진다" 패턴과 동일). 콘텐츠 영역(placeholder box)은 배경 Gray-20(#EFF2F8),
 *   radius 4px, 높이 326px, padding 좌우 30px/상하 12px — 원본은 "콘텐츠 영역"이라는
 *   플레이스홀더 텍스트만 있는 빈 박스라 실제 사용 시 `children`으로 교체.
 * - 푸터: 상하 padding 16px, 가운데 정렬(justify-center), 버튼 2개 gap 10px, 버튼 각각
 *   고정 너비 **160px**(ConfirmDialog처럼 flex-1로 늘어나지 않음 — 실측 결과 그대로).
 *   취소 버튼은 Button의 `variant="fillGray"`, 저장 버튼은 `variant="fillBlack"`과
 *   완전히 동일한 색상이라 기존 Button 컴포넌트 그대로 재사용.
 *
 * ── 2. 판단값(원본에 명시 안 됨) ──────────────────────────────────
 * - 모달 전체 너비: 실측 노드가 부모 프레임 크기를 그대로 채우는 인스턴스라 고유 너비
 *   토큰이 없었음 — `max-w-[720px]`을 판단값으로 둠(콘텐츠 영역이 326px 높이의 넓은
 *   박스라는 점 고려). 필요하면 `className`으로 덮어쓰기.
 * - 버튼 라벨은 "취소"/"저장"이 원본 그대로지만, 실제 화면마다 삭제/등록 등 다른 동사가
 *   쓰일 걸 감안해 `cancelLabel`/`confirmLabel`로 커스터마이즈 가능하게 함.
 *
 * ── 3. 확인 필요 ────────────────────────────────────────────────
 * - 버튼 hover/press/disabled 상태는 이 노드에 없어 Button 컴포넌트 자체의 공용 상태를
 *   그대로 상속(별도 실측 안 함)
 * - 콘텐츠 영역 스크롤 처리(내용이 326px보다 길 때) 방식은 원본에 없어 `overflow-y-auto`로
 *   판단 처리
 * - 원본은 콘텐츠 영역을 "콘텐츠 영역"이라는 플레이스홀더 텍스트 하나로 가운데 정렬해
 *   보여줬지만, 실제 사용 시 폼/리스트 등 다양한 `children`이 들어올 걸 감안해 가운데
 *   정렬을 강제하지 않음(위쪽 정렬) — 데모에서 플레이스홀더 텍스트만 넣을 땐 원본과
 *   달리 좌상단에 붙어 보일 수 있음, 필요하면 `children`쪽에서 직접 정렬 처리
 */

export interface CenterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  cancelLabel?: string;
  onCancel?: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
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
  className,
}: CenterModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-[720px] -translate-x-1/2 -translate-y-1/2",
            "flex flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_24px_rgba(0,0,0,0.2)]",
            className
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

          <div className="flex w-full shrink-0 flex-col items-center px-5 pt-5">
            <div className="max-h-[326px] w-full overflow-y-auto rounded-[4px] bg-mes-gray-20 px-[30px] py-3">
              {children}
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col items-center justify-center py-4">
            <div className="flex items-center gap-2.5">
              <Button
                variant="fillGray"
                size="basic"
                className="w-[160px]"
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="fillBlack"
                size="basic"
                className="w-[160px]"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { CenterModal };
