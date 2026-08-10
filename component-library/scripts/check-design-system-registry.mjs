import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const root = process.cwd();
const registryDirectory = join(root, "src", "design-system", "registry");
const readJson = (name) => JSON.parse(readFileSync(join(registryDirectory, name), "utf8"));

const componentRegistry = readJson("components.json");
const patternRegistry = readJson("patterns.json");
const screenRegistry = readJson("screens.json");
const visualRegistry = readJson("visual-regression.json");
const errors = [];

function checkVersion(name, registry) {
  if (registry.schemaVersion !== 1) errors.push(`${name}: schemaVersion은 1이어야 합니다.`);
}

function mapByUniqueId(name, entries) {
  const map = new Map();
  for (const entry of entries) {
    if (!entry.id) {
      errors.push(`${name}: id가 없는 항목이 있습니다.`);
      continue;
    }
    if (map.has(entry.id)) errors.push(`${name}: 중복 id '${entry.id}'`);
    map.set(entry.id, entry);
  }
  return map;
}

function checkSource(name, entry) {
  if (!entry.source || !existsSync(join(root, entry.source))) {
    errors.push(`${name} '${entry.id}': source '${entry.source ?? ""}'가 존재하지 않습니다.`);
  }
}

checkVersion("components", componentRegistry);
checkVersion("patterns", patternRegistry);
checkVersion("screens", screenRegistry);
checkVersion("visual-regression", visualRegistry);

const components = mapByUniqueId("components", componentRegistry.components ?? []);
const patterns = mapByUniqueId("patterns", patternRegistry.patterns ?? []);
const screens = mapByUniqueId("screens", screenRegistry.screens ?? []);
mapByUniqueId("visual-regression", visualRegistry.cases ?? []);

for (const component of components.values()) checkSource("component", component);
for (const pattern of patterns.values()) {
  checkSource("pattern", pattern);
  for (const componentId of pattern.requiredComponents ?? []) {
    if (!components.has(componentId)) {
      errors.push(`pattern '${pattern.id}': 미등록 component '${componentId}'를 참조합니다.`);
    }
  }
}
for (const screen of screens.values()) {
  checkSource("screen", screen);
  if (!patterns.has(screen.patternId)) {
    errors.push(`screen '${screen.id}': 미등록 pattern '${screen.patternId}'를 참조합니다.`);
  }
}
for (const visualCase of visualRegistry.cases ?? []) {
  if (!visualCase.route?.startsWith("/")) {
    errors.push(`visual case '${visualCase.id}': route는 '/'로 시작해야 합니다.`);
  }
  if (!visualCase.snapshot?.endsWith(".png")) {
    errors.push(`visual case '${visualCase.id}': snapshot은 png 파일이어야 합니다.`);
  }
  if (!visualCase.screenId && !visualCase.patternId) {
    errors.push(`visual case '${visualCase.id}': screenId 또는 patternId가 필요합니다.`);
  }
  if (visualCase.screenId && !screens.has(visualCase.screenId)) {
    errors.push(`visual case '${visualCase.id}': 미등록 screen '${visualCase.screenId}'를 참조합니다.`);
  }
  if (visualCase.patternId && !patterns.has(visualCase.patternId)) {
    errors.push(`visual case '${visualCase.id}': 미등록 pattern '${visualCase.patternId}'를 참조합니다.`);
  }
}

const uiDirectory = join(root, "src", "components", "ui");
const activeUiSources = readdirSync(uiDirectory)
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => relative(root, join(uiDirectory, name)).replaceAll("\\", "/"));
const registeredSources = new Set([...components.values()].map((entry) => entry.source));

for (const source of activeUiSources) {
  if (!registeredSources.has(source)) {
    errors.push(`component registry: 활성 UI 파일 '${source}'가 등록되지 않았습니다.`);
  }
}
for (const component of components.values()) {
  if (component.source.startsWith("src/components/ui/") && !activeUiSources.includes(component.source)) {
    errors.push(`component '${component.id}': 비활성 또는 잘못된 UI source '${component.source}'`);
  }
  if (basename(component.source, ".tsx") !== component.id && !["grid-container", "icon-button", "list", "sticky-header-footer"].includes(component.id)) {
    errors.push(`component '${component.id}': 파일명과 id가 다릅니다 (${component.source}).`);
  }
}

const visualKinds = new Set(
  (visualRegistry.cases ?? []).map((item) => {
    if (item.screenId) return patterns.get(screens.get(item.screenId)?.patternId)?.kind;
    return patterns.get(item.patternId)?.kind;
  })
);
if (!visualKinds.has("popup")) errors.push("visual-regression: 대표 popup case가 필요합니다.");
if (!visualKinds.has("table")) errors.push("visual-regression: 대표 table case가 필요합니다.");

if (errors.length > 0) {
  console.error(["Design system registry check failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
  process.exit(1);
}

console.log(
  `Design system registry check passed: ${components.size} components, ${patterns.size} patterns, ${screens.size} screens, ${visualRegistry.cases.length} visual cases.`
);
