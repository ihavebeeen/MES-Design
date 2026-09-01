import assert from "node:assert/strict";
import test from "node:test";
import { patternContractFindings } from "./audit-screen-implementation.mjs";
import { readRegistryBundle } from "./resolve-screen-request.mjs";
import { inspectImplementation } from "./screen-implementation-graph.mjs";

const required = ["EntityListPattern", "QueryDateRange", "GroupQuery", "Filter", "QuickQuery", "SearchInput", "Table"];
const registry = readRegistryBundle();
const patternContract = registry.patternContracts.find((entry) => entry.patternId === "section.page-query-table");

function inspect(extra = [], componentProps = []) {
  return { uses: new Set([...required, ...extra]), componentProps: new Set(componentProps) };
}

test("MES 메인 목록 문법과 더블클릭 팝업 진입은 통과한다", () => {
  assert.deepEqual(patternContractFindings(patternContract, inspect([], ["Table.onRowDoubleClick"]), { entryBehavior: "row-double-click" }), []);
});

test("팝업 내부 검색 목록을 메인 목록에 재사용하면 차단한다", () => {
  const findings = patternContractFindings(patternContract, inspect(["SearchTableSection"]));
  assert.ok(findings.some((entry) => entry.code === "composition.pattern-forbidden-marker"));
});

test("메인 목록 페이지네이션을 차단한다", () => {
  const findings = patternContractFindings(patternContract, inspect(["Pagination"]));
  assert.ok(findings.some((entry) => entry.code === "composition.pattern-forbidden-marker"));
});

test("연결형 팝업의 행 더블클릭 진입이 없으면 차단한다", () => {
  const findings = patternContractFindings(patternContract, inspect(), { entryBehavior: "row-double-click" });
  assert.ok(findings.some((entry) => entry.code === "composition.pattern-interaction"));
});

test("메인 목록 공통 조회 자산 누락을 각각 차단한다", () => {
  const findings = patternContractFindings(patternContract, { uses: new Set(["EntityListPattern", "Table"]), componentProps: new Set() });
  assert.ok(findings.some((entry) => entry.code === "composition.pattern-marker" && entry.message.includes("QuickQuery")));
});

test("주석·문자열 속 onRowDoubleClick 문구는 실제 Table 연결 근거가 아니다", () => {
  const source = `
    import { EntityListPattern } from "@/components/patterns/entity-list-pattern";
    import { QueryDateRange } from "@/components/ui/query-date-range";
    import { GroupQuery } from "@/components/ui/group-query";
    import { Filter } from "@/components/ui/filter";
    import { QuickQuery } from "@/components/ui/quick-query";
    import { SearchInput } from "@/components/ui/search-input";
    import { Table } from "@/components/ui/table";
    export function Host() {
      const note = "onRowDoubleClick={openRow}";
      return <EntityListPattern navigation={null} tabs={null} header={<><QueryDateRange start={null} end={null} onStartChange={() => undefined} onEndChange={() => undefined} /><GroupQuery options={[]} levels={[]} onLevelChange={() => undefined} /><Filter categories={[]} value={{}} onChange={() => undefined} /><QuickQuery presets={[]} activeId={null} onApply={() => undefined} onClearActive={() => undefined} onSettingsClick={() => undefined} /><SearchInput value={note} onChange={() => undefined} /></>} table={<Table columns={[]} rows={[]} />} />;
    }
  `;
  const implementation = inspectImplementation(source, registry);
  assert.equal(implementation.componentProps.has("Table.onRowDoubleClick"), false);
  assert.ok(patternContractFindings(patternContract, implementation, { entryBehavior: "row-double-click" }).some((entry) => entry.code === "composition.pattern-interaction"));

  const connected = inspectImplementation(source.replace('rows={[]} />', 'rows={[]} onRowDoubleClick={(id) => openRow(id)} />'), registry);
  assert.equal(connected.componentProps.has("Table.onRowDoubleClick"), true);
  assert.equal(patternContractFindings(patternContract, connected, { entryBehavior: "row-double-click" }).some((entry) => entry.code === "composition.pattern-interaction"), false);
});

test("선택하지 않은 패턴의 금지·필수 규칙은 다른 화면에 적용하지 않는다", () => {
  const formContract = registry.patternContracts.find((entry) => entry.patternId === "section.form-grid");
  const findings = patternContractFindings(formContract, { uses: new Set(["FormGrid", "FormFieldRow", "Pagination"]), componentProps: new Set() });
  assert.deepEqual(findings, []);
});
