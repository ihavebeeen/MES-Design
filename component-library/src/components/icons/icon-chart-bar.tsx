import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-chart-bar/Variant3.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconChartBarProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconChartBar({ size = 24, ...props }: IconChartBarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1" y="12" width="6" height="11" rx="1" fill="currentColor"/>
      <rect x="9" y="1" width="6" height="22" rx="1" fill="currentColor"/>
      <rect x="17" y="6" width="6" height="17" rx="1" fill="currentColor"/>
    </svg>
  );
}
