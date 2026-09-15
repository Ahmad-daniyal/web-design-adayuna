import { CONFIG } from './config.js';
import { dataStore } from '../data/index.js';

const CAT_LABELS = CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.label; return o; }, {});
const CAT_ICONS = CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.icon; return o; }, {});
const MINAT_LABELS = CONFIG.MINAT.reduce((o, m) => { o[m.key] = m.label; return o; }, {});

function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function tagLabel(t) { return CAT_LABELS[t] || MINAT_LABELS[t] || (t ? t.charAt(0).toUpperCase() + t.slice(1) : ''); }

const PAGE_ENTRIES = [
  { page: 'match', title: 'Arena Duel Kuis Cerdas', desc: 'Arena duel, kuis, ranked, classic, leaderboard, tier, poin, badge, soal', icon: 'fa-bolt', source: 'Halaman' },
  { page: 'friend', title: 'Study Buddy Matching', desc: 'Teman belajar, matching, mapel, minat, kelas, cari teman', icon: 'fa-user-friends', source: 'Halaman' },
  { page: 'forum', title: 'Forum Diskusi', desc: 'Forum diskusi, thread, topik, komunitas, balasan, komentar', icon: 'fa-comments', source: 'Halaman' },
  { page: 'home', title: 'Beranda', desc: 'Beranda, ice breaker, fitur unggulan, progress, mulai', icon: 'fa-home', source: 'Halaman' },
  { page: 'about', title: 'Tentang Edquest', desc: 'Tentang Edquest, visi, misi, latar belakang, langkah kerja', icon: 'fa-info-circle', source: 'Halaman' },
  { page: 'faq', title: 'Pertanyaan Umum (FAQ)', desc: 'FAQ, anonimitas, poin, badge, jurnal, keamanan data, pengaturan, bantuan', icon: 'fa-question-circle', source: 'Halaman' },
  { page: 'profile', title: 'Profil & Progress', desc: 'Profil, jurnal belajar, badge, poin, statistik, akun, progress', icon: 'fa-user', source: 'Halaman' },
];

function aboutKeywords() {
  const d = dataStore.about || {};
  const parts = [];
  const push = (v) => { if (v) parts.push(String(v)); };
  push('about');
  push('tentang');
  push('tentang edquest');
  push(d.hero && d.hero.title);
  push(d.hero && d.hero.subtitle);
  push(d.latarBelakang && d.latarBelakang.title);
  ((d.latarBelakang && d.latarBelakang.paragraphs) || []).forEach(push);
  push(d.latarBelakang && d.latarBelakang.quote && d.latarBelakang.quote.text);
  push(d.visi && d.visi.title);
  push(d.visi && d.visi.visi);
  ((d.visi && d.visi.misi) || []).forEach(m => { push(m.title); push(m.desc); });
  push(d.steps && d.steps.title);
  push(d.steps && d.steps.subtitle);
  ((d.steps && d.steps.items) || []).forEach(s => { push(s.title); push(s.desc); });
  return parts.join(' ').toLowerCase();
}

function pageMatches(q) {
  const ql = q.toLowerCase().trim();
  return PAGE_ENTRIES.filter(e => {
    const extra = e.page === 'about' ? ' ' + aboutKeywords() : '';
    return ((e.title + ' ' + e.desc + extra).toLowerCase()).includes(ql);
  }).map(e => ({ type: 'page', page: e.page, title: e.title, desc: e.desc, icon: e.icon, source: e.source }));
}

function esc(s) { return String(s == null ? '' : s); }

export function searchEverything(q) {
  const ql = (q || '').toLowerCase().trim();
  if (!ql) return [];
  const items = [];

  items.push(...pageMatches(ql));

  if (dataStore.forum && dataStore.forum.length) {
    dataStore.forum.forEach((t, idx) => {
      const hay = (esc(t.title) + ' ' + esc(t.subtitle) + ' ' + (CAT_LABELS[t.category] || '')).toLowerCase();
      if (esc(t.title).toLowerCase().includes(ql) || esc(t.subtitle).toLowerCase().includes(ql) || (t.category && (CAT_LABELS[t.category] || '').toLowerCase().includes(ql))) {
        items.push({ type: 'forum', ref: t, idx, title: esc(t.title), desc: CAT_LABELS[t.category] || t.category, icon: CAT_ICONS[t.category] || 'fa-book', source: CAT_LABELS[t.category] || t.category });
      }
    });
  }

  if (dataStore.buddies && dataStore.buddies.length) {
    dataStore.buddies.forEach((b, idx) => {
      const name = esc(b.name || '').toLowerCase();
      const mapel = (CAT_LABELS[b.mapel] || '').toLowerCase();
      const kelas = esc(b.kelas || '').toLowerCase();
      const minat = (MINAT_LABELS[b.minat] || '').toLowerCase();
      if (name.includes(ql) || mapel.includes(ql) || kelas.includes(ql) || minat.includes(ql)) {
        items.push({ type: 'buddy', ref: b, idx, title: esc(b.name), desc: (b.kelas ? 'Kelas ' + b.kelas + ' · ' : '') + mapel + (b.minat ? ' · ' + minat : ''), icon: 'fa-user-group', source: 'Study Buddy' });
      }
    });
  }

  if (dataStore.questions && dataStore.questions.length) {
    const byMapel = {};
    dataStore.questions.forEach(x => { if ((esc(x.q) + ' ' + (CAT_LABELS[x.mapel] || '')).toLowerCase().includes(ql)) { byMapel[x.mapel] = (byMapel[x.mapel] || 0) + 1; } });
    Object.entries(byMapel).slice(0, 3).forEach(([mk, cnt]) => {
      items.push({ type: 'question', page: 'match', title: cnt + ' soal ' + (CAT_LABELS[mk] || mk) + ' cocok', desc: CAT_LABELS[mk] || mk, icon: 'fa-circle-question', source: 'Arena Soal' });
    });
  }

  if (dataStore.faq && dataStore.faq.items) {
    dataStore.faq.items.forEach(item => {
      if ((esc(item.q) + ' ' + esc(item.a || '')).toLowerCase().includes(ql)) {
        items.push({ type: 'faq', page: 'faq', title: esc(item.q), desc: esc(item.a || '').slice(0, 60) + (item.a && item.a.length > 60 ? '...' : ''), icon: item.icon || 'fa-question-circle', source: 'FAQ' });
      }
    });
  }

  if (dataStore.home && dataStore.home.iceBreakers) {
    dataStore.home.iceBreakers.forEach(ice => {
      const text = (esc(ice.text || '') + ' ' + (ice.tags || []).map(tagLabel).join(' ')).toLowerCase();
      if (text.includes(ql) || (ice.tags || []).some(t => tagLabel(t).toLowerCase().includes(ql))) {
        items.push({ type: 'ice', page: 'home', title: esc((ice.text || '').slice(0, 60)), desc: (ice.tags || []).map(tagLabel).join(', '), icon: 'fa-comment-dots', source: 'Ice Breaker' });
      }
    });
  }

  if (dataStore.home && dataStore.home.featuresSection && dataStore.home.featuresSection.features) {
    dataStore.home.featuresSection.features.forEach(f => {
      if ((esc(f.title || '') + ' ' + esc(f.desc || '')).toLowerCase().includes(ql)) {
        items.push({ type: 'feature', page: 'home', title: esc(f.title), desc: esc(f.desc || '').slice(0, 60), icon: f.icon || 'fa-star', source: 'Fitur' });
      }
    });
  }

  return items;
}

export function openResult(r) {
  const Router = window.Router;
  const Forum = window.Forum;
  if (!Router) return;
  switch (r.type) {
    case 'forum': {
      const thread = r.idx !== undefined ? dataStore.forum[r.idx] : null;
      Router.navigate('forum');
      if (thread) { const cur = dataStore.forum.indexOf(thread); setTimeout(function() { if (Forum && cur >= 0) Forum.openThread(cur); }, 250); }
      break;
    }
    case 'buddy':
      Router.navigate('friend');
      break;
    default:
      Router.navigate(r.page);
  }
}

export function sacHTML(items) {
  if (!items.length) return '<div class="sac-empty">Tidak ditemukan</div>';
  return items.slice(0, 8).map(r => {
    const descHtml = r.desc ? '<div class="sac-desc">' + escHtml(r.desc) + '</div>' : '';
    return '<div class="sac-item" data-si-type="' + r.type + '" data-si-page="' + r.page + '" data-si-idx="' + (r.idx !== undefined ? r.idx : '') + '">' +
      '<i class="fas ' + r.icon + ' sac-icon"></i>' +
      '<span class="sac-body"><span class="sac-title">' + escHtml(r.title) + '</span>' + descHtml + '</span>' +
      '<span class="sac-source">' + escHtml(r.source) + '</span>' +
    '</div>';
  }).join('');
}

export function bindSacItems(container, closeFn) {
  container.querySelectorAll('.sac-item').forEach(el => {
    el.addEventListener('click', () => {
      const type = el.dataset.siType;
      const page = el.dataset.siPage;
      const idx = el.dataset.siIdx !== '' ? Number(el.dataset.siIdx) : undefined;
      container.classList.remove('open');
      if (closeFn) closeFn();
      openResult({ type, page, idx });
    });
    el.addEventListener('mouseenter', () => {
      container.querySelectorAll('.sac-item').forEach(e => e.classList.remove('focused'));
      el.classList.add('focused');
    });
  });
}

export function bindKeydown(input, dropdown) {
  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.sac-item');
    if (!items.length) return;
    let focused = [...items].findIndex(el => el.classList.contains('focused'));
    if (e.key === 'ArrowDown') { e.preventDefault(); focused = Math.min(focused + 1, items.length - 1); items.forEach(function(el, i) { el.classList.toggle('focused', i === focused); }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focused = Math.max(focused - 1, 0); items.forEach(function(el, i) { el.classList.toggle('focused', i === focused); }); }
    else if (e.key === 'Enter' && focused >= 0) { e.preventDefault(); items[focused].click(); }
    else if (e.key === 'Tab' && focused >= 0) { e.preventDefault(); items[focused].click(); }
  });
}
