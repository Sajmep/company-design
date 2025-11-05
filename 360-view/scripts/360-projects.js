// 360 Projects Page Script
// Handles preview button clicks

document.addEventListener('DOMContentLoaded', function() {
    // Get all preview buttons
    const previewButtons = document.querySelectorAll('.card-360-action-btn[title="Preview"]');
    
    // Add click event to each preview button
    previewButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Prevent default button behavior
            e.stopPropagation();
            
            // Find the parent card
            const card = this.closest('.bmh-card-360');
            if (!card) return;
            
            // Get project image from the card
            const projectImageElement = card.querySelector('.card-360-image-container img');
            const projectImage = projectImageElement ? projectImageElement.src : '';
            
            // Navigate to preview page with image URL
            if (projectImage) {
                const previewUrl = '360-project-view.html?image=' + encodeURIComponent(projectImage);
                window.location.href = previewUrl;
            }
        });
    });
});

