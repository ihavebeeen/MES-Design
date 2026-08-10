# 컴포넌트 Optional Prop 레지스트리

이 문서는 완성 화면을 구현하면서 기존 컴포넌트에 추가한 optional prop을 한곳에서 추적한다.
TypeScript interface가 실제 계약의 원본이며, 이 문서는 AI와 사람이 변경 이유·근거·사용 화면을
빠르게 확인하기 위한 인덱스다. 새 optional prop을 추가하거나 의미를 바꾸면 코드와 이 문서를
같은 커밋에서 함께 수정한다.

## Public UI component

| Component | Prop | Type / Default | 목적 | 근거·사용 화면 |
|---|---|---|---|---|
| `Checkbox` | `uncheckedAppearance` | `"outline" \| "grayCheck"`, 기본 `outline` | `grayCheck`는 회색 체크 표시를 유지하면서 상태는 미선택으로 처리한다. 검정 체크+선택 행 배경과 의미를 분리하기 위한 MES 표 전용 외형이다. | 일괄작업지시, Figma `20274:73333` |
| `DatePicker` | `separator` | `"." \| "-"`, 기본 `.` | 화면 원본에 따라 날짜 구분자를 보존한다. | Figma `11210:50866` 외 완성 화면 |
| `DatePicker` | `iconPosition` | `start \| end`, 기본 `end` | 기간 조회 영역처럼 달력 아이콘이 날짜 앞에 오는 변형을 지원한다. | Figma `11210:50866` |
| `DatePicker` | `iconColor` | `muted \| default`, 기본 `muted` | 완성 화면에서 달력 아이콘이 기본 텍스트 색인 경우를 지원한다. | Figma `11210:50866` |
| `SearchInput` | `iconColor` | `muted \| default`, 기본 `muted` | 검색 아이콘의 화면별 명도 차이를 기존 컴포넌트 안에서 표현한다. | Figma `11210:50866` |
| `Filter` | `searchable` | `boolean`, 기본 `true` | 필터 패널 내부의 카테고리·옵션 검색창 표시 여부를 제어한다. | 담당자 확정, 일괄작업지시 화면은 `false` |
| `CenterModal` | `headerDivider` | `boolean`, 기본 `true` | 제목 아래 구분선이 없는 소형 정보 팝업을 같은 모달 컴포넌트로 표현한다. | 품목 상세정보, Figma `11210:52744` |
| `CenterModal` | `size` 확장 | `wide-1024` 추가 | 화면별 임의 폭 덮어쓰기 없이 1024px BOM 복사·선발행 라벨 팝업의 폭 계약을 명시한다. 투입품목 설정/조회는 기존 `wide-1400`, 운전일지는 `SideSlidePanel.standard-900`을 사용한다. | Figma `18962:67817`, `18756:60803` |
| `Table` | `activeId` | `string \| null`, 기본 `undefined` | 체크 상태와 별도로 활성 행을 지정한다. 생략하면 실제 선택 행이 활성 행 배경을 가진다. | 완성 화면 상태 분리용 |
| `Table` | `selectionColor` | `main \| gray \| black`, 기본 `black` | 선택된 체크박스 색을 지정한다. | MES Checkbox 색 variant |
| `Table` | `unselectedCheckboxAppearance` | `outline \| grayCheck`, 기본 `outline` | 미선택 행을 회색 체크로 표시하는 MES 표 상태를 지원한다. | 일괄작업지시, Figma `20274:73333` |
| `Table` | `selectionHeaderIndeterminate` | `boolean`, 기본 `true` | 일부 행 선택 시 헤더에 부분선택 표시를 쓸지 결정한다. 회색=미선택 규칙을 쓰는 일괄작업지시는 `false`다. | 일괄작업지시, Figma `20274:73333` |
| `Table` | `edgePadding` | `number`, 기본 `20` | 표 전체 좌우 내부 여백을 화면 실측에 맞춘다. | Figma `11210:50866`은 `0` |
| `Table` | `selectionColumnWidth` | `number`, 기본 `40` | 선택 열의 전체 폭을 헤더·데이터·그룹·총계 행에 동일 적용한다. | Figma `11210:50866`은 `56` |
| `Table` | `centerSelection` | `boolean`, 기본 `false` | 데이터 행 체크박스를 선택 열 중앙에 배치한다. | Figma `11210:50866` |
| `Table` | `columnDividers` | `boolean`, 기본 `true` | 셀 사이 세로 점선을 화면별로 끈다. | Figma `11210:50866`은 `false` |
| `Table` | `horizontalScroll` | `boolean`, 기본 `true` | 고정 폭이 정확히 맞는 표에서 불필요한 가로 스크롤을 금지한다. | Figma `11210:50866`은 `false` |
| `Table` | `disabledTextTone` | `gray60 \| gray80`, 기본 `gray80` | 비활성 행 텍스트 명도를 화면 실측에 맞춘다. | Figma `11210:50866`은 `gray60` |
| `Table` | `unselectedTextTone` | `default \| gray80`, 기본 `default` | 비활성이 아닌 미선택 행의 텍스트 명도를 낮추고 선택 행과 편집 가능 상태를 구분한다. | 발주 일괄등록, Figma `11210:52026` |
| `TableRowData` | `hideSelection` | `boolean`, 기본 `false` | 선택 열 폭은 유지하면서 특정 행의 체크박스만 숨긴다. | 완료된 비활성 행, Figma `11210:50866` |

## Pattern fixture / adapter

아래 항목은 public 디자인 시스템 API가 아니라 완성 화면 예제 데이터를 실제 컴포넌트에 연결하는
adapter다. 신규 제품 코드에서는 가능하면 public component를 직접 사용한다.

| Adapter | Prop | 역할 |
|---|---|---|
| `FixtureInput` | `onValueChange` | 고정 예시값이 아니라 실제 입력 state를 갱신한다. 일괄작업지시의 `지시수량`에 사용한다. |
| `FixtureSearch` | `value`, `onValueChange` | 검색어를 상위 state와 연결해 생산실적 행 필터 등 실제 검색 동작에 사용한다. 생략하면 adapter 내부 state로 입력 외형을 유지한다. |
| `FixtureSelect` | `options` | 선택된 행이 편집 상태가 될 때 실제 선택 가능한 옵션 목록을 전달한다. |
| `FixtureSelect` | `onValueChange` | 드롭다운에서 바꾼 값을 행별 편집 state에 반영한다. |
| `FixtureFilter` | `definitions` | 빈 필터가 아니라 실제 카테고리와 옵션을 `Filter`에 전달한다. |
| `FixtureFilter` | `searchable` | public `Filter.searchable`을 화면 조립부에 전달한다. |
| `FixtureTable` | `onCheckedRowsChange` | `Table`의 id 배열을 예제 행 index 배열로 변환해 실제 선택 state에 연결한다. |
| `FixtureTable` | `hiddenSelectionRows` | 특정 예제 행에 `TableRowData.hideSelection`을 적용한다. |
| `FixtureTable` | Table layout props | `edgePadding`, `selectionColumnWidth`, `centerSelection`, `columnDividers`, `horizontalScroll`, `disabledTextTone`, `unselectedTextTone`, `unselectedCheckboxAppearance`, `selectionHeaderIndeterminate`를 public `Table`에 그대로 전달한다. |
| `RadioOption` | `onChange` | 라디오 외형을 읽기 전용 예시가 아니라 수기/자동, 자동배열/사용자설정, 검사결과 state 전환에 연결한다. |

## 추가 규칙

1. 새 prop은 기존 기본 렌더링을 바꾸지 않는 optional 값이어야 한다.
2. 화면 하나만을 위한 값이라도 두 번 이상 반복될 가능성이 있으면 의미 기반 이름을 사용한다.
3. `className`만으로 상태 의미를 숨기지 않는다. 선택·비활성·검색 가능 여부처럼 동작에 영향을
   주는 차이는 명시적 prop으로 만든다.
4. prop을 추가한 화면에서는 기본/변형 상태와 실제 클릭 동작을 브라우저에서 각각 검증한다.
