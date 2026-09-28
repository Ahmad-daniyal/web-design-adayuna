import { CONFIG } from '../core/config.js';
import { dataStore } from '../data/index.js';
import { Auth } from './auth.js';
import { Notifications } from './notifications.js';
import { ScrollAnimation } from '../core/scrollAnimation.js';

const M = CONFIG.MATCH;
const TIERS = M.TIERS;
const POINTS = M.POINTS;
const MAPELS = CONFIG.MAPELS.map(m => m.key);
const TERR = M.TERRITORY;
const TERR_SIZE = TERR.GRID;
const TERR_TOTAL = TERR_SIZE * TERR_SIZE;
const TERR_STEP = Math.max(1, Math.round((TERR.STEP_PERCENT / 100) * TERR_TOTAL));
const TERR_DECAY = Math.max(0, Math.round((TERR.DECAY_CELLS / 100) * TERR_TOTAL));
const P_CLAIM = 0;
const P_OPP = 1;

export const BADGES = [
  { id: 'langkah-pertama', name: 'Langkah Pertama', icon: 'fa-shoe-prints', desc: 'Mainkan tanding pertamamu' },
  { id: 'streak-keren', name: 'Streak Keren', icon: 'fa-fire', desc: 'Jawab benar 3x beruntun' },
  { id: 'raja-sulit', name: 'Raja Sulit', icon: 'fa-crown', desc: 'Menang & benar di soal tingkat sulit' },
  { id: 'si-cerdas', name: 'Si Cerdas', icon: 'fa-brain', desc: 'Menang & benar di soal tingkat cerdas' },
  { id: 'naik-kelas', name: 'Naik Kelas', icon: 'fa-arrow-trend-up', desc: 'Naik ke tier baru' },
  { id: 'gladiator', name: 'Gladiator', icon: 'fa-shield-halved', desc: 'Menang dalam mode Ranked' },
  { id: 'legenda', name: 'Legenda', icon: 'fa-medal', desc: 'Mencapai tier Diamond' }
];

export const Match = (() => {
  let state = {
    screen: 'lobby',
    tab: 'duel',
    mode: 'ranked',
    mapel: 'matematika',
    opponent: null,
    questions: [],
    answers: [],
    index: 0,
    playerScore: 0,
    oppScore: 0,
    oppStreak: 0,
    streak: 0,
    hardCorrect: 0,
    geniusCorrect: 0,
    timeLeft: 0,
    total: 0,
    timer: null,
    advanceTimer: null,
    decayTimer: null,
    answered: false,
    decided: false,
    result: null,
    board: [],
    flash: null
  };

  window.addEventListener('pageChanged', (e) => {
    if (e.detail.pageName !== 'match') {
      clearTimer();
      clearAdvance();
      clearTimeout(state.findTimer);
      state.screen = 'lobby';
      state.tab = 'duel';
    }
  });

  function init() {
    if (!document.getElementById('matchRoot')) return;
    render();
  }

  function render() {
    const root = document.getElementById('matchRoot');
    if (!root) return;
    if (state.screen === 'lobby') renderLobby(root);
    else if (state.screen === 'finding') renderFinding(root);
    else if (state.screen === 'battle') renderBattle(root);
    else if (state.screen === 'result') renderResult(root);
  }

  /* ===== Lobby ===== */

  function renderLobby(root) {
    const user = Auth.getUser();
    const rp = rankPointsOf(user);
    const tier = tierOf(rp);
    root.innerHTML = `
      <span class="section-badge reveal"><i class="fas fa-bolt"></i> Arena Edquest</span>
      <div class="flex flex-wrap items-end justify-between gap-3 mt-3 reveal reveal-stagger-1">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight" style="color:var(--text-primary);">Adu Kecerdasan, Kumpulkan Rating!</h1>
          <p class="mt-1 text-sm sm:text-base" style="color:var(--text-secondary);">Jawab soal lebih cepat dari lawan, naikkan rank & raih badge.</p>
        </div>
        <div class="text-right">
          <div class="arena-rank-pill"><span class="tier-chip tier-${tier.toLowerCase()}">${tier}</span><span class="ml-2 font-extrabold" style="color:var(--text-primary);">${rp} rank</span></div>
          <div class="mt-2" style="min-width:220px;">${rankProgressHTML(rp)}</div>
        </div>
      </div>
      <div class="match-tabs mt-6 reveal reveal-stagger-2">
        <button class="match-tab${state.tab === 'duel' ? ' active' : ''}" onclick="Match.showDuel()"><i class="fas fa-hand-fist"></i> Duel</button>
        <button class="match-tab${state.tab === 'leaderboard' ? ' active' : ''}" onclick="Match.showLeaderboard()"><i class="fas fa-trophy"></i> Leaderboard</button>
      </div>
      <div class="mt-6">${state.tab === 'leaderboard' ? renderLeaderboard() : renderDuelPanel()}</div>
    `;
    ScrollAnimation.refresh();
  }

  function renderDuelPanel() {
    const modes = [
      { key: 'classic', icon: 'fa-fire', title: 'Classic', desc: 'Tanpa rating. Kumpulkan poin & badge dengan santai.', color: '#0EA5E9' },
      { key: 'ranked', icon: 'fa-trophy', title: 'Ranked', desc: 'Naikkan rank dari Bronze hingga Diamond.', color: '#2563EB' }
    ].map((m, i) =>
      '<button class="mode-card fx-card reveal reveal-stagger-' + (i + 1) + (state.mode === m.key ? ' active' : '') + '" onclick="Match.setMode(\'' + m.key + '\')">' +
      '<span class="mode-icon" style="background:' + m.color + ';"><i class="fas ' + m.icon + '"></i></span>' +
      '<span class="mode-name">' + m.title + '</span>' +
      '<span class="mode-desc">' + m.desc + '</span></button>'
    ).join('');

    const mapelOpts = MAPELS.map(m => '<option value="' + m + '"' + (state.mapel === m ? ' selected' : '') + '>' + cap(m) + '</option>').join('');

    return '<div class="card-panel p-5 sm:p-6 mb-6 reveal">' +
      '<h3 class="text-lg font-bold mb-4" style="color:var(--text-primary);"><i class="fas fa-sliders-h mr-2"></i>Pengaturan Duel</h3>' +
      '<div class="grid sm:grid-cols-2 gap-4">' + modes + '</div>' +
      '<div class="mt-4"><label class="form-label" for="matchMapel">Mapel</label><select id="matchMapel" class="form-input" style="cursor:pointer;" onchange="Match.setMapel(this.value)">' + mapelOpts + '</select></div>' +
      '<button class="btn-edquest btn-primary-grad w-full !py-3 mt-5 text-base" onclick="Match.startSearch()"><i class="fas fa-search"></i> Cari Lawan</button>' +
      '<div class="arena-info mt-5">' +
      '<div class="arena-info-item"><i class="fas fa-paint-roller"></i> Paint Area ' + TERR.GRID + '&times;' + TERR.GRID + ' sel — awal tanding 50/50 biru vs merah</div>' +
      '<div class="arena-info-item"><i class="fas fa-bolt"></i> Jawaban benar merebut ' + TERR.STEP_PERCENT + '% wilayah, salah kehilangan ' + TERR.STEP_PERCENT + '%</div>' +
      '<div class="arena-info-item"><i class="fas fa-list-ol"></i> ' + M.QUESTIONS_PER_MATCH + ' soal per tanding</div>' +
      '<div class="arena-info-item"><i class="fas fa-stopwatch"></i> Timer total ' + fmtTime(M.CLASSIC_SECONDS) + ' (Classic) / ' + fmtTime(M.RANKED_SECONDS) + ' (Ranked)</div>' +
      '<div class="arena-info-item"><i class="fas fa-ranking-star"></i> Rank = Rating + Badge&times;' + M.BADGE_RANK_POINTS + ' + Poin&divide;' + M.POINTS_TO_RANK + '</div>' +
      '<div class="arena-info-item"><i class="fas fa-fire"></i> Bonus +1 tiap ' + M.STREAK_BONUS_EVERY + ' jawaban benar beruntun</div>' +
      '</div></div>' +
      '<div class="card-panel p-5 reveal">' +
      '<h3 class="text-lg font-bold mb-3" style="color:var(--text-primary);"><i class="fas fa-info-circle mr-2"></i>Cara Bermain</h3>' +
      '<ol class="arena-steps">' +
      '<li>Pilih mode dan mapel. Rank kamu dipakai untuk mencocokkan lawan seimbang.</li>' +
      '<li>Klik "Cari Lawan" — arena Paint Area dibuka 50/50 dan timer mulai berjalan.</li>' +
      '<li>Jawab <b>benar</b> untuk merebut ' + TERR.STEP_PERCENT + '% wilayah biru, <b>salah</b> berarti lawan merebut ' + TERR.STEP_PERCENT + '% merah.</li>' +
      '<li>Saat wilayah mencapai <b>100% / 0%</b> tanding langsung selesai. Timer habis = wilayah saat itu yang menentukan.</li>' +
      '<li>Di mode Ranked, selisih wilayah mengubah rating &plusmn;' + M.RATING_CLAMP + '. Badge & poin ikut menaikkan rank.</li>' +
      '<li>Setelah tanding, lihat pembahasan lengkap semua soal beserta penjelasannya.</li>' +
      '</ol></div>';
    ScrollAnimation.refresh();
  }

  function renderLeaderboard() {
    const user = Auth.getUser();
    const list = getLeaderboard();
    if (!list.length) return '<div class="card-panel text-center p-8"><p style="color:var(--text-muted);">Belum ada data.</p></div>';
    const rows = list.map((e, i) => {
      const isMe = user && String(e.id) === String(user.id);
      const rp = e.rankPoints != null ? e.rankPoints : e.rating || 0;
      const t = tierOf(rp);
      let rank = i + 1;
      if (i === 0) rank = '<i class="fas fa-crown" style="color:#F59E0B;"></i>';
      else if (i === 1) rank = '<i class="fas fa-medal" style="color:#94A3B8;"></i>';
      else if (i === 2) rank = '<i class="fas fa-medal" style="color:#B45309;"></i>';
      return '<div class="lb-row reveal' + (isMe ? ' me' : '') + '">' +
        '<div class="lb-rank">' + rank + '</div>' +
        '<div class="lb-avatar" style="background:var(--gradient-primary);">' + esc(e.avatar || (e.name ? e.name[0] : '?')) + '</div>' +
        '<div class="lb-info"><div class="font-bold text-sm" style="color:var(--text-primary);">' + esc(e.name) + (isMe ? ' <span class="buddy-id">Kamu</span>' : '') + '</div>' +
        '<div class="text-xs" style="color:var(--text-muted);">' + (e.wins || 0) + 'W · ' + (e.losses || 0) + 'L · ' + (e.draws || 0) + 'D</div></div>' +
        '<span class="tier-chip tier-' + t.toLowerCase() + '">' + t + '</span>' +
        '<div class="lb-rating">' + rp + '</div></div>';
    }).join('');
    return '<div class="card-panel p-5 sm:p-6 reveal">' +
      '<h3 class="text-lg font-bold mb-4" style="color:var(--text-primary);"><i class="fas fa-trophy mr-2" style="color:var(--accent);"></i>Peringkat Teratas</h3>' +
      '<div class="lb-wrap">' + rows + '</div></div>';
    ScrollAnimation.refresh();
  }

  /* ===== Matchmaking ===== */

  function startSearch() {
    if (!Auth.isLoggedIn()) { Auth.openModal('login'); return; }
    state.screen = 'finding';
    render();
    state.questions = buildQuestions();
    state.opponent = pickOpponent();
    state.answers = [];
    state.hardCorrect = 0;
    state.geniusCorrect = 0;
    initBoard();
    clearTimeout(state.findTimer);
    state.findTimer = setTimeout(() => {
      state.index = 0;
      state.playerScore = 0;
      state.oppScore = 0;
      state.oppStreak = 0;
      state.streak = 0;
      state.answered = false;
      state.decided = false;
      state.result = null;
      initBoard();
      state.screen = 'battle';
      startTimer();
      render();
    }, 2200);
  }

  function buildQuestions() {
    const pool = dataStore.questions || [];
    let selected = pool.filter(q => q.mapel === state.mapel);
    if (selected.length < M.QUESTIONS_PER_MATCH) {
      selected = selected.concat(pool.filter(q => q.mapel !== state.mapel));
    }
    selected = shuffle(selected).slice(0, M.QUESTIONS_PER_MATCH);
    return selected.map(q => {
      const opts = shuffle(q.options.map((text, orig) => ({ text, orig })));
      return {
        mapel: q.mapel,
        difficulty: q.difficulty,
        q: q.q,
        options: opts.map(o => o.text),
        correctIndex: opts.findIndex(o => o.orig === q.answer),
        explain: q.explain || ''
      };
    });
  }

  function pickOpponent() {
    const current = Auth.getUser();
    const pool = dataStore.buddies || [];
    const candidates = pool.filter(b => !current || String(b.id) !== String(current.id));
    const b = candidates[Math.floor(Math.random() * candidates.length)] ||
      { name: 'Bot AI', initials: 'AI', color: 'linear-gradient(135deg,#38BDF8,#2563EB)', id: 0 };
    const rp = rankPointsOf(current);
    const tIdx = Math.max(0, tierIndex(tierOf(rp)));
    const acc = Math.min(0.93, Math.max(0.45, 0.5 + tIdx * 0.07 + (Math.random() * 0.06 - 0.03)));
    const rating = Math.max(0, rp + Math.round(Math.random() * 24 - 12));
    return {
      name: b.name,
      initials: b.initials || (b.name ? b.name[0].toUpperCase() : '?'),
      color: b.color,
      id: b.id,
      accuracy: acc,
      rating
    };
  }

  /* ===== Battle ===== */

  function renderFinding(root) {
    root.innerHTML = `
      <div class="card-panel text-center p-10 sm:p-14 reveal reveal-scale">
        <div class="arena-radar mx-auto"><i class="fas fa-satellite-dish"></i></div>
        <h2 class="text-xl font-bold mt-5 mb-2" style="color:var(--text-primary);">Mencari lawan seimbang...</h2>
        <p class="text-sm" style="color:var(--text-muted);">Menghubungkan ke Arena — ${cap(state.mapel)}</p>
        <div class="searching-dots mt-5"><span></span><span></span><span></span></div>
      </div>
    `;
    ScrollAnimation.refresh();
  }

  /* ===== Paint Area ===== */

  function initBoard() {
    const half = Math.round(TERR_TOTAL / 2);
    state.board = Array.from({ length: TERR_TOTAL }, (_, i) => (i < half ? P_OPP : P_CLAIM));
    state.flash = null;
  }

  function neighborsOf(i) {
    const r = Math.floor(i / TERR_SIZE);
    const c = i % TERR_SIZE;
    const out = [];
    if (r > 0) out.push(i - TERR_SIZE);
    if (r < TERR_SIZE - 1) out.push(i + TERR_SIZE);
    if (c > 0) out.push(i - 1);
    if (c < TERR_SIZE - 1) out.push(i + 1);
    return out;
  }

  function areaOf(owner, board) {
    const b = board && board.length ? board : state.board;
    if (!b.length) return 0;
    let n = 0;
    for (let i = 0; i < b.length; i++) if (b[i] === owner) n++;
    return Math.round((n / b.length) * 100);
  }

  function transfer(owner, count) {
    const enemy = owner === P_CLAIM ? P_OPP : P_CLAIM;
    const front = [];
    for (let i = 0; i < state.board.length; i++) {
      if (state.board[i] !== enemy) continue;
      const ns = neighborsOf(i);
      for (let k = 0; k < ns.length; k++) {
        if (state.board[ns[k]] === owner) { front.push(i); break; }
      }
    }
    let pool = front;
    if (pool.length < count) {
      for (let i = 0; i < state.board.length; i++) {
        if (state.board[i] === enemy && pool.indexOf(i) === -1) pool.push(i);
      }
    }
    const cells = shuffle(pool).slice(0, count);
    cells.forEach(i => { state.board[i] = owner; });
    return cells;
  }

  function readAreas() {
    return { playerArea: areaOf(P_CLAIM), oppArea: areaOf(P_OPP) };
  }

  function capture(owner) {
    const cells = transfer(owner, TERR_STEP);
    state.flash = { cells, owner, kind: 'claim' };
    const a = readAreas();
    return { cells, playerArea: a.playerArea, oppArea: a.oppArea, finished: a.playerArea >= 100 || a.oppArea >= 100 };
  }

  function decay() {
    if (!TERR_DECAY) return null;
    const a = readAreas();
    if (a.playerArea === a.oppArea) return null;
    const leader = a.playerArea > a.oppArea ? P_CLAIM : P_OPP;
    const trailing = leader === P_CLAIM ? P_OPP : P_CLAIM;
    const cells = transfer(trailing, TERR_DECAY);
    if (!cells.length) return null;
    state.flash = { cells, owner: trailing, kind: 'decay' };
    const b = readAreas();
    return { cells, owner: trailing, leader, playerArea: b.playerArea, oppArea: b.oppArea, lost: cells.length };
  }

  function boardCellsHTML(flash) {
    const delays = {};
    if (flash) flash.cells.forEach((idx, k) => { delays[idx] = k * 45; });
    const kind = flash && flash.kind === 'decay' ? 'bleed' : 'claim';
    let html = '';
    for (let i = 0; i < state.board.length; i++) {
      let cls = 'terr-cell ' + (state.board[i] === P_CLAIM ? 'p' : 'o');
      let style = '';
      if (delays[i] !== undefined) { cls += ' ' + kind; style = ' style="animation-delay:' + delays[i] + 'ms"'; }
      html += '<span class="' + cls + '"' + style + '></span>';
    }
    return html;
  }

  function paintBoard() {
    const wrap = document.getElementById('terrGrid');
    const flash = state.flash;
    state.flash = null;
    if (wrap) wrap.innerHTML = boardCellsHTML(flash);
    updateAreaUI();
  }

  function flashTerritory(owner, kind) {
    const panel = document.getElementById('territoryPanel');
    if (!panel) return;
    const isDecay = kind === 'decay';
    const on = isDecay ? (owner === P_CLAIM ? 'bleed-p' : 'bleed-o') : (owner === P_CLAIM ? 'flash-p' : 'flash-o');
    const dur = isDecay ? TERR.DECAY_ANIM_MS : TERR.CLAIM_ANIM_MS;
    panel.classList.remove('flash-p', 'flash-o', 'bleed-p', 'bleed-o');
    void panel.offsetWidth;
    panel.classList.add(on);
    setTimeout(() => { panel.classList.remove('flash-p', 'flash-o', 'bleed-p', 'bleed-o'); }, dur);
  }

  function updateAreaUI() {
    const pe = document.getElementById('terrAreaP');
    const oe = document.getElementById('terrAreaO');
    if (pe) pe.textContent = areaOf(P_CLAIM) + '%';
    if (oe) oe.textContent = areaOf(P_OPP) + '%';
    const sp = document.getElementById('terrScoreP');
    const so = document.getElementById('terrScoreO');
    if (sp) sp.textContent = state.playerScore;
    if (so) so.textContent = state.oppScore;
  }

  function territoryHTML() {
    const oppName = state.opponent ? esc(state.opponent.name) : 'Lawan';
    return '<div class="territory" id="territoryPanel">' +
      '<div class="territory-title"><i class="fas fa-paint-roller"></i> Paint Area</div>' +
      '<div class="territory-head">' +
        '<div class="terr-side p"><span class="terr-side-name"><i class="fas fa-bolt"></i> Kamu</span><span class="terr-area-pct" id="terrAreaP">50%</span></div>' +
        '<div class="terr-vs">±' + TERR.STEP_PERCENT + '%</div>' +
        '<div class="terr-side o"><span class="terr-area-pct" id="terrAreaO">50%</span><span class="terr-side-name">' + oppName + '</span></div>' +
      '</div>' +
      '<div class="terr-grid" id="terrGrid">' + boardCellsHTML(null) + '</div>' +
      '<div class="terr-points">Poin <b class="p" id="terrScoreP">0</b> <span class="terr-dash">—</span> <b class="o" id="terrScoreO">0</b> ' + oppName + '</div>' +
      '<div class="terr-legend">' +
        '<span class="terr-cap p"><i class="fas fa-circle-check"></i> Benar · rebut ' + TERR.STEP_PERCENT + '%</span>' +
        '<span class="terr-cap o"><i class="fas fa-circle-xmark"></i> Salah · -' + TERR.STEP_PERCENT + '%</span>' +
      '</div>' +
      '</div>';
  }

  function resultMapHTML(board) {
    const b = board && board.length ? board : state.board;
    let cells = '';
    for (let i = 0; i < b.length; i++) {
      cells += '<span class="terr-cell ' + (b[i] === P_CLAIM ? 'p' : 'o') + '"></span>';
    }
    return '<div class="result-map">' +
      '<div class="result-map-title"><i class="fas fa-map-location-dot"></i> Peta wilayah akhir</div>' +
      '<div class="terr-grid map">' + cells + '</div></div>';
  }

  function renderBattle(root) {
    const q = state.questions[state.index];
    const user = Auth.getUser();
    root.innerHTML = `
      <div class="match-topbar card-panel p-4 reveal">
        <div class="opponent-chip">
          <div class="opp-avatar" style="background:${state.opponent.color};">${esc(state.opponent.initials)}</div>
          <div>
            <div class="font-bold text-sm" style="color:var(--text-primary);">${esc(state.opponent.name)}</div>
            <div class="text-xs" style="color:var(--text-muted);">${state.mode === 'ranked' ? esc(tierOf(state.opponent.rating)) + ' · ' : ''}sedang mengerjakan...</div>
          </div>
        </div>
        <div class="timer-block">
          <div class="timer-text" id="matchTimerText"></div>
          <div class="timer-track"><div class="timer-bar" id="matchTimerBar" style="width:100%"></div></div>
        </div>
        <div class="opponent-chip justify-end text-right">
          <div>
            <div class="font-bold text-sm" style="color:var(--text-primary);">${esc(user ? user.name : 'Kamu')}</div>
            <div class="text-xs" style="color:var(--primary);">Kamu</div>
          </div>
          <div class="opp-avatar" style="background:var(--gradient-primary);">${esc(user ? (user.avatar || '?') : 'K')}</div>
        </div>
      </div>
      <div class="paint-arena">
        <div class="paint-left reveal reveal-stagger-2">${territoryHTML()}</div>
        <div class="paint-right">
          <div class="match-progress reveal reveal-stagger-3">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-semibold" style="color:var(--text-secondary);">Soal ${state.index + 1} / ${state.questions.length}</span>
              <span id="matchStreak" class="streak-chip">${state.streak >= 2 ? '<i class="fas fa-fire"></i> Streak ' + state.streak : ''}</span>
            </div>
            <div class="opp-progress" id="oppProgress">${progressDots(state.index)}</div>
          </div>
          <div class="question-card reveal reveal-stagger-1">
            <div class="flex flex-wrap gap-2 mb-3">
              <span class="category-tag ${q.mapel}"><i class="fas fa-book"></i> ${cap(q.mapel)}</span>
              <span class="category-tag"><i class="fas fa-signal"></i> ${cap(q.difficulty)}</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold leading-snug mb-4" style="color:var(--text-primary);">${esc(q.q)}</h3>
            <div class="grid gap-3">
              ${q.options.map((o, i) =>
                '<button class="opt-btn" data-opt onclick="Match.answer(' + i + ')">' +
                '<span class="opt-key">' + String.fromCharCode(65 + i) + '</span>' +
                '<span class="opt-text">' + esc(o) + '</span></button>'
              ).join('')}
            </div>
            <div id="matchFeedback"></div>
          </div>
        </div>
      </div>
    `;
    updateTimerUI();
    updateAreaUI();
    ScrollAnimation.refresh();
  }

  function progressDots(count) {
    return Array.from({ length: M.QUESTIONS_PER_MATCH }, (_, i) => '<span class="' + (i < count ? 'done' : '') + '"></span>').join('');
  }

  function startTimer() {
    clearTimer();
    state.total = state.mode === 'classic' ? M.CLASSIC_SECONDS : M.RANKED_SECONDS;
    state.timeLeft = state.total;
    state.timer = setInterval(() => {
      state.timeLeft--;
      updateTimerUI();
      if (state.timeLeft <= 0) {
        clearTimer();
        if (!state.answered) {
          botTurn(false);
          capture(P_OPP);
          state.flash = null;
          paintBoard();
          endMatch();
        }
      }
    }, 1000);
  }

  function updateTimerUI() {
    const bar = document.getElementById('matchTimerBar');
    const txt = document.getElementById('matchTimerText');
    if (bar) bar.style.width = Math.max(0, (state.timeLeft / state.total) * 100) + '%';
    if (txt) {
      txt.textContent = fmtClock(state.timeLeft);
      txt.classList.toggle('danger', state.timeLeft <= 10);
    }
  }

  function answer(i) {
    if (state.answered) return;
    const q = state.questions[state.index];
    if (!q) return;
    state.answered = true;
    const correct = i === q.correctIndex;
    const pts = POINTS[q.difficulty] || 1;
    let gained = 0;
    if (correct) {
      state.streak++;
      gained = pts;
      if (state.streak % M.STREAK_BONUS_EVERY === 0) gained += 1;
      state.playerScore += gained;
      if (q.difficulty === 'sulit') state.hardCorrect++;
      if (q.difficulty === 'cerdas') state.geniusCorrect++;
    } else {
      state.streak = 0;
    }
    state.answers[state.index] = { chosen: i, correct, gained, skipped: false };
    botTurn(correct);
    const res = capture(correct ? P_CLAIM : P_OPP);
    if (res.finished) state.decided = true;
    paintBoard();
    flashTerritory(correct ? P_CLAIM : P_OPP);
    paintOppProgress(state.index + 1);

    document.querySelectorAll('#matchRoot [data-opt]').forEach((b, idx) => {
      b.disabled = true;
      b.classList.remove('correct', 'wrong', 'picked');
      if (idx === q.correctIndex) b.classList.add('correct');
      else if (idx === i) b.classList.add('wrong');
    });

    const fb = document.getElementById('matchFeedback');
    if (fb) {
      const isLast = res.finished || state.index + 1 >= state.questions.length;
      const step = TERR.STEP_PERCENT;
      const advMs = res.finished ? TERR.CLAIM_ANIM_MS + 650 : M.AUTO_ADVANCE_MS;
      fb.style.setProperty('--adv-ms', advMs + 'ms');
      fb.innerHTML =
        (correct
          ? '<div class="fb-correct"><i class="fas fa-circle-check"></i> Benar! Wilayah <b>+' + step + '%</b><span class="fb-sub">+' + gained + ' poin</span></div>'
          : '<div class="fb-wrong"><i class="fas fa-circle-xmark"></i> Salah — <b>' + esc(state.opponent.name) + ' merebut ' + step + '%</b><span class="fb-sub">Jawaban benar: ' + esc(q.options[q.correctIndex]) + '</span></div>') +
        (q.explain ? '<p class="fb-explain"><i class="fas fa-lightbulb mr-1"></i>' + esc(q.explain) + '</p>' : '') +
        '<div class="fb-actions">' +
        '<button class="btn-edquest btn-primary-grad text-sm !py-2 !px-5" onclick="Match.next()">' +
        (isLast ? 'Lihat Hasil <i class="fas fa-flag-checkered"></i>' : 'Lanjut <i class="fas fa-arrow-right"></i>') + '</button>' +
        '<span class="fb-auto-hint"><i class="fas fa-forward"></i> Otomatis ' + (isLast ? 'lihat hasil' : 'lanjut') + ' dalam ' + (advMs >= 1000 ? (advMs / 1000).toFixed(1).replace('.0', '') + ' detik' : advMs + ' ms') + '</span>' +
        '</div>' +
        '<div class="auto-timer"><span></span></div>';
      fb.classList.add('show');
    }
    updateStreak();
    clearAdvance();
    if (!res.finished) {
      state.decayTimer = setTimeout(() => {
        state.decayTimer = null;
        if (state.screen !== 'battle') return;
        const d = decay();
        if (!d) return;
        paintBoard();
        flashTerritory(d.owner, 'decay');
        const panel = document.getElementById('matchFeedback');
        const actions = panel ? panel.querySelector('.fb-actions') : null;
        if (actions && !panel.querySelector('.fb-decay')) {
          const who = d.leader === P_CLAIM
            ? 'Wilayahmu tergerus <b>−' + d.lost + '%</b>'
            : esc(state.opponent.name) + ' menyedot <b>' + d.lost + '%</b>';
          const el = document.createElement('div');
          el.className = 'fb-decay';
          el.innerHTML = '<i class="fas fa-arrow-trend-down"></i> ' + who + ' — lead harus dijaga';
          actions.parentNode.insertBefore(el, actions);
        }
      }, TERR.CLAIM_ANIM_MS);
    }
    state.advanceTimer = setTimeout(() => next(), res.finished ? TERR.CLAIM_ANIM_MS + 650 : M.AUTO_ADVANCE_MS);
    if (state.timeLeft <= 0) endMatch();
  }

  function botTurn(playerCorrect) {
    const q = state.questions[state.index];
    if (!q) return;
    if (playerCorrect) {
      state.oppStreak = 0;
      return;
    }
    const pts = POINTS[q.difficulty] || 1;
    state.oppStreak++;
    let g = pts;
    if (state.oppStreak % M.STREAK_BONUS_EVERY === 0) g += 1;
    state.oppScore += g;
  }

  function updateStreak() {
    const streak = document.getElementById('matchStreak');
    if (streak) streak.innerHTML = state.streak >= 2 ? '<i class="fas fa-fire"></i> Streak ' + state.streak : '';
  }

  function paintOppProgress(count) {
    const wrap = document.getElementById('oppProgress');
    if (wrap) wrap.innerHTML = progressDots(count);
  }

  function next() {
    clearAdvance();
    if (state.decided) { endMatch(); return; }
    state.index++;
    state.answered = false;
    if (state.index >= state.questions.length) { endMatch(); return; }
    renderBattle(document.getElementById('matchRoot'));
  }

  function endMatch() {
    if (state.screen === 'result') return;
    clearTimer();
    clearAdvance();
    if (!state.board.length) initBoard();
    for (let i = state.index; i < state.questions.length; i++) {
      if (!state.answers[i]) state.answers[i] = { chosen: -1, correct: false, gained: 0, skipped: true };
    }
    const playerScore = state.playerScore;
    const oppScore = state.oppScore;
    const playerArea = areaOf(P_CLAIM);
    const oppArea = areaOf(P_OPP);
    const vs = playerArea === oppArea ? 'seri' : (playerArea > oppArea ? 'menang' : 'kalah');
    let delta = 0;
    if (state.mode === 'ranked') delta = computeDelta(playerArea, oppArea);
    const settled = settleStats(vs, delta);
    state.result = {
      vs,
      playerScore,
      oppScore,
      points: playerScore,
      playerArea,
      oppArea,
      board: state.board.slice(),
      mode: state.mode,
      delta,
      newRating: settled.newRating,
      tier: settled.tier,
      rankPoints: settled.rankPoints,
      rankUp: settled.rankUp,
      badges: settled.badges,
      questions: state.questions,
      answers: state.answers
    };
    state.screen = 'result';
    render();
    settled.badges.forEach((b, i) => {
      setTimeout(() => Auth.showToast('Badge diraih: ' + b + '!', 'success'), 900 + i * 1400);
    });
    const vsLabel = vs === 'menang' ? 'Menang!' : (vs === 'seri' ? 'Hasil Seri' : 'Kalah');
    const deltaText = delta ? ' · rating ' + (delta > 0 ? '+' : '') + delta : '';
    Notifications.push({ type: 'match', title: vsLabel, message: playerArea + '% - ' + oppArea + '% wilayah · +' + playerScore + ' poin' + deltaText, link: '#/match' });
    settled.badges.forEach(b => Notifications.push({ type: 'badge', title: 'Badge diraih: ' + b + '!', message: 'Lihat koleksi badgemu di halaman profil.', link: '#/profile' }));
    if (settled.rankUp) {
      Notifications.push({ type: 'rank', title: 'Rank naik!', message: settled.rankUp.from + ' → ' + settled.rankUp.tier + ' · ' + settled.rankUp.rankPoints + ' rank points', link: '#/profile' });
    }
  }

  function computeDelta(playerArea, oppArea) {
    const diff = (playerArea || 0) - (oppArea || 0);
    const raw = Math.round(diff / 4.2);
    const clamped = Math.max(-M.RATING_CLAMP, Math.min(M.RATING_CLAMP, raw));
    if (diff !== 0 && clamped === 0) return diff > 0 ? 1 : -1;
    return clamped;
  }

  function settleStats(vs, delta) {
    const user = Auth.getUser();
    const earned = [];
    if (!user) return { newRating: 0, tier: 'Bronze', rankPoints: 0, rankUp: null, badges: earned };
    const st = user.matchStats = user.matchStats || { rating: 0, wins: 0, losses: 0, draws: 0, matches: 0, bestTier: 'Bronze', badges: [] };
    const oldRankPoints = rankPointsOf(user);
    const oldTier = tierOf(oldRankPoints);
    st.matches = (st.matches || 0) + 1;
    if (vs === 'menang') st.wins = (st.wins || 0) + 1;
    else if (vs === 'kalah') st.losses = (st.losses || 0) + 1;
    else st.draws = (st.draws || 0) + 1;

    if (state.mode === 'ranked') {
      st.rating = Math.max(0, (st.rating || 0) + delta);
    } else {
      st.rating = st.rating || 0;
    }

    const badges = st.badges = st.badges || [];
    const have = id => badges.indexOf(id) !== -1;
    const earn = id => { if (!have(id)) { badges.push(id); return true; } return false; };

    if (st.matches === 1 && earn('langkah-pertama')) earned.push('Langkah Pertama');
    if (state.streak >= M.STREAK_BONUS_EVERY && earn('streak-keren')) earned.push('Streak Keren');
    if (vs === 'menang' && state.hardCorrect > 0 && earn('raja-sulit')) earned.push('Raja Sulit');
    if (vs === 'menang' && state.geniusCorrect > 0 && earn('si-cerdas')) earned.push('Si Cerdas');
    if (state.mode === 'ranked' && vs === 'menang' && earn('gladiator')) earned.push('Gladiator');

    const tier = tierOf(rankPointsOf(user));
    const tIdx = tierIndex(tier);
    const bIdx = tierIndex(st.bestTier || 'Bronze');

    if (tIdx > bIdx) {
      st.bestTier = tier;
      if (earn('naik-kelas')) earned.push('Naik Kelas');
    }
    if (tier === 'Diamond' && earn('legenda')) earned.push('Legenda');

    const newRankPoints = rankPointsOf(user);
    const rankUp = tierIndex(tier) > tierIndex(oldTier) ? { tier, from: oldTier, rankPoints: newRankPoints } : null;

    persistUser(user);
    return { newRating: st.rating, tier, rankPoints: newRankPoints, rankUp, badges: earned };
  }

  function persistUser(user) {
    Auth.persistUser(user);
    try {
      const reg = Auth.getRegisteredUsers();
      const acc = reg.find(u => u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase());
      if (acc) { acc.matchStats = user.matchStats; acc.badges = user.badges; }
      localStorage.setItem(CONFIG.STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(reg));
    } catch (err) { /* abaikan */ }
    if (user.matchStats) updateLeaderboard(user.matchStats);
  }

  /* ===== Result ===== */

  function renderResult(root) {
    const r = state.result;
    const meta = {
      menang: { icon: 'fa-trophy', label: 'Menang!', cls: 'victory', msg: 'Kamu menguasai wilayah. Hebat!' },
      seri: { icon: 'fa-handshake', label: 'Seri!', cls: 'draw', msg: 'Seimbang banget. Adu lagi!' },
      kalah: { icon: 'fa-face-frown', label: 'Kalah', cls: 'defeat', msg: 'Kalah bukan berarti menyerah. Coba lagi!' }
    }[r.vs];
    root.innerHTML = `
      <div class="card-panel text-center p-8 sm:p-12 reveal reveal-scale">
        <div class="result-hero ${meta.cls} mx-auto"><i class="fas ${meta.icon}"></i></div>
        <h1 class="text-3xl font-extrabold mt-5 mb-1" style="color:var(--text-primary);">${meta.label}</h1>
        <p class="text-sm mb-6" style="color:var(--text-muted);">${meta.msg}</p>
        <div class="result-score reveal reveal-stagger-1">
          <div class="rs-cell"><div class="rs-name">${esc(state.opponent.name)}</div><div class="rs-num" data-counter="${r.oppArea}">0</div><div class="rs-pct">% wilayah</div><div class="rs-pts"><span data-counter="${r.oppScore}">0</span> poin</div></div>
          <div class="rs-vs">VS</div>
          <div class="rs-cell"><div class="rs-name">Kamu</div><div class="rs-num accent" data-counter="${r.playerArea}">0</div><div class="rs-pct">% wilayah</div><div class="rs-pts"><span data-counter="${r.playerScore}">0</span> poin</div></div>
        </div>
        <div class="mt-6 reveal reveal-stagger-2">${resultMapHTML(r.board)}</div>
        <div class="flex flex-wrap justify-center gap-2 mt-5 reveal reveal-stagger-3">
          ${r.mode === 'ranked' ? '<span class="result-stat ' + (r.delta >= 0 ? 'up' : 'down') + '"><i class="fas ' + (r.delta >= 0 ? 'fa-arrow-up' : 'fa-arrow-down') + '"></i> ' + (r.delta >= 0 ? '+' : '') + r.delta + ' rating</span>' : ''}
          <span class="result-stat neutral"><i class="fas fa-star"></i> <span data-counter="${r.points}">0</span> poin</span>
          <span class="result-stat neutral"><i class="fas fa-ranking-star"></i> <span data-counter="${r.rankPoints}">0</span> rank</span>
        </div>
        <div class="mt-5 reveal reveal-stagger-4">${rankProgressHTML(r.rankPoints)}</div>
        ${r.badges.length ? '<div class="mt-6 reveal reveal-stagger-5"><div class="text-xs font-bold uppercase tracking-wide mb-2" style="color:var(--text-muted);">Badge baru</div><div class="flex flex-wrap justify-center gap-2">' + r.badges.map(b => '<span class="badge-earned"><i class="fas fa-medal"></i> ' + b + '</span>').join('') + '</div></div>' : ''}
        <div class="flex flex-wrap justify-center gap-3 mt-8 reveal reveal-stagger-5">
          <button class="btn-edquest btn-primary-grad" onclick="Match.rematch()"><i class="fas fa-rotate-right"></i> Tanding Lagi</button>
          <button class="btn-edquest btn-outline-glow" onclick="Match.backToLobby()"><i class="fas fa-left-long"></i> Kembali</button>
          ${state.mode === 'ranked' ? '<button class="btn-edquest btn-ghost" onclick="Match.showLeaderboard()"><i class="fas fa-trophy"></i> Leaderboard</button>' : ''}
        </div>
      </div>
      <div class="review-hint reveal">
        <span class="review-hint-arrow"><i class="fas fa-angle-double-down"></i></span>
        <span>Pembahasan lengkap ada di bawah — ${r.questions.length} soal + penjelasannya</span>
      </div>
      ${renderReview(r)}
      ${r.rankUp ? renderRankUp(r.rankUp) : ''}
    `;
    ScrollAnimation.refresh();
  }

  function renderReview(r) {
    const rows = r.questions.map((q, i) => {
      const a = r.answers[i] || { chosen: -1, correct: false, gained: 0, skipped: true };
      const status = a.skipped ? 'skip' : (a.correct ? 'correct' : 'wrong');
      const statusIcon = a.skipped ? 'fa-circle-minus' : (a.correct ? 'fa-circle-check' : 'fa-circle-xmark');
      const statusLabel = a.skipped ? 'Tidak dijawab' : (a.correct ? 'Benar' : 'Salah');
      const chosenText = a.chosen >= 0 ? q.options[a.chosen] : 'Tidak menjawab';
      return '<div class="review-item ' + status + '">' +
        '<div class="review-head">' +
        '<span class="review-num">' + (i + 1) + '</span>' +
        '<span class="review-status ' + status + '"><i class="fas ' + statusIcon + '"></i> ' + statusLabel + '</span>' +
        '<span class="category-tag ' + q.mapel + '">' + cap(q.mapel) + '</span>' +
        '<span class="category-tag"><i class="fas fa-signal"></i> ' + cap(q.difficulty) + '</span>' +
        '</div>' +
        '<p class="review-q">' + esc(q.q) + '</p>' +
        '<div class="review-answers">' +
        '<div class="review-ans ' + (a.skipped || !a.correct ? 'bad' : 'good') + '"><span class="review-ans-label">Jawabanmu</span><span class="review-ans-text">' + esc(chosenText) + (a.correct && !a.skipped ? ' <i class="fas fa-check"></i>' : '') + '</span></div>' +
        '<div class="review-ans good"><span class="review-ans-label">Jawaban benar</span><span class="review-ans-text">' + esc(q.options[q.correctIndex]) + '</span></div>' +
        '</div>' +
        (q.explain ? '<p class="review-explain"><i class="fas fa-lightbulb mr-1"></i>' + esc(q.explain) + '</p>' : '') +
        '</div>';
    }).join('');
    return '<details open class="card-panel review-panel mt-6 reveal">' +
      '<summary class="review-summary">' +
      '<span class="review-summary-icon"><i class="fas fa-clipboard-list"></i></span>' +
      '<span class="review-summary-text">Pembahasan Lengkap</span>' +
      '<span class="review-total"><span data-counter="' + r.answers.filter(a => a && a.correct).length + '">0</span>/' + r.questions.length + ' benar</span>' +
      '<span class="review-summary-sub">Jawaban benar, jawabanmu &amp; penjelasan tiap soal</span>' +
      '</summary>' +
      '<div class="review-list mt-4">' + rows + '</div></details>';
  }

  function renderRankUp(ru) {
    setTimeout(() => {
      const el = document.getElementById('rankUpOverlay');
      if (el) el.classList.add('is-shown');
    }, 500);
    setTimeout(() => {
      const el = document.getElementById('rankUpOverlay');
      if (el) el.classList.add('hide');
    }, 4200);
    setTimeout(() => {
      const el = document.getElementById('rankUpOverlay');
      if (el) el.remove();
    }, 4800);
    return '<div id="rankUpOverlay" class="rank-up-overlay">' +
      '<div class="rank-up-modal">' +
      '<div class="rank-up-confetti"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="rank-up-label"><i class="fas fa-arrow-trend-up"></i> RANK NAIK!</div>' +
      '<div class="rank-up-chip tier-' + ru.tier.toLowerCase() + '"><i class="fas fa-crown"></i></div>' +
      '<div class="rank-up-from">' + ru.from + '</div>' +
      '<div class="rank-up-arrow"><i class="fas fa-angle-down"></i></div>' +
      '<div class="rank-up-to tier-' + ru.tier.toLowerCase() + '">' + ru.tier + '</div>' +
      '<div class="rank-up-points"><span data-counter="' + ru.rankPoints + '">0</span> rank points</div>' +
      '<div class="rank-progress rank-up-progress">' + progressHTML(ru.rankPoints) + '</div>' +
      '<button class="btn-edquest btn-primary-grad mt-4" onclick="document.getElementById(\'rankUpOverlay\').remove()"><i class="fas fa-check"></i> Lanjut</button>' +
      '</div></div>';
    ScrollAnimation.refresh();
  }

  /* ===== Navigation ===== */

  function setMode(mode) { state.mode = mode; render(); }
  function setMapel(v) { state.mapel = v; }
  function showDuel() { state.tab = 'duel'; state.screen = 'lobby'; render(); }
  function showLeaderboard() { state.tab = 'leaderboard'; state.screen = 'lobby'; render(); }
  function backToLobby() { clearTimer(); state.screen = 'lobby'; state.tab = 'duel'; render(); }
  function rematch() { startSearch(); }

  /* ===== Shared helpers ===== */

  function getLeaderboard() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.LEADERBOARD));
      if (Array.isArray(saved)) return saved;
    } catch (err) { /* abaikan */ }
    return (dataStore.leaderboard || []).slice();
  }

  function updateLeaderboard(stats) {
    if (!stats) return;
    const user = Auth.getUser();
    if (!user) return;
    const current = getLeaderboard();
    const entry = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      rating: stats.rating || 0,
      rankPoints: rankPointsOf(user),
      wins: stats.wins || 0,
      losses: stats.losses || 0,
      draws: stats.draws || 0,
      matches: stats.matches || 0
    };
    const idx = current.findIndex(e => String(e.id) === String(user.id));
    if (idx >= 0) current[idx] = entry;
    else current.push(entry);
    current.sort((a, b) => ((b.rankPoints != null ? b.rankPoints : b.rating || 0) - (a.rankPoints != null ? a.rankPoints : a.rating || 0)));
    const top = current.slice(0, 10);
    try { localStorage.setItem(CONFIG.STORAGE_KEYS.LEADERBOARD, JSON.stringify(top)); } catch (err) { /* abaikan */ }
    return top;
  }

  function rankPointsOf(user) {
    if (!user) return 0;
    const st = user.matchStats || {};
    return (st.rating || 0) +
      ((st.badges || []).length * (M.BADGE_RANK_POINTS || 0)) +
      Math.floor((user.points || 0) / (M.POINTS_TO_RANK || 1));
  }

  function tierOf(points) {
    let t = TIERS[0].name;
    TIERS.forEach(ti => { if ((points || 0) >= ti.min) t = ti.name; });
    return t;
  }

  function tierIndex(name) {
    return TIERS.findIndex(t => t.name === name);
  }

  function nextTierInfo(points) {
    let tier = TIERS[0].name;
    let next = null;
    let min = TIERS[0].min;
    let nextMin = null;
    TIERS.forEach((ti, i) => {
      if ((points || 0) >= ti.min) {
        tier = ti.name;
        min = ti.min;
        next = TIERS[i + 1] || null;
        nextMin = next ? next.min : null;
      }
    });
    const progress = nextMin ? Math.min(100, Math.max(0, (((points || 0) - min) / (nextMin - min)) * 100)) : 100;
    return { tier, next: next ? next.name : null, progress };
  }

  function rankProgressHTML(points) {
    const info = nextTierInfo(points);
    return '<div class="rank-progress">' + progressHTML(points) +
      '<div class="rank-progress-labels"><span>' + info.tier + '</span><span>' + (info.next || 'Maks.') + '</span></div></div>';
  }

  function progressHTML(points) {
    const info = nextTierInfo(points);
    return '<div class="rank-progress-track"><div class="rank-progress-bar tier-' + info.tier.toLowerCase() + '" style="width:' + info.progress + '%"></div></div>';
  }

  function clearTimer() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
  }

  function clearAdvance() {
    if (state.advanceTimer) { clearTimeout(state.advanceTimer); state.advanceTimer = null; }
    if (state.decayTimer) { clearTimeout(state.decayTimer); state.decayTimer = null; }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function fmtClock(sec) {
    const m = Math.floor(Math.max(0, sec) / 60);
    const s = Math.max(0, sec) % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function fmtTime(sec) {
    const m = Math.floor(Math.max(0, sec) / 60);
    const s = Math.max(0, sec) % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  return {
    init, setMode, setMapel, startSearch, answer, next,
    rematch, backToLobby, showDuel, showLeaderboard, tierOf, getLeaderboard,
    rankPointsOf, BADGES
  };
})();
