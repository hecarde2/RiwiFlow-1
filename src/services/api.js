/**
 * api.js
 * Servicio centralizado de la API.
 *
 * Todas las peticiones HTTP hacia json-server
 * pasan por este archivo.
 *
 * BASE_URL se obtiene desde la variable
 * de entorno de Vite.
 */

// URL base de la API
const BASE_URL = import.meta.env.VITE_API_URL;

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

/**
 * Valida credenciales contra /users
 *
 * @param {string} email
 * @param {string} password
 *
 * @returns {Object|null}
 * Devuelve el usuario encontrado o null
 */
export async function loginUser(email, password) {

  // Consulta usuario por email y contraseña
  const res = await fetch(
    `${BASE_URL}/users?email=${email}&password=${password}`
  );

  // Convierte respuesta a JSON
  const data = await res.json();

  // Devuelve primer usuario encontrado o null
  return data.length > 0
    ? data[0]
    : null;
}

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────

/**
 * Obtiene todos los usuarios
 */
export async function getUsers() {

  const res = await fetch(`${BASE_URL}/users`);

  return res.json();
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(id) {

  const res = await fetch(`${BASE_URL}/users/${id}`);

  return res.json();
}

/**
 * Crea un nuevo usuario
 */
export async function createUser(userData) {

  const res = await fetch(`${BASE_URL}/users`, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(userData),
  });

  return res.json();
}

/**
 * Actualiza un usuario existente
 */
export async function updateUser(id, userData) {

  const res = await fetch(`${BASE_URL}/users/${id}`, {

    method: 'PUT',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(userData),
  });

  return res.json();
}

/**
 * Elimina un usuario
 */
export async function deleteUser(id) {

  const res = await fetch(
    `${BASE_URL}/users/${id}`,
    {
      method: 'DELETE'
    }
  );

  return res.json();
}

// ─────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────

/**
 * Obtiene todas las tareas
 */
export async function getTasks() {

  const res = await fetch(`${BASE_URL}/tasks`);

  return res.json();
}

/**
 * Obtiene una tarea por ID
 */
export async function getTaskById(id) {

  const res = await fetch(`${BASE_URL}/tasks/${id}`);

  return res.json();
}

/**
 * Crea una nueva tarea
 */
export async function createTask(taskData) {

  const res = await fetch(`${BASE_URL}/tasks`, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(taskData),
  });

  return res.json();
}

/**
 * Actualiza una tarea existente
 */
export async function updateTask(id, taskData) {

  const res = await fetch(`${BASE_URL}/tasks/${id}`, {

    method: 'PUT',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(taskData),
  });

  return res.json();
}

/**
 * Elimina una tarea
 */
export async function deleteTask(id) {

  const res = await fetch(
    `${BASE_URL}/tasks/${id}`,
    {
      method: 'DELETE'
    }
  );

  return res.json();
}