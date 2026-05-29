/**
 * board.js
 * The authenticated app shell.
 * 
 * Architecture:
 *   ┌──────────────────────────────────────────┐
 *   │  SIDEBAR (never re-rendered)             │
 *   │  ┌────────────────────────────────────┐  │
 *   │  │  #main-content (swaps on nav)      │  │
 *   │  └────────────────────────────────────┘  │
 *   └──────────────────────────────────────────┘
 *
 * When the user clicks a sidebar nav item, ONLY #main-content
 * is replaced. The sidebar stays in place — no full re-render,
 * no page reload. This satisfies HU-02 (SPA without sidebar reload).
 */

import { renderSidebar, setActiveNav } from '../components/sidebar.js';
import { clearSession, getSession, isAdmin } from '../services/session.js';
import { navigate } from '../router.js';
import { renderKanbanView, mountKanbanView } from './views/kanbanView.js';
import { renderUsersView, mountUsersView } from './views/usersView.js';

let currentView = 'board';

/** Renders the full board shell (sidebar + top bar + content area) */
const Board = {
  render() {
    const user = getSession();

    return `
      <div class="bg-background text-on-background min-h-screen flex overflow-hidden">
        ${renderSidebar()}

        <!-- Main content wrapper -->
        <div class="flex flex-col flex-1 md:ml-[280px] h-screen overflow-hidden">

          <!-- TopAppBar (sticky) -->
          <header class="flex justify-between items-center w-full h-16 px-lg sticky top-0 z-30
                         bg-surface border-b border-outline-variant shrink-0">
            <div class="flex items-center gap-md">
              <span class="font-headline-md text-headline-md font-bold text-primary">
                RiwiFlow
              </span>
              <div class="hidden lg:block relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
                  search
                </span>
                <input class="pl-10 pr-4 py-1.5 w-64 rounded-lg bg-surface-container-low border-none
                              focus:ring-2 focus:ring-primary/20 text-body-sm font-body-sm"
                       placeholder="Search tasks..." type="text" id="search-input" />
              </div>
            </div>
            <div class="flex items-center gap-md">
              <button class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-primary">notifications</span>
              </button>
              <div class="h-8 w-px bg-outline-variant mx-sm"></div>
              <div class="flex items-center gap-sm">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span class="text-on-primary font-label-md text-label-md uppercase">
                    ${(user?.name || 'U')[0]}
                  </span>
                </div>
                <span class="font-label-md text-label-md hidden md:block text-on-surface">
                  ${user?.name || ''}
                </span>
                <span class="font-label-sm text-label-sm text-outline capitalize hidden md:block">
                  (${user?.role || ''})
                </span>
              </div>
            </div>
          </header>

          <!-- Scrollable main content -->
          <main class="flex-1 overflow-y-auto p-lg" id="main-content">
            <!-- Initial view rendered here by mounted() -->
          </main>
        </div>
      </div>`;
  },

  mounted() {
    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      clearSession();
      navigate('/');
    });

    // Sidebar navigation — swaps only #main-content
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        switchView(view);
      });
    });

    // Load initial view
    switchView('board');
  },
};

/**
 * Switches the content area to the requested view
 * WITHOUT touching the sidebar.
 */
async function switchView(view) {
  // Guard: coders cannot access users view
  if (view === 'users' && !isAdmin()) {
    view = 'board';
  }

  currentView = view;
  setActiveNav(view);

  const content = document.getElementById('main-content');

  // Render the view HTML into the content area
  if (view === 'board') {
    content.innerHTML = renderKanbanView();
    await mountKanbanView();
  } else if (view === 'users') {
    content.innerHTML = `
      <div class="space-y-xl">
        <section>
          <h2 class="font-headline-lg text-headline-lg text-on-surface">User Directory</h2>
          <p class="text-on-surface-variant font-body-md text-body-md">
            Manage access, roles, and user information for your organization.
          </p>
        </section>
        ${renderUsersView()}
      </div>`;
    await mountUsersView();
  }
}

export default Board;
