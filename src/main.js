import './styles/main.scss';
import { initializePage, getCurrentPage } from './utils/pageUtils.js';
import { initWebGLAnimation } from './components/webgl-animation.js';

// Initialize the page with navbar and footer
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = getCurrentPage();
  
  // Debug logging for deployment issues
  console.log('Current path:', window.location.pathname);
  console.log('Detected page:', currentPage);
  console.log('Body classes before:', document.body.className);
  
  initializePage(currentPage);
  
  console.log('Body classes after:', document.body.className);
  
  // Initialize WebGL animation for homepage
  if (currentPage === 'home') {
    initWebGLAnimation();
  }
});
