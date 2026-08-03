import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MES Breadcrumb — Figma 검색(search_design_system)에서 "breadcrumb-mid/chip" 등 이름
 * 자체는 찾았으나(컴포넌트 라이브러리 파일) componentKey를 실제 node-id로 바꿀 방법이
 * 없어 실측 불가(담당자 확인: 재시도 안 함) — 판단값으로 구현. 구분자는 이 페이지의
 * Accordion/table-full과 같은 ChevronRight(lucide) 재사용, 마지막 항목만 진하게(현재 위치).
 */
export interface BreadcrumbItemData {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItemData[];
  className?: string;
}

function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px]", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index !== 0 && <ChevronRight size={14} className="shrink-0 text-mes-gray-50" />}
            {item.onClick && !isLast ? (
              <button
                type="button"
                onClick={item.onClick}
                className="text-mes-gray-70 hover:text-mes-text-default hover:underline"
              >
                {item.label}
              </button>
            ) : (
              <span
                className={cn(isLast ? "font-medium text-mes-text-default" : "text-mes-gray-70")}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export { Breadcrumb };
