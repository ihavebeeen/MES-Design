# AI 화면 생성 이식성 가이드

## 목적

이 문서는 다른 컴퓨터에서 다른 AI 도구를 사용하더라도 같은 MES 디자인 시스템 계약으로 화면을 만들기 위한 실행 기준입니다. 목표는 프롬프트 문장을 복사하는 것이 아니라, AI의 자유 판단 범위를 저장소 안의 데이터와 검사 명령으로 제한하는 것입니다.

## 지금 보장하는 범위

| 단계 | 현재 상태 | 의미 |
|---|---|---|
| AI 작업 규칙 발견 | 구현됨 | `AGENTS.override.md`와 repo Skill을 Git으로 공유 |
| AI 도구 인터페이스 | 구현됨 | Codex·Claude Code가 같은 로컬 `mes-ui` MCP 도구 7개를 호출 |
| 화면 조합 선택 | 검증됨 | 같은 요청·같은 커밋에서 같은 shell/section/behavior/action/component refs와 fingerprint 생성 |
| 구현 위반 탐지 | 구현됨 | 원시 HTML 상호작용, 잘못된 셸, 미등록 UI import, no-op handler, 임의 px를 severity별 탐지 |
| TSX 코드 동일성 | 확장 검증됨 | 우측 슬라이드와 중앙 검색 테이블은 stable 결정형 생성, 페이지 엔티티 목록은 provisional 결정형 생성 |
| 최종 픽셀 동일성 | 화면별 검증 | Figma 실측과 Playwright 시각 회귀를 통과한 화면에만 주장 가능 |

따라서 지금부터는 다른 AI가 엉뚱한 중앙 모달, 임의 카드, 원시 button을 선택하는 문제를 상당 부분 차단할 수 있습니다. 우측 슬라이드의 폼 + 반복 입력 행과 중앙 검색 테이블은 같은 계약에서 완전히 같은 소스 코드를 만들 수 있습니다. 페이지 엔티티 목록도 같은 소스를 만들지만 provisional 의존성과 시각 근거 경고를 유지합니다. 나머지 Recipe는 순차적인 템플릿 추가가 필요합니다.

## 다른 컴퓨터에서 시작하기

1. 저장소의 같은 커밋을 checkout합니다.
2. Node `24.18.0`을 사용합니다. 루트 `.nvmrc`가 기준입니다.
3. `component-library`에서 `npm ci`를 실행합니다.
4. Codex는 `.codex/config.toml`, Claude Code는 `.mcp.json`에 등록된 로컬 `mes-ui` MCP를 발견합니다. 복제한 프로젝트는 임의 코드를 실행하지 못하도록 최초 1회 신뢰 및 MCP 승인이 필요합니다.
5. Codex는 `.agents/skills/generate-mes-ui`를 저장소 Skill로 자동 발견합니다. Claude Code는 `CLAUDE.md`, Cursor는 `.cursor/rules/mes-ui.mdc`, GitHub Copilot은 `.github/copilot-instructions.md`를 통해 같은 공통 정책과 Skill로 진입합니다.
6. 신규 UI는 `mes_list_design_system` → `mes_get_web_generation_context` → `mes_resolve_screen` → `mes_generate_screen` → `mes_audit_screen` 순서로 작업합니다. 기존 화면 재현·정규화·감사에서만 `mes_get_reproduction_audit_context`를 추가로 호출합니다. MCP가 없는 클라이언트에서는 아래 CLI가 같은 엔진을 실행합니다.

```bash
cd component-library
npm run screen:resolve -- .mes-ui-preview/example/request.json --out .mes-ui-preview/example/contract.json
npm run screen:generate -- .mes-ui-preview/example/contract.json --preview
```

프로토타입 요청·계약은 `.mes-ui-preview/`, 생성 코드는 `src/generated-previews/`, 미리보기 라우트는 `src/app/preview/`에 둡니다. 세 경로는 모두 Git에서 제외됩니다. 생성기는 `ScreenRequest.output.route`에 맞춰 `http://localhost:3000/preview/<request-id>` 주소를 반환합니다. `npm run dev`가 실행 중이면 사용자는 이 주소에서 결과를 바로 확인합니다.

임시 프로토타입은 `generated-screen-evaluations.json`이나 정식 화면 레지스트리에 자동 등록하지 않습니다. 사용자가 보관 또는 승격을 명시한 화면만 별도 검토 후 추적 경로로 이동합니다.

출력의 `fingerprint`가 다르면 두 컴퓨터의 요청 또는 레지스트리 커밋이 다른 것입니다. fingerprint가 같으면 AI가 읽어야 하는 구현 계약은 같습니다.

계약의 `decisionTrace`에서 선택된 셸·섹션·동작·액션·컴포넌트와 제외 후보의 이유를 확인할 수 있습니다. 이 값이 없으면 구현 감사가 차단합니다.

## 로컬 MCP의 의미

`component-library/scripts/mes-ui-mcp-server.mjs`는 별도 클라우드나 상시 웹 서버가 아닙니다. Codex 또는 Claude Code가 프로젝트에서 Node 프로세스로 시작하고, 표준 입출력으로만 호출한 뒤 클라이언트 종료 시 함께 종료되는 로컬 도구입니다.

- `mes_list_design_system`: 등록 컴포넌트·패턴·화면·생성 템플릿 조회
- `mes_get_web_generation_context`: 원본 없는 신규 UI에 사용할 실제 웹 반복 조합 문법 조회
- `mes_get_reproduction_audit_context`: 기존 화면의 실제 웹·Figma·불일치·검증 상태 조회
- `mes_resolve_screen`: ScreenRequest를 결정형 계약으로 해석
- `mes_generate_screen`: 지원 템플릿의 TSX와 개별 localhost 미리보기 페이지를 Git-ignored 임시 경로에 생성하고 즉시 감사
- `mes_audit_screen`: 기존 TSX/JSX를 요청 계약과 레지스트리에 대조

서버는 절대경로, `component-library` 외부 경로, `src/` 외부 출력, 기존 파일 덮어쓰기를 거부합니다. 연결과 실제 도구 호출은 다음 명령으로 검증합니다.

```bash
cd component-library
npm run mcp:check
```

## ScreenRequest 작성 순서

1. `intent`: 원본 재현인지, 신규 생성인지, 정규화인지, 감사인지 선택합니다.
2. 신규 생성은 `webContext`에 선택한 page archetype 또는 overlay grammar와 section recipe를 기록합니다. 누락되거나 target과 맞지 않으면 resolver가 차단합니다.
3. `target.kind`: page / center-modal / side-slide-panel / confirm-dialog 중 업무 맥락에 맞는 셸을 선택합니다.
4. `nearestScreenId`: 가장 가까운 기존 업무 흐름을 선택합니다.
5. 기존 화면과 다른 부분만 `composition`에서 override합니다. 빈 객체이면 기준 화면의 조합을 그대로 상속합니다.
   - 대표 ScreenSpec이 있는 화면은 순서형 `composition.sections`를 상속합니다.
   - `sectionRefs`는 이 구조에서 파생되는 호환 요약이며 섹션 순서를 임의로 다시 정하는 근거가 아닙니다.
6. 자연어 요구사항은 `requirements`에 업무 상태와 결과 중심으로 적습니다.
7. 원본 재현은 `evidence.figmaNode`가 없으면 resolver blocker가 됩니다.

예제는 `component-library/tests/fixtures/screen-requests/receiving-side-panel.json`에 있습니다.

## 결과 판정

- `blocked`: 등록되지 않은 ID, target과 다른 셸, 잘못된 요청 구조처럼 구현 전에 해결해야 할 오류가 있습니다.
- `review-ready`: 구현은 진행할 수 있지만 provisional 컴포넌트나 정규화 판단처럼 검토할 경고가 있습니다.
- `release-ready`: 계약 단계의 blocker와 warning이 없습니다. 이것만으로 시각 검증까지 끝났다는 뜻은 아닙니다.

경고 한 건을 화면 전체 실패로 취급하지 않습니다. 경고별로 수용, 수정, 근거 추가 중 하나를 기록합니다.

## 구현 후 감사

```bash
npm run screen:audit -- deterministic-side-slide.contract.json src/path/to/screen.tsx
```

감사기는 다음을 확인합니다.

- 계약 fingerprint 변조 여부
- `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>` 직접 사용
- target과 일치하는 Shell 컴포넌트 사용
- 순서형 ScreenSpec의 `data-section-id` 존재와 순서
- 패턴 계약의 구현 marker와 등록 action set 사용
- 등록되지 않은 UI/Pattern import
- 상태를 바꾸지 않는 no-op handler
- Figma 근거나 정규화 판정이 필요한 arbitrary px 값

감사 이후에도 대상 viewport의 DOM overflow 측정, 실제 상호작용, Playwright 시각 회귀와 production build를 실행해야 화면을 `검증됨`으로 표시할 수 있습니다.

## 앞으로의 결정적 코드 생성

코드까지 같은 결과를 만들기 위해 모든 화면을 하나의 거대한 생성기로 처리하지 않습니다. 먼저 반복되고 검증된 Recipe부터 템플릿화합니다.

1. 우측 슬라이드 폼 + 반복 입력 행 — stable, 구현·결정성·감사 통과
2. 중앙 검색·선택 테이블 — stable, 구현·결정성·감사 통과
3. 중앙 비교/확인
4. 페이지 엔티티 리스트 — provisional, 결정성·blocker 감사 통과, 원본·의존성 안정화 대기

각 템플릿은 자유 JSX가 아니라 정해진 slot에 필드·컬럼·상태 계약만 주입해야 합니다. 새 맥락은 자동으로 템플릿을 늘리지 않고 quarantined proposal과 생성 화면 검토함을 거칩니다.
