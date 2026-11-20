(function () {
  'use strict';

  /* ===== Enlaces de descarga =====
     Reemplaza estas URLs cuando la app esté publicada.
     Mientras valgan "", el botón muestra un aviso en lugar de abrir un enlace roto. */
  var STORE_LINKS = {
    android: '', // ej. https://play.google.com/store/apps/details?id=...
    ios: ''      // ej. https://apps.apple.com/app/id...
  };

  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }

  document.querySelectorAll('[data-store]').forEach(function (a) {
    var url = STORE_LINKS[a.dataset.store];
    if (url) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    } else {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('¡Muy pronto disponible para ' + (a.dataset.store === 'ios' ? 'iOS' : 'Android') + '!');
      });
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
