# Deterministic templates

## Whole-screen host for overlays

Every managed overlay preview/handoff requires `ScreenRequest.hostPage`: `sourcePath` (local `src/...tsx`), `componentName` (actual export), `triggerLabel`, and `saveBehavior` (`notify-parent` or explicitly `none`). This applies to center/slide/confirmation shells. A page target owns its own shared navigation/tabs and must not specify a second host.

The host is the actual intended business page or a scoped adapter built with MES assets, not an invented generic list. It accepts `overlayActions: ReactNode`, `saveVersion: number`, `savedData: unknown`. Place the action slot at its real launch location; apply save notifications/payload to the intended data region without remounting the host. The generated wrapper keeps host and dialog mounted, blocks background interaction while open and returns focus on close. The dialog accepts `open`, `onOpenChange`, and `onSave` when notification is requested. Emit `onSave` only after successful save; do not report success on validation/API failure. No API or backend persistence is supplied by the preview wrapper.

Missing host details stop whole-screen preview delivery; inspect existing code/context or ask only the material missing choice. Code-only in-memory diagnostics may still inspect a dialog fragment, but cannot authorize handoff. Old blank-background wrappers must be regenerated/reviewed; do not overwrite unrelated local previews automatically. The host fixture in tests is test-only, never a universal generation background.

## `side-slide-form-editable-list.v1`

Use for a full-height right panel composed of ordered form sections and exactly one repeating input-row section. It generates `SideSlidePanel`, `SectionFrame`, `FormGrid`, `EditableRowListSection`, `EditableRowGrid`, committed-draft restore, row mutation, and cancel/save actions.

Required pattern refs:

- `recipe.side-slide-form-editable-list`
- `shell.side-slide-panel`
- `frame.standard-section`
- `section.form-grid`
- `section.editable-row-list`
- `row.mutation-policy`
- `dismiss.restore-committed`
- `action-set.cancel-save`

The `generation.sections` array preserves render order. Form fields and row columns support registered Input and Select controls. A select requires explicit options. Use `validation: positive-number` for positive numeric quantities. `inheritOnAdd` lists only the row keys copied from the previous row; every other key returns to its declared default.

See `component-library/tests/fixtures/screen-requests/deterministic-side-slide.json` for the complete contract input. Do not hand-edit generated TSX to change its layout; change the request and regenerate. The generator refuses to overwrite an existing file.

## `center-modal-search-table.v1`

Use for a center modal whose main content is a filter/search toolbar and one selectable data table. It generates `CenterModal`, the registered search-table section, committed-draft dismissal, and the resolved dialog action set.

Required pattern refs:

- `recipe.center-modal-search-table`
- `shell.center-modal`
- `section.search-table-composition`
- `selection.enable-actions`
- `dismiss.restore-committed`
- `action-set.cancel-save`

The single `generation.section` defines the section ID, heading, filters, columns, and rows. Cancel, top-right close, Escape, and backdrop dismissal share the committed-draft restore policy. See `component-library/tests/fixtures/screen-requests/deterministic-center-modal.json`.

## `page-entity-list.v1`

Use for a desktop entity-list page with page chrome, filter/search controls, one data table, selection, and pagination. It generates `EntityListPattern`, registered navigation/chrome components, the search-table composition, and pagination.

Required pattern refs:

- `recipe.page-entity-list`
- `screen.entity-list`
- `section.search-table-composition`
- `selection.enable-actions`

This template is currently `provisional`, not stable. It is deterministic and audit-blocker free, but `Pagination` and the exact original-page evidence still require stabilization; arbitrary-pixel review warnings are therefore retained instead of being hidden. See `component-library/tests/fixtures/screen-requests/deterministic-entity-list.json`.

For all templates, section order comes from the resolved structured ScreenSpec. Do not hand-edit generated TSX to reorder sections; update the request, resolve it again, and regenerate.

Every prototype request uses `/preview/<request-id>` as `output.route`. `mes_generate_screen` writes the implementation to Git-ignored `src/generated-previews/`, audits the final file and dependencies, creates a matching internal-QA Next.js page, and returns `qaPreviewUrl` with `handoffReady: false`. The CLI fallback must include `--preview`. Neither path publishes the draft in the catalog or approves user delivery. Follow `delivery-gate.md` for brief rendering/interaction confirmation, original comparison when relevant, and `screen:handoff`; identical render observations can be reused. Modal and side-panel previews open immediately with a reopen action; page previews render directly. These local artifacts never become registry evidence without explicit promotion.
