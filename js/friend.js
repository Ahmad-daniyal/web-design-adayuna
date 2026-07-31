import { buddies } from './data.js';
import { Auth } from './auth.js';

export const Matching = (() => {

  function init() {
    renderBuddies(buddies);
    const form = document.getElementById('matchingForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const mapel = document.getElementById('matchMapel').value;
      const minat = document.getElementById('matchMinat').value;
      const kelas = document.getElementById('matchKelas').value;
      let filtered = buddies;
      if (mapel !== 'all') filtered = filtered.filter(b => b.mapel === mapel);
      if (minat !== 'all') filtered = filtered.filter(b => b.minat === minat);
      if (kelas !== 'all') filtered = filtered.filter(b => b.kelas === kelas);
      renderBuddies(filtered);
    });
  }

  function renderBuddies(list) {
    const container = document.getElementById('buddyResults');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('resultCount');
    if (!container) return;
    if (countEl) countEl.textContent = list.length + ' teman ditemukan';
    if (list.length === 0) { container.innerHTML = ''; if (emptyState) emptyState.classList.remove('hidden'); return; }
    if (emptyState) emptyState.classList.add('hidden');
    container.innerHTML = list.map((b, i) =>
      '<div class="buddy-card">' +
        '<div class="flex items-center gap-3 mb-4"><div class="buddy-avatar" style="background:' + b.color + ';">' + b.initials + '</div>' +
        '<div class="flex-1"><h4 class="font-bold text-sm" style="color:var(--text-primary);">' + b.name + '</h4>' +
        '<span class="text-xs" style="color:var(--text-muted);">Kelas ' + b.kelas + '</span>' +
        (b.online ? '<span class="inline-block w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 ml-2" title="Online"></span>' : '') + '</div></div>' +
        '<div class="flex flex-wrap gap-2 mb-3"><span class="category-tag ' + b.mapel + '"><i class="fas fa-book"></i> ' + capitalize(b.mapel) + '</span>' +
        '<span class="text-xs px-3 py-1 rounded-full font-semibold" style="background:var(--bg-section);color:var(--text-secondary);">' + b.minat + '</span></div>' +
        '<div class="flex gap-2"><button class="btn-edquest btn-primary-grad text-xs !py-2 !px-3 flex-1" onclick="Matching.requestBuddy(\'' + b.name + '\')"><i class="fas fa-paper-plane"></i> Ajak Berteman</button>' +
        '<button class="btn-edquest btn-outline-glow text-xs !py-2 !px-3" onclick="Matching.viewProfile(\'' + b.name + '\')"><i class="fas fa-user"></i> Lihat</button></div></div>'
    ).join('');
  }

  function requestBuddy(name) { Auth.showToast('Permintaan pertemanan dikirim ke ' + name + '!', 'success'); }
  function viewProfile(name) { Auth.showToast('Membuka profil ' + name + '...', 'info'); }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  return { init, requestBuddy, viewProfile };
})();
