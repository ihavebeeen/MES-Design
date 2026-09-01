import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";

export const taskContextPath = fileURLToPath(new URL("./task-contexts.json", import.meta.url));
export const readTaskContexts = () => JSON.parse(readFileSync(taskContextPath, "utf8"));
const text = z.string().trim().min(1);
export const businessContextSchema = z.object({
  taskId: text,
  conditions: z.record(z.string(), z.object({ value: text, source: text, state: z.enum(["confirmed", "supported", "unresolved", "conflicting"]) }).strict()),
  information: z.array(z.object({
    id: text, role: z.enum(["primary", "supporting", "other"]), necessary: z.boolean(),
    acquisition: z.enum(["manual", "provided", "omit"]), scope: z.enum(["record", "item", "related"]),
    availability: z.enum(["during-task", "on-demand", "after-save", "omitted"]), reason: text,
    binding: z.object({ sectionId: text, fieldKey: text }).strict().optional(),
  }).strict()).min(1),
}).strict();

/** Compile explicit information decisions into the existing generation model.
 * No NLP, auto layout, universal field priority or backend policy is inferred.
 * The original request is preserved separately; existing requests remain intact.
 */
export function resolveBusinessContext(request, knowledge = readTaskContexts()) {
  if (request.businessContext === undefined) return { request, issues: [], context: null };
  const issues = [];
  const fail = (code, message) => issues.push({ severity: "blocker", code: `business.${code}`, message });
  const parsed = businessContextSchema.safeParse(request.businessContext);
  if (!parsed.success) {
    fail("shape", parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
    return { request, issues, context: null };
  }
  const input = parsed.data;
  const task = knowledge.tasks.find((t) => t.id === input.taskId);
  if (!task) { fail("task", `등록되지 않은 업무: ${input.taskId}`); return { request, issues, context: null }; }
  const resolved = structuredClone(request);
  if (request.intent !== "new") fail("intent", "파일럿은 신규 UI에만 적용합니다. 원본 재현을 자동 재설계하지 않습니다.");
  if (request.generation?.templateId !== "side-slide-form-editable-list.v1") fail("template", "이 파일럿의 필드 연결은 form + 반복 입력 템플릿만 지원합니다. 다른 업무 구성을 이 템플릿에 억지로 맞추지 마세요.");
  for (const condition of task.conditions) {
    const answer = input.conditions[condition.id];
    if (!answer || !["confirmed", "supported"].includes(answer.state) || !condition.values.includes(answer.value)) fail("condition", condition.question);
  }
  for (const id of Object.keys(input.conditions)) if (!task.conditions.some((c) => c.id === id)) fail("condition", `알 수 없는 업무 조건: ${id}`);
  const decisions = new Map();
  for (const decision of input.information) {
    if (decisions.has(decision.id)) fail("duplicate", `중복 정보: ${decision.id}`);
    decisions.set(decision.id, decision);
    if (!task.information.some((i) => i.id === decision.id)) fail("information", `등록되지 않은 정보: ${decision.id}`);
  }
  const targets = new Set();
  for (const definition of task.information) {
    const d = decisions.get(definition.id);
    if (!d) { fail("missing", `${definition.name}의 포함/제외 판단이 없습니다.`); continue; }
    const conditional = definition.cases?.find((c) => Object.entries(c.when).every(([key, value]) => input.conditions[key]?.value === value));
    const expected = { ...definition, ...conditional };
    for (const key of ["role", "necessary", "scope", "acquisition"]) {
      if (expected[key] !== undefined && d[key] !== expected[key]) fail("conflict", `${definition.name}: ${key} 판단이 해당 업무 근거/선택 조건과 충돌합니다.`);
    }
    if (d.necessary && (d.role !== "primary" || d.acquisition === "omit" || d.availability !== "during-task")) fail("unavailable", `${definition.name}: 이 업무에 필요한 정보는 작업 중 접근할 수 있어야 합니다.`);
    if (d.acquisition === "omit" && d.availability !== "omitted") fail("availability", `${definition.name}: 제외한 정보의 노출 시점이 모순됩니다.`);
    if (d.acquisition !== "omit" && d.availability !== "during-task") fail("unsupported-presentation", `${definition.name}: on-demand/after-save 영역은 아직 이 템플릿에 연결되지 않았습니다. 무시하거나 임의 배치하지 마세요.`);
    if (d.scope === "related" && d.acquisition !== "omit") fail("related-presentation", `${definition.name}: 연결 목록은 단일 입력 필드로 대체할 수 없습니다. 관련 영역 생성 지원이 필요합니다.`);
    const section = resolved.generation?.sections?.find((s) => s.id === d.binding?.sectionId);
    const fields = section?.kind === "editable-row-list" ? section.columns : section?.fields;
    const field = fields?.find((f) => f.key === d.binding?.fieldKey);
    if (d.acquisition === "omit") {
      if (field) fail("excluded-field", `${definition.name}: 제외 판단과 달리 화면 필드가 남아 있습니다. 요청의 필드를 제거하세요.`);
      continue;
    }
    if (!field) { fail("binding", `${definition.name}: 실제 generation 필드 연결이 없습니다.`); continue; }
    const key = `${section.id}.${field.key}`;
    if (targets.has(key)) fail("duplicate-binding", `서로 다른 정보를 같은 필드에 연결했습니다: ${key}`);
    targets.add(key);
    if ((d.scope === "item") !== (section.kind === "editable-row-list")) fail("scope", `${definition.name}: 정보 소유 범위와 반복/공통 영역이 다릅니다.`);
    field.required = d.necessary;
    field.readOnly = d.acquisition === "provided";
    if (field.readOnly) {
      if (!field.defaultValue?.trim()) fail("provided-value", `${definition.name}: 자동/전달 값이 필요합니다. 빈 읽기 전용 필드로 대체할 수 없습니다.`);
      field.control = "input";
      delete field.options;
    }
  }
  return { request: resolved, issues, context: { taskId: task.id, goal: task.goal, completion: task.completion, scope: task.scope,
    conditions: input.conditions, information: input.information, sourceRefs: task.sourceRefs,
    sources: knowledge.sources.filter((s) => task.sourceRefs.includes(s.id)), knowledge: task,
    limitation: "정보 중요도·배치의 적절성은 AI/검토자가 판단합니다. 이 컴파일러는 명시한 조건·소유 범위·필드 연결·입력 방식을 검사합니다. 제공값은 샘플/상위 데이터이며 로그인 사용자나 서버를 자동 조회하지 않습니다." } };
}

export function businessBinding(contract, sectionId, fieldKey) {
  return contract.implementation?.businessContext?.information.find((i) => i.acquisition !== "omit" && i.binding?.sectionId === sectionId && i.binding?.fieldKey === fieldKey);
}
