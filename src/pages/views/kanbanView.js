/**
 * kanbanView.js
 * Renders the Kanban board inside the main content area.
 * Supports full drag & drop between columns.
 * Admin: can create, edit, delete any task.
 * Coder: can edit only their own tasks (status + description).
 */

import { getTasks, getUsers, createTask, updateTask, deleteTask } from '../../services/api.js';
import { getSession, isAdmin } from '../../services/session.js';
import { renderTaskCard } from '../../components/taskCard.js';
import { initDragDrop } from '../../components/dragDrop.js';
import { openModal, closeModal } from '../../components/modal.js';

const COLUMNS = [
  { status: 'todo',        label: 'Todo',        color: 'bg-surface-container-high' },
  { status: 'in progress', label: 'In Progress',  color: 'bg-primary-fixed/50' },
  { status: 'in review',   label: 'In Review',    color: 'bg-secondary-container/40' },
  { status: 'done',        label: 'Done',         color: 'bg-tertiary-fixed/30' },
];

/** Renders the static column structure (cards inserted later) */
function renderColumns() {
  return COLUMNS.map(col => `
    <div class="kanban-column flex flex-col h-full" data-col="${col.status}">
      <div class="flex items-center justify-between mb-md px-1">
        <div class="flex items-center gap-2">
          <h3 class="font-title-sm text-title-sm text-on-surface">${col.label}</h3>
          <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full
                       font-label-sm text-label-sm col-count" data-col-count="${col.status}">0</span>
        </div>
        ${isAdmin() && col.status === 'todo' ? `
          <button class="btn-add-task material-symbols-outlined text-outline hover:text-primary transition-colors"
                  title="Add task">add_circle</button>` : `
          <button class="material-symbols-outlined text-outline" data-icon="more_horiz">more_horiz</button>`}
      </div>
      <div class="column-drop-zone flex-1 space-y-md p-2 rounded-xl overflow-y-auto custom-scrollbar
                  transition-all duration-200"
           data-status="${col.status}">
        <!-- Cards injected here -->
      </div>
    </div>`).join('');
}

/** Full board HTML shell */
export function renderKanbanView() {
  return `
    <div class="flex flex-col h-full">
      <!-- Board header -->
      <div class="flex items-center justify-between mb-lg px-1 shrink-0">
        <div>
          <h2 class="font-headline-md text-headline-md text-on-surface">Kanban Board</h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant">
            Drag cards between columns to update their status
          </p>
        </div>
        ${isAdmin() ? `
          <button id="btn-create-task"
                  class="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-lg
                         font-label-md text-label-md hover:brightness-110 active:scale-[0.98] transition-all">
            <span class="material-symbols-outlined text-[18px]">add</span>
            New Task
          </button>` : ''}
      </div>

      <!-- Columns -->
      <div class="flex gap-lg overflow-x-auto pb-md flex-1" id="kanban-board">
        ${renderColumns()}
      </div>
    </div>`;
}

/** Populates card HTML in each column drop zone */
async function populateBoard() {
  const [tasks, users] = await Promise.all([getTasks(), getUsers()]);
  const user = getSession();
  const usersMap = Object.fromEntries(users.map(u => [u.id, u.name]));

  COLUMNS.forEach(col => {
    const zone = document.querySelector(`.column-drop-zone[data-status="${col.status}"]`);
    const colTasks = tasks.filter(t => t.status === col.status);
    zone.innerHTML = colTasks.map(task => renderTaskCard(task, user, usersMap)).join('');

    // Update count badge
    const badge = document.querySelector(`.col-count[data-col-count="${col.status}"]`);
    if (badge) badge.textContent = colTasks.length;
  });

  // Re-init drag & drop after DOM update
  initDragDrop(async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
    await populateBoard();
    bindCardActions();
  });

  bindCardActions();
}

/** Opens the task create/edit modal */
function openTaskModal(task = null, users = [], prefillStatus = 'todo') {
  const admin = isAdmin();
  const isEdit = !!task;

  const userOptions = users
    .filter(u => u.role === 'coder')
    .map(u => `<option value="${u.id}" ${task?.userId == u.id ? 'selected' : ''}>${u.name}</option>`)
    .join('');

  const statusOptions = COLUMNS.map(col =>
    `<option value="${col.status}" ${(task?.status || prefillStatus) === col.status ? 'selected' : ''}>${col.label}</option>`
  ).join('');

  const bodyHTML = `
    <div class="space-y-md">
      <div class="space-y-xs">
        <label class="font-label-md text-label-md text-on-surface-variant block">Title</label>
        <input id="modal-task-title" type="text"
               class="w-full h-10 px-md rounded-lg border border-outline focus:border-primary
                      focus:ring-1 focus:ring-primary outline-none text-body-sm transition-all"
               placeholder="Task title" value="${task?.title || ''}"
               ${!admin ? 'disabled' : ''} required />
      </div>
      <div class="space-y-xs">
        <label class="font-label-md text-label-md text-on-surface-variant block">Description</label>
        <textarea id="modal-task-desc" rows="3"
                  class="w-full px-md py-sm rounded-lg border border-outline focus:border-primary
                         focus:ring-1 focus:ring-primary outline-none text-body-sm transition-all resize-none"
                  placeholder="What needs to be done?">${task?.description || ''}</textarea>
      </div>
      <div class="space-y-xs">
        <label class="font-label-md text-label-md text-on-surface-variant block">Status</label>
        <select id="modal-task-status"
                class="w-full h-10 px-md rounded-lg border border-outline focus:border-primary
                       focus:ring-1 focus:ring-primary outline-none text-body-sm transition-all">
          ${statusOptions}
        </select>
      </div>
      ${admin ? `
        <div class="space-y-xs">
          <label class="font-label-md text-label-md text-on-surface-variant block">Assign to</label>
          <select id="modal-task-user"
                  class="w-full h-10 px-md rounded-lg border border-outline focus:border-primary
                         focus:ring-1 focus:ring-primary outline-none text-body-sm transition-all">
            ${userOptions}
          </select>
        </div>` : ''}
    </div>`;

  openModal({
    title: isEdit ? 'Edit Task' : 'Create Task',
    bodyHTML,
    confirmLabel: isEdit ? 'Update' : 'Create',
    onConfirm: async () => {
      const title = document.getElementById('modal-task-title')?.value.trim();
      const description = document.getElementById('modal-task-desc').value.trim();
      const status = document.getElementById('modal-task-status').value;
      const userIdEl = document.getElementById('modal-task-user');
      const userId = userIdEl ? parseInt(userIdEl.value) : task?.userId;

      if (!description) return;

      if (isEdit) {
        const payload = admin
          ? { title, description, status, userId }
          : { description, status };
        await updateTask(task.id, { ...task, ...payload });
      } else {
        await createTask({ title, description, status: status || 'todo', userId });
      }

      closeModal();
      await populateBoard();
      bindCardActions();
    },
  });
}

/** Binds edit/delete buttons on all cards */
function bindCardActions() {
  document.querySelectorAll('.btn-edit-task').forEach(btn => {
    btn.addEventListener('click', async () => {
      const taskId = btn.dataset.taskId;
      const [task, users] = await Promise.all([
        import('../../services/api.js').then(m => m.getTaskById(taskId)),
        getUsers(),
      ]);
      openTaskModal(task, users);
    });
  });

  document.querySelectorAll('.btn-delete-task').forEach(btn => {
    btn.addEventListener('click', async () => {
      const taskId = btn.dataset.taskId;
      openModal({
        title: 'Delete Task',
        bodyHTML: '<p class="font-body-md text-body-md text-on-surface-variant">Are you sure you want to delete this task? This action cannot be undone.</p>',
        confirmLabel: 'Delete',
        confirmClass: '!bg-error',
        onConfirm: async () => {
          await deleteTask(taskId);
          closeModal();
          await populateBoard();
          bindCardActions();
        },
      });
    });
  });
}

/** Mount function called by board.js when switching to kanban view */
export async function mountKanbanView() {
  await populateBoard();

  // "New Task" button (header, admin only)
  const btnCreate = document.getElementById('btn-create-task');
  if (btnCreate) {
    btnCreate.addEventListener('click', async () => {
      const users = await getUsers();
      openTaskModal(null, users, 'todo');
    });
  }

  // "+" button on the Todo column header (admin only)
  document.querySelectorAll('.btn-add-task').forEach(btn => {
    btn.addEventListener('click', async () => {
      const users = await getUsers();
      openTaskModal(null, users, 'todo');
    });
  });
}
