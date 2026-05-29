/**
 * session.js
 * Helpers para manejar la sesión del usuario
 * utilizando localStorage.
 *
 * La contraseña nunca se almacena.
 */

// Clave usada en localStorage
const SESSION_KEY = 'session';

/**
 * Guarda la sesión del usuario
 * excluyendo la contraseña
 */
export function saveSession(user) {

  // Elimina password del objeto
  const { password, ...safeUser } = user;

  // Guarda usuario seguro en localStorage
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(safeUser)
  );
}

/**
 * Obtiene el usuario actual de la sesión
 *
 * @returns {Object|null}
 */
export function getSession() {

  // Lee datos desde localStorage
  const raw =
    localStorage.getItem(SESSION_KEY);

  // Convierte JSON o devuelve null
  return raw
    ? JSON.parse(raw)
    : null;
}

/**
 * Limpia la sesión actual
 * (logout)
 */
export function clearSession() {

  localStorage.removeItem(SESSION_KEY);
}

/**
 * Verifica si el usuario actual
 * es administrador
 *
 * @returns {boolean}
 */
export function isAdmin() {

  // Obtiene usuario actual
  const user = getSession();

  // Retorna true si es admin
  return user?.role === 'admin';
}