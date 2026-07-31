const App = (() => {
  function init() {
    initDarkMode();
    initNavbarScroll();
    initSidebarToggle();
    initSearch();
    initUserDropdown();
    initIceBreakerCopy();
    initSmoothScroll();
  }

  function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const sidebarToggle = document.getElementById('sidebarDarkToggle');
    if (!toggle) return;
    const saved = localStorage.getItem('edquest_dark');
    if (saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      updateToggleIcon(true);
    }
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('edquest_dark', isDark);
      updateToggleIcon(isDark);
    });
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('edquest_dark', isDark);
        updateToggleIcon(isDark);
      });
    }
  }

  function updateToggleIcon(isDark) {
    const t1 = document.getElementById('darkModeToggle');
    const t2 = document.getElementById('sidebarDarkToggle');
    if (t1) t1.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    if (t2) t2.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  function initNavbarScroll() {
    const navbar = document.querySelector('.top-navbar');
    if (!navbar) return;
    const check = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', check, { passive: true });
    check();
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
    btn.addEventListener('click', () => {
      overlay.classList.remove('hidden');
      setTimeout(() => { if (input) input.focus(); }, 100);
    });
    if (close) close.addEventListener('click', () => overlay.classList.add('hidden'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
    if (input && results) {
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        if (!q) { results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>'; return; }
        const forumData = window.ForumData || [];
        const filtered = forumData.filter(t => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q));
        if (filtered.length === 0) {
          results.innerHTML = '<p class="text-sm" style="color:var(--text-muted);">Tidak ditemukan</p>';
        } else {
          results.innerHTML = filtered.slice(0, 6).map(t => `
            <div class="p-3 rounded-lg cursor-pointer" style="background:var(--bg-body);border:1px solid var(--border-color);" onclick="Router.navigate('forum'); document.getElementById('searchOverlay').classList.add('hidden')">
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
    Auth.showToast('Terima kasih, ' + name + '! Pesan kamu sudah dikirim.', 'success');
    e.target.reset();
  }

  return { init, submitContact };
})();