import '@fontsource-variable/host-grotesk';
import './styles/main.scss';

import { initHeader } from './scripts/header.js';
import { initReveal } from './scripts/reveal.js';

initHeader();
initReveal();

// The hero visual only exists on the home page; load it on demand.
const heroCanvas = document.querySelector('[data-hero-visual]');
if (heroCanvas) {
  import('./scripts/hero/index.js').then(({ initHeroVisual }) => initHeroVisual(heroCanvas));
}
