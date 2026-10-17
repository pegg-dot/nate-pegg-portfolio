import { test, expect, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import reference from '../docs/reference/vial-product-source.json';
import copy from '../src/app/work/vialgrade/story-copy.json';
import tokens from '../src/app/work/vialgrade/product-tokens.json';

async function open(page: Page) {
  await page.goto('/work/vialgrade');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-vial-edition="product-native"]')).toBeVisible();
}

test('the shipped brand artwork is the product source, not an AI-generated reconstruction', () => {
  expect(createHash('sha256').update(readFileSync('src/app/work/vialgrade/ProductArt.tsx')).digest('hex')).toBe(reference.ProductArtSha256);
  expect(createHash('sha256').update(readFileSync('public/vialgrade/product-icon.svg')).digest('hex')).toBe(reference.ProductIconSha256);
  expect(tokens.sourceCommit).toBe(reference.commit);
  const pageSource = readFileSync('src/app/work/vialgrade/page.tsx', 'utf8');
  expect(pageSource).not.toMatch(/imagegen|generated\/|ghostwriter|_authored/);
});

test('actual CSS matches the product blue, black, background, sans-serif typography and outlined panels', async ({ page }) => {
  await open(page);
  await expect(page.locator('main')).toHaveCSS('background-color', 'rgb(247, 247, 244)');
  await expect(page.locator('main')).toHaveCSS('color', 'rgb(17, 18, 20)');
  const title = page.getByRole('heading', { level: 1 });
  await expect(title).toHaveCSS('font-weight', '800');
  await expect(title.locator('span')).toHaveCSS('color', reference.liveComputed.emphasis);
  const font = await title.evaluate(el => getComputedStyle(el).fontFamily);
  expect(font).toContain('Inter'); expect(font).not.toContain('Georgia');
  const cards = page.getByRole('group', { name: 'Compare the vendor claim and lab record' }).locator('article');
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS('border-top-width', '2px');
    await expect(card).toHaveCSS('border-top-color', 'rgb(17, 18, 20)');
    await expect(card).toHaveCSS('border-radius', '22px');
  }
  await expect(cards.nth(1)).toHaveCSS('box-shadow', 'rgb(43, 49, 216) 5px 5px 0px 0px');
  const cta = page.getByRole('link', { name: 'Why I built it', exact: true });
  await expect(cta).toHaveCSS('border-radius', '999px');
  await expect(cta).toHaveCSS('background-color', 'rgb(43, 49, 216)');
});

test('the outline buttons press into their shadows without changing the layout or destination', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await open(page);
  const cta = page.getByRole('link', { name: 'Why I built it', exact: true });
  await cta.hover();
  await expect(cta).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 2, 2)');
  await expect(cta).toHaveCSS('box-shadow', 'rgb(17, 18, 20) 1px 1px 0px 0px');
  await expect(cta).toHaveAttribute('href', '#origin');
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`brand styling and heading spaces survive the ${width}px layout`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await open(page);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeInViewport();
    const bounds = await heading.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await expect(page.getByRole('heading', { level: 2, name: /Figuring out/ })).toHaveText('Figuring out the grades.');
    const controls = page.getByTestId('evidence-demo').locator('label');
    for (const control of await controls.all()) expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });
}

test('section links actually navigate and the sticky header does not cover the comparison controls', async ({ page }) => {
  await open(page);
  await page.getByRole('link', { name: 'See the comparison', exact: true }).click();
  await expect(page).toHaveURL(/#evidence$/);
  await expect.poll(async () => {
    const header = await page.locator('header').boundingBox();
    const controls = await page.getByTestId('evidence-demo').locator('fieldset').boundingBox();
    return controls!.y - (header!.y + header!.height);
  }).toBeGreaterThanOrEqual(0);
  await page.getByRole('link', { name: 'The build', exact: true }).click();
  await expect(page).toHaveURL(/#build$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Figuring out the grades.' })).toBeInViewport();
});

test('the blue result section uses historical user-provided results, not the product screenshot count', async ({ page }) => {
  await open(page);
  const band = page.getByRole('heading', { name: /signups/ }).locator('xpath=ancestor::section');
  await expect(band).toHaveCSS('background-color', 'rgb(43, 49, 216)');
  await expect(band).toContainText('An early one-month snapshot');
  await expect(band).toContainText('Earlier reported figures, not live analytics.');
  await expect(band).toContainText(copy.earlyUse);
  const visible = await page.locator('main').innerText();
  expect(visible).not.toContain('450');
  expect(visible).not.toContain('read by hand');
  expect(visible).not.toContain('first month');
});

test('the body uses the revised connected paragraphs rather than the old sentence fragments', async ({ page }) => {
  await open(page);
  for (const key of ['orientation', 'unknown', 'researchDirection', 'traceability', 'earlyUse'] as const) {
    await expect(page.getByText(copy[key], { exact: true })).toBeVisible();
    expect(copy[key].split(/\s+/).length).toBeGreaterThan(35);
  }
  const body = await page.locator('main').innerText();
  expect(body).not.toContain('The hardest part was');
  expect(body).not.toContain('What I took from it');
  expect(body).not.toContain('not making money');
});
