"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

/**
 * MES Popover — Figma에 전용 컴포넌트 없음(체크리스트 티어2 "Popover", 상태 "없음").
 * 이미 프로젝트가 쓰고 있는 `@radix-ui/react-popover`(Combobox/GroupQuery 등에서 이미
 * 사용 중)를 그대로 재사용 — 새 의존성 추가 없음. 패널 스타일(테두리·radius·그림자)은
 * Combobox 펼침 패널과 동일 값(`rounded-mes-panel` / `shadow-mes-panel` / border gray30)
 * 재사용.
 */
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-mes-panel border border-mes-border-default bg-white p-4 text-mes-text-default shadow-mes-panel outline-none",
        "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
