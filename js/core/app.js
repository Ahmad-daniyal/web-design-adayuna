import { CONFIG } from './config.js';
import { Auth } from '../services/auth.js';
import { Forum } from '../services/forum.js';
import { Matching } from '../services/buddy.js';
import { Match } from '../services/match.js';
import { Profile } from '../services/profile.js';
import { Settings } from '../services/settings.js';
import { dataStore } from '../data/index.js';

const MAPEL_LABELS = CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.label; return o; }, {});

export const App = (() => {
  let activeAcDropdown = null;

  function init() {
    initDarkMode();
    initNavbarScroll();
    initReadingProgress();
    initHelpDropdown();
    initSidebarToggle();
    initSearch();
    initUserDropdown();
    initIceBreakerCopy();
    initSmoothScroll();
    initEscapeClose();
    initFxCards();
    initPageHandlers();
  }

  function initPageHandlers() {
    window.addEventListener('pageChanged', (e) => {
      const page = e.detail.pageName;
      document.body.style.overflow = '';
      const sm = document.getElementById('settingsModal');
      if (sm) Settings.closeModal();
      setTimeout(() => {
        if (page === 'home') initHomeTiles();
        if (page === 'forum') Forum.refresh();
        if (page === 'friend') Matching.init();
        if (page === 'match') Match.init();
        if (page === 'profile') Profile.init();
      }, 50);
    });
  }

  function initFxCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let current = null;
    let rafId = 0;
    const reset = () => {
      if (current) { current.style.transform = ''; current = null; }
    };
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest ? e.target.closest('.fx-card') : null;
      if (card !== current) { reset(); current = card; }
      if (!card) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        if (!r.width) return;
        card.style.setProperty('--fx-x', (px) => (e.clientX - r.left) / r.width * 100 + '%');
        card.style.setProperty('--fx-y', (py) => (e.clientY - r.top) / r.height * 100 + '%');
        card.style.transform = 'translateY(-6px) scale(1.02)';
      });
    }, { passive: true });
    document.addEventListener('pointerleave', reset);
    document.addEventListener('scroll', reset, { passive: true, capture: true });
  }

  function initHomeTiles() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const tiles = document.querySelectorAll('.hero-tile');
    if (!tiles.length) return;
    tiles.forEach((tile) => {
      const card = tile.querySelector('.hero-tile-card');
      if (!card) return;
      card.addEventListener('animationend', (e) => {
        if (e.animationName === 'heroTileIn') card.style.animation = 'none';
      });
      if (reduceMotion || isCoarse) return;
      const BASE = 'translateY(-10px) scale(1.06) ';
      tile.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) / r.width * 100 + '%');
        card.style.setProperty('--my', (e.clientY - r.top) / r.height * 100 + '%');
        card.style.transform = `${BASE}perspective(700px) rotateX(${(e.clientY - r.top) / r.height * -14}deg) rotateY(${(e.clientX - r.left) / r.width * 14}deg)`;
      });
      tile.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  function initEscapeClose() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      Settings.closeModal();
      Auth.closeModal();
      closeAllAutocomplete();
    });
  }

  function initDarkMode() {
    const apply = (isDark) => {
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem(CONFIG.STORAGE_KEYS.DARK, isDark);
      const toggle = document.getElementById('darkModeToggle');
      if (toggle) { toggle.classList.toggle('is-dark', isDark); toggle.setAttribute('aria-checked', isDark); }
    };
    const toggle = document.getElementById('darkModeToggle');
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.DARK);
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
      const pct = doc.scrollHeight - doc.clientHeight > 0 ? (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initHelpDropdown() {
    const btn = document.getElementById('helpBtn');
    const dd = document.getElementById('helpDropdown');
    if (!btn || !dd) return;
    btn.addEventListener('click', (e) => { e.stopPropagation(); dd.classList.toggle('hidden'); });
    document.addEventListener('click', (e) => { if (!dd.contains(e.target) && e.target !== btn) dd.classList.add('hidden'); });
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
      overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });
    }
  }

  function closeAllAutocomplete() {
    document.querySelectorAll('.search-ac-dropdown, .sac-autocomplete').forEach(dd => dd.classList.remove('open'));
    document.querySelectorAll('.sac-item.focused').forEach(el => el.classList.remove('focused'));
    activeAcDropdown = null;
  }


  function initSearch() {
    const btn = document.getElementById('searchBtn');
    const overlay = document.getElementById('searchOverlay');
    const close = document.getElementById('searchClose');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!btn || !overlay) return;
    const openSearch = () => { overlay.classList.add('open'); setTimeout(() => { if (input) input.focus(); }, 150); };
    const closeSearch = () => {
      overlay.classList.remove('open');
      if (input) { input.blur(); input.value = ''; }
      if (results) results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>';
      const ac = document.getElementById('searchAutocomplete');
      if (ac) ac.classList.remove('open');
      activeAcDropdown = null;
    };
    btn.addEventListener('click', openSearch);
    if (close) close.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

    if (input && results) {
      const filtered = dataStore.forum;
      const getFiltered = (q) => filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        (t.category && MAPEL_LABELS[t.category] && MAPEL_LABELS[t.category].toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );

      input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        if (!q) { results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>'; return; }
        const matched = getFiltered(q);
        if (matched.length === 0) {
          results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Tidak ditemukan</p>';
          const ac = document.getElementById('searchAutocomplete');
          if (ac) ac.classList.remove('open');
          return;
        }
        results.innerHTML = matched.slice(0, 6).map(t => `
          <div class="p-3 rounded-lg cursor-pointer" style="background:var(--bg-body);border:1px solid var(--border-color);" onclick="Router.navigate('forum'); setTimeout(function(){ const idx=dataStore.forum.findIndex(x=>x.title==='${t.title}'); if(idx>=0)Forum.openThread(idx); document.getElementById('searchOverlay').classList.remove('open') }, 150)">
            <p class="text-sm font-medium" style="color:var(--text-primary);">${t.title}</p>
            <p class="text-xs" style="color:var(--text-muted);"><i class="fas ${CONFIG.MAPELS.find(m=>m.key===t.category)?.icon||'fa-book'} mr-1"></i>${MAPEL_LABELS[t.category]||t.category}</p>
          </div>
        `).join('');
        const ac = document.getElementById('searchAutocomplete');
        if (ac) {
          ac.innerHTML = matched.slice(0, 6).map(t => `
            <div class="sac-item" data-page="forum" data-id="">
              <i class="fas fa-search sac-icon"></i>
              <span class="sac-title">${t.title}</span>
              <span class="sac-source">Forum</span>
            </div>
          `).join('');
          ac.classList.add('open');
          activeAcDropdown = { input, container: ac };
        }
      });
    }
  }

  function initUserDropdown() {
    const btn = document.getElementById('userMenuBtn');
    const dropdown = document.getElementById('userDropdown');
    if (btn && dropdown) {
      btn.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); });
      document.addEventListener('click', (e) => { if (!dropdown.contains(e.target) && e.target !== btn) dropdown.classList.add('hidden'); });
    }
    document.addEventListener('pageChanged', () => { const dd = document.getElementById('userDropdown'); if (dd) dd.classList.add('hidden'); });
  }

  function initIceBreakerCopy() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('[data-copy]');
      if (!card) return;
      const text = card.dataset.copy;
      navigator.clipboard.writeText(text).then(() => { Auth.showToast('Teks disalin! Tinggal tempel di forum', 'success'); }).catch(() => { Auth.showToast('Gagal menyalin teks', 'error'); });
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