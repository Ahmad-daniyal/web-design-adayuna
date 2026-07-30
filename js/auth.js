/* ===== Edquest — Auth System ===== */

const Auth = (() => {
  let currentUser = null;

  function init() {
    const saved = localStorage.getItem('edquest_user');
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
        updateUIForLoggedInUser();
      } catch {
        localStorage.removeItem('edquest_user');
      }
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
      if (modalOverlay && e.target.classList.contains('modal-edquest')) {
        closeModal();
      }
    });

    document.addEventListener('submit', (e) => {
      const loginForm = e.target.closest('#loginForm');
      const registerForm = e.target.closest('#registerForm');
      if (loginForm) { e.preventDefault(); handleLogin(e); }
      if (registerForm) { e.preventDefault(); handleRegister(e); }
    });

    document.addEventListener('click', (e) => {
      const tab = e.target.closest('.auth-tab');
      if (tab) switchTab(tab.dataset.tab);
    });

    document.addEventListener('click', (e) => {
      const logoutBtn = e.target.closest('[data-action="logout"]');
      if (logoutBtn) { e.preventDefault(); handleLogout(); }
    });
  }

  function openModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchTab(tab);
  }

  function closeModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('.auth-form').forEach(f => {
      f.style.display = f.id === `${tab}Form` ? 'block' : 'none';
    });
  }

  function handleLogin(e) {
    const form = e.target;
    const email = form.querySelector('#loginEmail').value.trim();
    const password = form.querySelector('#loginPassword').value;
    const remember = form.querySelector('#rememberMe').checked;
    let valid = true;

    clearErrors(form);

    if (!email || !isValidEmail(email)) {
      showError(form.querySelector('#loginEmail'), 'Masukkan email yang valid');
      valid = false;
    }
    if (!password) {
      showError(form.querySelector('#loginPassword'), 'Password tidak boleh kosong');
      valid = false;
    }

    if (!valid) return;

    currentUser = {
      name: email.split('@')[0],
      email: email,
      avatar: email[0].toUpperCase(),
      joined: new Date().toISOString(),
      points: 0,
      badges: [],
      journal: []
    };

    if (remember) {
      localStorage.setItem('edquest_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.setItem('edquest_user', JSON.stringify(currentUser));
    }

    closeModal();
    updateUIForLoggedInUser();
    showToast(`Selamat datang, ${currentUser.name}!`, 'success');
  }

  function handleRegister(e) {
    const form = e.target;
    const name = form.querySelector('#regName').value.trim();
    const email = form.querySelector('#regEmail').value.trim();
    const school = form.querySelector('#regSchool').value.trim();
    const password = form.querySelector('#regPassword').value;
    const confirm = form.querySelector('#regConfirm').value;
    let valid = true;

    clearErrors(form);

    if (!name || name.length < 2) {
      showError(form.querySelector('#regName'), 'Nama minimal 2 karakter');
      valid = false;
    }
    if (!email || !isValidEmail(email)) {
      showError(form.querySelector('#regEmail'), 'Masukkan email yang valid');
      valid = false;
    }
    if (!school) {
      showError(form.querySelector('#regSchool'), 'Asal sekolah wajib diisi');
      valid = false;
    }
    if (!password || password.length < 8) {
      showError(form.querySelector('#regPassword'), 'Password minimal 8 karakter');
      valid = false;
    }
    if (password !== confirm) {
      showError(form.querySelector('#regConfirm'), 'Konfirmasi password tidak cocok');
      valid = false;
    }

    if (!valid) return;

    currentUser = {
      name: name,
      email: email,
      school: school,
      avatar: name[0].toUpperCase(),
      joined: new Date().toISOString(),
      points: 0,
      badges: [],
      journal: []
    };

    localStorage.setItem('edquest_user', JSON.stringify(currentUser));
    closeModal();
    updateUIForLoggedInUser();
    showToast(`Akun berhasil dibuat! Selamat datang, ${name}!`, 'success');
  }

  function handleLogout() {
    currentUser = null;
    localStorage.removeItem('edquest_user');
    sessionStorage.removeItem('edquest_user');
    updateUIForLoggedInUser();
    showToast('Berhasil keluar', 'info');
  }

  function updateUIForLoggedInUser() {
    const loginBtns = document.querySelectorAll('[data-action="login"], [data-action="register"]');
    const userMenus = document.querySelectorAll('.user-menu');
    const guestMenus = document.querySelectorAll('.guest-menu');

    if (currentUser) {
      loginBtns.forEach(el => el.style.display = 'none');
      userMenus.forEach(el => { el.style.display = 'flex'; });
      guestMenus.forEach(el => { el.style.display = 'none'; });
      userMenus.forEach(el => {
        const nameEl = el.querySelector('.user-name');
        const avatarEl = el.querySelector('.user-avatar');
        if (nameEl) nameEl.textContent = currentUser.name;
        if (avatarEl) avatarEl.textContent = currentUser.avatar;
      });
    } else {
      loginBtns.forEach(el => el.style.display = '');
      userMenus.forEach(el => { el.style.display = 'none'; });
      guestMenus.forEach(el => { el.style.display = ''; });
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(e => {
      e.textContent = '';
      e.classList.remove('show');
    });
  }

  function getUser() {
    return currentUser;
  }

  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info}" style="color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : 'var(--primary)'}; font-size: 1.25rem;"></i>
      <span style="flex:1; font-size:0.875rem; font-weight:500;">${message}</span>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:0.25rem;">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  return { init, openModal, closeModal, getUser, showToast };
})();

document.addEventListener('DOMContentLoaded', () => Auth.init());
