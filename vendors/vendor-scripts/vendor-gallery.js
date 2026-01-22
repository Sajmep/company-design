// Gallery Tab Switching
document.addEventListener('DOMContentLoaded', function() {
  const galleryTabButtons = document.querySelectorAll('.gallery-tab-btn');
  const galleryTabContents = document.querySelectorAll('.gallery-tab-content');

  function hideAllGalleryTabContents() {
    galleryTabContents.forEach(content => {
      content.classList.remove('active');
    });
  }

  function deactivateAllGalleryTabButtons() {
    galleryTabButtons.forEach(button => {
      button.classList.remove('active');
    });
  }

  galleryTabButtons.forEach(button => {
    button.addEventListener('click', function() {
      deactivateAllGalleryTabButtons();
      this.classList.add('active');

      hideAllGalleryTabContents();
      const targetTabId = this.getAttribute('data-gallery-tab');
      const targetTabContent = document.getElementById('gallery-' + targetTabId);
      if (targetTabContent) {
        targetTabContent.classList.add('active');
      }
    });
  });

  // Show the default active tab on load
  const activeGalleryTabButton = document.querySelector('.gallery-tab-btn.active');
  if (activeGalleryTabButton) {
    const targetTabId = activeGalleryTabButton.getAttribute('data-gallery-tab');
    const targetTabContent = document.getElementById('gallery-' + targetTabId);
    if (targetTabContent) {
      targetTabContent.classList.add('active');
    }
  }

});
