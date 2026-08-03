"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { IconStar } from "../icons/icon-star";
import { IconX } from "../icons/icon-x";

/**
 * MES QuickQuery (빠른 조회) — Figma 실측 기반
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v), 담당자가 준 링크 node 17360:46222
 * ("빠른 조회" 섹션, "조회 조건을 즐겨찾기로 설정" 기능). 섹션 노드라 최초 응답은 메타데이터만
 * 있는 sparse 응답이었고, 실제 스타일은 하위 노드를 별도로 재조회해서 얻음:
 * - 트리거 바: node 17360:46223 하위 17360:46359("Frame 2085673975")
 * - 프리셋 관리 모달: node 17963:81433("라디오버튼버전", 4개 인스턴스 중 1개 — 나머지 3개도
 *   동일 구조라 대표로 이거 하나만 상세 조회함)
 *
 * ── 1. 트리거 바(실측) ─────────────────────────────────────────────
 * 전체 박스: 테두리 1px Gray-30, radius 4px, 높이 32px, overflow-clip.
 * - 1번 셀: 우측 구분선(Gray-30), 좌우 padding 12px, gap 6px: 북마크 아이콘(`mes/icon-star`,
 *   16px) + "빠른 조회" 라벨(14px Medium Gray-130).
 * - 2번 셀: 좌우 padding 10px, gap 8px: 저장된 프리셋 칩 최대 3개 + 설정(톱니) 아이콘(20px).
 *   칩 2가지 상태(실측): **적용중**(bg Primary-60 채움, 텍스트 흰색, 우측에 해제(X) 버튼) /
 *   **미적용**(bg Gray-10, 테두리 Gray-30, 텍스트 Gray-70, 클릭하면 그 프리셋을 적용).
 *   톱니 아이콘: Figma 벡터가 시스템 세팅 아이콘과 다른 전용 소스라 정확한 path를 못 받아옴
 *   (Sidebar의 `SidebarSettingsIcon`과 동일한 상황) — Sidebar와 동일하게 `lucide-react`의
 *   `Settings`를 임시 placeholder로 사용(판단값, 실제 SVG 확보되면 교체).
 *
 * ── 2. 조회 조건 프리셋 모달(실측: node 17963:81433) ─────────────────
 * 전체: 흰 배경, radius 16px + 그림자 `0px 0px 24px 0px rgba(0,0,0,0.2)` — 이 값은 기존
 * `RadioChoiceDialog`가 쓰는 `rounded-mes-modal-lg`/`shadow-mes-modal-lg` 토큰과 정확히
 * 일치해 새 토큰을 만들지 않고 그대로 재사용함.
 * - 헤더(52px): 다른 모달들과 동일 패턴(하단 테두리 Gray-30, 제목 18px Bold, 좌20/우14 패딩).
 *   ⚠ 이 노드의 실측 코드엔 닫기(X) 버튼이 안 보였음(캡처 누락인지, 원래 없는건지 불확실) —
 *   다른 모든 모달(ConfirmDialog/RadioChoiceDialog)에 전부 있어서 일관성을 위해 그대로
 *   추가함(이 부분만 판단값, 나머지 헤더 규격은 실측).
 * - 본문: padding 20px, 내부 너비 440px 고정, 프리셋 행 3개 세로 gap 10px. 행 3가지 상태(실측):
 *   1) **미설정**: 테두리 Gray-30, 좌측 체크박스형 아이콘(`mes/icon-checkcyc`, 기존 Checkbox
 *      컴포넌트와 동일 소스라 재사용) + "설정 N"(Gray-90) + "미설정"(Gray-60). 우측
 *      아웃라인 뱃지형 버튼 "현재 조건 지정"(흰 배경/테두리·텍스트 Primary-60, 80px).
 *   2) **저장됨(조회용)**: 테두리 Gray-30, 좌측 아이콘 + "설정 N"(Gray-90) + 프리셋
 *      이름(Gray-130). 우측 채움 뱃지형 버튼 "삭제"(bg Gray-40, 텍스트 Gray-110, 80px).
 *      아래 Gray-10 박스에 저장된 조건 요약(그룹화/필터/조회 3줄, 각 줄 라벨 뱃지 +
 *      상세 텍스트, 필드 사이 세로 구분선).
 *   3) **저장 중(이 슬롯에 현재 조건을 새로 지정하는 중)**: 테두리 Primary-60(파랑, 선택
 *      강조), "설정 N" + 이름 입력란(Input, placeholder "설정 설명 입력") + 우측 채움
 *      뱃지형 버튼 "저장"(bg Primary-60, 흰 텍스트, 80px). 아래 Gray-10 박스엔 현재
 *      조건 미리보기(그룹화 요약 1줄만 실측 확인됨 — 필터/조회 요약 줄도 값이 있으면
 *      같은 패턴으로 추가될 것으로 판단, 미실측).
 * - 푸터: padding 상하 16px, 버튼 2개 가운데 정렬 gap 10px, 각 160×40px — 기존 Button
 *   컴포넌트 `size="basic"` variant `fillGray`("취소")/`fillBlack`("저장") 그대로 재사용.
 *
 * ── 3. 인터랙션(정적 실측엔 없어 판단으로 채운 부분) ──────────────────
 * Figma는 3가지 행 상태의 정적 스냅샷만 제공하고 클릭 흐름 자체는 없어서, 아래 흐름은
 * 프로젝트 관례(다른 관리형 팝업들의 "행 내부에서 즉시 반영, 하단 버튼은 닫기 전용" 패턴)에
 * 맞춰 판단 구현함:
 * - 미설정 행의 "현재 조건 지정" 클릭 → 그 행이 "저장 중" 상태로 전환(이름 입력 노출).
 * - 저장 중 행의 "저장" 클릭 → `onSaveSlot(id, name)` 즉시 호출 후 편집 모드 해제(값 반영은
 *   호출부 책임).
 * - 저장됨 행의 "삭제" 클릭 → `onDelete(id)` 즉시 호출(별도 확인 다이얼로그 없음 — 필요하면
 *   호출부에서 ConfirmDialog로 감싸 쓰면 됨).
 * - 푸터 취소/저장 버튼은 진행 중이던 이름 입력을 버리고 모달을 닫기만 함(행 내부 액션들은
 *   이미 즉시 반영됐으므로 별도 커밋 로직 불필요).
 */

export interface QuickQueryPreset {
  id: string;
  label: string;
}

export interface QuickQueryProps {
  /** 저장된 프리셋 최대 3개 */
  presets: QuickQueryPreset[];
  /** 현재 적용 중인 프리셋 id(없으면 null) */
  activeId: string | null;
  onApply: (id: string) => void;
  onClearActive: () => void;
  onSettingsClick: () => void;
  className?: string;
}

function QuickQuery({
  presets,
  activeId,
  onApply,
  onClearActive,
  onSettingsClick,
  className,
}: QuickQueryProps) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center overflow-clip rounded-mes-control border border-mes-border-default",
        className
      )}
    >
      <div className="flex h-full items-center gap-[6px] border-r border-mes-border-default px-3">
        <IconStar size={16} className="shrink-0 text-mes-text-default" />
        <span className="whitespace-nowrap text-[14px] font-medium text-mes-text-default">
          빠른 조회
        </span>
      </div>
      <div className="flex h-full items-center gap-2 px-[10px]">
        {presets.map((preset) => {
          const isActive = preset.id === activeId;
          return isActive ? (
            <span
              key={preset.id}
              className="inline-flex h-[22px] items-center gap-[3px] rounded-mes-control-sm bg-mes-bg-brand py-px pl-2 pr-[3px] text-[13px] font-medium text-white"
            >
              {preset.label}
              <button
                type="button"
                aria-label="적용 해제"
                onClick={onClearActive}
                className="inline-flex shrink-0 items-center justify-center p-[5px] text-white"
              >
                <IconX size={12} />
              </button>
            </span>
          ) : (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApply(preset.id)}
              className="inline-flex h-[22px] items-center rounded-mes-control-sm border border-mes-border-default bg-mes-bg-subtler px-2 text-[13px] font-medium text-mes-gray-70"
            >
              {preset.label}
            </button>
          );
        })}
        <button
          type="button"
          aria-label="빠른 조회 설정"
          onClick={onSettingsClick}
          className="flex shrink-0 items-center justify-center text-mes-text-default"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}

export interface QuickQuerySlotDetail {
  grouping?: string;
  filters?: { label: string; count: number }[];
  view?: { hidden?: number; total?: number; reordered?: number };
}

export interface QuickQuerySlot {
  id: string;
  /** null이면 미설정(빈 슬롯) */
  name: string | null;
  detail?: QuickQuerySlotDetail;
}

export interface QuickQueryPresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slots: QuickQuerySlot[];
  onDelete: (id: string) => void;
  onSaveSlot: (id: string, name: string) => void;
  /** "저장 중" 상태로 전환됐을 때 미리보기에 쓸 현재 조건 요약(선택) */
  currentPreview?: QuickQuerySlotDetail;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-[60px] shrink-0 items-center justify-center rounded-[2px] border border-mes-primary-30 bg-mes-bg-brand-subtle-strong px-[9px] py-1 text-[12px] font-semibold text-mes-gray-110">
        {label}
      </span>
      <span className="flex items-center gap-2.5 text-[12px] text-mes-gray-110">{children}</span>
    </div>
  );
}

function QuickQueryPresetDialog({
  open,
  onOpenChange,
  slots,
  onDelete,
  onSaveSlot,
  currentPreview,
}: QuickQueryPresetDialogProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");

  const startEditing = (id: string) => {
    setEditingId(id);
    setEditName("");
  };

  const close = () => {
    setEditingId(null);
    setEditName("");
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => (next ? onOpenChange(next) : close())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[480px] -translate-x-1/2 -translate-y-1/2",
            "flex flex-col overflow-hidden rounded-mes-modal-lg bg-white shadow-mes-modal-lg"
          )}
        >
          <div className="flex h-[52px] w-full shrink-0 items-center justify-between border-b border-mes-border-default py-[10px] pl-mes-dialog-x pr-mes-dialog-header-end">
            <DialogPrimitive.Title className="flex-1 text-[18px] font-bold leading-[1.5] text-mes-text-default">
              조회 조건 프리셋
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

          <div className="flex w-full flex-col items-center p-5">
            <div className="flex w-[440px] flex-col gap-2.5">
              {slots.map((slot) => {
                const isEditing = editingId === slot.id;
                const isEmpty = slot.name === null && !isEditing;

                return (
                  <div
                    key={slot.id}
                    className={cn(
                      "flex w-[440px] flex-col gap-2 rounded-mes-control border px-4 py-2",
                      isEditing ? "border-mes-primary-60" : "border-mes-border-default"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          color="gray"
                          checked={!isEmpty}
                          readOnly
                          className="pointer-events-none"
                        />
                        <span className="whitespace-nowrap text-[16px] font-medium text-mes-gray-90">
                          설정 {slots.indexOf(slot) + 1}
                        </span>
                        {isEditing ? (
                          <Input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="설정 설명 입력"
                            className="flex-1"
                          />
                        ) : (
                          <span
                            className={cn(
                              "whitespace-nowrap text-[16px] font-medium",
                              isEmpty ? "text-mes-gray-60" : "text-mes-text-default"
                            )}
                          >
                            {slot.name ?? "미설정"}
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (editName.trim()) onSaveSlot(slot.id, editName.trim());
                            setEditingId(null);
                            setEditName("");
                          }}
                          className="flex h-6 w-20 shrink-0 items-center justify-center rounded-[2px] bg-mes-bg-brand text-[12px] font-semibold text-white"
                        >
                          저장
                        </button>
                      ) : isEmpty ? (
                        <button
                          type="button"
                          onClick={() => startEditing(slot.id)}
                          className="flex h-6 w-20 shrink-0 items-center justify-center rounded-[2px] border border-mes-primary-60 text-[12px] font-semibold text-mes-text-brand"
                        >
                          현재 조건 지정
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDelete(slot.id)}
                          className="flex h-6 w-20 shrink-0 items-center justify-center rounded-[2px] bg-mes-gray-40 text-[12px] font-semibold text-mes-gray-110"
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    {!isEmpty && (
                      <div className="flex w-full flex-col gap-2 rounded-mes-control bg-mes-bg-subtle p-2">
                        {(() => {
                          const detail = isEditing ? currentPreview : slot.detail;
                          if (!detail) return null;
                          return (
                            <>
                              {detail.grouping && (
                                <DetailRow label="그룹화">{detail.grouping}</DetailRow>
                              )}
                              {detail.filters && detail.filters.length > 0 && (
                                <DetailRow label="필터">
                                  {detail.filters.map((f, i) => (
                                    <React.Fragment key={f.label}>
                                      {i > 0 && <span className="h-2.5 w-px bg-mes-gray-60" />}
                                      <span>
                                        {f.label} <span className="font-semibold">{f.count}</span>
                                      </span>
                                    </React.Fragment>
                                  ))}
                                </DetailRow>
                              )}
                              {detail.view && (
                                <DetailRow label="조회">
                                  {detail.view.hidden !== undefined && (
                                    <span>
                                      숨김 <span className="font-semibold">{detail.view.hidden}</span>
                                    </span>
                                  )}
                                  {detail.view.total !== undefined && (
                                    <>
                                      <span className="h-2.5 w-px bg-mes-gray-60" />
                                      <span>
                                        합계 <span className="font-semibold">{detail.view.total}</span>
                                      </span>
                                    </>
                                  )}
                                  {detail.view.reordered !== undefined && (
                                    <>
                                      <span className="h-2.5 w-px bg-mes-gray-60" />
                                      <span>
                                        순서 변경{" "}
                                        <span className="font-semibold">{detail.view.reordered}</span>
                                      </span>
                                    </>
                                  )}
                                </DetailRow>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex w-full shrink-0 items-center justify-center gap-2.5 py-4">
            <Button variant="fillGray" size="basic" className="w-40" onClick={close}>
              취소
            </Button>
            <Button variant="fillBlack" size="basic" className="w-40" onClick={close}>
              저장
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { QuickQuery, QuickQueryPresetDialog };
