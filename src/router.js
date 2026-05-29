/**
 * router.js
 * Sistema de rutas SPA (Single Page Application).
 */

import Login from './pages/login.js';
import Board from './pages/board.js';

/**
 * Definición de rutas:
 * ruta → módulo/página
 */
const routes = {
  '/': Login,
  '/board': Board,
};

/**
 * Función principal del router.
 *
 * Se encarga de:
 * - Leer la ruta actual
 * - Validar autenticación
 * - Renderizar la vista correcta
 * - Ejecutar mounted() para eventos
 *
 * El sidebar NO pertenece a páginas individuales.
 * Vive dentro de board.js y solo se vuelve
 * a renderizar cuando se sale completamente
 * de /board.
 */
export function router() {

  // Obtiene ruta actual
  let path = window.location.pathname;

  // Obtiene sesión guardada
  const rawUser =
    localStorage.getItem('session');

  // Convierte sesión a objeto
  const user = rawUser
    ? JSON.parse(rawUser)
    : null;

  /**
   * Protección de autenticación:
   * Si no hay sesión y entra a /board
   * redirige al login
   */
  if (path === '/board' && !user) {

    path = '/';

    history.pushState(null, null, path);
  }

  /**
   * Protección inversa:
   * Si ya hay sesión y entra al login
   * redirige al board
   */
  if (path === '/' && user) {

    path = '/board';

    history.pushState(null, null, path);
  }

  // Obtiene componente según ruta
  const page = routes[path];

  /**
   * Página no encontrada (404)
   */
  if (!page) {

    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center">

        <div class="text-center space-y-md">

          <h1 class="font-display-lg text-display-lg text-primary">
            404
          </h1>

          <p class="font-body-md text-body-md text-on-surface-variant">
            Page not found
          </p>

          <a href="/"
             onclick="history.pushState(null,null,'/');
             router();
             return false;"

             class="text-primary font-label-md hover:underline">

            Go home
          </a>
        </div>
      </div>`;

    return;
  }

  /**
   * Renderiza página actual
   */
  document.getElementById('app').innerHTML =
    page.render();

  /**
   * Ejecuta mounted()
   * para eventos y lógica JS
   */
  page.mounted();
}

/**
 * Navega entre rutas
 * SIN recargar la página
 *
 * @param {string} path
 */
export function navigate(path) {

  // Cambia URL
  history.pushState(null, null, path);

  // Ejecuta router
  router();
}