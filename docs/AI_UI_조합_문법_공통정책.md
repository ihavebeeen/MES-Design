# AI UI 조합 문법 공통 정책

> 정책 ID: `mes.ai-composition-grammar`
> 버전: `1.5.0`
> 상태: 공통 정책 확정
> 최초 확정일: 2026-08-11
> 현재 구현 동기화: 2026-08-25

## 1. 목적

이 정책은 AI가 MES 화면을 생성할 때 디자인 시스템을 단순한 에셋·컴포넌트 목록으로 해석하지 않도록 하기 위한 공통 기준이다.

MES 디자인 시스템은 다음을 모두 포함한다.

- 토큰과 아이콘 등 기초 자산
- 개별 UI 컴포넌트와 상태·variant
- 의미 역할·부모·업무 구조에 따른 맥락 선택 규칙
- 컴포넌트를 배치하는 Shell과 Section 구조
- 반복 가능한 Section·Behavior 패턴
- 패턴을 조합하는 문법과 사용 조건
- 검증된 화면 Recipe와 실제 ScreenSpec
- 실제 MES에서 관찰한 사용 위치와 팝업 연결 흐름
- 신규 조합을 판정·승인·격리하는 운영 절차

등록된 컴포넌트를 사용했다는 사실만으로 디자인 시스템 준수로 판정하지 않는다. 구성 요소의 역할, 중첩, 순서, 상태 전이와 상호작용도 이 정책으로 설명할 수 있어야 한다.

## 2. 공통 계층

| 계층 | 역할 | 예시 |
|---|---|---|
| Token / Asset | 시각적 원자값과 아이콘 | 색상, 간격, 타이포, MES 아이콘 |
| Component | 독립적인 UI 부품 | Button, Input, Select, Table |
| Context Rule | 의미 역할과 부모 맥락에 따른 선택·제외 조건 | 헤더, 팝업, 액션, 입력, 경계, 테이블, 스크롤 선택 |
| Shell | 화면·팝업의 외곽과 고정 슬롯 | 중앙 모달, 우측 슬라이드, Header/Body/Footer |
| Section Frame | 섹션의 공통 외형 | 제목 밴드, 패딩, 구분선, 접기/펼치기 |
| Section Pattern | 컴포넌트의 재사용 가능한 본문 조합 | 폼 그리드, 반복 입력 행, 검색 테이블, 검사항목 |
| Behavior Pattern | 상태와 상호작용 계약 | 행 추가·삭제, 직전 거래처 계승, 취소 복원 |
| Observed Usage Evidence | 실제 웹에서 발견한 사용 위치·진입·연결 근거 | 메뉴→중앙 선택→우측 등록, 조건부 중첩 팝업 |
| Web Generation Grammar | 반복된 실제 웹 근거를 신규 생성용으로 압축한 선택 문법 | 목록 페이지, 등록 슬라이드, 선택 후 등록 흐름 |
| Recipe / Archetype | 검증된 Shell·Section·Behavior 조합 예제 | 입고등록 계열, 마스터–상세 계열 |
| ScreenSpec | 실제 화면의 문구·필드·데이터·권한 | 이지모드 입고등록, 투입품목 설정/조회 |

`Recipe / Archetype`은 패턴의 상위 조합 결과다. 화면을 구성하는 가장 작은 패턴 단위로 사용하지 않는다.

Context Rule은 시각 계층이 아니라 선택 계층이다. 같은 Header 계열이거나 같은 회색 배경을 가진다는 사실보다 무엇을 설명하고 어느 부모 안에 놓이는지를 먼저 판정한다.

### 2.1 실제 웹 관찰 근거의 권한

`web-ui-usage-inventory.json`은 실제 MES에서 어디에 무엇이 쓰이고 어떤 팝업으로 연결되는지 보존하는 관찰 원장이다. 신규 생성기가 이 원장을 그대로 읽으면 단일 구현 오류와 감사 정보까지 조합 판단에 섞이므로, 반복 구조만 `web-generation-context.json`으로 압축한다.

- `intent: new`는 승인된 Context Rule·Pattern·Component 계약과 반복된 웹 생성 문법을 사용한다. 화면별 Figma 대조 이력과 미검증 수치는 생성 입력에서 제외한다.
- `intent: reproduce | normalize | audit`에서만 실제 웹 원장과 `web-figma-reconciliation.json`을 함께 조회한다.
- 최신 Figma 원본은 기존 화면 재현의 콘텐츠·위계·상태·배치 기준이다. 원본 없는 신규 생성에서는 업무 의도와 조합 문법을 고르는 출발점이 아니다.
- 실제 웹에서 반복된 위치와 연결 구조는 신규 조합 선택에 사용하되, 단일 구현의 수치와 예외를 표준값으로 자동 복사하지 않는다.
- 같은 기능이 서로 다른 Shell에서 열리면 둘 다 표준으로 인정하지 않고 불일치로 남긴다.
- 업무 권한·API·데이터 처리 정책은 이 근거 레이어에 포함하지 않는다.

## 3. 조합 문법

```text
ScreenSpec
  = ContextDecision
  + Shell
  + SectionInstance[1..n]
  + BehaviorReference[0..n]
  + ActionSet

SectionInstance
  = SectionFrame
  + SectionPattern
  + ScreenData/Copy/FieldConfig
```

### 3.0 Context Decision

- AI는 Shell과 컴포넌트를 고르기 전에 `context-rules.json`의 의미 역할, 부모 맥락, 업무 형태, 정보 구조와 원본 근거를 판정한다.
- 모든 오버레이에는 전체 목적을 설명하는 root heading이 정확히 하나 필요하다.
- Section heading은 선택 요소이며 본문에 독립적인 논리 섹션이 있을 때만 사용한다.
- 단일 테이블·리스트의 이름은 content region heading으로 처리하며 모달용 회색 SectionHeader를 자동 사용하지 않는다.
- 중앙 모달, 우측 슬라이드, 확인 팝업은 외형이 아니라 업무 길이·배경 맥락 유지·정보 구조로 고른다.
- Button·Link·Badge는 클릭 결과와 상태 의미로 구분한다.
- Input·Select·Combobox·Radio·Checkbox·Switch는 값 범위, 선택 수와 commit 시점으로 구분한다.
- Table은 반복 레코드의 공통 컬럼이 있을 때만 사용하고 반복 입력 Form의 정렬 도구로 사용하지 않는다.
- SectionFrame과 결과 요약 Card는 의미 경계가 있을 때만 사용한다.
- Shell과 내부 콘텐츠 중 같은 축의 스크롤 소유자는 하나만 선택한다.
- 페이지용 섹션 제목은 반복 근거가 부족하므로 현재 자동 선택 금지 상태다.

세부 규칙은 [AI UI 맥락 규칙](./AI_UI_맥락_규칙.md)을 따른다.

### 3.1 Shell

- 중앙 모달과 우측 슬라이드는 서로 다른 Shell이다.
- Shell은 Header, Body, Footer 슬롯과 배치·크기·스크롤 책임을 가진다.
- 모달 제목과 닫기 버튼은 Header 슬롯의 표준 계약으로 관리한다.
- Footer는 액션 배치 계약을 제공하며 버튼 문구를 `취소/저장`으로 고정하지 않는다.
- 본문 패턴은 Shell의 외곽 padding, radius, overlay와 위치를 임의로 변경하지 않는다.

### 3.2 Section Frame

- 섹션 제목, 배경, 타이포, 패딩, 하단 구분선과 접기/펼치기 외형을 담당한다.
- `기본정보`는 패턴 ID가 아니라 화면별 제목이다.
- 동일한 Section Frame에 서로 다른 Section Pattern을 넣을 수 있다.
- Confirm 메시지처럼 별도 제목 밴드가 불필요한 본문은 `frame: none`을 명시할 수 있다.

### 3.3 Section Pattern

현재 승인·구현된 공용 Section Pattern은 다음과 같다.

- `section.form-grid`: 라벨과 입력 컨트롤의 열 기반 배열
- `section.editable-row-list`: 행 단위 반복 입력과 추가·삭제
- `section.search-table-composition`: 조회 조건·검색·테이블
- `section.inspection-items`: 검사항목과 판정 입력
- `summary.table-total-row`: 표 컬럼과 정렬되는 합계행
- `summary.result-total-card`: 표 밖의 독립 결과 요약

`before-after`, 접이식 입력 Frame, 수량 상태 카드는 현재 반복 근거가 부족하여 공용 패턴으로 승격하지 않고 해당 Recipe/ScreenSpec의 로컬 조합으로 유지한다.

### 3.4 Behavior Pattern

Behavior는 시각 패턴에 암묵적으로 숨기지 않고 대상과 상태 계약을 명시한다.

- `row.mutation-policy`
- `selection.reveal-inline-editor`
- `selection.enable-actions`
- `selection.master-detail`
- `dismiss.restore-committed`

Behavior는 어떤 Section 또는 Action에 적용되는지 target을 가져야 한다. 직전 거래처 계승처럼 단일 화면에만 확인된 초기값 정책은 공용 Behavior가 아니라 해당 ScreenSpec의 `row.mutation-policy` 설정으로 기록한다.

## 4. 패턴 등록 단위

화면에 보이는 모든 섹션 인스턴스를 패턴으로 등록하지 않는다. 다음 질문을 모두 또는 대부분 만족할 때 Section/Behavior 패턴 후보가 된다.

1. 화면·업무 이름 없이 독립적인 역할로 설명할 수 있는가?
2. 데이터와 문구만 바꿔 다른 화면에서 재사용할 수 있는가?
3. 고유한 레이아웃, 슬롯 또는 상태 전이 계약을 가지는가?
4. 독립적인 시각·상호작용 테스트가 가능한가?
5. 기존 패턴의 단순 설정값으로 표현하는 것보다 별도 계약이 더 명확한가?

판정 결과:

- 같은 목적과 상태 모델이며 필드·크기만 다르면 기존 패턴의 variant 또는 config다.
- 기존 Section·Behavior를 조합할 수 있으면 신규 패턴을 만들지 않는다.
- 기존 패턴이 선언한 책임 범위인데 표현하지 못하면 기존 패턴의 불완전성을 검토하고 확장·분해한다.
- 사용자 행동, 상태 전이 또는 정보 위계가 본질적으로 다를 때 신규 패턴 후보가 된다.
- 업무·상태 근거가 없는 단발성 시각 차이는 기존 표준으로 정규화한다.

## 5. AI 생성 정책

> **핵심 선택 규칙을 기본으로 적용하고, 생성 피드백을 통해 필요한 규칙만 추가 보강**

AI는 JSX를 작성하기 전에 다음 순서를 지킨다.

1. 요구사항을 ScreenSpec 후보로 정규화한다.
2. `select.overlay-shell`, `select.heading-context`, `select.action-role`, `select.input-control`, `select.content-boundary`, `select.table-model`, `select.scroll-owner`로 의미 역할과 부모 맥락을 판정한다.
3. Shell, Section, Behavior, ActionSet, Component마다 의미·동작·상태·부모 맥락에 정확히 맞는 승인 자산을 조회한다.
4. 정확한 자산이 없으면 가장 가까운 후보의 의미 역할, 동작 결과, 선택 수, 상태 모델, 접근성, 허용 부모와 정보 위계를 비교한다. 이를 보존할 수 있을 때만 `reuse`, `compose`, `extend`한다.
5. 유사 후보도 사용할 수 없을 때만 `propose-new`한다. 시각적으로 비슷하다는 이유로 의미가 다른 자산을 변형하지 않는다.
6. 각 차이를 `reuse`, `compose`, `extend`, `propose-new`, `normalize`로 확정하고 선택·탈락 근거와 승인 상태를 PatternDecision에 기록한다.
7. 승인된 Shell과 Section Pattern의 슬롯 안에 컴포넌트를 배치한다.
8. 임의 wrapper, 배경, radius, 안내 문구와 정보 위계를 추가하지 않는다.
9. 정적·상호작용·시각 검증 후 GenerationReport를 남긴다.

AI는 `propose-new` 또는 기존 패턴의 의미를 바꾸는 `extend`를 스스로 승인하지 않는다. 승인 전 코드는 생성 시안 검토함에 격리하며 후속 화면의 표준 근거로 사용하지 않는다.

### 5.1 기계 판독 계약과 결정 추적

공통 정책을 자유문장 안내로만 두지 않는다. 현재 핵심 범위는 다음 레지스트리에서 기계 계약으로 강제한다.

- `component-usage-contracts.json`: 컴포넌트의 사용·금지 조건, 허용 부모, 상태, 제약, 대안과 근거
- `pattern-contracts.json`: Shell·Section·Behavior의 슬롯, 상태 모델, 동작 대상, 스크롤 소유자와 action set
- `screen-specs.json`: 대표 화면의 순서형 SectionInstance, 슬롯, 컴포넌트, 동작 대상과 제약
- `generation-templates.json`: 결정형 코드 생성이 허용된 조합과 안정 상태

Resolver는 선택된 셸·섹션·동작·액션·컴포넌트뿐 아니라 제외된 대안의 이유까지 `decisionTrace`로 출력한다. 구현 감사는 구조화된 섹션 ID와 순서, 패턴별 구현 marker, action set, 허용 부모를 검사한다. 따라서 “등록 컴포넌트를 썼다”가 아니라 “해당 맥락에서 이 컴포넌트를 써야 하는 이유와 조합 결과가 계약과 일치한다”를 판정한다.

## 6. 예시: 이지모드 입고등록

```json
{
  "screenId": "easy-mode-receiving",
  "shell": "shell.side-slide-panel",
  "sections": [
    {
      "frame": "frame.standard-section",
      "pattern": "section.form-grid",
      "title": "기본정보"
    },
    {
      "frame": "frame.standard-section",
      "pattern": "section.editable-row-list",
      "title": "품목/수량 직접 입력",
      "behaviors": ["row.mutation-policy"]
    }
  ],
  "actions": "action-set.cancel-save"
}
```

이 구조에서 큰 회색 라운드 wrapper는 등록된 Section Frame 또는 Section Pattern에 없으므로 자동으로 허용되지 않는다. 필요하다면 임의 추가가 아니라 신규 조합 제안과 승인을 거쳐야 한다.

## 7. 기존 구조 이관 결과

1차 이관 대상은 모두 종결했다.

| 항목 | 현재 결정 |
|---|---|
| `screens.json.patternRefs` | 모든 화면이 Shell·Section·Behavior·ActionSet을 복수 참조한다. |
| `patterns.json` | 기존 화면 단위 항목은 Recipe 호환 계층으로 유지하고 세분 패턴을 함께 등록한다. |
| `source-assets.json.patterns` | 원본 증거와 런타임 표준의 역할을 분리하되 조회 시 합성한다. |
| `context-rules.json` | 헤더와 오버레이의 의미 역할·사용 조건·제외 조건·부모 관계를 기계 판독 가능한 규칙으로 제공한다. |
| `getImplementationContext` | 화면의 모든 Pattern, 중복 제거된 Component와 관련 Context Rule·Decision을 반환한다. |
| `check-design-system-registry` | 빈 배열, 중복, 미등록 참조와 미해결 제안을 차단한다. |
| MES Archetype 문서 | Archetype은 화면 단위 Recipe의 호환 명칭으로 사용한다. |
| `src/components/patterns` | 물리 이동은 import 변경만 늘리므로 하지 않고 Registry가 논리 분류를 담당한다. |

향후 새 충돌이 발견되면 `composition-policy.json`에 새 migration hold를 추가하되, 이미 종결된 위 항목을 다시 보류 상태로 해석하지 않는다.

## 8. 정책 우선순위

새로운 AI 화면 생성과 패턴 판정에서는 이 문서를 공통 기준으로 사용한다. 기존 문서와 충돌하면 기존 구현을 즉시 삭제하거나 덮어쓰지 않고 다음 순서를 따른다.

1. 아직 등록되지 않은 충돌 항목을 migration-hold에 등록한다.
2. 관련 원본 화면과 코드 사용처를 감사한다.
3. 마이그레이션 영향과 호환 경로를 작성한다.
4. 사용자 승인 후 schema·코드·문서를 같은 변경에서 갱신한다.

세부 화면의 원본 충실도 규칙과 토큰 판단 규칙은 기존 문서를 그대로 유지한다. 이 정책은 그 위에서 AI의 조합 단위와 승인 절차를 통일한다.

## 9. 적용 현황

1차 얕은 전수조사, 2차 수동 감사, 사용자 승인과 코드 이관을 완료했다.

- 구조화 결과: `component-library/src/design-system/registry/composition-inventory.json`
- 핵심 컴포넌트 사용 계약: `component-library/src/design-system/registry/component-usage-contracts.json`
- 핵심 패턴 계약: `component-library/src/design-system/registry/pattern-contracts.json`
- 대표 순서형 화면 명세: `component-library/src/design-system/registry/screen-specs.json`
- 맥락 선택 규칙: `component-library/src/design-system/registry/context-rules.json`
- 사람용 맥락 설명: [AI UI 맥락 규칙](./AI_UI_맥락_규칙.md)
- 사람용 감사·승인·이관 이력: [AI UI 조합 문법 감사 및 이관 기록](./AI_UI_조합_문법_감사_및_이관_기록.md)

자동 탐지 인벤토리 자체의 상태는 계속 `observed-not-canonical`이다. 다만 승인 결과가 `patterns.json`에 등록된 Section·Behavior·ActionSet은 공용 표준으로 사용할 수 있다. 새 자동 탐지 후보는 별도 승인 전까지 표준으로 사용하지 않는다.
