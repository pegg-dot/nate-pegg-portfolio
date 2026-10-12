import { defineConfig } from '@playwright/test';
const external = process.env.TRANSFORMER_TEST_URL;
export default defineConfig({
  testDir: './tests', testMatch: '**/transformer*.spec.ts', fullyParallel: true, forbidOnly: true, retries: 0, workers: 2, timeout: 45000,
  expect: { timeout: 7000 },
  reporter: [['list'], ['json', { outputFile: 'qa/transformer-results.json' }]],
  use: { baseURL: external || 'http://127.0.0.1:3170', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium', ...(process.platform === 'darwin' ? { channel: 'chrome' } : {}) } }, { name: 'webkit', use: { browserName: 'webkit' } }],
  webServer: external ? undefined : { command: 'npm run start -- --hostname 127.0.0.1 --port 3170', url: 'http://127.0.0.1:3170', reuseExistingServer: false, timeout: 60000 },
});
