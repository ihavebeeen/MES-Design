import NextLink from "next/link";
import { ArrowUpRight, PanelsTopLeft } from "lucide-react";
import componentData from "@/design-system/registry/components.json";
import assetManifestData from "@/design-system/registry/asset-manifest.json";
import usageData from "@/design-system/registry/component-usage-contracts.json";
import patternData from "@/design-system/registry/patterns.json";
import sourceAssetData from "@/design-system/registry/source-assets.json";
import { Accordion } from "@/components/ui/accordion";
import { getAssetScopeLabel, getAssetStatusLabel } from "@/lib/catalog-labels";
import { getCatalogRegistryId } from "@/lib/component-catalog-data";
import { getComponentScreenReferences } from "@/lib/component-screen-references";

const componentById = new Map(componentData.components.map((component) => [component.id, component]));
const usageById = new Map([...usageData.baselineContexts, ...usageData.contracts].map((context) => [context.componentId, context]));
const detailedUsageById = new Map(usageData.contracts.map((contract) => [contract.componentId, contract]));
const allPatterns = [...patternData.patterns, ...sourceAssetData.patterns];
const manifestById = new Map(assetManifestData.assets.filter((asset) => asset.kind === "component").map((asset) => [asset.id, asset]));

function List({ items, fallback }: { items?: string[]; fallback: string }) {
  const values = items?.length ? items : [fallback];
  return <ul className="list-disc space-y-1 pl-4 text-[13px] leading-5 text-mes-gray-80">{values.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function ContextBlock({ title, items, fallback }: { title: string; items?: string[]; fallback: string }) {
  return (
    <article className="min-w-0 border-l-2 border-mes-gray-30 pl-3">
      <h4 className="mb-1.5 text-[13px] font-semibold text-mes-gray-120">{title}</h4>
      <List items={items} fallback={fallback} />
    </article>
  );
}

/** 실제 예시 아래에서 사용 화면, 참고 코드, 선택 기준, 내부 원장을 단계적으로 보여준다. */
export function RegistryComponentDocumentation({ activeId }: { activeId?: string }) {
  const registryId = activeId ? getCatalogRegistryId(activeId) : undefined;
  const component = registryId ? componentById.get(registryId) : undefined;
  if (!component) return null;
  const usage = usageById.get(component.id);
  const detailed = detailedUsageById.get(component.id);
  const manifest = manifestById.get(component.id);
  const relatedPatterns = allPatterns.filter((pattern) => pattern.requiredComponents.includes(component.id));
  const symbols = manifest?.sourceFacts?.symbols ?? [];
  const primarySymbol = symbols.find((symbol) => symbol === component.name) ?? symbols.at(-1) ?? component.name;
  const importPath = component.source.replace(/^src\//, "@/").replace(/\.tsx$/, "");
  const publicProps = manifest?.sourceFacts?.propNames ?? [];
  const screenReferences = getComponentScreenReferences(component.id);
  const visibleScreenReferences = screenReferences.slice(0, 4);

  const selectionContext = (
    <div className="grid gap-x-8 gap-y-5 py-1 md:grid-cols-2">
      <ContextBlock title="사용할 때" items={usage?.useWhen ?? component.rules} fallback="등록된 화면 또는 패턴에서 같은 역할이 필요할 때 사용합니다." />
      <ContextBlock title="피해야 할 때" items={usage?.doNotUseWhen} fallback="역할이 다른 기존 컴포넌트로 표현할 수 있으면 이 자산을 새 용도로 확장하지 않습니다." />
      <ContextBlock title="가까운 대안" items={usage?.alternatives?.map((alternative) => `${alternative.componentId}: ${alternative.chooseInsteadWhen}`)} fallback="같은 역할의 대안이 없으면 기존 자산 조합 또는 신규 제안을 검토합니다." />
      <ContextBlock title="관련 패턴" items={relatedPatterns.slice(0, 6).map((pattern) => `${pattern.name} (${pattern.id})`)} fallback="연결된 공통 패턴이 아직 없습니다." />
    </div>
  );

  const internalRegistry = (
    <div className="space-y-5 py-1" data-component-internal={component.id}>
      <dl className="grid overflow-hidden rounded-mes-control border border-mes-gray-30 text-[12px] sm:grid-cols-2">
        {[
          ["ID", component.id],
          ["분류", component.category],
          ["자산 범위", `${getAssetScopeLabel(component.tier)} (내부값 T${component.tier})`],
          ["기준 상태", `${getAssetStatusLabel(component.status)} (${component.status})`],
          ["구현", component.source],
          ["상세 문서", `docs/components/${component.id}.md`],
        ].map(([label, value]) => (
          <div key={label} className="grid min-w-0 grid-cols-[76px_minmax(0,1fr)] border-b border-mes-gray-30 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
            <dt className="bg-mes-gray-10 px-3 py-2 font-semibold text-mes-gray-70">{label}</dt>
            <dd className="min-w-0 break-all px-3 py-2 text-mes-gray-100">{value}</dd>
          </div>
        ))}
      </dl>
      {publicProps.length > 0 && <div><h4 className="mb-2 text-[13px] font-semibold text-mes-gray-120">공개 Props</h4><div className="flex flex-wrap gap-1.5">{publicProps.map((prop) => <code key={prop} className="rounded bg-mes-gray-20 px-2 py-1 text-[11px] text-mes-gray-90">{prop}</code>)}</div></div>}
      {detailed && <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        <ContextBlock title="상태와 제약" items={[...(detailed.requiredStates ?? []), ...(detailed.constraints ?? [])]} fallback="구현의 공개 Props와 등록 화면 근거를 따릅니다." />
        <ContextBlock title="접근성과 근거" items={[...(detailed.accessibility ?? []), ...(detailed.evidence ?? [])]} fallback="구현에 선언된 접근성 속성을 유지합니다." />
      </div>}
    </div>
  );

  return (
    <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8" data-registry-component={component.id} data-component-context={component.id}>
      <section className="min-w-0" data-component-screen-references={component.id}>
        {visibleScreenReferences.length > 0 ? (
          <>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-bold text-mes-gray-130">사용 화면</h3>
                <p className="mt-1 text-[12px] leading-5 text-mes-gray-60">이 컴포넌트가 실제로 배치된 등록 화면을 참고할 수 있습니다.</p>
              </div>
              <span className="shrink-0 text-[11px] font-medium text-mes-gray-60">
                {screenReferences.length > visibleScreenReferences.length
                  ? `대표 ${visibleScreenReferences.length}개 / 전체 ${screenReferences.length}개`
                  : `${screenReferences.length}개`}
              </span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {visibleScreenReferences.map((reference) => (
                <NextLink
                  key={reference.id}
                  href={reference.route}
                  data-screen-reference={reference.id}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-w-0 items-center gap-3 rounded-mes-control border border-mes-gray-30 bg-white px-3 py-3 transition-colors hover:border-mes-primary-60 hover:bg-mes-primary-10"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-mes-control bg-mes-gray-10 text-mes-gray-70 group-hover:bg-white group-hover:text-mes-primary-70">
                    <PanelsTopLeft className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-mes-gray-120">{reference.name}</span>
                    <span className="mt-0.5 block text-[11px] text-mes-gray-60">{reference.surface}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-mes-gray-50 group-hover:text-mes-primary-70" />
                </NextLink>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-[15px] font-bold text-mes-gray-130">사용 화면</h3>
            <div className="mt-3 flex items-center gap-3 rounded-mes-control border border-dashed border-mes-gray-40 bg-mes-gray-10 px-4 py-4">
              <PanelsTopLeft className="size-4 shrink-0 text-mes-gray-50" />
              <p className="text-[12px] leading-5 text-mes-gray-60">현재 원장에 이 컴포넌트와 직접 연결된 화면이 없습니다.</p>
            </div>
          </>
        )}
      </section>
      <article className="flex min-w-0 flex-col gap-2 rounded-mes-control border border-mes-gray-30 bg-mes-gray-10 px-4 py-3" data-component-api={component.id}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[13px] font-semibold text-mes-gray-120">참고 코드</h3>
          <span className="text-[10px] font-medium text-mes-gray-60">구현 위치 확인용</span>
        </div>
        <pre className="min-w-0 overflow-x-auto text-[12px] leading-5 text-mes-gray-90"><code>{`import { ${primarySymbol} } from \"${importPath}\";`}</code></pre>
      </article>
      <Accordion
        className="overflow-hidden bg-white"
        items={[
          { id: "selection-context", title: <div><span className="block text-[14px] font-semibold">선택 맥락</span><span className="mt-0.5 block text-[11px] font-normal text-mes-gray-60">사용 조건, 피해야 할 경우, 가까운 대안을 확인합니다.</span></div>, content: selectionContext },
          { id: "internal-registry", title: <div><span className="block text-[14px] font-semibold">내부 원장 정보</span><span className="mt-0.5 block text-[11px] font-normal text-mes-gray-60">등록 상태, 구현 경로, Props와 검증 근거를 확인합니다.</span></div>, content: internalRegistry },
        ]}
      />
    </section>
  );
}
