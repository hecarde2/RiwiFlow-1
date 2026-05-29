/**
 * api.js
 * Centralized API service.
 * All HTTP calls to json-server go through here.
 * BASE_URL comes from the Vite env variable.
 */

const BASE_URL = import.meta.env.VITE_API_URL;

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * Validate credentials against /users.
 * Returns the matching user object or null.
 */
export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
}

export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  return res.json();
}

export async function createUser(userData) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function updateUser(id, userData) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
  return res.json();
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  return res.json();
}

export async function getTaskById(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`);
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  return res.json();
}

export async function updateTask(id, taskData) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
  return res.json();
}
