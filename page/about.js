function renderAbout() { return `
<section class="page-header">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
    <div class="max-w-3xl">
      <span class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full bg-white/15 text-white/90 backdrop-blur-sm mb-4"><i class="fas fa-info-circle"></i> Tentang Edquest</span>
      <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-4">Belajar Bareng,<br>Tumbuh Bareng</h1>
      <p class="text-lg text-white/80 max-w-xl">Edquest lahir dari keprihatinan bahwa banyak siswa pintar tapi ragu bertanya. Kami hadir sebagai solusi.</p>
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full" style="background:var(--primary-light);color:var(--primary);"><i class="fas fa-question-circle"></i> Latar Belakang</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-6" style="color:var(--text-primary);">Kenapa Edquest Dibuat?</h2>
        <div class="space-y-4 text-sm leading-relaxed" style="color:var(--text-secondary);">
          <p>Setiap siswa punya potensi, tapi tidak semua punya keberanian untuk bertanya. Rasa malu, takut dinilai kurang memahami, atau khawatir dihakimi teman membuat banyak siswa memilih diam — padahal di dalam kepala mereka penuh rasa ingin tahu.</p>
          <p>Di sisi lain, belajar sendiri terasa berat. Tanpa teman diskusi, materi sulit dipahami dan motivasi mudah menurun. Siswa butuh ruang yang aman untuk bertanya, berpendapat, dan belajar dari teman sebaya.</p>
          <p><strong>Edquest</strong> hadir sebagai solusi: sebuah komunitas belajar digital di mana siswa SMA/SMK bisa berdiskusi, mencari teman belajar, dan melacak progress mereka — tanpa rasa malu dan tanpa tekanan.</p>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <div class="glass-card !p-8 text-center max-w-sm">
          <div class="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style="background:var(--primary-light);color:var(--primary);"><i class="fas fa-lightbulb"></i></div>
          <blockquote class="text-sm italic leading-relaxed" style="color:var(--text-secondary);">"Keberanian untuk bertanya adalah awal dari semua pengetahuan."</blockquote>
          <p class="text-xs font-medium mt-3" style="color:var(--text-muted);">— Semua siswa berhak belajar tanpa rasa takut lagi</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-section);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      <span class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full" style="background:var(--primary-light);color:var(--primary);"><i class="fas fa-bullseye"></i> Visi & Misi</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3" style="color:var(--text-primary);">Arah dan Tujuan Kami</h2>
    </div>
    <div class="max-w-3xl mx-auto">
      <div class="glass-card !p-8 mb-8 text-center">
        <i class="fas fa-eye text-3xl mb-4" style="color:var(--primary);"></i>
        <h3 class="text-2xl font-bold mb-3" style="color:var(--text-primary);">Visi</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Membangun generasi siswa yang percaya diri untuk belajar, bertanya, dan berbagi ilmu — tanpa batasan rasa malu.</p>
      </div>
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="glass-card !p-6 text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl" style="background:var(--primary-light);color:var(--primary);"><i class="fas fa-shield-alt"></i></div>
          <h4 class="text-sm font-bold mb-2" style="color:var(--text-primary);">Ruang Aman</h4>
          <p class="text-xs leading-relaxed" style="color:var(--text-secondary);">Menyediakan lingkungan diskusi yang nyaman dengan opsi anonim.</p>
        </div>
        <div class="glass-card !p-6 text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl" style="background:var(--primary-light);color:var(--primary);"><i class="fas fa-handshake"></i></div>
          <h4 class="text-sm font-bold mb-2" style="color:var(--text-primary);">Koneksi</h4>
          <p class="text-xs leading-relaxed" style="color:var(--text-secondary);">Menghubungkan siswa dengan teman belajar yang sesuai minat.</p>
        </div>
        <div class="glass-card !p-6 text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl" style="background:var(--primary-light);color:var(--primary);"><i class="fas fa-chart-line"></i></div>
          <h4 class="text-sm font-bold mb-2" style="color:var(--text-primary);">Progress</h4>
          <p class="text-xs leading-relaxed" style="color:var(--text-secondary);">Membantu siswa melacak perjalanan belajar mereka.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      <span class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full" style="background:var(--primary-light);color:var(--primary);"><i class="fas fa-cogs"></i> Cara Kerja</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3" style="color:var(--text-primary);">mudah, Kok!</h2>
      <p class="text-lg" style="color:var(--text-secondary);">Cuma 3 langkah buat mulai belajar di Edquest</p>
    </div>
    <div class="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white" style="background:var(--gradient-primary);">1</div>
        <h3 class="text-lg font-bold mb-2" style="color:var(--text-primary);">Daftar Akun</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Buat akun dengan nama panggilan — nggak perlu pakai nama asli kalau malu.</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white" style="background:var(--gradient-primary);">2</div>
        <h3 class="text-lg font-bold mb-2" style="color:var(--text-primary);">Ikut Diskusi</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Bertanya, menjawab, atau sekadar membaca thread di forum sesuai minatmu.</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white" style="background:var(--gradient-primary);">3</div>
        <h3 class="text-lg font-bold mb-2" style="color:var(--text-primary);">Tumbuh Bareng</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Dapatkan poin, badge, dan teman belajar baru. Catat progress belajarmu!</p>
      </div>
    </div>
  </div>
</section>
`; }