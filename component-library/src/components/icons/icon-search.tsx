import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-search/Property 2=mes, Property 2=icon-search, Property 3=Property 26.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconSearchProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconSearch({ size = 24, ...props }: IconSearchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.4933 10.5418C17.4937 11.9743 17.0689 13.3748 16.2729 14.566C15.4768 15.7573 14.3451 16.6859 13.021 17.2343C11.6969 17.7827 10.2398 17.9264 8.83394 17.6471C7.42811 17.3679 6.13672 16.6782 5.12309 15.6654C4.10946 14.6525 3.41912 13.362 3.13937 11.957C2.85962 10.552 3.00303 9.09571 3.55146 7.77219C4.0999 6.44867 5.02872 5.31743 6.22046 4.52152C7.41221 3.72562 8.81334 3.3008 10.2467 3.3008C11.1988 3.2986 12.142 3.48439 13.0221 3.84748C13.9021 4.21058 14.7018 4.74383 15.3751 5.41664C16.0485 6.08944 16.5822 6.88854 16.9457 7.76805C17.3092 8.64757 17.4953 9.59018 17.4933 10.5418V10.5418Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
      <path d="M20.4933 20.7834L15.4199 15.7129" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
