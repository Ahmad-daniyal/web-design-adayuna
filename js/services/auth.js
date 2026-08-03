import { CONFIG } from '../core/config.js';

const USER_KEY = CONFIG.STORAGE_KEYS.USER;

export const Auth = (() => {
  let currentUser = null;

  function init() {
    const saved = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (saved) {
      try { currentUser = JSON.parse(saved); updateUIForLoggedInUser(); }
      catch { clearSession(); }
    }
    bindEvents();
  }

  function bindEvents() {
    document.addEventListener('click', (e) => {
      const loginBtn = e.target.closest('[data-action="login"]');
      const registerBtn = e.target.closest('[data-action="register"]');
      const modalClose = e.target.closest('[data-action="close-modal"]');
      const modalOverlay = e.target.closest('.modal-edquest');
      if (loginBtn) { e.preventDefault(); openModal('login'); }
      if (registerBtn) { e.preventDefault(); openModal('register'); }
      if (modalClose) { closeModal(); }
      if (modalOverlay && e.target.classList.contains('modal-edquest')) closeModal();
      const tab = e.target.closest('.auth-tab');
      if (tab) switchTab(tab.dataset.tab);
      const logoutBtn = e.target.closest('[data-action="logout"]');
      if (logoutBtn) { e.preventDefault(); handleLogout(); }
    });
    document.addEventListener('submit', (e) => {
      const loginForm = e.target.closest('#loginForm');
      const registerForm = e.target.closest('#registerForm');
      if (loginForm) { e.preventDefault(); handleLogin(e); }
      if (registerForm) { e.preventDefault(); handleRegister(e); }
    });
  }

  function openModal(tab) {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (tab) switchTab(tab);
  }

  function closeModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.auth-form').forEach(f => { f.style.display = f.id === tab + 'Form' ? 'block' : 'none'; });
  }

  function handleLogin(e) {
    const form = e.target;
    const email = form.querySelector('#loginEmail').value.trim();
    const password = form.querySelector('#loginPassword').value;
    const remember = form.querySelector('#rememberMe').checked;
    clearErrors(form);
    let valid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(form.querySelector('#loginEmail'), 'Masukkan email yang valid'); valid = false; }
    if (!password) { showError(form.querySelector('#loginPassword'), 'Password tidak boleh kosong'); valid = false; }
    if (!valid) return;
    currentUser = { name: email.split('@')[0], email, avatar: email[0].toUpperCase(), joined: new Date().toISOString(), points: 0, badges: [], journal: [] };
    if (remember) localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    else sessionStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    closeModal();
    updateUIForLoggedInUser();
    showToast('Selamat datang, ' + currentUser.name + '!', 'success');
  }

  function handleRegister(e) {
    const form = e.target;
    const name = form.querySelector('#regName').value.trim();
    const email = form.querySelector('#regEmail').value.trim();
    const school = form.querySelector('#regSchool').value.trim();
    const password = form.querySelector('#regPassword').value;
    const confirm = form.querySelector('#regConfirm').value;
    clearErrors(form);
    let valid = true;
    if (!name || name.length < 2) { showError(form.querySelector('#regName'), 'Nama minimal 2 karakter'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(form.querySelector('#regEmail'), 'Masukkan email yang valid'); valid = false; }
    if (!school) { showError(form.querySelector('#regSchool'), 'Asal sekolah wajib diisi'); valid = false; }
    if (!password || password.length < 8) { showError(form.querySelector('#regPassword'), 'Password minimal 8 karakter'); valid = false; }
    if (password !== confirm) { showError(form.querySelector('#regConfirm'), 'Konfirmasi password tidak cocok'); valid = false; }
    if (!valid) return;
    currentUser = { name, email, school, avatar: name[0].toUpperCase(), joined: new Date().toISOString(), points: 0, badges: [], journal: [] };
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    closeModal();
    updateUIForLoggedInUser();
    showToast('Akun berhasil dibuat! Selamat datang, ' + name + '!', 'success');
  }

  function handleLogout() {
    clearSession();
    showToast('Berhasil keluar', 'info');
  }

  function clearSession() {
    currentUser = null;
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    updateUIForLoggedInUser();
  }

  function persistUser(user) {
    if (localStorage.getItem(USER_KEY)) localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (sessionStorage.getItem(USER_KEY)) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function refreshUI() {
    updateUIForLoggedInUser();
  }

  function updateUIForLoggedInUser() {
    document.querySelectorAll('[data-action="login"],[data-action="register"]').forEach(el => el.style.display = currentUser ? 'none' : '');
    document.querySelectorAll('.user-menu').forEach(el => { el.style.display = currentUser ? 'flex' : 'none'; });
    document.querySelectorAll('.guest-menu').forEach(el => { el.style.display = currentUser ? 'none' : 'flex'; });
    if (currentUser) {
      document.querySelectorAll('.user-name').forEach(el => el.textContent = currentUser.name);
      document.querySelectorAll('.user-avatar').forEach(el => el.textContent = currentUser.avatar);
    }
  }

  function showError(input, message) {
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) { errorEl.textContent = message; errorEl.classList.add('show'); }
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(e => { e.textContent = ''; e.classList.remove('show'); });
  }

  function getUser() { return currentUser; }

  function isLoggedIn() { return !!currentUser; }

  function showToast(message, type) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '" style="color:' + (type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6') + ';font-size:1.25rem;"></i>' +
      '<span style="flex:1;font-size:0.875rem;font-weight:500;">' + message + '</span>' +
      '<button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:0.25rem;"><i class="fas fa-times"></i></button>';
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 4000);
  }

  return { init, openModal, closeModal, getUser, isLoggedIn, clearSession, showToast, persistUser, refreshUI };
})();
