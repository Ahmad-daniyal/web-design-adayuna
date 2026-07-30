/**
 * PomodoroPage Component (js/pages/PomodoroPage.js)
 */
import { Utils } from '../utils.js';

export const PomodoroPage = {
  render: () => `
    <section style="padding: 2.5rem 0;">
      <div class="container" style="max-width: 600px; text-align: center;">

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.8rem; font-weight: 800;">Timer Produktivitas</h1>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Fokus 25 menit untuk hasil belajar maksimal.</p>
          </div>

          <button id="btnZenToggle" class="btn btn-outline" style="border-radius: var(--radius-full); font-size: 0.85rem;">
            <span>🧘 Zen Mode</span>
          </button>
        </div>

        <div style="display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 2.5rem;">
          <button id="presetFocus" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.88rem;">
            🎯 25 Min Belajar
          </button>
          <button id="presetBreak" class="btn btn-outline" style="padding: 0.5rem 1.25rem; font-size: 0.88rem;">
            ☕ 5 Min Istirahat
          </button>
        </div>

        <div class="timer-container">
          <div class="svg-timer-wrap">
            <svg class="timer-svg" viewBox="0 0 260 260">
              <circle class="timer-bg-circle" cx="130" cy="130" r="115"></circle>
              <circle class="timer-progress-circle" id="timerCircle" cx="130" cy="130" r="115"></circle>
            </svg>
            <div class="timer-text-display" id="timeDisplay">25:00</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
          <button id="btnStart" class="btn btn-accent btn-lg" style="width: 140px;">▶️ Mulai</button>
          <button id="btnPause" class="btn btn-outline btn-lg" style="width: 140px;" disabled>⏸️ Jeda</button>
          <button id="btnReset" class="btn btn-outline btn-lg" style="width: 120px;">🔄 Reset</button>
        </div>

        <p id="zenNotice" style="margin-top: 2.5rem; font-size: 0.85rem; color: var(--text-subtle);" class="hidden">
          (Tekan tombol 'Zen Mode' lagi di kanan atas untuk kembali ke tampilan biasa)
        </p>

      </div>
    </section>
  `,
  attachEvents: () => {
    let totalSeconds = 25 * 60;
    let remainingSeconds = totalSeconds;
    let timerInterval = null;
    let isRunning = false;

    const circle = document.getElementById('timerCircle');
    const timeDisplay = document.getElementById('timeDisplay');
    const btnStart = document.getElementById('btnStart');
    const btnPause = document.getElementById('btnPause');
    const btnReset = document.getElementById('btnReset');
    const presetFocus = document.getElementById('presetFocus');
    const presetBreak = document.getElementById('presetBreak');
    const btnZen = document.getElementById('btnZenToggle');
    const zenNotice = document.getElementById('zenNotice');

    const maxDash = 722;

    function updateDisplay() {
      if (!timeDisplay || !circle) return;
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      const progressFraction = remainingSeconds / totalSeconds;
      const offset = maxDash - (progressFraction * maxDash);
      circle.style.strokeDashoffset = offset;
    }

    function startTimer() {
      if (isRunning) return;
      isRunning = true;
      btnStart.disabled = true;
      btnPause.disabled = false;

      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateDisplay();
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          btnStart.disabled = false;
          btnPause.disabled = true;
          Utils.playPingSound();
          alert('🎉 Waktu fokus selesai! Istirahat sejenak untuk menyegarkan pikiran Anda.');
        }
      }, 1000);
    }

    function pauseTimer() {
      if (!isRunning) return;
      clearInterval(timerInterval);
      isRunning = false;
      btnStart.disabled = false;
      btnPause.disabled = true;
    }

    function resetTimer(seconds) {
      pauseTimer();
      if (seconds) totalSeconds = seconds;
      remainingSeconds = totalSeconds;
      updateDisplay();
    }

    if (btnStart) btnStart.addEventListener('click', startTimer);
    if (btnPause) btnPause.addEventListener('click', pauseTimer);
    if (btnReset) btnReset.addEventListener('click', () => resetTimer());

    if (presetFocus) presetFocus.addEventListener('click', () => {
      presetFocus.className = 'btn btn-primary';
      presetBreak.className = 'btn btn-outline';
      resetTimer(25 * 60);
    });

    if (presetBreak) presetBreak.addEventListener('click', () => {
      presetBreak.className = 'btn btn-primary';
      presetFocus.className = 'btn btn-outline';
      resetTimer(5 * 60);
    });

    if (btnZen) btnZen.addEventListener('click', () => {
      document.body.classList.toggle('zen-mode');
      const isZen = document.body.classList.contains('zen-mode');
      btnZen.textContent = isZen ? '☀️ Keluar Zen' : '🧘 Zen Mode';
      if (zenNotice) zenNotice.classList.toggle('hidden', !isZen);
    });

    updateDisplay();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
      document.body.classList.remove('zen-mode');
    };
  }
};
