import { CONFIG } from './config.js';
import { Auth } from '../services/auth.js';
import { Forum } from '../services/forum.js';
import { Matching } from '../services/buddy.js';
import { Match } from '../services/match.js';
import { Profile } from '../services/profile.js';
import { Settings } from '../services/settings.js';
import { dataStore } from '../data/index.js';
import { initHomeSearch } from '../../features/home/home.js';
import { initForumSearch } from '../../features/forum/forum.js';

const CAT_LABELS = CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.label; return o; }, {});

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
        if (page === 'home') { initHomeTiles(); initHomeSearch(); }
        if (page === 'forum') { Forum.refresh(); initForumSearch(); }
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
        card.style.setProperty('--fx-x', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--fx-y', ((e.clientY - r.top) / r.height * 100) + '%');
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
    const ac = document.getElementById('searchAutocomplete');
    if (!btn || !overlay || !input) return;

    function closeSearch() {
      overlay.classList.remove('open');
      if (input) { input.blur(); input.value = ''; }
      const results = document.getElementById('searchResults');
      if (results) results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>';
      if (ac) ac.classList.remove('open');
      activeAcDropdown = null;
    }

    function openSearch() { overlay.classList.add('open'); setTimeout(() => { if (input) input.focus(); }, 150); }
    btn.addEventListener('click', openSearch);
    if (close) close.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

    function doSearch(q) {
      if (!q) {
        const results = document.getElementById('searchResults');
        if (results) results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>';
        if (ac) ac.classList.remove('open');
        return;
      }
      const seen = new Set();
      const items = [];
      dataStore.forum.forEach((t, idx) => {
        const hit = t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q) ||
          (t.category && CAT_LABELS[t.category] && CAT_LABELS[t.category].toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q));
        if (hit) { const key = 'forum-' + idx; if (!seen.has(key)) { seen.add(key); items.push({ type: 'forum', idx, title: t.title, icon: CONFIG.MAPELS.find(m => m.key === t.category)?.icon || 'fa-book', page: 'forum' }); } }
      });
      dataStore.buddies.forEach((b, idx) => {
        const hit = (b.name || '').toLowerCase().includes(q) || (b.mapel || '').toLowerCase().includes(q) || (b.kelas || '').toLowerCase().includes(q);
        if (hit) { const key = 'buddy-' + idx; if (!seen.has(key)) { seen.add(key); items.push({ type: 'buddy', idx, title: b.name, icon: 'fa-user-group', page: 'friend' }); } }
      });

      const results = document.getElementById('searchResults');
      if (results) results.innerHTML = items.length
        ? '<p class="text-sm" style="color:var(--text-muted);">' + items.length + ' hasil — klik item di atas</p>'
        : '<p class="text-sm" style="color:var(--text-muted);">Tidak ditemukan</p>';

      if (!ac) return;
      ac.innerHTML = items.slice(0, 8).map(r =>
        '<div class="sac-item" data-type="' + r.type + '" data-idx="' + r.idx + '" data-page="' + r.page + '">' +
          '<i class="fas ' + r.icon + ' sac-icon"></i>' +
          '<span class="sac-title">' + r.title + '</span>' +
          '<span class="sac-source">' + (r.type === 'forum' ? 'Forum' : 'Study Buddy') + '</span>' +
        '</div>'
      ).join('');
      ac.classList.add('open');
      activeAcDropdown = { input, container: ac };

      ac.querySelectorAll('.sac-item').forEach(el => {
        el.addEventListener('click', () => {
          const type = el.dataset.type, idx = Number(el.dataset.idx);
          ac.classList.remove('open');
          closeSearch();
          if (type === 'forum') { Router.navigate('forum'); setTimeout(function() { Forum.openThread(idx); }, 220); }
          else if (type === 'buddy') { Router.navigate('friend'); }
        });
        el.addEventListener('mouseenter', () => {
          ac.querySelectorAll('.sac-item').forEach(e => e.classList.remove('focused'));
          el.classList.add('focused');
        });
      });
    }

    input.addEventListener('input', () => { doSearch(input.value.toLowerCase().trim()); });

    input.addEventListener('keydown', (e) => {
      const items = ac ? ac.querySelectorAll('.sac-item') : [];
      if (!items.length) return;
      let focused = [...items].findIndex(el => el.classList.contains('focused'));
      if (e.key === 'ArrowDown') { e.preventDefault(); focused = Math.min(focused + 1, items.length - 1); items.forEach(function(el, i) { el.classList.toggle('focused', i === focused); }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focused = Math.max(focused - 1, 0); items.forEach(function(el, i) { el.classList.toggle('focused', i === focused); }); }
      else if (e.key === 'Enter' && focused >= 0) { e.preventDefault(); items[focused].click(); }
      else if (e.key === 'Tab' && focused >= 0) { e.preventDefault(); items[focused].click(); }
    });
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
