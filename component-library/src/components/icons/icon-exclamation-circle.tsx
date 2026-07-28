import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-exclamation-circle/Variant5.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconExclamationCircleProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconExclamationCircle({ size = 24, ...props }: IconExclamationCircleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 17.118C11.6817 17.118 11.3765 16.9916 11.1515 16.7665C10.9264 16.5415 10.8 16.2363 10.8 15.918C10.8 15.5997 10.9264 15.2945 11.1515 15.0695C11.3765 14.8444 11.6817 14.718 12 14.718C12.3183 14.718 12.6235 14.8444 12.8485 15.0695C13.0736 15.2945 13.2 15.5997 13.2 15.918C13.2 16.2363 13.0736 16.5415 12.8485 16.7665C12.6235 16.9916 12.3183 17.118 12 17.118ZM11 7.283C11 7.01778 11.1054 6.76343 11.2929 6.57589C11.4804 6.38836 11.7348 6.283 12 6.283C12.2652 6.283 12.5196 6.38836 12.7071 6.57589C12.8946 6.76343 13 7.01778 13 7.283V12.283C13 12.5482 12.8946 12.8026 12.7071 12.9901C12.5196 13.1776 12.2652 13.283 12 13.283C11.7348 13.283 11.4804 13.1776 11.2929 12.9901C11.1054 12.8026 11 12.5482 11 12.283V7.283ZM12 1C5.925 1 1 5.925 1 12C1 18.076 5.925 23 12 23C18.075 23 23 18.076 23 12C23 5.925 18.075 1 12 1Z" fill="currentColor"/>
    </svg>
  );
}
