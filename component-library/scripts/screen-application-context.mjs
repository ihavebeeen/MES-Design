import { existsSync, realpathSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

export function validateHostPage(host, kind) {
  if (host === undefined) return []; // Code-only fragment audits are allowed, not whole-screen delivery.
  const errors = [];
  if (!host || typeof host !== "object" || Array.isArray(host)) return ["hostPage 객체가 필요합니다."];
  if (kind === "page") errors.push("page는 자체 공통 틀을 사용하며 hostPage를 중첩하지 않습니다.");
  for (const key of Object.keys(host)) if (!["sourcePath", "componentName", "triggerLabel", "saveBehavior"].includes(key)) errors.push(`알 수 없는 hostPage.${key}`);
  if (typeof host.sourcePath !== "string" || !/^src\/(?:[\w-]+\/)*[\w-]+\.(?:tsx|jsx)$/.test(host.sourcePath)) errors.push("hostPage.sourcePath는 src/ 아래 TSX/JSX 경로여야 합니다.");
  if (!/^[A-Z][A-Za-z0-9]*$/.test(host.componentName ?? "")) errors.push("hostPage.componentName은 PascalCase export여야 합니다.");
  if (typeof host.triggerLabel !== "string" || !host.triggerLabel.trim()) errors.push("hostPage.triggerLabel이 필요합니다.");
  if (!["notify-parent", "none"].includes(host.saveBehavior)) errors.push("hostPage.saveBehavior는 notify-parent 또는 none이어야 합니다.");
  return errors;
}

export function hostPagePath(request, root) {
  const errors = validateHostPage(request.hostPage, request.target?.kind);
  if (errors.length) throw new Error(errors.join("\n"));
  if (!request.hostPage) throw new Error("팝업 전체 화면 미리보기에는 hostPage가 필요합니다. 배경 업무 페이지와 열기 위치를 연결하세요.");
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
