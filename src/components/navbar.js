// Navbar Component
export function createNavbar(currentPage = '') {
  const navbarHTML = `
    <nav class="nav">
      <div class="container nav__bar">
        <div class="logo">
          <a href="index.html">
            <div class="logo__icon"></div>
          </a>
        </div>
        <button class="nav__toggle" aria-label="Toggle navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav__links">
          <li><a href="index.html" ${currentPage === 'home' ? 'class="is-active"' : ''}>Home</a></li>
          <li><a href="technology.html" ${currentPage === 'technology' ? 'class="is-active"' : ''}>Our Technology</a></li>
          <li><a href="products.html" ${currentPage === 'products' ? 'class="is-active"' : ''}>Our Products</a></li>
          <li><a href="about.html" ${currentPage === 'about' ? 'class="is-active"' : ''}>About Us</a></li>
          <li><a class="btn" href="contact.html" ${currentPage === 'contact' ? 'class="btn is-active"' : ''}>Contact Us</a></li>
        </ul>
      </div>
    </nav>
  `;
  
  return navbarHTML;
}

// Initialize navbar functionality
export function initNavbar() {
  // Mobile menu toggle functionality
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
}
