// Image Preview Modal
const modal = document.getElementById('imagePreviewModal');
const closeBtn = document.getElementById('closeImageModal');
const toggleActionsBtn = document.getElementById('toggleActionsColumn');
const actionsColumn = document.getElementById('actionsColumn');

function openImageModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Close actions column when modal closes
    if (actionsColumn) {
        actionsColumn.classList.remove('active');
    }
}

function toggleActionsColumn() {
    if (actionsColumn) {
        actionsColumn.classList.toggle('active');
    }
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
    if (e.target === modal || e.target.classList.contains('gallery-image-preview-modal-overlay')) {
        closeImageModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeImageModal();
    }
});

// Toggle actions column
if (toggleActionsBtn && actionsColumn) {
    toggleActionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleActionsColumn();
    });

    // Close actions column when clicking on overlay
    actionsColumn.addEventListener('click', (e) => {
        if (e.target === actionsColumn || e.target.classList.contains('gallery-modal-actions-column')) {
            actionsColumn.classList.remove('active');
        }
    });

    // Close actions column when clicking outside (on the overlay pseudo-element)
    document.addEventListener('click', (e) => {
        if (actionsColumn.classList.contains('active') && 
            !actionsColumn.contains(e.target) && 
            e.target !== toggleActionsBtn) {
            actionsColumn.classList.remove('active');
        }
    });
}

