function renderKursus() {
  const courses = [
    { code: 'ALG-2101', title: 'Algoritma & Struktur Data', pct: 78, due: '12 Agu', modul: 'Modul 7/12' },
    { code: 'STA-2203', title: 'Statistika Dasar', pct: 45, due: '19 Agu', modul: 'Modul 3/10' },
    { code: 'BDA-3102', title: 'Basis Data Lanjut', pct: 92, due: '05 Agu', modul: 'Modul 11/12' },
    { code: 'BIG-1104', title: 'Bahasa Inggris Akademik', pct: 30, due: '26 Agu', modul: 'Modul 2/8' }
  ];

  return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-book-open"></i> Kursus Saya</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">Semua Kursus Aktif</h1>
      <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Semua kursus yang sedang kamu ikuti dalam satu tempat.</p>
    </div>
  </div>
</section>

<section class="py-10">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div class="grid sm:grid-cols-2 gap-4">
      ${courses.map(c => `
      <div class="card-mahasiswa">
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
      </div>`).join('')}
    </div>
  </div>
</section>
`; }
