// Image Preview Modal
const modal = document.getElementById('imagePreviewModal');
const closeBtn = document.getElementById('closeImageModal');

function openImageModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Open modal on gallery card click
document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.gallery-action-btn')) {
            openImageModal();
        }
    });
});

// Close modal
closeBtn.addEventListener('click', closeImageModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('image-preview-modal-overlay')) {
        closeImageModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeImageModal();
    }
});

