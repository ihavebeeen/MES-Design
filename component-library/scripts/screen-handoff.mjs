import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { auditScreenFile } from "./audit-screen-implementation.mjs";
import { digest, implementationRoot } from "./screen-implementation-graph.mjs";
import { verificationContext } from "./screen-application-context.mjs";

export const visualChecks = ["shell", "pageChrome", "dateInput", "spacing", "colorFontRadius", "layoutHierarchy", "interactions"];
export function reviewPaths(contract, projectRoot = implementationRoot) {
  const id = contract?.request?.requestId;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id ?? "")) throw new Error("안전한 requestId가 필요합니다.");
  const directory = resolve(projectRoot, ".mes-ui-preview", id);
  return { directory, audit: resolve(directory, "implementation-audit.json"), visual: resolve(directory, "visual-review.json") };
}
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, value) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`); };

export function assertStaticPass(audit) {
  if (!audit || audit.blockerCount !== 0 || !["audit-ready", "review-ready"].includes(audit.status) || !audit.fingerprint) {
    throw new Error(`최종 구현 검사 누락/오류/차단: ${JSON.stringify(audit?.findings ?? audit)}`);
  }
}

export function recordPreviewAudit(plan) {
  const paths = reviewPaths(plan.contract, plan.projectRoot);
  let audit;
  try {
    audit = auditScreenFile(plan.contract, plan.outputPath, { projectRoot: plan.projectRoot });
  } catch (error) {
    // Overwrite any older pass when execution itself fails.
    writeJson(paths.audit, { status: "error", error: String(error), handoffReady: false });
    throw error;
  }
  const receipt = { ...audit, checkedAt: new Date().toISOString(), previewPath: plan.absolutePath,
    previewFingerprint: digest(plan.source), purpose: "internal-qa", handoffReady: false };
  writeJson(paths.audit, receipt);
  assertStaticPass(receipt);
  // Existing observations remain valid for the same render bytes. Merely
  // rerunning the static audit must not create new visual paperwork.
  return { audit: receipt, paths };
}

function requireEvidence(condition, message) { if (!condition) throw new Error(`전달 차단: ${message}`); }
function verifyArtifacts(artifacts, base) {
  requireEvidence(Array.isArray(artifacts), "캡처 목록 형식이 잘못됐습니다.");
  for (const artifact of artifacts) {
    requireEvidence(typeof artifact.path === "string" && /^[a-f0-9]{64}$/.test(artifact.sha256 ?? ""), "캡처 경로와 SHA-256이 필요합니다.");
    const file = resolve(base, artifact.path);
    requireEvidence(existsSync(file) && digest(readFileSync(file)) === artifact.sha256, `캡처 누락/변경: ${artifact.path}`);
    const bytes = readFileSync(file);
    const image = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      || (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
      || (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP");
    requireEvidence(image, `PNG/JPEG/WebP 캡처가 아닙니다: ${artifact.path}`);
  }
}

function currentAuditedImplementation(plan) {
  const paths = reviewPaths(plan.contract, plan.projectRoot);
  requireEvidence(existsSync(paths.audit), "최종 구현 검사 결과가 없습니다. screen:preview를 실행하세요.");
  const receipt = readJson(paths.audit);
  assertStaticPass(receipt);
  // Never trust the saved pass without inspecting current source and dependencies.
  const current = auditScreenFile(plan.contract, plan.outputPath, { projectRoot: plan.projectRoot });
  assertStaticPass(current);
  requireEvidence(current.fingerprint === receipt.fingerprint, "구현/의존 자산/검사기가 변경됐습니다. screen:preview로 재검사하세요. 렌더링이 같으면 기존 확인을 재사용합니다.");
  requireEvidence(receipt.previewPath === plan.absolutePath && receipt.previewFingerprint === digest(plan.source), "다른 미리보기 진입점의 결과를 재사용할 수 없습니다.");
  requireEvidence(existsSync(plan.absolutePath) && digest(readFileSync(plan.absolutePath)) === receipt.previewFingerprint, "미리보기 wrapper가 누락/변경됐습니다.");
  return { current, receipt };
}

export function sourceComparisonRequired(contract) {
  return contract.request?.intent !== "new"
    || ["existing-screen-content-change", "existing-screen-adaptation"].includes(contract.request?.screenRelationship?.kind);
}

export function baselineComparisonScopes(contract) {
  return ["existing-screen-content-change", "existing-screen-adaptation"].includes(contract.request?.screenRelationship?.kind)
    ? contract.request.screenRelationship.preserveScopes ?? []
    : [];
}

function verifyBaselineComparisons(visual, plan) {
  const scopes = baselineComparisonScopes(plan.contract);
  if (scopes.length === 0) return;
  requireEvidence(plan.contract.baseScreen && plan.contract.baseScreenSpec, "기준 화면과 ScreenSpec이 현재 계약에 연결되지 않았습니다.");
  requireEvidence(Array.isArray(visual.baselineComparisons), "기준 화면 보존 범위별 대조 결과가 필요합니다.");
  const comparisonMap = new Map();
  for (const comparison of visual.baselineComparisons) {
    requireEvidence(comparison && typeof comparison.scope === "string" && !comparisonMap.has(comparison.scope), "기준 화면 대조 범위가 없거나 중복됐습니다.");
    requireEvidence(["preserved", "user-directed-change", "unsupported-change", "unchecked"].includes(comparison.status), `기준 화면 대조 상태가 잘못됐습니다: ${comparison.scope}`);
    comparisonMap.set(comparison.scope, comparison);
  }
  const decisions = new Map((plan.contract.request.evidence?.decisions ?? []).map((entry) => [entry.id, entry]));
  for (const scope of scopes) {
    const comparison = comparisonMap.get(scope);
    requireEvidence(comparison, `기준 화면 보존 범위 '${scope}'를 대조하지 않았습니다.`);
    requireEvidence(!["unsupported-change", "unchecked"].includes(comparison.status), `기준 화면 보존 범위 '${scope}'에 근거 없는 변경 또는 미확인이 남았습니다.`);
    if (comparison.status === "user-directed-change") {
      const evidence = decisions.get(comparison.evidenceRef);
      requireEvidence(evidence && evidence.state === "confirmed" && ["user-request", "functional-spec"].includes(evidence.sourceType), `기준 화면 보존 범위 '${scope}'의 변경 근거가 사용자 요구나 기능명세에 연결되지 않았습니다.`);
    }
  }
}

function verifyObservation(visual, current, receipt, plan, base) {
  requireEvidence(typeof visual.reviewer === "string" && visual.reviewer.trim() && Number.isFinite(Date.parse(visual.comparedAt)) && Date.parse(visual.comparedAt) <= Date.now() + 5000, "실제 확인자·시각이 필요합니다.");
  requireEvidence(visual.viewport?.width > 0 && visual.viewport?.height > 0, "확인 viewport가 필요합니다.");
  requireEvidence(visual.previewFingerprint === receipt.previewFingerprint, "확인이 현재 미리보기와 연결되지 않았습니다.");
  if (visual.schemaVersion === 2) {
    requireEvidence(JSON.stringify(visual.verification) === JSON.stringify(verificationContext(plan.contract.request)), "확인 범위가 현재 요청과 다릅니다.");
    requireEvidence(visual.renderFingerprint === current.renderFingerprint, "렌더링/계약이 변경됐습니다. 영향을 받은 부분을 재확인하세요.");
    requireEvidence(visual.rendered === true && visual.interactions === true, "MES 렌더링·동작 미확인/실패");
    if (sourceComparisonRequired(plan.contract)) {
      requireEvidence(visual.sourceCompared === true, "원본 재현/기존 화면 변경에는 원본 대조가 필요합니다.");
      const evidence = plan.contract.request.evidence;
      const relationship = plan.contract.request.screenRelationship;
      requireEvidence(Boolean(evidence?.figmaNode || evidence?.sourceRoute || relationship?.baselineScreenId || relationship?.baselineEvidenceRefs?.length), "계약에 원본 참조가 없습니다.");
      verifyBaselineComparisons(visual, plan);
    }
    verifyArtifacts(visual.captures ?? [], base);
  } else {
    // Preserve previously written detailed records, without the old requirement
    // that comparison time must be later than every identical audit rerun.
    requireEvidence(visual.schemaVersion === 1 && visual.implementationFingerprint === current.fingerprint, "시각 대조가 현재 구현에 연결되지 않았습니다.");
    requireEvidence(["figma", "approved-mes", "user-approved"].includes(visual.baseline?.kind) && visual.baseline.reference?.trim(), "기준 화면/승인 근거가 필요합니다.");
    verifyArtifacts(visual.baseline.artifacts, base);
    verifyArtifacts(visual.renderedArtifacts, base);
    for (const name of visualChecks) {
      const check = visual.checks?.[name];
      const allowsNA = name === "dateInput";
      requireEvidence(check && (check.status === "passed" || (allowsNA && check.status === "not-applicable")), `${name} 미검증/실패`);
    }
  }
  requireEvidence(Array.isArray(visual.unchecked) && visual.unchecked.length === 0, "미확인 항목을 제약으로 기록한 것만으로 통과할 수 없습니다.");
  for (const warning of current.findings.filter((f) => f.severity === "warning")) {
    requireEvidence(visual.warningResolutions?.some((r) => r.code === warning.code && r.reason?.trim()), `새 경고 근거 검토 필요: ${warning.code}`);
  }
}

// Call only after actually observing the QA render. This saves the observation;
// it does not pretend that a static checker performed browser/visual QA.
export function recordScreenReview(plan, observation) {
  const { current, receipt } = currentAuditedImplementation(plan);
  const paths = reviewPaths(plan.contract, plan.projectRoot);
  // Invalidate old success before reading optional evidence (which can fail).
  writeJson(paths.visual, { schemaVersion: 2, rendered: false, interactions: false, status: "recording" });
  const visual = { schemaVersion: 2, renderFingerprint: current.renderFingerprint, previewFingerprint: receipt.previewFingerprint,
    verification: verificationContext(plan.contract.request),
    reviewer: observation.reviewer, comparedAt: new Date().toISOString(), viewport: observation.viewport ?? plan.contract.request.target.viewport,
    rendered: observation.rendered, interactions: observation.interactions, sourceCompared: observation.sourceCompared ?? false,
    baselineComparisons: observation.baselineComparisons ?? [],
    note: observation.note ?? "", captures: (observation.captures ?? []).map((path) => ({ path: resolve(plan.projectRoot, path), sha256: digest(readFileSync(resolve(plan.projectRoot, path))) })),
    warningResolutions: observation.warningResolutions ?? [], unchecked: observation.unchecked ?? [] };
  // Save failures too: a failed recheck must invalidate an earlier success.
  writeJson(paths.visual, visual);
  verifyObservation(visual, current, receipt, plan, paths.directory);
  return visual;
}

export function verifyScreenHandoff(plan, visualPath = reviewPaths(plan.contract, plan.projectRoot).visual) {
  const { current, receipt } = currentAuditedImplementation(plan);
  requireEvidence(existsSync(visualPath), "시각 대조 결과가 없습니다.");
  const visual = readJson(visualPath);
  verifyObservation(visual, current, receipt, plan, dirname(visualPath));
  return { status: "handoff-ready", fingerprint: current.fingerprint, previewFingerprint: receipt.previewFingerprint,
    verification: verificationContext(plan.contract.request),
    visualEvidenceFingerprint: digest(JSON.stringify(visual)), automatic: current, visual,
    limitation: `${verificationContext(plan.contract.request).parentIntegration === "out-of-scope" ? "팝업 자체 확인 범위이며 배경 업무 목록·선택값 전달·저장 연동은 확인하지 않았습니다. " : ""}시각 판정은 비교자의 기록입니다. 픽셀 일치·기록의 진실성·실제 서버 저장을 자동 증명하지 않습니다. 이 결과는 현재 파일과 요청 범위에만 유효합니다.` };
}

async function runCli() {
  try {
    const [contractPath, sourcePath, ...args] = process.argv.slice(2);
    const visualPath = args[0] && !args[0].startsWith("--") ? args.shift() : undefined;
    if (!contractPath || !sourcePath) throw new Error("사용법: npm run screen:handoff -- <contract.json> <screen.tsx> [--reviewed] [--source-compared] [--baseline-check scope=status[:evidenceRef]] [--note 설명]");
    const flags = {};
    const warningResolutions = [];
    const baselineComparisons = [];
    for (let i = 0; i < args.length; i += 1) {
      if (["--reviewed", "--source-compared"].includes(args[i])) flags[args[i]] = true;
      else if (args[i] === "--warning" && args[i + 1]?.includes("=")) {
        const value = args[++i]; const split = value.indexOf("=");
        warningResolutions.push({ code: value.slice(0, split), reason: value.slice(split + 1) });
      }
      else if (args[i] === "--baseline-check" && args[i + 1]?.includes("=")) {
        const value = args[++i];
        const [scope, detail] = value.split("=");
        const [status, evidenceRef] = detail.split(":");
        baselineComparisons.push({ scope, status, ...(evidenceRef ? { evidenceRef } : {}) });
      }
      else if (["--note", "--reviewer"].includes(args[i]) && args[i + 1]) flags[args[i]] = args[++i];
      else throw new Error(`알 수 없거나 값이 없는 옵션: ${args[i]}`);
    }
    const { createScreenPreviewPlan } = await import("./generate-screen-preview.mjs");
    const plan = createScreenPreviewPlan(readJson(resolve(contractPath)), resolve(sourcePath));
    if (flags["--reviewed"]) {
      requireEvidence(!visualPath, "직접 지정한 과거 기록과 새 확인을 동시에 사용할 수 없습니다.");
      recordScreenReview(plan, { reviewer: flags["--reviewer"] ?? "agent", rendered: true, interactions: true, sourceCompared: Boolean(flags["--source-compared"]), baselineComparisons, note: flags["--note"] ?? "", warningResolutions });
    } else requireEvidence(!Object.keys(flags).length && !warningResolutions.length && !baselineComparisons.length, "새 확인 옵션에는 --reviewed가 필요합니다.");
    const result = verifyScreenHandoff(plan, visualPath ? resolve(visualPath) : undefined);
    console.log(JSON.stringify({ status: result.status, verification: result.verification, fingerprint: result.fingerprint, previewUrl: plan.url, limitation: result.limitation }, null, 2));
  } catch (error) { console.error(String(error)); process.exitCode = 1; }
}

// Preview imports this module too: do not top-level-await that circular import.
if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) void runCli();
