import { slideTemplateKinds, slideSectionPatterns } from "./slide-composition-contract.mjs";

export function isSlideComposition(id) { return Object.hasOwn(slideTemplateKinds, id ?? ""); }
export function slideCompositionSections(generation) {
  return generation.sections.map(section => ({
    id: section.id, title: section.title, slot: "body", patternRef: slideSectionPatterns[section.kind],
    ...(["form-grid", "custom-fields", "inspection-items", "member-selection", "permission-matrix"].includes(section.kind) ? { frameRef: "frame.standard-section" } : {}),
    supportingPatternRefs: [], componentRefs: [], behaviorRefs: [], scrollOwner: "shell-body",
  }));
}
export function generateSlideComposition(contract) {
  const { request } = contract;
  const config = request.generation;
  const kind = config.templateId.slice("side-slide-".length, -3);
  const sections = config.sections.map((section, index) => {
    if (section.kind === "form-grid") return `<SectionFrame data-section-id=${JSON.stringify(section.id)} title={basic.title} divider="${["custom-fields", "inspection"].includes(kind) ? "inline-end" : "bottom"}" className="min-w-0">
      <FormGrid columns={basic.columns} density={basic.density}>
        {basic.fields.map(field => <FormFieldRow key={field.key} label={field.label} required={field.required}>
          {field.control === "select" ? <Select value={model.draft.values[field.key]} onValueChange={value => updateField(field.key, value)}>
            <SelectTrigger aria-label={field.label}><SelectValue placeholder={field.placeholder ?? "선택"} /></SelectTrigger>
            <SelectContent>{field.options?.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
          </Select> : <Input aria-label={field.label} value={model.draft.values[field.key]} readOnly={field.readOnly} inputMode={field.inputMode}
            placeholder={field.placeholder ?? "내용 입력"} onChange={event => updateField(field.key, event.target.value)} />}
        </FormFieldRow>)}
      </FormGrid>
    </SectionFrame>`;
    const content = `<SlideCompositionSectionView data-section-id=${JSON.stringify(section.id)} layout=${JSON.stringify(kind)} section={CONFIG.sections[${index}]} model={model} />`;
    return section.kind === "inspection-items" ? `<InspectionItemsSection>${content}</InspectionItemsSection>` : content;
  }).join("\n");
  return `"use client";
import { SideSlidePanel } from "@/components/ui/side-slide-panel";
import { SectionFrame } from "@/components/ui/section-frame";
import { FormGrid, FormFieldRow } from "@/components/ui/form-grid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
${kind === "inspection" ? 'import { InspectionItemsSection } from "@/components/patterns/section-patterns";' : ""}
import { SlideBodyLayout, SlideCompositionSectionView, useSlideCompositionDraft } from "@/components/patterns/side-slide-compositions";
import { createDialogActionSet } from "@/design-system/action-sets";
import { slideInitialDraft, type SlideCompositionConfig, type SlideCompositionDraft } from "@/design-system/slide-composition";
import type { ScreenTemplateFormSection } from "@/design-system/registry/registry.types";
import { useCommittedDraft } from "@/design-system/behavior-patterns";
const CONFIG: SlideCompositionConfig = ${JSON.stringify(config, null, 2)};
const basic = CONFIG.sections[0] as ScreenTemplateFormSection;
const cloneDraft = (data: SlideCompositionDraft) => structuredClone(data);
export function ${request.output.componentName}({ open, onOpenChange, onSave }: {
  open: boolean; onOpenChange: (open: boolean) => void; onSave?: (data: SlideCompositionDraft) => void;
}) {
  const committed = useCommittedDraft({ initialValue: slideInitialDraft(CONFIG), clone: cloneDraft });
  const model = useSlideCompositionDraft(CONFIG, committed);
  const updateField = (key: string, value: string) => model.setDraft(current => ({ ...current, values: { ...current.values, [key]: value } }));
  const save = () => { if (!model.canSave) return; const data = model.commit(); onSave?.(data); onOpenChange(false); };
  return <SideSlidePanel open={open} onOpenChange={onOpenChange} title=${JSON.stringify(request.target.title)}
    size={CONFIG.panelSize} bodyPadding="none" bodyAlign="stretch" onCancel={model.restore}
    actions={createDialogActionSet("action-set.cancel-save", { onPrimary: save, primaryDisabled: !model.canSave })}>
      <SlideBodyLayout kind=${JSON.stringify(kind)}>
${sections}
      </SlideBodyLayout>
    </SideSlidePanel>;
}
`;
}
