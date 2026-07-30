/**
 * Navbar Component (js/components/Navbar.js)
 */
import { Store } from '../store.js';

export const Navbar = {
  render: (currentRoute) => {
    const user = Store.getUser();
    const userBadgeHtml = user ? `
      <a href="#dashboard" class="user-profile-badge">
        <span class="avatar-circle">${user.name.charAt(0).toUpperCase()}</span>
        <span>${user.name}</span>
      </a>
    ` : `
      <a href="#login" class="btn btn-outline" style="padding:0.4rem 0.9rem; font-size:0.85rem;">Masuk</a>
    `;

    const links = [
      { route: '#home', label: 'Beranda' },
      { route: '#dashboard', label: 'Dashboard' },
      { route: '#materi', label: 'Materi' },
      { route: '#flashcard', label: 'Flashcard' },
      { route: '#pomodoro', label: 'Pomodoro' },
      { route: '#kuis', label: 'Kuis' }
    ];

    const navLinksHtml = links.map(link => `
      <a href="${link.route}" class="nav-link ${currentRoute === link.route ? 'active' : ''}">${link.label}</a>
    `).join('');

    return `
      <div class="container header-container">
        <a href="#home" class="brand-logo">
          <span class="logo-badge">a</span>
          <span>adayuna</span>
        </a>

        <nav class="nav-links" id="navLinks">
          ${navLinksHtml}
        </nav>

        <div class="header-actions">
          <button class="theme-toggle-btn" id="themeToggleBtn" aria-label="Ganti Tema">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </button>
          <div id="headerProfileArea">${userBadgeHtml}</div>
          <button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Menu Mobile">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    `;
  },
  attachEvents: () => {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        const nextTheme = isDark ? 'light' : 'dark';
        if (nextTheme === 'dark') document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
        Store.setTheme(nextTheme);
      });
    }

    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  }
};
