(function() {
  'use strict';

  // ============= STATE =============
  let state = {
    user: null,
    theme: localStorage.getItem('kawanpintar-theme') || 'light',
    likedThreads: new Set(),
    likedComments: new Set(),
    journals: JSON.parse(localStorage.getItem('kawanpintar-journals') || '[]'),
    buddies: [
      { name: 'Aulia R', initials: 'AR', school: 'SMAN 1 Jakarta', subjects: ['Matematika', 'Fisika'], desc: 'Suka ngerjain soal kalkulus bareng-bareng' },
      { name: 'Bagus P', initials: 'BP', school: 'SMAN 3 Bandung', subjects: ['Biologi', 'Kimia'], desc: 'Pengen belajar Biologi molekuler' },
      { name: 'Citra D', initials: 'CD', school: 'SMAN 2 Surabaya', subjects: ['Bahasa Inggris', 'Sejarah'], desc: 'Belajar sastra Inggris dan diskusi sejarah' },
      { name: 'Dimas H', initials: 'DH', school: 'SMAN 5 Yogyakarta', subjects: ['Matematika', 'Ekonomi'], desc: 'Persiapan UTBK bareng yuk!' },
      { name: 'Eka S', initials: 'ES', school: 'SMAN 4 Semarang', subjects: ['Fisika', 'Kimia'], desc: 'Riset kecil-kecilan dan eksperimen' },
      { name: 'Fajar N', initials: 'FN', school: 'SMAN 1 Medan', subjects: ['Geografi', 'Sosiologi'], desc: 'Diskusi isu sosial dan lingkungan' },
      { name: 'Gita W', initials: 'GW', school: 'SMAN 6 Malang', subjects: ['Bahasa Inggris', 'Seni'], desc: 'Belajar debat bahasa Inggris' },
      { name: 'Hendra K', initials: 'HK', school: 'SMAN 2 Makassar', subjects: ['Matematika', 'TIK'], desc: 'Ngoding dan matematika diskrit' }
    ],
    categories: [
      { name: 'Matematika', icon: '📐', desc: 'Aljabar, kalkulus, geometri', color: '#5D9CEC', threads: [
        { title: 'Cara cepat memahami turunan fungsi trigonometri?', author: 'Rina_24', replies: 5, likes: 12 },
        { title: 'Belajar integral tentu dari nol, ada yang mau belajar bareng?', author: 'TegarB', replies: 8, likes: 15 },
        { title: 'Aku masih bingung soal limit tak hingga', author: 'Sari.A', replies: 3, likes: 7 }
      ]},
      { name: 'Fisika', icon: '⚛️', desc: 'Mekanika, termodinamika, listrik', color: '#FF9500', threads: [
        { title: 'Hukum Newton itu sebenernya gampang loh!', author: 'FisikaFun', replies: 6, likes: 20 },
        { title: 'Ada yang bisa jelasin konsep medan listrik?', author: 'Budi_01', replies: 4, likes: 9 }
      ]},
      { name: 'Biologi', icon: '🧬', desc: 'Sel, genetika, ekologi', color: '#34C759', threads: [
        { title: 'Proses fotosintesis versi sederhana', author: 'BioLover', replies: 7, likes: 18 },
        { title: 'Belajar sistem pencernaan manusia yuk!', author: 'Sehat_Selalu', replies: 3, likes: 11 }
      ]},
      { name: 'Kimia', icon: '🧪', desc: 'Stoikiometri, ikatan kimia', color: '#AF52DE', threads: [
        { title: 'Tips menghafal tabel periodik dengan lagu', author: 'Kimia_Asik', replies: 9, likes: 22 }
      ]},
      { name: 'Bahasa Inggris', icon: '📖', desc: 'Grammar, speaking, literature', color: '#FF2D55', threads: [
        { title: 'Daily conversation practice anyone?', author: 'English_Fun', replies: 11, likes: 25 },
        { title: 'Belajar tenses pakai mind mapping', author: 'Linguist_Id', replies: 5, likes: 14 }
      ]},
      { name: 'Sejarah', icon: '🏛️', desc: 'Sejarah Indo, dunia', color: '#FFCC00', threads: [
        { title: 'Diskusi: Pengaruh reformasi terhadap demokrasi', author: 'Sejarawan_Muda', replies: 13, likes: 30 }
      ]},
      { name: 'Ekonomi', icon: '💼', desc: 'Ekonomi mikro, akuntansi', color: '#FF9500', threads: [
        { title: 'Belajar hukum permintaan dan penawaran', author: 'EcoSmart', replies: 4, likes: 8 }
      ]},
      { name: 'Sosiologi', icon: '👥', desc: 'Interaksi sosial, budaya', color: '#5D9CEC', threads: [
        { title: 'Fenomena sosial di era digital', author: 'Sosio_Muda', replies: 6, likes: 16 }
      ]}
    ]
  };

  // ============= DOM REFS =============
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];

  // ============= TOAST =============
  function showToast(icon, title, message, type = 'info') {
    const container = $('#toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span class="toast-icon">${icon}</span><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div>`;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }, 3500);
  }

  // ============= MODAL =============
  let activeModal = null;

  function openModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    activeModal = overlay;
  }

  function closeModal(modalId) {
    const overlay = modalId ? document.getElementById(modalId) : activeModal;
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    activeModal = null;
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
      closeModal(e.target.id);
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeModal) closeModal();
  });

  // ============= AUTH MODAL =============
  function initAuthModal() {
    const tabs = $$('.modal-tab');
    const contents = $$('.modal-tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const target = this.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const content = document.getElementById(`tab-${target}`);
        if (content) content.classList.add('active');
      });
    });

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(inputId, msg) {
      const el = document.getElementById(inputId);
      const error = el?.parentElement?.querySelector('.form-error');
      if (el) el.classList.add('error');
      if (error) { error.textContent = msg || ''; error.classList.toggle('show', !!msg); }
    }

    function clearError(inputId) {
      const el = document.getElementById(inputId);
      if (el) el.classList.remove('error');
      const error = el?.parentElement?.querySelector('.form-error');
      if (error) error.classList.remove('show');
    }

    // Register form
    const regForm = document.getElementById('register-form');
    if (regForm) {
      regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;

        const name = $('#reg-name');
        const email = $('#reg-email');
        const school = $('#reg-school');
        const pass = $('#reg-pass');
        const confirm = $('#reg-confirm');

        if (!name.value.trim()) { showError('reg-name', 'Nama tidak boleh kosong'); valid = false; }
        else clearError('reg-name');

        if (!validateEmail(email.value)) { showError('reg-email', 'Email tidak valid'); valid = false; }
        else clearError('reg-email');

        if (!school.value.trim()) { showError('reg-school', 'Asal sekolah tidak boleh kosong'); valid = false; }
        else clearError('reg-school');

        if (pass.value.length < 8) { showError('reg-pass', 'Minimal 8 karakter'); valid = false; }
        else clearError('reg-pass');

        if (confirm.value !== pass.value) { showError('reg-confirm', 'Password tidak sama'); valid = false; }
        else clearError('reg-confirm');

        if (!valid) return;

        state.user = {
          name: name.value.trim(),
          email: email.value,
          school: school.value.trim(),
          initials: name.value.trim().split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        };

        closeModal('auth-modal');
        updateNavUser();
        showToast('✅', 'Registrasi Berhasil!', 'Selamat datang di KawanPintar, ' + state.user.name + '!', 'success');
        regForm.reset();
      });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;

        const email = $('#login-email');
        const pass = $('#login-pass');

        if (!validateEmail(email.value)) { showError('login-email', 'Email tidak valid'); valid = false; }
        else clearError('login-email');

        if (pass.value.length < 8) { showError('login-pass', 'Password minimal 8 karakter'); valid = false; }
        else clearError('login-pass');

        if (!valid) return;

        state.user = {
          name: email.value.split('@')[0],
          email: email.value,
          school: 'Siswa',
          initials: email.value[0].toUpperCase() + email.value[1].toUpperCase()
        };

        closeModal('auth-modal');
        updateNavUser();
        showToast('👋', 'Login Berhasil!', 'Selamat datang kembali, ' + state.user.name + '!', 'success');
        loginForm.reset();
      });
    }

    // Forgot password
    const forgotLink = document.getElementById('forgot-link');
    if (forgotLink) {
      forgotLink.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('🔑', 'Lupa Password', 'Fitur reset password akan segera hadir! Sementara, hubungi admin ya.', 'info');
      });
    }

    // Real-time validation
    $$('.form-input').forEach(input => {
      input.addEventListener('blur', function() {
        if (this.value.trim() && this.classList.contains('error')) {
          clearError(this.id);
        }
      });
    });

    // Switch to login tab from register
    const switchLogin = document.getElementById('switch-login');
    if (switchLogin) {
      switchLogin.addEventListener('click', function(e) {
        e.preventDefault();
        const loginTab = document.querySelector('.modal-tab[data-tab="login"]');
        if (loginTab) loginTab.click();
      });
    }

    const switchRegister = document.getElementById('switch-register');
    if (switchRegister) {
      switchRegister.addEventListener('click', function(e) {
        e.preventDefault();
        const regTab = document.querySelector('.modal-tab[data-tab="register"]');
        if (regTab) regTab.click();
      });
    }
  }

  // ============= NAV USER =============
  function updateNavUser() {
    const guestActions = document.getElementById('guest-actions');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    if (state.user) {
      if (guestActions) guestActions.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (userName) userName.textContent = state.user.name;
      if (userAvatar) userAvatar.textContent = state.user.initials;
    } else {
      if (guestActions) guestActions.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  }

  // ============= DARK MODE =============
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = state.theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('kawanpintar-theme', state.theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.innerHTML = state.theme === 'dark' ? '☀️' : '🌙';
  }

  // ============= NAVBAR SCROLL =============
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Mobile toggle
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('navbar-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function() {
        nav.classList.toggle('open');
      });

      // Close on link click
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('open'));
      });
    }
  }

  // ============= FORUM CATEGORY MODAL =============
  function initForumCategories() {
    const categoryCards = $$('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', function() {
        const catName = this.dataset.category;
        const cat = state.categories.find(c => c.name === catName);
        if (!cat) return;

        const overlay = document.getElementById('forum-category-modal');
        if (!overlay) return;

        const title = overlay.querySelector('.modal-header h3');
        const body = overlay.querySelector('.modal-body');

        if (title) title.textContent = cat.icon + ' ' + cat.name;
        if (body) {
          body.innerHTML = `<p style="color: var(--text-secondary); margin-bottom: 20px;">${cat.desc}</p>`;
          cat.threads.forEach(t => {
            body.innerHTML += `
              <div class="thread-card card" style="margin-bottom: 12px; cursor: pointer;" onclick="window.location.href='discussion.html?category=${encodeURIComponent(cat.name)}'">
                <div class="thread-content">
                  <div class="thread-meta">
                    <span class="author">${t.author}</span>
                    <span>·</span>
                    <span>${t.replies} balasan</span>
                    <span>·</span>
                    <span class="badge">${cat.name}</span>
                  </div>
                  <h4 style="font-size: 1rem;">${t.title}</h4>
                  <div class="thread-footer" style="margin-top: 8px;">
                    <span>💬 ${t.replies}</span>
                    <span>👍 ${t.likes}</span>
                  </div>
                </div>
              </div>`;
          });
        }

        openModal('forum-category-modal');
      });
    });
  }

  // ============= THREAD LIKES =============
  function initThreadLikes() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.like-btn');
      if (!btn) return;

      if (!state.user) {
        showToast('🔒', 'Masuk dulu yuk!', 'Login atau daftar untuk menyukai diskusi', 'info');
        return;
      }

      const threadId = btn.dataset.threadId;
      const countEl = btn.parentElement.querySelector('.vote-count');
      if (!countEl) return;

      if (state.likedThreads.has(threadId)) {
        state.likedThreads.delete(threadId);
        btn.classList.remove('liked');
        countEl.textContent = parseInt(countEl.textContent) - 1;
      } else {
        state.likedThreads.add(threadId);
        btn.classList.add('liked');
        countEl.textContent = parseInt(countEl.textContent) + 1;
      }
    });
  }

  // ============= ICE BREAKERS =============
  function initIceBreakers() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.ice-btn');
      if (!btn) return;

      const text = btn.dataset.text;
      const textarea = document.querySelector('.reply-textarea, #post-content');
      if (textarea) {
        textarea.value = text;
        textarea.focus();
      } else {
        showToast('💡', 'Template siap!', 'Salin: "' + text + '"', 'info');
      }
    });
  }

  // ============= STUDY BUDDY =============
  function initBuddyMatching() {
    const form = document.getElementById('buddy-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const subject = document.getElementById('buddy-subject').value.toLowerCase();
      const results = document.getElementById('buddy-results');
      if (!results) return;

      let filtered = state.buddies;
      if (subject) {
        filtered = state.buddies.filter(b =>
          b.subjects.some(s => s.toLowerCase().includes(subject))
        );
      }

      if (filtered.length === 0) {
        results.innerHTML = `<div class="empty-state"><div class="icon">🔍</div><h3>Tidak ditemukan</h3><p>Coba cari mapel lain atau atur filter berbeda</p></div>`;
        return;
      }

      results.innerHTML = '<div class="buddy-grid">' +
        filtered.map(b => `
          <div class="buddy-card card card-glass">
            <div class="buddy-avatar">${b.initials}</div>
            <div class="buddy-info">
              <h4>${b.name}</h4>
              <p>${b.school} · ${b.desc}</p>
              <div class="buddy-tags">
                ${b.subjects.map(s => `<span class="tag">${s}</span>`).join('')}
              </div>
            </div>
            <button class="btn btn-sm btn-secondary buddy-connect" data-name="${b.name}">Ajak</button>
          </div>
        `).join('') + '</div>';

      results.querySelectorAll('.buddy-connect').forEach(btn => {
        btn.addEventListener('click', function() {
          if (!state.user) {
            showToast('🔒', 'Masuk dulu yuk!', 'Login untuk mengirim ajakan teman belajar', 'info');
            return;
          }
          showToast('🤝', 'Permintaan terkirim!', 'Kamu mengajak ' + this.dataset.name + ' belajar bareng', 'success');
        });
      });
    });

    // Trigger initial load
    if (form) form.dispatchEvent(new Event('submit'));
  }

  // ============= JOURNAL =============
  function initJournal() {
    const form = document.getElementById('journal-form');
    const list = document.getElementById('journal-list');
    if (!form || !list) return;

    function renderJournals() {
      if (state.journals.length === 0) {
        list.innerHTML = `<div class="empty-state"><div class="icon">📝</div><h3>Belum ada catatan</h3><p>Mulai catat progress belajarmu!</p></div>`;
        return;
      }
      list.innerHTML = state.journals.map((j, i) => `
        <div class="journal-card card fade-in">
          <div class="date">${j.date}</div>
          <h4>${j.title}</h4>
          <p>${j.content}</p>
          <div style="margin-top: 12px;">
            <button class="btn btn-sm btn-ghost journal-delete" data-index="${i}">Hapus</button>
          </div>
        </div>
      `).join('');
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('journal-title');
      const content = document.getElementById('journal-content');
      if (!title.value.trim() || !content.value.trim()) return;

      state.journals.unshift({
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: title.value.trim(),
        content: content.value.trim()
      });

      localStorage.setItem('kawanpintar-journals', JSON.stringify(state.journals));
      renderJournals();
      form.reset();
      showToast('📖', 'Catatan disimpan!', 'Progress belajarmu tercatat', 'success');
    });

    list.addEventListener('click', function(e) {
      const btn = e.target.closest('.journal-delete');
      if (!btn) return;
      const idx = parseInt(btn.dataset.index);
      state.journals.splice(idx, 1);
      localStorage.setItem('kawanpintar-journals', JSON.stringify(state.journals));
      renderJournals();
    });

    renderJournals();
  }

  // ============= FAQ ACCORDION =============
  function initFaq() {
    document.addEventListener('click', function(e) {
      const question = e.target.closest('.faq-question');
      if (!question) return;

      const item = question.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all
      $$('.faq-item.open').forEach(el => el.classList.remove('open'));

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  }

  // ============= SMOOTH SCROLL =============
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ============= FILTER TAGS =============
  function initFilterTags() {
    document.addEventListener('click', function(e) {
      const tag = e.target.closest('.filter-tag');
      if (!tag) return;

      const parent = tag.parentElement;
      if (parent) {
        parent.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
      }

      const filter = tag.dataset.filter;
      const items = document.querySelectorAll('[data-thread-category]');
      if (items.length) {
        items.forEach(item => {
          if (filter === 'all' || item.dataset.threadCategory === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  }

  // ============= ACTIVE NAV =============
  function initActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === page);
    });
  }

  // ============= LOGOUT =============
  function initLogout() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('#logout-btn');
      if (!btn) return;
      state.user = null;
      updateNavUser();
      showToast('👋', 'Logout berhasil', 'Sampai jumpa kembali!', 'info');
    });
  }

  // ============= DISCUSSION PAGE =============
  function initDiscussion() {
    const container = document.getElementById('discussion-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const catName = params.get('category') || 'Matematika';
    const cat = state.categories.find(c => c.name === catName) || state.categories[0];

    container.innerHTML = `
      <div class="discussion-thread">
        <span class="badge" style="margin-bottom: 12px;">${cat.icon} ${cat.name}</span>
        <h2 style="margin-bottom: 8px;">${cat.threads[0]?.title || 'Diskusi ' + cat.name}</h2>
        <div class="thread-meta" style="margin-bottom: 24px;">
          <span class="author">${cat.threads[0]?.author || 'User'}</span>
          <span>·</span>
          <span>${cat.threads[0]?.replies || 0} balasan</span>
          <span>·</span>
          <span>👍 ${cat.threads[0]?.likes || 0}</span>
        </div>
        <p style="color: var(--text-secondary); line-height: 1.8; font-size: 1.05rem; margin-bottom: 32px;">
          Halo teman-teman! Aku mau diskusi tentang topik ini. Aku udah baca beberapa referensi tapi masih ada yang kurang paham.
          Mungkin ada yang bisa bantu jelasin atau mau belajar bareng? Yuk kita bahas sama-sama! 😊
        </p>
      </div>

      <h3 style="margin-bottom: 20px;">Komentar (${cat.threads.length * 2 + 2})</h3>
      <div id="comments-section">
        <div class="comment">
          <div class="comment-avatar">AK</div>
          <div class="comment-body">
            <div class="comment-meta"><span class="author">Adi_K</span><span>2 jam lalu</span></div>
            <p>Wah topik yang bagus! Aku juga belajar ini. Mungkin bisa kita bahas dari dasarnya dulu ya. Aku推荐参照这个视频：https://youtu.be/example</p>
            <div class="comment-actions">
              <button class="like-comment" data-id="c1">👍 <span>5</span></button>
              <button>💬 Balas</button>
            </div>
          </div>
        </div>
        <div class="comment">
          <div class="comment-avatar">SR</div>
          <div class="comment-body">
            <div class="comment-meta"><span class="author">Sari_Rpl</span><span>5 jam lalu</span></div>
            <p>Makasih udah buat thread ini! Aku jadi termotivasi buat belajar lagi. Mungkin kita bisa bikin grup belajar kecil-kecilan.</p>
            <div class="comment-actions">
              <button class="like-comment" data-id="c2">👍 <span>8</span></button>
              <button>💬 Balas</button>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color);">
        <h4 style="margin-bottom: 16px;">Tambah Komentar</h4>
        <div class="ice-breakers">
          <button class="ice-btn" data-text="Menurutku...">💡 Menurutku...</button>
          <button class="ice-btn" data-text="Aku pernah belajar ini, mungkin bisa bantu!">🤚 Aku bisa bantu!</button>
          <button class="ice-btn" data-text="Terima kasih sudah berbagi!">🙏 Terima kasih!</button>
        </div>
        <textarea class="form-input reply-textarea" rows="4" placeholder="Tulis komentarmu di sini... (Gunakan mode anonim jika kamu malu)"></textarea>
        <div style="display: flex; gap: 12px; margin-top: 12px; align-items: center;">
          <button class="btn btn-primary" onclick="showToast('💬', 'Komentar terkirim!', 'Komentarmu akan muncul setelah ditinjau', 'success')">Kirim</button>
          <label class="form-check" style="margin: 0;">
            <input type="checkbox"> Kirim sebagai anonim
          </label>
          <span class="read-mode-indicator">👀 Baca Dulu</span>
        </div>
      </div>`;

    // Comment likes
    container.addEventListener('click', function(e) {
      const btn = e.target.closest('.like-comment');
      if (!btn) return;
      const span = btn.querySelector('span');
      if (span) {
        const count = parseInt(span.textContent);
        span.textContent = btn.classList.contains('liked') ? count - 1 : count + 1;
        btn.classList.toggle('liked');
      }
    });
  }

  // ============= INIT =============
  document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initTheme();
    initAuthModal();
    updateNavUser();
    initForumCategories();
    initThreadLikes();
    initIceBreakers();
    initBuddyMatching();
    initJournal();
    initFaq();
    initSmoothScroll();
    initFilterTags();
    initActiveNav();
    initLogout();
    initDiscussion();

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Auth modal trigger
    document.querySelectorAll('[data-modal="auth-modal"]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('auth-modal');
      });
    });

    // Close buttons
    document.querySelectorAll('.modal-close').forEach(el => {
      el.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal.id);
      });
    });
  });

  // Expose for inline use
  window.showToast = showToast;
  window.openModal = openModal;
  window.closeModal = closeModal;

})();
