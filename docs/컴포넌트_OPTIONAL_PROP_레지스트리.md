# 컴포넌트 Optional Prop 레지스트리

이 문서는 완성 화면을 구현하면서 기존 컴포넌트에 추가한 optional prop을 한곳에서 추적한다.
TypeScript interface가 실제 계약의 원본이며, 이 문서는 AI와 사람이 변경 이유·근거·사용 화면을
빠르게 확인하기 위한 인덱스다. 새 optional prop을 추가하거나 의미를 바꾸면 코드와 이 문서를
같은 커밋에서 함께 수정한다.

## Public UI component

| Component | Prop | Type / Default | 목적 | 근거·사용 화면 |
|---|---|---|---|---|
| `SectionHeader` | `action` | `ReactNode`, 기본 없음 | 제목 밴드와 직접 배치한 버튼·링크 버튼은 28px, 외곽은 내용 높이. 입력 등 별도 액션의 고유 크기와 일반 `Button.small` 32px은 유지한다. | 사용자 수정 Figma `DAHeMHiVwqZCzONVAWbMXb`, `265:10` |
| `DialogAction` | `variant` | `ButtonProps["variant"]`, 위치별 `fillBlack / fillMain / fillGray` | 생략한 액션만 위치별 기본값 적용. 명시적 값·폭·콜백은 유지하며 4번째 이후 생략값은 기존 `fillBlack` 유지. | 사용자 수정 Figma `347:591` |
| `CenterModal`, `SideSlidePanel` | `actions` 기본값 | 취소 `fillGray`, 확인 `fillMain` | 사용자 수정본의 확인 버튼 색상 적용. 명시적 `actions`·`footer` 우선순위와 160×40px 규격 유지. `RadioChoiceDialog`의 다음 버튼도 `fillMain` 적용. | 사용자 수정 Figma `370:329`, `373:155`, `383:323` |
| `Checkbox` | `uncheckedAppearance` | `"outline" \| "grayCheck"`, 기본 `outline` | `grayCheck`는 회색 체크 표시를 유지하면서 상태는 미선택으로 처리한다. 검정 체크+선택 행 배경과 의미를 분리하기 위한 MES 표 전용 외형이다. | 일괄작업지시, Figma `20274:73333` |
| `DatePicker` | `separator` | `"." \| "-"`, 기본 `.` | 화면 원본에 따라 날짜 구분자를 보존한다. | Figma `11210:50866` 외 완성 화면 |
| `DatePicker` | `iconPosition` | `start \| end`, 기본 `end` | 기간 조회 영역처럼 달력 아이콘이 날짜 앞에 오는 변형을 지원한다. | Figma `11210:50866` |
| `DatePicker` | `iconColor` | `muted \| default`, 기본 `muted` | 완성 화면에서 달력 아이콘이 기본 텍스트 색인 경우를 지원한다. | Figma `11210:50866` |
| `DatePicker` | `size` | `default \| small`, 기본 `default` | 테이블 편집 셀의 22px 날짜 입력을 공용 DatePicker로 유지한다. | Figma `18813:62490` |
| `Progress` | `labelTone` | `default \| danger`, 기본 `default` | 진행률 수치가 지연/오류 상태일 때 막대는 유지하고 라벨만 Danger-60으로 표시한다. | Figma `17503:85192` |
| `Button` | `variant="loginPrimary"`, `size="login"` | 로그인 전용 48px·16px Bold 규격 | 최초 로그인 비밀번호 재설정의 전체 너비 버튼을 일반 MES 40px 액션 버튼과 구분한다. 비활성 배경은 원본 Gray-60을 유지한다. | Figma `17681:46566` |
| `PasswordInput` | `size="login"` | 48px·16px, 기본 `default` | 로그인·비밀번호 재설정 문맥의 큰 입력 규격을 일반 MES 32px 입력과 구분한다. | Figma `17681:46541`, `17681:46551` |
| `PasswordInput` | `visibilityToggle` | `boolean`, 기본 `true` | 원본에 보기/숨기기 아이콘이 없는 경우 입력 외형을 임의로 추가하지 않는다. | Figma `17681:46541`, `17681:46551` |
| `Logo` | `brand` | `mes \| moncat-factory`, 기본 `mes` | 실제 MES 애플리케이션 원본 화면의 제품 워드마크를 표시한다. | Figma `17520:46628` |
| `SearchInput` | `iconColor` | `muted \| default`, 기본 `muted` | 검색 아이콘의 화면별 명도 차이를 기존 컴포넌트 안에서 표현한다. | Figma `11210:50866` |
| `SearchInput` | `size` | `default \| compact`, 기본 `default` | 상단 조회 툴바의 220×32, 14px, Gray-20 검색창을 페이지 CSS 덮어쓰기 없이 재사용한다. | 양식관리 목록, Figma `17309:158828` |
| `SearchInput` | `background` | `white \| subtle`, 기본은 size 규격에 따름 | 같은 14px compact 검색창이 흰 모달 표면과 Gray-20 조회 툴바 양쪽에 쓰이는 차이를 표현한다. | 입고검사, Figma `19768:100249` |
| `Sidebar` | `productSwitcher` | `ReactNode`, 기본 없음 | 원본 화면에 존재하는 MES/FEMS 전환 컴포넌트를 내비게이션 순서 안에 조립한다. | 양식관리 목록, Figma `17309:158828` |
| `Switch` | `size="compact"` | `26×18`, 기본 `40×20` | 단가 카드의 조밀한 헤더에서 실측된 동기화 스위치 규격을 재사용한다. | 표준단가 설정, Figma `18738:62309` |
| `Table` | `activeRowAppearance="strong-subtle"` | `Primary-30`, 기본 `Primary-20` | 체크 선택과 별개인 이력 조회 활성 행을 더 진한 배경으로 구분한다. | 표준단가 설정, Figma `18738:61758` |
| `Table` | `selectedRowAppearance="subtle"` | 선택 행 `Primary-20`, 기본 `none` | 별도 `activeId`가 있어도 체크된 복수 행의 선택 배경을 유지한다. | 표준단가 설정, Figma `18738:61758` |
| `PageTopTabItem` | `closable` | `boolean`, 기본 `true` | 모바일에서 현재 탭 하나만 간결하게 표시할 때 닫기 버튼을 숨긴다. | 생산실적 375, Figma `18849:65980` |
| `Filter` | `searchable` | `boolean`, 기본 `true` | 필터 패널 내부의 카테고리·옵션 검색창 표시 여부를 제어한다. | 담당자 확정, 일괄작업지시 화면은 `false` |
| `Filter` | `triggerLabel` | `string \| false`, 기본 `필터 추가` | 1280px 생산실적 조회 툴바처럼 아이콘만 쓰는 트리거를 같은 Filter 동작으로 제공한다. | Figma `18849:62315` |
| `Filter` | `showTriggerArrow` | `boolean`, 기본 `false` | 768/375 breakpoint의 드롭다운형 압축 트리거에 화살표를 표시한다. | Figma `18849:64894`, `18849:65980` |
| `Filter` | `showActiveTags` | `boolean`, 기본 `true` | breakpoint 압축 상태에서 선택값은 유지하되 툴바의 활성 태그는 숨긴다. | Figma `18849:64894`, `18849:65980` |
| `QuickQuery` | `triggerLabel` | `string \| false`, 기본 `빠른 조회` | 빠른 조회의 별 아이콘만 노출되는 압축형 툴바를 지원한다. | Figma `18849:62315` |
| `QuickQuery` | `compact` | `boolean`, 기본 `false` | 모바일에서 프리셋 목록 대신 별+화살표 트리거만 노출한다. | Figma `18849:65980` |
| `GroupQuery` | `compact`, `compactLabel` | `boolean`, `string \| false` | 768에서는 아이콘+그룹화+화살표, 375에서는 아이콘+화살표만 표시하고 동일한 Level 상태를 유지한다. | Figma `18849:64894`, `18849:65980` |
| `CenterModal` | `headerDivider` | `boolean`, 기본 `true` | 제목 아래 구분선이 없는 소형 정보 팝업을 같은 모달 컴포넌트로 표현한다. | 품목 상세정보, Figma `11210:52744` |
| `CenterModal` | `size` 확장 | `wide-1024`, `wide-1142` 추가 | 화면별 임의 폭 덮어쓰기 없이 선발행 라벨 1024px, BOM 복사 1142px의 실제 폭 계약을 명시한다. 투입품목 설정/조회는 기존 `wide-1400`, 운전일지는 `SideSlidePanel.standard-900`을 사용한다. | Figma `18962:67817`, `18756:60803` |
| `SideSlidePanel` | `size` 확장 | `medium-849` 추가 | 입고검사 원본의 849×960 우측 전체 높이 패널을 임의 `className` 폭 덮어쓰기 없이 표현한다. | Figma `19768:100249` |
| `CenterModal`, `SideSlidePanel` | `onCancel` dismiss 계약 | `() => void` | 취소·X·Esc·배경 클릭이 동일한 콜백을 실행한다. 저장 전 임시 상태의 폐기 또는 원본 스냅샷 복원은 이 콜백에서 수행하고 컨테이너가 이어서 닫힘 상태를 반영한다. | 공통 팝업 상호작용 규칙 |
| `ConfirmDialog` | `children`, `footer`, `onCancel`, `className` | `ReactNode`, `ReactNode`, `() => void`, `string` | 기존 12px radius·52px 헤더·그림자·dismiss 계약은 재사용하면서 변경 전후 비교표처럼 전용 본문과 푸터가 필요한 확인 팝업을 합성한다. `onCancel`은 X·Esc·배경 클릭의 공통 변경 폐기 지점이다. | 총생산수량 변경 확인, Figma `19363:63770` |
| `Table` | `activeId` | `string \| null`, 기본 `undefined` | 체크 상태와 별도로 활성 행을 지정한다. 생략하면 실제 선택 행이 활성 행 배경을 가진다. | 완성 화면 상태 분리용 |
| `Table` | `activeRowAppearance` | `subtle \| solid`, 기본 `subtle` | 일반 선택 행의 옅은 배경과, 흰 글자·Primary-60으로 표시하는 강한 활성 행을 구분한다. | 공정검사 경향관리, Figma `11751:102729` |
| `Table` | `onActiveIdChange` | `(id: string) => void`, 기본 `undefined` | 체크 상태를 바꾸지 않고 행 본문 클릭·Enter·Space로 활성 master 행을 변경한다. 입력·체크 컨트롤 클릭은 활성화를 전파하지 않는다. | `selection.master-detail` Behavior |
| `Table` | `onRowDoubleClick` | `(id: string) => void`, 기본 `undefined` | 메인 목록에서 행 단일 클릭 선택과 레코드 열기를 분리한다. 마우스 더블클릭 또는 키보드 Enter로 해당 행의 상세·슬라이드 팝업을 연다. 행 내부 버튼·입력·체크박스에서는 호출하지 않는다. | MES 메인 목록 → 상세 팝업 진입 규칙 |
| `Table` | `selectionColor` | `main \| gray \| black`, 기본 `black` | 선택된 체크박스 색을 지정한다. | MES Checkbox 색 variant |
| `Table` | `unselectedCheckboxAppearance` | `outline \| grayCheck`, 기본 `outline` | 미선택 행을 회색 체크로 표시하는 MES 표 상태를 지원한다. | 일괄작업지시, Figma `20274:73333` |
| `Table` | `selectionHeaderIndeterminate` | `boolean`, 기본 `true` | 일부 행 선택 시 헤더에 부분선택 표시를 쓸지 결정한다. 회색=미선택 규칙을 쓰는 일괄작업지시는 `false`다. | 일괄작업지시, Figma `20274:73333` |
| `Table` | `edgePadding` | `number`, 기본 `20` | 표 전체 좌우 내부 여백을 화면 실측에 맞춘다. | Figma `11210:50866`은 `0` |
| `Table` | `selectionColumnWidth` | `number`, 기본 `40` | 선택 열의 전체 폭을 헤더·데이터·그룹·총계 행에 동일 적용한다. | Figma `11210:50866`은 `56` |
| `Table` | `centerSelection` | `boolean`, 기본 `true` | 헤더와 데이터 행 체크박스를 선택 열 중앙의 동일한 x축에 배치한다. 왼쪽 정렬이 명시적으로 필요한 예외만 `false`를 사용한다. | Figma `11210:50866`, `18826:60554`, `18962:67817` |
| `Table` | `columnDividers` | `boolean`, 기본 `true` | 셀 사이 세로 점선을 화면별로 끈다. | Figma `11210:50866`은 `false` |
| `TableColumn` | `headerDetail` | `ReactNode`, 기본 없음 | 사용자 정의 점검항목처럼 컬럼명 아래에 판정기준이 붙는 경우 헤더 전체를 64px(42+22) 2단 구조로 전환한다. 값이 없는 고정 열은 두 행을 합친 높이로 유지한다. | 냉각기 점검표, Figma `9873:112446` |
| `Table` | `columnDividerMode` | `dashed-all \| solid-header \| none`, 기본은 기존 `columnDividers`에서 파생 | 기존 MES 표의 전 구간 점선과, 헤더에만 실선이 있고 본문에는 세로선이 없는 점검 기록표를 같은 컬럼 좌표 구조로 표현한다. | 냉각기 점검표, Figma `9873:112446`, `9873:112501` |
| `Table` | `headerBackground` | `gray10 \| white`, 기본 `gray10` | 공통 기본 헤더 색을 유지하면서 흰색 헤더가 명시된 화면을 표현한다. | 생산실적 등록, Figma `11210:48926`은 `white` |
| `Table` | `horizontalScroll` | `boolean`, 기본 `true` | 고정 폭이 정확히 맞는 표에서 불필요한 가로 스크롤을 금지한다. | Figma `11210:50866`은 `false` |
| `Table` | `showMasterGroupToggles` | `boolean`, 기본 `true` | 그룹 표이지만 헤더에 depth 일괄 접기 슬롯이 없는 화면에서 컬럼 시작점을 원본과 일치시킨다. | 생산실적 1280, Figma `18849:62315` |
| `Table` | `disabledTextTone` | `gray60 \| gray80`, 기본 `gray80` | 비활성 행 텍스트 명도를 화면 실측에 맞춘다. | Figma `11210:50866`은 `gray60` |
| `Table` | `unselectedTextTone` | `default \| gray80`, 기본 `default` | 비활성이 아닌 미선택 행의 텍스트 명도를 낮추고 선택 행과 편집 가능 상태를 구분한다. | 발주 일괄등록, Figma `11210:52026` |
| `TableRowData` | `hideSelection` | `boolean`, 기본 `false` | 선택 열 폭은 유지하면서 특정 행의 체크박스만 숨긴다. | 완료된 비활성 행, Figma `11210:50866` |
| `MobileTab` | `active` | `boolean`, 기본 `false` | mobile-tab-item의 default/active 상태를 명시하고 `aria-selected`와 시각 상태를 함께 바꾼다. | Figma `185:40778` |
| `MobileSelect` | `state` | `default \| focus \| complete \| readonly \| disabled`, 기본 `default` | Figma Selectbox 상태를 화면별 className 덮어쓰기 없이 같은 API로 표현한다. 열림 상태는 실제 dropdown 상호작용으로 관리한다. | Figma `185:40791` |
| `MobileSelect` | `mobileSize` | `default \| small`, 기본 `default` | 모바일 Selectbox의 두 크기를 명시한다. | Figma `185:40791` |
| `MobileSelect` | `placeholder`, `defaultOpen`, `onOpenChange`, `label` | `string`, `boolean`, `(open) => void`, `string` | 빈 값 문구, 드롭다운 초기/변경 상태, 접근성 이름을 호출부가 명시하도록 한다. | Figma `185:40791` 및 상호작용 검증 |
| `MobileCta` | `mode` 확장 | `save \| cancel-save \| checkbox-save`, 기본 `save` | Figma mobile CTA의 저장/취소+저장/체크박스 변형을 동일 컴포넌트에서 제공한다. | Figma `192:30753` |
| `MobileCta` | `checked`, `defaultChecked`, `onCheckedChange`, `checkboxLabel` | 체크 상태·변경 콜백·`ReactNode` | checkbox-save 변형을 정적 외형이 아닌 실제 체크 상태로 연결한다. | Figma `192:30753` |

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
| `FixtureTable` | `widths` | public `TableColumn.width`와 같은 `number \| { min, grow }` 타입으로 고정 컬럼과 반응형 flex 컬럼을 함께 전달한다. |
| `FixtureTable` | Table layout props | `edgePadding`, `selectionColumnWidth`, `centerSelection`, `columnDividers`, `headerBackground`, `horizontalScroll`, `disabledTextTone`, `unselectedTextTone`, `unselectedCheckboxAppearance`, `selectionHeaderIndeterminate`를 public `Table`에 그대로 전달한다. |
| `RadioOption` | `onChange` | 라디오 외형을 읽기 전용 예시가 아니라 수기/자동, 자동배열/사용자설정, 검사결과 state 전환에 연결한다. |
| `FigmaScreenPreview` | `sourceWidth`, `sourceHeight` | 1920 고정 가정 대신 1280·786·375 등 실제 Figma 프레임의 자연 크기를 기준으로 문서 안에서 축소한다. |

## 추가 규칙

1. 새 prop은 기존 기본 렌더링을 바꾸지 않는 optional 값이어야 한다.
2. 화면 하나만을 위한 값이라도 두 번 이상 반복될 가능성이 있으면 의미 기반 이름을 사용한다.
3. `className`만으로 상태 의미를 숨기지 않는다. 선택·비활성·검색 가능 여부처럼 동작에 영향을
   주는 차이는 명시적 prop으로 만든다.
4. prop을 추가한 화면에서는 기본/변형 상태와 실제 클릭 동작을 브라우저에서 각각 검증한다.
