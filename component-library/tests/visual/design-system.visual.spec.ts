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

test("투입품목 설정/조회 작은 화면 정렬과 편집 상태", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/visual-regression/popup");
  const dialog = page.getByRole("dialog", { name: "투입품목 설정/조회" });
  await expect(dialog).toBeVisible();

  const dialogBox = await dialog.boundingBox();
  expect(dialogBox).not.toBeNull();
  expect(dialogBox!.x).toBeGreaterThanOrEqual(20);
  expect(dialogBox!.y).toBeGreaterThanOrEqual(16);
  expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(1260);
  expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(704);

  const toolbar = dialog.locator(".material-query-toolbar");
  const filterButton = toolbar.getByRole("button", { name: "필터 추가" });
  const searchInput = toolbar.getByPlaceholder("검색어 입력..");
  const [toolbarBox, filterBox, searchBox] = await Promise.all([
    toolbar.boundingBox(),
    filterButton.boundingBox(),
    searchInput.boundingBox(),
  ]);
  expect(toolbarBox).not.toBeNull();
  expect(filterBox).not.toBeNull();
  expect(searchBox).not.toBeNull();
  const toolbarCenter = toolbarBox!.y + toolbarBox!.height / 2;
  expect(Math.abs(filterBox!.y + filterBox!.height / 2 - toolbarCenter)).toBeLessThanOrEqual(1);
  expect(Math.abs(searchBox!.y + searchBox!.height / 2 - toolbarCenter)).toBeLessThanOrEqual(1);

  for (const selector of [".material-inventory-table", ".material-requirement-table"]) {
    const overflow = await dialog.locator(selector).evaluate((element) => element.scrollWidth - element.clientWidth);
    expect(overflow).toBe(0);
  }

  await filterButton.click();
  await expect(page.locator('[data-radix-popper-content-wrapper] input')).toHaveCount(0);
  await page.keyboard.press("Escape");

  const materialRow = dialog
    .locator(".material-inventory-table")
    .getByText("비닐125*125", { exact: true })
    .locator("../..");
  await materialRow.locator('input[type="checkbox"]').first().check();
  await expect(dialog.getByLabel("비닐125*125 투입수량")).toBeVisible();
  await dialog.getByLabel("비닐125*125 투입수량").fill("1200");
  await expect(dialog.getByLabel("비닐125*125 투입수량")).toHaveValue("1200");
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

test("자주검사 커스텀 정보 등록 상태", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 960 });
  await page.goto("/visual-regression/custom-information");
  const dialog = page.getByRole("dialog", { name: "자주검사" });
  await expect(dialog).toBeVisible();

  const tableViewport = dialog.locator(".custom-information-table");
  const overflow = await tableViewport.evaluate((element) => ({
    horizontal: element.scrollWidth - element.clientWidth,
    vertical: element.scrollHeight - element.clientHeight,
  }));
  expect(overflow.horizontal).toBe(0);
  expect(overflow.vertical).toBeLessThanOrEqual(2);

  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("custom-information.png");

  const editor = dialog.locator(".custom-information-editor");
  await editor.getByRole("button", { name: "취소" }).click();
  await expect(editor).toBeHidden();
  await dialog.getByRole("button", { name: "정보 추가" }).click();
  await expect(editor).toBeVisible();
  await editor.locator("input").first().fill("신규 항목");
  await editor.getByRole("button", { name: "저장" }).click();
  await expect(editor).toBeHidden();
  await expect(dialog.getByText("신규 항목", { exact: true })).toBeVisible();
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

test("중앙·슬라이드 팝업 저장은 작업을 완료하고 닫는다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/patterns/completed-popup-types");

  await page.getByRole("button", { name: "400 · 생산수량 입력" }).click();
  let dialog = page.getByRole("dialog", { name: "생산수량 입력" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "저장" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "900 · 생산실적 등록" }).click();
  dialog = page.getByRole("dialog", { name: "생산실적 등록" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "저장" }).click();
  await expect(dialog).toBeHidden();
});

test("공통 날짜 범위와 그룹화 조회가 값을 변경한다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/patterns/completed-entity-list");
  const screen = page.locator("#completed-entity-list");

  const dateButtons = screen.getByRole("button", { name: "2025.03.30" });
  await dateButtons.first().click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect(page.getByRole("button", { name: "2025.03.15" })).toBeVisible();
  await expect(page.getByRole("button", { name: "15", exact: true })).toBeHidden();

  await screen.getByRole("button", { name: "Level 1 그룹화 기준 선택" }).click();
  await page.getByRole("button", { name: "지시일", exact: true }).click();
  await expect(screen.getByText("지시일", { exact: true })).toBeVisible();
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
