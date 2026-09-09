import { createHash } from "node:crypto";
import fs from "node:fs";

export function normalizeVerificationPath(value) {
  return value.replaceAll("\\", "/");
}

export function fingerprintText(value) {
  const normalized = value.replace(/\r\n?/g, "\n");
  return createHash("sha256").update(normalized).digest("hex");
}

export function fingerprintTextFile(filePath) {
  return fingerprintText(fs.readFileSync(filePath, "utf8"));
}

export function fingerprintBinaryFile(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}
