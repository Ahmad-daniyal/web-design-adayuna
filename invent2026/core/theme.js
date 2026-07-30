import { STORAGE_KEYS, DEFAULTS } from './config.js';

let currentTheme = DEFAULTS.THEME;

export function getTheme() {
  return currentTheme;
}

export function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: currentTheme } }));
}

export function toggleTheme() {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  setTheme(saved || DEFAULTS.THEME);
}
