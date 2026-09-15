import { CONFIG } from '../core/config.js';
import { Auth } from './auth.js';
import { Match } from './match.js';
import { Notifications } from './notifications.js';

export const Profile = (() => {
  const USER_KEY = CONFIG.STORAGE_KEYS.USER;
  const REGISTERED_KEY = CONFIG.STORAGE_KEYS.REGISTERED_USERS;
  const JOURNAL_POINTS = CONFIG.LIMITS.JOURNAL_POINTS;

  const MAPEL_LABELS = Object.assign(
    { umum: 'Umum' },
    CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.label; return o; }, {})
  );

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function init() {
    syncUser();
    bindJournalForm();
    bindAnonToggle();
  }

  function syncUser() {
    const user = Auth.getUser();
    const nameEl = document.getElementById('profileName');
    const idEl = document.getElementById('profileId');
    const avatarEl = document.getElementById('profileAvatar');
    const pointsEl = document.getElementById('profilePoints');
    if (nameEl) nameEl.textContent = user ? user.name : 'Tamu';
    if (idEl) idEl.textContent = user && user.id ? 'ID: ' + user.id : 'ID: —';
    if (avatarEl) avatarEl.textContent = user ? user.avatar : '?';
    if (pointsEl) pointsEl.textContent = user ? (user.points || 0) : 0;

    const stats = user && user.matchStats;
    const ratingEl = document.getElementById('profileRating');
    const tierEl = document.getElementById('profileTier');
    const winsEl = document.getElementById('profileWins');
    const drawsEl = document.getElementById('profileDraws');
    const lossesEl = document.getElementById('profileLosses');
    if (ratingEl) ratingEl.textContent = user ? Match.rankPointsOf(user) : '—';
    if (tierEl) {
      const t = Match.tierOf(user ? Match.rankPointsOf(user) : 0);
      tierEl.textContent = t;
      tierEl.className = 'tier-chip tier-' + t.toLowerCase();
    }
    if (winsEl) winsEl.textContent = stats ? (stats.wins || 0) : 0;
    if (drawsEl) drawsEl.textContent = stats ? (stats.draws || 0) : 0;
    if (lossesEl) lossesEl.textContent = stats ? (stats.losses || 0) : 0;
    renderBadges(user);
    renderJournal(user);
  }

  function renderBadges(user) {
    const wrap = document.getElementById('profileBadges');
    const countEl = document.getElementById('profileBadgeCount');
    const textEl = document.getElementById('profileBadgeCountText');
    if (!wrap) return;
    const owned = new Set((user && user.matchStats && user.matchStats.badges) || []);
    const chips = Match.BADGES.map(b => {
      const has = owned.has(b.id);
      return '<div class="badge-item' + (has ? ' earned' : '') + '" title="' + esc(b.name) + ' — ' + esc(b.desc) + '">' +
        '<i class="fas ' + (has ? b.icon : 'fa-lock') + '"></i></div>';
    }).join('');
    wrap.innerHTML = chips;
    const count = owned.size;
    if (countEl) countEl.textContent = count;
    if (textEl) textEl.textContent = count + ' dari ' + Match.BADGES.length + ' badge diraih';

    const contribEl = document.getElementById('profileContrib');
    if (contribEl) {
      const ms = (user && user.matchStats) || {};
      const journalCount = (user && user.journal && user.journal.length) || 0;
      const matchCount = ms.matches || 0;
      contribEl.textContent = user ? (journalCount + matchCount + count) : 0;
    }
  }

  function renderJournal(user) {
    const container = document.getElementById('journalEntries');
    if (!container) return;
    const entries = (user && user.journal) || [];
    if (!user) {
      container.innerHTML = '<div class="card-panel !p-8 text-center"><div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl" style="background:var(--accent-light);color:var(--accent);"><i class="fas fa-book-open"></i></div>' +
        '<h3 class="text-lg font-bold mb-1" style="color:var(--text-primary);">Jurnal belajar masih kosong</h3>' +
        '<p class="text-sm mb-4" style="color:var(--text-secondary);">Buat akun dulu untuk mulai mencatat progress harianmu dan dapatkan poin.</p>' +
        '<button data-action="register" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4"><i class="fas fa-user-plus"></i> Daftar Sekarang</button></div>';
      return;
    }
    if (entries.length === 0) {
      container.innerHTML = '<div class="card-panel !p-8 text-center"><div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl" style="background:var(--accent-light);color:var(--accent);"><i class="fas fa-pen-nib"></i></div>' +
        '<h3 class="text-lg font-bold mb-1" style="color:var(--text-primary);">Belum ada catatan</h3>' +
        '<p class="text-sm" style="color:var(--text-secondary);">Klik <strong>Catat Hari Ini</strong> dan mulailah jurnal belajarmu. Setiap catatan memberi +' + JOURNAL_POINTS + ' poin.</p></div>';
      return;
    }
    container.innerHTML = entries.map(entry => buildJournalCard(entry)).join('');
  }

  function buildJournalCard(entry) {
    if (!entry) return '';
    const label = MAPEL_LABELS[entry.mapel] || capitalize(String(entry.mapel || 'umum'));
    return '<div class="progress-card">' +
      '<div class="flex items-center justify-between mb-2">' +
        '<span class="status-tag">' + esc(label) + '</span>' +
        '<span class="text-xs" style="color:var(--text-muted);">' + relativeTime(entry.time) + '</span>' +
      '</div>' +
      '<p class="text-sm leading-relaxed" style="color:var(--text-secondary);">' + esc(entry.text) + '</p>' +
      '<div class="flex items-center gap-2 mt-2 text-xs" style="color:var(--primary-text);"><i class="fas fa-circle-check"></i> +' + (Number(entry.points) || JOURNAL_POINTS) + ' poin</div>' +
    '</div>';
  }

  function relativeTime(iso) {
    if (!iso) return 'Baru saja';
    const t = new Date(iso).getTime();
    if (isNaN(t)) return 'Baru saja';
    const diff = Date.now() - t;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Baru saja';
    if (m < 60) return m + ' menit lalu';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' jam lalu';
    const d = Math.floor(h / 24);
    if (d === 1) return 'Kemarin';
    if (d < 7) return d + ' hari lalu';
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function bindJournalForm() {
    const addBtn = document.getElementById('addJournalBtn');
    const form = document.getElementById('journalForm');
    const cancelBtn = document.getElementById('cancelJournalBtn');
    if (!addBtn || !form) return;
    addBtn.addEventListener('click', () => {
      if (!Auth.isLoggedIn()) { Auth.openModal('register'); return; }
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });
    if (cancelBtn) cancelBtn.addEventListener('click', () => { form.style.display = 'none'; });
    const entryForm = document.getElementById('journalEntryForm');
    if (entryForm) {
      entryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!Auth.isLoggedIn()) { Auth.openModal('register'); return; }
        const mapelEl = document.getElementById('journalMapel');
        const textEl = document.getElementById('journalText');
        const mapel = mapelEl ? mapelEl.value : 'umum';
        const text = textEl ? textEl.value.trim() : '';
        if (!text) { Auth.showToast('Catatan tidak boleh kosong', 'error'); return; }
        const user = Auth.getUser();
        user.journal = user.journal || [];
        user.journal.unshift({ mapel, text, time: new Date().toISOString(), points: JOURNAL_POINTS });
        persistJournal(user);
        if (textEl) textEl.value = '';
        form.style.display = 'none';
        const gained = addPoints(JOURNAL_POINTS);
        renderJournal(user);
        renderBadges(user);
        Auth.showToast(gained ? 'Progress tercatat! +' + JOURNAL_POINTS + ' poin' : 'Progress tercatat!', 'success');
        if (gained) Notifications.push({ type: 'journal', title: 'Progress tercatat!', message: '+' + JOURNAL_POINTS + ' poin · ' + (MAPEL_LABELS[mapel] || capitalize(mapel)), link: '#/profile' });
      });
    }
  }

  function persistJournal(user) {
    Auth.persistUser(user);
    if (!user || !user.email) return;
    try {
      const registered = Auth.getRegisteredUsers();
      const acc = registered.find(u => u.email && u.email.toLowerCase() === user.email.toLowerCase());
      if (acc) {
        acc.journal = user.journal;
        localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));
      }
    } catch (e) { /* abaikan */ }
  }

  function addPoints(amount) {
    const user = Auth.getUser();
    if (!user) return false;
    user.points = (user.points || 0) + amount;
    persistJournal(user);
    const pointsEl = document.getElementById('profilePoints');
    if (pointsEl) pointsEl.textContent = user.points;
    return true;
  }

  function bindAnonToggle() {
    const toggle = document.getElementById('anonToggle');
    if (!toggle) return;
    toggle.addEventListener('change', () => {
      const label = toggle.closest('label').querySelector('span');
      if (label) {
        label.innerHTML = toggle.checked
          ? '<i class="fas fa-eye-slash mr-2" style="color:var(--text-muted);"></i>Mode Anonim'
          : '<i class="fas fa-eye mr-2" style="color:var(--text-muted);"></i>Mode Nama';
      }
    });
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  return { init };
})();