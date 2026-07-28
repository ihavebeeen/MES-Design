import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-copy.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconCopyProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconCopy({ size = 24, ...props }: IconCopyProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15.572 8.42913V4.14342C15.572 3.36532 14.9215 2.71484 14.1434 2.71484H4.14342C3.36532 2.71484 2.71484 3.36532 2.71484 4.14342V14.1434C2.71484 14.9215 3.36532 15.572 4.14342 15.572H8.42913" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.8583 21.2868C20.6473 21.2868 21.2868 20.6473 21.2868 19.8583V9.85826C21.2868 9.08016 20.6364 8.42969 19.8583 8.42969H9.85826C9.08016 8.42969 8.42969 9.08016 8.42969 9.85826V19.8583C8.42969 20.6364 9.08016 21.2868 9.85826 21.2868H19.8583Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
