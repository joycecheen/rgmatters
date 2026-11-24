// Subtle fade-up for content below the fold.
// Progressive enhancement: nothing is hidden unless JS runs, and anything
// already in view on load is left untouched (no flash).
const SELECTOR = [
  '.section-head',
  '.split__head',
  '.challenge__body > *',
  '.tradeoff__item',
  '.solution__media',
  '.solution__text',
  '.feature-grid', // revealed as one unit: its hairlines are the grid background
  '.stat',
  '.product-intro > *',
  '.form-tile',
  '.capability',
  '.inquiry-card',
  '.story__media',
  '.story__body',
  '.contact-card',
  '.about-intro',
].join(',');

export function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const viewportH = window.innerHeight;
  const targets = [...document.querySelectorAll(SELECTOR)].filter(
    (el) => el.getBoundingClientRect().top > viewportH * 0.92
  );
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      // Stagger only the elements that enter together (e.g. a row of cards)
      let i = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.style.setProperty('--reveal-i', String(Math.min(i++, 6)));
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  targets.forEach((el) => io.observe(el));
}
