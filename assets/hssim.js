/* ===================================================================
   HSSIM · shared runtime
   - Bilingual (zh / en) i18n engine with localStorage persistence
   - Standard header + footer injected into #hssim-header / #hssim-footer
   - Lesson pages register their own dictionary, then call HSSIM.mount()
   =================================================================== */
(function (global) {
  'use strict';

  const LANG_KEY = 'hssim_lang';

  // Strings shared by every page. Lesson dictionaries are merged on top.
  const BASE = {
    zh: {
      nav_home: '回大厅',
      lang_zh: '中文',
      lang_en: 'EN',
      footer_tagline: 'Help Sunday Sharply Improve Math',
      footer_credit: '一个让数学偷偷变好玩的地方',
    },
    en: {
      nav_home: 'Lobby',
      lang_zh: '中文',
      lang_en: 'EN',
      footer_tagline: 'Help Sunday Sharply Improve Math',
      footer_credit: 'where math sneakily turns into fun',
    },
  };

  let lang = localStorage.getItem(LANG_KEY) || 'zh';
  let dict = { zh: Object.assign({}, BASE.zh), en: Object.assign({}, BASE.en) };

  function t(key, ...args) {
    const pack = dict[lang] || dict.zh || {};
    const v = pack[key];
    if (typeof v === 'function') return v(...args);
    return v != null ? v : key;
  }

  function registerDict(d) {
    if (!d) return;
    ['zh', 'en'].forEach((l) => {
      dict[l] = Object.assign({}, BASE[l], d[l] || {});
    });
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    // data-i18n-attr="title:some_key;aria-label:other_key"
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.getAttribute('data-i18n-attr').split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s && s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    if (dict[lang] && dict[lang].page_title) document.title = t('page_title');

    updateToggle();
    if (typeof global.onLangChange === 'function') global.onLangChange(lang);
  }

  function updateToggle() {
    const zh = document.getElementById('hssim-lang-zh');
    const en = document.getElementById('hssim-lang-en');
    if (!zh || !en) return;
    const on = ['bg-violet-600', 'text-white'];
    const off = ['text-slate-400'];
    zh.classList.toggle('bg-violet-600', lang === 'zh');
    zh.classList.toggle('text-white', lang === 'zh');
    zh.classList.toggle('text-slate-400', lang !== 'zh');
    en.classList.toggle('bg-violet-600', lang === 'en');
    en.classList.toggle('text-white', lang === 'en');
    en.classList.toggle('text-slate-400', lang !== 'en');
  }

  function setLang(l) {
    lang = l;
    localStorage.setItem(LANG_KEY, l);
    apply();
  }

  function getLang() { return lang; }

  /* ---- chrome (header + footer) -------------------------------- */
  function headerHTML(opts) {
    const icon = opts.icon || 'fa-infinity';
    const grad = opts.gradient || 'from-violet-500 to-fuchsia-500';
    // On a lesson page show a "back to all lessons" link; on the hub hide it.
    const homeLink = opts.home
      ? ''
      : `<a href="index.html"
            class="hidden sm:flex px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm items-center gap-x-2 transition-colors">
           <i class="fa-solid fa-arrow-left"></i>
           <span data-i18n="nav_home">全部课程</span>
         </a>`;

    return `
    <div class="border-b border-slate-800 bg-slate-900/70 backdrop-blur-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-x-4">
        <a href="index.html" class="flex items-center gap-x-3 min-w-0 group">
          <div class="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
            <i class="fa-solid ${icon} text-white text-xl"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-x-2 flex-wrap">
              <div class="font-display text-xl sm:text-2xl font-semibold tracking-tighter truncate" data-i18n="nav_title">HSSIM</div>
              <span class="hssim-badge font-mono font-bold text-[10px] tracking-[0.18em] px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-500/25 to-fuchsia-500/25 text-violet-200 border border-violet-400/50 ring-1 ring-violet-500/10 shrink-0"
                    title="Help Sunday Sharply Improve Math">HSSIM</span>
            </div>
            <div class="text-[10px] text-slate-500 -mt-0.5 truncate" data-i18n="nav_subtitle">数学的优雅</div>
          </div>
        </a>
        <div class="flex items-center gap-x-2 text-sm shrink-0">
          ${homeLink}
          <div class="flex items-center bg-slate-900 border border-slate-700 rounded-2xl p-0.5 text-xs">
            <button id="hssim-lang-zh" onclick="HSSIM.setLang('zh')"
                    class="px-3 py-1 rounded-[14px] transition-colors" data-i18n="lang_zh">中文</button>
            <button id="hssim-lang-en" onclick="HSSIM.setLang('en')"
                    class="px-3 py-1 rounded-[14px] transition-colors" data-i18n="lang_en">EN</button>
          </div>
        </div>
      </div>
      <div class="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"></div>
    </div>`;
  }

  /* ---- "where it hides in real life" applications section -------- */
  // opts.apps = [{ icon: 'fa-…', grad: 'from-… to-…', k: 'app_a' }, …]
  // Each card reads `${k}_title` / `${k}_desc` from the page dictionary;
  // the section header reads apps_kicker / apps_title / apps_subtitle.
  function appsHTML(apps) {
    const cards = apps.map((a) => `
      <div class="control-card bg-slate-900 border border-slate-700 rounded-3xl p-5 flex flex-col gap-y-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br ${a.grad || 'from-violet-500 to-fuchsia-500'} flex items-center justify-center shadow-lg shadow-violet-500/20">
          <i class="fa-solid ${a.icon} text-white text-sm"></i>
        </div>
        <div class="text-sm font-semibold" data-i18n="${a.k}_title"></div>
        <p class="text-xs text-slate-400 leading-relaxed flex-1" data-i18n="${a.k}_desc"></p>
      </div>`).join('');

    return `
    <section class="mt-14 pt-10 border-t border-slate-800">
      <div class="mb-8 flex items-end justify-between flex-wrap gap-3">
        <div>
          <div class="section-title mb-2" data-i18n="apps_kicker">它都藏在哪儿</div>
          <h2 class="font-display text-2xl sm:text-3xl font-semibold tracking-tighter" data-i18n="apps_title"></h2>
          <p class="text-sm text-slate-400 mt-2 max-w-2xl" data-i18n="apps_subtitle"></p>
        </div>
        <div class="text-xs text-slate-500 font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hidden sm:block">
          IRL
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">${cards}</div>
    </section>`;
  }

  function footerHTML() {
    return `
    <footer class="border-t border-slate-800 mt-12">
      <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <a href="index.html" class="flex items-center gap-x-2 hover:text-slate-300 transition-colors">
          <span class="font-mono font-bold text-[10px] tracking-[0.18em] px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-200 border border-violet-400/40">HSSIM</span>
          <span data-i18n="footer_tagline">Help Sunday Sharply Improve Math</span>
        </a>
        <span data-i18n="footer_credit">用数学之美点亮 Sunday 的每一天</span>
      </div>
    </footer>`;
  }

  function mount(opts) {
    opts = opts || {};
    const h = document.getElementById('hssim-header');
    const f = document.getElementById('hssim-footer');
    const a = document.getElementById('hssim-apps');
    if (h) h.innerHTML = headerHTML(opts);
    if (f) f.innerHTML = footerHTML();
    if (a && opts.apps && opts.apps.length) a.innerHTML = appsHTML(opts.apps);
    apply();
  }

  global.HSSIM = { t, registerDict, apply, setLang, getLang, mount };
})(window);
