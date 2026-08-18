# AI UI 맥락 규칙

> 정책 ID: `mes.ai-context-rules`
> 버전: `1.1.0`
> 상태: 공통 정책 확정
> 구조화 원본: `component-library/src/design-system/registry/context-rules.json`

## 1. 왜 별도 맥락 규칙이 필요한가

같은 토큰과 컴포넌트를 사용해도 배치된 부모, 설명하는 대상, 업무의 길이와 상태가 다르면 올바른 디자인 시스템 사용이 아니다. `SectionHeader`가 안정화된 컴포넌트라는 사실은 모달 섹션에서 사용할 수 있다는 뜻이지, 페이지의 모든 제목을 회색 밴드로 만들라는 뜻이 아니다.

AI는 구현 요소를 선택하기 전에 다음을 먼저 판정한다.

1. 이 요소가 무엇을 설명하거나 제어하는가?
2. 어느 부모 안에 놓이는가?
3. 필수인가, 필요할 때만 쓰는 선택 요소인가?
4. 주변 요소와 어떤 포함·상하 관계를 가지는가?
5. 같은 부모와 역할에서 사용된 검증 원본이 있는가?

따라서 선택 순서는 `시각 유사성 → 컴포넌트`가 아니라 `의미 역할 → 부모 맥락 → 업무 구조 → 검증 근거 → 구현 참조`다.

## 2. 제목 맥락

| 역할 | 설명 범위 | 사용 조건 | 기본 수량 | 구현 |
|---|---|---|---|---|
| Overlay root heading | 중앙 모달·우측 슬라이드·확인 팝업 전체 | 모든 오버레이 | 정확히 1개 | 각 Shell의 Header 슬롯 |
| Section heading | 본문의 독립적인 논리 묶음 하나 | 서로 다른 섹션이 둘 이상이거나 경계가 필요한 경우 | 0개 이상 | `SectionHeader` + `frame.standard-section` |
| Content region heading | 단일 테이블·리스트·작업영역 | 콘텐츠의 이름만 필요하고 별도 섹션 경계는 불필요한 경우 | 0개 또는 1개 | 해당 콘텐츠 패턴의 제목 슬롯 |
| Page section heading | 페이지 안의 설정·관리 영역 하나 | 반복 원본과 전용 계약이 확인된 경우 | 현재 보류 | 자동 선택 금지 |

### 2.1 Modal header

- 모달 전체의 목적과 대상을 설명한다.
- 제목과 닫기 버튼을 포함하는 Shell 책임이다.
- 모든 모달에 반드시 하나만 존재한다.
- 본문의 Section heading이 Modal header를 대체할 수 없다.

### 2.2 Section header

- 모달 전체가 아니라 해당 섹션 내부의 내용을 설명한다.
- 여러 섹션이 모여 하나의 모달 본문을 만들 때 경계를 표현한다.
- 선택 요소이므로 “섹션처럼 보이게 하고 싶다”는 이유만으로 추가하지 않는다.
- 본문이 단일 테이블이나 단일 작업뿐이면 생략하는 것이 기본이다.

### 2.3 Content region title

`생산실적 리스트`처럼 한 테이블·리스트의 이름만 필요한 경우다. 이때 제목은 Section heading보다 시각 위계가 낮아서가 아니라 설명 대상이 하나의 콘텐츠 영역이기 때문에 선택된다. 따라서 모달용 회색 `SectionHeader` 밴드를 자동으로 상속하지 않는다.

### 2.4 Page section heading 보류

페이지형 설정·관리 화면의 반복 원본과 정식 계약은 아직 충분하지 않다. 그 근거가 확보되기 전에는 다음 임시 규칙을 적용한다.

- 모달용 `SectionHeader`를 페이지에 자동 재사용하지 않는다.
- 필요한 경우 일반 제목·얇은 구분선·간격만 가진 최소 로컬 후보를 만든다.
- 후보는 생성 시안으로 격리하고 사용자 승인 전에는 표준 근거로 사용하지 않는다.

업무운영설정 시안의 긴 회색 섹션 헤더가 바로 이 사례다. 사용 토큰과 컴포넌트가 그럴듯했어도 페이지 맥락의 근거가 없었으므로 표준 사용으로 인정하지 않는다.

## 3. 오버레이 맥락

| Shell | 선택하는 업무 맥락 | 선택하지 않는 업무 맥락 |
|---|---|---|
| CenterModal | 선택·조회·비교·일괄편집 같은 한정된 보조 작업, 가로 폭이 중요한 테이블 | 한 건을 여러 섹션에 걸쳐 길게 등록·수정하는 흐름 |
| SideSlidePanel | 배경 목록의 맥락을 유지하며 한 건을 등록·수정·검사하는 세로 흐름 | 독립적인 넓은 비교·조회, 짧은 확인 |
| ConfirmDialog | 짧은 메시지와 확인·취소로 끝나는 결정 | 테이블, 다중 입력, 긴 스크롤 |

중앙에 배치된다는 외형만으로 `CenterModal`과 `ConfirmDialog`를 같은 유형으로 보지 않는다. 마찬가지로 폭이 맞는다는 이유만으로 긴 등록 흐름을 중앙 모달로 바꾸지 않는다.

## 4. 액션 맥락

| 역할 | 구현 | 선택 기준 |
|---|---|---|
| 명령 실행 | `Button` | 저장·확인·삭제·조회처럼 현재 작업이나 데이터를 바꿈 |
| 이동·상세 탐색 | `Link` | 다른 화면·팝업·관련 대상으로 이동함 |
| 상태 표시 | `Badge` | 클릭 없이 완료·승인중 같은 상태를 읽기 전용으로 표시함 |
| 아이콘 보조 명령 | `IconButton` | 닫기·삭제·펼치기처럼 의미가 관습적이고 공간이 좁음 |
| 오버레이 종료 액션 | `ActionSet` | 취소·저장·확인·선택의 commit/dismiss 의미 조합 |

버튼, 링크와 배지는 색이나 테두리 모양이 아니라 클릭 결과로 구분한다. 클릭해서 상세로 이동하는 값은 `Badge`가 아니고, 저장·삭제하는 동작은 `Link`가 아니다. 한 영역에는 가장 중요한 primary 명령을 하나만 둔다.

## 5. 입력 방식 맥락

| 질문 | 선택 |
|---|---|
| 미리 정해지지 않은 문자열·수량·설명인가? | `Input` / `NumberInput` / `Textarea` |
| 짧은 알려진 목록에서 하나를 고르는가? | `Select` |
| 많은 거래처·품목·설비에서 검색 후 하나를 고르는가? | `Combobox` |
| 소수의 배타적 옵션을 동시에 비교하는가? | `Radio` |
| 복수 선택·동의·행 선택인가? | `Checkbox` |
| 지속되는 기능 설정의 켜짐·꺼짐인가? | `Switch` |
| 현재 목록을 검색어로 좁히는가? | `SearchInput` |
| 카테고리별 조회 조건을 조합하는가? | `Filter` |
| 날짜·시간·기간 값인가? | 전용 Date/Time 컴포넌트 |

`SearchInput`과 `Combobox`는 둘 다 검색 UI를 포함할 수 있지만 결과가 다르다. 전자는 현재 데이터셋을 좁히는 조회 상태이고, 후자는 검색한 후보 중 선택된 도메인 값이 필드에 저장된다. `Filter`도 검색창으로 대체하지 않는다.

## 6. 콘텐츠 경계 맥락

- 복수의 독립적인 논리 묶음에는 `SectionFrame`을 사용한다.
- 본문이 단일 목록·폼·반복 입력 작업이면 Shell 안에 승인된 Section Pattern을 직접 배치한다.
- 단일 영역을 보기 좋게 만들기 위한 임의 회색 박스·radius·background는 추가하지 않는다.
- 테이블 컬럼과 정렬되는 합계는 `summary.table-total-row`를 사용한다.
- 표와 독립적인 업무 결과만 `summary.result-total-card`로 강조한다.

`SectionFrame`과 결과 요약 카드는 범용 컨테이너가 아니다. “무언가를 담을 박스가 필요하다”는 이유만으로 선택할 수 없고, 각각 논리 섹션과 독립 결과라는 의미가 있어야 한다.

## 7. 테이블 맥락

Table은 같은 컬럼 구조를 공유하는 반복 레코드를 행 단위로 조회·비교할 때만 사용한다.

| 모델 | 조건 | 연결 패턴 |
|---|---|---|
| 읽기 목록 | 반복 레코드를 컬럼 기준으로 조회 | `table.readonly-record-list` |
| 다중 선택 | 여러 행을 선택해 일괄 액션 | `selection.enable-actions` |
| 선택 행 편집 | 선택된 행에서만 입력 컨트롤 노출 | `selection.reveal-inline-editor` |
| Master–detail | 활성 행 하나가 다른 영역을 제어 | `selection.master-detail` |
| 그룹 계층 | 실제 그룹 상태와 접기·합계가 존재 | `table.grouped-list` |
| 반복 입력 | 소수의 행을 직접 추가·삭제 | Table 금지, `section.editable-row-list` |

마지막 구분이 이지모드 입고등록에서 발생했던 오류를 막는다. 품목·수량을 입력한다는 이유만으로 Table을 사용하지 않는다. 컬럼 비교보다 행 추가와 입력 흐름이 중요하면 반복 입력 패턴이다.

## 8. 스크롤 맥락

- 연속적인 긴 폼은 Shell Body가 세로 스크롤을 소유한다.
- 조회 툴바·Footer를 고정하고 목록만 움직여야 하면 콘텐츠가 스크롤을 소유한다.
- 짧은 확인 팝업은 스크롤을 두지 않는다.
- 같은 축에서 Shell과 내부 콘텐츠가 동시에 스크롤하면 안 된다.
- 가로 스크롤은 기본적으로 금지한다. 필수 컬럼을 줄일 수 없고 원본에서도 넓은 데이터 탐색이 확인된 경우에만 Table 내부 예외로 허용한다.

가로 스크롤을 허용하기 전에 `clientWidth`, `scrollWidth`, padding, 고정 폭과 중첩 wrapper를 확인한다. 레이아웃 오류를 스크롤로 숨겨서는 안 된다.

## 9. AI 선택 게이트

새 화면 생성 시 다음 판정을 JSX 작성 전에 실행한다.

### `select.overlay-shell`

1. 짧은 결정, 한정된 보조 작업, 한 건의 긴 등록·편집 중 무엇인가?
2. 배경 목록의 선택 맥락을 유지해야 하는가?
3. 가로 비교 폭과 세로 연속성 중 무엇이 더 중요한가?
4. 독립적인 논리 섹션이 여러 개인가?
5. 같은 업무의 확정 원본 또는 검증 Recipe는 어떤 Shell을 사용했는가?

### `select.heading-context`

1. 전체 오버레이, 논리 섹션, 단일 콘텐츠 중 무엇의 제목인가?
2. 부모가 페이지, 중앙 모달, 우측 슬라이드 중 무엇인가?
3. 필수 제목인가, 구분이 필요할 때만 쓰는가?
4. 상위 제목이 같은 범위를 이미 설명하는가?
5. 선택할 구현의 원본 사용 위치가 현재 부모와 일치하는가?

추가 판정:

- `select.action-role`: 명령·이동·상태·아이콘·Footer ActionSet 구분
- `select.input-control`: 값의 범위, 선택 수, 검색 목적과 commit 시점 구분
- `select.content-boundary`: SectionFrame·무경계 영역·표 합계·결과 요약 구분
- `select.table-model`: 읽기·다중 선택·인라인 편집·master-detail·그룹·반복 입력 구분
- `select.scroll-owner`: Shell·내부 콘텐츠·없음 중 세로 소유자와 가로 예외 판정

일치하는 활성 규칙이 없으면 임의의 안정화 컴포넌트를 가져오지 않는다. 장식이 가장 적은 로컬 후보를 만들고 `propose-new`와 생성 시안 격리를 적용한다.

## 10. 신규 컴포넌트 판정

이번 맥락 감사 결과는 다음과 같다.

| 후보 | 판정 | 이유 |
|---|---|---|
| 테이블 링크 셀 | 신규 불필요 | Table render 슬롯 안에서 `Link` 합성 |
| 반복 입력 행 | 신규 불필요 | `section.editable-row-list` + `row.mutation-policy` 사용 |
| 별도 스크롤 컨테이너 | 신규 불필요 | Shell `scrollMode`와 콘텐츠 소유권으로 설명 가능 |
| Content region title | 신규 불필요 | 해당 Section Pattern의 제목 슬롯으로 표현 가능 |
| Page section header | 보류 | 페이지 반복 원본과 전용 계약이 부족함 |

즉, 이번 배치에서 새 UI 컴포넌트는 만들지 않는다. 기존 역할로 설명되지 않는 반복 사례가 확인될 때만 신규 후보를 등록한다.

## 11. 코드 사용

```ts
import {
  getContextDecision,
  getGenerationContext,
  getImplementationContext,
} from "@/design-system/registry";

const generationContext = getGenerationContext();
const shellDecision = getContextDecision("select.overlay-shell");
const headingDecision = getContextDecision("select.heading-context");
const actionDecision = getContextDecision("select.action-role");
const inputDecision = getContextDecision("select.input-control");
const tableDecision = getContextDecision("select.table-model");
const implementation = getImplementationContext("material-input-settings");
```

화면 ID가 아직 없는 신규 생성은 `getGenerationContext`로 전체 선택 계약과 보류 항목을 읽는다. 가까운 기존 화면을 찾은 뒤에는 `getImplementationContext`로 화면·패턴·컴포넌트와 해당 구현에 연결된 맥락 규칙을 함께 조회한다. AI는 이 값을 읽은 후에만 JSX 조합을 시작한다.
