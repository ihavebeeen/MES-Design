import * as React from "react";

/**
 * MES 아이콘(mes/icon-flat-out) — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달
 * (`icon-flat-out.svg`). 2톤 고정 색상 아이콘(주황 계열, 출고 표시로 추정)이라 currentColor로
 * 일반화하지 않고 실측 hex 그대로 둠 — 배경 #F8BB85, 전경(화살표) #F97A09.
 * 확정 팔레트 어느 단계와도 일치하지 않는 개별 색상(체크리스트 19번 섹션 등록 대상).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * clip-path id는 useId()로 고유화.
 */
export interface IconFlatOutProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function IconFlatOut({ size = 24, ...props }: IconFlatOutProps) {
  const id = React.useId();
  const clipId = `${id}-flat-out-clip`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath={`url(#${clipId})`}>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.16072 0.75C1.82932 0.75 0.75 1.82932 0.75 3.16072V20.8393C0.75 22.1707 1.82932 23.2501 3.16072 23.2501H14.4107C15.7422 23.2501 16.8215 22.1707 16.8215 20.8393V17.7237C16.1744 17.2056 15.7461 16.4509 15.6412 15.6161H9.9911C7.99399 15.6161 6.37501 13.9971 6.37501 12C6.37501 10.0029 7.99399 8.38392 9.9911 8.38392H15.6412C15.7462 7.54908 16.1744 6.79451 16.8215 6.27638V3.16072C16.8215 1.82932 15.7422 0.75 14.4107 0.75H3.16072Z" fill="#F8BB85" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.6259 8.78547C17.6259 8.29796 17.9195 7.85844 18.37 7.67186C18.8203 7.4853 19.3388 7.58842 19.6835 7.93315L22.8978 11.1474C23.3685 11.6182 23.3685 12.3814 22.8978 12.8521L19.6835 16.0664C19.3388 16.4111 18.8203 16.5142 18.37 16.3277C17.9195 16.1411 17.6259 15.7016 17.6259 15.2141V13.6069H9.99191C9.10432 13.6069 8.38477 12.8874 8.38477 11.9998C8.38477 11.1122 9.10432 10.3926 9.99191 10.3926H17.6259V8.78547Z" fill="#F97A09" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
