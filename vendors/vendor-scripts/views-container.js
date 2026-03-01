// Views Container - View Switching
// Expose showView so toolbar dropdown (switchView) can show/hide the correct view
function showView(viewType) {
    const dashboardView = document.querySelector('.bmh-dashboard-view');
    const cardView = document.querySelector('.bmh-card-view');
    const listView = document.querySelector('.bmh-list-view');
    const calendarView = document.querySelector('.bmh-calendar-view');
    const mapView = document.querySelector('.bmh-map-view');

    if (dashboardView) dashboardView.style.display = 'none';
    if (cardView) cardView.style.display = 'none';
    if (listView) listView.style.display = 'none';
    if (calendarView) calendarView.style.display = 'none';
    if (mapView) mapView.style.display = 'none';

    switch (viewType) {
        case 'dashboard':
            if (dashboardView) dashboardView.style.display = 'block';
            break;
        case 'card':
            if (cardView) cardView.style.display = 'flex';
            break;
        case 'list':
            if (listView) listView.style.display = 'flex';
            break;
        case 'calendar':
            if (calendarView) calendarView.style.display = 'block';
            break;
        case 'map':
            if (mapView) mapView.style.display = 'flex';
            if (typeof initializeMap === 'function') initializeMap();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const dashboardView = document.querySelector('.bmh-dashboard-view');
    const cardView = document.querySelector('.bmh-card-view');
    const listView = document.querySelector('.bmh-list-view');
    const calendarView = document.querySelector('.bmh-calendar-view');
    const mapView = document.querySelector('.bmh-map-view');

    // Show card view by default (matches dropdown "Card View" active state)
    showView('card');
});

// Vendor Popup Functions
function openVendorPopup() {
    const sidebar = document.getElementById('vendorPopup');
    const overlay = document.getElementById('vendorSidebarOverlay');
    
    if (sidebar && overlay) {
        overlay.classList.add('active');
        sidebar.classList.add('active');
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = 'hidden';
    }
}

function closeVendorPopup() {
    const sidebar = document.getElementById('vendorPopup');
    const overlay = document.getElementById('vendorSidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        // Delay overlay removal to match sidebar animation
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 300);
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Close vendor sidebar when clicking on overlay
document.addEventListener('click', function(event) {
    const overlay = document.getElementById('vendorSidebarOverlay');
    if (event.target === overlay) {
        closeVendorPopup();
    }
});

// Close vendor sidebar with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const sidebar = document.getElementById('vendorPopup');
        if (sidebar && sidebar.classList.contains('active')) {
            closeVendorPopup();
        }
    }
});



