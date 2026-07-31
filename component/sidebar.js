function renderSidebar() { return `
<aside class="sidebar" id="sidebar">
  <div class="sidebar-inner">
    <p class="sidebar-section-label">Menu Utama</p>
    <nav class="sidebar-nav">
      <a href="#/home" data-link="home" class="sidebar-link"><i class="fas fa-th-large"></i><span>Dashboard</span></a>
      <a href="#/kursus" data-link="kursus" class="sidebar-link"><i class="fas fa-book-open"></i><span>Kursus Saya</span></a>
      <a href="#/jadwal" data-link="jadwal" class="sidebar-link"><i class="fas fa-calendar-days"></i><span>Jadwal</span></a>
      <a href="#/nilai" data-link="nilai" class="sidebar-link"><i class="fas fa-chart-simple"></i><span>Nilai</span></a>
    </nav>
    <div class="sidebar-footer">
      <button onclick="Settings.openModal()" class="sidebar-link w-full" style="border:none;cursor:pointer;background:transparent;font-size:inherit;">
        <i class="fas fa-gear"></i><span>Settings</span>
      </button>
    </div>
    <div class="sidebar-branding">
      <p class="text-xs" style="color:var(--text-muted);">Edquest — LMS 2026</p>
    </div>
  </div>
</aside>
<div id="sidebarOverlay" class="sidebar-overlay hidden"></div>
`; }
