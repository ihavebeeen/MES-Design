# UI 실험 후보 판정 원장

> 이 파일은 `component-library/src/design-system/registry/experimental-candidates.json`에서 자동 생성됩니다. 직접 편집하지 않습니다.

## 현재 요약

- 최초 검토 후보: 57개
- 표준 승격: 11개 — 사용자 분류 완료, 실제 화면 검증 전까지 provisional
- 실험 유지: 9개 — Experimental에 격리, 표준 AI 생성에는 자동 사용하지 않음
- 현재 제외: 37개 — 현재 코드 및 자동 생성 후보에서 제외

## 판정 원칙

실제 MES 원본 또는 반복 업무 근거, 사용자 승인, 상호작용·시각 검증을 모두 통과해야 표준 레지스트리로 승격한다.

## Tier 3

판정일 2026-08-19 · 최초 23개 · 승격 11 · 유지 2 · 제외 10

| 후보 | 체크리스트 항목 | 판정 | 현재 위치 |
|---|---|---|---|
| 범위 슬라이더 | Slider (Range) | 표준 승격 | component.slider (provisional) |
| 파일 업로드·드롭존 | File Upload / Dropzone | 표준 승격 | component.file-upload (provisional) |
| 단계 진행 | Stepper / Wizard | 표준 승격 | pattern.workflow.stepper (provisional) |
| 계층 선택 | Cascader | 표준 승격 | component.cascader (provisional) |
| 이중 목록 이동 | Transfer (Dual List) | 표준 승격 | pattern.selection.transfer-list (provisional) |
| 트리 선택 | Tree Select | 표준 승격 | component.tree-select (provisional) |
| QR 코드 | QR Code | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 형식 제한 입력 | Mask Input | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 이력 타임라인 | Timeline | 표준 승격 | component.timeline (provisional) |
| 트리 보기 | Tree View | 표준 승격 | component.tree-view (provisional) |
| 이미지 썸네일 | Image / Thumbnail | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| 행 상세 펼침 | Row Expand / Detail Drawer | 표준 승격 | pattern.table.row-expand-detail (provisional) |
| 전체 검색 | Global Search / Search Overlay | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 검색어 강조 | Search Highlight Text | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| 크기 조절 패널 | Resizable Panel | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 이동·크기 조절 팝업 | Resizable / Draggable Popup | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 고정 컬럼 그리드 | Frozen Column Grid | 표준 승격 | pattern.table.frozen-column-grid (provisional) |
| 그룹 헤더 그리드 | Grouped Header Grid | 표준 승격 | pattern.table.grouped-header-grid (provisional) |
| 컬럼 크기·순서·표시 | Column Resize / Reorder / Show-Hide | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 가상 스크롤 그리드 | Virtual Scroll Grid | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 설비 상태판 | Andon Board | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 실시간 게이지 | Real-time Gauge / Meter | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| SPC 관리도 | SPC Control Chart | 현재 제외 | 코드·자동 생성 후보에서 제외 |

판정 메모:

- 검색어 강조는 실험 후보로 유지하되 후속 수정이 필요하다.
- 승격 자산은 사용자 승인 근거만 충족했으므로 시각·업무 검증 완료 전까지 provisional로 관리한다.

## Tier 4

판정일 2026-08-19 · 최초 22개 · 승격 0 · 유지 6 · 제외 16

| 후보 | 체크리스트 항목 | 판정 | 현재 위치 |
|---|---|---|---|
| 브레이크포인트 스케일 | Breakpoint Scale | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 분할 버튼 | Split Button | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 세그먼트 컨트롤 | Segmented Control | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| OTP·PIN 입력 | OTP / PIN Input | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 서식 텍스트 편집기 | Rich Text Editor | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 컨텍스트 메뉴 | Context Menu | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 사용자 아바타 | Avatar | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| 원형 진행률 | Progress Circle | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| 메시지 버블 | Chat Bubble / Message | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 정렬 가능한 목록 | Drag Handle / Sortable List | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 칸반 보드 | Kanban Board | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 앵커·스크롤 추적 | Anchor / Scroll Spy | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 넘침 목록 | Overflow List ("+N more") | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| 공정 흐름도 | Process Flow Diagram | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| 공장 배치도 | Factory Layout View | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 생산 간트 차트 | Production Gantt Chart | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| 교대 일정 달력 | Shift Schedule Calendar | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 불량 파레토 차트 | Defect Pareto Chart | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 라벨 인쇄 미리보기 | Label Print Preview | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 전자서명 패드 | E-signature Pad | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 본문 바로가기 | Skip Link | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 시각적으로 숨김 | Visually Hidden | 현재 제외 | 코드·자동 생성 후보에서 제외 |

판정 메모:

- 세그먼트는 ButtonGroup의 무상태 레이아웃, ToggleButton의 독립 on/off와 달리 그룹 내 단일 선택 계약 후보로 유지한다.
- 브레이크포인트는 UI 컴포넌트가 아니라 반응형 정책·토큰 성격이므로 버튼 프로토타입을 제거한다.

## Tier 5

판정일 2026-08-19 · 최초 12개 · 승격 0 · 유지 1 · 제외 11

| 후보 | 체크리스트 항목 | 판정 | 현재 위치 |
|---|---|---|---|
| 별점 평가 | Rating | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 색상 선택기 | Color Picker | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 캐러셀 | Carousel | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 영상 플레이어 | Video Player | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 코드 블록 | Code Block | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 마크다운 렌더러 | Markdown Renderer | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 온보딩 툴팁·제품 투어 | Onboarding Tooltip / Product Tour | 실험 유지 | Experimental 격리 · 자동 생성 미사용 |
| 사용자 멘션 | Mentions | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 워터마크 | Watermark | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 메이슨리 그리드 | Masonry Grid | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 흐르는 공지 | Marquee | 현재 제외 | 코드·자동 생성 후보에서 제외 |
| 창고 위치 지도 | Warehouse Location Map | 현재 제외 | 코드·자동 생성 후보에서 제외 |

판정 메모:

- 온보딩 툴팁·제품 투어만 실험 후보로 유지하고 나머지는 현재 MES 자동 생성 범위에서 제외한다.

