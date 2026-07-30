/* ===== Edquest — Forum Interactions ===== */

const Forum = (() => {

  const categoryMeta = {
    matematika: { title: 'Matematika', icon: 'fa-calculator', color: '#0369a1' },
    fisika: { title: 'Fisika', icon: 'fa-atom', color: '#be185d' },
    kimia: { title: 'Kimia', icon: 'fa-flask', color: '#1d4ed8' },
    biologi: { title: 'Biologi', icon: 'fa-dna', color: '#15803d' },
    sejarah: { title: 'Sejarah', icon: 'fa-landmark', color: '#b45309' },
    bahasa: { title: 'Bahasa Indonesia', icon: 'fa-language', color: '#7c3aed' },
    ips: { title: 'IPS', icon: 'fa-globe', color: '#c2410c' }
  };

  const categoryThreads = {
    matematika: [
      { title:'Turunan fungsi trigonometri', subtitle:'Aku masih bingung rumus turunan sin, cos, tan...', author:'MathExplorer', replies:5, votes:12, time:'2 jam lalu' },
      { title:'Cara cepat tentukan turunan fungsi aljabar', subtitle:'Mau share tips cepat buat turunan aljabar kelas 10.', author:'KakakKelas', replies:8, votes:25, time:'5 jam lalu' },
      { title:'Integral substitusi gimana ya?', subtitle:'Belajar integral substitusi di kelas 11, masih error terus.', author:'IntegralMin', replies:3, votes:7, time:'1 hari lalu' },
      { title:'Soal limit yang sering keluar UN', subtitle:'Kumpulin soal limit paling sering di UN.', author:'LimitKing', replies:12, votes:34, time:'3 hari lalu' }
    ],
    fisika: [
      { title:'Hukum Newton mana yang sering di UN?', subtitle:'Mau panduan persiapan UN dari hukum Newton.', author:'FisikawanMuda', replies:3, votes:7, time:'1 hari lalu' },
      { title:'Konsep gerak parabolic', subtitle:'Masih bingung kapan benda itu parabola dan kapan nggak.', author:'RoboStudent', replies:6, votes:15, time:'2 hari lalu' },
      { title:'Rumus listrik sederhana', subtitle:'Butuh bantuan tentang rangkaian listrik sederhana.', author:'CircuitGirl', replies:4, votes:10, time:'2 minggu lalu' }
    ],
    kimia: [
      { title:'Reaksi redoks: cara cepat tentukan teroksidasi', subtitle:'Trik nentuin zat teroksidasi dan tereduksi biar gampang diingat.', author:'KimiaFun', replies:4, votes:9, time:'3 hari lalu' },
      { title:'Larutan penyangga itu apa?', subtitle:'Belum ngerti konsep buffer solution di kelas 11.', author:'ChemTuber', replies:5, votes:8, time:'4 hari lalu' },
      { title:'Tabel periodik: cara hafalkan', subtitle:'Mau cara cepat menghafalkan tabel periodik.', author:'PeriodicBoss', replies:9, votes:22, time:'1 minggu lalu' }
    ],
    biologi: [
      { title:'Saya salah paham tentang mitosis dan meiosis', subtitle:'Akhirnya ngerti perbedaannya! Mau share rangkuman.', author:'BioNerd', replies:11, votes:30, time:'4 hari lalu' },
      { title:'Ekosistem Indonesia yang terancam', subtitle:'Buat tugas tentang ekosistem Indonesia yang rusak.', author:'GreenGuard', replies:6, votes:14, time:'1 minggu lalu' },
      { title:'DNA replication itu proses apa?', subtitle:'Penjelasan sederhana soal replikasi DNA dalam sel.', author:'GeneDive', replies:3, votes:6, time:'2 minggu lalu' }
    ],
    sejarah: [
      { title:'Pemanfaatan teknologi di era kemerdekaan', subtitle:'Teknologi apa aja yang dipakai waktu era kemerdekaan?', author:'SejarawanCilik', replies:2, votes:5, time:'5 hari lalu' },
      { title:'Perang Kemerdekaan: kronologi lengkap', subtitle:'Butuh bantuan menyusun kronologi perang kemerdekaan.', author:'SejarawanMuda', replies:7, votes:18, time:'2 minggu lalu' }
    ],
    bahasa: [
      { title:'Cara menulis teks eksplanasi biar dapet nilai A', subtitle:'Sering dapat nilai kurang di teks eksplanasi. Bagi tips!', author:'KataJuara', replies:7, votes:18, time:'1 minggu lalu' },
      { title:'Teks laporan hasil observasi: tips penulisan', subtitle:'Butuh contoh teks laporan observasi yang bagus.', author:'TulisBagus', replies:4, votes:11, time:'2 minggu lalu' }
    ],
    ips: [
      { title:'Perubahan iklim dan dampaknya bagi Indonesia', subtitle:'Diskusi soal perubahan iklim dan dampaknya untuk Indonesia.', author:'GeoMind', replies:5, votes:13, time:'1 minggu lalu' },
      { title:'Geografi Indonesia: keunggulan dan tantangan', subtitle:'Daftar keunggulan dan tantangan Indonesia berdasarkan geografinya.', author:'GeoExplorer', replies:3, votes:8, time:'2 minggu lalu' }
    ]
  };

  function init() {
    bindFilterEvents();
    initCategoryModal();
  }

  function bindFilterEvents() {
    const filterContainer = document.getElementById('categoryFilter');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;

      filterContainer.querySelectorAll('.cat-btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--text-secondary)';
        b.style.borderColor = 'var(--border-color)';
        b.classList.remove('active');
      });

      btn.style.background = 'var(--primary)';
      btn.style.color = 'white';
      btn.style.borderColor = 'var(--primary)';
      btn.classList.add('active');

      filterThreads(btn.dataset.category);
    });
  }

  function filterThreads(category) {
    const cards = document.querySelectorAll('#threadList .thread-card');
    let count = 0;
    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
        count++;
      } else {
        card.style.display = 'none';
      }
    });
    const counter = document.getElementById('threadCount');
    if (counter) counter.textContent = `${count} thread ditemukan`;
  }

  function initCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (!modal) return;

    document.querySelectorAll('.category-tag').forEach(tag => {
      tag.style.cursor = 'pointer';
      tag.addEventListener('click', () => {
        const cat = tag.closest('[data-category]');
        const categoryName = cat ? cat.dataset.category : tag.textContent.trim().split(' ').pop().toLowerCase();
        openCategoryModal(categoryName);
      });
    });
  }

  function openCategoryModal(category) {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    const body = document.getElementById('categoryModalBody');
    if (!modal || !title || !body) return;

    const meta = categoryMeta[category];
    const threads = categoryThreads[category] || [];

    title.innerHTML = meta ? `<i class="fas ${meta.icon} mr-2"></i>${meta.title} — Sub Thread` : category;
    body.innerHTML = threads.length === 0
      ? '<p class="text-sm" style="color:var(--text-muted);">Belum ada sub-thread untuk kategori ini.</p>'
      : threads.map((t, i) => `
        <div class="thread-item p-3 rounded-lg mb-2 cursor-pointer" style="background:var(--bg-body);border:1px solid var(--border-color);" onclick="Auth.showToast('Membuka thread: ${t.title.replace(/'/g, "\\'")}', 'info')">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-sm mb-1" style="color:var(--text-primary);">${t.title}</h4>
              <p class="text-xs truncate" style="color:var(--text-secondary);">${t.subtitle}</p>
              <div class="flex items-center gap-3 mt-1 text-xs" style="color:var(--text-muted);">
                <span><i class="fas fa-user mr-1"></i>${t.author}</span>
                <span><i class="fas fa-comment mr-1"></i>${t.replies}</span>
                <span><i class="fas fa-arrow-up mr-1"></i>${t.votes}</span>
              </div>
            </div>
            <span class="text-xs whitespace-nowrap" style="color:var(--text-muted);">${t.time}</span>
          </div>
        </div>
      `).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  return { init, openCategoryModal };
})();

document.addEventListener('DOMContentLoaded', () => Forum.init());