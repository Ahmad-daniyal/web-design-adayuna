function renderNilai() {
  const grades = [
    { code: 'ALG-2101', title: 'Algoritma & Struktur Data', score: 'A', sks: 3 },
    { code: 'STA-2203', title: 'Statistika Dasar', score: 'B+', sks: 3 },
    { code: 'BDA-3102', title: 'Basis Data Lanjut', score: 'A-', sks: 3 },
    { code: 'BIG-1104', title: 'Bahasa Inggris Akademik', score: 'B', sks: 2 }
  ];
  const ipk = ((4 + 3.5 + 3.7 + 3) / 4).toFixed(2);

  return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-chart-simple"></i> Nilai</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">Rekap Nilai</h1>
      <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Rekap capaian akademik semester ini.</p>
    </div>
  </div>
</section>

<section class="py-10">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div class="stat-card !rounded-lg mb-6" style="max-width:240px;">
      <div class="stat-icon"><i class="fas fa-medal"></i></div>
      <div>
        <p class="stat-number">${ipk}</p>
        <p class="stat-label">IPK Sementara</p>
      </div>
    </div>
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      ${grades.map(g => `
      <div class="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <div>
          <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">${g.title}</p>
          <p class="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">${g.code} · ${g.sks} SKS</p>
        </div>
        <span class="text-sm font-bold text-slate-900 dark:text-slate-100">${g.score}</span>
      </div>`).join('')}
    </div>
  </div>
</section>
`; }
