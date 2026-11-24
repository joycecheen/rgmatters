// Subtle fade-up for content as it scrolls into view.
//
// Progressive enhancement: elements opt in with [data-reveal]. Nothing is
// hidden unless this script runs, and anything already on screen at load is
// left alone, so there is never a flash of hidden content.
export function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fold = window.innerHeight * 0.92;
  const targets = [...document.querySelectorAll('[data-reveal]')].filter(
    (el) => el.getBoundingClientRect().top > fold,
  );
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      // Stagger only the elements that arrive together (e.g. a row of cards)
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.style.setProperty('--reveal-order', String(Math.min(order++, 6)));
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => observer.observe(el));
}
