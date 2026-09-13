import { injectStyle } from '../../js/utils/styleLoader.js';
import { dataStore } from '../../js/data/index.js';

injectStyle('features/about/css/about.css');

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function renderAbout() {
  const d = dataStore.about || {};
  const hero = d.hero || {};
  const latar = d.latarBelakang || {};
  const visiData = d.visi || {};
  const stepsData = d.steps || {};
  const quote = latar.quote || {};

  const paragraphs = (latar.paragraphs || []).map(p =>
    '<p>' + p + '</p>'
  ).join('\n          ');

  const misiItems = (visiData.misi || []).map(m =>
    '<div class="card-panel p-6 text-center">' +
      '<div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas ' + (m.icon || 'fa-star') + '"></i></div>' +
      '<h4 class="text-sm font-bold mb-2 text-slate-900 dark:text-slate-100">' + esc(m.title) + '</h4>' +
      '<p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">' + esc(m.desc) + '</p>' +
    '</div>'
  ).join('\n        ');

  const stepItems = (stepsData.items || []).map(s =>
    '<div class="text-center">' +
      '<div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white" style="background:var(--gradient-primary);">' + (s.num || '') + '</div>' +
      '<h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">' + esc(s.title) + '</h3>' +
      '<p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">' + esc(s.desc) + '</p>' +
    '</div>'
  ).join('\n      ');

  return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="section-badge"><i class="fas ${esc(hero.badge || 'fa-info-circle')}"></i> ${esc(hero.badgeText || 'Tentang Edquest')}</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">${hero.title || ''}</h1>
      <p class="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">${esc(hero.subtitle || '')}</p>
    </div>
  </div>
</section>

<section class="py-14 lg:py-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span class="section-badge"><i class="fas ${esc(latar.badge || 'fa-question-circle')}"></i> ${esc(latar.badgeText || 'Latar Belakang')}</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-6 text-slate-900 dark:text-slate-100">${esc(latar.title || 'Kenapa Edquest Dibuat?')}</h2>
        <div class="space-y-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          ${paragraphs}
        </div>
      </div>
      <div class="flex items-center justify-center">
        <div class="card-panel p-8 text-center max-w-sm">
          <div class="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas ${esc(quote.icon || 'fa-lightbulb')}"></i></div>
          <blockquote class="text-sm italic leading-relaxed text-slate-500 dark:text-slate-400">${quote.text || ''}</blockquote>
          <p class="text-xs font-medium mt-3 text-slate-400 dark:text-slate-500">${esc(quote.by || '')}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-14 lg:py-16" style="background:var(--bg-section);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      <span class="section-badge"><i class="fas ${esc(visiData.badge || 'fa-bullseye')}"></i> ${esc(visiData.badgeText || 'Visi & Misi')}</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3 text-slate-900 dark:text-slate-100">${esc(visiData.title || 'Arah dan Tujuan Kami')}</h2>
    </div>
    <div class="max-w-3xl mx-auto">
      <div class="card-panel p-8 mb-8 text-center">
        <i class="fas fa-eye text-3xl mb-4 text-slate-600 dark:text-slate-300"></i>
        <h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Visi</h3>
        <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">${esc(visiData.visi || '')}</p>
      </div>
      <div class="grid sm:grid-cols-3 gap-4">
        ${misiItems}
      </div>
    </div>
  </div>
</section>

<section class="py-14 lg:py-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="text-center mb-12">
      <span class="section-badge"><i class="fas ${esc(stepsData.badge || 'fa-cogs')}"></i> ${esc(stepsData.badgeText || 'Cara Kerja')}</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3 text-slate-900 dark:text-slate-100">${esc(stepsData.title || 'mudah, Kok!')}</h2>
      <p class="text-lg text-slate-500 dark:text-slate-400">${esc(stepsData.subtitle || '')}</p>
    </div>
    <div class="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
      ${stepItems}
    </div>
  </div>
</section>
`; }