import { defineConfig } from "@playwright/test";

const external = process.env.SKETCHBOOK_TEST_URL;
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/sketchbook*.spec.ts",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 3,
  timeout: 60_000,
  expect: { timeout: 7_000 },
  reporter: [["list"], ["json", { outputFile: "test-results/sketchbook-results.json" }]],
  use: { baseURL: external || "http://127.0.0.1:3149", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "chromium", use: { browserName: "chromium", channel: "chrome" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: external ? undefined : { command: "npm run start -- --hostname 127.0.0.1 --port 3149", url: "http://127.0.0.1:3149", reuseExistingServer: true, timeout: 60_000 },
});
