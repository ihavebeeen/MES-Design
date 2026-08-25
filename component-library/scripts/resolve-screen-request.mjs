import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateGenerationSpec } from "./screen-generation-contract.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const registryDirectory = join(projectRoot, "src", "design-system", "registry");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function hash(value) {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}

function issue(severity, code, message, reference) {
  return { severity, code, message, ...(reference ? { reference } : {}) };
}

export function readRegistryBundle() {
  const components = readJson(join(registryDirectory, "components.json"));
  const patterns = readJson(join(registryDirectory, "patterns.json"));
  const screens = readJson(join(registryDirectory, "screens.json"));
  const sourceAssets = readJson(join(registryDirectory, "source-assets.json"));
  const actionSets = readJson(join(registryDirectory, "action-sets.json"));
  const contextRules = readJson(join(registryDirectory, "context-rules.json"));
  const generationTemplates = readJson(join(registryDirectory, "generation-templates.json"));
  const mobileAssets = readJson(join(registryDirectory, "mobile-assets.json"));
  const componentUsageContracts = readJson(join(registryDirectory, "component-usage-contracts.json"));
  const patternContracts = readJson(join(registryDirectory, "pattern-contracts.json"));
  const screenSpecs = readJson(join(registryDirectory, "screen-specs.json"));
  const webUiUsageInventory = readJson(join(registryDirectory, "web-ui-usage-inventory.json"));
  const webFigmaReconciliation = readJson(join(registryDirectory, "web-figma-reconciliation.json"));

  return {
    components: components.components,
    patterns: [...patterns.patterns, ...sourceAssets.patterns],
    screens: [...screens.screens, ...sourceAssets.screens],
    actionSets: actionSets.actionSets,
    contextRules,
    generationTemplates: generationTemplates.templates,
    mobileAssets,
    componentUsageContracts: componentUsageContracts.contracts,
    patternContracts: patternContracts.contracts,
    screenSpecs: screenSpecs.specs,
    webUiUsageInventory,
    webFigmaReconciliation,
  };
}

function validateRequestShape(request) {
  const issues = [];
  const checkKnownKeys = (value, allowed, path) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    for (const key of Object.keys(value)) {
      if (!allowed.has(key)) issues.push(issue("blocker", "request.unknown-field", `알 수 없는 필드 '${path}.${key}'입니다.`));
    }
  };
  const topLevelKeys = new Set([
    "schemaVersion",
    "requestId",
    "name",
    "intent",
    "lifecycle",
    "target",
    "evidence",
    "composition",
    "requirements",
    "normalizationDecisions",
    "generation",
    "output",
  ]);
  for (const key of Object.keys(request ?? {})) {
    if (!topLevelKeys.has(key)) issues.push(issue("blocker", "request.unknown-field", `알 수 없는 최상위 필드 '${key}'입니다.`));
  }
  checkKnownKeys(request?.target, new Set(["kind", "title", "nearestScreenId", "viewport"]), "target");
  checkKnownKeys(request?.target?.viewport, new Set(["width", "height"]), "target.viewport");
  checkKnownKeys(request?.evidence, new Set(["figmaNode", "sourceRoute", "notes"]), "evidence");
  checkKnownKeys(request?.composition, new Set(["recipeRefs", "shellRef", "sectionRefs", "sections", "behaviorRefs", "actionSetRef"]), "composition");
  checkKnownKeys(request?.output, new Set(["route", "componentName"]), "output");
  if (request?.schemaVersion !== 1) issues.push(issue("blocker", "request.schema-version", "schemaVersion은 1이어야 합니다."));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(request?.requestId ?? "")) issues.push(issue("blocker", "request.id", "requestId는 kebab-case여야 합니다."));
  if (typeof request?.name !== "string" || request.name.trim() === "") issues.push(issue("blocker", "request.name", "name이 필요합니다."));
  if (!["reproduce", "new", "normalize", "audit"].includes(request?.intent)) issues.push(issue("blocker", "request.intent", "intent 값이 잘못되었습니다."));
  if (!["draft", "release"].includes(request?.lifecycle)) issues.push(issue("blocker", "request.lifecycle", "lifecycle은 draft 또는 release여야 합니다."));
  if (!["page", "center-modal", "side-slide-panel", "confirm-dialog"].includes(request?.target?.kind)) issues.push(issue("blocker", "request.target-kind", "target.kind 값이 잘못되었습니다."));
  if (typeof request?.target?.title !== "string" || request.target.title.trim() === "") issues.push(issue("blocker", "request.target-title", "target.title이 필요합니다."));
  if (request?.target?.nearestScreenId !== undefined && (typeof request.target.nearestScreenId !== "string" || request.target.nearestScreenId === "")) issues.push(issue("blocker", "request.nearest-screen", "target.nearestScreenId는 비어 있지 않은 문자열이어야 합니다."));
  if (request?.target?.viewport !== undefined && (!Number.isInteger(request.target.viewport.width) || !Number.isInteger(request.target.viewport.height) || request.target.viewport.width < 320 || request.target.viewport.height < 320)) issues.push(issue("blocker", "request.viewport", "target.viewport의 width와 height는 320 이상의 정수여야 합니다."));
  if (!request?.composition || typeof request.composition !== "object" || Array.isArray(request.composition)) issues.push(issue("blocker", "request.composition", "composition 객체가 필요합니다."));
  if (!Array.isArray(request?.requirements) || request.requirements.length === 0 || request.requirements.some((value) => typeof value !== "string" || value.trim() === "") || unique(request.requirements).length !== request.requirements.length) issues.push(issue("blocker", "request.requirements", "requirements에는 중복 없는 한 개 이상의 문장이 필요합니다."));
  if (typeof request?.output?.route !== "string" || !/^\/preview\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(request.output.route)) {
    issues.push(issue("blocker", "request.output-route", "output.route는 /preview/<영문-소문자-ID> 형식이어야 합니다."));
  }
  if (!/^[A-Z][A-Za-z0-9]*$/.test(request?.output?.componentName ?? "")) issues.push(issue("blocker", "request.component-name", "output.componentName은 PascalCase여야 합니다."));
  if (request?.evidence?.figmaNode && !/^\d+:\d+$/.test(request.evidence.figmaNode)) issues.push(issue("blocker", "request.figma-node", "evidence.figmaNode는 123:456 형식이어야 합니다."));
  if (request?.evidence?.notes !== undefined && (!Array.isArray(request.evidence.notes) || request.evidence.notes.some((value) => typeof value !== "string" || value === "") || unique(request.evidence.notes).length !== request.evidence.notes.length)) issues.push(issue("blocker", "request.evidence-notes", "evidence.notes는 중복 없는 문자열 배열이어야 합니다."));
  if (request?.composition?.shellRef !== undefined && (typeof request.composition.shellRef !== "string" || request.composition.shellRef === "")) issues.push(issue("blocker", "request.shell-ref", "composition.shellRef는 비어 있지 않은 문자열이어야 합니다."));
  if (request?.composition?.actionSetRef !== undefined && (typeof request.composition.actionSetRef !== "string" || request.composition.actionSetRef === "")) issues.push(issue("blocker", "request.action-set-ref", "composition.actionSetRef는 비어 있지 않은 문자열이어야 합니다."));
  if (request?.normalizationDecisions !== undefined) {
    if (!Array.isArray(request.normalizationDecisions)) issues.push(issue("blocker", "request.normalization-decisions", "normalizationDecisions는 배열이어야 합니다."));
    else for (const [index, decision] of request.normalizationDecisions.entries()) {
      checkKnownKeys(decision, new Set(["subject", "classification", "reason"]), `normalizationDecisions[${index}]`);
      if (!decision || typeof decision.subject !== "string" || decision.subject === "" || typeof decision.reason !== "string" || decision.reason === "" || !["source-error", "implementation-error", "intentional-exception", "normalization-candidate"].includes(decision.classification)) issues.push(issue("blocker", "request.normalization-decision", `normalizationDecisions[${index}] 값이 잘못되었습니다.`));
    }
  }
  for (const message of validateGenerationSpec(request?.generation)) {
    issues.push(issue("blocker", "request.generation", message));
  }

  for (const key of ["recipeRefs", "sectionRefs", "behaviorRefs"]) {
    const values = request?.composition?.[key];
    if (values !== undefined && (!Array.isArray(values) || values.some((value) => typeof value !== "string" || value === "") || unique(values).length !== values.length)) {
      issues.push(issue("blocker", `request.${key}`, `composition.${key}는 중복 없는 문자열 배열이어야 합니다.`));
    }
  }
  if (request?.composition?.sections !== undefined) {
    if (!Array.isArray(request.composition.sections) || request.composition.sections.length === 0) issues.push(issue("blocker", "request.sections", "composition.sections는 한 개 이상의 순서화된 section 배열이어야 합니다."));
    const sectionIds = new Set();
    const allowedScrollOwners = new Set(["shell-body", "section", "table", "none"]);
    for (const [index, section] of (request.composition.sections ?? []).entries()) {
      const path = `composition.sections[${index}]`;
      checkKnownKeys(section, new Set(["id", "title", "slot", "frameRef", "patternRef", "supportingPatternRefs", "componentRefs", "behaviorRefs", "scrollOwner"]), path);
      if (!/^[a-z][A-Za-z0-9]*$/.test(section?.id ?? "") || sectionIds.has(section?.id)) issues.push(issue("blocker", "request.section-id", `${path}.id는 중복 없는 camelCase여야 합니다.`));
      sectionIds.add(section?.id);
      if (section?.title !== undefined && (typeof section.title !== "string" || section.title === "")) issues.push(issue("blocker", "request.section-title", `${path}.title은 비어 있지 않은 문자열이어야 합니다.`));
      if (section?.slot !== "body") issues.push(issue("blocker", "request.section-slot", `${path}.slot은 body여야 합니다.`));
      if (typeof section?.patternRef !== "string" || section.patternRef === "") issues.push(issue("blocker", "request.section-pattern", `${path}.patternRef가 필요합니다.`));
      if (section?.frameRef !== undefined && (typeof section.frameRef !== "string" || section.frameRef === "")) issues.push(issue("blocker", "request.section-frame", `${path}.frameRef는 비어 있지 않은 문자열이어야 합니다.`));
      for (const key of ["supportingPatternRefs", "componentRefs", "behaviorRefs"]) {
        const values = section?.[key];
        if (!Array.isArray(values) || values.some((value) => typeof value !== "string" || value === "") || unique(values).length !== values.length) issues.push(issue("blocker", `request.section-${key}`, `${path}.${key}는 중복 없는 문자열 배열이어야 합니다.`));
      }
      if (!allowedScrollOwners.has(section?.scrollOwner)) issues.push(issue("blocker", "request.section-scroll-owner", `${path}.scrollOwner가 잘못되었습니다.`));
    }
  }
  return issues;
}

function refsByKind(patternRefs, patternMap, kinds) {
  return patternRefs.filter((id) => kinds.includes(patternMap.get(id)?.kind));
}

function selectedOrInherited(selected, inherited) {
  return selected === undefined ? inherited : selected;
}

const expectedShells = {
  page: null,
  "center-modal": "shell.center-modal",
  "side-slide-panel": "shell.side-slide-panel",
  "confirm-dialog": "shell.confirm-dialog",
};

const expectedShellComponents = {
  "center-modal": "center-modal",
  "side-slide-panel": "side-slide-panel",
  "confirm-dialog": "confirm-dialog",
};

export function contractFingerprint(contract) {
  const payload = { ...contract };
  delete payload.fingerprint;
  return hash(payload);
}

export function resolveScreenRequest(request, registry = readRegistryBundle()) {
  const issues = validateRequestShape(request);
  const componentMap = new Map(registry.components.map((entry) => [entry.id, entry]));
  const patternMap = new Map(registry.patterns.map((entry) => [entry.id, entry]));
  const screenMap = new Map(registry.screens.map((entry) => [entry.id, entry]));
  const actionSetMap = new Map(registry.actionSets.map((entry) => [entry.id, entry]));
  const generationTemplateMap = new Map(registry.generationTemplates.map((entry) => [entry.id, entry]));
  const componentUsageContractMap = new Map(registry.componentUsageContracts.map((entry) => [entry.componentId, entry]));
  const patternContractMap = new Map(registry.patternContracts.map((entry) => [entry.patternId, entry]));
  const screenSpecMap = new Map(registry.screenSpecs.map((entry) => [entry.screenId, entry]));
  const nearestScreen = request?.target?.nearestScreenId ? screenMap.get(request.target.nearestScreenId) : undefined;
  const nearestScreenSpec = request?.target?.nearestScreenId ? screenSpecMap.get(request.target.nearestScreenId) : undefined;
  const observedPages = request?.target?.nearestScreenId
    ? registry.webUiUsageInventory.pages.filter((page) => page.registeredScreenId === request.target.nearestScreenId)
    : [];
  const observedPageIds = new Set(observedPages.map((page) => page.id));
  const observedEntryFlows = request?.target?.nearestScreenId
    ? registry.webUiUsageInventory.entryFlows.filter((flow) =>
      flow.registeredScreenId === request.target.nearestScreenId || observedPageIds.has(flow.pageId),
    )
    : [];
  const observedFlowIds = new Set(observedEntryFlows.map((flow) => flow.id));
  const figmaReconciliationPages = registry.webFigmaReconciliation.pages.filter((page) => observedPageIds.has(page.pageId));
  const observedSearchTerms = unique([request?.target?.nearestScreenId, nearestScreen?.name]).map((value) => value.toLocaleLowerCase("ko-KR"));
  const observedDiscrepancies = registry.webUiUsageInventory.discrepancies.filter((entry) => {
    const serialized = JSON.stringify(entry).toLocaleLowerCase("ko-KR");
    return observedSearchTerms.some((term) => serialized.includes(term));
  });

  if (request?.target?.nearestScreenId && !nearestScreen) {
    issues.push(issue("blocker", "registry.unknown-screen", `등록되지 않은 nearestScreenId '${request.target.nearestScreenId}'입니다.`, request.target.nearestScreenId));
  }
  if (!request?.target?.nearestScreenId) {
    issues.push(issue("warning", "composition.no-nearest-screen", "가장 가까운 등록 화면이 지정되지 않아 조합 판단의 재현성이 낮아집니다."));
  }

  const inheritedRefs = nearestScreen?.patternRefs ?? [];
  const composition = request?.composition ?? {};
  const sections = selectedOrInherited(composition.sections, nearestScreenSpec?.sections ?? []);
  const structuredSectionRefs = unique(sections.flatMap((section) => [section.frameRef, section.patternRef, ...(section.supportingPatternRefs ?? [])]));
  const recipeRefs = unique(selectedOrInherited(composition.recipeRefs, refsByKind(inheritedRefs, patternMap, ["popup", "screen", "recipe"])));
  const inheritedShellRefs = refsByKind(inheritedRefs, patternMap, ["shell"]);
  const shellRef = composition.shellRef === undefined ? nearestScreenSpec?.shellRef ?? inheritedShellRefs[0] ?? expectedShells[request?.target?.kind] : composition.shellRef;
  const sectionRefs = unique(selectedOrInherited(composition.sectionRefs, structuredSectionRefs.length > 0 ? structuredSectionRefs : refsByKind(inheritedRefs, patternMap, ["section-frame", "section-pattern", "table"])));
  const behaviorRefs = unique(selectedOrInherited(composition.behaviorRefs, nearestScreenSpec?.behaviorRefs ?? refsByKind(inheritedRefs, patternMap, ["behavior"])));
  const inheritedActionRefs = refsByKind(inheritedRefs, patternMap, ["action-set"]);
  const actionSetRef = composition.actionSetRef === undefined ? nearestScreenSpec?.actionSetRef ?? inheritedActionRefs[0] : composition.actionSetRef;
  const selectedPatternRefs = unique([...recipeRefs, shellRef, ...sectionRefs, ...behaviorRefs, actionSetRef]);

  const kindContracts = [
    [recipeRefs, new Set(["popup", "screen", "recipe"]), "recipe"],
    [sectionRefs, new Set(["section-frame", "section-pattern", "table"]), "section"],
    [behaviorRefs, new Set(["behavior"]), "behavior"],
  ];
  for (const [refs, allowedKinds, label] of kindContracts) {
    for (const id of refs) {
      const pattern = patternMap.get(id);
      if (!pattern) issues.push(issue("blocker", "registry.unknown-pattern", `등록되지 않은 ${label} 패턴 '${id}'입니다.`, id));
      else if (!allowedKinds.has(pattern.kind)) issues.push(issue("blocker", "registry.pattern-kind", `'${id}'는 ${label} 위치에 사용할 수 없는 ${pattern.kind} 패턴입니다.`, id));
    }
  }

  for (const section of sections) {
    const primaryPattern = patternMap.get(section.patternRef);
    if (!primaryPattern) issues.push(issue("blocker", "registry.unknown-section-pattern", `section '${section.id}'가 미등록 pattern '${section.patternRef}'를 참조합니다.`, section.patternRef));
    else if (!["section-frame", "section-pattern", "table"].includes(primaryPattern.kind)) issues.push(issue("blocker", "registry.section-pattern-kind", `section '${section.id}'의 primary pattern '${section.patternRef}'는 section/table 종류여야 합니다.`, section.patternRef));
    if (section.frameRef && patternMap.get(section.frameRef)?.kind !== "section-frame") issues.push(issue("blocker", "registry.section-frame-kind", `section '${section.id}'의 frameRef '${section.frameRef}'가 section-frame이 아닙니다.`, section.frameRef));
    for (const supportingRef of section.supportingPatternRefs ?? []) {
      const supporting = patternMap.get(supportingRef);
      if (!supporting) issues.push(issue("blocker", "registry.unknown-supporting-pattern", `section '${section.id}'가 미등록 supporting pattern '${supportingRef}'를 참조합니다.`, supportingRef));
      else if (!["section-pattern", "table"].includes(supporting.kind)) issues.push(issue("blocker", "registry.supporting-pattern-kind", `section '${section.id}'의 supporting pattern '${supportingRef}' 종류가 잘못되었습니다.`, supportingRef));
    }
    for (const behaviorRef of section.behaviorRefs ?? []) if (patternMap.get(behaviorRef)?.kind !== "behavior") issues.push(issue("blocker", "registry.section-behavior-kind", `section '${section.id}'의 behavior '${behaviorRef}'가 등록 behavior가 아닙니다.`, behaviorRef));
    for (const componentId of section.componentRefs ?? []) if (!componentMap.has(componentId)) issues.push(issue("blocker", "registry.unknown-section-component", `section '${section.id}'가 미등록 component '${componentId}'를 참조합니다.`, componentId));
  }

  if (shellRef) {
    const shell = patternMap.get(shellRef);
    if (!shell) issues.push(issue("blocker", "registry.unknown-shell", `등록되지 않은 shell '${shellRef}'입니다.`, shellRef));
    else if (shell.kind !== "shell") issues.push(issue("blocker", "registry.shell-kind", `'${shellRef}'는 shell 패턴이 아닙니다.`, shellRef));
  }
  const expectedShell = expectedShells[request?.target?.kind];
  if (expectedShell !== shellRef) {
    issues.push(issue("blocker", "composition.shell-mismatch", `target.kind '${request?.target?.kind}'에는 shell '${expectedShell ?? "없음"}'이 필요하지만 '${shellRef ?? "없음"}'이 선택됐습니다.`, shellRef));
  }

  if (actionSetRef && !actionSetMap.has(actionSetRef)) issues.push(issue("blocker", "registry.unknown-action-set", `등록되지 않은 action set '${actionSetRef}'입니다.`, actionSetRef));
  if (request?.intent === "reproduce" && !request?.evidence?.figmaNode) issues.push(issue("blocker", "evidence.figma-required", "reproduce 요청에는 Figma node 근거가 필요합니다."));
  if (request?.intent !== "reproduce" && !request?.evidence?.figmaNode) issues.push(issue("info", "evidence.no-figma", "Figma 근거가 없는 신규/감사 요청이므로 결과를 원본 검증됨으로 표시할 수 없습니다."));
  if (request?.intent === "normalize" && (!Array.isArray(request.normalizationDecisions) || request.normalizationDecisions.length === 0)) {
    issues.push(issue("warning", "normalization.no-decisions", "normalize 요청에 명시적 normalizationDecisions가 없습니다."));
  }
  const generationTemplate = request?.generation ? generationTemplateMap.get(request.generation.templateId) : undefined;
  if (request?.generation && !generationTemplate) issues.push(issue("blocker", "registry.unknown-generation-template", `등록되지 않은 generation template '${request.generation.templateId}'입니다.`, request.generation.templateId));
  if (generationTemplate && generationTemplate.targetKind !== request?.target?.kind) issues.push(issue("blocker", "generation.target-mismatch", `template '${generationTemplate.id}'는 target '${generationTemplate.targetKind}'만 지원합니다.`, generationTemplate.id));
  if (generationTemplate?.status === "provisional") issues.push(issue("warning", "generation.template-provisional", `template '${generationTemplate.id}'는 provisional 상태입니다.`, generationTemplate.id));

  const resolvedPatterns = selectedPatternRefs.map((id) => patternMap.get(id)).filter(Boolean);
  const expectedShellComponent = expectedShellComponents[request?.target?.kind];
  const overlayComponentIds = new Set(Object.values(expectedShellComponents));
  const requiredComponentIds = unique([...resolvedPatterns.flatMap((pattern) => pattern.requiredComponents), ...sections.flatMap((section) => section.componentRefs ?? [])]).filter(
    (id) => !expectedShellComponent || !overlayComponentIds.has(id) || id === expectedShellComponent,
  );
  const resolvedComponents = [];
  for (const id of requiredComponentIds) {
    const component = componentMap.get(id);
    if (!component) issues.push(issue("blocker", "registry.unknown-component", `패턴이 미등록 component '${id}'를 요구합니다.`, id));
    else {
      resolvedComponents.push(component);
      if (component.status === "provisional") issues.push(issue("warning", "component.provisional", `component '${id}'는 provisional 상태입니다.`, id));
    }
  }

  const selectedPatternSet = new Set(selectedPatternRefs);
  const requiredComponentSet = new Set(requiredComponentIds);
  const applicableContextRules = registry.contextRules.rules.filter((rule) =>
    rule.allowedParents.some((id) => selectedPatternSet.has(id))
    || rule.implementationRefs.some((reference) =>
      reference.kind === "pattern" ? selectedPatternSet.has(reference.id)
        : reference.kind === "component" ? requiredComponentSet.has(reference.id)
          : reference.kind === "action-set" ? reference.id === actionSetRef : false,
    ),
  );
  const applicableContextRuleIds = new Set(applicableContextRules.map((rule) => rule.id));
  const applicableContextDecisions = registry.contextRules.decisions.filter((decision) =>
    decision.optionRuleIds.some((id) => applicableContextRuleIds.has(id)),
  );

  for (const component of resolvedComponents) {
    const usageContract = componentUsageContractMap.get(component.id);
    if (!usageContract) continue;
    if (!usageContract.allowedParents.some((parentId) => selectedPatternSet.has(parentId))) {
      issues.push(issue("blocker", "component.parent-context", `component '${component.id}'를 허용하는 parent pattern이 현재 조합에 없습니다.`, component.id));
    }
  }

  const selectionSource = (explicit, structured, fallback) => explicit ? "request" : structured ? "screen-spec" : fallback;
  const decisionTrace = {
    nearestScreen: nearestScreen ? { selectedId: nearestScreen.id, reason: "요청의 nearestScreenId와 등록 업무 구조를 상속했습니다." } : { selectedId: null, reason: "가까운 등록 화면이 지정되지 않았습니다." },
    shell: {
      selectedId: shellRef ?? null,
      source: selectionSource(composition.shellRef !== undefined, Boolean(nearestScreenSpec), "target-default"),
      reason: shellRef ? `target.kind '${request?.target?.kind}'와 일치하는 셸입니다.` : "page target은 overlay shell을 사용하지 않습니다.",
      excluded: Object.values(expectedShells).filter((id) => id && id !== shellRef).map((id) => ({ id, reason: `target.kind '${request?.target?.kind}'와 일치하지 않습니다.` })),
    },
    sections: sections.map((section, index) => ({
      order: index + 1,
      id: section.id,
      frameRef: section.frameRef ?? null,
      patternRef: section.patternRef,
      supportingPatternRefs: section.supportingPatternRefs ?? [],
      scrollOwner: section.scrollOwner,
      reason: composition.sections !== undefined ? "요청이 순서와 슬롯을 명시했습니다." : "가까운 화면의 구조화된 ScreenSpec을 상속했습니다.",
    })),
    behaviors: behaviorRefs.map((id) => ({ id, reason: composition.behaviorRefs !== undefined ? "요청이 명시했습니다." : nearestScreenSpec ? "ScreenSpec의 상태·동작 계약을 상속했습니다." : "가까운 화면의 patternRefs를 상속했습니다." })),
    actionSet: actionSetRef ? { selectedId: actionSetRef, reason: composition.actionSetRef !== undefined ? "요청이 명시했습니다." : nearestScreenSpec ? "ScreenSpec의 하단 동작 의미를 상속했습니다." : "가까운 화면의 action set을 상속했습니다." } : null,
    components: resolvedComponents.map((component) => {
      const usage = componentUsageContractMap.get(component.id);
      return {
        selectedId: component.id,
        reason: usage?.useWhen ?? ["선택된 패턴의 requiredComponents에 포함됩니다."],
        doNotUseWhen: usage?.doNotUseWhen ?? [],
        alternatives: usage?.alternatives ?? [],
        contractCoverage: usage ? "structured" : "registry-only",
      };
    }),
  };

  const blockers = issues.filter((entry) => entry.severity === "blocker");
  const warnings = issues.filter((entry) => entry.severity === "warning");
  const status = blockers.length > 0 ? "blocked" : warnings.length > 0 ? "review-ready" : "release-ready";
  const contract = {
    contractVersion: 1,
    request: canonicalize(request),
    registryFingerprint: hash({
      components: registry.components,
      patterns: registry.patterns,
      screens: registry.screens,
      actionSets: registry.actionSets,
      contextRules: registry.contextRules,
      generationTemplates: registry.generationTemplates,
      componentUsageContracts: registry.componentUsageContracts,
      patternContracts: registry.patternContracts,
      screenSpecs: registry.screenSpecs,
      webUiUsageInventory: registry.webUiUsageInventory,
      webFigmaReconciliation: registry.webFigmaReconciliation,
    }),
    baseScreen: nearestScreen ?? null,
    baseScreenSpec: nearestScreenSpec ?? null,
    composition: {
      recipeRefs,
      shellRef: shellRef ?? null,
      sectionRefs,
      behaviorRefs,
      actionSetRef: actionSetRef ?? null,
      sections,
      selectedPatternRefs,
    },
    implementation: {
      patterns: resolvedPatterns.map(({ id, name, kind, placement, source, rules }) => ({ id, name, kind, placement, source, rules })),
      patternContracts: resolvedPatterns.map(({ id }) => patternContractMap.get(id)).filter(Boolean),
      components: resolvedComponents.map(({ id, name, category, source, status, rules }) => ({ id, name, category, source, status, rules: rules ?? [] })),
      componentUsageContracts: resolvedComponents.map(({ id }) => componentUsageContractMap.get(id)).filter(Boolean),
      actionSet: actionSetRef ? actionSetMap.get(actionSetRef) ?? null : null,
      contextRules: applicableContextRules,
      contextDecisions: applicableContextDecisions,
      globalGates: registry.contextRules.globalGates,
      generationTemplate: generationTemplate ?? null,
      observedWebUsage: {
        authority: registry.webUiUsageInventory.usagePolicy.authority,
        usageRules: registry.webUiUsageInventory.usagePolicy.rules,
        pages: observedPages,
        entryFlows: observedEntryFlows,
        connectedObservations: registry.webUiUsageInventory.connectedObservations.filter((entry) => observedFlowIds.has(entry.fromFlowId)),
        discrepancies: observedDiscrepancies,
        figmaReconciliation: {
          status: registry.webFigmaReconciliation.status,
          authorityRules: registry.webFigmaReconciliation.authorities.rules,
          pages: figmaReconciliationPages,
          structuralFindings: registry.webFigmaReconciliation.structuralFindings,
          coverage: registry.webFigmaReconciliation.coverage,
        },
      },
    },
    decisionTrace,
    quality: {
      status,
      blockerCount: blockers.length,
      warningCount: warnings.length,
      infoCount: issues.filter((entry) => entry.severity === "info").length,
      issues,
    },
  };
  return { ...contract, fingerprint: contractFingerprint(contract) };
}

function parseArguments(argv) {
  const args = [...argv];
  const input = args.shift();
  let output;
  while (args.length > 0) {
    const flag = args.shift();
    if (flag === "--out") output = args.shift();
    else throw new Error(`알 수 없는 옵션 '${flag}'입니다.`);
  }
  return { input, output };
}

function runCli() {
  const { input, output } = parseArguments(process.argv.slice(2));
  if (!input) {
    console.error("사용법: npm run screen:resolve -- <request.json> [--out <contract.json>]");
    process.exitCode = 1;
    return;
  }
  const inputPath = resolve(process.cwd(), input);
  if (!existsSync(inputPath)) {
    console.error(`요청 파일을 찾을 수 없습니다: ${inputPath}`);
    process.exitCode = 1;
    return;
  }
  const contract = resolveScreenRequest(readJson(inputPath));
  const serialized = `${JSON.stringify(contract, null, 2)}\n`;
  if (output) writeFileSync(resolve(process.cwd(), output), serialized, "utf8");
  else process.stdout.write(serialized);

  console.error(`[screen:resolve] ${contract.quality.status} · blockers ${contract.quality.blockerCount} · warnings ${contract.quality.warningCount} · ${contract.fingerprint.slice(0, 12)}`);
  if (contract.quality.blockerCount > 0) process.exitCode = 1;
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) runCli();
