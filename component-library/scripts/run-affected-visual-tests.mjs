import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readRegistryBundle } from "./resolve-screen-request.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const projectPrefix = "component-library/";
const registryDirectory = path.join(projectRoot, "src", "design-system", "registry");
const args = process.argv.slice(2);
const planOnly = args.includes("--plan");
const full = args.includes("--all");
const installBrowser = args.includes("--install");
const baseIndex = args.indexOf("--base");
const base = baseIndex >= 0 ? args[baseIndex + 1] : null;
const explicitFiles = args.flatMap((value, index) => value === "--file" && args[index + 1] ? [args[index + 1].replaceAll("\\", "/")] : []);

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd ?? repositoryRoot,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowFailure) process.exit(result.status ?? 1);
  return result.stdout?.trim() ?? "";
}

function git(argsToRun, options = {}) {
  return run("git", argsToRun, { capture: true, ...options });
}

function normalizeProjectPath(repositoryPath) {
  const normalized = repositoryPath.replaceAll("\\", "/");
  return normalized.startsWith(projectPrefix) ? normalized.slice(projectPrefix.length) : null;
}

function changedFiles() {
  if (explicitFiles.length > 0) return [...new Set(explicitFiles)].sort();
  const trackedArgs = base
    ? ["diff", "--name-only", "--diff-filter=ACMR", `${base}...HEAD`, "--", "component-library"]
    : ["diff", "--name-only", "--diff-filter=ACMR", "HEAD", "--", "component-library"];
  const tracked = git(trackedArgs).split(/\r?\n/).filter(Boolean);
  const untracked = base ? [] : git(["ls-files", "--others", "--exclude-standard", "component-library"]).split(/\r?\n/).filter(Boolean);
  return [...new Set([...tracked, ...untracked].map(normalizeProjectPath).filter(Boolean))].sort();
}

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(registryDirectory, fileName), "utf8"));
}

function parseVisualTestNames() {
  const files = [
    path.join(projectRoot, "tests", "visual", "design-system.visual.spec.ts"),
    path.join(projectRoot, "tests", "visual", "mobile-design-system.spec.ts"),
  ];
  const bySnapshot = new Map();
  for (const filePath of files) {
    const source = fs.readFileSync(filePath, "utf8");
    const snapshotPattern = /toHaveScreenshot\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
    for (const match of source.matchAll(snapshotPattern)) {
      const before = source.slice(0, match.index);
      const testStart = Math.max(before.lastIndexOf('test("'), before.lastIndexOf("test('"));
      if (testStart < 0) continue;
      const nameMatch = source.slice(testStart).match(/^test\(["']([^"']+)["']/);
      if (nameMatch) bySnapshot.set(match[1], { testName: nameMatch[1], filePath });
    }
  }
  return bySnapshot;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPlan(files) {
  const registry = readRegistryBundle();
  const interactionScreens = readJson("interaction-audit.json").screens;
  const visualCases = readJson("visual-regression.json").cases;
  const visualTestNames = parseVisualTestNames();
  const componentIds = new Set();
  const patternIds = new Set();
  const screenIds = new Set();
  let runAllWeb = full;
  let runAllMobile = false;
  let runApplicationFlow = full;
  const applicationFiles = new Set([
    "scripts/generate-screen-preview.mjs", "scripts/generate-screen-tsx.mjs", "scripts/screen-application-context.mjs",
    "scripts/generate-slide-composition.mjs", "scripts/slide-composition-contract.mjs", "scripts/sync-slide-composition-examples.mjs",
    "src/design-system/slide-composition.ts", "src/design-system/registry/slide-composition-examples.json",
    "tests/visual/slide-compositions.spec.mts", "tests/helpers/slide-compositions.mjs",
    "scripts/audit-screen-implementation.mjs", "scripts/screen-handoff.mjs", "scripts/screen-implementation-graph.mjs", "scripts/resolve-screen-request.mjs",
    "scripts/screen-asset-selection.mjs", "scripts/review-screen-assets.mjs", "scripts/screen-asset-selection.test.mjs",
    "tests/visual/application-flow.spec.mts", "tests/helpers/application-flow.mjs", "src/components/visual-tests/application-host-fixture.tsx",
    "src/components/preview/surface-preview-frame.tsx",
    "src/design-system/registry/context-rules.json", "src/design-system/registry/screen-request.schema.json",
  ]);

  const sourceToComponents = new Map(registry.components.map((entry) => [entry.source, entry.id]));
  const sourceToPatterns = new Map(registry.patterns.map((entry) => [entry.source, entry.id]));
  const sourceToScreens = new Map();
  for (const screen of registry.screens) {
    sourceToScreens.set(screen.source, [...(sourceToScreens.get(screen.source) ?? []), screen.id]);
  }

  for (const file of files) {
    if (applicationFiles.has(file) || file.startsWith("tests/fixtures/screen-requests/")) runApplicationFlow = true;
    if (["src/components/visual-tests/application-host-fixture.tsx", "src/components/preview/surface-preview-frame.tsx"].includes(file)) continue;
    if (sourceToComponents.has(file)) componentIds.add(sourceToComponents.get(file));
    if (sourceToPatterns.has(file)) patternIds.add(sourceToPatterns.get(file));
    for (const screenId of sourceToScreens.get(file) ?? []) screenIds.add(screenId);
    if (file === "src/app/globals.css" || file.startsWith("src/design-system/tokens/")) runAllWeb = true;
    if (file.startsWith("src/components/mobile/") || file === "tests/visual/mobile-design-system.spec.ts") runAllMobile = true;
    if (file === "tests/visual/design-system.visual.spec.ts") runAllWeb = true;
    if (file.startsWith("src/components/") && !file.startsWith("src/components/mobile/") && !sourceToComponents.has(file) && !sourceToPatterns.has(file) && !(sourceToScreens.get(file)?.length)) runAllWeb = true;
  }

  for (const pattern of registry.patterns) {
    if (pattern.requiredComponents.some((id) => componentIds.has(id))) patternIds.add(pattern.id);
  }
  for (const screen of registry.screens) {
    if (screen.patternRefs.some((id) => patternIds.has(id))) screenIds.add(screen.id);
  }

  const testNames = new Set();
  for (const screen of interactionScreens) {
    if (screenIds.has(screen.screenId)) for (const name of screen.tests) testNames.add(name);
  }
  for (const visualCase of visualCases) {
    if (!visualCase.screenId || !screenIds.has(visualCase.screenId)) continue;
    if (visualCase.testName) {
      testNames.add(visualCase.testName);
      continue;
    }
    const mapped = visualTestNames.get(visualCase.snapshot);
    if (mapped) testNames.add(mapped.testName);
  }

  return {
    files,
    componentIds: [...componentIds].sort(),
    patternIds: [...patternIds].sort(),
    screenIds: [...screenIds].sort(),
    testNames: [...testNames].sort(),
    runAllWeb,
    runAllMobile,
    runApplicationFlow: runApplicationFlow || runAllWeb || componentIds.size > 0 || patternIds.size > 0,
  };
}

function printPlan(plan) {
  console.log(`[visual:changed] 변경 파일 ${plan.files.length}개`);
  console.log(`[visual:changed] 영향 범위 · component ${plan.componentIds.length} · pattern ${plan.patternIds.length} · screen ${plan.screenIds.length}`);
  if (plan.runAllWeb) console.log("[visual:changed] 웹 공통 기반 변경 · 웹 시각 검사 전체 실행");
  else if (plan.testNames.length > 0) console.log(`[visual:changed] 실행할 웹 검사 ${plan.testNames.length}개 · ${plan.testNames.join(" / ")}`);
  else console.log("[visual:changed] 실행할 웹 화면 검사가 없습니다.");
  if (plan.runAllMobile) console.log("[visual:changed] 모바일 변경 감지 · 모바일 검사 실행");
  if (plan.runApplicationFlow) console.log("[visual:changed] 전체 화면 연결 검사 · 페이지/중앙/슬라이드 실행");
}

const files = changedFiles();
const plan = buildPlan(files);
printPlan(plan);

if (planOnly || files.length === 0) process.exit(0);

const playwrightCli = path.join(projectRoot, "node_modules", "@playwright", "test", "cli.js");
if (installBrowser && (plan.runAllWeb || plan.testNames.length > 0 || plan.runAllMobile || plan.runApplicationFlow)) {
  run(process.execPath, [playwrightCli, "install", "chromium"], { capture: false, cwd: projectRoot });
}
if (plan.runAllWeb) {
  run(process.execPath, [playwrightCli, "test", "tests/visual/design-system.visual.spec.ts"], { capture: false, cwd: projectRoot });
} else if (plan.testNames.length > 0) {
  const grep = plan.testNames.map(escapeRegex).join("|");
  run(process.execPath, [playwrightCli, "test", "tests/visual/design-system.visual.spec.ts", "--grep", grep], { capture: false, cwd: projectRoot });
}
if (plan.runAllMobile) {
  run(process.execPath, [playwrightCli, "test", "tests/visual/mobile-design-system.spec.ts"], { capture: false, cwd: projectRoot });
}
if (plan.runApplicationFlow) {
  run(process.execPath, [playwrightCli, "test", "tests/visual/application-flow.spec.mts", "tests/visual/slide-compositions.spec.mts"], { capture: false, cwd: projectRoot });
}
