import { redirect } from "next/navigation";

/**
 * 2026-08-04 신규 — 페이지 분할(라우팅) 도입으로 루트("/")는 더 이상 전체 컴포넌트를
 * 한 페이지에 렌더링하지 않음. 캐치올 라우트([...slug])는 최소 1개 세그먼트가 필요해서
 * ("/foundations", "/components"만 매칭) "/" 자체는 별도로 이 얇은 서버 컴포넌트가
 * 처리 — 첫 그룹(Foundations)으로 즉시 리다이렉트.
 */
export default function RootPage() {
  redirect("/foundations");
}
