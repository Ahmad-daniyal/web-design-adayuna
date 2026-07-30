/**
 * Adayuna SPA Utilities (js/utils.js)
 * Audio Synthesizer, Typing Effect, and Intersection Observer helpers
 */

export const Utils = {
  // Web Audio API Synthesizer (No external MP3 files required)
  playPingSound: () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio playback blocked or unsupported');
    }
  },

  // Typing Effect
  initTypingEffect: (targetEl, phrases) => {
    if (!targetEl || !phrases.length) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timerId = null;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        targetEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        targetEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 90;

      if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }

      timerId = setTimeout(typeLoop, speed);
    }

    typeLoop();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  },

  // Scroll Reveal Observer
  initScrollReveal: () => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
  }
};
