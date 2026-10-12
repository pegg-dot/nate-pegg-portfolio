import { openTransformerLab } from './helpers/open-transformer';
import copy from '../src/app/work/transformer/story-copy.json';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import original from './fixtures/transformer-original-copy.json';
import { capture, probabilities, rankedPrediction, residualValues, sampleIndex, stages } from '../src/app/work/transformer/capture-model';

async function open(page: Page) { await openTransformerLab(page); }
async function stage(page: Page, name: string) { await page.getByRole('group', { name: 'Follow the computation' }).getByRole('button', { name: new RegExp(name) }).click(); await expect(page.getByTestId('transformer-lab')).toHaveAttribute('data-stage', name); }

test('source is pinned; attention is causal and each complete row sums to one', () => {
  expect(capture.source.sha256).toBe('bf4f514ce66651b4cf9a977167205fa41f043e1f9a9c3fc12f8be6dfb56bb301');
  expect(capture.characters.join('')).toBe('ROMEO:'); expect(capture.tokens).toEqual([30,27,25,17,27,10]);
  for (const block of capture.blocks) for (const head of block.weights) for (let q=0;q<capture.length;q++) { expect(head[q].reduce((a,b)=>a+b,0)).toBeCloseTo(1,5); for(let k=q+1;k<capture.length;k++)expect(head[q][k]).toBe(0); }
});
test('embedding and residual additions use real stored values through all six blocks', () => {
  for(let p=0;p<capture.length;p++) { for(let d=0;d<8;d++)expect(capture.tokenEmbedding[p][d]+capture.positionEmbedding[p][d]).toBeCloseTo(capture.embeddingSum[p][d],5); for(let b=0;b<6;b++)for(const branch of ['attention','feedforward'] as const){const v=residualValues(p,b,branch);for(let d=0;d<8;d++)expect(v.input[d]+v.update[d]).toBeCloseTo(v.output[d],4);} }
});
test('softmax is stable and sampling uses all characters, not a renormalized top five', () => {
  for(let p=0;p<6;p++)for(const temperature of [.6,1,1.5,2]){const r=rankedPrediction(p,temperature);expect(r.distribution.length).toBe(65);expect(r.distribution.reduce((a,b)=>a+b,0)).toBeCloseTo(1,12);expect(r.top.reduce((a,b)=>a+b.probability,0)+r.remainder).toBeCloseTo(1,12);expect(r.distribution.every(n=>n>=0&&Number.isFinite(n))).toBe(true);}
  expect(probabilities([10000,10000])).toEqual([.5,.5]); expect(()=>probabilities([1],0)).toThrow(); expect(sampleIndex([.2,.3,.5],.1)).toBe(0);expect(sampleIndex([.2,.3,.5],.4)).toBe(1);expect(sampleIndex([.2,.3,.5],.9)).toBe(2);
});
test('the requested rewrite is present and the original prose archive remains identifiable', async ({ page }) => {
  await page.goto('/work/transformer');
  for (const value of Object.values(copy)) for (const text of Array.isArray(value) ? value : [value]) await expect(page.getByText(text, { exact: true })).toBeVisible();
  expect(original.prose).toHaveLength(12);
  expect(original.brief).toHaveLength(4);
  await page.getByText('Model details and sources', { exact: false }).click();
  await expect(page.locator('main')).toContainText('10.79M-parameter');
});
test('a character travels across five views and reset restores the initial state', async ({ page }) => {
  await open(page);await page.getByRole('radio',{name:'M at position 3',exact:true}).check();for(const name of stages){await stage(page,name);await expect(page.getByTestId('transformer-lab')).toHaveAttribute('data-position','2');}
  await page.getByRole('button',{name:'Sample one character'}).click();await expect(page.getByTestId('sample-result').locator('strong')).toBeVisible();await page.getByRole('button',{name:'Start again'}).click();await expect(page.getByTestId('transformer-lab')).toHaveAttribute('data-stage','Characters');await expect(page.getByTestId('transformer-lab')).toHaveAttribute('data-position','5');
});
test('causal masking changes with the selected position and head/block controls are meaningful', async ({ page }) => {
  await open(page);await stage(page,'Attention');await page.getByRole('radio',{name:'R at position 1',exact:true}).check();await expect(page.locator('td[data-masked=true]')).toHaveCount(15);await expect(page.getByTestId('transformer-lab')).toContainText('100.00%');await page.getByLabel('Attention head',{exact:true}).selectOption('5');await page.getByLabel('Transformer block',{exact:true}).selectOption('5');await page.getByRole('radio',{name:'O at position 5',exact:true}).check();await expect(page.getByTestId('transformer-lab')).toContainText('One head in block 6');
});
test('both residual branches and actual values can be inspected', async ({ page }) => {await open(page);await stage(page,'Residual');await page.getByLabel('Residual branch',{exact:true}).selectOption('feedforward');await page.getByLabel('Transformer block',{exact:true}).selectOption('3');await expect(page.getByTestId('residual-values').locator('td[data-value]')).toHaveCount(24);});
test('changing temperature recalculates the distribution and clears the sample', async ({ page }) => {await open(page);await stage(page,'Prediction');await page.getByRole('button',{name:'Sample one character'}).click();await page.getByLabel('Sampling temperature',{exact:true}).selectOption('2');await expect(page.getByTestId('sample-result')).toHaveText('?');const values=await page.locator('[data-probability]').evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('data-probability'))));expect(values.reduce((a,b)=>a+b,0)).toBeCloseTo(1,10);await page.getByRole('radio',{name:'O at position 2',exact:true}).check();await expect(page.getByTestId('transformer-lab')).toContainText('Next character after RO');});
test('no model download, third-party model request, or mutation occurs during interaction', async ({ page }) => {const bad:string[]=[];page.on('request',r=>{const u=new URL(r.url());if(!['GET','HEAD'].includes(r.method())||/\.onnx|activations\.json/.test(u.pathname)||(!['127.0.0.1','localhost','nate-pegg-portfolio.vercel.app'].includes(u.hostname)))bad.push(r.url());});await open(page);for(const name of stages)await stage(page,name);await page.getByRole('button',{name:'Sample one character'}).click();expect(bad).toEqual([]);});
for(const width of [320,390,768,1024,1440])test(`all stages fit at ${width}px without page overflow`,async({page},info)=>{await page.setViewportSize({width,height:900});await open(page);for(const name of stages){await stage(page,name);const sizes=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));expect(sizes.document).toBeLessThanOrEqual(sizes.viewport+1);await expect(page.getByRole('group',{name:'Follow the computation'})).toBeVisible();}mkdirSync('qa',{recursive:true});await page.getByTestId('transformer-lab').screenshot({path:`qa/lab-${width}-${info.project.name}.png`,animations:'disabled'});});
test('reduced-motion can change live and the source explanation stays readable',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await open(page);await expect(page.getByTestId('transformer-lab')).toHaveAttribute('data-reduced','true');await expect(page.getByTestId('transformer-lab').locator('details')).toHaveAttribute('open','');await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.getByTestId('transformer-lab')).toHaveAttribute('data-reduced','false');});
test('keyboard control and no-JavaScript reading both work', async ({ page, browser, baseURL }) => {
  await open(page);
  await page.getByRole('radio', { name: 'R at position 1', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'O at position 2', exact: true })).toBeChecked();
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  try {
    const p = await ctx.newPage();
    await p.goto(baseURL + '/work/transformer');
    await expect(p.getByTestId('prediction-preview')).toContainText('51.1%');
    await expect(p.getByTestId('transformer-lab')).not.toBeVisible();
    for (const value of Object.values(copy)) for (const text of Array.isArray(value) ? value : [value]) await expect(p.getByText(text, { exact: true })).toBeVisible();
    await p.getByText('Model details and sources', { exact: false }).click();
    await expect(p.locator('main')).toContainText('256-character context window');
  } finally { await ctx.close(); }
});
test('accessibility is checked in every computation view',async({page})=>{await open(page);for(const name of stages){await stage(page,name);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))).toEqual([]);}});
test('rendered scenes and preserved project links are captured for visual review',async({page},info)=>{const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});await openTransformerLab(page);await page.evaluate(()=>document.fonts.ready);mkdirSync('qa',{recursive:true});await page.screenshot({path:`qa/opening-${info.project.name}.png`});for(const name of stages){await stage(page,name);await page.getByTestId('transformer-lab').screenshot({path:`qa/${name.toLowerCase()}-${info.project.name}.png`,animations:'disabled'});}await page.screenshot({path:`qa/full-${info.project.name}.png`,fullPage:true,animations:'disabled'});await expect(page.getByRole('link',{name:/Full visualizer/})).toHaveAttribute('href','https://transformer-viz-eight.vercel.app');expect(errors).toEqual([]);});
