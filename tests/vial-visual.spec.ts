import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

async function openStory(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/vialgrade');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByTestId('evidence-demo')).toHaveAttribute('data-reduced', 'true');
  await page.locator('body').click({ position: { x: 2, y: 2 } });
}

// New baselines correspond to the requested editorial redesign. The original
// case-study fixture and the unchanged numerical projection stay in the repository.
test('authored opening and all document outcomes', async ({ page }, info) => {
  await openStory(page);
  await expect(page).toHaveScreenshot('authored-opening.png', { animations: 'disabled' });
  for (const [label, name] of [['Details match', 'match'], ['No record', 'missing'], ['Different maker', 'conflict']]) {
    await page.getByRole('radio', { name: label, exact: true }).check();
    await expect(page.getByTestId('evidence-demo')).toHaveScreenshot(`authored-${name}.png`, { animations: 'disabled' });
  }
  mkdirSync('qa/vial-reader', { recursive: true });
  await page.screenshot({ path: `qa/vial-reader/desktop-${info.project.name}.png`, fullPage: true, animations: 'disabled' });
});

test('all grades can be read together and actual product imagery is preserved', async ({ page }) => {
  await openStory(page);
  await page.getByTestId('grade-details').locator(':scope > summary').click();
  await expect(page.getByTestId('grade-demo')).toHaveScreenshot('authored-grades.png', { animations: 'disabled' });
  await expect(page.getByTestId('handoff-demo')).toHaveScreenshot('authored-handoff.png', { animations: 'disabled' });
  const image = page.getByRole('img', { name: /Earlier VialGrade homepage/ });
  await image.scrollIntoViewIfNeeded();
  await image.evaluate((el: HTMLImageElement) => el.decode());
  await expect(image.locator('xpath=ancestor::figure')).toHaveScreenshot('authored-product.png', { animations: 'disabled' });
});

test('phone comparisons keep matching values beside one another', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openStory(page);
  await expect(page).toHaveScreenshot('authored-phone.png', { animations: 'disabled' });
  await page.getByRole('radio', { name: 'Different maker', exact: true }).check();
  await expect(page.getByTestId('evidence-demo')).toHaveScreenshot('authored-phone-conflict.png', { animations: 'disabled' });
  await page.getByTestId('grade-details').locator(':scope > summary').click();
  await expect(page.getByTestId('grade-demo')).toHaveScreenshot('authored-phone-grades.png', { animations: 'disabled' });
  await page.setViewportSize({ width: 320, height: 844 });
  mkdirSync('qa/vial-reader', { recursive: true });
  await page.getByTestId('evidence-demo').screenshot({ path: `qa/vial-reader/narrow-${info.project.name}.png`, animations: 'disabled' });
});
