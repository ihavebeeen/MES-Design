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
  const selectionCheckboxes = dialog.locator('.material-inventory-table input[type="checkbox"]');
  const [headerCheckbox, firstRowCheckbox] = await Promise.all([
    selectionCheckboxes.nth(0).boundingBox(),
    selectionCheckboxes.nth(1).boundingBox(),
  ]);
  expect(headerCheckbox).not.toBeNull();
  expect(firstRowCheckbox).not.toBeNull();
  expect(Math.abs((headerCheckbox!.x + headerCheckbox!.width / 2) - (firstRowCheckbox!.x + firstRowCheckbox!.width / 2))).toBeLessThanOrEqual(1);
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

test("자주검사 검사항목 헤더와 판정 영역", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 960 });
  await page.goto("/visual-regression/inspection");
  const dialog = page.getByRole("dialog", { name: "자주검사" });
  await expect(dialog).toBeVisible();

  const sectionBand = dialog.getByText("검사항목", { exact: true });
  const addButton = dialog.getByRole("button", { name: "항목 추가" });
  const [bandBox, addBox] = await Promise.all([sectionBand.boundingBox(), addButton.boundingBox()]);
  expect(bandBox).not.toBeNull();
  expect(addBox).not.toBeNull();
  expect(bandBox!.width).toBe(260);
  expect(addBox!.width).toBe(90);
  expect(addBox!.x - (bandBox!.x + bandBox!.width)).toBe(10);

  const [bandType, buttonType] = await Promise.all([
    sectionBand.evaluate((element) => {
      const style = getComputedStyle(element);
      return { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, color: style.color };
    }),
    addButton.evaluate((element) => {
      const style = getComputedStyle(element);
      return { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, color: style.color };
    }),
  ]);
  expect(bandType).toEqual({ family: expect.stringContaining("Pretendard"), size: "14px", weight: "700", color: "rgb(71, 80, 103)" });
  expect(buttonType).toEqual({ family: expect.stringContaining("Pretendard"), size: "14px", weight: "600", color: "rgb(255, 255, 255)" });

  const overflow = await dialog.evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBe(0);
  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("self-inspection.png");
});

test("BOM 복사 원본 폭과 무가로스크롤", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/visual-regression/bom-copy");
  const dialog = page.getByRole("dialog", { name: "BOM 복사" });
  await expect(dialog).toBeVisible();

  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBe(1142);
  expect(box!.height).toBe(733);
  const tableOverflows = await dialog.locator("[data-bom-table]").evaluateAll((elements) => elements.map((element) => element.scrollWidth - element.clientWidth));
  expect(tableOverflows).toEqual([0, 0]);

  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("bom-copy.png");
});

test("완성 팝업 16종은 데스크톱에서 가로 스크롤을 만들지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 960 });
  await page.goto("/patterns/completed-popup-types");
  const popupLabels = [
    "400 · 생산수량 입력",
    "480 · 품목 상세정보",
    "600 · 불량수량 입력",
    "960 · 중량검사",
    "1100 · 발주 일괄등록",
    "1400 · 일괄작업지시",
    "1400 · 투입품목 설정/조회",
    "1142 · BOM 복사",
    "1024 · 선발행 라벨 수량 확정",
    "900 · 운전일지 등록",
    "600 · 가동시간 선택",
    "600 · 비가동시간 선택",
    "900 · 생산실적 등록",
    "900 · 입고등록",
    "760 · 커스텀 정보 등록",
    "760 · 자주검사",
  ];

  for (const label of popupLabels) {
    await page.getByRole("button", { name: label, exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const offenders = await dialog.locator("*").evaluateAll((elements) => elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const overflow = element.scrollWidth - element.clientWidth;
      return overflow > 1 && (style.overflowX === "auto" || style.overflowX === "scroll")
        ? [{ overflow, className: element.className }]
        : [];
    }));
    expect(offenders, `${label} 내부 가로 overflow`).toEqual([]);
    await dialog.getByRole("button", { name: "닫기" }).click();
    await expect(dialog).toBeHidden();
  }
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
