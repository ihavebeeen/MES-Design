# AI 화면 생성 이식성 가이드

## 목적

이 문서는 다른 컴퓨터에서 다른 AI 도구를 사용하더라도 같은 MES 디자인 시스템 계약으로 화면을 만들기 위한 실행 기준입니다. 목표는 프롬프트 문장을 복사하는 것이 아니라, AI의 자유 판단 범위를 저장소 안의 데이터와 검사 명령으로 제한하는 것입니다.

## 지금 보장하는 범위

| 단계 | 현재 상태 | 의미 |
|---|---|---|
| AI 작업 규칙 발견 | 구현됨 | `AGENTS.override.md`와 repo Skill을 Git으로 공유 |
| 화면 조합 선택 | 검증됨 | 같은 요청·같은 커밋에서 같은 shell/section/behavior/action/component refs와 fingerprint 생성 |
| 구현 위반 탐지 | 구현됨 | 원시 HTML 상호작용, 잘못된 셸, 미등록 UI import, no-op handler, 임의 px를 severity별 탐지 |
| TSX 코드 동일성 | 미구현 | 현재 AI가 계약 안에서 코드를 작성하므로 표현 순서까지 byte 단위로 같지는 않음 |
| 최종 픽셀 동일성 | 화면별 검증 | Figma 실측과 Playwright 시각 회귀를 통과한 화면에만 주장 가능 |

따라서 지금부터는 다른 AI가 엉뚱한 중앙 모달, 임의 카드, 원시 button을 선택하는 문제를 상당 부분 차단할 수 있습니다. 완전히 같은 소스 코드까지 필요하면 검증된 Recipe별 템플릿 생성기가 추가로 필요합니다.

## 다른 컴퓨터에서 시작하기

1. 저장소의 같은 커밋을 checkout합니다.
2. Node `24.18.0`을 사용합니다. 루트 `.nvmrc`가 기준입니다.
3. `component-library`에서 `npm ci`를 실행합니다.
4. Codex는 `.agents/skills/generate-mes-ui`를 저장소 Skill로 자동 발견합니다. Claude Code는 `CLAUDE.md`, Cursor는 `.cursor/rules/mes-ui.mdc`, GitHub Copilot은 `.github/copilot-instructions.md`를 통해 같은 공통 정책과 Skill로 진입합니다.
5. 화면 요청 JSON을 작성하고 resolver를 먼저 실행합니다.

```bash
cd component-library
npm run screen:resolve -- tests/fixtures/screen-requests/receiving-side-panel.json --out receiving.contract.json
```

출력의 `fingerprint`가 다르면 두 컴퓨터의 요청 또는 레지스트리 커밋이 다른 것입니다. fingerprint가 같으면 AI가 읽어야 하는 구현 계약은 같습니다.

## ScreenRequest 작성 순서

1. `intent`: 원본 재현인지, 신규 생성인지, 정규화인지, 감사인지 선택합니다.
2. `target.kind`: page / center-modal / side-slide-panel / confirm-dialog 중 업무 맥락에 맞는 셸을 선택합니다.
3. `nearestScreenId`: 가장 가까운 기존 업무 흐름을 선택합니다.
4. 기존 화면과 다른 부분만 `composition`에서 override합니다. 빈 객체이면 기준 화면의 조합을 그대로 상속합니다.
5. 자연어 요구사항은 `requirements`에 업무 상태와 결과 중심으로 적습니다.
6. 원본 재현은 `evidence.figmaNode`가 없으면 resolver blocker가 됩니다.

예제는 `component-library/tests/fixtures/screen-requests/receiving-side-panel.json`에 있습니다.

## 결과 판정

- `blocked`: 등록되지 않은 ID, target과 다른 셸, 잘못된 요청 구조처럼 구현 전에 해결해야 할 오류가 있습니다.
- `review-ready`: 구현은 진행할 수 있지만 provisional 컴포넌트나 정규화 판단처럼 검토할 경고가 있습니다.
- `release-ready`: 계약 단계의 blocker와 warning이 없습니다. 이것만으로 시각 검증까지 끝났다는 뜻은 아닙니다.

경고 한 건을 화면 전체 실패로 취급하지 않습니다. 경고별로 수용, 수정, 근거 추가 중 하나를 기록합니다.

## 구현 후 감사

```bash
npm run screen:audit -- receiving.contract.json src/path/to/screen.tsx
```

감사기는 다음을 확인합니다.

- 계약 fingerprint 변조 여부
- `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>` 직접 사용
- target과 일치하는 Shell 컴포넌트 사용
- 등록되지 않은 UI/Pattern import
- 상태를 바꾸지 않는 no-op handler
- Figma 근거나 정규화 판정이 필요한 arbitrary px 값

감사 이후에도 대상 viewport의 DOM overflow 측정, 실제 상호작용, Playwright 시각 회귀와 production build를 실행해야 화면을 `검증됨`으로 표시할 수 있습니다.

## 앞으로의 결정적 코드 생성

코드까지 같은 결과를 만들기 위해 모든 화면을 하나의 거대한 생성기로 처리하지 않습니다. 먼저 반복되고 검증된 Recipe부터 템플릿화합니다.

1. 우측 슬라이드 폼 + 반복 입력 행
2. 중앙 검색·선택 테이블
3. 중앙 비교/확인
4. 페이지 엔티티 리스트

각 템플릿은 자유 JSX가 아니라 정해진 slot에 필드·컬럼·상태 계약만 주입해야 합니다. 새 맥락은 자동으로 템플릿을 늘리지 않고 quarantined proposal과 생성 화면 검토함을 거칩니다.
