# Repository contract

## Sources of truth

Read in this order:

1. `component-library/src/design-system/registry/context-rules.json` for semantic choices.
2. `component-library/src/design-system/registry/screens.json`, `screen-specs.json`, and `source-assets.json` for nearest-screen composition and ordered section instances.
3. `component-library/src/design-system/registry/patterns.json` and `pattern-contracts.json` for shell, section, behavior, action-set, slots, state, and boundary contracts.
4. `component-library/src/design-system/registry/components.json` and `component-usage-contracts.json` for approved implementation sources, maturity, use/exclusion conditions, parents, and alternatives.
5. `component-library/src/design-system/registry/source-evidence.json` and `visual-regression.json` for fidelity claims.
6. `component-library/src/design-system/registry/generation-templates.json` for deterministic TSX support and maturity.
7. `component-library/src/design-system/registry/generated-screen-evaluations.json` only as quarantined prototype history unless `influence` is `approved`.

Experimental candidates are discovery material, not generation dependencies.

## Screen request decisions

Choose in this order:

1. `intent`: reproduce, new, normalize, or audit.
2. `target.kind`: page, center-modal, side-slide-panel, or confirm-dialog.
3. `nearestScreenId`: the registered workflow with the closest semantic structure.
4. `recipeRefs`: broad popup or page composition.
5. `shellRef`: exactly one overlay shell, none for a page unless existing evidence says otherwise.
6. `composition.sections`: ordered content regions, their slot, frame, primary/supporting patterns, component references, behavior targets, scroll owner, and constraints. `sectionRefs` is a compatibility summary derived from these structured sections when a ScreenSpec exists.
7. `behaviorRefs`: selection, mutation, dismissal, and master-detail behavior.
8. `actionSetRef`: footer action semantics.

Do not select by visual resemblance alone. A gray rectangle, title, or repeated row is not sufficient evidence of a component or pattern identity.

The resolved contract must include `decisionTrace`. It is the machine-readable answer to why a shell, section, behavior, action set, or component was selected and which alternatives were rejected. An implementation without this trace is not auditable.

## Fidelity and normalization

- Figma is authoritative for source content, hierarchy, state, and measured geometry.
- Registry rules are authoritative for approved reusable components and normalized system values.
- When they differ, record the difference as `source-error`, `implementation-error`, `intentional-exception`, or `normalization-candidate` before changing it.
- Exact reproduction requires a Figma node and browser/visual evidence. Without those, label the result as a prototype or implementation, not verified.

## Severity model

- `blocker`: invalid or missing registry reference, incompatible shell, invalid request shape, or forbidden experimental dependency. Stop implementation.
- `warning`: provisional dependency, missing evidence for a non-reproduction request, or unresolved normalization. Continue in draft and record it.
- `info`: review suggestions and traceability notes.

A single warning must not fail an entire screen. Release readiness requires resolving or explicitly accepting warnings.
