import { injectStyle } from '../../js/utils/styleLoader.js';
import { dataStore } from '../../js/data/index.js';

injectStyle('features/home/css/home.css');

const CTA_STYLES = {
  primary: 'background:var(--gradient-primary); color:#fff; font-weight:700; box-shadow:0 4px 14px rgba(37,99,235,0.35);',
  light: 'background:var(--primary-light); color:var(--primary); border:1.5px solid rgba(37,99,235,0.3);',
  accent: 'background:var(--accent); color:#fff; font-weight:700; box-shadow:0 4px 14px rgba(2,132,199,0.35);'
};

function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;'); }
const escapeAttr = escAttr;

function heroStats() {
  const stats = (dataStore.home && dataStore.home.stats) || [];
  if (!stats.length) return '';
  return stats.map(s => s && s.value != null
    ? '<div class="metric-item"><div class="metric-number">' + escHtml(s.value) + '</div><div class="metric-label">' + escHtml(s.label) + '</div></div>'
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
  return ice.map(c =>
    '<div class="ice-card fx-shine" data-copy="' + escapeAttr(c && c.copy) + '">' +
      '<i class="fas fa-quote-right quote-icon"></i>' +
      '<p class="text-sm font-medium leading-relaxed mb-3" style="color:var(--text-primary);">"' + ((c && c.text) || '') + '"</p>' +
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
  const baca = h.bacaDulu || {};

  const title = lines.map((line, i) =>
    i === highlight
      ? '<span class="hero-accent">' + escHtml(line) + '</span>'
      : escHtml(line)
  ).join('<br>\n          ');

  const ctaButtons = ctas.filter(c => c && c.label).map(c =>
    '<a href="' + escAttr(c.href || '#') + '" class="btn-edquest text-base" style="' + (CTA_STYLES[c.style] || CTA_STYLES.primary) + '">' +
      '<i class="fas ' + escAttr(c.icon || 'fa-arrow-right') + '"></i> ' + escHtml(c.label) + '</a>'
  ).join('\n          ');

  const tiles = ((h.tiles) || []).filter(t => t && t.label).map(t =>
    '<a href="' + escAttr(t.href || '#') + '" class="hero-tile hero-tile-enter" style="--tile-accent:' + escAttr(t.accent || '#2563EB') + '; animation:float 6s ease-in-out infinite; animation-delay:' + escAttr(t.delay || '0s') + ';">' +
      '<div class="glass-card hero-tile-card !p-5 text-center">' +
        '<div class="hero-tile-icon"><i class="fas ' + escAttr(t.icon || 'fa-star') + '"></i></div>' +
        '<p class="hero-tile-label text-xs font-medium mt-2">' + escHtml(t.label) + '</p>' +
        '<span class="hero-tile-cta"><i class="fas fa-arrow-right"></i> Buka</span>' +
      '</div>' +
    '</a>'
  ).join('\n              ');

  return {
    badge: badge,
    badgeIcon: h.icon || 'fa-sparkles',
    title,
    description: h.description || '',
    ctaButtons,
    bacaDulu: '<i class="fas ' + (baca.icon || 'fa-eye') + '"></i>\n          ' + escHtml(baca.text || '') + ' <a href="' + escAttr(baca.href || '#/forum') + '" style="font-weight:600; text-decoration:underline; text-underline-offset:2px;">' + escHtml(baca.linkText || 'Jelajahi Forum') + '</a>',
    heroVisual: '<div class="grid grid-cols-2 gap-4 p-4">\n                ' + (tiles || '<p class="text-sm" style="color:var(--text-muted);">Fitur segera hadir</p>') + '\n              </div>'
  };
}

function featureCards() {
  const section = (dataStore.home && dataStore.home.featuresSection) || {};
  const features = (section.features || []).filter(f => f && f.title);
  return features.map(f =>
    '<div class="feature-card fx-card text-center sm:text-left">' +
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

export function renderHome() {
  const hero = heroContent();
  return `
<section class="hero-section min-h-[85vh] flex items-center pt-20 pb-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 w-full">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="text-center md:text-left">
        <div class="hero-badge mb-6 mx-auto md:mx-0">
          <i class="fas ${hero.badgeIcon} text-sm"></i>
          ${hero.badge}
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style="color:var(--text-primary);">
          ${hero.title}
        </h1>
        <p class="text-lg sm:text-xl mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed" style="color:var(--text-secondary);">
          ${hero.description}
        </p>
        <div class="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          ${hero.ctaButtons}
        </div>
        <div class="baca-dulu mx-auto md:mx-0">
          ${hero.bacaDulu}
        </div>
      </div>
      <div class="hidden md:flex items-center justify-center">
        <div class="relative">
          <div class="w-80 h-80 rounded-full" style="background:radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%);"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            ${hero.heroVisual}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="relative z-10 -mt-16 pb-12" style="background:transparent;">
  <div class="max-w-5xl mx-auto px-4 sm:px-6">
    <div class="card-panel overflow-hidden" style="box-shadow:var(--shadow-lg);">
      <div class="metric-strip">
        ${heroStats()}
      </div>
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      ${iceBreakerSection()}
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${iceCards()}
    </div>
  </div>
</section>

<section class="py-16 lg:py-20" style="background:var(--bg-body);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      ${featuresSection()}
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${featureCards()}
    </div>
  </div>
</section>

<section class="py-16 lg:py-20 cta-section" style="background:var(--gradient-hero);">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div class="cta-panel fx-card text-center">
      ${ctaSection()}
    </div>
  </div>
</section>
`; }

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }