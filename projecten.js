// ---------------------------------------------------------
// Projecten: 3D-stapel waar je doorheen scrollt.
// Het vak in het midden staat recht; de rest kantelt weg.
// Klik op het middelste vak = project openen,
// klik op een ander vak = daarheen scrollen.
// ---------------------------------------------------------
(() => {
  const section = document.querySelector('.showcase');
  const stack = document.getElementById('stack');
  if (!section || !stack) return;

  const items = [...stack.querySelectorAll('.stack__item')];
  const n = items.length;
  section.style.setProperty('--n', n);

  const elNum = document.getElementById('sc-num');
  const elTitle = document.getElementById('sc-title');
  const elMeta = document.getElementById('sc-meta');
  const elCount = document.getElementById('sc-count');
  const elBar = document.getElementById('sc-bar');

  const dialog = document.getElementById('detail');
  const pad = (i) => String(i + 1).padStart(2, '0');
  let active = -1;
  let progress = 0;

  // Hoe ver de bezoeker door de sectie is gescrold → welk vak in het midden staat
  function readProgress() {
    const rect = section.getBoundingClientRect();
    const range = section.offsetHeight - window.innerHeight;
    const t = Math.min(Math.max(-rect.top / range, 0), 1);
    return t * (n - 1);
  }

  // Kanteling en grootte van een vak op afstand a (0 = midden)
  const rotAt = (a) => Math.min(a * 28, 66);
  const scaleAt = (a) => 1 - Math.min(a, 4) * 0.08;
  const P = 1400;                          // perspectief (px)
  const depthAt = (a) => Math.min(a, 4) * 160; // vakken verder weg liggen dieper

  function layout() {
    progress = readProgress();
    const h = items[0].querySelector('.card').offsetHeight;
    const gap = Math.max(10, h * 0.04);

    // Posities van de vakken op hele afstanden (0, 1, 2 …), zonder overlap:
    // elk vak komt net onder/boven het vorige, met een klein gaatje.
    const half = (k) =>
      (h * scaleAt(k) * Math.cos(rotAt(k) * Math.PI / 180) * (P / (P + depthAt(k)))) / 2;
    const pos = [0];
    for (let k = 1; k <= n; k++) pos[k] = pos[k - 1] + half(k - 1) + half(k) + gap;

    items.forEach((item, i) => {
      const d = i - progress;
      const a = Math.abs(d);
      const dir = Math.sign(d);
      const k = Math.floor(a);
      const f = a - k;
      const y = dir * (pos[k] + (pos[k + 1] - pos[k]) * f);
      const rot = -dir * rotAt(a);

      item.style.transform =
        `translateY(-50%) translateY(${y}px) perspective(${P}px) translateZ(${-depthAt(a)}px) rotateX(${rot}deg) scale(${scaleAt(a)})`;
      item.style.opacity = a > 2.6 ? Math.max(0, 1 - (a - 2.6) * 1.6) : 1;
      item.style.zIndex = String(100 - Math.round(a * 10));
      item.style.filter = `brightness(${1 - Math.min(a, 3) * 0.13})`;
    });

    const idx = Math.round(progress);
    if (idx !== active) setActive(idx);
    if (elBar) elBar.style.transform = `scaleY(${(progress + 1) / n})`;
  }

  function setActive(idx) {
    active = idx;
    items.forEach((it, i) => {
      it.classList.toggle('is-active', i === idx);
      const btn = it.querySelector('.card');
      btn.setAttribute('aria-label',
        i === idx ? `Open ${btn.dataset.title} (${btn.dataset.meta})` : `Ga naar project ${pad(i)}`);
    });
    const btn = items[idx].querySelector('.card');
    elNum.textContent = pad(idx);
    elTitle.textContent = btn.dataset.title;
    elMeta.textContent = btn.dataset.meta;
    if (elCount) elCount.textContent = `${pad(idx)} / ${String(n).padStart(2, '0')}`;
    [elNum, elTitle, elMeta].forEach((el) => {
      el.classList.remove('swap');
      void el.offsetWidth; // animatie opnieuw starten
      el.classList.add('swap');
    });
  }

  // ---------------------------------------------------------
  // Naar een bepaald vak scrollen, met een eigen soepele animatie
  // ---------------------------------------------------------
  const DURATION = 700; // ms per stap
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 'instant' omdat de site standaard 'smooth' scrollt; wij animeren zelf
  const jump = (y) => window.scrollTo({ top: y, behavior: 'instant' });
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let animating = false;
  let animEnd = 0;
  let rafId;

  function topFor(idx) {
    const range = section.offsetHeight - window.innerHeight;
    return section.offsetTop + (idx / (n - 1)) * range;
  }

  function goTo(idx) {
    idx = Math.max(0, Math.min(n - 1, idx));
    const from = window.scrollY;
    const to = topFor(idx);
    if (reduceMotion || Math.abs(to - from) < 2) { jump(to); return; }

    cancelAnimationFrame(rafId);
    animating = true;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      jump(from + (to - from) * ease(t));
      if (t < 1) rafId = requestAnimationFrame(step);
      else { animating = false; animEnd = performance.now(); }
    };
    rafId = requestAnimationFrame(step);
  }

  // Staat de stapel nu vast in beeld?
  function pinned() {
    const rect = section.getBoundingClientRect();
    return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
  }

  // ---------------------------------------------------------
  // Eén scroll (muiswiel of trackpad) = één vak verder
  // ---------------------------------------------------------
  let lastWheel = 0;

  window.addEventListener('wheel', (e) => {
    if (dialog.open || !pinned()) return;
    const dir = Math.sign(e.deltaY);
    if (!dir) return;

    // Bij het eerste vak omhoog of laatste vak omlaag: gewoon de pagina laten scrollen
    const cur = Math.round(readProgress());
    if ((dir < 0 && cur === 0) || (dir > 0 && cur === n - 1)) {
      if (!animating) return;
    }

    e.preventDefault();
    const now = performance.now();
    const gap = now - lastWheel;
    lastWheel = now;

    // Tijdens een animatie, of als het trackpad nog 'naveert', niets doen
    if (animating) return;
    if (gap < 180 && now - animEnd < 600) return;

    goTo(cur + dir);
  }, { passive: false });

  // ---------------------------------------------------------
  // Telefoon: één veeg = één vak verder
  // ---------------------------------------------------------
  let touchY = null;

  section.addEventListener('touchstart', (e) => {
    touchY = pinned() ? e.touches[0].clientY : null;
  }, { passive: true });

  section.addEventListener('touchmove', (e) => {
    if (touchY === null || dialog.open) return;
    const dy = touchY - e.touches[0].clientY;
    const cur = Math.round(readProgress());
    const dir = Math.sign(dy);
    const atEdge = (dir < 0 && cur === 0) || (dir > 0 && cur === n - 1);
    if (!atEdge) e.preventDefault();
  }, { passive: false });

  section.addEventListener('touchend', (e) => {
    if (touchY === null || dialog.open) return;
    const dy = touchY - e.changedTouches[0].clientY;
    touchY = null;
    if (Math.abs(dy) < 30 || animating) return;
    const cur = Math.round(readProgress());
    const dir = Math.sign(dy);
    if ((dir < 0 && cur === 0) || (dir > 0 && cur === n - 1)) return;
    goTo(cur + dir);
  });

  // Na gewoon scrollen (bijv. scrollbalk slepen) netjes op het dichtstbijzijnde vak laten vallen
  let snapTimer;
  function snap() {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      if (animating || !pinned()) return;
      const p = readProgress();
      if (Math.abs(p - Math.round(p)) > 0.04) goTo(Math.round(p));
    }, 200);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { layout(); ticking = false; });
    }
    snap();
  }, { passive: true });
  window.addEventListener('resize', layout);

  // Klikken

  items.forEach((item, i) => {
    item.querySelector('.card').addEventListener('click', () => {
      if (i !== active) { goTo(i); return; }
      openDetail(item.querySelector('.card'));
    });
  });

  function openDetail(btn) {
    document.getElementById('detail-title').textContent = btn.dataset.title;
    document.getElementById('detail-meta').textContent = btn.dataset.meta;
    document.getElementById('detail-text').textContent = btn.dataset.text;
    const media = document.getElementById('detail-media');
    media.innerHTML = '';
    media.appendChild(btn.firstElementChild.cloneNode(true));
    if (dialog.showModal) dialog.showModal();
  }

  dialog.addEventListener('click', (e) => {
    // sluiten via kruisje of klik buiten het venster
    if (e.target.closest('[data-close]') || e.target === dialog) dialog.close();
  });

  // Toetsenbord: pijltjes op/neer bladeren als de stapel in beeld is
  window.addEventListener('keydown', (e) => {
    if (dialog.open) return;
    if (!pinned() || animating) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
  });

  layout();
})();
