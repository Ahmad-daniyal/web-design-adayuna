export function renderHome() { return `
<section class="hero-section min-h-[85vh] flex items-center pt-20 pb-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 w-full">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="text-center md:text-left">
        <div class="hero-badge mb-6 mx-auto md:mx-0">
          <i class="fas fa-sparkles text-sm"></i>
          Komunitas Belajar #UntukKita
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-6">
          Mulai Perjalanan<br>
          <span class="hero-accent">Belajarmu</span><br>
          Tanpa Rasa Malu
        </h1>
        <p class="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
          Banyak siswa punya mimpi besar, tapi ragu untuk memulai. Di <strong>Edquest</strong>, kamu bisa belajar dan berdiskusi dengan teman sebaya — tanpa takut dihakimi. Semua orang di sini sama-sama belajar, jadi nggak ada yang merasa paling pintar.
        </p>
        <div class="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <a href="#/forum" class="btn-edquest text-base" style="background:white; color:#4338CA; font-weight:700; box-shadow:0 4px 14px rgba(0,0,0,0.15);">
            <i class="fas fa-comments"></i> Mulai Diskusi
          </a>
          <a href="#/friend" class="btn-edquest text-base" style="background:rgba(255,255,255,0.12); color:white; border:1.5px solid rgba(255,255,255,0.25); backdrop-filter:blur(8px);">
            <i class="fas fa-user-friends"></i> Cari Teman Belajar
          </a>
        </div>
        <div class="baca-dulu mx-auto md:mx-0">
          <i class="fas fa-eye"></i>
          Ingin lihat-lihat dulu? <a href="#/forum" style="color:white; font-weight:600; text-decoration:underline; text-underline-offset:2px;">Jelajahi Forum</a>
        </div>
      </div>
      <div class="hidden md:flex items-center justify-center">
        <div class="relative">
          <div class="w-80 h-80 rounded-full" style="background:radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="grid grid-cols-2 gap-4 p-4">
              <div class="glass-card !p-5 text-center" style="animation:float 6s ease-in-out infinite;">
                <i class="fas fa-comment-dots text-3xl" style="color:var(--primary);"></i>
                <p class="text-xs font-medium mt-2" style="color:var(--text-secondary);">Forum Diskusi</p>
              </div>
              <div class="glass-card !p-5 text-center mt-8" style="animation:float 6s ease-in-out infinite; animation-delay:1s;">
                <i class="fas fa-user-graduate text-3xl" style="color:var(--accent);"></i>
                <p class="text-xs font-medium mt-2" style="color:var(--text-secondary);">Study Buddy</p>
              </div>
              <div class="glass-card !p-5 text-center" style="animation:float 6s ease-in-out infinite; animation-delay:2s;">
                <i class="fas fa-trophy text-3xl" style="color:var(--accent);"></i>
                <p class="text-xs font-medium mt-2" style="color:var(--text-secondary);">Badge & Poin</p>
              </div>
              <div class="glass-card !p-5 text-center mt-8" style="animation:float 6s ease-in-out infinite; animation-delay:0.5s;">
                <i class="fas fa-book-open text-3xl" style="color:var(--accent);"></i>
                <p class="text-xs font-medium mt-2" style="color:var(--text-secondary);">Progress Journal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="relative z-10 -mt-16 pb-12" style="background:transparent;">
  <div class="max-w-5xl mx-auto px-4 sm:px-6">
    <div class="card-panel overflow-hidden" style="box-shadow:var(--shadow-lg);">
      <div class="metric-strip">
        <div class="metric-item"><div class="metric-number">500+</div><div class="metric-label">Siswa Aktif</div></div>
        <div class="metric-item"><div class="metric-number">120+</div><div class="metric-label">Thread Diskusi</div></div>
        <div class="metric-item"><div class="metric-number">45+</div><div class="metric-label">Study Buddy</div></div>
        <div class="metric-item"><div class="metric-number">8</div><div class="metric-label">Kategori Mapel</div></div>
      </div>
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      <span class="section-badge"><i class="fas fa-sparkles"></i> Ice Breaker</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3" style="color:var(--text-primary);">Bingung Mau Mulai dari Mana?</h2>
      <p class="text-lg" style="color:var(--text-secondary); max-width:560px; margin:0 auto;">Tenang, kamu nggak sendirian. Coba salin kalimat ini untuk memulai diskusi di forum!</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="ice-card" data-copy="Aku masih bingung sama materi [Mapel] nih, ada yang bisa bantu jelasin? Mungkin teman-teman di sini ada yang paham.">
        <i class="fas fa-quote-right quote-icon"></i>
        <p class="text-sm font-medium leading-relaxed mb-3" style="color:var(--text-primary);">"Aku masih bingung sama materi <strong>[Mapel]</strong> nih, ada yang bisa bantu jelasin?"</p>
        <div class="flex items-center justify-between">
          <span class="flex flex-wrap gap-1.5">
            <span class="category-tag matematika">Matematika</span>
            <span class="category-tag fisika">Fisika</span>
          </span>
          <span class="copy-btn text-xs font-semibold" style="color:var(--primary); cursor:pointer;"><i class="fas fa-copy"></i> Salin</span>
        </div>
      </div>
      <div class="ice-card" data-copy="Ada yang mau belajar bareng topik [Topik]? Kita bisa saling bantu dan diskusi bareng biar lebih paham.">
        <i class="fas fa-quote-right quote-icon"></i>
        <p class="text-sm font-medium leading-relaxed mb-3" style="color:var(--text-primary);">"Ada yang mau belajar bareng topik <strong>[Topik]</strong>? Yuk kita bahas bareng!"</p>
        <div class="flex items-center justify-between">
          <span class="flex flex-wrap gap-1.5">
            <span class="category-tag">Semua Mapel</span>
          </span>
          <span class="copy-btn text-xs font-semibold" style="color:var(--primary); cursor:pointer;"><i class="fas fa-copy"></i> Salin</span>
        </div>
      </div>
      <div class="ice-card" data-copy="Menurutku, [Topik] itu sebenarnya menarik kalau kita paham konsep dasarnya. Gimana pendapat kalian?">
        <i class="fas fa-quote-right quote-icon"></i>
        <p class="text-sm font-medium leading-relaxed mb-3" style="color:var(--text-primary);">"Menurutku, <strong>[Topik]</strong> itu menarik kalau kita paham konsep dasarnya. Gimana pendapat kalian?"</p>
        <div class="flex items-center justify-between">
          <span class="flex flex-wrap gap-1.5">
            <span class="category-tag biologi">Biologi</span>
            <span class="category-tag kimia">Kimia</span>
          </span>
          <span class="copy-btn text-xs font-semibold" style="color:var(--primary); cursor:pointer;"><i class="fas fa-copy"></i> Salin</span>
        </div>
      </div>
      <div class="ice-card" data-copy="Halo semua! Aku baru di Edquest. Ada rekomendasi thread atau topik yang seru untuk didiskusikan?">
        <i class="fas fa-quote-right quote-icon"></i>
        <p class="text-sm font-medium leading-relaxed mb-3" style="color:var(--text-primary);">"Halo semua! Aku baru di Edquest. Ada rekomendasi thread atau topik yang seru?"</p>
        <div class="flex items-center justify-between">
          <span class="flex flex-wrap gap-1.5">
            <span class="category-tag">Perkenalan</span>
          </span>
          <span class="copy-btn text-xs font-semibold" style="color:var(--primary); cursor:pointer;"><i class="fas fa-copy"></i> Salin</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      <span class="section-badge"><i class="fas fa-star"></i> Fitur Unggulan</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3" style="color:var(--text-primary);">Belajar Lebih Seru Bareng Edquest</h2>
      <p class="text-lg" style="color:var(--text-secondary);">Semua fitur dirancang untuk membuatmu nyaman belajar</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="feature-card text-center sm:text-left">
        <div class="feature-icon mx-auto sm:mx-0"><i class="fas fa-comments"></i></div>
        <h3 class="text-xl font-bold mt-5 mb-2" style="color:var(--text-primary);">Forum Diskusi Anonim</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Bertanya dan berdiskusi tanpa rasa malu. Kamu bisa pakai nama panggilan atau tetap anonim.</p>
      </div>
      <div class="feature-card text-center sm:text-left">
        <div class="feature-icon mx-auto sm:mx-0"><i class="fas fa-user-friends"></i></div>
        <h3 class="text-xl font-bold mt-5 mb-2" style="color:var(--text-primary);">Study Buddy Matching</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Cari teman belajar yang sesuai dengan minat dan mapel yang sama.</p>
      </div>
      <div class="feature-card text-center sm:text-left">
        <div class="feature-icon mx-auto sm:mx-0"><i class="fas fa-chart-line"></i></div>
        <h3 class="text-xl font-bold mt-5 mb-2" style="color:var(--text-primary);">Progress Journal</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Catat perjalanan belajarmu, dapatkan badge dan poin sebagai apresiasi.</p>
      </div>
    </div>
  </div>
</section>

<section class="py-16 lg:py-20 cta-section" style="background:var(--gradient-hero);">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div class="cta-panel text-center">
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-4">Siap Memulai Perjalanan Belajar?</h2>
      <p class="text-lg text-white/80 mb-8 max-w-lg mx-auto">Ribuan siswa lainnya sudah memulai. Giliranmu sekarang!</p>
      <div class="flex flex-wrap justify-center gap-3">
        <button data-action="register" class="btn-edquest text-base" style="background:white; color:#4338CA; font-weight:700;"><i class="fas fa-user-plus"></i> Daftar Gratis</button>
        <a href="#/forum" class="btn-edquest text-base" style="background:rgba(255,255,255,0.12); color:white; border:1.5px solid rgba(255,255,255,0.25);"><i class="fas fa-eye"></i> Lihat Forum</a>
      </div>
    </div>
  </div>
</section>
`; }
