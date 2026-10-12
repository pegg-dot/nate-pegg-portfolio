import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import copy from '../src/app/work/della/story-copy.json';
import { callReducer, initialCall, isBooked, lastReply, type CallState } from '../src/app/work/della/demo-state';

async function openStory(page: Page) {
  await page.goto('/work/della');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-della-edition="original-screens"]')).toBeVisible();
}

// The user explicitly replaced the simulated interactions with real screenshot evidence.
// The original receipt/state unit tests are retained, but the removed UI isn't a release condition.
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

const imageFiles = [
  { testId: 'call-record', file: 'call-record-01c73930dd.webp', hash: '01c73930dd5db08ee722ed9f9ff5bc97174fdd0ca5965a1c9fdb0e37a63d3cb6', width: 414, height: 563 },
  { testId: 'inbox-record', file: 'inbox-draft-e202a3554e.webp', hash: 'e202a3554e82245d45e4c5c89f42d97db9affd71212d5e8182d5cabe1e72754f', width: 568, height: 429 },
];

test('the origin follows the supplied dictation, including the actual business systems and lost leads', async ({ page }) => {
  await openStory(page);
  await expect(page.getByText(copy.why[0], { exact: true })).toBeVisible();
  expect(copy.why[0].startsWith('I started working on Della in March of 2026 as OpenOperator.')).toBe(true);
  expect(copy.why[0]).toContain('studying the foundations of AI');
  expect(copy.why[0]).toContain('eventually, if not already');
  expect(copy.why[0]).toContain("What they wouldn't know out of the box");
  expect(copy.why[1]).toContain('communications were a place to start because leads often get lost there');
  await expect(page.getByText(copy.why[1], { exact: true })).toBeVisible();
});

test('the edited prose stays connected and does not turn tests into client-traction claims', async ({ page }) => {
  await openStory(page);
  for (const [key,value] of Object.entries(copy)) {
    if (key === 'technical') continue;
    for (const text of Array.isArray(value) ? value : [value]) await expect(page.locator('main')).toContainText(text);
  }
  const text = await page.locator('main').innerText();
  expect(text).not.toContain("I've had real clients");
  expect(text).not.toContain('tightening the parts');
  expect(text).not.toContain("That was cool because it wasn't starting over from zero.");
  expect(text).toContain("I don't want Della to just be a receptionist, so");
  expect(text).not.toContain('Bella');
});

test('the call and inbox examples are genuine crops, not generated substitutes', () => {
  for (const item of imageFiles) {
    const bytes = readFileSync(`public/della/originals/${item.file}`);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(item.hash);
  }
  const source = readFileSync('src/app/work/della/page.tsx','utf8');
  expect(source).not.toMatch(/BookingDemo|ApprovalDemo|imagegen|ghostwriter|ai_receptionist_call_center/);
  expect(source).not.toContain('ArtifactViewer');
});

for (const item of imageFiles) {
  test(`${item.testId}: the actual image is served intact and opens at its original crop size`, async ({ page, request }) => {
    await openStory(page);
    const figure = page.getByTestId(item.testId);
    const image = figure.getByRole('img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    expect(await image.evaluate((el: HTMLImageElement) => [el.naturalWidth,el.naturalHeight])).toEqual([item.width,item.height]);
    await expect(figure.getByRole('link',{name:/Open image/})).toHaveAttribute('href',`/della/originals/${item.file}`);
    const response = await request.get(`/della/originals/${item.file}`);
    expect(response.status()).toBe(200);
    expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(item.hash);
  });
}

test('the contradictory call labels are explained without claiming the failed booking succeeded', async ({ page }) => {
  await openStory(page);
  await expect(page.getByTestId('call-record')).toContainText("wasn't written to the booking system");
  await expect(page.getByTestId('call-record')).toContainText("despite the step being labeled 'Booked'");
  await expect(page.getByText('The screen alongside this is a crop of a real test call. The appointment was not created; the record still has inconsistencies that need work.')).toBeVisible();
});

test('the actual inbox screenshot is not presented as an automated send', async ({ page }) => {
  await openStory(page);
  await expect(page.getByTestId('inbox-record')).toContainText('Copy and send it yourself.');
  await expect(page.getByTestId('inbox-record')).toContainText("doesn't show an automatically sent message");
  await expect(page.getByTestId('inbox-record')).toContainText('A name is redacted.');
});

test('the memory anecdote is prose and a recollection, not reconstructed dialogue', async ({ page }) => {
  await openStory(page);
  const memory=page.locator('#memory');
  for (const p of copy.memory) await expect(memory).toContainText(p);
  await expect(memory.getByText(copy.memory.join(' '), {exact:true})).toBeVisible();
  await expect(memory).toContainText('separate test calls');
  await expect(memory.locator('blockquote,button')).toHaveCount(0);
  await expect(page.getByTestId('booking-demo')).toHaveCount(0);
  await expect(page.getByTestId('approval-demo')).toHaveCount(0);
});

for (const width of [320,390,768,1024,1440]) {
  test(`the real screenshot crops and prose fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width,height:950});
    await openStory(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
    for (const image of await page.locator('main img').all()) {
      const r=await image.boundingBox();
      expect(r!.x).toBeGreaterThanOrEqual(0);
      expect(r!.x+r!.width).toBeLessThanOrEqual(width+1);
    }
    await page.locator('main summary').click();
    await expect(page.getByText(copy.technical,{exact:true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
  });
}

test('keyboard navigation reaches the prose, original image links and technical note', async ({ page,browserName }) => {
  await openStory(page);
  await page.keyboard.press(browserName==='webkit'&&process.platform==='darwin'?'Alt+Tab':'Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const summary=page.locator('main summary');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(page.getByText(copy.technical,{exact:true})).toBeVisible();
  const link=page.getByTestId('inbox-record').getByRole('link',{name:/Open image/});
  await link.focus(); await expect(link).toBeFocused();
});

test('the entire story and real screenshots remain available without JavaScript', async ({ browser,baseURL }) => {
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try {
    const page=await ctx.newPage();await page.goto(`${baseURL}/work/della`);
    await expect(page.getByText(copy.why[0],{exact:true})).toBeVisible();
    for (const item of imageFiles) { const img=page.getByTestId(item.testId).getByRole('img');await img.scrollIntoViewIfNeeded();await expect(img).toBeVisible(); }
    await page.locator('main summary').click();
    await expect(page.getByText(copy.technical,{exact:true})).toBeVisible();
  } finally { await ctx.close(); }
});

test('reduced motion and fast scrolling never hide the explanation', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});await openStory(page);
  await page.evaluate(() => window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));
  await expect(page.locator('#now')).toContainText(copy.direction);
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  await expect(page.getByRole('heading',{level:1})).toBeInViewport();
});

test('reading the evidence never creates messages, bookings or product requests', async ({ page }) => {
  const bad:string[]=[];
  page.on('request',r=>{if(!['GET','HEAD','OPTIONS'].includes(r.method())||/hellodella|squareup|retell|\/api\//.test(r.url()))bad.push(r.url());});
  await openStory(page);await page.locator('main summary').click();
  for(const item of imageFiles)await page.getByTestId(item.testId).scrollIntoViewIfNeeded();
  await expect(page.locator('main button,main input,main textarea')).toHaveCount(0);
  expect(bad).toEqual([]);
});

test('the initial and expanded page pass accessibility checks without browser errors', async ({ page }) => {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await openStory(page);
  for(let i=0;i<2;i++){
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)}))).toEqual([]);
    await page.locator('main summary').click();
  }
  expect(errors).toEqual([]);
});
