import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveScreenRequest } from "../../scripts/resolve-screen-request.mjs";
import { generateScreenTsx } from "../../scripts/generate-screen-tsx.mjs";
import { createScreenPreviewPlan, writeScreenPreview } from "../../scripts/generate-screen-preview.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export function prepareApplicationFlowFixtures() {
  const generatedRoot = resolve(root, "src/generated-previews");
  mkdirSync(generatedRoot, { recursive: true });
  const directory = mkdtempSync(resolve(generatedRoot, "application-flow-"));
  const prefix = directory.split(/[\\/]/).at(-1).toLowerCase();
  const cases = [];
  const cleanup = () => {
    // Only this run's freshly created fixture directory and exact preview/receipt dirs.
    if (dirname(directory) !== generatedRoot || !/^application-flow-[a-z0-9]+$/i.test(prefix)) throw new Error("Unexpected fixture cleanup scope");
    for (const entry of cases) {
      rmSync(dirname(entry.plan.absolutePath), { recursive: true, force: true });
      rmSync(resolve(root, ".mes-ui-preview", entry.contract.request.requestId), { recursive: true, force: true });
    }
    rmSync(directory, { recursive: true, force: true });
  };
  try {
    for (const [kind, file] of [["center", "deterministic-center-modal"], ["slide", "deterministic-side-slide"], ["page", "deterministic-entity-list"]]) {
      const request = JSON.parse(readFileSync(resolve(root, `tests/fixtures/screen-requests/${file}.json`), "utf8"));
      request.requestId = `${prefix}-${kind}`;
      request.output.route = `/preview/${request.requestId}`;
      const contract = resolveScreenRequest(request);
      const outputPath = resolve(directory, `${kind}.tsx`);
      const plan = createScreenPreviewPlan(contract, outputPath);
      if (existsSync(plan.absolutePath) || existsSync(resolve(root, ".mes-ui-preview", request.requestId))) throw new Error("Refuse existing QA artifacts");
      cases.push({ kind, contract, outputPath, plan });
      writeFileSync(outputPath, generateScreenTsx(contract), { flag: "wx" });
      writeScreenPreview(plan);
    }
    return { cases, cleanup };
  } catch (error) { cleanup(); throw error; }
}
