import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { getScreenReferences, getRequestReferences, loadReferenceSources, validateUsageContexts } from "./screen-reference-context.mjs";
import { contractFingerprint, readRegistryBundle, resolveScreenRequest } from "./resolve-screen-request.mjs";
import { generateScreenTsx } from "./generate-screen-tsx.mjs";
import { auditScreenImplementation } from "./audit-screen-implementation.mjs";

const read = name => JSON.parse(readFileSync(new URL(`../${name}`, import.meta.url), "utf8"));
const sources = loadReferenceSources();
const registry = readRegistryBundle();
const fixture = name => read(`tests/fixtures/screen-requests/${name}.json`);

test("usage references cover all desktop surfaces and point to real patterns/questions", () => {
  assert.deepEqual(sources.notices, []);
  assert.deepEqual(validateUsageContexts(sources.usage), []);
  assert.equal(sources.usage.authority, "reference-only");
  const ids = sources.usage.contexts.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  const patterns = new Set(registry.patterns.map(p => p.id));
  for (const c of sources.usage.contexts) {
    assert.ok(c.name && c.purpose && c.relationship && c.basis);
    assert.ok(c.consider.length && c.alternatives.length);
    for (const ref of c.patternRefs) assert.ok(patterns.has(ref), `${c.id}: unknown pattern ${ref}`);
    assert.equal(c.required, undefined);
    assert.equal(c.shellRef, undefined);
  }
  const questions = new Set(read("src/design-system/registry/screen-intake-policy.json").questions.map(q => q.id));
  for (const ref of sources.usage.informationGuide.intakeQuestionRefs) assert.ok(questions.has(ref));
  for (const targetKind of ["page", "center-modal", "side-slide-panel", "confirm-dialog"]) {
    const result = getScreenReferences({ targetKind }, sources);
    assert.equal(result.enforcement, "none");
    assert.ok(result.usage.length > 0);
    assert.ok(result.usage.every(c => c.surfaces.includes(targetKind)));
  }
});

test("business retrieval returns cited candidates without fixing primary/supporting roles", () => {
  const result = getScreenReferences({ query: "이지모드 입고 등록", targetKind: "side-slide-panel" }, sources);
  assert.equal(result.business.length, 1);
  const ref = result.business[0];
  assert.equal(ref.task.id, "receiving.register");
  assert.equal(ref.match, "name-candidate-not-confirmed");
  assert.equal(ref.task.focusCandidates.status, "design-interpretation-not-fixed-priority");
  assert.ok(ref.task.decisionSupportCandidates.includes("LOT 상세"));
  assert.ok(ref.sources.length > 0 && ref.sources.length < sources.business.sources.length);
  assert.ok(ref.openQuestions.length > 0); // Historical unknowns remain reference notes, not blockers.
  assert.equal(result.quality, undefined);
});

test("unknown tasks and absent reference sources return explicit absence, never unrelated defaults", () => {
  const missing = getScreenReferences({ taskIds: ["new-task"], usageIds: ["new-context"] }, sources);
  assert.deepEqual(missing.business, []);
  assert.deepEqual(missing.usage, []);
  assert.equal(missing.notices.length, 2);
  const unavailable = getScreenReferences({ query: "입고등록" }, { business: null, usage: null, notices: [{ source: "business", status: "unavailable" }] });
  assert.equal(unavailable.status, "unavailable");
  assert.equal(unavailable.enforcement, "none");
});

test("invalid reference research is disclosed rather than interpreted as authoritative", () => {
  const invalid = structuredClone(sources);
  invalid.business.tasks.find(t => t.id === "receiving.register").sourceRefs[0].sourceId = "unknown";
  const result = getScreenReferences({ taskIds: ["receiving.register"] }, invalid);
  assert.deepEqual(result.business, []);
  assert.equal(result.status, "partial");
  assert.ok(result.notices.some(n => n.status === "unavailable"));
});

test("explicit cross-surface references are allowed, list addition modes remain independent", () => {
  const result = getScreenReferences({ targetKind: "page", usageIds: ["usage.entry-list", "usage.inspection", "usage.custom-values", "usage.group-permissions"], limit: 12 }, sources);
  assert.equal(result.usage.length, 4);
  assert.ok(result.usage.every(c => !Object.hasOwn(c, "addMethods")));
});

test("reference corruption cannot crash screen annotation retrieval", () => {
  const invalid = structuredClone(sources);
  delete invalid.usage.contexts[0].patternRefs;
  assert.ok(validateUsageContexts(invalid.usage).length > 0);
  const result = getRequestReferences(fixture("deterministic-side-slide"), [], invalid);
  assert.equal(result.status, "unavailable");
  assert.equal(result.enforcement, "none");
  assert.ok(result.notices.length > 0);
});

test("CLI supplies the same scoped reference and allows new business IDs", () => {
  const script = fileURLToPath(new URL("./screen-reference-context.mjs", import.meta.url));
  for (const id of ["receiving.register", "new-unregistered-business"]) {
    const child = spawnSync(process.execPath, [script, "--task", id, "--usage", "usage.entry-list"], { encoding: "utf8" });
    assert.equal(child.status, 0, child.stderr);
    const result = JSON.parse(child.stdout);
    assert.deepEqual(result, getScreenReferences({ taskIds: [id], usageIds: ["usage.entry-list"] }, sources));
  }
});

test("reference lookup neither mutates the request nor sets required/readonly/layout", () => {
  const request = fixture("deterministic-side-slide");
  const before = structuredClone(request);
  getRequestReferences(request, ["section.editable-row-list"], sources);
  const resolved = resolveScreenRequest(request, registry);
  assert.deepEqual(request, before);
  assert.deepEqual(resolved.request.generation, before.generation);
  assert.ok(resolved.referenceContext.usage.length > 0);
  assert.equal(resolved.referenceContext.enforcement, "none");
});

test("page, center and slide generation work without a matching web example", () => {
  for (const name of ["deterministic-side-slide", "deterministic-center-modal", "deterministic-entity-list"]) {
    const request = fixture(name);
    const baseline = generateScreenTsx(resolveScreenRequest(request, registry));
    delete request.webContext;
    const resolved = resolveScreenRequest(request, registry);
    assert.equal(resolved.quality.blockerCount, 0, name);
    assert.equal(generateScreenTsx(resolved), baseline, "Removing references must not redesign the screen");
    assert.equal(auditScreenImplementation(resolved, baseline).blockerCount, 0);
  }
});

test("different or unknown observed layouts do not block or replace a valid MES shell", () => {
  const request = fixture("deterministic-side-slide");
  const baseline = generateScreenTsx(resolveScreenRequest(request, registry));
  for (const webContext of [
    { overlayGrammarRef: "generation.overlay.bounded-selection" },
    { overlayGrammarRef: "generation.overlay.not-yet-observed", sectionRecipeRefs: ["generation.section.future"] },
    { pageArchetypeRef: "generation.page.entity-list" },
  ]) {
    request.webContext = webContext;
    const resolved = resolveScreenRequest(request, registry);
    assert.equal(resolved.quality.blockerCount, 0);
    assert.equal(generateScreenTsx(resolved), baseline);
    assert.ok(resolved.quality.issues.filter(i => /web-|archetype|grammar/.test(i.code)).every(i => i.severity === "info"));
  }
});

test("reference annotation changes leave executable fingerprint intact; actual config changes do not", () => {
  const request = fixture("deterministic-side-slide");
  const contract = resolveScreenRequest(request, registry);
  const hash = contractFingerprint(contract);
  contract.referenceContext = { authority: "reference-only", status: "unavailable" };
  assert.equal(contractFingerprint(contract), hash);
  contract.request.requirements.push("현재 요청에서 확정한 새로운 조건");
  assert.notEqual(contractFingerprint(contract), hash);
});

test("MES asset and raw HTML violations remain blocked without any web references", () => {
  const request = fixture("deterministic-side-slide");
  delete request.webContext;
  const good = resolveScreenRequest(request, registry);
  const raw = generateScreenTsx(good).replace(/<Input\b/g, "<input");
  assert.ok(auditScreenImplementation(good, raw).blockerCount > 0);
  request.composition.shellRef = "shell.center-modal";
  assert.ok(resolveScreenRequest(request, registry).quality.blockerCount > 0);
  request.composition.shellRef = "shell.side-slide-panel";
  request.composition.recipeRefs = ["recipe.nonexistent-asset"];
  assert.ok(resolveScreenRequest(request, registry).quality.blockerCount > 0);
});
