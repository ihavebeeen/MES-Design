# Deterministic templates

## Popup-only work and connected flows

`ScreenRequest.verificationScope` is `surface` for the requested page/popup itself or `connected-flow` for parent selection/save integration. If omitted, an existing `hostPage` defaults to connected-flow; otherwise surface. For popup-only edits, set surface explicitly even when retaining an existing host. Scope follows the user's task, never a desire to bypass a failure. A page target uses surface and owns its navigation/tabs.

For center/slide/confirmation popup-only work, host knowledge is optional. Without it, the managed wrapper uses `SurfacePreviewFrame`: existing MES navigation/tabs, a scope notice and reopen action, no invented business list/records. This is preview infrastructure, not a new business pattern. Actual popup assets, styles, layout and interactions still need inspection before delivery. The result records parent integration as out-of-scope. No real backend persistence is supplied or implied.

`connected-flow` requires `hostPage`: `sourcePath` (local `src/...tsx`), `componentName` (actual export), `triggerLabel`, `saveBehavior` (`notify-parent` or explicitly `none`). Use the intended page or a scoped MES adapter. It accepts `overlayActions: ReactNode`, `saveVersion: number`, `savedData: unknown`; place the action/data at their real locations. The wrapper keeps it mounted, blocks background interaction and returns focus on close. The popup accepts `open`, `onOpenChange`, and `onSave` when requested; emit success only after successful validation/save. Inspect only the relevant connection, not all details of the parent page. Missing necessary connection facts block that integration scope, not unrelated popup-only work. An explicitly supplied broken host is not silently discarded: it is rendered and must pass inspection even in surface mode. Tests' `ApplicationHostFixture` is not business evidence. Regenerate/review old wrappers only for the current task; preserve unrelated previews.

## Slide body composition and independent list behavior

Choose the shared `SideSlidePanel` and its body placement separately from editing behavior. The user-confirmed body families are custom fields (left/basic + right/custom values), inspection (left/target + right/judgements), top/bottom input/list, and special group settings (basic + members + permissions). Operation logs remain a business example, not the fourth universal body family.

`side-slide-custom-fields.v1`, `side-slide-inspection.v1`, `side-slide-entry-list.v1`, and `side-slide-group-settings.v1` are provisional deterministic composition templates. Their roles and references are in `generation-templates.json`. Examples in `slide-composition-examples.json` use sample data, not complete source-screen replicas or backend persistence.

For a record list, set `addMethods` to `["blank-row"]`, `["entry-form"]`, or both. Independently specify `editableFields`; top-entry addition does not imply a read-only list. Both paths append to the same draft and validate the same fields on Save. Keep an `entry-form` section only when that addition path is used. `inheritOnAdd` applies only to the top form reset; it is not inferred from layout. These are capabilities of this template, not a ban on other approved compositions.

Basic form, custom field values, inspection judgement, staged input, record list, member selection and permission matrix are separate section roles. These templates currently support explicit Input/Select field definitions and a two-level permission matrix; unsupported shapes need a scoped extension, not invented fields or silently dropped data. Custom/inspection `availableFields`/`availableItems` are caller-supplied definitions, not an implementation of the original field-definition editor.

Use the ordinary resolve → generate → final-file audit → managed QA preview → handoff path. New generation has the same delivery gate as old templates. To update the checked-in composition demonstrations, run `node scripts/sync-slide-composition-examples.mjs --write`; normal generated drafts remain ignored under `/preview/`.

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
