import { renderNavbar } from './component/navbar.js';
import { renderSidebar } from './component/sidebar.js';
import { renderFooter } from './component/footer.js';
import { renderAuthModal } from './component/auth-modal.js';
import { renderHome } from './page/home.js';
import { renderForum } from './page/forum.js';
import { renderFriend } from './page/friend.js';
import { renderAbout } from './page/about.js';
import { renderFaq } from './page/faq.js';
import { renderProfile } from './page/profile.js';

export const Router = (() => {
  const routes = {
    '/': renderHome,
    'home': renderHome,
    'forum': renderForum,
    'friend': renderFriend,
    'about': renderAbout,
    'faq': renderFaq,
    'profile': renderProfile
  };

  let currentPage = null;

  function init() {
    document.getElementById('navbar-slot').innerHTML = renderNavbar();
    document.getElementById('sidebar-slot').innerHTML = renderSidebar();
    document.getElementById('footer-slot').innerHTML = renderFooter();
    document.getElementById('auth-slot').innerHTML = renderAuthModal();

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
  }

  function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const path = hash.split('?')[0].replace(/^\/+/, '');
    const render = routes[path] || routes.home;
    const pageName = path === '' ? 'home' : (routes[path] ? path : 'home');

    if (pageName === currentPage && pageName !== 'home') return;
    currentPage = pageName;

    const app = document.getElementById('app');
    if (render && app) app.innerHTML = render();

    updateNavActive(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('pageChanged', { detail: { pageName } }));

    if (window.innerWidth < 768) {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.add('hidden');
    }
  }

  function navigate(page) {
    window.location.hash = '#/' + page;
  }

  function updateNavActive(pageName) {
    document.querySelectorAll('[data-link]').forEach(link => {
      link.classList.toggle('active', link.dataset.link === pageName);
    });
    document.querySelectorAll('.sidebar-link').forEach(link => {
      if (link.dataset && link.dataset.link) link.classList.toggle('active', link.dataset.link === pageName);
    });
  }

  return { init, navigate };
})();
