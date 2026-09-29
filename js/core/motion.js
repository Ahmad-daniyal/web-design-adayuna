import { CONFIG } from './config.js';

const EVENT = 'motionPreferenceChanged';
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

export const Motion = (() => {
  let mql = null;
  let override = null;
  let booted = false;

  function readStored() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.REDUCE_MOTION);
      if (raw === 'true') return true;
      if (raw === 'false') return false;
    } catch (e) { /* storage diblokir browser */ }
    return null;
  }

  function writeStored(value) {
    try { localStorage.setItem(CONFIG.STORAGE_KEYS.REDUCE_MOTION, value ? 'true' : 'false'); } catch (e) {}
  }

  function systemReduced() {
    return mql ? mql.matches : window.matchMedia(REDUCE_QUERY).matches;
  }

  function resolve() {
    return override === null ? systemReduced() : override;
  }

  function apply() {
    document.documentElement.classList.toggle('reduce-motion', resolve());
  }

  function emit(reason) {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { reduced: resolve(), reason } }));
  }

  function init() {
    if (booted) return;
    booted = true;
    override = readStored();
    mql = window.matchMedia(REDUCE_QUERY);
    apply();
    mql.addEventListener('change', () => {
      if (override !== null) return;
      apply();
      emit('system');
    });
  }

  function isReduced() {
    return resolve();
  }

  function hasOverride() {
    return override !== null;
  }

  function setReduced(value) {
    override = !!value;
    writeStored(override);
    apply();
    emit('user');
  }

  function clearOverride() {
    try { localStorage.removeItem(CONFIG.STORAGE_KEYS.REDUCE_MOTION); } catch (e) {}
    override = null;
    apply();
    emit('system');
  }

  return { init, isReduced, hasOverride, setReduced, clearOverride, EVENT };
})();
