function renderSidebar() { return `
<aside class="sidebar" id="sidebar">
  <div class="sidebar-inner">
    <nav class="sidebar-nav">
      <a href="#/home" data-link="home" class="sidebar-link"><i class="fas fa-home"></i><span>Home</span></a>
      <a href="#/forum" data-link="forum" class="sidebar-link"><i class="fas fa-comments"></i><span>Forum</span></a>
      <a href="#/friend" data-link="friend" class="sidebar-link"><i class="fas fa-user-friends"></i><span>Friend</span></a>
      <a href="#/about" data-link="about" class="sidebar-link"><i class="fas fa-info-circle"></i><span>About</span></a>
      <a href="#/faq" data-link="faq" class="sidebar-link"><i class="fas fa-question-circle"></i><span>FAQ</span></a>
    </nav>
    <div class="sidebar-footer">
      <button onclick="Settings.openModal()" class="sidebar-link w-full" style="border:none;cursor:pointer;background:transparent;font-size:inherit;">
        <i class="fas fa-cog"></i><span>Settings</span>
      </button>
      <div class="sidebar-theme-toggle">
        <i class="fas fa-moon"></i><span>Dark Mode</span>
        <button id="sidebarDarkToggle" class="ml-auto w-9 h-9 rounded-lg flex items-center justify-center" style="background:var(--bg-section);color:var(--text-secondary);border:none;cursor:pointer;">
          <i class="fas fa-moon"></i>
        </button>
      </div>
    </div>
    <div class="sidebar-branding">
      <p class="text-xs" style="color:var(--text-muted);">Edquest &mdash; INVENTION 2026</p>
    </div>
  </div>
</aside>
<div id="sidebarOverlay" class="sidebar-overlay hidden"></div>
`; }