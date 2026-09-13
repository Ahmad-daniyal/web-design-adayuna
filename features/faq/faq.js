import { injectStyle } from '../../js/utils/styleLoader.js';
import { dataStore } from '../../js/data/index.js';

injectStyle('features/faq/css/faq.css');

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function faqItems() {
  const items = (dataStore.faq && dataStore.faq.items) || [];
  return items.map((it, i) =>
    '<div class="card-panel overflow-hidden">' +
      '<button class="faq-toggle w-full text-left p-5 flex items-center justify-between" aria-expanded="false">' +
        '<span class="font-semibold text-sm text-slate-900 dark:text-slate-100"><i class="fas ' + (it.icon || 'fa-circle-question') + ' mr-2 text-slate-500 dark:text-slate-400"></i>' + esc(it.q) + '</span>' +
        '<i class="fas fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"></i>' +
      '</button>' +
      '<div class="faq-panel" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">' +
        '<p class="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">' + esc(it.a) + '</p>' +
      '</div>' +
    '</div>'
  ).join('\n      ');
}

export function renderFaq() { return `
<section class="pt-16 md:pt-20 pb-4">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div class="max-w-3xl">
      <span class="section-badge"><i class="fas ${esc((dataStore.faq && dataStore.faq.hero && dataStore.faq.hero.badge) || 'fa-question-circle')}"></i> ${esc((dataStore.faq && dataStore.faq.hero && dataStore.faq.hero.badgeText) || 'FAQ & Kontak')}</span>
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">${esc((dataStore.faq && dataStore.faq.hero && dataStore.faq.hero.title) || 'Punya Pertanyaan?')}</h1>
      <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">${esc((dataStore.faq && dataStore.faq.hero && dataStore.faq.hero.subtitle) || '')}</p>
    </div>
  </div>
</section>

<section class="py-10">
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <h2 class="text-2xl font-extrabold mb-6 text-center text-slate-900 dark:text-slate-100">${esc((dataStore.faq && dataStore.faq.sectionTitle) || 'Pertanyaan Umum')}</h2>
    <div class="space-y-3" id="faqAccordion">
      ${faqItems()}
    </div>
  </div>
</section>

<section class="py-12" style="background:var(--bg-section);">
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <h2 class="text-2xl font-extrabold mb-6 text-center text-slate-900 dark:text-slate-100">${esc((dataStore.faq && dataStore.faq.contact && dataStore.faq.contact.sectionTitle) || 'Kirim Pesan')}</h2>
    <form class="card-panel !p-6" onsubmit="App.submitContact(event)">
      <div class="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="form-label" for="contactName">Nama</label>
          <input id="contactName" type="text" class="form-input" placeholder="Nama panggilanmu" required>
        </div>
        <div>
          <label class="form-label" for="contactEmail">Email</label>
          <input id="contactEmail" type="email" class="form-input" placeholder="nama@email.com" required>
        </div>
      </div>
      <div class="mb-4">
        <label class="form-label" for="contactSubject">Subjek</label>
        <input id="contactSubject" type="text" class="form-input" placeholder="Apa yang ingin kamu sampaikan?" required>
      </div>
      <div class="mb-6">
        <label class="form-label" for="contactMessage">Pesan</label>
        <textarea id="contactMessage" rows="4" class="form-input resize-none" placeholder="Tulis pesanmu di sini..." required></textarea>
      </div>
      <button type="submit" class="btn-edquest btn-primary-grad w-full"><i class="fas fa-paper-plane"></i> Kirim Pesan</button>
    </form>
  </div>
</section>
`; }

function initFaqAccordion() {
  const container = document.getElementById('faqAccordion');
  if (!container) return;
  container.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      container.querySelectorAll('.faq-toggle').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const icon = b.querySelector('i');
        if (icon) icon.style.transform = '';
        if (b.nextElementSibling) b.nextElementSibling.style.maxHeight = '0';
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        const icon = btn.querySelector('i');
        if (icon) icon.style.transform = 'rotate(180deg)';
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

window.addEventListener('pageChanged', (e) => {
  if (e.detail.pageName === 'faq') setTimeout(() => initFaqAccordion(), 50);
});
