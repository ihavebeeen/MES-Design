import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { contractFingerprint, readRegistryBundle } from "./resolve-screen-request.mjs";
import { digest, implementationRoot, inspectImplementation, renderingDependencies } from "./screen-implementation-graph.mjs";

function finding(severity, code, message) {
  return { severity, code, message };
}

export function auditScreenImplementation(contract, source, registry = readRegistryBundle(), options = {}) {
  const findings = [];

  if (contract.fingerprint !== contractFingerprint(contract)) findings.push(finding("blocker", "contract.fingerprint", "계약 내용과 fingerprint가 일치하지 않습니다. screen:resolve를 다시 실행하세요."));
  if (contract.quality?.blockerCount > 0) findings.push(finding("blocker", "contract.blocked", "blocker가 있는 계약은 구현 근거로 사용할 수 없습니다."));
  if (!contract.decisionTrace) findings.push(finding("blocker", "contract.decision-trace", "선택·제외 근거가 없는 계약입니다. screen:resolve를 다시 실행하세요."));

  let implementation = { uses: new Set(), sections: [], actions: new Set(), files: [] };
  try {
    implementation = inspectImplementation(source, registry, options);
    findings.push(...implementation.findings);
  } catch (error) {
    findings.push(finding("blocker", "audit.execution-error", String(error)));
  }
  if (implementation.uses.size === 0) findings.push(finding("blocker", "component.no-mes-usage", "실제로 JSX/호출에서 사용하는 MES 자산을 확인하지 못했습니다."));
  if (!implementation.exports?.has(contract.request?.output?.componentName)) findings.push(finding("blocker", "source.entry-export", "계약의 화면 componentName에 해당하는 값 export가 없습니다."));

  const shellComponents = {
    "center-modal": "CenterModal",
    "side-slide-panel": "SideSlidePanel",
    "confirm-dialog": "ConfirmDialog",
  };
  const expectedShellComponent = shellComponents[contract.request?.target?.kind];
  if (expectedShellComponent && !implementation.uses.has(expectedShellComponent)) {
    findings.push(finding("blocker", "shell.missing", `계약된 셸 컴포넌트 ${expectedShellComponent}를 구현에서 찾지 못했습니다.`));
  }
  if (contract.request?.target?.kind === "page") {
    for (const component of ["Sidebar", "PageTopTabItem"]) {
      if (!implementation.uses.has(component)) findings.push(finding("blocker", "shell.page-chrome", `전체 페이지 공통 틀 ${component} 실제 사용이 필요합니다. 다른 승인 셸은 검사 지원을 먼저 추가하세요.`));
    }
  }

  const sectionPositions = [];
  for (const section of contract.composition?.sections ?? []) {
    const position = implementation.sections.findIndex((entry) => entry.id === section.id);
    if (position < 0) findings.push(finding("blocker", "composition.section-missing", `ScreenSpec section '${section.id}'의 data-section-id marker를 구현에서 찾지 못했습니다.`));
    else sectionPositions.push({ id: section.id, position });
  }
  for (let index = 1; index < sectionPositions.length; index += 1) {
    if (sectionPositions[index - 1].position >= sectionPositions[index].position) {
      findings.push(finding("blocker", "composition.section-order", `ScreenSpec section '${sectionPositions[index - 1].id}' 다음에 '${sectionPositions[index].id}'가 와야 합니다.`));
    }
  }

  for (const patternContract of contract.implementation?.patternContracts ?? []) {
    for (const marker of patternContract.implementationMarkers ?? []) {
      if (!implementation.uses.has(marker)) findings.push(finding("blocker", "composition.pattern-marker", `pattern '${patternContract.patternId}'의 실제 MES JSX/호출 '${marker}'를 찾지 못했습니다.`));
    }
  }

  const actionSetRef = contract.composition?.actionSetRef;
  if (actionSetRef && !implementation.actions.has(actionSetRef)) {
    findings.push(finding("blocker", "composition.action-set", `action set '${actionSetRef}'가 createDialogActionSet을 통해 구현되지 않았습니다.`));
  }

  const arbitraryPixelValues = [...source.matchAll(/\[(\d+(?:\.\d+)?)px\]/g)].map((match) => match[0]);
  if (arbitraryPixelValues.length > 0) findings.push(finding("warning", "style.arbitrary-pixel", `임의 px 값 ${[...new Set(arbitraryPixelValues)].join(", ")}이 있습니다. Figma 근거 또는 정규화 판정을 확인하세요.`));

  const blockers = findings.filter((entry) => entry.severity === "blocker");
  const warnings = findings.filter((entry) => entry.severity === "warning");
  return {
    scope: "static-implementation-only",
    handoffReady: false,
    sourceFingerprint: digest(source),
    dependencies: implementation.files,
    status: blockers.length > 0 ? "blocked" : warnings.length > 0 ? "review-ready" : "audit-ready",
    blockerCount: blockers.length,
    warningCount: warnings.length,
    findings,
  };
}

// A report is a receipt for these bytes, not a reusable approval for a filename.
export function auditScreenFile(contract, sourcePath, options = {}) {
  const root = options.projectRoot ?? implementationRoot;
  const path = resolve(root, sourcePath);
  if (!/\.(?:tsx|jsx)$/.test(path)) throw new Error("독립 HTML/CSS는 검증된 MES 미리보기로 제공할 수 없습니다. TSX/JSX 구현이 필요합니다.");
  const registry = readRegistryBundle();
  const result = auditScreenImplementation(contract, readFileSync(path, "utf8"), registry, { ...options, sourcePath: path });
  const support = ["package-lock.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs", "src/app/layout.tsx", "src/app/globals.css",
    "scripts/screen-implementation-graph.mjs", "scripts/audit-screen-implementation.mjs", "scripts/screen-handoff.mjs", "scripts/generate-screen-preview.mjs"];
  const route = contract.request?.output?.route;
  if (!/^\/preview\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(route ?? "")) throw new Error("최종 파일 검사에는 관리되는 /preview/<id> 진입점이 필요합니다.");
  // Next implicitly composes route layouts; these are not TS import dependencies.
  for (const directory of ["src/app/preview", `src/app${route}`]) {
    for (const stem of ["layout", "template", "loading", "error", "not-found"]) {
      for (const extension of ["tsx", "jsx", "ts", "js"]) {
        const name = `${directory}/${stem}.${extension}`;
        support.push(name);
        const file = resolve(root, name);
        if (existsSync(file)) {
          const extra = inspectImplementation(readFileSync(file, "utf8"), registry, { projectRoot: root, sourcePath: file });
          result.findings.push(...extra.findings);
        }
      }
    }
  }
  result.blockerCount = result.findings.filter((f) => f.severity === "blocker").length;
  result.warningCount = result.findings.filter((f) => f.severity === "warning").length;
  result.status = result.blockerCount ? "blocked" : result.warningCount ? "review-ready" : "audit-ready";
  const environmentFiles = support.map((name) => {
    const file = resolve(root, name);
    return [name, existsSync(file) ? digest(readFileSync(file)) : null];
  });
  const renderingFiles = renderingDependencies([path, ...support.filter((name) => !name.startsWith("scripts/")).map((name) => resolve(root, name))], root);
  return { ...result, sourcePath: path, fingerprint: digest(JSON.stringify({ sourcePath: path, contract, registry, renderingFiles, environmentFiles })), environmentFiles, renderingFiles };
}

function runCli() {
  const [contractArg, sourceArg] = process.argv.slice(2);
  if (!contractArg || !sourceArg) throw new Error("사용법: npm run screen:audit -- <contract.json> <implementation.tsx>");

  const contractPath = resolve(process.cwd(), contractArg);
  const sourcePath = resolve(process.cwd(), sourceArg);
  if (!existsSync(contractPath) || !existsSync(sourcePath)) throw new Error("계약 파일 또는 구현 파일을 찾을 수 없습니다.");

  const contract = JSON.parse(readFileSync(contractPath, "utf8"));
  const result = auditScreenFile(contract, sourcePath);
  console.log(JSON.stringify(result, null, 2));
  if (result.blockerCount > 0) process.exitCode = 1;
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    runCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
