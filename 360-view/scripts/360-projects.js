// 360 Projects Page Script

// Create Project Modal Functions
function openCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        const form = document.getElementById('createProjectForm');
        if (form) {
            form.reset();
        }
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('createProjectModal');
    const modalContent = modal ? modal.querySelector('.project-360-modal-content') : null;
    
    if (modal && modalContent) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCreateProjectModal();
            }
        });
    }

});



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
                const previewUrl = 'preview-360.html?image=' + encodeURIComponent(projectImage);
                window.location.href = previewUrl;
            }
        });
    });
});

// Handles edit button clicks

document.addEventListener('DOMContentLoaded', function() {
    // Get all edit buttons
    const editButtons = document.querySelectorAll('.card-360-action-btn[title="Edit"]');
    
    // Add click event to each edit button
    editButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Prevent default button behavior
            e.stopPropagation();
            
            // Find the parent card
            const card = this.closest('.bmh-card-360');
            if (!card) return;
            
            // Get project image from the card
            const projectImageElement = card.querySelector('.card-360-image-container img');
            const projectImage = projectImageElement ? projectImageElement.src : '';
            
            // Get project name from the card
            const projectNameElement = card.querySelector('.card-360-title');
            const projectName = projectNameElement ? projectNameElement.textContent.trim() : '';
            
            // Navigate to edit page with image URL and project name
            if (projectImage) {
                let editUrl = 'edit-360.html?image=' + encodeURIComponent(projectImage);
                if (projectName) {
                    editUrl += '&name=' + encodeURIComponent(projectName);
                }
                window.location.href = editUrl;
            }
        });
    });
});

