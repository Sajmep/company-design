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

  // Image Preview Modal Functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  const imagePreviewModal = document.getElementById('imagePreviewModal');
  const previewImage = document.getElementById('previewImage');

  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img) {
        const imageSrc = img.src;
        const imageAlt = img.alt || 'Gallery Image';
        
        // Set the image source and alt text
        previewImage.src = imageSrc;
        previewImage.alt = imageAlt;
        
        // Show the modal
        imagePreviewModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  // Close modal when clicking outside the modal content
  imagePreviewModal.addEventListener('click', function(e) {
    if (e.target === imagePreviewModal) {
      closeImagePreviewModal();
    }
  });

});

// Function to close the image preview modal
function closeImagePreviewModal() {
  const imagePreviewModal = document.getElementById('imagePreviewModal');
  imagePreviewModal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore background scrolling
}

// Placeholder functions for arrow navigation (no logic implemented)
function previousImage() {
  // Placeholder for previous image logic
  console.log('Previous image clicked');
}

function nextImage() {
  // Placeholder for next image logic
  console.log('Next image clicked');
}
