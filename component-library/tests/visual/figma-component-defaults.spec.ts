import { expect, test } from "@playwright/test";

const colors = { black: "rgb(1, 19, 39)", blue: "rgb(21, 115, 251)", gray: "rgb(215, 220, 229)" };

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/visual-regression/figma-component-defaults");
  await page.mouse.move(0, 0);
});

test("Figma: 제목·액션·외곽 28px, 일반 small 버튼 32px", async ({ page }) => {
  for (const id of ["header-only", "header-action", "header-link", "section-frame"]) {
    const header = page.getByTestId(id).locator(":scope > div").first();
    await expect(header).toHaveCSS("height", "28px");
    await expect(header.locator(":scope > div").first()).toHaveCSS("height", "28px");
    if (id !== "header-only") {
      const action = header.locator("button, a");
      await expect(action).toHaveCSS("height", "28px");
      const [bandBox, actionBox] = await Promise.all([header.locator(":scope > div").first().boundingBox(), action.boundingBox()]);
      expect(actionBox!.y).toBe(bandBox!.y);
      expect(actionBox!.x - bandBox!.x - bandBox!.width).toBe(10);
    }
  }
  await expect(page.getByRole("button", { name: "일반 32px 버튼" })).toHaveCSS("height", "32px");
  await expect(page.getByTestId("header-action").getByRole("button")).toHaveCSS("background-color", colors.blue);
  await expect(page.getByTestId("section-frame").getByRole("button")).toHaveCSS("background-color", colors.black);
});

test("Figma: 모달 푸터 기본 닫기·저장 조합", async ({ page }) => {
  await expect(page.getByTestId("footer-0")).toBeEmpty();
  const footer = page.getByTestId("dialog-footer-default");
  const buttons = footer.getByRole("button");
  await expect(buttons).toHaveCount(2);
  await expect(buttons.nth(0)).toHaveText("닫기");
  await expect(buttons.nth(0)).toHaveCSS("background-color", colors.gray);
  await expect(buttons.nth(1)).toHaveText("저장");
  await expect(buttons.nth(1)).toHaveCSS("background-color", colors.black);
  for (const button of [buttons.nth(0), buttons.nth(1)]) {
    await expect(button).toHaveCSS("width", "160px");
    await expect(button).toHaveCSS("height", "40px");
  }
});

test("Figma: 메인 리스트 우하단 액션은 32px 별도 조합", async ({ page }) => {
  for (const count of [1, 2, 3]) {
    const footer = page.getByTestId(`list-footer-${count}`);
    const buttons = footer.getByRole("button");
    await expect(buttons).toHaveCount(count);
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveCSS("background-color", [colors.black, colors.blue, colors.gray][i]);
      await expect(buttons.nth(i)).toHaveCSS("width", "160px");
      await expect(buttons.nth(i)).toHaveCSS("height", "32px");
      await expect(buttons.nth(i)).toHaveCSS("border-radius", "4px");
      if (i > 0) {
        const [previous, current] = await Promise.all([buttons.nth(i - 1).boundingBox(), buttons.nth(i).boundingBox()]);
        expect(current!.x - previous!.x - previous!.width).toBe(10);
      }
    }
  }
});

test("Figma: 명시적 색상·폭·클릭·비활성은 유지", async ({ page }) => {
  const buttons = page.getByTestId("footer-overrides").getByRole("button");
  await expect(buttons.nth(0)).toHaveCSS("background-color", colors.gray);
  await expect(buttons.nth(0)).toHaveCSS("width", "200px");
  await expect(buttons.nth(1)).toBeDisabled();
  await expect(buttons.nth(1)).toHaveCSS("background-color", colors.gray);
  await expect(buttons.nth(2)).toHaveCSS("background-color", colors.black);
  await buttons.nth(0).click();
  await expect(page.getByTestId("event")).toHaveText("사용자 지정");
});

for (const [kind, title, label] of [["center", "중앙 모달", "저장"], ["side", "우측 패널", "저장"]]) {
  test(`Figma: ${kind} 저장 gray130·닫기 회색 및 동작 유지`, async ({ page }, testInfo) => {
    await page.getByRole("button", { name: `${kind} 열기`, exact: true }).click();
    const dialog = page.getByRole("dialog", { name: title, exact: true });
    const confirm = dialog.getByRole("button", { name: label, exact: true });
    const cancel = dialog.getByRole("button", { name: "닫기", exact: true }).last();
    await page.mouse.move(0, 0);
    await expect(confirm).toHaveCSS("background-color", colors.black);
    await expect(cancel).toHaveCSS("background-color", colors.gray);
    for (const button of [confirm, cancel]) {
      await expect(button).toHaveCSS("width", "160px");
      await expect(button).toHaveCSS("height", "40px");
      await expect(button).toHaveCSS("border-radius", "4px");
    }
    const [cancelBox, confirmBox] = await Promise.all([cancel.boundingBox(), confirm.boundingBox()]);
    expect(confirmBox!.x - cancelBox!.x - cancelBox!.width).toBe(10);
    await testInfo.attach(`${kind}-current`, { body: await dialog.screenshot(), contentType: "image/png" });
    await confirm.click();
    await expect(page.getByTestId("event")).toHaveText("확인");
    await cancel.click();
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("event")).toHaveText("취소");
  });
}

for (const kind of ["center", "side"]) {
  test(`Figma: ${kind} X·Esc 공통 취소 경로 유지`, async ({ page }) => {
    for (const via of ["close", "escape"]) {
      await page.getByRole("button", { name: `${kind} 열기`, exact: true }).click();
      const dialog = page.getByRole("dialog");
      if (via === "close") await dialog.getByRole("button", { name: "닫기", exact: true }).first().click();
      else await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("event")).toHaveText("취소");
    }
  });
}

test("Figma: actions·footer 명시값과 푸터 숨김을 덮어쓰지 않음", async ({ page }) => {
  await page.getByRole("button", { name: "custom-actions 열기", exact: true }).click();
  let dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "검정 확인" })).toHaveCSS("background-color", colors.black);
  await dialog.getByRole("button", { name: "폐기" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("event")).toHaveText("취소");
  await page.getByRole("button", { name: "custom-footer 열기", exact: true }).click();
  dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "지정 푸터 버튼" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "사용하지 않는 액션" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "no-footer 열기", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("button")).toHaveCount(1);
});
