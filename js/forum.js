const ForumData = [
  { category:'matematika', title:'Turunan fungsi trigonometri itu kayak gimana sih?', subtitle:'Aku masih bingung sama rumus turunan sin, cos, dan tan...', author:'MathExplorer', replies:5, votes:12, time:'2 jam lalu', status:'Aktif' },
  { category:'matematika', title:'Cara cepat tentukan turunan fungsi aljabar', subtitle:'Mau share tips cepat buat turunan aljabar kelas 10.', author:'KakakKelas', replies:8, votes:25, time:'5 jam lalu', status:'Aktif' },
  { category:'fisika', title:'Hukum Newton mana yang paling sering keluar di UN?', subtitle:'Mau panduan persiapan UN dari hukum Newton.', author:'FisikawanMuda', replies:3, votes:7, time:'1 hari lalu', status:'Populer' },
  { category:'fisika', title:'Konsep gerak parabola butuh banget buat UTS', subtitle:'Masih bingung kapan benda itu parabola dan kapan nggak.', author:'RoboStudent', replies:6, votes:15, time:'2 hari lalu', status:'Aktif' },
  { category:'kimia', title:'Reaksi redoks: cara cepat tentukan teroksidasi', subtitle:'Trik nentuin zat teroksidasi dan tereduksi biar gampang.', author:'KimiaFun', replies:4, votes:9, time:'3 hari lalu', status:'Aktif' },
  { category:'biologi', title:'Saya salah paham tentang mitosis dan meiosis', subtitle:'Akhirnya ngerti perbedaannya! Mau share rangkuman.', author:'BioNerd', replies:11, votes:30, time:'4 hari lalu', status:'Populer' },
  { category:'sejarah', title:'Pemanfaatan teknologi di era Kemerdekaan Indonesia', subtitle:'Teknologi apa aja yang dipakai waktu era kemerdekaan?', author:'SejarawanCilik', replies:2, votes:5, time:'5 hari lalu', status:'Aktif' },
  { category:'bahasa', title:'Cara menulis teks eksplanasi biar dapet nilai A', subtitle:'Sering dapat nilai kurang di teks eksplanasi. Bagi tips!', author:'KataJuara', replies:7, votes:18, time:'1 minggu lalu', status:'Aktif' }
];

const Forum = (() => {
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;
    bindFilterEvents();
    bindCategoryTags();
    bindAllThreadCards();
    initCategoryModal();
    initDiscussionModal();
  }

  function refresh() {
    init();
    if (document.getElementById('categoryFilter')) filterThreads('all');
  }

  function bindFilterEvents() {
    const container = document.getElementById('categoryFilter');
    if (!container) return;
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;
      container.querySelectorAll('.cat-btn').forEach(b => {
        b.style.background = 'transparent'; b.style.color = 'var(--text-secondary)'; b.style.borderColor = 'var(--border-color)'; b.classList.remove('active');
      });
      btn.style.background = 'var(--primary)'; btn.style.color = 'white'; btn.style.borderColor = 'var(--primary)'; btn.classList.add('active');
      filterThreads(btn.dataset.category);
    });
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

  function bindCategoryTags() {
    document.addEventListener('click', (e) => {
      const tag = e.target.closest('.category-tag:not(.in-modal)');
      if (!tag) return;
      const card = tag.closest('.thread-card');
      if (card) openDiscussionModal(card);
    });
  }

  function bindAllThreadCards() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.thread-card');
      if (!card || e.target.closest('.category-tag') || e.target.closest('button')) return;
      openDiscussionModal(card);
    });
  }

  function initCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (!modal) return;
    modal.querySelectorAll('.category-tag').forEach(tag => tag.style.cursor = 'pointer');
  }

  function openCategoryModal(category) {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    const body = document.getElementById('categoryModalBody');
    if (!modal || !title || !body) return;
    const meta = { matematika:{title:'Matematika',icon:'fa-calculator'}, fisika:{title:'Fisika',icon:'fa-atom'}, kimia:{title:'Kimia',icon:'fa-flask'}, biologi:{title:'Biologi',icon:'fa-dna'}, sejarah:{title:'Sejarah',icon:'fa-landmark'}, bahasa:{title:'Bahasa Indonesia',icon:'fa-language'}, ips:{title:'IPS',icon:'fa-globe'} };
    const m = meta[category];
    const threads = ForumData.filter(t => t.category === category);
    title.innerHTML = m ? '<i class="fas ' + m.icon + ' mr-2"></i>' + m.title + ' — Sub Thread' : category;
    body.innerHTML = threads.length === 0
      ? '<p class="text-sm" style="color:var(--text-muted);">Belum ada sub-thread untuk kategori ini.</p>'
      : threads.map(t => '<div class="thread-item p-3 rounded-lg mb-2 cursor-pointer" style="background:var(--bg-body);border:1px solid var(--border-color);" onclick="Forum.openDiscussionModal(\'' + t.title.replace(/'/g, "\\'") + '\');document.getElementById(\'categoryModal\').classList.remove(\'active\');document.body.style.overflow=\'\'">' +
        '<div class="flex items-start justify-between gap-3"><div class="flex-1 min-w-0"><h4 class="font-semibold text-sm mb-1" style="color:var(--text-primary);">' + t.title + '</h4>' +
        '<p class="text-xs truncate" style="color:var(--text-secondary);">' + t.subtitle + '</p>' +
        '<div class="flex items-center gap-3 mt-1 text-xs" style="color:var(--text-muted);"><span><i class="fas fa-user mr-1"></i>' + t.author + '</span><span><i class="fas fa-comment mr-1"></i>' + t.replies + '</span><span><i class="fas fa-arrow-up mr-1"></i>' + t.votes + '</span></div></div>' +
        '<span class="text-xs whitespace-nowrap" style="color:var(--text-muted);">' + t.time + '</span></div></div>').join('');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function initDiscussionModal() {
    document.addEventListener('click', (e) => {
      const close = e.target.closest('#discussionModal [data-action="close-modal"]');
      const overlay = e.target.closest('#discussionModal');
      if ((close || (overlay && e.target === overlay)) && document.getElementById('discussionModal')) {
        document.getElementById('discussionModal').classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  function openDiscussionModal(cardOrTitle) {
    const modal = document.getElementById('discussionModal');
    const body = document.getElementById('discussionModalBody');
    if (!modal || !body) return;
    let thread;
    if (typeof cardOrTitle === 'string') {
      thread = ForumData.find(t => t.title === cardOrTitle) || ForumData[0];
    } else if (cardOrTitle && cardOrTitle.dataset) {
      const cat = cardOrTitle.dataset.category;
      const titleEl = cardOrTitle.querySelector('h3');
      const title = titleEl ? titleEl.textContent.trim() : '';
      thread = ForumData.find(t => t.title === title) || (cat ? ForumData.filter(t => t.category === cat)[0] : ForumData[0]);
    } else {
      thread = ForumData[0];
    }
    if (!thread) thread = ForumData[0];
    body.innerHTML = '<div class="discussion-detail">' +
      '<div class="flex flex-wrap items-center gap-2 mb-3"><span class="category-tag ' + thread.category + ' in-modal"><i class="fas ' + getIcon(thread.category) + '"></i> ' + capitalize(thread.category) + '</span><span class="text-xs" style="color:var(--text-muted);">' + thread.time + '</span></div>' +
      '<h2 class="text-xl font-bold mb-3" style="color:var(--text-primary);">' + thread.title + '</h2>' +
      '<p class="text-sm leading-relaxed mb-4" style="color:var(--text-secondary);">' + thread.subtitle + '</p>' +
      '<div class="flex items-center gap-4 text-sm mb-6" style="color:var(--text-muted);"><span><i class="fas fa-user mr-1"></i>' + thread.author + '</span><span><i class="fas fa-comment mr-1"></i>' + thread.replies + ' balasan</span><span><i class="fas fa-arrow-up mr-1"></i>' + thread.votes + ' suara</span></div>' +
      '<hr style="border-color:var(--border-color);margin-bottom:1.5rem;">' +
      '<div class="comment-item mb-4"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:var(--gradient-primary);">K</div><div><span class="font-semibold text-sm" style="color:var(--text-primary);">KakakKelas</span><span class="text-xs ml-2" style="color:var(--text-muted);">1 jam lalu</span></div><span class="text-xs px-2 py-0.5 rounded-full ml-auto" style="background:var(--primary-light);color:var(--primary);">Jawab</span></div>' +
      '<p class="text-sm leading-relaxed mb-2" style="color:var(--text-secondary);">Gunakan aturan produk ya! (uv)\' = u\'v + uv\'. Kalau f(x) = sin(x)\u00B7cos(x), maka:</p>' +
      '<div class="text-sm p-3 rounded-lg mb-2" style="background:var(--bg-section);border:1px solid var(--border-color);font-family:monospace;color:var(--primary);">f\'(x) = cos(x)\u00B7cos(x) + sin(x)\u00B7(-sin(x))<br>= cos\u00B2x \u2212 sin\u00B2x<br>= cos(2x)</div>' +
      '<div class="flex items-center gap-4"><button class="vote-btn" onclick="Forum.toggleVote(this)"><i class="fas fa-arrow-up"></i> <span>5</span></button><span class="text-xs" style="color:var(--text-muted);">7 suara</span></div></div>' +
      '<div class="comment-item mb-4"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:linear-gradient(135deg,#f59e0b,#d97706);">A</div><div><span class="font-semibold text-sm" style="color:var(--text-primary);">Aisyah12</span><span class="text-xs ml-2" style="color:var(--text-muted);">45 menit lalu</span></div></div>' +
      '<p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Ingat rumus dasar dulu ya: d(sin x)/dx = cos x, d(cos x)/dx = -sin x. Kalau ada perkalian pake aturan produk. Semangat!</p></div>' +
      '<div class="glass-card !p-5 mt-4"><h4 class="font-bold mb-3" style="color:var(--text-primary);">Tulis Balasan</h4>' +
      '<form onsubmit="Forum.submitComment(event)"><div class="mb-3"><textarea id="discussionCommentInput" rows="2" class="w-full p-3 rounded-lg text-sm border resize-none focus:outline-none focus:ring-2" style="background:var(--bg-body);border-color:var(--border-color);color:var(--text-primary);" placeholder="Tulis jawaban atau pertanyaanmu..."></textarea></div>' +
      '<div class="flex items-center justify-between"><div class="flex items-center gap-2"><input type="checkbox" id="anonCheck" class="accent-[var(--primary)]"><label for="anonCheck" class="text-xs" style="color:var(--text-muted);">Post sebagai anonim</label></div>' +
      '<button type="submit" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4">Kirim</button></div></form></div></div>';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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
    Auth.showToast('Komentar berhasil dikirim!', 'success');
    input.value = '';
  }

  function getIcon(cat) { return { matematika:'fa-calculator', fisika:'fa-atom', kimia:'fa-flask', biologi:'fa-dna', sejarah:'fa-landmark', bahasa:'fa-language', ips:'fa-globe' }[cat] || 'fa-book'; }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  return { init, refresh, openDiscussionModal, openCategoryModal, toggleVote, submitComment };
})();

window.addEventListener('pageChanged', (e) => {
  if (e.detail.pageName === 'forum') setTimeout(() => Forum.refresh(), 50);
});