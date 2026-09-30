import { renderNavbar } from '../../components/layout/navbar/navbar.js';
import { renderSidebar } from '../../components/layout/sidebar/sidebar.js';
import { renderFooter } from '../../components/layout/footer/footer.js';
import { renderAuthModal } from '../../components/ui/auth-modal/auth-modal.js';
import { renderHome } from '../../features/home/home.js';
import { renderForum } from '../../features/forum/forum.js';
import { renderFriend } from '../../features/friend/friend.js';
import { renderAbout } from '../../features/about/about.js';
import { renderNotes } from '../../features/notes/notes.js';
import { renderProfile } from '../../features/profile/profile.js';
import { renderMatch } from '../../features/match/match.js';
import { SmoothScroll } from './smoothScroll.js';

export const Router = (() => {
  const routes = {
    '/': renderHome,
    'home': renderHome,
    'forum': renderForum,
    'friend': renderFriend,
    'match': renderMatch,
    'about': renderAbout,
    'profile': renderProfile,
    'catatan': renderNotes
  };

  // Page About dan FAQ digabung jadi satu halaman ber-tab demi batas
  // LIMITS.MAX_PAGES. Tautan lama `#/faq` (bookmark, hasil pencarian)
  // resolve di memori tanpa menulis ulang location, jadi tidak mungkin
  // memicu hashchange berulang.
  const ALIASES = { faq: 'about?tab=faq' };

  let currentKey = null;

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
    const parts = hash.split('?');
    const rawPath = parts[0].replace(/^\/+/, '');
    let path = rawPath;
    let query = parts.slice(1).join('?');

    const alias = ALIASES[rawPath];
    if (alias) {
      const a = alias.split('?');
      path = a[0];
      query = a[1] || query;
    }

    const render = routes[path] || routes.home;
    const pageName = path === '' ? 'home' : (routes[path] ? path : 'home');

    // Guard memakai key yang ikut query, bukan pageName saja: pindah dari
    // `#/catatan?note=a` ke `#/catatan?note=b` tetap harus merender ulang,
    // padahal pageName-nya sama.
    const routeKey = pageName + (query ? '?' + query : '');
    if (routeKey === currentKey && pageName !== 'home') return;
    currentKey = routeKey;

    const params = new URLSearchParams(query);
    const app = document.getElementById('app');
    if (render && app) app.innerHTML = render(params);

    updateNavActive(pageName);
    // Reset scroll secara INSTAN, bukan smooth: halaman baru masih dalam
    // keadaan reveal (opacity 0), jadi scroll halus akan terlihat sebagai
    // halaman kosong yang ter-scroll dari bawah ke atas.
    SmoothScroll.scrollToTop({ immediate: true });
    SmoothScroll.refresh();
    setTimeout(() => window.dispatchEvent(new CustomEvent('pageChanged', { detail: { pageName, query, params } })), 0);

    if (window.innerWidth < 768) {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.add('hidden');
    }
  }

  function navigate(page, query) {
    window.location.hash = '#/' + page + (query ? '?' + query : '');
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
