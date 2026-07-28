import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-qa-o/Variant4.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconQaOProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconQaO({ size = 24, ...props }: IconQaOProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3.375C16.7635 3.375 20.625 7.23654 20.625 12C20.625 16.7635 16.7635 20.625 12 20.625C7.23654 20.625 3.375 16.7635 3.375 12C3.375 7.23654 7.23654 3.375 12 3.375Z" stroke="currentColor" strokeWidth="2.75" strokeLinecap="square"/>
    </svg>
  );
}
