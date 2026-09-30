import { injectStyle } from '../../js/utils/styleLoader.js';
import { CONFIG } from '../../js/core/config.js';
import { AI } from '../../js/services/ai.js';

injectStyle('features/notes/css/notes.css');

const JOURNAL_POINTS = CONFIG.LIMITS.JOURNAL_POINTS;

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function mapelOptions() {
  return '<option value="umum">Umum</option>' +
    CONFIG.MAPELS.map(m => '<option value="' + m.key + '">' + m.label + '</option>').join('');
}

// Shell halaman Catatan AI. Ada dua mode yang berbagi satu route:
//   - daftar  : `#/catatan`            → form catat hari ini + semua catatan
//   - detail  : `#/catatan?note=<ref>` → isi catatan + bantuan AI
// Mode mana yang tampil ditentukan services/notes.js, jadi kedua bagian
// selalu ada di DOM dan hanya di-toggle lewat `hidden`.
export function renderNotes() {
  return `
<section class="pt-16 md:pt-20 pb-10">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <a href="#/catatan" id="notesBack" class="notes-back no-underline text-sm font-medium inline-flex items-center gap-2 reveal" hidden>
      <i class="fas fa-arrow-left text-xs"></i> Kembali ke daftar catatan
    </a>
    <div class="flex items-start justify-between gap-4 mt-4">
      <div class="max-w-2xl">
        <span class="section-badge reveal"><i class="fas fa-book-open"></i> Catatan Belajar</span>
        <h1 id="notesTitle" class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 reveal reveal-stagger-1 text-slate-900 dark:text-slate-100">Catatan Belajar</h1>
        <div id="notesMeta" class="notes-meta mt-2 reveal reveal-stagger-2"></div>
      </div>
      <button id="addNoteBtn" data-note-new class="btn-edquest btn-primary-grad text-sm !py-2 !px-4 flex-shrink-0 reveal reveal-right" hidden>
        <i class="fas fa-plus"></i> Catat Hari Ini
      </button>
    </div>

    <div id="notesListMode" class="mt-8" hidden>
      <p class="text-xs mb-5" style="color:var(--text-muted);">Catat apa saja yang sudah kamu pelajari, lalu klik salah satu catatan untuk minta AI merangkum, membedah poin pentingnya, atau menguji kamu dengan kuis.</p>
      <div id="notesForm" class="card-panel p-5 mb-6" style="display:none;">
        <h4 class="font-bold mb-3 text-slate-900 dark:text-slate-100">Apa yang sudah kamu pelajari?</h4>
        <form id="noteForm">
          <div class="mb-3">
            <label for="noteMapel" class="form-label">Mapel (opsional)</label>
            <select id="noteMapel" class="form-input" style="cursor:pointer;">
              ${mapelOptions()}
            </select>
          </div>
          <div class="mb-3">
            <label for="noteText" class="form-label">Catatan Progress</label>
            <textarea id="noteText" rows="3" class="form-input resize-none" placeholder="Contoh: Hari ini aku belajar tentang turunan fungsi..." required></textarea>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400 dark:text-slate-500">Setiap catatan = +${JOURNAL_POINTS} poin</span>
            <div class="flex gap-2">
              <button type="button" id="cancelNoteBtn" class="btn-ghost text-sm !py-1 !px-3">Batal</button>
              <button type="submit" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4">Simpan</button>
            </div>
          </div>
        </form>
      </div>
      <div id="notesList" class="notes-grid"></div>
    </div>

    <div id="notesDetailMode" class="mt-8" hidden>
      <div class="grid lg:grid-cols-5 gap-8">
        <div class="lg:col-span-2">
          <div id="notesBody" class="reveal-left"></div>
          <div id="notesSwitcher" class="mt-6"></div>
        </div>
        <div class="lg:col-span-3">
          <div class="card-panel ai-panel reveal-right">
            <div class="flex items-start justify-between gap-3 mb-1">
              <h2 class="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <i class="fas ${esc(AI.config().badgeIcon || 'fa-wand-magic-sparkles')}"></i> ${esc(AI.config().badge || 'Asisten AI')}
              </h2>
              <span class="status-tag">Demo</span>
            </div>
            <p class="text-xs leading-relaxed" style="color:var(--text-muted);">${esc(AI.config().disclaimer || '')}</p>
            <div id="notesAiActions" class="ai-actions"></div>
            <div id="notesAiResults" class="ai-results"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;
}
