import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const previewURL = new URL(baseURL);

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    colorScheme: "light",
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      maxDiffPixelRatio: 0.002,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_MANAGED_SERVER === "1" ? undefined : {
    command: `npm run dev -- --hostname ${previewURL.hostname} --port ${previewURL.port || "3000"}`,
    url: `${baseURL}/visual-regression/table`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
