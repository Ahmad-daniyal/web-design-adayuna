import { CONFIG } from '../core/config.js';
import { dataStore } from '../data/index.js';

// Catatan contoh hidup di sini, bukan di auth.js atau services/notes.js,
// supaya keduanya bisa memakainya tanpa impor siklus.
//
// `text` ditulis seadanya seperti catatan siswa beneran (bukan bullet rapi),
// karena justru itu yang harus diolah mesin AI. Panjang tiap contoh dibuat
// berbeda-beda supaya terlihat bahwa hasil bantuannya menyesuaikan isi catatan:
// yang panjang bisa diringkas jadi paragraf, yang pendek tetap terbaca.

// Entri baru memakai id acak supaya tautan ke catatannya tetap valid walau
// ada catatan lain yang disisipkan atau dihapus di antaranya.
export function newNoteId() {
  return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Entri jurnal lama (sebelum fitur ini) belum punya id, jadi alamatnya jatuh
// ke posisi di array.
export function refOf(entry, i) {
  return (entry && entry.id) || ('idx-' + i);
}

export function buildSampleEntries() {
  const list = (dataStore.journalSamples && dataStore.journalSamples.samples) || [];
  return list
    .map((s, i) => ({
      id: newNoteId(),
      mapel: s.mapel || 'umum',
      text: String(s.text || '').trim(),
      // `ageHours` disebar beberapa jam/hari supaya label waktu di kartu
      // ("2 jam lalu", "Kemarin") tidak semuanya sama.
      time: new Date(Date.now() - (Number(s.ageHours) || (i + 1) * 12) * 3600000).toISOString(),
      points: CONFIG.LIMITS.JOURNAL_POINTS,
      sample: true
    }))
    .filter(e => e.text);
}
