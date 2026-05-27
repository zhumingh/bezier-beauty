# 贝塞尔曲线之美 · Bézier Beauty

> An elegant, interactive visualization of Bézier curves with live mathematical formulas.

[![Live Demo](https://img.shields.io/badge/🚀-Live_Demo-violet?style=for-the-badge)](https://zhumingh.github.io/bezier-beauty)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

![Bézier Beauty Screenshot](https://raw.githubusercontent.com/zhumingh/bezier-beauty/main/screenshot.png)

---

## ✨ Features

- **Arbitrary Degree Curves** — Add or remove control points to explore curves from linear (n=1) to high-order (n≤11)
- **De Casteljau Visualization** — Watch the elegant recursive construction in real time
- **Smooth Animation** — Play, pause, and scrub through the parameter t with fine control
- **Mathematical Formulas** — Live KaTeX-rendered formulas that update as you interact
- **Beautiful Presets** — Heart, wave, loop, S-curve, easing, and random inspiration
- **Bilingual UI** — Full support for 简体中文 and English
- **Touch Friendly** — Works beautifully on mobile and tablets
- **Zero Dependencies** — Single HTML file, uses CDN for Tailwind, Font Awesome, and KaTeX

---

## 🚀 Quick Start

### Option 1: Open Locally
Simply open `index.html` in any modern browser:

```bash
open index.html
# or
python -m http.server 8000
```

### Option 2: GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repo settings (Settings → Pages → Source: GitHub Actions or main branch)
3. Your demo will be live at `https://<username>.github.io/bezier-beauty`

---

## 🎮 How to Use

| Action | Description |
|--------|-------------|
| **Drag** control points | Move them freely to reshape the curve |
| **Click empty space** | Add a new control point |
| **Add / Remove Point** buttons | Change curve degree (n) |
| **t-slider** | Manually control animation progress |
| **Play / Pause** | Watch the curve draw itself with De Casteljau lines |
| **Presets** | Instantly load beautiful curve shapes |
| **Keyboard shortcuts** | `Space` = toggle animation, `R` = reset, `←` `→` = nudge t |

---

## 📐 The Math

A Bézier curve of degree **n** is defined as:

```
B(t) = Σᵢ₌₀ⁿ (ⁿᵢ) (1-t)ⁿ⁻ⁱ tⁱ Pᵢ     t ∈ [0,1]
```

The visualization uses **De Casteljau's algorithm** — a numerically stable way to evaluate the curve through repeated linear interpolation. Every construction line you see is one step of this recursion.

---

## 🛠️ Tech Stack

- Pure HTML + JavaScript (ES6)
- [Tailwind CSS](https://tailwindcss.com) (via CDN)
- [Font Awesome 6](https://fontawesome.com)
- [KaTeX](https://katex.org) for beautiful math typesetting

No build step. No npm. Just open the file.

---

## 📁 Project Structure

```
bezier-beauty/
├── index.html      # The entire application (single file)
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🤝 Contributing

Pull requests are welcome! If you have ideas for new presets, better mobile UX, or additional mathematical visualizations, feel free to open an issue or PR.

---

## 📜 License

MIT © [zhumingh](https://github.com/zhumingh)

---

## 💖 Acknowledgments

Made with love for the beauty of mathematics.  
*Help Sunday Sharply Improve Math (HSSIM)*

> “The Bézier curve is not just a tool — it is poetry written in control points.”
