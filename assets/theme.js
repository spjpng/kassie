/* ECB Stylez — lightweight theme interactions (no dependencies) */
(function () {
  'use strict';

  // Mobile nav toggle
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-menu-toggle]');
    if (toggle) {
      var nav = document.getElementById('MobileNav');
      if (nav) {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    }
  });

  // Smooth-scroll for in-page anchors (e.g. "Select" -> contact form)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Before/after comparison sliders
  function initCompare(ba) {
    var range = ba.querySelector('[data-ba-range]');
    if (!range) return;
    var update = function () { ba.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', update);
    update();
  }

  // Carousel arrows for horizontal scroll sliders
  function initSlider(slider) {
    if (slider.dataset.navReady) return;
    if (slider.scrollWidth <= slider.clientWidth + 4) return;
    slider.dataset.navReady = 'true';

    var nav = document.createElement('div');
    nav.className = 'slider-nav';
    var prev = document.createElement('button');
    var next = document.createElement('button');
    prev.type = next.type = 'button';
    prev.innerHTML = '‹';
    next.innerHTML = '›';
    prev.setAttribute('aria-label', 'Previous');
    next.setAttribute('aria-label', 'Next');
    nav.appendChild(prev);
    nav.appendChild(next);
    slider.parentNode.insertBefore(nav, slider.nextSibling);

    var step = function () { return Math.max(slider.clientWidth * 0.8, 240); };
    prev.addEventListener('click', function () { slider.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { slider.scrollBy({ left: step(), behavior: 'smooth' }); });

    var sync = function () {
      prev.disabled = slider.scrollLeft <= 2;
      next.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 2;
    };
    slider.addEventListener('scroll', sync, { passive: true });
    sync();
  }

  // Product variant selection: keep variant id, price and availability in sync
  function initProductForm(form) {
    var dataEl = form.querySelector('[data-variants]');
    var selects = form.querySelectorAll('[data-option-selector]');
    if (!dataEl || selects.length === 0) return; // single-variant: server value is correct

    var variants;
    try { variants = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var idInput = form.querySelector('[data-variant-id]');
    var priceEl = form.parentNode.querySelector('[data-price]');
    var btn = form.querySelector('[data-add-button]');

    function update() {
      var chosen = Array.prototype.map.call(selects, function (s) { return s.value; });
      var match = null;
      for (var i = 0; i < variants.length; i++) {
        var v = variants[i];
        if (v.options.length === chosen.length && v.options.every(function (o, idx) { return o === chosen[idx]; })) {
          match = v;
          break;
        }
      }
      if (match) {
        if (idInput) idInput.value = match.id;
        if (priceEl) priceEl.textContent = match.price;
        if (btn) {
          btn.disabled = !match.available;
          btn.textContent = match.available ? btn.dataset.addText : btn.dataset.soldText;
        }
      } else if (btn) {
        btn.disabled = true;
        btn.textContent = btn.dataset.soldText;
      }
    }

    Array.prototype.forEach.call(selects, function (s) { s.addEventListener('change', update); });
    update();
  }

  function init() {
    document.querySelectorAll('[data-ba]').forEach(initCompare);
    document.querySelectorAll('.slider').forEach(initSlider);
    document.querySelectorAll('[data-variants]').forEach(function (el) {
      var form = el.closest('form');
      if (form) initProductForm(form);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Re-init in Shopify theme editor when sections re-render
  document.addEventListener('shopify:section:load', init);
})();
