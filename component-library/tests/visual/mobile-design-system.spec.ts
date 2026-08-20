import { expect, test } from "@playwright/test";

async function expectFigmaFrame(page: import("@playwright/test").Page, path: string, selector: string, snapshot: string, currentGuard: number) {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(path);
  const frame = page.locator(selector);
  const box = await frame.boundingBox();
  expect(box).toEqual({ x: 0, y: 0, width: 375, height: 812 });
  expect(await frame.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
  // Figma PNG와 Chromium의 글리프 안티앨리어싱 차이를 포함한 현재 회귀 방지선이다.
  // 1%를 넘는 프레임은 registry에서 계속 reviewing이며, 이 값은 검증 완료 기준이 아니다.
  await expect(page).toHaveScreenshot(snapshot, { maxDiffPixelRatio: currentGuard });
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
});

test("Mobile 탭은 전용 컴포넌트 상태와 정적 경로를 제공한다", async ({ page }) => {
  await page.goto("/mobile/mobile-components");

  await expect(page.getByRole("link", { name: "Mobile", exact: true })).toHaveClass(/bg-mes-bg-subtle/);
  await expect(page.getByRole("heading", { name: "Button", exact: true })).toBeVisible();
  await expect(page.getByRole("complementary").locator("[data-sidebar-group]").first()).toContainText("Mobile");

  const toggle = page.getByRole("switch");
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(toggle).not.toBeChecked();

  const caution = page.getByRole("button", { name: "주의", exact: true });
  await caution.click();
  await expect(caution).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "옵션1", exact: true }).click();
  await page.getByRole("button", { name: /옵션2/ }).click();
  await expect(page.getByRole("button", { name: "옵션2", exact: true })).toBeVisible();

  const bottomNav = page.getByRole("navigation", { name: "모바일 하단 메뉴" });
  await bottomNav.getByRole("button", { name: "알람", exact: true }).click();
  await expect(bottomNav.getByRole("button", { name: "알람", exact: true })).toHaveAttribute("aria-current", "page");

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  await expect(page).toHaveScreenshot("mobile-components-catalog.png");
});

test("원본 화면은 Figma 대표 프레임 3종을 375×812로 재현한다", async ({ page }) => {
  await page.goto("/mobile/mobile-screens");

  await expect(page.getByRole("link", { name: "원본 화면 Source Screens" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "팝업 자산 Popup Assets" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "원본 화면 이관 큐" })).toBeVisible();
  await expect(page.getByText("19 frames", { exact: true })).toBeVisible();
  await expect(page.getByText("실적 LOT 모바일은 미진행 결정이 명시되어 활성 화면 목록에서 제외한다.", { exact: false })).toBeVisible();

  const cases = [
    { path: "/visual-regression/mobile-source/home", selector: '[data-mobile-source-screen="home"]', snapshot: "mobile-figma-home.png", currentGuard: 0.01 },
    { path: "/visual-regression/mobile-source/receiving-list", selector: '[data-mobile-source-screen="receiving-list"]', snapshot: "mobile-figma-receiving-list.png", currentGuard: 0.02 },
    { path: "/visual-regression/mobile-source/production-entry", selector: '[data-mobile-source-screen="production-entry"]', snapshot: "mobile-figma-production-entry.png", currentGuard: 0.03 },
  ];
  for (const item of cases) {
    await expectFigmaFrame(page, item.path, item.selector, item.snapshot, item.currentGuard);
  }

  await page.goto("/visual-regression/mobile-source/home");
  const homeMenu = page.getByRole("button", { name: "생산관리", exact: true });
  await homeMenu.click();
  await expect(homeMenu).toHaveAttribute("aria-pressed", "true");

  await page.goto("/visual-regression/mobile-source/receiving-list");
  const receivingRows = page.locator('[data-mobile-source-screen="receiving-list"] main button');
  await receivingRows.nth(1).click();
  await expect(receivingRows.nth(1)).toHaveClass(/ring-2/);

  await page.goto("/visual-regression/mobile-source/production-entry");
  const production = page.locator('[data-mobile-source-screen="production-entry"]');
  const completion = production.getByRole("checkbox");
  await expect(completion).toBeChecked();
  await completion.click();
  await expect(completion).not.toBeChecked();
  const quantity = production.locator('input[value="999,999"]');
  await quantity.fill("1000000");
  await expect(quantity).toHaveValue("1000000");

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test("팝업 자산은 Figma 대표 프레임 3종을 375×812로 재현하고 상호작용한다", async ({ page }) => {
  await page.goto("/mobile/mobile-popup-assets");
  await expect(page.getByRole("heading", { name: "원본 팝업 이관 큐" })).toBeVisible();
  await expect(page.getByText("16 frames", { exact: true })).toBeVisible();

  const cases = [
    { path: "/visual-regression/mobile-source/memo-popup", selector: '[data-mobile-popup-screen="memo"]', snapshot: "mobile-figma-memo-popup.png", currentGuard: 0.01 },
    { path: "/visual-regression/mobile-source/numeric-popup", selector: '[data-mobile-popup-screen="numeric"]', snapshot: "mobile-figma-numeric-popup.png", currentGuard: 0.02 },
    { path: "/visual-regression/mobile-source/personnel-popup", selector: '[data-mobile-popup-screen="personnel"]', snapshot: "mobile-figma-personnel-popup.png", currentGuard: 0.01 },
  ];
  for (const item of cases) {
    await expectFigmaFrame(page, item.path, item.selector, item.snapshot, item.currentGuard);
  }

  await page.goto("/visual-regression/mobile-source/personnel-popup");
  const personnel = page.locator('[data-mobile-popup-screen="personnel"]');
  await personnel.getByRole("button", { name: "김수현", exact: true }).click();
  await expect(personnel.getByRole("button", { name: "김수현", exact: true })).toHaveClass(/bg-mes-bg-strong/);
});
