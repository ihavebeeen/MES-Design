import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const catalog = JSON.parse(read("src/design-system/registry/component-catalog.json"));
const clientPage = read("src/app/[...slug]/client-page.tsx");
const promotedCatalog = read("src/components/catalog/promoted-standard-catalog.tsx");
const registryShowcase = read("src/components/catalog/registry-component-showcase.tsx");
const registryDocumentation = read("src/components/catalog/registry-component-documentation.tsx");

const catalogIds = catalog.groups.flatMap((group) => group.itemIds);
const manualIds = [...clientPage.matchAll(/<(?:section|Section|WidePatternSection)\s+[^>]*id="([^"]+)"/g)].map((match) => match[1]);
const promotedIds = [...promotedCatalog.matchAll(/^\s{2}"?([a-z0-9-]+)"?: \{ title:/gm)].map((match) => match[1]);
const showcaseArray = registryShowcase.match(/REGISTRY_SHOWCASE_IDS = \[([\s\S]*?)\] as const/);
assert(showcaseArray, "REGISTRY_SHOWCASE_IDS를 읽을 수 없습니다.");
const showcaseIds = [...showcaseArray[1].matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
const renderedIds = new Set([...manualIds, ...promotedIds, ...showcaseIds]);
const missingIds = catalogIds.filter((id) => !renderedIds.has(id));

assert.deepEqual(missingIds, [], `실제 컴포넌트 예시가 없는 상세 경로: ${missingIds.join(", ")}`);
assert(registryDocumentation.includes("data-component-api={component.id}"), "상세 화면의 사용 코드/API 영역이 누락됐습니다.");
assert(registryDocumentation.includes("<Accordion"), "선택 맥락과 내부 원장 정보는 접기 영역으로 제공해야 합니다.");
assert(registryDocumentation.includes('id: "selection-context"'), "선택 맥락 접기 항목이 누락됐습니다.");
assert(registryDocumentation.includes('id: "internal-registry"'), "내부 원장 정보 접기 항목이 누락됐습니다.");
assert(
  clientPage.lastIndexOf("<RegistryComponentDocumentation") > clientPage.indexOf("<RegistryComponentShowcase"),
  "선택 맥락 문서는 실제 컴포넌트 예시보다 뒤에 렌더링해야 합니다.",
);

console.log(`Component catalog detail check passed: ${catalogIds.length}/${catalogIds.length} routes have a rendered example, API reference, and trailing selection context.`);
