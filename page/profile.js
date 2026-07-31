function renderProfile() { return `
<section class="py-8 pb-16" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1">
        <div class="glass-card !p-6 text-center mb-6">
          <div class="user-avatar w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold text-white mx-auto mb-3" style="background:var(--gradient-primary);">D</div>
          <h2 class="text-xl font-bold" style="color:var(--text-primary);">Dani</h2>
          <p class="text-sm mt-1" style="color:var(--text-muted);">Siswa &middot; <span class="text-sm font-medium" style="color:var(--primary);">Mode Panggilan</span></p>
          <div class="flex items-center justify-center gap-4 mt-4">
            <div class="text-center"><div class="text-2xl font-extrabold" style="color:var(--primary);">120</div><div class="text-xs" style="color:var(--text-muted);">Poin</div></div>
            <div class="w-px h-10" style="background:var(--border-color);"></div>
            <div class="text-center"><div class="text-2xl font-extrabold" style="color:var(--accent);">3</div><div class="text-xs" style="color:var(--text-muted);">Badge</div></div>
            <div class="w-px h-10" style="background:var(--border-color);"></div>
            <div class="text-center"><div class="text-2xl font-extrabold" style="color:var(--text-primary);">12</div><div class="text-xs" style="color:var(--text-muted);">Kontribusi</div></div>
          </div>
        </div>
        <div class="glass-card !p-6 mb-6">
          <h4 class="font-bold text-sm mb-4" style="color:var(--text-primary);"><i class="fas fa-award mr-2" style="color:var(--accent);"></i>Badge</h4>
          <div class="flex flex-wrap gap-3">
            <div class="badge-item earned" title="Pertama Kali Bertanya"><i class="fas fa-question" style="color:var(--primary);"></i></div>
            <div class="badge-item earned" title="5 Kontribusi"><i class="fas fa-star" style="color:var(--accent);"></i></div>
            <div class="badge-item earned" title="Bantu Teman"><i class="fas fa-hands-helping" style="color:#10b981;"></i></div>
            <div class="badge-item" title="Belum diraih"><i class="fas fa-lock" style="color:var(--text-muted);"></i></div>
            <div class="badge-item" title="Belum diraih"><i class="fas fa-lock" style="color:var(--text-muted);"></i></div>
            <div class="badge-item" title="Belum diraih"><i class="fas fa-lock" style="color:var(--text-muted);"></i></div>
          </div>
          <p class="text-xs mt-3" style="color:var(--text-muted);">3 dari 6 badge diraih</p>
        </div>
        <div class="glass-card !p-4">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm font-medium" style="color:var(--text-primary);"><i class="fas fa-eye-slash mr-2" style="color:var(--text-muted);"></i>Mode Anonim</span>
            <div class="relative">
              <input type="checkbox" id="anonToggle" class="sr-only peer" checked>
              <div class="w-10 h-5 rounded-full bg-gray-300 peer-checked:bg-green-500 transition-colors"></div>
              <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
            </div>
          </label>
          <p class="text-xs mt-2" style="color:var(--text-muted);">Posting tanpa nama asli. Tetap bisa dapat poin & badge.</p>
        </div>
      </div>
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold" style="color:var(--text-primary);"><i class="fas fa-book-open mr-2" style="color:var(--primary);"></i>Jurnal Belajar</h2>
          <button id="addJournalBtn" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4"><i class="fas fa-plus"></i> Catat Hari Ini</button>
        </div>
        <div id="journalForm" class="glass-card !p-5 mb-6" style="display:none;">
          <h4 class="font-bold mb-3" style="color:var(--text-primary);">Apa yang sudah kamu pelajari?</h4>
          <form id="journalEntryForm">
            <div class="mb-3">
              <label for="journalMapel" class="form-label">Mapel (opsional)</label>
              <select id="journalMapel" class="form-input" style="cursor:pointer;">
                <option value="umum">Umum</option>
                <option value="matematika">Matematika</option>
                <option value="fisika">Fisika</option>
                <option value="kimia">Kimia</option>
                <option value="biologi">Biologi</option>
                <option value="sejarah">Sejarah</option>
                <option value="bahasa">Bahasa Indonesia</option>
                <option value="ips">IPS</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="journalText" class="form-label">Catatan Progress</label>
              <textarea id="journalText" rows="3" class="form-input resize-none" placeholder="Contoh: Hari ini aku belajar tentang turunan fungsi..." required></textarea>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs" style="color:var(--text-muted);">Setiap catatan = +5 poin</span>
              <div class="flex gap-2">
                <button type="button" id="cancelJournalBtn" class="btn-ghost text-sm !py-1 !px-3">Batal</button>
                <button type="submit" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4">Simpan</button>
              </div>
            </div>
          </form>
        </div>
        <div id="journalEntries" class="space-y-4">
          <div class="progress-card">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold px-2 py-1 rounded-full" style="background:var(--primary-light);color:var(--primary);">Matematika</span>
              <span class="text-xs" style="color:var(--text-muted);">Hari ini</span>
            </div>
            <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Belajar tentang turunan fungsi trigonometri. Aku mulai ngerti konsep d/dx (sin x) = cos x.</p>
            <div class="flex items-center gap-2 mt-2 text-xs" style="color:var(--primary);"><i class="fas fa-circle-check"></i> +5 poin</div>
          </div>
          <div class="progress-card">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold px-2 py-1 rounded-full" style="background:#fce7f3;color:#be185d;">Fisika</span>
              <span class="text-xs" style="color:var(--text-muted);">Kemarin</span>
            </div>
            <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Mencoba soal Hukum Newton nomor 5. Aku masih kadung keliru antara gaya gesek dan gaya normal.</p>
            <div class="flex items-center gap-2 mt-2 text-xs" style="color:var(--primary);"><i class="fas fa-circle-check"></i> +5 poin</div>
          </div>
          <div class="progress-card">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold px-2 py-1 rounded-full" style="background:#dcfce7;color:#15803d;">Biologi</span>
              <span class="text-xs" style="color:var(--text-muted);">2 hari lalu</span>
            </div>
            <p class="text-sm leading-relaxed" style="color:var(--text-secondary);">Ikut bantu teman tentang sel mitosis. Aku jadi lebih paham juga sama materinya karena ngajarin.</p>
            <div class="flex items-center gap-2 mt-2 text-xs" style="color:var(--primary);"><i class="fas fa-circle-check"></i> +5 poin</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`; }