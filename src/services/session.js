/**
 * session.js
 * Helpers for reading and writing the logged-in user
 * from localStorage. Password is never stored.
 */

const SESSION_KEY = 'session';

/** Save user to session (omit password). */
export function saveSession(user) {
  const { password, ...safeUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
}

/** Read current session user or null. */
export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

/** Clear session (logout). */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** Check if the current user is an admin. */
export function isAdmin() {
  const user = getSession();
  return user?.role === 'admin';
}
