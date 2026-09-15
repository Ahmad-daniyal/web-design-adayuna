import { injectStyle } from '../../js/utils/styleLoader.js';
import { searchEverything, sacHTML, bindSacItems, bindKeydown } from '../../js/core/search.js';

injectStyle('features/forum/css/forum.css');

export function renderForum() { return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="section-badge"><i class="fas fa-comments"></i> Forum Diskusi</span>
      <div class="flex flex-wrap items-end justify-between gap-4 mt-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Diskusi Bebas, Belajar Seru</h1>
          <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Pilih kategori mapel, gulir thread-nya, dan bergabung tanpa rasa malu.</p>
        </div>
        <button onclick="Forum.openNewThread()" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4"><i class="fas fa-plus"></i> Thread Baru</button>
      </div>
      <div class="forum-search-wrapper mt-4" style="max-width:520px;width:100%;">
        <div class="search-input-wrapper" style="position:relative;">
          <i class="fas fa-search" style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--text-muted);z-index:2;"></i>
          <input id="forumSearchInput" type="text" class="form-input !pl-11" placeholder="Cari thread, topik, mapel, arena, atau apa saja..." autocomplete="off">
          <div id="forumSearchAc" class="search-ac-dropdown"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div id="forumRoot"></div>
`; }

export function initForumSearch() {
  const input = document.getElementById('forumSearchInput');
  const dropdown = document.getElementById('forumSearchAc');
  if (!input || !dropdown || input.dataset.searchBound) return;
  input.dataset.searchBound = '1';

  function update(q) {
    const items = searchEverything(q);
    dropdown.innerHTML = sacHTML(items);
    if (items.length) { bindSacItems(dropdown, () => dropdown.classList.remove('open')); bindKeydown(input, dropdown); dropdown.classList.add('open'); }
    else dropdown.classList.remove('open');
  }

  document.addEventListener('input', (e) => { if (e.target !== input) return; update(input.value.toLowerCase().trim()); });
  document.addEventListener('click', (e) => { if (!dropdown.contains(e.target) && e.target !== input) dropdown.classList.remove('open'); });
}
