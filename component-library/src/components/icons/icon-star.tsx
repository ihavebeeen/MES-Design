import * as React from "react";

/**
 * MES 아이콘(mes/icon-star) — 담당자가 Figma에서 직접 SVG로 export해 저장소에 전달
 * (`icon-star/Variant4~6.svg`). outline(선, fill 없음)과 filled(채움) 2가지 실제 도형이
 * 존재함을 확인(Variant5=outline, Variant4/6=filled — 셋 다 path 좌표는 동일, fill 유무만 다름).
 * 원본 프레임: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713("Section 3") 하위.
 * 색상은 currentColor로 일반화.
 */
export interface IconStarProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  /** outline(선, 기본) | filled(채움) */
  variant?: "outline" | "filled";
}

export function IconStar({ size = 24, variant = "outline", ...props }: IconStarProps) {
  const filled = variant === "filled";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.9173 3L14.6864 9.35294L21.5007 9.87539L16.1634 14.5147L17.8401 21L11.8668 17.4265L5.99449 21L7.57035 14.5147L2.33398 9.87539L9.1144 9.35294L11.9173 3Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
