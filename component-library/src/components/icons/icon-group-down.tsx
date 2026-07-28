import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-group-down.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconGroupDownProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconGroupDown({ size = 24, ...props }: IconGroupDownProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4.14258 15.6504V13.2218C4.14258 12.805 4.30814 12.4054 4.60283 12.1106C4.89754 11.816 5.29723 11.6504 5.71401 11.6504H18.2854C18.7022 11.6504 19.102 11.816 19.3966 12.1106C19.6912 12.4054 19.8569 12.805 19.8569 13.2218L19.8569 15.6504" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7.65039L12 15.6504" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="9.65039" y="2.65039" width="4.71" height="4.71" rx="1.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="9.65039" y="16.6504" width="4.71" height="4.71" rx="1.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="2" y="16.6504" width="4.71" height="4.71" rx="1.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="17.291" y="16.6504" width="4.71" height="4.71" rx="1.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}
