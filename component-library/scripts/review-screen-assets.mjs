import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readRegistryBundle } from "./resolve-screen-request.mjs";
import { reviewScreenAssetSelection } from "./screen-asset-selection.mjs";

function runCli() {
  const [input] = process.argv.slice(2);
  if (!input) {
    console.error("사용법: npm run screen:match-assets -- <semantic-assets.json>");
    process.exitCode = 1;
    return;
  }
  const inputPath = resolve(process.cwd(), input);
  if (!existsSync(inputPath)) {
    console.error(`의미 자산 검토 파일을 찾을 수 없습니다: ${inputPath}`);
    process.exitCode = 1;
    return;
  }
  const result = reviewScreenAssetSelection(JSON.parse(readFileSync(inputPath, "utf8")), readRegistryBundle());
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  console.error(`[screen:match-assets] ${result.status} · blockers ${result.blockerCount} · warnings ${result.warningCount} · unreviewed ${result.unreviewedCategories.length}`);
  if (result.blockerCount > 0) process.exitCode = 1;
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) runCli();
