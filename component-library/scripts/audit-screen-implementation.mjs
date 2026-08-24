import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { contractFingerprint, readRegistryBundle } from "./resolve-screen-request.mjs";

function finding(severity, code, message) {
  return { severity, code, message };
}

function normalizeSource(source) {
  return source.replaceAll("\\", "/").replace(/^src\//, "").replace(/\.(tsx?|jsx?)$/, "");
}

export function auditScreenImplementation(contract, source, registry = readRegistryBundle()) {
  const findings = [];

  if (contract.fingerprint !== contractFingerprint(contract)) findings.push(finding("blocker", "contract.fingerprint", "계약 내용과 fingerprint가 일치하지 않습니다. screen:resolve를 다시 실행하세요."));
  if (contract.quality?.blockerCount > 0) findings.push(finding("blocker", "contract.blocked", "blocker가 있는 계약은 구현 근거로 사용할 수 없습니다."));
  if (!contract.decisionTrace) findings.push(finding("blocker", "contract.decision-trace", "선택·제외 근거가 없는 계약입니다. screen:resolve를 다시 실행하세요."));

  const nativeInteractive = [...source.matchAll(/<\s*(button|input|select|textarea|table)\b/g)].map((match) => match[1]);
  for (const tag of [...new Set(nativeInteractive)]) findings.push(finding("blocker", `native.${tag}`, `화면 구현에서 원시 <${tag}>를 직접 사용했습니다. 등록된 MES 컴포넌트로 교체하세요.`));

  if (/on(?:Change|Click|ValueChange|CheckedChange)\s*=\s*\{\s*\(.*?\)\s*=>\s*(?:undefined|\{\s*\})\s*\}/s.test(source)) {
    findings.push(finding("blocker", "interaction.no-op", "상태를 바꾸지 않는 no-op 상호작용 핸들러가 있습니다."));
  }

  const allowedSources = new Set([
    ...registry.components.map((entry) => normalizeSource(entry.source)),
    ...registry.patterns.map((entry) => normalizeSource(entry.source)),
  ]);
  const localImports = [...source.matchAll(/from\s+["'](@\/components\/(?:ui|patterns)\/[^"']+)["']/g)].map((match) => match[1].replace(/^@\//, ""));
  for (const imported of unique(localImports)) {
    if (!allowedSources.has(normalizeSource(imported))) findings.push(finding("warning", "registry.unregistered-import", `등록되지 않은 UI 구현 '${imported}'를 import합니다.`));
  }

  const shellComponents = {
    "center-modal": "CenterModal",
    "side-slide-panel": "SideSlidePanel",
    "confirm-dialog": "ConfirmDialog",
  };
  const expectedShellComponent = shellComponents[contract.request?.target?.kind];
  if (expectedShellComponent && !new RegExp(`\\b${expectedShellComponent}\\b`).test(source)) {
    findings.push(finding("blocker", "shell.missing", `계약된 셸 컴포넌트 ${expectedShellComponent}를 구현에서 찾지 못했습니다.`));
  }

  const sectionPositions = [];
  for (const section of contract.composition?.sections ?? []) {
    const literal = `data-section-id=${JSON.stringify(section.id)}`;
    const position = source.indexOf(literal);
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
      if (!source.includes(marker)) findings.push(finding("blocker", "composition.pattern-marker", `pattern '${patternContract.patternId}'의 구현 marker '${marker}'를 찾지 못했습니다.`));
    }
  }

  const actionSetRef = contract.composition?.actionSetRef;
  if (actionSetRef && !source.includes(`createDialogActionSet(${JSON.stringify(actionSetRef)}`)) {
    findings.push(finding("blocker", "composition.action-set", `action set '${actionSetRef}'가 createDialogActionSet을 통해 구현되지 않았습니다.`));
  }

  const arbitraryPixelValues = [...source.matchAll(/\[(\d+(?:\.\d+)?)px\]/g)].map((match) => match[0]);
  if (arbitraryPixelValues.length > 0) findings.push(finding("warning", "style.arbitrary-pixel", `임의 px 값 ${[...new Set(arbitraryPixelValues)].join(", ")}이 있습니다. Figma 근거 또는 정규화 판정을 확인하세요.`));

  const blockers = findings.filter((entry) => entry.severity === "blocker");
  const warnings = findings.filter((entry) => entry.severity === "warning");
  return {
    status: blockers.length > 0 ? "blocked" : warnings.length > 0 ? "review-ready" : "audit-ready",
    blockerCount: blockers.length,
    warningCount: warnings.length,
    findings,
  };
}

function runCli() {
  const [contractArg, sourceArg] = process.argv.slice(2);
  if (!contractArg || !sourceArg) throw new Error("사용법: npm run screen:audit -- <contract.json> <implementation.tsx>");

  const contractPath = resolve(process.cwd(), contractArg);
  const sourcePath = resolve(process.cwd(), sourceArg);
  if (!existsSync(contractPath) || !existsSync(sourcePath)) throw new Error("계약 파일 또는 구현 파일을 찾을 수 없습니다.");

  const contract = JSON.parse(readFileSync(contractPath, "utf8"));
  const source = readFileSync(sourcePath, "utf8");
  const result = auditScreenImplementation(contract, source);
  console.log(JSON.stringify(result, null, 2));
  if (result.blockerCount > 0) process.exitCode = 1;
}

function unique(values) {
  return [...new Set(values)];
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    runCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
