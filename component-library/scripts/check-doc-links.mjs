import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const packageRoot = process.cwd();
const repositoryRoot = resolve(packageRoot, "..");
const documentRoot = join(repositoryRoot, "docs");
const rootDocuments = ["README.md", "AGENTS.md", "AGENTS.override.md", "CLAUDE.md"];

function collectMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectMarkdownFiles(path);
    return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
  });
}

function normalizeTarget(rawTarget) {
  const withoutTitle = rawTarget.trim().replace(/^<|>$/g, "").split(/\s+["']/)[0];
  return withoutTitle.split("#", 1)[0].split("?", 1)[0];
}

const files = [
  ...rootDocuments.map((name) => join(repositoryRoot, name)).filter(existsSync),
  ...collectMarkdownFiles(documentRoot),
];

const errors = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const rawTarget = match[1];
    if (/^(?:https?:|mailto:|data:|app:|#)/.test(rawTarget)) continue;
    const target = normalizeTarget(rawTarget);
    if (!target) continue;

    let decodedTarget = target;
    try {
      decodedTarget = decodeURIComponent(target);
    } catch {
      errors.push(`${relative(repositoryRoot, file)}: 해석할 수 없는 링크 ${rawTarget}`);
      continue;
    }

    const resolvedTarget = resolve(dirname(file), decodedTarget);
    if (!existsSync(resolvedTarget)) {
      errors.push(`${relative(repositoryRoot, file)}: 존재하지 않는 링크 ${rawTarget}`);
      continue;
    }
    if (decodedTarget.endsWith("/") && !statSync(resolvedTarget).isDirectory()) {
      errors.push(`${relative(repositoryRoot, file)}: 디렉터리가 아닌 링크 ${rawTarget}`);
    }
  }
}

if (errors.length) {
  console.error(["Documentation link check failed:", ...errors.map((error) => `- ${error}`)].join("\n"));
  process.exit(1);
}

console.log(`Documentation link check passed: ${files.length} markdown files.`);
