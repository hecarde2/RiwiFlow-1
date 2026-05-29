/**
 * board.js
 * Contenedor principal de la aplicación autenticada.
 *
 * Arquitectura:
 *
 *   ┌──────────────────────────────────────────┐
 *   │  SIDEBAR (nunca se vuelve a renderizar) │
 *   │  ┌────────────────────────────────────┐  │
 *   │  │  #main-content (cambia al navegar) │  │
 *   │  └────────────────────────────────────┘  │
 *   └──────────────────────────────────────────┘
 *
 * Cuando el usuario hace clic en un elemento
 * del sidebar, SOLO se reemplaza #main-content.
 *
 * El sidebar permanece fijo:
 * - Sin recarga completa
 * - Sin refrescar la página
 *
 * Esto cumple el requerimiento HU-02
 * (SPA sin recargar el sidebar).
 */

import {
  renderSidebar,
  setActiveNav
} from '../components/sidebar.js';

import {
  clearSession,
  getSession,
  isAdmin
} from '../services/session.js';

import { navigate } from '../router.js';

import {
  renderKanbanView,
  mountKanbanView
} from './views/kanbanView.js';

import {
  renderUsersView,
  mountUsersView
} from './views/usersView.js';

// Vista actual
let currentView = 'board';

/**
 * Renderiza la estructura completa:
 * - Sidebar
 * - Top bar
 * - Área principal
 */
const Board = {

  render() {

    // Obtiene usuario actual
    const user = getSession();

    return `
      <div class="bg-background text-on-background min-h-screen flex overflow-hidden">

        <!-- Sidebar -->
        ${renderSidebar()}

        <!-- Contenedor principal -->
        <div class="flex flex-col flex-1 md:ml-[280px] h-screen overflow-hidden">

          <!-- Barra superior fija -->
          <header class="flex justify-between items-center w-full h-16 px-lg sticky top-0 z-30
                         bg-surface border-b border-outline-variant shrink-0">

            <!-- Parte izquierda -->
            <div class="flex items-center gap-md">

              <!-- Logo -->
              <span class="font-headline-md text-headline-md font-bold text-primary">
                RiwiFlow
              </span>

              <!-- Buscador -->
              <div class="hidden lg:block relative">

                <span class="material-symbols-outlined absolute left-3 top-1/2
                             -translate-y-1/2 text-on-surface-variant/60">

                  search
                </span>

                <input class="pl-10 pr-4 py-1.5 w-64 rounded-lg
                              bg-surface-container-low border-none
                              focus:ring-2 focus:ring-primary/20
                              text-body-sm font-body-sm"
                       placeholder="Search tasks..."
                       type="text"
                       id="search-input" />
              </div>
            </div>

            <!-- Parte derecha -->
            <div class="flex items-center gap-md">

              <!-- Notificaciones -->
              <button class="p-2 rounded-full hover:bg-surface-container-high transition-colors">

                <span class="material-symbols-outlined text-primary">
                  notifications
                </span>
              </button>

              <!-- Separador -->
              <div class="h-8 w-px bg-outline-variant mx-sm"></div>

              <!-- Información usuario -->
              <div class="flex items-center gap-sm">

                <!-- Avatar -->
                <div class="w-8 h-8 rounded-full bg-primary
                            flex items-center justify-center">

                  <span class="text-on-primary font-label-md text-label-md uppercase">
                    ${(user?.name || 'U')[0]}
                  </span>
                </div>

                <!-- Nombre -->
                <span class="font-label-md text-label-md hidden md:block text-on-surface">
                  ${user?.name || ''}
                </span>

                <!-- Rol -->
                <span class="font-label-sm text-label-sm text-outline capitalize hidden md:block">
                  (${user?.role || ''})
                </span>
              </div>
            </div>
          </header>

          <!-- Área principal con scroll -->
          <main class="flex-1 overflow-y-auto p-lg"
                id="main-content">

            <!-- La vista inicial se renderiza desde mounted() -->
          </main>
        </div>
      </div>`;
  },

  /**
   * Se ejecuta después de renderizar el componente
   */
  mounted() {

    // Evento logout
    document.getElementById('btn-logout')
      ?.addEventListener('click', () => {

        // Limpia sesión
        clearSession();

        // Redirige al login
        navigate('/');
      });

    /**
     * Navegación del sidebar
     * SOLO reemplaza #main-content
     */
    document.querySelectorAll('.sidebar-nav-btn')
      .forEach(btn => {

        btn.addEventListener('click', () => {

          const view = btn.dataset.view;

          switchView(view);
        });
      });

    // Carga vista inicial
    switchView('board');
  },
};

/**
 * Cambia la vista principal
 * SIN tocar el sidebar
 */
async function switchView(view) {

  /**
   * Protección:
   * Los coders no pueden acceder
   * a la vista de usuarios
   */
  if (view === 'users' && !isAdmin()) {

    view = 'board';
  }

  // Guarda vista actual
  currentView = view;

  // Marca botón activo
  setActiveNav(view);

  // Contenedor principal
  const content =
    document.getElementById('main-content');

  /**
   * Renderiza vista Kanban
   */
  if (view === 'board') {

    // Inserta HTML
    content.innerHTML =
      renderKanbanView();

    // Monta lógica JS
    await mountKanbanView();

  }

  /**
   * Renderiza vista Usuarios
   */
  else if (view === 'users') {

    // Inserta HTML
    content.innerHTML = `
      <div class="space-y-xl">

        <!-- Encabezado -->
        <section>

          <h2 class="font-headline-lg text-headline-lg text-on-surface">
            User Directory
          </h2>

          <p class="text-on-surface-variant font-body-md text-body-md">
            Manage access, roles, and user information
            for your organization.
          </p>
        </section>

        <!-- Vista usuarios -->
        ${renderUsersView()}
      </div>`;

    // Monta lógica JS
    await mountUsersView();
  }
}

// Exporta componente principal
export default Board;