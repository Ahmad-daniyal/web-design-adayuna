import { Motion } from './motion.js';
import { SmoothScroll } from './smoothScroll.js';

export const ScrollAnimation = (() => {
  let observer = null;
  let counterObserver = null;
  let backToTopBtn = null;
  let running = false;
  let armedTimers = [];
  let refreshToken = 0;
  let pending = new Set();

  const SCROLL_THRESHOLD = 400;
  const REVEAL_SELECTOR = ':is(.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur)';
  const COUNTER_SELECTOR = '[data-counter]';
  const SCROLL_SETTLE_MS = 140;
  const SCROLL_SETTLE_MAX_MS = 1200;
  const REVEAL_MARGIN = 80;
  const WILL_CHANGE_TIMEOUT = 1500;
  const SAFETY_REVEAL_MS = 4000;
  const SAFETY_TRANSITION_PROPS = ['opacity', 'transform', 'filter'];

  function supportsScrollEnd() {
    return 'onscrollend' in window;
  }

  function init() {
    setupObserver();
    setupBackToTop();
    setupScrollListener();
    setupResizeWatch();
    refresh();
    window.addEventListener(Motion.EVENT, onMotionChange);
  }

  function onMotionChange(e) {
    if (e.detail.reduced) revealAll();
    else refresh();
  }

  /* Kalau tinggi konten berubah (ganti font, gambar muat, panel dibuka),
     elemen yang tadinya di bawah viewport bisa naik ke layar tanpa ada
     event scroll — sehingga reveal-nya tidak pernah terpicu. */
  function setupResizeWatch() {
    if (!('ResizeObserver' in window)) return;
    const app = document.getElementById('app');
    if (!app) return;
    let lastHeight = app.offsetHeight;
    const observer = new ResizeObserver(() => {
      const height = app.offsetHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      if (pending.size) startScrollLoop();
    });
    observer.observe(app);
  }

  /* ===== Observer ===== */

  function setupObserver() {
    if (observer) observer.disconnect();
    if (!('IntersectionObserver' in window) || Motion.isReduced()) {
      revealAll();
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) show(entry.target);
      });
    }, {
      threshold: 0,
      // Reveal sedikit sebelum elemen menyentuh tepi layar
      rootMargin: `0px 0px ${REVEAL_MARGIN}px 0px`
    });
  }

  /* ===== Reveal ===== */

  function show(el) {
    if (!el.classList.contains('visible')) {
      el.classList.add('visible', 'is-animating');
      trackTransition(el);
    }
    pending.delete(el);
    if (observer) observer.unobserve(el);
    if (!pending.size) stopScrollLoop();
  }

  function trackTransition(el) {
    const cleanup = () => {
      el.classList.remove('is-animating');
      el.removeEventListener('transitionend', onEnd);
    };
    const onEnd = (e) => {
      if (e.target !== el) return;
      if (!SAFETY_TRANSITION_PROPS.includes(e.propertyName)) return;
      cleanup();
    };
    el.addEventListener('transitionend', onEnd);
    setTimeout(cleanup, WILL_CHANGE_TIMEOUT);
  }

  function shouldRevealNow(el) {
    const rect = el.getBoundingClientRect();
    if (rect.left >= window.innerWidth || rect.right <= 0) return false;
    return rect.top < window.innerHeight + REVEAL_MARGIN;
  }

  function observeAll() {
    pending = new Set();
    if (!observer) { revealAll(); return; }
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      if (el.classList.contains('visible')) return;
      if (shouldRevealNow(el)) { show(el); return; }
      pending.add(el);
      observer.observe(el);
    });
    if (pending.size) startScrollLoop();
    else stopScrollLoop();
  }

  function revealAll() {
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => show(el));
    pending = new Set();
    stopScrollLoop();
  }

  /* ===== Scroll loop (hanya iterasi elemen pending, bukan query ulang) ===== */

  function setupScrollListener() {
    window.addEventListener('scroll', () => {
      if (pending.size) startScrollLoop();
    }, { passive: true });
  }

  function startScrollLoop() {
    if (running) return;
    running = true;
    const step = () => {
      if (!pending.size) { running = false; return; }
      pending.forEach((el) => {
        if (!el.isConnected) { pending.delete(el); return; }
        if (shouldRevealNow(el)) show(el);
      });
      if (pending.size && running) requestAnimationFrame(step);
      else running = false;
    };
    requestAnimationFrame(step);
  }

  function stopScrollLoop() {
    running = false;
  }

  /* ===== Scroll settle detection ===== */

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

  /* ===== Safety net ===== */

  function clearArmedTimers() {
    armedTimers.forEach((t) => clearTimeout(t));
    armedTimers = [];
  }

  function armFallback() {
    clearArmedTimers();
    // Jaring pengaman terakhir: kalau ada elemen yang masih tersembunyi
    // jauh di bawah viewport setelah 4 detik, tampilkan agar konten
    // tidak pernah terkunci di opacity 0.
    armedTimers.push(setTimeout(() => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (el.classList.contains('visible')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) show(el);
      });
    }, SAFETY_REVEAL_MS));
  }

  /* ===== Public ===== */

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

  function setupBackToTop() {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.addEventListener('click', () => SmoothScroll.scrollToTop());
    document.body.appendChild(backToTopBtn);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > SCROLL_THRESHOLD);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ===== Counters ===== */

  function observeCounters() {
    if (!('IntersectionObserver' in window)) return;
    const pendingCounters = Array.from(document.querySelectorAll(COUNTER_SELECTOR))
      .filter((el) => !el.dataset.counterDone);
    if (!pendingCounters.length) return;

    if (Motion.isReduced()) {
      pendingCounters.forEach((el) => setCounterValue(el, parseInt(el.dataset.counter, 10)));
      return;
    }

    if (counterObserver) counterObserver.disconnect();
    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.dataset.counterDone = '1';
        counterObserver.unobserve(el);
        animateCounter(el);
      });
    }, { threshold: 0.5 });
    pendingCounters.forEach((el) => counterObserver.observe(el));
  }

  function setCounterValue(el, target) {
    if (isNaN(target)) return;
    el.textContent = target;
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
