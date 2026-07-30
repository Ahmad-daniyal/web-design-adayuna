/**
 * HomePage Component (js/pages/HomePage.js)
 */
import { Utils } from '../utils.js';

export const HomePage = {
  render: () => `
    <section class="hero" style="padding: 6rem 0 4rem; text-align: center;">
      <div class="container" style="max-width: 800px;">
        <span class="badge" style="display:inline-block; padding: 0.35rem 1rem; background: var(--bg-subtle); border-radius: var(--radius-full); font-size: 0.85rem; font-weight:600; color: var(--primary); margin-bottom: 1.5rem; border:1px solid var(--border-color);">
          ✨ Platform Belajar Generasi Baru (SPA)
        </span>

        <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 3rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.5rem;">
          <span id="typingText" style="color: var(--primary);">Solusi Belajar...</span><br>
          Yang Menyenangkan & Gamifikasi
        </h1>

        <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 2.5rem; line-height: 1.7;">
          Tingkatkan pemahaman materi, hafalan cepat dengan kartu 3D, serta produktivitas waktu belajar melalui rute petualangan gamifikasi terstruktur.
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap;">
          <a href="#login" class="btn btn-primary btn-lg">
            <span>Mulai Petualangan</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="#fitur" class="btn btn-outline btn-lg">Jelajahi Fitur</a>
        </div>
      </div>
    </section>

    <section id="fitur" style="padding: 4rem 0 6rem; border-top: 1px solid var(--border-color);">
      <div class="container">
        <div style="text-align: center; max-width: 600px; margin: 0 auto 4rem;" class="reveal">
          <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem;">Ekosistem Belajar Lengkap</h2>
          <p style="color: var(--text-muted);">Setiap modul dirancang interaktif tanpa reload untuk memaksimalkan fokus Anda.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div class="card reveal">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--primary-light); color: var(--primary); display:flex; align-items:center; justify-content:center; margin-bottom: 1.25rem; font-size: 1.25rem;">📖</div>
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">Smart Reader</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem;">Fitur membaca materi dengan Progress Bar dan pengatur ukuran huruf inklusif.</p>
          </div>

          <div class="card reveal">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--accent-green-light); color: var(--accent-green); display:flex; align-items:center; justify-content:center; margin-bottom: 1.25rem; font-size: 1.25rem;">🃏</div>
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">Flashcard 3D</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem;">Mini game hafalan dengan kartu berputar 3D interaktif dan tumpukan soal otomatis.</p>
          </div>

          <div class="card reveal">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #fef3c7; color: #d97706; display:flex; align-items:center; justify-content:center; margin-bottom: 1.25rem; font-size: 1.25rem;">⏱️</div>
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">Pomodoro & Zen</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem;">Timer SVG lingkaran 25 menit dengan efek suara dan Zen Mode fokus total.</p>
          </div>

          <div class="card reveal">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #fce7f3; color: #db2777; display:flex; align-items:center; justify-content:center; margin-bottom: 1.25rem; font-size: 1.25rem;">🎯</div>
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">Kuis & Sertifikat</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem;">Evaluasi cepat tanpa reload halaman, umpan balik warna instan, dan perolehan medali.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  attachEvents: () => {
    const typingEl = document.getElementById('typingText');
    const cleanupTyping = Utils.initTypingEffect(typingEl, [
      "Solusi Belajar...",
      "Solusi Fokus...",
      "Solusi Prestasi...",
      "Solusi Gamifikasi..."
    ]);
    Utils.initScrollReveal();

    return cleanupTyping;
  }
};
