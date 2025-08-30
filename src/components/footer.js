// Footer Component
export function createFooter() {
  // Get the base path for GitHub Pages deployment
  const basePath = window.location.hostname.includes('github.io') ? '/rgmatters/' : '';
  
  const footerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <!-- Left Column: Logo and Tagline -->
          <div class="footer__column">
            <div class="footer__logo">
              <div class="footer__logo-icon"></div>
            </div>
            <div class="footer__tagline">
              <p>Hybrid Materials for Radiation</p>
              <p>Scintillation and Detection</p>
            </div>
          </div>

          <!-- Middle Column: Quick Links -->
          <div class="footer__column">
            <h3 class="footer__title">Quick Links</h3>
            <ul class="footer__links">
              <li><a href="${basePath}index.html">Home</a></li>
              <li><a href="${basePath}technology.html">Our Technology</a></li>
              <li><a href="${basePath}products.html">Our Products</a></li>
              <li><a href="${basePath}about.html">About Us</a></li>
              <li><a href="${basePath}contact.html">Contact</a></li>
            </ul>
          </div>

          <!-- Right Column: Contact Info -->
          <div class="footer__column">
            <h3 class="footer__title">Contact Us</h3>
            <div class="footer__contact">
              <div class="footer__contact-item">
                <svg class="footer__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#007EA4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="#007EA4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>info@rgmatters.com</span>
              </div>
              <div class="footer__contact-item">
                <svg class="footer__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#007EA4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="#007EA4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="footer__address">
                  <span>1729 W. Paul Dirac Drive</span>
                  <span>Tallahassee, FL 32303</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright Section -->
        <div class="footer__bottom">
          <hr class="footer__divider">
          <p class="footer__copyright">© 2025 Roentgen Matters LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
  
  return footerHTML;
}
