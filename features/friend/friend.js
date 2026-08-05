import { injectStyle } from '../../js/utils/styleLoader.js';

injectStyle('features/friend/css/friend.css');

export function renderFriend() { return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="section-badge"><i class="fas fa-user-friends"></i> Study Buddy Matching</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">Cari Teman Belajar?</h1>
      <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Pilih mapel dan minatmu, kami akan mencocokkanmu dengan teman belajar yang cocok.</p>
    </div>
  </div>
</section>

<section class="py-6">
  <div class="max-w-5xl mx-auto px-4 sm:px-6">
    <div class="card-panel p-5 sm:p-6">
      <h3 class="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100"><i class="fas fa-sliders-h mr-2"></i>Filter Pencarian</h3>
      <div id="matchingPanel" class="space-y-4">
        <div>
          <label class="form-label" for="matchSearch">Cari Teman</label>
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color:var(--text-muted);"></i>
            <input id="matchSearch" type="text" class="form-input !pl-10" placeholder="Cari nama atau ID teman (mis. 482910)...">
          </div>
        </div>
        <div class="grid sm:grid-cols-3 gap-4">
          <div>
            <label class="form-label" for="matchMapel">Mapel Utama</label>
            <select id="matchMapel" class="form-input" style="cursor:pointer;">
              <option value="all">Semua Mapel</option>
              <option value="matematika">Matematika</option>
              <option value="fisika">Fisika</option>
              <option value="kimia">Kimia</option>
              <option value="biologi">Biologi</option>
              <option value="sejarah">Sejarah</option>
              <option value="bahasa">Bahasa Indonesia</option>
              <option value="ips">IPS</option>
              <option value="umum">Umum</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="matchMinat">Minat / Gaya Belajar</label>
            <select id="matchMinat" class="form-input" style="cursor:pointer;">
              <option value="all">Semua</option>
              <option value="diskusi">Suka diskusi</option>
              <option value="materi">Suka materi lengkap</option>
              <option value="soal">Suka tryout & soal</option>
              <option value="kreatif">Suka cara kreatif</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="matchKelas">Kelas</label>
            <select id="matchKelas" class="form-input" style="cursor:pointer;">
              <option value="all">Semua</option>
              <option value="10">Kelas 10</option>
              <option value="11">Kelas 11</option>
              <option value="12">Kelas 12</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs" style="color:var(--text-muted);"><i class="fas fa-mouse-pointer mr-1"></i>Klik opsi untuk langsung memfilter</span>
          <button id="resetFilter" type="button" class="btn-ghost text-sm !py-1.5 !px-3"><i class="fas fa-rotate-left mr-1"></i> Reset</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-6 pb-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Teman Belajar yang Cocok</h2>
      <span class="text-sm text-slate-400 dark:text-slate-500" id="resultCount">8 teman ditemukan</span>
    </div>
    <div id="buddyResults" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    <div id="emptyState" class="hidden text-center py-16">
      <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl" style="background:var(--accent-light);color:var(--accent);"><i class="fas fa-search"></i></div>
      <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">Tidak ada hasil</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400">Coba ubah filter pencarianmu ya.</p>
    </div>
  </div>
</section>
`; }
