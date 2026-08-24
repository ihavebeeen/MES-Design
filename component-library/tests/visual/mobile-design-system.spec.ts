import { expect, test } from "@playwright/test";

test.setTimeout(180_000);

async function expectFigmaFrame(page: import("@playwright/test").Page, path: string, selector: string, snapshot: string, currentGuard: number) {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(path);
  const frame = page.locator(selector);
  const box = await frame.boundingBox();
  expect(box).toEqual({ x: 0, y: 0, width: 375, height: 812 });
  expect(await frame.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
  // Figma의 2x export를 375×812로 축소한 이미지와 Chromium 1x 렌더는 글리프·벡터 가장자리의
  // 래스터화가 다르다. threshold는 그 가장자리 노이즈만 완화하고, 허용 픽셀 비율은 별도로 제한한다.
  // 1%를 넘는 프레임은 registry에서 계속 reviewing이며, 이 값은 검증 완료 기준이 아니다.
  await expect(page).toHaveScreenshot(snapshot, { maxDiffPixelRatio: currentGuard, threshold: 0.3 });
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
  await page.getByRole("option", { name: /옵션2/ }).click();
  await expect(page.getByRole("button", { name: "옵션2", exact: true })).toBeVisible();

  const nightShift = page.getByRole("radio", { name: "야간", exact: true });
  await nightShift.click();
  await expect(nightShift).toHaveAttribute("aria-checked", "true");

  const historyTab = page.getByRole("tab", { name: "이력", exact: true });
  await historyTab.click();
  await expect(historyTab).toHaveAttribute("aria-selected", "true");

  const completion = page.getByRole("checkbox", { name: "입력 완료", exact: true });
  await completion.click();
  await expect(completion).toBeChecked();

  const bottomNav = page.getByRole("navigation", { name: "모바일 하단 메뉴" });
  await bottomNav.getByRole("button", { name: "알람", exact: true }).click();
  await expect(bottomNav.getByRole("button", { name: "알람", exact: true })).toHaveAttribute("aria-current", "page");

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page).toHaveScreenshot("mobile-components-catalog.png");
});

test("원본 화면은 Figma 대표 프레임을 375×812로 재현한다", async ({ page }) => {
  await page.goto("/mobile/mobile-screens");

  await expect(page.getByRole("link", { name: "원본 화면 Source Screens" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "팝업 자산 Popup Assets" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "원본 화면 검수 현황" })).toBeVisible();
  await expect(page.getByText("19 frames", { exact: true })).toBeVisible();
  await expect(page.getByText("실적 LOT 모바일은 미진행 결정이 명시되어 활성 화면 목록에서 제외한다.", { exact: false })).toBeVisible();

  const cases = [
    { path: "/visual-regression/mobile-source/home", selector: '[data-mobile-source-screen="home"]', snapshot: "mobile-figma-home.png", currentGuard: 0.01 },
    { path: "/visual-regression/mobile-source/receiving-list", selector: '[data-mobile-source-screen="receiving-list"]', snapshot: "mobile-figma-receiving-list.png", currentGuard: 0.02 },
    { path: "/visual-regression/mobile-source/production-entry", selector: '[data-mobile-source-screen="production-entry"]', snapshot: "mobile-figma-production-entry.png", currentGuard: 0.03 },
    { path: "/visual-regression/mobile-source/all-menu", selector: '[data-mobile-source-screen="all-menu"]', snapshot: "mobile-figma-all-menu.png", currentGuard: 0.01 },
    { path: "/visual-regression/mobile-source/appearance-inspection", selector: '[data-mobile-source-screen="appearance-inspection"]', snapshot: "mobile-figma-appearance-inspection.png", currentGuard: 0.02 },
    { path: "/visual-regression/mobile-source/day-log", selector: '[data-mobile-source-screen="day-log"]', snapshot: "mobile-figma-day-log.png", currentGuard: 0.02 },
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

  await page.goto("/visual-regression/mobile-source/all-menu");
  const allMenu = page.locator('[data-mobile-source-screen="all-menu"]');
  await expect(allMenu.getByRole("button", { name: "생산관리", exact: true })).toHaveAttribute("aria-pressed", "true");
  await allMenu.getByRole("button", { name: "품질검사", exact: true }).click();
  await expect(allMenu.getByRole("button", { name: "품질검사", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(allMenu.getByRole("navigation", { name: "세부 업무" })).toContainText("공정검사");

  await page.goto("/visual-regression/mobile-source/appearance-inspection");
  const inspection = page.locator('[data-mobile-source-screen="appearance-inspection"]');
  await inspection.getByRole("button", { name: "초기화", exact: true }).click();
  await expect(inspection.getByRole("button", { name: "결로/플러그자국/밀착 양호", exact: true }).first()).toHaveAttribute("aria-pressed", "false");
  await inspection.getByRole("button", { name: "일괄 선택", exact: true }).click();
  await expect(inspection.getByRole("button", { name: "결로/플러그자국/밀착 양호", exact: true }).first()).toHaveAttribute("aria-pressed", "true");

  await page.goto("/visual-regression/mobile-source/day-log");
  const dayLog = page.locator('[data-mobile-source-screen="day-log"]');
  await dayLog.getByRole("radio", { name: "야간", exact: true }).click();
  await expect(dayLog.getByRole("radio", { name: "야간", exact: true })).toHaveAttribute("aria-checked", "true");
  const moldChange = dayLog.getByRole("textbox", { name: "금형교체", exact: true });
  await moldChange.fill("120");
  await dayLog.getByRole("button", { name: "저장", exact: true }).click();
  await expect(dayLog.getByRole("status")).toHaveText("저장되었습니다.");
  await dayLog.getByRole("button", { name: "취소", exact: true }).click();
  await expect(moldChange).toHaveValue("100");

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test("팝업 자산은 Figma 대표 프레임 3종을 375×812로 재현하고 상호작용한다", async ({ page }) => {
  await page.goto("/mobile/mobile-popup-assets");
  await expect(page.getByRole("heading", { name: "원본 팝업 검수 현황" })).toBeVisible();
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

test("남은 모바일 메인 원본 13종은 고정 viewport와 무가로스크롤 계약을 지킨다", async ({ page }) => {
  const cases = [
    ["receiving-result", "mobile-figma-receiving-result.png"],
    ["maintenance-form", "mobile-figma-maintenance-form.png"],
    ["weight-inspection", "mobile-figma-weight-inspection.png"],
    ["special-notes", "mobile-figma-special-notes.png"],
    ["user-settings", "mobile-figma-user-settings.png"],
    ["login-placeholder", "mobile-figma-login-placeholder.png"],
    ["report-basic-info", "mobile-figma-report-basic-info.png"],
    ["hourly-notes", "mobile-figma-hourly-notes.png"],
    ["incoming-inspection-list", "mobile-figma-incoming-inspection-list.png"],
    ["shipping-inspection-list", "mobile-figma-shipping-inspection-list.png"],
    ["incoming-inspection-basic", "mobile-figma-incoming-inspection-basic.png"],
    ["incoming-inspection-appearance", "mobile-figma-incoming-inspection-appearance.png"],
    ["equipment-inspection-list", "mobile-figma-equipment-inspection-list.png"],
  ] as const;

  for (const [id, snapshot] of cases) {
    await expectFigmaFrame(page, `/visual-regression/mobile-source/${id}`, `[data-mobile-remaining-screen="${id}"]`, snapshot, 0.06);
  }

  await page.goto("/visual-regression/mobile-source/receiving-result");
  const receiving = page.locator('[data-mobile-remaining-screen="receiving-result"]');
  const receivingQuantity = receiving.getByRole("textbox").first();
  await receivingQuantity.fill("320");
  await expect(receivingQuantity).toHaveValue("320");
  await expect(receiving.getByRole("checkbox")).toBeChecked();
  await receiving.getByRole("checkbox").click();
  await expect(receiving.getByRole("checkbox")).not.toBeChecked();

  await page.goto("/visual-regression/mobile-source/hourly-notes");
  const hourlyValue = page.locator('[data-mobile-remaining-screen="hourly-notes"] input').first();
  await hourlyValue.fill("설비 점검");
  await expect(hourlyValue).toHaveValue("설비 점검");

  await page.goto("/visual-regression/mobile-source/maintenance-form");
  const maintenance = page.locator('[data-mobile-remaining-screen="maintenance-form"]');
  await maintenance.getByRole("textbox", { name: "담당자", exact: true }).fill("이수현");
  await maintenance.getByRole("textbox", { name: "시작시간", exact: true }).fill("09:00");
  await maintenance.getByRole("textbox", { name: "종료시간", exact: true }).fill("10:00");
  await expect(maintenance.getByRole("textbox", { name: "담당자", exact: true })).toHaveValue("이수현");

  await page.goto("/visual-regression/mobile-source/weight-inspection");
  const weight = page.locator('[data-mobile-remaining-screen="weight-inspection"]');
  await weight.getByRole("textbox", { name: "배열넘버", exact: true }).fill("15");
  await weight.getByRole("textbox", { name: "결과값", exact: true }).fill("98.7");
  await expect(weight.getByRole("textbox", { name: "결과값", exact: true })).toHaveValue("98.7");
});

test("남은 모바일 팝업 원본 13종은 유형별 위치와 입력 계약을 지킨다", async ({ page }) => {
  const cases = [
    ["bom-select-popup", "mobile-figma-bom-select-popup.png"],
    ["alarm-history-popup", "mobile-figma-alarm-history-popup.png"],
    ["receiving-quantity-popup", "mobile-figma-receiving-quantity-popup.png"],
    ["result-history-popup", "mobile-figma-input-history-popup.png"],
    ["label-confirm-popup", "mobile-figma-lot-confirm-popup.png"],
    ["item-detail-popup", "mobile-figma-item-detail-popup.png"],
    ["lot-split-popup", "mobile-figma-lot-split-popup.png"],
    ["input-error-popup", "mobile-figma-input-error-popup.png"],
    ["scan-item-popup", "mobile-figma-scan-item-popup.png"],
    ["work-time-popup", "mobile-figma-work-time-popup.png"],
    ["production-quantity-mode-popup", "mobile-figma-production-quantity-mode-popup.png"],
    ["shipping-quantity-popup", "mobile-figma-shipping-quantity-popup.png"],
    ["defect-entry-popup", "mobile-figma-defect-quantity-popup.png"],
  ] as const;

  for (const [id, snapshot] of cases) {
    const guard = id === "bom-select-popup" ? 0.07 : 0.06;
    await expectFigmaFrame(page, `/visual-regression/mobile-source/${id}`, `[data-mobile-remaining-popup="${id}"]`, snapshot, guard);
  }

  await page.goto("/visual-regression/mobile-source/production-quantity-mode-popup");
  const modePopup = page.locator('[data-mobile-remaining-popup="production-quantity-mode-popup"]');
  await modePopup.getByText("자동계산", { exact: true }).click();
  await expect(modePopup.getByRole("checkbox").nth(1)).toBeChecked();
  await modePopup.getByText("수기입력", { exact: true }).click();
  const manualValue = modePopup.getByRole("textbox", { name: "수기입력 값" });
  await manualValue.fill("1200");
  await expect(manualValue).toHaveValue("1200");
});
