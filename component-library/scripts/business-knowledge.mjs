import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const registryUrl = new URL("../src/design-system/registry/business-knowledge.json", import.meta.url);

// Integrity checks only: these do not prove that a specification is current or implemented.
export function validateBusinessKnowledge(data) {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  check(data?.schemaVersion === 1, "Unsupported schemaVersion");
  check(data?.status === "research-reference", "Business knowledge must remain a research reference");
  check(data?.generationUse?.runtimeWired === false, "Runtime integration needs a separate reviewed change");
  for (const key of ["sources", "tasks", "crossTaskFacts", "openQuestions", "generationExamples", "unreviewedLinkedPages"]) {
    check(Array.isArray(data?.[key]), `${key} must be an array`);
  }
  if (errors.length) return errors;

  const sourceIds = new Set(data.sources.map(s => s.id));
  const taskIds = new Set(data.tasks.map(t => t.id));
  for (const key of ["sources", "tasks", "crossTaskFacts", "openQuestions", "generationExamples"]) {
    const ids = data[key].map(entry => entry.id);
    check(ids.every(id => typeof id === "string" && id.length > 0), `${key}: missing ID`);
    check(new Set(ids).size === ids.length, `${key}: duplicate ID`);
  }
  const checkRefs = (refs, owner) => {
    check(Array.isArray(refs) && refs.length > 0, `${owner}: missing sourceRefs`);
    for (const ref of Array.isArray(refs) ? refs : []) {
      const source = data.sources.find(s => s.id === ref?.sourceId);
      check(Boolean(source), `${owner}: unknown source ${ref?.sourceId}`);
      check(Array.isArray(ref?.sections) && ref.sections.length > 0, `${owner}: missing sections`);
      for (const section of Array.isArray(ref?.sections) ? ref.sections : []) {
        check(source?.sectionKeys?.includes(section), `${owner}: unknown section ${ref?.sourceId}#${section}`);
      }
    }
  };
  for (const source of data.sources) {
    check(typeof source.title === "string" && source.title.length > 0, `${source.id}: missing title`);
    check(/^https:\/\/(?:app\.)?notion\.(?:so|com)\//.test(source.url), `${source.id}: invalid source URL`);
    check(Array.isArray(source.sectionKeys), `${source.id}: missing sectionKeys`);
    check(Boolean(source.review), `${source.id}: missing review scope`);
    if (source.disposition === "duplicate") {
      check(source.duplicateOf !== source.id && sourceIds.has(source.duplicateOf), `${source.id}: invalid duplicateOf`);
      check(Boolean(source.comparison), `${source.id}: missing duplicate evidence`);
    } else if (source.disposition !== "archive-index") {
      check(data.tasks.some(t => t.sourceRefs?.some(r => r.sourceId === source.id)), `${source.id}: source has no task summary`);
    }
  }
  for (const task of data.tasks) {
    check(Boolean(task.label && task.outcome), `${task.id}: missing task purpose`);
    check(task.focusCandidates?.status === "design-interpretation-not-fixed-priority", `${task.id}: fixed information priority is not allowed in research`);
    for (const key of ["relationships", "conditions", "decisionSupportCandidates", "relatedTasks"]) {
      check(Array.isArray(task[key]), `${task.id}: missing ${key}`);
    }
    checkRefs(task.sourceRefs, task.id);
    for (const related of task.relatedTasks ?? []) check(taskIds.has(related), `${task.id}: unknown related task ${related}`);
    if (task.informationModel) checkRefs([task.informationModel.basis], `${task.id}.informationModel`);
  }
  for (const fact of data.crossTaskFacts) {
    checkRefs(fact.sourceRefs, fact.id);
    for (const taskId of fact.appliesTo ?? []) check(taskIds.has(taskId), `${fact.id}: unknown task ${taskId}`);
    check(fact.uiImplication?.status === "design-inference", `${fact.id}: UI inference must be explicit`);
  }
  for (const question of data.openQuestions) {
    checkRefs(question.sourceRefs, question.id);
    check(question.status === "unresolved", `${question.id}: unresolved reference must not silently become approved`);
    for (const taskId of question.affectsTasks ?? []) check(taskIds.has(taskId), `${question.id}: unknown task ${taskId}`);
  }
  for (const example of data.generationExamples) {
    check(example.status === "reasoning-example-not-generated-or-user-approved", `${example.id}: example is not an approved screen`);
    for (const taskId of example.taskRefs ?? []) check(taskIds.has(taskId), `${example.id}: unknown task ${taskId}`);
  }
  for (const page of data.unreviewedLinkedPages) {
    check(sourceIds.has(page.parentSourceId), `Unreviewed page has unknown parent ${page.parentSourceId}`);
    check(page.status === "not-read", "Unreviewed page must not be counted as reviewed");
  }
  return errors;
}

export function loadBusinessKnowledge() {
  const data = JSON.parse(readFileSync(registryUrl, "utf8"));
  const errors = validateBusinessKnowledge(data);
  if (errors.length) throw new Error(errors.join("\n"));
  return data;
}

export function getBusinessTaskContext(data, taskId) {
  const errors = validateBusinessKnowledge(data);
  if (errors.length) throw new Error(errors.join("\n"));
  const task = data.tasks.find(entry => entry.id === taskId);
  if (!task) throw new Error(`Unknown business task: ${taskId}. Use --list; do not silently substitute a different task.`);
  const crossTaskFacts = data.crossTaskFacts.filter(fact => fact.appliesTo.includes(taskId));
  const openQuestions = data.openQuestions.filter(question => question.affectsTasks.includes(taskId));
  const generationExamples = data.generationExamples.filter(example => example.taskRefs.includes(taskId));
  const refs = [task, ...crossTaskFacts, ...openQuestions].flatMap(entry => entry.sourceRefs);
  if (task.informationModel) refs.push(task.informationModel.basis);
  const usedSources = new Set(refs.map(ref => ref.sourceId));
  return {
    status: data.status,
    reviewedOn: data.reviewedOn,
    authority: data.authority,
    coverage: data.coverage,
    task,
    crossTaskFacts,
    openQuestions,
    relatedTasks: data.tasks.filter(entry => task.relatedTasks.includes(entry.id)).map(({ id, label, outcome }) => ({ id, label, outcome })),
    sources: data.sources.filter(source => usedSources.has(source.id)),
    unreviewedLinkedPages: data.unreviewedLinkedPages.filter(page => usedSources.has(page.parentSourceId)),
    generationExamples,
    generationUse: data.generationUse,
  };
}

function main(args) {
  const data = loadBusinessKnowledge();
  if (args.length === 1 && args[0] === "--check") {
    console.log(`Business knowledge integrity passed: ${data.tasks.length} tasks, ${data.sources.length} source records. Not a live MES or specification-correctness test.`);
  } else if (args.length === 1 && args[0] === "--list") {
    console.log(JSON.stringify(data.tasks.map(({ id, label, outcome }) => ({ id, label, outcome })), null, 2));
  } else if (args.length === 2 && args[0] === "--task") {
    console.log(JSON.stringify(getBusinessTaskContext(data, args[1]), null, 2));
  } else {
    throw new Error("Usage: node scripts/business-knowledge.mjs --check | --list | --task <task-id>");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
}
