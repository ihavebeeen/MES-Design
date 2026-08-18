# UI 컴포넌트 티어 정규화

기준일: 2026-08-18

이 문서는 최초 피그마 조사 시점의 `있음/부분/없음` 기록을 현재 코드 구조와 대조한 판정표다. 원본 체크리스트의 `없음`은 곧바로 ‘새 컴포넌트를 만들어야 함’을 뜻하지 않는다. 기존 컴포넌트의 조합으로 해결되는지, 현재 MES 범위에서 필요한지, 실제 업무·원본 근거가 있는지를 먼저 판정한다.

## 현재 결론

- Tier 1·2는 현재 데스크톱 MES 화면 생성 기반을 막는 미충족 항목이 없다.
- Tier 3의 기존 미구현 38개와 Tier 4·5 후보 69개는 모두 동작 가능한 격리 프로토타입으로 만들었다.
- Tier 4는 선택적 확장, Tier 5는 원칙적으로 핵심 MES 범위 밖이라는 우선순위를 유지한다. 코드가 존재해도 실제 업무 근거와 사용자 승인 전에는 표준으로 승격하지 않는다.
- 새로운 전체 화면은 커버리지 숫자를 늘리기 위해 추가하지 않는다. 기존 조합 문법으로 설명되지 않는 실제 화면이 나타날 때만 근거로 사용한다.

## 판정 기준

| 판정 | 의미 |
|---|---|
| 파운데이션 구현 | `implemented-foundation` |
| 컴포넌트 구현 | `implemented-component` |
| 패턴·화면 조합 구현 | `implemented-pattern` |
| 독립 컴포넌트 불필요 | `intentional-composition` |
| 격리 실험 후보 | `experimental-prototype` |
| 실제 근거 발생 시 검토 | `deferred-evidence` |
| 현재 범위 제외 | `excluded-scope` |

## 티어별 요약

| Tier | 전체 | 구현·조합 충족 | 격리 실험 후보 | 근거 대기 | 범위 제외 |
|---:|---:|---:|---:|---:|---:|
| 1 | 45 | 45 | 0 | 0 | 0 |
| 2 | 45 | 45 | 0 | 0 | 0 |
| 3 | 57 | 19 | 38 | 0 | 0 |
| 4 | 41 | 0 | 41 | 0 | 0 |
| 5 | 28 | 0 | 28 | 0 | 0 |

## Tier 1

| 항목 | 최초 상태 | 현재 판정 | 근거 | 비고 |
|---|---|---|---|---|
| Color Palette | 있음 | 파운데이션 구현 | legacy-checklist, globals.css | 기존 실측·구현 기록을 현재 파운데이션 근거로 유지한다. |
| Typography Scale | 있음 | 파운데이션 구현 | legacy-checklist, globals.css | 기존 실측·구현 기록을 현재 파운데이션 근거로 유지한다. |
| Shadow/Elevation Scale | 있음 | 파운데이션 구현 | legacy-checklist, globals.css | 기존 실측·구현 기록을 현재 파운데이션 근거로 유지한다. |
| Button (Primary) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Button (Secondary/Outline/Ghost) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Checkbox | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Radio Button | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Text Input | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Search Input | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Select (Dropdown) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Combobox | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Filter (필터 추가 트리거 + 플라이아웃 패널 + 활성 태그, 통합) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Form Field | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Sidebar / Side Nav | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Tabs | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Table | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Badge | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Chip / Tag | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Progress Bar | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Stat / KPI Card | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Calendar (표시용) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Alert / Banner | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Toast (스낵바 없음) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Modal / Dialog | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Confirm Dialog | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Notification / Bell | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Heading Styles | 있음 | 파운데이션 구현 | legacy-checklist, globals.css | 기존 실측·구현 기록을 현재 파운데이션 근거로 유지한다. |
| Body Text Styles | 있음 | 파운데이션 구현 | legacy-checklist, globals.css | 기존 실측·구현 기록을 현재 파운데이션 근거로 유지한다. |
| Filter Bar / Filter Panel | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| GroupQuery (그룹화 조회) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| QuickQuery (빠른 조회) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Table Bulk Selection | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Column Visibility Toggle | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Inline Cell Edit Grid | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Bulk Selection + Action Toolbar Grid | 부분 | 패턴·화면 조합 구현 | table, selection-action-bar, selection.enable-actions | Table 선택 상태와 SelectionActionBar의 조합 패턴으로 충족한다. |
| Grid Export / Print | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Center Modal | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Side Slide Panel (Full) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Side Slide Panel — 상하 분할 | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Side Slide Panel — 좌우 분할 | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Modal with Embedded Table | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Modal with Tabs | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Alarm List/Table | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Inspection Checklist Form | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Barcode/QR Scan Input | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |

## Tier 2

| 항목 | 최초 상태 | 현재 판정 | 근거 | 비고 |
|---|---|---|---|---|
| Spacing Scale | 부분 | 파운데이션 구현 | component-specific token policy | 전역 배수 하나로 강제하지 않고 원본 실측과 반복값을 컴포넌트별 규칙으로 관리한다. |
| Radius Scale | 부분 | 파운데이션 구현 | component-specific token policy | 전역 배수 하나로 강제하지 않고 원본 실측과 반복값을 컴포넌트별 규칙으로 관리한다. |
| Icon Set | 부분 | 파운데이션 구현 | src/components/icons, icon/mes | 실제 SVG 에셋 33종을 코드화했다. 닫힌 아이콘 총집합을 선제 제작하지 않고 실제 원본이 생길 때 추가한다. |
| Z-index Scale | 있음 | 파운데이션 구현 | legacy-checklist, globals.css | 기존 실측·구현 기록을 현재 파운데이션 근거로 유지한다. |
| Icon Button | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Button Group | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Toggle Button | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Switch / Toggle | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Textarea | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Number Input | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Password Input | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Multi-select / Tag Input | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Date Picker | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Date Range Picker | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Time Picker | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Navbar / Top Nav | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Breadcrumb | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Pagination | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Dropdown Menu | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| List | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Card | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Tooltip | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Skeleton | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Drawer / Sheet | 없음 | 컴포넌트 구현 | side-slide-panel | MES의 우측 진입형 작업은 범용 Drawer 대신 SideSlidePanel 규칙으로 통일한다. |
| Popover | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Loading Spinner | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Empty State | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Error State | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Accordion | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Collapsible | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Divider / Separator | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Grid / Container | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Panel | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Scroll Area | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Sticky Header/Footer | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Logo / Brandmark | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Bulk Action Toolbar | 없음 | 컴포넌트 구현 | selection-action-bar | 선택 건이 있을 때만 노출되는 MES용 SelectionActionBar로 구현되어 있다. |
| User / Account Menu | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Descriptions (Key-Value List) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Close Button (X) | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Loading Overlay | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Backdrop / Dim Overlay | 없음 | 독립 컴포넌트 불필요 | center-modal, side-slide-panel, confirm-dialog | 오버레이 셸 내부 책임이다. 독립 Backdrop API는 중복과 오사용을 만들기 때문에 두지 않는다. |
| Link | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Fieldset | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |
| Label | 있음 | 컴포넌트 구현 | legacy-checklist, components registry/code | 기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다. |

## Tier 3

| 항목 | 최초 상태 | 현재 판정 | 근거 | 비고 |
|---|---|---|---|---|
| Slider (Range) | 없음 | 격리 실험 후보 | experimental.slider, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| File Upload / Dropzone | 없음 | 격리 실험 후보 | experimental.file-upload, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Stepper / Wizard | 없음 | 격리 실험 후보 | experimental.stepper, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Data Grid | 없음 | 독립 컴포넌트 불필요 | table, table.grouped-list, selection.reveal-inline-editor | 별도 DataGrid를 만들지 않고 Table에 검증된 그룹화·선택·편집 패턴을 조합한다. |
| Timeline | 없음 | 격리 실험 후보 | experimental.timeline, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Tree View | 없음 | 격리 실험 후보 | experimental.tree-view, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Chart | 없음 | 컴포넌트 구현 | analytics-charts, section.monthly-comparison-chart | 분석 화면의 공통 차트 규격과 월간 비교 패턴이 등록되어 있다. |
| Resizable Panel | 없음 | 격리 실험 후보 | experimental.resizable-panel, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Split View | 없음 | 패턴·화면 조합 구현 | screen.master-detail, selection.master-detail | 좌우 분할 자체가 아니라 마스터 선택과 상세 갱신의 맥락 패턴으로 관리한다. |
| Image / Thumbnail | 없음 | 격리 실험 후보 | experimental.image-thumbnail, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Row Expand / Detail Drawer | 없음 | 격리 실험 후보 | experimental.row-expand-detail, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Inline Edit | 없음 | 패턴·화면 조합 구현 | selection.reveal-inline-editor, table.grouped-list | Table 위에 선택·그룹 행 동작 규칙을 조합한다. |
| Global Search / Search Overlay | 없음 | 격리 실험 후보 | experimental.global-search, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Settings List | 없음 | 격리 실험 후보 | experimental.settings-list, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Cascader | 없음 | 격리 실험 후보 | experimental.cascader, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Transfer (Dual List) | 없음 | 격리 실험 후보 | experimental.transfer, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Tree Select | 없음 | 격리 실험 후보 | experimental.tree-select, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| QR Code | 없음 | 격리 실험 후보 | experimental.qr-code, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Result Page | 없음 | 격리 실험 후보 | experimental.result-page, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Mask Input | 없음 | 격리 실험 후보 | experimental.mask-input, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Copy Button | 없음 | 독립 컴포넌트 불필요 | button, icon-copy | Button 또는 IconButton에 복사 아이콘과 동작을 결합한다. |
| Burger (Hamburger Menu) | 없음 | 독립 컴포넌트 불필요 | icon-button, icon-menu | IconButton과 실제 MES 메뉴 아이콘의 조합이다. |
| Status Indicator (Dot) | 없음 | 독립 컴포넌트 불필요 | badge, tag | 새 원시 컴포넌트보다 기존 상태 표현 컴포넌트의 variant로 해결한다. |
| Search Highlight Text | 없음 | 격리 실험 후보 | experimental.search-highlight, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Frozen Column Grid | 없음 | 격리 실험 후보 | experimental.frozen-column-grid, src/components/experimental/tier3-grid-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Grouped Header Grid | 없음 | 격리 실험 후보 | experimental.grouped-header-grid, src/components/experimental/tier3-grid-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Row Grouping / Expandable Sub-row | 없음 | 패턴·화면 조합 구현 | selection.reveal-inline-editor, table.grouped-list | Table 위에 선택·그룹 행 동작 규칙을 조합한다. |
| Master-Detail Grid (Nested Grid) | 없음 | 패턴·화면 조합 구현 | screen.master-detail, selection.master-detail | 마스터 행 선택과 상세 영역 갱신 규칙으로 구현한다. |
| Cell Status Color Grid | 없음 | 독립 컴포넌트 불필요 | table, badge, tag | 상태 의미는 Table 셀에 Badge 또는 Tag를 배치해 표현한다. |
| Text Link Cell | 없음 | 독립 컴포넌트 불필요 | table, link | Table 셀 render slot 안에 Link를 사용한다. 별도 셀 컴포넌트는 만들지 않는다. |
| Icon Cell | 없음 | 독립 컴포넌트 불필요 | table, src/components/icons | Table 셀 render slot과 등록 아이콘을 조합한다. |
| Column Resize / Reorder / Show-Hide | 없음 | 격리 실험 후보 | experimental.column-controls, src/components/experimental/tier3-grid-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Virtual Scroll Grid | 없음 | 격리 실험 후보 | experimental.virtual-scroll-grid, src/components/experimental/tier3-grid-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Real-time Update Indicator (Grid) | 없음 | 격리 실험 후보 | experimental.realtime-grid-indicator, src/components/experimental/tier3-grid-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Resizable / Draggable Popup | 없음 | 격리 실험 후보 | experimental.resizable-popup, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Andon Board (설비 상태판) | 없음 | 격리 실험 후보 | experimental.andon-board, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Equipment Status Card/Tile | 없음 | 격리 실험 후보 | experimental.equipment-status-card, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Real-time Gauge/Meter | 없음 | 격리 실험 후보 | experimental.gauge, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| OEE Dashboard Widget | 없음 | 격리 실험 후보 | experimental.oee-widget, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Real-time Trend Chart | 없음 | 격리 실험 후보 | experimental.realtime-trend, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Blinking Alarm Indicator | 없음 | 격리 실험 후보 | experimental.blinking-alarm, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Severity Level Tag | 없음 | 독립 컴포넌트 불필요 | badge, tag | 새 원시 컴포넌트보다 기존 상태 표현 컴포넌트의 variant로 해결한다. |
| Alarm Acknowledge Button | 없음 | 독립 컴포넌트 불필요 | button, alarm-list-item | 알람 행의 업무 액션으로 Button을 배치한다. |
| Work Order Form | 없음 | 패턴·화면 조합 구현 | batch-work-order, section.form-grid | 작업지시 화면과 공통 FormGrid 조합으로 충족한다. |
| Routing/BOM Tree | 없음 | 격리 실험 후보 | experimental.bom-tree, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Lot Progress Bar | 없음 | 독립 컴포넌트 불필요 | progress | 기존 Progress에 LOT 문맥의 라벨과 값을 전달한다. |
| Defect Type Tag/Selector | 없음 | 독립 컴포넌트 불필요 | tag, select | 표시는 Tag, 변경은 Select를 사용한다. |
| SPC Control Chart | 없음 | 격리 실험 후보 | experimental.spc-chart, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| 검사 판정 버튼 (○/△/✕/-) | 없음 | 컴포넌트 구현 | inspection-judgement | MES 검사 판정 전용 컴포넌트가 등록되어 있다. |
| Lot/Serial Search | 없음 | 독립 컴포넌트 불필요 | search-input, combobox | 검색어 입력과 후보 선택을 기존 입력 컴포넌트로 조합한다. |
| Inventory Level Indicator | 없음 | 격리 실험 후보 | experimental.inventory-level, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Approval Workflow Stepper | 없음 | 격리 실험 후보 | experimental.approval-stepper, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Attachment List | 없음 | 격리 실험 후보 | experimental.attachment-list, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Downtime Reason Selector | 없음 | 격리 실험 후보 | experimental.downtime-reason, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Equipment Detail Card | 없음 | 격리 실험 후보 | experimental.equipment-detail-card, src/components/experimental/tier3-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Footer | 없음 | 격리 실험 후보 | experimental.footer, src/components/experimental/tier3-content-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| File | 없음 | 격리 실험 후보 | experimental.file-row, src/components/experimental/tier3-input-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |

## Tier 4

| 항목 | 최초 상태 | 현재 판정 | 근거 | 비고 |
|---|---|---|---|---|
| Breakpoint Scale | 없음 | 격리 실험 후보 | experimental.breakpoint-scale, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Split Button | 없음 | 격리 실험 후보 | experimental.split-button, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Segmented Control | 없음 | 격리 실험 후보 | experimental.segmented-control, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Chip Selector | 없음 | 격리 실험 후보 | experimental.chip-selector, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| OTP / PIN Input | 없음 | 격리 실험 후보 | experimental.otp-pin-input, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Rich Text Editor | 없음 | 격리 실험 후보 | experimental.rich-text-editor, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Context Menu | 없음 | 격리 실험 후보 | experimental.context-menu, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Back to Top | 없음 | 격리 실험 후보 | experimental.back-to-top, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Avatar | 없음 | 격리 실험 후보 | experimental.avatar, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Progress Circle | 없음 | 격리 실험 후보 | experimental.progress-circle, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Disclosure Panel | 없음 | 격리 실험 후보 | experimental.disclosure-panel, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Empty Illustration | 없음 | 격리 실험 후보 | experimental.empty-illustration, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Chat Bubble / Message | 없음 | 격리 실험 후보 | experimental.chat-message, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| AI Prompt Input Box | 없음 | 격리 실험 후보 | experimental.ai-prompt-input, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Drag Handle / Sortable List | 없음 | 격리 실험 후보 | experimental.sortable-list, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Comment / Activity Feed | 없음 | 격리 실험 후보 | experimental.activity-feed, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Kanban Board | 없음 | 격리 실험 후보 | experimental.kanban-board, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Global Top Loading Bar | 없음 | 격리 실험 후보 | experimental.top-loading-bar, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Kbd (Keyboard Key) | 없음 | 격리 실험 후보 | experimental.kbd, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Aspect Ratio | 없음 | 격리 실험 후보 | experimental.aspect-ratio, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Anchor / Scroll Spy | 없음 | 격리 실험 후보 | experimental.anchor-scroll-spy, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Overflow List ("+N more") | 없음 | 격리 실험 후보 | experimental.overflow-list, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Spoiler (더보기/접기 텍스트) | 없음 | 격리 실험 후보 | experimental.spoiler, src/components/experimental/tier4-general-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Full-screen Modal | 없음 | 격리 실험 후보 | experimental.full-screen-modal, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Process Flow Diagram | 없음 | 격리 실험 후보 | experimental.process-flow, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Utilization Heatmap | 없음 | 격리 실험 후보 | experimental.utilization-heatmap, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Factory Layout View | 없음 | 격리 실험 후보 | experimental.factory-layout, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Escalation Timeline | 없음 | 격리 실험 후보 | experimental.escalation-timeline, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Work Order Kanban | 없음 | 격리 실험 후보 | experimental.work-order-kanban, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Production Gantt Chart | 없음 | 격리 실험 후보 | experimental.production-gantt, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Shift Schedule Calendar | 없음 | 격리 실험 후보 | experimental.shift-calendar, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Sampling Plan Table | 없음 | 격리 실험 후보 | experimental.sampling-plan, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Defect Pareto Chart | 없음 | 격리 실험 후보 | experimental.defect-pareto, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Genealogy Tree | 없음 | 격리 실험 후보 | experimental.genealogy-tree, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Label Print Preview | 없음 | 격리 실험 후보 | experimental.label-print-preview, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| E-signature Pad | 없음 | 격리 실험 후보 | experimental.e-signature, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Document Version History | 없음 | 격리 실험 후보 | experimental.document-version-history, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Maintenance Schedule Calendar | 없음 | 격리 실험 후보 | experimental.maintenance-calendar, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| PM Checklist | 없음 | 격리 실험 후보 | experimental.pm-checklist, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Skip Link | 없음 | 격리 실험 후보 | experimental.skip-link, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Visually Hidden | 없음 | 격리 실험 후보 | experimental.visually-hidden, src/components/experimental/tier4-mes-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |

## Tier 5

| 항목 | 최초 상태 | 현재 판정 | 근거 | 비고 |
|---|---|---|---|---|
| Floating Action Button (FAB) | 없음 | 격리 실험 후보 | experimental.fab, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Rating (별점) | 없음 | 격리 실험 후보 | experimental.rating, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Color Picker | 없음 | 격리 실험 후보 | experimental.color-picker, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Command Palette | 없음 | 격리 실험 후보 | experimental.command-palette, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Avatar Group | 없음 | 격리 실험 후보 | experimental.avatar-group, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Carousel | 없음 | 격리 실험 후보 | experimental.carousel, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Video Player | 없음 | 격리 실험 후보 | experimental.video-player, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Streaming Text Indicator | 없음 | 격리 실험 후보 | experimental.streaming-text, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Code Block | 없음 | 격리 실험 후보 | experimental.code-block, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Markdown Renderer | 없음 | 격리 실험 후보 | experimental.markdown-renderer, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Suggestion Chip | 없음 | 격리 실험 후보 | experimental.suggestion-chip, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Source / Citation Badge | 없음 | 격리 실험 후보 | experimental.citation-badge, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Onboarding Tooltip / Product Tour | 없음 | 격리 실험 후보 | experimental.product-tour, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Onboarding Checklist | 없음 | 격리 실험 후보 | experimental.onboarding-checklist, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Cookie Consent Banner | 없음 | 격리 실험 후보 | experimental.cookie-consent, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Feedback Widget | 없음 | 격리 실험 후보 | experimental.feedback-widget, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Live Chat Widget | 없음 | 격리 실험 후보 | experimental.live-chat-widget, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Dark Mode Toggle | 없음 | 격리 실험 후보 | experimental.dark-mode, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Language / Locale Selector | 없음 | 격리 실험 후보 | experimental.locale-selector, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Pricing Table | 없음 | 격리 실험 후보 | experimental.pricing-table, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Upgrade / Paywall Prompt | 없음 | 격리 실험 후보 | experimental.paywall, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Mentions | 없음 | 격리 실험 후보 | experimental.mentions, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Watermark | 없음 | 격리 실험 후보 | experimental.watermark, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Masonry Grid | 없음 | 격리 실험 후보 | experimental.masonry-grid, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Blockquote | 없음 | 격리 실험 후보 | experimental.blockquote, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Marquee | 없음 | 격리 실험 후보 | experimental.marquee, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Warehouse Location Map | 없음 | 격리 실험 후보 | experimental.warehouse-map, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |
| Hero | 없음 | 격리 실험 후보 | experimental.hero, src/components/experimental/tier5-prototypes.tsx | 기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다. |

## 운영 규칙

1. `격리 실험 후보`는 비교·판단을 위한 임시 코드이며 표준 AI 화면 생성에서 자동 선택하지 않는다.
2. 후보가 실제 화면에 등장하면 먼저 기존 표준 컴포넌트·패턴 조합으로 표현 가능한지 판정한다.
3. 기존 표준으로 표현할 수 없고 반복 가능성이 확인되며 사용자 승인을 받은 경우에만 새 컴포넌트 또는 섹션 패턴으로 등록한다.
4. 단일 화면 구현은 패턴 증거가 될 수 있지만, 화면 수 자체는 디자인 시스템 완성도의 지표로 사용하지 않는다.
5. 모바일은 별도 체크리스트와 별도 구현 트랙으로 관리한다.

이 파일은 `npm run audit:tier-coverage`로 갱신하고 `npm run check:tier-coverage`로 최신 상태를 검증한다.

