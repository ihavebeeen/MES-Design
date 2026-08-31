import { existsSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { slideExampleRequests } from "../../scripts/sync-slide-composition-examples.mjs";
import { resolveScreenRequest } from "../../scripts/resolve-screen-request.mjs";
import { generateScreenTsx } from "../../scripts/generate-screen-tsx.mjs";
import { createScreenPreviewPlan, writeScreenPreview } from "../../scripts/generate-screen-preview.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export function prepareSlideCompositionFixtures() {
  const parent = resolve(root, "src/generated-previews");
  mkdirSync(parent, { recursive: true });
  const directory = mkdtempSync(resolve(parent, "slide-compositions-"));
  const prefix = directory.split(/[\\/]/).at(-1).toLowerCase();
  const cases = [];
  const cleanup = () => {
    if (dirname(directory) !== parent || !/^slide-compositions-[a-z0-9]+$/i.test(prefix)) throw new Error("Unsafe QA cleanup");
    for (const entry of cases) {
      rmSync(dirname(entry.plan.absolutePath), { recursive: true, force: true });
      rmSync(resolve(root, ".mes-ui-preview", entry.request.requestId), { recursive: true, force: true });
    }
    rmSync(directory, { recursive: true, force: true });
  };
  try {
    for (const request of slideExampleRequests()) {
      const name = request.output.componentName;
      request.requestId = prefix + "-" + request.requestId;
      request.output.route = "/preview/" + request.requestId;
      const contract = resolveScreenRequest(request);
      const outputPath = resolve(directory, name + ".tsx");
      const plan = createScreenPreviewPlan(contract, outputPath);
      if (existsSync(plan.absolutePath)) throw new Error("Refuse existing QA preview");
      cases.push({ name, request, contract, plan });
      writeFileSync(outputPath, generateScreenTsx(contract), { flag: "wx" });
      writeScreenPreview(plan);
    }
    return { cases, cleanup };
  } catch (error) { cleanup(); throw error; }
}
