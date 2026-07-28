import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-arrow-down-right.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconArrowDownRightProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconArrowDownRight({ size = 24, ...props }: IconArrowDownRightProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13.5 17.5L18 13L13.5 8.5M18 13H10.1969C9.07899 13 8.5192 13 8.0918 12.7822C7.71547 12.5905 7.40973 12.2839 7.21799 11.9076C7 11.4798 7 10.9201 7 9.8V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
