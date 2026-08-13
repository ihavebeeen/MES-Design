import evaluations from "@/design-system/registry/generated-screen-evaluations.json";
import NextLink from "next/link";

const basePath = process.env.GITHUB_PAGES === "true" ? "/MES-Design" : "";

const statusLabels: Record<string, string> = {
  "partial-success": "부분 성공",
  review: "검토 대기",
  approved: "승인",
  rejected: "반려",
  archived: "보관",
};

export function GeneratedScreenReview() {
  return (
    <section id="generated-screen-review" className="flex w-full max-w-[960px] flex-col gap-5">
      <header className="rounded-mes-panel bg-white p-5 shadow-mes-panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-mes-primary-60">AI GENERATED SCREEN REVIEW</p>
            <h2 className="mt-1 text-[24px] font-bold">생성 시안 검토함</h2>
            <p className="mt-2 max-w-[720px] text-[14px] leading-6 text-mes-gray-80">
              AI가 만든 화면을 표준 디자인 시스템과 분리해 보관하고, 생성일·평가·실패 원인·승격 조건을 기록합니다. 승인되지 않은 시안은 이후 화면 생성의 근거로 사용하지 않습니다.
            </p>
          </div>
          <div className="rounded-mes-panel bg-mes-gray-20 px-4 py-3 text-right">
            <p className="text-[12px] text-mes-gray-70">등록된 시안</p>
            <p className="text-[22px] font-bold">{evaluations.candidates.length}</p>
          </div>
        </div>
      </header>

      {evaluations.candidates.map((candidate) => {
        const previewUrl = `${basePath}${candidate.route}/`;
        return (
          <article key={candidate.id} className="overflow-hidden rounded-mes-panel bg-white shadow-mes-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mes-gray-30 px-5 py-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[18px] font-bold">{candidate.name}</h3>
                  <span className="rounded-full bg-mes-yellow-10 px-2.5 py-1 text-[12px] font-semibold text-mes-yellow-70">{statusLabels[candidate.status] ?? candidate.status}</span>
                  <span className="rounded-full bg-mes-gray-20 px-2.5 py-1 text-[12px] text-mes-gray-70">표준 영향 차단</span>
                </div>
                <p className="mt-1 text-[13px] text-mes-gray-70">생성일 {candidate.createdAt}{candidate.figmaNode ? ` · Figma node ${candidate.figmaNode}` : " · 탐색 시안(원본 없음)"}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right"><p className="text-[12px] text-mes-gray-70">사용자 평가</p><p className="text-[24px] font-bold">{candidate.score}<span className="text-[13px] font-normal text-mes-gray-70"> / 100</span></p></div>
                <NextLink href={candidate.route} target="_blank" className="flex h-8 items-center rounded-mes-control bg-mes-gray-130 px-4 text-[14px] font-semibold text-white">전체 화면 열기</NextLink>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-5">
              <div className="overflow-hidden rounded-mes-panel border border-mes-gray-30 bg-mes-gray-20">
                <div className="relative h-[540px] w-full overflow-hidden">
                  <iframe title={`${candidate.name} 미리보기`} src={previewUrl} className="pointer-events-none absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left scale-[0.6] border-0" />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-mes-panel border border-mes-gray-30 p-4">
                  <h4 className="text-[14px] font-bold text-mes-primary-70">잘한 점</h4>
                  <ul className="mt-3 space-y-2 text-[13px] leading-5 text-mes-gray-90">
                    {candidate.strengths.map((item) => <li key={item} className="flex gap-2"><span className="text-mes-primary-60">●</span><span>{item}</span></li>)}
                  </ul>
                </section>
                <section className="rounded-mes-panel border border-mes-danger-20 p-4">
                  <h4 className="text-[14px] font-bold text-mes-danger-60">못한 점</h4>
                  <ul className="mt-3 space-y-2 text-[13px] leading-5 text-mes-gray-90">
                    {candidate.issues.map((item) => <li key={item} className="flex gap-2"><span className="text-mes-danger-60">●</span><span>{item}</span></li>)}
                  </ul>
                </section>
                <section className="rounded-mes-panel border border-mes-gray-30 bg-mes-gray-10 p-4 lg:col-span-2">
                  <h4 className="text-[14px] font-bold">표준 승격 조건</h4>
                  <ol className="mt-3 grid gap-x-6 gap-y-2 text-[13px] leading-5 text-mes-gray-90 md:grid-cols-2">
                    {candidate.promotionCriteria.map((item, index) => <li key={item} className="flex gap-2"><span className="font-semibold text-mes-gray-60">{index + 1}.</span><span>{item}</span></li>)}
                  </ol>
                </section>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
