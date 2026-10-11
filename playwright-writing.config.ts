import { defineConfig } from "@playwright/test";

const external = process.env.PORTFOLIO_TEST_URL;
export default defineConfig({
  testDir: "./tests",
  testMatch: /writing\.spec\.ts/,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 7_000 },
  reporter: [["list"], ["json", { outputFile: "test-results/writing-results.json" }]],
  use: { baseURL: external || "http://127.0.0.1:3150", viewport: { width: 1440, height: 1000 }, screenshot: "only-on-failure", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { browserName: "chromium", channel: "chrome" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: external ? undefined : { command: "npm run start -- --hostname 127.0.0.1 --port 3150", url: "http://127.0.0.1:3150", reuseExistingServer: false, timeout: 60_000 },
});
