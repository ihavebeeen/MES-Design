import { COMPONENT_CATALOG_GROUPS } from "@/lib/component-catalog-data";

/**
 * 2026-08-04 신규 — 페이지 분할(라우팅) 도입으로 이 파일을 app/page.tsx(client)에서
 * 분리. 정적 export(`output: "export"`, GitHub Pages 배포)는 동적 라우트마다
 * generateStaticParams()로 미리 만들 경로 목록을 알아야 하는데, 그건 서버
 * 컴포넌트에서만 가능(export const 목록이 "use client" 페이지 안에 있으면 서버
 * 쪽에서 못 씀) — 그래서 사이드바/라우팅에 필요한 순수 데이터·함수(TOC_LINKS,
 * COMPONENT_NODES, idToHref 등, JSX 없음)만 이 파일로 옮기고, app/[...slug]/page.tsx
 * (서버)와 실제 화면(client)이 둘 다 여기서 import해서 씀 — 중복 방지.
 */

/**
 * 컴포넌트별 예시를 "행/열이 맞는 그리드 + 컴포넌트명·상태값 라벨 병기" 형태로 정리한
 * 미리보기 페이지 (2026-07-28 담당자 지적 반영: 단순히 나눠 배치하는 게 아니라
 * 오와 열을 맞추고, 각 예시마다 컴포넌트명과 상태값을 같이 표기할 것).
 */

/**
 * 2026-07-30 담당자 요청 — 페이지 상단에 섹션 바로가기 링크 추가. 각 항목의 `id`는
 * 아래 섹션들의 `id`(또는 `<Section id="...">`)와 1:1로 맞춰야 함 — 섹션 id를 바꾸면
 * 여기도 같이 바꿀 것.
 */
/**
 * 2026-08-04 신규 — 담당자 지적: "ConfirmDialog/RadioChoiceDialog처럼 영어 코드 이름을
 * 그대로 사이드바·제목에 쓰면 개발자 아닌 사람은 알아보기 어렵다". `label`을 한국어
 * 메인 이름으로, `labelEn`을 실제 코드 컴포넌트 이름(파일명과 1:1 대응, 참고용 보조
 * 표기)으로 분리. Foundation 항목(color-palette~grid-container, icons)은 코드
 * 컴포넌트 파일과 1:1 대응하는 게 아니라 손대지 않음(기존 한국어 라벨 그대로 유지).
 */
export const TOC_LINKS: { id: string; label: string; labelEn?: string }[] = [
  { id: "color-palette", label: "색상 팔레트" },
  { id: "typography", label: "타이포그래피" },
  { id: "spacing", label: "간격" },
  { id: "radius", label: "Radius" },
  { id: "shadow", label: "그림자" },
  { id: "semantic-tokens", label: "시맨틱 토큰" },
  { id: "button-size", label: "버튼 사이즈", labelEn: "Button Size" },
  { id: "button-icon", label: "버튼 아이콘", labelEn: "Button Icon" },
  { id: "button-color", label: "버튼 컬러", labelEn: "Button Color" },
  { id: "icon-button", label: "아이콘 버튼 / 닫기 버튼", labelEn: "IconButton / CloseButton" },
  { id: "divider", label: "구분선", labelEn: "Divider" },
  { id: "tooltip", label: "툴팁", labelEn: "Tooltip" },
  { id: "loading-spinner", label: "로딩 스피너", labelEn: "LoadingSpinner" },
  { id: "skeleton", label: "스켈레톤", labelEn: "Skeleton" },
  { id: "switch", label: "스위치", labelEn: "Switch" },
  { id: "textarea", label: "텍스트 영역", labelEn: "Textarea" },
  { id: "label", label: "라벨", labelEn: "Label" },
  { id: "link", label: "링크", labelEn: "Link" },
  { id: "input", label: "기본 입력", labelEn: "Input" },
  { id: "select", label: "셀렉트", labelEn: "Select" },
  { id: "badge", label: "뱃지", labelEn: "Badge" },
  { id: "radio", label: "라디오 버튼", labelEn: "Radio" },
  { id: "checkbox", label: "체크박스", labelEn: "Checkbox" },
  { id: "progress", label: "진행률", labelEn: "Progress Bar" },
  { id: "filter", label: "필터", labelEn: "Filter" },
  { id: "group-query", label: "그룹 조회", labelEn: "GroupQuery" },
  { id: "quick-query", label: "빠른 조회", labelEn: "QuickQuery" },
  { id: "search-input", label: "검색창", labelEn: "SearchInput" },
  { id: "search-highlight", label: "검색어 강조", labelEn: "SearchHighlight" },
  { id: "image-thumbnail", label: "이미지 썸네일", labelEn: "ImageThumbnail" },
  { id: "segmented-control", label: "세그먼트 컨트롤", labelEn: "SegmentedControl" },
  { id: "avatar", label: "사용자 아바타", labelEn: "Avatar" },
  { id: "progress-circle", label: "원형 진행률", labelEn: "ProgressCircle" },
  { id: "overflow-list", label: "넘침 목록", labelEn: "OverflowList" },
  { id: "slider", label: "범위 슬라이더", labelEn: "Slider" },
  { id: "file-upload", label: "파일 업로드", labelEn: "FileUpload" },
  { id: "cascader", label: "계층 선택", labelEn: "Cascader" },
  { id: "tree-select", label: "트리 선택", labelEn: "TreeSelect" },
  { id: "timeline", label: "이력 타임라인", labelEn: "Timeline" },
  { id: "tree-view", label: "트리 보기", labelEn: "TreeView" },
  { id: "tag", label: "태그", labelEn: "Tag" },
  { id: "combobox", label: "콤보박스", labelEn: "Combobox" },
  { id: "toast", label: "토스트", labelEn: "Toast" },
  { id: "confirm-dialog", label: "확인 모달", labelEn: "ConfirmDialog" },
  { id: "notice-banner", label: "안내 배너", labelEn: "NoticeBanner" },
  { id: "radio-choice-dialog", label: "선택형 확인 모달", labelEn: "RadioChoiceDialog" },
  { id: "center-modal", label: "중앙 모달", labelEn: "Center Modal" },
  { id: "side-slide-panel", label: "우측 슬라이드", labelEn: "Side Slide Panel" },
  { id: "page-top-tab-item", label: "상단 탭", labelEn: "PageTopTabItem" },
  { id: "sidebar", label: "사이드바", labelEn: "Sidebar" },
  { id: "alarm-list-item", label: "알람 리스트 항목", labelEn: "AlarmListItem" },
  { id: "notification-panel", label: "알림 패널", labelEn: "NotificationPanel" },
  { id: "card", label: "카드", labelEn: "Card" },
  { id: "empty-state", label: "없음", labelEn: "Empty" },
  { id: "error-state", label: "오류", labelEn: "Error" },
  { id: "popover", label: "팝오버", labelEn: "Popover" },
  { id: "accordion", label: "아코디언", labelEn: "Accordion" },
  { id: "collapsible", label: "접기·펼치기", labelEn: "Collapsible" },
  { id: "button-group", label: "버튼 그룹", labelEn: "ButtonGroup" },
  { id: "toggle-button", label: "토글 버튼", labelEn: "ToggleButton" },
  { id: "number-input", label: "숫자", labelEn: "Number" },
  { id: "password-input", label: "비밀번호", labelEn: "Password" },
  { id: "multi-select-input", label: "다중 선택 입력", labelEn: "MultiSelectInput" },
  { id: "breadcrumb", label: "브레드크럼", labelEn: "Breadcrumb" },
  { id: "pagination", label: "페이지네이션", labelEn: "Pagination" },
  { id: "dropdown-menu", label: "드롭다운 메뉴", labelEn: "DropdownMenu" },
  { id: "list", label: "리스트", labelEn: "List" },
  { id: "panel", label: "패널", labelEn: "Panel" },
  { id: "fieldset", label: "필드셋", labelEn: "Fieldset" },
  { id: "descriptions", label: "설명 목록", labelEn: "Descriptions" },
  { id: "date-picker", label: "날짜", labelEn: "Date" },
  { id: "date-range-picker", label: "기간", labelEn: "Range" },
  { id: "time-picker", label: "시간", labelEn: "Time" },
  { id: "navbar", label: "내비게이션 바", labelEn: "Navbar" },
  { id: "grid-container", label: "Grid/Container" },
  { id: "scroll-area", label: "스크롤 영역", labelEn: "ScrollArea" },
  { id: "sticky-header-footer", label: "고정 헤더 / 고정 푸터", labelEn: "StickyHeader/Footer" },
  { id: "logo", label: "로고", labelEn: "Logo" },
  { id: "user-account-menu", label: "계정 메뉴", labelEn: "UserAccountMenu" },
  { id: "loading-overlay", label: "로딩 오버레이", labelEn: "LoadingOverlay" },
  { id: "icons", label: "아이콘" },
  { id: "table-parts", label: "테이블 구성 요소", labelEn: "Table Parts" },
  { id: "table-full", label: "테이블 합본", labelEn: "Full Table" },
  // 2026-08-05 신규 — Patterns(3층) 첫 항목들. 담당자가 클라우드MES Figma 파일에서
  // "1차로 만들었던 화면 예시들" 보드(node 20274:73333, 20개 넘는 화면이 있어 한
  // 번에 전부는 무리라 몇 개씩 끊어 등록하기로 함)에서 개별 프레임 링크로 골라줌.
  // Components처럼 낱개 UI가 아니라 여러 컴포넌트를 실제 화면으로 합성한 것이라
  // 별도 그룹(Patterns)으로 관리 — label은 담당자가 프레임에 붙인 이름 그대로.
  {
    id: "grouped-list-screen",
    label: "그룹화 리스트 관리 화면",
    labelEn: "Grouped List Screen",
  },
  {
    id: "completed-entity-list",
    label: "완성 화면 — 출하지시 리스트",
    labelEn: "Shipment Instruction List",
  },
  {
    id: "completed-master-detail",
    label: "완성 화면 — LOT 추적",
    labelEn: "LOT Trace Master Detail",
  },
  {
    id: "completed-analytics-dashboard",
    label: "완성 화면 — 생산분석 현황",
    labelEn: "Production Analytics",
  },
  {
    id: "original-mes-screen-assets",
    label: "원본 화면",
    labelEn: "Source Screens",
  },
  {
    id: "completed-popup-types",
    label: "팝업 자산",
    labelEn: "Popup Assets",
  },
  {
    id: "table-column-settings-pattern",
    label: "테이블 컬럼 설정",
    labelEn: "Table Column Settings",
  },
  { id: "workflow-stepper", label: "단계 진행", labelEn: "StepperPattern" },
  { id: "selection-transfer-list", label: "이중 목록 이동", labelEn: "TransferListPattern" },
  { id: "table-row-expand-detail", label: "행 상세 펼침", labelEn: "ExpandableRowPattern" },
  { id: "table-frozen-column-grid", label: "고정 컬럼 그리드", labelEn: "FrozenColumnGridPattern" },
  { id: "table-grouped-header-grid", label: "그룹 헤더 그리드", labelEn: "GroupedHeaderGridPattern" },
  { id: "visualization-process-flow", label: "공정 흐름도", labelEn: "ProcessFlowPattern" },
  { id: "visualization-production-gantt", label: "생산 간트 차트", labelEn: "ProductionGanttPattern" },
  { id: "onboarding-product-tour", label: "온보딩 제품 투어", labelEn: "ProductTourPattern" },
  {
    id: "generated-screen-review",
    label: "생성 시안 검토함",
    labelEn: "Generated Screen Review",
  },
  {
    id: "experimental-decisions",
    label: "후보 판정 현황",
    labelEn: "Candidate Decisions",
  },
  { id: "mobile-foundations", label: "파운데이션", labelEn: "Foundations" },
  { id: "mobile-components", label: "컴포넌트", labelEn: "Components" },
  { id: "mobile-patterns", label: "조합 패턴", labelEn: "Composition Patterns" },
  { id: "mobile-screens", label: "원본 화면", labelEn: "Source Screens" },
  { id: "mobile-popup-assets", label: "팝업 자산", labelEn: "Popup Assets" },
];

/**
 * 2026-07-31 신규 — 당근 Seed Design System(seed-design.io) 구조 참고, "메뉴 위치"
 * 컨셉만 차용: 상단 얇은 헤더 바 + 좌측 고정 사이드바(카테고리별 섹션 목록, 스크롤에 따라
 * 현재 위치 강조) + 본문. Seed는 다크 테마지만 이 프로젝트는 기존 화이트 톤을 그대로
 * 유지 — 톤은 가져오지 않고 레이아웃 구조만 가져옴.
 *
 * 2026-07-31, 곧바로 이어서 — 담당자가 "Button 사이즈/컬러/아이콘처럼 한 컴포넌트의
 * 하위 항목끼리는 [Button]이라는 상위 메뉴 밑에 묶여야 한다"고 지적. 사이드바만 리프
 * (leaf, 단일 섹션)와 브랜치(branch, 하위 섹션 여러 개를 가진 상위 메뉴) 2종 노드로
 * 트리화함 — 스크롤 스파이가 관찰하는 실제 앵커 대상은 여전히 `TOC_LINKS`(평평한 목록,
 * 안 바뀜)이고, 사이드바 트리는 그 위에 얹는 "표시용" 구조라 두 값이 어긋날 일이 없음
 * (branch 하위 항목의 id는 전부 `leaf()` 헬퍼로 TOC_LINKS에서 그대로 가져옴).
 * 현재 그룹화 대상: Button(사이즈/컬러/아이콘 3종), Table(합본/분리 2종), Modal(중앙/
 * 사이드 2종 — 2026-08-04까지는 중첩 포함 3종이었으나, "Nested Modal은 별도 컴포넌트가
 * 아니라 기존 모달들을 그냥 동시에 열면 되는 것"이라는 담당자 판단으로 그 항목 자체를
 * 삭제해 2종으로 축소), Input(기본/숫자/비밀번호 3종), Picker(날짜/기간/시간 3종),
 * State(없음/오류 2종) — 전부 "이름은 다르지만 실제로 같은 컴포넌트를 그대로 재사용/
 * 확장한 성격이 비슷한 것들"이라는 기준으로 소스 코드의 재사용 관계(doc 주석의
 * "OO 재사용"/"OO를 그대로 감싸" 문구)를 근거로만 묶었음 — 그냥 이름이나 위치가
 * 비슷하다고 임의로 묶지 않음(예: Select/Combobox는 소스에 "별도 컴포넌트로 분리"라고
 * 의도적 분리 이유가 적혀 있어 제외, Filter/GroupQuery/QuickQuery는 서로 재사용
 * 관계가 없는 독립 컴포넌트라 제외). 나머지는 전부 컴포넌트 1개당 섹션 1개라 묶을
 * 하위 항목이 없음.
 */
export type SidebarNode =
  | { kind: "leaf"; id: string; label: string; labelEn?: string }
  | {
      kind: "branch";
      label: string;
      labelEn?: string;
      children: { id: string; label: string; labelEn?: string }[];
    };

export function leaf(id: string): SidebarNode {
  const item = TOC_LINKS.find((l) => l.id === id);
  if (!item) throw new Error(`TOC_LINKS에 없는 id: ${id}`);
  return { kind: "leaf", id: item.id, label: item.label, labelEn: item.labelEn };
}

/**
 * 2026-08-04 — 이전엔 `stripPrefix + " "`를 하위 항목 라벨에서 떼어내는 방식(예: "Button
 * 사이즈" → "사이즈")이었는데, TOC_LINKS 라벨 자체가 이제 한국어 짧은 이름(예: "사이즈")을
 * 직접 담고 있어서 문자열 자르기가 필요 없어짐 — 상위 메뉴 이름(한국어/영문)을 그대로
 * 인자로 받는다.
 */
export function branch(label: string, labelEn: string, ids: string[]): SidebarNode {
  return {
    kind: "branch",
    label,
    labelEn,
    children: ids.map((id) => {
      const item = TOC_LINKS.find((l) => l.id === id);
      if (!item) throw new Error(`TOC_LINKS에 없는 id: ${id}`);
      return { id: item.id, label: item.label, labelEn: item.labelEn };
    }),
  };
}

export function firstIdOfNode(node: SidebarNode): string {
  return node.kind === "leaf" ? node.id : node.children[0].id;
}

/**
 * 2026-08-03 — 담당자 정정: "foundation에 icon이 들어가있다는 게 헤더에 아이콘을
 * 넣으라는 게 아니라, 섹션들을 다 검토해서 파운데이션에 들어가야 하는 것들은
 * 파운데이션에 넣으라는 거였다". 체크리스트(`UI_컴포넌트_총망라_체크리스트.md`)의
 * 레이어 구분 기준 "토큰"(아이콘 에셋 등 원시값) 항목인 "아이콘"(Icon Set)과
 * "레이아웃 유틸" 항목인 "Grid / Container"를 Components에서 Foundation으로
 * 재분류 — 색상/타이포/간격/radius/그림자/시맨틱 토큰과 같은 층위. 실제 페이지에서도
 * 사이드바 그룹과 스크롤 순서가 어긋나지 않도록 두 섹션의 JSX 자체를 Components
 * 구분자보다 위(semantic-tokens 바로 다음)로 물리적으로 이동시킴.
 * 기존엔 `TOC_LINKS.slice(0, 6)`처럼 "앞의 몇 개"라는 위치 기반이라 항목을 추가할
 * 때마다 순서에 의존해야 했음 — 앞으로 이런 재분류가 또 있을 수 있어 명시적 id
 * 목록으로 바꿔 위치와 무관하게 관리.
 */
export const FOUNDATION_ID_LIST = [
  "color-palette",
  "typography",
  "spacing",
  "radius",
  "shadow",
  "semantic-tokens",
  "icons",
  "grid-container",
];
export const FOUNDATION_NODES: SidebarNode[] = FOUNDATION_ID_LIST.map((id) => leaf(id));

/** 2026-08-05 신규 — Patterns(3층) id 목록. 지금은 순서가 곧 등록한 순서(별도 정렬 없음
 *  — 아직 3개뿐이라 Components처럼 티어 정렬을 도입할 필요가 없음, 늘어나면 재검토). */
export const PATTERN_ID_LIST = [
  "original-mes-screen-assets",
  "grouped-list-screen",
  "completed-entity-list",
  "completed-master-detail",
  "completed-analytics-dashboard",
  "completed-popup-types",
  "table-column-settings-pattern",
  "workflow-stepper",
  "selection-transfer-list",
  "table-row-expand-detail",
  "table-frozen-column-grid",
  "table-grouped-header-grid",
  "visualization-process-flow",
  "visualization-production-gantt",
  "onboarding-product-tour",
];
export const PATTERN_NODES: SidebarNode[] = [
  branch("화면", "Screens", [
    "original-mes-screen-assets",
    "grouped-list-screen",
    "completed-entity-list",
    "completed-master-detail",
    "completed-analytics-dashboard",
  ]),
  branch("팝업", "Popups", ["completed-popup-types"]),
  branch("테이블", "Tables", ["table-column-settings-pattern"]),
  branch("워크플로", "Workflow", ["workflow-stepper"]),
  branch("선택", "Selection", ["selection-transfer-list"]),
  branch("데이터 테이블", "Data tables", ["table-row-expand-detail", "table-frozen-column-grid", "table-grouped-header-grid"]),
  branch("시각화", "Visualization", ["visualization-process-flow", "visualization-production-gantt"]),
  branch("온보딩", "Onboarding", ["onboarding-product-tour"]),
];

export const GENERATED_SCREEN_ID_LIST = ["generated-screen-review"];
export const GENERATED_SCREEN_NODES: SidebarNode[] = GENERATED_SCREEN_ID_LIST.map((id) => leaf(id));

export const EXPERIMENTAL_ID_LIST = ["experimental-decisions"];
export const EXPERIMENTAL_NODES: SidebarNode[] = EXPERIMENTAL_ID_LIST.map((id) => leaf(id));

/** 모바일은 웹 컴포넌트의 작은 사이즈 변형이 아니라 독립된 셸·조합 문법을 가진다. */
export const MOBILE_ID_LIST = [
  "mobile-foundations",
  "mobile-components",
  "mobile-patterns",
  "mobile-screens",
  "mobile-popup-assets",
];
export const MOBILE_NODES: SidebarNode[] = [
  leaf("mobile-foundations"),
  leaf("mobile-components"),
  leaf("mobile-patterns"),
  branch("화면", "Screens", ["mobile-screens"]),
  branch("팝업", "Popups", ["mobile-popup-assets"]),
];

export const COMPONENT_NODES: SidebarNode[] = COMPONENT_CATALOG_GROUPS.map((group) =>
  branch(group.label, group.labelEn, group.itemIds),
);

/**
 * 2026-08-03 신규 — 담당자 요청: "더 작업이 필요한 것들의 구역을 미리 생성해 둬".
 * 체크리스트 기준 티어3(59개, 필수)/티어4(41개, 포함권장 19+보류 22) 미착수 항목을
 * 위한 자리만 미리 만들어둠 — 실제 항목 이름을 다 채우진 않고(125개를 지금 다 나열하는
 * 건 과함), "여기에 나중에 채워진다"는 구조만 사이드바+메인 양쪽에 둠. 티어5(28개)는
 * 체크리스트에서 이미 "제외" 확정이라 이 자리에 포함하지 않음.
 */
export const SIDEBAR_GROUPS: { title: string; nodes: SidebarNode[] }[] = [
  { title: "Foundations", nodes: FOUNDATION_NODES },
  { title: "Components", nodes: COMPONENT_NODES },
  // 2026-08-05 신규 — 3층(합성 패턴 카탈로그) 실제 첫 콘텐츠. TOP_NAV의 "Patterns"
  // 탭이 지금까지 firstId 없이 비활성 상태로만 자리를 잡고 있었는데, 이걸로 활성화.
  { title: "Patterns", nodes: PATTERN_NODES },
  { title: "Mobile", nodes: MOBILE_NODES },
  { title: "Generated Screens", nodes: GENERATED_SCREEN_NODES },
  { title: "Experimental", nodes: EXPERIMENTAL_NODES },
];

/**
 * 2026-08-03 신규 — 담당자 요청: "'임시'인 건 좌측 메뉴 리스트에도 '임시' 태그를 달아줘".
 * 각 섹션의 `<Section badge="임시">`와 1:1로 맞춰 수동 관리하는 id 목록(FOUNDATION_IDS와
 * 같은 방식) — 새 섹션에 `badge="임시"`를 달거나 뗄 때 여기도 같이 바꿀 것.
 */
export const TEMP_BADGE_IDS = new Set([
  "icon-button",
  "divider",
  "tooltip",
  "loading-spinner",
  "skeleton",
  "switch",
  "textarea",
  "label",
  "link",
  "card",
  "empty-state",
  "error-state",
  "popover",
  "accordion",
  "collapsible",
  "button-group",
  "toggle-button",
  "number-input",
  "password-input",
  "multi-select-input",
  "breadcrumb",
  "pagination",
  "dropdown-menu",
  "list",
  "panel",
  "fieldset",
  "descriptions",
  "date-picker",
  "date-range-picker",
  "time-picker",
  "navbar",
  "grid-container",
  "scroll-area",
  "sticky-header-footer",
  "logo",
  "user-account-menu",
  "loading-overlay",
]);

/**
 * 2026-08-03 신규 — 담당자 요청: "티어 1 2 3 4 5도 좌측 리스트에 표기를 둬봐". 각 id를
 * `docs/UI_컴포넌트_총망라_체크리스트.md`의 티어 값과 1:1로 맞춰 수동 관리(TEMP_BADGE_IDS와
 * 같은 방식 — 체크리스트에서 컴포넌트를 새로 완료하거나 티어를 바꾸면 여기도 같이 바꿀 것).
 * Foundation 6개는 각각 대응하는 토큰 체크리스트 행(Color/Typography/Spacing/Radius/
 * Shadow Scale)의 티어, "semantic-tokens"는 체크리스트에 별도 행이 없어 배지 없음.
 */
export const TIER_BY_ID: Record<string, number> = {
  "color-palette": 1,
  typography: 1,
  spacing: 2,
  radius: 2,
  shadow: 1,
  "button-size": 1,
  "button-icon": 1,
  "button-color": 1,
  "icon-button": 2,
  divider: 2,
  tooltip: 2,
  "loading-spinner": 2,
  skeleton: 2,
  switch: 2,
  textarea: 2,
  label: 2,
  link: 2,
  input: 1,
  select: 1,
  badge: 1,
  radio: 1,
  checkbox: 1,
  progress: 1,
  filter: 1,
  "group-query": 1,
  "quick-query": 1,
  "search-input": 1,
  tag: 1,
  combobox: 1,
  toast: 1,
  "confirm-dialog": 1,
  "notice-banner": 1,
  "radio-choice-dialog": 1,
  "center-modal": 1,
  "side-slide-panel": 1,
  "page-top-tab-item": 1,
  sidebar: 1,
  "alarm-list-item": 1,
  "notification-panel": 1,
  card: 2,
  "empty-state": 2,
  "error-state": 2,
  popover: 2,
  accordion: 2,
  collapsible: 2,
  "button-group": 2,
  "toggle-button": 2,
  "number-input": 2,
  "password-input": 2,
  "multi-select-input": 2,
  breadcrumb: 2,
  pagination: 2,
  "dropdown-menu": 2,
  list: 2,
  panel: 2,
  fieldset: 2,
  descriptions: 2,
  "date-picker": 2,
  "date-range-picker": 2,
  "time-picker": 2,
  navbar: 2,
  "grid-container": 2,
  "scroll-area": 2,
  "sticky-header-footer": 2,
  logo: 2,
  "user-account-menu": 2,
  "loading-overlay": 2,
  icons: 2,
  "table-parts": 1,
  "table-full": 1,
  "slider": 3,
  "file-upload": 3,
  "cascader": 3,
  "tree-select": 3,
  "timeline": 3,
  "tree-view": 3,
  "image-thumbnail": 3,
  "search-highlight": 3,
  "segmented-control": 4,
  "avatar": 4,
  "progress-circle": 4,
  "overflow-list": 4,
  "workflow-stepper": 3,
  "selection-transfer-list": 3,
  "table-row-expand-detail": 3,
  "table-frozen-column-grid": 3,
  "table-grouped-header-grid": 3,
  "visualization-process-flow": 4,
  "visualization-production-gantt": 4,
  "onboarding-product-tour": 5,
};

export const TIER_COLOR: Record<number, string> = {
  1: "bg-mes-bg-danger/10 text-mes-danger-70",
  2: "bg-mes-bg-brand-subtle-strong text-mes-text-brand",
  3: "bg-mes-bg-subtle text-mes-gray-90",
  4: "bg-mes-bg-subtle text-mes-gray-70",
  5: "bg-mes-bg-subtle text-mes-gray-50",
};

/**
 * 2026-08-03 신규 — 담당자 요청: "티어별로 순서 배치하고 같은 티어 안에서는 알파벳
 * 순서대로 정렬". `COMPONENT_NODES`는 지금까지 작업한 순서(연대순)로 쌓여 있었는데,
 * 이제 티어 오름차순 → 같은 티어면 라벨 알파벳(로케일 비교)순으로 재정렬. `.sort()`는
 * 배열을 제자리에서 바꾸므로 `SIDEBAR_GROUPS`(아래에서 이 배열을 참조)에도 그대로
 * 반영됨 — 별도 복사본을 안 만듦. 티어 정보가 없는 항목(TIER_BY_ID에 없는 id)은
 * 맨 뒤로 보냄(`?? 99`).
 * 2026-08-04 — `label`이 전부 한국어로 바뀌면서(담당자 요청, 아래 TOC_LINKS 주석 참고)
 * 비교 로케일도 "en"에서 "ko"로 변경(가나다순 비교가 정확해짐). 라벨이 바뀌었으니
 * 정렬 결과 순서도 달라져서, Components 물리 섹션 순서도 다시 스크립트로 재동기화함.
 */
COMPONENT_NODES.sort((a, b) => {
  const tierA = TIER_BY_ID[firstIdOfNode(a)] ?? 99;
  const tierB = TIER_BY_ID[firstIdOfNode(b)] ?? 99;
  if (tierA !== tierB) return tierA - tierB;
  return a.label.localeCompare(b.label, "ko");
});

/** 사이드바 그룹과 1:1 매칭되는 최상단 탭. `firstId`는 그 그룹의 첫 섹션으로 스크롤 이동. */
export const TOP_NAV: { key: string; label: string; firstId?: string }[] = [
  { key: "foundations", label: "Foundations", firstId: firstIdOfNode(FOUNDATION_NODES[0]) },
  { key: "components", label: "Components", firstId: firstIdOfNode(COMPONENT_NODES[0]) },
  // 2026-07-31 신규 — AGENTS.md에 기록된 3층 구조(1층 토큰=Foundations, 2층
  // 컴포넌트=Components, 3층 합성 패턴 카탈로그)의 3층에 해당. 지금까지 코드/문서
  // 둘 다 없어서 firstId 없이 비활성 상태로만 자리를 잡아뒀는데(클릭 불가),
  // 2026-08-05 실제 콘텐츠(PATTERN_NODES)가 생겨서 firstId를 채워 활성화.
  { key: "patterns", label: "Patterns", firstId: firstIdOfNode(PATTERN_NODES[0]) },
  { key: "mobile", label: "Mobile", firstId: firstIdOfNode(MOBILE_NODES[0]) },
  { key: "generated-screens", label: "Generated Screens", firstId: firstIdOfNode(GENERATED_SCREEN_NODES[0]) },
  { key: "experimental", label: "Experimental", firstId: firstIdOfNode(EXPERIMENTAL_NODES[0]) },
];

/** Foundation 섹션 id 집합(8개, 2026-08-03 아이콘·Grid/Container 재분류로 6→8) — 상단
 *  탭 활성 표시를 스크롤 위치(activeId)와 연동할 때 씀. `FOUNDATION_ID_LIST`와 동일 소스. */
export const FOUNDATION_IDS = new Set(FOUNDATION_ID_LIST);
/** 2026-08-05 신규 — Patterns id 집합. FOUNDATION_IDS와 같은 방식(idToHref 판별용). */
export const PATTERN_IDS = new Set(PATTERN_ID_LIST);
export const MOBILE_IDS = new Set(MOBILE_ID_LIST);
export const GENERATED_SCREEN_IDS = new Set(GENERATED_SCREEN_ID_LIST);
export const EXPERIMENTAL_IDS = new Set(EXPERIMENTAL_ID_LIST);

/**
 * 2026-08-04 신규 — "한 페이지에 스크롤 개길게 하지 말고 분할하자, 브레드크럼으로"
 * 요청 반영: 한 페이지 전체 스크롤 방식에서 실제 라우팅(/foundations/xxx,
 * /components/xxx)으로 전환. id 하나가 Foundations/Components/Patterns 어느
 * 그룹인지에 따라 URL을 결정하는 헬퍼 — 사이드바/검색/상단탭 등 내부 링크 전부
 * 여기를 거침. 2026-08-05 — Patterns 추가되면서 이진 판별에서 3분기로 확장.
 */
export function idToHref(id: string): string {
  if (FOUNDATION_IDS.has(id)) return `/foundations/${id}`;
  if (PATTERN_IDS.has(id)) return `/patterns/${id}`;
  if (MOBILE_IDS.has(id)) return `/mobile/${id}`;
  if (GENERATED_SCREEN_IDS.has(id)) return "/generated-screens";
  if (EXPERIMENTAL_IDS.has(id)) return `/experimental/${id}`;
  return `/components/${id}`;
}

/**
 * 2026-08-04 신규 — 브레드크럼(Home > Foundations/Components > (그룹명) > 현재 항목)
 * 렌더링용 역참조 맵. SIDEBAR_GROUPS를 한 번 순회해 id → 그룹/상위분류/라벨 정보를
 * 미리 만들어둠(정렬 순서와 무관 — 단순 조회용 맵이라 COMPONENT_NODES.sort() 전에
 * 만들어도 안전). 2026-08-05 — Patterns 그룹 추가.
 */
export type BreadcrumbInfo = {
  group: "foundations" | "components" | "patterns" | "mobile" | "generated-screens" | "experimental";
  groupLabel: string;
  branch?: { label: string; labelEn?: string };
  label: string;
  labelEn?: string;
};
export const BREADCRUMB_MAP: Record<string, BreadcrumbInfo> = {};
for (const group of SIDEBAR_GROUPS) {
  if (group.title !== "Foundations" && group.title !== "Components" && group.title !== "Patterns" && group.title !== "Mobile" && group.title !== "Generated Screens" && group.title !== "Experimental")
    continue;
  const groupKey: "foundations" | "components" | "patterns" | "mobile" | "generated-screens" | "experimental" =
    group.title === "Foundations"
      ? "foundations"
      : group.title === "Components"
        ? "components"
        : group.title === "Patterns"
          ? "patterns"
          : group.title === "Mobile"
            ? "mobile"
          : group.title === "Generated Screens"
            ? "generated-screens"
            : "experimental";
  for (const node of group.nodes) {
    if (node.kind === "leaf") {
      BREADCRUMB_MAP[node.id] = {
        group: groupKey,
        groupLabel: group.title,
        label: node.label,
        labelEn: node.labelEn,
      };
    } else {
      for (const child of node.children) {
        BREADCRUMB_MAP[child.id] = {
          group: groupKey,
          groupLabel: group.title,
          branch: { label: node.label, labelEn: node.labelEn },
          label: child.label,
          labelEn: child.labelEn,
        };
      }
    }
  }
}

/**
 * 2026-08-03 신규 — 담당자 정정: "검색어 입력하면 좌측이 필터링되는 게 아니라, 좌측
 * 리스트는 그대로 있고 검색창 아래에 컴포넌트 리스트가 콤보박스처럼 떠야지". 처음엔
 * 사이드바 자체를 필터링했는데, 그게 아니라 검색창 밑에 결과 드롭다운을 띄우는
 * 방식으로 정정 — 사이드바는 항상 전체 목록 그대로 두고 안 건드림. 검색 대상은
 * leaf 항목 + branch의 하위 항목(예: "Button 사이즈")을 전부 평탄화한 목록.
 */
export function flattenSidebarNodes(
  nodes: SidebarNode[]
): { id: string; label: string; labelEn?: string }[] {
  return nodes.flatMap((n) =>
    n.kind === "leaf" ? [{ id: n.id, label: n.label, labelEn: n.labelEn }] : n.children
  );
}
export const ALL_SEARCHABLE_ITEMS = [
  ...flattenSidebarNodes(FOUNDATION_NODES),
  ...flattenSidebarNodes(COMPONENT_NODES),
  ...flattenSidebarNodes(PATTERN_NODES),
  ...flattenSidebarNodes(MOBILE_NODES),
  ...flattenSidebarNodes(GENERATED_SCREEN_NODES),
  ...flattenSidebarNodes(EXPERIMENTAL_NODES),
];
