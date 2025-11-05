// Panorama Preview Page Script
// Simple functions for navigation and sidebar toggle

// Go back to previous page
function goBack() {
    window.history.back();
}

// Toggle sidebar open/close
function toggleSidebar() {
    const sidebar = document.getElementById('panoramaSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        // Toggle active class
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Load panorama image from URL parameters
document.addEventListener('DOMContentLoaded', function() {
    // Get image URL from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('image');
    
    // Set the panorama image
    const panoramaImage = document.getElementById('panoramaImage');
    if (panoramaImage && imageUrl) {
        panoramaImage.src = imageUrl;
    }
});

