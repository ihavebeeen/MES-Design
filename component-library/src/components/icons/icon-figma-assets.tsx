import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FigmaAssetIconProps extends Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "width" | "height"> {
  size?: number;
}

function AssetIcon({ src, size, className, ...props }: FigmaAssetIconProps & { src: string }) {
  return <Image src={src} width={size} height={size} alt="" aria-hidden className={cn("block shrink-0 object-contain", className)} {...props} />;
}

/** Figma node 11210:55901에서 export한 원본 벡터. */
export function IconEyeMono({ size = 16, ...props }: FigmaAssetIconProps) {
  return <AssetIcon src="/icons/mes-icon-eye-on-mono.svg" size={size} {...props} />;
}

/** Figma node 11210:55907에서 export한 원본 벡터. */
export function IconCalculator({ size = 16, ...props }: FigmaAssetIconProps) {
  return <AssetIcon src="/icons/mes-icon-calculator.svg" size={size} {...props} />;
}

/** Figma node 11210:55917에서 export한 원본 벡터. */
export function IconDragHandle({ size = 20, ...props }: FigmaAssetIconProps) {
  return <AssetIcon src="/icons/mes-icon-drag-handle.svg" size={size} {...props} />;
}
