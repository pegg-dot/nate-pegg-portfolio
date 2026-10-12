import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

async function openStory(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/transformer');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByTestId('prediction-preview')).toHaveAttribute('data-reduced', 'true');
  await page.locator('body').click({ position: { x: 2, y: 2 } });
}

test('the opening and residual example explain the project before any interaction', async ({ page }, info) => {
  await openStory(page);
  await expect(page).toHaveScreenshot('reading-opening.png', { animations: 'disabled' });
  await expect(page.getByTestId('residual-example')).toHaveScreenshot('reading-residual.png', { animations: 'disabled' });
  await page.getByRole('radio', { name: 'Preview after ROMEO:', exact: true }).check();
  await expect(page.getByTestId('prediction-preview')).toHaveScreenshot('reading-newline.png', { animations: 'disabled' });
  const image = page.getByRole('img', { name: /teaching illustration/ });
  await image.scrollIntoViewIfNeeded();
  await image.evaluate((el: HTMLImageElement) => el.decode());
  mkdirSync('qa/model-reading', { recursive: true });
  await page.locator('body').click({ position: { x: 2, y: 2 } });
  await page.screenshot({ path: `qa/model-reading/whole-${info.project.name}.png`, fullPage: true, animations: 'disabled' });
});

test('phone reading does not shrink the desktop diagram into unreadable numbers', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openStory(page);
  await expect(page).toHaveScreenshot('reading-phone-opening.png', { animations: 'disabled' });
  await expect(page.getByTestId('prediction-preview')).toHaveScreenshot('reading-phone-prediction.png', { animations: 'disabled' });
  await expect(page.getByTestId('residual-example')).toHaveScreenshot('reading-phone-residual.png', { animations: 'disabled' });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.getByRole('radio', { name: 'Preview after ROMEO:', exact: true }).check();
  mkdirSync('qa/model-reading', { recursive: true });
  await page.getByTestId('prediction-preview').screenshot({ path: `qa/model-reading/narrow-${info.project.name}.png`, animations: 'disabled' });
});

test('the advanced explorer is a deliberate optional expansion with usable controls', async ({ page }) => {
  await openStory(page);
  await expect(page.getByTestId('model-explorer-disclosure')).toHaveScreenshot('reading-closed-explorer.png', { animations: 'disabled' });
  await page.getByTestId('model-explorer-disclosure').locator(':scope > summary').click();
  const lab = page.getByTestId('transformer-lab');
  await lab.getByRole('group', { name: 'Follow the computation' }).getByRole('button', { name: /Attention/ }).click();
  await expect(lab).toHaveScreenshot('reading-open-attention.png', { animations: 'disabled' });
});
