import { defineConfig } from '@playwright/test';
import authored from './playwright-authored.config';
export default defineConfig({ ...authored,
  testMatch: ['**/della-visual.spec.ts', '**/vial-visual.spec.ts', '**/model-reading-visual.spec.ts'],
  reporter: [['list'], ['json', { outputFile: 'qa/authored-visual-results.json' }]],
  outputDir: 'test-results/authored-visual',
});
