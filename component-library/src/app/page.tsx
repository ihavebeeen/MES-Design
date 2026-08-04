import ClientPage from "./[...slug]/client-page";

/**
 * 2026-08-04 — 담당자 리포트: "홈을 가면 왜 foundation 카드들만 뜨고 컴포넌트들은 안
 * 떠?" — 기존엔 "/"이 그냥 `redirect("/foundations")`라 Foundations 그룹만 보였음.
 * 캐치올 라우트([...slug])는 "/"과 매칭이 안 돼서(최소 1개 세그먼트 필요) 별도
 * 파일이 필요한 건 그대로지만, 리다이렉트 대신 같은 `ClientPage`를 직접 렌더링 —
 * 이 컴포넌트는 `useParams()`로 slug가 없으면("/") activeGroup을 "home"으로 판단해
 * Foundation+Components 카드 그리드를 같이 보여줌(자세한 분기는 client-page.tsx 참고).
 * 동적 세그먼트가 아니라서 `generateStaticParams` 없이도 정적 export 시 그냥
 * out/index.html로 정상 생성됨.
 */
export default function RootPage() {
  return <ClientPage />;
}
