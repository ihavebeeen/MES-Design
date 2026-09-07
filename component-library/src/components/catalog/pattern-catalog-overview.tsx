import NextLink from "next/link";
import { Columns3, Table2, Workflow } from "lucide-react";
import patternData from "@/design-system/registry/patterns.json";
import patternContractData from "@/design-system/registry/pattern-contracts.json";
import sourceAssetData from "@/design-system/registry/source-assets.json";
import verificationData from "@/design-system/registry/web-verification-audit.json";
import { PATTERN_NODES, TIER_BY_ID, idToHref, type SidebarNode } from "@/lib/sidebar-data";

const allPatterns = [...patternData.patterns, ...sourceAssetData.patterns];
const patternById = new Map(allPatterns.map((pattern) => [pattern.id, pattern]));
const contractById = new Map(patternContractData.contracts.map((contract) => [contract.patternId, contract]));

const refsByRoute: Record<string, string[]> = {
  "original-mes-screen-assets": ["screen.form-management-workflow", "screen.production-result-responsive"],
  "grouped-list-screen": ["screen.entity-list", "table.grouped-list"],
  "completed-entity-list": ["screen.entity-list"],
  "completed-master-detail": ["screen.master-detail"],
  "completed-analytics-dashboard": ["screen.analytics-dashboard"],
  "completed-popup-types": ["shell.center-modal", "shell.side-slide-panel", "shell.confirm-dialog"],
  "table-column-settings-pattern": ["table.column-settings"],
  "workflow-stepper": ["workflow.stepper"],
  "selection-transfer-list": ["selection.transfer-list"],
  "table-row-expand-detail": ["table.row-expand-detail"],
  "table-frozen-column-grid": ["table.frozen-column-grid"],
  "table-grouped-header-grid": ["table.grouped-header-grid"],
  "visualization-process-flow": ["visualization.process-flow"],
  "visualization-production-gantt": ["visualization.production-gantt"],
  "onboarding-product-tour": ["onboarding.product-tour"],
};

const fallbackAvoidByRoute: Record<string, string> = {
  "original-mes-screen-assets": "한 화면의 배치와 값을 새 화면의 공통 규칙으로 그대로 일반화할 때",
  "grouped-list-screen": "그룹 기준이나 그룹별 비교가 없는 평면 목록일 때",
  "completed-entity-list": "반복 레코드의 열 비교가 주 작업이 아닐 때",
  "completed-master-detail": "대상 선택이 다른 영역의 내용이나 상태를 바꾸지 않을 때",
  "completed-analytics-dashboard": "정확한 개별 행 처리와 CRUD가 주 작업일 때",
  "completed-popup-types": "업무명이나 폭 하나만으로 팝업 유형을 확정할 때",
  "table-column-settings-pattern": "컬럼이 고정되어 사용자가 표시·순서를 바꿀 수 없을 때",
  "workflow-stepper": "단계 간 순서와 완료 조건이 없는 독립 작업일 때",
  "selection-transfer-list": "단일 선택이나 한 목록 안의 체크만으로 충분할 때",
  "table-row-expand-detail": "행마다 연결 상세가 없거나 별도 상세 화면이 더 명확할 때",
  "table-frozen-column-grid": "가로 비교가 짧아 고정 열이 필요하지 않을 때",
  "table-grouped-header-grid": "컬럼 묶음의 공통 의미가 없을 때",
  "visualization-process-flow": "공정 순서나 연결 관계가 없는 일반 목록일 때",
  "visualization-production-gantt": "시간 구간과 설비·작업 간 겹침 비교가 필요하지 않을 때",
  "onboarding-product-tour": "업무에 필수인 설명을 일회성 안내 안에 숨길 때",
};

function flatten(nodes: SidebarNode[]) {
  return nodes.flatMap((node) => node.kind === "leaf" ? [{ id: node.id, label: node.label, labelEn: node.labelEn }] : node.children.map((child) => ({ id: child.id, label: `${node.label} — ${child.label}`, labelEn: child.labelEn })));
}

function resolveRoute(id: string) {
  const refs = refsByRoute[id] ?? [];
  const patterns = refs.map((ref) => patternById.get(ref)).filter((pattern): pattern is NonNullable<typeof pattern> => Boolean(pattern));
  const contracts = refs.map((ref) => contractById.get(ref)).filter((contract): contract is NonNullable<typeof contract> => Boolean(contract));
  return { refs, patterns, contracts };
}

function PatternThumbnail({ id }: { id: string }) {
  const base = "rounded-mes-control border border-mes-gray-40 bg-white";
  if (id.includes("popup")) return <div className="relative h-20 w-44 rounded-mes-control bg-mes-gray-80/40"><span className={`absolute left-3 top-2 h-16 w-24 ${base}`} /><span className={`absolute inset-y-1 right-1 w-16 ${base}`} /></div>;
  if (id.includes("master-detail") || id.includes("transfer")) return <div className={`grid h-20 w-44 grid-cols-[2fr_3fr] gap-2 p-2 ${base}`}><span className="rounded bg-mes-gray-30" /><span className="rounded bg-mes-primary-10" /></div>;
  if (id.includes("analytics") || id.includes("gantt") || id.includes("flow")) return <div className={`flex h-20 w-44 items-end gap-2 p-3 ${base}`}><span className="h-5 flex-1 bg-mes-primary-20" /><span className="h-10 flex-1 bg-mes-primary-40" /><span className="h-14 flex-1 bg-mes-primary-60" /></div>;
  if (id.includes("table") || id.includes("list")) return <div className={`h-20 w-44 overflow-hidden ${base}`}><span className="block h-5 bg-mes-gray-30" /><span className="block h-5 border-t border-mes-gray-30" /><span className="block h-5 border-t border-mes-gray-30 bg-mes-primary-10" /><span className="block h-5 border-t border-mes-gray-30" /></div>;
  return <div className="flex items-center gap-2"><span className={`flex size-10 items-center justify-center ${base}`}><Workflow className="size-4 text-mes-primary-60" /></span><span className="h-px w-5 bg-mes-gray-50" /><span className={`flex size-10 items-center justify-center ${base}`}><Columns3 className="size-4 text-mes-gray-90" /></span><span className="h-px w-5 bg-mes-gray-50" /><span className={`flex size-10 items-center justify-center ${base}`}><Table2 className="size-4 text-mes-gray-90" /></span></div>;
}

export function PatternCatalogOverview() {
  const cards = flatten(PATTERN_NODES);
  return <section className="flex w-full max-w-[960px] flex-col gap-6" data-pattern-catalog>
    <div className="rounded-mes-panel border border-mes-gray-30 bg-white p-5 shadow-sm">
      <h2 className="text-[20px] font-bold text-mes-gray-130">패턴과 화면 근거 찾아보기</h2>
      <p className="mt-1 max-w-[720px] text-[13px] leading-5 text-mes-gray-70">패턴은 컴포넌트가 왜 함께 배치되는지를 설명합니다. 화면은 그대로 복제하는 템플릿이 아니라 실제 사용 맥락을 확인하는 근거입니다.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-mes-control bg-mes-gray-10 p-3"><p className="text-[11px] font-semibold text-mes-gray-60">패턴 선택 맥락</p><p className="mt-1 text-[17px] font-bold">{verificationData.summary.patterns.selectionContexts} / {verificationData.summary.patterns.total}</p><p className="mt-1 text-[11px] text-mes-gray-70">상세 조합 계약 {verificationData.summary.patterns.detailedCompositionRules}개</p></div>
        <div className="rounded-mes-control bg-mes-gray-10 p-3"><p className="text-[11px] font-semibold text-mes-gray-60">연결된 화면 근거</p><p className="mt-1 text-[17px] font-bold">{verificationData.summary.screens.directlyVisualLinked} / {verificationData.summary.screens.total}</p><p className="mt-1 text-[11px] text-mes-gray-70">상세 순서 정의 {verificationData.summary.screens.orderedDefinitions}개</p></div>
      </div>
    </div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const { refs, patterns, contracts } = resolveRoute(card.id);
        const useWhen = contracts[0]?.useWhen?.[0] ?? patterns[0]?.rules?.[0] ?? "등록된 화면에서 같은 정보 관계와 작업 흐름이 필요할 때 비교합니다.";
        const avoid = contracts[0]?.doNotUseWhen?.[0] ?? fallbackAvoidByRoute[card.id] ?? "업무 관계를 확인하지 않고 외형만 재사용할 때";
        return <NextLink href={idToHref(card.id)} key={card.id} className="group overflow-hidden rounded-mes-panel border border-mes-gray-30 bg-white hover:border-mes-primary-60 hover:shadow-sm" data-pattern-card={card.id}>
          <div className="flex h-28 items-center justify-center border-b border-mes-gray-30 bg-mes-gray-10 p-3"><PatternThumbnail id={card.id} /></div>
          <div className="min-h-48 p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="text-[14px] font-bold text-mes-gray-130 group-hover:text-mes-primary-70">{card.label}</h3>{card.labelEn && <p className="mt-0.5 text-[11px] text-mes-gray-60">{card.labelEn}</p>}</div>{TIER_BY_ID[card.id] && <span className="rounded-full bg-mes-primary-10 px-2 py-0.5 text-[10px] font-semibold text-mes-primary-70">T{TIER_BY_ID[card.id]}</span>}</div><div className="mt-3 space-y-2 text-[11px] leading-4.5"><p className="line-clamp-3 text-mes-gray-80"><strong className="mr-1 font-semibold text-mes-gray-110">주로 사용</strong>{useWhen}</p><p className="line-clamp-3 text-mes-gray-70"><strong className="mr-1 font-semibold text-mes-gray-100">피할 때</strong>{avoid}</p></div><p className="mt-3 text-[10px] text-mes-gray-50">{refs.length ? refs.join(" · ") : "화면 근거 묶음"}</p></div>
        </NextLink>;
      })}
    </div>
  </section>;
}

export function RegistryPatternDocumentation({ activeId }: { activeId?: string }) {
  if (!activeId || !refsByRoute[activeId]) return null;
  const { refs, patterns, contracts } = resolveRoute(activeId);
  const useWhen = contracts.flatMap((contract) => contract.useWhen).concat(patterns.flatMap((pattern) => pattern.rules)).slice(0, 6);
  const doNotUseWhen = contracts.flatMap((contract) => contract.doNotUseWhen);
  const components = [...new Set(patterns.flatMap((pattern) => pattern.requiredComponents))];
  return <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8" data-pattern-context={activeId}>
    <header className="flex flex-wrap items-end justify-between gap-3 border-b border-mes-gray-30 pb-3"><div><h2 className="text-[16px] font-bold text-mes-gray-130">선택 맥락</h2><p className="mt-1 text-[12px] text-mes-gray-60">배치 모양보다 정보 관계와 작업 순서가 같은지 먼저 비교합니다.</p></div><span className="rounded-full bg-mes-gray-20 px-2.5 py-1 text-[10px] font-semibold text-mes-gray-70">{contracts.length ? "상세 계약 포함" : "기본 맥락"}</span></header>
    <div className="grid gap-4 md:grid-cols-2"><article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4"><h3 className="mb-2 text-[14px] font-semibold">주로 사용할 때</h3><ul className="list-disc space-y-1 pl-4 text-[13px] leading-5 text-mes-gray-80">{useWhen.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4"><h3 className="mb-2 text-[14px] font-semibold">피할 때</h3><ul className="list-disc space-y-1 pl-4 text-[13px] leading-5 text-mes-gray-80">{(doNotUseWhen.length ? doNotUseWhen : [fallbackAvoidByRoute[activeId]]).map((item) => <li key={item}>{item}</li>)}</ul></article></div>
    <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4"><h3 className="mb-2 text-[14px] font-semibold">연결된 자산</h3><div className="flex flex-wrap gap-1.5">{refs.map((ref) => <span key={ref} className="rounded-full bg-mes-primary-10 px-2 py-1 text-[10px] text-mes-primary-70">{ref}</span>)}{components.map((component) => <span key={component} className="rounded-full bg-mes-gray-20 px-2 py-1 text-[10px] text-mes-gray-70">{component}</span>)}</div></article>
  </section>;
}
