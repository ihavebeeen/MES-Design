import * as React from "react";

/**
 * MES 아이콘(mes/icon-flat-file-check) — 담당자가 Figma에서 직접 SVG로 export해 저장소에
 * 전달(`icon-flat-file-check.svg`). 2톤 고정 색상 아이콘(초록 계열)이라 currentColor로
 * 일반화하지 않고 실측 hex 그대로 둠 — 배경 #9FE3AC, 전경(체크/모서리) #1B8B30.
 * 확정 팔레트 어느 단계와도 일치하지 않는 개별 색상(체크리스트 19번 섹션 등록 대상).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 */
export interface IconFlatFileCheckProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconFlatFileCheck({ size = 24, ...props }: IconFlatFileCheckProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.25 4.6644C2.25 3.3137 3.34495 2.21875 4.69565 2.21875H18.5543C19.905 2.21875 21 3.3137 21 4.6644V20.9687C21 22.3194 19.905 23.4143 18.5543 23.4143H4.69565C3.34495 23.4143 2.25 22.3194 2.25 20.9687V4.6644Z" fill="#9FE3AC" />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.6787 11.9195C17.0839 11.3792 16.9745 10.6127 16.4342 10.2075C15.8939 9.80232 15.1275 9.91182 14.7223 10.4521L10.525 16.0484L9.04187 15.0596C8.47996 14.685 7.72075 14.8369 7.34612 15.3988C6.97152 15.9607 7.12336 16.7199 7.68527 17.0945L10.1309 18.7249C10.6709 19.0849 11.3981 18.9603 11.7875 18.4412L16.6787 11.9195Z" fill="#1B8B30" />
      <path d="M7.54883 2.21832C7.54883 1.31786 8.2788 0.587891 9.17926 0.587891H14.0706C14.971 0.587891 15.701 1.31786 15.701 2.21832V3.03354C15.701 3.93401 14.971 4.66397 14.0706 4.66397H9.17926C8.2788 4.66397 7.54883 3.93401 7.54883 3.03354V2.21832Z" fill="#1B8B30" />
    </svg>
  );
}
