import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-x/mes/icon-x/Variant6.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconXProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconX({ size = 24, ...props }: IconXProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18.2929 4.29289C18.6834 3.90237 19.3164 3.90237 19.707 4.29289C20.0973 4.68343 20.0974 5.31648 19.707 5.70696L13.414 11.9999L19.707 18.2929C20.0973 18.6834 20.0974 19.3165 19.707 19.707C19.3165 20.0974 18.6834 20.0973 18.2929 19.707L11.9999 13.414L5.70696 19.707C5.31648 20.0974 4.68343 20.0973 4.29289 19.707C3.90237 19.3164 3.90237 18.6834 4.29289 18.2929L10.5859 11.9999L4.29289 5.70696C3.90237 5.31643 3.90237 4.68342 4.29289 4.29289C4.68342 3.90237 5.31643 3.90237 5.70696 4.29289L11.9999 10.5859L18.2929 4.29289Z" fill="currentColor"/>
    </svg>
  );
}
