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

  // Naar een bepaald vak scrollen
  function goTo(idx) {
    idx = Math.max(0, Math.min(n - 1, idx));
    const range = section.offsetHeight - window.innerHeight;
    const top = section.offsetTop + (idx / (n - 1)) * range;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Na het scrollen netjes op het dichtstbijzijnde vak laten vallen
  let snapTimer;
  function snap() {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const rect = section.getBoundingClientRect();
      const inside = rect.top < 0 && rect.bottom > window.innerHeight;
      if (!inside) return;
      const p = readProgress();
      if (Math.abs(p - Math.round(p)) > 0.04) goTo(Math.round(p));
    }, 160);
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
  const dialog = document.getElementById('detail');

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
    const rect = section.getBoundingClientRect();
    if (!(rect.top <= 1 && rect.bottom >= window.innerHeight - 1)) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
  });

  layout();
})();
