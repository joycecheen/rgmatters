import { createNavbar, initNavbar } from '../components/navbar.js';
import { createFooter } from '../components/footer.js';

export function initializePage(currentPage = '') {
  // Add page-specific class to body for CSS targeting
  const body = document.body;
  
  // Remove any existing page classes
  body.classList.remove('home', 'contact-page', 'technology-page', 'products-page', 'about-page');
  
  // Add the appropriate page class
  switch (currentPage) {
    case 'home':
      body.classList.add('home');
      break;
    case 'contact':
      body.classList.add('contact-page');
      break;
    case 'technology':
      body.classList.add('technology-page');
      break;
    case 'products':
      body.classList.add('products-page');
      break;
    case 'about':
      body.classList.add('about-page');
      break;
    default:
      body.classList.add('home'); // Default to home
  }

  // Inject navbar and footer
  const navbar = createNavbar(currentPage);
  const footer = createFooter();
  
  // Insert navbar at the beginning of body
  body.insertAdjacentHTML('afterbegin', navbar);
  
  // Insert footer before closing body tag
  body.insertAdjacentHTML('beforeend', footer);
  
  // Initialize navbar functionality
  initNavbar();
}

export function getCurrentPage() {
  const path = window.location.pathname;
  
  if (path === '/' || path === '/index.html') {
    return 'home';
  } else if (path.includes('contact')) {
    return 'contact';
  } else if (path.includes('technology')) {
    return 'technology';
  } else if (path.includes('products')) {
    return 'products';
  } else if (path.includes('about')) {
    return 'about';
  }
  
  return 'home'; // Default fallback
}
