import assert from "node:assert/strict";
import { test } from "node:test";
import { getBusinessTaskContext, loadBusinessKnowledge, validateBusinessKnowledge } from "./business-knowledge.mjs";

const data = loadBusinessKnowledge();

test("every reviewed semantic source has a task, with valid citations", () => {
  assert.deepEqual(validateBusinessKnowledge(data), []);
});

test("lookup returns a scoped reference, not the whole catalog or a layout", () => {
  const result = getBusinessTaskContext(data, "receiving.register");
  assert.equal(result.task.id, "receiving.register");
  assert.ok(result.sources.length < data.sources.length);
  assert.equal(result.generationUse.runtimeWired, false);
  assert.equal(result.status, "research-reference");
  assert.equal(result.task.shell, undefined);
  assert.equal(result.task.focusCandidates.status, "design-interpretation-not-fixed-priority");
});

test("lookup includes applicable unresolved questions and independent settings", () => {
  const result = getBusinessTaskContext(data, "receiving.register");
  assert.ok(result.openQuestions.some(q => q.id === "matching.exact-keys"));
  assert.ok(result.openQuestions.some(q => q.id === "receiving.simple-edit"));
  assert.ok(!result.openQuestions.some(q => q.id === "collections.delete"));
  assert.ok(result.crossTaskFacts.some(f => f.id === "registration.independent-axes"));
});

test("automatic defaults remain editable independently of necessity and scope", () => {
  const fields = getBusinessTaskContext(data, "receiving.register").task.informationModel.fields;
  const supplier = fields.find(f => f.id === "supplier");
  assert.ok(supplier.acquisition.includes("upstream-default"));
  assert.equal(supplier.editable, true);
  assert.equal(supplier.required, "always");
  assert.equal(supplier.scope, "row");
  assert.equal(fields.find(f => f.id === "unit").editable, false);
});

test("bad citation, duplicate ID, unknown relation and orphan source fail integrity checks", () => {
  for (const change of [
    d => { d.tasks[0].sourceRefs[0].sourceId = "unknown"; },
    d => { d.tasks[0].sourceRefs[0].sections = ["999"]; },
    d => { d.tasks[1].id = d.tasks[0].id; },
    d => { d.tasks[0].relatedTasks.push("unknown"); },
    d => { d.tasks = d.tasks.filter(t => t.id !== "dashboard.monitor"); },
  ]) {
    const changed = structuredClone(data);
    change(changed);
    assert.ok(validateBusinessKnowledge(changed).length > 0);
  }
});

test("unknown tasks or invalid registries cannot silently fall back", () => {
  assert.throws(() => getBusinessTaskContext(data, "new-unregistered-task"), /Unknown business task/);
  const changed = structuredClone(data);
  changed.sources[0].url = "missing";
  assert.throws(() => getBusinessTaskContext(changed, "receiving.register"), /invalid source URL/);
});

test("duplicates and unread historical pages are not promoted to current evidence", () => {
  const copy = data.sources.find(s => s.id === "purchase-orders-copy");
  assert.equal(copy.disposition, "duplicate");
  assert.equal(copy.duplicateOf, "purchase-orders");
  assert.ok(data.unreviewedLinkedPages.every(p => p.status === "not-read"));
  assert.ok(data.generationExamples.every(e => e.status === "reasoning-example-not-generated-or-user-approved"));
});
