export function renderAbout() { return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-info-circle"></i> Tentang Edquest</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">Belajar Bareng,<br class="sm:hidden"> Tumbuh Bareng</h1>
      <p class="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">Edquest lahir dari keprihatinan bahwa banyak siswa pintar tapi ragu bertanya. Kami hadir sebagai solusi.</p>
    </div>
  </div>
</section>

<section class="py-14 lg:py-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-question-circle"></i> Latar Belakang</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-6 text-slate-900 dark:text-slate-100">Kenapa Edquest Dibuat?</h2>
        <div class="space-y-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          <p>Setiap siswa punya potensi, tapi tidak semua punya keberanian untuk bertanya. Rasa malu, takut dinilai kurang memahami, atau khawatir dihakimi teman membuat banyak siswa memilih diam — padahal di dalam kepala mereka penuh rasa ingin tahu.</p>
          <p>Di sisi lain, belajar sendiri terasa berat. Tanpa teman diskusi, materi sulit dipahami dan motivasi mudah menurun. Siswa butuh ruang yang aman untuk bertanya, berpendapat, dan belajar dari teman sebaya.</p>
          <p><strong>Edquest</strong> hadir sebagai solusi: sebuah komunitas belajar digital di mana siswa SMA/SMK bisa berdiskusi, mencari teman belajar, dan melacak progress mereka — tanpa rasa malu dan tanpa tekanan.</p>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center max-w-sm">
          <div class="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-lightbulb"></i></div>
          <blockquote class="text-sm italic leading-relaxed text-slate-500 dark:text-slate-400">"Keberanian untuk bertanya adalah awal dari semua pengetahuan."</blockquote>
          <p class="text-xs font-medium mt-3 text-slate-400 dark:text-slate-500">— Semua siswa berhak belajar tanpa rasa takut lagi</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-14 lg:py-16" style="background:var(--bg-section);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      <span class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-bullseye"></i> Visi & Misi</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3 text-slate-900 dark:text-slate-100">Arah dan Tujuan Kami</h2>
    </div>
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 text-center">
        <i class="fas fa-eye text-3xl mb-4 text-slate-600 dark:text-slate-300"></i>
        <h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Visi</h3>
        <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">Membangun generasi siswa yang percaya diri untuk belajar, bertanya, dan berbagi ilmu — tanpa batasan rasa malu.</p>
      </div>
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-shield-alt"></i></div>
          <h4 class="text-sm font-bold mb-2 text-slate-900 dark:text-slate-100">Ruang Aman</h4>
          <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Menyediakan lingkungan diskusi yang nyaman dengan opsi anonim.</p>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-handshake"></i></div>
          <h4 class="text-sm font-bold mb-2 text-slate-900 dark:text-slate-100">Koneksi</h4>
          <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Menghubungkan siswa dengan teman belajar yang sesuai minat.</p>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-chart-line"></i></div>
          <h4 class="text-sm font-bold mb-2 text-slate-900 dark:text-slate-100">Progress</h4>
          <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Membantu siswa melacak perjalanan belajar mereka.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-14 lg:py-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      <span class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-cogs"></i> Cara Kerja</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3 text-slate-900 dark:text-slate-100">mudah, Kok!</h2>
      <p class="text-lg text-slate-500 dark:text-slate-400">Cuma 3 langkah buat mulai belajar di Edquest</p>
    </div>
    <div class="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white" style="background:var(--gradient-primary);">1</div>
        <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">Daftar Akun</h3>
        <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">Buat akun dengan nama panggilan — nggak perlu pakai nama asli kalau malu.</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white" style="background:var(--gradient-primary);">2</div>
        <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">Ikut Diskusi</h3>
        <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">Bertanya, menjawab, atau sekadar membaca thread di forum sesuai minatmu.</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white" style="background:var(--gradient-primary);">3</div>
        <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">Tumbuh Bareng</h3>
        <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">Dapatkan poin, badge, dan teman belajar baru. Catat progress belajarmu!</p>
      </div>
    </div>
  </div>
</section>
`; }
