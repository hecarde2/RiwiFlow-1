/**
 * usersView.js
 * Admin-only User Directory view.
 * Rendered inside the main content area of board.js.
 * Replicates the UX from admin-app: create, edit, delete users.
 * Admin can also set the role of new users (admin or coder).
 */

import { getUsers, createUser, updateUser, deleteUser, getUserById } from '../../services/api.js';

let editingId = null;

/** HTML shell for the user directory */
export function renderUsersView() {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-xl">
      <!-- Left: Form -->
      <section class="xl:col-span-4 h-fit">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <div class="flex items-center gap-sm mb-lg border-b border-outline-variant pb-md">
            <span class="material-symbols-outlined text-primary">person_add</span>
            <h3 class="font-headline-sm text-headline-sm" id="form-title">Add User</h3>
          </div>

          <form class="space-y-md" id="userForm">
            <input type="hidden" id="form-user-id" />

            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface-variant block">Full Name</label>
              <input id="form-name" type="text" name="name"
                     class="w-full h-10 px-md rounded-lg border border-outline focus:border-primary
                            focus:ring-1 focus:ring-primary outline-none text-body-sm transition-all"
                     placeholder="e.g. Jane Doe" required />
            </div>

            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface-variant block">Email</label>
              <input id="form-email" type="email" name="email"
                     class="w-full h-10 px-md rounded-lg border border-outline focus:border-primary
                            focus:ring-1 focus:ring-primary outline-none text-body-sm transition-all"
                     placeholder="jane@company.com" required />
            </div>

            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface-variant block">Password</label>
              <input id="form-password" type="password" name="password"
                     class="w-full h-10 px-md rounded-lg border border-outline focus:border-primary
                            focus:ring-1 focus:ring-primary outline-none text-body-sm transition-all"
                     placeholder="••••••••" required />
            </div>

            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface-variant block">Role</label>
              <select id="form-role" name="role"
                      class="w-full h-10 px-md rounded-lg border border-outline focus:border-primary
                             focus:ring-1 focus:ring-primary outline-none text-body-sm transition-all">
                <option value="coder">Coder</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="pt-md flex gap-sm">
              <button type="submit"
                      class="flex-1 bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg
                             hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm">
                <span class="material-symbols-outlined text-[20px]" id="form-btn-icon">save</span>
                <span id="form-btn-label">Save User</span>
              </button>
              <button type="button" id="btn-cancel-edit"
                      class="hidden px-lg py-3 rounded-lg border border-outline-variant font-label-md
                             text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
                Cancel
              </button>
            </div>

            <p id="form-feedback" class="hidden font-body-sm text-body-sm text-center rounded-lg px-md py-sm"></p>
          </form>
        </div>
      </section>

      <!-- Right: Table -->
      <section class="xl:col-span-8">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div class="px-lg py-md flex justify-between items-center border-b border-outline-variant">
            <h3 class="font-headline-sm text-headline-sm">User List</h3>
            <span class="font-label-sm text-label-sm text-on-surface-variant" id="users-count"></span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-container-low border-b border-outline-variant">
                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant">ID</th>
                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant">Name</th>
                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant">Email</th>
                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant">Role</th>
                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/50" id="users-table-body">
                <tr><td colspan="5" class="px-lg py-lg text-center text-on-surface-variant font-body-sm">
                  Loading...
                </td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>`;
}

/** Loads users from API and populates the table */
async function loadUsers() {
  const users = await getUsers();
  const tbody = document.getElementById('users-table-body');
  const countEl = document.getElementById('users-count');

  if (countEl) countEl.textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;

  const roleBadge = (role) => role === 'admin'
    ? `<span class="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm">Admin</span>`
    : `<span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">Coder</span>`;

  tbody.innerHTML = users.map(user => `
    <tr class="hover:bg-surface-container-low transition-colors group">
      <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">${user.id}</td>
      <td class="px-lg py-md font-body-md text-body-md text-on-surface">
        <div class="flex items-center gap-sm">
          <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span class="text-on-primary font-label-sm text-label-sm uppercase">${user.name[0]}</span>
          </div>
          ${user.name}
        </div>
      </td>
      <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">${user.email}</td>
      <td class="px-lg py-md">${roleBadge(user.role)}</td>
      <td class="px-lg py-md text-right">
        <div class="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
          <button class="btn-edit-user p-2 rounded-lg hover:bg-surface-container-highest text-primary
                         transition-all active:scale-90" data-user-id="${user.id}" title="Edit">
            <span class="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button class="btn-delete-user p-2 rounded-lg hover:bg-error-container text-error
                         transition-all active:scale-90" data-user-id="${user.id}" title="Delete">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </td>
    </tr>`).join('');

  bindTableActions();
}

/** Fills the form with a user's data for editing */
async function loadUserIntoForm(id) {
  const user = await getUserById(id);
  editingId = id;

  document.getElementById('form-user-id').value = user.id;
  document.getElementById('form-name').value = user.name;
  document.getElementById('form-email').value = user.email;
  document.getElementById('form-password').value = user.password || '';
  document.getElementById('form-role').value = user.role;

  document.getElementById('form-title').textContent = 'Edit User';
  document.getElementById('form-btn-icon').textContent = 'update';
  document.getElementById('form-btn-label').textContent = 'Update User';
  document.getElementById('btn-cancel-edit').classList.remove('hidden');

  document.getElementById('form-name').focus();
}

function resetForm() {
  editingId = null;
  document.getElementById('userForm').reset();
  document.getElementById('form-user-id').value = '';
  document.getElementById('form-title').textContent = 'Add User';
  document.getElementById('form-btn-icon').textContent = 'save';
  document.getElementById('form-btn-label').textContent = 'Save User';
  document.getElementById('btn-cancel-edit').classList.add('hidden');
}

function showFeedback(msg, isError = false) {
  const el = document.getElementById('form-feedback');
  el.textContent = msg;
  el.className = `font-body-sm text-body-sm text-center rounded-lg px-md py-sm ${
    isError ? 'text-error bg-error-container' : 'text-on-primary bg-primary/80 text-white'
  }`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

function bindTableActions() {
  document.querySelectorAll('.btn-edit-user').forEach(btn => {
    btn.addEventListener('click', () => loadUserIntoForm(btn.dataset.userId));
  });

  document.querySelectorAll('.btn-delete-user').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this user? This cannot be undone.')) return;
      await deleteUser(btn.dataset.userId);
      await loadUsers();
    });
  });
}

/** Mount function called by board.js when switching to users view */
export async function mountUsersView() {
  await loadUsers();

  document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const password = document.getElementById('form-password').value.trim();
    const role = document.getElementById('form-role').value;

    if (!name || !email || !password) return;

    if (editingId) {
      await updateUser(editingId, { name, email, password, role });
      showFeedback('User updated successfully!');
    } else {
      await createUser({ name, email, password, role });
      showFeedback('User created successfully!');
    }

    resetForm();
    await loadUsers();
  });

  document.getElementById('btn-cancel-edit').addEventListener('click', resetForm);
}
