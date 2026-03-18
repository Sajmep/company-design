// Add Project Offcanvas - minimal
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.bmh-offcanvas-wrapper');
  document.getElementById('addProjectBtn')?.addEventListener('click', () => wrapper?.classList.add('is-open'));
  wrapper?.addEventListener('click', (e) => {
    if (e.target.classList.contains('bmh-offcanvas-backdrop') || e.target.closest('.bmh-offcanvas_close'))
      wrapper.classList.remove('is-open');
  });

  // Albums modal - very minimal
  const albumsModal = document.getElementById('projectAlbumsModal');
  const openAlbumsBtn = document.querySelector('[data-open-albums]');

  const setAlbumsOpen = (isOpen) => {
    if (!albumsModal) return;
    albumsModal.classList.toggle('is-open', isOpen);
  };

  openAlbumsBtn?.addEventListener('click', () => setAlbumsOpen(true));
  albumsModal?.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-albums]')) setAlbumsOpen(false);
  });

  // Area tables "Add a line" modal - very minimal
  const areaLineModal = document.getElementById('projectAreaLineModal');
  const areaLineTitle = document.getElementById('projectAreaLineModalTitle');

  const setAreaLineOpen = (isOpen) => {
    if (!areaLineModal) return;
    areaLineModal.classList.toggle('is-open', isOpen);
  };

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-area-line]');
    if (openBtn) {
      if (areaLineTitle) {
        const kind = openBtn.getAttribute('data-area-kind') || 'Line';
        areaLineTitle.textContent = `Add ${kind}`;
      }
      setAreaLineOpen(true);
      return;
    }

    if (e.target.closest('[data-close-area-line]')) setAreaLineOpen(false);
  });

  // "Add to workspace" modal - very minimal
  const workspaceModal = document.getElementById('projectWorkspaceModal');
  const setWorkspaceOpen = (isOpen) => {
    if (!workspaceModal) return;
    workspaceModal.classList.toggle('is-open', isOpen);
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-workspace]')) {
      setWorkspaceOpen(true);
      return;
    }
    if (e.target.closest('[data-close-workspace]')) setWorkspaceOpen(false);
  });
});
