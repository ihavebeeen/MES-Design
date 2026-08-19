import { Badge } from "@/components/ui/badge";
import registryData from "@/design-system/registry/experimental-candidates.json";
import { cn } from "@/lib/utils";

type CandidateStatus = "promoted" | "retained" | "rejected";

type CatalogEntry = {
  id: string;
  tier: 3 | 4 | 5;
  checklistItem: string;
  name: string;
};

type Promotion = {
  candidateId: string;
  registry: "component" | "pattern";
  registryId: string;
};

type DecisionBatch = {
  id: string;
  tier: 3 | 4 | 5;
  decidedAt: string;
  promotions: Promotion[];
  retainedCandidateIds: string[];
  rejectedCandidateIds: string[];
  notes: string[];
};

type ExperimentalRegistry = {
  promotionRule: string;
  catalog: CatalogEntry[];
  decisionBatches: DecisionBatch[];
};

type DecisionEntry = CatalogEntry & {
  status: CandidateStatus;
  promotion?: Promotion;
};

const registry = registryData as ExperimentalRegistry;

const STATUS_META: Record<CandidateStatus, { label: string; description: string; badge: "blueLight" | "amber" | "grayFill" }> = {
  promoted: {
    label: "표준 승격",
    description: "표준 레지스트리로 이동했지만 실제 화면 검증 전까지 provisional 상태입니다.",
    badge: "blueLight",
  },
  retained: {
    label: "실험 유지",
    description: "Experimental에서만 확인하며 표준 AI 화면 생성에는 자동 사용하지 않습니다.",
    badge: "amber",
  },
  rejected: {
    label: "현재 제외",
    description: "현재 MES 범위와 근거에 맞지 않아 코드와 자동 생성 후보에서 제외했습니다.",
    badge: "grayFill",
  },
};

function resolveDecisions(batch: DecisionBatch) {
  const promotions = new Map(batch.promotions.map((promotion) => [promotion.candidateId, promotion]));
  const retained = new Set(batch.retainedCandidateIds);

  return registry.catalog
    .filter((entry) => entry.tier === batch.tier)
    .map<DecisionEntry>((entry) => ({
      ...entry,
      status: promotions.has(entry.id) ? "promoted" : retained.has(entry.id) ? "retained" : "rejected",
      promotion: promotions.get(entry.id),
    }));
}

function StatusColumn({ status, entries }: { status: CandidateStatus; entries: DecisionEntry[] }) {
  const meta = STATUS_META[status];

  return (
    <section className="min-w-0 rounded-mes-control border border-mes-gray-30 bg-white" aria-label={meta.label}>
      <header className="border-b border-mes-gray-30 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[14px] font-semibold text-mes-gray-130">{meta.label}</h3>
          <Badge variant={meta.badge}>{entries.length}개</Badge>
        </div>
        <p className="mt-1 text-[12px] leading-5 text-mes-gray-70">{meta.description}</p>
      </header>
      <ul className="divide-y divide-mes-gray-20">
        {entries.length === 0 ? (
          <li className="px-4 py-5 text-center text-[12px] text-mes-gray-60">해당 판정 없음</li>
        ) : (
          entries.map((entry) => (
            <li
              key={entry.id}
              data-candidate-decision={entry.id}
              data-decision-status={entry.status}
              data-decision-tier={entry.tier}
              className="min-w-0 px-4 py-3"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-5 text-mes-gray-120">{entry.name}</p>
                  <p className="break-words text-[11px] leading-4 text-mes-gray-60">{entry.checklistItem}</p>
                </div>
                {entry.promotion && <Badge variant="gray">{entry.promotion.registry === "component" ? "컴포넌트" : "패턴"}</Badge>}
              </div>
              {entry.promotion && (
                <p className="mt-2 break-all rounded-mes-control-xs bg-mes-gray-10 px-2 py-1 text-[11px] text-mes-gray-80">
                  이동 대상: {entry.promotion.registry}.{entry.promotion.registryId}
                </p>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function TierDecisionSection({ batch }: { batch: DecisionBatch }) {
  const entries = resolveDecisions(batch);
  const counts = {
    promoted: entries.filter((entry) => entry.status === "promoted").length,
    retained: entries.filter((entry) => entry.status === "retained").length,
    rejected: entries.filter((entry) => entry.status === "rejected").length,
  };

  return (
    <section data-decision-tier-section={batch.tier} className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-mes-gray-40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold text-mes-gray-130">Tier {batch.tier}</h2>
            <Badge variant="gray">최초 {entries.length}개</Badge>
          </div>
          <p className="mt-1 text-[12px] text-mes-gray-60">판정일 {batch.decidedAt} · {batch.id}</p>
        </div>
        <p className="text-[12px] font-semibold text-mes-gray-80">
          승격 {counts.promoted} · 유지 {counts.retained} · 제외 {counts.rejected}
        </p>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
        {(["promoted", "retained", "rejected"] as const).map((status) => (
          <StatusColumn key={status} status={status} entries={entries.filter((entry) => entry.status === status)} />
        ))}
      </div>

      <div className="rounded-mes-control bg-mes-gray-10 px-4 py-3">
        <p className="text-[12px] font-semibold text-mes-gray-100">판정 메모</p>
        <ul className="mt-1 space-y-1 text-[12px] leading-5 text-mes-gray-70">
          {batch.notes.map((note) => <li key={note}>· {note}</li>)}
        </ul>
      </div>
    </section>
  );
}

export function CandidateDecisionGallery() {
  const decisions = registry.decisionBatches.flatMap(resolveDecisions);
  const summary = (["promoted", "retained", "rejected"] as const).map((status) => ({
    status,
    count: decisions.filter((entry) => entry.status === status).length,
  }));

  return (
    <div className="min-w-0 space-y-8" data-candidate-decision-ledger>
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-mes-gray-130">후보 판정 현황</h1>
        <p className="mt-2 max-w-4xl text-[13px] leading-6 text-mes-gray-70">
          Tier 3~5 최초 후보 {registry.catalog.length}개의 현재 위치를 한 화면에서 확인합니다. 이 화면은 실험 후보 JSON 원장을 직접 읽으므로 웹 표시와 파일 판정이 따로 관리되지 않습니다.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="전체 판정 요약">
        <div className="rounded-mes-control border border-mes-gray-30 bg-white px-4 py-4">
          <p className="text-[12px] text-mes-gray-60">최초 검토 후보</p>
          <p className="mt-1 text-[24px] font-bold text-mes-gray-130">{decisions.length}</p>
        </div>
        {summary.map(({ status, count }) => (
          <div key={status} className={cn("rounded-mes-control border border-mes-gray-30 bg-white px-4 py-4")}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] text-mes-gray-60">{STATUS_META[status].label}</p>
              <Badge variant={STATUS_META[status].badge}>{status}</Badge>
            </div>
            <p className="mt-1 text-[24px] font-bold text-mes-gray-130">{count}</p>
          </div>
        ))}
      </section>

      <div className="rounded-mes-control border border-mes-primary-30 bg-mes-primary-10 px-4 py-3 text-[12px] leading-5 text-mes-gray-90">
        <span className="font-semibold text-mes-gray-120">승격의 의미:</span> 사용자 분류가 끝났다는 뜻이며 완성 승인을 뜻하지 않습니다. 실제 MES 원본·업무 맥락·상호작용·시각 회귀를 모두 통과해야 표준 생성 자산으로 확정됩니다.
      </div>

      {registry.decisionBatches.map((batch) => <TierDecisionSection key={batch.id} batch={batch} />)}
    </div>
  );
}
