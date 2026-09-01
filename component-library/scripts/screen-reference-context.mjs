import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { getBusinessTaskContext, loadBusinessKnowledge } from "./business-knowledge.mjs";

const usageUrl = new URL("../src/design-system/registry/usage-contexts.json", import.meta.url);
const normalize = (value) => String(value ?? "").normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/g, "");

export function validateUsageContexts(data) {
  const errors = [];
  if (data?.schemaVersion !== 1 || data?.authority !== "reference-only" || !Array.isArray(data?.contexts)) return ["Invalid usage context reference"];
  if (!data?.assetSelectionGuide || !Array.isArray(data.assetSelectionGuide.order) || !Array.isArray(data.assetSelectionGuide.decisionRecord)) {
    errors.push("Missing asset selection guide");
  }
  const ids = new Set();
  for (const context of data.contexts) {
    if (!context || ["id", "name", "purpose", "relationship", "basis"].some(key => typeof context[key] !== "string" || !context[key].trim())) errors.push("Missing context identity/meaning");
    for (const key of ["surfaces", "patternRefs", "consider", "alternatives"]) {
      if (!Array.isArray(context?.[key]) || context[key].some(value => typeof value !== "string")) errors.push(`Invalid context ${key}`);
    }
    for (const key of ["componentRefs", "connection"]) {
      if (context?.[key] !== undefined && (!Array.isArray(context[key]) || context[key].some(value => typeof value !== "string" || !value.trim()))) errors.push(`Invalid context ${key}`);
    }
    if (context?.id?.startsWith("usage.popup.") && (!context.componentRefs?.length || !context.connection?.length)) {
      errors.push(`Popup context '${context.id}' needs componentRefs and connection`);
    }
    if (ids.has(context?.id)) errors.push(`Duplicate usage context: ${context?.id}`);
    ids.add(context?.id);
  }
  return errors;
}

// Optional research failures are visible, but never become screen validation failures.
export function loadReferenceSources() {
  const sources = { business: null, usage: null, notices: [] };
  for (const [key, read] of [
    ["business", loadBusinessKnowledge],
    ["usage", () => {
      const data = JSON.parse(readFileSync(usageUrl, "utf8"));
      const errors = validateUsageContexts(data);
      if (errors.length) throw new Error(errors.join("; "));
      return data;
    }],
  ]) {
    try { sources[key] = read(); }
    catch (error) { sources.notices.push({ source: key, status: "unavailable", message: error.message }); }
  }
  return sources;
}

/** Retrieval only. No request mutation, layout selection, mandatory fields or blockers. */
export function getScreenReferences(options = {}, sources = loadReferenceSources()) {
  const { query = "", targetKind, patternRefs = [], taskIds = [], usageIds = [] } = options;
  const limit = Math.max(1, Math.min(12, Number.isInteger(options.limit) ? options.limit : 4));
  const normalized = normalize(query);
  const tasks = sources.business?.tasks ?? [];
  const contexts = sources.usage?.contexts ?? [];
  const notices = [...(sources.notices ?? [])];
  const missing = (ids, entries, source) => {
    for (const id of ids) if (!entries.some(entry => entry.id === id)) notices.push({ source, status: "not-found", id });
  };
  missing(taskIds, tasks, "business");
  missing(usageIds, contexts, "usage");
  // Search names/IDs, not every word in historical rules. Matches are candidates, not facts about the new task.
  const nameMatch = (id, name) => normalized !== "" && [id, name].some(value => {
    const term = normalize(value);
    return term && (term.includes(normalized) || normalized.includes(term));
  });
  const matchingTasks = tasks.filter(task => taskIds.length ? taskIds.includes(task.id) : nameMatch(task.id, task.label));
  const rankedContexts = contexts.map(context => ({ context, score: usageIds.includes(context.id) ? 3
    : context.patternRefs.some(ref => patternRefs.includes(ref)) ? 2
      : nameMatch(context.id, context.name) ? 1 : 0 }))
    .filter(({ context, score }) => usageIds.length ? usageIds.includes(context.id) : score > 0 || context.surfaces.includes(targetKind))
    .sort((a, b) => b.score - a.score);
  const business = [];
  for (const task of matchingTasks.slice(0, limit)) {
    try {
      const found = getBusinessTaskContext(sources.business, task.id);
      business.push({
        authority: "reference-only", match: taskIds.includes(task.id) ? "explicit-reference" : "name-candidate-not-confirmed",
        reviewedOn: found.reviewedOn, task: found.task, crossTaskFacts: found.crossTaskFacts,
        openQuestions: found.openQuestions, relatedTasks: found.relatedTasks,
        sources: found.sources.map(({ id, title, url, sectionKeys, review }) => ({ id, title, url, sectionKeys, review })),
      });
    } catch (error) { notices.push({ source: "business", id: task.id, status: "unavailable", message: error.message }); }
  }
  return {
    authority: "reference-only", enforcement: "none",
    status: !sources.business && !sources.usage ? "unavailable" : notices.length ? "partial" : "available",
    policy: sources.usage?.policy ?? { purpose: "업무·화면 사용 사례는 참고용이다. 자료 부재로 생성을 막거나 기존 사례를 강제하지 않는다." },
    informationGuide: sources.usage?.informationGuide ?? null,
    assetSelectionGuide: sources.usage?.assetSelectionGuide ?? null,
    businessAuthority: sources.business?.authority ?? null,
    business, usage: rankedContexts.slice(0, limit).map(({ context }) => context),
    matches: { business: matchingTasks.length, usage: rankedContexts.length, limit },
    notices,
    limitation: "검색 결과는 현재 요청에 적용된 결정이 아니다. 필요한 경우만 선택해 requirements/evidence.notes에 반영한다. 필드·필수성·배치·동작은 현재 요청으로 따로 정하며, 자료에 없는 새 업무도 진행할 수 있다.",
  };
}

export function getRequestReferences(request, patternRefs = [], sources) {
  const options = { query: request?.name ?? request?.target?.title ?? "", targetKind: request?.target?.kind, patternRefs };
  try { return getScreenReferences(options, sources); }
  catch (error) {
    return getScreenReferences(options, { business: null, usage: null, notices: [{ source: "references", status: "unavailable", message: error.message }] });
  }
}

function main(args) {
  const sources = loadReferenceSources();
  if (args.length === 1 && args[0] === "--list") {
    console.log(JSON.stringify({ authority: "reference-only", tasks: sources.business?.tasks.map(({ id, label }) => ({ id, label })) ?? [], usage: sources.usage?.contexts.map(({ id, name, surfaces }) => ({ id, name, surfaces })) ?? [], notices: sources.notices }, null, 2));
    return;
  }
  const options = { taskIds: [], usageIds: [] };
  while (args.length) {
    const flag = args.shift();
    const value = args.shift();
    if (!value || value.startsWith("--")) throw new Error(`Missing value: ${flag}`);
    if (flag === "--query") options.query = value;
    else if (flag === "--surface") options.targetKind = value;
    else if (flag === "--task") options.taskIds.push(value);
    else if (flag === "--usage") options.usageIds.push(value);
    else throw new Error(`Unknown option: ${flag}`);
  }
  console.log(JSON.stringify(getScreenReferences(options, sources), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
