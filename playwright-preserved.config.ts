import { defineConfig } from '@playwright/test';
import transformer from './playwright-transformer.config';
// Exercise the existing behavioral suites; platform-specific macOS visual baselines stay unchanged.
export default defineConfig({ ...transformer, testMatch: /(?:della|vial|writing)\.spec\.ts$/, outputDir: 'test-results/preserved', reporter: [['list'], ['json', { outputFile: 'qa/preserved-results.json' }]] });
