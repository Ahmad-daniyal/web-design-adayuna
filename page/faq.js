function renderFaq() { return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas fa-question-circle"></i> FAQ & Kontak</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">Punya Pertanyaan?</h1>
      <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Jawaban atas pertanyaan yang paling sering diajukan. Atau kirim pesan langsung ke kami.</p>
    </div>
  </div>
</section>

<section class="py-10">
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <h2 class="text-2xl font-extrabold mb-6 text-center text-slate-900 dark:text-slate-100">Pertanyaan Umum</h2>
    <div class="space-y-3" id="faqAccordion">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm text-slate-900 dark:text-slate-100"><i class="fas fa-user-friends mr-2 text-slate-500 dark:text-slate-400"></i>Apa itu Edquest?</span>
          <i class="fas fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Edquest adalah platform belajar digital untuk siswa SMA/SMK. Di sini kamu bisa berdiskusi dengan teman sebaya, mencari teman belajar yang cocok, dan melacak progress belajarmu — semua tanpa rasa malu.</p>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm text-slate-900 dark:text-slate-100"><i class="fas fa-mask mr-2 text-slate-500 dark:text-slate-400"></i>Boleh anonim nggak di forum?</span>
          <i class="fas fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Boleh sekali! Di Edquest, kamu bisa post dengan nama panggilan atau bahkan tetap anonim. Yang penting kamu ikut berpartisipasi dan belajar bareng.</p>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm text-slate-900 dark:text-slate-100"><i class="fas fa-star mr-2 text-slate-500 dark:text-slate-400"></i>Bagaimana sistem poin dan badge-nya?</span>
          <i class="fas fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Poin diperoleh dari aktivitas seperti membuat thread, membalas, dan berkontribusi. Badge diberikan sebagai simbol pencapaian — bukan untuk perlombaan — melainkan untuk mendorongmu terus aktif belajar.</p>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm text-slate-900 dark:text-slate-100"><i class="fas fa-user-friends mr-2 text-slate-500 dark:text-slate-400"></i>Bagaimana cara kerja Study Buddy Matching?</span>
          <i class="fas fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Tinggal pilih mapel dan minat belajarmu di halaman "Cari Teman". Sistem akan mencocokkanmu dengan siswa lain yang punya minat dan mapel yang sama.</p>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm text-slate-900 dark:text-slate-100"><i class="fas fa-book mr-2 text-slate-500 dark:text-slate-400"></i>Apakah ada jurnal belajar?</span>
          <i class="fas fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Ya! Setiap pengguna punya jurnal belajar pribadi di halaman Profil. Catat apa yang udah kamu pelajari setiap hari — ini bisa jadi motivasi buat lihat progress-mu seiring waktu.</p>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">
          <span class="font-semibold text-sm text-slate-900 dark:text-slate-100"><i class="fas fa-shield-alt mr-2 text-slate-500 dark:text-slate-400"></i>Apakah data saya aman?</span>
          <i class="fas fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"></i>
        </button>
        <div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">
          <p class="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Ini versi demo/mockup untuk lomba. Data disimpan sementara di localStorage browser dan tidak dikirim ke server manapun. Tidak ada data pribadi yang dibagikan ke pihak manapun.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-12" style="background:var(--bg-section);">
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <h2 class="text-2xl font-extrabold mb-6 text-center text-slate-900 dark:text-slate-100">Kirim Pesan</h2>
    <form class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl !p-6" onsubmit="App.submitContact(event)">
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

function initFaqAccordion() {
  const container = document.getElementById('faqAccordion');
  if (!container) return;
  container.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      container.querySelectorAll('.faq-toggle').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const icon = b.querySelector('i');
        if (icon) icon.style.transform = '';
        if (b.nextElementSibling) b.nextElementSibling.style.maxHeight = '0';
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        const icon = btn.querySelector('i');
        if (icon) icon.style.transform = 'rotate(180deg)';
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

window.addEventListener('pageChanged', (e) => {
  if (e.detail.pageName === 'faq') setTimeout(() => initFaqAccordion(), 50);
});
