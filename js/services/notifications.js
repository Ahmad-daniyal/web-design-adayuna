import { CONFIG } from '../core/config.js';
import { Auth } from './auth.js';
import { Router } from '../core/router.js';

const KEY = CONFIG.STORAGE_KEYS.NOTIFICATIONS;
const MAX_ITEMS = 50;

const TYPE_DEFAULTS = {
  badge: { icon: 'fa-award' },
  rank: { icon: 'fa-arrow-trend-up' },
  match: { icon: 'fa-hand-fist' },
  journal: { icon: 'fa-book-open' },
  forum: { icon: 'fa-comments' },
  buddy: { icon: 'fa-user-friends' },
  system: { icon: 'fa-bell' }
};

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch (e) {
    return {};
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch (e) { /* storage penuh / tidak tersedia */ }
}

function forUser() {
  const user = Auth.getUser();
  if (!user || !user.id) return null;
  return readStore()[user.id] || [];
}

function saveForUser(list) {
  const user = Auth.getUser();
  if (!user || !user.id) return;
  const store = readStore();
  store[user.id] = list.slice(0, MAX_ITEMS);
  writeStore(store);
}

function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'baru saja';
  const m = Math.floor(s / 60);
  if (m < 60) return m + ' menit lalu';
  const h = Math.floor(m / 60);
  if (h < 24) return h + ' jam lalu';
  const d = Math.floor(h / 24);
  if (d < 7) return d + ' hari lalu';
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function renderCount() {
  const count = unreadCount();
  const span = document.getElementById('notifCount');
  const btn = document.getElementById('notifBtn');
  if (!span) return;
  if (count > 0) {
    span.style.display = '';
    span.textContent = count > 99 ? '99+' : String(count);
    if (btn) btn.classList.add('has-unread');
  } else {
    span.style.display = 'none';
    if (btn) btn.classList.remove('has-unread');
  }
}

function renderList() {
  const listEl = document.getElementById('notifList');
  if (!listEl) return;
  const items = forUser() || [];
  if (!items.length) {
    listEl.innerHTML =
      '<div class="notif-empty">' +
        '<i class="fas fa-bell-slash"></i>' +
        '<p class="text-sm font-medium" style="color:var(--text-secondary);">Belum ada notifikasi</p>' +
        '<p class="text-xs" style="color:var(--text-muted);">Aktivitasmu di sini akan muncul sebagai riwayat.</p>' +
      '</div>';
    return;
  }
  listEl.innerHTML = items.map(n => {
    const def = TYPE_DEFAULTS[n.type] || TYPE_DEFAULTS.system;
    const icon = n.icon || def.icon;
    return '<div class="notif-item' + (n.read ? '' : ' unread') + '" data-id="' + n.id + '" data-link="' + n.link + '" role="button" tabindex="0">' +
      '<span class="notif-icon"><i class="fas ' + icon + '"></i></span>' +
      '<span class="flex-1 min-w-0">' +
        '<span class="block text-sm font-semibold" style="color:var(--text-primary);">' + n.title + '</span>' +
        (n.message ? '<span class="block text-xs mt-0.5 leading-relaxed" style="color:var(--text-secondary);">' + n.message + '</span>' : '') +
        '<span class="block text-[0.6875rem] mt-1" style="color:var(--text-muted);">' + timeAgo(n.time) + '</span>' +
      '</span>' +
    '</div>';
  }).join('');
}

export const Notifications = (() => {
  let bound = false;

  function refresh() {
    const wrap = document.getElementById('notifWrap');
    if (!wrap) return;
    if (!Auth.isLoggedIn()) {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = '';
    renderCount();
    renderList();
  }

  function push(data) {
    if (!Auth.isLoggedIn()) return null;
    const user = Auth.getUser();
    const def = TYPE_DEFAULTS[data.type] || TYPE_DEFAULTS.system;
    const item = {
      id: Date.now(),
      type: data.type,
      title: data.title,
      message: data.message || '',
      icon: data.icon || def.icon,
      link: data.link || '#/home',
      time: Date.now(),
      read: false
    };
    const list = forUser() || [];
    list.unshift(item);
    saveForUser(list);
    renderCount();
    renderList();
    return item;
  }

  function getAll() {
    return forUser() || [];
  }

  function unreadCount() {
    return (forUser() || []).filter(n => !n.read).length;
  }

  function markRead(id) {
    const list = forUser();
    if (!list) return;
    const item = list.find(n => n.id === id);
    if (item && !item.read) {
      item.read = true;
      saveForUser(list);
      renderCount();
      renderList();
    }
  }

  function markAllRead() {
    const list = forUser();
    if (!list) return;
    list.forEach(n => { n.read = true; });
    saveForUser(list);
    renderCount();
    renderList();
  }

  function clearAll() {
    const user = Auth.getUser();
    if (!user || !user.id) return;
    const store = readStore();
    store[user.id] = [];
    writeStore(store);
    renderCount();
    renderList();
  }

  function seedWelcome() {
    if (!Auth.isLoggedIn()) return;
    const user = Auth.getUser();
    if (!user || !user.id || (forUser() || []).length) return;
    push({ type: 'system', title: 'Selamat datang di Edquest, ' + user.name + '!', message: 'Siap belajar lebih seru? Jelajahi forum, cari study buddy, atau uji kemampuanmu di Arena.', link: '#/about' });
    push({ type: 'system', title: 'Tips raih badge', message: 'Main di Arena, catat jurnal belajarmu, dan aktif di forum untuk mengumpulkan poin & badge.', link: '#/match' });
  }

  function toggleDropdown(forceClose) {
    const dd = document.getElementById('notifDropdown');
    if (!dd) return;
    if (forceClose) { dd.classList.add('hidden'); return; }
    const shouldOpen = dd.classList.contains('hidden');
    dd.classList.toggle('hidden', !shouldOpen);
    if (shouldOpen) { renderList(); renderCount(); }
  }

  function init() {
    if (bound) { refresh(); return; }
    bound = true;

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#notifBtn');
      if (btn) {
        e.stopPropagation();
        toggleDropdown();
        return;
      }
      const item = e.target.closest('.notif-item');
      if (item) {
        markRead(Number(item.dataset.id));
        toggleDropdown(true);
        Router.navigate(String(item.dataset.link || '#/home').replace(/^#\//, ''));
        return;
      }
      const markAll = e.target.closest('#notifMarkAll');
      if (markAll) { e.stopPropagation(); markAllRead(); return; }
      const clearAll = e.target.closest('#notifClearAll');
      if (clearAll) { e.stopPropagation(); clearAll(); return; }
      const wrap = document.getElementById('notifWrap');
      if (wrap && !wrap.contains(e.target)) {
        toggleDropdown(true);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleDropdown(true);
    });

    document.addEventListener('pageChanged', () => {
      toggleDropdown(true);
      refresh();
    });

    refresh();
  }

  return { init, refresh, push, getAll, unreadCount, markRead, markAllRead, clearAll, seedWelcome };
})();
