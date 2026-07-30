/**
 * QuizPage Component (js/pages/QuizPage.js)
 */
import { Store } from '../store.js';
import { Utils } from '../utils.js';

export const QuizPage = {
  questions: [
    {
      q: "Apa nama teknik belajar yang dilakukan dengan mengulang materi pada selang waktu teratur?",
      options: [
        "Pomodoro Technique",
        "Spaced Repetition",
        "Mind Mapping",
        "Cramming Method"
      ],
      correct: 1
    },
    {
      q: "Berapa menit durasi belajar fokus yang disarankan pada teknik Pomodoro standar?",
      options: [
        "10 Menit",
        "60 Menit",
        "25 Menit",
        "45 Menit"
      ],
      correct: 2
    },
    {
      q: "Apa fungsi utama dari penyimpanan localStorage di browser?",
      options: [
        "Menyimpan data sesi pengguna di browser tanpa membutuhkan server database",
        "Mempercepat kecepatan internet komputer",
        "Mengubah warna layar monitor",
        "Menghapus berkas sementara sistem operasi"
      ],
      correct: 0
    }
  ],

  render: () => `
    <section style="padding: 2.5rem 0;">
      <div class="container" style="max-width: 680px;">

        <div id="quizContainer" class="card" style="padding: 2.5rem 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary);" id="quizProgressText">Soal 1 dari 3</span>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Nilai Sementara: <span id="currentScoreText" style="color: var(--text-main);">0</span></div>
          </div>

          <h3 id="questionTitle" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem;">
            Loading...
          </h3>

          <div class="quiz-options" id="quizOptions"></div>

          <div style="margin-top: 2rem; text-align: right;">
            <button id="btnNextQuestion" class="btn btn-primary hidden">
              <span>Soal Selanjutnya &rarr;</span>
            </button>
          </div>
        </div>

        <div id="resultContainer" class="card hidden" style="padding: 3rem 2rem; text-align: center;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: #fef3c7; color: #d97706; display: inline-flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 1.25rem;">
            🏆
          </div>

          <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Selamat! Anda Lulus</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem;">Evaluasi kuis akhir telah berhasil diselesaikan.</p>

          <div style="background: var(--bg-subtle); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 1.75rem; margin-bottom: 2rem; text-align: center;">
            <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--accent-gold); letter-spacing: 0.08em;">LENCANA KELULUSAN ADAYUNA</span>
            <h3 id="certificateName" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.4rem; font-weight: 800; margin: 0.5rem 0;">
              Pelajar Adayuna
            </h3>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--primary); margin: 0.5rem 0;" id="finalScoreDisplay">
              100 / 100
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted);" id="certificateDate">Diterbitkan secara otomatis oleh Sistem Gamifikasi Adayuna.</p>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center;">
            <a href="#dashboard" class="btn btn-primary btn-lg">
              <span>Kembali ke Dashboard</span>
              <span>🚀</span>
            </a>
            <button id="btnRetakeQuiz" class="btn btn-outline btn-lg">
              🔄 Ulangi Kuis
            </button>
          </div>
        </div>

      </div>
    </section>
  `,

  attachEvents: (navigateTo) => {
    let currentQIndex = 0;
    let totalCorrect = 0;
    let answered = false;

    const quizContainer = document.getElementById('quizContainer');
    const resultContainer = document.getElementById('resultContainer');
    const quizProgressText = document.getElementById('quizProgressText');
    const currentScoreText = document.getElementById('currentScoreText');
    const questionTitle = document.getElementById('questionTitle');
    const quizOptions = document.getElementById('quizOptions');
    const btnNext = document.getElementById('btnNextQuestion');

    function loadQuestion() {
      answered = false;
      if (btnNext) btnNext.classList.add('hidden');
      const q = QuizPage.questions[currentQIndex];

      if (quizProgressText) quizProgressText.textContent = `Soal ${currentQIndex + 1} dari ${QuizPage.questions.length}`;
      if (currentScoreText) currentScoreText.textContent = `${totalCorrect} Benar`;
      if (questionTitle) questionTitle.textContent = q.q;

      if (quizOptions) {
        quizOptions.innerHTML = '';
        q.options.forEach((optText, i) => {
          const btn = document.createElement('button');
          btn.className = 'option-btn';
          btn.innerHTML = `
            <span>${i + 1}. ${optText}</span>
            <span class="opt-icon"></span>
          `;
          btn.addEventListener('click', () => selectOption(i, btn));
          quizOptions.appendChild(btn);
        });
      }
    }

    function selectOption(selectedIndex, selectedBtn) {
      if (answered) return;
      answered = true;

      const q = QuizPage.questions[currentQIndex];
      const allOptionBtns = quizOptions.querySelectorAll('.option-btn');

      allOptionBtns.forEach(b => b.disabled = true);

      if (selectedIndex === q.correct) {
        selectedBtn.classList.add('correct');
        selectedBtn.querySelector('.opt-icon').textContent = '✅';
        totalCorrect++;
        if (currentScoreText) currentScoreText.textContent = `${totalCorrect} Benar`;
        Utils.playPingSound();
      } else {
        selectedBtn.classList.add('incorrect');
        selectedBtn.querySelector('.opt-icon').textContent = '❌';

        const correctBtn = allOptionBtns[q.correct];
        if (correctBtn) {
          correctBtn.classList.add('correct');
          correctBtn.querySelector('.opt-icon').textContent = '✅';
        }
      }

      if (btnNext) btnNext.classList.remove('hidden');
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentQIndex < QuizPage.questions.length - 1) {
          currentQIndex++;
          loadQuestion();
        } else {
          showFinalResult();
        }
      });
    }

    function showFinalResult() {
      const finalScore = Math.round((totalCorrect / QuizPage.questions.length) * 100);
      Store.setQuizScore(finalScore);

      const user = Store.getUser();
      document.getElementById('certificateName').textContent = user ? user.name : 'Pelajar Adayuna';
      document.getElementById('finalScoreDisplay').textContent = `${finalScore} / 100`;
      document.getElementById('certificateDate').textContent = `Diterbitkan pada ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

      if (quizContainer) quizContainer.classList.add('hidden');
      if (resultContainer) resultContainer.classList.remove('hidden');

      Utils.playPingSound();
    }

    const btnRetake = document.getElementById('btnRetakeQuiz');
    if (btnRetake) {
      btnRetake.addEventListener('click', () => {
        currentQIndex = 0;
        totalCorrect = 0;
        if (resultContainer) resultContainer.classList.add('hidden');
        if (quizContainer) quizContainer.classList.remove('hidden');
        loadQuestion();
      });
    }

    loadQuestion();
  }
};
