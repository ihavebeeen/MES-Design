import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultProjectRoot = resolve(scriptDirectory, "..");
const previewRoutePattern = /^\/generated-screens\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

function normalizeSourceImport(projectRoot, outputPath) {
  const absolutePath = isAbsolute(outputPath) ? outputPath : resolve(projectRoot, outputPath);
  const relativePath = relative(projectRoot, absolutePath);
  if (relativePath.startsWith(`..${sep}`) || relativePath === ".." || isAbsolute(relativePath)) {
    throw new Error("미리보기 대상 화면은 component-library 안에 있어야 합니다.");
  }
  const normalized = relativePath.split(sep).join("/");
  if (!normalized.startsWith("src/")) throw new Error("미리보기 대상 화면은 component-library/src/ 아래에 있어야 합니다.");
  if (!/\.(?:tsx|jsx)$/.test(normalized)) throw new Error("미리보기 대상 화면은 .tsx 또는 .jsx 파일이어야 합니다.");
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
    throw new Error("미리보기 route는 '/generated-screens/<영문-소문자-ID>' 형식이어야 합니다.");
  }

  const relativePath = `src/app/generated-screens/${routeMatch[1]}/page.tsx`;
  const absolutePath = resolve(projectRoot, ...relativePath.split("/"));
  const componentImport = normalizeSourceImport(projectRoot, outputPath);
  const source = generateScreenPreviewSource(contract, componentImport);
  const baseUrl = (options.baseUrl ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    route,
    relativePath,
    absolutePath,
    componentImport,
    source,
    url: `${baseUrl}${route}`,
  };
}

export function writeScreenPreview(plan) {
  if (existsSync(plan.absolutePath)) {
    if (readFileSync(plan.absolutePath, "utf8") === plan.source) return { created: false };
    throw new Error(`기존 미리보기 파일을 덮어쓰지 않습니다: ${plan.relativePath}`);
  }
  mkdirSync(dirname(plan.absolutePath), { recursive: true });
  writeFileSync(plan.absolutePath, plan.source, { encoding: "utf8", flag: "wx" });
  return { created: true };
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
  console.log(`[screen:preview] ${result.created ? "created" : "existing"} · ${plan.relativePath} · ${plan.url}`);
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    runCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
