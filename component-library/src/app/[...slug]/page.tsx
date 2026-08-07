import {
  FOUNDATION_ID_LIST,
  COMPONENT_NODES,
  PATTERN_ID_LIST,
  flattenSidebarNodes,
} from "@/lib/sidebar-data";
import ClientPage from "./client-page";

/**
 * 2026-08-04 신규 — 페이지 분할(라우팅) 도입, 서버 쪽 절반.
 *
 * GitHub Pages 정적 export(`output: "export"`, next.config.ts)는 서버가 없어서 동적
 * 라우트([...slug])마다 빌드 시점에 미리 만들 경로를 알아야 함(`generateStaticParams`).
 * 근데 이 함수는 서버 컴포넌트에서만 쓸 수 있고, 실제 화면 전체(client-page.tsx)는
 * "use client" + useState/useParams 등 훅을 잔뜩 쓰는 클라이언트 컴포넌트라 이 파일에서
 * generateStaticParams와 같이 못 둠 — 그래서 이 파일(서버, 얇은 래퍼)은 경로 목록만
 * 계산해서 넘겨주고, 실제 렌더링은 client-page.tsx에 위임하는 구조로 분리.
 *
 * 경로 목록 = "/foundations"(그룹 루트, 첫 항목 기본 표시) + "/foundations/{id}" 8개
 *           + "/components"(그룹 루트) + "/components/{id}" 63개
 *           + "/patterns"(그룹 루트) + "/patterns/{id}" 8개 = 총 82개.
 */
export function generateStaticParams() {
  const foundationParams = [
    { slug: ["foundations"] },
    ...FOUNDATION_ID_LIST.map((id) => ({ slug: ["foundations", id] })),
  ];
  const componentIds = flattenSidebarNodes(COMPONENT_NODES).map((item) => item.id);
  const componentParams = [
    { slug: ["components"] },
    ...componentIds.map((id) => ({ slug: ["components", id] })),
  ];
  const patternParams = [
    { slug: ["patterns"] },
    ...PATTERN_ID_LIST.map((id) => ({ slug: ["patterns", id] })),
  ];
  return [...foundationParams, ...componentParams, ...patternParams];
}

export default function Page() {
  return <ClientPage />;
}
