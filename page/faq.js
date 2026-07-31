function renderFaq() { return `
<section class="page-header">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
    <span class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full bg-white/15 text-white/90 backdrop-blur-sm mb-4"><i class="fas fa-question-circle"></i> FAQ & Kontak</span>
    <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-4">Punya Pertanyaan?</h1>
    <p class="text-lg text-white/80 max-w-2xl">Jawaban atas pertanyaan yang paling sering diajukan. Atau kirim pesan langsung ke kami.</p>
  </div>
</section>

<section class="py-12" style="background:var(--bg-body);">
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <h2 class="text-2xl font-extrabold mb-6 text-center" style="color:var(--text-primary);">Pertanyaan Umum</h2>
    <div class="space-y-3" id="faqAccordion">
      <div class="glass-card overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm" style="color:var(--text-primary);"><i class="fas fa-user-friends mr-2" style="color:var(--primary);"></i>Apa itu Edquest?</span>
          <i class="fas fa-chevron-down text-xs transition-transform" style="color:var(--text-muted);"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed" style="color:var(--text-secondary);">Edquest adalah komunitas belajar digital untuk siswa SMA/SMK. Di sini kamu bisa berdiskusi dengan teman sebaya, mencari teman belajar yang cocok, dan melacak progress belajarmu — semua tanpa rasa malu.</p>
        </div>
      </div>
      <div class="glass-card overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm" style="color:var(--text-primary);"><i class="fas fa-mask mr-2" style="color:var(--primary);"></i>Boleh anonim nggak di forum?</span>
          <i class="fas fa-chevron-down text-xs transition-transform" style="color:var(--text-muted);"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed" style="color:var(--text-secondary);">Boleh sekali! Di Edquest, kamu bisa post dengan nama panggilan atau bahkan tetap anonim. Yang penting kamu ikut berpartisipasi dan belajar bareng.</p>
        </div>
      </div>
      <div class="glass-card overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm" style="color:var(--text-primary);"><i class="fas fa-star mr-2" style="color:var(--primary);"></i>Bagaimana sistem poin dan badge-nya?</span>
          <i class="fas fa-chevron-down text-xs transition-transform" style="color:var(--text-muted);"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed" style="color:var(--text-secondary);">Poin diperoleh dari aktivitas seperti membuat thread, membalas, dan berkontribusi. Badge diberikan sebagai simbol pencapaian — bukan untuk perlombaan — melainkan untuk mendorongmu terus aktif belajar.</p>
        </div>
      </div>
      <div class="glass-card overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm" style="color:var(--text-primary);"><i class="fas fa-user-friends mr-2" style="color:var(--primary);"></i>Bagaimana cara kerja Study Buddy Matching?</span>
          <i class="fas fa-chevron-down text-xs transition-transform" style="color:var(--text-muted);"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed" style="color:var(--text-secondary);">Tinggal pilih mapel dan minat belajarmu di halaman "Cari Teman". Sistem akan mencocokkanmu dengan siswa lain yang punya minat dan mapel yang sama.</p>
        </div>
      </div>
      <div class="glass-card overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm" style="color:var(--text-primary);"><i class="fas fa-book mr-2" style="color:var(--primary);"></i>Apakah ada jurnal belajar?</span>
          <i class="fas fa-chevron-down text-xs transition-transform" style="color:var(--text-muted);"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed" style="color:var(--text-secondary);">Ya! Setiap pengguna punya jurnal belajar pribadi di halaman Profil. Catat apa yang udah kamu pelajari setiap hari — ini bisa jadi motivasi buat lihat progress-mu seiring waktu.</p>
        </div>
      </div>
      <div class="glass-card overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm" style="color:var(--text-primary);"><i class="fas fa-shield-alt mr-2" style="color:var(--primary);"></i>Apakah data saya aman?</span>
          <i class="fas fa-chevron-down text-xs transition-transform" style="color:var(--text-muted);"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed" style="color:var(--text-secondary);">Ini versi demo/mockup untuk lomba. Data disimpan sementara di localStorage browser dan tidak dikirim ke server manapun. Tidak ada data pribadi yang dibagikan ke pihak manapun.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-12" style="background:var(--bg-section);">
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <h2 class="text-2xl font-extrabold mb-6 text-center" style="color:var(--text-primary);">Kirim Pesan</h2>
    <form class="glass-card !p-6" onsubmit="App.submitContact(event)">
      <div class="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="form-label" for="contactName">Nama</label>
          <input id="contactName" type="text" class="form-input" placeholder="Nama panggilanmu" required>
        </div>
        <div>
          <label class="form-label" for="contactEmail">Email</label>
          <input id="contactEmail" type="email" class="form-input" placeholder="nama@email.com" required>
        </div>
      </div>
      <div class="mb-4">
        <label class="form-label" for="contactSubject">Subjek</label>
        <input id="contactSubject" type="text" class="form-input" placeholder="Apa yang ingin kamu sampaikan?" required>
      </div>
      <div class="mb-6">
        <label class="form-label" for="contactMessage">Pesan</label>
        <textarea id="contactMessage" rows="4" class="form-input resize-none" placeholder="Tulis pesanmu di sini..." required></textarea>
      </div>
      <button type="submit" class="btn-edquest btn-primary-grad w-full"><i class="fas fa-paper-plane"></i> Kirim Pesan</button>
    </form>
  </div>
</section>
`; }