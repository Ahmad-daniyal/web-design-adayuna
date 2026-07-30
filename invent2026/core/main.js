import { initTheme } from './theme.js';
import { initRouter } from './router.js';
import { renderNavbar } from '../src/shared/components/layout/navbar/navbar.js';
import { renderFooter } from '../src/shared/components/layout/footer/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderNavbar();
  renderFooter();
  initRouter();
});
