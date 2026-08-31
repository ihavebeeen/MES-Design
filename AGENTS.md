# MES Design System — AI 작업 규칙

이 파일은 Codex, Claude Code, Cursor 등 저장소에서 작업하는 AI가 공통으로 읽는 현재 규칙이다. 과거 세션 일지는 실행 규칙이 아니며 Git 이력에서만 조회한다.

## 프로젝트 목적

Figma와 실제 MES 화면에서 반복되는 디자인을 토큰, 컴포넌트, 섹션 패턴, 동작 패턴, 셸과 조합 문법으로 구조화한다. 이 계약으로 신규 UI 생성과 기존 UI 오류 감사를 자동화한다.

우선순위는 다음과 같다.

1. MES 디자인 시스템의 일관성과 근거
2. 승인 자산을 사용한 UI 생성
3. 원본 화면 재현과 구현 오류 감사

## 현재 상태의 기준

- 전체 자산 조회: `component-library/src/design-system/registry/asset-manifest.json`
- 컴포넌트 신원·상태·공개 범위: `components.json`
- 신규 UI 컴포넌트 선택 규칙: `component-usage-contracts.json`
- 실제 생성 선택 오류: `generation-selection-feedback.json`
- 패턴과 조합 계약: `patterns.json`, `pattern-contracts.json`
- 화면 순서와 구성: `screens.json`, `screen-specs.json`
- Tier 후보와 판정: `tier-candidates.json`, `tier-coverage-audit.json`
- 검증 결과: `full-verification-result.json`, `web-verification-audit.json`
- 컴포넌트 문서: `docs/components/`
- MES 공통 규칙: `docs/MES_디자인_시스템_규칙.md`

상태를 사이드바, JSX 배지, README에 다시 직접 적지 않는다. 표시용 데이터는 위 원장에서 파생하거나 생성 스크립트로 갱신한다.

## 작업 시작

1. `git status --short --branch`로 사용자 변경을 확인한다.
2. 가능하면 `git pull --ff-only origin main`으로 최신 상태를 받는다.
3. 화면 생성·수정이면 `.agents/skills/generate-mes-ui/SKILL.md`를 먼저 따른다.
4. 관련 레지스트리와 컴포넌트 문서를 먼저 조회한다.

## 화면 생성과 수정

- 자연어나 Figma를 바로 JSX로 옮기지 않는다. 먼저 `ScreenRequest`를 만들고 계약을 확정한다.
- 신규 UI는 반복된 MES 업무 맥락과 조합 문법을 먼저 선택한다.
- 검증 범위는 요청한 작업에 맞춘다. 팝업 자체 수정은 메인 목록을 몰라도 진행·확인할 수 있으며, 선택값 전달·저장 후 목록 반영을 요청했을 때만 해당 연결 정보가 필요하다. 무관한 미확인 정보로 전체 작업을 막거나 연동 실패를 피하려고 범위를 축소하지 않는다.
- 신규·구조 변경은 `screen-intake-policy.json`의 질문 체계로 화면 목적·컨셉·정보 관계를 먼저 파악한다. 알려진 답은 재질문하지 않고 중요한 미정 사항만 묻는다. 배경 유지·건수 등 답 하나로 Shell이나 배치를 결정하지 않는다.
- 원본 재현은 Figma의 콘텐츠, 위계, 상태, 배치와 측정값을 먼저 대조한다.
- 실제 웹은 반복 사용 위치와 연결 구조의 참고 근거다. 단일 구현값을 표준으로 자동 승격하지 않는다.
- `component-usage-contracts.json`은 88개 전수 사용처 원장이 아니라 신규 UI의 자산 선택을 바꾸는 핵심 규칙만 담는다.
- 선택 규칙이 없는 단순 컴포넌트는 실제 소스의 API·상태 문서만 사용한다.
- **핵심 선택 규칙을 기본으로 적용하고, 생성 피드백을 통해 필요한 규칙만 추가 보강**한다. 피드백은 `generation-selection-feedback.json`에 기록한다.
- 한 화면에서만 관찰된 사용 방식은 사용자 확정 또는 공식 공통 명세가 없으면 전역 규칙으로 승격하지 않는다.
- 모든 의미 있는 Component·Section·Behavior·Shell·ActionSet은 `정확히 일치하는 승인 자산 조회 → 유사 후보의 의미 적합성 판정 → 신규 자산 제안` 순서로 선택한다. 외형이 비슷해도 의미·동작·선택 수·상태·접근성·부모 맥락이 충돌하면 대체 사용하지 않는다.
- 등록 컴포넌트와 패턴을 우선 사용한다. 화면 코드에서 원시 `button`, `input`, `select`, `textarea`를 직접 만들지 않는다.
- 기존 패턴으로 설명할 수 없는 차이는 `reuse`, `compose`, `extend`, `propose-new`, `normalize` 중 하나로 판정한다.
- 미승인 `extend`와 `propose-new`는 생성 시안 검토함에 격리한다.
- Experimental과 `influence: quarantined` 화면은 신규 생성 근거로 사용하지 않는다.

## Figma 원본 재현

1. 한 번에 한 화면만 고정한다.
2. 외곽 프레임부터 헤더, 본문, 섹션, 테이블, 행, 셀 순서로 좌표와 크기를 확인한다.
3. viewport, overlay, shell, header/body/footer, section, control 순서로 맞춘다.
4. 기존 컴포넌트를 우선 사용하고 차이는 기본값을 깨지 않는 prop 또는 variant로 확장한다.
5. Checkbox, Radio, Input, Select, 취소, X, 행 추가·삭제가 실제 상태를 변경하는지 확인한다.
6. `clientWidth`, `scrollWidth`, `clientHeight`, `scrollHeight`로 의도하지 않은 overflow를 먼저 확인한다.
7. 차이는 layout, token, component, content, state로 분리해 수정한다.
8. 시각 기준 PNG는 의도한 변경일 때만 갱신한다.

## 디자인 값과 맥락

- Figma의 고립된 3px, 9px, 13px 값을 자동 표준으로 만들지 않는다.
- 불일치는 `source-error`, `implementation-error`, `intentional-exception`, `normalization-candidate` 중 하나로 기록한다.
- 셸 종류, 섹션 순서, 링크·배지 의미, 선택 상태와 입력 전환은 시각적 유사성보다 우선한다.
- 복수 논리 섹션의 padding, divider, background는 `SectionFrame`이 소유하고 제목은 `SectionHeader`가 담당한다. 단일 테이블·리스트·작업영역의 이름은 배경 없는 `ContentRegionHeading`을 사용한다.
- 모달 헤더는 팝업 전체를 설명하며 모든 모달에 필요하다. 섹션 헤더는 복수 섹션을 구분할 때만 사용한다.
- 표의 header, group, row, totals는 선택 열과 컬럼 폭 배열을 공유해야 한다.
- 취소와 X는 같은 dismiss 경로를 사용하고 편집값을 복원한다.

## 컴포넌트 변경

- 공개 자산은 `components.json`에 `visibility`, `tier`, `documentationMode`, `documentationRoute`를 기록한다.
- 신규 UI의 자산 선택 결과를 바꾸는 사용 맥락이 달라질 때만 `component-usage-contracts.json`을 갱신한다.
- optional prop을 추가하거나 의미를 바꾸면 `docs/컴포넌트_OPTIONAL_PROP_레지스트리.md`도 갱신한다.
- `src/components/ui`의 활성 파일은 모두 레지스트리에 등록한다.
- `.removed-*`, `.bak` 파일을 활성 `src` 아래에 보관하지 않는다. 복구는 Git 이력을 사용한다.
- 변경 후 `npm run sync:assets`로 통합 원장과 컴포넌트 문서를 갱신한다.

## 검증

일반 변경은 `component-library/`에서 다음을 실행한다.

```bash
npm run sync:assets
npm run check:design-system
npm run lint:design-system
npm run build
```

배포 전 또는 공통 기반 변경은 다음을 실행한다.

```bash
npm run verify:full
```

`verify:full`은 검사, lint, Playwright, build 결과를 `full-verification-result.json`과 검증 문서에 자동 기록한다. 테스트 개수와 날짜를 문서에 직접 입력하지 않는다.

## 완료 표현

- `구현됨`: 코드와 계약이 존재하지만 원본 대조 또는 전체 검증이 남음
- `검증됨`: 선언한 대상이 원본 대조, 브라우저 실측, 상호작용, 회귀 검사를 통과함
- `배치 완료`: 시작 전에 선언한 배치 전체가 검증됨
- `전체 완료`: queued, in-progress, 미승인, 보류, TODO가 모두 0임

최종 보고에는 반드시 다음 네 항목을 구분한다.

- 이번 범위 상태
- 검증 근거
- 남은 작업
- 전체 프로젝트 상태

## Git 안전

- 사용자 변경과 무관한 파일을 되돌리지 않는다.
- 파괴적인 Git 명령을 사용하지 않는다.
- 의미 단위로 커밋하고 검증되지 않은 내용을 완료라고 쓰지 않는다.
- push는 인증과 사용자 의도를 확인한 뒤 수행한다. 인증이 없으면 GitHub Desktop에서 Push origin을 요청한다.
