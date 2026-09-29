import { CONFIG } from './config.js';
import { Auth } from '../services/auth.js';
import { Forum } from '../services/forum.js';
import { Matching } from '../services/buddy.js';
import { Match } from '../services/match.js';
import { Profile } from '../services/profile.js';
import { Settings } from '../services/settings.js';
import { initHomeSearch } from '../../features/home/home.js';
import { initForumSearch } from '../../features/forum/forum.js';
import { searchEverything, sacHTML, bindSacItems, bindKeydown } from './search.js';
import { ScrollAnimation } from './scrollAnimation.js';
import { SmoothScroll } from './smoothScroll.js';

export const App = (() => {
  let activeAcDropdown = null;

  function init() {
    initDarkMode();
    initNavbarScroll();
    initReadingProgress();
    initHelpDropdown();
    initSettingsButton();
    initSidebarToggle();
    initSearch();
    initHeaderSearch();
    initUserDropdown();
    initIceBreakerCopy();
    initSmoothScroll();
    initEscapeClose();
    initFxCards();
    initPageHandlers();
    ScrollAnimation.init();
    SmoothScroll.init();
  }

  function initSettingsButton() {
    const btn = document.getElementById('settingsBtn');
    if (btn) btn.addEventListener('click', () => Settings.openModal());
  }

  function initPageHandlers() {
    window.addEventListener('pageChanged', (e) => {
      const page = e.detail.pageName;
      SmoothScroll.unlockAll();
      const sm = document.getElementById('settingsModal');
      if (sm) Settings.closeModal();
      // Double rAF instead of setTimeout(50): menunggu frame di mana layout
      // sudah selesai dihitung, tanpa tebakan milidetik.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (page === 'home') { initHookCards(); initHomeSearch(); }
        if (page === 'forum') { Forum.refresh(); initForumSearch(); }
        if (page === 'friend') Matching.init();
        if (page === 'match') Match.init();
        if (page === 'profile') Profile.init();
        ScrollAnimation.refresh();
      }));
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
      // .fx-card dan .reveal bisa berada di elemen yang sama (home.js,
      // match.js). Keduanya memakai `transform`, jadi tilt inline akan
      // menabrak animasi reveal. Reveal harus menang sampai selesai.
      if (card.classList.contains('is-animating')) return;
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

  /* Kartu hook hero memakai animasi masuk `heroHookIn ... both`. Setelah
     selesai, animasi tetap "tertanam" karena fill mode both, sehingga
     elemennya bisa tetap nempel di compositor. Diam-diam lepaskan begitu
     `animationend` datang. */
  function initHookCards() {
    const cards = document.querySelectorAll('.hero-hook-card');
    if (!cards.length) return;
    cards.forEach((card) => {
      card.addEventListener('animationend', (e) => {
        if (e.animationName === 'heroHookIn') card.style.animation = 'none';
      });
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
    let ticking = false;
    const check = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  function initReadingProgress() {
    const bar = document.getElementById('readingProgress');
    if (!bar) return;
    let ticking = false;
    const update = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const range = doc.scrollHeight - doc.clientHeight;
        bar.style.width = (range > 0 ? (doc.scrollTop / range) * 100 : 0) + '%';
        ticking = false;
      });
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
    const dropdown = document.getElementById('searchAutocomplete');
    const results = document.getElementById('searchResults');
    if (!btn || !overlay || !input || !dropdown) return;

    function closeSearch() {
      overlay.classList.remove('open');
      if (input) { input.blur(); input.value = ''; }
      if (results) results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>';
      dropdown.innerHTML = '';
      dropdown.classList.remove('open');
      activeAcDropdown = null;
    }

    function openSearch() { overlay.classList.add('open'); setTimeout(() => { if (input) input.focus(); }, 150); }
    btn.addEventListener('click', openSearch);
    if (close) close.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
    // Tombol magnifier disembunyikan di >=768px karena search bar inline sudah
    // ada (navbar.css), jadi overlay tetap harus bisa dibuka lewat Ctrl/Cmd+K.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'k' && e.key !== 'K') return;
      if (!(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      openSearch();
    });

    function update(q) {
      const items = searchEverything(q);
      if (results) results.innerHTML = items.length
        ? '<p class="text-sm" style="color:var(--text-muted);">' + items.length + ' hasil — klik item di atas</p>'
        : '<p class="text-sm" style="color:var(--text-muted);">Tidak ditemukan</p>';
      if (items.length) {
        dropdown.innerHTML = sacHTML(items);
        bindSacItems(dropdown, closeSearch);
        bindKeydown(input, dropdown);
        dropdown.classList.add('open');
      } else {
        dropdown.innerHTML = '';
        dropdown.classList.remove('open');
      }
    }

    input.addEventListener('input', () => { update(input.value.toLowerCase().trim()); });
  }

  /* Search bar besar di header. Memakai helper yang sama dengan
     initSearch() (searchEverything + sacHTML + bindSacItems + bindKeydown)
     supaya perilakanya identik dengan overlay, hanya ditampilkan inline.
     Navbar di-render sekali (router.js), jadi cukup di-bind sekali di init. */
  function initHeaderSearch() {
    const input = document.getElementById('headerSearchInput');
    const dropdown = document.getElementById('headerSearchAc');
    if (!input || !dropdown) return;

    function update() {
      const items = searchEverything(input.value.toLowerCase().trim());
      if (!items.length) {
        dropdown.innerHTML = '';
        dropdown.classList.remove('open');
        return;
      }
      dropdown.innerHTML = sacHTML(items);
      bindSacItems(dropdown, () => dropdown.classList.remove('open'));
      bindKeydown(input, dropdown);
      dropdown.classList.add('open');
    }

    function close() { dropdown.classList.remove('open'); }

    input.addEventListener('input', update);
    input.addEventListener('focus', () => { if (input.value.trim()) update(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    document.addEventListener('click', (e) => {
      if (dropdown.contains(e.target) || input === e.target) return;
      close();
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
    // Delegated di document: link yang di-render setelah init (halaman,
    // thread forum, hasil search) ikut ter-handle tanpa bind ulang.
    document.addEventListener('click', (e) => {
      const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const href = a.getAttribute('href');
      // "#/forum" adalah route, bukan anchor — biarkan router yang menangani.
      if (!href || href === '#' || href.startsWith('#/')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      SmoothScroll.scrollToEl(target);
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
