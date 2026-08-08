import { injectStyle } from '../../js/utils/styleLoader.js';

injectStyle('features/forum/css/forum.css');

export function renderForum() { return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="section-badge"><i class="fas fa-comments"></i> Forum Diskusi</span>
      <div class="flex flex-wrap items-end justify-between gap-4 mt-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Diskusi Bebas, Belajar Seru</h1>
          <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Pilih kategori mapel, gulir thread-nya, dan bergabung tanpa rasa malu.</p>
        </div>
        <button onclick="Forum.openNewThread()" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4"><i class="fas fa-plus"></i> Thread Baru</button>
      </div>
    </div>
  </div>
</section>

<section class="py-6">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="card-panel p-4 sm:p-6">
      <p class="text-sm font-semibold mb-3 text-slate-600 dark:text-slate-300"><i class="fas fa-filter mr-2"></i>Filter Kategori:</p>
      <div class="flex flex-wrap gap-2" id="categoryFilter">
        <button class="cat-btn active" data-category="all">Semua</button>
        <button class="cat-btn" data-category="matematika"><i class="fas fa-calculator mr-1"></i> Matematika</button>
        <button class="cat-btn" data-category="fisika"><i class="fas fa-atom mr-1"></i> Fisika</button>
        <button class="cat-btn" data-category="kimia"><i class="fas fa-flask mr-1"></i> Kimia</button>
        <button class="cat-btn" data-category="biologi"><i class="fas fa-dna mr-1"></i> Biologi</button>
        <button class="cat-btn" data-category="sejarah"><i class="fas fa-landmark mr-1"></i> Sejarah</button>
        <button class="cat-btn" data-category="bahasa"><i class="fas fa-language mr-1"></i> Bahasa</button>
        <button class="cat-btn" data-category="ips"><i class="fas fa-globe mr-1"></i> IPS</button>
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

<div id="discussionModal" class="modal-edquest" role="dialog" aria-modal="true" aria-labelledby="discussionModalTitle">
  <div class="modal-content" style="max-width:700px;">
    <div class="modal-header">
      <h3 id="discussionModalTitle" class="text-xl font-bold" style="color:var(--text-primary);">Diskusi</h3>
      <button class="modal-close" data-action="close-modal" aria-label="Tutup"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body" id="discussionModalBody"></div>
  </div>
</div>
`; }
