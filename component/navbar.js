function renderNavbar() { return `
<nav class="top-navbar">
  <div class="flex items-center gap-3">
    <button id="sidebarToggle" class="btn-ghost !p-2 rounded-lg text-lg md:hidden" aria-label="Toggle sidebar">
      <i class="fas fa-bars"></i>
    </button>
    <a href="#/home" class="flex items-center gap-2 text-xl font-extrabold tracking-tight no-underline" style="color:var(--text-primary);">
      <span class="flex items-center justify-center w-9 h-9 rounded-xl text-white text-base" style="background:var(--gradient-primary);">E</span>
      <span class="hidden sm:inline">Edquest</span>
    </a>
  </div>
  <div class="flex items-center gap-2">
    <button id="searchBtn" class="btn-ghost !p-2 rounded-lg text-base" aria-label="Cari diskusi">
      <i class="fas fa-search" style="color:var(--text-secondary);"></i>
    </button>
    <button id="darkModeToggle" class="dark-mode-toggle" aria-label="Toggle dark mode">
      <i class="fas fa-moon"></i>
    </button>
    <div class="guest-menu flex items-center gap-2">
      <button data-action="login" class="btn-ghost text-sm font-medium rounded-lg px-4 py-2" style="color:var(--text-secondary);">Masuk</button>
      <button data-action="register" class="btn-edquest btn-primary-grad text-sm !py-2 !px-4">Daftar</button>
    </div>
    <div class="user-menu items-center gap-2" style="display:none;">
      <div class="relative">
        <button id="userMenuBtn" class="flex items-center gap-2 btn-ghost !p-1 rounded-lg" aria-label="Menu pengguna">
          <span class="user-avatar w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style="background:var(--gradient-primary);"></span>
          <span class="user-name text-sm font-medium hidden sm:inline" style="color:var(--text-primary);"></span>
          <i class="fas fa-chevron-down text-xs" style="color:var(--text-muted);"></i>
        </button>
        <div id="userDropdown" class="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg hidden" style="background:var(--bg-card); border:1px solid var(--border-color); z-index:100;">
          <div class="p-2">
            <a href="#/profile" class="block px-4 py-2 rounded-lg text-sm no-underline" style="color:var(--text-secondary);">
              <i class="fas fa-user mr-2"></i> Profil
            </a>
            <button onclick="Settings.openModal(); document.getElementById('userDropdown').classList.add('hidden')" class="block w-full text-left px-4 py-2 rounded-lg text-sm" style="color:var(--text-secondary); background:transparent; border:none; cursor:pointer;">
              <i class="fas fa-cog mr-2"></i> Pengaturan
            </button>
            <hr class="my-1" style="border-color:var(--border-color);">
            <button data-action="logout" class="block w-full text-left px-4 py-2 rounded-lg text-sm" style="color:#ef4444; background:transparent; border:none; cursor:pointer;">
              <i class="fas fa-sign-out-alt mr-2"></i> Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>

<div id="searchOverlay" class="fixed inset-0 z-50 hidden" style="background:rgba(0,0,0,0.5); backdrop-filter:blur(8px);">
  <div class="max-w-2xl mx-auto pt-24 px-4">
    <div class="glass-card !p-6">
      <div class="flex items-center gap-3 mb-4">
        <i class="fas fa-search" style="color:var(--text-muted);"></i>
        <input id="searchInput" type="text" class="flex-1 bg-transparent border-none outline-none text-lg" style="color:var(--text-primary);" placeholder="Cari diskusi, teman, atau topik..." autofocus>
        <button id="searchClose" class="btn-ghost !p-2 rounded-lg"><i class="fas fa-times"></i></button>
      </div>
      <div id="searchResults" class="max-h-80 overflow-y-auto space-y-2">
        <p class="text-sm" style="color:var(--text-muted);">Ketik untuk mencariiiiiiia...</p>
      </div>
    </div>
  </div>
</div>
`; }