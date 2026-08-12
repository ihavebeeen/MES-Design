"use client";

import Image from "next/image";
import * as React from "react";
import { IconExclamationCircle, IconPlus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormFieldRow, FormGrid } from "@/components/ui/form-grid";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Radio } from "@/components/ui/radio";
import { SectionFrame } from "@/components/ui/section-frame";
import { SideSlidePanel } from "@/components/ui/side-slide-panel";
import { createDialogActionSet } from "@/design-system/action-sets";

type UserStatus = "사용" | "미사용";

interface UserDraft {
  name: string;
  id: string;
  department: string;
  position: string;
  status: UserStatus;
  custom: Array<{ key: string; value: string }>;
}

const INITIAL_USER: UserDraft = {
  name: "",
  id: "",
  department: "",
  position: "",
  status: "사용",
  custom: [
    { key: "키", value: "" },
    { key: "몸무게", value: "" },
    { key: "성별", value: "" },
    { key: "근무조", value: "" },
  ],
};

function cloneUser(user: UserDraft): UserDraft {
  return { ...user, custom: user.custom.map((item) => ({ ...item })) };
}

function UserInformationContent({
  draft,
  onChange,
  onRequestPasswordReset,
}: {
  draft: UserDraft;
  onChange: (draft: UserDraft) => void;
  onRequestPasswordReset: () => void;
}) {
  const update = (patch: Partial<UserDraft>) => onChange({ ...draft, ...patch });
  const updateCustom = (index: number, patch: Partial<UserDraft["custom"][number]>) => {
    const next = draft.custom.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    update({ custom: next });
  };

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-[360px_minmax(0,1fr)] divide-x divide-mes-gray-30 overflow-x-hidden" data-user-information-panel>
      <SectionFrame title={<span className="font-bold">기본 정보</span>} aria-label="기본 정보" className="h-full min-h-0" contentClassName="min-h-0">
        <FormGrid density="comfortable">
          <FormFieldRow label="사용자명" required>
            <Input aria-label="사용자명" placeholder="내용 입력" value={draft.name} onChange={(event) => update({ name: event.target.value })} />
          </FormFieldRow>
          <FormFieldRow label="아이디" required>
            <Input aria-label="아이디" placeholder="내용 입력" value={draft.id} onChange={(event) => update({ id: event.target.value })} />
          </FormFieldRow>
          <FormFieldRow label="비밀번호 초기화">
            <Button
              type="button"
              size="small"
              variant="opacityMain"
              className="w-full gap-0 px-0 text-[12px] font-normal underline"
              startIcon={<Image src="/icons/mes-icon-password-reset.svg" alt="" width={16} height={16} />}
              onClick={onRequestPasswordReset}
            >
              비밀번호 초기화
            </Button>
          </FormFieldRow>
          <FormFieldRow label="부서">
            <Input aria-label="부서" placeholder="내용 입력" value={draft.department} onChange={(event) => update({ department: event.target.value })} />
          </FormFieldRow>
          <FormFieldRow label="직책">
            <Input aria-label="직책" placeholder="내용 입력" value={draft.position} onChange={(event) => update({ position: event.target.value })} />
          </FormFieldRow>
          <FormFieldRow label="사용여부" required>
            <div className="flex h-8 items-center gap-4">
              {(["사용", "미사용"] as const).map((status) => (
                <label key={status} className="flex items-center gap-[6px] text-[14px]">
                  <Radio name="user-status" checked={draft.status === status} onChange={() => update({ status })} />
                  <span className={draft.status === status ? "font-medium text-mes-gray-130" : "text-mes-gray-80"}>{status}</span>
                </label>
              ))}
            </div>
          </FormFieldRow>
        </FormGrid>
      </SectionFrame>

      <SectionFrame
        title={<span className="font-bold">커스텀 정보</span>}
        aria-label="커스텀 정보"
        className="h-full min-h-0"
        contentClassName="min-h-0"
        action={
          <Button
            type="button"
            size="small"
            variant="fillBlack"
            className="h-7 gap-0.5 px-2.5 text-[14px]"
            startIcon={<IconPlus size={16} />}
            onClick={() => update({ custom: [...draft.custom, { key: "새 항목", value: "" }] })}
          >
            항목 추가
          </Button>
        }
      >
        <FormGrid density="comfortable">
          {draft.custom.map((item, index) => (
            <FormFieldRow key={`${index}-${item.key}`} label={item.key || "항목"}>
              <Input
                aria-label={`${item.key || "항목"} 값`}
                placeholder="내용 입력"
                value={item.value}
                onChange={(event) => updateCustom(index, { value: event.target.value })}
              />
            </FormFieldRow>
          ))}
        </FormGrid>
      </SectionFrame>
    </div>
  );
}

export function UserInformationPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [saved, setSaved] = React.useState<UserDraft>(() => cloneUser(INITIAL_USER));
  const [draft, setDraft] = React.useState<UserDraft>(() => cloneUser(INITIAL_USER));
  const [resetOpen, setResetOpen] = React.useState(false);

  const cancel = React.useCallback(() => {
    setDraft(cloneUser(saved));
  }, [saved]);
  const save = React.useCallback(() => {
    setSaved(cloneUser(draft));
    onOpenChange(false);
  }, [draft, onOpenChange]);
  const dismissReset = React.useCallback(() => setResetOpen(false), []);

  return (
    <>
      <SideSlidePanel
        open={open}
        onOpenChange={onOpenChange}
        onCancel={cancel}
        title="사용자 정보"
        size="narrow-760"
        bodyPadding="none"
        bodyAlign="stretch"
        actions={createDialogActionSet("action-set.cancel-save", { onDismiss: cancel, onPrimary: save })}
      >
        <UserInformationContent draft={draft} onChange={setDraft} onRequestPasswordReset={() => setResetOpen(true)} />
      </SideSlidePanel>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        onCancel={dismissReset}
        title="비밀번호 초기화"
        heading="비밀번호를 초기화할까요?"
        className="!w-[425px]"
        actions={[
          { label: "취소", variant: "fillGray", onClick: dismissReset },
          { label: "확인", variant: "fillBlack", onClick: dismissReset },
        ]}
      >
        <div className="flex h-[114px] shrink-0 items-center gap-5 px-8 pb-4 pt-8">
          <IconExclamationCircle size={44} className="shrink-0 text-mes-danger-60" />
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-semibold leading-[1.5] text-mes-gray-130">비밀번호를 초기화할까요?</p>
            <p className="text-[16px] font-medium leading-[normal] text-[#696f83] opacity-80">
              해당 사용자의 기존 비밀번호가<br />시스템에 설정된 초기화 비밀번호로 변경됩니다.
            </p>
          </div>
        </div>
      </ConfirmDialog>
    </>
  );
}

export function InitialPasswordSettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [saved, setSaved] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const cancel = React.useCallback(() => setDraft(saved), [saved]);
  const save = React.useCallback(() => {
    if (!draft) return;
    setSaved(draft);
    onOpenChange(false);
  }, [draft, onOpenChange]);

  return (
    <CenterModal
      open={open}
      onOpenChange={onOpenChange}
      onCancel={cancel}
      title="초기화 비밀번호 설정"
      size="compact-480"
      exactWidth={415}
      exactHeight={270}
      bodyPadding="standard"
      bodyAlign="stretch"
      actions={createDialogActionSet("action-set.cancel-save", { onDismiss: cancel, onPrimary: save, primaryDisabled: !draft })}
    >
      <div className="flex w-full flex-col gap-2">
        <label className="flex flex-col gap-4 text-[14px] leading-[1.5] text-mes-gray-130">
          <span>초기화 비밀번호 <span className="font-semibold text-mes-danger-60">*</span></span>
          <Input aria-label="초기화 비밀번호" placeholder="초기화 비밀번호 입력" value={draft} onChange={(event) => setDraft(event.target.value)} />
        </label>
        <p className="py-1 text-[14px] leading-[1.5] text-mes-gray-80">사용자 비밀번호 초기화 시 일괄 적용되는 암호입니다.</p>
      </div>
    </CenterModal>
  );
}

export function PasswordResetLoginForm({ onComplete }: { onComplete?: () => void }) {
  const [password, setPassword] = React.useState("");
  const [confirmation, setConfirmation] = React.useState("");
  const mismatch = Boolean(password && confirmation && password !== confirmation);
  const canSubmit = Boolean(password && confirmation && !mismatch);

  return (
    <section className="flex h-[960px] w-[560px] flex-col items-start justify-between bg-white px-12 pb-12 pt-[60px]" aria-label="비밀번호 재설정 화면" data-password-reset-login>
      <div className="flex w-[464px] flex-col gap-12">
        <Image src="/icons/dongjin-logo.png" alt="Dongjin" width={161} height={30} priority />
        <div className="relative h-[667px] w-[464px]">
          <h1 className="absolute left-0 top-0 text-[22px] font-bold leading-[1.5] text-mes-gray-130">비밀번호 재설정</h1>
          <div className="absolute left-0 top-[57px] flex w-full flex-col gap-2 rounded-mes-control border border-[#ffe0a3] bg-[#fff3db] p-4">
            <p className="text-[14px] font-medium leading-[21px] text-mes-gray-130">관리자에 의해 비밀번호가 초기화되었습니다.</p>
            <p className="text-[14px] leading-[21px] text-mes-gray-100">새 비밀번호를 설정한 후 서비스를 이용할 수 있습니다.</p>
          </div>
          <form
            className="absolute left-0 top-[165px] flex w-full flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmit) onComplete?.();
            }}
          >
            <label className="flex flex-col gap-2 text-[14px] font-medium leading-[21px] text-mes-gray-130">
              계정 정보
              <Input value="user1" readOnly className="h-[50px] rounded-[6px] border-0 bg-mes-gray-20 px-[17px] text-[16px]" />
            </label>
            <label className="flex flex-col gap-2 text-[14px] font-medium leading-[21px] text-mes-gray-130">
              <span>새 비밀번호 <span className="font-semibold text-mes-danger-60">*</span></span>
              <PasswordInput size="login" visibilityToggle={false} aria-label="새 비밀번호" placeholder="새 비밀번호 입력" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <label className="flex flex-col gap-2 text-[14px] font-medium leading-[21px] text-mes-gray-130">
              <span>새 비밀번호 확인 <span className="font-semibold text-mes-danger-60">*</span></span>
              <PasswordInput size="login" visibilityToggle={false} aria-label="새 비밀번호 확인" placeholder="새 비밀번호 재입력" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
              {mismatch && <span role="alert" className="text-[14px] font-normal leading-[21px] text-mes-danger-60">비밀번호가 일치하지 않습니다.</span>}
            </label>
            <Button type="submit" size="login" variant="loginPrimary" className="mt-0 w-full" disabled={!canSubmit}>비밀번호 변경</Button>
          </form>
        </div>
      </div>
      <Image src="/icons/uhost-mes-logo.png" alt="YOUHOST MES" width={131} height={18} />
    </section>
  );
}

export function UserPasswordSettingsVisualFixture() {
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [complete, setComplete] = React.useState(false);

  if (showLogin) {
    return (
      <main className="flex min-h-screen justify-end bg-mes-gray-20" data-user-password-visual="login">
        <PasswordResetLoginForm onComplete={() => setComplete(true)} />
        {complete && <p role="status" className="sr-only">비밀번호 변경 완료</p>}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mes-gray-20 p-5" data-user-password-visual="workspace">
      <div className="flex gap-2">
        <Button size="small" variant="fillBlack" onClick={() => setPanelOpen(true)}>사용자 정보 열기</Button>
        <Button size="small" variant="lineBlacktxt" onClick={() => setSettingsOpen(true)}>초기화 비밀번호 설정</Button>
        <Button size="small" variant="lineBlacktxt" onClick={() => setShowLogin(true)}>비밀번호 재설정 화면</Button>
      </div>
      <UserInformationPanel open={panelOpen} onOpenChange={setPanelOpen} />
      <InitialPasswordSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );
}
