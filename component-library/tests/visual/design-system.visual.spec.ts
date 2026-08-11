import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
});

async function hideDevelopmentOverlay(page: Page) {
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
}

test("투입품목 설정/조회 팝업", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/visual-regression/popup");
  const dialog = page.getByRole("dialog", { name: "투입품목 설정/조회" });
  await expect(dialog).toBeVisible();
  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("material-input-settings.png");
});

test("Figma 원본 재고 추가 팝업", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/visual-regression/source-inventory-add");
  const dialog = page.getByRole("dialog", { name: "재고 추가" });
  await expect(dialog).toBeVisible();
  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("source-inventory-add.png");
});

test("불량수량 입력 팝업", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/visual-regression/defect");
  const dialog = page.getByRole("dialog", { name: "불량수량 입력" });
  await expect(dialog).toBeVisible();

  const tableViewport = dialog.locator(".defect-quantity-table");
  const overflow = await tableViewport.evaluate((element) => ({
    horizontal: element.scrollWidth - element.clientWidth,
    vertical: element.scrollHeight - element.clientHeight,
  }));
  expect(overflow.horizontal).toBe(0);
  expect(overflow.vertical).toBe(0);

  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("defect-quantity-input.png");
});

test("생산실적 등록 슬라이드 팝업", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 960 });
  await page.goto("/visual-regression/production-result");
  const dialog = page.getByRole("dialog", { name: "생산실적 등록" });
  await expect(dialog).toBeVisible();

  const tableViewport = dialog.locator(".production-result-table");
  const overflow = await tableViewport.evaluate((element) => ({
    horizontal: element.scrollWidth - element.clientWidth,
    vertical: element.scrollHeight - element.clientHeight,
  }));
  expect(overflow.horizontal).toBe(0);
  expect(overflow.vertical).toBeGreaterThanOrEqual(0);

  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("production-result.png");

  const deleteButtons = dialog.getByRole("button", { name: "행 삭제" });
  await expect(deleteButtons).toHaveCount(10);
  await dialog.getByRole("button", { name: "실적 추가" }).click();
  await expect(deleteButtons).toHaveCount(11);
});

test("팝업 취소와 X는 변경값을 버리고 닫는다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/patterns/completed-popup-types");
  const openButton = page.getByRole("button", { name: "실제 팝업으로 열기" });
  await openButton.click();

  let dialog = page.getByRole("dialog", { name: "재고 추가" });
  let quantity = dialog.locator('input[inputmode="numeric"]').first();
  await quantity.fill("7777");
  await expect(quantity).toHaveValue("7,777");
  await dialog.getByRole("button", { name: "취소" }).click();
  await expect(dialog).toBeHidden();

  await openButton.click();
  dialog = page.getByRole("dialog", { name: "재고 추가" });
  quantity = dialog.locator('input[inputmode="numeric"]').first();
  await expect(quantity).toHaveValue("1,000,000");
  await quantity.fill("8888");
  await dialog.getByRole("button", { name: "닫기" }).click();
  await expect(dialog).toBeHidden();

  await openButton.click();
  dialog = page.getByRole("dialog", { name: "재고 추가" });
  await expect(dialog.locator('input[inputmode="numeric"]').first()).toHaveValue("1,000,000");
});

test("그룹화 테이블 핵심 상태", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/visual-regression/table");
  const fixture = page.locator('[data-visual-test="table"]');
  await expect(fixture).toBeVisible();
  await hideDevelopmentOverlay(page);
  await expect(fixture).toHaveScreenshot("grouped-table-core-states.png");
});

test("테이블 행 선택 상호작용", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/visual-regression/table");
  const checkboxes = page.locator('[data-visual-test="table"] input[type="checkbox"]');
  await checkboxes.nth(4).check();
  await expect(checkboxes.nth(4)).toBeChecked();
  await hideDevelopmentOverlay(page);
  await expect(page.locator('[data-visual-test="table"]')).toHaveScreenshot("grouped-table-row-selected.png");
});
