import { Motion } from './motion.js';

const LENIS_URL = 'https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs';
const NAVBAR_OFFSET = -56;

// Container yang harus scroll secara native, bukan lewat Lenis.
// Sidebar, modal, dan dropdown hasil search semuanya punya overflow sendiri.
const NESTED_SCROLL_SELECTOR = '.sidebar, .modal-edquest, .search-ac-dropdown, .search-autocomplete, .search-autocomplete-dropdown';

// `behavior: 'auto'` mengikuti properti CSS `scroll-behavior`, jadi tidak bisa
// dipakai untuk scroll instan. 'instant' dipakai sebagai gantinya, dengan
// fallback ke 'auto' untuk browser lama yang belum menerimanya.
const INSTANT_BEHAVIOR = (() => {
  try {
    document.createElement('div').scrollTo({ top: 0, behavior: 'instant' });
    return 'instant';
  } catch (e) {
    return 'auto';
  }
})();

export const SmoothScroll = (() => {
  let lenis = null;
  let loading = null;
  let lockCount = 0;
  let booted = false;

  function isActive() {
    return !!lenis;
  }

  function loadLenis() {
    if (!loading) {
      loading = import(LENIS_URL)
        .then((mod) => mod.default || mod.Lenis || null)
        .catch(() => null);
    }
    return loading;
  }

  function build(Lenis) {
    return new Lenis({
      autoRaf: true,
      // Hash router memakai a[href="#/..."], jadi anchor Lenis dinonaktifkan
      // dan handled manual di app.js supaya route tetap jalan.
      anchors: false,
      autoResize: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      // Biarkan sentuhan tetap native (syncTouch Lenis tidak stabil di iOS < 16)
      syncTouch: false,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      // Dipakai sebagai pengganti allowNestedScroll:true yang jauh lebih
      // mahal (Lenis akan menelusuri ancestor tiap event scroll).
      prevent: (node) => node instanceof Element && !!node.closest(NESTED_SCROLL_SELECTOR)
    });
  }

  async function init() {
    if (!booted) {
      booted = true;
      window.addEventListener(Motion.EVENT, onMotionChange);
    }
    if (Motion.isReduced()) { destroy(); return; }
    if (lenis) return;
    const Lenis = await loadLenis();
    if (!Lenis || lenis || Motion.isReduced()) return;
    lenis = build(Lenis);
    if (lockCount > 0) lenis.stop();
  }

  function onMotionChange(e) {
    if (e.detail.reduced) destroy();
    else init();
  }

  function destroy() {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
    document.body.style.overflow = lockCount > 0 ? 'hidden' : '';
  }

  function nativeScrollTo(target, options) {
    const { offset = 0, immediate = false, block = 'start' } = options || {};
    const behavior = immediate ? INSTANT_BEHAVIOR : 'smooth';
    if (typeof target === 'number') {
      window.scrollTo({ top: Math.max(0, target + offset), behavior });
      return true;
    }
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const extra = block === 'center' ? -(window.innerHeight - rect.height) / 2 : 0;
    window.scrollTo({ top: Math.max(0, rect.top + window.scrollY + offset + extra), behavior });
    return true;
  }

  function scrollTo(target, options) {
    if (lenis) {
      lenis.scrollTo(target, Object.assign({ force: true }, options || {}));
      return true;
    }
    return nativeScrollTo(target, options);
  }

  function scrollToTop(options) {
    return scrollTo(0, options);
  }

  function scrollToEl(el, options) {
    if (!el) return false;
    if (!lenis) return nativeScrollTo(el, Object.assign({ offset: NAVBAR_OFFSET }, options || {}));
    const opts = Object.assign({}, options);
    if (opts.block === 'center') {
      // Lenis tidak mengenal `block`, jadi dihitung manual agar hasilnya
      // sama persis dengan jalur native.
      const rect = el.getBoundingClientRect();
      opts.offset = -((window.innerHeight - rect.height) / 2);
    } else {
      opts.offset = opts.offset === undefined ? NAVBAR_OFFSET : opts.offset;
    }
    delete opts.block;
    return scrollTo(el, opts);
  }

  function lockScroll() {
    lockCount += 1;
    if (lenis) {
      document.body.style.overflow = '';
      lenis.stop();
      return;
    }
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;
    if (lenis) { lenis.start(); return; }
    document.body.style.overflow = '';
  }

  function unlockAll() {
    lockCount = 0;
    if (lenis) { lenis.start(); return; }
    document.body.style.overflow = '';
  }

  function refresh() {
    if (lenis) lenis.resize();
  }

  return { init, destroy, isActive, scrollTo, scrollToTop, scrollToEl, lockScroll, unlockScroll, unlockAll, refresh, NAVBAR_OFFSET };
})();
