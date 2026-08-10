"use client";

import * as React from "react";

export interface HorizontalBarChartProps {
  labels: string[];
  values: Array<string | number>;
  barValues: number[];
  max?: number;
}

function HorizontalBarChart({ labels, values, barValues, max = 140 }: HorizontalBarChartProps) {
  const ticks = Array.from({ length: 8 }, (_, index) => index * 20);
  return <div className="grid h-[224px] w-full grid-cols-[45px_minmax(0,1fr)] gap-2 text-[13px]">
    <div className="grid h-[200px] grid-rows-5">{labels.map((label) => <span key={label} className="flex items-center justify-end pr-1">{label}</span>)}</div>
    <div className="relative h-full">
      <div className="absolute inset-x-0 top-0 grid h-[200px] grid-cols-8">{ticks.map((tick) => <span key={tick} className="border-l border-mes-gray-30 first:border-l" />)}</div>
      <div className="relative grid h-[200px] grid-rows-5">{barValues.map((value, index) => <div key={labels[index]} className="flex items-center"><div className="flex h-[22px] items-center rounded-r-[3px] bg-mes-primary-60 px-2 text-[13px] font-semibold text-white" style={{ width: `${Math.max(7, (value / max) * 100)}%` }}>{values[index]}</div></div>)}</div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-[12px] text-mes-gray-70">{ticks.map((tick) => <span key={tick}>{tick}</span>)}</div>
    </div>
  </div>;
}

function EquipmentProductionChart() {
  const bars = [126,60,102,80,159,60,106,79,117,60,150,87];
  const points = [67,97,75,113,113,53,93,113,80,90,70,90];
  const x = (index: number) => 80 + index * 53.6;
  return <svg viewBox="0 0 740 201" className="h-[201px] w-full" role="img" aria-label="설비별 생산실적 현황 차트">
    {[10,43.4,76.8,110.2,143.6,177].map((y, index) => <g key={y}><text x="0" y={y+4} fontSize="12" fill="#8491a7" textAnchor="end">{[10000,8000,6000,4000,2000,0][index]}</text><line x1="52" y1={y} x2="696" y2={y} stroke="#e4e7ee" /></g>)}
    {bars.map((height,index) => <g key={index}><rect x={x(index)-15} y={177-height} width="30" height={height} rx="3" fill="#c7e4ff" /><text x={x(index)} y="198" fontSize="12" fill="#8491a7" textAnchor="middle">A{index+1}</text></g>)}
    <polyline points={points.map((y,index) => `${x(index)},${y}`).join(" ")} fill="none" stroke="#f04452" strokeWidth="2" />
    {points.map((y,index) => <circle key={index} cx={x(index)} cy={y} r="4" fill="#f04452" />)}
    {["2.5%","2%","1.5%","1%","0.5%","0%"].map((label,index) => <text key={label} x="712" y={14+index*33.6} fontSize="12" fill="#8491a7">{label}</text>)}
  </svg>;
}

function InventoryComparisonChart() {
  return <div className="relative h-[87px] w-[350px] text-[11px] text-mes-gray-70"><div className="absolute left-0 top-[15px] grid h-[54px] grid-rows-3 text-right"><span>4000</span><span>2000</span><span>0</span></div><div className="absolute left-[37px] right-0 top-[22px] grid h-10 grid-rows-3">{[0,1,2].map((line) => <span key={line} className="border-t border-mes-gray-30" />)}</div><div className="absolute left-[75px] top-[10px] flex h-[58px] w-[230px] items-end justify-between"><div className="relative flex h-full items-end gap-2"><span className="h-4 w-9 bg-[#b8e8c7]" /><span className="h-8 w-9 bg-mes-primary-60" /><span className="absolute -top-1 left-4 text-mes-danger-60">↗ 5.4%</span></div><div className="relative flex h-full items-end gap-2"><span className="h-8 w-9 bg-[#b8e8c7]" /><span className="h-4 w-9 bg-mes-primary-60" /><span className="absolute -top-1 left-1 text-mes-primary-60">↘ 10.4%</span></div></div><div className="absolute bottom-0 left-[37px] right-0 grid grid-cols-2 text-center"><span>압출</span><span>성형</span></div></div>;
}

export { EquipmentProductionChart, HorizontalBarChart, InventoryComparisonChart };
