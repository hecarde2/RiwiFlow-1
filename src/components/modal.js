/**
 * modal.js
 * Generic modal component.
 * Usage: openModal({ title, bodyHTML, onConfirm })
 *        closeModal()
 */

export function openModal({ title, bodyHTML, onConfirm, confirmLabel = 'Save', confirmClass = '' }) {
  const container = document.getElementById('modal-container');

  container.innerHTML = `
    <div id="modal-overlay"
         class="modal-overlay fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-md">
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-md
                  transform transition-all duration-200 scale-95 opacity-0" id="modal-box">
        <header class="flex items-center justify-between px-lg py-md border-b border-outline-variant">
          <h2 class="font-headline-md text-headline-md text-on-surface">${title}</h2>
          <button id="modal-close" class="p-1 rounded-lg hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined text-outline">close</span>
          </button>
        </header>
        <div class="p-lg space-y-md" id="modal-body">
          ${bodyHTML}
        </div>
        <footer class="flex justify-end gap-sm px-lg py-md border-t border-outline-variant">
          <button id="modal-cancel"
            class="px-lg py-sm rounded-lg border border-outline-variant font-label-md text-label-md
                   text-on-surface-variant hover:bg-surface-container-low transition-colors">
            Cancel
          </button>
          <button id="modal-confirm"
            class="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md
                   hover:brightness-110 active:scale-[0.98] transition-all ${confirmClass}">
            ${confirmLabel}
          </button>
        </footer>
      </div>
    </div>`;

  // Animate in
  requestAnimationFrame(() => {
    const box = document.getElementById('modal-box');
    box.classList.remove('scale-95', 'opacity-0');
    box.classList.add('scale-100', 'opacity-100');
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  if (onConfirm) {
    document.getElementById('modal-confirm').addEventListener('click', () => {
      onConfirm();
    });
  }
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  const box = document.getElementById('modal-box');
  if (!box) return;
  box.classList.add('scale-95', 'opacity-0');
  setTimeout(() => { container.innerHTML = ''; }, 200);
}
