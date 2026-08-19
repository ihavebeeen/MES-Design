# Repository contract

## Sources of truth

Read in this order:

1. `component-library/src/design-system/registry/context-rules.json` for semantic choices.
2. `component-library/src/design-system/registry/screens.json` and `source-assets.json` for nearest-screen compositions.
3. `component-library/src/design-system/registry/patterns.json` for shell, section, behavior, and action-set references.
4. `component-library/src/design-system/registry/components.json` for approved implementation sources and maturity.
5. `component-library/src/design-system/registry/source-evidence.json` and `visual-regression.json` for fidelity claims.
6. `component-library/src/design-system/registry/generated-screen-evaluations.json` only as quarantined prototype history unless `influence` is `approved`.

Experimental candidates are discovery material, not generation dependencies.

## Screen request decisions

Choose in this order:

1. `intent`: reproduce, new, normalize, or audit.
2. `target.kind`: page, center-modal, side-slide-panel, or confirm-dialog.
3. `nearestScreenId`: the registered workflow with the closest semantic structure.
4. `recipeRefs`: broad popup or page composition.
5. `shellRef`: exactly one overlay shell, none for a page unless existing evidence says otherwise.
6. `sectionRefs`: ordered content regions.
7. `behaviorRefs`: selection, mutation, dismissal, and master-detail behavior.
8. `actionSetRef`: footer action semantics.

Do not select by visual resemblance alone. A gray rectangle, title, or repeated row is not sufficient evidence of a component or pattern identity.

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
