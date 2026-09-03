import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { normalizeLineEndings } from "./generated-text.mjs";
import { buildOutputs } from "./sync-design-system-assets.mjs";

const digest = (value) => createHash("sha256").update(value).digest("hex");
const readLf = (filePath) => normalizeLineEndings(readFileSync(filePath, "utf8"));
const baseline = buildOutputs({ readSource: readLf });

test("component fingerprints use the LF source representation", () => {
  for (const component of baseline.components) {
    const source = readLf(new URL(`../${component.source}`, import.meta.url));
    assert.equal(component.sourceFacts.sourceFingerprint, digest(source), component.id);
  }
});

const lineEndingVariants = {
  CRLF: (source) => source.replace(/\n/g, "\r\n"),
  CR: (source) => source.replace(/\n/g, "\r"),
  mixed: (source) => source.split("\n").map((line, index, lines) => (
    line + (index === lines.length - 1 ? "" : ["\n", "\r\n"][index % 2])
  )).join(""),
};

for (const [name, convert] of Object.entries(lineEndingVariants)) {
  test(`${name} sources produce the same manifest and documents as LF`, () => {
    const actual = buildOutputs({ readSource: (filePath) => convert(readLf(filePath)) });
    // Compare digests to keep regression output compact if a large manifest differs.
    assert.equal(digest(actual.manifest), digest(baseline.manifest), "asset manifest differs");
    assert.deepEqual(actual.docs, baseline.docs, "component documents differ");
    assert.equal(actual.docsIndex, baseline.docsIndex);
    assert.equal(actual.readme, baseline.readme);
  });
}

for (const [name, suffix] of Object.entries({ content: "\n// changed source\n", whitespace: " " })) {
  test(`${name} changes still invalidate component and manifest fingerprints`, () => {
    const changed = buildOutputs({ readSource: (filePath) => readLf(filePath) + suffix });
    assert.notEqual(JSON.parse(changed.manifest).fingerprint, JSON.parse(baseline.manifest).fingerprint);
    for (let index = 0; index < baseline.components.length; index += 1) {
      assert.notEqual(
        changed.components[index].sourceFacts.sourceFingerprint,
        baseline.components[index].sourceFacts.sourceFingerprint,
        baseline.components[index].id,
      );
    }
  });
}
