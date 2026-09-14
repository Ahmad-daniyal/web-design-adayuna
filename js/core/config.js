export const CONFIG = {
  STORAGE_KEYS: {
    USER: 'edquest_user',
    REGISTERED_USERS: 'edquest_registered',
    DARK: 'edquest_dark',
    LEADERBOARD: 'edquest_leaderboard',
    NOTIFICATIONS: 'edquest_notifications'
  },
  DATA_PATHS: {
    FORUM: 'data/forum.json',
    BUDDIES: 'data/buddies.json',
    HOME: 'features/home/home.json',
    QUESTIONS: 'data/questions.json',
    LEADERBOARD: 'data/leaderboard.json',
    ABOUT: 'data/about.json',
    FAQ: 'data/faq.json'
  },
  LIMITS: {
    MAX_PAGES: 7,
    SEARCH_MAX: 6,
    JOURNAL_POINTS: 5
  },
  MAPELS: [
    { key: 'matematika', label: 'Matematika', icon: 'fa-calculator' },
    { key: 'fisika', label: 'Fisika', icon: 'fa-atom' },
    { key: 'kimia', label: 'Kimia', icon: 'fa-flask' },
    { key: 'biologi', label: 'Biologi', icon: 'fa-dna' },
    { key: 'sejarah', label: 'Sejarah', icon: 'fa-landmark' },
    { key: 'bahasa', label: 'Bahasa Indonesia', icon: 'fa-language' },
    { key: 'ips', label: 'IPS', icon: 'fa-globe' }
  ],
  MINAT: [
    { key: 'diskusi', label: 'Suka diskusi' },
    { key: 'materi', label: 'Suka materi lengkap' },
    { key: 'soal', label: 'Suka tryout & soal' },
    { key: 'kreatif', label: 'Suka cara kreatif' }
  ],
  MATCH: {
    QUESTIONS_PER_MATCH: 10,
    CLASSIC_SECONDS: 120,
    RANKED_SECONDS: 70,
    AUTO_ADVANCE_MS: 2000,
    POINTS: { rendah: 1, sedang: 2, tinggi: 3, sulit: 4, cerdas: 5 },
    BONUS_WIN_MULTIPLIER: 5,
    STREAK_BONUS_EVERY: 3,
    RATING_CLAMP: 20,
    BADGE_RANK_POINTS: 15,
    POINTS_TO_RANK: 10,
    TIERS: [
      { name: 'Bronze', min: 0 },
      { name: 'Silver', min: 50 },
      { name: 'Gold', min: 100 },
      { name: 'Platinum', min: 150 },
      { name: 'Diamond', min: 200 }
    ]
  }
};
