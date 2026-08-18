import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ExperimentalNotice() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-mes-control border border-dashed border-mes-gray-50 bg-mes-gray-10 px-3 py-2 text-[12px] text-mes-gray-80">
      <Badge variant="gray">임시</Badge>
      <span>실제 MES 원본이 없는 격리 프로토타입입니다. 표준 화면 생성에는 자동 사용되지 않습니다.</span>
    </div>
  );
}

export function PrototypeCard({
  title,
  code,
  kind,
  children,
  className,
}: {
  title: string;
  code: string;
  kind: "컴포넌트" | "패턴" | "템플릿";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section data-experimental-prototype={code} className={cn("min-w-0 rounded-mes-control border border-mes-gray-30 bg-white", className)}>
      <header className="flex min-h-12 items-center justify-between gap-3 border-b border-mes-gray-30 px-4 py-2.5">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-mes-gray-130">{title}</h3>
          <p className="truncate text-[11px] text-mes-gray-60">{code}</p>
        </div>
        <Badge variant="gray">{kind}</Badge>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function PrototypeGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{children}</div>;
}
