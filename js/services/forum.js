import { dataStore } from '../data/index.js';
import { CONFIG } from '../core/config.js';
import { Auth } from './auth.js';
import { Notifications } from './notifications.js';

export const Forum = (() => {
  let globalBound = false;
  let currentThreadId = 0;

  let state = {
    screen: 'list',
    category: 'all',
    threadId: 0
  };

  const CAT_LABELS = CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.label; return o; }, {});
  const CAT_ICONS = CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.icon; return o; }, {});
  const STORAGE_THREADS_KEY = 'edquest_forum_threads';
  let userThreadsLoaded = false;

  window.addEventListener('pageChanged', (e) => {
    if (e.detail.pageName !== 'forum') {
      state.screen = 'list';
      state.category = 'all';
    }
  });

  function bindGlobal() {
    if (globalBound) return;
    globalBound = true;
    document.addEventListener('click', (e) => {
      const tag = e.target.closest('.category-tag:not(.in-modal)');
      if (tag) {
        const card = tag.closest('.thread-card');
        if (card) openThreadFromCard(card);
        return;
      }
      const card = e.target.closest('.thread-card');
      if (card && !e.target.closest('button')) {
        openThreadFromCard(card);
      }
    });
  }

  function refresh() {
    bindGlobal();
    loadUserThreads();
    render();
  }

  function render() {
    const root = document.getElementById('forumRoot');
    if (!root) return;
    if (state.screen === 'thread') renderThreadDetail(root);
    else renderList(root);
  }

  /* ===== List view ===== */

  function renderList(root) {
    root.innerHTML = `
      <section class="py-6">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="card-panel p-4 sm:p-6">
            <p class="text-sm font-semibold mb-3 text-slate-600 dark:text-slate-300"><i class="fas fa-filter mr-2"></i>Filter Kategori:</p>
            <div class="flex flex-wrap gap-2" id="categoryFilter">
              <button class="cat-btn${state.category === 'all' ? ' active' : ''}" data-category="all">Semua</button>
              ${CONFIG.MAPELS.map(m =>
                '<button class="cat-btn' + (state.category === m.key ? ' active' : '') + '" data-category="' + m.key + '"><i class="fas ' + m.icon + ' mr-1"></i> ' + m.label + '</button>'
              ).join('\n              ')}
            </div>
          </div>
        </div>
      </section>

      <section class="py-6 pb-16">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Thread Terbaru</h2>
            <span class="text-sm text-slate-400 dark:text-slate-500" id="threadCount">Memuat thread...</span>
          </div>
          <div id="threadList" class="space-y-3"></div>
          <div class="mt-10 text-center">
            <div class="card-panel !p-8">
              <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">Punya topik ingin didiskusikan?</h3>
              <p class="text-sm mb-4 text-slate-500 dark:text-slate-400">Mulai thread baru dan dapatkan jawaban dari teman-teman di sini.</p>
              <button onclick="Forum.openNewThread()" class="btn-edquest btn-primary-grad"><i class="fas fa-pen"></i> Buat Thread Baru</button>
            </div>
          </div>
        </div>
      </section>
    `;

    renderThreads(dataStore.forum);
    initCategoryFilter();
  }

  function initCategoryFilter() {
    const container = document.getElementById('categoryFilter');
    if (!container) return;
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;
      state.category = btn.dataset.category;
      container.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b === btn));
      filterThreads(state.category);
    });
  }

  function renderThreads(list) {
    const container = document.getElementById('threadList');
    if (!container) return;
    container.innerHTML = list.map((t, i) =>
      '<div class="thread-card" data-category="' + t.category + '" data-id="' + i + '">' +
        '<div class="flex flex-wrap items-start justify-between gap-3">' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex flex-wrap items-center gap-2 mb-1">' +
              '<span class="category-tag ' + t.category + '"><i class="fas ' + getIcon(t.category) + '"></i> ' + catLabel(t.category) + '</span>' +
              '<span class="text-xs text-slate-400 dark:text-slate-500">' + t.time + '</span>' +
            '</div>' +
            '<h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">' + t.title + '</h3>' +
            '<p class="text-sm truncate text-slate-500 dark:text-slate-400">' + t.subtitle + '</p>' +
            '<div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">' +
              '<span><i class="fas fa-user mr-1"></i>' + t.author + '</span>' +
              '<span><i class="fas fa-comment mr-1"></i> ' + t.replies + ' balasan</span>' +
              '<span><i class="fas fa-arrow-up mr-1"></i> ' + t.votes + ' suara</span>' +
            '</div>' +
          '</div>' +
          '<span class="status-tag flex-shrink-0">' + t.status + '</span>' +
        '</div>' +
      '</div>'
    ).join('');
    filterThreads(state.category);
  }

  function filterThreads(category) {
    const cards = document.querySelectorAll('#threadList .thread-card');
    let count = 0;
    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) { card.style.display = ''; count++; }
      else card.style.display = 'none';
    });
    const counter = document.getElementById('threadCount');
    if (counter) counter.textContent = count + ' thread ditemukan';
  }

  /* ===== Thread detail view ===== */

  function openThreadFromCard(card) {
    if (!card || !card.dataset) return;
    const id = parseInt(card.dataset.id, 10);
    openThread(isNaN(id) ? 0 : id);
  }

  function openThread(id) {
    const thread = dataStore.forum[id] || dataStore.forum[0];
    if (!thread) return;
    state.screen = 'thread';
    state.threadId = dataStore.forum.indexOf(thread);
    currentThreadId = state.threadId;
    render();
    const root = document.getElementById('forumRoot');
    if (root) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function backToList() {
    state.screen = 'list';
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderThreadDetail(root) {
    const thread = dataStore.forum[state.threadId] || dataStore.forum[0];
    if (!thread) { state.screen = 'list'; renderList(root); return; }

    const related = relatedThreads(thread);
    const contributors = topContributors();

    const relatedItems = related.map((t, i) =>
      '<button class="thread-related-card thread-anim" style="animation-delay:' + (320 + i * 70) + 'ms" onclick="Forum.openThread(' + threadIndex(t) + ')">' +
        '<div class="flex flex-wrap items-center justify-between gap-1 mb-2">' +
          '<span class="category-tag ' + t.category + '"><i class="fas ' + getIcon(t.category) + '"></i> ' + catLabel(t.category) + '</span>' +
          '<span class="text-[11px]" style="color:var(--text-muted);">' + t.time + '</span>' +
        '</div>' +
        '<p class="thread-related-title">' + t.title + '</p>' +
        '<p class="thread-related-sub">' + t.subtitle + '</p>' +
        '<div class="flex items-center gap-3 text-[11px] font-semibold mt-2" style="color:var(--text-muted);">' +
          '<span><i class="fas fa-user mr-1"></i>' + t.author + '</span>' +
          '<span><i class="fas fa-comment mr-1"></i>' + t.replies + '</span>' +
          '<span><i class="fas fa-arrow-up mr-1"></i>' + t.votes + '</span>' +
        '</div>' +
      '</button>'
    ).join('') || '<p class="text-sm" style="color:var(--text-muted);">Belum ada thread terkait.</p>';

    const contributorItems = contributors.map(c =>
      '<div class="thread-contributor">' +
        '<div class="thread-avatar-sm" style="background:' + avatarColor(c.name) + ';">' + initialOf(c.name) + '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<p class="text-sm font-semibold truncate" style="color:var(--text-primary);">' + c.name + '</p>' +
          '<p class="text-[11px]" style="color:var(--text-muted);">' + c.votes + ' suara · ' + c.replies + ' balasan · ' + c.active + ' thread</p>' +
        '</div>' +
      '</div>'
    ).join('');

    root.innerHTML = `
      <section class="thread-view pb-16">

        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="thread-hero ${thread.category} thread-anim">
            <i class="fas ${getIcon(thread.category)} thread-hero-icon"></i>
            <button class="thread-hero-back" onclick="Forum.backToList()"><i class="fas fa-arrow-left"></i> Kembali ke Forum</button>
            <div class="thread-hero-top">
              <span class="thread-hero-cat"><i class="fas ${getIcon(thread.category)}"></i> ${catLabel(thread.category)}</span>
              <span class="thread-hero-status"><i class="fas ${thread.status === 'Populer' ? 'fa-fire' : 'fa-bolt'}"></i> ${thread.status}</span>
            </div>
            <h2 class="thread-hero-title">${thread.title}</h2>
            <p class="thread-hero-sub">${thread.subtitle}</p>
            <div class="thread-hero-meta">
              <span><i class="fas fa-user"></i> ${thread.author}</span>
              <span><i class="fas fa-comment"></i> ${thread.replies} balasan</span>
              <span><i class="fas fa-arrow-up"></i> ${thread.votes} suara</span>
              <span><i class="fas fa-eye"></i> ${getViews(thread)} dilihat</span>
            </div>
            <div class="thread-hero-actions">
              <button class="thread-hero-btn primary" onclick="Forum.scrollToReply()"><i class="fas fa-reply"></i> Tulis Jawaban</button>
              <button class="thread-hero-btn" onclick="Forum.shareThread()"><i class="fas fa-share-nodes"></i> Bagikan</button>
              <button class="thread-hero-btn" onclick="Forum.followThread(this)"><i class="fas fa-bell"></i> Ikuti Thread</button>
            </div>
          </div>

          <div class="thread-grid mt-8">
            <div class="discussion-detail min-w-0">

              <div class="thread-content-card thread-anim" style="animation-delay:80ms">
                <div class="flex items-center gap-3 mb-4">
                  <div class="thread-avatar" style="background:${avatarColor(thread.author)};">${initialOf(thread.author)}</div>
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-bold text-sm" style="color:var(--text-primary);">${thread.author}</span>
                      <span class="thread-chip"><i class="fas fa-circle-question"></i> Pertanyaan</span>
                    </div>
                    <span class="text-xs" style="color:var(--text-muted);">${thread.time} · di kategori ${catLabel(thread.category)}</span>
                  </div>
                </div>
                <p class="thread-body-text">${thread.subtitle}</p>
                <div class="thread-body-meta">
                  <span><i class="far fa-clock"></i> Diposting ${thread.time}</span>
                  <span><i class="fas fa-eye"></i> ${getViews(thread)} kali dilihat</span>
                </div>
              </div>

              <h3 class="text-lg font-bold mb-4 thread-anim" style="animation-delay:140ms;color:var(--text-primary);"><i class="fas fa-comments mr-2" style="color:var(--primary-text);"></i>Jawaban <span class="text-sm font-semibold" style="color:var(--text-muted);">(${thread.replies})</span></h3>

              ${commentItems(thread)}

              <div class="glass-card !p-5 mt-6 thread-anim" id="threadReplyBox" style="animation-delay:260ms">
                <h4 class="font-bold mb-3" style="color:var(--text-primary);"><i class="fas fa-reply mr-2" style="color:var(--primary-text);"></i>Tulis Balasan</h4>
                <form onsubmit="Forum.submitComment(event)">
                  <div class="mb-3">
                    <textarea id="discussionCommentInput" rows="3" class="w-full p-3 rounded-lg text-sm border resize-none focus:outline-none focus:ring-2" style="background:var(--bg-body);border-color:var(--border-color);color:var(--text-primary);" placeholder="Tulis jawaban atau pertanyaanmu..."></textarea>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" id="anonCheck" class="accent-[var(--primary)]">
                      <label for="anonCheck" class="text-xs" style="color:var(--text-muted);">Post sebagai anonim</label>
                    </div>
                    <button type="submit" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4"><i class="fas fa-paper-plane"></i> Kirim</button>
                  </div>
                </form>
              </div>

            </div>

            <aside class="thread-side">

              <div class="thread-side-card thread-anim" style="animation-delay:100ms">
                <h4 class="thread-side-title"><i class="fas fa-chart-simple"></i> Ringkasan Thread</h4>
                <div class="thread-summary-rows">
                  <div class="thread-summary-row">
                    <span class="ts-label"><i class="fas fa-tag"></i> Kategori</span>
                    <span class="ts-value">${catLabel(thread.category)}</span>
                  </div>
                  <div class="thread-summary-row">
                    <span class="ts-label"><i class="fas fa-user"></i> Penulis</span>
                    <span class="ts-value">${thread.author}</span>
                  </div>
                  <div class="thread-summary-row">
                    <span class="ts-label"><i class="fas fa-signal"></i> Status</span>
                    <span class="ts-value">${thread.status}</span>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span style="color:var(--text-muted);">Keaktifan diskusi</span>
                    <span class="font-bold" style="color:var(--primary-text);">${threadActivity(thread)}%</span>
                  </div>
                  <div class="thread-progress"><span style="width:${threadActivity(thread)}%"></span></div>
                </div>
                <div class="thread-stat-grid">
                  <div class="thread-stat"><span class="ts-num">${thread.replies}</span><span class="ts-label">Balasan</span></div>
                  <div class="thread-stat"><span class="ts-num">${thread.votes}</span><span class="ts-label">Suara</span></div>
                  <div class="thread-stat"><span class="ts-num">${getViews(thread)}</span><span class="ts-label">Dilihat</span></div>
                </div>
              </div>

              <div class="thread-side-card thread-anim" style="animation-delay:160ms">
                <h4 class="thread-side-title"><i class="fas fa-trophy"></i> Kontributor Populer</h4>
                <div class="thread-side-list">${contributorItems}</div>
              </div>

              <div class="thread-cta thread-anim" style="animation-delay:220ms">
                <div class="thread-cta-icon"><i class="fas fa-bullhorn"></i></div>
                <h4 class="font-bold text-white mb-1">Punya topik seru?</h4>
                <p class="text-sm" style="color:rgba(255,255,255,.85);">Mulai thread baru di kategori favoritmu dan bantu teman yang lain.</p>
                <button class="thread-cta-btn" onclick="Forum.openNewThread()"><i class="fas fa-pen"></i> Buat Thread Baru</button>
              </div>

            </aside>
          </div>

          <div class="thread-related-section mt-12">
            <div class="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h3 class="text-xl font-bold" style="color:var(--text-primary);"><i class="fas fa-link mr-2" style="color:var(--primary-text);"></i>Thread Terkait</h3>
                <p class="text-xs mt-1" style="color:var(--text-muted);">Diskusi lain yang mungkin menarik untukmu</p>
              </div>
              <button class="btn-edquest btn-outline-glow text-sm !py-2 !px-4" onclick="Forum.backToList()"><i class="fas fa-list mr-1"></i> Lihat Semua Thread</button>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${relatedItems}</div>
          </div>

        </div>
      </section>
    `;
  }

  function openNewThread() {
    if (!Auth.isLoggedIn()) {
      Auth.openModal('register');
      return;
    }
    openNewThreadModal();
  }

  function openNewThreadModal() {
    const existing = document.getElementById('newThreadModal');
    if (existing) { existing.classList.add('active'); document.body.style.overflow = 'hidden'; return; }
    const user = Auth.getUser();
    const div = document.createElement('div');
    div.id = 'newThreadModal';
    div.className = 'modal-edquest active';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-modal', 'true');
    const categoryOptions = CONFIG.MAPELS.map(m =>
      '<option value="' + m.key + '">' + m.label + '</option>'
    ).join('');
    div.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header">' +
        '<h3 class="text-xl font-bold" style="color:var(--text-primary);"><i class="fas fa-plus-circle mr-2" style="color:var(--primary-text);"></i>Buat Thread Baru</h3>' +
        '<button class="modal-close" onclick="Forum.closeNewThreadModal()" aria-label="Tutup"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<form id="newThreadForm" class="form-edquest">' +
          '<div class="mb-4">' +
            '<label class="form-label" for="newThreadTitle">Judul</label>' +
            '<input id="newThreadTitle" type="text" class="form-input" maxlength="120" placeholder="Contoh: Cara cepat paham turunan fungsi trigonometri">' +
            '<span class="form-error"></span>' +
          '</div>' +
          '<div class="mb-4">' +
            '<label class="form-label" for="newThreadCategory">Kategori</label>' +
            '<select id="newThreadCategory" class="form-input" style="cursor:pointer;">' +
              '<option value="" disabled selected>Pilih kategori mapel</option>' + categoryOptions +
            '</select>' +
            '<span class="form-error"></span>' +
          '</div>' +
          '<div class="mb-4">' +
            '<label class="form-label" for="newThreadContent">Isi Diskusi</label>' +
            '<textarea id="newThreadContent" rows="5" class="form-input resize-none" placeholder="Ceritakan topik atau pertanyaanmu dengan jelas..."></textarea>' +
            '<span class="form-error"></span>' +
          '</div>' +
          '<p class="text-xs mb-4" style="color:var(--text-muted);">Thread akan tampil sebagai <strong>' + escText(user ? user.name : 'Kamu') + '</strong></p>' +
          '<button type="submit" class="btn-edquest btn-primary-grad w-full"><i class="fas fa-paper-plane"></i> Posting Thread</button>' +
        '</form>' +
      '</div>' +
    '</div>';
    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';
    document.getElementById('newThreadForm').addEventListener('submit', (e) => { e.preventDefault(); submitNewThread(e); });
    div.addEventListener('click', (e) => { if (e.target === div) closeNewThreadModal(); });
    setTimeout(() => { const el = document.getElementById('newThreadTitle'); if (el) el.focus(); }, 100);
  }

  function closeNewThreadModal() {
    const modal = document.getElementById('newThreadModal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; setTimeout(() => { if (modal && !modal.classList.contains('active')) modal.remove(); }, 300); }
  }

  function submitNewThread(e) {
    const form = e.target;
    const title = form.querySelector('#newThreadTitle').value.trim();
    const category = form.querySelector('#newThreadCategory').value;
    const content = form.querySelector('#newThreadContent').value.trim();
    clearNewThreadErrors(form);
    let valid = true;
    if (title.length < 5) { showNewThreadError(form.querySelector('#newThreadTitle'), 'Judul minimal 5 karakter'); valid = false; }
    if (!category) { showNewThreadError(form.querySelector('#newThreadCategory'), 'Pilih kategori terlebih dahulu'); valid = false; }
    if (content.length < 10) { showNewThreadError(form.querySelector('#newThreadContent'), 'Isi minimal 10 karakter'); valid = false; }
    if (!valid) return;
    const user = Auth.getUser();
    const thread = {
      uid: 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      category: category,
      title: escText(title),
      subtitle: escText(content),
      author: user ? user.name : 'Anonim',
      replies: 0,
      votes: 0,
      time: 'Baru saja',
      status: 'Aktif',
      comments: [],
      mine: true
    };
    const stored = loadStoredThreads();
    stored.unshift(thread);
    saveStoredThreads(stored);
    dataStore.forum.unshift(thread);
    closeNewThreadModal();
    state.screen = 'list';
    state.category = 'all';
    render();
    Auth.showToast('Thread berhasil dibuat!', 'success');
    Notifications.push({ type: 'forum', title: 'Thread barumu terbit', message: '"' + thread.title + '" berhasil dibuat di kategori ' + catLabel(category) + '.', link: '#/forum' });
  }

  function showNewThreadError(input, message) {
    if (!input || !input.parentElement) return;
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) { errorEl.textContent = message; errorEl.classList.add('show'); }
  }

  function clearNewThreadErrors(form) {
    form.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(e => { e.textContent = ''; e.classList.remove('show'); });
  }

  function toggleVote(btn) {
    const countSpan = btn.querySelector('span');
    let count = parseInt(countSpan.textContent) || 0;
    if (btn.classList.contains('active')) { btn.classList.remove('active'); countSpan.textContent = Math.max(0, count - 1); }
    else { btn.classList.add('active'); countSpan.textContent = count + 1; }
  }

  function submitComment(e) {
    e.preventDefault();
    const input = document.getElementById('discussionCommentInput');
    if (!input || !input.value.trim()) { Auth.showToast('Komentar tidak boleh kosong', 'error'); return; }
    const thread = dataStore.forum[state.threadId] || dataStore.forum[0];
    const anon = document.getElementById('anonCheck') && document.getElementById('anonCheck').checked;
    const user = Auth.getUser();
    const name = anon ? 'Anonim' : (user ? user.name : 'Tamu');
    const comment = {
      author: name,
      avatar: anon ? '?' : (user ? (user.avatar || '?') : '?'),
      color: avatarColor(name),
      time: relativeNow(),
      verified: false,
      chip: 'Baru Saja',
      chipIcon: 'fa-comment',
      votes: null,
      text: input.value.trim(),
      yours: true
    };
    saveUserComment(state.threadId, comment);
    Auth.showToast('Komentar berhasil dikirim!', 'success');
    Notifications.push({ type: 'forum', title: 'Komentarmu terkirim', message: 'Balasanmu diposting di thread "' + (thread ? thread.title : 'Forum Diskusi') + '".', link: '#/forum' });
    input.value = '';
    const root = document.getElementById('forumRoot');
    if (root) renderThreadDetail(root);
  }

  function commentItems(thread) {
    if (!thread) return '';
    const base = (thread.comments && thread.comments.slice()) || [];
    const stored = loadUserComments(state.threadId);
    const all = base.map(c => ({ c: c, trusted: true })).concat(stored.map(c => ({ c: c, trusted: false })));
    return all.map((x, i) => renderComment(x.c, i, x.trusted)).join('\n              ');
  }

  function renderComment(c, i, trusted) {
    if (!c) return '';
    const cls = 'comment-item' + (c.verified ? ' solusi' : '');
    const delay = 180 + i * 40;
    const color = avatarBg(c.color, avatarColor(c.author || 'Anonim'));
    const avatar = c.avatar || initialOf(c.author || '?');
    const badge = c.verified
      ? '<span class="thread-solusi-badge ml-auto"><i class="fas fa-circle-check"></i> Solusi Terverifikasi</span>'
      : (c.chip ? '<span class="thread-chip ml-auto' + (c.yours ? '' : '') + '"><i class="fas ' + (c.chipIcon || 'fa-reply') + '"></i> ' + escText(c.chip) + '</span>' : '');
    const votes = (c.votes === null || c.votes === undefined) ? null : Number(c.votes);
    const voteHtml = votes !== null
      ? '<div class="flex items-center gap-4">' +
          '<button class="vote-btn" onclick="Forum.toggleVote(this)"><i class="fas fa-arrow-up"></i> <span>' + votes + '</span></button>' +
          '<span class="text-xs" style="color:var(--text-muted);">' + (votes + 2) + ' suara</span>' +
        '</div>'
      : '';
    return '<div class="' + cls + ' thread-anim mb-4" style="animation-delay:' + delay + 'ms">' +
      '<div class="flex items-center gap-3 mb-2">' +
        '<div class="thread-avatar" style="background:' + color + ';">' + escText(avatar) + '</div>' +
        '<div class="min-w-0">' +
          '<span class="font-semibold text-sm" style="color:var(--text-primary);">' + escText(c.author) + '</span>' +
          '<span class="text-xs ml-2" style="color:var(--text-muted);">' + escText(c.time) + '</span>' +
        '</div>' +
        badge +
      '</div>' +
      '<p class="text-sm leading-relaxed mb-2" style="color:var(--text-secondary);">' + (trusted ? c.text : escText(c.text)) + '</p>' +
      voteHtml +
    '</div>';
  }

  function loadUserComments(threadId) {
    try {
      const raw = localStorage.getItem('edquest_forum_comments');
      const map = raw ? JSON.parse(raw) : {};
      return (map && map[threadId]) || [];
    } catch { return []; }
  }

  function saveUserComment(threadId, comment) {
    try {
      const raw = localStorage.getItem('edquest_forum_comments');
      const map = raw ? JSON.parse(raw) : {};
      if (typeof map !== 'object' || map === null) return;
      map[threadId] = map[threadId] || [];
      map[threadId].push(comment);
      localStorage.setItem('edquest_forum_comments', JSON.stringify(map));
    } catch { /* abaikan */ }
  }

  function relativeNow() {
    return 'Baru saja';
  }

  function loadStoredThreads() {
    try {
      const raw = localStorage.getItem(STORAGE_THREADS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch { return []; }
  }

  function saveStoredThreads(list) {
    try { localStorage.setItem(STORAGE_THREADS_KEY, JSON.stringify(list)); } catch { /* abaikan */ }
  }

  function loadUserThreads() {
    if (userThreadsLoaded) return;
    userThreadsLoaded = true;
    const stored = loadStoredThreads();
    if (stored.length) dataStore.forum.unshift(...stored);
  }

  function escText(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function threadIndex(thread) { return dataStore.forum.indexOf(thread); }

  function getViews(thread) { return ((Number(thread.votes) || 0) * 7 + (Number(thread.replies) || 0) * 3 + 41) % 480 + 140; }

  function threadActivity(thread) { return Math.min(100, Math.round(Number(thread.replies || 0) * 9 + Number(thread.votes || 0) * 1.2 + 16)); }

  function relatedThreads(thread) {
    return dataStore.forum
      .filter(t => t !== thread)
      .map(t => ({ thread: t, score: (t.category === thread.category ? 8 : 0) + Math.min(Number(t.votes) || 0, 50) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.thread);
  }

  function topContributors() {
    const map = {};
    dataStore.forum.forEach(t => {
      if (!map[t.author]) map[t.author] = { name: t.author, votes: 0, replies: 0, active: 0 };
      map[t.author].votes += Number(t.votes) || 0;
      map[t.author].replies += Number(t.replies) || 0;
      map[t.author].active++;
    });
    return Object.values(map).sort((a, b) => b.votes - a.votes).slice(0, 4);
  }

  function avatarColor(name) {
    const count = 6;
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return 'var(--avatar-g' + (1 + (h % count)) + ')';
  }

  function avatarBg(c, fallback) {
    return /^g[1-6]$/.test(String(c || '')) ? 'var(--avatar-' + c + ')' : (c || fallback);
  }

  function initialOf(name) { return (name || '?').charAt(0).toUpperCase(); }

  function scrollToReply() {
    const box = document.getElementById('threadReplyBox');
    if (!box) return;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { const el = document.getElementById('discussionCommentInput'); if (el) el.focus(); }, 450);
  }

  function shareThread() {
    const thread = dataStore.forum[state.threadId] || dataStore.forum[0];
    const text = (thread ? thread.title : 'Thread') + ' — Edquest';
    if (navigator.share) {
      navigator.share({ title: text, text: text, url: window.location.href }).catch(() => {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(window.location.href);
    Auth.showToast('Link thread disalin ke clipboard', 'success');
  }

  function followThread(btn) {
    const active = btn.classList.toggle('active');
    Auth.showToast(active ? 'Kamu mengikuti thread ini' : 'Berhenti mengikuti thread', active ? 'success' : 'info');
  }

  function getIcon(cat) { return CAT_ICONS[cat] || 'fa-book'; }

  function catLabel(cat) { return CAT_LABELS[cat] || capitalize(cat); }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  return { refresh, openThread, openDiscussionModal: openThreadFromCard, openNewThread, closeNewThreadModal, backToList, toggleVote, submitComment, shareThread, scrollToReply, followThread };
})();