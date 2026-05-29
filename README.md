# HSSIM 🎮 a pile of fun stuff that happens to be math

> **HSSIM — Help Sunday Sharply Improve Math.**
> A growing playground of interactive, bilingual (简体中文 / English) toys for
> high-schoolers (think Grade 9–10). No lectures, no tests — just drag stuff,
> smash play, and watch the "fancy" math come alive on its own.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## ✨ The vibe

`index.html` is the **lobby** — it links out to every toy. Each toy is its own
self-contained page that shares one tiny design system, so the whole place looks
and feels like one site.

Every page is:

- **Hands-on** — drag points, scrub sliders, hit play. Nothing is static.
- **Bilingual** — one toggle flips the *entire* site (titles, controls, the
  "OK, the gist" explainers) between 中文 and English. Your choice is remembered
  across pages (`localStorage` key `hssim_lang`).
- **Honest math under the hood** — the sunflower really uses the 137.5° golden
  angle, the nautilus is a real log-spiral, the bell curve is a real binomial.
  The voice is chill; the math is not faked.
- **Mobile / touch friendly**, and **zero build step** — just open the file.

---

## 🧸 The toy box

| | Toy | File | What it secretly teaches |
|---|---|---|---|
| 🟣 | **The bendy magic line** | `bezier.html` | Bézier curves |
| 🔵 | **Why everything you throw flies like this** | `parabola.html` | Parabolas / quadratics |
| 🟢 | **Two lines walk into a graph…** | `linear-systems.html` | Lines & systems of equations |
| 🟠 | **The triangle's secret handshake** | `pythagoras.html` | Pythagorean theorem |
| 🌹 | **Spin a circle, get a wave** | `trig.html` | Unit circle, sine & cosine |
| 💜 | **Give a graph a glow-up** | `transformations.html` | Function transformations |
| 🟪 | **Pure chaos, weirdly organized** | `probability.html` | Probability & the bell curve |
| 🟩 | **Nature's favorite number trick** | `fibonacci.html` | Fibonacci & the golden spiral |
| 🔷 | **Roll dice, accidentally make art** | `sierpinski.html` | The Sierpinski fractal (chaos game) |

The Fibonacci page also has a **"Fibonacci in everyday life"** showcase —
sunflowers, pinecones, nautilus shells & galaxies, flower petals, art & design,
and even stock-chart Fibonacci retracement.

---

## 🚀 Run it

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `index.html` in any modern browser.

### Put it online (GitHub Pages)
Push to GitHub, then **Settings → Pages → Source: main branch**. It goes live at
`https://<username>.github.io/<repo>` with the lobby as the front door.

---

## 🧩 Project structure

```
.
├── index.html              # lobby (renders the toy grid from a data array)
├── bezier.html             # the bendy magic line
├── parabola.html           # flying arcs / quadratics
├── linear-systems.html     # two lines crashing / systems
├── pythagoras.html         # the triangle's secret handshake
├── trig.html               # circle → wave
├── transformations.html    # graph glow-up
├── probability.html        # chaos → bell curve (Galton board)
├── fibonacci.html          # nature's cheat code + "everyday life" showcase
├── sierpinski.html         # roll dice, make art (chaos game)
└── assets/
    ├── hssim.css           # shared design system
    └── hssim.js            # bilingual engine + shared header/footer
```

---

## ➕ Add a new toy (持续更新)

The place is built to grow. To drop in a new toy:

1. **Copy an existing page** (e.g. `parabola.html`) as a template.
2. Rewrite its `HSSIM.registerDict({ zh: {...}, en: {...} })` block and the
   canvas/demo logic. Keep the tone light — write the explainer like you'd text
   a friend, not like a textbook.
3. Keep these pieces so it matches the rest of the site:
   ```html
   <div id="hssim-header"></div>      <!-- top of <body> -->
   <div id="hssim-footer"></div>      <!-- bottom of <body> -->
   <script src="assets/hssim.js"></script>
   HSSIM.mount({ icon: 'fa-...', gradient: 'from-...-500 to-...-500' });
   ```
4. **List it in the lobby**: add one entry to the `LESSONS` array in
   `index.html` (file, icon, gradient, tag, and zh/en title + blurb). The card
   shows up automatically.

### Bilingual text rules
- `data-i18n="key"` → sets `textContent` from the dictionary.
- `data-i18n-html="key"` → sets `innerHTML` (use for inline `<code>` etc.).
- `data-i18n-attr="title:key;aria-label:key2"` → translates attributes.
- For anything drawn on `<canvas>`, call `HSSIM.t('key')` and re-render inside
  the global `window.onLangChange` hook so it updates when the language flips.

---

## 🛠️ Tech stack

Pure HTML + vanilla JS (ES6). No framework, no build, no npm:

- [Tailwind CSS](https://tailwindcss.com) (CDN)
- [Font Awesome 6](https://fontawesome.com)
- [KaTeX](https://katex.org) for the math typesetting

---

## 📜 License

MIT © [zhumingh](https://github.com/zhumingh)

> *Help Sunday Sharply Improve Math — 一个让数学偷偷变好玩的地方。*
