/**
 * main.js
 * Punto de entrada principal de la aplicación.
 */

import { router } from './router.js';

/**
 * Maneja la navegación del navegador:
 * - Botón atrás
 * - Botón adelante
 */
window.addEventListener('popstate', router);

/**
 * Inicializa la aplicación
 */
router();