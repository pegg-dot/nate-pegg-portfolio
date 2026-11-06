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
const subpathLength = d => (d.match(/[-\d.]+/g) || []).length; // proxy: more numbers, longer path
const round = d => d.replace(/-?\d+\.\d+/g, m => String(Math.round(Number(m))));

for (const name of NAMES) {
  const img = await Jimp.read(`public/art/${name}.jpg`);
  img.resize(WIDTH, Jimp.AUTO).grayscale();
  const w = img.bitmap.width, h = img.bitmap.height;
  const svg = await trace(img, { threshold: 128, turdSize: 60, optTolerance: 0.9, color: '#000', background: 'transparent' });
  const d = (svg.match(/ d="([^"]+)"/) || [])[1] || '';
  const subs = d.split(/(?=M)/).map(s => s.trim()).filter(Boolean);
  const sorted = subs.map(round).sort((a, b) => subpathLength(b) - subpathLength(a));
  const paths = []; let bytes = 0;
  for (const sp of sorted) { if (paths.length >= MAX_PATHS || bytes + sp.length > BUDGET) continue; paths.push(sp); bytes += sp.length; }
  const out = `public/art/traced/${name}.json`;
  writeFileSync(out, JSON.stringify({ w, h, paths }));
  console.log(out, `${w}x${h}`, `${subs.length} subpaths → ${paths.length}`, `${(JSON.stringify({ w, h, paths }).length / 1024).toFixed(1)} KB`);
}
