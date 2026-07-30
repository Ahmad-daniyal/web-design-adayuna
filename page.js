/**
 * Adayuna SPA Router & System Controller (page.js)
 * Manages Hash Routing, View Mounting, Components, and Cleanup.
 */

import { Store } from './js/store.js';
import { Navbar } from './js/components/Navbar.js';
import { Footer } from './js/components/Footer.js';

import { HomePage } from './js/pages/HomePage.js';
import { LoginPage } from './js/pages/LoginPage.js';
import { DashboardPage } from './js/pages/DashboardPage.js';
import { MateriPage } from './js/pages/MateriPage.js';
import { FlashcardPage } from './js/pages/FlashcardPage.js';
import { PomodoroPage } from './js/pages/PomodoroPage.js';
import { QuizPage } from './js/pages/QuizPage.js';

const routes = {
  '#home': HomePage,
  '#login': LoginPage,
  '#dashboard': DashboardPage,
  '#materi': MateriPage,
  '#flashcard': FlashcardPage,
  '#pomodoro': PomodoroPage,
  '#kuis': QuizPage
};

let activeCleanup = null;

const navigateTo = (hash) => {
  window.location.hash = hash;
};

const renderRoute = () => {
  let hash = window.location.hash || '#home';
  
  // Normalize hash (handle section anchors if needed)
  if (hash.startsWith('#fitur') || hash === '') hash = '#home';

  const page = routes[hash] || HomePage;

  // 1. Cleanup previous page listeners if any
  if (typeof activeCleanup === 'function') {
    activeCleanup();
    activeCleanup = null;
  }

  // 2. Render Shared Layout Components
  const navbarContainer = document.getElementById('navbarApp');
  const footerContainer = document.getElementById('footerApp');
  const appContainer = document.getElementById('app');

  if (navbarContainer) {
    navbarContainer.innerHTML = Navbar.render(hash);
    Navbar.attachEvents();
  }

  if (footerContainer) {
    footerContainer.innerHTML = Footer.render();
  }

  // 3. Render Current Page View
  if (appContainer) {
    appContainer.innerHTML = page.render();
    window.scrollTo(0, 0);

    // Attach Page Specific Event Listeners
    if (typeof page.attachEvents === 'function') {
      activeCleanup = page.attachEvents(navigateTo);
    }
  }
};

// Apply Initial Theme
const initTheme = () => {
  const savedTheme = Store.getTheme();
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderRoute();
});

window.addEventListener('hashchange', renderRoute);
