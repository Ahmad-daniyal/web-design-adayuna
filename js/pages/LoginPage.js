/**
 * LoginPage Component (js/pages/LoginPage.js)
 */
import { Store } from '../store.js';

export const LoginPage = {
  render: () => {
    const user = Store.getUser();
    return `
      <section style="display: flex; align-items: center; justify-content: center; padding: 4rem 0;">
        <div class="container" style="max-width: 440px;">
          <div class="card" style="padding: 2.5rem 2rem; text-align: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
              👋
            </div>

            <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem;">Selamat Datang!</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">Masukkan nama Anda untuk mulai merekam progres belajar.</p>

            <form id="loginForm" novalidate>
              <div class="form-group" id="nameGroup">
                <label for="userName" class="form-label">Nama Lengkap</label>
                <input type="text" id="userName" class="form-input" placeholder="Masukkan nama Anda (misal: Budi Utomo)" value="${user ? user.name : ''}" required>
              </div>

              <div class="form-group" id="emailGroup">
                <label for="userEmail" class="form-label">Alamat Email</label>
                <input type="email" id="userEmail" class="form-input" placeholder="nama@email.com" value="${user ? user.email : ''}" required>
              </div>

              <p id="errorAlert" style="color: var(--accent-red); font-size: 0.85rem; font-weight: 500; margin-bottom: 1rem;" class="hidden">
                ⚠️ Silakan isi nama dan email terlebih dahulu!
              </p>

              <button type="submit" id="btnSubmitLogin" class="btn btn-primary" style="width: 100%; padding: 0.8rem;">
                <span>Mulai Belajar</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    `;
  },
  attachEvents: (navigateTo) => {
    const form = document.getElementById('loginForm');
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const btnSubmit = document.getElementById('btnSubmitLogin');
    const errorAlert = document.getElementById('errorAlert');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      let isValid = true;

      nameInput.classList.remove('shake');
      emailInput.classList.remove('shake');
      errorAlert.classList.add('hidden');

      if (!nameVal) { nameInput.classList.add('shake'); isValid = false; }
      if (!emailVal) { emailInput.classList.add('shake'); isValid = false; }

      if (!isValid) {
        errorAlert.classList.remove('hidden');
        setTimeout(() => {
          nameInput.classList.remove('shake');
          emailInput.classList.remove('shake');
        }, 600);
        return;
      }

      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span>
        <span>Memproses Sesi...</span>
      `;

      Store.setUser(nameVal, emailVal);

      setTimeout(() => {
        navigateTo('#dashboard');
      }, 1500);
    });
  }
};
