import * as React from "react";

/**
 * MES 아이콘(mes/icon-scan) — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달
 * (`icon-scan.svg`). 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713
 * ("Section 3") 하위. 정확한 실측 벡터 그대로 씀. 색상은 currentColor로 일반화.
 * clip-path id는 한 페이지에 여러 개 렌더링될 때 충돌하지 않도록 useId()로 매번 고유하게 생성.
 */
export interface IconScanProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconScan({ size = 24, ...props }: IconScanProps) {
  const id = React.useId();
  const clipId = `${id}-scan-clip`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath={`url(#${clipId})`}>
        <path d="M7.24997 21.5H3.85713C3.10761 21.5 2.5 20.8924 2.5 20.1429V16.75" stroke="currentColor" strokeWidth="2.11111" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.5 16.75V20.1429C21.5 20.8924 20.8924 21.5 20.1428 21.5H16.75" stroke="currentColor" strokeWidth="2.11111" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.75 2.5H20.1428C20.8924 2.5 21.5 3.10761 21.5 3.85713V7.24997" stroke="currentColor" strokeWidth="2.11111" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 7.24997V3.85713C2.5 3.10761 3.10761 2.5 3.85713 2.5H7.24997" stroke="currentColor" strokeWidth="2.11111" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 12H21.4999" stroke="currentColor" strokeWidth="2.11111" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="22" height="22" fill="white" transform="translate(1 1)" />
        </clipPath>
      </defs>
    </svg>
  );
}
