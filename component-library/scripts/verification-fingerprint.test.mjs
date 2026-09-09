import assert from "node:assert/strict";
import test from "node:test";
import { fingerprintText, normalizeVerificationPath } from "./verification-fingerprint.mjs";

test("verification text fingerprints are identical for LF, CRLF and CR", () => {
  const expected = fingerprintText("first\nsecond\n");
  assert.equal(fingerprintText("first\r\nsecond\r\n"), expected);
  assert.equal(fingerprintText("first\rsecond\r"), expected);
});

test("verification paths use the same separator on Windows and GitHub runners", () => {
  assert.equal(normalizeVerificationPath("tests\\visual\\screen.spec.ts"), "tests/visual/screen.spec.ts");
  assert.equal(normalizeVerificationPath("tests/visual/screen.spec.ts"), "tests/visual/screen.spec.ts");
});
