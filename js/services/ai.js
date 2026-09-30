import { CONFIG } from '../core/config.js';
import { dataStore } from '../data/index.js';

// Kata kerja/benda yang muncul di hampir semua catatan. Buang supaya
// ekstraksi poin penting tidak penuh kata umum.
const STOPWORDS = new Set([
  'ada', 'adalah', 'agar', 'aku', 'akan', 'antara', 'apa', 'atau', 'bagi', 'bahwa',
  'banyak', 'baru', 'belum', 'bisa', 'boleh', 'buat', 'bukan', 'dalam', 'dan',
  'dapat', 'dari', 'dengan', 'di', 'dia', 'dua', 'hal', 'hampir', 'hari', 'harus',
  'hingga', 'hampir', 'ini', 'itu', 'jadi', 'jika', 'juga', 'kalau', 'kami',
  'kamu', 'karena', 'kembali', 'kemudian', 'kepada', 'kita', 'lagi', 'lain',
  'lalu', 'lebih', 'maka', 'masih', 'mau', 'melakukan', 'memang', 'mereka',
  'namun', 'oleh', 'pada', 'paling', 'para', 'pun', 'saat', 'saja', 'sama',
  'sangat', 'satu', 'saya', 'sebagai', 'sebuah', 'sebelum', 'sedang', 'sehingga',
  'sejak', 'sekarang', 'selain', 'seluruh', 'semua', 'sendiri', 'seperti',
  'serta', 'suatu', 'sudah', 'supaya', 'tanpa', 'tapi', 'telah', 'tentang',
  'terhadap', 'tersebut', 'tetapi', 'tidak', 'untuk', 'waktu', 'yaitu', 'yakni',
  'yang'
]);

export const AI = (() => {
  // ===== DUMMY ENGINE =====
  // Semua fungsi di bawah menyalin analisis dari teks catatan secara lokal
  // dan deterministik. Nanti kalau ada API AI sungguhan, hanya isi keempat
  // fungsi ini yang perlu diganti — bentuk datanya sudah disepakati di
  // js/services/notes.js sehingga UI tidak ikut berubah sama sekali.

  function config() {
    return (dataStore.notes && dataStore.notes.ai) || {};
  }

  function profiles() {
    return (dataStore.notes && dataStore.notes.mapelProfiles) || {};
  }

  function profile(mapel) {
    const p = profiles();
    return p[mapel] || p.umum || {};
  }

  function actions() {
    return config().actions || [];
  }

  function thinkDelay() {
    const min = CONFIG.LIMITS.AI_THINK_MIN_MS || 700;
    const jitter = CONFIG.LIMITS.AI_THINK_JITTER_MS || 0;
    return Math.round(min + Math.random() * jitter);
  }

  function sentences(text) {
    const raw = String(text || '').trim();
    if (!raw) return [];
    let parts = raw.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 8);
    if (parts.length < 2) {
      const chunks = raw.split(/,\s*/).map(s => s.trim()).filter(s => s.length > 12);
      if (chunks.length > parts.length) parts = chunks;
    }
    if (!parts.length) return [raw];
    return parts;
  }

  function trimTo(s, max) {
    const str = String(s || '').trim();
    if (str.length <= max) return str;
    const cut = str.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + '...';
  }

  function capitalize(s) {
    const str = String(s || '').trim();
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  function endsClean(s) {
    return /[.!?…]$/.test(String(s || '').trim()) ? String(s).trim() : capitalize(s) + '.';
  }

  // Kata kunci dari isi catatan, diurutkan frekuensi lalu urutan kemunculan
  // supaya hasilnya stabil untuk catatan yang sama. Batas 5 huruf menyaring
  // kata sambung pendek yang hanya jadi pengisi.
  function keywords(text, limit) {
    const max = limit || 6;
    const counts = new Map();
    const firstAt = new Map();
    const tokens = String(text || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/);
    tokens.forEach((t, i) => {
      if (t.length < 5 || t.length > 24) return;
      if (STOPWORDS.has(t) || /^\d+$/.test(t)) return;
      if (!counts.has(t)) firstAt.set(t, i);
      counts.set(t, (counts.get(t) || 0) + 1);
    });
    return [...counts.keys()]
      .sort((a, b) => (counts.get(b) - counts.get(a)) || (firstAt.get(a) - firstAt.get(b)))
      .slice(0, max)
      .map(term => ({ term, count: counts.get(term) }));
  }

  function joinId(list) {
    const items = list.filter(Boolean);
    if (!items.length) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + ' dan ' + items[1];
    return items.slice(0, -1).join(', ') + ', dan ' + items[items.length - 1];
  }

  function hash(str) {
    let h = 2166136261;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /* --- 1. Rangkum --- */
  function summarize(text, mapel) {
    const sents = sentences(text);
    const stems = (dataStore.notes && dataStore.notes.summaryStems) || ['Inti catatanmu: '];
    const terms = keywords(text, 3).map(k => k.term);

    let bullets = sents.slice(0, 5).map(endsClean);
    if (bullets.length < 3) {
      // Catatan terlalu pendek untuk dipecah per kalimat: potong per
      // potongan kalimat agar tetap dapat beberapa poin.
      const chunkSize = 90;
      const raw = String(text || '').trim();
      const chunks = [];
      for (let i = 0; i < raw.length && chunks.length < 4; i += chunkSize) {
        const part = raw.slice(i, i + chunkSize).trim();
        if (part.length > 15) chunks.push(endsClean(part));
      }
      if (chunks.length > bullets.length) bullets = chunks;
    }

    const subject = (profile(mapel) || {}).subject || 'Umum';
    const base = stems[hash(text) % stems.length];
    let short;
    if (!String(text || '').trim()) {
      short = 'Catatan ini masih kosong, jadi belum ada yang bisa dirangkum.';
    } else if (terms.length >= 2) {
      short = base + joinId(terms) + '.';
    } else {
      // Tanpa kata kunci yang cukup meyakinkan, lebih aman mengulang
      // kalimat aslinya daripada menyusun kalimat dari potongan kata.
      short = base + trimTo(sents[0] || text, 140) + '.';
    }

    return { short: capitalize(short), bullets, subject };
  }

  /* --- 2. Poin penting --- */
  function keyPoints(text, mapel) {
    const prof = profile(mapel);
    const known = (prof.terms || []).map(t => ({ term: String(t.term || '').toLowerCase(), desc: t.desc }));
    const picked = keywords(text, 6);

    const points = picked.map(k => {
      const hit = known.find(p => p.term && (p.term.indexOf(k.term) !== -1 || k.term.indexOf(p.term) !== -1));
      return {
        term: capitalize(k.term),
        count: k.count,
        desc: hit
          ? hit.desc
          : 'Sudah muncul ' + k.count + ' kali di catatanmu. Kandidat bagus buat masuk daftar hafalan.'
      };
    });

    // Catatan terlalu tipis atau serba kata umum: pakai daftar istilah
    // default mapel ini supaya panel AI tidak pernah kosong.
    if (points.length < 2) {
      known.slice(0, 4).forEach(t => {
        points.push({ term: capitalize(t.term), count: 0, desc: t.desc });
      });
    }

    return points.slice(0, 6);
  }

  /* --- 3. Langkah belajar --- */
  function nextSteps(text, mapel) {
    const prof = profile(mapel);
    const base = (prof.nextSteps || []).map(s => ({ title: s.title, desc: s.desc }));
    const top = keywords(text, 1)[0];
    const steps = base.map(s => ({ title: s.title, desc: s.desc }));

    // Istilah hanya dijadikan fokus utama kalau benar-benar sering muncul.
    // Pada catatan tipis, daftar langkah bawaan mapel lebih berguna.
    if (top && top.count >= 2 && steps.length) {
      steps[0] = {
        title: 'Kuatkan "' + top.term + '" lebih dulu',
        desc: 'Istilah "' + top.term + '" paling sering muncul di catatanmu (' + top.count + ' kali). Mulai dari sini biar sisanya ikut nyambung.'
      };
    }
    return steps;
  }

  /* --- 4. Latihan soal --- */
  // Diambil dari bank soal yang sudah ada (data/questions.json), dibatasi
  // mapel yang sama dengan catatan. Pilihan diambil lewat hash seed supaya
  // catatan yang sama selalu menghasilkan latihan yang sama.
  function quiz(text, mapel, seed) {
    const all = dataStore.questions || [];
    if (!all.length) return [];
    let pool = all.filter(q => q.mapel === mapel);
    if (pool.length < 3) pool = all;

    const scored = pool
      .map(q => ({ q, score: hash((seed || '') + '|' + (q.q || '')) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    return scored.map(item => {
      const q = item.q || {};
      return {
        q: q.q || '',
        options: (q.options || []).slice(),
        answer: typeof q.answer === 'number' ? q.answer : 0,
        explain: q.explain || '',
        mapel: q.mapel || mapel,
        difficulty: q.difficulty || ''
      };
    });
  }

  function stats(text) {
    const raw = String(text || '').trim();
    const words = raw ? raw.split(/\s+/).length : 0;
    return {
      words,
      chars: raw.length,
      sentences: sentences(raw).length,
      minutes: Math.max(1, Math.round(words / 200))
    };
  }

  function generate(actionKey, text, mapel, seed) {
    switch (actionKey) {
      case 'summary': return summarize(text, mapel);
      case 'keyPoints': return keyPoints(text, mapel);
      case 'nextSteps': return nextSteps(text, mapel);
      case 'quiz': return quiz(text, mapel, seed);
      default: return null;
    }
  }

  return { actions, config, summarize, keyPoints, nextSteps, quiz, stats, generate, thinkDelay };
})();