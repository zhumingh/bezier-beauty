# HSSIM tests

Two layers of automated checks for the toy pages. Both derive their page list
from the `LESSONS` array in `index.html`, so new toys are covered automatically
once they're wired into the grid.

## 1. Structural validation — zero dependencies

```bash
node tests/validate.mjs
```

Catches the bugs a quick authoring session tends to leave behind:

- `getElementById('x')` with no matching `id="x"` in the markup
- `data-i18n="key"` that's missing from the `zh` or `en` dictionary
- `zh` / `en` dictionaries whose key sets don't match

## 2. Runtime smoke test — headless Chrome

```bash
npm install            # one-time: pulls puppeteer-core (uses your system Chrome)
npm run serve          # in one terminal — static server on :8765
node tests/runtime.mjs # in another
```

Loads every page, records console/page/request errors, drags every slider,
clicks the non-nav buttons, toggles the language both ways, and asserts each
`<canvas>` actually drew something. Override the browser with
`CHROME_PATH=...` and the server with `HSSIM_BASE=...` if needed.
