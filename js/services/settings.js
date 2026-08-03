import { Auth } from './auth.js';

export const Settings = (() => {

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function openModal() {
    const existing = document.getElementById('settingsModal');
    if (existing) { existing.classList.add('active'); document.body.style.overflow = 'hidden'; return; }
    const user = Auth.getUser();
    const div = document.createElement('div');
    div.id = 'settingsModal';
    div.className = 'modal-edquest active';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-modal', 'true');
    div.innerHTML = '<div class="modal-content"><div class="modal-header"><h3 class="text-xl font-bold" style="color:var(--text-primary);">Pengaturan</h3><button class="modal-close" onclick="Settings.closeModal()" aria-label="Tutup"><i class="fas fa-times"></i></button></div>' +
      '<div class="modal-body"><form id="settingsForm">' +
      '<div class="mb-4"><label class="form-label">Nama Panggilan</label><input id="settingsName" type="text" class="form-input" value="' + esc(user ? user.name : '') + '" placeholder="Nama kamu"></div>' +
      '<div class="mb-4"><label class="form-label">Email</label><input id="settingsEmail" type="email" class="form-input" value="' + esc(user ? user.email : '') + '" placeholder="email@domain.com"></div>' +
      '<div class="mb-4"><label class="form-label">Sekolah</label><input id="settingsSchool" type="text" class="form-input" value="' + esc(user && user.school ? user.school : '') + '" placeholder="Nama sekolah"></div>' +
      '<hr style="border-color:var(--border-color);margin:1.5rem 0;">' +
      '<div class="mb-4"><label class="flex items-center justify-between cursor-pointer"><span class="text-sm font-medium" style="color:var(--text-primary);">Notifikasi</span>' +
      '<div class="relative"><input type="checkbox" id="settingsNotif" class="sr-only peer" checked>' +
      '<div class="w-10 h-5 rounded-full bg-slate-200 dark:bg-slate-700 peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100 transition-colors"></div>' +
      '<div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div></div></label></div>' +
      '<div class="mb-4"><label class="flex items-center justify-between cursor-pointer"><span class="text-sm font-medium" style="color:var(--text-primary);">Mode Anonim (default)</span>' +
      '<div class="relative"><input type="checkbox" id="settingsAnon" class="sr-only peer" checked>' +
      '<div class="w-10 h-5 rounded-full bg-slate-200 dark:bg-slate-700 peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100 transition-colors"></div>' +
      '<div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div></div></label></div>' +
      '<hr style="border-color:var(--border-color);margin:1.5rem 0;">' +
      '<button type="submit" class="btn-edquest btn-primary-grad w-full"><i class="fas fa-save"></i> Simpan Perubahan</button>' +
      '<button type="button" onclick="Settings.deleteAccount()" class="btn-edquest w-full mt-3" style="background:transparent;color:#ef4444;border:1.5px solid #ef4444;"><i class="fas fa-trash"></i> Hapus Akun</button>' +
      '</form></div></div>';
    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('settingsName').value.trim();
      const email = document.getElementById('settingsEmail').value.trim();
      const school = document.getElementById('settingsSchool').value.trim();
      const currentUser = Auth.getUser();
      if (!currentUser) { Auth.showToast('Kamu belum login', 'error'); return; }
      if (!name || !email) { Auth.showToast('Nama dan email wajib diisi', 'error'); return; }
      currentUser.name = name; currentUser.email = email; currentUser.school = school;
      currentUser.avatar = name[0].toUpperCase();
      Auth.persistUser(currentUser);
      Auth.refreshUI();
      Auth.showToast('Pengaturan disimpan!', 'success');
      closeModal();
    });
    div.addEventListener('click', (e) => { if (e.target === div) closeModal(); });
  }

  function closeModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; setTimeout(() => { if (modal && !modal.classList.contains('active')) modal.remove(); }, 300); }
  }

  function deleteAccount() {
    if (confirm('Yakin ingin menghapus akun? Semua data akan hilang.')) {
      Auth.clearSession();
      Auth.showToast('Akun berhasil dihapus', 'info');
      closeModal();
      window.location.hash = '#/home';
    }
  }

  return { openModal, closeModal, deleteAccount };
})();
