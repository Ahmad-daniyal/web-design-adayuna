/**
 * DashboardPage Component (js/pages/DashboardPage.js)
 */
import { Store } from '../store.js';

export const DashboardPage = {
  render: () => {
    const user = Store.getUser();
    const name = user ? user.name : 'Pelajar';
    const flashcardScore = Store.getFlashcardScore();
    const quizScore = Store.getQuizScore();
    const isRead = Store.isMateriRead();

    return `
      <section style="padding: 2.5rem 0;">
        <div class="container">
          
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;" class="reveal">
            <div>
              <span style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em;">Pusat Kendali Belajar</span>
              <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.8rem; font-weight: 700; margin: 0.3rem 0 0.5rem;">
                Selamat Datang Kembali, ${name}!
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem;">Lanjutkan petualangan belajar Anda untuk membuka level Kuis dan medali kelulusan.</p>
            </div>

            <div style="display: flex; gap: 1rem;">
              <div style="text-align: center; padding: 0.85rem 1.25rem; background: var(--bg-subtle); border-radius: var(--radius-md); border:1px solid var(--border-color);">
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--primary);">${flashcardScore}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Hafalan Inget</div>
              </div>

              <div style="text-align: center; padding: 0.85rem 1.25rem; background: var(--bg-subtle); border-radius: var(--radius-md); border:1px solid var(--border-color);">
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--accent-green);">${quizScore !== null ? quizScore + '/100' : '-'}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Skor Kuis</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 3.5rem;">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Medali & Prestasi Anda</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2rem;">${isRead ? '✅' : '📖'}</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700;">Pembaca Cerdas</h4>
                  <span style="font-size: 0.8rem; color: ${isRead ? 'var(--accent-green)' : 'var(--text-muted)'};">${isRead ? 'Selesai Dibaca' : 'Belum Dibaca'}</span>
                </div>
              </div>

              <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2rem;">${quizScore !== null ? '🏆' : '🏅'}</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700;">Juara Kuis</h4>
                  <span style="font-size: 0.8rem; color: ${quizScore !== null ? 'var(--accent-green)' : 'var(--text-muted)'};">${quizScore !== null ? 'Lulus (' + quizScore + ' Poin)' : 'Belum Selesai'}</span>
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; font-weight: 700;">Peta Petualangan Belajar</h2>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Selesaikan setiap tahap secara berurutan untuk membuka level Kuis!</p>
          </div>

          <div class="map-container">
            <div class="map-step">
              <a href="#materi" class="map-node unlocked active-node">📖</a>
              <div class="map-info">
                <h4>Tahap 1: Ruang Baca Cerdas</h4>
                <p>Pelajari materi utama & pengatur ukuran font. (Wajib untuk membuka level Kuis)</p>
              </div>
            </div>

            <div class="map-step">
              <a href="#flashcard" class="map-node unlocked">🃏</a>
              <div class="map-info">
                <h4>Tahap 2: Kartu Hafalan 3D</h4>
                <p>Latih daya ingat dengan kartu berputar 3D interaktif.</p>
              </div>
            </div>

            <div class="map-step">
              <a href="#pomodoro" class="map-node unlocked">⏱️</a>
              <div class="map-info">
                <h4>Tahap 3: Timer Pomodoro & Zen</h4>
                <p>Atur fokus belajar 25 menit dengan suara ping & Zen mode.</p>
              </div>
            </div>

            <div class="map-step">
              <div class="map-node ${isRead ? 'unlocked' : 'locked'}" id="quizMapNode">
                ${isRead ? '🎯' : '🔒'}
              </div>
              <div class="map-info">
                <h4>Tahap 4: Kuis Akhir Interaktif</h4>
                <p>${isRead ? '✨ **Terbuka!** Klik untuk memulai kuis evaluasi akhir.' : '🔒 Terkunci. Silakan selesaikan membaca materi di Tahap 1 terlebih dahulu.'}</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    `;
  },
  attachEvents: (navigateTo) => {
    const isRead = Store.isMateriRead();
    const quizNode = document.getElementById('quizMapNode');

    if (quizNode) {
      quizNode.addEventListener('click', () => {
        if (isRead) {
          navigateTo('#kuis');
        } else {
          alert('🔒 Level Kuis masih terkunci! Silakan ke Tahap 1 (Ruang Baca Cerdas) dan tekan "Tandai Selesai Dibaca" terlebih dahulu.');
        }
      });
    }
  }
};
