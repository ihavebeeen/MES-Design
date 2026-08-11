import * as React from "react";
import { cn } from "@/lib/utils";

export interface BeforeAfterComparisonMetric {
  key: string;
  label: string;
}

export interface BeforeAfterComparisonSnapshot {
  id: string;
  label: string;
  values: Record<string, React.ReactNode>;
  emphasized?: boolean;
}

export interface BeforeAfterComparisonProps {
  metrics: BeforeAfterComparisonMetric[];
  snapshots: BeforeAfterComparisonSnapshot[];
  className?: string;
}

/**
 * 변경 전후 비교표 — Figma 19451:95617 하위 19483:104432 실측.
 * 일반 목록 Table과 달리 선택·정렬·스크롤이 없고 두 상태를 동일 좌표에서 비교하는 요약표다.
 * 헤더와 모든 행이 같은 CSS grid를 공유해 Figma 원본의 미세한 셀 폭 불일치를 코드로 전파하지 않는다.
 */
export function BeforeAfterComparison({ metrics, snapshots, className }: BeforeAfterComparisonProps) {
  const gridTemplateColumns = `80px repeat(${metrics.length}, minmax(0, 1fr))`;
  return (
    <div className={cn("w-full overflow-hidden rounded-mes-control border border-mes-gray-30", className)} role="table" aria-label="변경 전후 비교">
      <div className="grid h-[30px] border-b border-mes-gray-30 bg-mes-gray-10" role="row" style={{ gridTemplateColumns }}>
        <span role="columnheader" />
        {metrics.map((metric) => (
          <span key={metric.key} role="columnheader" className="flex items-center justify-center text-[13px] font-semibold leading-[1.3] text-mes-gray-130">
            {metric.label}
          </span>
        ))}
      </div>
      {snapshots.map((snapshot, index) => (
        <div key={snapshot.id} className={cn("grid h-[30px]", index < snapshots.length - 1 && "border-b border-mes-gray-30")} role="row" style={{ gridTemplateColumns }}>
          <span role="rowheader" className={cn("flex items-center justify-center px-1.5 text-[14px] leading-[1.3]", snapshot.emphasized ? "font-semibold text-mes-primary-60" : "font-normal text-mes-gray-130")}>{snapshot.label}</span>
          {metrics.map((metric) => (
            <span key={metric.key} role="cell" className={cn("flex items-center justify-end px-1.5 text-[14px] leading-[1.3]", snapshot.emphasized && metric.key !== "defect" ? "font-semibold text-mes-primary-60" : "font-normal text-mes-gray-130")}>{snapshot.values[metric.key]}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
