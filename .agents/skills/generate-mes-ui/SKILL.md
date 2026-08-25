---
name: generate-mes-ui
description: Generate, reproduce, normalize, or audit MES screens in this repository using the registered components, composition patterns, context rules, and visual evidence. Use whenever a user asks to make or change a MES page, center modal, side slide panel, confirmation dialog, table workflow, or generated-screen prototype.
---

# Generate MES UI

Create MES UI through the repository contract. Do not translate prose or Figma directly into free-form JSX.

## Workflow

1. Read `AGENTS.override.md`, then read `references/repository-contract.md`. For a deterministic template request, also read `references/templates.md`.
2. Classify the request intent before retrieving examples. If the `mes-ui` MCP server is connected, call `mes_list_design_system`, then:
   - for `new`, call `mes_get_web_generation_context` with the 업무명 or closest menu. It returns repeated page, overlay, section, and behavior grammar without Figma audit data;
   - for `reproduce`, `normalize`, or `audit`, call `mes_get_reproduction_audit_context` to retrieve the specific runtime and Figma comparison evidence.
   When MCP is unavailable, use `getWebGenerationContext` or `getReproductionAuditContext` from `component-library/src/design-system/registry/index.ts`.
3. For `new`, choose the 업무 결과, page/overlay role, grammar, ordered sections, and behaviors before looking for a visually similar finished Figma screen. Inspect Figma only when the user supplied a reference or a visual constraint needs source evidence. For `reproduce`, inspect the target node metadata and design context before editing code. Treat unmeasured visual guesses as review notes, never facts.
4. Write a `ScreenRequest` JSON that conforms to `component-library/src/design-system/registry/screen-request.schema.json`. A `new` request must record the selected `webContext.pageArchetypeRef` or `webContext.overlayGrammarRef` and any ordered `webContext.sectionRecipeRefs`; the resolver blocks missing or incompatible grammar. Keep prototype request and contract files under the Git-ignored `component-library/.mes-ui-preview/<request-id>/` directory. When the nearest screen has a registered ScreenSpec, preserve its ordered `composition.sections`; do not reduce it back to an unordered `sectionRefs` list.
   Set `output.route` to `/preview/<request-id>` so the generated screen receives a local-only preview URL.
5. Resolve it before JSX. Prefer `mes_resolve_screen`; use the CLI only when MCP is unavailable:

   ```bash
   cd component-library
   npm run screen:resolve -- .mes-ui-preview/<request-id>/request.json --out .mes-ui-preview/<request-id>/contract.json
   ```

6. Stop on resolver blockers. Inspect the resolver `decisionTrace` and confirm the selected shell, ordered sections, behaviors, action set, components, and excluded alternatives. Resolve warnings by evidence or record them in the generated-screen evaluation; a warning alone does not invalidate the whole screen.
7. When the resolved recipe has a supported deterministic template, call `mes_generate_screen` instead of writing JSX freely. This tool resolves, generates, creates the preview page, refuses overwrites, and audits in one call. Use the CLI fallback only when MCP is unavailable:

   ```bash
   npm run screen:generate -- .mes-ui-preview/<request-id>/contract.json --preview
   ```

8. Otherwise implement only with resolved registry references. Use registered components and pattern sources. Do not use native interactive HTML when a MES component exists. After implementation, create its preview page:

   ```bash
   npm run screen:preview -- .mes-ui-preview/<request-id>/contract.json src/generated-previews/<request-id>.tsx
   ```
9. Audit the implementation with `mes_audit_screen`, or use the CLI fallback. Every structured section must expose its ScreenSpec ID through `data-section-id`, in the same order as the resolved contract:

   ```bash
   npm run screen:audit -- path/to/contract.json path/to/implementation.tsx
   npm run check:design-system
   ```

10. Start or reuse the local preview server with `npm run dev`, wait until the generated `previewUrl` responds, and open that exact `/preview/<request-id>` URL with the client's browser capability when available. Otherwise return the clickable URL.
11. Verify at the target viewport: interactions, `clientWidth/scrollWidth`, `clientHeight/scrollHeight`, and the visual baseline. Do not call a screen verified without these checks.
12. Register newly discovered semantics as quarantined proposals. Never promote a one-off visual fragment directly into the stable component or pattern registry.

## Selection rules

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
- preview page under `src/app/preview/` plus its localhost URL;
- verification notes proportional to the requested fidelity.

Do not add a prototype to `generated-screen-evaluations.json`, a production route, or the stable registry unless the user explicitly asks to preserve or promote it. Promotion is a separate task that moves approved code and evidence into tracked repository locations.

Use `구현됨`, `검증됨`, `배치 완료`, and `전체 완료` exactly as defined in `AGENTS.override.md`.
