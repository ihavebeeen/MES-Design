import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { recordPreviewAudit } from "./screen-handoff.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultProjectRoot = resolve(scriptDirectory, "..");
const previewRoutePattern = /^\/preview\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
function checkRealContainment(root, path) {
  let ancestor = path;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  const rel = relative(realpathSync(root), realpathSync(ancestor));
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error("심볼릭 링크를 통한 외부 미리보기 경로는 허용하지 않습니다.");
}

function normalizeSourceImport(projectRoot, outputPath) {
  const absolutePath = isAbsolute(outputPath) ? outputPath : resolve(projectRoot, outputPath);
  const relativePath = relative(projectRoot, absolutePath);
  if (relativePath.startsWith(`..${sep}`) || relativePath === ".." || isAbsolute(relativePath)) {
    throw new Error("미리보기 대상 화면은 component-library 안에 있어야 합니다.");
  }
  const normalized = relativePath.split(sep).join("/");
  if (!normalized.startsWith("src/")) throw new Error("미리보기 대상 화면은 component-library/src/ 아래에 있어야 합니다.");
  if (!/\.(?:tsx|jsx)$/.test(normalized)) throw new Error("미리보기 대상 화면은 .tsx 또는 .jsx 파일이어야 합니다.");
  checkRealContainment(projectRoot, absolutePath);
  return `@/${normalized.slice(4).replace(/\.(?:tsx|jsx)$/, "")}`;
}

export function generateScreenPreviewSource(contract, componentImport) {
  const componentName = contract?.request?.output?.componentName;
  const targetKind = contract?.request?.target?.kind;
  if (!componentName) throw new Error("미리보기 생성에 output.componentName이 필요합니다.");

  if (targetKind === "page") {
    return `import { ${componentName} } from ${JSON.stringify(componentImport)};\n\nexport default function GeneratedScreenPreviewPage() {\n  return <${componentName} />;\n}\n`;
  }

  if (!["center-modal", "side-slide-panel", "confirm-dialog"].includes(targetKind)) {
    throw new Error(`미리보기를 지원하지 않는 target.kind입니다: ${targetKind ?? "없음"}`);
  }

  return `"use client";\n\nimport * as React from "react";\nimport { Button } from "@/components/ui/button";\nimport { ${componentName} } from ${JSON.stringify(componentImport)};\n\nexport default function GeneratedScreenPreviewPage() {\n  const [open, setOpen] = React.useState(true);\n\n  return (\n    <main className="min-h-screen bg-mes-gray-10">\n      {!open && (\n        <div className="flex min-h-screen items-center justify-center">\n          <Button variant="fillMain" onClick={() => setOpen(true)}>다시 열기</Button>\n        </div>\n      )}\n      <${componentName} open={open} onOpenChange={setOpen} />\n    </main>\n  );\n}\n`;
}

export function createScreenPreviewPlan(contract, outputPath, options = {}) {
  const projectRoot = resolve(options.projectRoot ?? defaultProjectRoot);
  const route = contract?.request?.output?.route;
  const routeMatch = typeof route === "string" ? route.match(previewRoutePattern) : null;
  if (!routeMatch) {
    throw new Error("미리보기 route는 '/preview/<영문-소문자-ID>' 형식이어야 합니다.");
  }

  const relativePath = `src/app/preview/${routeMatch[1]}/page.tsx`;
  const absolutePath = resolve(projectRoot, ...relativePath.split("/"));
  checkRealContainment(projectRoot, absolutePath);
  const componentImport = normalizeSourceImport(projectRoot, outputPath);
  const source = generateScreenPreviewSource(contract, componentImport);
  const baseUrl = (options.baseUrl ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    contract: structuredClone(contract),
    outputPath: resolve(projectRoot, outputPath),
    purpose: "internal-qa",
    projectRoot,
    route,
    relativePath,
    absolutePath,
    componentImport,
    source,
    url: `${baseUrl}${route}`,
    manifestEntry: {
      id: contract.request.requestId,
      name: contract.request.name,
      title: contract.request.target.title,
      targetKind: contract.request.target.kind,
      route,
      source: componentImport,
      persistence: "local",
      reviewStatus: "draft",
      generationInfluence: "blocked",
    },
  };
}

export function writeScreenPreview(plan) {
  const canonical = createScreenPreviewPlan(plan.contract, plan.outputPath, { projectRoot: plan.projectRoot });
  for (const field of ["absolutePath", "relativePath", "componentImport", "source", "route"]) {
    if (plan[field] !== canonical[field]) throw new Error(`미리보기 계획이 변경됐습니다: ${field}`);
  }
  let created = false;
  if (existsSync(plan.absolutePath)) {
    if (readFileSync(plan.absolutePath, "utf8") !== plan.source) {
      throw new Error(`기존 미리보기 파일을 덮어쓰지 않습니다: ${plan.relativePath}`);
    }
  }
  // Audit the bytes that will actually be imported, not generator output in memory.
  const review = recordPreviewAudit(canonical);
  if (!existsSync(plan.absolutePath)) {
    mkdirSync(dirname(plan.absolutePath), { recursive: true });
    writeFileSync(plan.absolutePath, plan.source, { encoding: "utf8", flag: "wx" });
    created = true;
  }
  // No public catalog registration: rendering is internal QA, not a handoff pass.
  return { created, purpose: "internal-qa", handoffReady: false, ...review };
}

function runCli() {
  const [contractInput, sourceInput] = process.argv.slice(2);
  if (!contractInput || !sourceInput) {
    throw new Error("사용법: npm run screen:preview -- <contract.json> <src/screen.tsx>");
  }
  const contractPath = resolve(process.cwd(), contractInput);
  const sourcePath = resolve(process.cwd(), sourceInput);
  if (!existsSync(contractPath)) throw new Error(`계약 파일을 찾을 수 없습니다: ${contractPath}`);
  if (!existsSync(sourcePath)) throw new Error(`화면 파일을 찾을 수 없습니다: ${sourcePath}`);
  const contract = JSON.parse(readFileSync(contractPath, "utf8"));
  const plan = createScreenPreviewPlan(contract, sourcePath);
  const result = writeScreenPreview(plan);
  console.log(`[screen:preview:internal-qa] ${result.created ? "created" : "existing"} · ${plan.relativePath} · QA 전용 ${plan.url}\n실제 렌더링·동작 확인 후 screen:handoff --reviewed 필요. 기록 자동 저장 위치: ${result.paths.visual}`);
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    runCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
