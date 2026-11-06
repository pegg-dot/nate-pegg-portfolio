import { test, expect } from '@playwright/test';
import fixture from './fixtures/home-original-copy.json';

test('every locked string is on the home page', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  for (const s of fixture.strings) await expect(main, s).toContainText(s);
});

test('every subject is one click away', async ({ page }) => {
  await page.goto('/');
  for (const href of ['/work/della', '/work/vialgrade', '/work/transformer', '/work/lot', '/work/webuddy', '/work/npgktrades', '/work/say-no-to-plastic', '/work/grounds-guide', '/work/movemate', '#draw', '#row', '#about', 'https://github.com/pegg-dot', 'mailto:nate@natepegg.com', '/writing/after-abundance.pdf'])
    await expect(page.locator(`a[href="${href}"]`).first(), href).toBeAttached();
});

import { HOME_COPY } from '../src/app/sketchbook/copy';

test('HOME_COPY carries every locked string', () => {
  const all = JSON.stringify(HOME_COPY);
  for (const s of fixture.strings) expect(all, s).toContain(s);
});
