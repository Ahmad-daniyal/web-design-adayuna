export function renderForum() { return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-comments"></i> Forum Diskusi</span>
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
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6">
      <p class="text-sm font-semibold mb-3 text-slate-600 dark:text-slate-300"><i class="fas fa-filter mr-2"></i>Filter Kategori:</p>
      <div class="flex flex-wrap gap-2" id="categoryFilter">
        <button class="cat-btn active px-4 py-2 rounded-full text-sm font-semibold border transition-all" data-category="all" style="background:var(--primary);color:white;border-color:var(--primary);">Semua</button>
        <button class="cat-btn px-4 py-2 rounded-full text-sm font-semibold border transition-all" data-category="matematika" style="border-color:var(--border-color);color:var(--text-secondary);background:transparent;"><i class="fas fa-calculator mr-1"></i> Matematika</button>
        <button class="cat-btn px-4 py-2 rounded-full text-sm font-semibold border transition-all" data-category="fisika" style="border-color:var(--border-color);color:var(--text-secondary);background:transparent;"><i class="fas fa-atom mr-1"></i> Fisika</button>
        <button class="cat-btn px-4 py-2 rounded-full text-sm font-semibold border transition-all" data-category="kimia" style="border-color:var(--border-color);color:var(--text-secondary);background:transparent;"><i class="fas fa-flask mr-1"></i> Kimia</button>
        <button class="cat-btn px-4 py-2 rounded-full text-sm font-semibold border transition-all" data-category="biologi" style="border-color:var(--border-color);color:var(--text-secondary);background:transparent;"><i class="fas fa-dna mr-1"></i> Biologi</button>
        <button class="cat-btn px-4 py-2 rounded-full text-sm font-semibold border transition-all" data-category="sejarah" style="border-color:var(--border-color);color:var(--text-secondary);background:transparent;"><i class="fas fa-landmark mr-1"></i> Sejarah</button>
        <button class="cat-btn px-4 py-2 rounded-full text-sm font-semibold border transition-all" data-category="bahasa" style="border-color:var(--border-color);color:var(--text-secondary);background:transparent;"><i class="fas fa-language mr-1"></i> Bahasa</button>
        <button class="cat-btn px-4 py-2 rounded-full text-sm font-semibold border transition-all" data-category="ips" style="border-color:var(--border-color);color:var(--text-secondary);background:transparent;"><i class="fas fa-globe mr-1"></i> IPS</button>
      </div>
    </div>
  </div>
</section>

<section class="py-6 pb-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Thread Terbaru</h2>
      <span class="text-sm text-slate-400 dark:text-slate-500" id="threadCount">8 thread ditemukan</span>
    </div>
    <div id="threadList" class="space-y-3">
      <div class="thread-card" data-category="matematika">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="category-tag matematika"><i class="fas fa-calculator"></i> Matematika</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">2 jam lalu</span>
            </div>
            <h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">Turunan fungsi trigonometri itu kayak gimana sih?</h3>
            <p class="text-sm truncate text-slate-500 dark:text-slate-400">Aku masih bingung sama rumus turunan sin, cos, dan tan. Kalau x\u00B2 sinx, hasilnya apa? Mau nanya lebih detail...</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span><i class="fas fa-user mr-1"></i>MathExplorer</span>
              <span><i class="fas fa-comment mr-1"></i> 5 balasan</span>
              <span><i class="fas fa-arrow-up mr-1"></i> 12 suara</span>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Aktif</span>
        </div>
      </div>
      <div class="thread-card" data-category="matematika">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="category-tag matematika"><i class="fas fa-calculator"></i> Matematika</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">5 jam lalu</span>
            </div>
            <h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">Cara cepat tentukan turunan fungsi aljabar</h3>
            <p class="text-sm truncate text-slate-500 dark:text-slate-400">Mau share tips cepat nentuin turunan fungsi aljabar buat kalian yang masih kelas 10. Boleh tanya lebih lanjut di sini ya!</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span><i class="fas fa-user mr-1"></i>KakakKelas</span>
              <span><i class="fas fa-comment mr-1"></i> 8 balasan</span>
              <span><i class="fas fa-arrow-up mr-1"></i> 25 suara</span>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Aktif</span>
        </div>
      </div>
      <div class="thread-card" data-category="fisika">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="category-tag fisika"><i class="fas fa-atom"></i> Fisika</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">1 hari lalu</span>
            </div>
            <h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">Hukum Newton mana yang paling sering keluar di UN?</h3>
            <p class="text-sm truncate text-slate-500 dark:text-slate-400">Mau tahu persiapan UN: hukum Newton yang mana yang paling sering muncul? Aku bingung antara hukum 1, 2, atau 3.</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span><i class="fas fa-user mr-1"></i>FisikawanMuda</span>
              <span><i class="fas fa-comment mr-1"></i> 3 balasan</span>
              <span><i class="fas fa-arrow-up mr-1"></i> 7 suara</span>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Populer</span>
        </div>
      </div>
      <div class="thread-card" data-category="fisika">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="category-tag fisika"><i class="fas fa-atom"></i> Fisika</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">2 hari lalu</span>
            </div>
            <h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">Konsep gerak parabola butuh banget buat UTS</h3>
            <p class="text-sm truncate text-slate-500 dark:text-slate-400">Ada yang bisa jelasin tentang gerak parabola? Aku masih nggak ngerti kapan benda itu parabola dan kapan nggak.</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span><i class="fas fa-user mr-1"></i>RoboStudent</span>
              <span><i class="fas fa-comment mr-1"></i> 6 balasan</span>
              <span><i class="fas fa-arrow-up mr-1"></i> 15 suara</span>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Aktif</span>
        </div>
      </div>
      <div class="thread-card" data-category="kimia">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="category-tag kimia"><i class="fas fa-flask"></i> Kimia</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">3 hari lalu</span>
            </div>
            <h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">Reaksi redoks itu gimana cara tentukan yang teroksidasi?</h3>
            <p class="text-sm truncate text-slate-500 dark:text-slate-400">Aku masih ribet soal reaksi redoks. Mau tau cara cepet nentuin zat yang teroksidasi dan tereduksi.</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span><i class="fas fa-user mr-1"></i>KimiaFun</span>
              <span><i class="fas fa-comment mr-1"></i> 4 balasan</span>
              <span><i class="fas fa-arrow-up mr-1"></i> 9 suara</span>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Aktif</span>
        </div>
      </div>
      <div class="thread-card" data-category="biologi">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="category-tag biologi"><i class="fas fa-dna"></i> Biologi</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">4 hari lalu</span>
            </div>
            <h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">Selama ini aku salah paham soal mitosis dan meiosis</h3>
            <p class="text-sm truncate text-slate-500 dark:text-slate-400">Setelah baca thread ini akhirnya ngerti perbedaan mitosis dan meiosis. Mau kasih ringkasannya buat yang lain biar gampang dipahami!</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span><i class="fas fa-user mr-1"></i>BioNerd</span>
              <span><i class="fas fa-comment mr-1"></i> 11 balasan</span>
              <span><i class="fas fa-arrow-up mr-1"></i> 30 suara</span>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Populer</span>
        </div>
      </div>
      <div class="thread-card" data-category="sejarah">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="category-tag sejarah"><i class="fas fa-landmark"></i> Sejarah</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">5 hari lalu</span>
            </div>
            <h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">Pemanfaatan teknologi di era Kemerdekaan Indonesia</h3>
            <p class="text-sm truncate text-slate-500 dark:text-slate-400">Buat yang lagi belajar sejarah Indonesia, teknologi apa aja sih yang dipake waktu era kemerdekaan?</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span><i class="fas fa-user mr-1"></i>SejarawanCilik</span>
              <span><i class="fas fa-comment mr-1"></i> 2 balasan</span>
              <span><i class="fas fa-arrow-up mr-1"></i> 5 suara</span>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Aktif</span>
        </div>
      </div>
      <div class="thread-card" data-category="bahasa">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="category-tag bahasa"><i class="fas fa-language"></i> Bahasa Indonesia</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">1 minggu lalu</span>
            </div>
            <h3 class="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">Cara menulis teks eksplanasi biar dapet nilai A</h3>
            <p class="text-sm truncate text-slate-500 dark:text-slate-400">Aku sering dapat nilai kurang di teks eksplanasi. Mau share tips buat struktur dan bahasanya. Ada yang mau berlatih bareng?</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span><i class="fas fa-user mr-1"></i>KataJuara</span>
              <span><i class="fas fa-comment mr-1"></i> 7 balasan</span>
              <span><i class="fas fa-arrow-up mr-1"></i> 18 suara</span>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Aktif</span>
        </div>
      </div>
    </div>
    <div class="mt-10 text-center">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl !p-8">
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
