# AI UI 조합 문법 공통 정책

> 정책 ID: `mes.ai-composition-grammar`
> 버전: `1.0.0`
> 상태: 공통 정책 확정
> 확정일: 2026-08-11

## 1. 목적

이 정책은 AI가 MES 화면을 생성할 때 디자인 시스템을 단순한 에셋·컴포넌트 목록으로 해석하지 않도록 하기 위한 공통 기준이다.

MES 디자인 시스템은 다음을 모두 포함한다.

- 토큰과 아이콘 등 기초 자산
- 개별 UI 컴포넌트와 상태·variant
- 컴포넌트를 배치하는 Shell과 Section 구조
- 반복 가능한 Section·Behavior 패턴
- 패턴을 조합하는 문법과 사용 조건
- 검증된 화면 Recipe와 실제 ScreenSpec
- 신규 조합을 판정·승인·격리하는 운영 절차

등록된 컴포넌트를 사용했다는 사실만으로 디자인 시스템 준수로 판정하지 않는다. 구성 요소의 역할, 중첩, 순서, 상태 전이와 상호작용도 이 정책으로 설명할 수 있어야 한다.

## 2. 공통 계층

| 계층 | 역할 | 예시 |
|---|---|---|
| Token / Asset | 시각적 원자값과 아이콘 | 색상, 간격, 타이포, MES 아이콘 |
| Component | 독립적인 UI 부품 | Button, Input, Select, Table |
| Shell | 화면·팝업의 외곽과 고정 슬롯 | 중앙 모달, 우측 슬라이드, Header/Body/Footer |
| Section Frame | 섹션의 공통 외형 | 제목 밴드, 패딩, 구분선, 접기/펼치기 |
| Section Pattern | 컴포넌트의 재사용 가능한 본문 조합 | 폼 그리드, 반복 입력 행, 검색 테이블, 검사항목 |
| Behavior Pattern | 상태와 상호작용 계약 | 행 추가·삭제, 직전 거래처 계승, 취소 복원 |
| Recipe / Archetype | 검증된 Shell·Section·Behavior 조합 예제 | 입고등록 계열, 마스터–상세 계열 |
| ScreenSpec | 실제 화면의 문구·필드·데이터·권한 | 이지모드 입고등록, 투입품목 설정/조회 |

`Recipe / Archetype`은 패턴의 상위 조합 결과다. 화면을 구성하는 가장 작은 패턴 단위로 사용하지 않는다.

## 3. 조합 문법

```text
ScreenSpec
  = Shell
  + SectionInstance[1..n]
  + BehaviorReference[0..n]
  + ActionSet

SectionInstance
  = SectionFrame
  + SectionPattern
  + ScreenData/Copy/FieldConfig
```

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

초기 분류 후보는 다음과 같다.

- `section.form-grid`: 라벨과 입력 컨트롤의 열 기반 배열
- `section.editable-row-list`: 행 단위 반복 입력과 추가·삭제
- `section.search-table`: 조회 조건·검색·테이블
- `section.inspection-items`: 검사항목과 판정 입력
- `section.before-after`: 변경 전후 비교
- `section.summary`: 합계·결과·상태 요약
- `section.collapsible-form`: 선택 입력 영역

이 목록은 구현 확정 목록이 아니다. 실제 원본과 기존 코드 감사 후 등록 여부를 결정한다.

### 3.4 Behavior Pattern

Behavior는 시각 패턴에 암묵적으로 숨기지 않고 대상과 상태 계약을 명시한다.

- `row.add-remove`
- `row.inherit.customer`
- `selection.enable-editor`
- `selection.master-detail`
- `dismiss.restore-committed`
- `table.group-selection`

Behavior는 어떤 Section 또는 Action에 적용되는지 target을 가져야 한다. 예를 들어 `row.inherit.customer`는 새 행에 직전 행의 거래처만 복사하며 창고·품목·수량·LOT은 독립 초기값을 사용한다.

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

AI는 JSX를 작성하기 전에 다음 순서를 지킨다.

1. 요구사항을 ScreenSpec 후보로 정규화한다.
2. Shell, Section, Behavior별 기존 후보를 조회한다.
3. 각 차이를 `reuse`, `compose`, `extend`, `propose-new`, `normalize`로 판정한다.
4. 선택 근거, 기존 후보, 차이와 승인 상태를 PatternDecision으로 기록한다.
5. 승인된 Shell과 Section Pattern의 슬롯 안에 컴포넌트를 배치한다.
6. 임의 wrapper, 배경, radius, 안내 문구와 정보 위계를 추가하지 않는다.
7. 정적·상호작용·시각 검증 후 GenerationReport를 남긴다.

AI는 `propose-new` 또는 기존 패턴의 의미를 바꾸는 `extend`를 스스로 승인하지 않는다. 승인 전 코드는 생성 시안 검토함에 격리하며 후속 화면의 표준 근거로 사용하지 않는다.

## 6. 예시: 이지모드 입고등록

```json
{
  "screenId": "easy-mode-receiving",
  "shell": "overlay.side-slide.standard-900",
  "sections": [
    {
      "frame": "section.standard",
      "pattern": "section.form-grid",
      "title": "기본정보"
    },
    {
      "frame": "section.standard",
      "pattern": "section.editable-row-list",
      "title": "품목/수량 직접 입력",
      "behaviors": ["row.add-remove", "row.inherit.customer"]
    }
  ],
  "actions": "actions.cancel-save"
}
```

이 구조에서 큰 회색 라운드 wrapper는 등록된 Section Frame 또는 Section Pattern에 없으므로 자동으로 허용되지 않는다. 필요하다면 임의 추가가 아니라 신규 조합 제안과 승인을 거쳐야 한다.

## 7. 기존 구조와의 충돌 및 보류

아래 항목은 이 정책과 충돌하거나 세분화가 필요하지만 현재 구현을 즉시 변경하지 않는다.

| 항목 | 현재 상태 | 보류 이유 | 후속 결정 |
|---|---|---|---|
| `screens.json.patternId` | 화면당 대표 패턴 1개 | 기존 조회 함수와 검사기가 단일 참조를 전제 | `patternRefs` 마이그레이션 설계 후 변경 |
| `patterns.json` | popup/screen/table 크기의 패턴이 혼재 | 기존 화면과 시각 회귀가 직접 참조 | Shell·Section·Behavior·Recipe 감사 후 재분류 |
| `source-assets.json.patterns` | 구체 화면 크기 패턴 포함 | 원본 증거와 표준 패턴 경계 재검토 필요 | 증거/Recipe/Pattern 분리 후 이동 |
| `getImplementationContext` | screen → 단일 pattern 조회 | 현재 API 호환성 유지 필요 | 복수 패턴 컨텍스트 API 설계 후 교체 |
| `check-design-system-registry` | 단일 pattern 참조만 검사 | 새 schema 미확정 | 병행 검증 기간을 둔 뒤 강화 |
| MES Archetype 문서 | 화면 단위 구조·행동 계약 | Recipe와 Section Pattern의 경계가 혼재 | Archetype을 상위 Recipe로 재정의할지 검토 |
| `src/components/patterns` | 완성 화면·팝업·섹션 조합이 혼재 | 대규모 파일 이동은 회귀 위험 | 분류 감사 후 단계적으로 이동 |

보류 항목은 기존 표준으로 확정된 것이 아니라 `migration-hold` 상태다. 신규 AI 생성은 이 공통 정책을 우선 적용하되, 현행 schema에 없는 참조는 임의로 표준 등록하지 않고 PatternDecision과 생성 시안 기록에 남긴다.

## 8. 정책 우선순위

새로운 AI 화면 생성과 패턴 판정에서는 이 문서를 공통 기준으로 사용한다. 기존 문서와 충돌하면 기존 구현을 즉시 삭제하거나 덮어쓰지 않고 다음 순서를 따른다.

1. 충돌 항목을 migration-hold에 등록한다.
2. 관련 원본 화면과 코드 사용처를 감사한다.
3. 마이그레이션 영향과 호환 경로를 작성한다.
4. 사용자 승인 후 schema·코드·문서를 같은 변경에서 갱신한다.

세부 화면의 원본 충실도 규칙과 토큰 판단 규칙은 기존 문서를 그대로 유지한다. 이 정책은 그 위에서 AI의 조합 단위와 승인 절차를 통일한다.

## 9. 적용 현황

1차 얕은 전수조사는 완료했다.

- 구조화 결과: `component-library/src/design-system/registry/composition-inventory.json`
- 사람용 보고서: [AI UI 조합 인벤토리 1차](./AI_UI_조합_인벤토리_1차.md)
- Shell 감사: [AI UI Shell·슬롯 감사 1차](./AI_UI_Shell_슬롯_감사_1차.md)
- Section Frame 감사: [AI UI Section Frame 감사 1차](./AI_UI_Section_Frame_감사_1차.md)
- Section Pattern 후보 감사: [AI UI Section Pattern 후보 감사 1차](./AI_UI_Section_Pattern_후보_감사_1차.md)
- Behavior 후보 감사: [AI UI Behavior 후보 감사 1차](./AI_UI_Behavior_후보_감사_1차.md)
- 승인 전 표준 후보: [AI UI 표준 후보 제안 1차](./AI_UI_표준_후보_제안_1차.md)
- 후속 작업과 보류: [AI UI 조합 문법 적용 TODO](./AI_UI_조합_문법_적용_TODO.md)

자동 탐지 결과의 상태는 `observed-not-canonical`이다. Section·Behavior 후보는 2차 수동 감사와 사용자 승인 전까지 공통 패턴으로 사용하지 않는다.
