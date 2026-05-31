/* ===================================================================
   HSSIM · tiny feedback widget
   A self-contained, dependency-free corner bubble. Drop
   <script src="assets/feedback.js" defer></script> onto any page.
   On submit it opens the visitor's mail app addressed to the author,
   so nothing here can touch the page's main features.
   =================================================================== */
(function () {
  'use strict';

  var TO = 'zhumingh@gmail.com';
  if (document.getElementById('hssim-fb-root')) return; // never double-mount

  // Follow the site's language if it's set, otherwise default to zh.
  function lang() {
    try { return localStorage.getItem('hssim_lang') || 'zh'; }
    catch (e) { return 'zh'; }
  }

  var T = {
    zh: {
      open: '悄悄说点什么',
      title: '留言小窗',
      sub: '有想法 / 建议 / 吐槽？直接告诉作者～',
      ph: '写点什么吧…（建议、想法、发现的小 bug 都欢迎）',
      send: '发送',
      hint: '会用你的邮箱打开并发给作者',
      empty: '先写一点点内容呀～',
    },
    en: {
      open: 'Say something nice',
      title: 'Quick note',
      sub: 'Comments, advice, or just a hello — straight to the author.',
      ph: 'Type anything… ideas, suggestions, tiny bugs all welcome',
      send: 'Send',
      hint: 'Opens your mail app addressed to the author',
      empty: 'Write a little something first ~',
    },
  };
  function t(k) { return (T[lang()] || T.zh)[k]; }

  /* ---- styles (scoped, inline so no framework is needed) -------- */
  var css = '' +
    '#hssim-fb-root{position:fixed;right:18px;bottom:18px;z-index:2147483000;' +
      'font-family:Inter,system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif}' +
    '#hssim-fb-btn{display:flex;align-items:center;gap:7px;cursor:pointer;border:none;' +
      'padding:9px 13px;border-radius:9999px;color:#fff;font-size:13px;font-weight:600;' +
      'background:linear-gradient(135deg,#8b5cf6,#d946ef);' +
      'box-shadow:0 8px 24px -6px rgba(139,92,246,.6);transition:transform .18s ease,box-shadow .18s ease}' +
    '#hssim-fb-btn:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 12px 28px -6px rgba(217,70,239,.7)}' +
    '#hssim-fb-btn .hssim-fb-emoji{font-size:15px;line-height:1}' +
    '#hssim-fb-btn .hssim-fb-label{white-space:nowrap}' +
    '#hssim-fb-panel{position:absolute;right:0;bottom:54px;width:290px;max-width:78vw;' +
      'background:#1e1b2e;border:1px solid rgba(139,92,246,.4);border-radius:16px;padding:14px;' +
      'box-shadow:0 24px 50px -12px rgba(0,0,0,.6);color:#e0e7ff;' +
      'opacity:0;transform:translateY(8px) scale(.98);pointer-events:none;transition:opacity .18s ease,transform .18s ease}' +
    '#hssim-fb-root.open #hssim-fb-panel{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
    '#hssim-fb-root.open #hssim-fb-btn{transform:scale(.94);opacity:.85}' +
    '.hssim-fb-title{font-size:14px;font-weight:600;font-family:"Space Grotesk",Inter,sans-serif}' +
    '.hssim-fb-sub{font-size:11px;color:#a5a0c0;margin:2px 0 9px;line-height:1.4}' +
    '#hssim-fb-text{width:100%;box-sizing:border-box;min-height:84px;resize:vertical;' +
      'background:#13111f;border:1px solid #3a3550;border-radius:10px;color:#e0e7ff;' +
      'font:inherit;font-size:12.5px;padding:8px 9px;outline:none;transition:border-color .15s ease}' +
    '#hssim-fb-text:focus{border-color:#8b5cf6}' +
    '#hssim-fb-text::placeholder{color:#6b6688}' +
    '.hssim-fb-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:9px}' +
    '.hssim-fb-hint{font-size:10px;color:#6b6688;line-height:1.3;flex:1}' +
    '#hssim-fb-send{cursor:pointer;border:none;border-radius:9px;padding:7px 14px;color:#fff;' +
      'font-size:12.5px;font-weight:600;background:linear-gradient(135deg,#8b5cf6,#d946ef);' +
      'transition:transform .15s ease,opacity .15s ease;flex-shrink:0}' +
    '#hssim-fb-send:hover{transform:translateY(-1px)}' +
    '#hssim-fb-send:active{transform:translateY(0)}' +
    '@media (max-width:480px){#hssim-fb-btn .hssim-fb-label{display:none}#hssim-fb-btn{padding:11px}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;

  /* ---- DOM ------------------------------------------------------ */
  var root = document.createElement('div');
  root.id = 'hssim-fb-root';
  root.innerHTML =
    '<div id="hssim-fb-panel" role="dialog" aria-label="feedback">' +
      '<div class="hssim-fb-title" data-fb="title"></div>' +
      '<div class="hssim-fb-sub" data-fb="sub"></div>' +
      '<textarea id="hssim-fb-text"></textarea>' +
      '<div class="hssim-fb-row">' +
        '<span class="hssim-fb-hint" data-fb="hint"></span>' +
        '<button id="hssim-fb-send" data-fb="send"></button>' +
      '</div>' +
    '</div>' +
    '<button id="hssim-fb-btn" aria-label="feedback">' +
      '<span class="hssim-fb-emoji">💌</span>' +
      '<span class="hssim-fb-label" data-fb="open"></span>' +
    '</button>';

  function paintText() {
    root.querySelectorAll('[data-fb]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-fb'));
    });
    root.querySelector('#hssim-fb-text').setAttribute('placeholder', t('ph'));
  }

  function ready() {
    document.head.appendChild(styleEl);
    document.body.appendChild(root);
    paintText();

    var btn = root.querySelector('#hssim-fb-btn');
    var panel = root.querySelector('#hssim-fb-panel');
    var text = root.querySelector('#hssim-fb-text');
    var send = root.querySelector('#hssim-fb-send');

    function toggle() {
      var willOpen = !root.classList.contains('open');
      root.classList.toggle('open', willOpen);
      if (willOpen) { paintText(); setTimeout(function () { text.focus(); }, 60); }
    }

    btn.addEventListener('click', toggle);

    function submit() {
      var body = text.value.trim();
      if (!body) { text.focus(); text.placeholder = t('empty'); return; }
      var subject = (lang() === 'zh' ? 'HSSIM 留言' : 'HSSIM feedback') +
                    ' · ' + document.title;
      var url = 'mailto:' + TO +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body + '\n\n— ' + location.href);
      window.location.href = url;
      text.value = '';
      root.classList.remove('open');
    }

    send.addEventListener('click', submit);
    // Cmd/Ctrl+Enter to send quickly.
    text.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit();
    });

    // Close when clicking outside, or on Escape.
    document.addEventListener('click', function (e) {
      if (root.classList.contains('open') && !root.contains(e.target)) root.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') root.classList.remove('open');
    });

    // Keep labels in sync if the visitor switches site language.
    window.addEventListener('storage', function (e) { if (e.key === 'hssim_lang') paintText(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
