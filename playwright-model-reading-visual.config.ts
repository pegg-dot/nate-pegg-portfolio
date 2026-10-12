import { defineConfig } from '@playwright/test';
import transformer from './playwright-transformer.config';

// Platform-specific reviewed screenshots run separately from the cross-platform suite.
export default defineConfig({
  ...transformer,
  testMatch: '**/model-reading-visual.spec.ts',
  reporter: [['list'], ['json', { outputFile: 'qa/model-reading-visual-results.json' }]],
  outputDir: 'test-results/model-reading-visual',
});
