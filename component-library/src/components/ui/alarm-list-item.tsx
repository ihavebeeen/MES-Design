"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MES AlarmListItem (알람/경보 리스트 항목) — Figma 실측 기반
 *
 * 출처: 컴포넌트 라이브러리 파일(qEAQNTqXf76bYydyupti2V) node 163:3039("MES 알람 리스트").
 * 고정 너비 400px, 하단 테두리 1px Gray-30, padding 8px. 좌측 tone 강조바(4px×42px,
 * radius 2px) + gap 16px + 텍스트 블록(제목 14px SemiBold / 시각 12px / 설명 13px,
 * line-height 1.5, 자간 0 — 시스템 전역 표준). tone 4색 blue `#4A90E2` / red `#E15B5B` /
 * yellow `#E99B41` / green `#4BB866`(`globals.css` `--mes-alarm-*`, 확정 팔레트와 별도).
 * hover 시 배경 한 단계 진하게. 전체가 `<button>`으로 클릭 가능.
 * "두줄"(원본 Figma의 설명 아래 2번째 줄) → `secondaryDescription`(선택) prop.
 *
 * 2026-08-03: Figma엔 흐림 처리된 `read=false` variant(배경 Gray-10, 텍스트/강조바 흐림)도
 * 있었지만, 실제 서비스엔 그 상태가 구현되어 있지 않음(담당자 확인: "디자인으로는 있는데
 * 실제 구현은 그렇게 안 됐다") — 실제 알람 항목엔 상태가 두 가지뿐: 기본(강조바 있는 원래
 * 상태) / 클릭하면 목록에서 사라짐(`NotificationPanel`의 `onItemClick`). 그래서 `read`
 * prop과 흐림 스타일을 컴포넌트에서 제거.
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
  /** 설명 아래 2번째 줄(원본 Figma "두줄") */
  secondaryDescription?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function AlarmListItem({
  tone,
  title,
  time,
  description,
  secondaryDescription,
  onClick,
  className,
}: AlarmListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full max-w-[400px] items-center gap-4 border-b border-mes-border-default bg-white p-2 text-left transition-colors hover:bg-mes-gray-10",
        className
      )}
    >
      <span
        className={cn("h-[42px] w-1 shrink-0 rounded-mes-control-xs", ALARM_TONE_BAR[tone])}
        aria-hidden
      />
      <span className="flex min-w-0 flex-1 flex-col leading-[1.5]">
        <span className="flex items-start gap-4">
          <span className="text-[14px] font-semibold text-mes-text-default">{title}</span>
          <span className="text-[12px] text-mes-gray-80">{time}</span>
        </span>
        <span className="flex items-center text-[13px] text-mes-text-default">
          {description}
        </span>
        {secondaryDescription && (
          <span className="text-[13px] text-mes-text-default">{secondaryDescription}</span>
        )}
      </span>
    </button>
  );
}

export { AlarmListItem };
