import componentData from "@/design-system/registry/components.json";
import usageData from "@/design-system/registry/component-usage-contracts.json";
import { ContentRegionHeading } from "@/components/ui/content-region-heading";
import { SectionHeader } from "@/components/ui/section-header";

const componentById = new Map(componentData.components.map((component) => [component.id, component]));
const usageById = new Map(usageData.contracts.map((contract) => [contract.componentId, contract]));

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
  const component = activeId ? componentById.get(activeId) : undefined;
  if (!component || component.documentationMode !== "registry") return null;
  const usage = usageById.get(component.id);

  return (
    <section className="flex w-full max-w-[960px] flex-col gap-5 border-b border-mes-gray-30 pb-8" data-registry-component={component.id}>
      <header className="border-l-4 border-mes-primary-60 pl-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[17px] font-bold text-mes-gray-130">{component.name}</h2>
          <span className="rounded-full bg-mes-primary-10 px-2 py-0.5 text-[11px] font-semibold text-mes-primary-70">Tier {component.tier}</span>
          <span className="rounded-full bg-mes-success-10 px-2 py-0.5 text-[11px] font-semibold text-mes-success-70">Stable</span>
        </div>
        <p className="mt-1 text-[12px] text-mes-gray-60">{component.id} · {component.category}</p>
      </header>

      <HeadingPreview id={component.id} />

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
          <h3 className="mb-2 text-[14px] font-semibold text-mes-gray-130">상태와 제약</h3>
          <List items={[...(usage?.requiredStates ?? []), ...(usage?.constraints ?? [])]} fallback="상태와 제약은 구현 파일의 공개 Props와 등록 화면 근거를 따릅니다." />
        </article>
        <article className="rounded-mes-panel border border-mes-gray-30 bg-white p-4">
          <h3 className="mb-2 text-[14px] font-semibold text-mes-gray-130">접근성과 근거</h3>
          <List items={[...(usage?.accessibility ?? []), ...(usage?.evidence ?? [])]} fallback="네이티브 의미와 구현에 선언된 ARIA 속성을 유지하고 실제 사용 화면에서 검증합니다." />
        </article>
      </div>
      <p className="text-[12px] text-mes-gray-60">구현: {component.source} · 상세 문서: docs/components/{component.id}.md</p>
    </section>
  );
}
