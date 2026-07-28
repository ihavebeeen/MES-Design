import * as React from "react";

/**
 * MES 아이콘(mes/icon-bell) — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달
 * (`icon-bell/Variant5~8.svg`). 실제로 outline(선)형과 filled(채움)형 2가지 실제 도형이
 * 존재함을 4개 파일 대조로 확인(단순 색상 차이가 아님) — variant prop으로 구분해서 노출.
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 색상은 currentColor로 일반화.
 */
export interface IconBellProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  /** outline(선, 기본) | filled(채움) — Figma에 둘 다 실제로 존재하는 서로 다른 도형 */
  variant?: "outline" | "filled";
}

export function IconBell({ size = 24, variant = "outline", ...props }: IconBellProps) {
  const filled = variant === "filled";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.35352 21C10.0586 21.6224 10.9849 22 11.9993 22C13.0138 22 13.94 21.6224 14.6452 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.0008 8C18.0008 6.4087 17.3686 4.88258 16.2434 3.75736C15.1182 2.63214 13.5921 2 12.0008 2C10.4095 2 8.88333 2.63214 7.75811 3.75736C6.63289 4.88258 6.00075 6.4087 6.00075 8C6.00075 11.0902 5.22122 13.206 4.35042 14.6054C3.61588 15.7859 3.24861 16.3761 3.26208 16.5408C3.27699 16.7231 3.31561 16.7926 3.46253 16.9016C3.59521 17 4.19334 17 5.38961 17H18.6119C19.8082 17 20.4063 17 20.539 16.9016C20.6859 16.7926 20.7245 16.7231 20.7394 16.5408C20.7529 16.3761 20.3856 15.7859 19.6511 14.6054C18.7803 13.206 18.0008 11.0902 18.0008 8Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
