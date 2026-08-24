import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatedTextMatches } from "./generated-text.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const checklistPath = path.join(root, "docs/UI_컴포넌트_총망라_체크리스트.md");
const outputJsonPath = path.join(
  root,
  "component-library/src/design-system/registry/tier-coverage-audit.json",
);
const outputMarkdownPath = path.join(root, "docs/UI_컴포넌트_티어_정규화.md");
const auditDate = "2026-08-20";
const experimentalRegistry = JSON.parse(
  fs.readFileSync(
    path.join(root, "component-library/src/design-system/registry/experimental-candidates.json"),
    "utf8",
  ),
);
const experimentalByChecklistItem = new Map(
  experimentalRegistry.candidates.map((candidate) => [candidate.checklistItem, candidate]),
);

const dispositionLabels = {
  "implemented-foundation": "파운데이션 구현",
  "implemented-component": "컴포넌트 구현",
  "implemented-pattern": "패턴·화면 조합 구현",
  "intentional-composition": "독립 컴포넌트 불필요",
  "experimental-prototype": "격리 실험 후보",
  "deferred-evidence": "실제 근거 발생 시 검토",
  "excluded-scope": "현재 범위 제외",
};

const explicit = new Map();

function set(items, disposition, evidence, note) {
  for (const item of items) {
    explicit.set(item, { disposition, evidence, note });
  }
}

set(
  ["Spacing Scale", "Radius Scale"],
  "implemented-foundation",
  ["component-specific token policy"],
  "전역 배수 하나로 강제하지 않고 원본 실측과 반복값을 컴포넌트별 규칙으로 관리한다.",
);
set(
  ["Icon Set"],
  "implemented-foundation",
  ["src/components/icons", "icon/mes"],
  "실제 SVG 에셋 33종을 코드화했다. 닫힌 아이콘 총집합을 선제 제작하지 않고 실제 원본이 생길 때 추가한다.",
);
set(
  ["Drawer / Sheet"],
  "implemented-component",
  ["side-slide-panel"],
  "MES의 우측 진입형 작업은 범용 Drawer 대신 SideSlidePanel 규칙으로 통일한다.",
);
set(
  ["Bulk Action Toolbar"],
  "implemented-component",
  ["selection-action-bar"],
  "선택 건이 있을 때만 노출되는 MES용 SelectionActionBar로 구현되어 있다.",
);
set(
  ["Backdrop / Dim Overlay"],
  "intentional-composition",
  ["center-modal", "side-slide-panel", "confirm-dialog"],
  "오버레이 셸 내부 책임이다. 독립 Backdrop API는 중복과 오사용을 만들기 때문에 두지 않는다.",
);
set(
  ["Bulk Selection + Action Toolbar Grid"],
  "implemented-pattern",
  ["table", "selection-action-bar", "selection.enable-actions"],
  "Table 선택 상태와 SelectionActionBar의 조합 패턴으로 충족한다.",
);
set(
  ["Data Grid"],
  "intentional-composition",
  ["table", "table.grouped-list", "selection.reveal-inline-editor"],
  "별도 DataGrid를 만들지 않고 Table에 검증된 그룹화·선택·편집 패턴을 조합한다.",
);
set(
  ["Chart"],
  "implemented-component",
  ["analytics-charts", "section.monthly-comparison-chart"],
  "분석 화면의 공통 차트 규격과 월간 비교 패턴이 등록되어 있다.",
);
set(
  ["Split View"],
  "implemented-pattern",
  ["screen.master-detail", "selection.master-detail"],
  "좌우 분할 자체가 아니라 마스터 선택과 상세 갱신의 맥락 패턴으로 관리한다.",
);
set(
  ["Inline Edit", "Row Grouping / Expandable Sub-row"],
  "implemented-pattern",
  ["selection.reveal-inline-editor", "table.grouped-list"],
  "Table 위에 선택·그룹 행 동작 규칙을 조합한다.",
);
set(
  ["Master-Detail Grid (Nested Grid)"],
  "implemented-pattern",
  ["screen.master-detail", "selection.master-detail"],
  "마스터 행 선택과 상세 영역 갱신 규칙으로 구현한다.",
);
set(
  ["Text Link Cell"],
  "intentional-composition",
  ["table", "link"],
  "Table 셀 render slot 안에 Link를 사용한다. 별도 셀 컴포넌트는 만들지 않는다.",
);
set(
  ["Icon Cell"],
  "intentional-composition",
  ["table", "src/components/icons"],
  "Table 셀 render slot과 등록 아이콘을 조합한다.",
);
set(
  ["Cell Status Color Grid"],
  "intentional-composition",
  ["table", "badge", "tag"],
  "상태 의미는 Table 셀에 Badge 또는 Tag를 배치해 표현한다.",
);
set(
  ["Column Resize / Reorder / Show-Hide"],
  "deferred-evidence",
  ["table.column-settings"],
  "Show/Hide는 구현됐지만 Resize/Reorder는 검증된 원본과 업무 요구가 없어 묶음 전체를 완료 처리하지 않는다.",
);
set(
  ["Work Order Form"],
  "implemented-pattern",
  ["batch-work-order", "section.form-grid"],
  "작업지시 화면과 공통 FormGrid 조합으로 충족한다.",
);
set(
  ["검사 판정 버튼 (○/△/✕/-)"],
  "implemented-component",
  ["inspection-judgement"],
  "MES 검사 판정 전용 컴포넌트가 등록되어 있다.",
);
set(
  ["Copy Button"],
  "intentional-composition",
  ["button", "icon-copy"],
  "Button 또는 IconButton에 복사 아이콘과 동작을 결합한다.",
);
set(
  ["Burger (Hamburger Menu)"],
  "intentional-composition",
  ["icon-button", "icon-menu"],
  "IconButton과 실제 MES 메뉴 아이콘의 조합이다.",
);
set(
  ["Status Indicator (Dot)", "Severity Level Tag"],
  "intentional-composition",
  ["badge", "tag"],
  "새 원시 컴포넌트보다 기존 상태 표현 컴포넌트의 variant로 해결한다.",
);
set(
  ["Alarm Acknowledge Button"],
  "intentional-composition",
  ["button", "alarm-list-item"],
  "알람 행의 업무 액션으로 Button을 배치한다.",
);
set(
  ["Lot Progress Bar"],
  "intentional-composition",
  ["progress"],
  "기존 Progress에 LOT 문맥의 라벨과 값을 전달한다.",
);
set(
  ["Defect Type Tag/Selector"],
  "intentional-composition",
  ["tag", "select"],
  "표시는 Tag, 변경은 Select를 사용한다.",
);
set(
  ["Downtime Reason Selector"],
  "intentional-composition",
  ["select"],
  "비가동 사유는 독립 컴포넌트가 아니라 기존 Select에 업무별 사유 옵션을 주입하는 사용 사례다.",
);
set(
  ["Lot/Serial Search"],
  "intentional-composition",
  ["search-input", "combobox"],
  "검색어 입력과 후보 선택을 기존 입력 컴포넌트로 조합한다.",
);
set(
  ["Disclosure Panel"],
  "intentional-composition",
  ["accordion", "collapsible"],
  "동일 동작을 Accordion 또는 Collapsible로 해결한다.",
);

const reclassifiedCompositions = [
  { items: ["Approval Workflow Stepper"], evidence: ["workflow.stepper", "badge"], note: "결재라는 업무명만 추가된 Stepper 사용 사례이므로 별도 패턴을 만들지 않는다." },
  { items: ["Attachment List", "File", "Document Version History"], evidence: ["list", "button"], note: "목록 행과 파일·이력 데이터, 행 동작의 조합이며 별도 UI 해부 구조가 없다." },
  { items: ["Settings List"], evidence: ["list", "switch", "select"], note: "설정 데이터 목록에 기존 Switch와 Select를 배치하는 사용 사례다." },
  { items: ["Result Page", "Empty Illustration"], evidence: ["empty-state", "descriptions", "button"], note: "결과·빈 상태 콘텐츠만 달라지는 기존 피드백 자산 조합이다." },
  { items: ["Footer"], evidence: ["grid-container", "link"], note: "페이지 하단 레이아웃과 Link 조합이며 독립 MES 패턴 근거가 없다." },
  { items: ["Real-time Update Indicator (Grid)"], evidence: ["table", "badge"], note: "갱신 상태는 Table 주변에 Badge를 배치하는 상태 표현이다." },
  { items: ["Equipment Status Card/Tile", "Inventory Level Indicator"], evidence: ["card", "badge", "progress"], note: "설비·재고라는 데이터 이름만 다르고 기존 Card·Badge·Progress 구조를 그대로 사용한다." },
  { items: ["OEE Dashboard Widget", "Real-time Trend Chart"], evidence: ["analytics-charts", "card", "progress"], note: "OEE·실시간이라는 업무 데이터만 추가된 기존 분석 차트와 요약 카드 조합이다." },
  { items: ["Blinking Alarm Indicator"], evidence: ["alarm-list-item", "badge"], note: "알람 표시 자산의 상태·모션 확장 문제이며 별도 컴포넌트가 아니다." },
  { items: ["Routing/BOM Tree", "Genealogy Tree"], evidence: ["tree-view", "badge"], note: "BOM·계보 데이터가 들어간 TreeView 사용 사례로 통합한다." },
  { items: ["Equipment Detail Card"], evidence: ["card", "descriptions", "badge"], note: "설비 상세 데이터의 Card·Descriptions·Badge 조합이다." },
  { items: ["Chip Selector", "Suggestion Chip"], evidence: ["toggle-button", "tag"], note: "칩 모양의 선택은 ToggleButton과 Tag 표현으로 해결한다." },
  { items: ["Back to Top", "Floating Action Button (FAB)"], evidence: ["button"], note: "위치와 클릭 후 동작이 다른 Button 사용 사례이며 별도 컴포넌트가 아니다." },
  { items: ["AI Prompt Input Box", "Feedback Widget"], evidence: ["textarea", "button"], note: "입력 목적만 다르고 기존 Textarea와 Button 조합으로 충족한다." },
  { items: ["Comment / Activity Feed"], evidence: ["list", "timeline"], note: "활동 데이터가 들어간 List 또는 Timeline 사용 사례로 통합한다." },
  { items: ["Global Top Loading Bar"], evidence: ["progress"], note: "페이지 상단에 배치한 Progress 상태 표현이다." },
  { items: ["Kbd (Keyboard Key)", "Blockquote"], evidence: ["typography"], note: "HTML 의미 요소와 타이포그래피 토큰으로 해결되는 콘텐츠 표현이다." },
  { items: ["Aspect Ratio"], evidence: ["grid-container", "css.aspect-ratio"], note: "레이아웃 CSS 제약이며 독립 UI 자산으로 취급하지 않는다." },
  { items: ["Spoiler (더보기/접기 텍스트)"], evidence: ["collapsible", "button"], note: "기존 Collapsible의 텍스트 콘텐츠 사용 사례다." },
  { items: ["Full-screen Modal"], evidence: ["center-modal"], note: "전체 화면 크기는 CenterModal의 크기·레이아웃 확장 문제이며 별도 팝업 패턴이 아니다." },
  { items: ["Utilization Heatmap"], evidence: ["section.measurement-heatmap-analysis", "analytics-charts"], note: "기존 히트맵 분석 섹션에 가동률 데이터를 주입하는 사용 사례다." },
  { items: ["Escalation Timeline"], evidence: ["timeline", "badge"], note: "에스컬레이션 데이터가 들어간 Timeline 사용 사례다." },
  { items: ["Sampling Plan Table", "PM Checklist", "Onboarding Checklist"], evidence: ["table", "checkbox", "progress"], note: "업무 데이터가 들어간 Table·Checkbox·Progress 조합이며 독립 패턴 해부 구조가 없다." },
  { items: ["Command Palette"], evidence: ["experimental.global-search", "search-input"], note: "명령이라는 콘텐츠만 다른 전역 검색 오버레이 사용 사례로 통합한다." },
  { items: ["Avatar Group"], evidence: ["experimental.avatar", "button"], note: "Avatar 반복과 초과 인원 Button 조합이다." },
  { items: ["Streaming Text Indicator"], evidence: ["typography", "loading-spinner"], note: "텍스트 출력 상태를 나타내는 타이포그래피·로딩 표현이다." },
  { items: ["Source / Citation Badge"], evidence: ["badge", "popover", "button"], note: "출처 데이터가 들어간 Badge와 Popover 조합이다." },
  { items: ["Cookie Consent Banner", "Upgrade / Paywall Prompt"], evidence: ["notice-banner", "button"], note: "안내 내용과 후속 동작만 달라지는 NoticeBanner와 Button 조합이다." },
  { items: ["Dark Mode Toggle"], evidence: ["toggle-button", "semantic-tokens"], note: "테마 전환은 ToggleButton과 토큰 모드 정책의 조합이다." },
  { items: ["Language / Locale Selector"], evidence: ["select"], note: "언어 목록을 제공하는 기존 Select 사용 사례다." },
];

for (const classification of reclassifiedCompositions) {
  set(classification.items, "intentional-composition", classification.evidence, classification.note);
}

set(
  ["Slider (Range)", "File Upload / Dropzone", "Timeline", "Tree View", "Cascader", "Tree Select", "Image / Thumbnail", "Search Highlight Text"],
  "implemented-component",
  ["tier3-user-review-2026-08-19", "components registry/code"],
  "사용자 승인으로 표준 레지스트리에 승격했으며 실제 원본·업무 검증 전까지 provisional로 관리한다.",
);
set(
  ["Stepper / Wizard", "Transfer (Dual List)", "Row Expand / Detail Drawer", "Frozen Column Grid", "Grouped Header Grid"],
  "implemented-pattern",
  ["tier3-user-review-2026-08-19", "patterns registry/code"],
  "사용자 승인으로 표준 레지스트리에 승격했으며 실제 원본·업무 검증 전까지 provisional로 관리한다.",
);
set(
  ["Segmented Control", "Avatar", "Progress Circle", "Overflow List (\"+N more\")"],
  "implemented-component",
  ["tier4-user-review-2026-08-19", "components registry/code"],
  "사용자 승인에 따라 Experimental 후보가 아닌 정식 provisional 컴포넌트로 승격했다.",
);
set(
  ["Process Flow Diagram", "Production Gantt Chart"],
  "implemented-pattern",
  ["tier4-user-review-2026-08-19", "patterns registry/code"],
  "사용자 승인에 따라 Experimental 후보가 아닌 정식 provisional 패턴으로 승격했다.",
);
set(
  ["Onboarding Tooltip / Product Tour"],
  "implemented-pattern",
  ["tier5-user-review-2026-08-19", "patterns registry/code"],
  "사용자 승인에 따라 정식 provisional 온보딩 패턴으로 승격했다.",
);
set(
  ["QR Code", "Mask Input", "Global Search / Search Overlay", "Resizable Panel", "Resizable / Draggable Popup", "Column Resize / Reorder / Show-Hide", "Virtual Scroll Grid", "Andon Board (설비 상태판)", "Real-time Gauge/Meter", "SPC Control Chart"],
  "excluded-scope",
  ["tier3-user-review-2026-08-19"],
  "사용자 제외 판정에 따라 실험 레지스트리와 프로토타입 코드에서 제거했다.",
);
set(
  ["Command Palette"],
  "deferred-evidence",
  ["tier3-user-review-2026-08-19"],
  "기반이던 전체 검색 후보가 제외되어 실제 업무 근거가 생길 때 별도 검토한다.",
);
set(
  ["Breakpoint Scale", "Split Button", "OTP / PIN Input", "Rich Text Editor", "Context Menu", "Chat Bubble / Message", "Drag Handle / Sortable List", "Kanban Board", "Work Order Kanban", "Anchor / Scroll Spy", "Factory Layout View", "Shift Schedule Calendar", "Maintenance Schedule Calendar", "Defect Pareto Chart", "Label Print Preview", "E-signature Pad", "Skip Link", "Visually Hidden"],
  "excluded-scope",
  ["tier4-user-review-2026-08-19"],
  "사용자 제외 판정에 따라 실험 레지스트리와 프로토타입 코드에서 제거했다.",
);
set(
  ["Rating (별점)", "Color Picker", "Carousel", "Video Player", "Code Block", "Markdown Renderer", "Mentions", "Watermark", "Masonry Grid", "Marquee", "Warehouse Location Map", "Live Chat Widget"],
  "excluded-scope",
  ["tier5-user-review-2026-08-19"],
  "사용자 제외 판정에 따라 실험 레지스트리와 프로토타입 코드에서 제거했다.",
);

set(
  ["Pricing Table", "Hero"],
  "excluded-scope",
  ["desktop MES scope policy"],
  "마케팅·요금제 화면 템플릿은 현재 MES 업무 UI 자동 생성 범위에서 제외한다.",
);

const excludedTier4 = new Set([
  "Split Button",
  "Segmented Control",
  "Chip Selector",
  "OTP / PIN Input",
  "Rich Text Editor",
  "Back to Top",
  "Avatar",
  "Progress Circle",
  "Empty Illustration",
  "Chat Bubble / Message",
  "AI Prompt Input Box",
  "Drag Handle / Sortable List",
  "Comment / Activity Feed",
  "Kanban Board",
  "Global Top Loading Bar",
  "Kbd (Keyboard Key)",
  "Aspect Ratio",
  "Anchor / Scroll Spy",
  "Overflow List (\"+N more\")",
  "Spoiler (더보기/접기 텍스트)",
]);

function parseChecklist(markdown) {
  const rows = [];
  const rowPattern = /^\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*(있음|부분|없음)\s*\|\s*([1-5])\s*\|\s*([^|]*?)\s*\|$/;

  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(rowPattern);
    if (!match) continue;
    rows.push({
      item: match[1].trim(),
      description: match[2].trim(),
      layer: match[3].trim(),
      sourceStatus: match[4],
      tier: Number(match[5]),
      sourceNote: match[6].trim(),
    });
  }
  return rows;
}

function classify(row) {
  const experimental = experimentalByChecklistItem.get(row.item);
  if (experimental) {
    return {
      disposition: "experimental-prototype",
      evidence: [experimental.id, experimental.source],
      note: "기본 상호작용이 있는 임시 프로토타입으로 구현했으며 실제 원본 승인 전까지 표준 AI 선택에서 격리한다.",
    };
  }
  const override = explicit.get(row.item);
  if (override) return override;

  if (row.sourceStatus === "있음") {
    if (row.layer === "토큰") {
      return {
        disposition: "implemented-foundation",
        evidence: ["legacy-checklist", "globals.css"],
        note: "기존 실측·구현 기록을 현재 파운데이션 근거로 유지한다.",
      };
    }
    if (row.layer === "템플릿") {
      return {
        disposition: "implemented-pattern",
        evidence: ["legacy-checklist", "patterns/screens registry"],
        note: "화면 단독 자산이 아니라 재사용 가능한 조합 근거로 유지한다.",
      };
    }
    return {
      disposition: "implemented-component",
      evidence: ["legacy-checklist", "components registry/code"],
      note: "기존 구현 기록과 현재 컴포넌트 코드를 근거로 충족 처리한다.",
    };
  }

  if (row.tier === 5) {
    return {
      disposition: "excluded-scope",
      evidence: ["desktop MES scope policy"],
      note: "현재 산업용 데스크톱 MES 자동 생성 목표와 직접 관련이 없어 선제 구현하지 않는다.",
    };
  }

  if (row.tier === 4 && excludedTier4.has(row.item)) {
    return {
      disposition: "excluded-scope",
      evidence: ["desktop MES scope policy"],
      note: "대체 가능한 기존 자산이 있거나 현재 업무 우선순위가 낮아 범위에서 제외한다.",
    };
  }

  return {
    disposition: "deferred-evidence",
    evidence: [],
    note: "실제 MES 화면, 업무 명세 또는 반복 사용 근거가 확인될 때 패턴 적합성을 먼저 판정한다.",
  };
}

function summarize(items) {
  const byTier = {};
  const byDisposition = {};
  for (const item of items) {
    byTier[item.tier] ??= { total: 0 };
    byTier[item.tier].total += 1;
    byTier[item.tier][item.disposition] =
      (byTier[item.tier][item.disposition] ?? 0) + 1;
    byDisposition[item.disposition] = (byDisposition[item.disposition] ?? 0) + 1;
  }
  return { total: items.length, byTier, byDisposition };
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function renderMarkdown(audit) {
  const lines = [
    "# UI 컴포넌트 티어 정규화",
    "",
    `기준일: ${audit.auditDate}`,
    "",
    "이 문서는 최초 피그마 조사 시점의 `있음/부분/없음` 기록을 현재 코드 구조와 대조한 판정표다. 원본 체크리스트의 `없음`은 곧바로 ‘새 컴포넌트를 만들어야 함’을 뜻하지 않는다. 기존 컴포넌트의 조합으로 해결되는지, 현재 MES 범위에서 필요한지, 실제 업무·원본 근거가 있는지를 먼저 판정한다.",
    "",
    "## 현재 결론",
    "",
    "- Tier 1·2는 현재 데스크톱 MES 화면 생성 기반을 막는 미충족 항목이 없다.",
    "- 107개로 시작한 격리 후보를 전수 재분류해, 기존 자산 사용 사례 48개와 MES 범위 제외 템플릿 2개를 후보에서 제거했다.",
    "- 2026-08-20 사용자 정정에 따라 제외하지 않은 Tier 3~5 자산 20개를 정식 provisional 컴포넌트·패턴으로 승격했다. 현재 격리 후보는 0개이며 37개는 제외 상태다.",
    "- `provisional`은 Experimental 후보가 아니라 정식 레지스트리의 안정화 상태다. 실제 원본·업무 검증이 추가되면 stable 여부를 별도로 판정한다.",
    "- 새로운 전체 화면은 커버리지 숫자를 늘리기 위해 추가하지 않는다. 기존 조합 문법으로 설명되지 않는 실제 화면이 나타날 때만 근거로 사용한다.",
    "",
    "## 판정 기준",
    "",
    "| 판정 | 의미 |",
    "|---|---|",
    ...Object.entries(dispositionLabels).map(
      ([key, label]) => `| ${label} | \`${key}\` |`,
    ),
    "",
    "## 티어별 요약",
    "",
    "| Tier | 전체 | 구현·조합 충족 | 격리 실험 후보 | 근거 대기 | 범위 제외 |",
    "|---:|---:|---:|---:|---:|---:|",
  ];

  for (const tier of [1, 2, 3, 4, 5]) {
    const row = audit.summary.byTier[tier];
    const satisfied =
      (row["implemented-foundation"] ?? 0) +
      (row["implemented-component"] ?? 0) +
      (row["implemented-pattern"] ?? 0) +
      (row["intentional-composition"] ?? 0);
    lines.push(
      `| ${tier} | ${row.total} | ${satisfied} | ${row["experimental-prototype"] ?? 0} | ${row["deferred-evidence"] ?? 0} | ${row["excluded-scope"] ?? 0} |`,
    );
  }

  for (const tier of [1, 2, 3, 4, 5]) {
    lines.push(
      "",
      `## Tier ${tier}`,
      "",
      "| 항목 | 최초 상태 | 현재 판정 | 근거 | 비고 |",
      "|---|---|---|---|---|",
    );
    for (const item of audit.items.filter((entry) => entry.tier === tier)) {
      lines.push(
        `| ${escapeCell(item.item)} | ${item.sourceStatus} | ${dispositionLabels[item.disposition]} | ${escapeCell(item.evidence.join(", ") || "-")} | ${escapeCell(item.note)} |`,
      );
    }
  }

  lines.push(
    "",
    "## 운영 규칙",
    "",
    "1. `격리 실험 후보`는 비교·판단을 위한 임시 코드이며 표준 AI 화면 생성에서 자동 선택하지 않는다.",
    "2. 후보가 실제 화면에 등장하면 먼저 기존 표준 컴포넌트·패턴 조합으로 표현 가능한지 판정한다.",
    "3. 기존 표준으로 표현할 수 없고 반복 가능성이 확인되며 사용자 승인을 받은 경우에만 새 컴포넌트 또는 섹션 패턴으로 등록한다.",
    "4. 단일 화면 구현은 패턴 증거가 될 수 있지만, 화면 수 자체는 디자인 시스템 완성도의 지표로 사용하지 않는다.",
    "5. 모바일은 별도 체크리스트와 별도 구현 트랙으로 관리한다.",
    "",
    "이 파일은 `npm run audit:tier-coverage`로 갱신하고 `npm run check:tier-coverage`로 최신 상태를 검증한다.",
    "",
  );
  return lines.join("\n");
}

const source = fs.readFileSync(checklistPath, "utf8");
const parsed = parseChecklist(source);
if (parsed.length !== 216) {
  throw new Error(`Expected 216 checklist rows, found ${parsed.length}`);
}

const items = parsed.map((row) => ({
  item: row.item,
  layer: row.layer,
  sourceStatus: row.sourceStatus,
  tier: row.tier,
  ...classify(row),
}));
const audit = {
  schemaVersion: 1,
  auditDate,
  source: "docs/UI_컴포넌트_총망라_체크리스트.md",
  policy: {
    currentGoal: "desktop MES AI screen generation",
    tier1And2BlockingGaps: 0,
    addScreensForCoverage: false,
    mobileTrackedSeparately: true,
  },
  summary: summarize(items),
  items,
};

const jsonOutput = `${JSON.stringify(audit, null, 2)}\n`;
const markdownOutput = `${renderMarkdown(audit)}\n`;
const write = process.argv.includes("--write");

if (write) {
  fs.writeFileSync(outputJsonPath, jsonOutput, "utf8");
  fs.writeFileSync(outputMarkdownPath, markdownOutput, "utf8");
  console.log(`Wrote ${path.relative(root, outputJsonPath)}`);
  console.log(`Wrote ${path.relative(root, outputMarkdownPath)}`);
} else {
  for (const [target, expected] of [
    [outputJsonPath, jsonOutput],
    [outputMarkdownPath, markdownOutput],
  ]) {
    if (!fs.existsSync(target) || !generatedTextMatches(fs.readFileSync(target, "utf8"), expected)) {
      throw new Error(
        `${path.relative(root, target)} is stale. Run npm run audit:tier-coverage.`,
      );
    }
  }
  console.log(`Tier coverage audit is current (${items.length} items).`);
}
