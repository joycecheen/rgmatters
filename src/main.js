import './styles/main.scss';
import { initializePage, getCurrentPage } from './utils/pageUtils.js';
import { initWebGLAnimation } from './components/webgl-animation.js';

// Initialize the page with navbar and footer
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = getCurrentPage();
  initializePage(currentPage);
  
  // Initialize WebGL animation for homepage
  if (currentPage === 'home') {
    initWebGLAnimation();
  }
});
