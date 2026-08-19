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
