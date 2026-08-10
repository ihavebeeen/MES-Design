import * as React from "react";
import { cn } from "@/lib/utils";

export interface MetricItem {
  id: string;
  content: React.ReactNode;
}

export interface AnalyticsPanelItem {
  id: string;
  title: string;
  description?: string;
  legend?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export interface AnalyticsDashboardPatternProps {
  navigation: React.ReactNode;
  tabs: React.ReactNode;
  toolbar?: React.ReactNode;
  metrics: MetricItem[];
  panels: AnalyticsPanelItem[];
  className?: string;
}

/** 대시보드/생산분석/검사경향 화면의 KPI + 분석 패널 배치 패턴. */
function AnalyticsDashboardPattern({
  navigation,
  tabs,
  toolbar,
  metrics,
  panels,
  className,
}: AnalyticsDashboardPatternProps) {
  return (
    <div
      className={cn(
        "flex h-[960px] w-[1920px] overflow-hidden bg-white",
        className
      )}
    >
      {navigation}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[38px] shrink-0 items-center bg-black">{tabs}</div>
        {toolbar && <div className="flex h-[42px] shrink-0 items-center border-b border-mes-gray-30 px-5">{toolbar}</div>}
        <div className="min-h-0 flex-1 overflow-hidden p-5">
          <div className="grid grid-cols-4 gap-5">
            {metrics.map((metric) => (
              <React.Fragment key={metric.id}>{metric.content}</React.Fragment>
            ))}
          </div>

          <div className={cn("mt-5 grid grid-cols-2 gap-5", toolbar ? "h-[623px] grid-rows-[308px_295px]" : "h-[665px] grid-rows-[308px_337px]")}>
            {panels.map((panel) => (
              <section
                key={panel.id}
                className={cn(
                  "flex min-h-0 flex-col rounded-xl border border-mes-gray-30 bg-white px-5 py-4",
                  panel.className
                )}
              >
                <header className="flex shrink-0 items-center justify-between">
                  <div>
                    <h4 className="text-[14px] font-bold text-mes-gray-130">{panel.title}</h4>
                    {panel.description && (
                      <p className="mt-0.5 text-[12px] text-mes-gray-60">{panel.description}</p>
                    )}
                  </div>
                  {panel.legend}
                </header>
                <div className={cn("min-h-0 flex-1", panel.contentClassName)}>{panel.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnalyticsDashboardPattern };
