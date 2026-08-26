"use client";

import * as React from "react";
import NextLink from "next/link";
import { IconBox, IconFileNote, IconMedalCheck, IconShare, IconXCircle } from "@/components/icons";
import evaluations from "@/design-system/registry/generated-screen-evaluations.json";
import lifecycle from "@/design-system/registry/generated-screen-lifecycle.json";
import { cn } from "@/lib/utils";

const basePath = process.env.GITHUB_PAGES === "true" ? "/MES-Design" : "";

type ReviewStatus = "draft" | "review" | "approved" | "rejected" | "archived";

interface LocalDraft {
  id: string;
  name: string;
  title: string;
  targetKind: string;
  route: string;
  source: string;
  persistence: "local";
  reviewStatus: "draft";
  generationInfluence: "blocked";
  createdAt: string;
  updatedAt: string;
}

interface LocalDraftManifest {
  schemaVersion: 1;
  drafts: LocalDraft[];
}

const statusLabels: Record<ReviewStatus, string> = {
  draft: "임시 생성",
  review: "검토 대기",
  approved: "승인 완료",
  rejected: "반려",
  archived: "보관",
};

const statusStyles: Record<ReviewStatus, string> = {
  draft: "border-mes-primary-30 bg-mes-primary-10 text-mes-primary-70",
  review: "border-mes-yellow-30 bg-mes-yellow-10 text-mes-yellow-70",
  approved: "border-mes-success-30 bg-mes-success-10 text-mes-success-70",
  rejected: "border-mes-danger-20 bg-mes-danger-10 text-mes-danger-60",
  archived: "border-mes-gray-30 bg-mes-gray-20 text-mes-gray-70",
};

function StatusBadge({ status }: { status: ReviewStatus }) {
  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", statusStyles[status])}>{statusLabels[status]}</span>;
}

function ScopeBadge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "blue" | "green" }) {
  return (
    <span className={cn(
      "rounded-full px-2 py-0.5 text-[11px] font-medium",
      tone === "blue" && "bg-mes-primary-10 text-mes-primary-70",
      tone === "green" && "bg-mes-success-10 text-mes-success-70",
      tone === "gray" && "bg-mes-gray-20 text-mes-gray-70",
    )}>
      {children}
    </span>
  );
}

function PreviewFrame({ title, route }: { title: string; route: string }) {
  return (
    <div className="relative h-48 overflow-hidden border-b border-mes-gray-30 bg-mes-gray-20">
      <iframe
        title={`${title} 미리보기`}
        src={`${basePath}${route}/`}
        className="pointer-events-none absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left scale-[0.3] border-0"
      />
    </div>
  );
}

function EmptyStage({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-28 items-center justify-center rounded-mes-panel border border-dashed border-mes-gray-40 bg-mes-gray-10 px-5 text-center text-[13px] leading-5 text-mes-gray-70">{children}</div>;
}

function StageSection({ status, count, description, children }: { status: ReviewStatus; count: number; description: string; children: React.ReactNode }) {
  return (
    <section data-generated-stage={status} className="flex flex-col gap-3">
      <header className="flex items-start justify-between gap-4 border-b border-mes-gray-30 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-bold text-mes-gray-130">{statusLabels[status]}</h3>
            <span className="text-[12px] font-semibold text-mes-gray-60">{count}</span>
          </div>
          <p className="mt-1 text-[12px] leading-5 text-mes-gray-70">{description}</p>
        </div>
        <StatusBadge status={status} />
      </header>
      {children}
    </section>
  );
}

function DraftCard({ draft }: { draft: LocalDraft }) {
  return (
    <article className="overflow-hidden rounded-mes-panel border border-mes-primary-30 bg-white shadow-sm">
      <PreviewFrame title={draft.name} route={draft.route} />
      <div className="flex flex-col gap-3 p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[15px] font-bold text-mes-gray-130">{draft.name}</h4>
            <StatusBadge status="draft" />
          </div>
          <p className="mt-1 text-[12px] text-mes-gray-60">{draft.targetKind} · 최근 생성 {new Date(draft.updatedAt).toLocaleDateString("ko-KR")}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <ScopeBadge tone="blue">현재 PC에만 있음</ScopeBadge>
          <ScopeBadge>Git 제외</ScopeBadge>
          <ScopeBadge>AI 영향 차단</ScopeBadge>
        </div>
        <NextLink href={draft.route} target="_blank" className="flex h-8 items-center justify-center rounded-mes-control bg-mes-gray-130 px-4 text-[13px] font-semibold text-white">전체 화면 열기</NextLink>
      </div>
    </article>
  );
}

type TrackedCandidate = (typeof evaluations.candidates)[number];

function CandidateCard({ candidate }: { candidate: TrackedCandidate }) {
  const status = candidate.reviewStatus as ReviewStatus;
  const isStandard = candidate.generationInfluence === "standard";
  return (
    <article className="overflow-hidden rounded-mes-panel border border-mes-gray-30 bg-white shadow-sm">
      <PreviewFrame title={candidate.name} route={candidate.route} />
      <div className="flex flex-col gap-3 p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[15px] font-bold text-mes-gray-130">{candidate.name}</h4>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-[12px] text-mes-gray-60">생성일 {candidate.createdAt}{candidate.figmaNode ? ` · Figma ${candidate.figmaNode}` : " · 원본 없음"}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <ScopeBadge>Git 보존</ScopeBadge>
          <ScopeBadge tone={isStandard ? "green" : "gray"}>{isStandard ? "표준 사용 가능" : "표준 영향 차단"}</ScopeBadge>
          <ScopeBadge>{candidate.score} / 100</ScopeBadge>
        </div>
        <div className="grid gap-2 text-[12px] leading-5 text-mes-gray-80">
          <p><span className="font-semibold text-mes-gray-110">확인된 점</span> · {candidate.strengths[0]}</p>
          <p><span className="font-semibold text-mes-danger-60">남은 문제</span> · {candidate.issues[0]}</p>
        </div>
        <NextLink href={candidate.route} target="_blank" className="flex h-8 items-center justify-center rounded-mes-control border border-mes-gray-30 bg-white px-4 text-[13px] font-semibold text-mes-gray-130">전체 화면 열기</NextLink>
      </div>
    </article>
  );
}

function LifecycleSummary() {
  const icons = {
    draft: IconFileNote,
    review: IconShare,
    approved: IconMedalCheck,
    rejected: IconXCircle,
    archived: IconBox,
  };
  return (
    <div className="grid gap-2 md:grid-cols-5">
      {lifecycle.stages.map((stage) => {
        const Icon = icons[stage.id as ReviewStatus];
        return (
          <div key={stage.id} className="rounded-mes-control border border-mes-gray-30 bg-white p-3">
            <div className="flex items-center gap-2">
              <Icon size={16} className="text-mes-primary-60" aria-hidden="true" />
              <span className="text-[12px] font-bold text-mes-gray-130">{stage.label}</span>
            </div>
            <p className="mt-2 text-[11px] leading-4 text-mes-gray-60">{stage.persistence === "local" ? "현재 PC" : "Git 보존"} · {stage.generationInfluence === "standard" ? "AI 사용 가능" : "AI 영향 차단"}</p>
          </div>
        );
      })}
    </div>
  );
}

export function GeneratedScreenReview() {
  const [localDrafts, setLocalDrafts] = React.useState<LocalDraft[]>([]);
  const [localIndexAvailable, setLocalIndexAvailable] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    fetch(`${basePath}/.mes-ui-preview/index.json`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("local manifest unavailable");
        return response.json() as Promise<LocalDraftManifest>;
      })
      .then((manifest) => {
        if (active) setLocalDrafts(Array.isArray(manifest.drafts) ? manifest.drafts : []);
      })
      .catch(() => {
        if (active) setLocalIndexAvailable(false);
      });
    return () => { active = false; };
  }, []);

  const trackedByStatus = React.useMemo(() => ({
    review: evaluations.candidates.filter((candidate) => candidate.reviewStatus === "review"),
    approved: evaluations.candidates.filter((candidate) => candidate.reviewStatus === "approved"),
    archived: evaluations.candidates.filter((candidate) => ["rejected", "archived"].includes(candidate.reviewStatus)),
  }), []);

  return (
    <section id="generated-screen-review" className="flex w-full max-w-[960px] flex-col gap-8">
      <header className="rounded-mes-panel bg-white p-5 shadow-mes-panel">
        <p className="text-[13px] font-semibold text-mes-primary-60">AI GENERATED SCREEN LIFECYCLE</p>
        <h2 className="mt-1 text-[24px] font-bold">생성 시안 검토함</h2>
        <p className="mt-2 max-w-[760px] text-[14px] leading-6 text-mes-gray-80">
          임시 생성, Git 검토, 표준 승격, 보관을 분리합니다. Git에 있다는 사실과 AI가 표준 근거로 사용할 수 있다는 의미는 서로 다릅니다.
        </p>
        <div className="mt-5"><LifecycleSummary /></div>
      </header>

      <StageSection status="draft" count={localDrafts.length} description="자동 생성된 로컬 시안입니다. GitHub Pages와 다른 PC에서는 보이지 않으며 승인 전까지 표준 근거가 아닙니다.">
        {localDrafts.length > 0 ? <div className="grid gap-4 md:grid-cols-2">{localDrafts.map((draft) => <DraftCard key={draft.id} draft={draft} />)}</div> : <EmptyStage>{localIndexAvailable ? "현재 로컬 임시 시안이 없습니다." : "이 환경에는 로컬 임시 시안 인덱스가 없습니다. Git에 배포된 페이지에서는 정상적인 상태입니다."}</EmptyStage>}
      </StageSection>

      <StageSection status="review" count={trackedByStatus.review.length} description="Git에는 보존되지만 사용자 승인 전까지 AI 생성에는 영향을 주지 않는 시안입니다.">
        {trackedByStatus.review.length > 0 ? <div className="grid gap-4 md:grid-cols-2">{trackedByStatus.review.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)}</div> : <EmptyStage>현재 검토 대기 중인 Git 시안이 없습니다.</EmptyStage>}
      </StageSection>

      <StageSection status="approved" count={trackedByStatus.approved.length} description="사용자 승인과 검증을 통과해 신규 UI 생성의 표준 근거로 사용할 수 있습니다.">
        {trackedByStatus.approved.length > 0 ? <div className="grid gap-4 md:grid-cols-2">{trackedByStatus.approved.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)}</div> : <EmptyStage>Generated 시안에서 직접 승격된 승인 화면이 아직 없습니다. 기존 정식 화면은 Patterns와 Screens 레지스트리에서 관리합니다.</EmptyStage>}
      </StageSection>

      <StageSection status="archived" count={trackedByStatus.archived.length} description="시행착오와 판단을 Git에 남기되, 이후 AI 화면 생성에서는 제외합니다.">
        <div className="grid gap-4 md:grid-cols-2">{trackedByStatus.archived.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)}</div>
      </StageSection>
    </section>
  );
}
