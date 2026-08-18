import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const checklistPath = path.join(root, "docs/UI_컴포넌트_총망라_체크리스트.md");
const outputJsonPath = path.join(
  root,
  "component-library/src/design-system/registry/tier-coverage-audit.json",
);
const outputMarkdownPath = path.join(root, "docs/UI_컴포넌트_티어_정규화.md");
const auditDate = "2026-08-18";

const dispositionLabels = {
  "implemented-foundation": "파운데이션 구현",
  "implemented-component": "컴포넌트 구현",
  "implemented-pattern": "패턴·화면 조합 구현",
  "intentional-composition": "독립 컴포넌트 불필요",
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
    "- Tier 3은 전체 선제 구현 대상이 아니다. 이미 확보된 패턴은 완료로 전환하고, 나머지는 실제 업무 근거가 들어올 때만 승격한다.",
    "- Tier 4는 선택적 확장, Tier 5는 원칙적으로 현재 범위 제외다.",
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
    "| Tier | 전체 | 구현·조합 충족 | 근거 대기 | 범위 제외 |",
    "|---:|---:|---:|---:|---:|",
  ];

  for (const tier of [1, 2, 3, 4, 5]) {
    const row = audit.summary.byTier[tier];
    const satisfied =
      (row["implemented-foundation"] ?? 0) +
      (row["implemented-component"] ?? 0) +
      (row["implemented-pattern"] ?? 0) +
      (row["intentional-composition"] ?? 0);
    lines.push(
      `| ${tier} | ${row.total} | ${satisfied} | ${row["deferred-evidence"] ?? 0} | ${row["excluded-scope"] ?? 0} |`,
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
    "1. `실제 근거 발생 시 검토` 항목은 미완료 구현 목록이 아니라 조건부 후보군이다.",
    "2. 후보가 실제 화면에 등장하면 먼저 기존 컴포넌트·패턴 조합으로 표현 가능한지 판정한다.",
    "3. 표현할 수 없고 반복 가능성이 확인될 때만 새 컴포넌트 또는 섹션 패턴으로 등록한다.",
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
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== expected) {
      throw new Error(
        `${path.relative(root, target)} is stale. Run npm run audit:tier-coverage.`,
      );
    }
  }
  console.log(`Tier coverage audit is current (${items.length} items).`);
}
