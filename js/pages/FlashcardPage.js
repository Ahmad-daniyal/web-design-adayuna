/**
 * FlashcardPage Component (js/pages/FlashcardPage.js)
 */
import { Store } from '../store.js';
import { Utils } from '../utils.js';

export const FlashcardPage = {
  cards: [
    { q: "Apa kepanjangan dari singkatan HTML?", a: "HyperText Markup Language" },
    { q: "Apa tujuan utama teknik Spaced Repetition?", a: "Meningkatkan ingatan jangka panjang melalui pengulangan selang waktu." },
    { q: "Berapa durasi waktu standar sesi fokus Pomodoro?", a: "25 Menit Belajar Fokus, 5 Menit Istirahat." },
    { q: "Apa keuntungan utama penggunaan Vanilla JS tanpa framework?", a: "Pemuatan instan, sangat ringan, dan bebas dependensi eksternal." }
  ],

  render: () => {
    const score = Store.getFlashcardScore();
    return `
      <section style="padding: 2.5rem 0;">
        <div class="container" style="max-width: 600px; text-align: center;">

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; background: var(--bg-surface); padding: 1rem 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="text-align: left;">
              <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.25rem; font-weight: 700;">Hafalan Kartu 3D</h2>
              <span style="font-size: 0.85rem; color: var(--text-muted);" id="cardCounter">Kartu 1 dari 4</span>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--accent-green-light); padding: 0.4rem 0.85rem; border-radius: var(--radius-full); border: 1px solid rgba(16, 185, 129, 0.3);">
              <span style="font-size: 1.1rem;">🧠</span>
              <span style="font-size: 0.9rem; font-weight: 700; color: #065f46;">Skor: <span id="scoreCounter">${score}</span></span>
            </div>
          </div>

          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            💡 Klik kartu di bawah untuk membaliknya dan melihat jawaban.
          </p>

          <div class="flashcard-wrapper" id="flashcardWrapper">
            <div class="card-3d">
              <div class="card-face card-face-front">
                <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em; margin-bottom: 1rem;">PERTANYAAN</span>
                <h3 id="questionText" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.35rem; font-weight: 700;">
                  Loading...
                </h3>
                <span style="margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-subtle);">🔄 (Klik untuk membalik)</span>
              </div>

              <div class="card-face card-face-back">
                <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--accent-green); letter-spacing: 0.05em; margin-bottom: 1rem;">JAWABAN</span>
                <p id="answerText" style="font-size: 1.15rem; font-weight: 600; color: var(--text-main);">
                  Loading...
                </p>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
            <button id="btnForgot" class="btn btn-outline" style="flex: 1; max-width: 200px; padding: 0.8rem; border-color: var(--accent-red); color: var(--accent-red);">
              <span>❌ Belum Ingat</span>
            </button>
            <button id="btnRemembered" class="btn btn-primary" style="flex: 1; max-width: 200px; padding: 0.8rem; background-color: var(--accent-green);">
              <span>✅ Sudah Ingat</span>
            </button>
          </div>

          <div style="margin-top: 2.5rem;">
            <button id="btnResetDeck" class="btn btn-outline" style="font-size: 0.85rem;">
              🔄 Ulangi Semua Kartu
            </button>
          </div>

        </div>
      </section>
    `;
  },
  attachEvents: () => {
    let currentIndex = 0;
    let score = Store.getFlashcardScore();

    const wrapper = document.getElementById('flashcardWrapper');
    const questionText = document.getElementById('questionText');
    const answerText = document.getElementById('answerText');
    const cardCounter = document.getElementById('cardCounter');
    const scoreCounter = document.getElementById('scoreCounter');
    const btnForgot = document.getElementById('btnForgot');
    const btnRemembered = document.getElementById('btnRemembered');
    const btnReset = document.getElementById('btnResetDeck');

    function renderCard() {
      if (!wrapper) return;
      wrapper.classList.remove('flipped');
      const card = FlashcardPage.cards[currentIndex];
      questionText.textContent = card.q;
      answerText.textContent = card.a;
      cardCounter.textContent = `Kartu ${currentIndex + 1} dari ${FlashcardPage.cards.length}`;
    }

    if (wrapper) {
      wrapper.addEventListener('click', () => {
        wrapper.classList.toggle('flipped');
      });
    }

    function nextCard(isRemembered) {
      if (isRemembered) {
        score++;
        Store.setFlashcardScore(score);
        scoreCounter.textContent = score;
        Utils.playPingSound();
      }

      wrapper.style.transform = 'translateX(60px)';
      wrapper.style.opacity = '0';

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % FlashcardPage.cards.length;
        renderCard();
        wrapper.style.transform = 'translateX(0)';
        wrapper.style.opacity = '1';
      }, 250);
    }

    if (btnRemembered) btnRemembered.addEventListener('click', (e) => { e.stopPropagation(); nextCard(true); });
    if (btnForgot) btnForgot.addEventListener('click', (e) => { e.stopPropagation(); nextCard(false); });
    if (btnReset) btnReset.addEventListener('click', () => {
      currentIndex = 0;
      score = 0;
      Store.setFlashcardScore(0);
      scoreCounter.textContent = 0;
      renderCard();
    });

    renderCard();
  }
};
