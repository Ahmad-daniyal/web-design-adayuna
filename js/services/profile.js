import { CONFIG } from '../core/config.js';
import { Auth } from './auth.js';
import { Match } from './match.js';
import { Notifications } from './notifications.js';

export const Profile = (() => {
  const USER_KEY = CONFIG.STORAGE_KEYS.USER;

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
  }

  function bindJournalForm() {
    const addBtn = document.getElementById('addJournalBtn');
    const form = document.getElementById('journalForm');
    const cancelBtn = document.getElementById('cancelJournalBtn');
    if (!addBtn || !form) return;
    addBtn.addEventListener('click', () => { form.style.display = form.style.display === 'none' ? 'block' : 'none'; });
    if (cancelBtn) cancelBtn.addEventListener('click', () => { form.style.display = 'none'; });
    const entryForm = document.getElementById('journalEntryForm');
    if (entryForm) {
      entryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!Auth.isLoggedIn()) { Auth.openModal('register'); return; }
        const mapel = document.getElementById('journalMapel').value;
        const text = document.getElementById('journalText').value.trim();
        if (!text) { Auth.showToast('Catatan tidak boleh kosong', 'error'); return; }
        const colors = { matematika:{bg:'var(--primary-light)',color:'var(--primary)'}, fisika:{bg:'var(--bg-section)',color:'var(--text-secondary)'}, kimia:{bg:'var(--bg-section)',color:'var(--text-secondary)'}, biologi:{bg:'var(--bg-section)',color:'var(--text-secondary)'}, sejarah:{bg:'var(--bg-section)',color:'var(--text-secondary)'}, bahasa:{bg:'var(--bg-section)',color:'var(--text-secondary)'}, ips:{bg:'var(--bg-section)',color:'var(--text-secondary)'}, umum:{bg:'var(--bg-section)',color:'var(--text-secondary)'} };
        const c = colors[mapel] || colors.umum;
        const entry = document.createElement('div');
        entry.className = 'progress-card';
        entry.innerHTML = '<div class="flex items-center justify-between mb-2"><span class="text-xs font-semibold px-2 py-1 rounded-full" style="background:' + c.bg + ';color:' + c.color + ';">' + (mapel.charAt(0).toUpperCase() + mapel.slice(1)) + '</span><span class="text-xs" style="color:var(--text-muted);">Baru saja</span></div>' +
          '<p class="text-sm leading-relaxed" style="color:var(--text-secondary);">' + esc(text) + '</p><div class="flex items-center gap-2 mt-2 text-xs" style="color:var(--primary);"><i class="fas fa-circle-check"></i> +5 poin</div>';
        const container = document.getElementById('journalEntries');
        if (container) container.insertBefore(entry, container.firstChild);
        document.getElementById('journalText').value = '';
        form.style.display = 'none';
        const gained = addPoints(5);
        Auth.showToast(gained ? 'Progress tercatat! +5 poin' : 'Progress tercatat!', 'success');
        if (gained) Notifications.push({ type: 'journal', title: 'Progress tercatat!', message: '+5 poin · ' + (mapel.charAt(0).toUpperCase() + mapel.slice(1)), link: '#/profile' });
      });
    }
  }

  function addPoints(amount) {
    const user = Auth.getUser();
    if (!user) return false;
    user.points = (user.points || 0) + amount;
    if (localStorage.getItem(USER_KEY)) localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (sessionStorage.getItem(USER_KEY)) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
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

  return { init };
})();
