/**
 * sidebar.js
 * Esta barra lateral se renderiza UNA SOLA VEZ dentro de board.js
 */

import { getSession } from '../services/session.js';

/** Elementos de navegación del sidebar (texto, ícono y vista) */
export const NAV_ITEMS = [
  { label: 'Kanban Board', icon: 'dashboard', view: 'board' },
  { label: 'User Directory', icon: 'group', view: 'users', adminOnly: true },
];

export function renderSidebar() {

  // Obtiene la sesión actual
  const user = getSession();

  // Verifica si el usuario es administrador
  const admin = user?.role === 'admin';

  // Genera dinámicamente los botones de navegación
  const navLinks = NAV_ITEMS

    // Filtra elementos solo para administradores
    .filter(item => !item.adminOnly || admin)

    // Crea el HTML de cada botón
    .map(item => `
      <button class="sidebar-nav-btn w-full text-left flex items-center px-4 py-3 mx-0 rounded-lg
                     font-body-sm text-body-sm transition-all duration-200
                     text-secondary hover:text-primary hover:bg-primary-container/10"
              data-view="${item.view}">
        <span class="material-symbols-outlined mr-3">${item.icon}</span>
        <span>${item.label}</span>
      </button>`)

    // Une todos los botones en un solo string
    .join('');

  // Retorna el HTML completo del sidebar
  return `
    <aside id="sidebar"
           class="hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low
                  border-r border-outline-variant w-[280px] shrink-0 fixed left-0 top-0 z-40">

      <!-- Marca / Encabezado -->
      <div class="px-gutter mb-xl">
        <h1 class="font-headline-md text-headline-md font-bold text-primary">
          Riwiflow
        </h1>

        <p class="font-body-sm text-body-sm text-on-surface-variant">
          Product Team
        </p>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 space-y-1 px-2" id="sidebar-nav">
        ${navLinks}
      </nav>

      <!-- Parte inferior: información del usuario y logout -->
      <div class="border-t border-outline-variant pt-md mx-4">

        <!-- Información del usuario -->
        <div class="flex items-center gap-sm px-2 py-2 mb-sm">

          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span class="text-on-primary font-label-md text-label-md uppercase">
              ${(user?.name || 'U')[0]}
            </span>
          </div>

          <!-- Nombre y rol -->
          <div class="overflow-hidden">
            <p class="font-label-md text-label-md text-on-surface truncate">
              ${user?.name || 'User'}
            </p>

            <p class="font-label-sm text-label-sm text-outline capitalize">
              ${user?.role || ''}
            </p>
          </div>
        </div>

        <!-- Botón cerrar sesión -->
        <button id="btn-logout"
                class="w-full flex items-center px-4 py-3 rounded-lg font-body-sm text-body-sm
                       text-secondary hover:text-error hover:bg-error-container/20 transition-all">

          <span class="material-symbols-outlined mr-3">logout</span>

          <span>Logout</span>
        </button>
      </div>
    </aside>`;
}

/**
 * Activa visualmente el botón de navegación correspondiente
 * a la vista actual (`activeView`).
 * Se ejecuta cada vez que cambia el contenido principal,
 * sin volver a renderizar el sidebar.
 */
export function setActiveNav(activeView) {

  // Recorre todos los botones del sidebar
  document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {

    // Verifica si el botón corresponde a la vista activa
    const isActive = btn.dataset.view === activeView;

    // Agrega o elimina clases según el estado
    btn.classList.toggle('bg-primary-fixed', isActive);
    btn.classList.toggle('text-on-primary-fixed-variant', isActive);
    btn.classList.toggle('scale-[0.98]', isActive);

    btn.classList.toggle('text-secondary', !isActive);
    btn.classList.toggle('hover:text-primary', !isActive);
    btn.classList.toggle('hover:bg-primary-container/10', !isActive);
  });
}