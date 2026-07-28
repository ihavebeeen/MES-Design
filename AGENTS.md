# AGENTS.md — 이 저장소에서 작업하는 모든 AI 코딩 에이전트가 지켜야 할 규칙

이 파일은 Claude Code, Codex, Cursor, Copilot 등 어떤 AI 코딩 도구를 쓰든 공통으로 읽는 표준 컨텍스트 파일이다(2026년 기준 AGENTS.md는 업계 공용 표준). Claude Code 전용 세부 규칙은 `CLAUDE.md`에도 있지만, 내용은 이 파일과 동일하게 유지한다 — 이 파일이 먼저 갱신되면 `CLAUDE.md`도 같이 갱신할 것.

## 이 프로젝트의 목적

MES(생산관리시스템) 제품의 UI 컴포넌트 라이브러리를 Figma 디자인 시스템 기준으로 구축해서, 이후 신규 화면을 AI 바이브코딩할 때 참고 컨텍스트로 쓰는 것. 담당자(이해빈)는 디자이너/기획자이며 코드를 직접 다루지 않는다 — Figma 추출, 토큰 실측, 코드 작성, 환경 구축, 배포까지 전 과정이 에이전트의 실행 책임이다.

## 매 세션 시작 시 반드시 할 것

1. `git pull origin main` 먼저 실행 — 다른 기기나 다른 도구(Claude/Codex/Cursor 등)에서 작업한 최신 내용을 받아온다.
2. `docs/` 폴더의 체크리스트 문서들과 Notion 페이지(DESIGN COMPONENT, MOBILE COMPONENT)를 확인해서 현재 진행 상태를 파악한다.
3. 사용자에게 "이어서 할 작업"을 다시 설명하지 않고, 파악한 상태 그대로 이어서 진행한다.

## 코드 빌드·검증 명령 (`component-library/`)

```
cd component-library
npm install          # 최초 1회 또는 package.json 변경 후
npm run dev           # 로컬 미리보기 서버, http://localhost:3000
npm run build          # 프로덕션 빌드 검증 (커밋 전 반드시 통과 확인)
npx eslint .            # 린트 검사
```

컴포넌트를 새로 만들거나 수정하면 커밋 전에 `npm run build`와 `npx eslint .`를 실행해서 통과를 확인한다.

## 작업 마무리 시 반드시 할 것

1. 변경사항을 의미 단위로 `git commit` 한다 (커밋 메시지는 한글로, 무엇을 왜 바꿨는지 명확히).
2. `git push origin main`을 시도한다.
   - 로컬 인증 정보 없는 격리 작업환경에 연결돼 있으면 push가 실패할 수 있다 — 이 경우 사용자에게 "GitHub Desktop에서 Push branch 눌러달라"고 안내하고 마무리한다.
   - 인증 정보가 있는 환경이면 바로 push까지 완료한다.

## 브랜치 전략

기본적으로 main에 바로 작업한다(1인 프로젝트라 충돌 위험 낮음, 문서 작업 위주). 다만 아래 경우에는 에이전트가 먼저 판단해서 "이번 건 브랜치 나눠서 할까요?"라고 사용자에게 먼저 물어보고 진행한다 — 판단은 에이전트가 하되 실행 승인은 사용자에게 받는다.

- 실험적이거나 실패 가능성이 있는 큰 변경(예: 컴포넌트 대량 리팩토링, 라이브러리 교체)
- 기존에 잘 동작하던 코드/문서를 크게 뜯어고치는 작업
- 결과가 마음에 안 들면 되돌리고 싶어질 만한 작업

단순 문서 추가/수정, 작은 버그 수정, 체크리스트 갱신 같은 건 브랜치 없이 바로 main에 커밋한다.

## 컴포넌트 실측·코드화 원칙 (재발 방지 규칙)

과거 세션에서 같은 섹션에 있다는 이유로 다른 컴포넌트의 값을 유추해 섞어 적었다가 오류가 난 적이 있음. 이후로 아래 원칙을 지킨다.

1. 측정값에는 반드시 실제로 Figma에서 조회한 node ID를 함께 기록한다 — 컴포넌트 이름만 적지 않는다.
2. 같은 패밀리·같은 섹션에 있다는 이유로 다른 컴포넌트의 값을 유추해서 채우지 않는다. 값 하나당 실측 하나가 원칙 — 예외 없음.
3. 서로 다른 두 컴포넌트의 수치가 우연히 같으면 "교차검증 성공"으로 반기지 말고 오히려 같은 노드를 두 번 참조했을 가능성을 의심한다.
4. 색상 팔레트(Gray/Primary/Danger)는 2026-07-28 기준 서로 다른 두 Figma 파일에서 각각 재대조해 확정(CONFIRMED)됐다 — `component-library/src/app/globals.css` 참고. 이 팔레트에 없는 색이 필요하면 임의로 팔레트에 편입시키지 말고 컴포넌트 코드에 출처와 함께 개별 기록한다.
5. 자세한 실측 방법론은 `docs/신규_컴포넌트_설계_프로세스.md` 참고.

## 참고 ID 모음 (검색 없이 바로 사용)

- Figma 컴포넌트 라이브러리 파일: fileKey `qEAQNTqXf76bYydyupti2V`
- Figma "MES Mobile" 페이지 노드: `163:8929`
- Figma 클라우드MES 파일(실제 서비스 화면, Button 등 컬러/상태 매트릭스 소스): fileKey `F4n5Zr04PAbiRjfIFQAo6v`
- Notion "DESIGN COMPONENT" 페이지: page_id `39d0e77b201580599d41efa847635870`
- Notion "MOBILE COMPONENT" 페이지: page_id `39d0e77b201580af9f0ef91b765a8c7e`
- GitHub 레포: `ihavebeeen/MES-Design`

## 알려진 이슈

- 이 레포 폴더가 로컬 GitHub Desktop과 동시에 열려 있으면, 격리된 작업환경에서 git 명령 실행 시 `.git/index.lock`, `.git/HEAD.lock` 같은 잠금 파일이 이미 있다는 에러가 종종 발생한다. `rm`으로 안 지워지면(`Operation not permitted`) `mv`로 파일명을 바꿔서 치우면 정상 진행된다. 삭제가 아니라 이름 변경이 핵심.
- 격리된 작업환경에는 GitHub 인증 정보가 없어서 `git push`는 항상 실패할 수 있다(의도된 제약인 경우가 많음 — 토큰을 에이전트가 직접 다루지 않기 위함). 이 경우 커밋까지만 하고, push는 사용자가 GitHub Desktop에서 직접 눌러야 한다.
- `ui.shadcn.com`, Google Fonts(`fonts.googleapis.com`) 등 일부 외부 도메인은 작업환경에 따라 네트워크가 막혀 있을 수 있다 — shadcn/ui는 CLI 대신 수동 구성, 폰트는 로컬 파일(`public/fonts/`) 자체 호스팅으로 우회했다.

## 참고 자료 우선순위

1. `docs/` 폴더의 MD 파일들 — 가장 상세한 원본
2. Notion "DESIGN COMPONENT" / "MOBILE COMPONENT" 페이지 — MD 파일과 대체로 동일하지만 일부 섹션은 축약돼 있을 수 있음(불일치 발견 시 MD 기준으로 정정)
3. Figma 파일 — 실제 디자인 원본, 토큰 실측은 여기서

## 향후 스코프 (아직 일정 미확정)

기존에 이미 개발/배포된 MES 시스템이 있으며, 장기적으로는 이 신규 컴포넌트 라이브러리 기준으로 기존 화면을 리팩토링하는 것도 목표에 포함된다(현재 일정 미확정, 컴포넌트 라이브러리 완성이 선행 조건). 원자 단위 컴포넌트(버튼/뱃지/모달 등)는 화면별 매핑 불필요 — 교체 시 전 화면에 자동 반영됨. MES 특화 복합 패턴(화면 템플릿 등)만 화면 대응 기록이 의미 있음.

## 현재 진행 상태 (최종 갱신: 2026-07-28)

- 데스크탑/모바일 컴포넌트 체크리스트 문서화 완료 (전수 재검증 완료)
- 신규 컴포넌트 설계 SOP 문서화 완료
- 주요 컴포넌트 기능 변형 심층 분석 완료
- Figma 실측 파일럿 완료 — 5개 패밀리 전체 커버 10개 컴포넌트(Button/Input Textbox/Selectbox/Badge/Center Modal/Toast/Page Top Tab Item/Sidebar(SNB)/Confirm Dialog/Table) 실측
- 색상 팔레트(Gray/Primary/Danger) 확정(CONFIRMED) — 서로 다른 두 Figma 파일에서 각각 재대조해 100% 일치 확인
- 코드 스캐폴딩 완료(`component-library/`) — Next.js 16 + React 19 + TypeScript + Tailwind CSS v4, shadcn/ui 스타일 컨벤션(수동 구성), Pretendard 폰트 자체 호스팅
- Button 컴포넌트 완성 — 사이즈 3종 × 컬러 7종 × 상태(Default/hover/disabled), 아이콘 옵션 포함
- Input Textbox / Selectbox 완성 — Figma 정밀 실측(획 두께 포함), Selectbox는 Radix Select 기반 커스텀 드롭다운으로 구현
- Combobox(검색 내장 셀렉트) 신규 완성 — Selectbox와 별도 컴포넌트로 분리(`combobox.tsx`, Radix Popover 기반). 선택 항목 hover 테두리 색은 미실측 임시값(Primary-40) 적용 중 — devtools 확인 필요(체크리스트 19번 섹션 참고)
- Badge/Radio/Checkbox 완성 — 클라우드MES 파일 정밀실측(`badge.tsx`/`radio.tsx`/`checkbox.tsx`). Badge는 Figma 이름-색상 불일치 2건(orange=실제 gray, yellow=실제 blue) 발견해 실측값 그대로 반영, 원본 확인 필요(체크리스트 19번 섹션). Checkbox는 이전 체크리스트에 "없음"으로 잘못 기재돼 있었으나 실제로 존재함을 확인해 정정. Radio/Checkbox 둘 다 disabled+선택됨 조합은 Figma에 없어 판단값 처리
- Progress Bar 완성(`progress.tsx`) — 트랙 Gray-40, 채움 Gray-100
- 필터 전용 Tag(`filter-tag.tsx`, type1/type2), 범용 3색 Tag(`tag.tsx`, node 9873:83675 —
  담당자 확인상 실사용 빈도 낮음, Badge가 주력), Filter 트리거+활성태그(`filter.tsx`) 완성
- Filter를 트리거+플라이아웃+활성태그 통합 컴포넌트로 완성(`filter.tsx` 하나로 병합, 기존
  `filter-flyout.tsx`는 삭제). 이후 담당자 재검토로 3건 추가 수정: (1) 태그를 "1개=개수
  뱃지/2개 이상=전체보기"에서 선택 개수만 항상 표시하는 방식으로 통일, (2) 트리거 박스와
  활성 태그 박스를 독립된 두 박스로 분리(태그 없으면 트리거만 노출), (3) 트리거 아이콘을
  임의 선택했던 lucide Filter(깔때기)에서 벡터 좌표 재분석 기반 SlidersHorizontal로 교체
- Select/Combobox 트리거에 `icon` prop 추가 완료 — 기본 ChevronDown 대신 다른 아이콘으로 교체 가능
- Tag(범용 3색)를 Button과 동일한 startIcon/endIcon 슬롯 구조로 재구현 — Figma에 X 아이콘이
  앞뒤 2개 있던 건 중복 실수가 아니라 원래 이런 슬롯 구조였음을 담당자가 확인해줌
- 나머지 몰큘/오가니즘(Toast/Confirm Dialog/Table/Center Modal/Page Top Tab Item/Sidebar)은
  아직 코드 없음
