/**
 * taskCard.js
 * Returns the HTML string for a single Kanban task card.
 * Receives the task object and the current user for permission checks.
 */

import { isAdmin } from '../services/session.js';

/** Status badge color map */
const STATUS_COLORS = {
  'todo': 'bg-surface-container-high text-on-surface-variant',
  'in progress': 'bg-primary-fixed text-on-primary-fixed-variant',
  'in review': 'bg-secondary-container text-on-secondary-container',
  'done': 'bg-tertiary-fixed text-on-tertiary-fixed',
};

/**
 * Renders a task card HTML string.
 * @param {Object} task  - task from the API
 * @param {Object} user  - current session user
 * @param {Object} usersMap - { [userId]: userName } lookup
 */
export function renderTaskCard(task, user, usersMap) {
  const admin = isAdmin();
  const isOwner = task.userId === user.id;
  const canEdit = admin || isOwner;

  const badgeClass = STATUS_COLORS[task.status] || STATUS_COLORS['todo'];
  const assigneeName = usersMap[task.userId] || `User #${task.userId}`;

  // Done cards get a strikethrough style
  const titleClass = task.status === 'done'
    ? 'font-label-md text-label-md text-on-surface line-through opacity-60'
    : 'font-label-md text-label-md text-on-surface';

  const cardOpacity = task.status === 'done' ? 'opacity-80' : '';

  return `
    <div class="task-card bg-surface border border-outline-variant rounded-xl p-md shadow-sm ${cardOpacity}"
         draggable="true"
         data-task-id="${task.id}"
         data-status="${task.status}">
      <!-- Top row: status badge + actions -->
      <div class="flex items-start justify-between mb-xs">
        <span class="px-2 py-0.5 rounded-full font-label-sm text-label-sm ${badgeClass}">
          ${task.status}
        </span>
        ${task.status === 'done' ? `
          <span class="material-symbols-outlined text-sm text-tertiary-container"
                style="font-variation-settings: 'FILL' 1">check_circle</span>` : ''}
      </div>

      <!-- Title -->
      <h4 class="${titleClass} mb-xs mt-sm">${task.title}</h4>

      <!-- Description -->
      <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
        ${task.description}
      </p>

      <!-- Footer: assignee + actions -->
      <div class="mt-md flex items-center justify-between">
        <span class="font-label-sm text-label-sm text-outline flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">person</span>
          ${assigneeName}
        </span>
        ${canEdit ? `
          <div class="flex gap-xs">
            <button class="btn-edit-task p-1 rounded-lg hover:bg-surface-container-high
                           text-primary transition-all active:scale-90"
                    data-task-id="${task.id}" title="Edit">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            ${admin ? `
              <button class="btn-delete-task p-1 rounded-lg hover:bg-error-container
                             text-error transition-all active:scale-90"
                      data-task-id="${task.id}" title="Delete">
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>` : ''}
          </div>` : ''}
      </div>
    </div>`;
}
