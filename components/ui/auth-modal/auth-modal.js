import { injectStyle } from '../../../js/utils/styleLoader.js';

injectStyle('components/ui/auth-modal/auth-modal.css');

export function renderAuthModal() { return `
<div id="authModal" class="modal-edquest" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
  <div class="modal-content">
    <div class="modal-header">
      <h3 id="authModalTitle" class="text-xl font-bold" style="color:var(--text-primary);">Akun Edquest</h3>
      <button class="modal-close" data-action="close-modal" aria-label="Tutup"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body">
      <div class="auth-tabs" role="tablist">
        <button class="auth-tab active" data-tab="login" role="tab" aria-selected="true">Masuk</button>
        <button class="auth-tab" data-tab="register" role="tab" aria-selected="false">Daftar</button>
      </div>
      <form id="loginForm" class="auth-form form-edquest" novalidate>
        <div class="mb-4">
          <label class="form-label" for="loginEmail">Email</label>
          <input id="loginEmail" type="email" class="form-input" placeholder="nama@email.com" autocomplete="email">
          <span class="form-error"></span>
        </div>
        <div class="mb-4">
          <label class="form-label" for="loginPassword">Password</label>
          <div class="relative">
            <input id="loginPassword" type="password" class="form-input pr-10" placeholder="Minimal 8 karakter" autocomplete="current-password">
            <button type="button" class="password-toggle" data-toggle-password="loginPassword" aria-label="Tampilkan password" tabindex="-1"><i class="fas fa-eye"></i></button>
          </div>
          <span class="form-error"></span>
        </div>
        <div class="flex items-center justify-between mb-6">
          <label class="form-checkbox"><input type="checkbox" id="rememberMe" checked> Ingat saya</label>
          <a href="#" class="text-sm font-medium no-underline" style="color:var(--primary);">Lupa password?</a>
        </div>
        <button type="submit" class="btn-edquest btn-primary-grad w-full">Masuk</button>
        <p class="text-center text-sm mt-4" style="color:var(--text-muted);">Belum punya akun? <a href="#" onclick="Auth.openModal('register');return false;" style="color:var(--primary);font-weight:600;">Daftar</a></p>
      </form>
      <form id="registerForm" class="auth-form form-edquest" style="display:none;" novalidate>
        <div class="mb-4">
          <label class="form-label" for="regName">Nama / Nama Panggilan</label>
          <input id="regName" type="text" class="form-input" placeholder="Contoh: Dani, Alex, atau 'Siswa Pemula'" autocomplete="name">
          <span class="form-error"></span>
        </div>
        <div class="mb-4">
          <label class="form-label" for="regEmail">Email</label>
          <input id="regEmail" type="email" class="form-input" placeholder="nama@email.com" autocomplete="email">
          <span class="form-error"></span>
        </div>
        <div class="mb-4">
          <label class="form-label" for="regSchool">Sekolah / Asal</label>
          <input id="regSchool" type="text" class="form-input" placeholder="Contoh: SMA Negeri 1 Jakarta">
          <span class="form-error"></span>
        </div>
        <div class="mb-4">
          <label class="form-label" for="regMapel">Mapel Utama</label>
          <select id="regMapel" class="form-input" style="cursor:pointer;">
            <option value="" disabled selected>Pilih mapel utama</option>
            <option value="matematika">Matematika</option>
            <option value="fisika">Fisika</option>
            <option value="kimia">Kimia</option>
            <option value="biologi">Biologi</option>
            <option value="sejarah">Sejarah</option>
            <option value="bahasa">Bahasa Indonesia</option>
            <option value="ips">IPS</option>
          </select>
          <span class="form-error"></span>
        </div>
        <div class="mb-4">
          <label class="form-label" for="regMinat">Gaya Belajar</label>
          <select id="regMinat" class="form-input" style="cursor:pointer;">
            <option value="" disabled selected>Pilih gaya belajar</option>
            <option value="diskusi">Suka diskusi</option>
            <option value="materi">Suka materi lengkap</option>
            <option value="soal">Suka tryout & soal</option>
            <option value="kreatif">Suka cara kreatif</option>
          </select>
          <span class="form-error"></span>
        </div>
        <div class="mb-4">
          <label class="form-label" for="regKelas">Kelas</label>
          <select id="regKelas" class="form-input" style="cursor:pointer;">
            <option value="" disabled selected>Pilih kelas</option>
            <option value="10">Kelas 10</option>
            <option value="11">Kelas 11</option>
            <option value="12">Kelas 12</option>
          </select>
          <span class="form-error"></span>
        </div>
        <div class="mb-4">
          <label class="form-label" for="regPassword">Password</label>
          <div class="relative">
            <input id="regPassword" type="password" class="form-input pr-10" placeholder="Minimal 8 karakter" autocomplete="new-password">
            <button type="button" class="password-toggle" data-toggle-password="regPassword" aria-label="Tampilkan password" tabindex="-1"><i class="fas fa-eye"></i></button>
          </div>
          <span class="form-error"></span>
        </div>
        <div class="mb-6">
          <label class="form-label" for="regConfirm">Konfirmasi Password</label>
          <div class="relative">
            <input id="regConfirm" type="password" class="form-input pr-10" placeholder="Ketik ulang password" autocomplete="new-password">
            <button type="button" class="password-toggle" data-toggle-password="regConfirm" aria-label="Tampilkan password" tabindex="-1"><i class="fas fa-eye"></i></button>
          </div>
          <span class="form-error"></span>
        </div>
        <button type="submit" class="btn-edquest btn-primary-grad w-full">Daftar</button>
        <p class="text-center text-sm mt-4" style="color:var(--text-muted);">Sudah punya akun? <a href="#" onclick="Auth.openModal('login');return false;" style="color:var(--primary);font-weight:600;">Masuk</a></p>
      </form>
    </div>
  </div>
</div>
`; }
