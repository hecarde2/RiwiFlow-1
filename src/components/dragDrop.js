/**
 * dragDrop.js
 * Implements the HTML5 Drag & Drop API for the Kanban board.
 * When a card is dropped in a new column, it calls the provided
 * onStatusChange(taskId, newStatus) callback to persist the change.
 */

let draggedCard = null;
let draggedTaskId = null;

/**
 * Initialises drag-and-drop on all task cards and column drop zones.
 * @param {Function} onStatusChange - async (taskId, newStatus) => void
 */
export function initDragDrop(onStatusChange) {
  // Bind drag events to all cards
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });

  // Bind drop zone events to all columns
  document.querySelectorAll('.column-drop-zone').forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', (e) => handleDrop(e, onStatusChange));
  });
}

function handleDragStart(e) {
  draggedCard = e.currentTarget;
  draggedTaskId = draggedCard.dataset.taskId;
  draggedCard.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedTaskId);
}

function handleDragEnd() {
  if (draggedCard) draggedCard.classList.remove('dragging');
  document.querySelectorAll('.column-drop-zone').forEach(z => {
    z.classList.remove('drag-over');
  });
  draggedCard = null;
  draggedTaskId = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  // Only remove if leaving the zone itself, not a child
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
}

async function handleDrop(e, onStatusChange) {
  e.preventDefault();
  const zone = e.currentTarget;
  zone.classList.remove('drag-over');

  const taskId = e.dataTransfer.getData('text/plain');
  const newStatus = zone.dataset.status;

  if (!taskId || !newStatus) return;

  // If same column, do nothing
  const originalCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (originalCard && originalCard.dataset.status === newStatus) return;

  await onStatusChange(taskId, newStatus);
}
