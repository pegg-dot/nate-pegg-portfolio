import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import copy from '../src/app/work/della/story-copy.json';
import original from './fixtures/della-original-copy.json';
import { callReducer, initialCall, isBooked, lastReply, type CallState } from '../src/app/work/della/demo-state';

async function openStory(page: Page) {
  await page.goto('/work/della');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-della-edition="authored"]')).toBeVisible();
}

// October 11: Nate explicitly requested an editorial rewrite, not another verbatim-copy lock.
// The original fixture remains untouched as provenance. These tests check the revised content,
// plus the same booking-truth/no-network boundaries that the old interface had to meet.
test('reader sees the purpose, complete booking and current limits without operating the demo', async ({ page }) => {
  await openStory(page);
  await expect(page.getByText(copy.intro, { exact: true })).toBeVisible();
  await expect(page.getByText("You're booked for 4:30.", { exact: true })).toBeVisible();
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-booked', 'true');
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-playing', 'false');
  await expect(page.getByText(copy.current, { exact: true })).toBeVisible();
  await expect(page.getByText(copy.direction, { exact: true })).toBeVisible();
  expect(original).toBeTruthy();
});

test('the revised first-person story stays readable, with technical detail optional', async ({ page }) => {
  await openStory(page);
  for (const [key, value] of Object.entries(copy)) {
    if (key === 'technical') continue;
    for (const text of Array.isArray(value) ? value : [value]) await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  const text = await page.locator('main').innerText();
  for (const phrase of ['Verified in this demo', 'Proposed action', 'Permission boundary', 'A result to confirm', 'The draft stops here', 'Replay the memory']) expect(text).not.toContain(phrase);
  expect(text.split(/\s+/).length).toBeLessThan(900);
  await page.getByText('What I built around the model', { exact: false }).click();
  await expect(page.getByText(copy.technical, { exact: true })).toBeVisible();
});

test('a booking can only be confirmed with its matching receipt; replay clears it', () => {
  expect(isBooked(initialCall)).toBe(true);
  let state = callReducer(initialCall, { type: 'replay', automatic: true });
  for (let phase = 0; phase < 4; phase++) {
    expect(state.phase).toBe(phase);
    expect(isBooked(state)).toBe(false);
    expect(state.receipt).toBeNull();
    state = callReducer(state, { type: 'advance' });
  }
  expect(isBooked(state)).toBe(true);
  expect(state.playing).toBe(false);
  expect(isBooked({ ...state, receipt: { service: 'Nail repair', time: '15:30' } })).toBe(false);
  expect(isBooked({ ...state, receipt: null })).toBe(false);
  expect(isBooked(callReducer(state, { type: 'previous' }))).toBe(false);
  for (const scenario of ['failure', 'success'] as const) {
    state = callReducer(state, { type: 'scenario', scenario });
    expect(isBooked(state)).toBe(scenario === 'success');
    expect(state.playing).toBe(false);
  }
});

test('a failed replay never acquires a success receipt or confirmation', () => {
  let state: CallState = callReducer(initialCall, { type: 'scenario', scenario: 'failure' });
  state = callReducer(state, { type: 'replay', automatic: true });
  for (let i = 0; i < 8; i++) {
    expect(isBooked(state)).toBe(false);
    expect(state.receipt).toBeNull();
    expect(lastReply(state)).not.toContain("You're booked");
    state = callReducer(state, { type: 'advance' });
  }
  expect(state.phase).toBe(4);
  expect(state.playing).toBe(false);
});

test('replay shows the conversation and calendar in order, not an early confirmation', async ({ page }) => {
  await openStory(page);
  await page.clock.install();
  const demo = page.getByTestId('booking-demo');
  await page.getByRole('button', { name: 'Replay the example' }).click();
  await expect(demo).toHaveAttribute('data-phase', '0');
  await expect(demo).toHaveAttribute('data-booked', 'false');
  await page.clock.runFor(1650);
  await expect(demo).toHaveAttribute('data-phase', '1');
  await expect(demo).toHaveAttribute('data-booked', 'false');
  await page.clock.runFor(2500);
  await expect(demo).toHaveAttribute('data-phase', '2');
  await page.clock.runFor(1000);
  await expect(demo).toHaveAttribute('data-phase', '3');
  await expect(page.getByText('Just booking that for you.', { exact: true })).toBeVisible();
  await expect(demo).toHaveAttribute('data-booked', 'false');
  await page.clock.runFor(1700);
  await expect(demo).toHaveAttribute('data-booked', 'true');
  await expect(page.getByText("You're booked for 4:30.", { exact: true })).toBeVisible();
});

test('the replay pauses, resumes and can be ended without waiting', async ({ page }) => {
  await openStory(page);
  await page.clock.install();
  await page.getByRole('button', { name: 'Replay the example' }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.clock.runFor(8000);
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-phase', '0');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.clock.runFor(1700);
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-phase', '1');
  await page.getByRole('button', { name: 'Show the result' }).click();
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-phase', '4');
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-playing', 'false');
});

test('switching to failure clears a successful booking and explains it without technical language', async ({ page }) => {
  await openStory(page);
  await page.getByRole('button', { name: "What if it doesn't book?" }).click();
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-scenario', 'failure');
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-booked', 'false');
  await expect(page.getByText("That booking didn't go through. Let me get someone to help.", { exact: true })).toBeVisible();
  await expect(page.getByText("You're booked for 4:30.", { exact: true })).toHaveCount(0);
  await expect(page.getByTestId('appointment')).toContainText('Not booked');
  await page.getByRole('button', { name: 'Show the successful booking' }).click();
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-booked', 'true');
});

test('memory is the personal test-call story, not fake dialogue or a button-controlled memory', async ({ page }) => {
  await openStory(page);
  const memory = page.locator('#memory');
  await expect(memory.getByText(copy.memoryFirst, { exact: true })).toBeVisible();
  await expect(memory.getByText(copy.memorySecond, { exact: true })).toBeVisible();
  await expect(memory.getByText(copy.memoryReflection, { exact: true })).toBeVisible();
  await expect(memory).toContainText('My own test calls, described from memory.');
  await expect(memory.getByRole('button')).toHaveCount(0);
  await expect(memory.locator('blockquote')).toHaveCount(0);
});

test('the owner sees the draft immediately, can edit it, and approval never says sent', async ({ page }) => {
  await openStory(page);
  const approval = page.getByTestId('approval-demo');
  await expect(approval.getByTestId('draft-text')).toBeVisible();
  await approval.getByRole('button', { name: 'Edit message' }).click();
  const editor = approval.getByRole('textbox', { name: 'Edit the follow-up message' });
  await expect(editor).toBeFocused();
  await editor.fill('Would you like to come back next week?');
  await approval.getByRole('button', { name: 'Done editing' }).click();
  await expect(approval.getByTestId('draft-text')).toHaveText('Would you like to come back next week?');
  await approval.getByRole('button', { name: 'Approve', exact: true }).click();
  await expect(approval).toHaveAttribute('data-decision', 'approved');
  await expect(approval).toContainText('Nothing was sent from this example.');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await approval.getByRole('button', { name: 'Edit message' }).click();
  await expect(approval).toHaveAttribute('data-decision', 'waiting');
});

test('an empty draft cannot be approved; not now leaves it waiting', async ({ page }) => {
  await openStory(page);
  const approval = page.getByTestId('approval-demo');
  await approval.getByRole('button', { name: 'Edit message' }).click();
  await approval.getByRole('textbox').fill('   ');
  await expect(approval.getByRole('button', { name: 'Approve', exact: true })).toBeDisabled();
  await expect(approval).toContainText('Write a message before approving it.');
  await approval.getByRole('textbox').fill('Would you like to book another appointment?');
  await approval.getByRole('button', { name: 'Not now' }).click();
  await expect(approval).toHaveAttribute('data-decision', 'later');
  await expect(approval).toContainText('The draft is still waiting. Nothing was sent.');
});

test('all illustrative interactions stay local, without mutating requests or live product APIs', async ({ page }) => {
  await openStory(page);
  const bad: string[] = [];
  page.on('request', r => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(r.method()) || /hellodella|squareup|retell|telnyx|\/api\//i.test(r.url())) bad.push(`${r.method()} ${r.url()}`);
  });
  await page.getByRole('button', { name: "What if it doesn't book?" }).click();
  await page.getByRole('button', { name: 'Replay the example' }).click();
  await page.getByRole('button', { name: 'Show the result' }).click();
  await page.getByTestId('approval-demo').getByRole('button', { name: 'Edit message' }).click();
  await page.getByRole('textbox').fill('A local preview only.');
  await page.getByRole('button', { name: 'Approve', exact: true }).click();
  await page.waitForTimeout(250);
  expect(bad).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`story, failed booking and edited draft fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openStory(page);
    await page.getByRole('button', { name: "What if it doesn't book?" }).click();
    await page.getByRole('button', { name: 'Edit message' }).click();
    await page.getByRole('textbox').fill('This is a longer follow-up that should stay inside the draft panel on a small phone.');
    await page.getByText('What I built around the model', { exact: false }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    for (const el of await page.locator('main button:visible, main textarea:visible').all()) {
      const r = await el.boundingBox();
      expect(r!.x).toBeGreaterThanOrEqual(-1);
      expect(r!.x + r!.width).toBeLessThanOrEqual(width + 1);
      expect(r!.height).toBeGreaterThanOrEqual(43);
    }
  });
}

test('keyboard navigation follows the reading order and can edit and approve the local draft', async ({ page, browserName }) => {
  await openStory(page);
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const edit = page.getByRole('button', { name: 'Edit message' });
  await edit.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox')).toBeFocused();
  await page.keyboard.type(' More context.');
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('button', { name: 'Done editing' })).toBeFocused();
  await page.keyboard.press('Enter');
});

test('reduced motion uses manual steps, and the completed explanation is always available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openStory(page);
  await page.clock.install();
  await page.getByRole('button', { name: 'Replay the example' }).click();
  await page.clock.runFor(10000);
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-phase', '0');
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-playing', 'false');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-phase', '1');
  await page.getByRole('button', { name: 'Show the result' }).click();
  await expect(page.getByText("You're booked for 4:30.", { exact: true })).toBeVisible();
});

test('without JavaScript the full story, call and approval boundary still make sense', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/work/della`);
  await expect(page.getByText(copy.intro, { exact: true })).toBeVisible();
  await expect(page.getByText("You're booked for 4:30.", { exact: true })).toBeVisible();
  await expect(page.getByText(copy.memorySecond, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Approve', exact: true })).not.toBeVisible();
  await page.getByText('What I built around the model', { exact: false }).click();
  await expect(page.getByText(copy.technical, { exact: true })).toBeVisible();
  await context.close();
});

test('the real workspace leads the page and the full redacted source remains available', async ({ page }) => {
  await openStory(page);
  const image = page.getByRole('img', { name: /Detail of Della/ });
  await expect(image).toBeInViewport();
  await image.evaluate((el: HTMLImageElement) => el.decode());
  expect(await image.evaluate((el: HTMLImageElement) => el.naturalWidth / el.naturalHeight)).toBeCloseTo(1160 / 720, 2);
  const viewer = page.getByTestId('della-artifact');
  await viewer.getByRole('button', { name: 'Full workspace', exact: true }).click();
  await expect(viewer.getByRole('img')).toHaveAttribute('src', /workspace-context/);
  await expect(viewer.getByRole('link', { name: /Full size/ })).toHaveAttribute('href', '/della/workspace-context.webp');
  await expect(viewer).toContainText('This is an image, not the live application.');
});

test('accessibility checks cover both outcomes and all owner decisions, not just the opening', async ({ page }) => {
  await openStory(page);
  async function check() {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  }
  await check();
  await page.getByRole('button', { name: "What if it doesn't book?" }).click();
  await page.getByRole('button', { name: 'Edit message' }).click();
  await check();
  await page.getByRole('button', { name: 'Approve', exact: true }).click();
  await page.getByRole('img', { name: /Detail of Della/ }).scrollIntoViewIfNeeded();
  await check();
});

test('fast scrolling cannot hide the story and there are no browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openStory(page);
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-phase', '4');
  expect(errors).toEqual([]);
});


test('changing to reduced motion mid-replay pauses it and never silently resumes', async ({ page }) => {
  await openStory(page);
  await page.clock.install();
  await page.getByRole('button', { name: 'Replay the example' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-playing', 'false');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(10000);
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-phase', '0');
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-playing', 'false');
});

test('leaving the example pauses playback without hiding other writing', async ({ page }) => {
  await openStory(page);
  await page.getByRole('button', { name: 'Replay the example' }).click();
  await page.locator('#now').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('booking-demo')).toHaveAttribute('data-playing', 'false');
  await expect(page.getByText(copy.direction, { exact: true })).toBeVisible();
});
