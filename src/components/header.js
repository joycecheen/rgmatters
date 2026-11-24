// Sticky header state + mobile navigation
export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const toggle = header.querySelector('.site-header__toggle');
  const nav = header.querySelector('.site-nav');
  const desktop = window.matchMedia('(min-width: 901px)');

  // Hairline border once the page has scrolled
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!toggle || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  desktop.addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}
