import { injectStyle } from '../../../js/utils/styleLoader.js';

injectStyle('components/layout/sidebar/sidebar.css');

export function renderSidebar() { return `
<aside class="sidebar" id="sidebar">
  <div class="sidebar-inner">
    <nav class="sidebar-nav">
      <a href="#/home" data-link="home" class="sidebar-link"><i class="fas fa-th-large"></i><span>Home</span></a>
      <a href="#/forum" data-link="forum" class="sidebar-link"><i class="fas fa-comments"></i><span>Forum</span></a>
      <a href="#/friend" data-link="friend" class="sidebar-link"><i class="fas fa-users"></i><span>Friend</span></a>
      <a href="#/about" data-link="about" class="sidebar-link"><i class="fas fa-info-circle"></i><span>About</span></a>
      <a href="#/faq" data-link="faq" class="sidebar-link"><i class="fas fa-question-circle"></i><span>FAQ</span></a>
    </nav>
    <div class="sidebar-footer">
      <button onclick="Settings.openModal()" class="sidebar-link w-full" style="border:none;cursor:pointer;background:transparent;font-size:inherit;">
        <i class="fas fa-gear"></i><span>Settings</span>
      </button>
    </div>
    <div class="sidebar-branding">
      <p class="text-xs" style="color:var(--text-muted);">Edquest — INVENTION 2026</p>
    </div>
  </div>
</aside>
<div id="sidebarOverlay" class="sidebar-overlay hidden"></div>
`; }
