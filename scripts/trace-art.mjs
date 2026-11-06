// Traces the six home drawings into outline paths for the drawings page.
// usage: npm run trace:art   → public/art/traced/<name>.json  { w, h, paths }
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const potrace = require('potrace');
const Jimp = require('jimp');

const NAMES = ['bob-marley', 'dog-scarf', 'house', 'moose', 'coke-can', 'miami'];
const WIDTH = 720, MAX_PATHS = 80, BUDGET = 46_000; // bytes of path data per drawing

const trace = (img, opts) => new Promise((res, rej) => potrace.trace(img, opts, (err, svg) => (err ? rej(err) : res(svg))));
const round = d => d.replace(/-?\d+\.\d+/g, m => String(Math.round(Number(m))));

for (const name of NAMES) {
  // Step the resolution down until the longest contour fits the budget, so the main outline is never dropped.
  let picked = null;
  for (const width of [WIDTH, 560, 440, 360, 300]) {
    const img = await Jimp.read(`public/art/${name}.jpg`);
    img.resize(width, Jimp.AUTO).grayscale();
    const w = img.bitmap.width, h = img.bitmap.height;
    const svg = await trace(img, { threshold: -1, turdSize: 60, optTolerance: 0.9, color: '#000', background: 'transparent' });
    const d = (svg.match(/ d="([^"]+)"/) || [])[1] || '';
    const sorted = d.split(/(?=M)/).map(x => x.trim()).filter(Boolean).map(round).sort((a, b) => b.length - a.length);
    picked = { w, h, sorted, width };
    if (!sorted.length || sorted[0].length <= BUDGET * 0.6) break;
  }
  const { w, h, sorted, width } = picked;
  const paths = []; let bytes = 0;
  for (const sp of sorted) { if (paths.length >= MAX_PATHS || bytes + sp.length > BUDGET) continue; paths.push(sp); bytes += sp.length; }
  const out = `public/art/traced/${name}.json`;
  writeFileSync(out, JSON.stringify({ w, h, paths }));
  console.log(out, `${w}x${h} (traced at ${width})`, `${sorted.length} subpaths → ${paths.length}`, `${(JSON.stringify({ w, h, paths }).length / 1024).toFixed(1)} KB`);
}
