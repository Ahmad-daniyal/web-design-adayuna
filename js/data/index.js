import { CONFIG } from '../core/config.js';

export const dataStore = {
  forum: [],
  buddies: [],
  home: null,
  questions: [],
  leaderboard: [],
  about: null,
  faq: null
};

let loaded = false;

async function load(path, key) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Gagal memuat data: ' + path);
  dataStore[key] = await res.json();
}

export async function preloadData() {
  if (loaded) return;
  await Promise.all([
    load(CONFIG.DATA_PATHS.FORUM, 'forum'),
    load(CONFIG.DATA_PATHS.BUDDIES, 'buddies'),
    load(CONFIG.DATA_PATHS.HOME, 'home'),
    load(CONFIG.DATA_PATHS.QUESTIONS, 'questions'),
    load(CONFIG.DATA_PATHS.LEADERBOARD, 'leaderboard'),
    load(CONFIG.DATA_PATHS.ABOUT, 'about'),
    load(CONFIG.DATA_PATHS.FAQ, 'faq')
  ]);
  loaded = true;
}
