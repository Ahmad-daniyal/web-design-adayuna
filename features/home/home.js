import { injectStyle } from '../../js/utils/styleLoader.js';
import { dataStore } from '../../js/data/index.js';
import { searchEverything, sacHTML, bindSacItems, bindKeydown } from '../../js/core/search.js';

injectStyle('features/home/css/home.css');

function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;'); }
const escapeAttr = escAttr;

function heroStats() {
  const stats = (dataStore.home && dataStore.home.stats) || [];
  if (!stats.length) return '';
  return stats.map((s, i) => s && s.value != null
    ? '<div class="metric-item reveal reveal-stagger-' + (i + 1) + '"><div class="metric-number" data-counter="' + escHtml(s.value) + '">0</div><div class="metric-label">' + escHtml(s.label) + '</div></div>'
    : ''
  ).join('');
}

function tagHTML(tag) {
  const t = String(tag);
  if (t === 'semua') return '<span class="category-tag">Semua Mapel</span>';
  if (t === 'perkenalan') return '<span class="category-tag">Perkenalan</span>';
  if (!t) return '';
  return '<span class="category-tag ' + escAttr(t) + '">' + capitalize(t) + '</span>';
}

function iceCards() {
  const ice = (dataStore.home && dataStore.home.iceBreakers) || [];
  return ice.map((c, i) =>
    '<div class="ice-card fx-shine reveal reveal-stagger-' + ((i % 4) + 1) + '" data-copy="' + escapeAttr(c && c.copy) + '">' +
      '<i class="fas fa-quote-right quote-icon"></i>' +
      '<p class="text-sm font-medium leading-relaxed mb-3" style="color:var(--text-primary);">' + ((c && c.text) || '') + '"</p>' +
      '<div class="flex items-center justify-between">' +
        '<span class="flex flex-wrap gap-1.5">' + (c && c.tags ? c.tags.map(tagHTML).join('') : '') + '</span>' +
        '<span class="copy-btn text-xs font-semibold" style="color:var(--primary); cursor:pointer;"><i class="fas fa-copy"></i> Salin</span>' +
      '</div>' +
    '</div>'
  ).join('');
}

function heroContent() {
  const h = (dataStore.home && dataStore.home.hero) || {};
  const badge = h.badge || 'Komunitas Belajar #UntukKita';
  const lines = h.titleLines || ['Mulai Perjalanan', 'Belajarmu', 'Tanpa Rasa Malu'];
  const highlight = h.highlightIndex || 1;
  const ctas = h.ctas || [];

  const title = lines.map((line, i) =>
    i === highlight
      ? '<span class="hero-accent">' + escHtml(line) + '</span>'
      : escHtml(line)
  ).join('<br>\n          ');

  const ctaButtons = ctas.filter(c => c && c.label).map(c =>
    '<a href="' + escAttr(c.href || '#') + '" class="btn-edquest text-base" style="' + (CTA_STYLES[c.style] || CTA_STYLES.primary) + '">' +
      '<i class="fas ' + escAttr(c.icon || 'fa-arrow-right') + '"></i> ' + escHtml(c.label) + '</a>'
  ).join('\n          ');

  return {
    badge: badge,
    badgeIcon: h.icon || 'fa-sparkles',
    title,
    description: h.description || '',
    ctaButtons
  };
}

/* Komposisi kartu di kanan hero.
   Tiga lapis sengaja dipisah agar tidak ada dua `transform` pada satu elemen:
     .hero-hook        -> rotasi statis + offset vertikal (dari data)
     .hero-hook-inner  -> animasi float
     .hero-hook-card   -> tampilan + animasi masuk
   Animation reveal TIDAK dipakai di sini: elemennya diposisikan lewat
   transform, jadi bisa luput dari IntersectionObserver dan tertahan tak
   terlihat selamanya. */
function hookCards() {
  const tiles = ((dataStore.home && dataStore.home.hero) || {}).tiles || [];
  return tiles.filter(t => t && t.label).map(t =>
    '<a href="' + escAttr(t.href || '#') + '" class="hero-hook hero-hook-enter' + (t.span ? ' hero-hook-wide' : '') + '" ' +
      'style="--hook-accent:' + escAttr(t.accent || '#2563EB') + '; --hook-rot:' + escAttr(t.rot || '0deg') + '; --hook-fy:' + escAttr(t.fy || '0px') + '; --hook-delay:' + escAttr(t.delay || '0s') + ';" ' +
      'aria-label="' + escAttr(t.label + ' — ' + (t.desc || '')) + '">' +
      '<span class="hero-hook-inner"><span class="hero-hook-card">' +
        '<span class="hero-hook-icon"><i class="fas ' + escAttr(t.icon || 'fa-star') + '"></i></span>' +
        '<span class="hero-hook-body">' +
          '<span class="hero-hook-label">' + escHtml(t.label) + '</span>' +
          '<span class="hero-hook-desc">' + escHtml(t.desc || '') + '</span>' +
        '</span>' +
        (t.span ? '<span class="hero-hook-go" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>' : '') +
      '</span></span>' +
    '</a>'
  ).join('\n                ');
}

function heroDecor() {
  const d = ((dataStore.home && dataStore.home.hero) || {}).decor || {};
  const phrase = (d.phrase || []).filter(Boolean).map(escHtml).join('<br>\n          ');
  const marks = (d.marks || []).filter(m => m && m.icon).map((m, i) =>
    '<span class="hero-mark hero-mark-' + (i + 1) + ' hero-mark-' + escAttr(m.tone || 'blue') + '" aria-hidden="true">' +
      '<i class="fas ' + escAttr(m.icon) + '"></i></span>'
  ).join('\n            ');
  return {
    phrase,
    marks,
    lines: '<svg class="hero-curve" viewBox="0 0 240 240" aria-hidden="true" focusable="false">' +
      '<path d="M10 226 C58 186 50 104 118 68 C168 41 214 62 230 118" />' +
      '<path d="M34 240 C92 208 104 148 164 132" />' +
    '</svg>'
  };
}

function quickSearchSection() {
  const h = (dataStore.home && dataStore.home.hero) || {};
  const baca = h.bacaDulu || {};
  const placeholder = 'Cari forum, topik, mapel, arena, atau apa saja...';
  return '<div class="quick-search reveal reveal-stagger-1">' +
      '<i class="fas fa-search quick-search-icon" aria-hidden="true"></i>' +
      '<input id="homeSearchInput" type="text" class="quick-search-input" placeholder="' + escAttr(placeholder) + '" aria-label="' + escAttr(placeholder) + '" autocomplete="off">' +
      '<span class="quick-search-go" aria-hidden="true"><i class="fas fa-magnifying-glass"></i></span>' +
      '<div id="homeSearchAc" class="search-ac-dropdown"></div>' +
    '</div>' +
    '<div class="baca-dulu mx-auto reveal reveal-stagger-2">' +
      '<i class="fas ' + (baca.icon || 'fa-eye') + '" aria-hidden="true"></i>\n      ' + escHtml(baca.text || '') + ' <a href="' + escAttr(baca.href || '#/forum') + '">' + escHtml(baca.linkText || 'Jelajahi Forum') + ' <i class="fas fa-arrow-right" aria-hidden="true"></i></a>' +
    '</div>';
}

function featureCards() {
  const section = (dataStore.home && dataStore.home.featuresSection) || {};
  const features = (section.features || []).filter(f => f && f.title);
  return features.map((f, i) =>
    '<div class="feature-card fx-card text-center sm:text-left reveal reveal-stagger-' + ((i % 3) + 1) + '">' +
      '<div class="feature-icon mx-auto sm:mx-0"><i class="fas ' + escAttr(f.icon || 'fa-star') + '"></i></div>' +
      '<h3 class="text-xl font-bold mt-5 mb-2" style="color:var(--text-primary);">' + escHtml(f.title) + '</h3>' +
      '<p class="text-sm leading-relaxed" style="color:var(--text-secondary);">' + escHtml(f.desc) + '</p>' +
    '</div>'
  ).join('\n        ');
}

function iceBreakerSection() {
  const s = (dataStore.home && dataStore.home.iceBreakerSection) || {};
  return '<span class="section-badge"><i class="fas ' + (s.badge || 'fa-sparkles') + '"></i> ' + escHtml(s.badgeText || 'Ice Breaker') + '</span>' +
    '<h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3" style="color:var(--text-primary);">' + escHtml(s.title || 'Bingung Mau Mulai dari Mana?') + '</h2>' +
    '<p class="text-lg" style="color:var(--text-secondary); max-width:560px; margin:0 auto;">' + escHtml(s.subtitle || '') + '</p>';
}

function featuresSection() {
  const s = (dataStore.home && dataStore.home.featuresSection) || {};
  return '<span class="section-badge"><i class="fas ' + (s.badge || 'fa-star') + '"></i> ' + escHtml(s.badgeText || 'Fitur Unggulan') + '</span>' +
    '<h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3" style="color:var(--text-primary);">' + escHtml(s.title || 'Belajar Lebih Seru Bareng Edquest') + '</h2>' +
    '<p class="text-lg" style="color:var(--text-secondary);">' + escHtml(s.subtitle || '') + '</p>';
}

function ctaSection() {
  const s = (dataStore.home && dataStore.home.ctaSection) || {};
  const buttons = (s.buttons || []).filter(b => b && b.label).map(b =>
    b.action
      ? '<button data-action="' + escAttr(b.action) + '" class="btn-edquest text-base" style="' + (CTA_STYLES[b.style] || CTA_STYLES.primary) + '"><i class="fas ' + escAttr(b.icon || 'fa-star') + '"></i> ' + escHtml(b.label) + '</button>'
      : '<a href="' + escAttr(b.href || '#') + '" class="btn-edquest text-base" style="' + (CTA_STYLES[b.style] || CTA_STYLES.light) + '"><i class="fas ' + escAttr(b.icon || 'fa-eye') + '"></i> ' + escHtml(b.label) + '</a>'
  ).join('\n        ');
  return '<h2 class="text-3xl sm:text-4xl font-extrabold mb-4" style="color:var(--text-primary);">' + escHtml(s.title || 'Siap Memulai Perjalanan Belajar?') + '</h2>' +
    '<p class="text-lg mb-8 max-w-lg mx-auto" style="color:var(--text-secondary);">' + escHtml(s.subtitle || '') + '</p>' +
    '<div class="flex flex-wrap justify-center gap-3">\n        ' + (buttons || '') + '\n      </div>';
}

const CTA_STYLES = {
  primary: 'background:var(--gradient-primary); color:#fff; font-weight:700; box-shadow:0 4px 14px rgba(37,99,235,0.35);',
  light: 'background:var(--primary-light); color:var(--primary); border:1.5px solid rgba(37,99,235,0.3);',
  accent: 'background:var(--accent); color:#fff; font-weight:700; box-shadow:0 4px 14px rgba(2,132,199,0.35);'
};

export function renderHome() {
  const hero = heroContent();
  const decor = heroDecor();
  return `
<section class="hero-section min-h-[86vh] flex items-center pt-20 pb-14">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 w-full">
    <div class="hero-grid">
      <div class="text-center lg:text-left">
        <div class="hero-badge mb-6 mx-auto lg:mx-0 reveal">
          <i class="fas ${hero.badgeIcon} text-sm"></i>
          ${hero.badge}
        </div>
        <h1 class="hero-title mb-6 reveal reveal-stagger-1">
          ${hero.title}
        </h1>
        <p class="hero-lead mb-8 mx-auto lg:mx-0 reveal reveal-stagger-2">
          ${hero.description}
        </p>
        <div class="flex flex-wrap gap-3 justify-center lg:justify-start reveal reveal-stagger-3">
          ${hero.ctaButtons}
        </div>
      </div>
      <div class="hero-hook-stage">
        <div class="hero-blob hero-blob-a" aria-hidden="true"></div>
        <div class="hero-blob hero-blob-b" aria-hidden="true"></div>
        ${decor.lines}
        <p class="hero-hand" aria-hidden="true">
          ${decor.phrase}
        </p>
        ${decor.marks}
        <div class="hero-hook-grid">
                ${hookCards() || '<p class="text-sm" style="color:var(--text-muted);">Fitur segera hadir</p>'}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="quick-search-section">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
    ${quickSearchSection()}
  </div>
</section>

<section class="relative z-10 -mt-10 pb-12" style="background:transparent;">
  <div class="max-w-5xl mx-auto px-4 sm:px-6">
    <div class="card-panel overflow-hidden reveal" style="box-shadow:var(--shadow-lg);">
      <div class="metric-strip">
        ${heroStats()}
      </div>
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12 reveal">
      ${iceBreakerSection()}
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${iceCards()}
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12 reveal">
      ${featuresSection()}
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${featureCards()}
    </div>
  </div>
</section>

<section class="py-16 lg:py-20 cta-section" style="background:var(--gradient-hero);">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div class="cta-panel fx-card text-center reveal reveal-scale">
      ${ctaSection()}
    </div>
  </div>
</section>
`; }

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

export function initHomeSearch() {
  const input = document.getElementById('homeSearchInput');
  const dropdown = document.getElementById('homeSearchAc');
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
