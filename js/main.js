/* ===== Edquest — Global Interactions ===== */

const Edquest = (() => {
  function init() {
    initDarkMode();
    initNavbarScroll();
    initSmoothScroll();
    initIceBreakerCopy();
  }

  /* ===== Dark Mode ===== */
  function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
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

    const mobileToggle = document.getElementById('darkModeToggleMobile');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('edquest_dark', isDark);
        updateToggleIcon(isDark);
      });
    }
  }

  function updateToggleIcon(isDark) {
    const toggle = document.getElementById('darkModeToggle');
    const mobileToggle = document.getElementById('darkModeToggleMobile');
    if (toggle) toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    if (mobileToggle) mobileToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  /* ===== Navbar Scroll Effect ===== */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-edquest');
    if (!navbar) return;

    const checkScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ===== Smooth Scroll for Anchor Links ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ===== Ice Breaker Copy ===== */
  function initIceBreakerCopy() {
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.addEventListener('click', () => {
        const text = el.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
          Auth.showToast('Teks disalin! Tinggal tempel di forum', 'success');
        }).catch(() => {
          Auth.showToast('Gagal menyalin teks', 'error');
        });
      });
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => Edquest.init());
