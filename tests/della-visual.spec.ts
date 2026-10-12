import { test, expect, type Page } from '@playwright/test';

async function prepare(page: Page) {
  await page.goto('/work/della');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('body').click({ position: { x: 2, y: 2 } });
}

test('reader-first desktop opening, failed call and owner review', async ({ page }) => {
  await prepare(page);
  await expect(page).toHaveScreenshot('reader-first-opening.png', { animations: 'disabled' });
  await page.getByRole('button', { name: "What if it doesn't book?" }).click();
  await expect(page.getByTestId('booking-demo')).toHaveScreenshot('reader-first-failure.png', { animations: 'disabled' });
  await expect(page.locator('#memory')).toHaveScreenshot('reader-first-memory.png', { animations: 'disabled' });
  await expect(page.getByTestId('approval-demo')).toHaveScreenshot('reader-first-owner.png', { animations: 'disabled' });
});

test('phone opening and meaningful full booking, not a scaled-down desktop widget', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await expect(page).toHaveScreenshot('reader-first-phone.png', { animations: 'disabled' });
  await expect(page.getByTestId('booking-demo')).toHaveScreenshot('reader-first-phone-call.png', { animations: 'disabled' });
  await expect(page.getByTestId('approval-demo')).toHaveScreenshot('reader-first-phone-owner.png', { animations: 'disabled' });
});
