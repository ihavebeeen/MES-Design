import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultProjectRoot = resolve(scriptDirectory, "..");
const previewRoutePattern = /^\/preview\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const localManifestRelativePath = "public/.mes-ui-preview/index.json";

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
    throw new Error("미리보기 route는 '/preview/<영문-소문자-ID>' 형식이어야 합니다.");
  }

  const relativePath = `src/app/preview/${routeMatch[1]}/page.tsx`;
  const absolutePath = resolve(projectRoot, ...relativePath.split("/"));
  const componentImport = normalizeSourceImport(projectRoot, outputPath);
  const source = generateScreenPreviewSource(contract, componentImport);
  const baseUrl = (options.baseUrl ?? "http://localhost:3000").replace(/\/$/, "");
  return {
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

function writeLocalDraftManifest(plan) {
  const manifestPath = resolve(plan.projectRoot, ...localManifestRelativePath.split("/"));
  let manifest = { schemaVersion: 1, drafts: [] };
  if (existsSync(manifestPath)) {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (parsed?.schemaVersion === 1 && Array.isArray(parsed.drafts)) manifest = parsed;
  }
  const previous = manifest.drafts.find((draft) => draft.id === plan.manifestEntry.id);
  const now = new Date().toISOString();
  const entry = {
    ...plan.manifestEntry,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
  manifest.drafts = [...manifest.drafts.filter((draft) => draft.id !== entry.id), entry]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

export function writeScreenPreview(plan) {
  let created = false;
  if (existsSync(plan.absolutePath)) {
    if (readFileSync(plan.absolutePath, "utf8") !== plan.source) {
      throw new Error(`기존 미리보기 파일을 덮어쓰지 않습니다: ${plan.relativePath}`);
    }
  } else {
    mkdirSync(dirname(plan.absolutePath), { recursive: true });
    writeFileSync(plan.absolutePath, plan.source, { encoding: "utf8", flag: "wx" });
    created = true;
  }
  writeLocalDraftManifest(plan);
  return { created };
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
