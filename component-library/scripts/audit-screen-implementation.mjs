import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { contractFingerprint, readRegistryBundle } from "./resolve-screen-request.mjs";
import { digest, implementationRoot, inspectImplementation, renderingDependencies } from "./screen-implementation-graph.mjs";
import { hostPagePath, missingApplicationChrome, surfacePreviewFrame, validateVerificationScope, verificationContext } from "./screen-application-context.mjs";

function finding(severity, code, message) {
  return { severity, code, message };
}

function uniqueFindings(findings) {
  return [...new Map(findings.map((entry) => [`${entry.severity}\u0000${entry.code}\u0000${entry.message}`, entry])).values()];
}

export function patternContractFindings(patternContract, implementation, { entryBehavior } = {}) {
  if (!patternContract) return [];
  const findings = [];
  for (const marker of patternContract.implementationMarkers ?? []) {
    if (!implementation.uses.has(marker)) findings.push(finding("blocker", "composition.pattern-marker", `선택한 pattern '${patternContract.patternId}'의 실제 MES JSX/호출 '${marker}'를 찾지 못했습니다.`));
  }
  for (const marker of patternContract.forbiddenImplementationMarkers ?? []) {
    if (implementation.uses.has(marker)) findings.push(finding("blocker", "composition.pattern-forbidden-marker", `선택한 pattern '${patternContract.patternId}'에서 '${marker}' 대체 사용은 허용되지 않습니다.`));
  }
  for (const prop of patternContract.requiredComponentProps ?? []) {
    if (!implementation.componentProps?.has(prop)) findings.push(finding("blocker", "composition.pattern-prop", `선택한 pattern '${patternContract.patternId}'에는 실제 MES component prop '${prop}' 연결이 필요합니다.`));
  }
  const entryContract = entryBehavior ? patternContract.entryBehaviorContracts?.[entryBehavior] : undefined;
  for (const prop of entryContract?.requiredComponentProps ?? []) {
    if (!implementation.componentProps?.has(prop)) findings.push(finding("blocker", "composition.pattern-interaction", `선택한 pattern '${patternContract.patternId}'의 entryBehavior '${entryBehavior}'에는 실제 MES component prop '${prop}' 연결이 필요합니다.`));
  }
  return findings;
}

export function declaredBehaviorFindings(contract, implementation) {
  if (!implementation.componentProps?.has("Table.selectable")) return [];
  const findings = [];
  const selectedRefs = new Set(contract.composition?.selectedPatternRefs ?? []);
  if (![...selectedRefs].some((id) => id.startsWith("selection."))) {
    findings.push(finding("blocker", "behavior.selection-undeclared", "Table.selectable을 사용했지만 선택 결과가 무엇을 바꾸는지 설명하는 selection.* 동작 계약이 없습니다."));
  }
  if (contract.request?.assetDecisions) {
    const decisions = contract.request.evidence?.decisions ?? [];
    const selection = decisions.find((entry) => entry.questionId === "task.selection");
    if (!selection || ["assumed", "unresolved"].includes(selection.state)) {
      findings.push(finding("blocker", "behavior.selection-evidence", "체크박스 선택을 구현하려면 단건/다건과 선택 후 동작을 확정하거나 지원 근거로 기록해야 합니다."));
    }
    if (contract.request?.target?.kind !== "page" && contract.request?.hostPage?.saveBehavior === "notify-parent") {
      const editScope = decisions.find((entry) => entry.questionId === "task.edit-scope");
      if (!editScope || ["assumed", "unresolved"].includes(editScope.state)) {
        findings.push(finding("blocker", "behavior.edit-scope-evidence", "선택 대상에 값을 저장하는 팝업은 공통값/대상별 값의 소유 범위를 확정하거나 지원 근거로 기록해야 합니다."));
      }
    }
  }
  return findings;
}

export function auditScreenImplementation(contract, source, registry = readRegistryBundle(), options = {}) {
  const findings = [];
  for (const message of validateVerificationScope(contract.request)) findings.push(finding("blocker", "request.verification-scope", message));

  if (contract.fingerprint !== contractFingerprint(contract)) findings.push(finding("blocker", "contract.fingerprint", "계약 내용과 fingerprint가 일치하지 않습니다. screen:resolve를 다시 실행하세요."));
  if (contract.quality?.blockerCount > 0) findings.push(finding("blocker", "contract.blocked", "blocker가 있는 계약은 구현 근거로 사용할 수 없습니다."));
  if (!contract.decisionTrace) findings.push(finding("blocker", "contract.decision-trace", "선택·제외 근거가 없는 계약입니다. screen:resolve를 다시 실행하세요."));

  let implementation = { uses: new Set(), componentProps: new Set(), sections: [], actions: new Set(), files: [] };
  try {
    implementation = inspectImplementation(source, registry, options);
    findings.push(...implementation.findings);
  } catch (error) {
    findings.push(finding("blocker", "audit.execution-error", String(error)));
  }
  if (implementation.uses.size === 0) findings.push(finding("blocker", "component.no-mes-usage", "실제로 JSX/호출에서 사용하는 MES 자산을 확인하지 못했습니다."));
  if (!implementation.exports?.has(contract.request?.output?.componentName)) findings.push(finding("blocker", "source.entry-export", "계약의 화면 componentName에 해당하는 값 export가 없습니다."));
  findings.push(...declaredBehaviorFindings(contract, implementation));

  const page = contract.request?.target?.kind === "page";
  if (page) for (const asset of missingApplicationChrome(implementation, registry)) findings.push(finding("blocker", "shell.page-chrome", `MES 전체 페이지에 ${asset} 실제 사용이 필요합니다.`));
  const selected = new Set(contract.composition?.selectedPatternRefs ?? []);
  const frames = registry.patterns.filter((p) => page
    ? selected.has(p.id) && p.placement === "page" && ["screen", "recipe"].includes(p.kind)
    : p.id === contract.composition?.shellRef);
  if (!frames.length) findings.push(finding("blocker", "shell.contract-missing", "적용할 페이지/팝업 틀의 등록 계약이 필요합니다."));
  for (const frame of frames) {
    // Content/shell requirements augment the common desktop page frame.
    for (const id of frame.requiredComponents ?? []) {
      const asset = registry.components.find((entry) => entry.id === id);
      if (!asset || !implementation.uses.has(asset.name)) findings.push(finding("blocker", page ? "shell.page-chrome" : "shell.missing", `선택한 ${frame.id}의 공통 자산 ${asset?.name ?? id} 실제 사용이 필요합니다.`));
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
    findings.push(...patternContractFindings(patternContract, implementation));
  }

  const actionSetRef = contract.composition?.actionSetRef;
  if (actionSetRef && !implementation.actions.has(actionSetRef)) {
    findings.push(finding("blocker", "composition.action-set", `action set '${actionSetRef}'가 createDialogActionSet을 통해 구현되지 않았습니다.`));
  }

  const arbitraryPixelValues = [...source.matchAll(/\[(\d+(?:\.\d+)?)px\]/g)].map((match) => match[0]);
  if (arbitraryPixelValues.length > 0) findings.push(finding("warning", "style.arbitrary-pixel", `임의 px 값 ${[...new Set(arbitraryPixelValues)].join(", ")}이 있습니다. Figma 근거 또는 정규화 판정을 확인하세요.`));

  const distinctFindings = uniqueFindings(findings);
  const blockers = distinctFindings.filter((entry) => entry.severity === "blocker");
  const warnings = distinctFindings.filter((entry) => entry.severity === "warning");
  return {
    scope: "static-implementation-only",
    verification: verificationContext(contract.request),
    handoffReady: false,
    sourceFingerprint: digest(source),
    dependencies: implementation.files,
    status: blockers.length > 0 ? "blocked" : warnings.length > 0 ? "review-ready" : "audit-ready",
    blockerCount: blockers.length,
    warningCount: warnings.length,
    findings: distinctFindings,
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
    "scripts/screen-implementation-graph.mjs", "scripts/audit-screen-implementation.mjs", "scripts/screen-handoff.mjs", "scripts/generate-screen-preview.mjs", "scripts/screen-application-context.mjs"];
  if (contract.request?.target?.kind !== "page") {
    try {
      const errors = validateVerificationScope(contract.request);
      if (errors.length) throw new Error(errors.join(" "));
      const host = contract.request.hostPage;
      const hostPath = host ? hostPagePath(contract.request, root) : resolve(root, surfacePreviewFrame);
      const parent = inspectImplementation(readFileSync(hostPath, "utf8"), registry, { projectRoot: root, sourcePath: hostPath });
      support.push(host?.sourcePath ?? surfacePreviewFrame);
      result.findings.push(...parent.findings);
      if (host?.pagePatternRef) result.findings.push(...declaredBehaviorFindings(contract, parent));
      if (!parent.exports.has(host?.componentName ?? "SurfacePreviewFrame")) result.findings.push(finding("blocker", "host.entry-export", "배경 페이지/미리보기 틀의 실제 export가 없습니다."));
      for (const asset of missingApplicationChrome(parent, registry)) result.findings.push(finding("blocker", "host.page-chrome", `팝업 배경 페이지에 ${asset} 실제 사용이 필요합니다.`));
      result.findings.push(...patternContractFindings(contract.implementation?.hostPagePatternContract, parent, {
        entryBehavior: verificationContext(contract.request).parentIntegration === "included" ? host?.entryBehavior : undefined,
      }));
    } catch (error) {
      result.findings.push(finding("blocker", "host.invalid", String(error)));
    }
  }
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
  result.findings = uniqueFindings(result.findings);
  result.blockerCount = result.findings.filter((f) => f.severity === "blocker").length;
  result.warningCount = result.findings.filter((f) => f.severity === "warning").length;
  result.status = result.blockerCount ? "blocked" : result.warningCount ? "review-ready" : "audit-ready";
  const environmentFiles = support.map((name) => {
    const file = resolve(root, name);
    return [name, existsSync(file) ? digest(readFileSync(file)) : null];
  });
  const renderingFiles = renderingDependencies([path, ...support.filter((name) => !name.startsWith("scripts/")).map((name) => resolve(root, name))], root);
  const renderFingerprint = digest(JSON.stringify({ sourcePath: path, contract, renderingFiles,
    patterns: registry.patterns.filter((p) => contract.composition?.selectedPatternRefs?.includes(p.id)) }));
  return { ...result, sourcePath: path, fingerprint: digest(JSON.stringify({ sourcePath: path, contract, registry, renderingFiles, environmentFiles })), renderFingerprint, environmentFiles, renderingFiles };
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
