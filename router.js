const Router = (() => {
  const routes = {
    '/': 'home', 'home': 'home',
    'about': 'about',
    'forum': 'forum',
    'friend': 'friend',
    'faq': 'faq',
    'profile': 'profile'
  };

  let currentPage = null;

  function init() {
    document.getElementById('navbar-slot').innerHTML = renderNavbar();
    document.getElementById('sidebar-slot').innerHTML = renderSidebar();
    document.getElementById('footer-slot').innerHTML = renderFooter();
    document.getElementById('auth-slot').innerHTML = renderAuthModal();

    App.init();
    Auth.init();

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
  }

  function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const path = hash.split('?')[0].replace(/^\/+/, '');
    const pageName = routes[path] || 'home';

    if (pageName === currentPage && pageName !== 'home') return;
    currentPage = pageName;

    const fn = window['render' + capitalize(pageName)];
    const app = document.getElementById('app');
    if (fn && app) app.innerHTML = fn();

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
      const isActive = link.dataset.link === pageName;
      link.classList.toggle('active', isActive);
    });
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const isActive = link.dataset && link.dataset.link === pageName;
      if (link.dataset && link.dataset.link) link.classList.toggle('active', isActive);
    });
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return { init, navigate };
})();

document.addEventListener('DOMContentLoaded', () => Router.init());