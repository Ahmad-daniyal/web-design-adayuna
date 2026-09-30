import { CONFIG } from '../core/config.js';
import { Auth } from './auth.js';
import { Profile } from './profile.js';
import { AI } from './ai.js';
import { Notifications } from './notifications.js';
import { ScrollAnimation } from '../core/scrollAnimation.js';
import { newNoteId, refOf, buildSampleEntries } from '../utils/journalSamples.js';

export const Notes = (() => {
  const JOURNAL_POINTS = CONFIG.LIMITS.JOURNAL_POINTS;

  const MAPEL_LABELS = Object.assign(
    { umum: 'Umum' },
    CONFIG.MAPELS.reduce((o, m) => { o[m.key] = m.label; return o }, {})
  );

  // Estado halaman. Container di dalam #app dibangun ulang tiap kali route
  // berubah, jadi semua state ini selalu di-set ulang pada init().
  let entry = null;
  let ref = '';
  let busy = '';
  // Form "Catat Hari Ini" ditutup lagi setiap kali halaman dirender ulang,
  // supaya catatan yang baru saja disimpan tidak menyisakan form kosong.
  let formOpen = false;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function mapelLabel(key) {
    return MAPEL_LABELS[key] || capitalize(String(key || 'umum'));
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function relativeTime(iso) {
    if (!iso) return 'Baru saja';
    const t = new Date(iso).getTime();
    if (isNaN(t)) return 'Baru saja';
    const diff = Date.now() - t;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Baru saja';
    if (m < 60) return m + ' menit lalu';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' jam lalu';
    const d = Math.floor(h / 24);
    if (d === 1) return 'Kemarin';
    if (d < 7) return d + ' hari lalu';
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Ref catatan hanya dibaca di mode detail. Kalau ref-nya sudah tidak ada
  // (mis. catatan dihapus dari perangkat lain atau tautannya lama), kembalikan
  // null supaya halaman turun ke mode daftar — bukan diam-diam membuka catatan
  // lain yang tidak diminta.
  function resolve(user, wanted) {
    const list = (user && user.journal) || [];
    if (!wanted || !list.length) return null;
    const byId = list.find(e => e && e.id === wanted);
    if (byId) return { entry: byId, ref: wanted };
    const m = /^idx-(\d+)$/.exec(wanted);
    if (m) {
      const found = list[Number(m[1])];
      if (found) return { entry: found, ref: wanted };
    }
    return null;
  }

  function init(params) {
    bindEvents();
    const p = params || new URLSearchParams();
    ref = p.get('note') || '';
    busy = '';
    formOpen = false;
    bindForm();
    render();
  }

  /* ===== Render ===== */

  function render() {
    const user = Auth.getUser();
    const els = {
      title: document.getElementById('notesTitle'),
      meta: document.getElementById('notesMeta'),
      back: document.getElementById('notesBack'),
      addBtn: document.getElementById('addNoteBtn'),
      listMode: document.getElementById('notesListMode'),
      list: document.getElementById('notesList'),
      form: document.getElementById('notesForm'),
      detailMode: document.getElementById('notesDetailMode'),
      body: document.getElementById('notesBody'),
      actions: document.getElementById('notesAiActions'),
      results: document.getElementById('notesAiResults'),
      switcher: document.getElementById('notesSwitcher')
    };
    if (!els.listMode || !els.detailMode || !els.list || !els.body || !els.actions || !els.results) return;

    const found = user ? resolve(user, ref) : null;

    // Tamu selalu lihat kartu terkunci, baik di daftar maupun di detail.
    if (!user) {
      entry = null;
      showList(els, found ? null : ref);
      setText(els.title, 'Jurnal Belajar');
      setMeta(els.meta, '');
      setHtml(els.list, lockedCard());
      return;
    }

    // Tanpa ref (atau ref sudah usang) -> mode daftar.
    if (!found) {
      entry = null;
      showList(els, ref);
      renderList(user, els, ref);
      return;
    }

    entry = found.entry;
    ref = found.ref;
    const text = String(entry.text || '');
    const st = AI.stats(text);

    showDetail(els);
    setText(els.title, trimTo(text, 80) || 'Catatan Belajar');
    setMeta(els.meta,
      '<span class="category-tag ' + esc(entry.mapel || 'umum') + '">' + esc(mapelLabel(entry.mapel)) + '</span>' +
      '<span><i class="fas fa-clock mr-1"></i>' + esc(relativeTime(entry.time)) + '</span>' +
      '<span><i class="fas fa-circle-check mr-1"></i>+' + (Number(entry.points) || JOURNAL_POINTS) + ' poin</span>' +
      '<span><i class="fas fa-align-left mr-1"></i>' + st.words + ' kata</span>' +
      '<span><i class="fas fa-stopwatch mr-1"></i>±' + st.minutes + ' menit baca</span>');

    setHtml(els.body, noteCard(text));
    setHtml(els.switcher, switcher(user));
    renderActions();
    renderResults();
    ScrollAnimation.refresh();
  }

  /* ===== Mode daftar ===== */

  function renderList(user, els, staleRef) {
    const entries = (user && user.journal) || [];
    const done = entries.filter(e => e && e.ai).length;
    setText(els.title, 'Jurnal Belajar');
    setMeta(els.meta,
      '<span><i class="fas fa-layer-group mr-1"></i>' + entries.length + ' catatan</span>' +
      (done ? '<span><i class="fas fa-circle-check mr-1"></i>' + done + ' sudah dirangkum AI</span>' : '') +
      '<span><i class="fas fa-wand-magic-sparkles mr-1"></i>buka satu catatan untuk dibantu AI</span>');

    // Notifikasi kecil kalau tautan yang dibuka menunjuk catatan yang sudah
    // tidak ada, supaya user tahu kenapa mendarat di daftar.
    const notice = staleRef
      ? '<div class="card-panel notes-notice mb-4"><i class="fas fa-circle-info mr-2"></i>Catatan yang kamu buka sudah tidak ada, jadi daftar catatan ditampilkan.</div>'
      : '';

    const cards = entries.length
      ? entries.map((e, i) => buildNoteCard(e, i)).join('')
      : emptyListCard();

    setHtml(els.list, notice + cards);
    if (els.form) els.form.style.display = formOpen ? 'block' : 'none';
  }

  function buildNoteCard(entry, i) {
    if (!entry) return '';
    const text = String(entry.text || '');
    return '<a href="#/catatan?note=' + encodeURIComponent(refOf(entry, i)) + '" class="progress-card journal-card reveal reveal-stagger-' + ((i % 3) + 1) + '" title="Buka catatan ini dan minta bantuan AI">' +
      '<div class="flex items-start justify-between gap-3 mb-2">' +
        '<div class="flex items-center gap-2 flex-wrap">' +
          '<span class="category-tag ' + esc(entry.mapel || 'umum') + '">' + esc(mapelLabel(entry.mapel)) + '</span>' +
          // Catatan contoh perlu ditandai supaya jelas itu bukan catatan yang
          // ditulis user, dan kapan saja bisa dihapus.
          (entry.sample ? '<span class="status-tag notes-sample-tag"><i class="fas fa-wand-magic-sparkles mr-1"></i>Contoh</span>' : '') +
        '</div>' +
        '<span class="text-xs flex-shrink-0" style="color:var(--text-muted);">' + esc(relativeTime(entry.time)) + '</span>' +
      '</div>' +
      '<p class="text-sm leading-relaxed journal-text" style="color:var(--text-secondary);">' + esc(text) + '</p>' +
      '<div class="flex items-center justify-between gap-3 mt-3 text-xs" style="color:var(--primary);">' +
        '<span><i class="fas fa-circle-check mr-1"></i>+' + (Number(entry.points) || JOURNAL_POINTS) + ' poin</span>' +
        '<span class="flex items-center gap-2">' +
          '<span class="journal-open">' + (entry.ai ? '<i class="fas fa-circle-check mr-1"></i>Sudah dirangkum' : 'Minta bantuan AI') + ' <i class="fas fa-chevron-right text-[0.625rem] ml-1"></i></span>' +
          '<button class="notes-del" data-note-del="' + esc(refOf(entry, i)) + '" title="Hapus catatan ini" aria-label="Hapus catatan"><i class="fas fa-trash-can text-xs"></i></button>' +
        '</span>' +
      '</div>' +
    '</a>';
  }

  function emptyListCard() {
    return '<div class="card-panel !p-8 text-center">' +
      '<div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl" style="background:var(--accent-light);color:var(--accent);"><i class="fas fa-pen-nib"></i></div>' +
      '<h3 class="text-lg font-bold mb-1" style="color:var(--text-primary);">Belum ada catatan</h3>' +
      '<p class="text-sm mb-4" style="color:var(--text-secondary);">Klik <strong>Catat Hari Ini</strong> lalu tulislah apa saja yang sudah kamu pelajari. Kalau masih bingung, muat catatan contoh dulu supaya kelihatan cara menulisnya.</p>' +
      '<div class="flex flex-wrap items-center justify-center gap-2">' +
        '<button id="addNoteBtnEmpty" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4"><i class="fas fa-plus"></i> Catat Hari Ini</button>' +
        '<button data-load-samples class="btn-edquest btn-outline-glow text-sm !py-2 !px-4"><i class="fas fa-wand-magic-sparkles"></i> Muat catatan contoh</button>' +
      '</div>' +
    '</div>';
  }

  function showList(els, staleRef) {
    els.listMode.hidden = false;
    els.detailMode.hidden = true;
    if (els.back) els.back.hidden = true;
    // Di mode daftar tombol "Catat Hari Ini" selalu tampil, termasuk saat
    // ref yang dibuka sudah usang.
    if (els.addBtn) els.addBtn.hidden = false;
    setHtml(els.body, '');
    setHtml(els.actions, '');
    setHtml(els.results, '');
    setHtml(els.switcher, '');
  }

  function showDetail(els) {
    els.listMode.hidden = true;
    els.detailMode.hidden = false;
    if (els.back) els.back.hidden = false;
    if (els.addBtn) els.addBtn.hidden = true;
  }

  /* ===== Simpan & hapus catatan ===== */

  function bindForm() {
    const addBtn = document.getElementById('addNoteBtn');
    const emptyBtn = document.getElementById('addNoteBtnEmpty');
    const form = document.getElementById('notesForm');
    const cancelBtn = document.getElementById('cancelNoteBtn');
    const entryForm = document.getElementById('noteForm');
    if (form) form.style.display = formOpen ? 'block' : 'none';
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
      formOpen = false;
      if (form) form.style.display = 'none';
    });
    // Tombol "Catat Hari Ini" ada di header dan (kalau jurnal kosong) di dalam
    // kartu kosong, jadi keduanya pakai handler yang sama.
    [addBtn, emptyBtn].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (!Auth.isLoggedIn()) { Auth.openModal('register'); return; }
        formOpen = true;
        if (!form) return;
        form.style.display = 'block';
        const textEl = document.getElementById('noteText');
        if (textEl) textEl.focus();
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    if (!entryForm) return;
    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Auth.isLoggedIn()) { Auth.openModal('register'); return; }
      const mapelEl = document.getElementById('noteMapel');
      const textEl = document.getElementById('noteText');
      const mapel = mapelEl ? mapelEl.value : 'umum';
      const text = textEl ? textEl.value.trim() : '';
      if (!text) { Auth.showToast('Catatan tidak boleh kosong', 'error'); return; }

      const user = Auth.getUser();
      if (!user) return;
      user.journal = user.journal || [];
      const note = { id: newNoteId(), mapel, text, time: new Date().toISOString(), points: JOURNAL_POINTS };
      user.journal.unshift(note);
      Profile.persist(user);
      if (textEl) textEl.value = '';
      formOpen = false;

      const gained = Profile.addPoints(JOURNAL_POINTS);
      Auth.showToast(gained ? 'Catatan tersimpan! +' + JOURNAL_POINTS + ' poin' : 'Catatan tersimpan!', 'success');
      if (gained) {
        Notifications.push({
          type: 'journal',
          title: 'Catatan tersimpan!',
          message: '+' + JOURNAL_POINTS + ' poin · ' + mapelLabel(mapel),
          link: '#/catatan?note=' + encodeURIComponent(note.id)
        });
      }

      // Langsung buka catatannya supaya bisa langsung minta bantuan AI.
      const Router = window.Router;
      if (Router) Router.navigate('catatan', 'note=' + encodeURIComponent(note.id));
      else window.location.hash = '#/catatan?note=' + encodeURIComponent(note.id);
    });
  }

  function loadSamples() {
    const user = Auth.getUser();
    if (!user) { Auth.openModal('register'); return; }
    const samples = buildSampleEntries();
    if (!samples.length) return;
    user.journal = (user.journal || []).concat(samples);
    Profile.persist(user);
    Auth.showToast(samples.length + ' catatan contoh dimuat', 'success');
    render();
  }

  function deleteNote(target) {
    const user = Auth.getUser();
    if (!user || !user.journal) return;
    const list = user.journal;
    const i = list.findIndex((e, k) => refOf(e, k) === target);
    if (i < 0) return;
    const label = trimTo(list[i].text, 40) || 'catatan ini';
    if (!confirm('Hapus catatan "' + label + '"? Tindakan ini tidak bisa dibatalkan.')) return;
    // Poin yang sudah didapat sengaja tidak dikurangi: poin di sini adalah
    // penghargaan atas usaha belajar, bukan saldo.
    user.journal.splice(i, 1);
    Profile.persist(user);
    Auth.showToast('Catatan dihapus', 'info');
    if (ref === target) {
      const Router = window.Router;
      if (Router) Router.navigate('catatan');
      else window.location.hash = '#/catatan';
      render();
      return;
    }
    render();
  }

  function setText(el, text) { if (el) el.textContent = text; }
  function setHtml(el, html) { if (el) el.innerHTML = html; }
  function setMeta(el, html) { if (el) el.innerHTML = html; }

  function lockedCard() {
    return '<div class="card-panel !p-8 text-center">' +
      '<div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl" style="background:var(--accent-light);color:var(--accent);"><i class="fas fa-lock"></i></div>' +
      '<h3 class="text-lg font-bold mb-1" style="color:var(--text-primary);">Catatan kamu belum bisa dibuka</h3>' +
      '<p class="text-sm mb-4" style="color:var(--text-secondary);">Jurnal belajar disimpan di akunmu. Masuk dulu supaya AI bisa bantu merangkum catatanmu.</p>' +
      '<button data-action="register" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4"><i class="fas fa-user-plus"></i> Daftar Sekarang</button>' +
    '</div>';
  }

  function noteCard(text) {
    return '<div class="card-panel">' +
      '<div class="flex items-center justify-between mb-3">' +
        '<h3 class="text-sm font-bold text-slate-900 dark:text-slate-100"><i class="fas fa-quote-left mr-2 text-slate-400"></i>Isi Catatan</h3>' +
      '</div>' +
      '<p class="text-sm leading-relaxed whitespace-pre-wrap break-words" style="color:var(--text-secondary);">' + esc(text) + '</p>' +
    '</div>';
  }

  function switcher(user) {
    const list = (user && user.journal) || [];
    if (list.length < 2) return '';
    const items = list.map((e, i) => {
      const r = refOf(e, i);
      const active = r === ref;
      return '<button class="notes-switch-item' + (active ? ' active' : '') + '" data-note-ref="' + esc(r) + '">' +
        '<i class="fas fa-book-open mt-1 text-xs" style="color:var(--accent);"></i>' +
        '<span>' + esc(trimTo(String(e.text || ''), 90) || 'Catatan kosong') + '</span>' +
      '</button>';
    }).join('');

    return '<h4 class="font-bold text-sm mb-3 text-slate-900 dark:text-slate-100"><i class="fas fa-layer-group mr-2 text-slate-500 dark:text-slate-400"></i>Catatan Lainnya <span class="text-xs font-normal" style="color:var(--text-muted);">(' + list.length + ')</span></h4>' +
      '<div class="space-y-2">' + items + '</div>';
  }

  /* ===== Panel AI ===== */

  function renderActions() {
    const el = document.getElementById('notesAiActions');
    if (!el) return;
    if (!entry) { el.innerHTML = ''; return; }
    const done = entry.ai || {};
    el.innerHTML = AI.actions().map(a => {
      const isDone = !!done[a.key];
      const isBusy = busy === a.key;
      const hint = isBusy ? (AI.config().thinking || 'Memproses...') : (isDone ? 'Sudah dibuat · klik untuk ulang' : a.hint);
      return '<button class="ai-action" data-ai-action="' + esc(a.key) + '"' + (isBusy ? ' disabled' : '') + '>' +
        '<span class="ai-action-ico"><i class="fas ' + esc(a.icon || 'fa-sparkles') + '"></i></span>' +
        '<span class="flex-1 min-w-0">' +
          '<span class="ai-action-title">' + esc(a.label) + '</span>' +
          '<span class="ai-action-hint">' + esc(hint) + '</span>' +
        '</span>' +
        (isDone && !isBusy ? '<i class="fas fa-circle-check ai-action-done"></i>' : '') +
      '</button>';
    }).join('');
  }

  function renderResults() {
    const el = document.getElementById('notesAiResults');
    if (!el) return;
    if (!entry) { el.innerHTML = ''; return; }
    const done = entry.ai || {};
    const parts = AI.actions()
      .map(a => (done[a.key] ? resultCard(a, done[a.key]) : ''))
      .filter(Boolean);
    if (!parts.length) {
      el.innerHTML = '<div class="ai-thinking" style="border-style:solid;">' +
        '<i class="fas fa-hand-pointer text-xs"></i>' +
        '<span>Pilih salah satu fitur di atas untuk minta AI membantu catatannya.</span>' +
      '</div>';
      return;
    }
    el.innerHTML = parts.join('');
  }

  function resultCard(action, data) {
    switch (action.key) {
      case 'summary': return summaryCard(action, data);
      case 'keyPoints': return keyPointsCard(action, data);
      case 'nextSteps': return nextStepsCard(action, data);
      case 'quiz': return quizCard(action, data);
      default: return '';
    }
  }

  function cardHead(action, extra) {
    return '<div class="ai-card-head"><i class="fas ' + esc(action.icon || 'fa-sparkles') + '"></i>' + esc(action.label) +
      (extra ? '<span class="ml-auto" style="font-weight:600;text-transform:none;letter-spacing:0;">' + esc(extra) + '</span>' : '') +
      '</div>';
  }

  function summaryCard(action, data) {
    const bullets = (data && data.bullets) || [];
    return '<div class="ai-card">' +
      cardHead(action, 'Ringkasan') +
      '<p class="ai-short">' + esc(data.short || '') + '</p>' +
      (bullets.length
        ? '<div class="ai-list">' + bullets.map(b => '<div class="ai-bullet"><span>' + esc(b) + '</span></div>').join('') + '</div>'
        : '') +
    '</div>';
  }

  function keyPointsCard(action, data) {
    const points = Array.isArray(data) ? data : [];
    if (!points.length) return '';
    return '<div class="ai-card">' +
      cardHead(action, points.length + ' istilah') +
      '<div class="space-y-2">' + points.map(p =>
        '<div class="ai-term">' +
          '<div class="ai-term-head">' +
            '<span class="ai-term-name">' + esc(p.term) + '</span>' +
            (p.count ? '<span class="text-xs" style="color:var(--text-muted);">' + p.count + '×</span>' : '') +
          '</div>' +
          '<p class="ai-term-desc">' + esc(p.desc) + '</p>' +
        '</div>'
      ).join('') + '</div>' +
    '</div>';
  }

  function nextStepsCard(action, data) {
    const steps = Array.isArray(data) ? data : [];
    if (!steps.length) return '';
    return '<div class="ai-card">' +
      cardHead(action, steps.length + ' langkah') +
      '<div class="ai-list">' + steps.map((s, i) =>
        '<div class="ai-step">' +
          '<span class="ai-step-num">' + (i + 1) + '</span>' +
          '<span>' +
            '<span class="ai-step-title">' + esc(s.title) + '</span>' +
            '<span class="ai-step-desc">' + esc(s.desc) + '</span>' +
          '</span>' +
        '</div>'
      ).join('') + '</div>' +
    '</div>';
  }

  function quizCard(action, data) {
    const items = Array.isArray(data) ? data : [];
    if (!items.length) return '';
    return '<div class="ai-card">' +
      cardHead(action, items.length + ' soal · ' + (mapelLabel(items[0].mapel))) +
      '<div data-quiz-root>' + items.map((q, qi) =>
        '<div class="ai-quiz-item' + (qi < items.length - 1 ? ' mb-4' : '') + '" data-quiz-item data-answer="' + Number(q.answer) + '">' +
          '<p class="ai-quiz-q"><span class="ai-quiz-num">' + (qi + 1) + '</span>' + esc(q.q) + '</p>' +
          '<div class="ai-quiz-opts">' + (q.options || []).map((o, oi) =>
            '<button class="ai-quiz-opt" data-opt="' + oi + '"><span class="ai-quiz-key">' + 'ABCD'.charAt(oi) + '</span><span>' + esc(o) + '</span></button>'
          ).join('') + '</div>' +
          '<div class="ai-quiz-explain" data-quiz-explain hidden><i class="fas fa-lightbulb mr-1" style="color:var(--accent);"></i><strong>Pembahasan:</strong> ' + esc(q.explain) + '</div>' +
        '</div>'
      ).join('') + '</div>' +
      '<button class="ai-quiz-reset" data-quiz-reset hidden><i class="fas fa-rotate-left mr-1"></i>Ulangi latihan</button>' +
    '</div>';
  }

  /* ===== Aksi ===== */

  function runAction(key) {
    if (busy || !entry) return;
    busy = key;
    renderActions();
    renderResults();

    const delay = AI.thinkDelay();
    setTimeout(() => {
      busy = '';
      const user = Auth.getUser();
      const found = user ? resolve(user, ref) : null;
      // Kemungkinan pengguna logout atau berpindah catatan lewat tombol
      // back selama proses berjalan, jadi entri dicek ulang sebelum disimpan.
      if (!found) { render(); return; }

      const result = AI.generate(key, found.entry.text, found.entry.mapel, ref);
      if (!result) { render(); return; }

      found.entry.ai = found.entry.ai || {};
      found.entry.ai[key] = result;
      found.entry.ai.generatedAt = new Date().toISOString();
      found.entry.ai.version = 1;
      Profile.persist(user);
      render();
    }, delay);
  }

  function bindEvents() {
    const root = document.getElementById('app');
    if (!root || root.dataset.notesBound) return;
    root.dataset.notesBound = '1';

    root.addEventListener('click', (e) => {
      const action = e.target.closest('[data-ai-action]');
      if (action) { runAction(action.dataset.aiAction); return; }

      // Tombol hapus ada di dalam kartu catatan yang merupakan <a>, jadi
      // kliknya harus dicegat lebih dulu agar tidak ikut membuka catatan.
      const del = e.target.closest('[data-note-del]');
      if (del) {
        e.preventDefault();
        e.stopPropagation();
        deleteNote(del.dataset.noteDel);
        return;
      }

      const samples = e.target.closest('[data-load-samples]');
      if (samples) { e.preventDefault(); loadSamples(); return; }

      const switcher = e.target.closest('[data-note-ref]');
      if (switcher) {
        const Router = window.Router;
        const target = switcher.dataset.noteRef;
        if (Router) Router.navigate('catatan', 'note=' + encodeURIComponent(target));
        else window.location.hash = '#/catatan?note=' + encodeURIComponent(target);
        return;
      }

      const opt = e.target.closest('.ai-quiz-opt');
      if (opt) { answerQuiz(opt); return; }

      const reset = e.target.closest('[data-quiz-reset]');
      if (reset) { resetQuiz(reset); return; }
    });
  }

  function answerQuiz(opt) {
    const item = opt.closest('[data-quiz-item]');
    if (!item) return;
    const answer = Number(item.dataset.answer);
    const picked = Number(opt.dataset.opt);
    item.querySelectorAll('.ai-quiz-opt').forEach(o => {
      o.disabled = true;
      const i = Number(o.dataset.opt);
      if (i === answer) o.classList.add('correct');
      else if (i === picked) o.classList.add('wrong');
    });
    const explain = item.querySelector('[data-quiz-explain]');
    if (explain) explain.hidden = false;
    const reset = document.querySelector('[data-quiz-reset]');
    if (reset) reset.hidden = false;
  }

  function resetQuiz(reset) {
    document.querySelectorAll('[data-quiz-item]').forEach(item => {
      item.querySelectorAll('.ai-quiz-opt').forEach(o => {
        o.disabled = false;
        o.classList.remove('correct', 'wrong');
      });
      const explain = item.querySelector('[data-quiz-explain]');
      if (explain) explain.hidden = true;
    });
    reset.hidden = true;
  }

  function trimTo(s, max) {
    const str = String(s == null ? '' : s).trim().replace(/\s+/g, ' ');
    if (str.length <= max) return str;
    const cut = str.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + '...';
  }

  return { init };
})();