import { injectStyle } from '../../js/utils/styleLoader.js';
import { dataStore } from '../../js/data/index.js';
import { ScrollAnimation } from '../../js/core/scrollAnimation.js';

injectStyle('features/about/css/about.css');

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

const TABS = [
  { key: 'tentang', label: 'Tentang', icon: 'fa-info-circle' },
  { key: 'faq', label: 'FAQ', icon: 'fa-question-circle' },
  { key: 'kontak', label: 'Kontak', icon: 'fa-envelope' }
];

function tabBar(active) {
  return '<div class="page-tabs" role="tablist">' + TABS.map(t =>
    '<button class="page-tab' + (t.key === active ? ' active' : '') + '" role="tab" data-about-tab="' + t.key + '" aria-selected="' + (t.key === active ? 'true' : 'false') + '">' +
      '<i class="fas ' + t.icon + '"></i>' + esc(t.label) +
    '</button>'
  ).join('') + '</div>';
}

function aboutItems() {
  const d = dataStore.about || {};
  const latar = d.latarBelakang || {};
  const visiData = d.visi || {};
  const stepsData = d.steps || {};
  const quote = latar.quote || {};

  const paragraphs = (latar.paragraphs || []).map(p =>
    '<p>' + p + '</p>'
  ).join('\n            ');

  const misiItems = (visiData.misi || []).map((m, i) =>
    '<div class="card-panel p-6 text-center reveal reveal-stagger-' + (i + 1) + '">' +
      '<div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas ' + (m.icon || 'fa-star') + '"></i></div>' +
      '<h4 class="text-sm font-bold mb-2 text-slate-900 dark:text-slate-100">' + esc(m.title) + '</h4>' +
      '<p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">' + esc(m.desc) + '</p>' +
    '</div>'
  ).join('\n        ');

  const stepItems = (stepsData.items || []).map((s, i) =>
    '<div class="text-center reveal reveal-stagger-' + (i + 1) + '">' +
      '<div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white" style="background:var(--gradient-primary);">' + (s.num || '') + '</div>' +
      '<h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">' + esc(s.title) + '</h3>' +
      '<p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">' + esc(s.desc) + '</p>' +
    '</div>'
  ).join('\n      ');

  return '' +
  '<div class="grid md:grid-cols-2 gap-12 items-center">' +
    '<div class="reveal-left">' +
      '<span class="section-badge"><i class="fas ' + esc(latar.badge || 'fa-question-circle') + '"></i> ' + esc(latar.badgeText || 'Latar Belakang') + '</span>' +
      '<h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-6 text-slate-900 dark:text-slate-100">' + esc(latar.title || 'Kenapa Edquest Dibuat?') + '</h2>' +
      '<div class="space-y-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">' + paragraphs + '</div>' +
    '</div>' +
    '<div class="flex items-center justify-center reveal-right">' +
      '<div class="card-panel p-8 text-center max-w-sm">' +
        '<div class="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><i class="fas ' + esc(quote.icon || 'fa-lightbulb') + '"></i></div>' +
        '<blockquote class="text-sm italic leading-relaxed text-slate-500 dark:text-slate-400">' + (quote.text || '') + '</blockquote>' +
        '<p class="text-xs font-medium mt-3 text-slate-400 dark:text-slate-500">' + esc(quote.by || '') + '</p>' +
      '</div>' +
    '</div>' +
  '</div>' +

  '<div class="mt-14 lg:mt-16 text-center mb-12 reveal">' +
    '<span class="section-badge"><i class="fas ' + esc(visiData.badge || 'fa-bullseye') + '"></i> ' + esc(visiData.badgeText || 'Visi & Misi') + '</span>' +
    '<h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3 text-slate-900 dark:text-slate-100">' + esc(visiData.title || 'Arah dan Tujuan Kami') + '</h2>' +
  '</div>' +
  '<div class="max-w-3xl mx-auto">' +
    '<div class="card-panel p-8 mb-8 text-center reveal reveal-scale">' +
      '<i class="fas fa-eye text-3xl mb-4 text-slate-600 dark:text-slate-300"></i>' +
      '<h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Visi</h3>' +
      '<p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">' + esc(visiData.visi || '') + '</p>' +
    '</div>' +
    '<div class="grid sm:grid-cols-3 gap-4">' + misiItems + '</div>' +
  '</div>' +

  '<div class="mt-14 lg:mt-16 text-center mb-12 reveal">' +
    '<span class="section-badge"><i class="fas ' + esc(stepsData.badge || 'fa-cogs') + '"></i> ' + esc(stepsData.badgeText || 'Cara Kerja') + '</span>' +
    '<h2 class="text-3xl sm:text-4xl font-extrabold mt-4 mb-3 text-slate-900 dark:text-slate-100">' + esc(stepsData.title || 'Mudah, Kok!') + '</h2>' +
    '<p class="text-lg text-slate-500 dark:text-slate-400">' + esc(stepsData.subtitle || '') + '</p>' +
  '</div>' +
  '<div class="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">' + stepItems + '</div>';
}

function faqItems() {
  const items = (dataStore.faq && dataStore.faq.items) || [];
  return items.map((it, i) =>
    '<div class="card-panel overflow-hidden reveal reveal-stagger-' + ((i % 3) + 1) + '">' +
      '<button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">' +
        '<span class="font-semibold text-sm text-slate-900 dark:text-slate-100"><i class="fas ' + (it.icon || 'fa-circle-question') + ' mr-2 text-slate-500 dark:text-slate-400"></i>' + esc(it.q) + '</span>' +
        '<i class="fas fa-chevron-down faq-chevron text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"></i>' +
      '</button>' +
      '<div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">' +
        '<p class="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">' + esc(it.a) + '</p>' +
      '</div>' +
    '</div>'
  ).join('\n      ');
}

function faqItemsHTML() {
  const f = dataStore.faq || {};
  return '<div class="max-w-3xl mx-auto">' +
    '<h2 class="text-2xl font-extrabold mb-6 text-center reveal text-slate-900 dark:text-slate-100">' + esc(f.sectionTitle || 'Pertanyaan Umum') + '</h2>' +
    '<div class="space-y-3" id="faqAccordion">' + faqItems() + '</div>' +
  '</div>';
}

function contactHTML() {
  const c = (dataStore.faq && dataStore.faq.contact) || {};
  return '<div class="max-w-3xl mx-auto">' +
    '<h2 class="text-2xl font-extrabold mb-6 text-center reveal text-slate-900 dark:text-slate-100">' + esc(c.sectionTitle || 'Kirim Pesan') + '</h2>' +
    '<form class="card-panel !p-6 reveal reveal-scale" onsubmit="App.submitContact(event)">' +
      '<div class="grid sm:grid-cols-2 gap-4 mb-4">' +
        '<div>' +
          '<label class="form-label" for="contactName">Nama</label>' +
          '<input id="contactName" type="text" class="form-input" placeholder="Nama panggilanmu" required>' +
        '</div>' +
        '<div>' +
          '<label class="form-label" for="contactEmail">Email</label>' +
          '<input id="contactEmail" type="email" class="form-input" placeholder="nama@email.com" required>' +
        '</div>' +
      '</div>' +
      '<div class="mb-4">' +
        '<label class="form-label" for="contactSubject">Subjek</label>' +
        '<input id="contactSubject" type="text" class="form-input" placeholder="Apa yang ingin kamu sampaikan?" required>' +
      '</div>' +
      '<div class="mb-6">' +
        '<label class="form-label" for="contactMessage">Pesan</label>' +
        '<textarea id="contactMessage" rows="4" class="form-input resize-none" placeholder="Tulis pesanmu di sini..." required></textarea>' +
      '</div>' +
      '<button type="submit" class="btn-edquest btn-primary-grad w-full"><i class="fas fa-paper-plane"></i> ' + esc(c.sendLabel || 'Kirim Pesan') + '</button>' +
    '</form>' +
  '</div>';
}

export function renderAbout(params) {
  const hero = (dataStore.about && dataStore.about.hero) || {};
  const faqHero = (dataStore.faq && dataStore.faq.hero) || {};
  const p = params || new URLSearchParams();
  const wanted = p.get('tab');
  const active = TABS.some(t => t.key === wanted) ? wanted : 'tentang';

  const titles = {
    tentang: { badge: hero.badge, badgeText: hero.badgeText, title: hero.title, subtitle: hero.subtitle },
    faq: { badge: faqHero.badge, badgeText: faqHero.badgeText, title: faqHero.title, subtitle: faqHero.subtitle },
    kontak: { badge: 'fa-envelope', badgeText: 'Hubungi Kami', title: 'Mau Ngobrol?', subtitle: 'Ada yang mau ditanyakan atau hanya ingin menyapa? Tulis di sini, kami baca semuanya.' }
  };
  const h = titles[active];

  return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="section-badge reveal"><i class="fas ${esc(h.badge || 'fa-info-circle')}"></i> ${esc(h.badgeText || 'Tentang Edquest')}</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 reveal reveal-stagger-1 text-slate-900 dark:text-slate-100">${esc(h.title || 'Tentang Edquest')}</h1>
      <p class="mt-2 text-sm sm:text-base reveal reveal-stagger-2 text-slate-500 dark:text-slate-400">${esc(h.subtitle || '')}</p>
    </div>
    <div class="mt-8 reveal reveal-stagger-3">
      ${tabBar(active)}
    </div>
  </div>
</section>

<section class="pb-14 lg:pb-16">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div data-about-panel="tentang"${active === 'tentang' ? '' : ' hidden'}>${aboutItems()}</div>
    <div data-about-panel="faq"${active === 'faq' ? '' : ' hidden'}>${faqItemsHTML()}</div>
    <div data-about-panel="kontak"${active === 'kontak' ? '' : ' hidden'}>${contactHTML()}</div>
  </div>
</section>
`; }

/* Tab berpindah panel in-place tanpa mengubah hash. Kalau tab ditulis ke
   URL, setiap klik akan memicu render ulang Router sekaligus scrollToTop,
   sehingga posisi scroll pengguna melompat ke atas. Karena itu `?tab=` hanya
   dipakai untuk menentukan tab awal (deep-link dari navbar dan hasil
   pencarian), sedangkan klik tab berikutnya tetap di halaman. */
function initAboutTabs() {
  const bar = document.querySelector('.page-tabs');
  if (!bar || bar.dataset.tabBound) return;
  bar.dataset.tabBound = '1';

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-about-tab]');
    if (!btn) return;
    selectTab(btn.dataset.aboutTab);
  });
}

function selectTab(key) {
  const bar = document.querySelector('.page-tabs');
  if (!bar) return;
  bar.querySelectorAll('[data-about-tab]').forEach(b => {
    const on = b.dataset.aboutTab === key;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('[data-about-panel]').forEach(p => {
    p.hidden = p.dataset.aboutPanel !== key;
  });
  // Panel yang baru dibuka berisi elemen .reveal yang belum pernah
  // dipicu, jadi harus di-refresh supaya animasi masuknya berjalan.
  ScrollAnimation.refresh();
}

function initFaqAccordion() {
  const container = document.getElementById('faqAccordion');
  if (!container || container.dataset.faqBound) return;
  container.dataset.faqBound = '1';
  container.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      container.querySelectorAll('.faq-toggle').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const icon = b.querySelector('.faq-chevron');
        if (icon) icon.style.transform = '';
        if (b.nextElementSibling) b.nextElementSibling.style.maxHeight = '0';
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        const icon = btn.querySelector('.faq-chevron');
        if (icon) icon.style.transform = 'rotate(180deg)';
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

window.addEventListener('pageChanged', (e) => {
  if (e.detail.pageName !== 'about') return;
  setTimeout(() => {
    initAboutTabs();
    initFaqAccordion();
  }, 50);
});