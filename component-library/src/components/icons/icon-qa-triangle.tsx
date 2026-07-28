import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-qa-triangle/Variant3.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconQaTriangleProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconQaTriangle({ size = 24, ...props }: IconQaTriangleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 4.375C12.0227 4.375 12.0442 4.37764 12.0635 4.38281L12.1143 4.4043C12.143 4.42094 12.1564 4.4386 12.1611 4.44727C12.1643 4.45316 12.1676 4.459 12.1709 4.46484L20.624 19.54L20.625 19.542V19.5449L20.6191 19.5566C20.6124 19.5671 20.5971 19.5839 20.5693 19.5986V19.5996C20.5409 19.6147 20.5034 19.6248 20.4619 19.625H3.53809C3.49667 19.6248 3.4592 19.6148 3.43066 19.5996V19.5986L3.39746 19.5762C3.38969 19.569 3.38415 19.5627 3.38086 19.5576C3.37776 19.5528 3.37666 19.5489 3.37598 19.5469C3.37555 19.5456 3.37505 19.5444 3.375 19.5439V19.54L11.8291 4.46484C11.8324 4.459 11.8357 4.45315 11.8389 4.44727C11.8435 4.43865 11.857 4.42094 11.8857 4.4043C11.915 4.38738 11.9548 4.375 12 4.375Z" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
