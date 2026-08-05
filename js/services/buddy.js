import { dataStore } from '../data/index.js';
import { Auth } from './auth.js';

export const Matching = (() => {
  let lastList = [];

  const MINAT_LABELS = { diskusi: 'Suka diskusi', materi: 'Suka materi lengkap', soal: 'Suka tryout & soal', kreatif: 'Suka cara kreatif' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function init() {
    bindFilterEvents();
    renderBuddies(getPool());
    const resetBtn = document.getElementById('resetFilter');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
  }

  function bindFilterEvents() {
    const map = { matchSearch: 'input', matchMapel: 'change', matchMinat: 'change', matchKelas: 'change' };
    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener(map[id], applyFilters);
    });
  }

  function resetFilters() {
    const map = { matchSearch: '', matchMapel: 'all', matchMinat: 'all', matchKelas: 'all' };
    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = map[id];
    });
    renderBuddies(getPool());
  }

  function getPool() {
    const current = Auth.getUser();
    const ownId = current && current.id;
    const registered = (Auth.getRegisteredUsers && Auth.getRegisteredUsers()) || [];
    const accounts = registered
      .filter(u => !ownId || u.id !== ownId)
      .map(u => ({
        name: u.name,
        id: u.id,
        initials: u.avatar || (u.name && u.name[0] ? u.name[0].toUpperCase() : '?'),
        mapel: u.mapel || 'umum',
        minat: u.minat || 'diskusi',
        kelas: u.kelas || '10',
        color: 'linear-gradient(135deg,#818CF8,#4F46E5)',
        online: true
      }));
    return accounts.concat(dataStore.buddies);
  }

  function applyFilters() {
    const q = ((document.getElementById('matchSearch') || {}).value || '').trim().toLowerCase();
    const mapel = (document.getElementById('matchMapel') || {}).value || 'all';
    const minat = (document.getElementById('matchMinat') || {}).value || 'all';
    const kelas = (document.getElementById('matchKelas') || {}).value || 'all';
    let filtered = getPool();
    if (mapel !== 'all') filtered = filtered.filter(b => b.mapel === mapel);
    if (minat !== 'all') filtered = filtered.filter(b => b.minat === minat);
    if (kelas !== 'all') filtered = filtered.filter(b => b.kelas === kelas);
    if (q) filtered = filtered.filter(b => String(b.name).toLowerCase().includes(q) || String(b.id).toLowerCase().includes(q));
    renderBuddies(filtered);
  }

  function renderBuddies(list) {
    lastList = list;
    const container = document.getElementById('buddyResults');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('resultCount');
    if (!container) return;
    if (countEl) countEl.textContent = list.length + ' teman ditemukan';
    if (list.length === 0) { container.innerHTML = ''; if (emptyState) emptyState.classList.remove('hidden'); return; }
    if (emptyState) emptyState.classList.add('hidden');
    container.innerHTML = list.map((b, i) => {
      const minatLabel = MINAT_LABELS[b.minat] || capitalize(String(b.minat));
      return '<div class="buddy-card">' +
        '<div class="flex items-center gap-3 mb-4"><div class="buddy-avatar" style="background:' + b.color + ';">' + esc(b.initials) + '</div>' +
        '<div class="flex-1 min-w-0"><h4 class="font-bold text-sm" style="color:var(--text-primary);">' + esc(b.name) +
        (b.id ? ' <span class="buddy-id">ID ' + esc(b.id) + '</span>' : '') + '</h4>' +
        '<span class="text-xs" style="color:var(--text-muted);">Kelas ' + esc(b.kelas) + '</span>' +
        (b.online ? '<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-2" title="Online"></span>' : '') + '</div></div>' +
        '<div class="flex flex-wrap gap-2 mb-3"><span class="category-tag ' + b.mapel + '"><i class="fas fa-book"></i> ' + capitalize(String(b.mapel)) + '</span>' +
        '<span class="text-xs px-3 py-1 rounded-full font-semibold" style="background:var(--bg-section);color:var(--text-secondary);">' + esc(minatLabel) + '</span></div>' +
        '<div class="flex gap-2"><button class="btn-edquest btn-primary-grad text-xs !py-2 !px-3 flex-1" onclick="Matching.requestBuddy(' + i + ')"><i class="fas fa-paper-plane"></i> Ajak Berteman</button>' +
        '<button class="btn-edquest btn-outline-glow text-xs !py-2 !px-3" onclick="Matching.viewProfile(' + i + ')"><i class="fas fa-user"></i> Lihat</button></div></div>';
    }).join('');
  }

  function requestBuddy(index) {
    const b = lastList[index];
    Auth.showToast('Permintaan pertemanan dikirim ke ' + (b ? b.name : 'teman') + '!', 'success');
  }

  function viewProfile(index) {
    const b = lastList[index];
    Auth.showToast('Membuka profil ' + (b ? b.name + ' (ID ' + b.id + ')' : 'teman') + '...', 'info');
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  return { init, requestBuddy, viewProfile };
})();
