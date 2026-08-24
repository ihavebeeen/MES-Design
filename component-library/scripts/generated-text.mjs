export function normalizeLineEndings(value) {
  return value.replace(/\r\n?/g, "\n");
}

export function generatedTextMatches(actual, expected) {
  return normalizeLineEndings(actual) === normalizeLineEndings(expected);
}

