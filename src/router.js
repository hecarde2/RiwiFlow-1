import Login from './pages/login.js';
import Board from './pages/board.js';

// Route definitions: path → page module
const routes = {
  '/': Login,
  '/board': Board,
};

/**
 * Main router function.
 * Reads the current pathname, checks auth/role guards,
 * renders the correct page, and calls mounted() for event binding.
 * The sidebar is NOT part of individual pages — it lives in board.js
 * and is only re-rendered when navigating away from /board entirely.
 */
export function router() {
  let path = window.location.pathname;

  const rawUser = localStorage.getItem('session');
  const user = rawUser ? JSON.parse(rawUser) : null;

  // Auth guard: redirect unauthenticated users to login
  if (path === '/board' && !user) {
    path = '/';
    history.pushState(null, null, path);
  }

  // Auth guard: redirect authenticated users away from login
  if (path === '/' && user) {
    path = '/board';
    history.pushState(null, null, path);
  }

  const page = routes[path];

  if (!page) {
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center space-y-md">
          <h1 class="font-display-lg text-display-lg text-primary">404</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Page not found</p>
          <a href="/" onclick="history.pushState(null,null,'/'); router(); return false;"
             class="text-primary font-label-md hover:underline">Go home</a>
        </div>
      </div>`;
    return;
  }

  document.getElementById('app').innerHTML = page.render();
  page.mounted();
}

/**
 * Navigate to a path without full reload.
 * Used by internal links and buttons.
 */
export function navigate(path) {
  history.pushState(null, null, path);
  router();
}
