import { injectStyle } from '../../js/utils/styleLoader.js';
import { dataStore } from '../../js/data/index.js';
import { CONFIG } from '../../js/core/config.js';

injectStyle('features/forum/css/forum.css');

const CAT_LABELS = CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.label; return o; }, {});
const CAT_ICONS = CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.icon; return o; }, {});

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
          <input id="forumSearchInput" type="text" class="form-input !pl-11" placeholder="Cari thread, topik, atau mapel..." autocomplete="off">
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

  function renderItems(items) {
    if (items.length === 0) {
      dropdown.innerHTML = '<div class="sac-empty">Tidak ditemukan</div>';
      dropdown.classList.add('open');
      return;
    }
    dropdown.innerHTML = items.slice(0, 8).map(t =>
      '<div class="sac-item" data-idx="' + dataStore.forum.indexOf(t) + '" data-cat="' + (t.category || '') + '">' +
        '<i class="fas ' + (CAT_ICONS[t.category] || 'fa-book') + ' sac-icon"></i>' +
        '<span class="sac-title">' + t.title + '</span>' +
        '<span class="sac-source">' + (CAT_LABELS[t.category] || t.category) + '</span>' +
      '</div>'
    ).join('');
    dropdown.classList.add('open');
    dropdown.querySelectorAll('.sac-item').forEach(el => {
      el.addEventListener('click', () => {
        const cat = el.dataset.cat;
        const idx = Number(el.dataset.idx);
        dropdown.classList.remove('open');
        Router.navigate('forum');
        setTimeout(function() {
          if (cat && cat !== 'all') {
            var catBtn = document.querySelector('.cat-btn[data-category="' + cat + '"]');
            if (catBtn) catBtn.click();
          }
          Forum.openThread(idx);
        }, 300);
      });
      el.addEventListener('mouseenter', () => {
        dropdown.querySelectorAll('.sac-item').forEach(e => e.classList.remove('focused'));
        el.classList.add('focused');
      });
    });
  }

  document.addEventListener('input', (e) => {
    if (e.target !== input) return;
    const q = input.value.toLowerCase().trim();
    if (!q) { dropdown.classList.remove('open'); return; }
    const items = dataStore.forum.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q) ||
      (t.category && CAT_LABELS[t.category] && CAT_LABELS[t.category].toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
    renderItems(items);
  });

  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.sac-item');
    if (!items.length) return;
    let focused = [...items].findIndex(el => el.classList.contains('focused'));
    if (e.key === 'ArrowDown') { e.preventDefault(); focused = Math.min(focused + 1, items.length - 1); items.forEach(function(el, i) { el.classList.toggle('focused', i === focused); }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focused = Math.max(focused - 1, 0); items.forEach(function(el, i) { el.classList.toggle('focused', i === focused); }); }
    else if (e.key === 'Enter' && focused >= 0) { e.preventDefault(); items[focused].click(); }
    else if (e.key === 'Tab' && focused >= 0) { e.preventDefault(); items[focused].click(); }
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== input) dropdown.classList.remove('open');
  });
}
