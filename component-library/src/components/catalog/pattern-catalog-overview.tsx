import NextLink from "next/link";
import { Check, ChevronDown, GripVertical, MoveRight, Table2, Workflow } from "lucide-react";
import patternData from "@/design-system/registry/patterns.json";
import patternContractData from "@/design-system/registry/pattern-contracts.json";
import sourceAssetData from "@/design-system/registry/source-assets.json";
import { PATTERN_NODES, TIER_BY_ID, idToHref, type SidebarNode } from "@/lib/sidebar-data";
import { getAssetScopeLabel } from "@/lib/catalog-labels";

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
  return nodes.flatMap((node) => node.kind === "leaf" ? [{ id: node.id, label: node.label, labelEn: node.labelEn }] : node.children.map((child) => ({ id: child.id, label: child.label, labelEn: child.labelEn })));
}

function resolveRoute(id: string) {
  const refs = refsByRoute[id] ?? [];
  const patterns = refs.map((ref) => patternById.get(ref)).filter((pattern): pattern is NonNullable<typeof pattern> => Boolean(pattern));
  const contracts = refs.map((ref) => contractById.get(ref)).filter((contract): contract is NonNullable<typeof contract> => Boolean(contract));
  return { refs, patterns, contracts };
}

function PatternThumbnail({ id }: { id: string }) {
  const base = "rounded-mes-control border border-mes-gray-40 bg-white";
  const tableRows = <><span className="block h-3 border-t border-mes-gray-30" /><span className="block h-3 border-t border-mes-gray-30 bg-mes-primary-10" /><span className="block h-3 border-t border-mes-gray-30" /></>;
  if (id === "original-mes-screen-assets") return <div className="flex items-center gap-2"><span className={`flex size-10 items-center justify-center ${base}`}><Workflow className="size-4 text-mes-primary-60" /></span><MoveRight className="size-4 text-mes-gray-50" /><span className={`flex size-10 items-center justify-center ${base}`}><Table2 className="size-4 text-mes-gray-90" /></span></div>;
  if (id === "grouped-list-screen") return <div className={`h-20 w-44 overflow-hidden p-1.5 ${base}`}><span className="mb-1 flex h-3 items-center bg-mes-gray-30 px-1"><ChevronDown className="size-2.5" /><i className="ml-1 h-1 w-12 bg-mes-gray-60" /></span><span className="ml-3 block h-3 border-t border-mes-gray-30" /><span className="ml-3 block h-3 border-t border-mes-gray-30 bg-mes-primary-10" /><span className="mt-1 flex h-3 items-center bg-mes-gray-30 px-1"><ChevronDown className="size-2.5" /><i className="ml-1 h-1 w-9 bg-mes-gray-60" /></span></div>;
  if (id === "completed-entity-list") return <div className={`h-20 w-44 overflow-hidden ${base}`}><span className="flex h-4 items-center justify-end gap-1 bg-white px-1"><i className="h-2 w-7 rounded bg-mes-gray-30" /><i className="h-2 w-4 rounded bg-mes-primary-60" /></span><span className="grid h-4 grid-cols-4 bg-mes-gray-30"><i className="border-r border-white" /><i className="border-r border-white" /><i className="border-r border-white" /><i /></span>{tableRows}</div>;
  if (id === "completed-master-detail") return <div className={`grid h-20 w-44 grid-cols-[2fr_3fr] overflow-hidden ${base}`}><span className="flex flex-col gap-1 border-r border-mes-gray-30 bg-mes-gray-20 p-2"><i className="h-2 bg-mes-gray-50" /><i className="h-2 bg-mes-primary-30" /><i className="h-2 bg-mes-gray-40" /></span><span className="grid grid-cols-2 gap-1 p-2"><i className="h-3 bg-mes-gray-30" /><i className="h-3 bg-mes-gray-20" /><i className="h-3 bg-mes-gray-20" /><i className="h-3 bg-mes-gray-30" /></span></div>;
  if (id === "completed-analytics-dashboard") return <div className={`grid h-20 w-44 grid-cols-3 gap-1.5 p-2 ${base}`}><span className="col-span-3 grid grid-cols-3 gap-1"><i className="bg-mes-primary-10" /><i className="bg-mes-primary-10" /><i className="bg-mes-primary-10" /></span><span className="col-span-2 flex items-end gap-1 border-t border-mes-gray-30 pt-1"><i className="h-3 flex-1 bg-mes-primary-20" /><i className="h-6 flex-1 bg-mes-primary-40" /><i className="h-9 flex-1 bg-mes-primary-60" /></span><span className="rounded-full border-8 border-mes-primary-30" /></div>;
  if (id === "completed-popup-types") return <div className="relative h-20 w-44 rounded-mes-control bg-mes-gray-80/40"><span className={`absolute left-5 top-3 h-14 w-20 ${base}`}><i className="block h-3 border-b border-mes-gray-30" /></span><span className={`absolute inset-y-1 right-1 w-14 ${base}`}><i className="block h-3 border-b border-mes-gray-30" /></span></div>;
  if (id === "table-column-settings-pattern") return <div className={`flex h-20 w-44 flex-col gap-1 p-2 ${base}`}>{[0, 1, 2, 3].map((row) => <span key={row} className="flex h-3 items-center gap-1 border-b border-mes-gray-20"><Check className="size-2.5 text-mes-primary-60" /><i className="h-1 flex-1 bg-mes-gray-40" /><GripVertical className="size-2.5 text-mes-gray-50" /></span>)}</div>;
  if (id === "workflow-stepper") return <div className="flex items-center gap-1"><span className="flex size-8 items-center justify-center rounded-full bg-mes-primary-60 text-[9px] text-white">1</span><i className="h-px w-5 bg-mes-primary-50" /><span className="flex size-8 items-center justify-center rounded-full border border-mes-primary-50 bg-white text-[9px]">2</span><i className="h-px w-5 bg-mes-gray-40" /><span className="flex size-8 items-center justify-center rounded-full border border-mes-gray-40 bg-white text-[9px]">3</span></div>;
  if (id === "selection-transfer-list") return <div className="grid h-20 w-44 grid-cols-[1fr_auto_1fr] items-center gap-1"><span className={`flex h-full flex-col gap-1 p-2 ${base}`}><i className="h-2 bg-mes-gray-40" /><i className="h-2 bg-mes-primary-20" /><i className="h-2 bg-mes-gray-30" /></span><MoveRight className="size-4 text-mes-primary-60" /><span className={`flex h-full flex-col gap-1 p-2 ${base}`}><i className="h-2 bg-mes-primary-20" /><i className="h-2 bg-mes-gray-30" /></span></div>;
  if (id === "table-row-expand-detail") return <div className={`h-20 w-44 overflow-hidden ${base}`}><span className="block h-4 bg-mes-gray-30" /><span className="flex h-3 items-center border-t border-mes-gray-30 px-1"><ChevronDown className="size-2.5" /></span><span className="block h-6 border-y border-mes-primary-20 bg-mes-primary-10 px-4 py-1"><i className="block h-1 w-20 bg-mes-primary-30" /></span><span className="block h-3 border-t border-mes-gray-30" /></div>;
  if (id === "table-frozen-column-grid") return <div className={`grid h-20 w-44 grid-cols-[50px_1fr] overflow-hidden ${base}`}><span className="border-r-2 border-mes-gray-60 bg-mes-gray-20" /><span className="bg-[repeating-linear-gradient(0deg,white_0,white_15px,#dce2eb_16px)]" /></div>;
  if (id === "table-grouped-header-grid") return <div className={`h-20 w-44 overflow-hidden ${base}`}><span className="grid h-4 grid-cols-2 bg-mes-gray-40"><i className="border-r border-white" /><i /></span><span className="grid h-4 grid-cols-4 bg-mes-gray-20"><i className="border-r border-white" /><i className="border-r border-white" /><i className="border-r border-white" /><i /></span>{tableRows}</div>;
  if (id === "visualization-process-flow") return <div className="flex items-center gap-1"><span className={`h-9 w-10 bg-mes-primary-10 ${base}`} /><MoveRight className="size-4 text-mes-gray-50" /><span className={`h-9 w-10 bg-mes-primary-20 ${base}`} /><MoveRight className="size-4 text-mes-gray-50" /><span className={`h-9 w-10 bg-mes-primary-40 ${base}`} /></div>;
  if (id === "visualization-production-gantt") return <div className={`grid h-20 w-44 grid-cols-[32px_1fr] overflow-hidden p-2 ${base}`}><span className="border-r border-mes-gray-30" /><span className="flex flex-col gap-1.5 pl-2 pt-1"><i className="h-2 w-20 bg-mes-primary-30" /><i className="ml-8 h-2 w-16 bg-mes-primary-60" /><i className="ml-3 h-2 w-24 bg-mes-gray-50" /></span></div>;
  if (id === "onboarding-product-tour") return <div className="relative h-20 w-44 overflow-hidden rounded-mes-control bg-mes-gray-110/80"><span className="absolute left-3 top-2 h-12 w-24 rounded bg-white/20" /><span className="absolute bottom-2 right-2 w-24 rounded-mes-control bg-white p-2"><i className="mb-1 block h-1 w-12 bg-mes-gray-80" /><i className="block h-1 w-16 bg-mes-gray-30" /></span></div>;
  return <div className={`flex h-20 w-44 items-center justify-center ${base}`}><Table2 className="size-5 text-mes-gray-90" /></div>;
}

export function PatternCatalogOverview() {
  const cards = flatten(PATTERN_NODES);
  return <section className="w-full max-w-[960px]" data-pattern-catalog>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        return <NextLink href={idToHref(card.id)} key={card.id} className="group overflow-hidden rounded-mes-panel border border-mes-gray-30 bg-white hover:border-mes-primary-60 hover:shadow-sm" data-pattern-card={card.id}>
          <div className="flex h-28 items-center justify-center border-b border-mes-gray-30 bg-mes-gray-10 p-3" data-pattern-thumbnail={card.id}><PatternThumbnail id={card.id} /></div>
          <div className="min-h-24 p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="text-[14px] font-bold text-mes-gray-130 group-hover:text-mes-primary-70">{card.label}</h3>{card.labelEn && <p className="mt-0.5 text-[11px] text-mes-gray-60">{card.labelEn}</p>}</div>{TIER_BY_ID[card.id] && <span className="rounded-full bg-mes-primary-10 px-2 py-0.5 text-[10px] font-semibold text-mes-primary-70">{getAssetScopeLabel(TIER_BY_ID[card.id])}</span>}</div></div>
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
