(function () {
  'use strict';
  var STORE_LINKS = {
    android: 'https://github.com/KellerRam/maru-support/releases/download/v1.0.1/MaruAppv1.0.1.apk',
    ios: 'https://apps.apple.com/ca/app/maruapp/id6817173952'
  };

  document.querySelectorAll('[data-store]').forEach(function (a) {
    var url = STORE_LINKS[a.dataset.store];
    if (!url) return;
    a.href = url;
    if (a.dataset.store === 'android') {
      a.setAttribute('download', 'MaruApp.apk'); // inicia la descarga sin abrir otra página
    } else {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });

  /* ===== Panel Términos y condiciones ===== */
  var panel = document.getElementById('terms-panel');
  var overlay = document.getElementById('terms-overlay');
  var body = document.getElementById('terms-body');
  var lastFocus = null;

  function openTerms() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add('show');
      panel.classList.add('open');
    });
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    body.scrollTop = 0;
    setTimeout(function () { panel.focus(); }, 50);
  }

  function closeTerms() {
    overlay.classList.remove('show');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { overlay.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-open-terms]').forEach(function (b) { b.addEventListener('click', openTerms); });
  document.querySelectorAll('[data-close-terms]').forEach(function (b) { b.addEventListener('click', closeTerms); });
  overlay.addEventListener('click', closeTerms);

  document.addEventListener('keydown', function (e) {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { closeTerms(); return; }
    if (e.key === 'Tab') { // mantener el foco dentro del panel
      var f = panel.querySelectorAll('a[href],button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Los enlaces internos (índice) hacen scroll dentro del panel
  body.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var t = body.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    body.scrollTo({ top: t.offsetTop - body.offsetTop - 8, behavior: 'smooth' });
  });

  // Abrir directamente con #terminos
  if (location.hash === '#terminos') openTerms();

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
