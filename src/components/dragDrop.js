/**
 * dragDrop.js
 * Implementa la API HTML5 de Drag & Drop para el tablero Kanban.
 * Cuando una tarjeta se suelta en una nueva columna,
 * llama al callback proporcionado
 * onStatusChange(taskId, newStatus) para guardar el cambio.
 */

let draggedCard = null;
let draggedTaskId = null;

/**
 * Inicializa el sistema de arrastrar y soltar
 * en todas las tarjetas y zonas de columnas.
 * @param {Function} onStatusChange - async (taskId, newStatus) => void
 */
export function initDragDrop(onStatusChange) {

  // Asignar eventos de arrastre a todas las tarjetas
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });

  // Asignar eventos de zona de soltado a todas las columnas
  document.querySelectorAll('.column-drop-zone').forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', (e) => handleDrop(e, onStatusChange));
  });
}

function handleDragStart(e) {

  // Guardar la tarjeta que se está arrastrando
  draggedCard = e.currentTarget;

  // Obtener el ID de la tarea desde el dataset
  draggedTaskId = draggedCard.dataset.taskId;

  // Agregar clase visual mientras se arrastra
  draggedCard.classList.add('dragging');

  // Indicar que el movimiento es de tipo "move"
  e.dataTransfer.effectAllowed = 'move';

  // Guardar el ID de la tarea en el drag
  e.dataTransfer.setData('text/plain', draggedTaskId);
}

function handleDragEnd() {

  // Remover estilos de arrastre
  if (draggedCard) draggedCard.classList.remove('dragging');

  // Limpiar estilos de todas las zonas
  document.querySelectorAll('.column-drop-zone').forEach(z => {
    z.classList.remove('drag-over');
  });

  // Reiniciar variables
  draggedCard = null;
  draggedTaskId = null;
}

function handleDragOver(e) {

  // Permitir el drop
  e.preventDefault();

  // Mostrar efecto visual de movimiento
  e.dataTransfer.dropEffect = 'move';

  // Agregar clase visual a la zona
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {

  // Solo quitar la clase si realmente salió de la zona
  // y no de un elemento hijo
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
}

async function handleDrop(e, onStatusChange) {

  // Evitar comportamiento por defecto
  e.preventDefault();

  const zone = e.currentTarget;

  // Quitar estilo visual de la zona
  zone.classList.remove('drag-over');

  // Obtener ID de la tarea arrastrada
  const taskId = e.dataTransfer.getData('text/plain');

  // Obtener el nuevo estado desde el dataset
  const newStatus = zone.dataset.status;

  // Validar datos
  if (!taskId || !newStatus) return;

  // Si la tarea se soltó en la misma columna, no hacer nada
  const originalCard = document.querySelector(
    `.task-card[data-task-id="${taskId}"]`
  );

  if (originalCard && originalCard.dataset.status === newStatus) return;

  // Actualizar el estado de la tarea
  await onStatusChange(taskId, newStatus);
}