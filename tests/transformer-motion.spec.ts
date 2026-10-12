import { openTransformerLab } from './helpers/open-transformer';
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

test('the attention bars visibly interpolate to the selected captured row', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openTransformerLab(page);
  await page.getByRole('group', { name: 'Follow the computation' }).getByRole('button', { name: /Attention/ }).click();
  const fill = page.locator('[class*="attentionReadout"] [class*="weightFill"]').first();
  const before = await fill.evaluate(el => el.getBoundingClientRect().width);
  await page.getByRole('radio', { name: 'R at position 1', exact: true }).check();
  const samples: number[] = [];
  for (let i = 0; i < 8; i++) { samples.push(await fill.evaluate(el => el.getBoundingClientRect().width)); await page.waitForTimeout(55); }
  const target = await fill.evaluate(el => el.parentElement!.getBoundingClientRect().width);
  expect(samples[samples.length - 1]).toBeCloseTo(target, 0);
  expect(samples.some(value => value > before + 1 && value < target - 1)).toBe(true);
  mkdirSync('qa', { recursive: true });
  writeFileSync(`qa/motion-${info.project.name}.json`, JSON.stringify({ before, samples, target }, null, 2));
});

test('dark native controls remain legible and retain keyboard operation', async ({ page }) => {
  await openTransformerLab(page);
  await page.getByRole('group', { name: 'Follow the computation' }).getByRole('button', { name: /Attention/ }).click();
  const head = page.getByLabel('Attention head', { exact: true });
  await expect(head).toHaveCSS('appearance', 'none');
  await expect(head).toHaveCSS('background-color', 'rgb(33, 56, 41)');
  await head.focus();
  await expect(head).toBeFocused();
  // macOS native menus use type-ahead here; an uncommitted ArrowDown is not a value change.
  await page.keyboard.press(process.platform === 'darwin' ? '2' : 'ArrowDown');
  await expect(head).toHaveValue('1');
});

test('phone residual arithmetic stays legible instead of shrinking the desktop diagram', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openTransformerLab(page);
  await page.getByRole('group', { name: 'Follow the computation' }).getByRole('button', { name: /Residual/ }).click();
  await expect(page.locator('[class*="mobileResidual"]')).toBeVisible();
  await expect(page.locator('[class*="mobileResidual"]')).toContainText('Original stream');
  const region = page.getByRole('region', { name: 'Eight captured vector coordinates' });
  await region.focus();
  await region.evaluate(el => { el.scrollLeft = 250; });
  expect(await region.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  mkdirSync('qa', { recursive: true });
  await page.getByTestId('transformer-lab').screenshot({ path: `qa/phone-residual-${info.project.name}.png`, animations: 'disabled' });
});
