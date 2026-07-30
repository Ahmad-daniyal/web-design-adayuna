/**
 * Adayuna SPA Store Module (js/store.js)
 * Centralized Persistent State Manager utilizing localStorage
 */

export const Store = (() => {
  const KEYS = {
    USER_NAME: 'adayuna_userName',
    USER_EMAIL: 'adayuna_userEmail',
    MATERI_READ: 'adayuna_materiRead',
    FLASHCARD_SCORE: 'adayuna_flashcardScore',
    QUIZ_SCORE: 'adayuna_quizScore',
    THEME: 'adayuna_theme'
  };

  const get = (key, defaultVal = null) => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : defaultVal;
    } catch (e) {
      return localStorage.getItem(key) || defaultVal;
    }
  };

  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      localStorage.setItem(key, value);
    }
  };

  return {
    KEYS,
    getUser: () => {
      const name = get(KEYS.USER_NAME);
      const email = get(KEYS.USER_EMAIL);
      return name ? { name, email } : null;
    },
    setUser: (name, email) => {
      set(KEYS.USER_NAME, name);
      set(KEYS.USER_EMAIL, email);
    },
    isMateriRead: () => get(KEYS.MATERI_READ, false),
    setMateriRead: (val = true) => set(KEYS.MATERI_READ, val),
    getFlashcardScore: () => get(KEYS.FLASHCARD_SCORE, 0),
    setFlashcardScore: (val) => set(KEYS.FLASHCARD_SCORE, val),
    getQuizScore: () => get(KEYS.QUIZ_SCORE, null),
    setQuizScore: (val) => set(KEYS.QUIZ_SCORE, val),
    getTheme: () => get(KEYS.THEME, 'light'),
    setTheme: (val) => set(KEYS.THEME, val)
  };
})();
