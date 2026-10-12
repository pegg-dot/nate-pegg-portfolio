import { expect, type Page } from '@playwright/test';

/** The detailed explorer is intentionally optional on the reader-first page. */
export async function openTransformerLab(page: Page) {
  await page.goto('/work/transformer');
  await page.getByTestId('model-explorer-disclosure').locator(':scope > summary').click();
  await expect(page.getByTestId('transformer-lab')).toBeVisible();
}
