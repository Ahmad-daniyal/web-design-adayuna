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
    root.innerHTML = `
      <section class="py-6 pb-16">
        <div class="max-w-3xl mx-auto px-4 sm:px-6">
          <button class="btn-edquest btn-outline-glow text-sm !py-2 !px-4 mb-6" onclick="Forum.backToList()"><i class="fas fa-arrow-left mr-1"></i> Kembali ke Forum</button>
          <div class="discussion-detail">
            <div class="flex flex-wrap items-center gap-2 mb-3"><span class="category-tag ${thread.category} in-modal"><i class="fas ${getIcon(thread.category)}"></i> ${catLabel(thread.category)}</span><span class="text-xs" style="color:var(--text-muted);">${thread.time}</span></div>
            <h2 class="text-2xl font-bold mb-3" style="color:var(--text-primary);">${thread.title}</h2>
            <p class="text-sm leading-relaxed mb-4" style="color:var(--text-secondary);">${thread.subtitle}</p>
            <div class="flex items-center gap-4 text-sm mb-6" style="color:var(--text-muted);"><span><i class="fas fa-user mr-1"></i>${thread.author}</span><span><i class="fas fa-comment mr-1"></i>${thread.replies} balasan</span><span><i class="fas fa-arrow-up mr-1"></i>${thread.votes} suara</span></div>
            <hr style="border-color:var(--border-color);margin-bottom:1.5rem;">
            <div class="comment-item mb-4"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:var(--gradient-primary);">K</div><div><span class="font-semibold text-sm" style="color:var(--text-primary);">KakakKelas</span><span class="text-xs ml-2" style="color:var(--text-muted);">1 jam lalu</span></div><span class="text-xs px-2 py-0.5 rounded-full ml-auto" style="background:var(--primary-light);color:var(--primary);">Jawab</span></div>
            <p class="text-sm leading-relaxed mb-2" style="color:var(--text-secondary);">Gunakan aturan produk ya! (uv)' = u'v + uv'. Kalau f(x) = sin(x)·cos(x), maka:</p>
            <div class="text-sm p-3 rounded-lg mb-2" style="background:var(--bg-section);border:1px solid var(--border-color);font-family:monospace;color:var(--primary);">f'(x) = cos(x)·cos(x) + sin(x)·(-sin(x))<br>= cos²x − sin²x<br>= cos(2x)</div>
            <div class="flex items-center gap-4"><button class="vote-btn" onclick="Forum.toggleVote(this)"><i class="fas fa-arrow-up"></i> <span>5</span></button><span class="text-xs" style="color:var(--text-muted);">7 suara</span></div></div>
            <div class="comment-item mb-4"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:linear-gradient(135deg,#f59e0b,#d97706);">A</div><div><span class="font-semibold text-sm" style="color:var(--text-primary);">Aisyah12</span><span class="text-xs ml-2" style="color:var(--text-muted);">45 menit lalu</span></div></div>
            <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Ingat rumus dasar dulu ya: d(sin x)/dx = cos x, d(cos x)/dx = -sin x. Kalau ada perkalian pake aturan produk. Semangat!</p></div>
            <div class="glass-card !p-5 mt-6"><h4 class="font-bold mb-3" style="color:var(--text-primary);">Tulis Balasan</h4>
            <form onsubmit="Forum.submitComment(event)"><div class="mb-3"><textarea id="discussionCommentInput" rows="2" class="w-full p-3 rounded-lg text-sm border resize-none focus:outline-none focus:ring-2" style="background:var(--bg-body);border-color:var(--border-color);color:var(--text-primary);" placeholder="Tulis jawaban atau pertanyaanmu..."></textarea></div>
            <div class="flex items-center justify-between"><div class="flex items-center gap-2"><input type="checkbox" id="anonCheck" class="accent-[var(--primary)]"><label for="anonCheck" class="text-xs" style="color:var(--text-muted);">Post sebagai anonim</label></div>
            <button type="submit" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4">Kirim</button></div></form></div>
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

  function getIcon(cat) { return { matematika:'fa-calculator', fisika:'fa-atom', kimia:'fa-flask', biologi:'fa-dna', sejarah:'fa-landmark', bahasa:'fa-language', ips:'fa-globe' }[cat] || 'fa-book'; }

  function catLabel(cat) { return CAT_LABELS[cat] || capitalize(cat); }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  return { refresh, openThread, openDiscussionModal: openThreadFromCard, openNewThread, backToList, toggleVote, submitComment };
})();