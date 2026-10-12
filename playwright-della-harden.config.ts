import { defineConfig } from '@playwright/test';
const external = process.env.PORTFOLIO_TEST_URL;
export default defineConfig({
  testDir: './tests',
  // Behavioral coverage for the changed route and the three previously finished areas.
  // Platform-specific reviewed image baselines run separately in their original configs.
  testMatch: ['**/della.spec.ts', '**/vial.spec.ts', '**/writing.spec.ts', '**/transformer*.spec.ts'],
  fullyParallel: true, forbidOnly: true, retries: 0, workers: 3, timeout: 45_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['json', { outputFile: 'qa/della-harden-results.json' }]],
  use: { baseURL: external || 'http://127.0.0.1:3181', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', ...(process.platform === 'darwin' ? { channel: 'chrome' } : {}) } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: external ? undefined : { command: 'npm run start -- --hostname 127.0.0.1 --port 3181', url: 'http://127.0.0.1:3181', reuseExistingServer: false, timeout: 60_000 },
});
