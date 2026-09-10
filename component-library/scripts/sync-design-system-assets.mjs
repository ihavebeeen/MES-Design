import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatedTextMatches, normalizeLineEndings } from "./generated-text.mjs";
import { readRegistryBundle } from "./resolve-screen-request.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const registryDirectory = path.join(projectRoot, "src", "design-system", "registry");
const manifestPath = path.join(registryDirectory, "asset-manifest.json");
const docsDirectory = path.join(repositoryRoot, "docs", "components");
const docsIndexPath = path.join(docsDirectory, "README.md");
const readmePath = path.join(repositoryRoot, "README.md");
const readmeStart = "<!-- GENERATED:ASSET-SUMMARY:START -->";
const readmeEnd = "<!-- GENERATED:ASSET-SUMMARY:END -->";

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(registryDirectory, fileName), "utf8"));
}

function hash(value) {
  return createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function firstSentence(value) {
  const clean = String(value ?? "").replace(/`/g, "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const match = clean.match(/^(.+?[.!?。]|.+?$)/);
  return (match?.[1] ?? clean).slice(0, 180);
}

function extractSizeValues(source) {
  const values = [];
  for (const match of source.matchAll(/\bsize\??:\s*((?:"[^"]+"\s*\|\s*)*"[^"]+")/g)) {
    values.push(...[...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
  }
  for (const match of source.matchAll(/\bsize:\s*\{\s*([\s\S]*?)\n\s*\},/g)) {
    values.push(...[...match[1].matchAll(/^\s*([A-Za-z][A-Za-z0-9_-]*):/gm)].map((item) => item[1]));
  }
  return unique(values);
}

function sourceFacts(component, readSource) {
  const absolutePath = path.join(projectRoot, component.source);
  if (!fs.existsSync(absolutePath)) throw new Error(`${component.id}: 구현 파일이 없습니다 (${component.source}).`);
  // Git checkout may change line endings without changing the component.
  const source = normalizeLineEndings(readSource(absolutePath));
  const symbols = unique([
    ...[...source.matchAll(/export\s+(?:interface|type|function|class|const)\s+([A-Za-z0-9_]+)/g)].map((match) => match[1]),
    ...[...source.matchAll(/export\s*\{([^}]+)\}/g)].flatMap((match) => match[1].split(",").map((item) => item.trim().split(/\s+as\s+/)[1] ?? item.trim().split(/\s+as\s+/)[0])),
  ]).slice(0, 16);
  const propNames = unique([...source.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9_]*)\??:\s/gm)].map((match) => match[1])).slice(0, 20);
  const stateMarkers = [
    ["disabled", /\bdisabled\b/],
    ["loading", /\bloading\b/],
    ["checked", /\bchecked\b|aria-checked/],
    ["indeterminate", /\bindeterminate\b/],
    ["selected", /\bselected\b|aria-selected/],
    ["open", /\bopen\b|aria-expanded/],
    ["error", /\berror\b|aria-invalid/],
    ["readOnly", /\breadOnly\b/],
    ["pressed", /\bpressed\b|aria-pressed/],
    ["focus", /focus:/],
    ["hover", /hover:/],
  ].filter(([, pattern]) => pattern.test(source)).map(([name]) => name);
  const comments = [...source.matchAll(/\/\*\*([\s\S]*?)\*\//g)]
    .map((match) => match[1].split(/\r?\n/).map((line) => line.replace(/^\s*\*\s?/, "").trim()).filter((line) => line && !line.startsWith("@") && !line.startsWith("──") && !line.startsWith("⚠"))[0])
    .filter(Boolean);
  return {
    sourceFingerprint: hash(source),
    symbols,
    propNames,
    stateMarkers,
    sizeValues: extractSizeValues(source),
    interactive: /<(?:button|input|select|textarea)\b|\bonClick\b|\bonChange\b|\btabIndex\b|\brole\s*=/.test(source),
    summary: firstSentence(comments.find((comment) => !comment.startsWith("MES ")) ?? comments[0]),
    aria: unique([...source.matchAll(/\b(aria-[a-z-]+|role)\s*=/g)].map((match) => match[1])).sort(),
  };
}

function componentStateModel(component, facts, framework) {
  const notApplicable = framework.notApplicableValue;
  const markers = new Set(facts.stateMarkers);
  const props = new Set(facts.propNames);
  const state = ["default"];
  for (const marker of ["loading", "open", "error", "readOnly"]) if (markers.has(marker)) state.push(marker);

  let value = [notApplicable];
  if (markers.has("checked")) value = ["unchecked", "checked", ...(markers.has("indeterminate") ? ["indeterminate"] : [])];
  else if (markers.has("pressed")) value = ["unpressed", "pressed"];
  else if (markers.has("selected")) value = ["unselected", "selected"];
  else if (["value", "defaultValue", "onValueChange", "onChange"].some((prop) => props.has(prop))) value = ["empty", "filled"];

  const interaction = [];
  if (facts.interactive || markers.has("hover") || markers.has("focus")) interaction.push("rest");
  if (markers.has("hover")) interaction.push("hover");
  if (markers.has("focus")) interaction.push("focus");

  const inferred = {
    state,
    value,
    disabled: markers.has("disabled") ? ["false", "true"] : [notApplicable],
    size: facts.sizeValues.length ? facts.sizeValues : [notApplicable],
    interaction: interaction.length ? interaction : [notApplicable],
  };
  const override = framework.componentOverrides?.[component.id] ?? {};
  return Object.fromEntries(framework.dimensionOrder.map((dimension) => [dimension, unique(override[dimension] ?? inferred[dimension])]));
}

const categoryPurpose = {
  action: "사용자가 실행하는 동작을 일관된 의미와 상태로 제공합니다.",
  "data-display": "MES 데이터와 상태를 비교·확인할 수 있는 형태로 표시합니다.",
  feedback: "진행·완료·오류·선택 상태와 다음 행동을 안내합니다.",
  form: "업무 값을 입력하거나 정해진 값을 선택합니다.",
  icon: "MES에서 확인된 벡터 아이콘을 제공합니다.",
  layout: "콘텐츠의 정렬·간격·경계와 영역 책임을 구성합니다.",
  navigation: "제품·메뉴·페이지·계층 사이의 이동을 제공합니다.",
  overlay: "현재 화면 위에서 조회·선택·편집·확인 작업을 수행합니다.",
  system: "다른 공개 컴포넌트 내부에서만 사용하는 조립 단위입니다.",
};

function bulletLines(values, fallback, limit = 4) {
  const items = values?.length ? values.slice(0, limit) : [fallback];
  return items.map((item) => `- ${item}`);
}

function componentDocument(asset) {
  const context = asset.selectionContext;
  const contract = asset.usageContract;
  const sourceSummary = /figma|체크리스트|추후|임시|provisional|디자인 없음|구현 없음|\b20\d{2}\b/i.test(asset.sourceFacts.summary) ? "" : asset.sourceFacts.summary;
  const role = firstSentence(context?.useWhen?.[0]) || firstSentence(asset.rules?.[0]) || sourceSummary || categoryPurpose[asset.category];
  const useWhen = context?.useWhen ?? asset.rules ?? [];
  const doNotUseWhen = context?.doNotUseWhen ?? [];
  const variants = contract?.variants ?? [];
  const accessibility = contract?.accessibility ?? [];
  const constraints = contract?.constraints ?? [];
  const evidence = contract?.evidence ?? [];
  const visibilityLabel = asset.visibility === "public" ? "공개" : "내부 조립용";
  const route = asset.documentationRoute ? `\`${asset.documentationRoute}\`` : "웹 탐색에 노출하지 않음";
  const selectionGuidance = context ? [
    "## 생성 선택 기준",
    "",
    ...bulletLines(useWhen, "등록된 화면·패턴에서 같은 의미가 필요할 때 사용합니다."),
    "",
    "선택하지 않는 경우:",
    ...bulletLines(doNotUseWhen, "역할이 다른 기존 컴포넌트를 선택합니다."),
  ] : [];

  return [
    `# ${asset.name}`,
    "",
    `> \`${asset.id}\` · ${asset.category} · Tier ${asset.tier} · ${asset.status} · ${visibilityLabel}`,
    "",
    "## 역할",
    "",
    role,
    "",
    ...selectionGuidance,
    "",
    "## API와 상태",
    "",
    `- 공개 심볼: ${asset.sourceFacts.symbols.length ? asset.sourceFacts.symbols.map((item) => `\`${item}\``).join(", ") : "없음"}`,
    `- 주요 Props: ${asset.sourceFacts.propNames.length ? asset.sourceFacts.propNames.map((item) => `\`${item}\``).join(", ") : "별도 Props 선언 없음"}`,
    ...Object.entries(asset.stateModel).map(([dimension, values]) => `- ${dimension[0].toUpperCase()}${dimension.slice(1)}: ${values.map((item) => `\`${item}\``).join(", ")}`),
    `- 변형: ${variants.length ? variants.map((item) => `\`${item}\``).join(", ") : "등록된 별도 variant 없음"}`,
    "",
    "다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.",
    "",
    "## 접근성과 제약",
    "",
    ...bulletLines(accessibility, asset.sourceFacts.aria.length ? `구현에 선언된 ${asset.sourceFacts.aria.map((item) => `\`${item}\``).join(", ")} 의미를 제거하지 않습니다.` : "네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.", 3),
    ...bulletLines(constraints, asset.visibility === "internal" ? "화면 코드에서 직접 호출하지 않고 부모 컴포넌트 내부에서만 사용합니다." : "공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.", 3),
    "",
    "## 근거",
    "",
    `- 구현: \`${asset.source}\``,
    `- 웹 문서: ${route}`,
    `- 생성 선택 맥락: ${context ? "적용됨" : "누락"}`,
    `- 상세 선택 계약: ${contract ? "적용됨" : "기본 맥락만 적용"}`,
    `- 참고 화면: ${evidence.length ? evidence.map((item) => `\`${item}\``).join(", ") : "없음"}`,
    `- 참고 화면의 역할: ${evidence.length ? "선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님" : "직접 화면 근거 없이 의미·API 맥락으로 정의"}`,
    "",
    "이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.",
    "",
  ].join("\n");
}

function renderDocsIndex(components) {
  const groups = Object.groupBy(components, (component) => component.visibility === "internal" ? "internal" : component.category);
  const labels = { action: "동작", "data-display": "데이터 표시", feedback: "상태와 피드백", form: "입력과 선택", icon: "아이콘", layout: "레이아웃", navigation: "탐색", overlay: "팝업과 오버레이", system: "시스템", internal: "내부 조립용" };
  const lines = [
    "# 컴포넌트 문서",
    "",
    `공개 ${components.filter((item) => item.visibility === "public").length}개, 내부 조립용 ${components.filter((item) => item.visibility === "internal").length}개를 같은 형식으로 기록한다.`,
    "",
    "상태·Tier·공개 범위는 `components.json`, 모든 신규 UI 선택 맥락과 선택 중요 자산의 상세 계약은 `component-usage-contracts.json`, API는 실제 구현 파일에서 생성한다.",
    "",
  ];
  for (const key of Object.keys(groups).sort()) {
    lines.push(`## ${labels[key] ?? key}`, "");
    for (const item of groups[key].sort((left, right) => left.name.localeCompare(right.name))) {
      lines.push(`- [${item.name}](./${item.id}.md) — Tier ${item.tier}, ${item.status}`);
    }
    lines.push("");
  }
  lines.push("이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.", "");
  return lines.join("\n");
}

function renderReadmeSummary(manifest) {
  return [
    readmeStart,
    `컴포넌트 ${manifest.summary.components.total}종과 화면·팝업을 조합하는 패턴 ${manifest.summary.patterns}종이 등록되어 있습니다.`,
    readmeEnd,
  ].join("\n");
}

function withReadmeSummary(readme, summary) {
  const startIndex = readme.indexOf(readmeStart);
  const endIndex = readme.indexOf(readmeEnd);
  if (startIndex < 0 || endIndex < startIndex) throw new Error("README 자산 요약 생성 구간을 찾지 못했습니다.");
  return `${readme.slice(0, startIndex)}${summary}${readme.slice(endIndex + readmeEnd.length)}`;
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  });
}

export function buildOutputs({ readSource = (filePath) => fs.readFileSync(filePath, "utf8") } = {}) {
  const registry = readRegistryBundle();
  const catalog = readJson("component-catalog.json");
  const componentStateFramework = readJson("component-state-framework.json");
  const selectionFeedback = readJson("generation-selection-feedback.json");
  const contractById = new Map(registry.componentUsageContracts.map((contract) => [contract.componentId, contract]));
  const contextById = new Map(registry.componentSelectionContexts.map((context) => [context.componentId, context]));
  const catalogRegistryIds = new Set(catalog.groups.flatMap((group) => group.itemIds.map((id) => catalog.registryAliases[id] ?? id)));
  const patternsByComponent = new Map();
  for (const pattern of registry.patterns) {
    for (const componentId of pattern.requiredComponents) {
      patternsByComponent.set(componentId, [...(patternsByComponent.get(componentId) ?? []), pattern.id]);
    }
  }
  const screensByPattern = new Map();
  for (const screen of registry.screens) {
    for (const patternId of screen.patternRefs) {
      screensByPattern.set(patternId, [...(screensByPattern.get(patternId) ?? []), screen.id]);
    }
  }

  const components = registry.components.map((component) => {
    if (!component.visibility || !component.tier || !component.documentationMode) throw new Error(`${component.id}: visibility, tier, documentationMode가 필요합니다.`);
    if (component.visibility === "public" && !component.documentationRoute) throw new Error(`${component.id}: 공개 자산에 documentationRoute가 없습니다.`);
    if (component.visibility === "public" && component.documentationMode !== "foundation" && !catalogRegistryIds.has(component.id)) throw new Error(`${component.id}: 공개 컴포넌트가 카탈로그에 없습니다.`);
    if (component.visibility === "internal" && catalogRegistryIds.has(component.id)) throw new Error(`${component.id}: 내부 컴포넌트가 공개 카탈로그에 포함됐습니다.`);
    const facts = sourceFacts(component, readSource);
    return {
      kind: "component",
      ...component,
      documentationFile: `docs/components/${component.id}.md`,
      guidanceMode: contractById.has(component.id) ? "selection-guard" : "selection-context",
      selectionContext: contextById.get(component.id) ?? null,
      usageContract: contractById.get(component.id) ?? null,
      stateModel: componentStateModel(component, facts, componentStateFramework),
      usedByPatternIds: unique(patternsByComponent.get(component.id) ?? []).sort(),
      sourceFacts: facts,
    };
  });

  const patterns = registry.patterns.map((pattern) => ({
    kind: "pattern",
    id: pattern.id,
    name: pattern.name,
    patternKind: pattern.kind,
    placement: pattern.placement ?? null,
    source: pattern.source,
    requiredComponents: pattern.requiredComponents,
    usedByScreenIds: unique(screensByPattern.get(pattern.id) ?? []).sort(),
  }));
  const screens = registry.screens.map((screen) => ({
    kind: "screen",
    id: screen.id,
    name: screen.name,
    source: screen.source,
    figmaNode: screen.figmaNode ?? null,
    patternRefs: screen.patternRefs,
  }));
  const fingerprint = hash({
    components: components.map(({ sourceFacts, selectionContext, usageContract, ...item }) => ({ ...item, sourceFingerprint: sourceFacts.sourceFingerprint, selectionContext, usageContract })),
    patterns,
    screens,
    catalog,
    componentUsagePolicy: registry.componentUsagePolicy,
    componentStateFramework,
    selectionFeedback,
  });
  const manifest = {
    schemaVersion: 1,
    purpose: "AI와 사람이 같은 자산 상태·위치·사용 근거를 조회하는 생성 원장",
    generatedFrom: ["components.json", "component-usage-contracts.json", "component-state-framework.json", "generation-selection-feedback.json", "component-catalog.json", "patterns.json + source-assets.json", "screens.json + source-assets.json"],
    fingerprint,
    guidancePolicy: {
      componentSelection: registry.componentUsagePolicy,
      componentState: {
        frameworkId: componentStateFramework.frameworkId,
        frameworkVersion: componentStateFramework.frameworkVersion,
        dimensionOrder: componentStateFramework.dimensionOrder,
        compositionMode: componentStateFramework.compositionMode,
        cartesianExpansion: componentStateFramework.cartesianExpansion,
        rules: componentStateFramework.rules,
      },
      selectionFeedback: {
        total: selectionFeedback.entries.length,
        observed: selectionFeedback.entries.filter((entry) => entry.status === "observed").length,
        resolved: selectionFeedback.entries.filter((entry) => entry.status === "resolved").length,
        dismissed: selectionFeedback.entries.filter((entry) => entry.status === "dismissed").length
      }
    },
    summary: {
      components: { total: components.length, public: components.filter((item) => item.visibility === "public").length, internal: components.filter((item) => item.visibility === "internal").length, stable: components.filter((item) => item.status === "stable").length, provisional: components.filter((item) => item.status === "provisional").length, selectionContexts: components.filter((item) => item.selectionContext).length, selectionGuardContracts: components.filter((item) => item.usageContract).length },
      patterns: patterns.length,
      screens: screens.length,
    },
    assets: [...components, ...patterns, ...screens],
  };
  return {
    manifest: `${JSON.stringify(manifest, null, 2)}\n`,
    docs: new Map(components.map((component) => [path.join(docsDirectory, `${component.id}.md`), componentDocument(component)])),
    docsIndex: renderDocsIndex(components),
    readme: withReadmeSummary(fs.readFileSync(readmePath, "utf8"), renderReadmeSummary(manifest)),
    components,
  };
}

function staleSourceFiles() {
  return walkFiles(path.join(projectRoot, "src")).filter((filePath) => /\.removed-|\.bak$/i.test(filePath));
}

function main() {
  const mode = process.argv[2];
  const output = buildOutputs();
  const staleFiles = staleSourceFiles();
  if (staleFiles.length) throw new Error(`활성 src에 폐기 파일이 남아 있습니다:\n${staleFiles.join("\n")}`);

  if (mode === "--write") {
    fs.mkdirSync(docsDirectory, { recursive: true });
    fs.writeFileSync(manifestPath, output.manifest, "utf8");
    fs.writeFileSync(docsIndexPath, output.docsIndex, "utf8");
    fs.writeFileSync(readmePath, output.readme, "utf8");
    for (const [filePath, content] of output.docs) fs.writeFileSync(filePath, content, "utf8");
    for (const filePath of fs.readdirSync(docsDirectory).filter((name) => name.endsWith(".md") && name !== "README.md").map((name) => path.join(docsDirectory, name))) {
      if (!output.docs.has(filePath)) fs.rmSync(filePath);
    }
    console.log(`[assets] 원장·문서 갱신 · components ${output.components.length} · public ${output.components.filter((item) => item.visibility === "public").length} · internal ${output.components.filter((item) => item.visibility === "internal").length}`);
  } else if (mode === "--check") {
    const mismatches = [];
    const currentManifest = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : "";
    if (!generatedTextMatches(currentManifest, output.manifest)) mismatches.push(path.relative(repositoryRoot, manifestPath));
    const currentIndex = fs.existsSync(docsIndexPath) ? fs.readFileSync(docsIndexPath, "utf8") : "";
    if (!generatedTextMatches(currentIndex, output.docsIndex)) mismatches.push(path.relative(repositoryRoot, docsIndexPath));
    const currentReadme = fs.readFileSync(readmePath, "utf8");
    if (!generatedTextMatches(currentReadme, output.readme)) mismatches.push(path.relative(repositoryRoot, readmePath));
    for (const [filePath, content] of output.docs) {
      const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
      if (!generatedTextMatches(current, content)) mismatches.push(path.relative(repositoryRoot, filePath));
    }
    const existingDocs = fs.existsSync(docsDirectory) ? fs.readdirSync(docsDirectory).filter((name) => name.endsWith(".md") && name !== "README.md") : [];
    if (existingDocs.length !== output.docs.size) mismatches.push("docs/components (파일 수 불일치)");
    if (mismatches.length) {
      console.error(`자산 원장 또는 컴포넌트 문서가 현재 코드와 다릅니다. npm run sync:assets를 실행하세요.\n- ${mismatches.slice(0, 20).join("\n- ")}`);
      process.exitCode = 1;
    } else {
      console.log(`[assets] 원장·문서 정상 · components ${output.components.length} · docs ${output.docs.size}`);
    }
  } else {
    console.error("사용법: node scripts/sync-design-system-assets.mjs --write|--check");
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
