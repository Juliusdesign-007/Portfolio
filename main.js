// ---------------------------------------------------------
// Jaartal in de footer en leeftijd (geboren 20-10-2007)
// ---------------------------------------------------------
const now = new Date();

const year = document.getElementById('year');
if (year) year.textContent = now.getFullYear();

const ageEl = document.getElementById('age');
if (ageEl) {
  const born = new Date(2007, 9, 20);
  let age = now.getFullYear() - born.getFullYear();
  if (now < new Date(now.getFullYear(), born.getMonth(), born.getDate())) age--;
  ageEl.textContent = age;
}

// ---------------------------------------------------------
// Menu: groot bovenaan, kleiner zwevend balkje bij scrollen
// ---------------------------------------------------------
const nav = document.getElementById('nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function onScroll() {
  if (nav) nav.classList.toggle('nav--small', window.scrollY > 40);
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---------------------------------------------------------
// Elementen laten verschijnen tijdens het scrollen
// ---------------------------------------------------------
const revealEls = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ---------------------------------------------------------
// Foto in de grote header beweegt iets langzamer mee (diepte)
// ---------------------------------------------------------
const heroPhoto = document.querySelector('[data-parallax]');

if (heroPhoto && !reduceMotion) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 900);
      heroPhoto.style.setProperty('--py', `${y * 0.18}px`);
      ticking = false;
    });
  }, { passive: true });
}
