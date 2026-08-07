"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconSearch } from "../icons/icon-search";
import { IconX } from "../icons/icon-x";

/**
 * MES SearchInput (표 상단 검색창) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v), data-name "Input Textbox".
 * 담당자가 두 번에 걸쳐 각각 다른 노드로 짚어줌 — 둘 다 같은 컴포넌트의 같은 상태(값
 * 입력됨) 인스턴스: node 17360:46256(그룹화 조회/빠른 조회 데모 조사 중 같은 상단바
 * 우측 끝에서 발견) / node 20186:68084(담당자가 "이게 검색창"이라고 직접 지정).
 * 두 인스턴스 실측값이 완전히 동일(200×32px, 배경/테두리/텍스트 전부 일치)해 하나의
 * 컴포넌트로 확정.
 *
 * ── 1. 레이아웃(실측) ──────────────────────────────────────────────
 * 기본 크기 200×32px(하그 아님 — 다른 컴포넌트들과 달리 폭 고정), radius 3px.
 * 좌측: 검색 아이콘(`mes/icon-search`, 16px, 좌 padding 12px) + gap 8px + 입력 텍스트
 * (Pretendard Medium 16px, Gray-130). 우측: 닫기(X) 버튼(32×32 히트영역, 아이콘 16px).
 *
 * ── 2. 담당자가 설명한 핵심 동작(2026-08-03) ──────────────────────────
 * "검색창에 검색어를 명확하게 입력했다는 걸 보여주기 위해, 검색어를 입력하면
 * 백그라운드컬러를 깔게 되어있음" — 즉 이 컴포넌트는 값이 있고/없고에 따라 배경이
 * 바뀌는 2-상태 컴포넌트:
 * - **값 있음(실측)**: 배경 Primary-20(#E8F5FF), 테두리 1px Primary-30(#C7E4FF) — 두
 *   노드 모두 이 상태("숯불치킨 뚜껑" 예시 텍스트)로 캡처돼 있었음.
 * - **값 없음(판단값 — 이 상태의 실측 노드는 없음)**: 기존 `Input`/`Select` 컴포넌트의
 *   기본 상태 규격(배경 흰색, 테두리 1px Gray-30)을 그대로 재사용해 일관성 맞춤.
 * 닫기(X) 버튼도 값이 없을 때 지울 게 없으므로 값이 있을 때만 노출(판단값 — 실측
 * 노드 자체엔 상태 구분 없이 항상 있었지만, 빈 검색창에 X가 떠 있는 건 다른 입력형
 * 컴포넌트 관례와 안 맞아 조건부로 처리).
 *
 * ── 3. 다른 트리거 바 컴포넌트와의 배치 차이 ─────────────────────────
 * `GroupQuery`/`QuickQuery`/`Filter`는 전부 내용에 따라 폭이 늘어나는 hug-width인 반면,
 * 기본은 고정폭 200px이다. 완성 화면 node 20274:73333에서 327×32px 인스턴스가 추가로
 * 확인되어 화면 slot이 폭을 소유할 수 있도록 `width="fill"`을 지원한다.
 */

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: "fixed" | "fill";
}

function SearchInput({
  value,
  onChange,
  placeholder = "검색어를 입력하세요",
  width = "fixed",
  className,
}: SearchInputProps) {
  const hasValue = value.length > 0;

  return (
    <div
      className={cn(
        "flex h-8 shrink-0 items-center justify-between self-start rounded-mes-control-sm border transition-colors",
        width === "fill" ? "w-full" : "w-[200px]",
        hasValue
          ? "border-mes-primary-30 bg-mes-bg-brand-subtle-strong"
          : "border-mes-border-default bg-white",
        className
      )}
    >
      <div className="flex h-full min-w-0 flex-1 items-center gap-2">
        <span className="flex h-full shrink-0 items-center pl-3">
          <IconSearch size={16} className="text-mes-gray-70" />
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] font-medium text-mes-text-default outline-none placeholder:font-normal placeholder:text-mes-text-placeholder"
        />
      </div>
      {hasValue && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => onChange("")}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-mes-text-default"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}

export { SearchInput };
