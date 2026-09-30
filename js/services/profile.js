import { CONFIG } from '../core/config.js';
import { Auth } from './auth.js';
import { Match } from './match.js';
import { ScrollAnimation } from '../core/scrollAnimation.js';

export const Profile = (() => {
  const USER_KEY = CONFIG.STORAGE_KEYS.USER;
  const REGISTERED_KEY = CONFIG.STORAGE_KEYS.REGISTERED_USERS;
  // Jurnal belajar (daftar catatan, form, dan hasil AI) sudah pindah ke
  // halaman Catatan AI (#/catatan) supaya Profil tidak bercampur dengan
  // catatan. Yang tersisa di sini hanya teaser berisi jumlahnya.
  const JOURNAL_POINTS = CONFIG.LIMITS.JOURNAL_POINTS;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function init() {
    syncUser();
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
    if (pointsEl) {
      const targetPoints = user ? (user.points || 0) : 0;
      if (targetPoints > 0 && !pointsEl.dataset.counterBound) {
        pointsEl.dataset.counterBound = '1';
        pointsEl.dataset.counter = targetPoints;
        pointsEl.textContent = '0';
        ScrollAnimation.refresh();
      } else {
        pointsEl.textContent = targetPoints;
      }
    }

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
    if (winsEl) {
      const targetWins = stats ? (stats.wins || 0) : 0;
      if (targetWins > 0 && !winsEl.dataset.counterBound) {
        winsEl.dataset.counterBound = '1';
        winsEl.dataset.counter = targetWins;
        winsEl.textContent = '0';
        ScrollAnimation.refresh();
      } else {
        winsEl.textContent = targetWins;
      }
    }
    if (drawsEl) {
      const targetDraws = stats ? (stats.draws || 0) : 0;
      if (targetDraws > 0 && !drawsEl.dataset.counterBound) {
        drawsEl.dataset.counterBound = '1';
        drawsEl.dataset.counter = targetDraws;
        drawsEl.textContent = '0';
        ScrollAnimation.refresh();
      } else {
        drawsEl.textContent = targetDraws;
      }
    }
    if (lossesEl) {
      const targetLosses = stats ? (stats.losses || 0) : 0;
      if (targetLosses > 0 && !lossesEl.dataset.counterBound) {
        lossesEl.dataset.counterBound = '1';
        lossesEl.dataset.counter = targetLosses;
        lossesEl.textContent = '0';
        ScrollAnimation.refresh();
      } else {
        lossesEl.textContent = targetLosses;
      }
    }
    renderBadges(user);
    syncJournalTeaser(user);
  }

  function renderBadges(user) {
    const wrap = document.getElementById('profileBadges');
    const countEl = document.getElementById('profileBadgeCount');
    const textEl = document.getElementById('profileBadgeCountText');
    if (!wrap) return;
    const owned = new Set((user && user.matchStats && user.matchStats.badges) || []);
    const chips = Match.BADGES.map((b, i) => {
      const has = owned.has(b.id);
      return '<div class="badge-item reveal-scale reveal-stagger-' + ((i % 4) + 1) + (has ? ' earned' : '') + '" title="' + esc(b.name) + ' — ' + esc(b.desc) + '">' +
        '<i class="fas ' + (has ? b.icon : 'fa-lock') + '"></i></div>';
    }).join('');
    wrap.innerHTML = chips;
    ScrollAnimation.refresh();
    const count = owned.size;
    if (countEl) {
      if (count > 0 && !countEl.dataset.counterBound) {
        countEl.dataset.counterBound = '1';
        countEl.dataset.counter = count;
        countEl.textContent = '0';
        ScrollAnimation.refresh();
      } else {
        countEl.textContent = count;
      }
    }
    if (textEl) textEl.textContent = count + ' dari ' + Match.BADGES.length + ' badge diraih';

    const contribEl = document.getElementById('profileContrib');
    if (contribEl) {
      const ms = (user && user.matchStats) || {};
      const journalCount = (user && user.journal && user.journal.length) || 0;
      const matchCount = ms.matches || 0;
      const targetContrib = user ? (journalCount + matchCount + count) : 0;
      if (targetContrib > 0 && !contribEl.dataset.counterBound) {
        contribEl.dataset.counterBound = '1';
        contribEl.dataset.counter = targetContrib;
        contribEl.textContent = '0';
        ScrollAnimation.refresh();
      } else {
        contribEl.textContent = targetContrib;
      }
    }
  }

  function syncJournalTeaser(user) {
    const entries = (user && user.journal) || [];
    const done = entries.filter(e => e && e.ai).length;
    const countEl = document.getElementById('profileJournalCount');
    const aiEl = document.getElementById('profileJournalAiCount');
    const hintEl = document.getElementById('profileJournalHint');
    if (countEl) countEl.textContent = entries.length;
    if (aiEl) aiEl.textContent = done;
    if (hintEl) {
      hintEl.textContent = entries.length
        ? done
          ? done + ' dari ' + entries.length + ' catatan sudah dibantu AI.'
          : 'Klik salah satu catatan untuk minta AI merangkum.'
        : 'Belum ada catatan. Mulai dengan mencatat apa yang kamu pelajari hari ini.';
    }
  }

  // Dipakai juga oleh halaman Catatan AI untuk menyimpan hasil analisis
  // ke dalam entri jurnal (entry.ai) lewat jalur persist yang sama.
  function persist(user) {
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
    persist(user);
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

  // Dipakai halaman Catatan AI saat pengguna menyimpan catatan baru.
  return { init, persist, addPoints };
})();