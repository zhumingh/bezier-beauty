// Zero-dependency structural validator for HSSIM toy pages.
// Run: node tests/validate.mjs   (no install needed)
//
// Derives the page list from the LESSONS array in index.html, then for each
// toy checks the three bug classes a generation session tends to produce:
//   1. getElementById('x') with no matching id="x" in the DOM
//   2. data-i18n="key" missing from the zh or en dictionary
//   3. zh / en dictionaries that don't have identical key sets
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// pages referenced from the lesson grid
const files = [...index.matchAll(/file:\s*"([^"]+\.html)"/g)].map(m => m[1]);

// Pull the body of a top-level `lang: { ... }` block and return its key set.
function dictKeys(script, lang) {
  const re = new RegExp(lang + '\\s*:\\s*\\{', 'g');
  const m = re.exec(script);
  if (!m) return null;
  let i = m.index + m[0].length, depth = 1, body = '';
  while (i < script.length && depth > 0) {
    const c = script[i];
    if (c === '{') depth++; else if (c === '}') depth--;
    if (depth > 0) body += c;
    i++;
  }
  const keys = new Set();
  let d = 0;
  const tok = /([A-Za-z_$][\w$]*)\s*:|[{}]|`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g;
  let t;
  while ((t = tok.exec(body))) {
    if (t[0] === '{') d++;
    else if (t[0] === '}') d--;
    else if (t[1] && d === 0) keys.add(t[1]);
  }
  return keys;
}

let totalFail = 0;
for (const f of files) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) { console.log(`\x1b[31m✗ ${f}  (file referenced by index but missing)\x1b[0m`); totalFail++; continue; }
  const html = fs.readFileSync(p, 'utf8');
  const fails = [];

  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g))
    if (!ids.has(m[1])) fails.push(`getElementById('${m[1]}') has no matching id=`);

  if (html.includes('registerDict')) {
    const script = html.slice(html.indexOf('registerDict'));
    const zh = dictKeys(script, 'zh'), en = dictKeys(script, 'en');
    if (!zh || !en) fails.push('could not parse zh/en dict');
    else {
      for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) {
        if (!zh.has(m[1])) fails.push(`data-i18n="${m[1]}" missing from zh dict`);
        if (!en.has(m[1])) fails.push(`data-i18n="${m[1]}" missing from en dict`);
      }
      for (const k of zh) if (!en.has(k)) fails.push(`key "${k}" in zh but not en`);
      for (const k of en) if (!zh.has(k)) fails.push(`key "${k}" in en but not zh`);
    }
  }

  if (fails.length) { totalFail += fails.length; console.log(`\x1b[31m✗ ${f}\x1b[0m`); fails.forEach(x => console.log('    - ' + x)); }
  else console.log(`\x1b[32m✓ ${f}\x1b[0m`);
}
console.log(totalFail ? `\n${totalFail} issue(s) found` : `\nAll ${files.length} pages passed structural checks`);
process.exit(totalFail ? 1 : 0);
