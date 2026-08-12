"use client";

import * as React from "react";
import { IconExclamationCircle, IconPlus, IconQaO, IconQaTriangle, IconQaX, IconX } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type InspectionConditionType = "단순조건" | "범위조건" | "복합조건";
export type InspectionCriteriaMode = "numeric" | "judgement";

type Operator = "이상" | "이하" | "일치";
type Connector = "그리고" | "또는";
type Judgement = "O" | "△" | "X";

interface ComplexCondition {
  id: number;
  value: string;
  operator: Operator;
}

interface CriteriaDraft {
  type: InspectionConditionType;
  simpleValue: string;
  simpleOperator: Operator;
  minimum: string;
  maximum: string;
  connector: Connector;
  conditions: ComplexCondition[];
  judgement: Judgement;
}

const INITIAL_DRAFT: CriteriaDraft = {
  type: "단순조건",
  simpleValue: "50",
  simpleOperator: "이상",
  minimum: "50",
  maximum: "65",
  connector: "그리고",
  conditions: [
    { id: 1, value: "50", operator: "이상" },
    { id: 2, value: "60", operator: "이하" },
  ],
  judgement: "O",
};

const OPERATORS: Operator[] = ["이상", "이하", "일치"];
const CONDITION_TYPES: InspectionConditionType[] = ["단순조건", "범위조건", "복합조건"];

function operatorSymbol(operator: Operator) {
  if (operator === "이상") return "≥";
  if (operator === "이하") return "≤";
  return "=";
}

function NumericInput({ value, onChange, ariaLabel }: { value: string; onChange: (value: string) => void; ariaLabel: string }) {
  return (
    <Input
      aria-label={ariaLabel}
      inputMode="numeric"
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/[^0-9.-]/g, ""))}
    />
  );
}

function OperatorSelect({ value, onChange, ariaLabel }: { value: Operator; onChange: (value: Operator) => void; ariaLabel: string }) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as Operator)}>
      <SelectTrigger aria-label={ariaLabel}><SelectValue /></SelectTrigger>
      <SelectContent>
        {OPERATORS.map((operator) => <SelectItem key={operator} value={operator}>{operator}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function ConditionTypeTabs({ value, onChange, disabled }: { value: InspectionConditionType; onChange: (value: InspectionConditionType) => void; disabled?: boolean }) {
  const types = disabled ? (["단순조건"] as InspectionConditionType[]) : CONDITION_TYPES;
  return (
    <div className="flex h-8 min-w-0 flex-1 overflow-hidden rounded-mes-control border border-mes-gray-30" role="tablist" aria-label="조건유형">
      {types.map((type) => (
        <Button
          key={type}
          role="tab"
          aria-selected={value === type}
          size="small"
          variant={value === type ? "opacityMain" : "lineBlacktxt"}
          className={cn(
            "h-8 min-w-0 flex-1 rounded-none border-0 border-l border-mes-gray-30 px-2.5 first:border-l-0",
            value === type ? "font-semibold" : "font-normal"
          )}
          onClick={() => onChange(type)}
        >
          {type}
        </Button>
      ))}
    </div>
  );
}

function CriteriaNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[37px] w-full shrink-0 items-center justify-center gap-2 rounded-mes-control bg-mes-gray-20 px-[30px] text-[14px] leading-[1.5] text-mes-gray-130">
      <IconExclamationCircle size={16} className="shrink-0 text-mes-gray-60" />
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
}

function CriteriaInputPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("w-full shrink-0 rounded-[8px] border border-mes-gray-30 bg-white px-4 pb-4 pt-3", className)}>
      <h3 className="text-[15px] font-bold leading-[1.5] text-mes-gray-130">판정 기준 입력</h3>
      {children}
    </section>
  );
}

function CriteriaResult({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex w-full shrink-0 flex-col items-center justify-center rounded-mes-control-sm border border-mes-primary-30 bg-mes-primary-20 px-5 py-2", className)}>
      <div className="flex items-center gap-2 text-[16px] font-bold leading-[1.5] text-mes-primary-60">
        <IconExclamationCircle size={16} />
        <span>최종 합격 기준</span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 text-[20px] font-semibold leading-[1.5] text-mes-gray-130">
        {children}
      </div>
    </section>
  );
}

function SimpleCriteria({ draft, update }: { draft: CriteriaDraft; update: (patch: Partial<CriteriaDraft>) => void }) {
  return (
    <>
      <CriteriaNotice>측정값이 하나의 기준값과 비교됩니다.</CriteriaNotice>
      <CriteriaInputPanel className="h-[99px]">
        <div className="mt-4 grid h-8 grid-cols-[70px_161px_161px] items-center gap-2 text-[14px]">
          <span>측정값이</span>
          <NumericInput ariaLabel="단순조건 측정값" value={draft.simpleValue} onChange={(simpleValue) => update({ simpleValue })} />
          <OperatorSelect ariaLabel="단순조건 연산자" value={draft.simpleOperator} onChange={(simpleOperator) => update({ simpleOperator })} />
        </div>
      </CriteriaInputPanel>
      <CriteriaResult className="h-[78px]">X&nbsp; {operatorSymbol(draft.simpleOperator)} {draft.simpleValue || "-"}</CriteriaResult>
    </>
  );
}

function RangeCriteria({ draft, update }: { draft: CriteriaDraft; update: (patch: Partial<CriteriaDraft>) => void }) {
  return (
    <>
      <CriteriaNotice>측정값이 최소값 이상, 최대값 이하일 때 합격됩니다.</CriteriaNotice>
      <CriteriaInputPanel className="h-[141px]">
        <div className="mt-4 grid gap-2.5 text-[14px]">
          <label className="grid h-8 grid-cols-[70px_1fr] items-center gap-2">
            <span>최소값</span>
            <NumericInput ariaLabel="범위조건 최소값" value={draft.minimum} onChange={(minimum) => update({ minimum })} />
          </label>
          <label className="grid h-8 grid-cols-[70px_1fr] items-center gap-2">
            <span>최대값</span>
            <NumericInput ariaLabel="범위조건 최대값" value={draft.maximum} onChange={(maximum) => update({ maximum })} />
          </label>
        </div>
      </CriteriaInputPanel>
      <CriteriaResult className="h-[86px]">{draft.minimum || "-"}&nbsp; ≤ X ≤ &nbsp;{draft.maximum || "-"}</CriteriaResult>
    </>
  );
}

function ComplexCriteria({ draft, update }: { draft: CriteriaDraft; update: (patch: Partial<CriteriaDraft>) => void }) {
  const updateCondition = (id: number, patch: Partial<ComplexCondition>) => {
    update({ conditions: draft.conditions.map((condition) => condition.id === id ? { ...condition, ...patch } : condition) });
  };
  const deleteCondition = (id: number) => update({ conditions: draft.conditions.filter((condition) => condition.id !== id) });
  const addCondition = () => {
    const nextId = Math.max(0, ...draft.conditions.map((condition) => condition.id)) + 1;
    update({ conditions: [...draft.conditions, { id: nextId, value: "", operator: "이상" }] });
  };
  const visibleConditions = draft.conditions.slice(0, 2);
  return (
    <>
      <CriteriaNotice>여러 조건을 그리고/또는 으로 연결합니다.</CriteriaNotice>
      <CriteriaInputPanel className="h-[225px]">
        <div className="mt-4 grid gap-2.5 text-[14px]">
          {visibleConditions.map((condition, index) => (
            <React.Fragment key={condition.id}>
              {index > 0 && (
                <div className="grid h-8 grid-cols-[70px_161px] items-center gap-2">
                  <span />
                  <Select value={draft.connector} onValueChange={(connector) => update({ connector: connector as Connector })}>
                    <SelectTrigger aria-label="복합조건 연결 방식"><SelectValue /></SelectTrigger>
                    <SelectContent>{(["그리고", "또는"] as Connector[]).map((connector) => <SelectItem key={connector} value={connector}>{connector}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid h-8 grid-cols-[70px_161px_131px_22px] items-center gap-2">
                <span>{index === 0 ? "측정값이" : ""}</span>
                <NumericInput ariaLabel={`복합조건 ${index + 1} 측정값`} value={condition.value} onChange={(value) => updateCondition(condition.id, { value })} />
                <OperatorSelect ariaLabel={`복합조건 ${index + 1} 연산자`} value={condition.operator} onChange={(operator) => updateCondition(condition.id, { operator })} />
                {index === 0 ? <span /> : (
                  <Button aria-label="조건 삭제" size="xsmall" variant="fillGray" className="h-[22px] w-[22px] bg-mes-gray-30 px-0" onClick={() => deleteCondition(condition.id)}>
                    <IconX size={12} />
                  </Button>
                )}
              </div>
            </React.Fragment>
          ))}
          <Button size="small" variant="lineMain" className="h-8 w-full" startIcon={<IconPlus size={16} />} onClick={addCondition}>조건 추가</Button>
        </div>
      </CriteriaInputPanel>
      <CriteriaResult className="h-[84px]">
        {visibleConditions.map((condition, index) => (
          <React.Fragment key={condition.id}>
            {index > 0 && <Button tabIndex={-1} size="xsmall" variant="lineMain" className="pointer-events-none">{draft.connector}</Button>}
            <span>X&nbsp; {operatorSymbol(condition.operator)} {condition.value || "-"}</span>
          </React.Fragment>
        ))}
      </CriteriaResult>
    </>
  );
}

function JudgementCriteria({ draft, update }: { draft: CriteriaDraft; update: (patch: Partial<CriteriaDraft>) => void }) {
  const options: Array<{ value: Judgement; icon: React.ReactNode }> = [
    { value: "O", icon: <IconQaO size={16} /> },
    { value: "△", icon: <IconQaTriangle size={16} /> },
    { value: "X", icon: <IconQaX size={16} /> },
  ];
  return (
    <>
      <CriteriaNotice>정상 기준값을 선택합니다.</CriteriaNotice>
      <CriteriaInputPanel className="h-[107px]">
        <div className="mt-4 grid h-10 grid-cols-3 gap-2">
          {options.map((option) => (
            <Button
              key={option.value}
              aria-label={`정상 기준값 ${option.value}`}
              size="basic"
              variant={draft.judgement === option.value ? "fillMain" : "lineBlacktxt"}
              className="h-10"
              onClick={() => update({ judgement: option.value })}
            >
              {option.icon}
            </Button>
          ))}
        </div>
      </CriteriaInputPanel>
      <CriteriaResult className="h-[78px]">정상값 = {draft.judgement}</CriteriaResult>
    </>
  );
}

export interface InspectionCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  mode?: InspectionCriteriaMode;
  initialType?: InspectionConditionType;
}

export function InspectionCriteriaDialog({ open, onOpenChange, title = "셋팅 온도", mode = "numeric", initialType = "단순조건" }: InspectionCriteriaDialogProps) {
  const initialDraft = React.useMemo(() => ({ ...INITIAL_DRAFT, type: initialType }), [initialType]);
  const [committed, setCommitted] = React.useState<CriteriaDraft>(initialDraft);
  const [draft, setDraft] = React.useState<CriteriaDraft>(initialDraft);
  const update = React.useCallback((patch: Partial<CriteriaDraft>) => setDraft((current) => ({ ...current, ...patch })), []);
  const activeType = mode === "judgement" ? "단순조건" : draft.type;
  const modalHeightClass = mode === "judgement" ? "!h-[434px]" : activeType === "단순조건" ? "!h-[418px]" : activeType === "범위조건" ? "!h-[476px]" : "!h-[550px]";
  const contentHeight = mode === "judgement" ? 290 : activeType === "단순조건" ? 274 : activeType === "범위조건" ? 332 : 406;

  const cancel = React.useCallback(() => setDraft(committed), [committed]);
  const save = React.useCallback(() => {
    setCommitted(draft);
    onOpenChange(false);
  }, [draft, onOpenChange]);

  return (
    <CenterModal
      open={open}
      onOpenChange={onOpenChange}
      onCancel={cancel}
      title={title}
      size="compact-480"
      className={cn("!max-h-[calc(100vh-40px)]", modalHeightClass)}
      bodyAlign="stretch"
      scrollMode="content"
      footer={
        <div className="flex h-[72px] shrink-0 items-center justify-center gap-[10px]">
          <Button size="small" variant="fillGray" className="w-[139px]" onClick={() => { cancel(); onOpenChange(false); }}>취소</Button>
          <Button size="small" variant="fillBlack" className="w-[139px]" onClick={save}>저장</Button>
        </div>
      }
    >
      <div className="flex w-full flex-col gap-3" style={{ height: contentHeight }} data-inspection-criteria={activeType}>
        <div className="flex h-6 shrink-0 items-center gap-4">
          <span className="w-[49px] shrink-0 text-[14px] font-medium leading-[1.5] text-mes-gray-130">조건유형</span>
          <ConditionTypeTabs value={activeType} disabled={mode === "judgement"} onChange={(type) => update({ type })} />
        </div>
        {mode === "judgement" ? <JudgementCriteria draft={draft} update={update} /> : activeType === "단순조건" ? <SimpleCriteria draft={draft} update={update} /> : activeType === "범위조건" ? <RangeCriteria draft={draft} update={update} /> : <ComplexCriteria draft={draft} update={update} />}
      </div>
    </CenterModal>
  );
}
