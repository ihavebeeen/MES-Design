"use client";

import * as React from "react";
import { IconBox, IconCalendar, IconScan, IconSearch, IconTrash, IconUserMono } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ReceivingItem {
  id: number;
  name: string;
  code: string;
  unit: "kg" | "EA";
  quantity: number;
  warehouse: string;
}

const PRODUCTS = [
  { name: "비비빅", code: "ITEM-10021", unit: "EA" as const },
  { name: "더블비안코", code: "ITEM-10035", unit: "EA" as const },
  { name: "찰옥수수", code: "ITEM-10042", unit: "EA" as const },
  { name: "팥빙수 원액", code: "ITEM-20018", unit: "kg" as const },
  { name: "딸기 시럽", code: "ITEM-20031", unit: "kg" as const },
  { name: "초코 코팅액", code: "ITEM-20044", unit: "kg" as const },
];

const WAREHOUSES = ["완제품 창고", "원료 창고", "냉동 창고"];
const CUSTOMERS = ["동진산업", "유호유통", "D업체"];

function LargeSelect({ label, value, options, onValueChange }: { label: string; value: string; options: string[]; onValueChange: (value: string) => void }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2">
      <span className="text-[14px] font-semibold text-mes-gray-90">{label}</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label={label} className="h-14 px-4 text-[18px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{options.map((option) => <SelectItem key={option} value={option} className="min-h-12 text-[16px]">{option}</SelectItem>)}</SelectContent>
      </Select>
    </label>
  );
}

function KioskEasyReceivingScreen() {
  const [customer, setCustomer] = React.useState(CUSTOMERS[0]);
  const [warehouse, setWarehouse] = React.useState(WAREHOUSES[0]);
  const [query, setQuery] = React.useState("");
  const [selectedCode, setSelectedCode] = React.useState(PRODUCTS[0].code);
  const [quantity, setQuantity] = React.useState(100);
  const [items, setItems] = React.useState<ReceivingItem[]>([
    { id: 1, name: "찰옥수수", code: "ITEM-10042", unit: "EA", quantity: 240, warehouse: "완제품 창고" },
  ]);
  const [saved, setSaved] = React.useState(false);
  const nextId = React.useRef(2);

  const products = PRODUCTS.filter((product) => `${product.name} ${product.code}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = PRODUCTS.find((product) => product.code === selectedCode) ?? PRODUCTS[0];
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const adjustQuantity = (amount: number) => setQuantity((current) => Math.max(0, current + amount));
  const addItem = () => {
    if (quantity <= 0) return;
    setItems((current) => [...current, { id: nextId.current++, ...selected, quantity, warehouse }]);
    setSaved(false);
  };

  const saveReceiving = () => {
    if (items.length === 0) return;
    setSaved(true);
  };

  return (
    <main className="flex h-[900px] w-[1440px] flex-col overflow-hidden bg-mes-gray-20 text-mes-text-default" data-kiosk-easy-receiving>
      <header className="flex h-20 shrink-0 items-center border-b border-mes-gray-30 bg-white px-8">
        <div className="flex size-12 items-center justify-center rounded-mes-panel bg-mes-primary-60 text-white"><IconBox size={26} /></div>
        <h1 className="ml-4 text-[26px] font-bold">입고등록</h1>
        <div className="ml-auto flex items-center gap-6 text-[15px] text-mes-gray-90">
          <span className="flex items-center gap-2"><IconCalendar size={18} />2026.08.13</span>
          <span className="flex items-center gap-2"><IconUserMono size={18} />김마루 작업자</span>
          <Button variant="lineBlacktxt" className="h-12 px-5 text-[16px]">작업 종료</Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-mes-gray-30">
          <div className="border-b border-mes-gray-30 bg-white px-8 py-5">
            <h2 className="mb-4 text-[20px] font-bold">입고 기본정보</h2>
            <div className="flex gap-4">
              <LargeSelect label="거래처" value={customer} options={CUSTOMERS} onValueChange={setCustomer} />
              <LargeSelect label="기본 창고" value={warehouse} options={WAREHOUSES} onValueChange={setWarehouse} />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-8 py-5">
            <h2 className="mb-4 text-[20px] font-bold">품목과 수량</h2>
            <div className="flex h-14 shrink-0 gap-3">
              <div className="relative min-w-0 flex-1">
                <IconSearch size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mes-gray-60" />
                <Input aria-label="품목 검색" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="품목명 또는 품목코드 검색" className="h-14 pl-12 text-[17px]" />
              </div>
              <Button variant="fillBlack" className="h-14 min-w-40 text-[16px]" startIcon={<IconScan size={20} />}>바코드 스캔</Button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3" role="list" aria-label="품목 선택">
              {products.map((product) => {
                const active = selected.code === product.code;
                return (
                  <Button key={product.code} variant={active ? "lineMain" : "lineBlacktxt"} onClick={() => { setSelectedCode(product.code); setSaved(false); }} className={cn("min-h-20 flex-col items-start justify-center whitespace-normal px-4 text-left", active && "bg-mes-primary-10")}>
                    <span className="text-[17px] font-semibold">{product.name}</span>
                    <span className="mt-1 text-[13px] text-mes-gray-70">{product.code} · {product.unit}</span>
                  </Button>
                );
              })}
            </div>

            <div className="mt-auto flex items-end gap-3 border-t border-mes-gray-30 pt-5">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-mes-gray-90">선택 품목</p>
                <p className="mt-2 text-[20px] font-bold">{selected.name}<span className="ml-2 text-[14px] font-normal text-mes-gray-70">{selected.code}</span></p>
              </div>
              <div>
                <p className="mb-2 text-[14px] font-semibold text-mes-gray-90">수량</p>
                <div className="flex h-14 items-stretch gap-2">
                  <Button variant="fillGray" className="h-14 w-16 px-0 text-[17px]" onClick={() => adjustQuantity(-10)}>-10</Button>
                  <Button variant="fillGray" className="h-14 w-14 px-0 text-[20px]" onClick={() => adjustQuantity(-1)}>-</Button>
                  <div className="relative w-40"><Input aria-label="입고 수량" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(Number(event.target.value.replace(/[^0-9]/g, "")) || 0)} className="h-14 pr-12 text-right text-[24px] font-bold" /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-mes-gray-70">{selected.unit}</span></div>
                  <Button variant="fillGray" className="h-14 w-14 px-0 text-[20px]" onClick={() => adjustQuantity(1)}>+</Button>
                  <Button variant="fillGray" className="h-14 w-16 px-0 text-[17px]" onClick={() => adjustQuantity(10)}>+10</Button>
                </div>
              </div>
              <Button className="h-14 min-w-36 text-[17px]" disabled={quantity <= 0} onClick={addItem}>목록에 추가</Button>
            </div>
          </div>
        </section>

        <aside className="flex w-[480px] shrink-0 flex-col bg-white" aria-label="이번 입고">
          <div className="flex h-16 shrink-0 items-center border-b border-mes-gray-30 px-6"><h2 className="text-[20px] font-bold">이번 입고</h2><span className="ml-auto rounded-full bg-mes-gray-20 px-3 py-1 text-[14px] font-semibold">{items.length}건</span></div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <EmptyState icon={<IconBox size={36} />} title="추가한 품목이 없습니다." className="h-full" />
            ) : items.map((item, index) => (
              <div key={item.id} className="mb-3 border-b border-mes-gray-30 px-2 pb-4">
                <div className="flex items-start gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-mes-gray-20 text-[13px] font-semibold">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-[17px] font-semibold">{item.name}</p><p className="mt-1 text-[13px] text-mes-gray-70">{item.code} · {item.warehouse}</p></div><IconButton aria-label={`${item.name} 삭제`} icon={<IconTrash size={19} />} size="basic" variant="lineBlacktxt" className="size-12" onClick={() => setItems((current) => current.filter((currentItem) => currentItem.id !== item.id))} /></div>
                <div className="mt-3 flex items-end justify-between pl-10"><span className="text-[14px] text-mes-gray-70">거래처 · {customer}</span><strong className="text-[24px]">{item.quantity.toLocaleString()} <span className="text-[15px] font-normal text-mes-gray-70">{item.unit}</span></strong></div>
              </div>
            ))}
          </div>
          <div className="shrink-0 border-t border-mes-gray-30 p-5">
            {saved && <div role="status" className="mb-4 flex h-12 items-center justify-center rounded-mes-control bg-mes-primary-10 text-[16px] font-semibold text-mes-primary-70">입고등록이 처리되었습니다.</div>}
            <div className="mb-4 flex items-center justify-between"><span className="text-[15px] text-mes-gray-80">총 입고수량</span><strong className="text-[26px]">{totalQuantity.toLocaleString()}</strong></div>
            <Button className="h-16 w-full text-[20px]" disabled={items.length === 0} onClick={saveReceiving}>입고 등록</Button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export { KioskEasyReceivingScreen };
