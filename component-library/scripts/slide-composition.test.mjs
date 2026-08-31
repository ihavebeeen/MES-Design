import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";
import { z } from "zod";
import { slideCompositionSchema, validateSlideComposition } from "./slide-composition-contract.mjs";
import { resolveScreenRequest } from "./resolve-screen-request.mjs";
import { generateScreenTsx } from "./generate-screen-tsx.mjs";
import { auditScreenImplementation } from "./audit-screen-implementation.mjs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const examples = JSON.parse(read("../src/design-system/registry/slide-composition-examples.json")).requests;
const code = ts.transpileModule(read("../src/design-system/slide-composition.ts"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { slideInitialDraft, slideCanSave, slideAddRecord, slideEditRecord } = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"));
const config = () => structuredClone(examples[2].generation);
const list = c => c.sections.find(s => s.kind === "record-list");

for (const request of examples) test(request.requestId + ": resolves, generates deterministically and audits real dependencies", () => {
  assert.deepEqual(validateSlideComposition(request.generation), []);
  const contract = resolveScreenRequest(request);
  assert.equal(contract.quality.blockerCount, 0, JSON.stringify(contract.quality.issues));
  const source = generateScreenTsx(contract);
  assert.equal(source, generateScreenTsx(resolveScreenRequest(request)));
  const audit = auditScreenImplementation(contract, source);
  assert.equal(audit.blockerCount, 0, JSON.stringify(audit.findings));
  assert.match(source, /<SideSlidePanel/);
});

for (const methods of [["blank-row"], ["entry-form"], ["blank-row", "entry-form"]]) test("independent addition methods: " + methods.join(" + "), () => {
  const c = config(); list(c).addMethods = methods;
  if (!methods.includes("entry-form")) c.sections = c.sections.filter(s => s.kind !== "entry-form");
  if (!methods.includes("blank-row")) list(c).editableFields = [];
  assert.deepEqual(validateSlideComposition(c), []);
  let d = slideInitialDraft(c);
  if (methods.includes("blank-row")) {
    d = slideAddRecord(c, d, "blank-row", "rowA");
    assert.equal(d.records.length, 1);
    assert.equal(slideCanSave(c, d), false);
    d = slideEditRecord(c, d, "rowA", "item", "품목A");
    d = slideEditRecord(c, d, "rowA", "quantity", "5");
    assert.equal(slideCanSave(c, d), true);
  } else assert.equal(slideAddRecord(c, d, "blank-row", "rowA"), d);
  if (methods.includes("entry-form")) {
    d.entry = { item: "품목B", quantity: "7", warehouse: "외주창고" };
    assert.equal(slideCanSave(c, d), false, "unadded entry must not silently disappear");
    d = slideAddRecord(c, d, "entry-form", "rowB");
    assert.equal(d.records.at(-1).values.quantity, "7");
    assert.equal(d.entry.item, "");
    assert.equal(d.entry.warehouse, "외주창고");
    assert.equal(slideCanSave(c, d), true);
    assert.equal(d.records.length, methods.length, "both paths append to the same list");
    assert.equal(slideAddRecord(c, d, "entry-form", "rowB"), d, "duplicate ids do not overwrite rows");
  } else assert.equal(slideAddRecord(c, d, "entry-form", "rowB"), d);
});
test("post-add edit permission is independent from entry-form addition", () => {
  const c = config(); list(c).addMethods = ["entry-form"]; list(c).editableFields = ["quantity"];
  let d = slideInitialDraft(c);
  d.entry = { item: "품목", quantity: "2", warehouse: "본창고" };
  d = slideAddRecord(c, d, "entry-form", "rowA");
  assert.equal(slideEditRecord(c, d, "rowA", "item", "변경"), d);
  d = slideEditRecord(c, d, "rowA", "quantity", "0");
  assert.equal(slideCanSave(c, d), false);
});
test("editing only the inherited entry field is still a pending change", () => {
  const c = config(); let d = slideInitialDraft(c);
  d.entry = { item: "품목", quantity: "2", warehouse: "본창고" };
  d = slideAddRecord(c, d, "entry-form", "rowA"); d.entry.warehouse = "외주창고";
  assert.equal(slideCanSave(c, d), false);
});
test("invalid entry does not add; invalid row blocks Save", () => {
  const c = config(); const d = slideInitialDraft(c);
  assert.equal(slideAddRecord(c, d, "entry-form", "rowA"), d);
  for (const quantity of ["", "0", "-1", "NaN", "Infinity"]) {
    d.records = [{ id: "rowA", values: { item: "품목", quantity, warehouse: "본창고" } }];
    assert.equal(slideCanSave(c, d), false);
  }
});
test("unusable or contradictory configurations are rejected, not invented", () => {
  for (const mutate of [
    c => { list(c).addMethods = ["entry-form", "entry-form"]; },
    c => { list(c).editableFields = []; },
    c => { list(c).editableFields = ["missing"]; },
    c => { c.sections = c.sections.filter(s => s.kind !== "entry-form"); },
    c => { list(c).columns[0].control = "select"; list(c).columns[0].options = ["x"]; },
    c => { c.sections[1].inheritOnAdd = ["missing"]; },
    c => { list(c).columns[0].key = "delete"; },
  ]) { const c = config(); mutate(c); assert.ok(validateSlideComposition(c).length); }
});
test("JSON schema is generated from the same shape validator", () => {
  const actual = JSON.parse(read("../src/design-system/registry/screen-request.schema.json")).$defs.slideCompositionGeneration;
  const expected = z.toJSONSchema(slideCompositionSchema, { target: "draft-7" }); delete expected.$schema;
  assert.deepEqual(actual, expected);
});
