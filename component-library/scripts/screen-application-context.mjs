import { existsSync, realpathSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

export const surfacePreviewFrame = "src/components/preview/surface-preview-frame.tsx";

export function verificationContext(request) {
  const scope = request?.verificationScope ?? (request?.hostPage ? "connected-flow" : "surface");
  return {
    scope,
    hostConnected: Boolean(request?.hostPage),
    parentIntegration: request?.target?.kind === "page" ? "not-applicable" : scope === "connected-flow" ? "included" : "out-of-scope",
  };
}

export function validateVerificationScope(request) {
  const errors = [];
  if (request?.verificationScope !== undefined && !["surface", "connected-flow"].includes(request.verificationScope)) return ["verificationScope는 surface 또는 connected-flow여야 합니다."];
  if (verificationContext(request).scope === "connected-flow") {
    if (request?.target?.kind === "page") errors.push("connected-flow는 부모 페이지와 팝업의 연결 검증 범위입니다.");
    if (!request?.hostPage) errors.push("목록/팝업 연동 검증에는 hostPage가 필요합니다. 팝업 자체 작업과 구분하세요.");
  }
  return errors;
}

export function validateHostPage(host, kind) {
  if (host === undefined) return []; // Surface work does not require a business parent.
  const errors = [];
  if (!host || typeof host !== "object" || Array.isArray(host)) return ["hostPage 객체가 필요합니다."];
  if (kind === "page") errors.push("page는 자체 공통 틀을 사용하며 hostPage를 중첩하지 않습니다.");
  for (const key of Object.keys(host)) if (!["sourcePath", "componentName", "triggerLabel", "saveBehavior", "pagePatternRef", "entryBehavior", "entryReason"].includes(key)) errors.push(`알 수 없는 hostPage.${key}`);
  if (typeof host.sourcePath !== "string" || !/^src\/(?:[\w-]+\/)*[\w-]+\.(?:tsx|jsx)$/.test(host.sourcePath)) errors.push("hostPage.sourcePath는 src/ 아래 TSX/JSX 경로여야 합니다.");
  if (!/^[A-Z][A-Za-z0-9]*$/.test(host.componentName ?? "")) errors.push("hostPage.componentName은 PascalCase export여야 합니다.");
  if (typeof host.triggerLabel !== "string" || !host.triggerLabel.trim()) errors.push("hostPage.triggerLabel이 필요합니다.");
  if (!["notify-parent", "none"].includes(host.saveBehavior)) errors.push("hostPage.saveBehavior는 notify-parent 또는 none이어야 합니다.");
  if (host.pagePatternRef !== undefined && (typeof host.pagePatternRef !== "string" || !host.pagePatternRef.trim())) errors.push("hostPage.pagePatternRef는 비어 있지 않은 문자열이어야 합니다.");
  if (host.entryBehavior !== undefined && !["row-double-click", "explicit-action"].includes(host.entryBehavior)) errors.push("hostPage.entryBehavior는 row-double-click 또는 explicit-action이어야 합니다.");
  if (host.entryReason !== undefined && (typeof host.entryReason !== "string" || !host.entryReason.trim())) errors.push("hostPage.entryReason은 비어 있지 않은 문자열이어야 합니다.");
  return errors;
}

export function hostPagePath(request, root) {
  const errors = validateHostPage(request.hostPage, request.target?.kind);
  if (errors.length) throw new Error(errors.join("\n"));
  if (!request.hostPage) throw new Error("목록/팝업 연동 검증에는 hostPage가 필요합니다.");
  const path = resolve(root, request.hostPage.sourcePath);
  if (!existsSync(path)) throw new Error(`배경 업무 페이지를 찾을 수 없습니다: ${request.hostPage.sourcePath}`);
  const rel = relative(realpathSync(resolve(root, "src")), realpathSync(path));
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error("배경 업무 페이지의 외부 경로/심볼릭 링크는 허용하지 않습니다.");
  return path;
}

export function missingApplicationChrome(implementation, registry) {
  const ids = registry.contextRules?.applicationFrame?.requiredComponents;
  if (!Array.isArray(ids) || !ids.length) return ["공통 페이지 틀 정책 누락"];
  return ids.flatMap(id => {
    const asset = registry.components.find(entry => entry.id === id);
    return asset && implementation.uses.has(asset.name) ? [] : [asset?.name ?? id];
  });
}
