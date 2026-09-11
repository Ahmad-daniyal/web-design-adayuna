import { dataStore } from '../data/index.js';
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

  const CAT_LABELS = { matematika:'Matematika', fisika:'Fisika', kimia:'Kimia', biologi:'Biologi', sejarah:'Sejarah', bahasa:'Bahasa Indonesia', ips:'IPS' };

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
              <button class="cat-btn${state.category === 'matematika' ? ' active' : ''}" data-category="matematika"><i class="fas fa-calculator mr-1"></i> Matematika</button>
              <button class="cat-btn${state.category === 'fisika' ? ' active' : ''}" data-category="fisika"><i class="fas fa-atom mr-1"></i> Fisika</button>
              <button class="cat-btn${state.category === 'kimia' ? ' active' : ''}" data-category="kimia"><i class="fas fa-flask mr-1"></i> Kimia</button>
              <button class="cat-btn${state.category === 'biologi' ? ' active' : ''}" data-category="biologi"><i class="fas fa-dna mr-1"></i> Biologi</button>
              <button class="cat-btn${state.category === 'sejarah' ? ' active' : ''}" data-category="sejarah"><i class="fas fa-landmark mr-1"></i> Sejarah</button>
              <button class="cat-btn${state.category === 'bahasa' ? ' active' : ''}" data-category="bahasa"><i class="fas fa-language mr-1"></i> Bahasa</button>
              <button class="cat-btn${state.category === 'ips' ? ' active' : ''}" data-category="ips"><i class="fas fa-globe mr-1"></i> IPS</button>
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

              <h3 class="text-lg font-bold mb-4 thread-anim" style="animation-delay:140ms;color:var(--text-primary);"><i class="fas fa-comments mr-2" style="color:var(--primary);"></i>Jawaban <span class="text-sm font-semibold" style="color:var(--text-muted);">(${thread.replies})</span></h3>

              <div class="comment-item solusi thread-anim mb-4" style="animation-delay:180ms">
                <div class="flex items-center gap-3 mb-2">
                  <div class="thread-avatar" style="background:linear-gradient(135deg,#38BDF8,#2563EB);">K</div>
                  <div>
                    <span class="font-semibold text-sm" style="color:var(--text-primary);">KakakKelas</span>
                    <span class="text-xs ml-2" style="color:var(--text-muted);">1 jam lalu</span>
                  </div>
                  <span class="thread-solusi-badge ml-auto"><i class="fas fa-circle-check"></i> Solusi Terverifikasi</span>
                </div>
                <p class="text-sm leading-relaxed mb-2" style="color:var(--text-secondary);">Gunakan aturan produk ya! (uv)' = u'v + uv'. Kalau f(x) = sin(x)·cos(x), maka:</p>
                <div class="text-sm p-3 rounded-lg mb-2" style="background:var(--bg-section);border:1px solid var(--border-color);font-family:monospace;color:var(--primary);">f'(x) = cos(x)·cos(x) + sin(x)·(-sin(x))<br>= cos²x − sin²x<br>= cos(2x)</div>
                <div class="flex items-center gap-4">
                  <button class="vote-btn" onclick="Forum.toggleVote(this)"><i class="fas fa-arrow-up"></i> <span>5</span></button>
                  <span class="text-xs" style="color:var(--text-muted);">7 suara</span>
                </div>
              </div>

              <div class="comment-item thread-anim mb-4" style="animation-delay:220ms">
                <div class="flex items-center gap-3 mb-2">
                  <div class="thread-avatar" style="background:${avatarColor('Aisyah12')};">A</div>
                  <div>
                    <span class="font-semibold text-sm" style="color:var(--text-primary);">Aisyah12</span>
                    <span class="text-xs ml-2" style="color:var(--text-muted);">45 menit lalu</span>
                  </div>
                  <span class="thread-chip ml-auto"><i class="fas fa-reply"></i> Menjawab</span>
                </div>
                <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Ingat rumus dasar dulu ya: d(sin x)/dx = cos x, d(cos x)/dx = -sin x. Kalau ada perkalian pake aturan produk. Semangat!</p>
              </div>

              <div class="glass-card !p-5 mt-6 thread-anim" id="threadReplyBox" style="animation-delay:260ms">
                <h4 class="font-bold mb-3" style="color:var(--text-primary);"><i class="fas fa-reply mr-2" style="color:var(--primary);"></i>Tulis Balasan</h4>
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
                    <span class="font-bold" style="color:var(--primary);">${threadActivity(thread)}%</span>
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
                <h3 class="text-xl font-bold" style="color:var(--text-primary);"><i class="fas fa-link mr-2" style="color:var(--primary);"></i>Thread Terkait</h3>
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
    Auth.showToast('Fitur membuat thread baru segera hadir!', 'info');
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
    Auth.showToast('Komentar berhasil dikirim!', 'success');
    Notifications.push({ type: 'forum', title: 'Komentarmu terkirim', message: 'Balasanmu diposting di thread "' + (thread ? thread.title : 'Forum Diskusi') + '".', link: '#/forum' });
    input.value = '';
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
    const colors = [
      'linear-gradient(135deg,#2563EB,#0EA5E9)',
      'linear-gradient(135deg,#059669,#34D399)',
      'linear-gradient(135deg,#D97706,#FBBF24)',
      'linear-gradient(135deg,#4F46E5,#818CF8)',
      'linear-gradient(135deg,#B91C1C,#F87171)',
      'linear-gradient(135deg,#0F766E,#2DD4BF)'
    ];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return colors[h % colors.length];
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

  function getIcon(cat) { return { matematika:'fa-calculator', fisika:'fa-atom', kimia:'fa-flask', biologi:'fa-dna', sejarah:'fa-landmark', bahasa:'fa-language', ips:'fa-globe' }[cat] || 'fa-book'; }

  function catLabel(cat) { return CAT_LABELS[cat] || capitalize(cat); }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  return { refresh, openThread, openDiscussionModal: openThreadFromCard, openNewThread, backToList, toggleVote, submitComment, shareThread, scrollToReply, followThread };
})();