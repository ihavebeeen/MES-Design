import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-plus/mes/icon-plus/Variant7.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconPlusProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconPlus({ size = 24, ...props }: IconPlusProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3.59961L12 20.3996" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20.4004 12L3.60039 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
