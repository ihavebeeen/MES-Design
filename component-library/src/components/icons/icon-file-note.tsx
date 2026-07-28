import * as React from "react";

/**
 * MES 아이콘 — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달(`icon-file-note.svg`).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 정확한 실측 벡터를 그대로 씀(추측/대체 아님). 색상은 currentColor로 일반화(원본 실측 hex는 아래 주석 참고)
 */
export interface IconFileNoteProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconFileNote({ size = 24, ...props }: IconFileNoteProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 2H7.00024C5.60011 2 4.89953 2 4.36475 2.27248C3.89434 2.51217 3.51217 2.89434 3.27248 3.36475C3 3.89953 3 4.60011 3 6.00024V18.0002C3 19.4004 3 20.1001 3.27248 20.6349C3.51217 21.1053 3.89434 21.4881 4.36475 21.7278C4.899 22 5.59874 22 6.99614 22H8M8 2H17.0002C18.4004 2 19.0995 2 19.6342 2.27248C20.1046 2.51217 20.4881 2.89434 20.7278 3.36475C21 3.899 21 4.59874 21 5.99614V18.0045C21 19.4019 21 20.1006 20.7278 20.6349C20.4881 21.1053 20.1046 21.4881 19.6342 21.7278C19.1 22 18.4013 22 17.0039 22H8M8 2V22M12 10.75H17M12 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
