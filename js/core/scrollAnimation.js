export const ScrollAnimation = (() => {
  let observer = null;
  let counterObserver = null;
  let backToTopBtn = null;
  let armedTimers = [];
  let refreshToken = 0;
  const SCROLL_THRESHOLD = 400;
  const REVEAL_SELECTOR = ':is(.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur)';
  const HIDDEN_REVEAL_SELECTOR = `${REVEAL_SELECTOR}:not(.visible)`;
  const COUNTER_SELECTOR = '[data-counter]';
  const SCROLL_SETTLE_MS = 140;
  const SCROLL_SETTLE_MAX_MS = 1200;
  const REVEAL_MARGIN = 80;
  const FALLBACK_VISIBLE_MS = 400;
  const FALLBACK_ALL_MS = 1500;

  function supportsScrollEnd() {
    return 'onscrollend' in window;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function init() {
    setupObserver();
    setupBackToTop();
    setupScrollFallback();
    refresh();
  }

  function setupObserver() {
    if (observer) observer.disconnect();
    if (prefersReducedMotion()) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('visible'));
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) show(entry.target);
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px 0px 0px'
    });
  }

  function show(el) {
    el.classList.add('visible');
    if (observer) observer.unobserve(el);
  }

  function hiddenRevealEls() {
    return document.querySelectorAll(HIDDEN_REVEAL_SELECTOR);
  }

  function shouldRevealNow(el) {
    const rect = el.getBoundingClientRect();
    if (rect.left >= window.innerWidth || rect.right <= 0) return false;
    return rect.top < window.innerHeight + REVEAL_MARGIN;
  }

  function observeAll() {
    hiddenRevealEls().forEach((el) => {
      if (shouldRevealNow(el)) show(el);
      else if (observer) observer.observe(el);
    });
  }

  function whenScrollSettled(cb) {
    if (window.scrollY <= 0) { cb(); return; }
    let done = false;
    let debounce = 0;
    let hardCap = 0;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(debounce);
      clearTimeout(hardCap);
      window.removeEventListener('scroll', onScroll);
      if (supportsScrollEnd()) window.removeEventListener('scrollend', finish);
      cb();
    };
    const onScroll = () => {
      clearTimeout(debounce);
      debounce = setTimeout(finish, SCROLL_SETTLE_MS);
    };
    hardCap = setTimeout(finish, SCROLL_SETTLE_MAX_MS);
    window.addEventListener('scroll', onScroll, { passive: true });
    if (supportsScrollEnd()) window.addEventListener('scrollend', finish);
  }

  function clearArmedTimers() {
    armedTimers.forEach((t) => clearTimeout(t));
    armedTimers = [];
  }

  function armFallback() {
    clearArmedTimers();
    armedTimers.push(setTimeout(() => {
      hiddenRevealEls().forEach((el) => {
        if (el.getBoundingClientRect().bottom > 0) show(el);
      });
    }, FALLBACK_VISIBLE_MS));
    armedTimers.push(setTimeout(() => {
      hiddenRevealEls().forEach((el) => show(el));
    }, FALLBACK_ALL_MS));
  }

  function refresh() {
    const token = ++refreshToken;
    clearArmedTimers();

    const run = () => {
      if (token !== refreshToken) return;
      observeAll();
      observeCounters();
      armFallback();
    };

    requestAnimationFrame(() => requestAnimationFrame(run));
    whenScrollSettled(() => {
      requestAnimationFrame(() => requestAnimationFrame(run));
    });
  }

  function setupScrollFallback() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        hiddenRevealEls().forEach((el) => {
          if (shouldRevealNow(el)) show(el);
        });
        ticking = false;
      });
    }, { passive: true });
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
    if (counterObserver) {
      counterObserver.disconnect();
      counterObserver = null;
    }
    if (prefersReducedMotion()) {
      document.querySelectorAll(COUNTER_SELECTOR).forEach((el) => {
        const target = parseInt(el.dataset.counter, 10);
        if (!isNaN(target)) el.textContent = target;
      });
      return;
    }
    if (!('IntersectionObserver' in window)) return;
    const pending = Array.from(document.querySelectorAll(COUNTER_SELECTOR))
      .filter((el) => !el.dataset.counterDone);
    if (!pending.length) return;
    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.dataset.counterDone = '1';
        counterObserver.unobserve(el);
        animateCounter(el);
      });
    }, { threshold: 0.5 });
    pending.forEach((el) => counterObserver.observe(el));
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
