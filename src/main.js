import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/main.scss';

import { initHeader } from './components/header.js';
import { initReveal } from './components/reveal.js';

initHeader();
initReveal();

const heroCanvas = document.getElementById('hero-visual');
if (heroCanvas) {
  import('./components/hero-visual.js').then(({ initHeroVisual }) => initHeroVisual(heroCanvas));
}
