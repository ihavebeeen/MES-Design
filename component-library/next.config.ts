import type { NextConfig } from "next";

/**
 * 2026-07-31 — GitHub Pages 퍼블리싱 설정.
 *
 * GitHub Pages는 정적 파일만 서빙(Node 서버 없음)하기 때문에 Next.js를
 * `output: "export"`로 빌드해서 `out/` 폴더의 순수 HTML/JS/CSS만 올려야 함.
 * 지금까지 next.config.ts에 이 설정이 없어서 GitHub Pages가 빌드 결과물을
 * 못 찾고 대신 저장소 루트의 README.md를 Jekyll로 렌더링해서 보여주고 있었음
 * ("md파일만 나온다"는 증상의 원인).
 *
 * - `output: "export"`: 배포용 `next build`에서 서버리스 정적 export(`out/`) 생성.
 *   개발 서버에서는 동적으로 생성되는 QA 경로를 정상 감지할 수 있도록 적용하지 않음.
 * - `basePath`/`assetPrefix`: GitHub Pages 프로젝트 사이트는
 *   `https://<user>.github.io/<repo>/` 처럼 서브패스에서 서빙되므로, 절대경로로
 *   불러오는 JS/CSS/이미지가 다 깨지지 않게 저장소 이름(`MES-Design`)을 붙여줘야
 *   함. 로컬 `npm run dev`/`npm run build`에서는 서브패스가 없어야 하므로
 *   `GITHUB_PAGES` 환경변수가 있을 때만 적용(GitHub Actions 워크플로에서만 설정).
 * - `images.unoptimized`: Next.js 기본 이미지 최적화는 서버가 필요해서 정적
 *   export와 호환 안 됨 — 이 프로젝트는 `next/image`를 쓰는 곳이 없어서(전부
 *   lucide-react 아이콘/인라인 SVG) 실질적 영향은 없지만, 향후 누가 next/image를
 *   추가해도 export가 안 깨지도록 미리 꺼둠.
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const isDevelopment = process.env.NODE_ENV === "development";
const repoName = "MES-Design";

const nextConfig: NextConfig = {
  output: isDevelopment ? undefined : "export",
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
