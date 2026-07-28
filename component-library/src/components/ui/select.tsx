import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MES Select (Selectbox) — Figma 실측 기반
 * 출처: 클라우드MES 파일(fileKey F4n5Zr04PAbiRjfIFQAo6v) node 9873:82969 하위,
 * size=Default/small × status=Default(9873:83021)/focus(9873:83032)/입력완료(9873:83035), small Default(9873:83038)/입력완료(9873:83041)
 * Input(input.tsx)과 배경·테두리·글자색·radius·padding이 전부 동일 — 담당자 확인, 같은 위계 컴포넌트.
 * 차이는 우측 화살표 아이콘(12px, Figma "mes/icon-arrow") 하나뿐.
 *
 * 사이즈:
 * - default: height 32px, 텍스트 좌측 padding 10px, 텍스트-아이콘 gap 10px, 아이콘 12px, 우측 padding 10px, radius 4px, 폰트 14px
 * - small: height 22px, 좌측 padding 6px, gap/아이콘 크기는 동일(10px/12px), 우측 padding 6px, radius 3px, 폰트 13px
 *
 * Figma에는 selectbox의 readonly/disable 상태가 없음(디자인 자체에 없는 것으로 확인 — 재발 방지 규칙에 따라 Input 값을 유추해서
 * 채우지 않고, disabled만 HTML 표준 disabled 동작으로 최소 처리해둠. readonly는 구현 안 함).
 *
 * 구현 방식: 네이티브 <select>를 appearance-none으로 스타일링 + 아이콘은 절대배치 오버레이.
 * 네이티브 select라 브라우저 기본 접근성/키보드 동작은 그대로 유지되지만, 드롭다운 목록 자체 디자인은 OS 기본값을 따름
 * — Figma의 커스텀 리스트 디자인까지 재현하려면 추후 Radix Select 등으로 교체가 필요함(TODO, 아직 미실측).
 */
const selectVariants = cva(
  "w-full appearance-none bg-white border border-mes-gray-30 text-mes-gray-130 outline-none transition-colors focus:border-mes-gray-130 disabled:cursor-not-allowed disabled:border-mes-gray-30 disabled:bg-mes-gray-30 disabled:text-mes-gray-70",
  {
    variants: {
      size: {
        default: "h-8 pl-[10px] pr-8 rounded-[4px] text-[14px]",
        small: "h-[22px] pl-[6px] pr-7 rounded-[3px] text-[13px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(selectVariants({ size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute top-1/2 size-3 -translate-y-1/2 text-current",
            size === "small" ? "right-[6px]" : "right-[10px]"
          )}
        />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select, selectVariants };
