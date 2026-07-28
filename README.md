# MES-Design

MES(생산관리시스템) UI 컴포넌트 라이브러리 - 
Figma 디자인 시스템을 코드로 옮기고, AI 바이브코딩 시 참고 컨텍스트로 쓰기 위한 저장소.

## 문서 (docs/)

- `UI_컴포넌트_총망라_체크리스트.md` — 데스크탑 컴포넌트 전체 체크리스트 (티어 1~5, 상태·기능변형 포함)
- `모바일_컴포넌트_체크리스트.md` — 모바일 컴포넌트 체크리스트 (Material Design 3 / iOS HIG 대조 포함)
- `신규_컴포넌트_설계_프로세스.md` — 새 컴포넌트를 설계할 때 따르는 표준 절차(SOP)
- `컴포넌트_기능_변형_심층분석.md` — 주요 컴포넌트별 기능 범위 심층 분석 및 구현 스펙 결론

## 코드 (component-library/)

Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 기반 컴포넌트 라이브러리. shadcn/ui 스타일 컨벤션(`cn()` 헬퍼, `class-variance-authority` 변형, Radix UI 프리미티브)을 따르되, CLI(`shadcn init`)는 이 작업환경의 네트워크 제약으로 쓸 수 없어 수동으로 동일 구조를 갖췄다.

- `src/app/globals.css` — Figma 실측 색상 팔레트(Gray/Primary/Danger, 전체 재검증 완료분) Tailwind 토큰화
- `src/lib/utils.ts` — `cn()` 클래스 병합 헬퍼
- `src/components/ui/` — 실제 컴포넌트 구현체 (현재 Button 1개, Step C-1 실측값 기반)
- `components.json` — shadcn 스타일 별칭 설정(문서화 목적, CLI 미사용)

로컬 실행: `component-library/` 안에서 `npm install && npm run dev`

## 진행 상태

Figma 실측 파일럿(10개 컴포넌트) 완료 후 코드 스캐폴딩 착수. 현재 Button 컴포넌트(fill-main, basic/small 사이즈)까지 구현·빌드 검증 완료. 나머지 9개 실측 완료 컴포넌트(Input Textbox/Selectbox/Badge/Center Modal/Toast/Confirm Dialog/Table/Page Top Tab Item/Sidebar)와 티어1 나머지 컴포넌트는 순차 코드화 예정.
