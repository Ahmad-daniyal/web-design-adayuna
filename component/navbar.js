export function renderNavbar() { return `
<div id="readingProgress" class="reading-progress" aria-hidden="true"></div>

<nav class="top-navbar">
  <div class="flex items-center gap-3">
    <button id="sidebarToggle" class="btn-ghost !p-2 rounded-lg text-lg md:hidden" aria-label="Toggle sidebar">
      <i class="fas fa-bars"></i>
    </button>
    <a href="#/home" class="flex items-center gap-2 text-xl font-extrabold tracking-tight no-underline" style="color:var(--text-primary);">
      <span class="flex items-center justify-center w-9 h-9 rounded-xl text-lg text-white shadow-sm" style="background:var(--gradient-primary); box-shadow:0 4px 10px rgba(79,70,229,0.35);">E</span>
      <span class="hidden sm:inline">Edquest</span>
    </a>
  </div>
  <div class="flex items-center gap-1">
    <button id="focusModeToggle" class="btn-ghost !p-2 rounded-lg text-base" aria-label="Mode Fokus" title="Mode Fokus">
      <i class="fas fa-expand"></i>
    </button>
    <button id="searchBtn" class="btn-ghost !p-2 rounded-lg text-base" aria-label="Cari">
      <i class="fas fa-search" style="color:var(--text-secondary);"></i>
    </button>
    <div class="relative">
      <button id="helpBtn" class="btn-ghost !px-2.5 !py-1.5 rounded-lg" aria-label="Bantuan" title="Bantuan">
        <span class="flex items-center justify-center w-5 h-5 rounded-full border border-current text-xs font-bold" style="color:var(--text-secondary);">?</span>
      </button>
      <div id="helpDropdown" class="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-900/5 dark:shadow-black/40 hidden" style="z-index:100;">
        <div class="p-2">
          <p class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Bantuan</p>
          <a href="#/faq" class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm no-underline hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" style="color:var(--text-secondary);">
            <i class="fas fa-circle-question w-4 text-center"></i> FAQ
          </a>
          <a href="#/about" class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm no-underline hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" style="color:var(--text-secondary);">
            <i class="fas fa-info w-4 text-center"></i> Tentang Edquest
          </a>
          <button onclick="Settings.openModal(); document.getElementById('helpDropdown').classList.add('hidden')" class="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" style="color:var(--text-secondary); background:transparent; border:none; cursor:pointer;">
            <i class="fas fa-gear w-4 text-center"></i> Pengaturan
          </button>
        </div>
      </div>
    </div>
    <button id="darkModeToggle" class="dark-mode-toggle" role="switch" aria-checked="false" aria-label="Toggle dark mode">
      <span class="dm-track">
        <i class="fas fa-sun dm-track-sun"></i>
        <i class="fas fa-moon dm-track-moon"></i>
      </span>
      <span class="dm-knob">
        <i class="fas fa-sun dm-knob-sun"></i>
        <i class="fas fa-moon dm-knob-moon"></i>
      </span>
    </button>
    <div class="guest-menu flex items-center gap-2">
      <button data-action="login" class="btn-ghost text-sm font-medium rounded-lg px-4 py-2" style="color:var(--text-secondary);">Masuk</button>
      <button data-action="register" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4">Daftar</button>
    </div>
    <div class="user-menu items-center gap-2" style="display:none;">
      <div class="relative">
        <button id="userMenuBtn" class="flex items-center gap-2 btn-ghost !p-1 rounded-lg" aria-label="Menu pengguna">
          <span class="user-avatar w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm" style="background:var(--gradient-primary);"></span>
          <span class="user-name text-sm font-medium hidden sm:inline" style="color:var(--text-primary);"></span>
          <i class="fas fa-chevron-down text-xs" style="color:var(--text-muted);"></i>
        </button>
        <div id="userDropdown" class="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg shadow-slate-900/5 dark:shadow-black/40 hidden bg-white dark:bg-slate-900" style="border:1px solid var(--border-color); z-index:100;">
          <div class="p-2">
            <a href="#/profile" class="block px-4 py-2 rounded-lg text-sm no-underline hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" style="color:var(--text-secondary);">
              <i class="fas fa-user mr-2"></i> Profil
            </a>
            <button onclick="Settings.openModal(); document.getElementById('userDropdown').classList.add('hidden')" class="block w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" style="color:var(--text-secondary); background:transparent; border:none; cursor:pointer;">
              <i class="fas fa-cog mr-2"></i> Pengaturan
            </button>
            <hr class="my-1" style="border-color:var(--border-color);">
            <button data-action="logout" class="block w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" style="color:#ef4444; background:transparent; border:none; cursor:pointer;">
              <i class="fas fa-sign-out-alt mr-2"></i> Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>

<div id="searchOverlay" class="fixed inset-0 z-50 search-overlay" style="background:rgba(0,0,0,0.5); backdrop-filter:blur(8px);">
  <div class="max-w-2xl mx-auto pt-24 px-4">
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 !p-6 search-modal">
      <div class="flex items-center gap-3 mb-4">
        <i class="fas fa-search" style="color:var(--text-muted);"></i>
        <input id="searchInput" type="text" class="flex-1 bg-transparent border-none outline-none text-lg" style="color:var(--text-primary);" placeholder="Cari forum atau topik..." autofocus>
        <button id="searchClose" class="btn-ghost !p-2 rounded-lg"><i class="fas fa-times"></i></button>
      </div>
      <div id="searchResults" class="search-results max-h-80 overflow-y-auto space-y-2">
        <p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencari...</p>
      </div>
    </div>
  </div>
</div>
`; }
