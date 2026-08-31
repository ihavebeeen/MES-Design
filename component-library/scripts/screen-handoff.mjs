import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { auditScreenFile } from "./audit-screen-implementation.mjs";
import { digest, implementationRoot } from "./screen-implementation-graph.mjs";

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
  if (!existsSync(paths.visual)) writeJson(paths.visual, {
    schemaVersion: 1, implementationFingerprint: receipt.fingerprint, previewFingerprint: receipt.previewFingerprint,
    reviewer: "", comparedAt: "", viewport: { width: null, height: null },
    baseline: { kind: "approved-mes", reference: "", artifacts: [] }, renderedArtifacts: [],
    checks: Object.fromEntries(visualChecks.map((name) => [name, { status: "not-checked", note: "" }])),
    warningResolutions: [], unchecked: ["기준 화면과 실제 렌더링 대조 전"],
  });
  return { audit: receipt, paths };
}

function requireEvidence(condition, message) { if (!condition) throw new Error(`전달 차단: ${message}`); }
function verifyArtifacts(artifacts, base) {
  requireEvidence(Array.isArray(artifacts) && artifacts.length > 0, "기준/구현 캡처 파일이 필요합니다.");
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

export function verifyScreenHandoff(plan, visualPath = reviewPaths(plan.contract, plan.projectRoot).visual) {
  const paths = reviewPaths(plan.contract, plan.projectRoot);
  requireEvidence(existsSync(paths.audit), "최종 구현 검사 결과가 없습니다. screen:preview를 실행하세요.");
  const receipt = readJson(paths.audit);
  assertStaticPass(receipt);
  // Never trust the saved pass without inspecting current source and dependencies.
  const current = auditScreenFile(plan.contract, plan.outputPath, { projectRoot: plan.projectRoot });
  assertStaticPass(current);
  requireEvidence(current.fingerprint === receipt.fingerprint, "구현/의존 자산/검사기가 변경됐습니다. 재검사·시각 대조가 필요합니다.");
  requireEvidence(receipt.previewPath === plan.absolutePath && receipt.previewFingerprint === digest(plan.source), "다른 미리보기 진입점의 결과를 재사용할 수 없습니다.");
  requireEvidence(existsSync(plan.absolutePath) && digest(readFileSync(plan.absolutePath)) === receipt.previewFingerprint, "미리보기 wrapper가 누락/변경됐습니다.");
  requireEvidence(existsSync(visualPath), "시각 대조 결과가 없습니다.");
  const visual = readJson(visualPath);
  requireEvidence(visual.schemaVersion === 1 && visual.implementationFingerprint === current.fingerprint && visual.previewFingerprint === receipt.previewFingerprint, "시각 대조가 현재 구현에 연결되지 않았습니다.");
  requireEvidence(typeof visual.reviewer === "string" && visual.reviewer.trim() && Number.isFinite(Date.parse(visual.comparedAt)) && Date.parse(visual.comparedAt) >= Date.parse(receipt.checkedAt) && Date.parse(visual.comparedAt) <= Date.now() + 5000, "검사 이후 실제 비교자·시각이 필요합니다.");
  requireEvidence(visual.viewport?.width > 0 && visual.viewport?.height > 0, "비교 viewport가 필요합니다.");
  requireEvidence(["figma", "approved-mes", "user-approved"].includes(visual.baseline?.kind) && visual.baseline.reference?.trim(), "기준 화면/승인 근거가 필요합니다.");
  verifyArtifacts(visual.baseline.artifacts, dirname(visualPath));
  verifyArtifacts(visual.renderedArtifacts, dirname(visualPath));
  for (const name of visualChecks) {
    const check = visual.checks?.[name];
    const allowsNA = name === "dateInput" || (name === "pageChrome" && plan.contract.request.target.kind !== "page");
    requireEvidence(check && (check.status === "passed" || (allowsNA && check.status === "not-applicable")), `${name} 미검증/실패`);
    requireEvidence(typeof check.note === "string" && check.note.trim(), `${name} 비교 근거가 없습니다.`);
  }
  requireEvidence(Array.isArray(visual.unchecked) && visual.unchecked.length === 0, "미확인 항목을 제약으로 기록한 것만으로 통과할 수 없습니다.");
  for (const warning of current.findings.filter((f) => f.severity === "warning")) {
    requireEvidence(visual.warningResolutions?.some((r) => r.code === warning.code && r.reason?.trim()), `경고 근거 검토 필요: ${warning.code}`);
  }
  return { status: "handoff-ready", fingerprint: current.fingerprint, previewFingerprint: receipt.previewFingerprint,
    visualEvidenceFingerprint: digest(JSON.stringify(visual)), automatic: current, visual,
    limitation: "시각 판정은 비교자의 기록입니다. 픽셀 일치나 기록의 진실성을 자동 증명하지 않습니다. 이 결과는 현재 파일에만 유효합니다." };
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    const [contractPath, sourcePath, visualPath] = process.argv.slice(2);
    if (!contractPath || !sourcePath) throw new Error("사용법: npm run screen:handoff -- <contract.json> <screen.tsx> [visual-review.json]");
    const { createScreenPreviewPlan } = await import("./generate-screen-preview.mjs");
    const plan = createScreenPreviewPlan(readJson(resolve(contractPath)), resolve(sourcePath));
    const result = verifyScreenHandoff(plan, visualPath ? resolve(visualPath) : undefined);
    console.log(JSON.stringify({ status: result.status, fingerprint: result.fingerprint, previewUrl: plan.url, limitation: result.limitation }, null, 2));
  } catch (error) { console.error(String(error)); process.exitCode = 1; }
}
