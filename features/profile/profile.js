import { injectStyle } from '../../js/utils/styleLoader.js';
import { Auth } from '../../js/services/auth.js';

injectStyle('features/profile/css/profile.css');
injectStyle('features/match/css/match.css');

export function renderProfile() { return `
<section class="pt-16 md:pt-20 pb-10">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <div class="card-panel p-6 text-center mb-6 reveal-left">
          <div id="profileAvatar" class="user-avatar w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold text-white mx-auto mb-3" style="background:var(--gradient-primary);">D</div>
          <h2 id="profileName" class="text-xl font-bold text-slate-900 dark:text-slate-100">Tamu</h2>
          <p id="profileId" class="text-xs font-mono mt-1" style="color:var(--primary-text);">ID: —</p>
          <p class="text-sm mt-1 text-slate-400 dark:text-slate-500">Siswa &middot; <span class="text-sm font-medium" style="color:var(--primary-text);">Mode Panggilan</span></p>
          <div class="flex items-center justify-center gap-4 mt-4">
            <div class="text-center"><div id="profilePoints" class="text-2xl font-extrabold text-slate-900 dark:text-slate-100">0</div><div class="text-xs text-slate-400 dark:text-slate-500">Poin</div></div>
            <div class="w-px h-10" style="background:var(--border-color);"></div>
            <div class="text-center"><div id="profileBadgeCount" class="text-2xl font-extrabold text-slate-900 dark:text-slate-100">0</div><div class="text-xs text-slate-400 dark:text-slate-500">Badge</div></div>
            <div class="w-px h-10" style="background:var(--border-color);"></div>
            <div class="text-center"><div id="profileContrib" class="text-2xl font-extrabold text-slate-900 dark:text-slate-100">0</div><div class="text-xs text-slate-400 dark:text-slate-500">Kontribusi</div></div>
          </div>
        </div>
        <div class="card-panel p-6 mb-6 reveal-left">
          <h4 class="font-bold text-sm mb-4 text-slate-900 dark:text-slate-100"><i class="fas fa-award mr-2 text-slate-500 dark:text-slate-400"></i>Badge</h4>
          <div id="profileBadges" class="flex flex-wrap gap-3"></div>
          <p class="text-xs mt-3 text-slate-400 dark:text-slate-500"><span id="profileBadgeCountText">0 dari 7</span> badge diraih</p>
          <a href="#/match" class="btn-edquest btn-primary-grad w-full mt-4 text-sm !py-2"><i class="fas fa-bolt mr-1"></i> Raih Badge di Arena</a>
        </div>
      </div>
      <div>
        <div class="card-panel p-6 mb-6 reveal-right">
          <h4 class="font-bold text-sm mb-4 text-slate-900 dark:text-slate-100"><i class="fas fa-bolt mr-2" style="color:var(--accent);"></i>Ranking Arena</h4>
          <div class="flex items-center gap-3 mb-4">
            <span id="profileRating" class="text-2xl font-extrabold text-slate-900 dark:text-slate-100">—</span>
            <span id="profileTier" class="tier-chip tier-bronze">Belum bermain</span>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div><div id="profileWins" class="text-lg font-extrabold text-slate-900 dark:text-slate-100">0</div><div class="text-xs text-slate-400 dark:text-slate-500">Menang</div></div>
            <div><div id="profileDraws" class="text-lg font-extrabold text-slate-900 dark:text-slate-100">0</div><div class="text-xs text-slate-400 dark:text-slate-500">Seri</div></div>
            <div><div id="profileLosses" class="text-lg font-extrabold text-slate-900 dark:text-slate-100">0</div><div class="text-xs text-slate-400 dark:text-slate-500">Kalah</div></div>
          </div>
          <a href="#/match" class="btn-edquest btn-outline-glow w-full mt-4 text-sm !py-2"><i class="fas fa-bolt mr-1"></i> Masuk Arena</a>
        </div>
        <div class="card-panel p-4 reveal-right">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm font-medium text-slate-900 dark:text-slate-100"><i class="fas fa-eye-slash mr-2 text-slate-400 dark:text-slate-500"></i>Mode Anonim</span>
            <div class="relative">
              <input type="checkbox" id="anonToggle" class="sr-only peer" checked>
              <div class="w-10 h-5 rounded-full bg-slate-200 dark:bg-slate-700 peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100 transition-colors"></div>
              <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
            </div>
          </label>
          <p class="text-xs mt-2 text-slate-400 dark:text-slate-500">Posting tanpa nama asli. Tetap bisa dapat poin & badge.</p>
        </div>
      </div>

      <!-- Teaser: catatan belajar hidup di halaman Catatan AI, bukan di profil.
           Yang tampil di sini cuma ringkasannya supaya jurnal tidak hilang. -->
      <div class="card-panel p-6 md:col-span-2 reveal">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style="background:var(--accent-light);color:var(--accent);"><i class="fas fa-book-open"></i></div>
            <div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100">Jurnal Belajar</h4>
              <p id="profileJournalHint" class="text-xs mt-1" style="color:var(--text-muted);">Catatan belajar disimpan terpisah dari profil, di halaman Catatan AI.</p>
              <div class="flex items-center gap-5 mt-3 text-xs">
                <span><strong id="profileJournalCount" class="text-lg font-extrabold text-slate-900 dark:text-slate-100">0</strong> <span class="text-slate-400 dark:text-slate-500">catatan</span></span>
                <span><strong id="profileJournalAiCount" class="text-lg font-extrabold" style="color:var(--primary);">0</strong> <span class="text-slate-400 dark:text-slate-500">sudah dirangkum AI</span></span>
              </div>
            </div>
          </div>
          <a href="#/catatan" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4 flex-shrink-0"><i class="fas fa-wand-magic-sparkles mr-1"></i> Buka Catatan AI</a>
        </div>
      </div>
    </div>
  </div>
</section>
`; }
