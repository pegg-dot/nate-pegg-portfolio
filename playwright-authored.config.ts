import { defineConfig } from '@playwright/test';
import previous from './playwright-della-harden.config';
const external = process.env.PORTFOLIO_TEST_URL;
export default defineConfig({
  ...previous,
  testMatch: ['**/authored.spec.ts', '**/della.spec.ts', '**/vial.spec.ts', '**/writing.spec.ts', '**/transformer*.spec.ts'],
  reporter: [['list'], ['json', { outputFile: 'qa/authored-results.json' }]],
  use: { ...previous.use, baseURL: external || 'http://127.0.0.1:3206' },
  webServer: external ? undefined : { command: 'npm run start -- --hostname 127.0.0.1 --port 3206', url: 'http://127.0.0.1:3206', reuseExistingServer: false, timeout: 60000 },
});
