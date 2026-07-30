/**
 * MateriPage Component (js/pages/MateriPage.js)
 */
import { Store } from '../store.js';
import { Utils } from '../utils.js';

export const MateriPage = {
  render: () => {
    const isRead = Store.isMateriRead();

    return `
      <div class="reading-progress-container">
        <div class="reading-progress-bar" id="readingProgressBar"></div>
      </div>

      <section style="padding: 2.5rem 0;">
        <div class="container" style="max-width: 800px;">

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--primary);">Modul 1: Dasar Pembelajaran</span>
              <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2.2rem; font-weight: 800; margin-top: 0.2rem;">
                Teknik Belajar Efektif & Gamifikasi
              </h1>
            </div>

            <div style="display: flex; align-items: center; gap: 0.4rem; background: var(--bg-surface); padding: 0.4rem 0.8rem; border-radius: var(--radius-full); border: 1px solid var(--border-color);">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-right: 0.3rem;">Ukuran Teks:</span>
              <button id="btnFontDec" class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.85rem;" title="Kecilkan Huruf">A-</button>
              <button id="btnFontReset" class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.85rem;" title="Reset Huruf">A</button>
              <button id="btnFontInc" class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.85rem;" title="Besarkan Huruf">A+</button>
            </div>
          </div>

          <div class="article-content" style="font-size: var(--article-font-size); line-height: 1.8; color: var(--text-main);">
            <p style="margin-bottom: 1.5rem; font-size: 1.1rem; color: var(--text-muted);">
              Selamat datang di ruang baca cerdas. Halaman ini menggunakan Progress Bar di bagian paling atas browser untuk menunjukkan persentase bacaan Anda. Silakan pelajari 3 konsep utama di bawah ini:
            </p>

            <div class="accordion-item open">
              <div class="accordion-header">
                <span>1. Pengenalan Spaced Repetition</span>
                <span class="accordion-icon">▼</span>
              </div>
              <div class="accordion-content">
                <p>Spaced Repetition adalah teknik belajar yang dilakukan dengan mengulang materi di selang waktu tertentu yang terukur. Teknik ini memanfaatkan kurva lupa (forgetting curve) manusia agar informasi jangka pendek diubah menjadi ingatan jangka panjang.</p>
                <p style="margin-top: 0.75rem;">Metode ini diterapkan secara sempurna melalui modul Flashcard 3D pada platform Adayuna.</p>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-header">
                <span>2. Teknik Pomodoro 25 Menit</span>
                <span class="accordion-icon">▼</span>
              </div>
              <div class="accordion-content">
                <p>Teknik Pomodoro dikembangkan oleh Francesco Cirillo pada akhir 1980-an. Anda bekerja atau belajar fokus tanpa gangguan selama 25 menit, diikuti dengan istirahat singkat 5 menit.</p>
                <p style="margin-top: 0.75rem;">Interval fokus singkat ini mencegah kelelahan otak dan menjaga kesegaran pikiran sepanjang hari.</p>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-header">
                <span>3. Konsep Gamifikasi dalam Pendidikan</span>
                <span class="accordion-icon">▼</span>
              </div>
              <div class="accordion-content">
                <p>Gamifikasi menggunakan elemen permainan seperti poin, lencana medali, level teruji, serta peta progres Candy Crush untuk mendorong motivasi belajar internal.</p>
                <p style="margin-top: 0.75rem;">Dengan menyelesaikan modul ini dan menekan tombol di bawah, Anda secara resmi akan **membuka level Kuis** di Dashboard!</p>
              </div>
            </div>
          </div>

          <div style="margin-top: 3rem; padding: 2rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); text-align: center;">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Apakah Anda sudah paham materi ini?</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Tekan tombol di bawah untuk menyimpan status baca Anda dan membuka akses Kuis di Dashboard.</p>
            
            <button id="btnCompleteMateri" class="btn ${isRead ? 'btn-outline' : 'btn-accent'} btn-lg">
              <span>${isRead ? 'Sudah Dibaca ✅' : 'Tandai Selesai Dibaca ✨'}</span>
            </button>

            <p id="completionMessage" style="color: var(--accent-green); font-size: 0.9rem; font-weight: 600; margin-top: 1rem;" class="${isRead ? '' : 'hidden'}">
              🎉 Selamat! Materi berhasil disimpan. Level Kuis di Dashboard kini telah TERBUKA!
            </p>
          </div>

        </div>
      </section>
    `;
  },
  attachEvents: () => {
    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('readingProgressBar');
    const scrollHandler = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = (currentScroll / totalHeight) * 100;
      if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    };
    window.addEventListener('scroll', scrollHandler);

    // 2. Accessibility Font Adjuster
    let currentFontSize = 1.05;
    const btnInc = document.getElementById('btnFontInc');
    const btnDec = document.getElementById('btnFontDec');
    const btnReset = document.getElementById('btnFontReset');

    if (btnInc) btnInc.addEventListener('click', () => {
      if (currentFontSize < 1.45) {
        currentFontSize += 0.1;
        document.documentElement.style.setProperty('--article-font-size', `${currentFontSize}rem`);
      }
    });

    if (btnDec) btnDec.addEventListener('click', () => {
      if (currentFontSize > 0.85) {
        currentFontSize -= 0.1;
        document.documentElement.style.setProperty('--article-font-size', `${currentFontSize}rem`);
      }
    });

    if (btnReset) btnReset.addEventListener('click', () => {
      currentFontSize = 1.05;
      document.documentElement.style.setProperty('--article-font-size', '1.05rem');
    });

    // 3. Accordions
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('open');
      });
    });

    // 4. Completion Button
    const btnComplete = document.getElementById('btnCompleteMateri');
    const completionMessage = document.getElementById('completionMessage');

    if (btnComplete) {
      btnComplete.addEventListener('click', () => {
        Store.setMateriRead(true);
        Utils.playPingSound();
        completionMessage.classList.remove('hidden');
        btnComplete.innerHTML = '<span>Sudah Dibaca ✅</span>';
        btnComplete.className = 'btn btn-outline btn-lg';
      });
    }

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }
};
