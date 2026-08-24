"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Circle,
  Home,
  Menu,
  Search,
  Settings,
  Triangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type MobileMenuCategory = {
  id: string;
  label: string;
  items: Array<{ id: string; label: string }>;
};

export function MobileTwoDepthMenu({
  categories,
  initialCategoryId,
  initialItemId,
  onSelectionChange,
}: {
  categories: MobileMenuCategory[];
  initialCategoryId?: string;
  initialItemId?: string;
  onSelectionChange?: (categoryId: string, itemId?: string) => void;
}) {
  const fallbackCategory = categories[0];
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? fallbackCategory?.id ?? "");
  const activeCategory = categories.find((category) => category.id === categoryId) ?? fallbackCategory;
  const [itemId, setItemId] = useState(initialItemId ?? activeCategory?.items[0]?.id ?? "");

  function selectCategory(nextCategory: MobileMenuCategory) {
    const nextItemId = nextCategory.items[0]?.id;
    setCategoryId(nextCategory.id);
    setItemId(nextItemId ?? "");
    onSelectionChange?.(nextCategory.id, nextItemId);
  }

  function selectItem(nextItemId: string) {
    setItemId(nextItemId);
    onSelectionChange?.(activeCategory?.id ?? "", nextItemId);
  }

  return (
    <div className="flex h-full w-full border-t border-[#e4e7ee] bg-white" data-mobile-pattern="two-depth-menu">
      <nav className="flex h-full w-[120px] shrink-0 flex-col gap-0.5 bg-[#eff2f8] py-[10px]" aria-label="업무 분류">
        {categories.map((category) => {
          const selected = category.id === activeCategory?.id;
          return (
            <Button
              key={category.id}
              type="button"
              variant="lineBlacktxt"
              size="small"
              aria-pressed={selected}
              onClick={() => selectCategory(category)}
              className={cn(
                "h-[52px] w-full shrink-0 rounded-none border-0 px-4 text-[16px] font-semibold leading-[22px] tracking-[-0.408px] hover:bg-white",
                selected ? "bg-white text-[#011327]" : "bg-transparent text-[#67738e] hover:bg-transparent",
              )}
            >
              {category.label}
            </Button>
          );
        })}
      </nav>
      <nav className="flex h-full min-w-0 flex-1 flex-col gap-0.5 bg-white py-[10px]" aria-label="세부 업무">
        {activeCategory?.items.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant="lineBlacktxt"
            size="small"
            aria-pressed={item.id === itemId}
            onClick={() => selectItem(item.id)}
            className="h-[52px] w-full shrink-0 justify-start rounded-none border-0 bg-white px-8 text-left text-[16px] font-semibold leading-[22px] tracking-[-0.408px] text-[#011327] hover:bg-white"
          >
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
}

export type MobileButtonTone =
  | "primary"
  | "black"
  | "danger"
  | "gray"
  | "line-primary"
  | "line-black"
  | "subtle";
export type MobileButtonSize = "default" | "small" | "xsmall" | "round";

const buttonTone: Record<MobileButtonTone, string> = {
  primary: "border-[#1573fb] bg-[#1573fb] text-white",
  black: "border-[#011327] bg-[#011327] text-white",
  danger: "border-[#f04452] bg-[#f04452] text-white",
  gray: "border-[#e4e7ee] bg-[#e4e7ee] text-[#011327]",
  "line-primary": "border-[#1573fb] bg-white text-[#1573fb]",
  "line-black": "border-[#e4e7ee] bg-white text-[#011327]",
  subtle: "border-[#e8f5ff] bg-[#e8f5ff] text-[#1573fb]",
};

const buttonSize: Record<MobileButtonSize, string> = {
  default: "h-[50px] min-w-[164px] rounded-[6px] px-4 text-[16px]",
  small: "h-10 min-w-[74px] rounded-[6px] px-3 text-[15px]",
  xsmall: "h-8 min-w-[64px] rounded-[4px] px-2.5 text-[13px]",
  round: "h-10 min-w-[74px] rounded-full px-3 text-[15px]",
};

export function MobileButton({
  tone = "primary",
  size = "default",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: MobileButtonTone;
  size?: MobileButtonSize;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 border font-bold leading-[1.5] transition-opacity disabled:border-[#d7dce5] disabled:bg-[#d7dce5] disabled:text-[#99a3b8]",
        buttonTone[tone],
        buttonSize[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export type MobileHeaderVariant = "white" | "default" | "logo" | "modal" | "bottom-sheet";

export function MobileHeader({
  variant = "default",
  title = "성형기 1호",
  onBack,
  onClose,
}: {
  variant?: MobileHeaderVariant;
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
}) {
  if (variant === "logo") {
    return (
      <div className="flex h-[52px] w-full items-center justify-between px-4 py-2">
        <Image src="/icons/dongjin-logo.png" alt="Dongjin" width={112} height={21} className="h-[21px] w-[112px] object-contain mix-blend-multiply" />
        <span className="text-[16px] font-extrabold tracking-[-0.2px] text-[#011327]">YOUHOST MES</span>
      </div>
    );
  }

  if (variant === "modal" || variant === "bottom-sheet") {
    return (
      <div className={cn("flex w-full items-center justify-between", variant === "modal" ? "py-2 pl-4 pr-2" : "py-3 pl-4 pr-2")}>
        <span className={cn("font-bold leading-[1.5] text-[#011327]", variant === "modal" ? "text-[20px]" : "text-[18px]")}>{title}</span>
        <button type="button" aria-label="닫기" onClick={onClose} className="flex size-9 items-center justify-center rounded-full text-[#011327]">
          <X size={20} strokeWidth={1.8} />
        </button>
      </div>
    );
  }

  const dark = variant === "white";
  return (
    <div className={cn("flex h-[52px] w-full items-center justify-between border-b px-4 py-2", dark ? "border-transparent text-white" : "border-[#e4e7ee] bg-white text-[#011327]")}>
      <div className="flex min-w-0 items-center gap-1">
        <button type="button" aria-label="뒤로" onClick={onBack} className="flex size-9 shrink-0 items-center justify-center rounded-full">
          <ChevronLeft size={24} />
        </button>
        <span className="truncate text-[20px] font-bold leading-[1.5] tracking-[-0.25px]">{title}</span>
      </div>
      <span className="shrink-0 text-[16px] font-extrabold tracking-[-0.2px]">YOUHOST MES</span>
    </div>
  );
}

const tabs = [
  { key: "home", label: "홈", icon: Home },
  { key: "bell", label: "알람", icon: Bell },
  { key: "setting", label: "설정", icon: Settings },
  { key: "menu", label: "전체메뉴", icon: Menu },
] as const;

export function MobileTabBar({ active = "home", onChange }: { active?: string; onChange?: (key: string) => void }) {
  return (
    <nav className="flex h-[54px] w-full items-start border-t border-[#e4e7ee] bg-white px-[10px]" aria-label="모바일 하단 메뉴">
      {tabs.map(({ key, label, icon: Icon }) => {
        const selected = key === active;
        return (
          <button key={key} type="button" onClick={() => onChange?.(key)} className="flex min-w-0 flex-1 flex-col items-center gap-1 px-3.5 py-2" aria-current={selected ? "page" : undefined}>
            <Icon size={24} className={selected ? "text-[#011327]" : "text-[#99a3b8]"} fill={key === "home" && selected ? "currentColor" : "none"} />
            <span className={cn("whitespace-nowrap text-[10px] tracking-[-0.125px]", selected ? "font-semibold text-[#011327]" : "font-medium text-[#99a3b8]")}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function MobileToggle({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (next: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onCheckedChange(!checked)} className={cn("relative h-7 w-[50px] rounded-full transition-colors", checked ? "bg-[#1573fb]" : "bg-[#b4c0d3]")}>
      <span className={cn("absolute top-0.5 size-6 rounded-full bg-white shadow-sm transition-[left]", checked ? "left-6" : "left-0.5")} />
    </button>
  );
}

export function MobileInput({ state = "default", mobileSize = "default", icon, className, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & { state?: "default" | "focus" | "readonly" | "disabled" | "error"; mobileSize?: "default" | "compact"; icon?: boolean }) {
  return (
    <label className={cn("relative block w-full", className)}>
      <Input
        {...props}
        readOnly={state === "readonly" || props.readOnly}
        disabled={state === "disabled" || props.disabled}
        className={cn(
          "w-full rounded-[4px] border bg-white text-[#011327] outline-none placeholder:text-[#99a3b8]",
          mobileSize === "compact" ? "h-8 px-[10px] text-[15px] leading-[22.5px] tracking-[-0.1875px]" : "h-11 px-3 text-[16px] leading-[1.5]",
          icon && "pr-10",
          state === "focus" && "border-[#011327]",
          state === "error" && "border-[#f04452] bg-[#fffafa] text-[#f04452]",
          state === "readonly" && "border-[#eff2f8] bg-[#eff2f8]",
          state === "disabled" && "border-[#d7dce5] bg-[#d7dce5] text-[#99a3b8]",
          state === "default" && "border-[#e4e7ee]",
        )}
      />
      {icon && <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#99a3b8]" />}
    </label>
  );
}

export function MobileCompactField({ label, value, onChange, readOnly = false, inputLabel }: { label: string; value: string; onChange?: (value: string) => void; readOnly?: boolean; inputLabel?: string }) {
  return (
    <label className="flex h-8 min-w-0 items-center">
      <span className="w-[74px] shrink-0 text-[15px] leading-[22.5px] tracking-[-0.1875px] text-[#5c667b]">{label}</span>
      <MobileInput aria-label={inputLabel ?? label} mobileSize="compact" value={value} readOnly={readOnly || !onChange} onChange={(event) => onChange?.(event.target.value)} />
    </label>
  );
}

export function MobileRadioGroup({ value, options, onChange, label }: { value: string; options: Array<{ value: string; label: string; disabled?: boolean }>; onChange: (value: string) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex h-8 items-center gap-5">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Button key={option.value} type="button" role="radio" aria-checked={selected} disabled={option.disabled} variant="lineBlacktxt" size="xsmall" onClick={() => onChange(option.value)} className="h-8 min-w-0 gap-1.5 rounded-none border-0 bg-transparent p-0 text-[15px] font-medium tracking-[-0.1875px] text-[#011327] hover:bg-transparent disabled:bg-transparent disabled:text-[#99a3b8]">
            <span className={cn("flex size-6 items-center justify-center rounded-full", option.disabled ? "bg-[#eff2f8]" : "border-2", selected ? "border-[#1573fb]" : "border-[#b4c0d3]")}>{selected && <span className="size-3 rounded-full bg-[#1573fb]" />}</span>
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export function MobileFormSection({ title, suffix, children, className }: { title: string; suffix?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex w-full flex-col gap-2 rounded-[8px] border border-[#e4e7ee] bg-white p-3", className)} data-mobile-pattern="form-section">
      <h3 className="flex h-[22.5px] items-center gap-1 text-[15px] font-bold leading-[22.5px] tracking-[-0.1875px] text-[#011327]">{title}{suffix && <span className="text-[14px] font-normal tracking-[-0.175px] text-[#8491a7]">{suffix}</span>}</h3>
      {children}
    </section>
  );
}

export function MobileSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex h-11 w-full items-center justify-between rounded-[4px] border border-[#e4e7ee] bg-white px-3 text-left text-[16px] text-[#011327]">
        <span>{value || "선택"}</span><ChevronRight size={18} className={cn("transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 overflow-hidden rounded-b-[4px] border border-t-0 border-[#e4e7ee] bg-white shadow-lg">
          {options.map((option) => (
            <button key={option} type="button" onClick={() => { onChange(option); setOpen(false); }} className={cn("flex h-12 w-full items-center gap-2 border-b border-[#e4e7ee] px-3 text-[15px] last:border-b-0", option === value ? "bg-[#eff2f8] font-semibold" : "bg-white")}>
              <span className={cn("flex size-4 items-center justify-center rounded-full", option === value ? "bg-[#011327] text-white" : "bg-[#d7dce5] text-white")}>✓</span>{option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type QaValue = "o" | "triangle" | "x";
const qaOptions: Array<{ value: QaValue; label: string; icon: typeof Circle }> = [
  { value: "o", label: "양호", icon: Circle },
  { value: "triangle", label: "주의", icon: Triangle },
  { value: "x", label: "불량", icon: X },
];

const qaSelectedTone: Record<QaValue, string> = {
  o: "border-[#1573fb] bg-[#1573fb] text-white",
  triangle: "border-[#4f5b73] bg-[#4f5b73] text-white",
  x: "border-[#f04452] bg-[#f04452] text-white",
};

export function MobileQaGroup({ value, onChange, className, labelPrefix }: { value?: QaValue; onChange: (next: QaValue) => void; className?: string; labelPrefix?: string }) {
  return (
    <div className={cn("flex w-[166.5px] items-center gap-2", className)}>
      {qaOptions.map(({ value: option, label, icon: Icon }) => {
        const active = option === value;
        return (
          <Button key={option} type="button" variant="lineBlacktxt" size="xsmall" aria-label={labelPrefix ? `${labelPrefix} ${label}` : label} aria-pressed={active} onClick={() => onChange(option)} className={cn("h-8 min-w-0 flex-1 rounded-[4px] border-0 px-0", active ? qaSelectedTone[option] : "bg-[#e4e7ee] text-[#a7b2c6] hover:bg-[#e4e7ee]")}>
            <Icon className="size-4" strokeWidth={2.25} />
          </Button>
        );
      })}
    </div>
  );
}

export function MobileInspectionQuestionList({
  questions,
  values,
  onChange,
  className,
}: {
  questions: Array<{ id: string; label: string }>;
  values: Record<string, QaValue | undefined>;
  onChange: (questionId: string, value: QaValue) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)} data-mobile-pattern="inspection-question-list">
      {questions.map((question) => (
        <div key={question.id} className="grid h-8 w-full grid-cols-[1fr_1fr] items-center gap-[10px]">
          <span className="truncate text-[15px] font-semibold leading-[22.5px] tracking-[-0.1875px] text-[#011327]">{question.label}</span>
          <MobileQaGroup value={values[question.id]} onChange={(value) => onChange(question.id, value)} labelPrefix={question.label} className="w-full" />
        </div>
      ))}
    </div>
  );
}

export function MobileCta({ mode = "save", onCancel, onSave }: { mode?: "save" | "cancel-save"; onCancel?: () => void; onSave?: () => void }) {
  return (
    <div className="flex w-full gap-2 bg-white px-4 py-5 shadow-[0_-8px_24px_rgba(1,19,39,0.06)]">
      {mode === "cancel-save" && <MobileButton tone="gray" className="min-w-0 flex-1" onClick={onCancel}>취소</MobileButton>}
      <MobileButton className="min-w-0 flex-1" onClick={onSave}>저장</MobileButton>
    </div>
  );
}

export function MobileStep({ labels, activeIndex }: { labels: string[]; activeIndex: number }) {
  return (
    <div className="relative flex w-full items-start">
      <div className="absolute left-[36px] right-[36px] top-[5px] h-0.5 bg-[#d7dce5]" />
      {labels.map((label, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div key={label} className="relative flex min-w-0 flex-1 flex-col items-center gap-0.5">
            <span className={cn("z-10 flex size-3 items-center justify-center rounded-full", active ? "border-[3px] border-[#1573fb] bg-white" : done ? "bg-[#99a3b8] text-white" : "bg-[#d7dce5]")}>{done && <span className="text-[8px] font-bold leading-none">✓</span>}</span>
            <span className={cn("text-center text-[13px] leading-[19.5px]", active ? "font-bold text-[#1573fb]" : done ? "text-[#67738e]" : "text-[#8491a7]")}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function MobileDevice({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div data-mobile-device className={cn("relative flex h-[812px] w-[375px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-[#d7dce5] bg-white shadow-[0_16px_50px_rgba(1,19,39,0.18)]", className)}>{children}</div>;
}

export function MobileDateNavigator({ date = "2025.03.30" }: { date?: string }) {
  return (
    <div className="flex h-[68px] w-full items-center justify-between px-4">
      <button type="button" aria-label="이전 날짜" className="flex size-9 items-center justify-center rounded-lg bg-white text-[#011327] shadow-sm"><ChevronLeft size={20} /></button>
      <div className="flex items-center gap-2"><span className="rounded-full bg-[#1573fb] px-2.5 py-1 text-[12px] font-semibold text-white">오늘</span><strong className="text-[20px] leading-[1.5] text-white">{date}</strong></div>
      <button type="button" aria-label="다음 날짜" className="flex size-9 items-center justify-center rounded-lg bg-white text-[#011327] shadow-sm"><ChevronRight size={20} /></button>
    </div>
  );
}

const homeMenus = ["입고등록", "출하등록", "생산관리", "품질검사", "운전일지", "라벨관리", "정비이력", "설비점검"];

export function MobileHomePreview() {
  const [active, setActive] = useState("home");
  return (
    <MobileDevice className="border-0 bg-[linear-gradient(158deg,#1268ea_0%,#063a91_100%)]">
      <div className="h-[47px] shrink-0" />
      <MobileHeader variant="logo" />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-y-auto px-4 py-3">
        {homeMenus.map((menu) => <button key={menu} type="button" className="flex min-h-[120px] items-center justify-center rounded-xl bg-white px-3 text-center text-[22px] font-bold text-[#011327] shadow-[0_5px_18px_rgba(1,19,39,0.16)]">{menu}</button>)}
      </div>
      <MobileTabBar active={active} onChange={setActive} />
      <div className="flex h-[30px] shrink-0 items-center justify-center bg-white"><span className="h-1 w-[134px] rounded-full bg-black" /></div>
    </MobileDevice>
  );
}

const receivingItems = [
  { state: "대기", title: "대한패키징 · PO-20250330-01", tone: "blue" },
  { state: "완료", title: "부산물 재생원료 · PO-20250330-02", tone: "gray" },
  { state: "4 / 5", title: "HIPS SHEET · PO-20250330-03", tone: "red" },
  { state: "대기", title: "PP 원색재생 · PO-20250330-04", tone: "blue" },
];

export function MobileReceivingListPreview() {
  const [activeItem, setActiveItem] = useState(0);
  return (
    <MobileDevice className="border-0 bg-[linear-gradient(158deg,#1268ea_0%,#063a91_34%,#ffffff_34%)]">
      <div className="h-[47px] shrink-0" />
      <MobileHeader variant="white" title="입고등록" />
      <MobileDateNavigator />
      <main className="min-h-0 flex-1 overflow-y-auto rounded-t-[24px] bg-white px-4 py-5 shadow-[0_-8px_30px_rgba(1,19,39,0.12)]">
        <div className="mb-4 flex items-center gap-2"><MobileInput icon placeholder="품목 또는 LOT 검색" className="flex-1" /><button type="button" aria-label="달력" className="flex size-11 items-center justify-center rounded-[4px] border border-[#e4e7ee]"><CalendarDays size={20} /></button></div>
        <div className="flex flex-col gap-3">
          {receivingItems.map((item, index) => <button key={item.title} type="button" onClick={() => setActiveItem(index)} className={cn("flex min-h-[76px] w-full items-center gap-3 rounded-xl px-4 py-3 text-left", index === activeItem ? "ring-2 ring-[#1573fb]" : "", item.tone === "red" ? "bg-[#fbeff0]" : item.tone === "gray" ? "bg-[#eff2f8]" : "bg-[#e8f5ff]")}><span className={cn("rounded-full px-2 py-0.5 text-[12px] font-semibold text-white", item.tone === "red" ? "bg-[#f04452]" : item.tone === "gray" ? "bg-[#99a3b8]" : "bg-[#1573fb]")}>{item.state}</span><span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[#011327]">{item.title}</span><ChevronRight size={18} /></button>)}
        </div>
      </main>
      <MobileTabBar />
      <div className="flex h-[30px] shrink-0 items-center justify-center bg-white"><span className="h-1 w-[134px] rounded-full bg-black" /></div>
    </MobileDevice>
  );
}

export function MobileBottomSheetPreview() {
  const [open, setOpen] = useState(true);
  const [memo, setMemo] = useState("");
  return (
    <MobileDevice className="bg-[#eff2f8]">
      <div className="h-[47px]" /><MobileHeader title="생산실적 등록" />
      <div className="flex flex-1 items-center justify-center"><MobileButton onClick={() => setOpen(true)}>메모 입력</MobileButton></div>
      {open && <><button type="button" aria-label="메모 닫기" className="absolute inset-0 z-10 bg-black/45" onClick={() => setOpen(false)} /><section className="absolute inset-x-0 bottom-0 z-20 rounded-t-[20px] bg-white"><MobileHeader variant="bottom-sheet" title="메모" onClose={() => setOpen(false)} /><div className="px-4 pb-4"><textarea value={memo} maxLength={100} onChange={(event) => setMemo(event.target.value)} placeholder="메모를 입력해 주세요." className="h-[132px] w-full resize-none rounded-[6px] border border-[#e4e7ee] p-3 text-[16px] outline-none focus:border-[#011327]" /><p className="mt-1 text-right text-[13px] text-[#8491a7]">{memo.length}/100</p></div><MobileCta onSave={() => setOpen(false)} /></section></>}
      <div className="flex h-[30px] shrink-0 items-center justify-center bg-white"><span className="h-1 w-[134px] rounded-full bg-black" /></div>
    </MobileDevice>
  );
}
