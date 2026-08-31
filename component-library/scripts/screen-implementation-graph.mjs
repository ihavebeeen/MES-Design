import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export const implementationRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const digest = (value) => createHash("sha256").update(value).digest("hex");
const codeExtension = /\.(?:[cm]?[jt]sx?)$/;
const canonical = (path) => realpathSync(path).replaceAll("\\", "/");

export function resolveLocalImport(specifier, importer, root = implementationRoot) {
  const base = specifier.startsWith("@/") ? resolve(root, "src", specifier.slice(2))
    : specifier.startsWith(".") ? resolve(dirname(importer), specifier) : null;
  if (!base) return null;
  for (const path of [base, ...[".tsx", ".ts", ".jsx", ".js", ".mjs", ".json", "/index.tsx", "/index.ts", "/index.js"].map((suffix) => base + suffix)]) {
    if (existsSync(path) && extname(path)) {
      try { readFileSync(path); return canonical(path); } catch { /* Try the next file candidate, not a directory. */ }
    }
  }
  throw new Error(`import를 확인할 수 없습니다: ${specifier} (${importer})`);
}

function approvedSources(registry, root) {
  return new Set([...registry.components, ...registry.patterns, { source: "src/components/icons/index.ts" }, { source: "src/components/icons/index.tsx" }]
    .filter((entry) => entry.source && !["excluded", "quarantined", "archived", "rejected"].includes(entry.status))
    .map((entry) => resolve(root, entry.source))
    .filter(existsSync).map(canonical));
}

function exportsName(path, name, seen = new Set()) {
  const key = `${path}:${name}`;
  if (seen.has(key)) return false;
  seen.add(key);
  const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
  for (const node of file.statements) {
    if (node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name?.text === name || (name === "default" && node.modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword))) return true;
      if (ts.isVariableStatement(node) && node.declarationList.declarations.some((d) => d.name.getText(file) === name)) return true;
    }
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause) && node.exportClause.elements.some((e) => e.name.text === name && !e.isTypeOnly)) return true;
      if (!node.exportClause && node.moduleSpecifier && exportsName(resolveLocalImport(node.moduleSpecifier.text, path), name, seen)) return true;
    }
  }
  return false;
}

// Inspect the exported component's explicit local props, rather than maintaining
// a second list of which MES components support composition APIs.
function declaresBooleanProp(path, exportName, prop) {
  const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
  const declarations = new Map();
  for (const statement of file.statements) {
    if (statement.name) declarations.set(statement.name.text, statement);
    if (ts.isVariableStatement(statement)) for (const d of statement.declarationList.declarations) declarations.set(d.name.getText(file), d);
  }
  const visited = new Set();
  function has(type) {
    if (!type || visited.has(type)) return false;
    visited.add(type);
    if (ts.isTypeReferenceNode(type)) return has(declarations.get(type.typeName.getText(file)));
    if (ts.isTypeAliasDeclaration(type)) return has(type.type);
    if (ts.isIntersectionTypeNode(type)) return type.types.some(has);
    return type.members?.some((member) => member.name?.getText(file) === prop && member.type?.kind === ts.SyntaxKind.BooleanKeyword) ?? false;
  }
  const declaration = declarations.get(exportName);
  if (!declaration) return false;
  if (ts.isFunctionDeclaration(declaration)) return has(declaration.parameters[0]?.type);
  if (ts.isVariableDeclaration(declaration)) {
    const value = declaration.initializer;
    if (value && ts.isCallExpression(value) && /(?:^|\.)forwardRef$/.test(value.expression.getText(file))) return has(value.typeArguments?.[1]);
    if (value && (ts.isArrowFunction(value) || ts.isFunctionExpression(value))) return has(value.parameters[0]?.type);
  }
  return false;
}

function inspectInlineStyle(value, file, tokens) {
  const expression = value && ts.isJsxExpression(value) ? value.expression : null;
  if (!expression || !ts.isObjectLiteralExpression(expression)) return "style 객체를 정적으로 확인할 수 없습니다.";
  // Layout mechanics are not MES visual constants. Token values come from the
  // existing stylesheet; no copied palette, spacing scale or component list.
  const mechanics = /^(?:display|flexDirection|flexWrap|flexGrow|flexShrink|alignItems|alignSelf|justifyContent|gridTemplateColumns|gridColumn|gridRow|width|minWidth|maxWidth|height|minHeight|maxHeight|overflow|overflowX|overflowY)$/;
  for (const property of expression.properties) {
    if (!ts.isPropertyAssignment(property) || ts.isComputedPropertyName(property.name)) return "동적 style/spread는 확인이 필요합니다.";
    const name = property.name.getText(file).replaceAll(/["']/g, "");
    const v = property.initializer;
    const literal = ts.isStringLiteral(v) ? v.text : ts.isNumericLiteral(v) ? Number(v.text) : null;
    const token = typeof literal === "string" ? /^var\((--[\w-]+)\)$/.exec(literal)?.[1] : null;
    if (token && tokens.has(token) && !name.startsWith("--")) continue;
    if (mechanics.test(name) && (literal === 0 || (/(?:Grow|Shrink)$/.test(name) && typeof literal === "number" && literal >= 0)
      || (typeof literal === "string" && /^(?:auto|none|block|inline|flex|inline-flex|grid|row|column|wrap|nowrap|center|start|end|stretch|flex-start|flex-end|space-between|visible|hidden|scroll|100%|min-content|max-content|fit-content|repeat\(\d+,\s*minmax\(0,\s*1fr\)\))$/.test(literal)))) continue;
    return `${name}: MES 토큰/variant 또는 확인 가능한 배치값이 필요합니다.`;
  }
  return null;
}

// Bind every JSX/call use to its lexical import symbol. Comments, unused imports,
// same-named local components and shadowed imports are not implementation evidence.
function inspectModule(path, source, approved, root) {
  const options = { noLib: true, noResolve: true, jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.Latest };
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const host = ts.createCompilerHost(options);
  host.getSourceFile = (name) => resolve(name) === resolve(path) ? file : undefined;
  const program = ts.createProgram([path], options, host);
  const checker = program.getTypeChecker();
  const findings = [];
  const uses = new Set();
  const sections = [];
  const actions = new Set();
  const imports = [];
  const tokens = new Set([...readFileSync(resolve(root, "src/app/globals.css"), "utf8").matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  const add = (code, message, severity = "blocker") => findings.push({ severity, code, message: `${path}: ${message}` });
  for (const diagnostic of program.getSyntacticDiagnostics()) add("source.syntax", ts.flattenDiagnosticMessageText(diagnostic.messageText, " "));

  function importedUse(expression) {
    const identifier = ts.isPropertyAccessExpression(expression) ? expression.expression : expression;
    const declaration = checker.getSymbolAtLocation(identifier)?.declarations?.[0];
    if (!declaration) return null;
    let name;
    if (ts.isImportSpecifier(declaration) && !declaration.isTypeOnly) name = (declaration.propertyName ?? declaration.name).text;
    else if (ts.isNamespaceImport(declaration) && ts.isPropertyAccessExpression(expression)) name = expression.name.text;
    else if (ts.isImportClause(declaration) && !declaration.isTypeOnly) name = "default";
    if (!name) return null;
    let parent = declaration;
    while (parent && !ts.isImportDeclaration(parent)) parent = parent.parent;
    if (!parent || parent.importClause?.isTypeOnly) return null;
    const modulePath = resolveLocalImport(parent.moduleSpecifier.text, path, root);
    if (!modulePath || !approved.has(modulePath)) return null;
    if (!exportsName(modulePath, name)) { add("component.invalid-export", `${name}은 ${modulePath}의 실제 export가 아닙니다.`); return null; }
    return { name, modulePath };
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) && !node.importClause?.isTypeOnly) {
      const specifier = node.moduleSpecifier.text;
      imports.push(specifier);
      if (/\.css$/.test(specifier)) add("style.external-css", "화면 자체 CSS는 MES 자산 대체 여부를 자동 판별할 수 없습니다. 등록 스타일/자산으로 이관 후 재검사하세요.");
      if (!specifier.startsWith("@/") && !specifier.startsWith(".") && !["react"].includes(specifier)) add("source.external-package", `화면의 외부 패키지 '${specifier}'는 등록 자산 내부에서 사용해야 합니다.`);
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(file);
      const lower = /^[a-z]/.test(tag);
      const actual = lower ? null : importedUse(node.tagName);
      // An anchor slotted through the real MES Button retains its styling/API.
      // Only one direct anchor child with href is supported here, not arbitrary
      // raw controls or a div disguised as a button.
      const element = ts.isJsxOpeningElement(node) ? node.parent : node;
      const parent = element.parent;
      const owner = parent && ts.isJsxElement(parent) ? parent.openingElement : null;
      const ownerUse = owner && importedUse(owner.tagName);
      const ownerSlot = owner?.attributes.properties.find((a) => ts.isJsxAttribute(a) && a.name.getText(file) === "asChild");
      const slotOn = ownerSlot && (!ownerSlot.initializer || (ts.isJsxExpression(ownerSlot.initializer) && ownerSlot.initializer.expression?.kind === ts.SyntaxKind.TrueKeyword));
      const slottedAnchor = tag === "a" && ownerUse && slotOn && declaresBooleanProp(ownerUse.modulePath, ownerUse.name, "asChild");
      const native = ["button", "input", "select", "textarea", "table", "a", "form", "nav", "iframe", "style", "script", "html", "body", "svg"];
      if (lower && native.includes(tag) && !slottedAnchor) add(`native.${tag}`, `원시 <${tag}> 대신 MES 자산이 필요합니다.`);
      if (!lower) {
        if (actual) uses.add(actual.name);
        else if (!checker.getSymbolAtLocation(node.tagName)?.declarations?.length) add("component.unresolved", `${tag}의 구현을 확인할 수 없습니다.`);
      }
      for (const attribute of node.attributes.properties) {
        if (!ts.isJsxAttribute(attribute)) { if (lower) add("native.spread", "원시 요소에 spread로 상호작용/스타일을 주입할 수 없습니다."); continue; }
        const name = attribute.name.getText(file);
        const value = attribute.initializer;
        if (name === "data-section-id" && value && ts.isStringLiteral(value)) sections.push({ id: value.text, position: node.pos });
        if (name === "dangerouslySetInnerHTML" || name === "as") add("source.render-override", `${name}의 실제 렌더링을 지원 검사로 확인해야 합니다.`);
        if (name === "asChild") {
          const bool = !value ? true : ts.isJsxExpression(value) && value.expression?.kind === ts.SyntaxKind.FalseKeyword ? false
            : ts.isJsxExpression(value) && value.expression?.kind === ts.SyntaxKind.TrueKeyword ? true : null;
          const children = ts.isJsxElement(element) ? element.children.filter((c) => !(ts.isJsxText(c) && !c.text.trim())) : [];
          const child = children.length === 1 && ts.isJsxElement(children[0]) ? children[0].openingElement : null;
          const href = child?.attributes.properties.find((a) => ts.isJsxAttribute(a) && a.name.getText(file) === "href");
          const link = child?.tagName.getText(file) === "a" && href && ts.isStringLiteral(href.initializer) && /^(?:\/(?!\/)|https?:\/\/|#)/.test(href.initializer.text);
          if (!actual || !declaresBooleanProp(actual.modulePath, actual.name, name) || bool === null || (bool && !link)) {
            add("source.render-override", "실제 asChild API와 단일 링크 자식을 확인할 수 없습니다. 동적/다른 조합은 검사 지원이 필요합니다.");
          }
        }
        const role = value && ts.isStringLiteral(value) ? value.text : null;
        const passiveRole = ["region", "group", "status", "note", "presentation", "none"].includes(role);
        const focusTarget = name === "tabIndex" && value && ts.isJsxExpression(value) && value.expression?.getText(file) === "-1";
        if (lower && (/^on[A-Z]/.test(name) || (name === "role" && !passiveRole) || (name === "tabIndex" && !focusTarget) || name === "contentEditable")) add("native.interaction", `원시 ${tag}의 ${name}으로 MES 컨트롤을 대체할 수 없습니다.`);
        if (name === "style") { const problem = inspectInlineStyle(value, file, tokens); if (problem) add("style.inline", problem); }
        if (name === "className" && value && /(?:\[(?:#[a-f\d]{3,8}|rgba?\(|hsla?\()|(?:bg|text|border)-(?:red|blue|green|slate|gray|zinc|yellow|purple|orange)-\d)/i.test(value.getText(file))) add("style.non-mes-color", "MES 토큰 외 색상 유틸리티의 근거/variant 사용을 대조하세요.", "warning");
        if (value && ts.isJsxExpression(value) && value.expression && ts.isArrowFunction(value.expression)) {
          const body = value.expression.body;
          if (/^on[A-Z]/.test(name) && ((ts.isBlock(body) && body.statements.length === 0) || body.getText(file) === "undefined")) add("interaction.no-op", `${name}이 상태를 변경하지 않습니다.`);
        }
      }
    }
    if (ts.isCallExpression(node)) {
      const actual = importedUse(node.expression);
      if (actual) uses.add(actual.name);
      if (actual?.name === "createDialogActionSet" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) actions.add(node.arguments[0].text);
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword || /(?:^|\.)(?:require|eval|Function|createElement|createPortal|insertAdjacentHTML|write)$/.test(node.expression.getText(file))) add("source.dynamic-render", "동적 로딩/HTML 주입/JSX 외 렌더링은 이 검사 경로에서 지원하지 않습니다.");
    }
    if (ts.isBinaryExpression(node) && /\.(?:innerHTML|outerHTML)$/.test(node.left.getText(file))) add("source.html-injection", "직접 HTML 주입은 차단합니다.");
    ts.forEachChild(node, visit);
  }
  visit(file);
  const fileSymbol = checker.getSymbolAtLocation(file);
  const exports = new Set((fileSymbol ? checker.getExportsOfModule(fileSymbol) : []).filter((s) => s.flags & (ts.SymbolFlags.Value | ts.SymbolFlags.Alias)).map((s) => s.name));
  return { findings, uses, sections, actions, imports, exports };
}

export function inspectImplementation(source, registry, { sourcePath = resolve(implementationRoot, "src/generated-previews/__audit__.tsx"), projectRoot = implementationRoot } = {}) {
  const approved = approvedSources(registry, projectRoot);
  const modules = new Map();
  const files = new Map();
  function walk(path, content, trusted = false) {
    if (!trusted && codeExtension.test(path) && !modules.has(path)) modules.set(path, inspectModule(path, String(content), approved, projectRoot));
    if (files.has(path)) return;
    files.set(path, digest(content));
    if (!codeExtension.test(path)) return;
    for (const imported of ts.preProcessFile(String(content), true, true).importedFiles) {
      const dependency = resolveLocalImport(imported.fileName, path, projectRoot);
      if (dependency) walk(dependency, readFileSync(dependency, "utf8"), trusted || approved.has(dependency));
    }
  }
  // The entry is always audited, even if somebody points the command at a DS file.
  walk(resolve(sourcePath), source);
  const records = [...modules.values()];
  return { exports: records[0]?.exports ?? new Set(), findings: records.flatMap((r) => r.findings), uses: new Set(records.flatMap((r) => [...r.uses])),
    sections: records.flatMap((r) => r.sections), actions: new Set(records.flatMap((r) => [...r.actions])), files: [...files].sort(([a], [b]) => a.localeCompare(b)) };
}

// Styles, app layout, font/image files and transitive local imports affect rendering
// even when the generated component file has not changed.
export function renderingDependencies(entries, root = implementationRoot) {
  const files = new Map();
  function walk(path) {
    path = canonical(path);
    if (files.has(path)) return;
    const bytes = readFileSync(path);
    files.set(path, digest(bytes));
    const text = bytes.toString("utf8");
    if (codeExtension.test(path)) {
      for (const imported of ts.preProcessFile(text, true, true).importedFiles) {
        const next = resolveLocalImport(imported.fileName, path, root);
        if (next) walk(next);
      }
    }
    if (path.endsWith(".css")) {
      for (const match of text.matchAll(/(?:@import\s+["']([^"']+)["']|url\(["']?([^)'"\s]+))/g)) {
        const specifier = match[1] ?? match[2];
        if (/^(?:data:|https?:|#)/.test(specifier)) continue;
        if (match[1] && !specifier.startsWith(".") && !specifier.startsWith("/")) continue; // Package CSS is pinned by package-lock.
        const next = specifier.startsWith("/") ? resolve(root, "public", specifier.slice(1))
          : resolveLocalImport(specifier.startsWith(".") ? specifier : `./${specifier}`, path, root);
        if (next && existsSync(next)) walk(next);
      }
    }
    if (codeExtension.test(path) || path.endsWith(".css")) {
      for (const match of text.matchAll(/["'](\/[^"']+)["']/g)) {
        const next = resolve(root, "public", match[1].slice(1));
        if (extname(next) && existsSync(next)) walk(next);
      }
    }
  }
  for (const entry of entries) if (existsSync(entry)) walk(entry);
  return [...files].sort(([a], [b]) => a.localeCompare(b));
}
