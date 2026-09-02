# Repository contract

## Sources of truth

Read in this order:

1. `component-library/src/design-system/registry/context-rules.json` for semantic choices.
2. For `new`, `component-library/src/design-system/registry/web-generation-context.json` for actual-web page, overlay, section, and behavior grammar. Do not read Figma reconciliation as generation input.
3. `component-library/src/design-system/registry/screens.json`, `screen-specs.json`, and `source-assets.json` for nearest-screen composition and ordered section instances.
4. `component-library/src/design-system/registry/patterns.json` and `pattern-contracts.json` for shell, section, behavior, action-set, slots, state, and boundary contracts.
5. `component-library/src/design-system/registry/components.json` and `component-usage-contracts.json` for approved implementation sources, maturity, use/exclusion conditions, parents, and alternatives.
6. For `new`, `component-library/src/design-system/registry/foundation-recipes.json` for reference-only purpose, composition character and visual-language candidates after the task and asset connections are understood. It is not an executable template or selector. It represents a legacy design era: current registered MES component defaults, variants, states and interactions take precedence over conflicting source-frame visuals.
7. For `reproduce`, `normalize`, or `audit`, `web-ui-usage-inventory.json`, `web-figma-reconciliation.json`, `source-evidence.json`, and `visual-regression.json` for target-specific fidelity claims.
8. `component-library/src/design-system/registry/generation-templates.json` for deterministic TSX support and maturity.
9. `component-library/src/design-system/registry/generated-screen-evaluations.json` only as quarantined prototype history unless `influence` is `approved`.

Experimental candidates are discovery material, not generation dependencies.

`component-library/experiments/` contains inactive historical pilots. Do not import, resolve, register, or cite them as generation evidence unless the user explicitly starts a task to redesign and reactivate a named experiment.

Business information in `business-knowledge.json` and cross-surface usage in `usage-contexts.json` are **reference-only**, not another source of mandatory layout/field rules. Retrieve the relevant subset through `mes_get_web_generation_context` or `npm run screen:references`; the resolver also attaches `referenceContext` separately from implementation. Current task conditions determine primary/supporting roles. Unknown references do not block new tasks, and context differences do not waive MES component/API checks. These annotations are excluded from the executable contract fingerprint; adopted changes belong in the existing request/configuration and remain fingerprinted.

`new` and `reproduce` are separate retrieval modes. A new screen contract must contain `webGenerationContext` and must not contain `reproductionAuditContext`. A reproduce/normalize/audit contract may include both.

## Screen request decisions

For new UI and structural changes, read `component-library/src/design-system/registry/screen-intake-policy.json` before choosing these fields. The policy is a conditional question bank, not a screen-type classifier. Read known answers first; clarify only facts that materially affect the composition. Preserve confirmed facts in `requirements`, and sources/assumptions/conflicts in `evidence.notes`. Do not add unrecognized fields to ScreenRequest. These fields are retained by the resolver, but translating the answers into structure, interactions, and rendering remains the generating agent's responsibility.

After the whole-screen composition is understood but before the final request is written, run the semantic asset matcher. `mes_match_screen_assets` (or `npm run screen:match-assets`) compares a concise element inventory with `component-usage-contracts.json` by capability and actual parent chain. It returns exact, compatible and manually declared candidates without choosing one. The inventory covers meaningful reusable or behavioral elements; it is not a DOM inventory and does not replace hierarchy/layout decisions.

The final ScreenRequest may preserve adopted results in `assetDecisions`. `selectedComponentRef` must also appear through the actual structured section `componentRefs` or selected pattern requirements; the resolver reports a disconnected record. Unreviewed categories and candidate suggestions are informational. Semantic mismatch, parent mismatch, a premature new-asset proposal, or an assumed business behavior being turned into a selected UI are warnings that may be corrected or explicitly accepted. Only malformed matching input is a blocker. This keeps the stage useful without turning one component contract into a universal layout rule.

Choose in this order:

1. `intent`: reproduce, new, normalize, or audit.
2. Optional `webContext`: observed page/overlay/section examples to consider. Missing examples are allowed; unknown, cross-surface or single-case references produce information only, not a required exception approval.
3. `target.kind`: page, center-modal, side-slide-panel, or confirm-dialog.
4. `nearestScreenId`: the registered workflow with the closest semantic structure.
5. `recipeRefs`: broad popup or page composition.
6. `shellRef`: exactly one overlay shell, none for a page unless existing evidence says otherwise.
7. `composition.sections`: ordered content regions, their slot, frame, primary/supporting patterns, component references, behavior targets, scroll owner, and constraints. `sectionRefs` is a compatibility summary derived from these structured sections when a ScreenSpec exists.
8. `behaviorRefs`: selection, mutation, dismissal, and master-detail behavior.
9. `actionSetRef`: footer action semantics.

For a popup connected to the executable `section.page-query-table` pattern, the host page remains a separately validated MES page surface. Record `hostPage.pagePatternRef` and its popup `entryBehavior`; use `row-double-click` by default. `explicit-action` is an exception and needs `entryReason` tied to a registered screen or explicit user decision. `webContext` stays reference-only; overlay composition never supplies or replaces the host page's query/table grammar.

Resolve executable choices before implementation. Each selected pattern contract can declare required implementation markers, prohibited substitutes and behavior-specific component props. The resolver copies only the selected target/host contracts into the screen contract, the implementation follows them, and the final audit checks those declarations. An unselected pattern contributes no pattern-specific requirement. These checks prevent implementation drift after selection; they do not replace the contextual selection process or make a universal prohibition out of one screen's rule.

Do not select by visual resemblance alone. A gray rectangle, title, or repeated row is not sufficient evidence of a component or pattern identity.

Select `target.kind` and `webContext` jointly from the whole-screen concept and applicable MES evidence. Background visibility, record count, input count, width, and task length are contributing facts, not direct shell/pattern selectors. A sample recipe's existing `surfaceSequence` is not an answer-to-layout mapping. If several compositions remain plausible, explain the material trade-off or propose a reversible draft; do not invent missing business facts to force a registered template.

For every meaningful component, section pattern, behavior, shell, and action set, apply `exact-match → compatible-existing → new-asset`. The middle step must compare semantic role, interaction effect, selection cardinality, state model, accessibility, allowed parent, and information hierarchy. A mismatch rejects the candidate; it does not justify disguising that asset with new styles. Only after both existing-asset steps fail may the result become a quarantined `propose-new` decision.

The resolved contract includes `decisionTrace` for selection provenance. Many reasons describe explicit request selection or inheritance, not the AI's full business reasoning. Record material adopted decisions in existing requirements/notes; neither the trace nor `referenceContext` proves contextual design quality.

## Fidelity and normalization

- Figma is authoritative for source content, hierarchy, state, and measured geometry.
- The `foundation-recipes.json` source section is an explicit exception to treating old control styling as current authority. Preserve its purpose, information relationships and composition character, but render controls through the current registry. Do not remove current Table separators, current input states or current shell behavior because the legacy frame predates them.
- Registry rules are authoritative for approved reusable components and normalized system values.
- When they differ, record the difference as `source-error`, `implementation-error`, `intentional-exception`, or `normalization-candidate` before changing it.
- Exact reproduction requires a Figma node and browser/visual evidence. Without those, label the result as a prototype or implementation, not verified.

## Severity model

- `blocker`: invalid or missing registry reference, incompatible shell, invalid request shape, or forbidden experimental dependency. Stop implementation.
- `warning`: provisional dependency, missing evidence for a non-reproduction request, or unresolved normalization. Continue in draft and record it.
- `info`: review suggestions and traceability notes.

A single warning must not fail an entire screen. Release readiness requires resolving or explicitly accepting warnings.
