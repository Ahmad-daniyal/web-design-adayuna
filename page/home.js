function renderHome() {
  let name = 'Pelajar';
  try {
    const u = JSON.parse(localStorage.getItem('edquest_user'));
    if (u && u.name) name = u.name;
  } catch (e) {}

  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  const sdCourses = [
    { icon: 'fa-abc', title: 'Mengenal Huruf & Angka', desc: 'Belajar abjad dan berhitung lewat lagu dan permainan seru.', lessons: '12 pelajaran', level: 'Pemula' },
    { icon: 'fa-book-open-reader', title: 'Membaca Cerita Bergambar', desc: 'Asah kemampuan membaca dengan dongeng penuh ilustrasi.', lessons: '18 pelajaran', level: 'Menarik' },
    { icon: 'fa-calculator', title: 'Berhitung Asyik', desc: 'Penjumlahan dan pengurangan dengan cara yang tidak membosankan.', lessons: '15 pelajaran', level: 'Mudah' },
    { icon: 'fa-flask', title: 'Sains Ceria', desc: 'Eksperimen kecil sederhana untuk rasa ingin tahu si kecil.', lessons: '10 pelajaran', level: 'Seru' }
  ];

  const ptCourses = [
    { code: 'ALG-2101', title: 'Algoritma & Struktur Data', pct: 78, due: '12 Agu', modul: 'Modul 7/12' },
    { code: 'STA-2203', title: 'Statistika Dasar', pct: 45, due: '19 Agu', modul: 'Modul 3/10' },
    { code: 'BDA-3102', title: 'Basis Data Lanjut', pct: 92, due: '05 Agu', modul: 'Modul 11/12' },
    { code: 'BIG-1104', title: 'Bahasa Inggris Akademik', pct: 30, due: '26 Agu', modul: 'Modul 2/8' }
  ];

  return `
<section class="pt-16 md:pt-20 pb-6">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <p class="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">${today}</p>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">${greeting}, ${name}!</h1>
        <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Kamu sudah belajar 2 hari berturut-turut. Pertahankan!</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <a href="#/kursus" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4"><i class="fas fa-play"></i> Lanjut Belajar</a>
        <a href="#/jadwal" class="btn-edquest btn-outline-glow text-sm !py-2 !px-4"><i class="fas fa-calendar-days"></i> Cek Jadwal</a>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-book-open"></i></div>
        <div>
          <p class="stat-number">6</p>
          <p class="stat-label">Kursus Aktif</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-gauge-high"></i></div>
        <div>
          <p class="stat-number">72%</p>
          <p class="stat-label">Progres Rata-rata</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-hourglass-half"></i></div>
        <div>
          <p class="stat-number">2</p>
          <p class="stat-label">Tenggat Pekan Ini</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-bolt"></i></div>
        <div>
          <p class="stat-number">5</p>
          <p class="stat-label">Streak Belajar</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-8">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="flex items-end justify-between mb-5">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Belajar Bareng Si Kecil</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Kurikulum ramah anak untuk jenjang SD & PAUD.</p>
      </div>
      <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
        <i class="fas fa-mobile-screen"></i> Variasi A
      </span>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${sdCourses.map(c => `
      <a href="#/kursus" class="card-sd">
        <div class="card-sd-art"><i class="fas ${c.icon}"></i></div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="card-sd-meta">
          <span><i class="far fa-clock"></i> ${c.lessons}</span>
          <span><i class="far fa-smile"></i> ${c.level}</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="py-8">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="flex items-end justify-between mb-5">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Kursus Perguruan Tinggi</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Padat data dengan progres dan tenggat yang jelas.</p>
      </div>
      <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
        <i class="fas fa-laptop"></i> Variasi B
      </span>
    </div>
    <div class="grid sm:grid-cols-2 gap-4">
      ${ptCourses.map(c => `
      <a href="#/kursus" class="card-mahasiswa">
        <div class="flex items-start justify-between mb-3">
          <span class="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">${c.code}</span>
          <span class="text-sm font-bold text-slate-900 dark:text-slate-100">${c.pct}%</span>
        </div>
        <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">${c.title}</h3>
        <div class="progress-track">
          <div class="progress-fill" style="width:${c.pct}%"></div>
        </div>
        <div class="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span><i class="far fa-calendar"></i> Tenggat ${c.due}</span>
          <span><i class="fas fa-layer-group"></i> ${c.modul}</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>
`; }
