import { defineConfig } from '@playwright/test';
import authored from './playwright-authored.config';
const external = process.env.PORTFOLIO_TEST_URL;
export default defineConfig({
  ...authored,
  testMatch: ['**/vial.spec.ts', '**/vial-product.spec.ts'],
  reporter: [['list'], ['json', { outputFile: 'qa/vial-product-results.json' }]],
  use: { ...authored.use, baseURL: external || 'http://127.0.0.1:3211' },
  webServer: external ? undefined : { command: 'npm run start -- --hostname 127.0.0.1 --port 3211', url: 'http://127.0.0.1:3211', reuseExistingServer: false, timeout: 60000 },
});
