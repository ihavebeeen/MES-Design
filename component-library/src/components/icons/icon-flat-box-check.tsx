import * as React from "react";

/**
 * MES 아이콘(mes/icon-flat-box-check) — 담당자가 Figma에서 직접 SVG로 export해 저장소에
 * 전달(`icon-flat-box-check.svg`). 2톤 고정 색상 아이콘(보라 계열)이라 currentColor로
 * 일반화하지 않고 실측 hex 그대로 둠 — 배경 #CCCAFC, 전경(박스 뚜껑/체크) #352DF2.
 * 확정 팔레트 어느 단계와도 일치하지 않는 개별 색상(체크리스트 19번 섹션 등록 대상).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * clip-path id는 useId()로 고유화.
 */
export interface IconFlatBoxCheckProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconFlatBoxCheck({ size = 24, ...props }: IconFlatBoxCheckProps) {
  const id = React.useId();
  const clipId = `${id}-flat-box-check-clip`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath={`url(#${clipId})`}>
        <path d="M22.5 7.96154V20.8847C22.5 21.3131 22.3297 21.7239 22.0269 22.0269C21.7239 22.3297 21.3131 22.5 20.8847 22.5H3.11538C2.68696 22.5 2.27608 22.3297 1.97313 22.0269C1.67019 21.7239 1.5 21.3131 1.5 20.8847V7.96154L3.92307 3.29307C4.44552 2.24072 5.55933 1.53019 6.73384 1.5H17.2662C18.4683 1.50064 19.6227 2.21654 20.1578 3.29307L22.5 7.96154Z" fill="#CCCAFC" />
        <path d="M3.92307 3.29307L1.5 7.96154H22.5L20.1578 3.29307C19.6227 2.21654 18.4683 1.50064 17.2662 1.5H6.73384C5.55933 1.53019 4.44552 2.24072 3.92307 3.29307Z" fill="#352DF2" />
        <path fillRule="evenodd" clipRule="evenodd" d="M11.0625 7.96154V1.5H12.9375V7.96154H11.0625Z" fill="#CCCAFC" />
        <path fillRule="evenodd" clipRule="evenodd" d="M16.4313 11.4512C16.921 11.7848 17.0206 12.4162 16.6537 12.8615L12.1355 18.3465C11.9593 18.5604 11.697 18.7019 11.4061 18.7398C11.1153 18.7777 10.8197 18.709 10.5846 18.549L7.56874 16.4945C7.07902 16.1608 6.97942 15.5295 7.34626 15.0841C7.71309 14.6388 8.40746 14.5482 8.89716 14.8818L11.0263 16.3322L14.8804 11.6535C15.2472 11.2082 15.9416 11.1176 16.4313 11.4512Z" fill="#352DF2" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="21" height="21" fill="white" transform="translate(1.5 1.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}
