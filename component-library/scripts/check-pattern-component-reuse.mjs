import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const patternDirectory = join(process.cwd(), "src", "components", "patterns");
const forbidden = [
  ["lucide-react", "패턴에서 Lucide를 직접 가져오지 말고 MES 아이콘 컴포넌트를 사용하세요."],
  ["<button", "패턴에서 raw button을 만들지 말고 Button/IconButton을 사용하세요."],
  ["<input", "패턴에서 raw input을 만들지 말고 Input/Radio/Checkbox를 사용하세요."],
  ["<select", "패턴에서 raw select를 만들지 말고 Select를 사용하세요."],
  ["<table", "패턴에서 raw table을 만들지 말고 Table을 사용하세요."],
  ["SmallButton", "Button의 중복 구현은 허용되지 않습니다."],
  ["RadioLine", "Radio의 중복 구현은 허용되지 않습니다."],
  ["CheckboxGlyph", "Checkbox의 중복 구현은 허용되지 않습니다."],
  ["ControlBox", "Input/Select의 중복 구현은 허용되지 않습니다."],
  ["DenseTable", "Table의 중복 구현은 허용되지 않습니다."],
];

const violations = [];
for (const file of readdirSync(patternDirectory).filter((name) => name.endsWith(".tsx"))) {
  const source = readFileSync(join(patternDirectory, file), "utf8");
  for (const [needle, message] of forbidden) {
    if (source.includes(needle)) violations.push(`${file}: ${message} (${needle})`);
  }
}

if (violations.length > 0) {
  console.error(["Pattern component reuse check failed:", ...violations.map((item) => `- ${item}`)].join("\n"));
  process.exit(1);
}

console.log("Pattern component reuse check passed.");
