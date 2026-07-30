/**
 * Footer Component (js/components/Footer.js)
 */
export const Footer = {
  render: () => `
    <div class="container footer-content">
      <p>&copy; ${new Date().getFullYear()} Adayuna. Dibuat dengan cinta untuk pembelajaran manusiawi.</p>
      <div style="display: flex; gap: 1.5rem;">
        <a href="#login" class="nav-link">Masuk</a>
        <a href="#dashboard" class="nav-link">Dashboard</a>
      </div>
    </div>
  `
};
