"use client";

import * as React from "react";
import {
  IconBox,
  IconChartBar,
  IconCompany,
  IconGrid,
  IconMedalCheck,
  IconWrench,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormFieldRow, FormGrid } from "@/components/ui/form-grid";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { Radio } from "@/components/ui/radio";
import { SectionFrame } from "@/components/ui/section-frame";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sidebar, type SidebarNavItem } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MesPageTabs } from "./mes-screen-fixtures";

type SettingsTab = "registration" | "required" | "warehouse" | "defaults";
type LinkMode = "연계 필수" | "미연계 허용" | "연계 안 함";
type BomMode = "표준 BOM 자동 구성" | "직접 지정";
type LotMode = "사용" | "미사용";
type AssigneeMode = "미지정" | "로그인 사용자";

interface RegistrationSettings {
  links: Record<"receiving" | "production" | "shipping", LinkMode>;
  bomMode: BomMode;
  lotMode: LotMode;
}

interface RequiredItem {
  id: string;
  label: string;
  required: boolean;
}

interface RequiredGroup {
  id: string;
  label: string;
  items: RequiredItem[];
}

interface ProcessWarehouseSettings {
  product: string;
  productDefect: string;
  inputDefect: string;
  returnWarehouse: string;
  priorities: [string, string, string];
}

interface WarehouseSettings {
  receiving: string;
  shipping: string;
  processes: Record<string, ProcessWarehouseSettings>;
}

interface DefaultSettings {
  assignees: Record<string, AssigneeMode>;
  endOffset: string;
}

interface OperationSettings {
  registration: RegistrationSettings;
  requiredGroups: RequiredGroup[];
  warehouses: WarehouseSettings;
  defaults: DefaultSettings;
}

const TAB_ITEMS: Array<{ id: SettingsTab; label: string }> = [
  { id: "registration", label: "등록 방식" },
  { id: "required", label: "필수 입력 항목" },
  { id: "warehouse", label: "기본 창고" },
  { id: "defaults", label: "입력 기본값" },
];

const SETTINGS_CHILDREN = [
  { key: "customer", label: "거래처 등록" },
  { key: "user", label: "사용자 설정" },
  { key: "item", label: "품목 등록" },
  { key: "warehouse", label: "창고 등록" },
  { key: "production-info", label: "생산 정보 설정" },
  { key: "quality-info", label: "품질 정보 설정" },
  { key: "facility-info", label: "설비 정보 설정" },
  { key: "business-operation", label: "업무 운영 설정" },
];

const NAV_ITEMS: SidebarNavItem[] = [
  { key: "material", label: "자재관리", icon: <IconBox size={20} /> },
  { key: "production", label: "생산관리", icon: <IconCompany size={20} /> },
  { key: "quality", label: "품질관리", icon: <IconMedalCheck size={20} /> },
  { key: "facility", label: "설비관리", icon: <IconWrench size={20} /> },
  { key: "analysis", label: "통계분석", icon: <IconChartBar size={20} /> },
  { key: "settings", label: "MES 설정", icon: <IconGrid size={20} />, children: SETTINGS_CHILDREN },
];

const WAREHOUSE_OPTIONS = ["미지정", "원료창고1", "원료창고2", "반제품창고", "완제품창고", "포장재창고", "불량창고", "반품창고", "부자재창고"];
const PROCESS_NAMES = ["압출", "성형", "포장"];
const ASSIGNEE_MENUS = ["생산실적", "입고검사", "출하검사", "공정검사"];

const INITIAL_SETTINGS: OperationSettings = {
  registration: {
    links: { receiving: "연계 필수", production: "미연계 허용", shipping: "연계 필수" },
    bomMode: "표준 BOM 자동 구성",
    lotMode: "미사용",
  },
  requiredGroups: [
    { id: "receiving", label: "입고등록", items: [{ id: "receiving-lot", label: "입고 LOT", required: false }] },
    { id: "production-order", label: "생산지시", items: [
      { id: "order-engineer", label: "담당기사", required: false },
      { id: "order-team", label: "근무조", required: false },
      { id: "order-packaging", label: "포장인원", required: false },
    ] },
    { id: "production-result", label: "생산실적", items: [
      { id: "result-team", label: "근무조", required: true },
      { id: "result-material", label: "투입품목", required: false },
      { id: "result-engineer", label: "담당기사", required: false },
      { id: "result-defect", label: "불량수량", required: true },
    ] },
  ],
  warehouses: {
    receiving: "미지정",
    shipping: "미지정",
    processes: {
      압출: { product: "반제품창고", productDefect: "불량창고", inputDefect: "불량창고", returnWarehouse: "반품창고", priorities: ["원료창고1", "원료창고2", "부자재창고"] },
      성형: { product: "완제품창고", productDefect: "불량창고", inputDefect: "불량창고", returnWarehouse: "반품창고", priorities: ["반제품창고", "부자재창고", "미지정"] },
      포장: { product: "완제품창고", productDefect: "불량창고", inputDefect: "불량창고", returnWarehouse: "반품창고", priorities: ["포장재창고", "미지정", "미지정"] },
    },
  },
  defaults: {
    assignees: Object.fromEntries(ASSIGNEE_MENUS.map((menu) => [menu, "미지정"])) as Record<string, AssigneeMode>,
    endOffset: "미지정",
  },
};

const LINK_ROWS: Array<{ id: keyof RegistrationSettings["links"]; label: string; predecessor: string }> = [
  { id: "receiving", label: "입고등록", predecessor: "발주정보" },
  { id: "production", label: "생산실적", predecessor: "생산지시" },
  { id: "shipping", label: "출하실적", predecessor: "출하지시" },
];

const LINK_DESCRIPTIONS: Record<keyof RegistrationSettings["links"], Record<LinkMode, string>> = {
  receiving: {
    "연계 필수": "발주정보를 선택한 입고실적만 등록합니다.",
    "미연계 허용": "일반 등록과 지시 없는 이지 등록을 함께 허용합니다.",
    "연계 안 함": "발주정보 없이 입고실적을 직접 등록합니다.",
  },
  production: {
    "연계 필수": "생산지시를 선택한 생산실적만 등록합니다.",
    "미연계 허용": "일반 등록과 지시 없는 이지 등록을 함께 허용합니다.",
    "연계 안 함": "생산지시 없이 생산실적을 직접 등록합니다.",
  },
  shipping: {
    "연계 필수": "출하지시를 선택한 출하실적만 등록합니다.",
    "미연계 허용": "일반 등록과 지시 없는 이지 등록을 함께 허용합니다.",
    "연계 안 함": "출하지시 없이 출하실적을 직접 등록합니다.",
  },
};

function cloneSettings(settings: OperationSettings): OperationSettings {
  return JSON.parse(JSON.stringify(settings)) as OperationSettings;
}

function SettingsSelect({ value, options, onValueChange, disabled, className }: { value: string; options: string[]; onValueChange?: (value: string) => void; disabled?: boolean; className?: string }) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn("w-full", className)}><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function RadioChoice({ name, value, options, onChange, disabledOptions = [] }: { name: string; value: string; options: string[]; onChange: (value: string) => void; disabledOptions?: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {options.map((option) => {
        const disabled = disabledOptions.includes(option);
        return (
          <label key={option} className={cn("flex cursor-pointer items-center gap-1.5 text-[14px]", disabled && "cursor-not-allowed text-mes-gray-60")}>
            <Radio name={name} size="small" checked={value === option} disabled={disabled} onChange={() => onChange(option)} />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function RegistrationTab({ value, onChange }: { value: RegistrationSettings; onChange: (value: RegistrationSettings) => void }) {
  const lotLocksLinks = value.lotMode === "사용";
  const updateLink = (id: keyof RegistrationSettings["links"], nextMode: LinkMode) => {
    onChange({
      ...value,
      links: { ...value.links, [id]: nextMode },
      lotMode: nextMode === "연계 필수" ? value.lotMode : "미사용",
    });
  };
  const updateLot = (nextMode: LotMode) => {
    onChange({
      ...value,
      lotMode: nextMode,
      links: nextMode === "사용"
        ? { receiving: "연계 필수", production: "연계 필수", shipping: "연계 필수" }
        : value.links,
    });
  };

  return (
    <div className="flex flex-col gap-4" data-testid="registration-settings-tab">
      <SectionFrame title="선행정보 연계 방식" className="rounded-mes-control border border-mes-gray-30" contentClassName="mt-0">
        <div className="grid grid-cols-[140px_120px_360px_minmax(240px,1fr)] items-center border-b border-mes-gray-30 bg-mes-gray-10 px-4 py-2 text-[13px] font-semibold text-mes-gray-80">
          <span>등록 업무</span><span>선행정보</span><span>연계 방식</span><span>현재 설정 설명</span>
        </div>
        {LINK_ROWS.map((row) => (
          <div key={row.id} className="grid min-h-[62px] grid-cols-[140px_120px_360px_minmax(240px,1fr)] items-center border-b border-mes-gray-20 px-4 last:border-b-0">
            <span className="text-[14px] font-semibold text-mes-gray-130">{row.label}</span>
            <Badge variant="blueLight">{row.predecessor}</Badge>
            <RadioChoice
              name={`link-${row.id}`}
              value={value.links[row.id]}
              options={["연계 필수", "미연계 허용", "연계 안 함"]}
              disabledOptions={lotLocksLinks ? ["미연계 허용", "연계 안 함"] : []}
              onChange={(next) => updateLink(row.id, next as LinkMode)}
            />
            <span className="text-[13px] leading-[1.5] text-mes-gray-80">{LINK_DESCRIPTIONS[row.id][value.links[row.id]]}</span>
          </div>
        ))}
      </SectionFrame>

      <div className="grid grid-cols-2 gap-4">
        <SectionFrame title="생산 투입품목 처리" className="rounded-mes-control border border-mes-gray-30">
          <RadioChoice name="bom-mode" value={value.bomMode} options={["표준 BOM 자동 구성", "직접 지정"]} onChange={(next) => onChange({ ...value, bomMode: next as BomMode })} />
        </SectionFrame>
        <SectionFrame title="LOT 관리" className="rounded-mes-control border border-mes-gray-30">
          <div className="flex flex-col gap-2.5">
            <RadioChoice name="lot-mode" value={value.lotMode} options={["사용", "미사용"]} onChange={(next) => updateLot(next as LotMode)} />
            <p className="text-[13px] leading-[1.5] text-mes-gray-70">LOT 관리 사용 시 입고·생산실적·출하실적의 연계 방식은 ‘연계 필수’로 고정됩니다.</p>
          </div>
        </SectionFrame>
      </div>
    </div>
  );
}

function RequiredTab({ groups, onChange }: { groups: RequiredGroup[]; onChange: (groups: RequiredGroup[]) => void }) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const requiredCount = groups.reduce((sum, group) => sum + group.items.filter((item) => item.required).length, 0);
  const toggleItem = (groupId: string, itemId: string, required: boolean) => {
    onChange(groups.map((group) => group.id !== groupId ? group : {
      ...group,
      items: group.items.map((item) => item.id === itemId ? { ...item, required } : item),
    }));
  };

  return (
    <div className="flex flex-col gap-4" data-testid="required-settings-tab">
      <div className="flex h-9 items-center gap-2 text-[13px] text-mes-gray-80">
        <span>전체 {total}개 항목</span><span className="text-mes-gray-50">·</span><span className="font-semibold text-mes-primary-60">필수 {requiredCount}개</span>
      </div>
      <SectionFrame title="업무별 필수 입력 설정" className="rounded-mes-control border border-mes-gray-30" contentClassName="mt-0">
        {groups.map((group) => (
          <section key={group.id} aria-label={group.label} className="border-b border-mes-gray-30 last:border-b-0">
            <div className="flex h-10 items-center bg-mes-gray-10 px-4 text-[14px] font-semibold text-mes-gray-110">{group.label}</div>
            {group.items.map((item) => (
              <label key={item.id} className="flex h-[54px] cursor-pointer items-center justify-between border-b border-mes-gray-20 px-5 last:border-b-0">
                <span className={cn("text-[14px]", item.required ? "font-semibold text-mes-gray-130" : "text-mes-gray-80")}>{item.label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-[13px] text-mes-gray-70">{item.required ? "필수" : "선택"}</span>
                  <Switch aria-label={`${group.label} ${item.label} 필수`} checked={item.required} onChange={(event) => toggleItem(group.id, item.id, event.target.checked)} />
                </span>
              </label>
            ))}
          </section>
        ))}
      </SectionFrame>
    </div>
  );
}

function WarehouseTab({ value, onChange }: { value: WarehouseSettings; onChange: (value: WarehouseSettings) => void }) {
  const [processName, setProcessName] = React.useState(PROCESS_NAMES[0]);
  const process = value.processes[processName];
  const updateProcess = (patch: Partial<ProcessWarehouseSettings>) => {
    onChange({ ...value, processes: { ...value.processes, [processName]: { ...process, ...patch } } });
  };
  const updatePriority = (index: number, nextValue: string) => {
    const priorities = [...process.priorities] as [string, string, string];
    priorities[index] = nextValue;
    updateProcess({ priorities });
  };

  return (
    <div className="flex flex-col gap-4" data-testid="warehouse-settings-tab">
      <SectionFrame title="공통 기본창고" className="rounded-mes-control border border-mes-gray-30">
        <FormGrid columns={2}>
          <FormFieldRow label="입고 기본창고"><SettingsSelect value={value.receiving} options={WAREHOUSE_OPTIONS} onValueChange={(receiving) => onChange({ ...value, receiving })} /></FormFieldRow>
          <FormFieldRow label="출하 기본창고"><SettingsSelect value={value.shipping} options={WAREHOUSE_OPTIONS} onValueChange={(shipping) => onChange({ ...value, shipping })} /></FormFieldRow>
        </FormGrid>
      </SectionFrame>

      <SectionFrame title="공정별 기본창고" className="rounded-mes-control border border-mes-gray-30">
        <div className="mb-4 w-[320px]">
          <FormFieldRow label="공정 선택"><SettingsSelect value={processName} options={PROCESS_NAMES} onValueChange={setProcessName} /></FormFieldRow>
        </div>
        <div className="border-t border-mes-gray-30 pt-4">
          <FormGrid columns={2} density="comfortable">
            <FormFieldRow label="생산품 저장창고" className="grid-cols-[150px_minmax(0,1fr)]"><SettingsSelect value={process.product} options={WAREHOUSE_OPTIONS} onValueChange={(product) => updateProcess({ product })} /></FormFieldRow>
            <FormFieldRow label="생산품 불량창고" className="grid-cols-[150px_minmax(0,1fr)]"><SettingsSelect value={process.productDefect} options={WAREHOUSE_OPTIONS} onValueChange={(productDefect) => updateProcess({ productDefect })} /></FormFieldRow>
            <FormFieldRow label="투입품 불량창고" className="grid-cols-[150px_minmax(0,1fr)]"><SettingsSelect value={process.inputDefect} options={WAREHOUSE_OPTIONS} onValueChange={(inputDefect) => updateProcess({ inputDefect })} /></FormFieldRow>
            <FormFieldRow label="반품 저장창고" className="grid-cols-[150px_minmax(0,1fr)]"><SettingsSelect value={process.returnWarehouse} options={WAREHOUSE_OPTIONS} onValueChange={(returnWarehouse) => updateProcess({ returnWarehouse })} /></FormFieldRow>
            <FormFieldRow label="생산 투입창고 1순위" className="grid-cols-[150px_minmax(0,1fr)]"><SettingsSelect value={process.priorities[0]} options={WAREHOUSE_OPTIONS} onValueChange={(next) => updatePriority(0, next)} /></FormFieldRow>
            <FormFieldRow label="생산 투입창고 2순위" className="grid-cols-[150px_minmax(0,1fr)]"><SettingsSelect value={process.priorities[1]} options={WAREHOUSE_OPTIONS} onValueChange={(next) => updatePriority(1, next)} /></FormFieldRow>
            <FormFieldRow label="생산 투입창고 3순위" className="grid-cols-[150px_minmax(0,1fr)]"><SettingsSelect value={process.priorities[2]} options={WAREHOUSE_OPTIONS} onValueChange={(next) => updatePriority(2, next)} /></FormFieldRow>
          </FormGrid>
        </div>
      </SectionFrame>
    </div>
  );
}

function SegmentedChoice({ label, value, onChange }: { label: string; value: AssigneeMode; onChange: (value: AssigneeMode) => void }) {
  return (
    <div className="flex items-center gap-0" role="group" aria-label={`${label} 담당자 기본값`}>
      {(["미지정", "로그인 사용자"] as AssigneeMode[]).map((option, index) => (
        <Button
          key={option}
          size="small"
          variant={value === option ? "fillBlack" : "lineBlacktxt"}
          className={cn("w-[118px] rounded-none", index === 0 ? "rounded-l-mes-control" : "-ml-px rounded-r-mes-control")}
          onClick={() => onChange(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

function DefaultsTab({ value, onChange }: { value: DefaultSettings; onChange: (value: DefaultSettings) => void }) {
  return (
    <div className="flex flex-col gap-4" data-testid="default-settings-tab">
      <SectionFrame title="담당자 기본값" className="rounded-mes-control border border-mes-gray-30" contentClassName="mt-0">
        {ASSIGNEE_MENUS.map((menu) => (
          <div key={menu} className="flex h-[56px] items-center justify-between border-b border-mes-gray-20 px-4 last:border-b-0">
            <span className="text-[14px] font-medium text-mes-gray-130">{menu}</span>
            <SegmentedChoice label={menu} value={value.assignees[menu]} onChange={(next) => onChange({ ...value, assignees: { ...value.assignees, [menu]: next } })} />
          </div>
        ))}
      </SectionFrame>

      <SectionFrame title="생산시간 기본값" className="rounded-mes-control border border-mes-gray-30">
        <FormGrid columns={2}>
          <FormFieldRow label="시작시간"><Input value="화면을 연 현재 일시" readOnly className="bg-mes-gray-20 text-mes-gray-70" /></FormFieldRow>
          <FormFieldRow label="종료시간"><SettingsSelect value={value.endOffset} options={["미지정", "시작시간 +1시간", "시작시간 +2시간", "시작시간 +3시간", "시작시간 +4시간", "시작시간 +5시간", "시작시간 +6시간"]} onValueChange={(endOffset) => onChange({ ...value, endOffset })} /></FormFieldRow>
        </FormGrid>
      </SectionFrame>
    </div>
  );
}

function BusinessOperationSettingsVisualFixture() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("registration");
  const [committed, setCommitted] = React.useState<OperationSettings>(() => cloneSettings(INITIAL_SETTINGS));
  const [draft, setDraft] = React.useState<OperationSettings>(() => cloneSettings(INITIAL_SETTINGS));
  const [status, setStatus] = React.useState("저장된 설정을 불러왔습니다.");
  const dirty = JSON.stringify(committed) !== JSON.stringify(draft);
  const requiredCount = draft.requiredGroups.reduce((sum, group) => sum + group.items.filter((item) => item.required).length, 0);

  const cancel = () => {
    setDraft(cloneSettings(committed));
    setStatus("저장 전 변경사항을 취소했습니다.");
  };
  const save = () => {
    setCommitted(cloneSettings(draft));
    setStatus("업무 운영 설정을 저장했습니다. 새로 여는 등록 화면부터 적용됩니다.");
  };

  return (
    <main data-visual-test="business-operation-settings" className="flex h-screen min-h-[720px] w-full overflow-hidden bg-white">
      <Sidebar items={NAV_ITEMS} logo={<Logo brand="mes" className="text-white" />} expandedKey="settings" activeSubKey="business-operation" />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MesPageTabs active="업무 운영 설정" extraTabs={["사용자 설정", "생산 정보 설정"]} />

        <header className="shrink-0 border-b border-mes-gray-30 bg-white px-5 pt-4">
          <div className="text-[12px] text-mes-gray-70">MES 설정 <span className="mx-1 text-mes-gray-50">/</span> 업무 운영 설정</div>
          <div className="mt-1 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-bold leading-[1.5] text-mes-gray-130">업무 운영 설정</h1>
              <p className="mt-0.5 text-[13px] leading-[1.5] text-mes-gray-80">등록 방식·필수 입력 항목·기본 창고·입력 기본값을 설정합니다.</p>
            </div>
            <span className="pb-1 text-[12px] text-mes-gray-70">저장 후 새로 여는 등록 화면부터 적용</span>
          </div>
          <nav aria-label="업무 운영 설정 구분" className="mt-3 flex h-[42px] items-end">
            {TAB_ITEMS.map((tab) => (
              <Button
                key={tab.id}
                size="small"
                variant="lineBlacktxt"
                aria-pressed={activeTab === tab.id}
                className={cn(
                  "h-[42px] rounded-none border-x-0 border-t-0 border-b-2 bg-transparent px-5 hover:bg-transparent",
                  activeTab === tab.id ? "border-mes-primary-60 text-mes-primary-60" : "border-transparent text-mes-gray-80"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id === "required" && <Badge variant={activeTab === tab.id ? "blue" : "grayFill"} className="ml-1">{requiredCount}</Badge>}
              </Button>
            ))}
          </nav>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-mes-gray-20 px-5 py-4">
          <div className="mx-auto w-full max-w-[1500px]">
            {activeTab === "registration" && <RegistrationTab value={draft.registration} onChange={(registration) => setDraft((current) => ({ ...current, registration }))} />}
            {activeTab === "required" && <RequiredTab groups={draft.requiredGroups} onChange={(requiredGroups) => setDraft((current) => ({ ...current, requiredGroups }))} />}
            {activeTab === "warehouse" && <WarehouseTab value={draft.warehouses} onChange={(warehouses) => setDraft((current) => ({ ...current, warehouses }))} />}
            {activeTab === "defaults" && <DefaultsTab value={draft.defaults} onChange={(defaults) => setDraft((current) => ({ ...current, defaults }))} />}
          </div>
        </div>

        <footer className="flex h-[56px] shrink-0 items-center justify-between border-t border-mes-gray-30 bg-white px-5">
          <div className="flex items-center gap-2 text-[13px]" aria-live="polite">
            <span className={cn("size-2 rounded-full", dirty ? "bg-mes-yellow-60" : "bg-mes-gray-50")} />
            <span className={dirty ? "text-mes-gray-110" : "text-mes-gray-70"}>{dirty ? "저장되지 않은 변경사항이 있습니다." : status}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Button size="small" variant="fillGray" className="w-[120px]" onClick={cancel} disabled={!dirty}>변경 취소</Button>
            <Button size="small" variant="fillBlack" className="w-[120px]" onClick={save} disabled={!dirty}>저장</Button>
          </div>
        </footer>
      </div>
    </main>
  );
}

export { BusinessOperationSettingsVisualFixture };
