import * as React from "react";
import { cn } from "@/lib/utils";
import { IconExclamationCircle } from "../icons/icon-exclamation-circle";

/**
 * MES NoticeBanner (안내 배너, 링크 포함) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 18887:62605("모달" 갤러리 프레임).
 * ConfirmDialog(라벨 생성 불가 등)의 본문 하단에 붙어서 쓰이기도 하고, 같은 프레임 안에
 * 독립된 박스로도 따로 존재해서 "모달 전용"이 아니라 범용 안내 배너로 판단해 별도
 * 컴포넌트로 분리함(2026-07-29, 담당자 확인: "안내 배너 컴포넌트도 함께"). 담당자는 이
 * 영역을 "배너"보다 "도움말"/"툴팁"이라고 부름 — 컴포넌트명(`NoticeBanner`)은 그대로 두고
 * 참고용으로 기록. ConfirmDialog에 이 컴포넌트가 들어갈 때 아래쪽 버튼 영역과의 간격은
 * 담당자가 확정한 20px(`confirm-dialog.tsx`에서 처리, 이 컴포넌트 자체의 margin은 아님).
 *
 * ── 1. 실측/판단 근거 ────────────────────────────────────────────
 * - 색상은 `get_variable_defs`로 확정: 배경 Yellow-10(#FFF3DB), 테두리 Yellow-20(#FFE0A3),
 *   아이콘 Yellow-50(#F2A406) — globals.css에 새 Yellow 팔레트(10/20/50만) 추가.
 * - `get_metadata`/`get_design_context`가 이 노드에서 응답 크기 문제로 계속 실패해서
 *   (SSE 파싱 에러) 정확한 padding/radius/폰트 px, 배너 아이콘의 정확한 벡터는 이번엔
 *   가져오지 못함 — 스크린샷 육안 대조로 레이아웃만 판단 구현(라벨/구조는 실측, 세부
 *   수치는 판단값). 아이콘은 새로 벡터를 만들지 않고 기존 `IconExclamationCircle`을
 *   작게(16px) 재사용 — 실제 벡터가 다르면(예: 전구 아이콘 등) 나중에 교체 필요.
 * - 텍스트는 줄바꿈되고, 링크("조설정 바로가기 →" 같은 형태)는 배너 우측 하단에
 *   오른쪽 정렬로 별도 줄에 위치.
 *
 * ── 2. 확인 필요 ────────────────────────────────────────────────
 * - 배너 아이콘의 정확한 형태(전구/느낌표 등), padding/radius 정확한 px 값
 * - 링크에 화살표(→)가 아이콘인지 텍스트인지 — 우선 텍스트로 처리
 */

export interface NoticeBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  message: React.ReactNode;
  linkLabel?: string;
  onLinkClick?: () => void;
  href?: string;
}

const NoticeBanner = React.forwardRef<HTMLDivElement, NoticeBannerProps>(
  ({ className, message, linkLabel, onLinkClick, href, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col gap-1 rounded-lg border border-mes-yellow-20 bg-mes-yellow-10 p-3",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-1.5">
        <IconExclamationCircle size={16} className="mt-0.5 shrink-0 text-mes-yellow-50" />
        <p className="text-[13px] leading-[1.4] text-mes-gray-110">{message}</p>
      </div>
      {linkLabel && (
        <div className="flex justify-end">
          {href ? (
            <a
              href={href}
              onClick={onLinkClick}
              className="text-[13px] font-semibold text-mes-primary-60 underline-offset-2 hover:underline"
            >
              {linkLabel} →
            </a>
          ) : (
            <button
              type="button"
              onClick={onLinkClick}
              className="text-[13px] font-semibold text-mes-primary-60 underline-offset-2 hover:underline"
            >
              {linkLabel} →
            </button>
          )}
        </div>
      )}
    </div>
  )
);
NoticeBanner.displayName = "NoticeBanner";

export { NoticeBanner };
