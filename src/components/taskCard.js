/**
 * taskCard.js
 * Retorna el HTML de una tarjeta individual de tareas Kanban.
 * Recibe el objeto de tarea y el usuario actual
 * para realizar validaciones de permisos.
 */

import { isAdmin } from '../services/session.js';

/** Mapa de colores para las etiquetas de estado */
const STATUS_COLORS = {
  'todo': 'bg-surface-container-high text-on-surface-variant',
  'in progress': 'bg-primary-fixed text-on-primary-fixed-variant',
  'in review': 'bg-secondary-container text-on-secondary-container',
  'done': 'bg-tertiary-fixed text-on-tertiary-fixed',
};

/**
 * Renderiza el HTML de una tarjeta de tarea.
 * @param {Object} task - tarea obtenida desde la API
 * @param {Object} user - usuario actual en sesión
 * @param {Object} usersMap - objeto de búsqueda { [userId]: userName }
 */
export function renderTaskCard(task, user, usersMap) {

  // Verifica si el usuario es administrador
  const admin = isAdmin();

  // Verifica si el usuario es dueño de la tarea
  const isOwner = task.userId === user.id;

  // Permisos para editar
  const canEdit = admin || isOwner;

  // Obtiene la clase de color según el estado
  const badgeClass =
    STATUS_COLORS[task.status] || STATUS_COLORS['todo'];

  // Obtiene el nombre del usuario asignado
  const assigneeName =
    usersMap[task.userId] || `User #${task.userId}`;

  // Las tareas completadas tienen efecto tachado
  const titleClass = task.status === 'done'
    ? 'font-label-md text-label-md text-on-surface line-through opacity-60'
    : 'font-label-md text-label-md text-on-surface';

  // Reduce ligeramente la opacidad si está completada
  const cardOpacity =
    task.status === 'done' ? 'opacity-80' : '';

  // Retorna el HTML completo de la tarjeta
  return `
    <div class="task-card bg-surface border border-outline-variant rounded-xl p-md shadow-sm ${cardOpacity}"
         draggable="true"
         data-task-id="${task.id}"
         data-status="${task.status}">

      <!-- Parte superior: estado y acciones -->
      <div class="flex items-start justify-between mb-xs">

        <!-- Etiqueta de estado -->
        <span class="px-2 py-0.5 rounded-full font-label-sm text-label-sm ${badgeClass}">
          ${task.status}
        </span>

        <!-- Icono de tarea completada -->
        ${task.status === 'done' ? `
          <span class="material-symbols-outlined text-sm text-tertiary-container"
                style="font-variation-settings: 'FILL' 1">
            check_circle
          </span>` : ''}
      </div>

      <!-- Título -->
      <h4 class="${titleClass} mb-xs mt-sm">
        ${task.title}
      </h4>

      <!-- Descripción -->
      <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
        ${task.description}
      </p>

      <!-- Parte inferior: usuario asignado y acciones -->
      <div class="mt-md flex items-center justify-between">

        <!-- Usuario asignado -->
        <span class="font-label-sm text-label-sm text-outline flex items-center gap-1">

          <span class="material-symbols-outlined text-sm">
            person
          </span>

          ${assigneeName}
        </span>

        <!-- Botones de acciones -->
        ${canEdit ? `
          <div class="flex gap-xs">

            <!-- Botón editar -->
            <button class="btn-edit-task p-1 rounded-lg hover:bg-surface-container-high
                           text-primary transition-all active:scale-90"
                    data-task-id="${task.id}"
                    title="Edit">

              <span class="material-symbols-outlined text-[18px]">
                edit
              </span>
            </button>

            <!-- Botón eliminar solo para admin -->
            ${admin ? `
              <button class="btn-delete-task p-1 rounded-lg hover:bg-error-container
                             text-error transition-all active:scale-90"
                      data-task-id="${task.id}"
                      title="Delete">

                <span class="material-symbols-outlined text-[18px]">
                  delete
                </span>
              </button>` : ''}
          </div>` : ''}
      </div>
    </div>`;
}