import { Router } from '../router.js';
import { Auth } from './auth.js';
import { Forum } from './forum.js';
import { Matching } from './friend.js';
import { Profile } from './profile.js';
import { Settings } from './settings.js';
import { ForumData } from './data.js';

export const App = (() => {
  function init() {
    initDarkMode();
    initNavbarScroll();
    initReadingProgress();
    initFocusMode();
    initHelpDropdown();
    initSidebarToggle();
    initSearch();
    initUserDropdown();
    initIceBreakerCopy();
    initSmoothScroll();
    initEscapeClose();
    initPageHandlers();
  }

  function initPageHandlers() {
    window.addEventListener('pageChanged', (e) => {
      const page = e.detail.pageName;
      document.body.style.overflow = '';
      const sm = document.getElementById('settingsModal');
      if (sm) Settings.closeModal();
      setTimeout(() => {
        if (page === 'forum') Forum.refresh();
        if (page === 'friend') Matching.init();
        if (page === 'profile') Profile.init();
      }, 50);
    });
  }

  function initEscapeClose() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const dm = document.getElementById('discussionModal');
      if (dm && dm.classList.contains('active')) {
        dm.classList.remove('active');
        document.body.style.overflow = '';
      }
      Settings.closeModal();
      Auth.closeModal();
    });
  }

  function initDarkMode() {
    const apply = (isDark) => {
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('edquest_dark', isDark);
      const toggle = document.getElementById('darkModeToggle');
      if (toggle) {
        toggle.classList.toggle('is-dark', isDark);
        toggle.setAttribute('aria-checked', isDark);
      }
    };
    const toggle = document.getElementById('darkModeToggle');
    const saved = localStorage.getItem('edquest_dark');
    const isDark = saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    apply(isDark);
    if (toggle) toggle.addEventListener('click', () => apply(!document.documentElement.classList.contains('dark')));
  }

  function initNavbarScroll() {
    const navbar = document.querySelector('.top-navbar');
    if (!navbar) return;
    const check = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  function initReadingProgress() {
    const bar = document.getElementById('readingProgress');
    if (!bar) return;
    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initFocusMode() {
    const btn = document.getElementById('focusModeToggle');
    if (!btn) return;
    const apply = (active) => {
      document.body.classList.toggle('focus-mode', active);
      document.documentElement.classList.remove('focus-mode-ready');
      const icon = btn.querySelector('i');
      if (icon) icon.className = active ? 'fas fa-compress' : 'fas fa-expand';
      btn.title = active ? 'Keluar Mode Fokus' : 'Mode Fokus';
    };
    apply(localStorage.getItem('edquest_focus') === 'true');
    btn.addEventListener('click', () => {
      const active = !document.body.classList.contains('focus-mode');
      localStorage.setItem('edquest_focus', active);
      apply(active);
      Auth.showToast(active ? 'Mode Fokus aktif, sidebar disembunyikan' : 'Mode Fokus nonaktif', 'info');
    });
  }

  function initHelpDropdown() {
    const btn = document.getElementById('helpBtn');
    const dd = document.getElementById('helpDropdown');
    if (!btn || !dd) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dd.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target) && e.target !== btn) dd.classList.add('hidden');
    });
    document.addEventListener('pageChanged', () => dd.classList.add('hidden'));
  }

  function initSidebarToggle() {
    const btn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('hidden');
    });
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
      });
    }
  }

  function initSearch() {
    const btn = document.getElementById('searchBtn');
    const overlay = document.getElementById('searchOverlay');
    const close = document.getElementById('searchClose');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!btn || !overlay) return;
    const openSearch = () => {
      overlay.classList.add('open');
      setTimeout(() => { if (input) input.focus(); }, 150);
    };
    const closeSearch = () => {
      overlay.classList.remove('open');
      if (input) input.blur();
      if (input) input.value = '';
      if (results) results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>';
    };
    btn.addEventListener('click', openSearch);
    if (close) close.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
    if (input && results) {
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        if (!q) { results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>'; return; }
        const filtered = ForumData.filter(t => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q));
        if (filtered.length === 0) {
          results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Tidak ditemukan</p>';
        } else {
          results.innerHTML = filtered.slice(0, 6).map(t => `
            <div class="p-3 rounded-lg cursor-pointer" style="background:var(--bg-body);border:1px solid var(--border-color);" onclick="Router.navigate('forum'); setTimeout(function(){ Forum.openThread(${ForumData.indexOf(t)}); document.getElementById('searchOverlay').classList.remove('open') }, 120)">
              <p class="text-sm font-medium" style="color:var(--text-primary);">${t.title}</p>
              <p class="text-xs" style="color:var(--text-muted);">${t.subtitle}</p>
            </div>
          `).join('');
        }
      });
    }
  }

  function initUserDropdown() {
    const btn = document.getElementById('userMenuBtn');
    const dropdown = document.getElementById('userDropdown');
    if (btn && dropdown) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== btn) dropdown.classList.add('hidden');
      });
    }
    document.addEventListener('pageChanged', () => {
      const dd = document.getElementById('userDropdown');
      if (dd) dd.classList.add('hidden');
    });
  }

  function initIceBreakerCopy() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('[data-copy]');
      if (!card) return;
      const text = card.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        Auth.showToast('Teks disalin! Tinggal tempel di forum', 'success');
      }).catch(() => {
        Auth.showToast('Gagal menyalin teks', 'error');
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      if (a.getAttribute('href').startsWith('#/')) return;
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function submitContact(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    Auth.showToast('Terima kasih, ' + name + '! Pesan lu sudah dikirim.', 'success');
    e.target.reset();
  }

  return { init, submitContact };
})();

window.Auth = Auth;
window.Settings = Settings;
window.Forum = Forum;
window.Matching = Matching;
window.App = App;
window.Router = Router;

Router.init();
App.init();
Auth.init();
