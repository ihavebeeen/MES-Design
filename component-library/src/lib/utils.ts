import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스를 조건부로 병합하는 헬퍼.
 * shadcn/ui 계열 컴포넌트에서 쓰는 표준 패턴과 동일 (clsx + tailwind-merge).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
