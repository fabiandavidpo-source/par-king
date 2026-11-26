(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menú en pantallas pequeñas
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Recuerda el idioma elegido para la próxima visita
  var switcher = document.querySelectorAll('.lang-switch a[data-lang]');
  for (var i = 0; i < switcher.length; i++) {
    switcher[i].addEventListener('click', function (event) {
      try { localStorage.setItem('par-king.lang', event.currentTarget.getAttribute('data-lang')); } catch (e) {}
    });
  }
  var current = document.documentElement.lang;
  try { if (!localStorage.getItem('par-king.lang')) localStorage.setItem('par-king.lang', current); } catch (e) {}

  // Paso a paso de "Cómo reservar": pestañas con avance automático
  var stepper = document.querySelector('[data-stepper]');
  if (!stepper) return;
  var tabs = Array.prototype.slice.call(stepper.querySelectorAll('[role="tab"]'));
  var screens = Array.prototype.slice.call(stepper.querySelectorAll('[role="tabpanel"]'));
  var index = 0;
  var timer = null;

  function show(next, focus) {
    index = (next + tabs.length) % tabs.length;
    tabs.forEach(function (tab, n) {
      var on = n === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });
    screens.forEach(function (screen, n) {
      if (n === index) screen.removeAttribute('data-inactive'); else screen.setAttribute('data-inactive', '');
    });
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() { if (!reduce && !timer) timer = setInterval(function () { show(index + 1, false); }, 3800); }

  tabs.forEach(function (tab, n) {
    tab.addEventListener('click', function () { stop(); show(n, false); });
    tab.addEventListener('keydown', function (event) {
      var key = event.key;
      if (key === 'ArrowRight' || key === 'ArrowDown') { event.preventDefault(); stop(); show(index + 1, true); }
      if (key === 'ArrowLeft' || key === 'ArrowUp') { event.preventDefault(); stop(); show(index - 1, true); }
    });
  });
  stepper.addEventListener('mouseenter', stop);
  stepper.addEventListener('focusin', stop);
  start();
})();
