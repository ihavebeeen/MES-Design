import { test, expect } from "@playwright/test";
import { prepareSlideCompositionFixtures } from "../helpers/slide-compositions.mjs";
let fixtures: ReturnType<typeof prepareSlideCompositionFixtures>;
test.beforeAll(() => { fixtures = prepareSlideCompositionFixtures(); });
test.afterAll(() => { fixtures?.cleanup(); });
test.use({ viewport: { width: 1440, height: 900 } });

for (const name of ["CustomFieldsExample", "InspectionExample", "EntryListExample", "GroupSettingsExample", "BlankRowsExample", "StagedEntryExample"]) {
  test("슬라이드 조합: " + name, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", e => { if (e.type() === "error") errors.push(e.text()); });
    const fixture = fixtures.cases.find(entry => entry.name === name)!;
    await page.goto(fixture.plan.route);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const rect = (await dialog.boundingBox())!;
    expect(rect.y).toBe(0); expect(rect.width).toBe(900); expect(rect.height).toBe(900);
    expect(rect.x + rect.width).toBe(1440);
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    const ids = await dialog.locator("[data-section-id]").evaluateAll(els => els.map(el => el.getAttribute("data-section-id")));
    expect(ids).toEqual(fixture.request.generation.sections.map(s => s.id));
    const sections = await dialog.locator("[data-section-id]").evaluateAll(els => els.map(el => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y, width: el.getBoundingClientRect().width })));
    if (name === "CustomFieldsExample" || name === "InspectionExample") {
      expect(sections[0].y).toBe(sections[1].y);
      expect(sections[0].width).toBe(360);
      expect(sections[0].x + sections[0].width).toBe(sections[1].x);
    } else for (let i = 1; i < sections.length; i++) expect(sections[i].y).toBeGreaterThan(sections[i - 1].y);
    if (name === "CustomFieldsExample") {
      await dialog.getByRole("button", { name: "항목 추가", exact: true }).click();
      await page.getByRole("button", { name: "몸무게", exact: true }).click();
      await dialog.getByRole("textbox", { name: "몸무게", exact: true }).fill("60");
    } else if (name === "InspectionExample") {
      await dialog.getByRole("button", { name: "항목 추가", exact: true }).click();
      await page.getByRole("button", { name: "표기 사항", exact: true }).click();
      await expect(dialog.getByText("표기 사항", { exact: true })).toBeVisible();
      await dialog.getByRole("radio", { name: "합격", exact: true }).first().click();
      await expect(dialog.getByRole("radio", { name: "합격", exact: true }).first()).toHaveAttribute("aria-checked", "true");
    } else if (name === "GroupSettingsExample") {
      const groupBox = (await dialog.getByRole("checkbox", { name: "생산관리 전체 권한", exact: true }).boundingBox())!;
      const rowBox = (await dialog.getByRole("checkbox", { name: "생산실적 전체 권한", exact: true }).boundingBox())!;
      expect(Math.abs(groupBox.x + groupBox.width / 2 - rowBox.x - rowBox.width / 2)).toBeLessThan(1);
      await dialog.getByRole("checkbox", { name: "생산관리 전체 권한", exact: true }).check();
      await expect(dialog.getByRole("checkbox", { name: "생산실적 편집", exact: true })).toBeChecked();
      await dialog.getByRole("checkbox", { name: "생산지시 편집", exact: true }).uncheck();
      await expect(dialog.getByRole("checkbox", { name: "생산관리 전체 권한", exact: true })).not.toBeChecked();
    } else {
      const blank = name !== "StagedEntryExample";
      const staged = name !== "BlankRowsExample";
      await expect(dialog.getByRole("button", { name: "행 추가", exact: true })).toHaveCount(blank ? 1 : 0);
      await expect(dialog.getByRole("button", { name: "↓ 추가", exact: true })).toHaveCount(staged ? 1 : 0);
      if (blank) {
        await dialog.getByRole("button", { name: "행 추가", exact: true }).click();
        await dialog.getByLabel("행 addedRecord1 품목", { exact: true }).fill("품목A");
        await dialog.getByLabel("행 addedRecord1 수량", { exact: true }).fill("5");
      }
      if (staged) {
        await dialog.getByLabel("품목", { exact: true }).fill("품목B");
        await dialog.getByLabel("수량", { exact: true }).fill("7");
        await expect(dialog.getByRole("button", { name: "저장", exact: true })).toBeDisabled();
        await dialog.getByRole("button", { name: "↓ 추가", exact: true }).click();
        await expect(dialog.getByLabel("품목", { exact: true })).toHaveValue("");
      }
      await expect(dialog.getByRole("button", { name: "저장", exact: true })).toBeEnabled();
      await expect(dialog.getByRole("button", { name: /^행 .* 삭제$/ })).toHaveCount(blank && staged ? 2 : 1);
    }
    await dialog.getByRole("button", { name: "취소", exact: true }).click();
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "팝업 다시 열기", exact: true }).click();
    if (name === "CustomFieldsExample") await expect(dialog.getByLabel("몸무게", { exact: true })).toHaveCount(0);
    if (name === "InspectionExample") await expect(dialog.getByText("표기 사항", { exact: true })).toHaveCount(0);
    if (name === "GroupSettingsExample") await expect(dialog.getByRole("checkbox", { name: "생산실적 편집", exact: true })).not.toBeChecked();
    if (["EntryListExample", "BlankRowsExample", "StagedEntryExample"].includes(name)) await expect(dialog.getByRole("button", { name: /^행 .* 삭제$/ })).toHaveCount(0);
    if (["EntryListExample", "BlankRowsExample", "StagedEntryExample"].includes(name)) {
      if (name === "BlankRowsExample") {
        await dialog.getByRole("button", { name: "행 추가", exact: true }).click();
        await dialog.getByRole("textbox", { name: /행 .* 품목$/ }).fill("저장 품목");
        await dialog.getByRole("textbox", { name: /행 .* 수량$/ }).fill("9");
      } else {
        await dialog.getByRole("textbox", { name: "품목", exact: true }).fill("저장 품목");
        await dialog.getByRole("textbox", { name: "수량", exact: true }).fill("9");
        await dialog.getByRole("button", { name: "↓ 추가", exact: true }).click();
      }
      await dialog.getByRole("button", { name: "저장", exact: true }).click();
      await expect(dialog).toBeHidden();
      await page.getByRole("button", { name: "팝업 다시 열기", exact: true }).click();
      await expect(dialog.getByRole("button", { name: /^행 .* 삭제$/ })).toHaveCount(1);
      await dialog.getByRole("button", { name: /^행 .* 삭제$/ }).click();
      await dialog.getByRole("button", { name: "닫기", exact: true }).click();
      await page.getByRole("button", { name: "팝업 다시 열기", exact: true }).click();
      await expect(dialog.getByRole("button", { name: /^행 .* 삭제$/ })).toHaveCount(1);
    } else {
      const firstField = fixture.request.generation.sections[0].fields![0].label;
      await dialog.getByRole("textbox", { name: firstField, exact: true }).fill("저장 값");
      await dialog.getByRole("button", { name: "저장", exact: true }).click();
      await expect(dialog).toBeHidden();
      await page.getByRole("button", { name: "팝업 다시 열기", exact: true }).click();
      await expect(dialog.getByRole("textbox", { name: firstField, exact: true })).toHaveValue("저장 값");
      await dialog.getByRole("textbox", { name: firstField, exact: true }).fill("미저장 값");
      await dialog.getByRole("button", { name: "닫기", exact: true }).click();
      await page.getByRole("button", { name: "팝업 다시 열기", exact: true }).click();
      await expect(dialog.getByRole("textbox", { name: firstField, exact: true })).toHaveValue("저장 값");
    }
    expect(errors).toEqual([]);
  });
}
