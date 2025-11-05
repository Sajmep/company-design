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

