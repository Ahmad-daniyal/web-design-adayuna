// Scroll halus berbasis API native browser.
//
// Guide Book Lomba Web Design INVENTION 2026 melarang framework/library
// JavaScript selain jQuery. Versi proyek ini pernah memuat Lenis dari CDN,
// jadi modul ini sekarang hanya memakai `scrollTo` bawaan browser — tanpa
// dependensi eksternal sama sekali.
//
// API publik sengaja tidak diubah supaya semua pemanggil (app.js, router.js,
// scrollAnimation.js, auth.js, forum.js, settings.js) tidak perlu disentuh.

const NAVBAR_OFFSET = -56;

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
  let lockCount = 0;

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
    return nativeScrollTo(target, options);
  }

  function scrollToTop(options) {
    return scrollTo(0, options);
  }

  function scrollToEl(el, options) {
    if (!el) return false;
    return nativeScrollTo(el, Object.assign({ offset: NAVBAR_OFFSET }, options || {}));
  }

  function lockScroll() {
    lockCount += 1;
    if (lockCount > 1) return;
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;
    document.body.style.overflow = '';
  }

  function unlockAll() {
    lockCount = 0;
    document.body.style.overflow = '';
  }

  return {
    // Tidak ada yang perlu diinisialisasi: scroll ditangani browser. Fungsi
    // ini tetap ada karena dipanggil dari app.js.
    init() {},
    destroy() {},
    // Selalu false karena tidak ada instance smooth-scroll eksternal lagi.
    isActive() { return false; },
    scrollTo,
    scrollToTop,
    scrollToEl,
    lockScroll,
    unlockScroll,
    unlockAll,
    // Dulu dipakai untuk resize Lenis. Sekarang browser yang menambah
    // tinggi halaman secara otomatis, jadi cukup terapkan ulang layout.
    refresh() { window.dispatchEvent(new Event('resize')); },
    NAVBAR_OFFSET
  };
})();
