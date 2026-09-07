import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { generatedTextMatches } from "./generated-text.mjs";

const root = process.cwd();
const patternDirectory = join(root, "src", "components", "patterns");
const inventoryPath = join(root, "src", "design-system", "registry", "composition-inventory.json");
const mode = process.argv.includes("--write") ? "write" : process.argv.includes("--check") ? "check" : "print";

const normalizePath = (path) => path.replaceAll("\\", "/");
const count = (source, pattern) => [...source.matchAll(pattern)].length;

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "ko"));
}

function extractUiComponents(source) {
  const names = [];
  for (const match of source.matchAll(/import\s+\{([\s\S]*?)\}\s+from\s+"@\/components\/ui\/[^\"]+";/g)) {
    for (const item of match[1].split(",")) {
      const name = item.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[1] ?? item.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0];
      if (/^[A-Z][A-Za-z0-9]*$/.test(name)) names.push(name);
    }
  }
  return unique(names).map((name) => ({ name, jsxCount: count(source, new RegExp(`<${name}\\b`, "g")) })).filter((item) => item.jsxCount > 0);
}

function extractSectionTitles(source) {
  const titles = [];
  for (const tag of ["SectionBand", "SectionHeader", "PatternGroupHeader"]) {
    for (const match of source.matchAll(new RegExp(`<${tag}\\b[^>]*>([^<>{}]+)</${tag}>`, "g"))) {
      const title = match[1].trim();
      if (title) titles.push(title);
    }
    for (const match of source.matchAll(new RegExp(`<${tag}\\b[^>]*(?:title|label)="([^"]+)"[^>]*>`, "g"))) {
      titles.push(match[1].trim());
    }
  }
  return unique(titles);
}

function detectSectionCandidates(source, uiComponents) {
  const names = new Set(uiComponents.map((item) => item.name));
  const candidates = [];
  for (const match of source.matchAll(/data-pattern=["']((?:section|summary)\.[^"']+)["']/g)) candidates.push(match[1]);
  const hasSectionFrame = /<SectionBand\b|<SectionHeader\b|<PatternGroupHeader\b|<section\b/.test(source);
  if (hasSectionFrame && /grid-cols-/.test(source) && (names.has("Input") || names.has("Select") || /<LabeledControl\b|<PatternFieldRow\b/.test(source))) candidates.push("section.form-grid");
  if ((/\baddRow\b|행 추가|항목 추가/.test(source)) && /\brows?\.map\b|\.map\(\(row/.test(source)) candidates.push("section.editable-row-list");
  if (/<QueryToolbar\b/.test(source) || ((names.has("SearchInput") || /<SearchInput\b|<FixtureSearch\b/.test(source)) && /<Filter\b|<FixtureFilter\b|<GroupQuery\b/.test(source))) candidates.push("section.query-toolbar");
  if (/<BulkEditBar\b/.test(source) || (/전체 일괄 변경|일괄 변경/.test(source) && /\bapplyBulk\b|\bapplyBatch\b/.test(source))) candidates.push("section.bulk-edit-bar");
  if (/<MasterDetailSection\b/.test(source) || /data-pattern=["']section\.master-detail-composition["']/.test(source)) candidates.push("section.master-detail-composition");
  if (/<SearchTableSection\b/.test(source) || ((names.has("SearchInput") || /<SearchInput\b|<FixtureSearch\b/.test(source)) && (names.has("Table") || /<FixtureTable\b|<Table\b/.test(source)))) candidates.push("section.search-table-composition");
  if (/검사항목|inspection/i.test(source) && /IconQa|QaToggle|Inspection|판정/.test(source)) candidates.push("section.inspection-items");
  if (/before-after|변경 전|변경 후|기존 정보|변경 정보/i.test(source)) candidates.push("section.before-after");
  if (/합계|총계|summary|total/i.test(source)) candidates.push("section.summary");
  if (/aria-expanded|optionalOpen|접기|펼치기/.test(source)) candidates.push("section.collapsible-form");
  return unique(candidates);
}

function detectBehaviorSignals(source) {
  const signals = [];
  if (/\baddRow\b|\bremoveRow\b|행 추가|행 삭제|항목 추가|항목 삭제/.test(source)) signals.push("row.add-remove");
  if (/previousRow|inherit|계승/.test(source)) signals.push("row.inherit-previous");
  if (/selectedRow|selectedIds|selectedIndex|selection|선택 행/.test(source) && /Input|Select|editor|편집/.test(source)) signals.push("selection.enable-editor");
  if (/master-detail|masterId|selectedMaster|마스터/i.test(source)) signals.push("selection.master-detail");
  if (/onCancel|restoreCommitted|restoreSnapshot|원상복구/.test(source)) signals.push("dismiss.restore-committed");
  if (/indeterminate|groupSelection|toggleGroup|부분선택/.test(source)) signals.push("table.group-selection");
  if (/aria-expanded|setOptionalOpen|접기|펼치기/.test(source)) signals.push("section.toggle-collapse");
  return unique(signals);
}

function classifySource(name) {
  if (name === "easy-mode-receiving-pattern.tsx" || name === "generated-screen-review.tsx") return "generated-candidate";
  if (name.startsWith("exact-") || name === "original-mes-screen-assets.tsx" || name === "source-popup-gallery.tsx") return "evidence";
  if (name.includes("example") || name.includes("gallery") || name.includes("completed-")) return "catalog-or-recipe";
  return "composition-source";
}

function inspectFile(path) {
  const source = readFileSync(path, "utf8");
  const name = basename(path);
  const uiComponents = extractUiComponents(source);
  const shells = ["CenterModal", "SideSlidePanel", "ConfirmDialog"].map((id) => ({ id, count: count(source, new RegExp(`<${id}\\b`, "g")) })).filter((item) => item.count > 0);
  const sectionFrames = {
    sectionBand: count(source, /<SectionBand\b/g),
    sectionHeader: count(source, /<SectionHeader\b/g),
    patternGroupHeader: count(source, /<PatternGroupHeader\b/g),
    nativeSection: count(source, /<section\b/g),
    dividerContainer: count(source, /<(?:div|section)\b[^>]*className="[^"]*\bborder-b\b[^"]*"[^>]*>/g),
    roundedContainer: count(source, /<(?:div|section)\b[^>]*className="[^"]*\brounded(?:-[^\s"]+)?\b[^"]*"[^>]*>/g),
    gray20Container: count(source, /<(?:div|section)\b[^>]*className="[^"]*\bbg-mes-gray-20\b[^"]*"[^>]*>/g),
  };
  const sectionMechanisms = [sectionFrames.sectionBand > 0, sectionFrames.sectionHeader > 0, sectionFrames.patternGroupHeader > 0, sectionFrames.nativeSection > 0].filter(Boolean).length;
  const behaviorSignals = detectBehaviorSignals(source);
  const sectionCandidates = detectSectionCandidates(source, uiComponents);
  return {
    source: normalizePath(relative(root, path)),
    name,
    observedRole: classifySource(name),
    lines: source.split(/\r?\n/).length,
    exportedSymbols: unique([...source.matchAll(/export\s+(?:default\s+)?function\s+([A-Za-z0-9_]+)/g)].map((match) => match[1])),
    shells,
    sectionFrames,
    sectionTitles: extractSectionTitles(source),
    uiComponents,
    stateHookCount: count(source, /React\.useState\b|\buseState\b/g),
    behaviorSignals,
    sectionCandidateSignals: sectionCandidates,
    reviewFlags: unique([
      ...(sectionMechanisms > 1 ? ["mixed-section-frame-mechanisms"] : []),
      ...(sectionFrames.roundedContainer > 0 && sectionCandidates.length > 0 ? ["rounded-wrapper-around-section-candidate"] : []),
      ...(sectionFrames.nativeSection > 0 && sectionFrames.sectionBand === 0 && sectionFrames.sectionHeader === 0 && sectionFrames.patternGroupHeader === 0 ? ["native-section-without-registered-frame"] : []),
      ...(shells.length > 0 && sectionCandidates.length === 0 ? ["shell-without-detected-section-pattern"] : []),
    ]),
  };
}

function aggregateSignals(files, field) {
  const result = new Map();
  for (const file of files) {
    for (const id of file[field]) {
      const current = result.get(id) ?? [];
      current.push(file.source);
      result.set(id, current);
    }
  }
  return [...result.entries()].map(([id, sources]) => ({ id, fileCount: sources.length, sources })).sort((a, b) => b.fileCount - a.fileCount || a.id.localeCompare(b.id));
}

function buildInventory() {
  const registryDirectory = join(root, "src", "design-system", "registry");
  const readRegistry = (name) => JSON.parse(readFileSync(join(registryDirectory, name), "utf8"));
  const sourceAssets = readRegistry("source-assets.json");
  const registeredSources = [
    ...readRegistry("screens.json").screens,
    ...sourceAssets.screens,
    ...readRegistry("patterns.json").patterns.filter((pattern) => pattern.kind === "section-pattern" || pattern.kind === "section-frame"),
    ...sourceAssets.patterns.filter((pattern) => pattern.kind === "section-pattern" || pattern.kind === "section-frame"),
  ].map((entry) => join(root, ...normalizePath(entry.source).split("/")));
  const paths = unique([
    ...readdirSync(patternDirectory).filter((name) => name.endsWith(".tsx")).map((name) => join(patternDirectory, name)),
    ...registeredSources.filter((path) => existsSync(path)),
  ]);
  const files = paths.map(inspectFile);
  const shellCounts = {};
  for (const file of files) for (const shell of file.shells) shellCounts[shell.id] = (shellCounts[shell.id] ?? 0) + shell.count;
  const inventory = {
    schemaVersion: 1,
    policyId: "mes.ai-composition-grammar",
    status: "observed-not-canonical",
    scope: "src/components/patterns/*.tsx + registered screen/section sources",
    summary: {
      scannedFiles: files.length,
      totalLines: files.reduce((sum, file) => sum + file.lines, 0),
      shellInstances: shellCounts,
      filesWithMixedSectionFrames: files.filter((file) => file.reviewFlags.includes("mixed-section-frame-mechanisms")).length,
      filesWithNativeSectionOnly: files.filter((file) => file.reviewFlags.includes("native-section-without-registered-frame")).length,
      filesWithRoundedSectionCandidates: files.filter((file) => file.reviewFlags.includes("rounded-wrapper-around-section-candidate")).length,
    },
    sectionCandidateSignals: aggregateSignals(files, "sectionCandidateSignals"),
    behaviorSignals: aggregateSignals(files, "behaviorSignals"),
    reviewQueue: files.filter((file) => file.reviewFlags.length > 0).map((file) => ({ source: file.source, flags: file.reviewFlags })),
    files,
  };
  const fingerprint = createHash("sha256").update(JSON.stringify(inventory)).digest("hex").slice(0, 16);
  return { ...inventory, fingerprint };
}

const inventory = buildInventory();
const inventoryText = `${JSON.stringify(inventory, null, 2)}\n`;

if (mode === "write") {
  writeFileSync(inventoryPath, inventoryText, "utf8");
  console.log(`Composition inventory updated: ${inventory.summary.scannedFiles} files, ${inventory.summary.totalLines} lines, ${inventory.fingerprint}`);
} else if (mode === "check") {
  const errors = [];
  if (!existsSync(inventoryPath) || !generatedTextMatches(readFileSync(inventoryPath, "utf8"), inventoryText)) errors.push("composition-inventory.json이 현재 패턴 코드와 다릅니다. npm run audit:composition을 실행하세요.");
  if (errors.length) {
    console.error(["Composition inventory check failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
    process.exit(1);
  }
  console.log(`Composition inventory check passed: ${inventory.summary.scannedFiles} files, ${inventory.summary.totalLines} lines, ${inventory.fingerprint}`);
} else {
  console.log(JSON.stringify(inventory.summary, null, 2));
}
