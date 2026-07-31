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
          <input id="loginPassword" type="password" class="form-input" placeholder="Minimal 8 karakter" autocomplete="current-password">
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
          <label class="form-label" for="regPassword">Password</label>
          <input id="regPassword" type="password" class="form-input" placeholder="Minimal 8 karakter" autocomplete="new-password">
          <span class="form-error"></span>
        </div>
        <div class="mb-6">
          <label class="form-label" for="regConfirm">Konfirmasi Password</label>
          <input id="regConfirm" type="password" class="form-input" placeholder="Ketik ulang password" autocomplete="new-password">
          <span class="form-error"></span>
        </div>
        <button type="submit" class="btn-edquest btn-primary-grad w-full">Daftar</button>
        <p class="text-center text-sm mt-4" style="color:var(--text-muted);">Sudah punya akun? <a href="#" onclick="Auth.openModal('login');return false;" style="color:var(--primary);font-weight:600;">Masuk</a></p>
      </form>
    </div>
  </div>
</div>
`; }