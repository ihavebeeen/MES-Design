import componentData from "@/design-system/registry/components.json";
import usageData from "@/design-system/registry/component-usage-contracts.json";
import patternData from "@/design-system/registry/patterns.json";
import sourceAssetData from "@/design-system/registry/source-assets.json";
import { ContentRegionHeading } from "@/components/ui/content-region-heading";
import { SectionHeader } from "@/components/ui/section-header";
import { getCatalogRegistryId } from "@/lib/component-catalog-data";

const componentById = new Map(componentData.components.map((component) => [component.id, component]));
const usageById = new Map([...usageData.baselineContexts, ...usageData.contracts].map((context) => [context.componentId, context]));
const detailedUsageById = new Map(usageData.contracts.map((contract) => [contract.componentId, contract]));
const allPatterns = [...patternData.patterns, ...sourceAssetData.patterns];

function List({ items, fallback }: { items?: string[]; fallback: string }) {
  const values = items?.length ? items : [fallback];
  return <ul className="list-disc space-y-1 pl-4 text-[13px] leading-5 text-mes-gray-80">{values.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function HeadingPreview({ id }: { id: string }) {
  if (id !== "content-region-heading" && id !== "section-header") return null;

  return (
    <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4">
      <h3 className="mb-3 text-[14px] font-semibold text-mes-gray-130">기본 예시</h3>
      {id === "content-region-heading"
        ? <ContentRegionHeading>품목 재고 리스트</ContentRegionHeading>
        : <SectionHeader>기본 정보</SectionHeader>}
    </article>
  );
}

/** 전용 데모 섹션이 없는 공개 자산의 짧은 레지스트리 문서 화면. */
export function RegistryComponentDocumentation({ activeId }: { activeId?: string }) {
  const registryId = activeId ? getCatalogRegistryId(activeId) : undefined;
  const component = registryId ? componentById.get(registryId) : undefined;
  if (!component) return null;
  const usage = usageById.get(component.id);
  const detailed = detailedUsageById.get(component.id);
  const relatedPatterns = allPatterns.filter((pattern) => pattern.requiredComponents.includes(component.id));
  const showRegistryHeader = component.documentationMode === "registry";

  return (
    <section className="flex w-full max-w-[960px] flex-col gap-5 border-b border-mes-gray-30 pb-8" data-registry-component={component.id} data-component-context={component.id}>
      {showRegistryHeader && <header className="border-l-4 border-mes-primary-60 pl-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[17px] font-bold text-mes-gray-130">{component.name}</h2>
            <span className="rounded-full bg-mes-primary-10 px-2 py-0.5 text-[11px] font-semibold text-mes-primary-70">Tier {component.tier}</span>
            <span className="rounded-full bg-mes-success-10 px-2 py-0.5 text-[11px] font-semibold text-mes-success-70">Stable</span>
          </div>
          <p className="mt-1 text-[12px] text-mes-gray-60">{component.id} · {component.category}</p>
        </header>}

      {showRegistryHeader && <HeadingPreview id={component.id} />}

      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-mes-gray-30 pb-3">
        <div><h3 className="text-[16px] font-bold text-mes-gray-130">선택 맥락</h3><p className="mt-1 text-[12px] text-mes-gray-60">모양이 비슷한 자산이 아니라, 이 역할이 필요한지 판단하는 기준입니다.</p></div>
        <span className="rounded-full bg-mes-gray-20 px-2.5 py-1 text-[10px] font-semibold text-mes-gray-70">{detailed ? "상세 계약" : "기본 맥락"}</span>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4">
          <h3 className="mb-2 text-[14px] font-semibold text-mes-gray-130">사용할 때</h3>
          <List items={usage?.useWhen ?? component.rules} fallback="등록된 화면 또는 패턴에서 같은 역할이 필요할 때 사용합니다." />
        </article>
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4">
          <h3 className="mb-2 text-[14px] font-semibold text-mes-gray-130">사용하지 않을 때</h3>
          <List items={usage?.doNotUseWhen} fallback="역할이 다른 기존 컴포넌트로 표현할 수 있으면 이 자산을 새 용도로 확장하지 않습니다." />
        </article>
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4">
          <h3 className="mb-2 text-[14px] font-semibold text-mes-gray-130">가까운 대안</h3>
          <List items={usage?.alternatives?.map((alternative) => `${alternative.componentId}: ${alternative.chooseInsteadWhen}`)} fallback="같은 역할의 대안이 없으면 기존 자산 조합 또는 신규 제안을 검토합니다." />
        </article>
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4">
          <h3 className="mb-2 text-[14px] font-semibold text-mes-gray-130">함께 쓰이는 패턴</h3>
          <List items={relatedPatterns.slice(0, 6).map((pattern) => `${pattern.name} (${pattern.id})`)} fallback="등록된 패턴 사용 근거가 아직 없습니다. 기본 맥락만 참고하고 화면 한 건을 공통 규칙으로 일반화하지 않습니다." />
        </article>
      </div>
      {detailed && <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4"><h3 className="mb-2 text-[14px] font-semibold text-mes-gray-130">상태와 제약</h3><List items={[...(detailed.requiredStates ?? []), ...(detailed.constraints ?? [])]} fallback="구현의 공개 Props와 등록 화면 근거를 따릅니다." /></article>
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4"><h3 className="mb-2 text-[14px] font-semibold text-mes-gray-130">접근성과 근거</h3><List items={[...(detailed.accessibility ?? []), ...(detailed.evidence ?? [])]} fallback="구현에 선언된 접근성 속성을 유지하고 실제 사용 화면에서 검증합니다." /></article>
      </div>}
      <p className="text-[12px] text-mes-gray-60">구현: {component.source} · 상세 문서: docs/components/{component.id}.md</p>
    </section>
  );
}
