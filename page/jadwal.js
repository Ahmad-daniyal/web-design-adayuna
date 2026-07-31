function renderJadwal() {
  const days = [
    { day: 'Senin', items: ['Algoritma & Struktur Data — 08.00–09.40', 'Basis Data Lanjut — 10.00–11.40'] },
    { day: 'Selasa', items: ['Statistika Dasar — 13.00–14.40'] },
    { day: 'Rabu', items: ['Bahasa Inggris Akademik — 08.00–09.40', 'Diskusi Forum — 15.00–16.00'] },
    { day: 'Kamis', items: ['Algoritma & Struktur Data — 08.00–09.40'] },
    { day: 'Jumat', items: ['Statistika Dasar — 13.00–14.40'] },
    { day: 'Sabtu', items: ['Belajar Mandiri — 09.00–11.00'] },
    { day: 'Minggu', items: ['Istirahat'] }
  ];

  return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-calendar-days"></i> Jadwal</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">Rencana Belajarmu</h1>
      <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Rencana belajarmu pekan ini.</p>
    </div>
  </div>
</section>

<section class="py-10">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
    ${days.map(d => `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">${d.day}</h3>
      <div class="flex flex-col gap-1.5">
        ${d.items.map(t => `<p class="text-sm text-slate-800 dark:text-slate-200"><i class="far fa-clock mr-2 text-slate-400"></i>${t}</p>`).join('')}
      </div>
    </div>`).join('')}
  </div>
</section>
`; }
