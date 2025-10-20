// Minimal JS to open/close album modal with static images
document.addEventListener('DOMContentLoaded', function () {
  const albumCards = document.querySelectorAll('.album-card');
  const albumModal = document.getElementById('albumModal');
  const albumModalClose = document.getElementById('albumModalClose');
  const albumModalBackdrop = document.getElementById('albumModalBackdrop');

  function openAlbumModal() {
    if (albumModal) {
      albumModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAlbumModal() {
    if (albumModal) {
      albumModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  albumCards.forEach(card => {
    card.addEventListener('click', openAlbumModal);
  });

  if (albumModalClose) albumModalClose.addEventListener('click', closeAlbumModal);
  if (albumModalBackdrop) albumModalBackdrop.addEventListener('click', closeAlbumModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAlbumModal();
  });
});

// Media Tab Functionality
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.media-tab');
    const contents = document.querySelectorAll('.media-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});