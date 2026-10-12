import { test, expect, type Page } from '@playwright/test';

async function prepare(page: Page) {
  await page.goto('/work/della');
  await page.evaluate(() => document.fonts.ready);
  await page.getByTestId('della-artifact').getByRole('img').evaluate((el: HTMLImageElement) => el.decode());
  await page.locator('body').click({ position: { x: 2, y: 2 } });
}

test('authored desktop opening, failed call and owner review', async ({ page }) => {
  await prepare(page);
  await expect(page).toHaveScreenshot('authored-opening.png', { animations: 'disabled' });
  await page.getByRole('button', { name: "What if it doesn't book?" }).click();
  await expect(page.getByTestId('booking-demo')).toHaveScreenshot('authored-failure.png', { animations: 'disabled' });
  await expect(page.locator('#memory')).toHaveScreenshot('authored-memory.png', { animations: 'disabled' });
  await expect(page.getByTestId('approval-demo')).toHaveScreenshot('authored-owner.png', { animations: 'disabled' });
});

test('phone opening and meaningful full booking, not a scaled-down desktop widget', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await expect(page).toHaveScreenshot('authored-phone.png', { animations: 'disabled' });
  await expect(page.getByTestId('booking-demo')).toHaveScreenshot('authored-phone-call.png', { animations: 'disabled' });
  await expect(page.getByTestId('approval-demo')).toHaveScreenshot('authored-phone-owner.png', { animations: 'disabled' });
});
