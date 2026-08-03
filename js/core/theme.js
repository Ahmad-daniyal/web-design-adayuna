import { CONFIG } from './config.js';

export function initTheme() {
  const toggle = document.getElementById('darkModeToggle');
  const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.DARK);
  const isDark = saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  apply(isDark);
  if (toggle) toggle.addEventListener('click', () => apply(!document.documentElement.classList.contains('dark')));
}

function apply(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(CONFIG.STORAGE_KEYS.DARK, isDark);
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.classList.toggle('is-dark', isDark);
    toggle.setAttribute('aria-checked', isDark);
  }
}
