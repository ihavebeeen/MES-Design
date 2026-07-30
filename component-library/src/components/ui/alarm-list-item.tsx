"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES AlarmListItem (알람/경보 리스트 항목) — Figma 실측 기반, 2026-07-30 신규
 *
 * 출처: 클라우드MES 파일이 아니라 컴포넌트 라이브러리 파일(qEAQNTqXf76bYydyupti2V) node
 * 163:3039("MES 알람 리스트") 하위 "알람 리스트 컴포넌트 - 원본" — tone(blue/red/yellow/green)
 * × hover(on/off) × read(on/off) × 두줄(on/off) 조합으로 총 32개 variant가 실제로 존재하는
 * 컴포넌트 세트. 이번 배치는 "컴포넌트부터 모으자"는 지시로 담당자의 새 Figma 링크 없이
 * 기존 두 파일을 metadata로 직접 훑다가 발견 — 체크리스트의 "Notification/Bell"(없음) 및
 * MES 도메인 특화 패턴의 "16-2. 알람·경보" 항목에 해당하는 컴포넌트로 판단해 코드화함.
 *
 * ── 1. 레이아웃(실측, 2026-07-30 담당자가 실제 서비스 화면 기준으로 재수정) ──────
 * 고정 너비 400px(패널 폭에 맞춘 값), 하단 테두리 1px Gray-30(#E4E7EE), padding 8px.
 * 좌측 4px 폭 × 42px 높이(실측 41.78px를 반올림)의 tone 강조바(radius 2px) + gap 16px +
 * 텍스트 블록. 텍스트 블록 폰트 크기는 3단계로 분리(처음엔 전부 15px로 잘못 통일했었음):
 * 제목(SemiBold) 14px / 날짜(Regular) 12px / 설명(본문) 13px — line-height 1.5.
 * 자간은 실측상 -0.1875px였으나 담당자가 "자간은 0, 행간은 150%로 통일"이라고 확정해
 * 2026-07-30에 제거함(시스템 전역 자간0/행간150% 표준 — Foundation 섹션/토큰 문서 참고).
 *
 * ── 2. tone 색상(4종, 실측 — 확정 팔레트와 무관한 별도 alarm 색상군) ──
 * blue `#4A90E2` / red `#E15B5B` / yellow `#E99B41` / green `#4BB866` — `globals.css`에
 * `--mes-alarm-*`로 신설(Primary-60/Danger-60 등과 값이 달라 기존 팔레트에 편입하지 않음).
 *
 * ── 3. read 상태(2종) — 명칭과 실제 시각 효과가 반대로 느껴져 확인 필요 ──
 * Figma 프로퍼티명은 `read`지만, 실측 결과:
 * - `read=true`(진하게 강조): 배경 흰색 + 좌측 tone 강조바 있음 + 제목 Gray-130(진하게) +
 *   시각 Gray-80
 * - `read=false`(흐리게): 배경 Gray-10(#F8FAFC) + 강조바 없음(4개 tone 전부 시각적으로
 *   동일하게 무채색 처리) + 전체 텍스트 Gray-60(#99A3B8, 흐림)
 * → 상식적으로는 "읽음(read)"일 때 흐려지는 게 자연스러운데 실측은 반대라 `read` prop을
 *   문자 그대로 두되, 진짜 의미(예: "강조 표시 여부"의 오기 명명일 가능성)는 담당자 확인
 *   필요 — 체크리스트에 "확인 필요"로 등록.
 *
 * ── 4. hover 상태 ──────────────────────────────────────────────
 * 배경이 한 단계 더 진해짐(그 외 스타일은 hover 직전 read 상태를 그대로 유지) — 토큰
 * 규칙표의 "hover는 배경만 한 단계 진하게" 레시피와 일치. 전체 항목이 `<button>`으로
 * 클릭 가능한 걸로 실측됨(리스트 항목 클릭 시 상세 이동 등으로 추정).
 *
 * ── 5. 두줄(twoLine) — 정확한 용도 확인 필요 ────────────────────
 * 원본엔 설명 아래에 "두줄"이라는 플레이스홀더 텍스트가 그대로 있어(디자이너의 메모로
 * 추정), 실제 프로덕션 문구가 아님 — 설명이 2줄까지 필요한 경우를 위한 슬롯으로 판단해
 * `secondaryDescription`(선택) prop으로 구현. 실제 용도가 다르면 교체 필요.
 *
 * ── 6. 확인 필요 ────────────────────────────────────────────────
 * - `read` prop의 실제 의미(읽음/안읽음 중 무엇인지)
 * - "두줄"의 정확한 용도
 * - 알람 아이콘(벨 등)이 별도로 붙는지 — 이번 실측 범위엔 아이콘 없이 강조바만 존재
 */

export type AlarmTone = "blue" | "red" | "yellow" | "green";

const ALARM_TONE_BAR: Record<AlarmTone, string> = {
  blue: "bg-mes-alarm-blue",
  red: "bg-mes-alarm-red",
  yellow: "bg-mes-alarm-yellow",
  green: "bg-mes-alarm-green",
};

export interface AlarmListItemProps {
  tone: AlarmTone;
  title: string;
  time: string;
  description: React.ReactNode;
  /** 정확한 용도 확인 필요 — 설명 아래 2번째 줄(원본엔 "두줄" placeholder만 있었음) */
  secondaryDescription?: React.ReactNode;
  /** Figma 프로퍼티명 그대로 유지 — 실제 의미(읽음/강조 여부)는 확인 필요, 기본 true(강조) */
  read?: boolean;
  onClick?: () => void;
  className?: string;
}

function AlarmListItem({
  tone,
  title,
  time,
  description,
  secondaryDescription,
  read = true,
  onClick,
  className,
}: AlarmListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full max-w-[400px] items-center gap-4 border-b border-mes-gray-30 p-2 text-left transition-colors",
        read ? "bg-white hover:bg-mes-gray-10" : "bg-mes-gray-10 hover:bg-mes-gray-20",
        className
      )}
    >
      {read && (
        <span
          className={cn("h-[42px] w-1 shrink-0 rounded-[2px]", ALARM_TONE_BAR[tone])}
          aria-hidden
        />
      )}
      <span className="flex min-w-0 flex-1 flex-col leading-[1.5]">
        <span className="flex items-start gap-4">
          <span
            className={cn(
              "text-[14px] font-semibold",
              read ? "text-mes-gray-130" : "text-mes-gray-60"
            )}
          >
            {title}
          </span>
          <span className={cn("text-[12px]", read ? "text-mes-gray-80" : "text-mes-gray-60")}>
            {time}
          </span>
        </span>
        <span
          className={cn(
            "flex items-center text-[13px]",
            read ? "text-mes-gray-130" : "text-mes-gray-60"
          )}
        >
          {description}
        </span>
        {secondaryDescription && (
          <span className={cn("text-[13px]", read ? "text-mes-gray-130" : "text-mes-gray-60")}>
            {secondaryDescription}
          </span>
        )}
      </span>
    </button>
  );
}

export { AlarmListItem };
