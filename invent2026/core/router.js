import { HomePage } from '../src/modules/home/home.js';
import { AboutPage } from '../src/modules/about/about.js';
import { ForumPage } from '../src/modules/forum/forum.js';
import { DiscussionPage } from '../src/modules/discussion/discussion.js';
import { MatchingPage } from '../src/modules/matching/matching.js';
import { ProfilePage } from '../src/modules/profile/profile.js';
import { FaqPage } from '../src/modules/faq/faq.js';

const routes = {
  '/': HomePage,
  '/tentang': AboutPage,
  '/forum': ForumPage,
  '/diskusi': DiscussionPage,
  '/matching': MatchingPage,
  '/profil': ProfilePage,
  '/faq': FaqPage,
};

let currentCleanup = null;

function getHashPath() {
  const hash = window.location.hash.replace('#', '') || '/';
  const qIndex = hash.indexOf('?');
  return qIndex === -1 ? hash : hash.substring(0, qIndex);
}

function getHashParams() {
  const hash = window.location.hash;
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return new URLSearchParams();
  return new URLSearchParams(hash.substring(qIndex + 1));
}

export function navigateTo(path) {
  if (path === '/') {
    window.location.hash = '#/';
  } else {
    window.location.hash = `#${path}`;
  }
}

function getRoute(path) {
  const route = routes[path];
  if (route) return route;
  return routes['/'];
}

async function renderRoute() {
  const path = getHashPath();
  const params = getHashParams();
  const pageFn = getRoute(path);

  const app = document.getElementById('app');
  if (!app) return;

  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  app.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;padding:80px 0;color:var(--text-secondary)"><div style="text-align:center"><div style="font-size:2rem;margin-bottom:12px">⏳</div>Memuat...</div></div>';

  try {
    const result = await pageFn(params);
    app.innerHTML = '';
    app.appendChild(result);

    window.dispatchEvent(new CustomEvent('route-change', {
      detail: { path, params }
    }));
  } catch (err) {
    console.error('Route render error:', err);
    app.innerHTML = '<div style="text-align:center;padding:80px 24px;color:var(--text-secondary)"><div style="font-size:3rem;margin-bottom:16px">😓</div><h3>Halaman tidak dapat dimuat</h3><p style="margin-top:8px">Coba refresh halaman atau kembali ke beranda.</p></div>';
  }
}

export function initRouter() {
  window.addEventListener('hashchange', renderRoute);
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/';
  } else {
    renderRoute();
  }
}
