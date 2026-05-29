/**
 * usersView.js
 * Vista de Directorio de Usuarios exclusiva para administradores.
 * Se renderiza dentro del área principal de board.js.
 *
 * Replica la experiencia de admin-app:
 * - Crear usuarios
 * - Editar usuarios
 * - Eliminar usuarios
 *
 * El administrador también puede asignar roles
 * (admin o coder).
 */

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} from '../../services/api.js';

// Guarda el ID del usuario en edición
let editingId = null;

/**
 * Renderiza la estructura HTML del directorio de usuarios
 */
export function renderUsersView() {

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-xl">

      <!-- Izquierda: formulario -->
      <section class="xl:col-span-4 h-fit">

        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">

          <!-- Encabezado -->
          <div class="flex items-center gap-sm mb-lg border-b border-outline-variant pb-md">

            <span class="material-symbols-outlined text-primary">
              person_add
            </span>

            <h3 class="font-headline-sm text-headline-sm"
                id="form-title">

              Add User
            </h3>
          </div>

          <!-- Formulario -->
          <form class="space-y-md" id="userForm">

            <!-- Campo oculto ID -->
            <input type="hidden" id="form-user-id" />

            <!-- Nombre -->
            <div class="space-y-xs">

              <label class="font-label-md text-label-md text-on-surface-variant block">
                Full Name
              </label>

              <input id="form-name"
                     type="text"
                     name="name"
                     class="w-full h-10 px-md rounded-lg border border-outline
                            focus:border-primary focus:ring-1 focus:ring-primary
                            outline-none text-body-sm transition-all"
                     placeholder="e.g. Jane Doe"
                     required />
            </div>

            <!-- Correo -->
            <div class="space-y-xs">

              <label class="font-label-md text-label-md text-on-surface-variant block">
                Email
              </label>

              <input id="form-email"
                     type="email"
                     name="email"
                     class="w-full h-10 px-md rounded-lg border border-outline
                            focus:border-primary focus:ring-1 focus:ring-primary
                            outline-none text-body-sm transition-all"
                     placeholder="jane@company.com"
                     required />
            </div>

            <!-- Contraseña -->
            <div class="space-y-xs">

              <label class="font-label-md text-label-md text-on-surface-variant block">
                Password
              </label>

              <input id="form-password"
                     type="password"
                     name="password"
                     class="w-full h-10 px-md rounded-lg border border-outline
                            focus:border-primary focus:ring-1 focus:ring-primary
                            outline-none text-body-sm transition-all"
                     placeholder="••••••••"
                     required />
            </div>

            <!-- Rol -->
            <div class="space-y-xs">

              <label class="font-label-md text-label-md text-on-surface-variant block">
                Role
              </label>

              <select id="form-role"
                      name="role"
                      class="w-full h-10 px-md rounded-lg border border-outline
                             focus:border-primary focus:ring-1 focus:ring-primary
                             outline-none text-body-sm transition-all">

                <option value="coder">
                  Coder
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            <!-- Botones -->
            <div class="pt-md flex gap-sm">

              <!-- Guardar -->
              <button type="submit"
                      class="flex-1 bg-primary text-on-primary
                             font-label-md text-label-md py-3 rounded-lg
                             hover:brightness-110 active:scale-[0.98]
                             transition-all flex items-center justify-center gap-sm">

                <span class="material-symbols-outlined text-[20px]"
                      id="form-btn-icon">

                  save
                </span>

                <span id="form-btn-label">
                  Save User
                </span>
              </button>

              <!-- Cancelar -->
              <button type="button"
                      id="btn-cancel-edit"
                      class="hidden px-lg py-3 rounded-lg border border-outline-variant
                             font-label-md text-label-md text-on-surface-variant
                             hover:bg-surface-container-low transition-colors">

                Cancel
              </button>
            </div>

            <!-- Mensaje feedback -->
            <p id="form-feedback"
               class="hidden font-body-sm text-body-sm text-center
                      rounded-lg px-md py-sm"></p>
          </form>
        </div>
      </section>

      <!-- Derecha: tabla -->
      <section class="xl:col-span-8">

        <div class="bg-surface-container-lowest border border-outline-variant
                    rounded-xl shadow-sm overflow-hidden">

          <!-- Encabezado tabla -->
          <div class="px-lg py-md flex justify-between items-center
                      border-b border-outline-variant">

            <h3 class="font-headline-sm text-headline-sm">
              User List
            </h3>

            <span class="font-label-sm text-label-sm text-on-surface-variant"
                  id="users-count"></span>
          </div>

          <!-- Tabla -->
          <div class="overflow-x-auto">

            <table class="w-full text-left border-collapse">

              <thead>
                <tr class="bg-surface-container-low border-b border-outline-variant">

                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant">
                    ID
                  </th>

                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant">
                    Name
                  </th>

                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant">
                    Email
                  </th>

                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant">
                    Role
                  </th>

                  <th class="px-lg py-md font-label-md text-label-md text-on-surface-variant text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <!-- Cuerpo -->
              <tbody class="divide-y divide-outline-variant/50"
                     id="users-table-body">

                <tr>
                  <td colspan="5"
                      class="px-lg py-lg text-center text-on-surface-variant font-body-sm">

                    Loading...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>`;
}

/**
 * Carga usuarios desde la API
 * y llena la tabla
 */
async function loadUsers() {

  // Obtiene usuarios
  const users = await getUsers();

  const tbody =
    document.getElementById('users-table-body');

  const countEl =
    document.getElementById('users-count');

  // Actualiza contador
  if (countEl) {

    countEl.textContent =
      `${users.length} user${users.length !== 1 ? 's' : ''}`;
  }

  /**
   * Genera badges según el rol
   */
  const roleBadge = (role) =>
    role === 'admin'

      ? `
        <span class="px-2 py-0.5 rounded-full
                     bg-primary-fixed text-on-primary-fixed-variant
                     font-label-sm text-label-sm">

          Admin
        </span>`

      : `
        <span class="px-2 py-0.5 rounded-full
                     bg-secondary-container text-on-secondary-container
                     font-label-sm text-label-sm">

          Coder
        </span>`;

  // Inserta filas
  tbody.innerHTML = users.map(user => `

    <tr class="hover:bg-surface-container-low transition-colors group">

      <!-- ID -->
      <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">
        ${user.id}
      </td>

      <!-- Nombre -->
      <td class="px-lg py-md font-body-md text-body-md text-on-surface">

        <div class="flex items-center gap-sm">

          <!-- Avatar -->
          <div class="w-7 h-7 rounded-full bg-primary
                      flex items-center justify-center shrink-0">

            <span class="text-on-primary font-label-sm text-label-sm uppercase">
              ${user.name[0]}
            </span>
          </div>

          ${user.name}
        </div>
      </td>

      <!-- Email -->
      <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">
        ${user.email}
      </td>

      <!-- Rol -->
      <td class="px-lg py-md">
        ${roleBadge(user.role)}
      </td>

      <!-- Acciones -->
      <td class="px-lg py-md text-right">

        <div class="flex justify-end gap-xs opacity-0
                    group-hover:opacity-100 transition-opacity">

          <!-- Editar -->
          <button class="btn-edit-user p-2 rounded-lg
                         hover:bg-surface-container-highest text-primary
                         transition-all active:scale-90"
                  data-user-id="${user.id}"
                  title="Edit">

            <span class="material-symbols-outlined text-[20px]">
              edit
            </span>
          </button>

          <!-- Eliminar -->
          <button class="btn-delete-user p-2 rounded-lg
                         hover:bg-error-container text-error
                         transition-all active:scale-90"
                  data-user-id="${user.id}"
                  title="Delete">

            <span class="material-symbols-outlined text-[20px]">
              delete
            </span>
          </button>
        </div>
      </td>
    </tr>`).join('');

  // Asocia eventos
  bindTableActions();
}

/**
 * Carga los datos de un usuario
 * dentro del formulario para edición
 */
async function loadUserIntoForm(id) {

  const user = await getUserById(id);

  editingId = id;

  // Llena campos
  document.getElementById('form-user-id').value =
    user.id;

  document.getElementById('form-name').value =
    user.name;

  document.getElementById('form-email').value =
    user.email;

  document.getElementById('form-password').value =
    user.password || '';

  document.getElementById('form-role').value =
    user.role;

  // Cambia textos del formulario
  document.getElementById('form-title').textContent =
    'Edit User';

  document.getElementById('form-btn-icon').textContent =
    'update';

  document.getElementById('form-btn-label').textContent =
    'Update User';

  // Muestra botón cancelar
  document.getElementById('btn-cancel-edit')
    .classList.remove('hidden');

  // Enfoca input nombre
  document.getElementById('form-name').focus();
}

/**
 * Reinicia el formulario
 */
function resetForm() {

  editingId = null;

  document.getElementById('userForm').reset();

  document.getElementById('form-user-id').value = '';

  document.getElementById('form-title').textContent =
    'Add User';

  document.getElementById('form-btn-icon').textContent =
    'save';

  document.getElementById('form-btn-label').textContent =
    'Save User';

  document.getElementById('btn-cancel-edit')
    .classList.add('hidden');
}

/**
 * Muestra mensajes de éxito o error
 */
function showFeedback(msg, isError = false) {

  const el =
    document.getElementById('form-feedback');

  el.textContent = msg;

  // Cambia estilos según el tipo
  el.className = `
    font-body-sm text-body-sm text-center rounded-lg px-md py-sm
    ${isError
      ? 'text-error bg-error-container'
      : 'text-on-primary bg-primary/80 text-white'
    }`;

  // Muestra mensaje
  el.classList.remove('hidden');

  // Oculta automáticamente
  setTimeout(() => {
    el.classList.add('hidden');
  }, 3000);
}

/**
 * Asocia eventos a botones de la tabla
 */
function bindTableActions() {

  // Botones editar
  document.querySelectorAll('.btn-edit-user')
    .forEach(btn => {

      btn.addEventListener('click', () => {

        loadUserIntoForm(btn.dataset.userId);
      });
    });

  // Botones eliminar
  document.querySelectorAll('.btn-delete-user')
    .forEach(btn => {

      btn.addEventListener('click', async () => {

        const confirmed =
          confirm('Delete this user? This cannot be undone.');

        if (!confirmed) return;

        await deleteUser(btn.dataset.userId);

        await loadUsers();
      });
    });
}

/**
 * Función principal ejecutada por board.js
 * cuando se cambia a la vista de usuarios
 */
export async function mountUsersView() {

  // Carga usuarios
  await loadUsers();

  // Evento submit del formulario
  document.getElementById('userForm')
    .addEventListener('submit', async (e) => {

      e.preventDefault();

      // Obtiene valores
      const name =
        document.getElementById('form-name')
          .value.trim();

      const email =
        document.getElementById('form-email')
          .value.trim();

      const password =
        document.getElementById('form-password')
          .value.trim();

      const role =
        document.getElementById('form-role')
          .value;

      // Validación básica
      if (!name || !email || !password) return;

      // Editar usuario
      if (editingId) {

        await updateUser(editingId, {
          name,
          email,
          password,
          role
        });

        showFeedback('User updated successfully!');

      } else {

        // Crear usuario
        await createUser({
          name,
          email,
          password,
          role
        });

        showFeedback('User created successfully!');
      }

      // Reinicia formulario
      resetForm();

      // Recarga tabla
      await loadUsers();
    });

  // Evento cancelar edición
  document.getElementById('btn-cancel-edit')
    .addEventListener('click', resetForm);
}