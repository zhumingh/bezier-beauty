// Headless-browser smoke test for HSSIM toy pages.
// Requires: npm install   (puppeteer-core) and a local Chrome/Chromium.
// Run: npm run serve   (in one shell) then  node tests/runtime.mjs
//
// For every page in the lesson grid it:
//   - loads the page and records console errors, page errors, failed requests
//   - drags every range slider min -> max -> mid and fires input events
//   - clicks non-nav buttons (presets / reset / randomize)
//   - toggles language en <-> zh
//   - asserts a <canvas>, if present, actually drew (non-uniform pixels)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.HSSIM_BASE || 'http://localhost:8765/';
const CHROME = process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pages = ['index', ...[...index.matchAll(/file:\s*"([^"]+)\.html"/g)].map(m => m[1])];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
let totalFail = 0;

for (const name of pages) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', r => { if (!r.url().includes('favicon')) errors.push('requestfailed: ' + r.url()); });

  try {
    await page.goto(BASE + name + '.html', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      for (const s of document.querySelectorAll('input[type=range]'))
        for (const v of [s.min, s.max, String((+s.min + +s.max) / 2)]) {
          s.value = v; s.dispatchEvent(new Event('input', { bubbles: true }));
        }
      for (const b of document.querySelectorAll('button')) {
        if (/lang|nav|feedback|menu/i.test(b.id + ' ' + b.className)) continue;
        try { b.click(); } catch {}
      }
    });
    await page.evaluate(() => window.HSSIM && HSSIM.setLang('en'));
    await new Promise(r => setTimeout(r, 150));
    await page.evaluate(() => window.HSSIM && HSSIM.setLang('zh'));
    await new Promise(r => setTimeout(r, 150));

    if (name !== 'index') {
      const blank = await page.evaluate(() => {
        const c = document.querySelector('canvas');
        if (!c) return 'no-canvas';
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        const first = [d[0], d[1], d[2], d[3]].join();
        for (let i = 4; i < d.length; i += 4000)
          if ([d[i], d[i+1], d[i+2], d[i+3]].join() !== first) return false;
        return true;
      });
      if (blank === true) errors.push('canvas appears blank (uniform pixels)');
    }
  } catch (e) { errors.push('navigation: ' + e.message); }

  if (errors.length) { totalFail += errors.length; console.log(`\x1b[31m✗ ${name}\x1b[0m`); errors.forEach(x => console.log('    - ' + x)); }
  else console.log(`\x1b[32m✓ ${name}\x1b[0m`);
  await page.close();
}

await browser.close();
console.log(totalFail ? `\n${totalFail} runtime issue(s)` : `\nAll ${pages.length} pages passed runtime checks`);
process.exit(totalFail ? 1 : 0);
