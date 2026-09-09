---
name: generate-mes-ui
description: Generate, reproduce, normalize, or apply requested fixes to MES screens in this repository using the registered components, composition patterns, context rules, and visual evidence. Use whenever a user asks to make or change a MES page, center modal, side slide panel, confirmation dialog, table workflow, or generated-screen prototype. For a new screen or structural change, begin with a concise requirements dialogue before choosing fields, CRUD scope, layout, or implementation. Do not use for evaluation-only requests; route review, critique, QA, acceptance, and promotion-readiness work to audit-mes-ui.
---

# Generate MES UI

Create MES UI through the repository contract. Do not translate prose or Figma directly into free-form JSX.

## 작업 시작 대화

신규 화면 또는 화면 구조가 달라지는 요청에서는 구현보다 대화를 먼저 시작한다. 사용자가 `MES 신규 화면 제작 시작`, `새 화면 만들어줘`처럼 짧게 요청해도 같은 절차를 적용한다.

1. MES 화면 요청은 이 스킬이 요구사항과 조합 판단을 먼저 담당한다. `sites-building` 같은 일반 사이트·앱 제작 스킬이 함께 적용되더라도 업무 범위와 MES 자산 선택을 대신하게 하지 않는다. 일반 제작 스킬은 ScreenRequest가 정리된 뒤 필요한 구현 보조에만 사용한다. 사용자가 배포를 요청하지 않았다면 호스팅 작업으로 전환하지 않는다.
2. 첫 질문 전에 읽을 수 있는 범위는 `AGENTS.md`, 이 스킬, 관련 맥락 원장과 사용 근거다. 광범위한 구현 파일 조사, JSX 작성, 생성 명령, 레이아웃 확정은 답변 이후로 미룬다.
3. 사용자가 이미 말한 내용을 `사용자·업무 목적·완료 단위·주요 정보·보조 정보·행동·참고 근거·미정 사항`으로 짧게 정리한다. 첫 사용자 응답에서는 바로 구현하겠다고 선언하거나 기존 화면 패턴에 맞추겠다고 확정하지 않는다.
4. 먼저 다음 중 아직 모르는 업무 사실을 묻는다. 이미 제공된 항목은 건너뛴다.
   - 누가 어느 시점에 이 화면을 사용하는가
   - 화면에서 끝내야 하는 업무와 완료 상태는 무엇인가
   - 조회·등록·수정·삭제·승인 등 실제로 필요한 행동은 무엇인가
5. 위 사실이 정리되기 전에는 CRUD 범위를 `권장`으로 확정하거나 필드 목록을 `필수`로 선언하지 않는다. 예상 항목을 보여줄 때는 후보 또는 예시라고 표시한다. 이후 주요/보조 정보, 필수·선택·자동 기록 여부, 선택 방식과 화면 구조 중 결과를 바꾸는 미정 사항을 묻는다.
6. 한 번에 서로 관련된 질문 1~3개를 묻고 답을 기다린다. 질문 도구가 있으면 짧고 서로 배타적인 선택지를 사용한다. 이미 받은 답, 등록된 공통 MES 규칙, 표준 토큰, 기본 취소 동작은 다시 묻지 않는다. 관련 없는 맥락 축을 채우기 위해 질문을 늘리지 않는다.
7. 사용자가 `알아서 해줘`라고 답하면 작은 표현 차이는 합리적으로 결정한다. Shell, 주요/보조 정보, 다중 선택, 일괄 처리, 저장 단위처럼 업무 흐름을 바꾸는 선택은 권장안과 이유를 제시하고 확인을 받는다.
8. 필요한 답을 받으면 구현 전에 아래 형태로 한 번만 시작 범위를 확인한다. 미정 사항이 결과를 바꾸지 않으면 `없음`으로 표시하고 바로 진행한다.

   ```text
   작업 목적:
   주요 정보:
   보조 정보:
   사용자 행동:
   제작 범위:
   참고 근거:
   남은 미정 사항:
   ```

9. 답이 필요한 상태에서는 JSX 작성, 임시 대체 UI 제작, Shell 확정, 생성 명령 실행을 시작하지 않는다. 구현 제약이 새로 발견되면 같은 방식으로 영향과 선택지를 설명하고 필요한 결정만 다시 묻는다.

팝업의 문구 수정, 간격 조정처럼 대상과 변경 범위가 명확한 작은 수정에는 전체 시작 대화를 반복하지 않는다. 평가만 요청받은 경우에는 이 절차 대신 `audit-mes-ui`로 연결한다.

이 절차는 에이전트가 지켜야 하는 대화 계약이다. 저장소 검사는 대화 자체를 감시하지 않는다. 이후 `ScreenRequest`와 resolver가 선택된 업무 행동의 근거, 미정 blocker, 자산 연결을 다시 검사하므로 질문 답변을 메모에만 남기지 말고 실행 계약에 반영한다.

## Boundary with AUDIT

- This skill owns creation, reproduction, normalization, requested fixes, and the mandatory verification needed to hand off its own implementation.
- `audit-mes-ui` owns evaluation-only requests, independent findings, broader UX/accessibility review, and promotion-readiness recommendations.
- The delivery gate in this skill is not a substitute for an independent AUDIT. It proves only the declared implementation scope before handoff.
- When the user requests both evaluation and correction, run `audit-mes-ui` first, implement the accepted findings here, then run `audit-mes-ui` again on the changed render.

## Scope and stop conditions

These requirements apply to **all MES outputs**, including separate folders, temporary HTML, chat mockups, prototypes and localhost previews. “Do not modify the repository” constrains where files may be written; it does not waive MES reuse. “The screen may differ” allows the requested composition change, not arbitrary replacements for shared controls, navigation, typography or tokens. Generic UI skills and templates cannot replace MES rules.

If permissions, dependencies, tools or supported templates prevent reuse/verification, stop delivery, explain the specific constraint and viable MES-based alternatives, and request the necessary approval. Do not quietly create a standalone HTML/CSS substitute. A proposed new asset needs scoped approval, implementation and supported verification; approval is not permission to mark an unchecked result as verified.

Before JSX, identify the applicable shell/chrome, approved patterns and MES APIs. The order is **select first, generate second, verify the selected contract last**. The resolver must bind the selected target and host patterns—including required assets, prohibited substitutes and declared interaction props—into the executable contract. The generator/implementation follows that contract; the audit detects drift from it. A global deny list must not choose the design, and rules from an unselected pattern must not affect the screen.

Match verification to the requested work: popup layout/fields use `verificationScope: surface`; parent selection or save-to-list changes use `connected-flow`. Only the latter requires `hostPage` entry behavior. Unknown parent details must not block popup-only work: use the labeled MES preview frame without inventing business menus/records. Reuse an existing connected background when available; never duplicate navigation inside the dialog. All ordinary desktop pages still use Sidebar and PageTopTabItem. See `references/templates.md` for scope defaults and host props. Do not narrow an integration request to evade missing information or failure; ask only about the necessary connection, or agree a partial delivery. New UI needs no matching original; reproduction/normalization compares the requested original. Reuse contract notes rather than another planning document.

For the executable `section.page-query-table` pattern, preserve the MES page-list grammar rather than borrowing the popup list composition: title and period query, grouping, filter, quick query, search, then the table-owned vertical infinite-scroll area. The bottom bar separates left-side Copy/Download utilities from right-side task actions. Do not add Pagination, and do not use `SearchTableSection` as the main page surface. A popup connected to that host declares `hostPage.pagePatternRef: section.page-query-table` and `entryBehavior: row-double-click`: row single click may select/activate it, while the actual MES `Table.onRowDoubleClick` (keyboard Enter equivalent) opens the row's popup. A per-row action button uses `entryBehavior: explicit-action` only when a registered screen or the user explicitly requires that exception, and records that basis in `entryReason` plus `entryEvidenceRef`. `webContext.pageArchetypeRef` remains reference-only and never activates this enforcement by itself. The overlay remains above the same application chrome; popup rules do not replace its background page rules.

Match the required components and their relationship before writing a side-slide body. A `SideSlidePanel` shell does not by itself justify any inner composition, including a search/table area. Reuse a compatible approved recipe when available. If a lookup Table is genuinely part of the slide workflow, explain the component connection and select or propose a compatible side-slide section pattern instead of borrowing a center-modal composition only because it fits visually.

## Workflow

1. Read `AGENTS.override.md`, then read `references/repository-contract.md` and `references/delivery-gate.md`. For a deterministic template request, also read `references/templates.md`.
2. Route evaluation-only requests to `audit-mes-ui`; do not modify the UI merely because an audit found an issue. For authorized creation or change work, classify the implementation intent before retrieving examples. If the `mes-ui` MCP server is connected, call `mes_list_design_system`, then:
   - for `new`, call `mes_get_web_generation_context` with the 업무명 or closest menu. It also returns `referenceContext`: scoped business information, page/popup/section usage examples, and Figma foundation recipes. These are explicitly **reference-only** and do not contain reproduction audit claims. Use `category: references` with optional `targetKind`, `taskIds`, or `usageIds` for a narrower lookup;
   - for `reproduce` or `normalize`, call `mes_get_reproduction_audit_context` to retrieve the specific runtime and Figma comparison evidence.
   When MCP is unavailable, use `npm run screen:references -- --query "입고등록" --surface side-slide-panel` from `component-library/` for the same business/usage references (`--list`, `--task`, `--usage` narrow the lookup). The existing `getWebGenerationContext` / `getReproductionAuditContext` exports still provide web observations.
3. Before choosing a layout for `new` or a structural change, read the [selection context framework](../../../component-library/src/design-system/registry/selection-context-framework.json) and the [screen intake policy](../../../component-library/src/design-system/registry/screen-intake-policy.json). The framework is the shared vocabulary for task purpose, target/scope, completion/save unit, information role and relationship, simultaneous reference, workflow, repetition, comparison, selection, state, entry/exit, environment and evidence uncertainty. Establish the relevant dimensions before comparing assets; do not make the POC discover these dimensions from scratch. Use the intake policy's `contextDimensions` links to ask only about material gaps after inspecting supplied facts and relevant contracts; multiple task facets can coexist. Ask 1–3 related questions at a time, not a fixed questionnaire. `unaddressed` is not automatically a failure, while a relevant `unresolved` value must remain visible until it is answered or explicitly left as a draft assumption. Known answers, standard tokens, and established cancel behavior do not need reconfirmation. For a small change, revisit only affected dimensions and answers. For `reproduce`, inspect the target node metadata and design context; ask only about missing behavior or evidence conflicts, not a new layout preference.
   Preserve material answers, sources, assumptions, and scope in existing `requirements` and `evidence.notes` using the policy's note format. Put decision-bearing facts in `evidence.decisions` and link selected business behavior through `assetDecisions.elements[].evidenceRef`. A `confirmed` user fact must preserve an exact current-user sentence as `sourceRef: 사용자 원문: "…"`; never paraphrase an assistant suggestion, an earlier generated request, a nearest screen, or a design-system example as a user request. Those sources can be `supported` references or `assumed` proposals only. Do not add an intake MD or a separate composition-plan file. At this stage establish the needed information, actions, ownership, comparison and state relationships; do not yet turn `popup`, `form`, `table`, `좌우`, or `상하` into the answer.

   A high-impact choice cannot be justified by one convenient sentence reused across several decisions. Build a **decision basis set** for each Shell, Section pattern, selection model and workflow action. Each fact in the set records `decisionSubject`, `factor`, and the same `selectedOption`. For a popup Shell that the user did not explicitly name, use independent factors covering (a) task purpose or workflow, (b) information role or relationship, and (c) interaction continuity, space/density or approved pattern context, then compare the nearest alternative. An exact user or functional-spec instruction such as “중앙 모달로 해” may use the single `explicit-direction` factor. A statement such as “개별 건을 편집한다” describes the edit target only: it does not decide the popup Shell, remove the main-list checkbox, or remove common footer actions. Selection cardinality, selection result and batch action are separate factors and must not borrow that sentence as their evidence. A single answer about background visibility, record count, task length, width or one dependency never selects a shell or table. If direction is unspecified, compare assets from the full context and approved MES evidence; record the rejected shell alternative and reason, and ask only when the unresolved difference materially changes workflow or hierarchy. Inspect Figma when supplied or needed for visual evidence. Treat unmeasured guesses as review notes, never facts.
   Apply this to **pages, center/slide/confirmation popups and their sections**, not only slide bodies. Business primary/supporting/other roles are candidates relative to the current task; necessity, acquisition, editability, ownership, visibility timing and relationships are separate dimensions. Historical `required`, default values or layouts are not new requirements. Keep current facts separate from reference hypotheses; missing/stale/conflicting references do not block a new task or require every historical question to be answered. Ask only about material current uncertainty. Do not infer importance from top/left position or force an old business into the new request. Reuse compatible assets even when the example's layout differs; a difference alone is not a new-asset proposal.
   If the user requests a MES weight, freedom level or a region-specific exception, read [design-system weight design](../../../docs/AI_UI_맥락_규칙.md#design-system-weights) before resolving. Apply the interpretation and current-support boundary below; no extra questionnaire for the default strict workflow.
4. Before finalizing `ScreenRequest`, extract the **meaningful information and actions** and match them to the context of individual MES components. Do not choose a popup type and then fill it with convenient controls. For each need, explain why it exists in the task; compare the component's capabilities, `useWhen`, `doNotUseWhen`, state model and alternatives; then explain how the selected components connect through the same subject, save unit, sequence or comparison. Only after that connection is coherent, compare Section/Recipe/Shell candidates that support it. `usage-contexts.json#assetSelectionGuide` is the reference structure; its contexts are suggestions, not hard gates.
   Cover only reusable/behavioral elements—not every wrapper, label or spacing token—across application frame, navigation/query, content structure, data display, status/feedback, input/selection, actions and overlay behavior. Mark categories that genuinely do not apply; an unreviewed category is a prompt to look again, not proof of an error. A Table is chosen for aligned multi-record/multi-value comparison, scanning, selection or totals—not because the result is a popup. A single change result may fit `BeforeAfterComparison` or a summary SectionFrame better. Read-only information is included only when it identifies the subject or supports the current input/judgement.
   For each element record its required capability, actual parent pattern chain, evidence basis (`confirmed | supported | assumed | unresolved`), and whether it changes presentation or business behavior. A selected business behavior needs a linked `evidenceRef` and the asset's `decisionSubject` must match the evidence's subject; an assumed or unresolved behavior remains `deferred`. Multiple components may share evidence only when they implement the same decision subject. In particular, do not invent multi-selection, batch save, common values, per-target values, entry buttons, or a popup type because a component supports them. `Table.selectable` requires the selection cardinality/result (`task.selection`) and, when values are written back to selected targets, the common-versus-per-target ownership (`task.edit-scope`). Keep the standard main-list checkbox and left/right footer grammar unless the request contains separate evidence for changing those behaviors; editing one active row is compatible with retaining list selection. Record the selected component context, its connection to neighboring assets, the resulting pattern/shell candidate and the nearest rejected alternative in `requirements`/`evidence.notes`. Then call `mes_match_screen_assets`. With no MCP, write a temporary Git-ignored draft under `.mes-ui-preview/<request-id>/` and run:

   ```bash
   npm run screen:match-assets -- .mes-ui-preview/<request-id>/semantic-assets.json
   ```

   Treat the result as advice. It must not auto-select a candidate. Every registered component contributes a semantic selection context; selection-critical assets additionally contribute parent/state/interaction contracts. Parent-and-capability matches are the strongest candidates, while context-only matches still require actual API and composition review. After component relationships are coherent, compare the returned pattern candidates and their context rules. Ask the user only when an unresolved choice materially changes business behavior or the screen hierarchy. A missing candidate means search the wider registry once more, then consider a quarantined proposal—it does not automatically authorize a new asset. Conversely, do not ignore an exact candidate solely because a free-form implementation is easier.
   Put only adopted choices in the final request's `assetDecisions`, and connect each `selectedComponentRef` to the actual section `componentRefs` or selected pattern requirements. Keep deferred or proposed items only when they remain materially relevant. A presentation warning can be corrected or accepted with a concrete reason; an unconfirmed business behavior cannot be accepted as selected merely to continue generation. Candidate suggestions and unreviewed categories remain informational.
   After the component connections and Section/Recipe/Shell candidates are coherent, compare the returned `foundationRecipes`. Use their purpose, information relationship, composition, visual traits and adaptation notes to tune hierarchy, density, spacing rhythm and visual character. These frames are legacy foundations: translate their fields, relationships and composition character through the **current registered MES components**. Current component defaults, variants, states and interactions override conflicting legacy visuals. For example, keep the current main Table's vertical separators even when the old frame lacks them. Never recreate an old control appearance with local CSS or weaken a current component contract merely to resemble the foundation frame. Do not choose a foundation recipe before understanding the task, copy all regions from one source frame, or treat isolated measurements as tokens. Multiple recipes may contribute, and no match is allowed. Record only the adopted traits and materially rejected alternative in existing `evidence.notes`; do not create a separate recipe report.
5. Write a `ScreenRequest` JSON that conforms to `component-library/src/design-system/registry/screen-request.schema.json`. `webContext` optionally records observed page/overlay/section references; missing, unknown or different-layout references yield no blocker. The chosen MES assets and executable configuration are still validated. Keep prototype request and contract files under the Git-ignored `component-library/.mes-ui-preview/<request-id>/` directory. When using a nearest ScreenSpec, preserve its ordered sections unless the current new-screen request explicitly chooses a different composition; do not flatten order into `sectionRefs` or copy old order merely because it exists.
   Set `output.route` to `/preview/<request-id>` so the generated screen receives a local-only preview URL.
6. Resolve it before JSX. Prefer `mes_resolve_screen`; use the CLI only when MCP is unavailable:

   ```bash
   cd component-library
   npm run screen:resolve -- .mes-ui-preview/<request-id>/request.json --out .mes-ui-preview/<request-id>/contract.json
   ```

7. Stop on resolver blockers. Inspect `referenceContext` as suggestions only, and `decisionTrace.contextAssessment` before the chosen shell, ordered sections, behaviors, action set, components and adopted `assetSelection`. Confirm that the evidence used for an important choice maps to the intended context dimension and decision subject; a workflow fact cannot silently become a selection-count or layout-density fact. Review `needs-review` decisions and relevant unresolved dimensions, but do not fail work only because unrelated dimensions are `unaddressed`. Confirm that every selected semantic asset is linked to the implementation composition; a recorded decision that is not used in `componentRefs` is not compliance. `implementation.patternContracts` and, when supplied, `implementation.hostPagePatternContract` must describe the assets and interactions the implementation will actually use. Reference retrieval does not prove selection quality. Check that current intake answers are reflected in actual structure and behavior configuration, not just copied into notes. Do not copy reference candidates into required fields, readonly state or fixed layouts automatically. Resolve actual implementation warnings by evidence or record them in local notes; reference differences need no waiver or extra report. Changing only the `referenceContext` annotation does not invalidate code-bound verification; actual request/implementation changes still do.
8. When the resolved recipe has a supported deterministic template, call `mes_generate_screen` instead of writing JSX freely. This tool resolves, generates, audits the written files and creates an **internal-QA-only** preview. `qaPreviewUrl` is not a user handoff; `handoffReady` remains false. Use the CLI fallback only when MCP is unavailable:

   ```bash
   npm run screen:generate -- .mes-ui-preview/<request-id>/contract.json --preview
   ```

9. Otherwise implement only with resolved registry references. Use registered components and pattern sources, never native controls or custom CSS substitutes in the screen/helpers. Native HTML inside the actual DS component implementation is normal. After implementation, use the same checked internal-QA preview entrypoint; do not hand-write an alternate route/server to skip it:

   ```bash
   npm run screen:preview -- .mes-ui-preview/<request-id>/contract.json src/generated-previews/<request-id>.tsx
   ```
10. Inspect the final-file audit produced by preview creation. For read-only diagnosis use `mes_audit_screen` or the CLI below. These checks inspect JSX/call import bindings and local dependencies, not only names/import text. Pattern-specific required assets, prohibited substitutes and entry props come from the patterns selected in the resolved contract; they are deviation checks, not a second pattern selector. `Table selectable` without a selected `selection.*` contract, or without linked selection/edit-scope evidence in an asset-reviewed request, is a blocker. Every structured section must expose its ScreenSpec ID through `data-section-id`, in the same order as the resolved contract. A missing audit, execution error or blocker stops handoff; a disclaimer cannot downgrade it. Run relevant build/type and interaction checks as well:

   ```bash
   npm run screen:audit -- path/to/contract.json path/to/implementation.tsx
   npm run check:design-system
   ```

11. Inspect the exact internal `qaPreviewUrl` at the target viewport. A `connected-flow` preview starts with the overlay closed so the real entry path is tested; a popup-only `surface` preview may open immediately. Check the requested surface's MES assets/styles, hierarchy, console, overflow and applicable inputs/selection/save/cancel/X/Escape/reopen; include background blocking and focus return. Verify that read-only subject information uses the matching MES contract (`Descriptions` for compact name/value summary, `Input readOnly` only when it must align with an editable form), dates use the registered temporal control, and memo-like long content is not reduced to a single-line field without evidence. For `connected-flow`, additionally verify the relevant parent trigger/data transfer/update and preservation of query/selection/scroll. For `surface`, do not demand unrelated parent behavior or claim it was verified. An unchanged-looking background or callback counter does not prove business persistence. For `new`, use MES rules rather than an invented original; reproduction/normalization/audit compares the requested original. Captures remain optional aids, but actual rendering/interaction confirmation within scope is required.
12. Record actual observations briefly through the handoff command/tool; it saves `visual-review.json` with code-bound fingerprints automatically. Do not hand-write seven prose checks or a new MD for each run. Add a note only for a discrepancy/new decision; static warnings still need a resolution reason, which can reuse the contract's existing evidence. Separate automatic results, observed results and unknowns. Neither “prototype” nor “recorded as a limitation” is a pass. After code/asset/contract changes rerun preview/audit and affected browser checks. An unchanged render can reuse its previous observation even after a static audit rerun. Immediately before providing the URL:

   ```bash
   # Only after real rendering/interaction confirmation; add --source-compared for reproduction.
   npm run screen:handoff -- .mes-ui-preview/<request-id>/contract.json src/generated-previews/<request-id>.tsx --reviewed
   # Same render, re-delivery: omit --reviewed to reuse the saved observation.
   ```

   With MCP, `mes_handoff_screen` takes the same request/sourcePath and optional `review: { reviewer, rendered: true, interactions: true }` (plus `sourceCompared: true` for original comparison). Omit `review` to reuse the current observation. Flags assert actual confirmation of the declared scope, not automated browser testing. The returned `verification` states the scope and whether parent integration was included; preserve this distinction in the user response. Only successful fresh handoff may be presented as checked. In-scope unknowns/failures still block; out-of-scope parent integration is recorded automatically, not disguised as a passed check. Supported API/layout options are not violations by themselves; unsupported combinations need scoped support/tests, not a skip flag.
13. Register newly discovered semantics as quarantined proposals. Never promote a one-off visual fragment directly into the stable component or pattern registry.

## Selection rules

- Apply the asset selection ladder to every meaningful component, section pattern, behavior, shell, and action set: exact approved match first; then a compatible existing candidate; only then a quarantined new-asset proposal.
- A visually similar candidate is reusable only when semantic role, interaction effect, selection cardinality, state model, accessibility contract, allowed parent, and information hierarchy remain valid. Otherwise reject it instead of restyling it into another control.
- Start from `nearestScreenId` whenever an applicable registered screen exists.
- For source-less `new` requests, use `web-generation-context.json` as the actual-web composition guide. Do not feed `web-figma-reconciliation.json` or incomplete verification counts into generation.
- `repeated` web grammar can guide composition. `single-case` grammar is a nearest example and cannot become a default without another evidence case or explicit approval.
- Reuse a shell, section pattern, behavior pattern, and action set before considering a new composition.
- Preserve business hierarchy, information order, copy, and interaction semantics from the source.
- Normalize accidental 3px, 9px, 13px, or isolated styling only after classifying it as an inconsistency with evidence. Do not silently normalize intentional exceptions.
- A central modal, side slide panel, page, and confirmation dialog are different semantic shells. Never substitute one because its content happens to fit.
- Repeating input rows are not automatically tables. Use table patterns only for tabular comparison, scanning, selection, sorting, or aligned columns.
- Cancel and the top-right close action discard uncommitted changes and close when the registered dismissal policy requires it.

## Design-system weights — designed, execution support pending

- Default to weight `1`. Interpret an explicit request per region and per layer: foundations (color/type/spacing), components, composition. Preserve whole-screen purpose and hierarchy before selecting individual assets. Keep application chrome at `1` unless the user explicitly includes it. Existing business/usage contexts remain reference-only at every weight.
- `1` uses approved assets and supported combinations; `0` permits independent design exploration within the authorized scope; intermediate values express relative MES preference, not a reuse percentage, random choice or audit score. Composition freedom alone does not authorize restyling controls or tokens. Never lower a weight to work around missing APIs, tooling or a failed check.
- New token/component/variant/pattern creation needs separate scoped permission. A low weight alone does not authorize it; creation permission does not automatically relax weight `1`. At that conflict, reuse, propose a separately approved asset, or ask about changing that region's component/composition weight. Do not promote drafts or modify shared assets implicitly.
- **Current support:** ScreenRequest, resolver, generator, audit and handoff do not yet execute weighted exceptions. Keep requested settings briefly in `requirements` / `evidence.notes`; never insert the design's proposed JSON fields into a current request or claim those notes affect validation. If the desired result fits current supported MES composition, implement normally. Otherwise explain the unsupported scope and obtain agreement for a MES-supported alternative or a separate implementation task. Do not silently deliver a strict substitute for the requested exploration.
- Future execution must bind approved scopes/settings to the final-code audit and handoff, with separate strict/extended/exploratory labels. Compilation, declared behavior, accessibility and overflow checks remain applicable in all modes. The linked design owns defaults, precedence, example and implementation acceptance cases; a numeric setting is never a verification waiver.

## Output contract

For an ordinary prototype, create and return the following as local Git-ignored artifacts:

- input `ScreenRequest` and resolved contract under `.mes-ui-preview/`;
- implementation source under `src/generated-previews/`;
- internal QA page under `src/app/preview/`; provide its localhost URL only after the handoff gate succeeds;
- automatically saved, code-bound `implementation-audit.json` and compact `visual-review.json` under `.mes-ui-preview/`; captures only when useful/requested.

The preview commands no longer auto-register unchecked drafts in the user catalog. Distinguish **program-enforced** managed-command checks from **agent duties** (baseline selection, truthful visual comparison, not bypassing the workflow). The repository cannot intercept arbitrary external servers, every shell command or a manually pasted URL. Report these limits; do not claim complete prevention. Global Hooks/permissions require separate explicit authorization.

Do not add a prototype to `generated-screen-evaluations.json`, a production route, or the stable registry unless the user explicitly asks to preserve or promote it. Promotion is a separate task that moves approved code and evidence into tracked repository locations.

Use `구현됨`, `검증됨`, `배치 완료`, and `전체 완료` exactly as defined in `AGENTS.override.md`.
