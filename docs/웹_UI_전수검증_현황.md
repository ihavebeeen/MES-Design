# 웹 UI 전수검증 현황

> 기록: 2026-08-31 · 현재 테스트 목록: 92개 · 결과: 92개 통과

## 이번에 확인한 범위

| 구분 | 전체 | 현재 확인 결과 | 남은 확인 |
|---|---:|---:|---:|
| 공용 화면 요소 | 89 | 정식 41 | 검토 단계 48 |
| 화면 구성 방식 | 72 | 실제 화면 사용 46 | 화면 미사용 26 |
| 등록 화면 | 28 | 동작 확인 28 | 직접 시각 기준 없음 0 |

현재 소스 지문에서 코드·등록 정보·화면 동작과 저장된 기준 이미지를 검사했고 92개가 통과했다. 등록 화면 28개의 연결 상태도 함께 계산했다. 이는 Figma와 영구적으로 같다는 뜻이 아니며 원본 대조가 끝난 화면만 별도 검증으로 판단한다.

## 화면 28개 확인 결과

| 화면 | 동작 | 기준 이미지 | 화면 순서 상세화 | 현재 판단 |
|---|---|---|---|---|
| 투입품목 설정/조회 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 생산계획(일) 연동 일괄작업지시 | 통과 | 연결됨 | 완료 | 동작·화면 기준 있음 |
| 불량수량 입력 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| BOM 복사 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 선발행 라벨 수량 확정 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 운전일지 등록 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 생산실적 등록 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 입고등록 | 통과 | 연결됨 | 완료 | 동작·화면 기준 있음 |
| 자주검사 — 커스텀 정보 등록 상태 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 자주검사 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 그룹화 리스트 관리 화면 | 통과 | 연결됨 | 완료 | 동작·화면 기준 있음 |
| 양식관리 · 검사 판정 기준 설정 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 총 생산수량 변경 · 투입품 재등록 확인 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 공정검사 경향관리 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 사용자 정보 · 비밀번호 설정 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 판매관리 · 거래명세서 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 출하승인 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 양식관리 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 생산실적 반응형 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 캐비티 배열 설정 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 재고 추가 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 재고편집 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 발주 정보 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 생산분석 현황 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 냉각기 점검표 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 설비별 토출량 설정 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 표준단가 설정 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |
| 조 설정 | 통과 | 연결됨 | 기존 방식 | 동작·화면 기준 있음 |

## 우선 처리할 항목

### 1. 화면별 기준 이미지 연결

등록 화면 28개 모두 시각 기준에 연결돼 있다.

### 2. 아직 검토 단계인 공용 화면 요소

총 48개다. 새 화면에서 사용하기 전에 원본 근거, 상태와 사용 위치를 확인해야 한다.

- action: ButtonGroup, IconButton / CloseButton, Link, ToggleButton
- data-display: Avatar, Descriptions, ImageThumbnail, List / ListItem, OverflowList, SearchHighlight, Timeline
- feedback: EmptyState, ErrorState, LoadingOverlay, LoadingSpinner, ProgressCircle, Skeleton
- form: Cascader, DatePicker, DateRangePicker, Fieldset, FileUpload, Label, MultiSelectInput, NumberInput, PasswordInput, SegmentedControl, Slider, Textarea, TimePicker, TreeSelect
- layout: Accordion, Card, Collapsible, Divider, Container / Grid, Panel, ScrollArea, StickyHeader / StickyFooter
- navigation: Breadcrumb, Logo, Navbar, Pagination, TreeView, UserAccountMenu
- overlay: DropdownMenu, Popover, Tooltip

### 3. 정식이지만 상세 사용 기준이 없는 공용 요소

총 24개다. 현재 사용은 가능하지만 AI가 선택 이유까지 판단하려면 상세 기준을 추가해야 한다.

- AlarmListItem, BeforeAfterComparison, Combobox, ConfirmDialog, LabeledSelect, LabeledInput, SelectionActionBar, AnalyticsCharts, FilterTag, FormGrid / FormFieldRow, InspectionJudgement, NoticeBanner, NotificationPanel, PageTopTabItem, Progress, RadioChoiceDialog, MesProductSwitcher, IconMenu, QueryDateRange, CavityCell, Sidebar, Switch, Tag, Toast

### 4. 상세 조합 기준이 없는 화면 구성

총 62개다. 현재 화면에서 사용되는 항목부터 순서, 허용 요소, 스크롤과 동작 기준을 추가한다.

### 5. 실제 화면이나 생성 방식에서 사용되지 않는 구성

총 19개다. 삭제 대상으로 단정하지 않고 독립 예시인지, 향후 사용 예정인지, 과거 잔여물인지 판정해야 한다.

- 우측 슬라이드 · 그룹설정 (popup.side.group-settings)
- 커스텀 필드 값 (section.custom-field-values)
- 상단 작성값 추가 (section.staged-record-entry)
- 추가된 목록 · 직접 편집 선택 (section.added-record-list)
- 소속 사용자 선택 (section.member-selection)
- 메뉴별 권한 (section.permission-matrix)
- 중앙 · 폼/정보 중심 (popup.center.form)
- 중앙 · 시간 휠 + 계산 (popup.center.time-selector)
- 마스터-디테일 화면 (screen.master-detail)
- 테이블 컬럼 설정 (table.column-settings)
- 취소·입력 동작 세트 (action-set.cancel-input)
- 단계 진행 (workflow.stepper)
- 이중 목록 이동 (selection.transfer-list)
- 행 상세 펼침 (table.row-expand-detail)
- 고정 컬럼 그리드 (table.frozen-column-grid)
- 그룹 헤더 그리드 (table.grouped-header-grid)
- 공정 흐름도 (visualization.process-flow)
- 생산 간트 차트 (visualization.production-gantt)
- 온보딩 툴팁·제품 투어 (onboarding.product-tour)

## 다음 검증 순서

1. 현재 화면에서 많이 사용하는 정식 요소 중 상세 사용 기준이 없는 항목을 먼저 정리한다.
2. 검토 단계 요소는 실제 사용 화면이 생길 때 원본·상태·사용 위치를 확인하고 정식 여부를 판정한다.
3. 화면 구성을 실제 사용 빈도순으로 상세화한다.
4. 새 자산·테스트·기준 이미지가 바뀌면 이전 통과 기록을 현재 결과로 재사용하지 않는다.

## 판정 범위

- `동작·화면 기준 있음`은 등록 정보, 동작 검사와 저장소에 연결된 시각 기준이 있다는 뜻이다.
- 실제 Figma 원본과의 최종 픽셀 확인은 화면별 대조가 끝난 경우에만 별도로 완료 처리한다.
- 모바일은 사용자 결정에 따라 추후 진행 상태이며, 이번 웹 후속 작업의 우선순위에는 포함하지 않는다.

AI가 읽는 원장: `component-library/src/design-system/registry/web-verification-audit.json`
