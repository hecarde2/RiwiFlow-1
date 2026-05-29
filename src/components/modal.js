/**
 * modal.js
 * Componente modal genérico.
 *
 * Uso:
 * openModal({
 *   title,
 *   bodyHTML,
 *   onConfirm
 * })
 *
 * closeModal()
 */

/**
 * Abre un modal dinámico
 *
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.bodyHTML
 * @param {Function} options.onConfirm
 * @param {string} options.confirmLabel
 * @param {string} options.confirmClass
 */
export function openModal({
  title,
  bodyHTML,
  onConfirm,
  confirmLabel = 'Save',
  confirmClass = '',
}) {

  // Contenedor principal del modal
  const container =
    document.getElementById('modal-container');

  /**
   * Inserta estructura HTML del modal
   */
  container.innerHTML = `
    <div id="modal-overlay"
         class="modal-overlay fixed inset-0 z-50 bg-black/40
                flex items-center justify-center p-md">

      <div class="bg-surface-container-lowest border border-outline-variant
                  rounded-xl shadow-xl w-full max-w-md
                  transform transition-all duration-200
                  scale-95 opacity-0"

           id="modal-box">

        <!-- Header -->
        <header class="flex items-center justify-between
                       px-lg py-md border-b border-outline-variant">

          <h2 class="font-headline-md text-headline-md text-on-surface">
            ${title}
          </h2>

          <button id="modal-close"
                  class="p-1 rounded-lg hover:bg-surface-container-high
                         transition-colors">

            <span class="material-symbols-outlined text-outline">
              close
            </span>
          </button>
        </header>

        <!-- Body -->
        <div class="p-lg space-y-md" id="modal-body">
          ${bodyHTML}
        </div>

        <!-- Footer -->
        <footer class="flex justify-end gap-sm
                       px-lg py-md border-t border-outline-variant">

          <!-- Botón cancelar -->
          <button id="modal-cancel"

            class="px-lg py-sm rounded-lg
                   border border-outline-variant
                   font-label-md text-label-md
                   text-on-surface-variant
                   hover:bg-surface-container-low
                   transition-colors">

            Cancel
          </button>

          <!-- Botón confirmar -->
          <button id="modal-confirm"

            class="px-lg py-sm rounded-lg
                   bg-primary text-on-primary
                   font-label-md text-label-md
                   hover:brightness-110
                   active:scale-[0.98]
                   transition-all
                   ${confirmClass}">

            ${confirmLabel}
          </button>
        </footer>
      </div>
    </div>`;

  /**
   * Animación de entrada
   */
  requestAnimationFrame(() => {

    const box =
      document.getElementById('modal-box');

    box.classList.remove(
      'scale-95',
      'opacity-0'
    );

    box.classList.add(
      'scale-100',
      'opacity-100'
    );
  });

  /**
   * Evento botón cerrar
   */
  document
    .getElementById('modal-close')
    .addEventListener('click', closeModal);

  /**
   * Evento botón cancelar
   */
  document
    .getElementById('modal-cancel')
    .addEventListener('click', closeModal);

  /**
   * Cierra modal al hacer click
   * fuera del cuadro
   */
  document
    .getElementById('modal-overlay')
    .addEventListener('click', (e) => {

      if (e.target.id === 'modal-overlay') {

        closeModal();
      }
    });

  /**
   * Evento confirmar
   */
  if (onConfirm) {

    document
      .getElementById('modal-confirm')
      .addEventListener('click', () => {

        onConfirm();
      });
  }
}

/**
 * Cierra el modal
 */
export function closeModal() {

  const container =
    document.getElementById('modal-container');

  const box =
    document.getElementById('modal-box');

  // Si no existe modal, salir
  if (!box) return;

  /**
   * Animación de salida
   */
  box.classList.add(
    'scale-95',
    'opacity-0'
  );

  /**
   * Elimina HTML luego de animación
   */
  setTimeout(() => {

    container.innerHTML = '';

  }, 200);
}