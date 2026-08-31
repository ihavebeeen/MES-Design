"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import templates from "@/design-system/registry/generation-templates.json";
import { CustomFieldsExample } from "@/components/visual-tests/slide-compositions/CustomFieldsExample";
import { InspectionExample } from "@/components/visual-tests/slide-compositions/InspectionExample";
import { EntryListExample } from "@/components/visual-tests/slide-compositions/EntryListExample";
import { GroupSettingsExample } from "@/components/visual-tests/slide-compositions/GroupSettingsExample";
import { BlankRowsExample } from "@/components/visual-tests/slide-compositions/BlankRowsExample";
import { StagedEntryExample } from "@/components/visual-tests/slide-compositions/StagedEntryExample";

const examples = {
  "custom-fields": CustomFieldsExample, inspection: InspectionExample, "entry-list": EntryListExample,
  "group-settings": GroupSettingsExample, blank: BlankRowsExample, staged: StagedEntryExample,
};
type ExampleKey = keyof typeof examples;
export function SlideCompositionCatalog() {
  const [active, setActive] = React.useState<ExampleKey | null>(null);
  const [open, setOpen] = React.useState(false);
  const launch = (key: ExampleKey) => { setActive(key); setOpen(true); };
  const Example = active ? examples[active] : null;
  return <div className="space-y-3">
    <p className="text-sm text-mes-gray-80">본문 배치 4유형. 목록 추가 경로와 추가 후 편집 가능 여부는 배치와 별도로 선택합니다. 아래는 샘플 데이터 조합 예제이며 원본 전체 화면의 복제본이 아닙니다.</p>
    <div className="grid gap-3 lg:grid-cols-2">
      {templates.templates.filter(template => template.body).map(template => {
        const body = template.body!;
        return <Card key={template.id} className="flex flex-col gap-3 p-4">
          <h4 className="text-base font-bold text-mes-gray-130">{body.title}</h4>
          <p className="text-sm text-mes-gray-80">{body.description}</p>
          <div className="mt-auto flex flex-wrap gap-2">
            {body.kind === "entry-list" ? <>
              <Button size="small" variant="lineBlacktxt" onClick={() => launch("blank")}>빈 행 추가 예제</Button>
              <Button size="small" variant="lineBlacktxt" onClick={() => launch("staged")}>상단 값 추가 예제</Button>
              <Button size="small" variant="lineBlacktxt" onClick={() => launch("entry-list")}>두 방식 병행 예제</Button>
            </> : <Button size="small" variant="lineBlacktxt" onClick={() => launch(body.kind as ExampleKey)}>{body.title} 예제</Button>}
          </div>
        </Card>;
      })}
    </div>
    {Example && <Example key={active} open={open} onOpenChange={setOpen} />}
  </div>;
}
