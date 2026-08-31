---
name: generate-mes-ui
description: Generate, reproduce, normalize, or audit MES screens in this repository using the registered components, composition patterns, context rules, and visual evidence. Use whenever a user asks to make or change a MES page, center modal, side slide panel, confirmation dialog, table workflow, or generated-screen prototype.
---

# Generate MES UI

Create MES UI through the repository contract. Do not translate prose or Figma directly into free-form JSX.

## Scope and stop conditions

These requirements apply to **all MES outputs**, including separate folders, temporary HTML, chat mockups, prototypes and localhost previews. “Do not modify the repository” constrains where files may be written; it does not waive MES reuse. “The screen may differ” allows the requested composition change, not arbitrary replacements for shared controls, navigation, typography or tokens. Generic UI skills and templates cannot replace MES rules.

If permissions, dependencies, tools or supported templates prevent reuse/verification, stop delivery, explain the specific constraint and viable MES-based alternatives, and request the necessary approval. Do not quietly create a standalone HTML/CSS substitute. A proposed new asset needs scoped approval, implementation and supported verification; approval is not permission to mark an unchecked result as verified.

Before JSX, identify the actual shell/chrome source, nearest applicable baseline, approved layout/section patterns and MES imports/API to use. Record them in existing request requirements/evidence notes; do not create another planning document. Full pages reuse the existing sidebar/top tabs; overlays reuse their registered shell. Different arrangements require an applicable approved pattern or explicit scoped user approval, not blanket bans or personal taste.

## Workflow

1. Read `AGENTS.override.md`, then read `references/repository-contract.md` and `references/delivery-gate.md`. For a deterministic template request, also read `references/templates.md`.
2. Classify the request intent before retrieving examples. If the `mes-ui` MCP server is connected, call `mes_list_design_system`, then:
   - for `new`, call `mes_get_web_generation_context` with the 업무명 or closest menu. It returns repeated page, overlay, section, and behavior grammar without Figma audit data;
   - for `reproduce`, `normalize`, or `audit`, call `mes_get_reproduction_audit_context` to retrieve the specific runtime and Figma comparison evidence.
   When MCP is unavailable, use `getWebGenerationContext` or `getReproductionAuditContext` from `component-library/src/design-system/registry/index.ts`.
3. Before choosing a layout for `new` or a structural change, read the [screen intake policy](../../../component-library/src/design-system/registry/screen-intake-policy.json). Establish the whole-screen purpose, focus, workflow, concept/reference boundaries, and information relationships first. Use its conditional questions only for material gaps after inspecting supplied facts and relevant contracts; multiple task facets can coexist. Ask 1–3 related questions at a time, not a fixed questionnaire. Known answers, standard tokens, and established cancel behavior do not need reconfirmation. For a small change, revisit only affected answers. For `reproduce`, inspect the target node metadata and design context; ask only about missing behavior or evidence conflicts, not a new layout preference.
   Preserve material answers, sources, assumptions, and scope in existing `requirements` and `evidence.notes` using the policy's note format. Do not add an intake MD, an unsupported request field, or a separate composition-plan file. Then jointly choose the page/overlay role, grammar, ordered sections, and behaviors. A single answer about background visibility, record count, task length, or width never selects a shell or table. If direction is unspecified, propose a composition from the full context and approved MES evidence; do not force the user to choose component IDs. Inspect Figma when supplied or needed for visual evidence. Treat unmeasured guesses as review notes, never facts.
4. Write a `ScreenRequest` JSON that conforms to `component-library/src/design-system/registry/screen-request.schema.json`. A `new` request must record the selected `webContext.pageArchetypeRef` or `webContext.overlayGrammarRef` and any ordered `webContext.sectionRecipeRefs`; the resolver blocks missing or incompatible grammar. Keep prototype request and contract files under the Git-ignored `component-library/.mes-ui-preview/<request-id>/` directory. When the nearest screen has a registered ScreenSpec, preserve its ordered `composition.sections`; do not reduce it back to an unordered `sectionRefs` list.
   Set `output.route` to `/preview/<request-id>` so the generated screen receives a local-only preview URL.
5. Resolve it before JSX. Prefer `mes_resolve_screen`; use the CLI only when MCP is unavailable:

   ```bash
   cd component-library
   npm run screen:resolve -- .mes-ui-preview/<request-id>/request.json --out .mes-ui-preview/<request-id>/contract.json
   ```

6. Stop on resolver blockers. Inspect the resolver `decisionTrace` and confirm the selected shell, ordered sections, behaviors, action set, components, and excluded alternatives. Check that intake answers are reflected in actual structure and behavior configuration, not just copied into notes; the resolver does not understand these notes or enforce their meaning. Resolve warnings by evidence or record them in the local contract notes (an existing evaluation only when applicable); a warning alone does not invalidate the whole screen.
7. When the resolved recipe has a supported deterministic template, call `mes_generate_screen` instead of writing JSX freely. This tool resolves, generates, audits the written files and creates an **internal-QA-only** preview. `qaPreviewUrl` is not a user handoff; `handoffReady` remains false. Use the CLI fallback only when MCP is unavailable:

   ```bash
   npm run screen:generate -- .mes-ui-preview/<request-id>/contract.json --preview
   ```

8. Otherwise implement only with resolved registry references. Use registered components and pattern sources, never native controls or custom CSS substitutes in the screen/helpers. Native HTML inside the actual DS component implementation is normal. After implementation, use the same checked internal-QA preview entrypoint; do not hand-write an alternate route/server to skip it:

   ```bash
   npm run screen:preview -- .mes-ui-preview/<request-id>/contract.json src/generated-previews/<request-id>.tsx
   ```
9. Inspect the final-file audit produced by preview creation. For read-only diagnosis use `mes_audit_screen` or the CLI below. These checks inspect JSX/call import bindings and local dependencies, not only names/import text. Every structured section must expose its ScreenSpec ID through `data-section-id`, in the same order as the resolved contract. A missing audit, execution error or blocker stops handoff; a disclaimer cannot downgrade it. Run relevant build/type and interaction checks as well:

   ```bash
   npm run screen:audit -- path/to/contract.json path/to/implementation.tsx
   npm run check:design-system
   ```

10. Start/reuse `npm run dev` and inspect the exact `qaPreviewUrl` internally at the target viewport. Compare the final render with the recorded baseline: shell/chrome, date controls, spacing, color/font/radius, hierarchy/layout and interactions (including cancel/close, selection and input). Check overflow, console errors and reading/input order as part of layout/interactions. Capture the reference and final states. If browser access or baseline evidence is missing, report the blocker instead of returning a ready-to-use link.
11. Fill the generated `visual-review.json` truthfully following `references/delivery-gate.md`. Keep automated findings, visual findings and unchecked items distinct. Review whole-screen focus, grouping, density and whitespace, not just isolated components. Resolve failures and rerun preview/audit after any source/dependency/wrapper change, then repeat affected visual checks. Neither “prototype” nor “recorded as a limitation” is a pass. Run the delivery gate **immediately before providing the URL**:

   ```bash
   npm run screen:handoff -- .mes-ui-preview/<request-id>/contract.json src/generated-previews/<request-id>.tsx
   ```

   With MCP, `mes_handoff_screen` takes the same request and sourcePath and runs the same gate. Only a successful fresh handoff may be presented as a checked preview. A user-approved alternative that the checker cannot represent requires a supported contract/checker update and tests, not a skip flag. Do not edit/fabricate a pass receipt to work around a blocker.
12. Register newly discovered semantics as quarantined proposals. Never promote a one-off visual fragment directly into the stable component or pattern registry.

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

## Output contract

For an ordinary prototype, create and return the following as local Git-ignored artifacts:

- input `ScreenRequest` and resolved contract under `.mes-ui-preview/`;
- implementation source under `src/generated-previews/`;
- internal QA page under `src/app/preview/`; provide its localhost URL only after the handoff gate succeeds;
- code-bound `implementation-audit.json`, `visual-review.json`, baseline/final captures under `.mes-ui-preview/`.

The preview commands no longer auto-register unchecked drafts in the user catalog. Distinguish **program-enforced** managed-command checks from **agent duties** (baseline selection, truthful visual comparison, not bypassing the workflow). The repository cannot intercept arbitrary external servers, every shell command or a manually pasted URL. Report these limits; do not claim complete prevention. Global Hooks/permissions require separate explicit authorization.

Do not add a prototype to `generated-screen-evaluations.json`, a production route, or the stable registry unless the user explicitly asks to preserve or promote it. Promotion is a separate task that moves approved code and evidence into tracked repository locations.

Use `구현됨`, `검증됨`, `배치 완료`, and `전체 완료` exactly as defined in `AGENTS.override.md`.
