import { defineConfig } from "@playwright/test";
const external = process.env.VIAL_TEST_URL;
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/vial*.spec.ts",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 3,
  timeout: 45_000,
  expect: { timeout: 7_000 },
  reporter: [["list"], ["html", { open: "never" }], ["json", { outputFile: "test-results/vial-results.json" }]],
  use: { baseURL: external || "http://127.0.0.1:3160", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "chromium", use: { browserName: "chromium", ...(process.platform === "darwin" ? { channel: "chrome" } : {}) } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: external ? undefined : { command: "npm run start -- --hostname 127.0.0.1 --port 3160", url: "http://127.0.0.1:3160", reuseExistingServer: false, timeout: 60_000 },
});
