# Deterministic templates

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

Every generated request uses `/generated-screens/<request-id>` as `output.route`. `mes_generate_screen` creates a matching Next.js preview page and returns its `previewUrl`. The CLI fallback must include `--preview`. Modal and side-panel previews open the overlay immediately and provide a reopen action after dismissal; page previews render the generated page directly.
