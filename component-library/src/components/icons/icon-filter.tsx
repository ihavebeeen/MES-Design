import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-filter/mes/icon-filter/Variant7.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconFilterProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconFilter({ size = 24, ...props }: IconFilterProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="15" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="15" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 6H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 6L21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 12L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 18L21 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
