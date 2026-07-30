/**
 * KAWANSINAU — CORE APP MODULE (js/app.js)
 * Global Auth Modal (Login/Register), Session Manager, Dark Mode, & Navbar State
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Global Auth Modal into DOM
  injectAuthModal();

  // 2. Initialize Dark Mode
  initDarkMode();

  // 3. Initialize Auth System & Navbar User State
  initAuthSystem();

  // 4. Initialize Mobile Navigation
  initMobileNav();

  // 5. Highlight Active Navbar Link
  highlightActiveNavLink();

  // 6. Update Footer Copyright Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ==========================================================================
   GLOBAL AUTH MODAL INJECTION & LOGIC
   ========================================================================== */

function injectAuthModal() {
  if (document.getElementById('authModalOverlay')) return;

  const modalHtml = `
    <div class="modal-overlay" id="authModalOverlay" aria-hidden="true">
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
        <button class="modal-close-btn" id="authModalClose" aria-label="Tutup Modal">&times;</button>
        
        <!-- Auth Tabs (Masuk / Daftar) -->
        <div class="auth-tabs">
          <button class="auth-tab-btn active" id="tabBtnLogin">Masuk</button>
          <button class="auth-tab-btn" id="tabBtnRegister">Daftar Akun</button>
        </div>

        <!-- FORM LOGIN -->
        <div id="formLoginContainer">
          <h3 id="authModalTitle" style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.4rem; text-align: center;">Selamat Datang Kembali</h3>
          <p style="color: var(--text-muted); font-size: 0.88rem; text-align: center; margin-bottom: 1.5rem;">Masuk ke akun KawanSinau Anda untuk mulai berdiskusi.</p>

          <form id="loginForm" novalidate>
            <div class="form-group">
              <label for="loginEmail" class="form-label">Email Sekolah / Pribadi</label>
              <input type="email" id="loginEmail" class="form-input" placeholder="nama@sekolah.sch.id" required>
            </div>
            <div class="form-group">
              <label for="loginPassword" class="form-label">Kata Sandi</label>
              <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-size: 0.85rem;">
              <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; color: var(--text-secondary);">
                <input type="checkbox" id="loginRemember" checked> Ingat saya
              </label>
              <a href="#" id="forgotPasswordLink" style="color: var(--accent-blue); font-weight: 600;">Lupa password?</a>
            </div>

            <p id="loginErrorAlert" style="color: var(--accent-red); font-size: 0.85rem; font-weight: 500; margin-bottom: 1rem;" class="hidden">
              ⚠️ Silakan isi email valid dan kata sandi (minimal 8 karakter).
            </p>

            <button type="submit" class="btn-ios btn-ios-primary" id="btnSubmitLogin" style="width: 100%;">
              <span>Masuk Sekarang</span>
            </button>
          </form>
        </div>

        <!-- FORM REGISTER -->
        <div id="formRegisterContainer" class="hidden">
          <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.4rem; text-align: center;">Gabung KawanSinau</h3>
          <p style="color: var(--text-muted); font-size: 0.88rem; text-align: center; margin-bottom: 1.5rem;">Belajar bersama teman sebaya tanpa rasa malu atau minder.</p>

          <form id="registerForm" novalidate>
            <div class="form-group">
              <label for="regName" class="form-label">Nama Panggilan / Alias</label>
              <input type="text" id="regName" class="form-input" placeholder="Contoh: Budi / TemanFisika" required>
            </div>

            <div class="form-group">
              <label for="regEmail" class="form-label">Alamat Email</label>
              <input type="email" id="regEmail" class="form-input" placeholder="nama@sekolah.sch.id" required>
            </div>

            <div class="form-group">
              <label for="regSchool" class="form-label">Asal Sekolah</label>
              <input type="text" id="regSchool" class="form-input" placeholder="SMA Negeri 1 Jakarta / SMK 2" required>
            </div>

            <div class="form-group">
              <label for="regPassword" class="form-label">Kata Sandi (Min. 8 Karakter)</label>
              <input type="password" id="regPassword" class="form-input" placeholder="••••••••" required>
            </div>

            <div class="form-group">
              <label for="regConfirmPassword" class="form-label">Konfirmasi Kata Sandi</label>
              <input type="password" id="regConfirmPassword" class="form-input" placeholder="••••••••" required>
            </div>

            <p id="regErrorAlert" style="color: var(--accent-red); font-size: 0.85rem; font-weight: 500; margin-bottom: 1rem;" class="hidden">
              ⚠️ Pastikan semua kolom terisi, kata sandi min. 8 karakter, dan konfirmasi kata sandi cocok.
            </p>

            <button type="submit" class="btn-ios btn-ios-mint" id="btnSubmitRegister" style="width: 100%;">
              <span>Daftar Akun Gratis</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/* ==========================================================================
   AUTH SYSTEM & SESSION MANAGEMENT
   ========================================================================== */

function initAuthSystem() {
  const modalOverlay = document.getElementById('authModalOverlay');
  const modalClose = document.getElementById('authModalClose');
  const tabBtnLogin = document.getElementById('tabBtnLogin');
  const tabBtnRegister = document.getElementById('tabBtnRegister');
  const formLoginContainer = document.getElementById('formLoginContainer');
  const formRegisterContainer = document.getElementById('formRegisterContainer');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginErrorAlert = document.getElementById('loginErrorAlert');
  const regErrorAlert = document.getElementById('regErrorAlert');

  // Open Modal Triggers (from Nav Buttons)
  document.addEventListener('click', (e) => {
    if (e.target.closest('#btnOpenAuthModal') || e.target.closest('.trigger-auth-modal')) {
      e.preventDefault();
      openAuthModal();
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeAuthModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeAuthModal();
    });
  }

  // Switch Tabs
  if (tabBtnLogin && tabBtnRegister) {
    tabBtnLogin.addEventListener('click', () => {
      tabBtnLogin.classList.add('active');
      tabBtnRegister.classList.remove('active');
      formLoginContainer.classList.remove('hidden');
      formRegisterContainer.classList.add('hidden');
    });

    tabBtnRegister.addEventListener('click', () => {
      tabBtnRegister.classList.add('active');
      tabBtnLogin.classList.remove('active');
      formRegisterContainer.classList.remove('hidden');
      formLoginContainer.classList.add('hidden');
    });
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      loginErrorAlert.classList.add('hidden');

      if (!validateEmail(email) || password.length < 8) {
        loginErrorAlert.classList.remove('hidden');
        shakeElement(document.getElementById('loginEmail'));
        shakeElement(document.getElementById('loginPassword'));
        return;
      }

      // Simulate Login Success
      const name = email.split('@')[0];
      const user = { name: name.charAt(0).toUpperCase() + name.slice(1), email: email, school: 'SMA Negeri' };
      localStorage.setItem('kawansinau_user', JSON.stringify(user));

      updateNavbarUserState();
      closeAuthModal();
      showNotification(`Selamat datang kembali, ${user.name}! 👋`);
    });
  }

  // Handle Register Submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const school = document.getElementById('regSchool').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

      regErrorAlert.classList.add('hidden');

      if (!name || !validateEmail(email) || password.length < 8 || password !== confirmPassword) {
        regErrorAlert.classList.remove('hidden');
        if (!name) shakeElement(document.getElementById('regName'));
        if (!validateEmail(email)) shakeElement(document.getElementById('regEmail'));
        if (password.length < 8) shakeElement(document.getElementById('regPassword'));
        if (password !== confirmPassword) shakeElement(document.getElementById('regConfirmPassword'));
        return;
      }

      // Simulate Register Success
      const user = { name: name, email: email, school: school || 'Siswa Indonesia' };
      localStorage.setItem('kawansinau_user', JSON.stringify(user));

      updateNavbarUserState();
      closeAuthModal();
      showNotification(`Akun berhasil dibuat! Selamat bergabung, ${user.name} 🎉`);
    });
  }

  // Update initial Navbar State
  updateNavbarUserState();
}

function openAuthModal() {
  const modalOverlay = document.getElementById('authModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
  }
}

function closeAuthModal() {
  const modalOverlay = document.getElementById('authModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }
}

function updateNavbarUserState() {
  const navAuthArea = document.getElementById('navAuthArea');
  if (!navAuthArea) return;

  const savedUser = localStorage.getItem('kawansinau_user');

  if (savedUser) {
    const user = JSON.parse(savedUser);
    const firstLetter = user.name.charAt(0).toUpperCase();
    navAuthArea.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.6rem;">
        <a href="profile.html" class="badge-ios badge-ios-blue" style="padding:0.4rem 0.85rem;">
          <span style="width:22px; height:22px; border-radius:50%; background:var(--accent-blue); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem;">${firstLetter}</span>
          <span>${user.name}</span>
        </a>
        <button id="btnLogout" class="btn-ios btn-ios-ghost" style="padding:0.4rem 0.6rem; font-size:0.8rem;" title="Keluar">
          🚪 Keluar
        </button>
      </div>
    `;

    document.getElementById('btnLogout')?.addEventListener('click', () => {
      localStorage.removeItem('kawansinau_user');
      updateNavbarUserState();
      showNotification('Anda telah keluar dari akun.');
    });
  } else {
    navAuthArea.innerHTML = `
      <button class="btn-ios btn-ios-primary" id="btnOpenAuthModal">
        <span>Masuk / Daftar</span>
      </button>
    `;
  }
}

/* ==========================================================================
   DARK MODE TOGGLE SYSTEM
   ========================================================================== */

function initDarkMode() {
  const darkToggleBtn = document.getElementById('darkToggleBtn');
  const savedTheme = localStorage.getItem('kawansinau_theme') || 'light';

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      if (darkToggleBtn) darkToggleBtn.innerHTML = '☀️';
    } else {
      document.body.classList.remove('dark-theme');
      if (darkToggleBtn) darkToggleBtn.innerHTML = '🌙';
    }
    localStorage.setItem('kawansinau_theme', theme);
  };

  applyTheme(savedTheme);

  if (darkToggleBtn) {
    darkToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      applyTheme(isDark ? 'light' : 'dark');
    });
  }
}

/* ==========================================================================
   MOBILE NAVIGATION MENU TOGGLE
   ========================================================================== */

function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeElement(el) {
  if (!el) return;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 500);
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function showNotification(msg) {
  let toast = document.getElementById('iosToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'iosToastNotification';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 3000;
      background: var(--bg-surface);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-ios-lg);
      padding: 0.85rem 1.5rem;
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3500);
}
