export const ScrollAnimation = (() => {
  let observer = null;
  let backToTopBtn = null;
  let fallbackTimer = null;
  const SCROLL_THRESHOLD = 400;
  const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur';
  const COUNTER_SELECTOR = '[data-counter]';

  function init() {
    setupObserver();
    setupBackToTop();
    observeAll();
    setupScrollFallback();
    setupTimeoutFallback();
  }

  function setupObserver() {
    if (observer) observer.disconnect();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(el => el.classList.add('visible'));
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px 0px 0px'
    });
  }

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }

  function observeAll() {
    if (!observer) return;
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      if (!el.classList.contains('visible')) {
        if (isInViewport(el)) {
          el.classList.add('visible');
        } else {
          observer.observe(el);
        }
      }
    });
  }

  function setupScrollFallback() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
          if (!el.classList.contains('visible') && isInViewport(el)) {
            el.classList.add('visible');
            if (observer) observer.unobserve(el);
          }
        });
        ticking = false;
      });
    }, { passive: true });
  }

  function setupTimeoutFallback() {
    if (fallbackTimer) clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(() => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (!el.classList.contains('visible')) {
          el.classList.add('visible');
        }
      });
    }, 1500);
  }

  function refresh() {
    setTimeout(() => {
      observeAll();
      observeCounters();
      setupTimeoutFallback();
    }, 80);
  }

  function setupBackToTop() {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTopBtn);
    window.addEventListener('scroll', () => {
      if (!backToTopBtn) return;
      backToTopBtn.classList.toggle('visible', window.scrollY > SCROLL_THRESHOLD);
    }, { passive: true });
  }

  function observeCounters() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(COUNTER_SELECTOR).forEach((el) => {
        const target = parseInt(el.dataset.counter, 10);
        if (!isNaN(target)) el.textContent = target;
      });
      return;
    }
    if (!('IntersectionObserver' in window)) return;
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);
        animateCounter(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(COUNTER_SELECTOR).forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    if (isNaN(target)) return;
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return { init, refresh };
})();
