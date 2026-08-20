import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
});

test("Mobile 탭은 전용 컴포넌트 상태와 정적 경로를 제공한다", async ({ page }) => {
  await page.goto("/mobile/mobile-components");

  await expect(page.getByRole("link", { name: "Mobile", exact: true })).toHaveClass(/bg-mes-bg-subtle/);
  await expect(page.getByText("Mobile Components", { exact: true })).toBeVisible();
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

test("화면 유형 페이지는 12개 메인 유형과 13개 하단 팝업 유형을 375px 원본 셸로 보여준다", async ({ page }) => {
  await page.goto("/mobile/mobile-screens");

  await expect(page.getByText("메인화면 12종 · 44p", { exact: true })).toBeVisible();
  await expect(page.getByText("슬라이드 팝업 13종 · 19p", { exact: true })).toBeVisible();
  await expect(page.getByText("실적 LOT 모바일은 미진행 결정이 명시되어 활성 화면 목록에서 제외한다.", { exact: false })).toBeVisible();

  const devices = page.locator("[data-mobile-device]");
  await expect(devices).toHaveCount(2);
  for (const device of await devices.all()) {
    const box = await device.boundingBox();
    expect(box?.width).toBe(375);
    expect(box?.height).toBe(812);
    expect(await device.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  await expect(page).toHaveScreenshot("mobile-screen-types-catalog.png");
  await expect(devices.nth(0)).toHaveScreenshot("mobile-home-shell.png");
  await expect(devices.nth(1)).toHaveScreenshot("mobile-receiving-list-shell.png");
});
