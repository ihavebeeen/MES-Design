import { expect, test, type Locator, type Page } from "@playwright/test";

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

test("입고등록은 승인된 SectionFrame·FormGrid·취소 복원 계약을 사용한다", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 960 });
  await page.goto("/visual-regression/receiving-pilot");
  const dialog = page.getByRole("dialog", { name: "입고등록" });
  await expect(dialog).toBeVisible();

  const frame = dialog.locator('[data-pilot-pattern="frame.standard-section"]');
  const grids = dialog.locator('[data-pilot-pattern="section.form-grid"], [data-pilot-pattern-part="section.form-grid"]');
  await expect(frame).toHaveCount(1);
  await expect(grids).toHaveCount(2);
  const frameStyle = await frame.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
      borderBottomWidth: style.borderBottomWidth,
    };
  });
  expect(frameStyle).toEqual({ paddingTop: "20px", paddingRight: "20px", paddingBottom: "20px", paddingLeft: "20px", borderBottomWidth: "1px" });

  const horizontalOverflow = await dialog.evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(horizontalOverflow).toBe(0);
  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("receiving-pattern-pilot.png");

  const quantityInput = dialog.getByRole("group", { name: "입고수량" }).locator("input");
  const deleteButtons = dialog.getByRole("button", { name: / 삭제$/ });
  await expect(quantityInput).toHaveValue("13");
  await expect(deleteButtons).toHaveCount(6);

  await quantityInput.fill("77");
  await dialog.getByRole("button", { name: "추가", exact: true }).click();
  await expect(deleteButtons).toHaveCount(7);
  await dialog.getByRole("button", { name: "저장" }).click();

  await quantityInput.fill("88");
  await dialog.getByRole("button", { name: "취소" }).click();
  await expect(dialog).toBeVisible();
  await expect(quantityInput).toHaveValue("77");
  await expect(deleteButtons).toHaveCount(7);
});

test("중앙 팝업 파일럿은 검색·테이블과 선택 행 편집 계약을 함께 사용한다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/visual-regression/batch-work-order-pilot");
  const dialog = page.getByRole("dialog", { name: "생산계획(일) 연동 일괄작업지시" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-pattern="section.search-table-composition"]')).toHaveCount(1);

  const numericInputs = dialog.locator('input[inputmode="numeric"]');
  await expect(numericInputs).toHaveCount(1);
  const checkboxes = dialog.locator('input[type="checkbox"]');
  await checkboxes.nth(2).check();
  await expect(numericInputs).toHaveCount(2);
  await numericInputs.nth(1).fill("2500");
  await expect(numericInputs.nth(1)).toHaveValue("2500");

  const overflow = await dialog.evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBe(0);
  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("batch-work-order-pilot.png");
});

test("이지모드 입고등록은 MES 우측 슬라이드 규격과 직접 입력 상태를 유지한다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/visual-regression/easy-mode-receiving");
  const dialog = page.getByRole("dialog", { name: "입고등록" });
  await expect(dialog).toBeVisible();

  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBe(540);
  expect(box!.y).toBe(0);
  expect(box!.width).toBe(900);
  expect(box!.height).toBe(900);

  const readTypography = (locator: Locator) => locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { fontSize: style.fontSize, fontWeight: style.fontWeight };
  });
  const typography = {
    title: await readTypography(dialog.locator("h2")),
    groupTitle: await readTypography(dialog.getByText("품목/수량 직접 입력", { exact: true })),
    field: await readTypography(dialog.locator("span").filter({ hasText: /^입고일/ }).first()),
    tableHeader: await readTypography(dialog.locator("span").filter({ hasText: /^거래처/ }).last()),
  };
  expect(typography.title).toEqual({ fontSize: "18px", fontWeight: "700" });
  expect(typography.groupTitle).toEqual({ fontSize: "14px", fontWeight: "600" });
  expect(typography.field?.fontSize).toBe("14px");
  expect(typography.tableHeader).toEqual({ fontSize: "13px", fontWeight: "600" });

  await expect(dialog.getByText("이지모드", { exact: true })).toHaveCount(0);
  await expect(dialog.getByText("기본", { exact: true })).toHaveCount(0);
  const contentOverflow = await dialog.locator("[data-easy-receiving-content]").evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(contentOverflow).toBe(0);

  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("easy-mode-receiving.png");

  const saveButton = dialog.getByRole("button", { name: "저장" });
  const addButton = dialog.getByRole("button", { name: "행 추가" });
  await expect(saveButton).toBeDisabled();
  await expect(addButton).toBeDisabled();

  await dialog.getByRole("button", { name: "날짜 선택" }).click();
  await page.getByRole("button", { name: "11", exact: true }).click();
  await dialog.getByLabel("1행 거래처").click();
  await page.getByRole("option", { name: "D업체" }).click();
  await dialog.getByLabel("1행 창고").click();
  await page.getByRole("option", { name: "동진창고" }).click();
  await dialog.getByLabel("1행 품목").click();
  await page.getByRole("option", { name: "비비빅" }).click();
  await dialog.getByLabel("1행 수량").fill("1500");
  await expect(saveButton).toBeEnabled();
  await expect(addButton).toBeEnabled();

  await addButton.click();
  await expect(dialog.getByLabel("2행 거래처")).toBeVisible();
  await expect(dialog.getByLabel("2행 거래처")).toHaveText("D업체");
  await expect(dialog.getByLabel("2행 창고")).toHaveText("본창고");
  await expect(saveButton).toBeDisabled();
  await dialog.getByRole("button", { name: "2행 삭제" }).click();
  await expect(dialog.getByLabel("2행 거래처")).toHaveCount(0);

  await expect(dialog.getByRole("button", { name: /선택 항목/ })).toHaveCount(0);
  await expect(dialog.getByLabel("선택 항목")).toBeVisible();
  await expect(dialog.getByRole("combobox", { name: "입고구분" })).toBeVisible();
  await dialog.getByRole("textbox", { name: "비고" }).fill("무지시 입고");

  await dialog.getByRole("button", { name: "취소" }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "팝업 다시 열기" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "날짜 선택" })).toBeVisible();
  await expect(dialog.getByLabel("1행 거래처")).toHaveText("선택");
  await expect(dialog.getByRole("button", { name: "저장" })).toBeDisabled();
});

test("부분 성공 생성안은 표준 패턴과 분리된 검토함에 기록된다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const generatedScreensLink = page.getByRole("link", { name: "Generated Screens", exact: true }).first();
  await expect(generatedScreensLink).toBeVisible();
  await generatedScreensLink.click();
  await expect(page).toHaveURL(/\/generated-screens\/?$/);

  await expect(page.getByRole("link", { name: "MES Design System", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation").getByRole("link", { name: "Generated Screens", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "생성 시안 검토함" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "이지모드 입고등록" })).toBeVisible();
  await expect(page.getByText("부분 성공", { exact: true })).toBeVisible();
  await expect(page.getByText("표준 영향 차단", { exact: true })).toBeVisible();
  await expect(page.getByText("50 / 100", { exact: true })).toBeVisible();
  await expect(page.getByText("단일 화면 생성과 수정에 시간이 과도하게 걸렸다.", { exact: true })).toBeVisible();
  await expect(page.getByText("사용자 검토를 통과한 뒤에만 patterns.json과 screens.json에 승격한다.", { exact: true })).toBeVisible();

  const preview = page.frameLocator('iframe[title="이지모드 입고등록 미리보기"]');
  await expect(preview.getByRole("dialog", { name: "입고등록" })).toBeVisible();

  await page.goto("/patterns/completed-popup-types");
  await expect(page.getByRole("button", { name: "900 · 이지모드 입고등록", exact: true })).toHaveCount(0);
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

test("양식관리 숫자 검사 기준은 조건 유형별 원본 치수와 상태를 유지한다", async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 720 });
  await page.goto("/visual-regression/form-inspection-criteria");
  const dialog = page.getByRole("dialog", { name: "셋팅 온도" });
  await expect(dialog).toBeVisible();

  const assertDialog = async (width: number, height: number) => {
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBe(width);
    expect(box!.height).toBe(height);
    expect(await dialog.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
  };

  await assertDialog(480, 418);
  const titleType = await dialog.getByText("판정 기준 입력", { exact: true }).evaluate((element) => {
    const style = getComputedStyle(element);
    return { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, color: style.color };
  });
  expect(titleType).toEqual({ family: expect.stringContaining("Pretendard"), size: "15px", weight: "700", color: "rgb(1, 19, 39)" });
  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("form-inspection-criteria-simple.png");

  await dialog.getByRole("tab", { name: "범위조건" }).click();
  await assertDialog(480, 476);
  await expect(dialog).toHaveScreenshot("form-inspection-criteria-range.png");
  await dialog.getByLabel("범위조건 최대값").fill("70");
  await expect(dialog.getByText(/50.*≤ X ≤.*70/)).toBeVisible();

  await dialog.getByRole("tab", { name: "복합조건" }).click();
  await assertDialog(480, 550);
  await expect(dialog).toHaveScreenshot("form-inspection-criteria-complex.png");
  await expect(dialog.getByRole("button", { name: "조건 삭제" })).toHaveCount(1);
  await dialog.getByRole("button", { name: "조건 삭제" }).click();
  await expect(dialog.getByRole("button", { name: "조건 삭제" })).toHaveCount(0);

  await dialog.getByRole("tab", { name: "단순조건" }).click();
  await dialog.getByLabel("단순조건 측정값").fill("77");
  await dialog.getByRole("button", { name: "취소" }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "팝업 다시 열기" }).click();
  await expect(dialog.getByLabel("단순조건 측정값")).toHaveValue("50");
});

test("양식관리 판정형 검사 기준은 O·△·X 선택과 취소 복원을 지원한다", async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 720 });
  await page.goto("/visual-regression/form-inspection-criteria-judgement");
  const dialog = page.getByRole("dialog", { name: "전자접촉기 상태" });
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBe(480);
  expect(box!.height).toBe(434);
  expect(await dialog.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("form-inspection-criteria-judgement.png");

  await dialog.getByRole("button", { name: "정상 기준값 △" }).click();
  await expect(dialog.getByText("정상값 = △", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "취소" }).click();
  await page.getByRole("button", { name: "팝업 다시 열기" }).click();
  await expect(dialog.getByText("정상값 = O", { exact: true })).toBeVisible();
});

test("총 생산수량 변경 팝업은 원본 치수와 재등록 흐름을 유지한다", async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 720 });
  await page.goto("/visual-regression/production-quantity-reregistration");
  const dialog = page.getByRole("dialog", { name: "알림" });
  await expect(dialog).toBeVisible();

  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBe(490);
  expect(box!.height).toBe(342);
  expect(await dialog.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);

  const content = dialog.locator("[data-production-quantity-comparison]");
  await expect(content).toHaveCSS("height", "210px");
  const heading = dialog.getByText("총 생산수량이 변경되었습니다.", { exact: true });
  await expect(heading).toHaveCSS("font-size", "16px");
  await expect(heading).toHaveCSS("font-weight", "600");
  const comparison = dialog.getByRole("table", { name: "변경 전후 비교" });
  await expect(comparison).toHaveCSS("height", "90px");
  expect(await comparison.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);

  await hideDevelopmentOverlay(page);
  await expect(dialog).toHaveScreenshot("production-quantity-reregistration.png");

  await dialog.getByRole("button", { name: "닫기", exact: true }).last().click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status")).toHaveCount(0);

  await page.getByRole("button", { name: "팝업 다시 열기" }).click();
  await dialog.getByRole("button", { name: "투입품목 재등록" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status")).toHaveText("투입품목 설정/조회 열기 요청됨");
});

test("양식 편집과 입고검사는 중앙 모달이 아니라 우측 전체 높이 패널이다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/patterns/original-mes-screen-assets");
  await page.getByRole("button", { name: "양식 편집 원본" }).click();

  let dialog = page.getByRole("dialog", { name: "양식관리" });
  await expect(dialog).toBeVisible();
  let box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box).toEqual({ x: 540, y: 0, width: 900, height: 960 });
  await expect(dialog).toHaveCSS("border-radius", "0px");
  expect(await dialog.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
  await hideDevelopmentOverlay(page);
  await expect(page).toHaveScreenshot("form-management-side-panel.png");
  await dialog.getByRole("button", { name: "취소" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "입고검사 · 항목 있음" }).click();
  dialog = page.getByRole("dialog", { name: "입고검사" });
  await expect(dialog).toBeVisible();
  box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box).toEqual({ x: 591, y: 0, width: 849, height: 960 });
  await expect(dialog).toHaveCSS("border-radius", "0px");
  expect(await dialog.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
  await expect(page).toHaveScreenshot("receiving-inspection-side-panel.png");
});

test("캐비티 배열 입력은 제어 상태로 동작하고 콘솔 오류를 만들지 않는다", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/patterns/completed-popup-types");
  const gallery = page.getByRole("region", { name: "Figma 원본 팝업" });
  await gallery.getByRole("button", { name: "캐비티 배열 설정", exact: true }).click();

  const horizontalCount = gallery.getByRole("textbox", { name: "배열 가로" });
  const verticalCount = gallery.getByRole("textbox", { name: "배열 세로" });
  await horizontalCount.fill("4");
  await verticalCount.fill("3");
  await expect(horizontalCount).toHaveValue("4");
  await expect(verticalCount).toHaveValue("3");
  await expect(gallery.locator('input[value="4*3"]')).toBeVisible();

  await gallery.getByText("사용자 설정", { exact: true }).click();
  const exchange = gallery.getByRole("textbox", { name: "교환할 번호 입력" });
  await exchange.fill("12");
  await gallery.getByRole("button", { name: "교환", exact: true }).click();
  await expect(gallery.getByRole("textbox", { name: "선택한 셀" })).toHaveValue("12");
  expect(consoleErrors).toEqual([]);
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
