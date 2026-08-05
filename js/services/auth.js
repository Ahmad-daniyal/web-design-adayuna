import { CONFIG } from '../core/config.js';
import { dataStore } from '../data/index.js';

const USER_KEY = CONFIG.STORAGE_KEYS.USER;
const REGISTERED_KEY = CONFIG.STORAGE_KEYS.REGISTERED_USERS;

export const Auth = (() => {
  let currentUser = null;
  let pendingRegisterEmail = null;

  function init() {
    const registered = getRegisteredUsers();
    let changed = false;
    registered.forEach(u => {
      if (!u.id) { u.id = generateUserId(registered); changed = true; }
      if (!u.mapel) u.mapel = 'umum';
      if (!u.minat) u.minat = 'diskusi';
      if (!u.kelas) u.kelas = '10';
    });
    if (changed) saveRegisteredUsers(registered);
    const saved = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
        if (!currentUser.id) {
          const acc = registered.find(u => u.email.toLowerCase() === (currentUser.email || '').toLowerCase());
          currentUser.id = (acc && acc.id) || generateUserId(registered);
          persistUser(currentUser);
        }
        updateUIForLoggedInUser();
      }
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
      const registerHint = e.target.closest('[data-action="register-hint"]');
      if (registerHint) { e.preventDefault(); openModal('register'); }
      const pwToggle = e.target.closest('[data-toggle-password]');
      if (pwToggle) togglePassword(pwToggle);
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
    const wasActive = modal.classList.contains('active');
    if (!wasActive) resetAuthForms();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (tab) {
      if (tab === 'register' && pendingRegisterEmail) {
        const regEmail = document.getElementById('regEmail');
        if (regEmail) regEmail.value = pendingRegisterEmail;
        pendingRegisterEmail = null;
      }
      switchTab(tab);
    }
  }

  function closeModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function togglePassword(btn) {
    const input = document.getElementById(btn.dataset.togglePassword);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) icon.className = 'fas ' + (show ? 'fa-eye-slash' : 'fa-eye');
    btn.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
    input.focus();
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

    const registered = getRegisteredUsers();
    const account = registered.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!account) {
      showRegisterHint(form);
      return;
    }
    if (account.password !== password) {
      showError(form.querySelector('#loginPassword'), 'Password salah');
      return;
    }

    currentUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      school: account.school || '',
      mapel: account.mapel || 'umum',
      minat: account.minat || 'diskusi',
      kelas: account.kelas || '10',
      avatar: account.avatar || (account.name[0] || '?').toUpperCase(),
      joined: account.joined,
      points: account.points || 0,
      badges: account.badges || [],
      journal: account.journal || []
    };
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
    const mapel = form.querySelector('#regMapel').value;
    const minat = form.querySelector('#regMinat').value;
    const kelas = form.querySelector('#regKelas').value;
    const password = form.querySelector('#regPassword').value;
    const confirm = form.querySelector('#regConfirm').value;
    clearErrors(form);
    let valid = true;
    if (!name || name.length < 2) { showError(form.querySelector('#regName'), 'Nama minimal 2 karakter'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(form.querySelector('#regEmail'), 'Masukkan email yang valid'); valid = false; }
    if (!school) { showError(form.querySelector('#regSchool'), 'Asal sekolah wajib diisi'); valid = false; }
    if (!mapel) { showError(form.querySelector('#regMapel'), 'Pilih mapel utama'); valid = false; }
    if (!minat) { showError(form.querySelector('#regMinat'), 'Pilih gaya belajar'); valid = false; }
    if (!kelas) { showError(form.querySelector('#regKelas'), 'Pilih kelas'); valid = false; }
    if (!password || password.length < 8) { showError(form.querySelector('#regPassword'), 'Password minimal 8 karakter'); valid = false; }
    if (password !== confirm) { showError(form.querySelector('#regConfirm'), 'Konfirmasi password tidak cocok'); valid = false; }
    if (!valid) return;

    const registered = getRegisteredUsers();
    if (registered.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showError(form.querySelector('#regEmail'), 'Email sudah terdaftar, silakan masuk');
      return;
    }

    const account = {
      id: generateUserId(registered),
      name,
      email,
      school,
      mapel,
      minat,
      kelas,
      password,
      avatar: name[0].toUpperCase(),
      joined: new Date().toISOString(),
      points: 0,
      badges: [],
      journal: []
    };
    registered.push(account);
    saveRegisteredUsers(registered);
    currentUser = { name: account.name, email: account.email, school: account.school, mapel: account.mapel, minat: account.minat, kelas: account.kelas, avatar: account.avatar, id: account.id, joined: account.joined, points: 0, badges: [], journal: [] };
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    closeModal();
    updateUIForLoggedInUser();
    showToast('Akun berhasil dibuat! ID kamu: ' + account.id, 'success');
  }

  function handleLogout() {
    clearSession();
    showToast('Berhasil keluar', 'info');
  }

  function clearSession() {
    currentUser = null;
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    pendingRegisterEmail = null;
    resetAuthForms();
    updateUIForLoggedInUser();
  }

  function getRegisteredUsers() {
    try {
      const raw = localStorage.getItem(REGISTERED_KEY);
      const users = raw ? JSON.parse(raw) : [];
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  function generateUserId(registered) {
    const taken = new Set((registered || []).map(u => u.id).filter(Boolean));
    (dataStore.buddies || []).forEach(b => { if (b.id) taken.add(String(b.id)); });
    let id;
    do { id = String(Math.floor(100000 + Math.random() * 900000)); } while (taken.has(id));
    return id;
  }

  function saveRegisteredUsers(users) {
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(users));
  }

  function resetAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) { loginForm.reset(); clearErrors(loginForm); }
    if (registerForm) { registerForm.reset(); clearErrors(registerForm); }
  }

  function showRegisterHint(form) {
    const emailInput = form.querySelector('#loginEmail');
    const errorEl = emailInput.parentElement.querySelector('.form-error');
    pendingRegisterEmail = emailInput.value;
    emailInput.classList.add('error');
    if (errorEl) {
      errorEl.innerHTML = 'Anda belum memiliki akun, silahkan daftar terlebih dahulu. <a href="#" data-action="register-hint" style="color:var(--primary);font-weight:600;text-decoration:underline;">Daftar sekarang</a>';
      errorEl.classList.add('show');
    }
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
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
    toast.innerHTML = '<span class="toast-icon"><i class="fas ' + (icons[type] || icons.info) + '"></i></span>' +
      '<span class="toast-message">' + message + '</span>' +
      '<button class="toast-close" onclick="this.parentElement.remove()" aria-label="Tutup"><i class="fas fa-times"></i></button>' +
      '<span class="toast-progress"></span>';
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 4000);
  }

  return { init, openModal, closeModal, getUser, isLoggedIn, getRegisteredUsers, clearSession, showToast, persistUser, refreshUI };
})();
