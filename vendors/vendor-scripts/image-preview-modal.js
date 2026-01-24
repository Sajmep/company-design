document.addEventListener('DOMContentLoaded', () => {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    // Image preview modal
    const modal = $('#imagePreviewModal');
    const closeBtn = $('#closeImageModal');
    const toggleActionsBtn = $('#toggleActionsColumn');
    const actionsColumn = $('#actionsColumn');

    const setModalOpen = (open) => {
        if (!modal) return;
        modal.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : 'auto';
        if (!open && actionsColumn) actionsColumn.classList.remove('active');
    };

    // Open modal by clicking any gallery/album card (but ignore comment/report/buttons/links)
    document.addEventListener('click', (e) => {
        const t = e.target;

        if (t.closest('.gallery-comment-btn, .gallery-report-btn, .gallery-action-btn, a')) return;

        // close modal on overlay click
        if (t === modal || t.closest('.gallery-image-preview-modal-overlay')) {
            setModalOpen(false);
            return;
        }

        // close actions column when clicking outside it
        if (actionsColumn?.classList.contains('active') && !t.closest('#actionsColumn') && t !== toggleActionsBtn) {
            actionsColumn.classList.remove('active');
        }

        // open modal on item click
        if (t.closest('.gallery-item, .album-item')) setModalOpen(true);
    });

    closeBtn?.addEventListener('click', () => setModalOpen(false));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setModalOpen(false);
    });

    toggleActionsBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        actionsColumn?.classList.toggle('active');
    });

    // Album image preview (inside the modal) - open/close only
    const albumImagePreview = $('#albumImagePreview');
    const albumPreviewImg = $('.gallery-album-preview-img', albumImagePreview || undefined);
    const albumPreviewClose = $('.gallery-album-preview-close', albumImagePreview || undefined);
    const albumPreviewDots = $('#albumPreviewDots');
    const albumImages = $$('.album-image-clickable');

    // Create static dots for design (no interaction)
    if (albumPreviewDots && albumImages.length > 0) {
        albumImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            albumPreviewDots.appendChild(dot);
        });
    }

    const setAlbumPreviewOpen = (open, src = '') => {
        if (!albumImagePreview || !albumPreviewImg) return;
        if (open && src) {
            albumPreviewImg.src = src;
        }
        albumImagePreview.classList.toggle('active', open);
    };

    $$('.album-image-clickable').forEach((img) => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            setAlbumPreviewOpen(true, img.src);
        });
    });

    albumPreviewClose?.addEventListener('click', (e) => {
        e.stopPropagation();
        setAlbumPreviewOpen(false);
    });

    albumImagePreview?.addEventListener('click', (e) => {
        if (e.target === albumImagePreview) setAlbumPreviewOpen(false);
    });
});
