/*!
 * awalkaday.art gallery — vanilla JavaScript, no dependencies.
 *
 * Replaces jQuery 2.2.4, skel.js, poptrox and the Multiverse main.js.
 * (Random order and random crop of the tiles are done by the small inline
 * script in index.html so that they happen before the browser starts
 * downloading images.)
 *
 * What this file does:
 *   1. Fades each thumbnail in when it has loaded.
 *   2. Runs the "About" panel (open/close, Esc, click outside).
 *   3. Runs the photo viewer (native <dialog>): next/previous by button,
 *      keyboard arrows or swipe, Esc to close, deep links like #photo-9e4d2608.
 */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var win = window;
  var main = doc.getElementById('main');

  /* ------------------------------------------------------------------ *
   * Page load: header slide-in, same "loading" class as the old script,
   * but released as soon as the DOM is ready instead of waiting for all
   * 261 thumbnails to finish downloading.
   * ------------------------------------------------------------------ */
  body.classList.add('loading');
  win.requestAnimationFrame(function () {
    win.setTimeout(function () {
      body.classList.remove('loading');
    }, 100);
  });

  /* ------------------------------------------------------------------ *
   * Thumbnails: fade in when loaded.
   * 'load' does not bubble, so listen in the capture phase.
   * ------------------------------------------------------------------ */
  if (main) {
    var markLoaded = function (img) {
      if (img.classList) img.classList.add('is-loaded');
    };
    main.addEventListener('load', function (e) {
      if (e.target.tagName === 'IMG') markLoaded(e.target);
    }, true);
    main.addEventListener('error', function (e) {
      // Never leave a broken image invisible forever: show the tile background.
      if (e.target.tagName === 'IMG') e.target.classList.add('is-error');
    }, true);
    // Images that finished before this script ran.
    Array.prototype.forEach.call(main.querySelectorAll('img'), function (img) {
      if (img.complete && img.naturalWidth > 0) markLoaded(img);
    });
  }

  /* ------------------------------------------------------------------ *
   * Panels ("About" footer sheet)
   * ------------------------------------------------------------------ */
  var panels = Array.prototype.slice.call(doc.querySelectorAll('.panel'));

  function hidePanels() {
    panels.forEach(function (p) { p._hide(); });
  }

  panels.forEach(function (panel) {
    var toggles = panel.id
      ? Array.prototype.slice.call(doc.querySelectorAll('a[href="#' + panel.id + '"]'))
      : [];
    var closer = doc.createElement('div');
    closer.className = 'closer';
    closer.setAttribute('role', 'button');
    closer.setAttribute('aria-label', 'Close');
    closer.tabIndex = 0;
    panel.appendChild(closer);

    // A closed panel sits off-screen; keep it out of the tab order too.
    panel.inert = true;

    panel._show = function () {
      hidePanels();
      panel.inert = false;
      panel.classList.add('active');
      toggles.forEach(function (t) {
        t.classList.add('active');
        t.setAttribute('aria-expanded', 'true');
      });
      body.classList.add('content-active');
    };
    panel._hide = function () {
      panel.classList.remove('active');
      panel.inert = true;
      toggles.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-expanded', 'false');
      });
      body.classList.remove('content-active');
    };

    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    closer.addEventListener('click', panel._hide);
    closer.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); panel._hide(); }
    });

    toggles.forEach(function (t) {
      t.setAttribute('role', 'button');
      t.setAttribute('aria-expanded', 'false');
      t.setAttribute('aria-controls', panel.id);
      t.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (panel.classList.contains('active')) panel._hide(); else panel._show();
      });
    });
  });

  doc.addEventListener('click', function (e) {
    if (body.classList.contains('content-active')) {
      e.preventDefault();
      hidePanels();
    }
  });
  doc.addEventListener('keyup', function (e) {
    if (e.key === 'Escape' && body.classList.contains('content-active')) {
      e.preventDefault();
      hidePanels();
    }
  });

  /* ------------------------------------------------------------------ *
   * Photo viewer
   * ------------------------------------------------------------------ */
  if (!main) return;

  var HASH_PREFIX = '#photo-';
  var dialog = doc.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Photograph viewer');
  dialog.innerHTML =
    '<figure class="lightbox-figure">' +
      '<img class="lightbox-img" alt="">' +
      '<figcaption class="lightbox-caption" aria-live="polite"></figcaption>' +
    '</figure>' +
    '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close photograph"></button>' +
    '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous photograph"></button>' +
    '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next photograph"></button>';
  body.appendChild(dialog);

  var imgEl = dialog.querySelector('.lightbox-img');
  var capEl = dialog.querySelector('.lightbox-caption');
  var hasModal = typeof dialog.showModal === 'function';
  var links = [];     // gallery links, in the (shuffled) order shown on screen
  var current = -1;
  var opener = null;

  function collect() {
    links = Array.prototype.slice.call(main.querySelectorAll('.tile > a'));
  }

  function preload(i) {
    var a = links[(i + links.length) % links.length];
    if (a) (new Image()).src = a.href;
  }

  function renderCaption(a) {
    capEl.textContent = '';
    var title = a.getAttribute('data-title');
    var chain = a.getAttribute('data-chain');
    if (title) {
      var t = doc.createElement('span');
      t.className = 'lightbox-title';
      t.textContent = title;
      capEl.appendChild(t);
    }
    if (chain) {
      var l = doc.createElement('a');
      l.className = 'lightbox-chain';
      l.href = chain;
      l.target = '_blank';
      l.rel = 'noopener';
      l.textContent = 'View on Ethereum';
      capEl.appendChild(l);
    }
    capEl.hidden = !capEl.firstChild;
  }

  function show(i) {
    if (!links.length) return;
    current = (i + links.length) % links.length;
    var a = links[current];
    var thumb = a.querySelector('img');
    dialog.classList.add('is-loading');
    imgEl.onload = imgEl.onerror = function () { dialog.classList.remove('is-loading'); };
    imgEl.alt = thumb ? thumb.alt : '';
    imgEl.src = a.href;
    renderCaption(a);
    var id = a.getAttribute('data-id');
    if (id && win.history && win.history.replaceState) {
      win.history.replaceState(null, '', HASH_PREFIX + id);
    }
    preload(current + 1);
    preload(current - 1);
  }

  function open(i, fromEl) {
    collect();
    opener = fromEl || null;
    body.classList.add('modal-active');
    if (hasModal) {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    show(i);
  }

  function close() {
    if (hasModal) {
      if (dialog.open) dialog.close();
    } else {
      dialog.removeAttribute('open');
      onClosed();
    }
  }

  function onClosed() {
    body.classList.remove('modal-active');
    imgEl.removeAttribute('src');
    current = -1;
    if (win.history && win.history.replaceState && win.location.hash.indexOf(HASH_PREFIX) === 0) {
      win.history.replaceState(null, '', win.location.pathname + win.location.search);
    }
    if (opener && opener.focus) opener.focus({ preventScroll: false });
    opener = null;
  }

  dialog.addEventListener('close', onClosed);

  dialog.querySelector('.lightbox-close').addEventListener('click', close);
  dialog.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });

  // Click on the empty area around the photo closes the viewer.
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) close();
  });

  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    else if (e.key === 'Escape' && !hasModal) { e.preventDefault(); close(); }
  });

  // Swipe (touch / pen). Vertical drags are left alone.
  var startX = null, startY = null;
  dialog.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    startX = e.clientX; startY = e.clientY;
  });
  dialog.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX, dy = e.clientY - startY;
    startX = startY = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      show(dx < 0 ? current + 1 : current - 1);
    }
  });
  dialog.addEventListener('pointercancel', function () { startX = startY = null; });

  // Open from a tile.
  main.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('.tile > a') : null;
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return; // let "open in new tab" work
    e.preventDefault();
    e.stopPropagation();
    collect();
    open(links.indexOf(a), a);
  });

  // Deep link: /#photo-9e4d2608 opens that photograph.
  function openFromHash() {
    var h = win.location.hash;
    if (h.indexOf(HASH_PREFIX) !== 0) return;
    var id = h.slice(HASH_PREFIX.length);
    collect();
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('data-id') === id) { open(i, links[i]); return; }
    }
  }
  openFromHash();
})();
